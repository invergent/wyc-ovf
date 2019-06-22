import { AdminOnlyGuard } from '../index';
import { routerMock, authServiceMock } from '../../__mocks__';

describe('Admin Only Guard', () => {
  let guard: AdminOnlyGuard;

  beforeEach(() => {
    guard = new AdminOnlyGuard(routerMock, authServiceMock);
  });

  it('should navigate to login if staff is unauthenticated.', async () => {
    const routerNavigate = jest.spyOn(routerMock, 'navigate');
    const authServiceCheckValidity = jest.spyOn(authServiceMock, 'authenticate').mockResolvedValue(false);

    await guard.canActivate();

    expect(authServiceCheckValidity).toHaveBeenCalled();
    expect(routerNavigate).toHaveBeenCalledWith(['/login']);
  });

  it('should deny access if user is authenticated and a non-admin staff.', async () => {
    jest.clearAllMocks();
    const routerNavigate = jest.spyOn(routerMock, 'navigate');
    const authServiceCheckValidity = jest.spyOn(authServiceMock, 'authenticate').mockResolvedValue(true);

    await guard.canActivate();

    expect(authServiceCheckValidity).toHaveBeenCalled();
    expect(routerNavigate).toHaveBeenCalledWith(['/login']);
  });

  it('should grant access if user is authenticated and an admin staff.', async () => {
    const authServiceCheckValidity = jest.spyOn(authServiceMock, 'authenticate').mockResolvedValue(true);
    authServiceMock.currentStaff.role = 'Admin'

    const permitted = await guard.canActivate();

    expect(authServiceCheckValidity).toHaveBeenCalled();
    expect(permitted).toBe(true);
  });
});

