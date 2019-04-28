import { Component, Input } from '@angular/core';
import { IClaim } from '../../shared';

@Component({
  selector: 'claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss']
})
export class ClaimComponent {
  @Input() pendingClaim: IClaim

  constructor() { }

}
