import { PendingClaimComponent } from './pending-claim.component';
import { routerMock, mockToastr, overtimeServiceMock } from '../../__mocks__';

describe('Pending Claim', () => {
  let component: PendingClaimComponent;

  beforeEach(() => {
    component = new PendingClaimComponent(overtimeServiceMock, routerMock, mockToastr);
    //@ts-ignore
    component.pendingClaims = [{ id: 1}];
  });

  it('should fetch and update component with staff pending claim data', async () => {
    const overtimeServiceMockFunc = jest.spyOn(overtimeServiceMock, 'fetchStaffData');

    await component.ngOnInit();

    expect(overtimeServiceMockFunc).toHaveBeenCalled();
  });

  it('should display error message if data initialisation fails', async () => {
    jest.spyOn(overtimeServiceMock, 'fetchStaffData').mockRejectedValue('err');

    await component.ngOnInit();

    expect(component.errorMessage).toBe('Unable to load content. Please reload');
  });

  it('should successfully cancel claim', async () => {
    const overtimeServiceMockFunc = jest.spyOn(overtimeServiceMock, 'cancelClaim');
    const toastrSuccessFunction = jest.spyOn(mockToastr, 'success');
    const routerMockFunc = jest.spyOn(routerMock, 'navigate');
    const syncData = jest.spyOn(overtimeServiceMock, 'syncWithAPI');

    await component.cancelClaim();

    expect(overtimeServiceMockFunc).toHaveBeenCalled();
    expect(toastrSuccessFunction).toHaveBeenCalledWith('Claim cancelled successfully!');
    expect(routerMockFunc).toHaveBeenCalledWith(['/staff/claim-history']);
    expect(syncData).toHaveBeenCalled();
  });

  it('should notify staff if claim cancellation fails', async () => {
    const err = { error: { message: 'someMessage'} };
    const overtimeServiceMockFunc = jest.spyOn(overtimeServiceMock, 'cancelClaim').mockRejectedValue(err);
    const toastrErrorFunction = jest.spyOn(mockToastr, 'error');

    await component.cancelClaim();

    expect(overtimeServiceMockFunc).toHaveBeenCalled();
    expect(toastrErrorFunction).toHaveBeenCalled();
  });

  it('should notify staff if claim cancellation fails for a generic reason', async () => {
    const err = { error: {} };
    const overtimeServiceMockFunc = jest.spyOn(overtimeServiceMock, 'cancelClaim').mockRejectedValue(err);
    const toastrErrorFunction = jest.spyOn(mockToastr, 'error');

    await component.cancelClaim();

    expect(overtimeServiceMockFunc).toHaveBeenCalled();
    expect(toastrErrorFunction).toHaveBeenCalled();
  });
});
