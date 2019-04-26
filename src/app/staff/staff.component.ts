import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  sideNavLeft = '-300px';

  constructor(){}

  async ngOnInit() {

  }

  toggleSideNav() {
    this.sideNavLeft = this.sideNavLeft === '-300px' ? '0' : '-300px';
  }
}
