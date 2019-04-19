import { RedirectToDashboard } from '../index';
import { routerMock, authenticatorMock } from '../../__mocks__';

describe('Authenticator Service', () => {
  let service: RedirectToDashboard;

  beforeEach(() => {
    service = new RedirectToDashboard(routerMock, authenticatorMock);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should make a get request to the api to check users token validity.', async () => {
    const routerNavigate = jest.spyOn(routerMock, 'navigate');
    const authenticatorCheckValidity = jest.spyOn(authenticatorMock, 'checkValidity');

    await service.canActivate();

    expect(authenticatorCheckValidity).toHaveBeenCalled();
    expect(routerNavigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should return true (proceed to login) if call to api fails or user is unathenticated.', async () => {
    jest.spyOn(authenticatorMock, 'checkValidity').mockRejectedValue('err');

    const response = await service.canActivate();

    expect(response).toBe(true);
  });
});
