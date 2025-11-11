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
import { first, Observable } from 'rxjs';

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
  ) { }

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

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'csv') {
      this.previewCsv(file);
    } else if (ext === 'xml') {
      this.previewXml(file);
    } else {
      this.toast.showError('Please select a CSV or XML file');
    }
  }

  private previewCsv(file: File) {
    this.loading.set(true);
    this.cardsApi.previewCsv(file).pipe(first()).subscribe({
      next: (response) => this.handlePreviewResponse(response),
      error: (err) => this.handlePreviewError(err),
      complete: () => this.loading.set(false)
    });
  }

  private previewXml(file: File) {
    this.loading.set(true);
    this.cardsApi.previewXml(file).pipe(first()).subscribe({
      next: (response) => this.handlePreviewResponse(response),
      error: (err) => this.handlePreviewError(err),
      complete: () => this.loading.set(false)
    });
  }

  private handlePreviewResponse(response: {
    cards: CreateBusinessCardRequest[];
    errors: string[];
    totalRows: number;
    validRows: number;
    invalidRows: number;
  }) {
    this.previewData.set(response);

    if (response.validRows === 0) {
      this.toast.showError('No valid cards found in the file');
    } else {
      this.toast.showSuccess(
        `Preview loaded: ${response.validRows} valid card(s) found`
      );
    }
  }

  private handlePreviewError(error: any, fileType: string = 'file') {
    const errorMessage = error.error?.message || `Failed to preview ${fileType}`;
    this.toast.showError(errorMessage);
  }


  onConfirmImport(): void {
    const preview = this.previewData();
    if (!preview || preview.cards.length === 0) return;

    const ext = this.selectedFile()?.name.split('.').pop()?.toLowerCase();
    this.uploading.set(true);

    let request$: Observable<any>;
    request$ = this.cardsApi.commitImport(preview.cards);

    request$.pipe(first()).subscribe({
      next: (response) => {
        this.uploading.set(false);
        this.toast.showSuccess(`Successfully imported ${response.importedCount} business card(s)`);
        this.cardsStore.loadCards();
        this.importCompleted.emit();
      },
      error: (err) => {
        this.uploading.set(false);
        this.toast.showError(err.error?.message || 'Failed to import file');
      }
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
