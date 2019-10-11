import { Component, OnInit, Inject } from '@angular/core';
import { JQUERY_TOKEN, OvertimeService, TOASTR_TOKEN, IToastr } from 'src/app/shared';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent implements OnInit {
  preSelectedHolidays
  holidays = [];
  holidayCalendar
  canSelect: boolean = false;

  constructor(
    private overtimeService: OvertimeService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  async ngOnInit() {
    const { data: holidays } = await this.overtimeService.fetchHolidays();
    this.preSelectedHolidays = holidays.map((holiday) => new Date(holiday.fullDate));
    // keep a copy of the dates in date string at the start for comparism when new dates are selected
    this.holidays = this.preSelectedHolidays.map(date => date.toLocaleDateString())
    this.initializeDatePicker('#calendar', [6,0]);
    this.styleCalendar();
  }

  // async ngOnInit() {
  //   this.initializeDatePicker('#calendar', [6,0]);
  //   const adminData = await this.overtimeService.fetchAdminData();
  //   this.holidays = adminData.holidays.map((holiday) => ({
  //     name: holiday.name, date: new Date(holiday.date).toDateString()
  //   }));
  //   this.styleCalendar();
  // }

  initializeDatePicker(element: string, daysToDisable?: number[]) {
    this.holidayCalendar = this.jQuery(element).datepicker({
      inline: true,
      multipleDates: true,
      firstDay: 1,
      onRenderCell: (date, cellType) => {
        if (daysToDisable) {
          return { disabled: daysToDisable.includes(date.getDay()) };
        }
        if (daysToDisable) {
          return { disabled: daysToDisable.includes(date.getDay()) };
        }
      },
      onSelect: (fd, airdate, inst) => {
        if (this.canSelect) {
          const addedDate = airdate[inst.selectedDates.length - 1];
          const selectedDates = inst.selectedDates.map(date => date.toLocaleDateString());
          const removedDate = this.holidays.filter(date => !selectedDates.includes(date));

          if (removedDate.length) {
            const [date, month, year] = removedDate[0].split('/');
            this.removeHoliday(new Date(`${year}/${month}/${date}`).toISOString())
          } else {
            const [day, month, year] = addedDate.toLocaleDateString().split('/')
            const datePayload = {
              yearMonth: `${year}/${month}`,
              fullDate: addedDate.toISOString()
            }
            this.addHoliday(datePayload);
          }

          // reset holidays to the currently selected holidays
          this.holidays = selectedDates;
        }
      }
    }).data('datepicker');
    this.holidayCalendar.selectDate(this.preSelectedHolidays);
    this.canSelect = true; // Runs logic in onSelect only after initialisation
  }

  styleCalendar() {
    this.jQuery('.datepicker').css({ margin: 'auto' })
  }

  async addHoliday(datePayload: any) {
    try {
      const { message } = await this.overtimeService.addHoliday(datePayload);
      return this.toastr.success(message);
    } catch (error) {
      return this.toastr.error('An error occurred');
    }
  }

  async removeHoliday(fullDate: string) {
    try {
      const { message } = await this.overtimeService.removeHoliday(fullDate);
      return this.toastr.success(message);
    } catch (error) {
      return this.toastr.error('An error occurred');
    }
  }
}
