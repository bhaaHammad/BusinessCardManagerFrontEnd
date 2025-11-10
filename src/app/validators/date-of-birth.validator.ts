import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateOfBirthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const dateValue: string | Date = control.value;
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(date.getTime())) {
      return {
        dateOfBirth: {
          message: 'Invalid date',
        },
      };
    }

    if (date > today) {
      return {
        dateOfBirth: {
          message: 'Date of birth cannot be in the future',
        },
      };
    }

    return null;
  };
}

