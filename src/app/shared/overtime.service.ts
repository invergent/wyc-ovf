import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  IGetStatistics, IGetPendingClaim, IGetActivities, IPostOvertimeRequest, IValidClaimRequest,
  IClaimStatistics, IClaim, IActivity, IStaffClaimData, IGetClaimHistory
} from './models';

@Injectable()
export class OvertimeService {
  constructor(private http: HttpClient) { }
  api = environment.api;
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  }
  staffClaimData: IStaffClaimData

  async initialiseStaffData(): Promise<boolean> {
    try {
      const { data: claimStatistics } = await this.fetchStaffClaimStatistics();
      const { data: pendingClaim } = await this.fetchStaffPendingClaim();
      const { data: activities } = await this.fetchStaffActivities();
      const { data: claimHistory } = await this.fetchStaffClaimHistory();
      this.staffClaimData = { activities, pendingClaim, claimStatistics, claimHistory };
      return true;
    } catch(e) {
      throw new Error();
    }
  }

  async fetchStaffData() {
    if (!this.staffClaimData) await this.initialiseStaffData();
    return this.staffClaimData;
  }

  syncWithAPI() {
    return this.initialiseStaffData();
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

  fetchStaffClaimHistory(): Promise<IGetClaimHistory> {
    return this.http.get<IGetClaimHistory>(`${this.api}/users/claims/history`, this.options).toPromise();
  }

  createOvertimeRequest(overtimeRequest: IValidClaimRequest): Promise<IPostOvertimeRequest> {
    return this.http.post<IPostOvertimeRequest>(`${this.api}/users/claim`, overtimeRequest, this.options).toPromise();
  }

  cancelClaim(claimId: number): Promise<IPostOvertimeRequest> {
    return this.http.delete<IPostOvertimeRequest>(`${this.api}/users/claims/${claimId}`, this.options).toPromise();
  }
}
