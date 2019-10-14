import { Component, Output, EventEmitter, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import {
  NotificationService, INotification, JQUERY_TOKEN, AuthService, OvertimeService
} from 'src/app/shared';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNav implements OnInit {
  @Output() sideNavToggleEvent = new EventEmitter();
  profileMenu: boolean = false;
  notificationMenu: boolean = false;
  flashMessage: string = '';

  notifications: INotification[] = [];
  newNotificationsCount: number = 0;

  userImage: string = 'https://res.cloudinary.com/dbsxxymfz/image/upload/v1536757459/dummy-profile.png';
  staffType: string
  claimHistoryLink: string[]
  pendingClaimLink: string[]
  menuItemProfile: string[]
  menuItemChangePassword: string[]

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private overtimeService: OvertimeService,
    private changeDetector: ChangeDetectorRef,
    @Inject(JQUERY_TOKEN) private jQuery
  ) { }

  async ngOnInit() {
    await this.initialiseNotifications();
    this.userImage = this.authService.currentStaff.image;
    this.staffType = this.authService.isAdmin ? 'admin' : 'staff';
    this.claimHistoryLink = [`/${this.staffType}/claim-history`];
    this.pendingClaimLink = [`/${this.staffType}/pending-claim`];
    this.menuItemProfile = [`/${this.staffType}/profile`]; 
    this.menuItemChangePassword = [`/${this.staffType}/change-password`]; 
    this.notificationService.channel.bind_global((triggeredEvent, payload) => this.notificationEventHandler(triggeredEvent, payload));
  }

  async notificationEventHandler(triggeredEvent, payload) {
    if (payload.message) {
      // sync data with API
      await this.initialiseNotifications(true);
      await this.overtimeService.syncWithAPI();
      this.toggleFlashMessage(payload.message);
      this.changeDetector.detectChanges();
    }
  }

  async initialiseNotifications(force?: boolean) {
    const [notifications, newNotificationsCount] = await this.notificationService.getNotificationsData(force);
    this.notifications = notifications;
    this.newNotificationsCount = newNotificationsCount;
  }

  toggleFlashMessage(message) {
    this.jQuery('#f-message').text(message);
    this.jQuery('#close').css('display', 'none');
    setTimeout(() => this.jQuery('#flash-message').css('right', '15px'), 1000);
    setTimeout(() => this.notificationService.playAudio('../../../assets/audio/notif.mp3'), 1500);
    setTimeout(() => this.jQuery('#flash-message').css('right', '-400px'), 10000);
  }

  async markNotificationsAsViewed() {
    if (this.newNotificationsCount !== 0) {
      this.newNotificationsCount = 0;
      await this.notificationService.markNotificationsAsReadAndViewed();
      return this.initialiseNotifications();
    }
  }

  toggleSideNav() {
    this.sideNavToggleEvent.emit();
  }
}
