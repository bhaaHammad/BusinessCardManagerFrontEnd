import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly defaultDuration = 3000;
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: this.defaultDuration,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, duration?: number): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration: duration || this.defaultDuration,
      panelClass: ['success-snackbar'],
    });
  }

  showError(message: string, duration?: number): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration: duration || this.defaultDuration * 2,
      panelClass: ['error-snackbar'],
    });
  }

  showInfo(message: string, duration?: number): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration: duration || this.defaultDuration,
      panelClass: ['info-snackbar'],
    });
  }
}

