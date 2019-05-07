export interface IStaff {
  staffId: string,
  firstname: string,
  lastname: string,
  middleName: string,
  emailAddress: string,
  image: string,
  role: string,
  branch: string,
  changedPassword: boolean,
  supervisorFirstName: string,
  supervisorLastName: string,
  supervisorEmailAddress: string,
  bsmFirstName: string,
  bsmLastName: string,
  bsmEmailAddress: string
}

export interface ILineManager {
  firstname: string
  lastname: string
  email?: string
}

export interface IClaimForLineManager {
  staffId: string,
  firstname: string,
  lastname: string,
  image: string,
  id: number,
  monthOfClaim: string,
  weekday: number,
  weekend: number,
  shift: number,
  status: string,
}

export interface ILineManagerData {
  lineManager: ILineManager
  pendingClaims: IClaimForLineManager[]
}

export interface IClaim {
  id: number,
  monthOfClaim: string,
  weekday: number,
  weekend: number,
  shift: number,
  amount: number,
  status: string,
  createdAt: Date,
  approvalHistory?: any[]
}

export interface IActivity {
  activity: string,
  createdAt: Date
}

export interface ILoginFormData {
  staffId?: string,
  emailAddress?: string,
  password?: string
  staffIdOrEmail?: string
}

export interface IPasswordReset {
  password: string,
  confirmPassword: string
}

export interface IValidClaimRequest {
  weekday?: number
  weekend?: number
  shift?: number
}

export interface IToastr {
  success(message: string, title?: string): void,
  info(message: string, title?: string): void,
  warning(message: string, title?: string): void,
  error(message: string, title?: string): void
}

export interface IClaimStatistics {
  total: number,
  completed: number,
  declined: number,
  cancelled: number
}

export interface IStaffClaimData {
  claimStatistics?: IClaimStatistics,
  pendingClaim?: IClaim,
  activities?: IActivity[]
  claimHistory?: IClaim[]
}

export interface IApprovalHistory {
  id: number,
  claimId: number,
  lineManagerId?: number,
  createdAt: Date
}

// fetch request models
export interface IGetStaffProfile {
  message: string,
  data: IStaff
}

export interface IGetStatistics {
  message: string,
  data: IClaimStatistics
}

export interface IGetPendingClaim {
  message: string,
  data: IClaim
}

export interface IGetClaimHistory {
  message: string,
  data: IClaim[]
}

export interface IGetActivities {
  message: string,
  data: IActivity[]
}

export interface IPostOvertimeRequest {
  message: string,
  data: IClaim
}

export interface IApprovedClaim {
  message: string,
  data: IClaim
}

export interface IValidatedForm {
  validField: IValidClaimRequest,
  error: string[]
}

export interface IGetClaimForLineManager {
  message: string,
  data: ILineManagerData
}