import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const email: string = control.value;
    if (!EMAIL_REGEX.test(email)) {
      return {
        email: {
          message: 'Please enter a valid email address',
        },
      };
    }

    return null;
  };
}
