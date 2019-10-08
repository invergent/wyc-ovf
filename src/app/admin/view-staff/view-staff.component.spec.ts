import { ViewStaffComponent } from './view-staff.component';
import { activatedRouteMock, profileServiceMock, mockToastr } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: ViewStaffComponent;

  beforeEach(() => {
    component = new ViewStaffComponent(activatedRouteMock, profileServiceMock, mockToastr);
  });

  it('should resend activation email to selected staff', async () => {
    const resendLoginMock = jest.spyOn(profileServiceMock, 'resendLoginCredentials');
    const toastrSucMock = jest.spyOn(mockToastr, 'success');

    await component.resendLoginCredentials('someStaffId');

    expect(resendLoginMock).toHaveBeenCalledWith('someStaffId');
    expect(toastrSucMock).toHaveBeenCalledWith('message');
  });
});
