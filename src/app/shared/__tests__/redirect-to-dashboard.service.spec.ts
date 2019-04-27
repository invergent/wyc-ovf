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

  it('should make a get request to the api to check users token validity.', async () => {
    const routerNavigate = jest.spyOn(routerMock, 'navigate');
    const authServiceCheckValidity = jest.spyOn(authServiceMock, 'authenticate');

    await service.canActivate();

    expect(authServiceCheckValidity).toHaveBeenCalled();
    expect(routerNavigate).toHaveBeenCalledWith(['/staff/dashboard']);
  });

  it('should return true (proceed to login) if call to api fails or user is unathenticated.', async () => {
    jest.spyOn(authServiceMock, 'authenticate').mockResolvedValue(false);

    const response = await service.canActivate();

    expect(response).toBe(true);
  });
});
