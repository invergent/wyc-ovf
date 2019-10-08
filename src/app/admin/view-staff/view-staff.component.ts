import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OvertimeService, ProfileService, IProfileUpdate, IToastr, TOASTR_TOKEN } from 'src/app/shared';

@Component({
  selector: 'app-view-staff',
  templateUrl: './view-staff.component.html',
  styleUrls: ['./view-staff.component.scss']
})
export class ViewStaffComponent implements OnInit {
  staff: IProfileUpdate

  showLoader: boolean = true;
  errorMessage: string = '';
  displaySpinner: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
  ) { }

  async ngOnInit() {
    const staffId = this.route.snapshot.paramMap.get('staffId');
    try {
      const { data } = await this.profileService.fetchSingleStaff(staffId);
      this.staff = data
      this.showLoader = false;
    } catch (error) {
      this.showLoader = false;
      this.errorMessage = 'Unable to load content. Please reload';
    }
  }

  async resendLoginCredentials(staffId) {
    this.displaySpinner = true;
    try {
      const { message } = await this.profileService.resendLoginCredentials(staffId);
      this.displaySpinner = false;
      return this.toastr.success(message);
    } catch (error) {
      this.displaySpinner = false;
      if (error.error) return this.toastr.error(error.error.message);
      return this.toastr.error('An error occurred');
    }
  }
}
