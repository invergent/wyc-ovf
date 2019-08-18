import { Component, OnInit, Inject, Input } from '@angular/core';
import { JQUERY_TOKEN, OvertimeService, IClaim } from 'src/app/shared';

@Component({
  selector: 'claim-details',
  templateUrl: './claim-details.component.html',
  styleUrls: ['./claim-details.component.scss']
})
export class ClaimDetailsComponent implements OnInit {
  @Input() claim: IClaim
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

  constructor(
    private overtimeService: OvertimeService,
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
    this.initializeDatePicker(`#calendar${this.claim.id}`);
  }

  initializeDatePicker(element: string) {
    this.jQuery(element).datepicker({
      inline: true,
      firstDay: 1,
      minDate: this.overtimeService.previousMonthDate(1),
      maxDate: this.overtimeService.previousMonthDate(),
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

}
