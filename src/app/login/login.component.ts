import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AuthService, TOASTR_TOKEN, ILoginFormData, IToastr, JQUERY_TOKEN, emailRegex
} from '../shared';
import { staffIdRegex } from '../shared';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  mouseoverLoginButton
  displaySpinner
  passwordFieldType = 'password';
  staffId
  password
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  ngOnInit() {
    if (this.route.snapshot.queryParams['m']) {
      this.toggleFlashMessage('Please login with your new password.')
    }
  }

  toggleFlashMessage(message) {
    this.jQuery('#f-message').text(message);
    this.jQuery('#close').css('display', 'none');
    setTimeout(() => this.jQuery('#flash-message').css('right', '15px'), 1000);
    setTimeout(() => this.jQuery('#flash-message').css('right', '-400px'), 6000);
  }

  toggleViewPasswordText() {
    this.passwordFieldType = 'text';
    setTimeout(() => (this.passwordFieldType = 'password'), 1500);
  }

  validateFormData(formValues: ILoginFormData) {
    const { staffId, email } = formValues;
    const isValid = staffId ? staffIdRegex.test(staffId) : emailRegex.test(email);
    if (!isValid) return [`${staffId ? 'Staff ID' : 'Email address'} is incorrect`];
    return [];
  }

  async handleSubmit(formValues: ILoginFormData) {
    const errors = this.validateFormData(formValues);
    if (errors.length) {
      this.displaySpinner = false;
      return this.toastr.error(errors[0]);
    }
    
    const loginType = this.isAdmin ? 'admin/login' : 'signin';
    
    try {
      console.log(formValues, loginType)
      const response = await this.authService.login(formValues, loginType);
      this.toastr.success(response.message);

      await this.authService.authenticate();
      
      return this.router.navigate([`/${this.isAdmin ? 'admin' : 'staff'}/dashboard`]);
    } catch(e) {
      console.log(e)
      this.displaySpinner = false;
      return this.toastr.error(e.error.message || 'Login failed. Check your connectivity.');
    }
  }
}
