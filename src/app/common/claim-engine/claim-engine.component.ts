import { Component, OnInit, Inject, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
  JQUERY_TOKEN, AuthService, dateRegex, TOASTR_TOKEN, IToastr,
  OvertimeService, ISettings, SettingsService, claimPrice, LOCALSTORAGE_TOKEN,
  ILocalStorage, IStaffClaimData, IClaim, months
} from '../../shared';

@Component({
  selector: 'claim-engine',
  templateUrl: './claim-engine.component.html',
  styleUrls: ['./claim-engine.component.scss']
})
export class ClaimEngineComponent implements OnInit {
  @Input() callingComponent: string = '';
  @Input() claim: IClaim;
  @Input() applyingMonth: string;
  @Output() claimMonthProcessedEvent = new EventEmitter();

  staffId: string

  // claim
  total: number = 0;

  // claims button controls
  overtimeClicked: boolean = false;
  weekendClicked: boolean = false;
  shiftDutyClicked: boolean = false;
  atmDutyClicked: boolean = false;
  atmSupportClicked: boolean = false;
  holidayClicked: boolean = false;
  outstationClicked: boolean = false;
  claimBtns: string[] = ['overtime', 'weekend', 'shiftDuty', 'atmDuty', 'atmSupport', 'holiday', 'outstation'];
  currentlyPressedBtn: string;

  // pane controls
  outstation: number = 0;

  showCalendarPlaceholder: boolean = true;
  showSummaryPlaceholder: boolean = true;

  // visible panes controls
  visiblePaneItems: number = 0;
  currentPane: string = 'calendar';

  allSelectedDates: number[] = [];
  disableWeekdays = [1,2,3,4,5];
  disableWeekends = [6,0];
  holidaysInClaimMonth: number[] = [];

  claimRequest: any = {};

  autoSaveId: string;

  // window controls
  screenWidth

  // modal controls
  displayModal: string = 'none';
  confirmSubmit: boolean = false;


  staffRole: string;
  weekend
  displaySpinner = false;
  displaySubmitSpinner: boolean = false;

