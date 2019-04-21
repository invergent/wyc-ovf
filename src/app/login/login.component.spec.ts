import { LoginComponent } from './login.component';
import { authenticatorMock, mockToastr, routerMock } from '../__mocks__';

jest.useFakeTimers();

describe('LoginComponent', () => {
  let component: LoginComponent;

  beforeEach(() => {
    component = new LoginComponent(authenticatorMock, routerMock, mockToastr);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return errors if provided staffId fails staffIdRegex test.', async () => {
    const toastrError = jest.spyOn(mockToastr, 'error');

    await component.handleSubmit({ staffId: 'someStaffID', password: 'somePassword' });

    expect(toastrError).toHaveBeenCalled();
  });

  it('should toggle passwordFieldType value to "text" and back to password in 1.5 seconds.', async () => {
    component.toggleViewPasswordText();

    expect(component.passwordFieldType).toBe('text');
    jest.runAllTimers();

    expect(component.passwordFieldType).toBe('password');
  });

  it('should attempt to login user in if login entries are valid.', async () => {
    const authenticatorLogin = jest.spyOn(authenticatorMock, 'login');
    const toastrSuccess = jest.spyOn(mockToastr, 'success');
    const routerNavigate = jest.spyOn(routerMock, 'navigate');

    await component.handleSubmit({ staffId: 'TN012345', password: 'somePassword' });

    expect(authenticatorLogin).toHaveBeenCalled();
    expect(toastrSuccess).toHaveBeenCalled();
    expect(routerNavigate).toHaveBeenCalled();
  });

  it('should display error message if login fails.', async () => {
    jest.spyOn(authenticatorMock, 'login').mockRejectedValue({ error: { message: 'failed' } });
    const toastrError = jest.spyOn(mockToastr, 'error');

    await component.handleSubmit({ staffId: 'TN012345', password: 'somePassword' });

    expect(toastrError).toHaveBeenCalled();
  });
});
