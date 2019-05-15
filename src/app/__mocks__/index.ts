export const authServiceMock: any = {
  api: 'some-url',
  isAuthenticated: false,
  currentStaff: { firstname: 'somename', role: 'someRole' },
  authenticate: () => Promise.resolve({ data: {} }),
  fetchStaffProfile: () => Promise.resolve('value'),
  login: () => Promise.resolve('value'),
  logout: () => Promise.resolve('value'),
  requestPasswordReset: () => Promise.resolve('value'),
  verifyPasswordResetRequest: () => Promise.resolve('value'),
  resetPassword: () => Promise.resolve('value')
}

export const overtimeServiceMock: any = {
  api: 'some-url',
  initialiseStaffData: () => Promise.resolve({ claimStatistics: {}, activities: [], pendingClaim: {} }),
  fetchStaffData: () => Promise.resolve({ claimStatistics: {}, activities: [], pendingClaim: {} }),
  syncWithAPI: () => {},
  fetchStaffClaimStatistics: () => Promise.resolve('value'),
  fetchStaffClaimHistory: () => Promise.resolve('value'),
  cancelClaim: () => Promise.resolve('value'),
  createOvertimeRequest: () => Promise.resolve({ message: 'created successfully!' })
}

export const profileServiceMock: any = {
  api: 'some-url',
  profileData: {},
  initialiseProfileData: () => Promise.resolve(true),
  fetchProfileData: () => Promise.resolve({ lineManagers: [], branches: [], roles: [] }),
  syncWithAPI: () => {},
  fetchLineManagers: () => Promise.resolve('value'),
  fetchBanches: () => Promise.resolve('value'),
  fetchRoles: () => Promise.resolve('value'),
  updateImage: () => Promise.resolve('value'),
  updatePersonalInfo: () => Promise.resolve('value'),
  updateLineManagerInfo: () => Promise.resolve('value')
  
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
  verifyLineManager: () => Promise.resolve('value')
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
  css: () => ({ css: () => {} })
})

export const routerMock: any = {
  navigate: () => {}
}

export const activatedRouteMock: any = {
  snapshot: {
    queryParams: {
      hash: 'somehash'
    }
  }
}

export const httpMock: any = {
  get: () => ({ toPromise: () => {} }),
  post: () => ({ toPromise: () => {} }),
  put: () => ({ toPromise: () => {} }),
  delete: () => ({ toPromise: () => {} })
}
