import { ChangePasswordComponent } from './change-password.component';
import {
  authServiceMock, activatedRouteMock, routerMock, mockToastr
} from '../../__mocks__';

describe('Comfirm password reset', () => {
  let component: ChangePasswordComponent;

  beforeEach(() => {
    component = new ChangePasswordComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
