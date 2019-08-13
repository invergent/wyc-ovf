import { Component, OnInit } from '@angular/core';
import { OvertimeService } from 'src/app/shared';
import { ActivatedRoute } from '@angular/router';

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
    private overtimeService: OvertimeService
  ) { }

  async ngOnInit() {
    const claimId = this.route.snapshot.paramMap.get('claimId');
    try {
      const { data } = await this.overtimeService.fetchSingleClaimForAdmin(+claimId);
      this.claim = [data]
      this.showLoader = false;
    } catch (error) {
      this.showLoader = false;
      this.errorMessage = 'Unable to load content. Please reload';
    }
  }
}
