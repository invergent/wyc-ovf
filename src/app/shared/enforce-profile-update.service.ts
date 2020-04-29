import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ProfileCheckerService } from './profile-checker.service';
import { AuthService } from './auth.service';

@Injectable()
export class EnforceProfileUpdateService implements CanActivate {

  constructor(
    private router: Router,
    private profileChecker: ProfileCheckerService,
    private authService: AuthService
  ) { }

  canActivate() {
    const { isAdmin, currentStaff: { changedPassword } } = this.authService;
    if (isAdmin && !changedPassword) return this.router.navigate(['/admin/change-password'], { queryParams: { m: 'p' } });
    
    const pendingFields = this.profileChecker.getPendingFields();
    
    if (pendingFields.includes('changedPassword')) {
      return this.router.navigate(['/staff/change-password'], { queryParams: { m: 'p' } });
    }
    if (pendingFields.length) {
      return this.router.navigate(['/staff/profile'], { queryParams: { m: 'lm' } });
    }

    return true;
  }
}
