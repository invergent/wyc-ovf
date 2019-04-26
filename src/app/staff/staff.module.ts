import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { StaffRoutingModule } from './staff-routing.module';
import { CommonComponentsModule } from '../common/common-components.module';
import { StaffComponent } from './staff.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewClaimComponent } from './new-claim/new-claim.component';
import { PendingClaimComponent } from './pending-claim/pending-claim.component';
import { ClaimHistoryComponent } from './claim-history/claim-history.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StaffRoutingModule,
    CommonComponentsModule
  ],
  declarations: [
    StaffComponent,
    DashboardComponent,
    NewClaimComponent,
    PendingClaimComponent,
    ClaimHistoryComponent,
    ProfileComponent,
    ChangePasswordComponent
  ],
  providers: [

  ]
})
export class StaffModule { }
