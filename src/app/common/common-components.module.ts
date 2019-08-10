import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { jqxChartComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxchart';

import { TopNav } from './top-nav/top-nav.component';
import { ClaimsComponent } from './claims/claims.component';
import { ActivityBlock } from './activity-block/activity-block.component';
import { ApprovalProgressBar } from './approval-progress-bar/approval-progress-bar.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { PipesModule } from '../pipes/pipes.module';
import { ClaimsGraphComponent } from './claims-graph/claims-graph.component';
import { ClaimWindowComponent } from './claim-window/claim-window.component';
import { ClaimEngineComponent } from './claim-engine/claim-engine.component';
import { ClaimDetailsComponent } from './claim-details/claim-details.component';

const declarations = [
  TopNav, ClaimsComponent, ActivityBlock, ApprovalProgressBar, PasswordChangeComponent,
  ClaimsGraphComponent, jqxChartComponent, ClaimWindowComponent, ClaimEngineComponent,
  ClaimDetailsComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PipesModule
  ],
  declarations,
  exports: declarations
})
export class CommonComponentsModule { }
