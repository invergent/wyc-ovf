import { Component, OnInit } from '@angular/core';
import { AuthService, IStaff } from 'src/app/shared';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentStaff: IStaff

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.currentStaff = this.authService.currentStaff;
  }
}
