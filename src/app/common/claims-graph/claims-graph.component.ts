import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { JQUERY_TOKEN, OvertimeService, IChartSourceData } from 'src/app/shared';

@Component({
  selector: 'claims-graph',
  templateUrl: './claims-graph.component.html',
  styleUrls: ['./claims-graph.component.scss']
})
export class ClaimsGraphComponent implements OnInit, AfterViewInit {
  
  constructor(
    private overtimeSerice: OvertimeService,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }
  
  title: string = `Claims Report ${new Date().getFullYear()}`;
  description: string = 'Showing statistics for total claims paid monthly'
  padding: any = { left: 15, top: 5, right: 20, bottom: 5 };
  titlePadding: any = { left: 10, top: 0, right: 0, bottom: 10 };
  xAxis = {
    dataField: 'Month',
    title: { text: 'Month' },
    showGridLines: false,
    gridLines: { color: '#CACACA40' }
  }

  valueAxis = {
    minValue: 0,
    maxValue: 500,
    unitInterval: 100,
    title: { text: 'Claims' },
    tickMarks: { color: '#CACACA' },
    gridLines: { color: '#CACACA40' }
  }

  seriesGroups = [{
    type: 'splinearea',
    alignEndPointsWithIntervals: false,
    series: [
      { dataField: 'claims', displayText: 'Claims' }
    ]
  }]

  source: IChartSourceData[] = [];

  ngAfterViewInit() {
    this.jQuery('.jqx-chart-legend-text').remove();
  }

  ngOnInit() {
    this.source = this.createDataForChart(this.overtimeSerice.adminClaimData.chartStats);
  }

  createDataForChart(stats) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(Month => ({ Month, claims: stats[Month] }));
  }
}
