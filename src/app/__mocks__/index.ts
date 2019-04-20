export const authenticatorMock: any = {
  api: 'some-url',
  checkValidity: () => Promise.resolve('value'),
  login: () => Promise.resolve('value'),
  requestPasswordReset: () => Promise.resolve('value'),
  verifyPasswordResetRequest: () => Promise.resolve('value')
}

export const mockToastr: any = {
  success: () => {},
  error: () => {}
}

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
