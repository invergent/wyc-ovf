import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StaffComponent } from './staff.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewClaimComponent } from './new-claim/new-claim.component';
import { PendingClaimComponent } from './pending-claim/pending-claim.component';
import { ClaimHistoryComponent } from './claim-history/claim-history.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [{
  path: '',
  component: StaffComponent,
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'new', component: NewClaimComponent },
    { path: 'pending-claim', component: PendingClaimComponent },
    { path: 'claim-history', component: ClaimHistoryComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'change-password', component: ChangePasswordComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
