import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IStaff, ILoginFormData } from './models';

@Injectable()
export class Authenticator {
  constructor(private http: HttpClient) { }
  api = 'http://init.overtime-api.example.com:7000';
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
}
