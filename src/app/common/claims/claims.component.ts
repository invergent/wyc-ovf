import { Component, Input, ViewChild, ElementRef, OnInit, EventEmitter, Output } from '@angular/core';
import { IClaim, OvertimeService, months, ProfileService, IStaffForAdmin } from '../../shared';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {
  @Input() claims: IClaim[] = []
  @Input() claimStatuses: string[] = [];
  @Input() itsFetching: boolean = false;
  @Input() showDetails: boolean = false;
  @Input() showActionButtons: boolean = false;
  @Input() showFilters: boolean = false;
  @Input() showApprovalButtons: boolean = false;
  @Input() componentId: string = '';
  @Output() fetchClaimsEvent = new EventEmitter();
  
  @ViewChild('staffInput') staffInput: ElementRef;
  staffList: IStaffForAdmin[] = [];
  
  claimYears;
  claimMonths;
  page: number = 1;

  year
  month
  status
  requester
  solId
  staffId

  constructor(
    private overtimeService: OvertimeService,
    private profileService: ProfileService
  ) { }

  async ngOnInit() {
    this.setDefaultFilterFields();
    
  }

  ngAfterViewInit() {
    if (this.staffInput) {
      const input = fromEvent(this.staffInput.nativeElement, 'input');
      input
        .pipe(
          map((el: any) => el.target.value.toUpperCase()),
          debounceTime(500)
        ).subscribe(async (value) => {
          this.requester = 999999999; // reset value when user types
          const { data } = await this.profileService.fetchStaff(value, 30, true);
          this.staffList = data;
        });
    }
  }

  handleSelect(staff) {
    this.staffId = staff.staffId
    this.requester = staff.id;
  }

  getClaimMonths() {
    return months.reduce((acc, item, index) => {
      acc.push(index === 0 ? 'All' : item.substr(0, 3));
      return acc;
    }, [])
  }

  setDefaultFilterFields() {
    this.claimYears = this.overtimeService.getClaimYears();
    this.claimMonths = this.getClaimMonths();
    this.year = this.getCurrentClaimMonthYear().year;
    this.month = this.claimMonths[this.getCurrentClaimMonthYear().month + 1];
    this.status = '';
  }

  getCurrentClaimMonthYear() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    return { year: lastMonth.getFullYear(), month: lastMonth.getMonth() };
  }

  async onScroll() {
    this.page += 1;
    this.fetchClaimsEvent.emit(this.getQueries());
  }

  fetchClaims() {
    this.page = 1;
    this.fetchClaimsEvent.emit(this.getQueries());
  }

  onSelectChange() {
    console.log(this.year)
  }

  getQueries() {
    const { year, month, status, requester, solId, page } = this;
    return { year, month, status, requester, solId, page };
  }
}
