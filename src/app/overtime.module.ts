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
  AuthService, ProfileService, OvertimeService, RedirectToDashboard, TOASTR_TOKEN,
  JQUERY_TOKEN, IToastr, FormSubmissionService, IPusher, NotificationService,
  EnforceProfileUpdateService, ProfileCheckerService, AdminAuditorGuard, AdminOnlyGuard, StaffOnlyGuard,
  PUSHER_TOKEN, CRONSTRUE_TOKEN, ICronstrue, SettingsService, LOCALSTORAGE_TOKEN,
  ILocalStorage
} from './shared';
import { environment } from 'src/environments/environment';
import { PipesModule } from './pipes/pipes.module';

const jQuery: Object = window['$'];
const toastr: IToastr = window['toastr'];
const pusher: IPusher = new window['Pusher'](environment.API_KEY, { cluster: 'eu' });
const cronstrue: ICronstrue = window['cronstrue'];
const localStorage: ILocalStorage = window['localStorage'];

@NgModule({
  imports: [
    BrowserModule,
    OvertimeRoutingModule,
    HttpClientModule,
    FormsModule,
    PipesModule
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
    AdminAuditorGuard,
    AdminOnlyGuard,
    StaffOnlyGuard,
    EnforceProfileUpdateService,
    ProfileCheckerService,
    FormSubmissionService,
    NotificationService,
    SettingsService,
    { provide: JQUERY_TOKEN, useValue: jQuery },
    { provide: TOASTR_TOKEN, useValue: toastr },
    { provide: PUSHER_TOKEN, useValue: pusher },
    { provide: CRONSTRUE_TOKEN, useValue: cronstrue },
    { provide: LOCALSTORAGE_TOKEN, useValue: localStorage }
  ],
  bootstrap: [OvertimeComponent]
})
export class OvertimeModule { }
