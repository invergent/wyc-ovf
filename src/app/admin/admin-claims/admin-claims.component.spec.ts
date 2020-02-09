import * as fileSaver from 'file-saver';
import { AdminClaimsComponent } from './admin-claims.component';
import { overtimeServiceMock, mockToastr } from 'src/app/__mocks__';

describe('AdminClaimsComponent', () => {
  let component: AdminClaimsComponent;

  beforeEach(() => {
    component = new AdminClaimsComponent(overtimeServiceMock, mockToastr);
  });

  it('should download and save file', async () => {
    const saveAsMock = jest.spyOn(fileSaver, 'saveAs').mockImplementation(() => {});

    await component.exportClaims('csv');

    expect(saveAsMock).toHaveBeenCalled();
  });
});
