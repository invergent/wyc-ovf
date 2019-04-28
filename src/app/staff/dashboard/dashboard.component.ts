import { Component, OnInit } from '@angular/core';
import { AuthService, IClaimStatistics, IClaim, IActivity, OvertimeService } from '../../shared';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showLoader: boolean = true;
  errorMessage: string = '';
  claimStatistics: IClaimStatistics
  pendingClaim: IClaim
  activities: IActivity[]
  staffFirstName: string

  constructor(
    private authService: AuthService,
    private overtimeService: OvertimeService
  ){}

  async ngOnInit() {
    try {
      const staffData = await this.overtimeService.initialiseStaffData();
      [this.claimStatistics, this.pendingClaim, this.activities] = staffData;
      this.activities = this.activities.splice(0, 3); // reduce results to the first three

      this.staffFirstName = this.authService.currentStaff.firstname;
      this.showLoader = false;
    } catch(e) {
      this.showLoader = false;
      this.errorMessage = 'Unable to load content. Please reload';
    }
  }
}
