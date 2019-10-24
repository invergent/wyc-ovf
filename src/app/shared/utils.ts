export const staffIdRegex = /^[DdFfGgSsTt][DdCcEeRrSsNn][0-9]{5,6}$/;
export const solIdRegex = /^\d{3}$/;
export const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{3})+$/;
export const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
export const emptyRegex = /^\w+$/;
export const numberRegex = /^\d+$/;
export const phoneAccRegex = /^\d{10}$/;
export const addressRegex = /^[.0-9a-zA-Z\s,-]+$/;
export const claimPrice = {
  overtime: 150,
  weekend: 800,
  shiftDuty: 800,
  atmDuty: 3000,
  atmSupport: 2500,
  holiday: 800
}
export const months = [
  'empty', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December'
]
