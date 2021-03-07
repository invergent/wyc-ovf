import { Component, Input, ViewChild, ElementRef, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { IClaim, OvertimeService, months, ProfileService, IStaffForAdmin, TOASTR_TOKEN, IToastr } from '../../shared';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Component({
  selector: 'claims',
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {
  @Input() claims: IClaim[] = []
  @Input() claimCount: number
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

  displaySpinnerExport

  constructor(
    private overtimeService: OvertimeService,
    private profileService: ProfileService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
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

  async setDefaultFilterFields() {
    this.claimMonths = this.getClaimMonths();
    this.year = this.getCurrentClaimMonthYear().year;
    this.month = this.claimMonths[this.getCurrentClaimMonthYear().month + 1];
    this.status = '';
    const { data: years } = await this.overtimeService.getClaimYears();
    this.claimYears = years;
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

  getQueries() {
    const { year, month, status, requester, solId, page } = this;
    return { year, month, status, requester, solId, page };
  }

  exportType(docType) {
    const types = {
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv;charset=utf-8;',
      pdf: 'application/pdf'
    }
    return types[docType];
  }

  async exportClaims(docType) {
    this.displaySpinnerExport = true;

    const type = this.exportType(docType);
    const queries = this.getQueries();

    try {
      const excelBlob = await this.overtimeService.exportApprovedClaims(docType, queries);
      const blob = new Blob([excelBlob], { type });
      saveAs(blob, `Claims (${new Date().toDateString().substr(4)})`);
      this.displaySpinnerExport = false;
    } catch (error) {
      this.displaySpinnerExport = false;
      this.toastr.error('Error exporting claims');
    }
  }
}
