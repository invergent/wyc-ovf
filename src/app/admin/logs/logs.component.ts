import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import {
  LogService, ILogData, ProfileService, IStaffForAdmin, TOASTR_TOKEN,
  IToastr, JQUERY_TOKEN, pdfSetup, months
} from '../../shared';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  staffId
  period: string = ''
  range
  isRange: boolean = false;
  logs: ILogData[];
  staffList: IStaffForAdmin[] = [];

  // modal controls
  displayCalendarModal: string = 'none';
  logsCalendar

  from: string
  to: string

  userFocused: boolean

  showSpinner: boolean = true;
  smallSpinner: boolean = false;
  @ViewChild('staffInput') staffInput: ElementRef;

  page: number = 1;


  constructor(
    private logger: LogService,
    private profileService: ProfileService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  async ngOnInit() {
    const { data } = await this.logger.fetchLogs({ page: this.page });
    const { staffList } = await this.profileService.fetchProfileData(true);
    this.logs = data;
    this.staffList = staffList;
    this.showSpinner = false;
  }

  ngAfterViewInit() {
    const input = fromEvent(this.staffInput.nativeElement, 'input');
    input
      .pipe(
        map((el: any) => el.target.value.toUpperCase()),
        debounceTime(500)
      ).subscribe(async (value) => {
        const { data } = await this.profileService.fetchStaff(value, 30);
        this.staffList = data;
      })
  }

  toggleModal(show: boolean, updateRange?: boolean) {
    if (show) this.initializeDatePicker('#logs-calendar');
    if (updateRange) {
      const message = this.updateRangeInput();
      if (message) return this.toastr.error(message);
    }
    this.displayCalendarModal = show ? 'block' : 'none';
  }

  initializeDatePicker(element: string) {
    this.logsCalendar = this.jQuery(element).datepicker({
      inline: true,
      range: true,
      firstDay: 1,
      startDate: new Date(),
      onSelect: (fd, airdate, inst) => this.handleDateSelection(airdate)
    }).data('datepicker');
  }

  updateRangeInput() {
    if (!this.from) return 'Please select a date';
    this.range = this.to ? `${this.from} — ${this.to}` : `${this.from}`;
    this.logsCalendar.selectedDates = [];
  }

  handleDateSelection(dates) {
    if (dates) {
      this.from = this.convertDateToDateString(dates[0]);
      this.to = dates[1] ? this.convertDateToDateString(dates[1]) : '';
    } else {
      this.from = '';
      this.to = '';
    }
  }

  convertDateToDateString(airdate) {
    const [day, month, date, year] = airdate.toDateString().split(' ');
    return `${date}-${month}-${year}`;
  }

  convertTodayToDateString() {
    const [day, month, date, year] = new Date(Date.now()).toDateString().split(' ');
    return `${date}-${month}-${year}`;
  }

  convertToISORange(range) {
    if (!range) return;
    let minDate;
    let maxDate;
    
    if (range === 'today') {
      const today = this.convertTodayToDateString();
      minDate = today;
      maxDate = today;
    } else {
      const range = this.range.split(' — ');
      minDate = range[0];
      maxDate = range[range.length === 1 ? 0 : 1];
    }
    return `${new Date(minDate).toISOString()}_${new Date(`${maxDate} 23:59`).toISOString()}`;
  }

  async onScroll() {
    this.smallSpinner = true;
    this.page += 1;

    const logs = await this.fetchLogs();
    this.logs = [...this.logs, ...logs];
    this.smallSpinner = false;
  }

  onSelectChange() {
    this.isRange = this.period === 'range';
  }

  handleSelect(staffId) {
    this.staffId = staffId
  }

  getPeriod() {
    return this.isRange ? this.range : this.period;
  }

  getQueries(exportable?: boolean) {
    const periodIso = this.convertToISORange(this.getPeriod());
    return { period: periodIso, staffId: this.staffId, page: this.page, exportable };
  }

  async fetchLogs(exportable?: boolean): Promise<ILogData[]> {
    const queries = this.getQueries(exportable);
    try {
      const { data } = await this.logger.fetchLogs(queries);
      return data;
    } catch (error) {
      this.toastr.error(error.error ? error.error.message : 'An error occurred');
      return [];
    }
  }

  async runLogsfetch() {
    this.page = 1; // reset page
    this.logs = await this.fetchLogs();
  }

  convertIsoDateToWords(date) {
    const [year, month, daysdate] = date.split('T')[0].split('-');
    return `${months[+month]} ${daysdate}, ${year}`;
  }

  makeIsoDateHumanReadable() {
    const date = this.convertToISORange(this.getPeriod());
    const [min, max] = date.split('_');
    return `${this.convertIsoDateToWords(min)} to ${this.convertIsoDateToWords(max)}`;
  }

  prepareLogsDataForExport(data) {
    return data.map((log) => {
      const { createdAt, staffId, activity, creator: { firstname, lastname } } = log;
      return [createdAt, staffId, `${firstname} ${lastname}`, activity];
    })
  }

  async exportLogs() {
    if (!this.getPeriod()) return this.toastr.error('Please specify a date range');

    const data = await this.fetchLogs(true);
    const logs = this.prepareLogsDataForExport(data);
    const period = this.makeIsoDateHumanReadable();
    const docDefinition = pdfSetup(period, logs);
    pdfMake.createPdf(docDefinition).download('Logs');
  }
}
