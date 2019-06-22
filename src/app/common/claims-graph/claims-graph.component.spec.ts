import { ClaimsGraphComponent } from './claims-graph.component';
import { mockJQuery, overtimeServiceMock } from 'src/app/__mocks__';

describe('ClaimsGraphComponent', () => {
  let component: ClaimsGraphComponent;

  beforeEach(() => {
    component = new ClaimsGraphComponent(overtimeServiceMock, mockJQuery);
  });

  it('should remove jqxcharts hyperlink', () => {
    const mockRemove = jest.fn();
    const jqMock = jest.fn(() => ({ remove: mockRemove}));
    const newComponent = new ClaimsGraphComponent(overtimeServiceMock, jqMock);

    newComponent.ngAfterViewInit();

    expect(mockRemove).toHaveBeenCalled();
  });

  it('should create source data for charts', () => {
    component.ngOnInit();

    expect(component.source).toHaveLength(12);
  });
});
