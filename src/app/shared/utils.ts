export const staffIdRegex = /^[Tt][Nn][0-9]{6}$/;
export const solIdRegex = /^\d{4}$/;
export const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{3})+$/;
export const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
export const emptyRegex = /^\w+$/;
export const numberRegex = /^\d+$/;
export const phoneNumberRegex = /^\d{11}$/;
export const accNumberRegex = /^\d{10}$/;
export const addressRegex = /^[.0-9a-zA-Z\s,-]+$/;
export const claimPrice = {
  overtime: 150,
  weekend: 800,
  shiftDuty: 800,
  atmDuty: 3000,
  atmSupport: 2500,
  holiday: 800
}
