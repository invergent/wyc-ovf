import { Component, OnInit } from '@angular/core';
import { OvertimeService, IClaim } from 'src/app/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-claim',
  templateUrl: './update-claim.component.html',
  styleUrls: ['./update-claim.component.scss']
})
export class UpdateClaimComponent implements OnInit {
  showLoader: boolean = true;
  errorMessage: string = '';
  displayModal: string = 'none';
  displayCancelSpinner: boolean = false;
  pendingClaim: IClaim[] = [];

  constructor(
    private overtimeService: OvertimeService,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      const { pendingClaim } = await this.overtimeService.fetchStaffData();
      this.pendingClaim = pendingClaim;
      if (!this.pendingClaim[0] || !this.pendingClaim[0].editRequested) {
        return this.router.navigate(['/staff/pending-claim'])
      }
      this.showLoader = false;
    } catch(e) {
      this.showLoader = false;
      this.errorMessage = 'Unable to load content. Please reload';
    }
  }
}
