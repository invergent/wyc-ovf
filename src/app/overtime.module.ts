import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { OvertimeRoutingModule } from './overtime-routing.module';
import { OvertimeComponent } from './overtime.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ConfirmPasswordResetComponent } from './confirm-password-reset/confirm-password-reset.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { LogoutComponent } from './logout/logout.component';
import {
  AuthService, ProfileService, OvertimeService, RedirectToDashboard, RedirectToLogin,
  TOASTR_TOKEN, JQUERY_TOKEN, IToastr, FormSubmissionService
} from './shared';

const jQuery: Object = window['$'];
const toastr: IToastr = window['toastr'];

@NgModule({
  imports: [
    BrowserModule,
    OvertimeRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  declarations: [
    OvertimeComponent,
    HomeComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ConfirmPasswordResetComponent,
    PasswordResetComponent,
    LogoutComponent
  ],
  providers: [
    AuthService,
    OvertimeService,
    ProfileService,
    RedirectToDashboard,
    RedirectToLogin,
    FormSubmissionService,
    { provide: JQUERY_TOKEN, useValue: jQuery },
    { provide: TOASTR_TOKEN, useValue: toastr }
  ],
  bootstrap: [OvertimeComponent]
})
export class OvertimeModule { }
