import { Component, OnInit, Inject } from '@angular/core';
import { saveAs } from 'file-saver';
import { IClaim, OvertimeService, TOASTR_TOKEN, IToastr } from '../../shared';

@Component({
  selector: 'app-admin-claims',
  templateUrl: './admin-claims.component.html',
  styleUrls: ['./admin-claims.component.scss']
})
export class AdminClaimsComponent implements OnInit {
  showLoader: boolean = true;
  displaySpinnerMark: boolean = false;
  displaySpinnerExport: boolean = false;
  errorMessage: string = '';
  statuses: string[] = ['All', 'Completed', 'Processing', 'Pending'];
  claims: IClaim[] = [];

  // modal controls
  modalTitle: string
  currentModal: string
  displayModal: string = 'none';
  displaySpinner: boolean = false;
  markAsCompletedModal: boolean = false;
  exportModal: boolean = false;


  constructor(
    private overtimeService: OvertimeService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
  ) {}

  async ngOnInit() {
    await this.initialiseClaimData();
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

  async initialiseClaimData() {
    try {
      const { monthlyStat: { submittedClaims: claims } } = await this.overtimeService.fetchAdminData();
      this.claims = claims;
      this.showLoader = false;
    }
    catch (error) {
      this.displayError();
    }
  }

  displayError() {
    this.showLoader = false;
    this.errorMessage = 'Unable to load content. Please reload';
  }

  async exportClaims(docType) {
    this.displaySpinnerExport = true;
    this.closeModal(this.currentModal);

    const type = docType === 'xlsx'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv;charset=utf-8;';

    try {
      const excelBlob = await this.overtimeService.exportApprovedClaims(docType);
      const blob = new Blob([excelBlob], { type });
      saveAs(blob, `Approved Claims (${new Date().toDateString().substr(4)})`);
      this.displaySpinnerExport = false;
    } catch (error) {
      this.displaySpinnerExport = false;
      // TODO display error modal on fail
    }
  }

  async markClaimsAsCompleted() {
    this.displaySpinnerMark = true;
    try {
      const { message } = await this.overtimeService.markClaimsAsCompleted();
      this.toastr.success(message);
      this.displaySpinnerMark = false;
      await this.overtimeService.syncAdminWithAPI();
      await this.initialiseClaimData();
    } catch (error) {
      this.displaySpinnerMark = false;
      this.toastr.error('An error occurred while marking claims as completed.');
    }
  }
}
