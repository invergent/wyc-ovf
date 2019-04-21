import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConfirmPasswordResetComponent } from './confirm-password-reset/confirm-password-reset.component'
import { RedirectToDashboard } from './shared/redirect-to-dashboard.service';

const routes: Routes = [
  { path: 'login', canActivate: [RedirectToDashboard], component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'confirm-reset-request', component: ConfirmPasswordResetComponent },
  { path: 'staff', loadChildren: './staff/staff.module#StaffModule' },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class OvertimeRoutingModule { }
