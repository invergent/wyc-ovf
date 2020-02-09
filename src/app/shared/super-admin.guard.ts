import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate() {
    const isAuthenticated = await this.authService.authenticate();
    if (!isAuthenticated) return this.router.navigate(['/login']);
    if (this.authService.currentStaff.role === 'Super Admin') return true;
    return this.router.navigate(['/login']);
  }
}
