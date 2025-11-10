import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DropzoneComponent } from '@shared/components/dropzone/dropzone.component';
import { CardsStore } from '@stores/cards.store';
import { environment } from '@env/environment';
import { ToastService } from '@services/toast.service';
import {
  emailValidator,
  phoneValidator,
  dateOfBirthValidator,
  imageBase64Validator,
} from '@validators/index';
import { Gender } from '@shared/types';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DropzoneComponent,
  ],
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss'],
})
export class CardFormComponent {
  cardForm: FormGroup;
  photoPreview = signal<string | null>(null);
  isEditMode = signal(false);
  
  get loading(): boolean {
    return this.store.loading();
  }

  constructor(
    private fb: FormBuilder,
    private store: CardsStore,
    private router: Router,
    private toast: ToastService
  ) {
    this.cardForm = this.fb.group({
      name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfBirth: [null, [Validators.required, dateOfBirthValidator()]],
      email: ['', [Validators.required, emailValidator()]],
      phone: ['', [Validators.required, phoneValidator()]],
      address: [''],
      photoBase64: ['', [imageBase64Validator(environment.maxPhotoBytes)]],
    });
  }

  onPhotoSelected(file: File | null): void {
    if (!file) {
      this.removePhoto();
      return;
    }

    if (file.size > environment.maxPhotoBytes) {
      this.toast.showError(`Photo size exceeds ${environment.maxPhotoBytes / 1024 / 1024}MB limit`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.photoPreview.set(base64);
      this.cardForm.patchValue({ photoBase64: base64 });
    };

    reader.onerror = () => {
      this.toast.showError('Failed to read photo');
    };

    reader.readAsDataURL(file);
  }

  removePhoto(): void {
    this.photoPreview.set(null);
    this.cardForm.patchValue({ photoBase64: '' });
  }

  onSubmit(): void {
    if (this.cardForm.invalid) {
      this.cardForm.markAllAsTouched();
      return;
    }

    const formValue = this.cardForm.value;
    const cardData = {
      name: formValue.name,
      gender: formValue.gender as Gender,
      dateOfBirth: new Date(formValue.dateOfBirth).toISOString().split('T')[0],
      email: formValue.email,
      phone: formValue.phone,
      address: formValue.address || '',
      photoBase64: formValue.photoBase64 || undefined,
    };

    this.store.createCard(cardData).pipe(first()).subscribe({
      next: () => {
        this.router.navigate(['/cards']);
      },
      error: () => {
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/cards']);
  }
}

