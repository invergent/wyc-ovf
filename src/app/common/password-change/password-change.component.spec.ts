import { PasswordChangeComponent } from './password-change.component';
import {
  authServiceMock, activatedRouteMock, routerMock, mockToastr, overtimeServiceMock, mockJQuery, profileCheckerServiceMock
} from '../../__mocks__';
import { async } from '@angular/core/testing';

jest.useFakeTimers();

const formValues = { newPassword: 'password', confirmPassword: 'password' };
describe('Claim', () => {
  let component: PasswordChangeComponent;

  beforeEach(() => {
    component = new PasswordChangeComponent(
      authServiceMock, overtimeServiceMock, profileCheckerServiceMock, routerMock, activatedRouteMock, mockToastr, mockJQuery
    );
  });

  it('should display flash message and set a listener for clicks', () => {
    component.ngAfterViewInit();
    expect(component.firstTimeLogin).toBeTruthy();
    //@ts-ignore
    component.route.snapshot.queryParams.m = undefined;

    component.ngAfterViewInit();
    expect(component.firstTimeLogin).toBeFalsy();
  });

  it('should close displayed flash message', () => {
    const result = component.closeFlashMessage();
    expect(result).toBeUndefined();
  })
  it('should toggle password input field type between "text" and "password"', () => {
    const jqueryMock = jest.fn(() => ({ prop: () => {} }));
    const newComponent = new PasswordChangeComponent(
      authServiceMock, overtimeServiceMock, profileCheckerServiceMock, routerMock, activatedRouteMock, mockToastr, jqueryMock
    );
    newComponent.toggleViewPasswordText('elementId');
    jest.runAllTimers();

    expect(jqueryMock).toHaveBeenCalledTimes(2);
  });

  it('should fail if new password and confirm password do not match', () => {
    const toastrErrorMock = jest.spyOn(mockToastr, 'error');
    
    component.handleSubmit({ newPassword: 'password', confirmPassword: 'passw' });

    expect(toastrErrorMock).toHaveBeenCalledWith('Passwords do not match');
  });

  it('should successfully change password', async () => {
    const changePasswordMock = jest.spyOn(authServiceMock, 'changePassword');
    const mockOvertimeSync = jest.spyOn(overtimeServiceMock, 'syncWithAPI');
    const toastrSuccessMock = jest.spyOn(mockToastr, 'success');
    
    await component.handleSubmit(formValues);

    expect(changePasswordMock).toHaveBeenCalledWith(formValues);
    expect(mockOvertimeSync).toHaveBeenCalled();
    expect(toastrSuccessMock).toHaveBeenCalledWith('Password changed successfully.');
  });

  it('should display error if an client error occurs', async () => {
    const error = { error: { message: 'Password message' } };
    const changePasswordMock = jest.spyOn(authServiceMock, 'changePassword').mockRejectedValue(error);
    const toastrErrorMock = jest.spyOn(mockToastr, 'error');
    
    await component.handleSubmit(formValues);

    expect(changePasswordMock).toHaveBeenCalledWith(formValues);
    expect(toastrErrorMock).toHaveBeenCalledWith(error.error.message);
  });

  it('should display error if a generic error occurs', async () => {
    const error = { error: { message: 'some error' } };
    const changePasswordMock = jest.spyOn(authServiceMock, 'changePassword').mockRejectedValue(error);
    const toastrErrorMock = jest.spyOn(mockToastr, 'error');
    
    await component.handleSubmit(formValues);

    expect(changePasswordMock).toHaveBeenCalledWith(formValues);
    expect(toastrErrorMock).toHaveBeenCalledWith('An error occurred.');
  });
});
