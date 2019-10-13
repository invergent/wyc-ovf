import { Component, OnInit } from '@angular/core';
import { OvertimeService, IClaim } from 'src/app/shared';
import { Router, ActivatedRoute } from '@angular/router';

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
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    const claimId = this.route.snapshot.paramMap.get('claimId');
    if (Number.isNaN(+claimId)) return this.router.navigate(['staff/dashboard']);
    try {
      const { pendingClaim } = await this.overtimeService.fetchStaffData();
      this.pendingClaim = pendingClaim;
      this.pendingClaim = pendingClaim.filter(claim => claim.id === +claimId);
      
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
