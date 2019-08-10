import { Component, OnInit, Inject, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  JQUERY_TOKEN, AuthService, dateRegex, TOASTR_TOKEN, IToastr,
  OvertimeService, ISettings, SettingsService, claimPrice, LOCALSTORAGE_TOKEN, ILocalStorage, IStaffClaimData, IClaim
} from '../../shared';

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss']
})
export class NewClaimComponent {
  showLoader: boolean = true;
  errorMessage: string = '';
  pendingClaim: IClaim[] = [];

  companySettings: ISettings;
  reopenDate: string = '';
  windowIsActive: boolean = false;

  constructor(
    private overtimeService: OvertimeService,
    private settingsService: SettingsService
  ) { }
  
  async ngOnInit() {
    try {
      const { pendingClaim } = await this.overtimeService.fetchStaffData();
      this.companySettings = await this.settingsService.fetchAdminSettings();
      this.pendingClaim = pendingClaim;

      this.runClaimWindowCheck();

      this.showLoader = false;
    } catch(e) {
      this.showLoader = false;
      this.errorMessage = 'Unable to load content. Please reload';
    }
  }

  private runClaimWindowCheck() {
    const { overtimeWindow, overtimeWindowIsActive } = this.companySettings;
    if (overtimeWindow === 'Open' || overtimeWindowIsActive) {
      this.windowIsActive = true;
    }
    else {
      this.windowIsActive = false;
      this.reopenDate = this.settingsService.getReopenDate(this.companySettings.overtimeWindowStart);
    }
  }
}
