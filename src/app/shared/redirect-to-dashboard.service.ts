import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Authenticator } from './authenticator.service';

@Injectable()
export class RedirectToDashboard implements CanActivate {
  constructor(private router: Router, private authenticator: Authenticator) {}

  async canActivate() {
    try {
      await this.authenticator.checkValidity();
      return this.router.navigate(['/staff/dashboard']);
    } catch(e) {
      return true; // proceed to login page
    }
  }
}
