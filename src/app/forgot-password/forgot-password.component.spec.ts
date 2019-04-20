import { ForgotPasswordComponent } from './forgot-password.component';
import { authenticatorMock, mockToastr } from '../__mocks__';

describe('LoginComponent', () => {
  let component: ForgotPasswordComponent;

  beforeEach(() => {
    component = new ForgotPasswordComponent(authenticatorMock, mockToastr);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return errors if provided entry is neither a staffId or an email address.', async () => {
    const toastrError = jest.spyOn(mockToastr, 'error');

    await component.handleSubmit({ staffIdOrEmail: 'someStaffID' });

    expect(toastrError).toHaveBeenCalledWith('You entered an incorrect value');
  });

  it('should return an object with a payload object containing either staffId or email property.', async () => {
    const validatedData = component.validateFormData({ staffIdOrEmail: 'TN012345' });

    expect(validatedData.payload).toHaveProperty('staffId');
    expect(validatedData.payload.email).toBeUndefined();

    const validatedData2 = component.validateFormData({ staffIdOrEmail: 'some@email.com' });

    expect(validatedData2.payload).toHaveProperty('email');
    expect(validatedData2.payload.staffId).toBeUndefined();
  });

  it('should attempt to make password reset request to the server if entry is valid.', async () => {
    const mockValidatedData = { errors: [], payload: { staffId: 'TN012345' } };
    jest.spyOn(component, 'validateFormData').mockReturnValue(mockValidatedData);
    const authenticatorLogin = jest.spyOn(authenticatorMock, 'requestPasswordReset').mockResolvedValue('success');
    const toastrSuccess = jest.spyOn(mockToastr, 'success');

    await component.handleSubmit({ staffId: 'TN012345' });

    expect(authenticatorLogin).toHaveBeenCalled();
    expect(toastrSuccess).toHaveBeenCalled();
  });

  it('should display error message if request fails.', async () => {
    jest.spyOn(authenticatorMock, 'requestPasswordReset').mockRejectedValue('err');
    const toastrError = jest.spyOn(mockToastr, 'error');

    await component.handleSubmit({ staffIdOrEmail: 'TN012345' });

    expect(toastrError).toHaveBeenCalledWith('Password reset request failed.');
  });
});
