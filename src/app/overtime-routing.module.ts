import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConfirmPasswordResetComponent } from './confirm-password-reset/confirm-password-reset.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RedirectToDashboard } from './shared/redirect-to-dashboard.service';
import { AdminsAuditorGuard, StaffOnlyGuard } from './shared';

const routes: Routes = [
  { path: 'login', canActivate: [RedirectToDashboard], component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'forgot-password', canActivate: [RedirectToDashboard], component: ForgotPasswordComponent },
  { path: 'confirm-reset-request', component: ConfirmPasswordResetComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'staff', redirectTo: '/staff/dashboard', pathMatch: 'full' },
  { path: 'staff', canActivate: [StaffOnlyGuard], loadChildren: './staff/staff.module#StaffModule' },
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin', canActivate: [AdminsAuditorGuard], loadChildren: './admin/admin.module#AdminModule' },
  { path: 'line-manager', redirectTo: '/line-manager/verify', pathMatch: 'full' },
  { path: 'line-manager', loadChildren: './line-manager/line-manager.module#LineManagerModule' },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class OvertimeRoutingModule { }
