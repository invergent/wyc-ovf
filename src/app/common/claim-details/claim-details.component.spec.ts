import { ClaimDetailsComponent } from './claim-details.component';
import { mockJQuery, overtimeServiceMock, routerMock, mockToastr, authServiceMock } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: ClaimDetailsComponent;

  beforeEach(() => {
    component = new ClaimDetailsComponent(routerMock, authServiceMock, overtimeServiceMock, mockToastr, mockJQuery)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
