export const authServiceMock: any = {
  api: 'some-url',
  isAuthenticated: false,
  currentStaff: {
    firstname: 'somename',
    role: 'someRole',
    staffId: 'someId',
    changePassword: false,
    lineManagerEmailAddress: null,
    branch: null
  },
  authenticate: () => Promise.resolve({ data: {} }),
  fetchStaffProfile: () => Promise.resolve('value'),
  login: () => Promise.resolve('value'),
  logout: () => Promise.resolve('value'),
  syncWithAPI: () => {},
  requestPasswordReset: () => Promise.resolve('value'),
  verifyPasswordResetRequest: () => Promise.resolve('value'),
  resetPassword: () => Promise.resolve('value'),
  changePassword: () => Promise.resolve('value')
}

export const overtimeServiceMock: any = {
  api: 'some-url',
  initialiseStaffData: () => Promise.resolve({ claimStatistics: {}, activities: [], pendingClaim: {} }),
  fetchStaffData: () => Promise.resolve({ claimStatistics: {}, activities: [], pendingClaim: [{}] }),
  syncWithAPI: () => {},
  fetchStaffClaimStatistics: () => Promise.resolve('value'),
  fetchStaffClaimHistory: () => Promise.resolve('value'),
  cancelClaim: () => Promise.resolve('value'),
  createOvertimeRequest: () => Promise.resolve({ message: 'created successfully!' }),
  fetchAdminData: () => Promise.resolve({ monthlyStat: { statistics: 'value', submittedClaims: [{}] } }),
  fetchAdminClaimsData: () => Promise.resolve({ data: {} }),
  fetchChartStatistics: () => Promise.resolve({ data: {} }),
  exportApprovedClaims: () => Promise.resolve({}),
  markClaimsAsCompleted: () => ({ message: 'Completed' }),
  fetchHolidays: () => Promise.resolve({}),
  adminClaimData: {
    chartStats: {
      Jan: null,
      Feb: null
    }
  }
}

export const profileServiceMock: any = {
  api: 'some-url',
  profileData: {},
  initialiseProfileData: () => Promise.resolve(true),
  fetchProfileData: () => Promise.resolve({ lineManagers: [], branches: [], roles: [], staffList: [] }),
  syncWithAPI: () => {},
  fetchLineManagers: () => Promise.resolve({ data: 'value' }),
  fetchBanches: () => Promise.resolve({ data: 'value' }),
  fetchRoles: () => Promise.resolve({ data: 'value' }),
  updateImage: () => Promise.resolve('value'),
  updatePersonalInfo: () => Promise.resolve('value'),
  updateLineManagerInfo: () => Promise.resolve('value'),
  createSingle: () => Promise.resolve({ message: 'value' }),
  createBulk: () => Promise.resolve({ message: 'value' }),
  resendLoginCredentials: () => Promise.resolve({ message: 'message' })
}

export const settingsServiceMock: any = {
  api: 'some-url',
  settings: {},
  initialiseSettingsData: () => Promise.resolve(true),
  fetchAdminSettings: () => Promise.resolve({}),
  getReopenDate: () => {},
  syncWithAPI: () => {},
  fetchSettingsData: () => Promise.resolve({ data: ['value'] }),
  updateSettings: () => Promise.resolve({ message: 'value' })
}

export const notificationServiceMock: any = {
  api: 'some-url',
  channel: { bind_global: () => {} },
  initialiseNotificationsData: () => Promise.resolve('value'),
  getNotificationsData: () => Promise.resolve([{}, {}]),
  formatNotificationsData: () => {},
  markNotificationsAsReadAndViewed: () => {},
  playAudio: () => {},
  disconnect: () => {},
  fetchNotifications: () => Promise.resolve({
    data: [
      { viewed: false, activity:  'This is some activity over thirty characters' },
      { viewed: true, activity:  'Less than thirty characters' },
    ]
  }),
  markNotificationAsRead: () => Promise.resolve('value')
}

export const profileCheckerServiceMock: any = {
  getCurrentFieldsStatus: () => {},
  getPendingFields: () => []
}

export const pusherMock: any = {
  subscribe: () => ({
    bind_global: () => {}
  })
}

export const cronstrueMock: any = {
  toString: () => 'converted to string'
}

export class AudioMock {
  src: string
  constructor() {}
  load() {}
  play() {}
}

export const changeDetectorMock: any = {
  detectChanges: () => {}
}

export const formServiceMock: any = {
  validateProfileInfo: () => {},
  checkFields: () => {},
  imageSubmit: () => {},
  profileInfoSubmit: () => {},
  nameSanitizer: () => {},
  emailSanitizer: () => {},
  addLineManagerRole: () => {},
  getUpdateMethod: () => {}  
}

export const lineManagerServiceMock: any = {
  api: 'some-url',
  fetchClaimsToApprove: () => Promise.resolve({ data: { lineManager: {}, pendingClaims: [] } }),
  runApproval: () => Promise.resolve({ message: 'some message' }),
  verifyLineManager: () => Promise.resolve('value'),
  requestEdit: () => Promise.resolve({ message: 'some message' })
}

export const mockToastr: any = {
  success: () => {},
  error: () => {}
}

export const mockJQuery: any = jest.fn().mockReturnValue({
  datepicker: () => ({
    data: () => {}
  }),
  val: () => 'someDate',
  css: () => ({ css: () => {} }),
  prop: () => {},
  text: () => {},
  click: () => {}
})

export const mockLocalStorage: any = jest.fn().mockReturnValue({
  setItem: () => {},
  getItem: () => {},
  removeItem: () => {},
  clear: () => {}
})

export const routerMock: any = {
  navigate: () => {}
}

export const activatedRouteMock: any = {
  snapshot: {
    queryParams: {
      hash: 'somehash',
      m: 'value'
    }
  }
}

export const httpMock: any = {
  get: () => ({ toPromise: () => {} }),
  post: () => ({ toPromise: () => {} }),
  put: () => ({ toPromise: () => {} }),
  delete: () => ({ toPromise: () => {} })
}
