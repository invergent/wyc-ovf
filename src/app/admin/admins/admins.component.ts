import { Component, OnInit, Inject } from '@angular/core';
import { IStaffForAdmin, ProfileService, TOASTR_TOKEN, IToastr, IRole } from 'src/app/shared';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {
  staffList: IStaffForAdmin[] = [];
  roleList: IRole[];
  
  // modal controls
  modalTitle: string
  currentModal: string
  displayModal: string = 'none';
  displaySpinner: boolean = false;
  displayFetchSpinner: boolean = false;

  addAdminModal
  deleteAdminModal

  adminToRemove: string;

  constructor(
    private profileService: ProfileService,
    @Inject(TOASTR_TOKEN) private toastr: IToastr
  ) { }

  ngOnInit() {
    this.updateStaffList();
    this.updateRoleList();
  }

  async updateStaffList() {
    const { data } = await this.profileService.fetchAdmins();
    this.staffList = data;
  }

  async updateRoleList() {
    const { data } = await this.profileService.fetchRoles(true);
    this.roleList = data;
  }

  runModalDisplay(modal, title, staffId?) {
    if (modal === 'deleteAdminModal' && !staffId) {
      return this.toastr.error('Operation failed!');
    }

    this.modalTitle = title;
    this.displayModal = 'block';
    this.currentModal = modal;
    this[modal] = true;

    if (staffId) {
      this.adminToRemove = staffId;
    }
  }

  closeModal(modal) {
    this.displayModal = 'none';
    this[modal] = false;
    this.adminToRemove = null;
  }

  async removeAdmin() {
    this.displaySpinner = true;

    try {
      await this.profileService.removeUser(this.adminToRemove);
      this.toastr.success('Admin removed!');
      await this.updateStaffList();
      this.displaySpinner = false;
      this.closeModal(this.currentModal);
    } catch (error) {
      this.toastr.error(error.error ? error.error.message : 'Error removing admin.');
      this.displaySpinner = false;
    }
  }

  async handleSubmit(formValues) {
    console.log(formValues);
    try {
      await this.profileService.createAdmin(formValues);
      this.toastr.success('Admin created!');
      await this.updateStaffList();
      this.displaySpinner = false;
      this.closeModal(this.currentModal);
    } catch (error) {
      this.toastr.error(error.error ? error.error.message : 'Error creating admin.');
      this.displaySpinner = false;
    }
  }
}
