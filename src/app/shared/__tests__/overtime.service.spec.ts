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
    // @ts-ignore-start
    const fetchHolidays = jest.spyOn(service, 'fetchHolidays').mockResolvedValue([{}]);


    const result = await service.initialiseStaffData();

    expect(result).toBe(true);
    expect(statistics).toHaveBeenCalled();
    expect(pendingClaim).toHaveBeenCalled();
    expect(activities).toHaveBeenCalled();
    expect(staffClaimHistory).toHaveBeenCalled();
    expect(fetchHolidays).toHaveBeenCalled();
  });

  it('should initialise admin data.', async () => {
    // @ts-ignore-start
    const adminData = jest.spyOn(service, 'fetchAdminClaimsData').mockResolvedValue({});
    // @ts-ignore-start
    const chartData = jest.spyOn(service, 'fetchChartStatistics').mockResolvedValue({});


    const result = await service.initialiseAdminData();

    expect(result).toBe(true);
    expect(adminData).toHaveBeenCalled();
    expect(chartData).toHaveBeenCalled();
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

  it('should throw an error if error occurs while initialising admin data.', async () => {
    // @ts-ignore-start
    jest.spyOn(service, 'fetchAdminClaimsData').mockRejectedValue('err');

    try {
      await service.initialiseAdminData();
    } catch(e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('should fetch staff data.', async () => {
    const httpGet = jest.spyOn(httpMock, 'get');

    await service.fetchStaffClaimStatistics();
    await service.fetchStaffPendingClaim();
    await service.fetchStaffActivities();
    await service.fetchAdminClaimsData();
    await service.fetchChartStatistics();

    expect(httpGet).toHaveBeenCalledTimes(5);
  });

  it('should prompt data initialisation', async () => {
    //@ts-ignore
    const initialiseStaffData = jest.spyOn(service, 'initialiseStaffData').mockImplementation(() => {});
    //@ts-ignore
    const initialiseAdminData = jest.spyOn(service, 'initialiseAdminData').mockImplementation(() => {});
    service.staffClaimData = null;
    service.staffClaimData = null;

    await service.fetchStaffData();
    await service.fetchAdminData();

    expect(initialiseStaffData).toHaveBeenCalledTimes(1);
    expect(initialiseAdminData).toHaveBeenCalledTimes(1);
  });

  it('should not prompt data initialisation but return staff data.', async () => {
    jest.resetAllMocks();
    jest.clearAllMocks();
    const initialiseData = jest.spyOn(service, 'initialiseStaffData');
    const initialiseAdminData = jest.spyOn(service, 'initialiseStaffData');
    service.staffClaimData = {};
    //@ts-ignore
    service.adminClaimData = {};

    await service.fetchStaffData();
    await service.fetchAdminData();

    expect(initialiseData).toHaveBeenCalledTimes(0);
    expect(initialiseAdminData).toHaveBeenCalledTimes(0);
  });

  it('should sync API data when user makes changes to database.', async () => {
    //@ts-ignore
    const initialiseStaffData = jest.spyOn(service, 'initialiseStaffData').mockImplementation(() => {});
    //@ts-ignore
    const initialiseAdminData = jest.spyOn(service, 'initialiseAdminData').mockImplementation(() => {});

    await service.syncWithAPI();
    await service.syncAdminWithAPI();

    expect(initialiseStaffData).toHaveBeenCalled();
    expect(initialiseAdminData).toHaveBeenCalled();
  });

  it('should make a post request to create overtime request.', () => {
    const httpPost = jest.spyOn(httpMock, 'post');
    const overtimeRequest = { claimElements: 2, amount: 3 };
    const url = 'http://overtime-api.vla.com:7000/users/claim';

    service.createOvertimeRequest(overtimeRequest);

    expect(httpPost).toHaveBeenCalledWith(url, overtimeRequest, service.options);
  });

  it('should make a delete request to cancel pending claim.', () => {
    const httpDelete = jest.spyOn(httpMock, 'delete');
    const url = 'http://overtime-api.vla.com:7000/users/claims/1';

    service.cancelClaim(1);

    expect(httpDelete).toHaveBeenCalledWith(url, service.options);
  });

  it('should make a get request to fetch staff claim history.', async () => {
    const httpGet = jest.spyOn(httpMock, 'get').mockImplementation(() => ({ toPromise: () => {} }));
    const url = 'http://overtime-api.vla.com:7000/users/claims/history';

    await service.fetchStaffClaimHistory();

    expect(httpGet).toHaveBeenCalledWith(url, service.options);
  });

  it('should make a get request to download claims.', async () => {
    const httpGet = jest.spyOn(httpMock, 'get').mockImplementation(() => ({ toPromise: () => {} }));

    await service.exportApprovedClaims();

    expect(httpGet).toHaveBeenCalled();
  });
});
