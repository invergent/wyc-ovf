import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TOASTR_TOKEN, IToastr, IClaimForLineManager, IGetClaimForLineManager, IApprovedClaim } from "../shared";
import { environment } from "src/environments/environment";

@Injectable()
export class LineManagerService {
  constructor(
    private http: HttpClient
  ) {}
  api: string = environment.api; 
  options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true
  }
  claimsToApprove: IClaimForLineManager

  fetchClaimsToApprove(): Promise<IGetClaimForLineManager> {
    return this.http.get<IGetClaimForLineManager>(`${this.api}/line-manager/claims/pending`, this.options).toPromise();
  }

  runApproval(approvalType: string, id: number): Promise<IApprovedClaim> {
    return this.http.put<IApprovedClaim>(`${this.api}/line-manager/claims/pending/${id}/${approvalType}`, {}, this.options).toPromise();
  }

  verifyLineManager(hash: string): Promise<any> {
    return this.http.get(`${this.api}/line-manager/verify?hash=${hash}`, this.options).toPromise();
  }
}