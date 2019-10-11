import { ClaimDetailsComponent } from './claim-details.component';
import { mockJQuery, overtimeServiceMock, routerMock, mockToastr } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: ClaimDetailsComponent;

  beforeEach(() => {
    component = new ClaimDetailsComponent(routerMock, overtimeServiceMock, mockToastr, mockJQuery)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
