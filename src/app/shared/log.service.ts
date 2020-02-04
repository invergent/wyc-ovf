import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  IGetLineManagers, IGetBranches, IGetRoles, IPutProfile, IProfileUpdate,
  IPostImage, IGetStaffList, ICreateStaffData, IGetSingleStaff, ILogData
} from "./models";

@Injectable()
export class LogService {
  api = environment.api;
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  }

  logData: ILogData[]

  constructor(private http: HttpClient) {}

  createQueryString(queries) {
    return Object.keys(queries).reduce((acc, key) => {
      if (acc) acc += '&';
      if (queries[key]) acc += `${key}=${queries[key]}`;
      return acc;
    }, '')
  }

  fetchLogs(queries?): Promise<{ message: string, data: ILogData[] }> {
    const queryString = this.createQueryString(queries);
    return this.http.get<{ message: string, data: ILogData[] }>(`${this.api}/admin/logs?${queryString}`, this.options).toPromise();
  }
}