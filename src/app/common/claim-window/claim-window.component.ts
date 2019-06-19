import { Component, OnInit, Input } from '@angular/core';
import { ISettings, SettingsService } from '../../shared';

@Component({
  selector: 'claim-window-info',
  templateUrl: './claim-window.component.html',
  styleUrls: ['./claim-window.component.scss']
})
export class ClaimWindowComponent implements OnInit {
  @Input() companySettings: ISettings
  backgroundColor: string = 'blue';
  reopenDate
  closingDate
  windowStatus
  infoDisplay: string = 'none';

  constructor(private settingService: SettingsService) { }

  async ngOnInit() {
    this.companySettings = await this.settingService.fetchAdminSettings();
    const { overtimeWindowStart, overtimeWindowEnd } = this.companySettings;
    this.reopenDate = this.settingService.getReopenDate(overtimeWindowStart);
    this.closingDate = this.settingService.getReopenDate(overtimeWindowEnd);
    this.windowStatus = this.companySettings.overtimeWindow;
    this.backgroundColor = this.companySettings.overtimeWindow === 'Open'
      ? 'green' : 'red';
  }

  infoDate() {
    return this.windowStatus === 'Open' ? this.closingDate : this.reopenDate;
  }

  displayInfo() {
    if (this.infoDisplay === 'none') {
      this.infoDisplay = 'block';
    } else {
      this.infoDisplay = 'none';
    }
  }
}
