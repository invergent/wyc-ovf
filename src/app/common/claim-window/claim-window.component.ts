import { Component, OnInit, Input } from '@angular/core';
import { ISettings, SettingsService } from '../../shared';

@Component({
  selector: 'claim-window-info',
  templateUrl: './claim-window.component.html',
  styleUrls: ['./claim-window.component.scss']
})
export class ClaimWindowComponent implements OnInit {
  @Input() companySettings: ISettings
  backgroundColor: string = 'transparent';
  reopenDate
  closingDate
  windowStatus
  message
  infoDisplay: string = 'none';

  constructor(private settingService: SettingsService) { }

  async ngOnInit() {
    this.companySettings = await this.settingService.fetchAdminSettings();
    const { overtimeWindowStart, overtimeWindowEnd } = this.companySettings;
    this.reopenDate = this.settingService.getReopenDate(overtimeWindowStart);
    this.closingDate = this.settingService.getReopenDate(overtimeWindowEnd);
    this.windowStatus = this.companySettings.overtimeWindow;
    this.createTheme();
  }

  displayInfo() {
    if (this.infoDisplay === 'none') {
      this.infoDisplay = 'block';
    } else {
      this.infoDisplay = 'none';
    }
  }

  createTheme() {
    const { overtimeWindow, overtimeWindowIsActive } = this.companySettings
    if ((!overtimeWindow || overtimeWindow === 'Close') && overtimeWindowIsActive) {
      this.message = 'Claim request window is temporarily open'
      this.backgroundColor = '#ffc107';
    } else if (!overtimeWindow || overtimeWindow === 'Close') {
      this.message = `Claim request window is currently closed and would reopen on ${this.reopenDate}`;
      this.backgroundColor = '#bf360c';
    } else {
      this.message = `Claim request window is currently open and would close on ${this.closingDate}`;
      this.backgroundColor = '#2e7d32';
    }
  }
}
