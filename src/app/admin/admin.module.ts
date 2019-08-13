import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PipesModule } from '../pipes/pipes.module';
import { CommonComponentsModule } from '../common/common-components.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminChangePasswordComponent } from './admin-change-password/admin-change-password.component';
import { AdminClaimsComponent } from './admin-claims/admin-claims.component';
import { AdminStaffComponent } from './admin-staff/admin-staff.component';
import { AdminBranchComponent } from './admin-branch/admin-branch.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { ViewStaffComponent } from './view-staff/view-staff.component';
import { ViewClaimComponent } from './view-claim/view-claim.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonComponentsModule,
    PipesModule,
    AdminRoutingModule
  ],
  declarations: [
    AdminComponent,
    AdminDashboardComponent,
    AdminChangePasswordComponent,
    AdminClaimsComponent,
    AdminStaffComponent,
    AdminBranchComponent,
    AdminProfileComponent,
    AdminSettingsComponent,
    HolidaysComponent,
    ViewStaffComponent,
    ViewClaimComponent
  ]
})
export class AdminModule { }
