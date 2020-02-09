import { Component, OnInit } from '@angular/core';
import { IClaimStatistics, AuthService, OvertimeService } from '../../shared';

@Component({
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  showLoader: boolean = true;
  errorMessage: string = '';
  claimStatistics: IClaimStatistics
  staffFirstName: string

  constructor(
    private authService: AuthService,
    private overtimeService: OvertimeService
  ){}

  async ngOnInit() {
    try {
      const { monthlyStat } = await this.overtimeService.fetchAdminData();
      
      this.claimStatistics = monthlyStat;
      this.staffFirstName = this.authService.currentStaff.firstname;
      this.showLoader = false;
    } catch(e) {
      this.displayError();
    } finally {
      // update admin data every 10 minutes
      setInterval(() => this.overtimeService.syncAdminWithAPI(), 10000 * 60);
    }
  }

  displayError() {
    this.showLoader = false;
    this.errorMessage = 'Unable to load content. Please reload';
  }
}
