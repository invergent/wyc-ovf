import { StaffComponent } from './staff.component';
import {
  authServiceMock, activatedRouteMock, routerMock, mockToastr
} from '../__mocks__';

describe('Comfirm password reset', () => {
  let component: StaffComponent;

  beforeEach(() => {
    component = new StaffComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the left value of the sideNavLeft', () => {
    component.toggleSideNav();
    expect(component.sideNavLeft).toBe('0');

    component.toggleSideNav();
    expect(component.sideNavLeft).toBe('-300px');
  });
});
