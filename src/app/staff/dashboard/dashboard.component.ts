import { Component, OnInit } from '@angular/core';
import {
  AuthService, IClaimStatistics, IClaim, IActivity, OvertimeService, IStaffClaimData
} from '../../shared';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showLoader: boolean = true;
  errorMessage: string = '';
  windowMessage: string;
  displayModal: string = 'none';
  backgroundColor: string;

  staffClaimData: IStaffClaimData
  claimStatistics: IClaimStatistics
  pendingClaims: IClaim[]
  activities: IActivity[]
  staffFirstName: string

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private overtimeService: OvertimeService
  ){}

  async ngOnInit() {
    try {
      const { claimStatistics, pendingClaims, activities } = await this.overtimeService.fetchStaffData();
      this.activities = activities.slice(0, 5); // reduce results to the first five
      this.claimStatistics = claimStatistics;
      this.pendingClaims = pendingClaims;
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

  displayWindowModal(windowInfoData) {
    const { message, backgroundColor } = windowInfoData;
    if (this.route.snapshot.queryParams.login) {
      this.windowMessage = message;
      this.backgroundColor = backgroundColor;
      this.displayModal = 'block';
    }
  }

  closeModal() {
    this.displayModal = 'none';
  }
}
