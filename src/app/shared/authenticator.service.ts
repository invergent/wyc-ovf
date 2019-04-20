import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IStaff, ILoginFormData } from './models';

@Injectable()
export class Authenticator {
  constructor(private http: HttpClient) { }
  api = 'http://init.overtime-api.invergent-technologies.com';
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  }

  checkValidity():Promise<IStaff> {
    return this.http.get<IStaff>(`${this.api}/users/profile`, this.options).toPromise();
  }

  login(userCredentials: ILoginFormData): Promise<any> {
    return this.http.post(`${this.api}/signin`, userCredentials, this.options).toPromise();
  }

  requestPasswordReset(userCredentials: ILoginFormData): Promise<any> {
    return this.http.post(`${this.api}/forgot-password`, userCredentials, this.options).toPromise();
  }

  verifyPasswordResetRequest(hash: string): Promise<any> {
    return this.http.get(`${this.api}/confirm-reset-request?hash=${hash}`).toPromise();
  }
}
