import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class RedirectToDashboard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate() {
    return this.authService.isAuthenticated ? this.router.navigate(['/staff/dashboard']) : true;
  }
}
