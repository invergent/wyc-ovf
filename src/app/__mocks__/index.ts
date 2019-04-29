export const authServiceMock: any = {
  api: 'some-url',
  currentStaff: { firstname: 'somename', role: 'someRole' },
  authenticate: () => Promise.resolve({ data: {} }),
  fetchStaffProfile: () => Promise.resolve('value'),
  login: () => Promise.resolve('value'),
  requestPasswordReset: () => Promise.resolve('value'),
  verifyPasswordResetRequest: () => Promise.resolve('value'),
  resetPassword: () => Promise.resolve('value')
}

export const overtimeServiceMock: any = {
  api: 'some-url',
  initialiseStaffData: () => Promise.resolve([{}, {}, [{}]]),
  fetchStaffClaimStatistics: () => Promise.resolve('value'),
  createOvertimeRequest: () => Promise.resolve({ message: 'created successfully!' })
}

export const mockToastr: any = {
  success: () => {},
  error: () => {}
}

export const mockJQuery: any = jest.fn().mockReturnValue({
  datepicker: () => ({
    data: () => {}
  }),
  val: () => 'someDate'
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
  post: () => ({ toPromise: () => {} })
}
