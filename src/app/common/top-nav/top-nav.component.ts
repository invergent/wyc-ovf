import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNav {
  @Output() sideNavToggleEvent = new EventEmitter();

  constructor() { }

  toggleSideNav() {
    this.sideNavToggleEvent.emit();
  }
}
