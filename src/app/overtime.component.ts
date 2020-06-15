import { Component, HostListener } from '@angular/core';
import { IdleWatchService } from './shared/idle-watch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./overtime.component.scss']
})
export class OvertimeComponent {
  constructor(
    private idleWatcher: IdleWatchService,
    private router: Router
  ) {}

  @HostListener('window:mousemove')
  mousemove() {
    this.idleWatcher.resetTimer();
  }

  @HostListener('window:click')
  clicked() {
    this.idleWatcher.resetTimer();
  }

  @HostListener('window:keydown')
  keydown() {
    this.idleWatcher.resetTimer();
  }

  ngOnInit() {
    this.idleWatcher.getIdleState.subscribe(idleState => {
      if (idleState) this.router.navigate(['/logout']);
    });
  }
}
