
import { routerMock, activatedRouteMock, lineManagerServiceMock } from "src/app/__mocks__";
import { VerifyComponent } from "./verify.component";
import { async } from "@angular/core/testing";

describe('Approval component', () => {
  let component: VerifyComponent;

  beforeEach(() => {
    component = new VerifyComponent(routerMock, activatedRouteMock, lineManagerServiceMock);
  });

  it('should verify line manager', async () => {
    const verifyLineManager = jest.spyOn(lineManagerServiceMock, 'verifyLineManager');
    await component.ngOnInit();
    expect(verifyLineManager).toHaveBeenCalled();
  });

  it('should display error if verification fails', async () => {
    const verifyLineManager = jest.spyOn(lineManagerServiceMock, 'verifyLineManager').mockRejectedValue('err');
    await component.ngOnInit();
    expect(verifyLineManager).toHaveBeenCalled();
  });
});
