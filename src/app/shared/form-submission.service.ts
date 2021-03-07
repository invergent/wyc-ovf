import { Injectable } from "@angular/core";
import { emptyRegex, emailRegex, phoneAccRegex, staffIdRegex, solIdRegex, addressRegex } from "./utils";

@Injectable()
export class FormSubmissionService {
  constructor() {}

  validateProfileInfo(formValues) {
    const { staffId, firstname, lastname, middlename, email, phone, altPhone, solId, name, address, accountNumber } = formValues;
    const errors = [];
console.log(formValues)
    if (staffId) errors.push(...this.checkFields('Staff ID', staffId, staffIdRegex));
    if (firstname) errors.push(...this.checkFields('First name', firstname, emptyRegex));
    if (lastname) errors.push(...this.checkFields('Last name', lastname, emptyRegex));
    if (middlename) errors.push(...this.checkFields('Middle name', middlename, emptyRegex));
    if (email) errors.push(...this.checkFields('Email address', email, emailRegex));
    if (phone) errors.push(...this.checkFields('Phone number', phone, phoneAccRegex));
    if (altPhone) errors.push(...this.checkFields('Alternative Phone number', altPhone, phoneAccRegex));
    if (accountNumber) errors.push(...this.checkFields('Account number', accountNumber, phoneAccRegex));
    if (solId) errors.push(...this.checkFields('SOL ID', solId, solIdRegex));
    if (name) {
      if (!name.trim()) errors.push(...this.checkFields('Branch name', name, emptyRegex));
    } 
    if (address) errors.push(...this.checkFields('Branch address', address, addressRegex));

    return errors;
  }

  checkFields(field, fieldValue, regex) {
    const value = Number.isInteger(fieldValue) ? fieldValue : fieldValue.trim();
    if (!regex.test(value)) return [`${field} value is invalid`];
  }

  fileSubmit(filePropName, file) {
    const formData = new FormData();
    formData.append(filePropName, file, file.name);
    
    return { data: formData, errors: [] };
  }

   profileInfoSubmit(formValues) {
    let { staffId, firstname, lastname, middlename, email, phone, altPhone, solId, name, address, accountNumber } = formValues;
    const errors = this.validateProfileInfo(formValues);

    if (staffId) formValues.staffId = staffId.trim().toUpperCase();
    if (firstname) formValues.firstname = this.nameSanitizer(firstname);
    if (lastname) formValues.lastname = this.nameSanitizer(lastname);
    if (middlename) formValues.middlename = this.nameSanitizer(middlename);
    if (email) formValues.email = email.trim().toLowerCase();
    if (phone) formValues.phone = phone.trim();
    if (altPhone) formValues.altPhone = altPhone.trim();
    if (accountNumber) formValues.accountNumber = accountNumber.trim();
    if (name) formValues.name = this.nameSanitizer(name);
    if (address) formValues.address = address.trim();
    
    return { data: formValues, errors };
  }
  nameSanitizer(string) {
    const trimmedString = string.trim().toLowerCase();
    return `${trimmedString.charAt(0).toUpperCase()}${trimmedString.slice(1)}`;
  }

  // addLineManagerRole(currentModal) {
  //   let lineManagerRole = currentModal.split('Modal')[0];

  //   if (lineManagerRole === 'supervisor') {
  //     lineManagerRole = this.nameSanitizer(lineManagerRole);
  //   } else {
  //     lineManagerRole = lineManagerRole.toUpperCase();
  //   }

  //   return lineManagerRole;
  // }


  getUpdateMethod(openModal) {
    const updateMethods = {
      imageModal: 'updateImage',
      lineManagerModal: 'updateLineManagerInfo',
      bulkModal: 'createBulk',
      singleModal: 'createSingle',
      editModal: 'updateSupervisorProfile'
    };

    if (!updateMethods[openModal]) {
      return 'updatePersonalInfo';
    }
    return updateMethods[openModal];
  }
}