import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared';
import { LineManagerService } from '../line-manager.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  displaySpinner: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private lineManagerService: LineManagerService
  ) { }

  async ngOnInit() {
    try {
      const hash = this.route.snapshot.queryParams['hash'];
      await this.lineManagerService.verifyLineManager(hash);
      return this.router.navigate(['/line-manager/approvals']);
    } catch(e) {
      this.displaySpinner = false;
    }
  }
}
