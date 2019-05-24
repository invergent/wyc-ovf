import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { IClaim, OvertimeService } from '../../shared';

@Component({
  selector: 'app-admin-claims',
  templateUrl: './admin-claims.component.html',
  styleUrls: ['./admin-claims.component.scss']
})
export class AdminClaimsComponent implements OnInit {
  showLoader: boolean = true;
  displaySpinner: boolean = false;
  errorMessage: string = '';
  statuses: string[] = ['All', 'Processing', 'Awaiting supervisor', 'Awaiting BSM'];
  claims: IClaim[] = [];


  constructor(private overtimeService: OvertimeService) {}

  async ngOnInit() {
    try {
      const { monthlyStat: { submittedClaims: claims } } = await this.overtimeService.fetchAdminData();
      this.claims = claims;
      this.showLoader = false;
    } catch (error) {
      this.displayError();
    }
  }

  displayError() {
    this.showLoader = false;
    this.errorMessage = 'Unable to load content. Please reload';
  }

  async exportClaims() {
    this.displaySpinner = true;
    try {
      const excelBlob = await this.overtimeService.exportApprovedClaims();
      const blob = new Blob([excelBlob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `Approved Claims (${new Date().toDateString().substr(4)})`);
      this.displaySpinner = false;
    } catch (error) {
      this.displaySpinner = false;
      // TODO display error modal on fail
    }
  }
}
