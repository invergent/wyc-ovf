import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { OvertimeRoutingModule } from './overtime-routing.module';
import { OvertimeComponent } from './overtime.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Authenticator } from './shared/authenticator.service';
import { RedirectToDashboard } from './shared/redirect-to-dashboard.service';
import { TOASTR_TOKEN } from './shared/toastr.service';
import { IToastr } from './shared/models';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

declare let toastr:IToastr;

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
    ForgotPasswordComponent
  ],
  providers: [
    Authenticator,
    RedirectToDashboard,
    { provide: TOASTR_TOKEN, useValue: toastr }
  ],
  bootstrap: [OvertimeComponent]
})
export class OvertimeModule { }
