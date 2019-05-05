import { Component } from '@angular/core';
import { OvertimeService, IClaim } from 'src/app/shared';

@Component({
  templateUrl: './claim-history.component.html',
  styleUrls: ['./claim-history.component.scss']
})
export class ClaimHistoryComponent {
  statuses: string[] = ['All', 'Completed', 'Declined', 'Cancelled'];
  //@ts-ignore
  staffClaimsHistory: IClaim[];
  showLoader: boolean = true;
  errorMessage: string = '';

  constructor(private overtimeService: OvertimeService) { }

  async ngOnInit() {
    try {
      const { claimHistory } = await this.overtimeService.fetchStaffData();
      
      this.staffClaimsHistory = claimHistory;
      this.showLoader = false;
    } catch(e) {
      this.displayError();
    }
  }

  displayError() {
    this.showLoader = false;
    this.errorMessage = 'Unable to load content. Please reload';
  }
}
