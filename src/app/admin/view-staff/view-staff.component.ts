import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OvertimeService, ProfileService, IProfileUpdate } from 'src/app/shared';

@Component({
  selector: 'app-view-staff',
  templateUrl: './view-staff.component.html',
  styleUrls: ['./view-staff.component.scss']
})
export class ViewStaffComponent implements OnInit {
  staff: IProfileUpdate

  showLoader: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

  async ngOnInit() {
    const staffId = this.route.snapshot.paramMap.get('staffId');
    try {
      const { data } = await this.profileService.fetchSingleStaff(staffId);
      console.log(data)
      this.staff = data
      this.showLoader = false;
    } catch (error) {
      this.showLoader = false;
      this.errorMessage = 'Unable to load content. Please reload';
    }
  }

}
