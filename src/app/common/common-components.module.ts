import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TimeAgoPipe } from 'time-ago-pipe';

import { TopNav } from './top-nav/top-nav.component';
import { ClaimComponent } from './claim/claim.component';
import { ActivityBlock } from './activity-block/activity-block.component';
import { ApprovalProgressBar } from './approval-progress-bar/approval-progress-bar.component';

const declarations = [TimeAgoPipe, TopNav, ClaimComponent, ActivityBlock, ApprovalProgressBar];

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations,
  exports: declarations
})
export class CommonComponentsModule { }
