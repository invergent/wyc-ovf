import { NewClaimComponent } from './new-claim.component';
import { overtimeServiceMock, settingsServiceMock } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: NewClaimComponent;

  beforeEach(() => {
    component = new NewClaimComponent(overtimeServiceMock, settingsServiceMock);
  });

  it('should allow claim application when overtimeWindow is open', async () => {
    const mockSettings = { overtimeWindow: 'Open', overtimeWindowIsActive: true };
    const fetchStaffDataMock = jest.spyOn(overtimeServiceMock, 'fetchStaffData');
    const fetchAdminSettingsMock = jest.spyOn(settingsServiceMock, 'fetchAdminSettings').mockResolvedValueOnce(mockSettings);

    await component.ngOnInit();

    expect(fetchStaffDataMock).toHaveBeenCalled();
    expect(fetchAdminSettingsMock).toHaveBeenCalled();
    expect(component.windowIsActive).toBe(true);
  });

  it('should close claim application and display closure message when overtimeWindow is closed', async () => {
    const mockSettings = { overtimeWindow: 'Close', overtimeWindowIsActive: false, overtimeWindowStart: 'start' };
    const fetchStaffDataMock = jest.spyOn(overtimeServiceMock, 'fetchStaffData');
    const fetchAdminSettingsMock = jest.spyOn(settingsServiceMock, 'fetchAdminSettings').mockResolvedValueOnce(mockSettings);
    const reopenDateMock = jest.spyOn(settingsServiceMock, 'getReopenDate');

    await component.ngOnInit();

    expect(fetchStaffDataMock).toHaveBeenCalled();
    expect(fetchAdminSettingsMock).toHaveBeenCalled();
    expect(reopenDateMock).toHaveBeenCalledWith(mockSettings.overtimeWindowStart);
    expect(component.windowIsActive).toBe(false);
  });

  it('should display error message if error occurs while fetching data', async () => {
    jest.spyOn(overtimeServiceMock, 'fetchStaffData').mockRejectedValueOnce('err');

    await component.ngOnInit();

    expect(component.showLoader).toBe(false);
    expect(component.errorMessage).toBe('Unable to load content. Please reload');
  });
});
