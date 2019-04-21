import { PasswordResetComponent } from './password-reset.component';
import {
  authenticatorMock, activatedRouteMock, routerMock, mockToastr
} from '../../__mocks__';

jest.useFakeTimers();

describe('Comfirm password reset', () => {
  let component: PasswordResetComponent;

  beforeEach(() => {
    component = new PasswordResetComponent(authenticatorMock, routerMock, activatedRouteMock, mockToastr);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to forgot password is password-reset page was accessed unnaturally.', async () => {
    const newActivateRoute: any = { snapshot: { queryParams: {} } };
    const routerNavigate = jest.spyOn(routerMock, 'navigate');
    const toastrError = jest.spyOn(mockToastr, 'error');
    const newComponent = new PasswordResetComponent(authenticatorMock, routerMock, newActivateRoute, mockToastr);

    newComponent.ngOnInit();

    expect(toastrError).toHaveBeenCalledWith('Unauthorised! Please re-initiate password reset.');
    expect(routerNavigate).toHaveBeenCalledWith(['/forgot-password']);
  });

  it('should toggle passwordFieldType value to "text" and back to password in 1.5 seconds.', async () => {
    component.toggleViewPasswordText();

    expect(component.passwordFieldType).toBe('text');
    jest.runAllTimers();

    expect(component.passwordFieldType).toBe('password');
  });

  it('should fail if reset password entries contain errors.', async () => {
    const toastrError = jest.spyOn(mockToastr, 'error');

    component.handleSubmit({ password: 'password', confirmPassword: 'confirmPassword'});

    expect(component.displaySpinner).toBe(false);
    expect(toastrError).toHaveBeenCalledWith('Passwords do not match');
  });

  it('should successfully reset password and navigate to login page.', async () => {
    const authenticatorReset = jest.spyOn(authenticatorMock, 'resetPassword').mockResolvedValue({ message: 'success' });
    const toastrSuccess = jest.spyOn(mockToastr, 'success');
    const routerNavigate = jest.spyOn(routerMock, 'navigate');

    await component.handleSubmit({ password: 'password', confirmPassword: 'password'});

    expect(authenticatorReset).toHaveBeenCalled();
    expect(toastrSuccess).toHaveBeenCalledWith('success');
    expect(routerNavigate).toHaveBeenCalledWith(['/login']);
  });

  it('should fail with a message if an error occurs.', async () => {
    const authenticatorReset = jest.spyOn(authenticatorMock, 'resetPassword').mockRejectedValue('err');
    const toastrError = jest.spyOn(mockToastr, 'error');

    await component.handleSubmit({ password: 'password', confirmPassword: 'password'});

    expect(authenticatorReset).toHaveBeenCalled();
    expect(component.displaySpinner).toBe(false);
    expect(toastrError).toHaveBeenCalledWith('Password reset failed.');
  });
});
