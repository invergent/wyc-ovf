import { LogoutComponent } from './logout.component';
import { authServiceMock, routerMock, overtimeServiceMock } from '../__mocks__';

jest.useFakeTimers();

describe('LoginComponent', () => {
  let component: LogoutComponent;

  beforeEach(() => {
    component = new LogoutComponent(authServiceMock, routerMock, overtimeServiceMock);
  });

  it('should log user out.', async () => {
    const logoutFunc = jest.spyOn(authServiceMock, 'logout');
    const routerFunc = jest.spyOn(routerMock, 'navigate');

    await component.ngOnInit();

    expect(logoutFunc).toHaveBeenCalled();
    expect(routerFunc).toHaveBeenCalledWith(['/']);
  });

  it('should display error message if logout fails.', async () => {
    jest.spyOn(authServiceMock, 'logout').mockRejectedValue('err');

    await component.ngOnInit();

    expect(component.displaySpinner).toBe(false);
    expect(component.message).toBe('An error occurred. Please try again.');
  });
});
