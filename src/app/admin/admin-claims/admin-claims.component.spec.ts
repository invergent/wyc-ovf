import * as fileSaver from 'file-saver';
import { AdminClaimsComponent } from './admin-claims.component';
import { overtimeServiceMock, mockToastr } from 'src/app/__mocks__';

describe('AdminClaimsComponent', () => {
  let component: AdminClaimsComponent;

  beforeEach(() => {
    component = new AdminClaimsComponent(overtimeServiceMock, mockToastr);
  });

  it('should initialise claim data for admin', async () => {
    const fetch = jest.spyOn(overtimeServiceMock, 'fetchAdminData');

    await component.ngOnInit();

    expect(fetch).toHaveBeenCalled();
    expect(component.claims).toHaveLength(1);
  });

  it('should display error if an error occurs', async () => {
    const fetch = jest.spyOn(overtimeServiceMock, 'fetchAdminData').mockRejectedValueOnce('err');
    const displayErr = jest.spyOn(component, 'displayError');

    await component.ngOnInit();

    expect(fetch).toHaveBeenCalled();
    expect(displayErr).toHaveBeenCalled();
  });

  it('should download and save file', async () => {
    const saveAsMock = jest.spyOn(fileSaver, 'saveAs').mockImplementation(() => {});

    await component.exportClaims('csv');

    expect(saveAsMock).toHaveBeenCalled();
  });
});
