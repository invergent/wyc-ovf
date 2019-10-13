import { Component, OnInit, Inject, Input } from '@angular/core';
import { JQUERY_TOKEN, OvertimeService, IClaim, TOASTR_TOKEN, IToastr, AuthService } from 'src/app/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'claim-details',
  templateUrl: './claim-details.component.html',
  styleUrls: ['./claim-details.component.scss']
})
export class ClaimDetailsComponent implements OnInit {
  @Input() claim: IClaim
  @Input() showDetails: boolean;
  @Input() canModify: boolean;
  claimDetails: any = {};
  elementsClassNames = {
    overtime: 'overtime',
    weekend: 'weekend',
    shiftDuty: 'shiftDuty',
    atmDuty: 'atmDuty',
    atmSupport: 'atmSupport',
    holiday: 'holiday'
  }
  claimElements: string[] = ['overtime', 'weekend', 'shiftDuty', 'atmDuty', 'atmSupport', 'holiday', 'outstation'];
  selectedElements: string[] = [];

  showLoader: boolean = true;
  errorMessage: string = '';
  displayModal: string = 'none';
  displayCancelSpinner: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private overtimeService: OvertimeService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  ngOnInit() {
    if (!this.claim.details.visiblePaneItems) {
      this.claimDetails = JSON.parse(this.claim.details);
    } else {
      this.claimDetails = this.claim.details;
    }
    this.selectedElements = Object.keys(this.claimDetails).filter(element => this.claimElements.includes(element));
    this.attachUniqueIdToElement(this.claim.id);
    this.initializeDatePicker(`#calendar${this.claim.id}`, this.claimDetails.applyingMonth);
  }

  initializeDatePicker(element: string, applyingMonth: string) {
    this.jQuery(element).datepicker({
      inline: true,
      firstDay: 1,
      minDate: this.overtimeService.claimMonthDate(applyingMonth),
      maxDate: this.overtimeService.claimMonthDate(applyingMonth, 'lastDay'),
      onRenderCell: (date, cellType) => {
        let classes = 'selected-custom-cell ';
        const isoDate = date.toISOString();
        const customStyle = this.styleDayCellForClaimType(isoDate);
        if (customStyle) classes = customStyle;
        return { disabled: true, classes }
      }
    }).data('datepicker');
  }

  attachUniqueIdToElement(claimId) {
    this.jQuery('#calendar').prop('id', `calendar${claimId}`)
  }

  styleDayCellForClaimType(calendarDate) {
    return this.selectedElements.reduce((acc, item) => {
      if (this.claimDetails[item].selectedDates) {
        const itsPresent = this.claimDetails[item].selectedDates.includes(calendarDate);
        // itsPresent would be true for only one claim element at a time
        if (itsPresent) {
          acc += `${this.elementsClassNames[item]}-bg`;
          return acc;
        }
      }
      return acc;
    }, '')
  }

  async cancelClaim() {
    try {
      await this.overtimeService.cancelClaim(this.claim.id);
      await this.overtimeService.syncWithAPI();
      await this.authService.syncWithAPI(); // we need current state of extraMonthsData
      this.toastr.success('Claim cancelled successfully!');
      return this.router.navigate(['/staff/claim-history']);
    } catch(e) {
      this.displayModal = 'none';
      return this.toastr.error(e.error.message || 'Unable to cancel claim.');
    }
  }
}
