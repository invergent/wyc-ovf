import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  JQUERY_TOKEN, AuthService, IValidatedForm, dateRegex, TOASTR_TOKEN, IToastr,
  OvertimeService, ISettings, SettingsService
} from '../../shared';

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss']
})
export class NewClaimComponent implements OnInit {
  companySettings: ISettings;
  reopenDate: string = '';
  windowIsActive: boolean = false;
  weekdayClicked: boolean = false;
  weekendClicked: boolean = false;
  atmClicked: boolean = false;
  shiftClicked: boolean = false;
  staffRole: string;
  weekend
  displaySpinner = false;

  claimMonthDate: Date;
  totalDaysInClaimMonth: number;

  overlapDays: number[] = [];
  weekdayEntries: string[] = [];
  weekendEntries: string[] = [];

  constructor(
    private authService: AuthService,
    private overtimeService: OvertimeService,
    private settingService: SettingsService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  async ngOnInit() {
    this.staffRole = this.authService.currentStaff.role;
    this.companySettings = await this.settingService.fetchAdminSettings();
    const { overtimeWindow, overtimeWindowIsActive } = this.companySettings;
    
    if (overtimeWindow === 'Open' || overtimeWindowIsActive) {
      this.windowIsActive = true;
    } else {
      this.windowIsActive = false;
      this.reopenDate = this.settingService.getReopenDate(this.companySettings.overtimeWindowStart);
    }

    // set dates and counters values
    this.claimMonthDate = this.previousMonthDate();
    this.totalDaysInClaimMonth = this.claimMonthDate.getDate();
  }

  initializeDatePicker(element, daysToDisable) {
    this.jQuery(element).datepicker({
      startDate: this.previousMonthDate(1),
      firstDay: 1,
      minDate: this.previousMonthDate(1),
      maxDate: this.previousMonthDate(),
      onRenderCell: (date, cellType) => {
        if (cellType == 'day') {
          const day = date.getDay();
          const isDisabled = daysToDisable.indexOf(day) !== -1;
          return { disabled: isDisabled }
        }
      }
    }).data('datepicker');
  }

  toggleButtonPress(clickedButton) {
    this[clickedButton] = this[clickedButton] ? false : true;

    setTimeout(() => {
      this.initializeDatePicker('#weekdayInput', [0, 6]);
      this.initializeDatePicker('#weekendInput', [1, 2, 3, 4, 5]);
      this.initializeDatePicker('#atmInput', []);
      this.initializeDatePicker('#shiftInput', []);
    }, 200);
    setTimeout(() => this.jQuery('#datepickers-container').css('z-index', '99999'), 400);
  }

  previousMonthDate(day?: number) {
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    const month = day ? (thisMonth - 1) : thisMonth;
    return new Date(thisYear, month, day || 0);
  }

  checkOverlaps(dates, inputName) {
    dates.forEach((date) => {
      if (inputName === 'atm') {
        if (this.weekdayEntries.includes(date) || this.weekendEntries.includes(date)) {
          const overlapDay = date.split('/')[1];
          this.overlapDays.push(overlapDay);
        }
      }
    });
  }

  checkEntries(input): IValidatedForm {
    const validField = {};
    const error = [];
    const inputName = input.split('Clicked')[0]; // remove "Clicked" and add "input"
    const inputNameValue = this.jQuery(`#${inputName}Input`).val();
    const dates = inputNameValue.split(', ');

    if(!dateRegex.test(dates[0])) {
      error.push(`Enter a valid value for ${inputName}.`);
    } else {
      this[`${inputName}Entries`] = dates;
      this.checkOverlaps(dates, inputName);
    }

    validField[inputName] = dates.length;
    return { validField, error };
  }

  createOverlapErrorMessage() {
    const overlapDays = this.overlapDays.reduce((acc, day, index) => {
      if (acc === '') {
        return `${day}`;
      } else if (index === (this.overlapDays.length - 1)) {
        return `${acc} and ${day}`;
      } else {
        return `${acc}, ${day}`;
      }
    }, '');

    return `Your ATM Days entry have ${
      this.overlapDays.length > 1 ? '': 'an'
    } overlap${
      this.overlapDays.length > 1 ? 's': ''
    } on day ${overlapDays}`;
  }

  getOvertimeEntries() {
    const inputs = ['weekdayClicked', 'weekendClicked', 'atmClicked', 'shiftClicked'];
    const errors = [];
    let overtimeRequest = {};

    inputs.forEach((input) => {
      if (this[input]) {
        const { validField, error } = this.checkEntries(input);
        overtimeRequest = { ...overtimeRequest, ...validField };
        errors.push(...error);
      }
    });

    if (this.overlapDays.length) errors.push(this.createOverlapErrorMessage());

    return { overtimeRequest, errors };
  }

  clearEntries() {
    this.weekdayEntries = [];
    this.weekendEntries = [];
    this.overlapDays = [];
  }

  async handleSubmit() {
    const { overtimeRequest, errors } = this.getOvertimeEntries();

    if (errors.length) {
      this.displaySpinner = false;
      errors.forEach(error => this.toastr.error(error));
      return this.clearEntries();
    }

    try {
      const { message } = await this.overtimeService.createOvertimeRequest(overtimeRequest);
      await this.overtimeService.syncWithAPI();
      this.toastr.success(message);
      return this.router.navigate(['/staff/dashboard']);
    } catch(e) {
      this.displaySpinner = false;
      if (e.error.errors) {
        return e.error.errors.forEach(error => this.toastr.error(error));
      }
      return this.toastr.error(e.error.message || 'An error occurred. Check your connectivity.');
    }
  }
}
