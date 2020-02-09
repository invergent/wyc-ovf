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
import { ViewStaffComponent } from './view-staff/view-staff.component';
import { ViewClaimComponent } from './view-claim/view-claim.component';
import { LogsComponent } from './logs/logs.component';
import { AdminOnlyGuard, SuperAdminAuditorGuard, SuperAdminGuard } from '../shared';
import { AdminsComponent } from './admins/admins.component';

const routes: Routes = [{
  path: '',
  component: AdminComponent,
  children: [
    { path: 'dashboard', canActivate: [AdminOnlyGuard], component: AdminDashboardComponent },
    { path: 'claims', component: AdminClaimsComponent },
    { path: 'claims/:claimId', component: ViewClaimComponent },
    { path: 'staff', canActivate: [AdminOnlyGuard], component: AdminStaffComponent },
    { path: 'staff/:staffId', canActivate: [AdminOnlyGuard], component: ViewStaffComponent },
    { path: 'branch', canActivate: [AdminOnlyGuard], component: AdminBranchComponent },
    { path: 'holidays', canActivate: [AdminOnlyGuard], component: HolidaysComponent },
    { path: 'settings', canActivate: [AdminOnlyGuard], component: AdminSettingsComponent },
    { path: 'logs', canActivate: [SuperAdminAuditorGuard], component: LogsComponent },
    { path: 'admins', canActivate: [SuperAdminGuard], component: AdminsComponent },
    { path: 'profile', canActivate: [AdminOnlyGuard], component: AdminProfileComponent },
    { path: 'change-password', component: AdminChangePasswordComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
