import { StaffOnlyGuard } from '../index';
import { routerMock, authServiceMock } from '../../__mocks__';

describe('Staff Only Guard', () => {
  let guard: StaffOnlyGuard;

  beforeEach(() => {
    guard = new StaffOnlyGuard(routerMock, authServiceMock);
  });

  it('should navigate to login if staff is unauthenticated.', async () => {
    const routerNavigate = jest.spyOn(routerMock, 'navigate');
    const authServiceCheckValidity = jest.spyOn(authServiceMock, 'authenticate').mockResolvedValue(false);

    await guard.canActivate();

    expect(authServiceCheckValidity).toHaveBeenCalled();
    expect(routerNavigate).toHaveBeenCalledWith(['/login']);
  });

  it('should grant access if user is authenticated and a non-admin staff.', async () => {
    const authServiceCheckValidity = jest.spyOn(authServiceMock, 'authenticate').mockResolvedValue(true);

    const permitted = await guard.canActivate();

    expect(authServiceCheckValidity).toHaveBeenCalled();
    expect(permitted).toBe(true);
  });

  it('should deny access if user is authenticated and an admin.', async () => {
    jest.clearAllMocks();
    const routerNavigate = jest.spyOn(routerMock, 'navigate');
    const authServiceCheckValidity = jest.spyOn(authServiceMock, 'authenticate').mockResolvedValue(true);
    authServiceMock.currentStaff.role = 'Admin'

    await guard.canActivate();
    
    expect(authServiceCheckValidity).toHaveBeenCalled();
    expect(routerNavigate).toHaveBeenCalledWith(['/login']);
  });
});
