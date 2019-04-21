import { Authenticator } from '../index';
import { httpMock } from '../../__mocks__';

describe('Authenticator Service', () => {
  let service: Authenticator;

  beforeEach(() => {
    service = new Authenticator(httpMock);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should make a get request to the api to check users token validity.', async () => {
    const httpGet = jest.spyOn(httpMock, 'get');

    await service.checkValidity();

    expect(httpGet).toHaveBeenCalled();
  });

  it('should make a post request to the api to log the user in.', async () => {
    const httpPost = jest.spyOn(httpMock, 'post');

    await service.login({ staffId: 'someStaffID', password: 'somePassword' });

    expect(httpPost).toHaveBeenCalled();
  });

  it('should make a post request to the api to request password reset.', async () => {
    const httpPost = jest.spyOn(httpMock, 'post');

    await service.requestPasswordReset({ staffId: 'someStaffID' });

    expect(httpPost).toHaveBeenCalled();
  });

  it('should make a get request to the api to verify password reset request.', async () => {
    const httpGet = jest.spyOn(httpMock, 'get');
    const url = 'http://init.overtime-api.invergent-technologies.com/confirm-reset-request?hash=somehash'

    await service.verifyPasswordResetRequest('somehash');

    expect(httpGet).toHaveBeenCalledWith(url, service.options);
  });

  it('should make a post request to the api to reset password.', async () => {
    const httpPost = jest.spyOn(httpMock, 'get');
    const url = 'http://init.overtime-api.invergent-technologies.com/confirm-reset-request?hash=somehash'

    await service.resetPassword({ password: 'password', confirmPassword: 'confirmPassword'}, 'somehash');

    expect(httpPost).toHaveBeenCalled();
  });
});
