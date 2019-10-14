import { ClaimWindowComponent } from './claim-window.component';
import { settingsServiceMock } from 'src/app/__mocks__';

describe('ClaimWindowComponent', () => {
  let component: ClaimWindowComponent;
  const mockSettings = {
    overtimeWindow: '',
    overtimeWindowIsActive: true,
    overtimeWindowStart: '0 7 1 * *',
    overtimeWindowEnd: '0 7 8 * *'
  };

  beforeEach(() => {
    component = new ClaimWindowComponent(settingsServiceMock)
  });

  it('should display claim window as temporarily open', async () => {
    const fetchAdminSettings = jest.spyOn(settingsServiceMock, 'fetchAdminSettings').mockResolvedValueOnce(mockSettings);
    const reopenMock = jest.spyOn(settingsServiceMock, 'getReopenDate');

    await component.ngOnInit();

    expect(fetchAdminSettings).toHaveBeenCalled();
    expect(reopenMock).toHaveBeenCalledTimes(2);
    expect(component.backgroundColor).toBe('#ffc107');
  });

  it('should display claim window as closed', async () => {
    jest.resetAllMocks();
    jest.resetAllMocks();
    mockSettings.overtimeWindow = 'Close';
    mockSettings.overtimeWindowIsActive = false;
    const fetchAdminSettings = jest.spyOn(settingsServiceMock, 'fetchAdminSettings').mockResolvedValueOnce(mockSettings);
    const reopenMock = jest.spyOn(settingsServiceMock, 'getReopenDate');

    await component.ngOnInit();

    expect(fetchAdminSettings).toHaveBeenCalled();
    expect(reopenMock).toHaveBeenCalledTimes(2);
    expect(component.backgroundColor).toBe('#bf360c');
  });

  it('should display claim window as open', async () => {
    jest.resetAllMocks();
    mockSettings.overtimeWindow = 'Open';
    const fetchAdminSettings = jest.spyOn(settingsServiceMock, 'fetchAdminSettings').mockResolvedValueOnce(mockSettings);
    const reopenMock = jest.spyOn(settingsServiceMock, 'getReopenDate');

    await component.ngOnInit();

    expect(fetchAdminSettings).toHaveBeenCalled();
    expect(reopenMock).toHaveBeenCalledTimes(2);
    expect(component.backgroundColor).toBe('#2e7d32');
  });
});
