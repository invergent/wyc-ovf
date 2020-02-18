import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LineManagerService } from '../line-manager.service';
import {
  TOASTR_TOKEN, IToastr, ILineManager, IClaimForLineManager, JQUERY_TOKEN,
  NotificationService
} from 'src/app/shared';

@Component({
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {
  claimsToApprove: IClaimForLineManager[]
  currentClaim: IClaimForLineManager
  lineManager: ILineManager

  displaySpinner: boolean = true;
  displayThanks: string = 'none';
  thanksModal: boolean = false;
  requestEditSpinner: boolean = false;
  requestEditModal: boolean = false;
  message: string = '';

  staffName: string

  constructor(
    private router: Router,
    private lineManagerService: LineManagerService,
    private notificationService: NotificationService,
    @Inject(TOASTR_TOKEN) private toaster: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }


  async ngOnInit() {
    try {
      const claimsData = await this.lineManagerService.fetchClaimsToApprove();
      this.lineManager = claimsData.data.lineManager;
      this.claimsToApprove = claimsData.data.pendingClaims;
      this.message = 'the following claim requests await your approval';
      this.displaySpinner = false;
    } catch (error) {
      if (error.status === 404) {
        this.lineManager = error.error.data.lineManager;
        this.claimsToApprove = error.error.data.pendingClaims;
        this.message = 'you currently have no pending claims to approve.';
        this.displaySpinner = false;
        return;
      }
      this.router.navigate(['/line-manager/verify']);
    }
  }

  async runApproval(event, approvalData) {
    event.preventDefault();
    const [approvalType, claimId] = approvalData.split(' ');
    const response = await this.lineManagerService.runApproval(approvalType, claimId);
    this.toaster.success(response.message);
    this.fadeThenRemoveApprovedClaim(approvalType, claimId);
  }

  fadeThenRemoveApprovedClaim(approvalType, claimId) {
    const fadeColors = { approve: '#40ad4890', decline: '#84120B70', requestEdit: '#ec1e8d' }
    this.jQuery(`#claim${claimId}`)
      .css('opacity', '0')
      .css('background-color', fadeColors[approvalType]);
    setTimeout(() => {
      this.removeApprovedClaimFromList(claimId);
    }, 1000);
  }

  removeApprovedClaimFromList(claimId) {
    const claimIndex = this.claimsToApprove.findIndex(element => element.id === parseInt(claimId, 10));
    if (!(claimIndex === -1)) this.claimsToApprove.splice(claimIndex, 1);
    if (this.claimsToApprove.length === 0) {
      setTimeout(() => {
        this.toggleModalDisplay('thanksModal');
        this.message = 'you currently have no pending claims to approve.';
        this.notificationService.playAudio('../../../assets/audio/tada.mp3');
      }, 300);
    }
  }

  validateRequestEditInput(editRequestMessage) {
    if (!editRequestMessage) return ['Kindly state what needs to be edited.'];
    if (editRequestMessage.length < 10) return ['Message too short'];
    return [];
  }

  toggleModalDisplay(modal: string, currentClaim?: IClaimForLineManager, event?) {
    if(event) event.preventDefault();
    this[modal] = !this[modal];
    if (this[modal]) {
      this.displayThanks = 'block';
      if (modal === 'requestEditModal') this.currentClaim = currentClaim;
    } else {
      this.displayThanks = 'none';
      this.currentClaim = null;
    }
  }

  async sendRequestEdit(editMessage) {
    this.requestEditSpinner = true;
    const errors = this.validateRequestEditInput(editMessage);
    if (errors.length) {
      this.requestEditSpinner = false;
      return errors.forEach(error => this.toaster.error(error));
    } 

    try {
      const payload = { editMessage, lineManager: this.lineManager };
      const { message } = await this.lineManagerService.requestEdit(payload, this.currentClaim.id);
      this.requestEditSpinner = false;
      this.toaster.success(message);
      this.fadeThenRemoveApprovedClaim('requestEdit', this.currentClaim.id);
      this.toggleModalDisplay('requestEditModal');
    } catch (error) {
      this.toaster.error('There was an error requesting edit on this claim.');
      this.requestEditSpinner = false;
    }
  }
}
