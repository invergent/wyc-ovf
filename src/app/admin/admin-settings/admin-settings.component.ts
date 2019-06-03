import { Component, OnInit, Inject } from '@angular/core';
import { SettingsService, ISettings, JQUERY_TOKEN, dateRegex, TOASTR_TOKEN, IToastr } from '../../shared';
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

  emailSchedule

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
  }

  runModalDisplay(modal, title, element) {
    this.modalTitle = title;
    this.displayModal = 'block';
    this.currentModal = modal;
    this[modal] = true;
    if (element) {
      setTimeout(() => this.jQuery(element).datepicker({ firstDay: 1 }).data('datepicker'), 200);
      setTimeout(() => this.jQuery('#datepickers-container').css('z-index', '99999'), 400);
    }
  }

  validateDateEntry() {
    const data: any = {};
    const errorMessage = 'Entry is invalid! Please select a date from the calendar.';
    const input = this.jQuery('#emailScheduleInput').val();
    console.log(input)
    const dates = input.split(', ');

    if(!dateRegex.test(dates[0])) {
      data.error = errorMessage;
      return data;
    } 

    const cronTimeDays = dates.reduce((acc, date) => {
      const dayOfMonth = date.split('/')[1];
      if (acc.length === 0) {
        acc += dayOfMonth;
      } else {
        acc += `,${dayOfMonth}`;
      }
      return acc;
    }, '');

    data.cronTime = `0 6 ${cronTimeDays} * *`;

    return data;
  }

  closeModal(modal) {
    this.displayModal = 'none';
    this[modal] = false;
  }

  async handleSubmit(currentModal) {
    const data = this.validateDateEntry();
    console.log(data)
    if (data.error) return this.toastr.error(data.error);

    try {
      const { message } = await this.settingsService.updateEmailingSetting(data.cronTime);
      this.toastr.success(message);

      await this.settingsService.syncWithAPI();
      await this.initialiseData();

      this.closeModal(currentModal);
      this.displaySpinner = false;
    } catch (error) {
      if (error.error) return error.error.errors.forEach(error => this.toastr.error(error))
      return this.toastr.error('An error occurred');
    }
  }
}
