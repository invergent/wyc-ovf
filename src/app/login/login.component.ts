import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthService, TOASTR_TOKEN, ILoginFormData, IToastr
} from '../shared';
import { staffIdRegex } from '../shared/utils';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  mouseoverLoginButton
  displaySpinner
  passwordFieldType = 'password';
  staffId
  password

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
  ) { }

  toggleViewPasswordText() {
    this.passwordFieldType = 'text';
    setTimeout(() => (this.passwordFieldType = 'password'), 1500);
  }

  validateFormData(formValues: ILoginFormData) {
    const { staffId } = formValues;
    if (!staffIdRegex.test(staffId)) return ['Staff ID is incorrect'];
    return [];
  }

  async handleSubmit(formValues: ILoginFormData) {
    const errors = this.validateFormData(formValues);
    if (errors.length) {
      this.displaySpinner = false;
      return this.toastr.error(errors[0]);
    }

    try {
      const response = await this.authService.login(formValues);
      this.toastr.success(response.message);
      return this.router.navigate(['/staff/dashboard']);
    } catch(e) {
      this.displaySpinner = false;
      return this.toastr.error(e.error.message || 'Login failed. Check your connectivity.');
    }
  }
}
