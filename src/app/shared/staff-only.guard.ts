import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class StaffOnlyGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate() {
    const isAuthenticated = await this.authService.authenticate();
    if (!isAuthenticated) return this.router.navigate(['/login']);
    if (!['Super Admin', 'Admin', 'Auditor'].includes(this.authService.currentStaff.role)) return true;
    return this.router.navigate(['/login']);
  }
}
