import { Component, OnInit, Inject } from '@angular/core';
import { ProfileService, IStaffForAdmin, TOASTR_TOKEN, IToastr, JQUERY_TOKEN, FormSubmissionService } from '../../shared';

@Component({
  selector: 'app-admin-staff',
  templateUrl: './admin-staff.component.html',
  styleUrls: ['./admin-staff.component.scss']
})
export class AdminStaffComponent implements OnInit {
  staffList: IStaffForAdmin[] = [];
  visibleStaffList: IStaffForAdmin[] = [];
  currentPageStaffList: IStaffForAdmin[] = [];
  staffPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number
  
  // modal controls
  modalTitle: string
  currentModal: string
  displayModal: string = 'none';
  displaySpinner: boolean = false;
  displayFetchSpinner: boolean = true;

  bulkModal: boolean = false;
  singleModal: boolean = false;
  excelErrorModal: boolean = false;
  excelFile: any

  // input controls
  fileInvalid: boolean = true

  excelErrors;
  excelErrorsToDisplay;

  constructor(
    private profileService: ProfileService,
    private formSubmissionService: FormSubmissionService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  async ngOnInit() {
    await this.initialiseData();
    this.displayFetchSpinner = false;
  }

  async initialiseData() {
    const { staffList } = await this.profileService.fetchProfileData(true);
    this.staffList = [...staffList];
    this.visibleStaffList = this.staffList;
    this.calculatePagination(this.staffList);
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

  handleFiltering(query: string) {
    this.currentPage = 1; // reset current page
    const filterQuery = query.toLowerCase();
    this.visibleStaffList = this.staffList.filter((staff) => {
      const { firstname, lastname, emailAddress, staffId } = staff;
      return (
        staffId.toLowerCase().includes(filterQuery)
        || firstname.toLowerCase().includes(filterQuery)
        || lastname.toLowerCase().includes(filterQuery)
        || emailAddress.toLowerCase().includes(filterQuery)
      );
    });
    this.calculatePagination(this.visibleStaffList);
  }

  calculatePagination(staff) {    
    const numberofStaff = staff.length;
    this.totalPages = Math.ceil(numberofStaff / this.staffPerPage);
    
    const sliceStart = (this.currentPage - 1) * this.staffPerPage;
    const sliceEnd = (this.currentPage * this.staffPerPage);
    
    this.currentPageStaffList = staff.slice(sliceStart, sliceEnd);
  }

  prevPage() {
    this.currentPage -= 1;
    this.calculatePagination(this.visibleStaffList);
  }

  nextPage() {
    this.currentPage += 1;
    this.calculatePagination(this.visibleStaffList);
  }
  
  handleFileInput(fileInput) {
    this.fileInvalid = !fileInput.value;
    this.excelFile = fileInput.files[0];
  }

  checkForEmptyFields(formValues) {
    const invalidFields = Object.keys(formValues).reduce((acc, field) => {
      if((field !== 'middlename') && !formValues[field]) acc.push(`${field} is required`);
      return acc;
    }, []);

    if (invalidFields.length) {
      this.displaySpinner = false;
      invalidFields.forEach(error => this.toastr.error(error));
      return false; // do not execute codes below this function when called
    } else {
      return true // no errors, execute other codes below this function when called
    }
  }

  displayUploadErrors(currentModal) {
    this[currentModal] = false;
    this.modalTitle = 'Errors'
    this.excelErrorModal = true;
    this.currentModal = 'excelErrorModal';
  }

  async handleSubmit(formValues, currentModal) {
    const updateMethod = this.formSubmissionService.getUpdateMethod(currentModal);
    let submissionData
    
    if (currentModal === 'bulkModal') {
      submissionData = this.formSubmissionService.fileSubmit('doc', this.excelFile)
    } else {
      const valid = this.checkForEmptyFields(formValues);

      if (!valid) return;
      submissionData = this.formSubmissionService.profileInfoSubmit(formValues);
    }

    if (submissionData.errors.length) {
      this.displaySpinner = false;
      return submissionData.errors.forEach(error => this.toastr.error(error));
    }
    
    try {
      const { message } = await this.profileService[updateMethod](submissionData.data);
      this.toastr.success(message);

      await this.profileService.syncWithAPI(true);
      await this.initialiseData();

      this.displayModal = 'none';
      this[currentModal] = false;
      this.displaySpinner = false;
      this.fileInvalid = true;
    } catch (error) {
      this.displaySpinner = false;
      if(error.error) {
        const { error: { message, errors, rowsWithErrors } } = error;
        if (rowsWithErrors) {
          this.excelErrors = rowsWithErrors;
          this.excelErrorsToDisplay = rowsWithErrors.slice(0, 9);
          return this.displayUploadErrors(this.currentModal);
        }
        if (errors) return errors.forEach(err => this.toastr.error(err));
        return this.toastr.error(message);
      }
      this.toastr.error('An error occurred. Please check your network connection');
    }
  }
}
