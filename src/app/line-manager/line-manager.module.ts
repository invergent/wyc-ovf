import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LineManagerComponent } from './line-manager.component';
import { VerifyComponent } from './verify/verify.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { HttpClientModule } from '@angular/common/http';
import { LineManagerService } from './line-manager.service';
import { PipesModule } from '../pipes/pipes.module';
import { CommonComponentsModule } from '../common/common-components.module';

const routes: Routes = [{
  path: '',
  component: LineManagerComponent,
  children: [
    { path: 'verify', component: VerifyComponent },
    { path: 'approvals', component: ApprovalsComponent }
  ]
}];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    PipesModule,
    RouterModule.forChild(routes),
    CommonComponentsModule
  ],
  declarations: [LineManagerComponent, VerifyComponent, ApprovalsComponent],
  providers: [
    LineManagerService
  ]
})
export class LineManagerModule { }
