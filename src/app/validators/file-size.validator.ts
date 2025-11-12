import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fileSizeValidator(maxBytes: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const file: File = control.value;
    if (file instanceof File) {
      if (file.size > maxBytes) {
        return {
          fileSize: {
            actualSize: file.size,
            maxSize: maxBytes,
            message: `File size exceeds maximum of ${maxBytes / 1024 / 1024}MB`,
          },
        };
      }
    }

    return null;
  };
}

