import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IGetStaffProfile, ILoginFormData, IPasswordReset, IStaff, IChangePassword } from './models';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }
  api = environment.api;
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  }
  currentStaff: IStaff
  isAuthenticated: boolean = false;

  async authenticate():Promise<boolean> {
    try {
      const { data } = await this.fetchStaffProfile();
      this.currentStaff = data;
      this.isAuthenticated = true;
      return true;
    } catch(e) {
      return false;
    }
  }

  async syncWithAPI() {
    const { data } = await this.fetchStaffProfile();
    this.currentStaff = data;
  }

  fetchStaffProfile():Promise<IGetStaffProfile> {
    return this.http.get<IGetStaffProfile>(`${this.api}/users/profile`, this.options).toPromise();
  }

  login(userCredentials: ILoginFormData, loginType: string): Promise<any> {
    return this.http.post(`${this.api}/${loginType}`, userCredentials, this.options).toPromise();
  }

  logout(): Promise<any> {
    return this.http.get(`${this.api}/destroy-token`, this.options).toPromise();
  }

  requestPasswordReset(userCredentials: ILoginFormData): Promise<any> {
    return this.http.post(`${this.api}/forgot-password`, userCredentials, this.options).toPromise();
  }

  verifyPasswordResetRequest(hash: string): Promise<any> {
    return this.http.get(`${this.api}/confirm-reset-request?hash=${hash}`, this.options).toPromise();
  }

  resetPassword(resetPasswordData: IPasswordReset, hash: string): Promise<any> {
    return this.http.post(`${this.api}/users/profile/reset?hash=${hash}`, resetPasswordData, this.options).toPromise();
  }

  changePassword(changePasswordData: IChangePassword): Promise<any> {
    return this.http.post(`${this.api}/change-password`, changePasswordData, this.options).toPromise();
  }
}
