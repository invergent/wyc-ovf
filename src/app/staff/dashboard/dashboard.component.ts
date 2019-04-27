import { Component, OnInit } from '@angular/core';
import { AuthService, IStatistics, OvertimeService } from '../../shared';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showLoader: boolean = true;
  errorMessage: string = '';
  statistics: IStatistics
  staffFirstName: string

  constructor(
    private authService: AuthService,
    private overtimeService: OvertimeService
  ){}

  async ngOnInit() {
    try {
      const { data: claimStats } = await this.overtimeService.fetchStaffClaimStatistics();
      this.statistics = claimStats;
      this.staffFirstName = this.authService.currentStaff.firstname;
      this.showLoader = false;
    } catch(e) {
      this.showLoader = false;
      this.errorMessage = 'Unable to load content. Please reload';
    }
  }
}
