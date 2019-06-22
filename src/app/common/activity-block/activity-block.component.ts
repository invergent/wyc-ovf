import { Component, Input } from '@angular/core';
import { IActivity } from '../../shared';

@Component({
  selector: 'activity-block',
  templateUrl: './activity-block.component.html',
  styleUrls: ['./activity-block.component.scss']
})
export class ActivityBlock {
  @Input() activities: IActivity[]

  constructor() { }

}
