import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IGetStatistics, IGetPendingClaim, IGetActivities, IStaffData, } from './models';

@Injectable()
export class OvertimeService {
  constructor(private http: HttpClient) { }
  api = 'http://init.overtime-api.example.com:7000';
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  }

  async initialiseStaffData(): Promise<any[]> {
    try {
      const { data: claimStatistics} = await this.fetchStaffClaimStatistics();
      const { data: pendingClaim} = await this.fetchStaffPendingClaim();
      const { data: activities } = await this.fetchStaffActivities();
      return [claimStatistics, pendingClaim, activities];
    } catch(e) {
      throw new Error();
    }

  }

  fetchStaffClaimStatistics(): Promise<IGetStatistics> {
    return this.http.get<IGetStatistics>(`${this.api}/users/claims/statistics`, this.options).toPromise();
  }

  fetchStaffPendingClaim(): Promise<IGetPendingClaim> {
    return this.http.get<IGetPendingClaim>(`${this.api}/users/claims/pending`, this.options).toPromise();
  }

  fetchStaffActivities(): Promise<IGetActivities> {
    return this.http.get<IGetActivities>(`${this.api}/users/activities`, this.options).toPromise();
  }
}
