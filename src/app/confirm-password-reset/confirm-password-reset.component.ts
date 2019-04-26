import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Authenticator } from '../shared';

@Component({
  templateUrl: './confirm-password-reset.component.html',
  styleUrls: ['./confirm-password-reset.component.scss']
})
export class ConfirmPasswordResetComponent implements OnInit {
  displaySpinner: boolean = true;

  constructor(
    private authenticator: Authenticator,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    try {
      const hash = this.route.snapshot.queryParams['hash'];
      await this.authenticator.verifyPasswordResetRequest(hash);
      return this.router.navigate([`/password-reset`], { queryParams: { hash } });
    } catch(e) {
      this.displaySpinner = false;
    }
  }
}
