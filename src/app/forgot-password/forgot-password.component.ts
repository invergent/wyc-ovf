import { Component, Inject } from '@angular/core';
import {
  AuthService, TOASTR_TOKEN, ILoginFormData, IToastr
} from '../shared';
import { staffIdRegex, emailRegex } from '../shared/utils';

@Component({
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../login/login.component.scss', './forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  mouseoverLoginButton
  displaySpinner
  staffIdOrEmail

  constructor(
    private authService: AuthService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
  ) { }

  validateFormData(formValues: ILoginFormData) {
    const { staffIdOrEmail } = formValues;
    const errors = [];
    const isStaffID = staffIdRegex.test(staffIdOrEmail);
    const isEmailAddress = emailRegex.test(staffIdOrEmail);
    if (!isStaffID && !isEmailAddress) errors.push('You entered an incorrect value');

    const payload = { [`${isStaffID ? 'staffId' : 'email'}`]: staffIdOrEmail };

    return { errors, payload };
  }

  async handleSubmit(formValues: ILoginFormData) {
    const validatedData = this.validateFormData(formValues);
    if (validatedData.errors.length) {
      this.displaySpinner = false;
      return this.toastr.error(validatedData.errors[0]);
    }

    try {
      const response = await this.authService.requestPasswordReset(validatedData.payload);
      this.toastr.success(response.message);
      this.staffIdOrEmail = '';
      this.displaySpinner = false;
    } catch(e) {
      this.displaySpinner = false;
      return this.toastr.error('Password reset request failed.');
    }
  }
}
