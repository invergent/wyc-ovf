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


  constructor(
    private overtimeService: OvertimeService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
  ) {}

  async ngOnInit() {
    await this.initialiseClaimData();
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

  async exportClaims() {
    this.displaySpinnerExport = true;
    try {
      const excelBlob = await this.overtimeService.exportApprovedClaims();
      const blob = new Blob([excelBlob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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
