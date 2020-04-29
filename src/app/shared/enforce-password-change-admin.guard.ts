import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class EnforcePasswordChangeAdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }
  canActivate() {
    const { isAdmin, currentStaff: { changedPassword } } = this.authService;
    if (isAdmin && !changedPassword) return this.router.navigate(['/admin/change-password'], { queryParams: { m: 'p' } });
    return true;
  }
}
