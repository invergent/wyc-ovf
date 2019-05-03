import { AuthService } from '../index';
import { httpMock } from '../../__mocks__';

describe('AuthService Service', () => {
  let service: AuthService;

  beforeEach(() => {
    service = new AuthService(httpMock);
  });

  it('should make a get request to the api to check users token validity.', async () => {
    const httpGet = jest.spyOn(httpMock, 'get');

    await service.fetchStaffProfile();

    expect(httpGet).toHaveBeenCalled();
  });

  it('should make a post request to the api to log the user in.', async () => {
    const httpPost = jest.spyOn(httpMock, 'post');

    await service.login({ staffId: 'someStaffID', password: 'somePassword' });

    expect(httpPost).toHaveBeenCalled();
  });

  it('should make a get request to log the user out.', async () => {
    const httpGet = jest.spyOn(httpMock, 'get');

    await service.logout();

    expect(httpGet).toHaveBeenCalled();
  });

  it('should make a post request to the api to request password reset.', async () => {
    const httpPost = jest.spyOn(httpMock, 'post');

    await service.requestPasswordReset({ staffId: 'someStaffID' });

    expect(httpPost).toHaveBeenCalled();
  });

  it('should make a get request to the api to verify password reset request.', async () => {
    const httpGet = jest.spyOn(httpMock, 'get');
    const url = 'http://init.overtime-api.example.com:7000/confirm-reset-request?hash=somehash'

    await service.verifyPasswordResetRequest('somehash');

    expect(httpGet).toHaveBeenCalledWith(url, service.options);
  });

  it('should make a post request to the api to reset password.', async () => {
    const httpPost = jest.spyOn(httpMock, 'get');

    await service.resetPassword({ password: 'password', confirmPassword: 'confirmPassword' }, 'somehash');

    expect(httpPost).toHaveBeenCalled();
  });

  it('should resolve to true if user is authenticated.', async () => {
    jest.spyOn(httpMock, 'get').mockImplementation(() => ({ toPromise: () => ({ data: {} }) }));

    const response = await service.authenticate();

    expect(response).toBe(true);
  });

  it('should resolve to false if user is authenticated.', async () => {
    jest.spyOn(service, 'fetchStaffProfile').mockRejectedValue('err');

    const response = await service.authenticate();

    expect(response).toBe(false);
  });
});
