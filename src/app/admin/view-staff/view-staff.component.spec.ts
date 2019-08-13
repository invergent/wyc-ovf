import { ViewStaffComponent } from './view-staff.component';
import { activatedRouteMock, profileServiceMock } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: ViewStaffComponent;

  beforeEach(() => {
    component = new ViewStaffComponent(activatedRouteMock, profileServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
