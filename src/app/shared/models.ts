export interface IStaff {
  staffId: string,
  firstname: string,
  lastname: string,
  middleName: string,
  emailAddress: string,
  image: string,
  role: number,
  branch: number,
  changedPassword: boolean,
  supervisorFirstName: string,
  supervisorLastName: string,
  supervisorEmailAddress: string,
  bsmFirstName: string,
  bsmLastName: string,
  bsmEmailAddress: string
}

export interface ILoginFormData {
  staffId?: string,
  emailAddress?: string,
  password?: string
  staffIdOrEmail?: string
}

export interface IToastr {
  success(message: string, title?: string): void,
  info(message: string, title?: string): void,
  warning(message: string, title?: string): void,
  error(message: string, title?: string): void
}
