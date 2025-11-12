import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value;

    if (!value) {
      return { phone: { message: 'Phone number is required' } };
    }

    const cleaned = value.replace(/[\s\-\(\)\.]/g, '');
    if ((cleaned.includes('+') && cleaned[0] !== '+') || cleaned.match(/[^0-9\+]/)) {
      return { phone: { message: 'Invalid character in phone number' } };
    }

    const digitsOnly = cleaned.startsWith('+') ? cleaned.substring(1) : cleaned;
    if (digitsOnly.length < 10) {
      return { phone: { message: 'Phone number must be at least 10 digits' } };
    }

    return null;
  };
}
