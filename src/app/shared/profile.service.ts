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
    if (!this.profileData) await this.initialiseProfileData(includeStaff);
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

  fetchRoles(): Promise<IGetRoles> {
    return this.http.get<IGetRoles>(`${this.api}/roles`, this.options).toPromise();
  }

  fetchStaff(): Promise<IGetStaffList> {
    return this.http.get<IGetStaffList>(`${this.api}/admin/staff`, this.options).toPromise();
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

  resendLoginCredentials(staffId: string) {
    return this.http.post<IPutProfile>(`${this.api}/admin/staff/resend-credentials`, { staffId }, this.options).toPromise();
  }
}