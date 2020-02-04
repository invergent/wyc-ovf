import { AdminComponent } from './admin.component';
import { authServiceMock } from '../__mocks__';

describe('AdminComponent', () => {
  let component: AdminComponent;

  beforeEach(() => {
    component = new AdminComponent(authServiceMock)
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
