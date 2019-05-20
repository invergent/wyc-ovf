import { Component } from '@angular/core';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
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
