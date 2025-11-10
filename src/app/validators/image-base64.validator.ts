import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function imageBase64Validator(maxBytes: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const base64: string = control.value;
    if (typeof base64 !== 'string') {
      return { imageBase64: { message: 'Invalid base64 string' } };
    }

    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

    try {
      const padding = (base64Data.match(/=/g) || []).length;
      const byteSize = (base64Data.length * 3) / 4 - padding;

      if (byteSize > maxBytes) {
        return {
          imageBase64: {
            actualSize: byteSize,
            maxSize: maxBytes,
            message: `Image size exceeds maximum of ${maxBytes / 1024 / 1024}MB`,
          },
        };
      }

      const regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!regex.test(base64Data)) {
        return { imageBase64: { message: 'Invalid base64 format' } };
      }
    } catch (error) {
      return { imageBase64: { message: 'Failed to validate base64 string' } };
    }

    return null;
  };
}

