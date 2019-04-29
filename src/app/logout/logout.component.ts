import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared';

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
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      await this.authService.logout();
      this.router.navigate(['/']);
    } catch(e) {
      this.displaySpinner = false;
      this.message = 'An error occurred. Please try again.'
    }
  }
}
