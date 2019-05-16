import { Component, OnInit, Inject } from '@angular/core';
import {
  AuthService, IStaff, JQUERY_TOKEN, ProfileService, ILineManager, IBranch, IRole,
  FormSubmissionService, TOASTR_TOKEN, IToastr, OvertimeService
} from 'src/app/shared';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentStaff: IStaff

  // edit mode toggle; Also used to display edit icon buttons
  editMode: string = 'none';

  // modal controls
  modalTitle: string
  currentModal: string
  displayModal: string = 'none';
  displaySpinner: boolean = false;
  imageModal: boolean = false;
  nameModal: boolean = false;
  emailModal: boolean = false;
  phoneModal: boolean = false;
  branchModal: boolean = false;
  roleModal: boolean = false;
  supervisorModal: boolean = false;
  bsmModal: boolean = false;

  // dropdown controls
  roleDropdown: boolean = false;
  branchDropdown: boolean = false;
  supervisorDropdown: boolean = false;
  bsmDropdown: boolean = false;

  // profile info data
  firstname: string
  lastname: string
  email: string
  position: string
  branch: string
  supervisorFirstName: string
  supervisorLastName: string
  supervisorEmailAddress: string
  bsmFirstName: string
  bsmLastName: string
  bsmEmailAddress: string

  // image
  imagePreview: any
  imageFile: any

  // hidden input controls
  roleId
  branchId

  lineManagers: ILineManager[] = [];
  branches: IBranch[] = [];
  roles: IRole[] = [];
  
  filteredbranches: IBranch[] = [];
  filteredlineManagers: ILineManager[] = [];

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private overtimeService: OvertimeService,
    private formSubmissionService: FormSubmissionService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  async ngOnInit() {
    await this.initialiseData();
  }

  async initialiseData() {
    this.currentStaff = this.authService.currentStaff;
    
    this.firstname = this.authService.currentStaff.firstname;
    this.lastname = this.authService.currentStaff.lastname;
    this.email = this.authService.currentStaff.emailAddress;
    this.position = this.authService.currentStaff.role;
    this.branch = this.authService.currentStaff.branch;
    this.supervisorFirstName = this.authService.currentStaff.supervisorFirstName;
    this.supervisorLastName = this.authService.currentStaff.supervisorLastName;
    this.supervisorEmailAddress = this.authService.currentStaff.supervisorEmailAddress;
    this.bsmFirstName = this.authService.currentStaff.bsmFirstName;
    this.bsmLastName = this.authService.currentStaff.bsmLastName;
    this.bsmEmailAddress = this.authService.currentStaff.bsmEmailAddress;

    const { lineManagers, branches, roles } = await this.profileService.fetchProfileData();
    this.lineManagers = lineManagers;
    this.branches = branches;
    this.roles = roles;
  }

  async syncStaffData() {
    const staffData = await this.authService.fetchStaffProfile();
    this.currentStaff = staffData.data;
  }

  runModalDisplay(modal, title) {
    this.modalTitle = title;
    this.displayModal = 'block';
    this.currentModal = modal;
    this[modal] = true;
  }

  closeModal(modal) {
    this.displayModal = 'none';
    this[modal] = false;
  }

  triggerFileInput() {
    this.jQuery('#fileInput').click();
  }

  toggleEditMode() {
    if (this.editMode === 'none') {
      this.editMode = 'block';
      this.jQuery('#knob').css('left', '63.5%');
      this.jQuery('#on').css('opacity', '1');
      this.jQuery('#off').css('opacity', '0');
      this.jQuery('#switch').css('background-color', '#5CA1FF');
    } else {
      this.editMode = 'none';
      this.jQuery('#knob').css('left', '3.5%');
      this.jQuery('#on').css('opacity', '0');
      this.jQuery('#off').css('opacity', '1');
      this.jQuery('#switch').css('background-color', '#ACACAC');
    }
    this.jQuery('.edit-icon').css('display', this.editMode);
  }

  transformImage(imageUrl) {
    const urlFragments = imageUrl.split('upload');
    return `${urlFragments[0]}upload/c_fill,g_face,h_400,r_max,w_400${urlFragments[1]}`;
  }

  handleSelect(field, fieldValue) {
    if (fieldValue.name) {
      // for role and branch
      this.currentStaff[field] = fieldValue.name; // update currently display profile info
      this[`${field}Id`] = fieldValue.id; // update hidden input field
      if (field === 'branch') {
        this.jQuery('#decoy-input').text(fieldValue.name);
      }
    } else {
      // for line managers
      this.currentStaff[`${field}FirstName`] = fieldValue.firstname;
      this.currentStaff[`${field}LastName`] = fieldValue.lastname;
      this.currentStaff[`${field}EmailAddress`] = fieldValue.email;

      // update modal form
      this[`${field}FirstName`] = fieldValue.firstname;
      this[`${field}LastName`] = fieldValue.lastname;
      this[`${field}EmailAddress`] = fieldValue.email;
    }
    this[`${field}Dropdown`] = false; // hide dropdown
  }

  handleInput(value, arrayProp, field) {
    this[`${field}Dropdown`] = true;
    this[`filtered${arrayProp}`] = this.filterArray(value, arrayProp);
  }

  filterArray(value, arrayProp) {
    return this[arrayProp].filter((item) => {
      if (item.name) {
        return item.name.toLowerCase().includes(value.toLowerCase());
      }
      return item.email.includes(value.toLowerCase());
    });
  }

  handleImagePreview(e) {
    this.imageFile = e.target.files[0];
    const reader = new FileReader(); //eslint-disable-line
    reader.readAsDataURL(this.imageFile);
    reader.addEventListener('load', () => {
      this.imagePreview = reader.result
    });
  }

  async handleSubmit(formValues, currentModal) {
    const updateMethod = this.formSubmissionService.getUpdateMethod(currentModal);
    const formData = currentModal === 'imageModal'
      ? this.formSubmissionService.imageSubmit(this.imageFile)
      : this.formSubmissionService.profileInfoSubmit(formValues);
  
    if (formData.errors.length) return formData.errors.forEach(error => this.toastr.error(error));
          
    if (['supervisorModal', 'bsmModal'].includes(currentModal)) {
      formData.data.lineManagerRole = this.formSubmissionService.addLineManagerRole(currentModal);
    }

    try {
      const { message } = await this.profileService[updateMethod](formData.data);
      this.toastr.success(message);
      
      await this.profileService.syncWithAPI();
      await this.overtimeService.syncWithAPI();
      await this.initialiseData();

      this.displayModal = 'none';
      this[currentModal] = false;
      this.displaySpinner = false;
    } catch (e) {
      this.toastr.error('An error occurred');
    }
  }
}
