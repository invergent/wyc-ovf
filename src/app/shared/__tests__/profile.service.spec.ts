import { ProfileService } from '../index';
import { httpMock } from '../../__mocks__';

describe('Overtime Service', () => {
  let service: ProfileService;

  beforeEach(() => {
    service = new ProfileService(httpMock);
  });

  it('should initialise staff profile data if not set.', async () => {
    // @ts-ignore-start
    const lineManagers = jest.spyOn(service, 'fetchLineManagers').mockResolvedValue([{}]);
    // @ts-ignore-start
    const branches = jest.spyOn(service, 'fetchBranches').mockResolvedValue([{}]);
    // @ts-ignore-start
    const roles = jest.spyOn(service, 'fetchRoles').mockResolvedValue([{}]);
    // @ts-ignore-start
    const staff = jest.spyOn(service, 'fetchStaff').mockResolvedValue([{}]);


    await service.fetchProfileData();

    expect(lineManagers).toHaveBeenCalled();
    expect(branches).toHaveBeenCalled();
    expect(roles).toHaveBeenCalled();
    expect(staff).toHaveBeenCalled();
  });

  it('should return profile data is already set', async () => {
    service.profileData = { roles: [{ id: 1, name: 'some role' }] };

    const result = await service.fetchProfileData();

    expect(result.roles).toHaveLength(1);
  })

  it('should sync data with API.', async () => {
    // @ts-ignore-start
    const initialiseMock = jest.spyOn(service, 'initialiseProfileData').mockImplementation(() => {});

    await service.syncWithAPI();

    expect(initialiseMock).toHaveBeenCalled();
  });

  it('should throw an error if data initialisation fails.', async () => {
    // @ts-ignore-start
    jest.spyOn(service, 'fetchLineManagers').mockRejectedValue('err');

    try {
      await service.initialiseProfileData();
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  it('should make a get request to fetch resources from the API.', () => {
    const httpGet = jest.spyOn(httpMock, 'get');

    service.fetchLineManagers();
    service.fetchBranches();
    service.fetchRoles();
    service.fetchStaff();

    expect(httpGet).toHaveBeenCalledTimes(4);
  });

  it('should make a post request to upload image.', () => {
    const httpPost = jest.spyOn(httpMock, 'post');
    const httpPut = jest.spyOn(httpMock, 'put');

    service.updateImage({});
    service.updateLineManagerInfo({});
    service.updatePersonalInfo({});
    service.createBulkStaff({});
    // @ts-ignore-start
    service.createSingleStaff({});

    expect(httpPost).toHaveBeenCalledTimes(4);
    expect(httpPut).toHaveBeenCalledTimes(1);
  });
});
