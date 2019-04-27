import { Component, OnInit } from '@angular/core';
import { IStaff, AuthService } from '../shared';

@Component({
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent {
  sideNavLeft = '-300px';

  constructor(){}

  toggleSideNav() {
    this.sideNavLeft = this.sideNavLeft === '-300px' ? '0' : '-300px';
  }
}
