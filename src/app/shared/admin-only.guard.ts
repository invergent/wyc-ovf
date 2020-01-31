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
    if (this.authService.currentStaff.role.includes('Admin')) return true;
    return this.router.navigate(['/admin/claims']);
  }
}
