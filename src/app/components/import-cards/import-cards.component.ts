import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { DropzoneComponent } from '@shared/components/dropzone/dropzone.component';
import { CardsApiService } from '@apis/cards.api';
import { ToastService } from '@services/toast.service';
import { CardsStore } from '@stores/cards.store';
import { CreateBusinessCardRequest } from '@models/dtos/create-business-card.dto';
import { first } from 'rxjs';

@Component({
  selector: 'app-import-cards',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTableModule,
    DropzoneComponent
  ],
  templateUrl: './import-cards.component.html',
  styleUrls: ['./import-cards.component.scss'],
  providers: [CardsApiService, ToastService, CardsStore]
})
export class ImportCardsComponent {
  selectedFile = signal<File | null>(null);
  loading = signal(false);
  uploading = signal(false);
  previewData = signal<{
    cards: CreateBusinessCardRequest[];
    errors: string[];
    totalRows: number;
    validRows: number;
    invalidRows: number;
  } | null>(null);

  previewColumns: string[] = ['name', 'gender', 'dateOfBirth', 'email', 'phone', 'address'];

  @Output() importCompleted = new EventEmitter<void>();

  constructor(
    private cardsApi: CardsApiService,
    private router: Router,
    private toast: ToastService,
    private cardsStore: CardsStore
  ) {}

  onFileSelected(file: File | null): void {
    this.selectedFile.set(file);
    this.previewData.set(null);
  }

  getFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  onPreview(): void {
    const file = this.selectedFile();
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.toast.showError('Please select a CSV file');
      return;
    }

    this.loading.set(true);

    this.cardsApi.previewCsv(file).pipe(first()).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.previewData.set(response);

        if (response.validRows === 0) {
          this.toast.showError('No valid cards found in the CSV file');
        } else {
          this.toast.showSuccess(
            `Preview loaded: ${response.validRows} valid card(s) found`
          );
        }
      },
      error: (error) => {
        this.loading.set(false);
        const errorMessage = error.error?.message || 'Failed to preview CSV file';
        this.toast.showError(errorMessage);
      },
    });
  }

  onConfirmImport(): void {
    const preview = this.previewData();
    if (!preview || preview.cards.length === 0) return;

    this.uploading.set(true);

    this.cardsApi.commitImport(preview.cards).pipe(first()).subscribe({
      next: (response) => {
        this.uploading.set(false);
        this.toast.showSuccess(
          `Successfully imported ${response.importedCount} business card(s)`
        );
        this.cardsStore.loadCards();
        this.importCompleted.emit(); // emit event to parent if needed
      },
      error: (error) => {
        this.uploading.set(false);
        const errorMessage = error.error?.message || 'Failed to import CSV file';
        this.toast.showError(errorMessage);
      },
    });
  }

  onReset(): void {
    this.selectedFile.set(null);
    this.previewData.set(null);
  }

  onCancel(): void {
    this.router.navigate(['/cards']);
  }
}
