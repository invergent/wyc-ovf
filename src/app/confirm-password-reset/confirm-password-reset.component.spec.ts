import { ConfirmPasswordResetComponent } from './confirm-password-reset.component';
import { authServiceMock, activatedRouteMock, routerMock } from '../__mocks__';

describe('Comfirm password reset', () => {
  let component: ConfirmPasswordResetComponent;

  beforeEach(() => {
    component = new ConfirmPasswordResetComponent(authServiceMock, activatedRouteMock, routerMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should attempt to verify password reset request and navigate user to password reset page.', async () => {
    const verifyPasswordResetRequestMock = jest.spyOn(authServiceMock, 'verifyPasswordResetRequest');
    const routerNavigate = jest.spyOn(routerMock, 'navigate');

    await component.ngOnInit();

    expect(verifyPasswordResetRequestMock).toHaveBeenCalledWith('somehash');
    expect(routerNavigate).toHaveBeenCalledWith(['/password-reset'], { queryParams: { hash: 'somehash' } });
  });

  it('should display error message if request fails.', async () => {
    jest.spyOn(authServiceMock, 'verifyPasswordResetRequest').mockRejectedValue('err');

    expect(await component.ngOnInit()).toBeUndefined();
  });
});
