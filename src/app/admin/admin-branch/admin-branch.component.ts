import { Component, OnInit, Inject } from '@angular/core';
import {
  ProfileService, FormSubmissionService, TOASTR_TOKEN, IToastr, JQUERY_TOKEN, IBranch
} from '../../shared';

@Component({
  selector: 'app-admin-branch',
  templateUrl: './admin-branch.component.html',
  styleUrls: ['./admin-branch.component.scss']
})
export class AdminBranchComponent implements OnInit {
  branches: IBranch[] = [];
  visibleBranches: IBranch[] = []
  currentPageBranches: IBranch[] = []
  branchesPerPage: number = 5;
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
    this.displayFetchSpinner = false;
  }

  async initialiseData() {
    const { branches } = await this.profileService.fetchProfileData();
    this.branches = branches.map(branch => {
      // truncate address if number of characters exceed 60
      if (branch.address.length > 60) {
        return { ...branch, address: `${branch.address.slice(0, 57)}...` }
      }
      return branch;
    });
    this.visibleBranches = this.branches;
    this.calculatePagination(this.branches);
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
    this.visibleBranches = this.branches.filter((staff) => {
      const { name, address } = staff;
      return (name.toLowerCase().includes(filterQuery) || address.toLowerCase().includes(filterQuery));
    });
    this.calculatePagination(this.visibleBranches);
  }

  calculatePagination(branches) {
    const numberofStaff = branches.length;
    this.totalPages = Math.ceil(numberofStaff / this.branchesPerPage);
    
    const sliceStart = (this.currentPage - 1) * this.branchesPerPage;
    const sliceEnd = (this.currentPage * this.branchesPerPage);
    
    this.currentPageBranches = branches.slice(sliceStart, sliceEnd);
  }

  prevPage() {
    this.currentPage -= 1;
    this.calculatePagination(this.visibleBranches);
  }

  nextPage() {
    this.currentPage += 1;
    this.calculatePagination(this.visibleBranches);
  }
  
  handleFileInput(fileInput) {
    this.fileInvalid = !fileInput.value;
    this.excelFile = fileInput.files[0];
  }

  async handleSubmit(formValues, currentModal) {
    const updateMethod = this.formSubmissionService.getUpdateMethod(currentModal);
    const submissionData = currentModal === 'bulkModal'
      ? this.formSubmissionService.fileSubmit('doc', this.excelFile)
      : this.formSubmissionService.profileInfoSubmit(formValues);

    if (submissionData.errors.length) {
      this.displaySpinner = false;
      return submissionData.errors.forEach(error => this.toastr.error(error));
    }
    
    try {
      const { message } = await this.profileService[updateMethod](submissionData.data, 'branch');
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
