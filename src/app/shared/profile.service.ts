import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  IGetLineManagers, IGetBranches, IGetRoles, IProfileData, IPutProfile, IProfileUpdate,
  IPostImage, IGetStaffProfile, IGetStaffList, ICreateStaffData
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

  async initialiseProfileData(): Promise<boolean> {
    try {
      const { data: lineManagers } = await this.fetchLineManagers();
      const { data: branches } = await this.fetchBranches();
      const { data: roles } = await this.fetchRoles();
      const { data: staffList } = await this.fetchStaff();
      this.profileData = { lineManagers, branches, roles, staffList };
      return true;
    } catch(e) {
      throw new Error();
    }
  }

  async fetchProfileData() {
    if (!this.profileData) await this.initialiseProfileData();
    return this.profileData;
  }

  syncWithAPI() {
    return this.initialiseProfileData();
  }

  fetchLineManagers(): Promise<IGetLineManagers> {
    return this.http.get<IGetLineManagers>(`${this.api}/line-managers`, this.options).toPromise();
  }

  fetchBranches(): Promise<IGetBranches> {
    return this.http.get<IGetBranches>(`${this.api}/branches`, this.options).toPromise();
  }

  fetchRoles(): Promise<IGetRoles> {
    return this.http.get<IGetRoles>(`${this.api}/roles`, this.options).toPromise();
  }

  fetchStaff(): Promise<IGetStaffList> {
    return this.http.get<IGetStaffList>(`${this.api}/admin/staff`, this.options).toPromise();
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

  createBulkStaff(excelData) {
    return this.http.post<IPutProfile>(`${this.api}/admin/staff`, excelData, { withCredentials: true }).toPromise();
  }

  createSingleStaff(staffData: ICreateStaffData) {
    return this.http.post(`${this.api}/admin/staff/single`, staffData, this.options).toPromise();
  }
}