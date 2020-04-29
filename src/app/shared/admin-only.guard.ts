import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async canActivate() {
    const { isAdmin, currentStaff: { changedPassword } } = this.authService;
    if (isAdmin && !changedPassword) return this.router.navigate(['/admin/change-password'], { queryParams: { m: 'p' } });

    if (!this.authService.currentStaff.role.includes('Admin')) {
      return this.router.navigate(['/admin/claims']);
    }
    return true;
  }
}
