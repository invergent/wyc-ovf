import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConfirmPasswordResetComponent } from './confirm-password-reset/confirm-password-reset.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { RedirectToDashboard } from './shared/redirect-to-dashboard.service';
import { RedirectToLogin } from './shared';

const routes: Routes = [
  { path: 'login', canActivate: [RedirectToDashboard], component: LoginComponent },
  { path: 'forgot-password', canActivate: [RedirectToDashboard], component: ForgotPasswordComponent },
  { path: 'confirm-reset-request', component: ConfirmPasswordResetComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'staff', redirectTo: '/staff/dashboard', pathMatch: 'full' },
  { path: 'staff', canActivate: [RedirectToLogin], loadChildren: './staff/staff.module#StaffModule' },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class OvertimeRoutingModule { }
