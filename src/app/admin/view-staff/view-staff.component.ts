import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OvertimeService, ProfileService, IProfileUpdate, IToastr, TOASTR_TOKEN, JQUERY_TOKEN } from 'src/app/shared';

@Component({
  selector: 'app-view-staff',
  templateUrl: './view-staff.component.html',
  styleUrls: ['./view-staff.component.scss']
})
export class ViewStaffComponent implements OnInit {
  staff: IProfileUpdate;
  showCalendar: boolean = false;
  calendar;
  selectedMonths

  showLoader: boolean = true;
  errorMessage: string = '';
  displaySpinner: boolean = false;
  displayAuthoriseSpinner: boolean = false;

  displayModal: string = 'none';

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  async ngOnInit() {
    const staffId = this.route.snapshot.paramMap.get('staffId');
    try {
      const { data } = await this.profileService.fetchSingleStaff(staffId);
      this.staff = data
      this.showLoader = false;
    } catch (error) {
      this.showLoader = false;
      this.errorMessage = 'Unable to load content. Please reload';
    }
  }
  
  runModalDisplay() {
    this.showCalendar = true;
    setTimeout(() => this.initializeDatePicker(), 1);
    this.displayModal = 'block';
  }

  closeModal() {
    this.displayModal = 'none';
    this.showCalendar = false;
  }

  initializeDatePicker(daysToDisable?: number[]) {
    const { preselectMonth, maxDate } = this.calendarPreselectAndMaxDate();
    this.calendar = this.jQuery('#calendar').datepicker({
      inline: true,
      multipleDates: true,
      maxDate,
      onSelect: (fd, airdate, inst) => {
        this.selectedMonths = airdate;
      }
    }).data('datepicker');
    this.calendar.selectDate([preselectMonth])
  }

  calendarPreselectAndMaxDate() {
    const today = new Date();
    const todaysDate = today.getDate();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    const preselectMonth = todaysDate > 8 ? today : new Date(thisYear, thisMonth - 1);
    const maxDate = new Date(thisYear, preselectMonth.getMonth() - 1);
    return { preselectMonth, maxDate };
  }

  async resendLoginCredentials(staffId) {
    this.displaySpinner = true;
    try {
      const { message } = await this.profileService.resendLoginCredentials(staffId);
      this.displaySpinner = false;
      return this.toastr.success(message);
    } catch (error) {
      this.displaySpinner = false;
      if (error.error) return this.toastr.error(error.error.message);
      return this.toastr.error('An error occurred');
    }
  }

  createAuthorisationPayload() {
    const selectedMonths = this.selectedMonths.map((selectedMonth) => {
      const [date, month, year] = selectedMonth.toLocaleDateString().split('/');
      return `${year}/${month}`;
    });

    return {
      staffId: this.staff.staffId,
      extraMonthsPermitted: true,
      extraMonthsData: {
        permittedMonths: selectedMonths.sort(),
        appliedMonths: []
      }
    }
  }

  async permitMultipleMonths() {
    if(this.selectedMonths.length < 2) return this.toastr.error('Please select a month to authorise');
    this.displayAuthoriseSpinner = true;
    
    const payload = this.createAuthorisationPayload();

    try {
      const { message } = await this.profileService.authoriseMultipleClaims(payload);
      this.toastr.success(message);
      this.displayAuthoriseSpinner = false;
      this.closeModal();
    } catch (e) {
      console.log(e)
      this.displayAuthoriseSpinner = false;
      this.toastr.error(e.error.message);
    }
  }
}
