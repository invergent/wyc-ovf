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

export interface IStaffForAdmin {
  staffId: string
  firstname: string
  lastname: string
  emailAddress: string
  image: string
}

export interface IProfileUpdate {
  staffId?: string,
  firstname?: string,
  lastname?: string,
  middleName?: string,
  emailAddress?: string,
  image?: string,
  roleId?: number,
  branchId?: number,
  supervisorFirstName?: string,
  supervisorLastName?: string,
  supervisorEmailAddress?: string,
  bsmFirstName?: string,
  bsmLastName?: string,
  bsmEmailAddress?: string
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

export interface IImageData {
  url: string
  secureUrl: string
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
  email?: string,
  password?: string
  staffIdOrEmail?: string
}

export interface ICreateStaffData {
  staffId: string
  firstname: string
  lastname: string
  email: string
  phone: string
}

export interface IPasswordReset {
  password: string,
  confirmPassword: string
}

export interface IChangePassword {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
}

export interface IValidClaimRequest {
  weekday?: number
  weekend?: number
  shift?: number
}

export interface INotification {
  id: number
  activity: string
  type: string
  viewed: boolean
}

export interface IToastr {
  success(message: string, title?: string): void,
  info(message: string, title?: string): void,
  warning(message: string, title?: string): void,
  error(message: string, title?: string): void
}

type SingleEventCallbackFunction = () => void;
type GlobalEventCallbackFunction = (event: string, data: any) => void;

export interface ISubscribe {
  bind(event: string, callback: SingleEventCallbackFunction): void
  bind_global(callback: GlobalEventCallbackFunction): void
}

export interface IPusher {
  subscribe(channel: string): ISubscribe
}

export interface IClaimStatistics {
  total: number
  completed: number
  declined: number
  cancelled?: number
  pending?: number
}

export interface IStaffClaimData {
  claimStatistics?: IClaimStatistics,
  pendingClaim?: IClaim,
  activities?: IActivity[]
  claimHistory?: IClaim[]
}

export interface IAdminClaimData {
  statistics: IClaimStatistics
  submittedClaims: IClaim[]
}

export interface IChartData {
  tenantRef: string
  year: number
  Jan: number
  Feb: number
  Mar: number
  Apr: number
  May: number
  Jun: number
  Jul: number
  Aug: number
  Sep: number
  Oct: number
  Nov: number
  Dec: number
}

export interface IChartSourceData {
  Month: string
  claims: number
}

export interface IAdminDashboardData {
  monthlyStat: IAdminClaimData
  chartStats: IChartData
}

export interface IProfileData {
  lineManagers?: ILineManager[],
  branches?: IBranch[],
  roles?: IRole[]
  staffList?: IStaffForAdmin[]
}

export interface IApprovalHistory {
  id: number,
  claimId: number,
  lineManagerId?: number,
  createdAt: Date
}

export interface IBranch {
  id: number,
  name: string
}

export interface IRole {
  id: number,
  name: string
}

// fetch request models
export interface IGetStaffProfile {
  message: string,
  data: IStaff
}

export interface IGetStaffList {
  message: string,
  data: IStaffForAdmin[]
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

export interface IGetLineManagers {
  message: string,
  data: ILineManager[]
}

export interface IGetBranches {
  message: string,
  data: IBranch[]
}

export interface IGetRoles {
  message: string,
  data: IRole[]
}

export interface IPutProfile {
  message: string
}

export interface IPostImage {
  message: string
  data: IImageData
}

export interface IGetNotification {
  message: string
  data: INotification[]
}

export interface IPutNotification {
  message: string
  data: INotification
}

export interface IGetAdminClaimsData {
  message: string
  data: IAdminClaimData
}

export interface IGetChartStatistics {
  message: string
  data: IChartData
}