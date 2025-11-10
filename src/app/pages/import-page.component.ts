import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DropzoneComponent } from '@shared/components/dropzone/dropzone.component';
import { CardsApiService } from '@apis/cards.api';
import { ToastService } from '@services/toast.service';
import { CardsStore } from '@stores/cards.store';
import { CreateBusinessCardRequest } from '@models/dtos/create-business-card.dto';
import { first } from 'rxjs';

@Component({
  selector: 'app-import-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    DropzoneComponent,
  ],
  template: `
    <div class="import-page">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>upload_file</mat-icon>
            Import Business Cards
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="import-description">
            Upload a CSV file to import business cards. The file will be processed by the backend.
          </p>

          <div class="file-upload-section">
            <app-dropzone
              acceptedTypes=".csv"
              placeholder="Select a CSV file"
              (fileSelected)="onFileSelected($event)">
            </app-dropzone>

            <div *ngIf="selectedFile()" class="file-info">
              <p>
                <mat-icon>description</mat-icon>
                <strong>Selected file:</strong> {{ selectedFile()?.name }}
                <span class="file-size">({{ getFileSize(selectedFile()?.size || 0) }})</span>
              </p>
            </div>
          </div>

          <!-- Preview Section -->
          <div *ngIf="previewData()" class="preview-section">
            <h3>Preview Import Data</h3>
            <div class="preview-stats">
              <mat-chip-set>
                <mat-chip>Total Rows: {{ previewData()?.totalRows }}</mat-chip>
                <mat-chip color="primary">Valid: {{ previewData()?.validRows }}</mat-chip>
                <mat-chip color="warn" *ngIf="previewData()?.invalidRows > 0">
                  Invalid: {{ previewData()?.invalidRows }}
                </mat-chip>
              </mat-chip-set>
            </div>

            <div *ngIf="previewData()?.errors && previewData()!.errors.length > 0" class="errors-section">
              <h4>Errors:</h4>
              <ul class="error-list">
                <li *ngFor="let error of previewData()!.errors">{{ error }}</li>
              </ul>
            </div>

            <div *ngIf="previewData()?.cards && previewData()!.cards.length > 0" class="preview-table">
              <table mat-table [dataSource]="previewData()!.cards" class="preview-table-content">
                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Name</th>
                  <td mat-cell *matCellDef="let card">{{ card.name }}</td>
                </ng-container>

                <ng-container matColumnDef="gender">
                  <th mat-header-cell *matHeaderCellDef>Gender</th>
                  <td mat-cell *matCellDef="let card">{{ card.gender }}</td>
                </ng-container>

                <ng-container matColumnDef="dateOfBirth">
                  <th mat-header-cell *matHeaderCellDef>Date of Birth</th>
                  <td mat-cell *matCellDef="let card">{{ card.dateOfBirth }}</td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let card">{{ card.email }}</td>
                </ng-container>

                <ng-container matColumnDef="phone">
                  <th mat-header-cell *matHeaderCellDef>Phone</th>
                  <td mat-cell *matCellDef="let card">{{ card.phone }}</td>
                </ng-container>

                <ng-container matColumnDef="address">
                  <th mat-header-cell *matHeaderCellDef>Address</th>
                  <td mat-cell *matCellDef="let card">{{ card.address || '-' }}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="previewColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: previewColumns"></tr>
              </table>
            </div>
          </div>

          <div class="import-actions">
            <button
              *ngIf="!previewData()"
              mat-raised-button
              color="primary"
              [disabled]="!selectedFile() || loading()"
              (click)="onPreview()">
              <mat-spinner *ngIf="loading()" diameter="20" class="button-spinner"></mat-spinner>
              <mat-icon *ngIf="!loading()">preview</mat-icon>
              <span>{{ loading() ? 'Loading Preview...' : 'Preview CSV' }}</span>
            </button>
            <button
              *ngIf="previewData()"
              mat-raised-button
              color="primary"
              [disabled]="uploading() || previewData()?.validRows === 0"
              (click)="onConfirmImport()">
              <mat-spinner *ngIf="uploading()" diameter="20" class="button-spinner"></mat-spinner>
              <mat-icon *ngIf="!uploading()">check</mat-icon>
              <span>{{ uploading() ? 'Importing...' : 'Confirm Import' }}</span>
            </button>
            <button
              *ngIf="previewData()"
              mat-button
              [disabled]="uploading()"
              (click)="onReset()">
              <mat-icon>refresh</mat-icon>
              Upload Another File
            </button>
            <button
              mat-button
              [disabled]="loading() || uploading()"
              (click)="onCancel()">
              Cancel
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .import-page {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }

    mat-card {
      padding: 24px;
    }

    mat-card-header {
      margin-bottom: 24px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 24px;
    }

    .import-description {
      color: #666;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .file-upload-section {
      margin-bottom: 24px;
    }

    .file-info {
      margin-top: 16px;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .file-info mat-icon {
      color: #1976d2;
    }

    .file-size {
      color: #666;
      font-size: 0.9em;
      margin-left: 8px;
    }

    .import-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .button-spinner {
      display: inline-block;
      margin-right: 8px;
    }

    @media (max-width: 768px) {
      .import-page {
        padding: 16px;
      }

      mat-card {
        padding: 16px;
      }

      .import-actions {
        flex-direction: column;
      }

    .import-actions button {
      width: 100%;
    }
  }

  .preview-section {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 2px solid #e0e0e0;
  }

  .preview-section h3 {
    margin-bottom: 16px;
    color: #1976d2;
  }

  .preview-stats {
    margin-bottom: 16px;
  }

  .errors-section {
    margin-bottom: 16px;
    padding: 16px;
    background-color: #ffebee;
    border-radius: 4px;
    border-left: 4px solid #f44336;
  }

  .errors-section h4 {
    margin-top: 0;
    color: #c62828;
  }

  .error-list {
    margin: 8px 0 0 0;
    padding-left: 20px;
    color: #c62828;
  }

  .error-list li {
    margin-bottom: 4px;
  }

  .preview-table {
    margin-top: 16px;
    overflow-x: auto;
  }

  .preview-table-content {
    width: 100%;
  }

  .preview-table-content th {
    background-color: #f5f5f5;
    font-weight: 600;
  }

  .preview-table-content td {
    padding: 8px 16px;
  }
  `],
})
export class ImportPageComponent {
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

  constructor(
    private cardsApi: CardsApiService,
    private router: Router,
    private toast: ToastService,
    private cardsStore: CardsStore
  ) {}

  onFileSelected(file: File | null): void {
    this.selectedFile.set(file);
    // Reset preview when new file is selected
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
    if (!file) {
      return;
    }

    // Validate file type
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
    if (!preview || preview.cards.length === 0) {
      return;
    }

    this.uploading.set(true);

    this.cardsApi.commitImport(preview.cards).pipe(first()).subscribe({
      next: (response) => {
        this.uploading.set(false);
        this.toast.showSuccess(
          `Successfully imported ${response.importedCount} business card(s)`
        );
        // Refresh the cards list
        this.cardsStore.loadCards();
        this.router.navigate(['/cards']);
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

