import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { OvertimeService, TOASTR_TOKEN, IToastr, IClaim } from '../../shared';

@Component({
  templateUrl: './pending-claim.component.html',
  styleUrls: ['./pending-claim.component.scss']
})
export class PendingClaimComponent implements OnInit {
  showLoader: boolean = true;
  errorMessage: string = '';
  displayModal: string = 'none';
  displayCancelSpinner: boolean = false;
  pendingClaim: IClaim

  constructor(
    private overtimeService: OvertimeService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
  ) { }

  async ngOnInit() {
    try {
      const staffData = await this.overtimeService.initialiseStaffData();
      this.pendingClaim = staffData[1];
      this.showLoader = false;
    } catch(e) {
      this.showLoader = false;
      this.errorMessage = 'Unable to load content. Please reload';
    }
  }

  async cancelClaim() {
    try {
      await this.overtimeService.cancelClaim(this.pendingClaim.id);
      this.toastr.success('Claim cancelled successfully!');
      return this.router.navigate(['/staff/claim-history']);
    } catch(e) {
      this.displayModal = 'none';
      return this.toastr.error(e.error.message || 'Unable to cancel claim.');
    }
  }
}
