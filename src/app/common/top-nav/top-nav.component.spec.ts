import { TopNav } from './top-nav.component';
import {
  authServiceMock, activatedRouteMock, routerMock, mockToastr
} from '../../__mocks__';

describe('Comfirm password reset', () => {
  let component: TopNav;

  beforeEach(() => {
    component = new TopNav();
  });

  it('should emit an event', () => {
    const emitMethod = jest.spyOn(component.sideNavToggleEvent, 'emit');
    component.toggleSideNav();
    expect(emitMethod).toHaveBeenCalled();
  });

  it('should toggle nav items', () => {
    expect(component.profileMenuOpened).toBe(false);
    expect(component.notificationMenuOpened).toBe(false);

    component.toggleNavItems('profileMenuOpened');

    expect(component.profileMenuOpened).toBe(true);
    expect(component.notificationMenuOpened).toBe(false);

    component.toggleNavItems('notificationMenuOpened');

    expect(component.profileMenuOpened).toBe(false);
    expect(component.notificationMenuOpened).toBe(true);

    component.toggleNavItems('notificationMenuOpened');

    expect(component.profileMenuOpened).toBe(false);
    expect(component.notificationMenuOpened).toBe(false);
  });
});
