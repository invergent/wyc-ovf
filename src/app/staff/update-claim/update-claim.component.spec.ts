import { UpdateClaimComponent } from './update-claim.component';
import { overtimeServiceMock, routerMock } from 'src/app/__mocks__';

describe('ClaimEngineComponent', () => {
  let component: UpdateClaimComponent;

  beforeEach(() => {
    component = new UpdateClaimComponent(overtimeServiceMock, routerMock);
  });

  it('should navigate staff to pending claim if staff has no pending claim or edit was not request', async () => {
    const fetchStaffDataMock = jest.spyOn(overtimeServiceMock, 'fetchStaffData');
    const navigate = jest.spyOn(routerMock, 'navigate');

    await component.ngOnInit();

    expect(fetchStaffDataMock).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/staff/pending-claim']);
  });

  it('should navigate display claim edit page', async () => {
    const response = { pendingClaim: [{ editRequested: true }]};
    const fetchStaffDataMock = jest.spyOn(overtimeServiceMock, 'fetchStaffData').mockResolvedValueOnce(response);

    await component.ngOnInit();

    expect(fetchStaffDataMock).toHaveBeenCalled();
    expect(component.showLoader).toBe(false);
  });

  it('should display error if error occurs while loading update page', async () => {
    jest.spyOn(overtimeServiceMock, 'fetchStaffData').mockRejectedValueOnce('err');

    await component.ngOnInit();

    expect(component.errorMessage).toBe('Unable to load content. Please reload');
    expect(component.showLoader).toBe(false);
  });
});
