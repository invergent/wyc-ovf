import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@NgModule({
  imports: [
    CommonModule,
    CommonComponentsModule,
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
    AdminSettingsComponent
  ]
})
export class AdminModule { }
