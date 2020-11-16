import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService, IProfileUpdate, IToastr, TOASTR_TOKEN, JQUERY_TOKEN } from 'src/app/shared';

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
  displayActionSpinner: boolean = false;

  displayModal: string = 'none';
  currentModal: string
  modalTitle: string
  removeStaffModal: boolean;
  calendarModal: boolean;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private router: Router,
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

  runModalDisplay(modal, title) {
    this.modalTitle = title;
    this.displayModal = 'block';
    this.currentModal = modal;
    setTimeout(() => this.initializeDatePicker(), 1);
    this[modal] = true;
  }

  closeModal(modal) {
    this.displayModal = 'none';
    this[modal] = false;
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
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();
    const preselectMonth = new Date(thisYear, thisMonth - 1);
    const maxDate = new Date(thisYear, preselectMonth.getMonth() - 1);
    return { preselectMonth, maxDate };
  }

  async runAuthorisation(staffId, action) {
    this.displaySpinner = true;
    try {
      const { message } = await this.profileService[action](staffId);
      this.displaySpinner = false;
      return this.toastr.success(message);
    } catch (error) {
      this.displaySpinner = false;
      if (error.error) return this.toastr.error(error.error.message);
      return this.toastr.error('An error occurred');
    }
  }

  convertToDateString(date) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }

  createAuthorisationPayload() {
    const selectedMonths = this.selectedMonths.map((selectedMonth) => {
      const [date, month, year] = this.convertToDateString(selectedMonth).split('/');
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

  async handleSubmit() {
    let payload;
    const method = this.currentModal === 'calendarModal' ? 'authoriseMultipleClaims' : 'removeStaff';
    if (method === 'authoriseMultipleClaims') {
      if(this.selectedMonths.length < 2) return this.toastr.error('Please select a month to authorise');
      
      payload = this.createAuthorisationPayload();
    }

    this.displayActionSpinner = true;

    try {
      const { message } = await this.profileService[method](payload || this.staff.staffId);
      this.toastr.success(message);
      await this.profileService.syncWithAPI(true);
      this.displayActionSpinner = false;
      if (method === 'removeStaff') return this.router.navigate(['/admin/staff']);
      this.closeModal(this.currentModal);
    } catch (e) {
      this.displayActionSpinner = false;
      this.toastr.error(e.error.message);
    }
  }
}
