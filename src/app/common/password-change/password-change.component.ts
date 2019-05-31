import { Component, Inject, AfterViewInit } from '@angular/core';
import {
  JQUERY_TOKEN, TOASTR_TOKEN, IToastr, AuthService, OvertimeService, ProfileCheckerService
} from '../../shared';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements AfterViewInit {
  displaySpinner: boolean = false;
  currentPassword
  newPassword
  confirmPassword
  firstTimeLogin

  constructor(
    private authService: AuthService,
    private overtimeService: OvertimeService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  ngAfterViewInit() {
    this.firstTimeLogin = this.route.snapshot.queryParams['m'];
    if (this.firstTimeLogin) this.displayFlashMessage('Welcome! Please change your password.');

    this.jQuery('#close').click(() => this.closeFlashMessage())
  }

  displayFlashMessage(message) {
    this.jQuery('#f-message').text(message);
    setTimeout(() => this.jQuery('#flash-message').css('right', '15px'), 1000);
  }

  closeFlashMessage() {
    this.jQuery('#flash-message').css('opacity', '0')
    setTimeout(() => this.jQuery('#flash-message').css('display', 'none'), 500);
  }

  toggleViewPasswordText(elementId) {
    this.jQuery(elementId).prop({ type: 'text' });
    setTimeout(() => {
      this.jQuery(elementId).prop({ type: 'password' });
    }, 1000);
  }

  clearInputFields() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  async handleSubmit(formValues) {
    const { newPassword, confirmPassword } = formValues;

    if (newPassword !== confirmPassword) {
      this.displaySpinner = false;
      return this.toastr.error('Passwords do not match');
    }

    try {
      await this.authService.changePassword(formValues);
      await this.authService.syncWithAPI();
      if(!this.authService.isAdmin) await this.overtimeService.syncWithAPI();
      this.toastr.success('Password changed successfully.');
      this.displaySpinner = false;
      this.clearInputFields();
      if (this.firstTimeLogin) return this.router.navigate(['/staff/profile'], { queryParams: { m: 'p-lm' } }) 
    } catch (e) {
      this.displaySpinner = false;
      if (e.error.message.includes('Password')) return this.toastr.error(e.error.message);
      return this.toastr.error('An error occurred.');
    }
  }
}
