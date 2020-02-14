import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  IGetLineManagers, IGetBranches, IGetRoles, IProfileData, IPutProfile, IProfileUpdate,
  IPostImage, IGetStaffList, ICreateStaffData, IGetSingleStaff
} from "./models";

@Injectable()
export class ProfileService {
  api = environment.api;
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  }

  profileData: IProfileData

  constructor(private http: HttpClient) {}

  async initialiseProfileData(includeStaff): Promise<boolean> {
    let staffList;
    try {
      const { data: lineManagers } = await this.fetchLineManagers();
      const { data: branches } = await this.fetchBranches();
      const { data: roles } = await this.fetchRoles();
      if(includeStaff) {
        const { data } = await this.fetchStaff();
        staffList = data;
      }
      this.profileData = { lineManagers, branches, roles, staffList };
      return true;
    } catch(e) {
      throw new Error();
    }
  }

  async fetchProfileData(includeStaff?: boolean) {
    if (!this.profileData || includeStaff) await this.initialiseProfileData(includeStaff);
    return this.profileData;
  }

  syncWithAPI(includeStaff?: boolean) {
    return this.initialiseProfileData(includeStaff);
  }

  fetchLineManagers(): Promise<IGetLineManagers> {
    return this.http.get<IGetLineManagers>(`${this.api}/line-managers`, this.options).toPromise();
  }

  fetchBranches(): Promise<IGetBranches> {
    return this.http.get<IGetBranches>(`${this.api}/branches`, this.options).toPromise();
  }

  fetchRoles(adminsOnly?: boolean): Promise<IGetRoles> {
    return this.http.get<IGetRoles>(`${this.api}/roles${adminsOnly ? '?adminsOnly=true':''}`, this.options).toPromise();
  }

  fetchAdmins(): Promise<IGetStaffList> {
    return this.http.get<IGetStaffList>(`${this.api}/admin/admins`, this.options).toPromise();
  }

  fetchStaff(staffId?: string, limit?: number, staffOnly?: boolean): Promise<IGetStaffList> {
    return this.http
      .get<IGetStaffList>(`${this.api}/admin/staff?staffId=${staffId || ''}&limit=${limit || 10000000}&staffOnly=${staffOnly || false}`, this.options)
      .toPromise();
  }

  fetchSingleStaff(staffId: string): Promise<IGetSingleStaff> {
    return this.http.get<IGetSingleStaff>(`${this.api}/admin/staff/${staffId}`, this.options).toPromise();
  }

  updateImage(imageData): Promise<IPostImage> {
    const imageOptions = { withCredentials: true };
    return this.http.post<IPostImage>(`${this.api}/users/profile/image`, imageData, imageOptions).toPromise();
  }

  updatePersonalInfo(updatePayload: IProfileUpdate): Promise<IPutProfile> {
    return this.http.put<IPutProfile>(`${this.api}/users/profile`, updatePayload, this.options).toPromise();
  }

  updateLineManagerInfo(updatePayload: IProfileUpdate): Promise<IPutProfile> {
    return this.http.post<IPutProfile>(`${this.api}/users/profile/line-manager`, updatePayload, this.options).toPromise();
  }

  createBulk(excelData, route: string = 'staff') {
    return this.http.post<IPutProfile>(`${this.api}/admin/${route}`, excelData, { withCredentials: true }).toPromise();
  }

  createSingle(staffData: ICreateStaffData, route: string = 'staff') {
    return this.http.post(`${this.api}/admin/${route}/single`, staffData, this.options).toPromise();
  }

  createAdmin(adminData: ICreateStaffData) {
    return this.http.post(`${this.api}/admin/admins`, adminData, this.options).toPromise();
  }

  resendLoginCredentials(staffId: string) {
    return this.http.post<IPutProfile>(`${this.api}/admin/staff/resend-credentials`, { staffId }, this.options).toPromise();
  }

  authoriseLineManagerEdit(staffId: string) {
    return this.http.post<IPutProfile>(`${this.api}/admin/staff/manager-edit`, { staffId }, this.options).toPromise();
  }

  authoriseMultipleClaims(payload) {
    return this.http.put<IPutProfile>(`${this.api}/admin/staff/multiple-claims`, payload, this.options).toPromise();
  }

  removeStaff(staffId) {
    return this.http.delete<IPutProfile>(`${this.api}/admin/staff/${staffId}`, this.options).toPromise();
  }

  removeUser(id, route: string = 'admins') {
    return this.http.delete<IPutProfile>(`${this.api}/admin/${route}/${id}`, this.options).toPromise();
  }
}