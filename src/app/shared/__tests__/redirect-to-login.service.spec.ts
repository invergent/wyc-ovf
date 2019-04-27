import { RedirectToLogin } from '../index';
import { routerMock, authServiceMock } from '../../__mocks__';

describe('RedirectToDashboard Service', () => {
  let service: RedirectToLogin;

  beforeEach(() => {
    service = new RedirectToLogin(routerMock, authServiceMock);
  });

  it('should navigate to login if staff is unauthenticated.', async () => {
    const routerNavigate = jest.spyOn(routerMock, 'navigate');
    const authServiceCheckValidity = jest.spyOn(authServiceMock, 'authenticate').mockResolvedValue(false);

    await service.canActivate();

    expect(authServiceCheckValidity).toHaveBeenCalled();
    expect(routerNavigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return true if staff is authenticated.', async () => {
    const authServiceCheckValidity = jest.spyOn(authServiceMock, 'authenticate').mockResolvedValue(true);

    await service.canActivate();

    expect(authServiceCheckValidity).toHaveBeenCalled();
  });
});
