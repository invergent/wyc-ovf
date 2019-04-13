import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { OvertimeRoutingModule } from './overtime-routing.module';
import { OvertimeComponent } from './overtime.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    OvertimeComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    OvertimeRoutingModule
  ],
  providers: [],
  bootstrap: [OvertimeComponent]
})
export class OvertimeModule { }
