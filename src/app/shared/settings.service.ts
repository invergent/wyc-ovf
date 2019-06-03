import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ISettings, IGetSettings, IPutEmailSetting } from "./models";

@Injectable()
export class SettingsService {
  api = environment.api;
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  }

  settings: ISettings

  constructor(private http: HttpClient) {}

  async initialiseSettingsData(): Promise<boolean> {
    try {
      const { data: settings } = await this.fetchSettingsData();
      this.settings = settings[0];
      return true;
    } catch(e) {
      console.log(e)
      throw new Error();
    }
  }

  async fetchAdminSettings() {
    if (!this.settings) await this.initialiseSettingsData();
    return this.settings;
  }

  syncWithAPI() {
    return this.initialiseSettingsData();
  }

  fetchSettingsData(): Promise<IGetSettings> {
    return this.http.get<IGetSettings>(`${this.api}/admin/settings`, this.options).toPromise();
  }

  updateEmailingSetting(cronTime: string): Promise<IPutEmailSetting> {
    return this.http.put<IPutEmailSetting>(`${this.api}/admin/settings/email-schedule`, { emailSchedule: cronTime }, this.options).toPromise();
  }
}