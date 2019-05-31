import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, OvertimeService, NotificationService } from '../shared';
import { ProfileService } from '../shared';

@Component({
  template: `
    <div class="logout-content">
      <div class="wrapper">
        <i *ngIf="displaySpinner" class="fa fa-spinner fa-spin"></i>
        <p>{{message}}</p>
      </div>
    </div>
  `,
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  message: string = 'Logging out...';
  displaySpinner = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private overtimeService: OvertimeService,
    private profileService: ProfileService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    const forced = this.route.snapshot.queryParams['m'];
    try {
      await this.authService.logout();
      this.authService.isAuthenticated = false;
      this.authService.currentStaff = null;
      this.overtimeService.staffClaimData = null;
      this.profileService.profileData = null;
      this.notificationService.notifications = null;
      this.notificationService.disconnect();
      this.notificationService.newNotificationsCount = 0;
      this.router.navigate(['/login'], forced ?  { queryParams: { m: 'c' } } : {});
    } catch(e) {
      this.displaySpinner = false;
      this.message = 'An error occurred. Please try again.'
    }
  }
}
