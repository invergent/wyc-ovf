import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class SuperAdminAuditorGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate() {
    const isAuthenticated = await this.authService.authenticate();
    if (!isAuthenticated) return this.router.navigate(['/login']);

    const { isAdmin, currentStaff: { changedPassword } } = this.authService;
    if (isAdmin && !changedPassword) return this.router.navigate(['/admin/change-password'], { queryParams: { m: 'p' } });

    if (['Super Admin', 'Auditor'].includes(this.authService.currentStaff.role)) return true;
    return this.router.navigate(['/login']);
  }
}
