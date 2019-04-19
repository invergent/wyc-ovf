import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Authenticator } from '../shared/authenticator.service';
import { TOASTR_TOKEN } from '../shared/toastr.service';
import { ILoginFormData, IToastr } from '../shared/models'

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  mouseoverLoginButton

  constructor(
    private authenticator: Authenticator,
    private router: Router,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
  ) { }

  validateFormData(formValues: ILoginFormData) {
    const staffIdRegex = /^[Tt][Nn][0-9]{6}$/;
    const { staffId } = formValues;
    if (!staffIdRegex.test(staffId)) return ['Staff ID is incorrect'];
    return [];
  }

  async handleSubmit(formValues: ILoginFormData) {
    const errors = this.validateFormData(formValues);
    if (errors.length) return this.toastr.error(errors[0]);

    try {
      const response = await this.authenticator.login(formValues);
      this.toastr.success(response.message);
      return this.router.navigate(['/']);
    } catch(e) {
      return this.toastr.error('Login failed.');
    }
  }
}
