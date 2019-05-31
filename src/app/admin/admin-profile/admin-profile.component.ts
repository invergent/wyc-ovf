import { Component, OnInit, Inject } from '@angular/core';
import {
  IStaff, AuthService, ProfileService, OvertimeService, FormSubmissionService,
  TOASTR_TOKEN, IToastr, JQUERY_TOKEN
} from 'src/app/shared';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.scss']
})
export class AdminProfileComponent implements OnInit {
  currentStaff: IStaff
  autoDisplay: boolean

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

  // profile info data
  firstname: string
  lastname: string
  email: string

  // image
  imagePreview: any
  imageFile: any
  fileInvalid: boolean = true // used to disable button when invalid

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
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

  handleImagePreview(e) {
    this.fileInvalid = !e.value; // toggle disability of submit button based in file input value
    
    this.imageFile = e.files[0];
    const reader = new FileReader(); //eslint-disable-line
    reader.readAsDataURL(this.imageFile);
    reader.addEventListener('load', () => {
      this.imagePreview = reader.result
    });
  }

  async handleSubmit(formValues, currentModal) {
    const updateMethod = this.formSubmissionService.getUpdateMethod(currentModal);
    const formData = currentModal === 'imageModal'
      ? this.formSubmissionService.fileSubmit('image', this.imageFile)
      : this.formSubmissionService.profileInfoSubmit(formValues);
    
    if (formData.errors.length) return formData.errors.forEach(error => this.toastr.error(error));

    try {
      const { message } = await this.profileService[updateMethod](formData.data);
      this.toastr.success(message);
      
      await this.authService.syncWithAPI();
      await this.initialiseData();

      this.displayModal = 'none';
      this[currentModal] = false;
      this.displaySpinner = false;

    } catch (e) {
      this.toastr.error('An error occurred');
    }
  }
}
