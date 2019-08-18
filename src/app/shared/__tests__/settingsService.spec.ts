import { SettingsService } from '../index';
import { httpMock } from '../../__mocks__';

describe('Overtime Service', () => {
  let service: SettingsService;

  beforeEach(() => {
    service = new SettingsService(httpMock);
  });

  it('should initialise settings data.', async () => {
    // @ts-ignore
    const settingsFetchMock = jest.spyOn(service, 'fetchSettingsData').mockResolvedValueOnce({ data: ['value'] });

    const result = await service.initialiseSettingsData();

    expect(result).toBe(true);
    expect(settingsFetchMock).toHaveBeenCalled();
  });

  it('should throw an error if encountered.', async () => {
    const settingsFetchMock = jest.spyOn(service, 'fetchSettingsData').mockRejectedValueOnce({ data: ['value'] });

    try {
      await service.initialiseSettingsData();
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  });

  it('should return settings data if already set', async () => {
    const settings = { emailSchedule: 'some schedule' };
    //@ts-ignore
    service.settings = settings;

    const result = await service.fetchAdminSettings();

    expect(result).toBe(settings);
  })

  it('should sync data with API.', async () => {
    // @ts-ignore-start
    const initialiseMock = jest.spyOn(service, 'initialiseSettingsData').mockImplementation(() => {});

    await service.syncWithAPI();

    expect(initialiseMock).toHaveBeenCalled();
  });

  it('should make a get/put request to fetch/update resources on the API.', () => {
    const httpGet = jest.spyOn(httpMock, 'get');
    const httpPut = jest.spyOn(httpMock, 'put');

    service.fetchSettingsData();
    service.updateSettings({ emailSchedule: 'something' });

    expect(httpGet).toHaveBeenCalledTimes(1);
    expect(httpPut).toHaveBeenCalledTimes(1);
  });

  it('should determine the next reopen date.', () => {
    // called twice with an early and late date in the month so test could run through both
    // sides of the IF statement
    const date = service.getReopenDate('0 1 1 * *');
    const date2 = service.getReopenDate('0 1 27 * *');
    // just check that a datestring is returned
    expect(date.split(' ')).toHaveLength(4);
    expect(date2.split(' ')).toHaveLength(4);
  });
});
