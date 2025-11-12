import { FormControl } from '@angular/forms';
import { emailValidator } from '../email.validator';

describe('EmailValidator', () => {
  it('should return null for valid email', () => {
    const control = new FormControl('test@example.com');
    const validator = emailValidator();
    const result = validator(control);
    
    expect(result).toBeNull();
  });

  it('should return error for invalid email', () => {
    const control = new FormControl('invalid-email');
    const validator = emailValidator();
    const result = validator(control);
    
    expect(result).not.toBeNull();
    expect(result?.['email']).toBeDefined();
  });

  it('should return null for empty value', () => {
    const control = new FormControl('');
    const validator = emailValidator();
    const result = validator(control);
    
    expect(result).toBeNull();
  });
});

