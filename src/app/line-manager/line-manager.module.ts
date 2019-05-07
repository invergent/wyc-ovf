import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LineManagerComponent } from './line-manager.component';
import { VerifyComponent } from './verify/verify.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { HttpClientModule } from '@angular/common/http';
import { LineManagerService } from './line-manager.service';

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
    RouterModule.forChild(routes)
  ],
  declarations: [LineManagerComponent, VerifyComponent, ApprovalsComponent],
  providers: [
    LineManagerService
  ]
})
export class LineManagerModule { }
