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
  pendingClaims: IClaim[] = [];

  constructor(
    private overtimeService: OvertimeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    const claimId = this.route.snapshot.paramMap.get('claimId');
    if (Number.isNaN(+claimId)) return this.router.navigate(['staff/dashboard']);
    try {
      const { pendingClaims } = await this.overtimeService.fetchStaffData();
      this.pendingClaims = pendingClaims;
      this.pendingClaims = pendingClaims.filter(claim => claim.id === +claimId);
      
      if (!this.pendingClaims[0] || !this.pendingClaims[0].editRequested) {
        return this.router.navigate(['/staff/pending-claim'])
      }
      this.showLoader = false;
    } catch(e) {
      this.showLoader = false;
      this.errorMessage = 'Unable to load content. Please reload';
    }
  }
}
