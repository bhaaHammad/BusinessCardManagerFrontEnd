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
} from '@validators/index';

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
      photo: [null],
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
      this.photoPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    this.cardForm.patchValue({ photo: file });
  }

  removePhoto(): void {
    this.photoPreview.set(null);
    this.cardForm.patchValue({ photo: '' });
  }

  onSubmit(): void {
  if (this.cardForm.invalid) {
    this.cardForm.markAllAsTouched();
    return;
  }

  const formValue = this.cardForm.value;
  const formData = new FormData();

  formData.append('Name', formValue.name);
  formData.append('Gender', formValue.gender);
  formData.append('DateOfBirth', this.formatDate(formValue.dateOfBirth));
  formData.append('Email', formValue.email);
  formData.append('Phone', formValue.phone);
  formData.append('Address', formValue.address || '');
  if (formValue.photo) {
    formData.append('Photo', formValue.photo);
  }

  this.store.createCard(formData).pipe(first()).subscribe({
    next: () => this.router.navigate(['/cards']),
    error: () => this.toast.showError('Failed to create business card'),
  });
}

  onCancel(): void {
    this.router.navigate(['/cards']);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

