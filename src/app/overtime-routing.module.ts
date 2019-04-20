import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RedirectToDashboard } from './shared/redirect-to-dashboard.service';

const routes: Routes = [
  { path: 'login', canActivate: [RedirectToDashboard], component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class OvertimeRoutingModule { }
