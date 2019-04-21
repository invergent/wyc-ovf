import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Authenticator, TOASTR_TOKEN, IToastr, IPasswordReset
} from '../../shared';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['../../login/login.component.scss', './password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  password
  confirmPassword
  displaySpinner
  passwordFieldType = 'password';

  constructor(
    private authenticator: Authenticator,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
  ) { }

  ngOnInit() {
    if (!this.route.snapshot.queryParams['hash']) {
      this.toastr.error('Unauthorised! Please re-initiate password reset.');
      return this.router.navigate(['/forgot-password']);
    }
  }

  toggleViewPasswordText() {
    this.passwordFieldType = 'text';
    setTimeout(() => (this.passwordFieldType = 'password'), 1500);
  }

  validateFormData(formValues: IPasswordReset) {
    const { password, confirmPassword } = formValues;
    if (password !== confirmPassword) return ['Passwords do not match'];
    return [];
  }

  async handleSubmit(formValues: IPasswordReset) {
    const errors = this.validateFormData(formValues);
    if (errors.length) {
      this.displaySpinner = false;
      return this.toastr.error(errors[0]);
    }

    try {
      const hash = this.route.snapshot.queryParams['hash'];
      const response = await this.authenticator.resetPassword(formValues, hash);
      this.toastr.success(response.message);
      return this.router.navigate(['/login']);
    } catch(e) {
      this.displaySpinner = false;
      return this.toastr.error('Password reset failed.');
    }
  }

}
