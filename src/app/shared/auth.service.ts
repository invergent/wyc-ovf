import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IGetStaffProfile, ILoginFormData, IPasswordReset, IStaff } from './models';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) { }
  currentStaff: IStaff
  api = 'http://init.overtime-api.invergent-technologies.com';
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  }

  async authenticate():Promise<boolean> {
    try {
      const { data } = await this.fetchStaffProfile();
      this.currentStaff = data;
      return true;
    } catch(e) {
      return false;
    }
  }

  fetchStaffProfile():Promise<IGetStaffProfile> {
    return this.http.get<IGetStaffProfile>(`${this.api}/users/profile`, this.options).toPromise();
  }

  login(userCredentials: ILoginFormData): Promise<any> {
    return this.http.post(`${this.api}/signin`, userCredentials, this.options).toPromise();
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
}