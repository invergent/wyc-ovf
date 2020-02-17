import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class ProfileCheckerService {
  changedPassword: boolean
  lineManager: string
  branch: string
  role: string
  phone: string
  accountNumber: string
  expectedFields: string[] = ['changedPassword', 'branch', 'role', 'phone', 'accountNumber', 'lineManager'];
  pendingFields: string[]

  constructor(private authService: AuthService) { }

  getCurrentFieldsStatus() {
    this.changedPassword = this.authService.currentStaff.changedPassword;
    this.lineManager = this.authService.currentStaff.lineManagerEmailAddress;
    this.branch = this.authService.currentStaff.branch;
    this.role = this.authService.currentStaff.role;
    this.phone = this.authService.currentStaff.phone;
    this.accountNumber = this.authService.currentStaff.accountNumber;
  }

  getPendingFields() {
    this.getCurrentFieldsStatus();
    this.pendingFields = this.expectedFields.filter(field => !this[field]);
    return this.pendingFields;
  }
}
