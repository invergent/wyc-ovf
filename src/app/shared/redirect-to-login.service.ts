import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class RedirectToLogin implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  async canActivate() {
    const isAuthenticated = await this.authService.authenticate();
    return isAuthenticated || this.router.navigate(['/login']);
  }
}
