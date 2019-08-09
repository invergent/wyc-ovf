import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminClaimsComponent } from './admin-claims/admin-claims.component';
import { AdminStaffComponent } from './admin-staff/admin-staff.component';
import { AdminBranchComponent } from './admin-branch/admin-branch.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { AdminChangePasswordComponent } from './admin-change-password/admin-change-password.component';
import { HolidaysComponent } from './holidays/holidays.component';

const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
    { path: 'dashboard', component: AdminDashboardComponent },
    { path: 'claims', component: AdminClaimsComponent },
    { path: 'staff', component: AdminStaffComponent },
    { path: 'branch', component: AdminBranchComponent },
    { path: 'holidays', component: HolidaysComponent },
    { path: 'settings', component: AdminSettingsComponent },
    { path: 'profile', component: AdminProfileComponent },
    { path: 'change-password', component: AdminChangePasswordComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
