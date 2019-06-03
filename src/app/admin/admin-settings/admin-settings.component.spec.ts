import { AdminSettingsComponent } from './admin-settings.component';
import { settingsServiceMock, mockToastr, mockJQuery } from 'src/app/__mocks__';
import { async } from '@angular/core/testing';

jest.useFakeTimers();

describe('AdminSettingsComponent', () => {
  let component: AdminSettingsComponent;

  beforeEach(() => {
    component = new AdminSettingsComponent(settingsServiceMock, mockToastr, mockJQuery);
  });

  it('should initialise data', async () => {
    const settingsMock = jest.spyOn(settingsServiceMock, 'fetchAdminSettings');

    await component.ngOnInit();

    expect(settingsMock).toHaveBeenCalled();
  });

  it('should run modal toggle functions', () => {
    component.runModalDisplay('emailScheduleModal', 'param2', 'param3');
    component.closeModal('emailScheduleModal');

    expect(component.emailScheduleModal).toBe(false);
  });

  it('should display validation errors when they occur', async () => {
    const errMsg = 'Entry is invalid! Please select a date from the calendar.';
    const valMock = jest.fn(() => 'wrongDate')
    const newJQMock = jest.fn(() => ({ val: valMock }));
    const toastrErrMock = jest.spyOn(mockToastr, 'error');
    const newComponent = new AdminSettingsComponent(settingsServiceMock, mockToastr, newJQMock)

    await newComponent.handleSubmit('emailScheduleModal');

    expect(newJQMock).toHaveBeenCalled();
    expect(valMock).toHaveBeenCalled();
    expect(toastrErrMock).toHaveBeenCalledWith(errMsg);
  });

  it('should submit cronTime to server', async () => {
    const valMock = jest.fn(() => '02/23/2019');
    const newJQMock = jest.fn(() => ({ val: valMock }));
    const newComponent = new AdminSettingsComponent(settingsServiceMock, mockToastr, newJQMock);
    
    const toastrSucMock = jest.spyOn(mockToastr, 'success');
    const updateMock = jest.spyOn(settingsServiceMock, 'updateEmailingSetting');
    const syncMock = jest.spyOn(settingsServiceMock, 'syncWithAPI');
    const init = jest.spyOn(newComponent, 'initialiseData');
    
    await newComponent.handleSubmit('emailScheduleModal');
    
    expect(newJQMock).toHaveBeenCalled();
    expect(valMock).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalledWith('0 6 23 * *');
    expect(toastrSucMock).toHaveBeenCalledWith('value');
    expect(syncMock).toHaveBeenCalled();
    expect(init).toHaveBeenCalled();
  });

  it('should display errors when they occur', async () => {
    jest.clearAllMocks();
    const valMock = jest.fn(() => '02/23/2019');
    const newJQMock = jest.fn(() => ({ val: valMock }));
    const newComponent = new AdminSettingsComponent(settingsServiceMock, mockToastr, newJQMock);
    const err = { error: { errors: ['error1', 'error2', 'error3'] } };
    
    const toastrErrMock = jest.spyOn(mockToastr, 'error');
    const updateMock = jest.spyOn(settingsServiceMock, 'updateEmailingSetting').mockRejectedValueOnce(err);
    
    await newComponent.handleSubmit('emailScheduleModal');
    
    expect(newJQMock).toHaveBeenCalled();
    expect(valMock).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalled();
    expect(toastrErrMock).toHaveBeenCalledTimes(3);
  });
});
