import { Component, OnInit, Inject } from '@angular/core';
import { SettingsService, ISettings, JQUERY_TOKEN, dateRegex, TOASTR_TOKEN, IToastr, IValidatedForm } from '../../shared';
import { error } from 'util';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {
  settings: ISettings

  // modal controls
  modalTitle: string
  currentModal: string
  displayModal: string = 'none';
  displaySpinner: boolean = false;
  emailScheduleModal: boolean = false;
  claimRequestWindowModal: boolean = false;
  modalMessage: string;

  emailSchedule
  overtimeWindowStart
  overtimeWindowEnd

  // knob control
  knobIsOn: boolean;
  displaySwitchOffMessage: boolean = false;

  // confirm modal controls
  displayConfirmModal: string = 'none';
  displayConfirmSpinner: boolean

  constructor(
    private settingsService: SettingsService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  async ngOnInit() {
    await this.initialiseData();
  }

  async initialiseData() {
    this.settings = await this.settingsService.fetchAdminSettings();
    this.knobIsOn = this.settings.overtimeWindowIsActive;
    if (this.knobIsOn) {
      this.switchKnobOn();
    } else {
      this.switchKnobOff();
    }
  }

  runModalDisplay(modal, title, element) {
    this.modalTitle = title;
    this.displayModal = 'block';
    this.currentModal = modal;
    this[modal] = true;
    if (element === '#emailScheduleInput') {
      setTimeout(() => this.jQuery('#emailScheduleInput').datepicker({ firstDay: 1 }).data('datepicker'), 200);
    } else {
      setTimeout(() => this.jQuery('#overtimeWindowStartInput').datepicker({ firstDay: 1 }).data('datepicker'), 200);
      setTimeout(() => this.jQuery('#overtimeWindowEndInput').datepicker({ firstDay: 1 }).data('datepicker'), 200);
    }
    setTimeout(() => this.jQuery('#datepickers-container').css('z-index', '99999'), 400);
  }

  displayConfirmationModal() {
    this.displayConfirmModal = 'block';
  }

  closeConfirmationModal() {
    this.displayConfirmModal = 'none';
  }

  async openClaimRequestWindow() {
    this.displayConfirmSpinner = true; 
    const payload = { overtimeWindowIsActive: !this.settings.overtimeWindowIsActive };
    
    try {
      const { message } = await this.settingsService.updateSettings(payload);
      await this.settingsService.syncWithAPI();
      await this.initialiseData();
      this.displayConfirmSpinner = false;
      this.displaySwitchOffMessage = false;
      this.closeConfirmationModal();
      return this.toastr.success(message); 
    } catch (error) {
      this.displayConfirmSpinner = false;
      return this.toastr.error('An error occurred'); 
    }
  }

  switchKnobOn() {
    this.jQuery('#knob').css('left', '66%');
    this.jQuery('#on').css('opacity', '1');
    this.jQuery('#off').css('opacity', '0');
    this.jQuery('#switch').css('background-color', '#84120B');
  }

  switchKnobOff() {
    this.jQuery('#knob').css('left', '3.5%');
    this.jQuery('#on').css('opacity', '0');
    this.jQuery('#off').css('opacity', '1');
    this.jQuery('#switch').css('background-color', '#ACACAC');
  }

  toggleKnob() {
    if (this.settings.overtimeWindowIsActive) {
      this.displaySwitchOffMessage = true;
      this.switchKnobOff();
      return this.openClaimRequestWindow();
    } 
    if (this.settings.overtimeWindow === 'Open') {
      return this.toastr.warning('Claim request window is still open')
    }
    this.displayConfirmationModal();
  }

  translateDatesToCronTime(dates) {
    const cronTimeDays = dates.reduce((acc, date) => {
      const dayOfMonth = date.split('/')[1];
      if (acc.length === 0) {
        acc += dayOfMonth;
      } else {
        acc += `,${dayOfMonth}`;
      }
      return acc;
    }, '');

    return `0 ${this.emailScheduleModal ? 6 : 0 } ${cronTimeDays} * *`;
  }

  checkEntries(input): IValidatedForm {
    const validField = {};
    const error = [];
    const inputValue = this.jQuery(`#${input}Input`).val();
    const dates = inputValue.split(', ');

    if(!dateRegex.test(dates[0])) error.push(`Enter a valid value for ${input}.`);

    validField[input] = dates;
    return { validField, error };
  }

  validateDateEntry() {
    const data: any = { errors: [] };
    const inputs = this.emailScheduleModal ? ['emailSchedule'] : ['overtimeWindowStart', 'overtimeWindowEnd'];

    inputs.forEach((input) => {
      const { validField, error } = this.checkEntries(input);
      if (!error.length) {
        const dates = validField[input];
        const cronTime = this.translateDatesToCronTime(dates);
        data[input] = cronTime;
      }
      data.errors.push(...error);
    });

    return data;
  }

  closeModal(modal) {
    this.displayModal = 'none';
    this[modal] = false;
  }

  async handleSubmit(currentModal) {
    const { emailSchedule, overtimeWindowStart, overtimeWindowEnd, errors } = this.validateDateEntry();
    if (errors.length) return errors.forEach(error => this.toastr.error(error));

    const data = this.emailScheduleModal ? { emailSchedule } : { overtimeWindowStart, overtimeWindowEnd };

    try {
      const { message } = await this.settingsService.updateSettings(data);
      this.toastr.success(message);

      await this.settingsService.syncWithAPI();
      await this.initialiseData();

      this.closeModal(currentModal);
      this.displaySpinner = false;
    } catch (error) {
      this.displaySpinner = false;
      if (error.error) return error.error.errors.forEach(error => this.toastr.error(error))
      return this.toastr.error('An error occurred');
    }
  }
}
