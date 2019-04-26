import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TopNav } from './top-nav/top-nav.component';
import { ClaimComponent } from './claim/claim.component';
import { ActivityBlock } from './activity-block/activity-block.component';

const declarations = [TopNav, ClaimComponent, ActivityBlock];

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations,
  exports: declarations
})
export class CommonComponentsModule { }
