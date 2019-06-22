import { RedirectToDashboard } from '../index';
import { routerMock, authServiceMock } from '../../__mocks__';

describe('RedirectToDashboard Service', () => {
  let service: RedirectToDashboard;

  beforeEach(() => {
    service = new RedirectToDashboard(routerMock, authServiceMock);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return true (proceed to login) if staff is unathenticated.', async () => {
    const result = await service.canActivate();

    expect(result).toBe(true);
  });

  it('should redirect staff to dashboard if staff is already logged in.', async () => {
    const routerNavigate = jest.spyOn(routerMock, 'navigate');
    authServiceMock.isAuthenticated = true;

    await service.canActivate();

    expect(routerNavigate).toHaveBeenCalledWith(['/staff/dashboard']);
  });
});
