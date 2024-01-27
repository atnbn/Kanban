import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor() {}

  public isValidEmail(control: FormControl): ValidationErrors | null {
    const EMAIL_REGEXP = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isValid = EMAIL_REGEXP.test(control.value);
    console.log(isValid, 'email');

    return isValid ? null : { invalidEmail: true };
  }

  public isValidUsername(control: FormControl): ValidationErrors | null {
    const validUsernameRegex = /^[a-zA-Z0-9]+$/; // Allow only alphanumeric characters
    const isValid =
      validUsernameRegex.test(control.value) && control.value.length >= 3;
    console.log(isValid);
    return isValid ? null : { invalidUsername: true };
  }

  public isValidPassword(control: FormControl): ValidationErrors | null {
    const minLength = 7;
    // const hasSpecialChar = /[@#$%^&*(),.?":{}|<>]/.test(control.value);

    const isValid = control.value.length >= minLength;
    console.log(isValid, 'password');
    return isValid ? null : { invalidPassword: true };
  }
}