  claimMonthDate: Date;
  totalDaysInClaimMonth: number;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private authService: AuthService,
    private overtimeService: OvertimeService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery,
    @Inject(LOCALSTORAGE_TOKEN) private save: ILocalStorage
  ) { }

  async ngOnInit() {
    if (!this.applyingMonth) {
      this.applyingMonth = this.overtimeService.currentClaimYearMonth();
    }
    this.screenWidth = window.innerWidth;
    this.staffRole = this.authService.currentStaff.role;
    this.staffId = this.authService.currentStaff.staffId;
    this.autoSaveId = `${this.staffId}${this.applyingMonth}`;

    const previousWork = this.claim ? this.claim.details : this.save.getItem(this.autoSaveId);
    if (previousWork) this.restorePreviousWork(previousWork);

    // set dates and counters values
    this.claimMonthDate = this.overtimeService.claimMonthDate(`${this.applyingMonth}/2`);
    this.totalDaysInClaimMonth = this.claimMonthDate.getDate();
    // get holidays for the claim month
    const { data: holidays } = await this.overtimeService.fetchHolidays(this.applyingMonth);
    this.holidaysInClaimMonth = holidays.map(holiday => new Date(holiday.fullDate).getDate());
  }

  initializeDatePicker(element: string, datesToDisable?: number[], daysToDisable?: number[]) {
    const prop = element.substr(1).split('-calendar')[0];
    let preSelectedDates = [];
    let selfSelectDates = [];

    if (this[prop]) {
      preSelectedDates = this[prop].selectedDates;
      selfSelectDates = preSelectedDates.map(date => date.getDate());
    }
    if (prop === 'overtime') {
      // merge holidays uniquely to datesToDisable for overtime calendar
      const holidaysAdded = datesToDisable.concat(this.holidaysInClaimMonth);
      datesToDisable = holidaysAdded.filter((date, index) => holidaysAdded.indexOf(date) === index);
    }

    this[prop] = this.jQuery(element).datepicker({
      inline: true,
      multipleDates: true,
      startDate: this.claimMonthDate,
      firstDay: 1,
      minDate: this.claimMonthDate,
      maxDate: this.overtimeService.claimMonthDate(this.applyingMonth, 'lastDay'),
      onRenderCell: (date, cellType) => {
        if (cellType === 'day' && datesToDisable.length) {
          // do not disable selected days on a calendar on which they were selected
          const disabled = datesToDisable.includes(date.getDate()) && !selfSelectDates.includes(date.getDate());
          if (disabled) return { disabled };
        }
        if (prop === 'holiday') {
          return { disabled: !this.holidaysInClaimMonth.includes(date.getDate()) };
        }
        if (cellType === 'day' && daysToDisable) {
          return { disabled: daysToDisable.includes(date.getDay()) };
        }
      },
      onSelect: () => {
        this.mergeAllSelectedDates();
        this.calculateClaimAmount();
        this.autoSave();
      }
    }).data('datepicker');

    if (preSelectedDates.length) this[prop].selectDate(preSelectedDates);
  }

  toggleButtonPress(clickedButton, daysToDisable?: number[]) {
    const claimItem = clickedButton.split('Clicked')[0];
    this[clickedButton] = this[clickedButton] ? false : true;
    
    if (this[clickedButton]) {
      if (this.currentPane === 'summary') this.switchPane();
      this.showCalendarPlaceholder = false;
      this.showSummaryPlaceholder = false;

      // no do increment for already visible panes
      if (!this[claimItem]) this.visiblePaneItems += 1;
      
      // if button is turned on, ensure others are turned off
      this.claimBtns.forEach(btn => `${btn}Clicked` === clickedButton ? '' : (this[`${btn}Clicked`] = false));
      
      setTimeout(() => {
        // check if a calendar is currently displayed, animate removal before initialising a new one
        if (this.currentlyPressedBtn) this.fadeOutCalendar(this.currentlyPressedBtn);
        if (claimItem !== 'outstation') {
          this.initializeDatePicker(`#${claimItem}-calendar`, this.allSelectedDates, daysToDisable);
        }

        this.fadeInCalendar(claimItem);
        this.slideInPaneItem(claimItem);
        this.currentlyPressedBtn = claimItem;
      }, 1);
    } else {
      this.fadeOutCalendar(this.currentlyPressedBtn);
      this.currentlyPressedBtn = null;
      // wait for calendar to disappear before displaying placeholder text
      setTimeout(() => (this.showCalendarPlaceholder = true), 1000);
    }
  }

  slideInPaneItem(claimItem) {
    const paneEl = this.jQuery(`#${claimItem}`).css({ display: 'flex' });
    setTimeout(() => paneEl.css({ marginLeft: '0', opacity: '1'}), 100);
  }

  removePaneItem(claimItem) {
    this.visiblePaneItems -= 1;

    // slide left and disappear
    const paneEl = this.jQuery(`#${claimItem}`).css({ marginLeft: '-100px', opacity: '0'});
    setTimeout(() => paneEl.css({ display: 'none' }), 1000);

    if (claimItem === 'outstation') {
      this[claimItem] = 0;
    } else {
      this[claimItem].clear ? this[claimItem].clear() : (this[claimItem].selectedDates = []);
    }

    if (claimItem === this.currentlyPressedBtn && this[`${claimItem}Clicked`]) {
      this.toggleButtonPress(`${claimItem}Clicked`);
    } 
    setTimeout(() => {
      this[claimItem] = null;
      this.calculateClaimAmount();
      this.autoSave();
    }, 950);

    if (this.visiblePaneItems < 1) {
      setTimeout(() => {
        this.save.removeItem(this.autoSaveId);
        this.showSummaryPlaceholder = true
      }, 1000);
    }
  }

  fadeInCalendar(calendarId) {
    const isOutstation = calendarId === 'outstation';
    // wait for fade out to finish before fading in
    setTimeout(() => {
      const calendar = this.jQuery(`#${calendarId}${isOutstation ? '-input' : '-calendar'}`)
        .css({ transition: 'all 1s ease-out' });
      calendar.css({ opacity: '1' });
    }, 400);
  }
  
  fadeOutCalendar(currentCalendarId) {
    const calendar = this.jQuery(`#${currentCalendarId}-calendar`).css({ transition: 'all .3s ease-out' });
    setTimeout(() => calendar.css({ opacity: '0' }), 50);
  }

  mergeAllSelectedDates() {
    const arrayOfArrayOfDates = this.claimBtns.map((btnName) => {
      if (!this[btnName] || (btnName === 'outstation')) return [];
      return this[btnName].selectedDates.map(date => date.getDate());
    });
    this.allSelectedDates = Array.prototype.concat(...arrayOfArrayOfDates);
  }

  handleInput(input) {
    this.outstation = input;
    this.calculateClaimAmount();
    this.autoSave();
  }

  switchPane() {
    const calendarPane = this.jQuery('.calendar-pane');
    const summaryPane = this.jQuery('.summary-pane');
    if (this.currentPane === 'calendar') {
      this.currentPane = 'summary';
      calendarPane.css({ opacity: '0' });
      setTimeout(() => calendarPane.css({ display: 'none' }), 300);
      setTimeout(() => summaryPane.css({ display: 'block' }), 290)
      setTimeout(() => summaryPane.css({ opacity: '1' }), 300)
    } else {
      this.currentPane = 'calendar';
      summaryPane.css({ opacity: '0' });
      setTimeout(() => summaryPane.css({ display: 'none' }), 400);
      setTimeout(() => calendarPane.css({ display: 'block' }), 410)
      setTimeout(() => calendarPane.css({ opacity: '1' }), 420)
    }
  }

  calculateClaimAmount() {
    const calcClaim = (acc, item) => {
      if (this[item]) {
        return item === 'outstation'
          ? (acc += +this[item])
          : (acc += (this[item].selectedDates.length * claimPrice[item]));
      }
      return acc;
    }
    this.total = this.claimBtns.reduce(calcClaim, 0);
  }

  autoSave(submit?: boolean) {
    const savedWork = this.claimBtns.reduce((acc, item) => {
      if (this[item]) {
        if (item === 'outstation') {
          acc[item] = this[item];
        } else if (this[item].selectedDates.length) {
          acc[item] = { selectedDates: this[item].selectedDates };
        }
        return acc;
      }
      return acc;
    }, {});
    
    savedWork['visiblePaneItems'] = Object.keys(savedWork).length;
    savedWork['allSelectedDates'] = this.allSelectedDates;
    savedWork['total'] = this.total;
    savedWork['currentlyPressedBtn'] = this.currentlyPressedBtn;
    savedWork['applyingMonth']= this.applyingMonth;
    if (submit) return savedWork;
    this.save.setItem(this.autoSaveId, JSON.stringify(savedWork));
  }

  restorePreviousWork(previousWork) {
    const savedWork = JSON.parse(previousWork);
    this.showSummaryPlaceholder = false;

    Object.keys(savedWork).forEach((claimName) => {
      this[claimName] = savedWork[claimName];
      if (this.claimBtns.includes(claimName)) {
        let { selectedDates } = this[claimName];
        if (selectedDates) this[claimName].selectedDates = selectedDates.map(date => new Date(date));
        setTimeout(() => this.slideInPaneItem(claimName), 100);
      }
    });
  }

  toggleModal(displayType) {
    this.claimRequest = this.createClaimRequest(this.applyingMonth);
    if (!this.claimRequest.claimElements) return this.toastr.error('Claim request is empty');

    this.displayModal = displayType;
    if (displayType === 'block') {
      this.confirmSubmit = true;
    } else {
      this.confirmSubmit = false;
    }
  }

  createClaimRequest(yearMonth) {
    const createdClaim = this.autoSave(true);
    const [year, month] = yearMonth.split('/');
    return {
      monthOfClaim: `${months[Number(month)].substr(0, 3)}, ${year}`,
      claimElements: createdClaim['visiblePaneItems'],
      amount: createdClaim['total'],
      details: JSON.stringify(createdClaim)
    }
  }

  async handleSubmit() {
    this.displaySubmitSpinner = true;
    const method = `${this.callingComponent.includes('Update') ? 'update' : 'create'}OvertimeRequest`;
    const claimId = this.callingComponent.includes('Update') ? this.claim.id : null;

    try {
      const { message } = await this.overtimeService[method](this.claimRequest, claimId);

      await this.overtimeService.syncWithAPI();
      this.toastr.success(message);
      this.save.removeItem(this.autoSaveId);
      this.claimMonthProcessedEvent.emit(this.applyingMonth);

      return this.router.navigate(['/staff/dashboard']);
    } catch(e) {
      this.displaySubmitSpinner = false;
      this.toggleModal('none');
      if (e.error.errors) {
        return e.error.errors.forEach(error => this.toastr.error(error));
      }
      return this.toastr.error(e.error.message || 'An error occurred. Check your connectivity.');
    }
  }
}
