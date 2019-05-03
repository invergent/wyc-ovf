import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNav {
  @Output() sideNavToggleEvent = new EventEmitter();
  profileMenuOpened = false;
  notificationMenuOpened = false;

  constructor() { }

  toggleNavItems(navItem) {
    this.toggleSideNav('navItem') // force close sideNav if open
    const oppositeItem = navItem === 'profileMenuOpened' ? 'notificationMenuOpened' : 'profileMenuOpened';
    this[navItem] = this[navItem] ? false : true;
    if (this[navItem]) this[oppositeItem] = !this[navItem];
  }

  toggleSideNav(fromSideNav?: string) {
    if (!fromSideNav) {
      this.profileMenuOpened = false;
      this.notificationMenuOpened = false;
    }
    this.sideNavToggleEvent.emit(fromSideNav);
  }
}
