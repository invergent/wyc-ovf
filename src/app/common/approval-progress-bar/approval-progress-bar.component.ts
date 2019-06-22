import { Component, Input } from '@angular/core';
import { IApprovalHistory } from '../../shared';

@Component({
  selector: 'approval-progress-bar',
  templateUrl: './approval-progress-bar.component.html',
  styleUrls: ['./approval-progress-bar.component.scss']
})
export class ApprovalProgressBar {
  @Input() approvalHistory: IApprovalHistory[]
  check: boolean = true;

  constructor() { }
}
