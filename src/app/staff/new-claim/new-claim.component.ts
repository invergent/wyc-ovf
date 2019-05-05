import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  JQUERY_TOKEN, AuthService, IValidatedForm, dateRegex, TOASTR_TOKEN, IToastr,
  OvertimeService
} from '../../shared';

@Component({
  selector: 'app-new-claim',
  templateUrl: './new-claim.component.html',
  styleUrls: ['./new-claim.component.scss']
})
export class NewClaimComponent implements OnInit {
  weekdayClicked: boolean = false;
  weekendClicked: boolean = false;
  shiftClicked: boolean = false;
  staffRole: string;
  weekend
  displaySpinner = false;

  constructor(
    private authService: AuthService,
    private overtimeService: OvertimeService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  ngOnInit() {
    this.staffRole = this.authService.currentStaff.role;
  }

  initializeDatePicker(element, daysToDisable) {
    this.jQuery(element).datepicker({
      startDate: this.previousMonthDate(),
      firstDay: 1,
      onRenderCell: (date, cellType) => {
        if (cellType == 'day') {
          const day = date.getDay()
          const isDisabled = daysToDisable.indexOf(day) != -1;
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
      this.initializeDatePicker('#shiftInput', [0, 6]);
    }, 400);
  }

  previousMonthDate() {
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    return new Date(thisYear, thisMonth - 1, 1);
  }

  checkEntries(input): IValidatedForm {
    const validField = {};
    const error = [];
    const inputName = input.split('Clicked')[0]; // remove "Clicked" and add "input"
    const inputNameValue = this.jQuery(`#${inputName}Input`).val();
    const dates = inputNameValue.split(', ');

    if(!dateRegex.test(dates[0])) error.push(`Enter a valid value for ${inputName}.`);

    validField[inputName] = dates.length;
    return { validField, error };
  }

  getOvertimeEntries() {
    const inputs = ['weekdayClicked', 'weekendClicked', 'shiftClicked'];
    const errors = [];
    let overtimeRequest = {};

    inputs.forEach((input) => {
      if (this[input]) {
        const { validField, error } = this.checkEntries(input);
        overtimeRequest = { ...overtimeRequest, ...validField };
        errors.push(...error);
      }
    });

    return { overtimeRequest, errors };
  }

  async handleSubmit() {
    const { overtimeRequest, errors } = this.getOvertimeEntries();

    if (errors.length) {
      this.displaySpinner = false;
      return errors.forEach(error => this.toastr.error(error));
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
