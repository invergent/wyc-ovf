import { OvertimeService } from '../index';
import { httpMock } from '../../__mocks__';

describe('Overtime Service', () => {
  let service: OvertimeService;

  beforeEach(() => {
    service = new OvertimeService(httpMock);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should initialise staff data.', async () => {
    // @ts-ignore-start
    const statistics = jest.spyOn(service, 'fetchStaffClaimStatistics').mockResolvedValue({});
    // @ts-ignore-start
    const pendingClaim = jest.spyOn(service, 'fetchStaffPendingClaim').mockResolvedValue({});
    // @ts-ignore-start
    const activities = jest.spyOn(service, 'fetchStaffActivities').mockResolvedValue([{}]);
    // @ts-ignore-start
    const staffClaimHistory = jest.spyOn(service, 'fetchStaffClaimHistory').mockResolvedValue([{}]);


    const result = await service.initialiseStaffData();

    expect(result).toBe(true);
    expect(statistics).toHaveBeenCalled();
    expect(pendingClaim).toHaveBeenCalled();
    expect(activities).toHaveBeenCalled();
    expect(staffClaimHistory).toHaveBeenCalled();
  });

  it('should initialise staff data.', async () => {
    // @ts-ignore-start
    jest.spyOn(service, 'fetchStaffClaimStatistics').mockRejectedValue('err');

    try {
      await service.initialiseStaffData();
    } catch(e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('should fetch staff data.', async () => {
    const httpGet = jest.spyOn(httpMock, 'get');

    await service.fetchStaffClaimStatistics();
    await service.fetchStaffPendingClaim();
    await service.fetchStaffActivities();

    expect(httpGet).toHaveBeenCalledTimes(3);
  });

  it('should prompt data initialisation', async () => {
    //@ts-ignore
    const initialiseStaffData = jest.spyOn(service, 'initialiseStaffData').mockImplementation(() => {});
    service.staffClaimData = null;

    await service.fetchStaffData();

    expect(initialiseStaffData).toHaveBeenCalledTimes(1);
  });

  it('should not prompt data initialisation but return staff data.', async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    const initialiseData = jest.spyOn(service, 'initialiseStaffData');
    service.staffClaimData = {};

    await service.fetchStaffData();

    expect(initialiseData).toHaveBeenCalledTimes(0);
  });

  it('should sync API data when user makes changes to database.', async () => {
    //@ts-ignore
    const initialiseStaffData = jest.spyOn(service, 'initialiseStaffData').mockImplementation(() => {});

    await service.syncWithAPI();

    expect(initialiseStaffData).toHaveBeenCalled();
  });

  it('should make a post request to create overtime request.', () => {
    const httpPost = jest.spyOn(httpMock, 'post');
    const overtimeRequest = { weekday: 2, weekend: 3 };
    const url = 'http://init.overtime-api.example.com:7000/users/claim';

    service.createOvertimeRequest(overtimeRequest);

    expect(httpPost).toHaveBeenCalledWith(url, overtimeRequest, service.options);
  });

  it('should make a delete request to cancel pending claim.', () => {
    const httpDelete = jest.spyOn(httpMock, 'delete');
    const url = 'http://init.overtime-api.example.com:7000/users/claims/1';

    service.cancelClaim(1);

    expect(httpDelete).toHaveBeenCalledWith(url, service.options);
  });

  it('should make a get request to fetch staff claim history.', async () => {
    const httpGet = jest.spyOn(httpMock, 'get').mockImplementation(() => ({ toPromise: () => {} }));
    const url = 'http://init.overtime-api.example.com:7000/users/claims/history';

    await service.fetchStaffClaimHistory();

    expect(httpGet).toHaveBeenCalledWith(url, service.options);
  });
});
