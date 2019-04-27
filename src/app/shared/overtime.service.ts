import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IGetStatistics } from './models';

@Injectable()
export class OvertimeService {
  constructor(private http: HttpClient) { }
  api = 'http://init.overtime-api.example.com:7000';
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  }

  fetchStaffClaimStatistics(): Promise<IGetStatistics> {
    return this.http.get<IGetStatistics>(`${this.api}/users/claims/statistics`, this.options).toPromise();
  }
}
