import { Component, OnInit, Inject } from '@angular/core';
import { saveAs } from 'file-saver';
import { IClaim, OvertimeService, TOASTR_TOKEN, IToastr, months } from '../../shared';

@Component({
  selector: 'app-admin-claims',
  templateUrl: './admin-claims.component.html',
  styleUrls: ['../logs/logs.component.scss', './admin-claims.component.scss']
})
export class AdminClaimsComponent implements OnInit {
  showLoader: boolean = true;
  errorMessage: string = '';
  claimStatuses: string[] = ['All', 'Completed', 'Pending'];
  claims: IClaim[] = [];

  // modal controls
  modalTitle: string
  currentModal: string
  displayModal: string = 'none';
  displaySpinner: boolean = false;
  exportModal: boolean = false;


  status
  itsFetching: boolean = false;


  constructor(
    private overtimeService: OvertimeService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
  ) {}

  async ngOnInit() {
    await this.fetchClaims(this.defaultQueries());
  }

  defaultQueries() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    return {
      year: lastMonth.getFullYear(),
      month: months[lastMonth.getMonth() + 1].substr(0,3),
      page: 1
    };
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

  displayError() {
    this.showLoader = false;
    this.errorMessage = 'Unable to load content. Please reload';
  }

  fetchClaimsEvent(queries) {
    this.fetchClaims(queries);
  }

  async fetchClaims(queries) {
    this.itsFetching = true;
    try {
      const { data: claims } = await this.overtimeService.fetchAdminClaimsForAdmin(queries);
      if (queries.page === 1) {
        this.claims = claims;
      } else {
        this.claims = [...this.claims, ...claims];
      }
      this.itsFetching = false;
      this.showLoader = false;
    } catch (error) {
      this.itsFetching = false;
      this.showLoader = false;
      this.toastr.error('Error fetching claims');
    }
  }

  async exportClaims(docType) {
    this.displaySpinner = true;

    const type = docType === 'xlsx'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'text/csv;charset=utf-8;';

    try {
      const excelBlob = await this.overtimeService.exportApprovedClaims(docType);
      const blob = new Blob([excelBlob], { type });
      saveAs(blob, `Approved Claims (${new Date().toDateString().substr(4)})`);
      this.closeModal(this.currentModal);
      this.displaySpinner = false;
    } catch (error) {
      this.displaySpinner = false;
      this.toastr.error('Error exporting claims');
    }
  }
}
