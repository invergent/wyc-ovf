import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { StaffRoutingModule } from './staff-routing.module';
import { PasswordResetComponent } from './password-reset/password-reset.component';

@NgModule({
  imports: [
    CommonModule,
    StaffRoutingModule,
    FormsModule
  ],
  declarations: [
    PasswordResetComponent
  ],
  providers: [

  ]
})
export class StaffModule { }
