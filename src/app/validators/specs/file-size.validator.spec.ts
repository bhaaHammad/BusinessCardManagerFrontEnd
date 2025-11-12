import { FormControl } from '@angular/forms';
import { fileSizeValidator } from '../file-size.validator';

describe('FileSizeValidator', () => {
  const maxBytes = 1048576;

  it('should return null for valid file size', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    Object.defineProperty(file, 'size', { value: 500000, writable: false });

    const control = new FormControl(file);
    const validator = fileSizeValidator(maxBytes);
    const result = validator(control);

    expect(result).toBeNull();
  });

  it('should return error for file exceeding max size', () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    Object.defineProperty(file, 'size', { value: 2097152, writable: false });

    const control = new FormControl(file);
    const validator = fileSizeValidator(maxBytes);
    const result = validator(control);

    expect(result).not.toBeNull();
    expect(result?.['fileSize']).toBeDefined();
  });

  it('should return null for null value', () => {
    const control = new FormControl(null);
    const validator = fileSizeValidator(maxBytes);
    const result = validator(control);

    expect(result).toBeNull();
  });
});
