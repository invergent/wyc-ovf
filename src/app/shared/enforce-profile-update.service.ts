import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ProfileCheckerService } from './profile-checker.service';

@Injectable()
export class EnforceProfileUpdateService implements CanActivate {

  constructor(private router: Router, private profileChecker: ProfileCheckerService) { }

  canActivate() {
    const pendingFields = this.profileChecker.getPendingFields();
    console.log(pendingFields);
    
    if (pendingFields.includes('changedPassword')) {
      return this.router.navigate(['/staff/change-password'], { queryParams: { m: 'p' } });
    }
    if (pendingFields.length) {
      return this.router.navigate(['/staff/profile'], { queryParams: { m: 'lm' } });
    }

    return true;
  }
}
