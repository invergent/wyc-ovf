import { Component, OnInit, Inject } from '@angular/core';
import { ProfileService, IStaffForAdmin, TOASTR_TOKEN, IToastr, JQUERY_TOKEN, FormSubmissionService } from '../../shared';

@Component({
  selector: 'app-admin-staff',
  templateUrl: './admin-staff.component.html',
  styleUrls: ['./admin-staff.component.scss']
})
export class AdminStaffComponent implements OnInit {
  staffList: IStaffForAdmin[] = [];
  visibleStaffList: IStaffForAdmin[] = []
  currentPageStaffList: IStaffForAdmin[] = []
  staffPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number
  
  // modal controls
  modalTitle: string
  currentModal: string
  displayModal: string = 'none';
  displaySpinner: boolean = false;

  bulkModal: boolean = false;
  singleModal: boolean = false;
  excelFile: any

  // input controls
  fileInvalid: boolean = true

  constructor(
    private profileService: ProfileService,
    private formSubmissionService: FormSubmissionService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  async ngOnInit() {
    await this.initialiseData();
  }

  async initialiseData() {
    const { staffList } = await this.profileService.fetchProfileData();
    this.staffList = staffList.slice(0);
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
      const { firstname, lastname, emailAddress } = staff;
      return (
        firstname.toLowerCase().includes(filterQuery)
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

  async handleSubmit(formValues, currentModal) {
    const updateMethod = this.formSubmissionService.getUpdateMethod(currentModal);
    const submissionData = currentModal === 'bulkModal'
      ? this.formSubmissionService.fileSubmit('excelDoc', this.excelFile)
      : this.formSubmissionService.profileInfoSubmit(formValues);

    if (submissionData.errors.length) {
      this.displaySpinner = false;
      return submissionData.errors.forEach(error => this.toastr.error(error));
    }
    
    try {
      const { message } = await this.profileService[updateMethod](submissionData.data);
      this.toastr.success(message);

      await this.profileService.syncWithAPI();
      await this.initialiseData();

      this.displayModal = 'none';
      this[currentModal] = false;
      this.displaySpinner = false;
      this.fileInvalid = true;
    } catch (error) {
      this.displaySpinner = false;
      if(error.error) {
        const { error: { message, errors } } = error;
        if (errors) return errors.forEach(err => this.toastr.error(err));
        return this.toastr.error(message);
      }
      this.toastr.error('An error occurred. Please check your network connection');
    }
  }
}
