import { ApprovalsComponent } from "./approvals.component";
import {
  routerMock, lineManagerServiceMock, mockToastr, mockJQuery, notificationServiceMock
} from "src/app/__mocks__";

jest.useFakeTimers();

describe('Approval component', () => {
  let component: ApprovalsComponent;

  beforeEach(() => {
    component = new ApprovalsComponent(
      routerMock, lineManagerServiceMock, notificationServiceMock, mockToastr, mockJQuery
    );
  });

  it('should initialise line manager data and pending claims', () => {
    const fetchClaimsToApprove = jest.spyOn(lineManagerServiceMock, 'fetchClaimsToApprove');
    component.ngOnInit()
    expect(fetchClaimsToApprove).toHaveBeenCalled();
  });

  it('should navigate to verification page if line manager is not verified.', async () => {
    const routerNavigate = jest.spyOn(routerMock, 'navigate');
    jest.spyOn(lineManagerServiceMock, 'fetchClaimsToApprove').mockRejectedValue('err');

    try {
      await component.ngOnInit()
    } catch (error) {
      expect(routerNavigate).toHaveBeenCalledWith(['/line-manager/verify']);
    }
  });

  it('should display message if line manager has no pending claims', async () => {
    jest.spyOn(lineManagerServiceMock, 'fetchClaimsToApprove').mockRejectedValue({
      error: { data: { lineManager: {}, pendingClaims: [] } },
      status: 404
    });

    await component.ngOnInit();

    expect(component.message).toBe('you currently have no pending claims to approve.');
  });

  it('should run approval based on approvalType supplied', async () => {
    const runApprovalFn = jest.spyOn(lineManagerServiceMock, 'runApproval');
    const toastrSuccessFn = jest.spyOn(lineManagerServiceMock, 'runApproval');
    const playAudioMock = jest.spyOn(notificationServiceMock, 'playAudio');
    //@ts-ignore
    component.claimsToApprove = [];

    await component.runApproval({ preventDefault: () => {} }, 'approve 1');
    jest.runAllTimers();

    expect(runApprovalFn).toHaveBeenCalledWith('approve', '1');
    expect(toastrSuccessFn).toHaveBeenCalled();
    expect(mockJQuery).toHaveBeenCalled();
    expect(playAudioMock).toHaveBeenCalled();
  });
});
