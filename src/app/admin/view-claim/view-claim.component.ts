import { Component, OnInit } from '@angular/core';
import { OvertimeService } from 'src/app/shared';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view-claim',
  templateUrl: './view-claim.component.html',
  styleUrls: ['./view-claim.component.scss']
})
export class ViewClaimComponent implements OnInit {
  claim
  showLoader: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private overtimeService: OvertimeService
  ) { }

  async ngOnInit() {
    const claimId = this.route.snapshot.paramMap.get('claimId');
    if (Number.isNaN(+claimId)) return this.router.navigate(['admin/claims']);
    
    try {
      const { data } = await this.overtimeService.fetchSingleClaimForAdmin(+claimId);
      if (!Object.keys(data).length) return this.router.navigate(['admin/claims']);
      this.claim = [data]
      this.showLoader = false;
    } catch (error) {
      this.showLoader = false;
      this.errorMessage = 'Unable to load content. Please reload';
    }
  }
}
