import { Injectable, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { INotification, IGetNotification, IPutNotification, IPusher, ISubscribe } from './models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PUSHER_TOKEN } from './pusher.service';
import { AuthService } from './auth.service';

@Injectable()
export class NotificationService {
  api: string = environment.api;
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  }
  
  notifications: INotification[]
  newNotificationsCount: number

  channel: ISubscribe

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PUSHER_TOKEN) private pusherService: IPusher
  ) { }

  async initialiseNotificationsData() {
    const { data } = await this.fetchNotifications();
    const { notifications, newNotificationsCount } = this.formatNotificationsData(data);
    this.notifications = notifications;
    this.newNotificationsCount = newNotificationsCount;
    this.channel = this.pusherService.subscribe(`${this.authService.currentStaff.staffId}`);
  }

  async getNotificationsData(force): Promise<any[]> {
    if (!this.notifications || force) {
      await this.initialiseNotificationsData();
    }
    return [this.notifications, this.newNotificationsCount];
  }

  formatNotificationsData(notifications) {
    return notifications.reduce((acc, item) => {
      if (!item.viewed) acc.newNotificationsCount += 1;
      if (item.activity.length > 30) item.activity = `${item.activity.slice(0, 26)}...${item.activity.slice(32, 37)}...`;
      acc.notifications.push(item);
      return acc;
    }, { notifications: [], newNotificationsCount: 0 });
  }

  async markNotificationsAsReadAndViewed() {
    await this.markNotificationAsRead();
    return this.initialiseNotificationsData();
  }

  playAudio(pathToAudioFile){
    let audio = new Audio();
    audio.src = pathToAudioFile;
    audio.load();
    audio.play();
  }

  fetchNotifications(): Promise<IGetNotification> {
    return this.http.get<IGetNotification>(`${this.api}/notifications`, this.options).toPromise();
  }

  markNotificationAsRead(): Promise<IPutNotification> {
    return this.http.put<IPutNotification>(`${this.api}/notifications/read`, {}, this.options).toPromise();
  }
}
