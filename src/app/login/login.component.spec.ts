import { LoginComponent } from './login.component';
import { authServiceMock, mockToastr, routerMock, activatedRouteMock, mockJQuery } from '../__mocks__';

jest.useFakeTimers();

describe('LoginComponent', () => {
  let component: LoginComponent;

  beforeEach(() => {
    component = new LoginComponent(authServiceMock, routerMock, activatedRouteMock, mockToastr, mockJQuery);
  });

  it('should display flash message if query param is set', () => {
    component.ngOnInit();
    //@ts-ignore
    expect(component.route.snapshot.queryParams.m).toBe('value');
    //@ts-ignore
    component.route.snapshot.queryParams.m = undefined;
    component.ngOnInit();
    //@ts-ignore
    expect(component.route.snapshot.queryParams.m).toBe(undefined);
  })

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
    const authServiceLogin = jest.spyOn(authServiceMock, 'login');
    const toastrSuccess = jest.spyOn(mockToastr, 'success');
    const routerNavigate = jest.spyOn(routerMock, 'navigate');

    await component.handleSubmit({ staffId: 'TN012345', password: 'somePassword' });

    expect(authServiceLogin).toHaveBeenCalled();
    expect(toastrSuccess).toHaveBeenCalled();
    expect(routerNavigate).toHaveBeenCalled();
  });

  it('should display error message if login fails.', async () => {
    jest.spyOn(authServiceMock, 'login').mockRejectedValue({ error: { message: 'failed' } });
    const toastrError = jest.spyOn(mockToastr, 'error');

    await component.handleSubmit({ staffId: 'TN012345', password: 'somePassword' });

    expect(toastrError).toHaveBeenCalled();
  });

  it('should display generic error message if login fails for other reasons than incorrect login credentials.', async () => {
    jest.spyOn(authServiceMock, 'login').mockRejectedValue({ error: '' });
    const toastrError = jest.spyOn(mockToastr, 'error');

    await component.handleSubmit({ staffId: 'TN012345', password: 'somePassword' });

    expect(toastrError).toHaveBeenCalled();
  });
});
