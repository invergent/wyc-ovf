import { ConfirmPasswordResetComponent } from './confirm-password-reset.component';
import { authenticatorMock, activatedRouteMock, routerMock } from '../__mocks__';

describe('LoginComponent', () => {
  let component: ConfirmPasswordResetComponent;

  beforeEach(() => {
    component = new ConfirmPasswordResetComponent(authenticatorMock, activatedRouteMock, routerMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should attempt to verify password reset request and navigate user to password reset page.', async () => {
    const verifyPasswordResetRequestMock = jest.spyOn(authenticatorMock, 'verifyPasswordResetRequest');
    const routerNavigate = jest.spyOn(routerMock, 'navigate');

    await component.ngOnInit();

    expect(verifyPasswordResetRequestMock).toHaveBeenCalledWith('somehash');
    expect(routerNavigate).toHaveBeenCalledWith(['/password-reset']);
  });

  it('should display error message if request fails.', async () => {
    jest.spyOn(authenticatorMock, 'verifyPasswordResetRequest').mockRejectedValue('err');

    expect(await component.ngOnInit()).toBeUndefined();
  });
});
