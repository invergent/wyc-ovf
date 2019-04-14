import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { OvertimeRoutingModule } from './overtime-routing.module';
import { OvertimeComponent } from './overtime.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    BrowserModule,
    OvertimeRoutingModule
  ],
  declarations: [
    OvertimeComponent,
    HomeComponent,
    LoginComponent
  ],

  providers: [],
  bootstrap: [OvertimeComponent]
})
export class OvertimeModule { }
