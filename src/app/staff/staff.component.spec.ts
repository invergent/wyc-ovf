import { StaffComponent } from './staff.component';
import {
  authServiceMock, activatedRouteMock, routerMock, mockToastr
} from '../__mocks__';

describe('Comfirm password reset', () => {
  let component: StaffComponent;

  beforeEach(() => {
    component = new StaffComponent();
  });

  it('should toggle the left value of the sideNavLeft', () => {
    component.toggleSideNav('self');
    expect(component.sideNavLeft).toBe('0');

    component.toggleSideNav('self');
    expect(component.sideNavLeft).toBe('-300px');
  });

  it('should force close sidenav if open when navItems are clicked', () => {
    component.toggleSideNav('navItem');
    expect(component.sideNavLeft).toBe('-300px');
  });
});
