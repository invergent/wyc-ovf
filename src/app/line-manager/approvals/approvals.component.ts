import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LineManagerService } from '../line-manager.service';
import {
  TOASTR_TOKEN, IToastr, ILineManager, IClaimForLineManager, JQUERY_TOKEN,
  NotificationService
} from 'src/app/shared';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {

  constructor(
    private router: Router,
    private lineManagerService: LineManagerService,
    private notificationService: NotificationService,
    @Inject(TOASTR_TOKEN) private toaster: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  displaySpinner: boolean = true;
  displayThanks: string = 'none';
  message: string = '';
  lineManager: ILineManager
  claimsToApprove: IClaimForLineManager[]

  async ngOnInit() {
    try {
      const claimsData = await this.lineManagerService.fetchClaimsToApprove();
      this.lineManager = claimsData.data.lineManager;
      this.claimsToApprove = claimsData.data.pendingClaims;
      this.message = 'the following claim requests await your approval';
      this.displaySpinner = false;
    } catch (error) {
      if (error.status === 404) {this.lineManager = error.error.data.lineManager;
        this.claimsToApprove = error.error.data.pendingClaims;
        this.message = 'you currently have no pending claims to approve.';
        this.displaySpinner = false;
        return;
      }
      this.router.navigate(['/line-manager/verify']);
    }
  }

  async runApproval(approvalData) {
    const [approvalType, claimId] = approvalData.split(' ');
    const response = await this.lineManagerService.runApproval(approvalType, claimId);
    this.toaster.success(response.message);
    this.fadeThenRemoveApprovedClaim(approvalType, claimId);
  }

  fadeThenRemoveApprovedClaim(approvalType, claimId) {
    this.jQuery(`#${claimId}`)
      .css('opacity', '0')
      .css('background-color', approvalType === 'approve' ? '#40ad4890' : '#84120B70');
    setTimeout(() => {
      this.removeApprovedClaimFromList(claimId);
    }, 1000);
  }

  removeApprovedClaimFromList(claimId) {
    const claimIndex = this.claimsToApprove.findIndex(element => element.id === parseInt(claimId, 10));
    if (!(claimIndex === -1)) this.claimsToApprove.splice(claimIndex, 1);
    if (this.claimsToApprove.length === 0) {
      setTimeout(() => {
        this.displayThanks = 'block';
        this.message = 'you currently have no pending claims to approve.';
        this.notificationService.playAudio('../../../assets/audio/tada.mp3');
      }, 300);
    }
  }
}
