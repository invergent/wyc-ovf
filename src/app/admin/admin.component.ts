import { Component } from '@angular/core';
import { AuthService } from '../shared';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  sideNavLeft = '-300px';
  currentStaffRole: string;

  constructor(private authService: AuthService){
    this.currentStaffRole = this.authService.currentStaff.role;
  }

  toggleSideNav(source) {
    if (source === 'navItem') {
      this.sideNavLeft = '-300px';
    } else {
      this.sideNavLeft = this.sideNavLeft === '-300px' ? '0' : '-300px';
    }
  }

}
