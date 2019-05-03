import { Component, OnInit } from '@angular/core';
import { IStaff, AuthService } from '../shared';

@Component({
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent {
  sideNavLeft = '-300px';

  constructor(){}

  toggleSideNav(source) {
    if (source === 'navItem') {
      this.sideNavLeft = '-300px';
    } else {
      this.sideNavLeft = this.sideNavLeft === '-300px' ? '0' : '-300px';
    }
  }
}
