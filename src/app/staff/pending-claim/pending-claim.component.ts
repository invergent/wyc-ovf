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
  pendingClaims: IClaim[] = [];

  constructor(
    private overtimeService: OvertimeService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
  ) { }

  async ngOnInit() {
    try {
      const { pendingClaims } = await this.overtimeService.fetchStaffData();
      this.pendingClaims = pendingClaims;
      this.showLoader = false;
    } catch(e) {
      this.showLoader = false;
      this.errorMessage = 'Unable to load content. Please reload';
    }
  }

  async cancelClaim() {
    try {
      await this.overtimeService.cancelClaim(this.pendingClaims[0].id);
      await this.overtimeService.syncWithAPI();
      this.toastr.success('Claim cancelled successfully!');
      return this.router.navigate(['/staff/claim-history']);
    } catch(e) {
      this.displayModal = 'none';
      return this.toastr.error(e.error.message || 'Unable to cancel claim.');
    }
  }
}
