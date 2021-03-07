import { Component, OnInit, Inject } from '@angular/core';
import { IStaffForAdmin, ProfileService, FormSubmissionService, TOASTR_TOKEN, IToastr, JQUERY_TOKEN, ILineManager } from 'src/app/shared';

@Component({
  templateUrl: './line-managers.component.html',
  styleUrls: ['./line-managers.component.scss']
})
export class LineManagersComponent implements OnInit {
  lineManagers: ILineManager[] = [];
  visibleManagers: ILineManager[] = [];
  currentPageList: ILineManager[] = [];
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
  editModal:boolean = false;
  deleteModal: boolean = false;
  excelErrorModal: boolean = false;

  excelFile: any

  // input controls
  fileInvalid: boolean = true;

  idNumber:number;
  solId:number;
  firstname:string;
  lastname:string;
  email:string;
  phone:string;

  excelErrors;
  excelErrorsToDisplay;

  supervisorToRemove: number;
  supervisorToEdit:number;

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
    const { lineManagers } = await this.profileService.fetchProfileData();
    this.lineManagers = [...lineManagers];
    this.visibleManagers = this.lineManagers;
    this.calculatePagination(this.lineManagers);
  }

  runModalDisplay(modal, title, supervisor) {
    this.modalTitle = title;
    this.displayModal = 'block';
    this.currentModal = modal;
    this[modal] = true;

    if (modal === 'deleteModal' && supervisor) this.supervisorToRemove = supervisor.id;
    if (modal === 'editModal' && supervisor) {
      this.idNumber = supervisor.idNumber;
      this.solId = supervisor.solId;
      this.firstname = supervisor.firstname;
      this.lastname = supervisor.lastname;
      this.email = supervisor.email;
      this.phone = supervisor.phone;
      this.supervisorToEdit = supervisor.id
    }
  }

  closeModal(modal) {
    this.displayModal = 'none';
    this[modal] = false;
    this.idNumber = null;
    this.solId = null;
    this.firstname = null;
    this.lastname = null;
    this.email = null;
    this.phone = null;
    this.supervisorToEdit = null;
  }

  triggerFileInput() {
    this.jQuery('#fileInput').click();
  }

  handleFiltering(query: string) {
    this.currentPage = 1; // reset current page
    const filterQuery = query.toLowerCase();
    this.visibleManagers = this.lineManagers.filter(lineManager => {
      const { idNumber, firstname, lastname, solId } = lineManager;
      return (
        idNumber.toLowerCase().includes(filterQuery)
        || firstname.toLowerCase().includes(filterQuery)
        || lastname.toLowerCase().includes(filterQuery)
        || solId.toString().includes(filterQuery)
      );
    });
    this.calculatePagination(this.visibleManagers);
  }

  calculatePagination(lineManagers) {    
    const numberofStaff = lineManagers.length;
    this.totalPages = Math.ceil(numberofStaff / this.staffPerPage);
    
    const sliceStart = (this.currentPage - 1) * this.staffPerPage;
    const sliceEnd = (this.currentPage * this.staffPerPage);
    
    this.currentPageList = lineManagers.slice(sliceStart, sliceEnd);
  }

  prevPage() {
    this.currentPage -= 1;
    this.calculatePagination(this.visibleManagers);
  }

  nextPage() {
    this.currentPage += 1;
    this.calculatePagination(this.visibleManagers);
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
      const { message } = await this.profileService[updateMethod](submissionData.data, this.supervisorToEdit || 'supervisors');
      this.toastr.success(message);

      await this.profileService.syncWithAPI(true);
      await this.initialiseData();

      this.closeModal(currentModal);
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

  async removeSupervisor() {
    this.displaySpinner = true;

    try {
      await this.profileService.removeUser(this.supervisorToRemove, 'supervisors');
      this.toastr.success('Supervisor removed!');

      await this.profileService.syncWithAPI(true);
      await this.initialiseData();

      this.displaySpinner = false;
      this.closeModal(this.currentModal);
    } catch (error) {
      this.toastr.error(error.error ? error.error.message : 'Error removing supervisor.');
      this.displaySpinner = false;
    }
  }
}
