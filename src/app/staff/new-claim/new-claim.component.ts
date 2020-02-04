import { Component, Inject } from '@angular/core';
import {
  AuthService, OvertimeService, ISettings, SettingsService, IClaim, IStaff,
  months,
  ProfileService,
  IToastr,
  TOASTR_TOKEN
} from '../../shared';

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss']
})
export class NewClaimComponent {
  staff: IStaff;
  showLoader: boolean = true;
  errorMessage: string = '';
  pendingClaim: IClaim[] = [];

  companySettings: ISettings;
  reopenDate: string = '';
  windowIsActive: boolean = false;

  claimContentToDisplay: string;
  applyingMonth: string;
  permittedMonths: string[];

  constructor(
    private authService: AuthService,
    private overtimeService: OvertimeService,
    private settingsService: SettingsService,
    private profileService: ProfileService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
  ) { }

  async ngOnInit() {
    this.staff = this.authService.currentStaff;
    try {
      const { pendingClaim } = await this.overtimeService.fetchStaffData();
      this.companySettings = await this.settingsService.fetchAdminSettings();
      this.pendingClaim = pendingClaim;

      this.displayPageContent();
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

  runMultipleClaimAuthorisationCheck() {
    // if there is only one month to apply for just proceed to claim engine
    // otherwise show the months for staff to choose which month claim engine should activate
    if (this.staff.extraMonthsPermitted) {
      const { permittedMonths } = this.staff.extraMonthsData;
      this.permittedMonths = permittedMonths.map(yearMonth => {
        const month = Number(yearMonth.split('/')[1])
        return months[+month];
      });

      if (this.permittedMonths.length > 1) {
        return true;
      } else {
        this.applyingMonth = permittedMonths[0];
        return false;
      }
    }
  }

  showClaimEngine(month) {
    this.applyingMonth = month;
    this.claimContentToDisplay = 'claimEngine';
  }

  displayPageContent() {
    this.runClaimWindowCheck();

    switch (true) {
      case !this.windowIsActive:
        this.claimContentToDisplay = 'windowInfo';
        break;

      case this.runMultipleClaimAuthorisationCheck():
        this.claimContentToDisplay = 'chooseClaimMonth';
        break;

      case this.pendingClaim.length && !this.staff.extraMonthsPermitted:
        this.claimContentToDisplay = 'pendingClaimMessage';
        break;

      default:
        this.claimContentToDisplay = 'claimEngine';
        break;
    }
  }

  async claimMonthProcessed(processedMonth) {
    const { permittedMonths, appliedMonths } = this.staff.extraMonthsData;
    const newPermittedMonths = permittedMonths.filter(month => (month !== processedMonth));
    const newAppliedMonths = [...appliedMonths, processedMonth]
    const payload = {
      extraMonthsData: {
        permittedMonths: newPermittedMonths,
        appliedMonths: newAppliedMonths
      }
    };
    try {
      await this.profileService.updatePersonalInfo(payload);
      this.authService.syncWithAPI();
    } catch (e) {
      this.toastr.error('Error updating permitted months');
    }
  }
}
