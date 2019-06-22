import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class RedirectToDashboard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate() {
    const isAdmin = this.authService.isAdmin;
    return this.authService.isAuthenticated
      ? this.router.navigate([`/${isAdmin ? 'admin' : 'staff'}/dashboard`])
      : true;
  }
}
