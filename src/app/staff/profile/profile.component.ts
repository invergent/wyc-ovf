import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import {
  AuthService, IStaff, JQUERY_TOKEN, ProfileService, ILineManager, IBranch, IRole,
  FormSubmissionService, TOASTR_TOKEN, IToastr, OvertimeService, ProfileCheckerService, NotificationService
} from 'src/app/shared';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  currentStaff: IStaff
  firstTimeLogin
  pendingFields: string[]
  autoDisplay: boolean

  empoweringWords: string[] = ['Great', 'Awesome', 'Cool', 'Nice', 'Good', 'Perfect', 'Superb']

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
  lineManagerModal: boolean = false;
  accountDetailsModal: boolean = false;
  thanksModal: boolean = false;

  // dropdown controls
  roleDropdown: boolean = false;
  branchDropdown: boolean = false;
  lineManagerDropdown: boolean = false;

  // profile info data
  firstname: string
  lastname: string
  middlename: string
  email: string
  phone: string
  altPhone: string
  accountNumber: string
  position: string
  branch: string
  canUpdateBranch: boolean
  lineManagerIdNumber: string
  lineManagerFirstName: string
  lineManagerLastName: string
  lineManagerEmailAddress: string
  lineManagerPhone: string

  // image
  imagePreview: any
  imageFile: any
  fileInvalid: boolean = true // used to disable button when invalid

  // hidden input controls
  roleId
  branchId
  
  lineManagerId = null;
  selectedSupervisorName: string

  supervisorSelect
  supervisorSelectOptions

  lineManagers: ILineManager[] = [];
  branches: IBranch[] = [];
  roles: IRole[] = [];
  
  filteredbranches: IBranch[] = [];
  filteredlineManagers: ILineManager[] = [];

  countDown: number = 5;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private profileChecker: ProfileCheckerService,
    private profileService: ProfileService,
    private overtimeService: OvertimeService,
    private formSubmissionService: FormSubmissionService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  async ngOnInit() {
    await this.initialiseData();
    this.updatePendingField();
  }

  ngAfterViewInit() {
    this.firstTimeLogin = this.route.snapshot.queryParams['m'];
    this.autoDisplay = true;

    if (this.firstTimeLogin) {
      const message = this.firstTimeLogin === 'p-lm'
        ? 'Great job changing your password! Just a few more to go.'
        : 'You still have unfinished business.';

      this.displayFlashMessage(`${message} Let's make your profile 100%.`);
      // add close listener
      this.jQuery('#close').click(() => this.closeFlashMessage())
    }
  }

  updatePendingField() {
    this.pendingFields = this.profileChecker.getPendingFields()
  }

  displayFlashMessage(message) {
    this.jQuery('#f-message').text(message);
    this.jQuery('#close').text('Okay');
    setTimeout(() => this.jQuery('#flash-message').css({right: '15px', top: '150px', display: 'block', opacity: '1'}), 1500);
  }

  closeFlashMessage() {
    this.jQuery('#flash-message').css('opacity', '0')
    setTimeout(() => this.jQuery('#flash-message').css('display', 'none'), 500);

    if (this.autoDisplay) this.leadUserToNextField();
    this.autoDisplay = false; // just so leadusertonextfield is not called again
  }

  composeVerb(field) {
    switch (field) {
      case 'role':
        return 'select your Position';
      case 'phone':
      case 'accountNumber':
        return `fill in your ${field === 'phone' ? 'phone' : 'account'} number`;
      case 'branch':
      case 'lineManager':
        return `fill in ${field === 'branch' ? 'branch' : 'line manager'} details`;
      default:
        return '';
    }
  }

  leadUserToNextField() {
    this.updatePendingField();

    const randNum = Math.floor(Math.random() * this.empoweringWords.length);
    const verb = this.composeVerb(this.pendingFields[0]);

    if (this.pendingFields.length) return this.displayFlashMessage(`${this.empoweringWords[randNum]}! Now, ${verb}.`);
    this.runModalDisplay('thanksModal', '');

    setTimeout(() => {
      const countDown = setInterval(() => {
        this.countDown -= 1
        if(this.countDown <= 0) clearInterval(countDown); 
      }, 1000);
    }, 500);

    setTimeout(() => {
      this.notificationService.playAudio('/assets/audio/tada.mp3');
      this.jQuery('#welldone').click(() => this.router.navigate(['/logout'], { queryParams: { m: 'c' } }))
    }, 500);

    setTimeout(() => this.router.navigate(['/logout'], { queryParams: { m: 'c' } }), 7000);
  }

  async initialiseData() {
    this.currentStaff = this.authService.currentStaff;

    this.firstname = this.authService.currentStaff.firstname;
    this.lastname = this.authService.currentStaff.lastname;
    this.middlename = this.authService.currentStaff.middlename;
    this.email = this.authService.currentStaff.emailAddress;
    this.phone = this.authService.currentStaff.phone;
    this.altPhone = this.authService.currentStaff.altPhone;
    this.accountNumber = this.authService.currentStaff.accountNumber;
    this.position = this.authService.currentStaff.role;
    this.branch = this.authService.currentStaff.branch;
    this.canUpdateBranch = this.authService.currentStaff.canUpdateBranch;
    this.lineManagerIdNumber = this.authService.currentStaff.lineManagerIdNumber;
    this.lineManagerFirstName = this.authService.currentStaff.lineManagerFirstName;
    this.lineManagerLastName = this.authService.currentStaff.lineManagerLastName;
    this.lineManagerPhone = this.authService.currentStaff.lineManagerPhone;
    this.lineManagerEmailAddress = this.authService.currentStaff.lineManagerEmailAddress;

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
      this.jQuery('#switch').css('background-color', '#ec1e8d');
    } else {
      this.editMode = 'none';
      this.jQuery('#knob').css('left', '3.5%');
      this.jQuery('#on').css('opacity', '0');
      this.jQuery('#off').css('opacity', '1');
      this.jQuery('#switch').css('background-color', '#ACACAC');
    }
    this.jQuery('.edit-icon').css('display', this.editMode);
  }

  updateBranchFields(branch) {
    this.jQuery('#decoy-input').text(branch.name);
    if (branch.supervisors.length > 1) {
      this.supervisorSelectOptions = [{
          id: null,
          firstname: '--Select',
          lastname:  'Supervisor--'
        },
        ...branch.supervisors
      ];
    } else {
      this.supervisorSelectOptions = branch.supervisors;
      this.lineManagerId = branch.supervisors[0].id;
    }
    this.supervisorSelect = true;
  }

  handleSelect(field, fieldValue) {
    if (fieldValue.name) {
      // for role and branch
      this.currentStaff[field] = fieldValue.name; // update currently display profile info
      this[`${field}Id`] = fieldValue.id; // update hidden input field
      if (field === 'branch') {
        this.updateBranchFields(fieldValue);
      }
    } else {
      // for line managers
      this.currentStaff[`${field}FirstName`] = fieldValue.firstname;
      this.currentStaff[`${field}LastName`] = fieldValue.lastname;
      this.currentStaff[`${field}EmailAddress`] = fieldValue.email;

      // update modal form
      this[`${field}IdNumber`] = fieldValue.idNumber;
      this[`${field}FirstName`] = fieldValue.firstname;
      this[`${field}LastName`] = fieldValue.lastname;
      this[`${field}Phone`] = fieldValue.phone;
      this[`${field}EmailAddress`] = fieldValue.email;
    }
    this[`${field}Dropdown`] = false; // hide dropdown
  }

  handleInput(value, arrayProp, field) {
    this[`${field}Dropdown`] = true;
    this[`filtered${arrayProp}`] = this.filterArray(value, arrayProp);
    if (field === 'branch') {
      this.supervisorSelect = false; // reset supervisor select
      this.lineManagerId = null;
    } 
  }

  filterArray(value, arrayProp) {
    return this[arrayProp].filter((item) => {
      if (item.name) {
        const itemName = item.name.toLowerCase();
        return itemName.includes(value.toLowerCase()) && !itemName.includes('admin');
      }
      return item.idNumber.toLowerCase().includes(value.toLowerCase());
    });
  }

  handleImagePreview(e) {
    this.fileInvalid = !e.value; // toggle disability of submit button based in file input value
    
    this.imageFile = e.files[0];
    const reader = new FileReader(); //eslint-disable-line
    reader.readAsDataURL(this.imageFile);
    reader.addEventListener('load', () => {
      this.imagePreview = reader.result
    });
  }

  async requestBranchEditPermission() {
    try {
      const { message } = await this.profileService.requestBranchEditPermission();
      this.toastr.success(message);
      this.closeModal(this.currentModal);
    } catch (error) {
      this.toastr.error('An error occurred while sending permission request email');
      this.closeModal(this.currentModal);
    }
  }

  async handleSubmit(formValues, currentModal) {
    const updateMethod = this.formSubmissionService.getUpdateMethod(currentModal);
    const formData = currentModal === 'imageModal'
      ? this.formSubmissionService.fileSubmit('image', this.imageFile)
      : this.formSubmissionService.profileInfoSubmit(formValues);
    
    if (formData.errors.length) {
      this.displaySpinner = false;
      return formData.errors.forEach(error => this.toastr.error(error));
    }

    try {
      const { message } = await this.profileService[updateMethod](formData.data);
      this.toastr.success(message);
      
      await this.authService.syncWithAPI();
      await this.profileService.syncWithAPI();
      await this.overtimeService.syncWithAPI();
      await this.initialiseData();

      this.displayModal = 'none';
      this[currentModal] = false;
      this.displaySpinner = false;

      if (!!this.firstTimeLogin) this.leadUserToNextField();
    } catch (e) {
      this.toastr.error('An error occurred');
    }
  }
}
