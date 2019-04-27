import { TopNav } from './top-nav.component';
import {
  authServiceMock, activatedRouteMock, routerMock, mockToastr
} from '../../__mocks__';

describe('Comfirm password reset', () => {
  let component: TopNav;

  beforeEach(() => {
    component = new TopNav();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit an event', () => {
    const emitMethod = jest.spyOn(component.sideNavToggleEvent, 'emit');
    component.toggleSideNav();
    expect(emitMethod).toHaveBeenCalled();
  });
});
