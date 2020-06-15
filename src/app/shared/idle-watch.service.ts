import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class IdleWatchService {
  private readonly _idle = new BehaviorSubject<boolean>(false);
  readonly getIdleState = this._idle.asObservable().pipe(distinctUntilChanged());
  idleTime:number = 0;
  intervalId;

  constructor() { }

  get idleState() {
    return this._idle.getValue();
  }
  
  set idleState(value: boolean) {
    this._idle.next(value);
  }

  idleHandler() {
    this.idleTime += 1;
    if (this.idleTime >= 180) {
      this.idleState = true;
    }
  }

  startWatching() {
    const intervalId = setInterval(() => this.idleHandler(), 1000);
    this.intervalId = intervalId;
  }

  stopWatching() {
    clearInterval(this.intervalId);
    this.idleTime = 0;
    this.idleState = false;
  }

  resetTimer() {
    this.idleTime = 0;
  }
}
