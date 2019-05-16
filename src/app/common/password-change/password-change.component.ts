import { Component, Inject } from '@angular/core';
import { JQUERY_TOKEN, TOASTR_TOKEN, IToastr, AuthService, OvertimeService } from '../../shared';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent {
  displaySpinner: boolean = false;
  currentPassword
  newPassword
  confirmPassword

  constructor(
    private authService: AuthService,
    private overtimeService: OvertimeService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

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
      await this.overtimeService.syncWithAPI();
      this.toastr.success('Password changed successfully.');
      this.displaySpinner = false;
      this.clearInputFields();
    } catch (e) {
      this.displaySpinner = false;
      if (e.error.message.includes('Password')) return this.toastr.error(e.error.message);
      return this.toastr.error('An error occurred.');
    }
  }
}
