import { Component, OnInit } from '@angular/core';
import {
  AuthService, IClaimStatistics, IClaim, IActivity, OvertimeService, IStaffClaimData
} from '../../shared';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showLoader: boolean = true;
  errorMessage: string = '';
  staffClaimData: IStaffClaimData
  claimStatistics: IClaimStatistics
  pendingClaim: IClaim[]
  activities: IActivity[]
  staffFirstName: string

  constructor(
    private authService: AuthService,
    private overtimeService: OvertimeService
  ){}

  async ngOnInit() {
    try {
      const { claimStatistics, pendingClaim, activities } = await this.overtimeService.fetchStaffData();
      
      this.claimStatistics = claimStatistics;
      this.pendingClaim = [pendingClaim];
      this.activities = activities.splice(0, 3); // reduce results to the first three
      this.staffFirstName = this.authService.currentStaff.firstname;
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
