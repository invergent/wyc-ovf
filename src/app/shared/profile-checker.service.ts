import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class ProfileCheckerService {
  changedPassword: boolean
  supervisor: string
  bsm: string
  branch: string
  role: string
  expectedFields: string[] = ['changedPassword', 'role', 'branch', 'supervisor', 'bsm'];
  pendingFields: string[]

  constructor(private authService: AuthService) { }

  getCurrentFieldsStatus() {
    this.changedPassword = this.authService.currentStaff.changedPassword;
    this.supervisor = this.authService.currentStaff.supervisorEmailAddress;
    this.bsm = this.authService.currentStaff.bsmEmailAddress;
    this.branch = this.authService.currentStaff.branch;
    this.role = this.authService.currentStaff.role;
  }

  getPendingFields() {
    this.getCurrentFieldsStatus();
    this.pendingFields = this.expectedFields.filter(field => !this[field]);
    return this.pendingFields;
  }
}
