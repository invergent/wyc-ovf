import { OvertimeService } from '../index';
import { httpMock } from '../../__mocks__';

describe('AuthService Service', () => {
  let service: OvertimeService;

  beforeEach(() => {
    service = new OvertimeService(httpMock);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should make a get request to the api to check users token validity.', async () => {
    const httpGet = jest.spyOn(httpMock, 'get');

    await service.fetchStaffClaimStatistics();

    expect(httpGet).toHaveBeenCalled();
  });
});
