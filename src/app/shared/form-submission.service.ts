import { Injectable } from "@angular/core";
import { emptyRegex, emailRegex, phoneNumberRegex } from "./utils";

@Injectable()
export class FormSubmissionService {
  constructor() {}

  validateProfileInfo(formValues) {
    const { firstname, lastname, email, phone } = formValues;
    const errors = [];
    if (firstname) errors.push(...this.checkFields('First name', firstname, emptyRegex));
    if (lastname) errors.push(...this.checkFields('Last name', lastname, emptyRegex));
    if (email) errors.push(...this.checkFields('Email address', email, emailRegex));
    if (phone) errors.push(...this.checkFields('Phone number', phone, phoneNumberRegex));

    return errors;
  }

  checkFields(field, fieldValue, regex) {
    if (!regex.test(fieldValue.trim())) return [`${field} value is invalid`];
  }

  imageSubmit(file) {
    const formData = new FormData();
    formData.append('image', file, file.name);
    
    return { data: formData, errors: [] };
  }

  profileInfoSubmit(formValues) {
    let { firstname, lastname, email } = formValues;
    const errors = this.validateProfileInfo(formValues);

    if (firstname) formValues.firstname = this.nameSanitizer(firstname);
    if (lastname) formValues.lastname = this.nameSanitizer(lastname);
    if (email) formValues.email = this.emailSanitizer(email);
    
    return { data: formValues, errors };
  }
  nameSanitizer(string) {
    const trimmedString = string.trim().toLowerCase();
    return `${trimmedString.charAt(0).toUpperCase()}${trimmedString.slice(1)}`;
  }

  emailSanitizer(string) {
    return string.trim().toLowerCase();
  }

  addLineManagerRole(currentModal) {
    let lineManagerRole = currentModal.split('Modal')[0];

    if (lineManagerRole === 'supervisor') {
      lineManagerRole = this.nameSanitizer(lineManagerRole);
    } else {
      lineManagerRole = lineManagerRole.toUpperCase();
    }

    return lineManagerRole;
  }


  getUpdateMethod(openModal) {
    const updateMethods = {
      imageModal: 'updateImage',
      bsmModal: 'updateLineManagerInfo',
      supervisorModal: 'updateLineManagerInfo'
    };

    if (!updateMethods[openModal]) {
      return 'updatePersonalInfo';
    }
    return updateMethods[openModal];
  }
}