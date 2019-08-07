import { Component, OnInit, Inject, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  JQUERY_TOKEN, AuthService, dateRegex, TOASTR_TOKEN, IToastr,
  OvertimeService, ISettings, SettingsService, claimPrice, LOCALSTORAGE_TOKEN, ILocalStorage, IStaffClaimData
} from '../../shared';

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss']
})
export class NewClaimComponent {
  
}
