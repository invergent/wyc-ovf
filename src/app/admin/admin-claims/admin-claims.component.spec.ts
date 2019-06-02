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

    await component.exportClaims();

    expect(saveAsMock).toHaveBeenCalled();
  });

  it('should mark claims as completed', async () => {
    const mark = jest.spyOn(overtimeServiceMock, 'markClaimsAsCompleted');
    const toastrMock = jest.spyOn(mockToastr, 'success');

    await component.markClaimsAsCompleted();

    expect(mark).toHaveBeenCalled();
    expect(toastrMock).toHaveBeenCalledWith('Completed');
  });

  it('should alert admin of error if it occurs while marking claims as completed ', async () => {
    const mark = jest.spyOn(overtimeServiceMock, 'markClaimsAsCompleted').mockRejectedValueOnce('err');
    const toastrMock = jest.spyOn(mockToastr, 'error');
    const errMessage = 'An error occurred while marking claims as completed.';

    await component.markClaimsAsCompleted();

    expect(mark).toHaveBeenCalled();
    expect(toastrMock).toHaveBeenCalledWith(errMessage);
  });
});
