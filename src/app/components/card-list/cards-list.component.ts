import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardsStore } from '@stores/cards.store';
import { BusinessCard } from '@models/business-card.model';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FileDownloadService } from '@services/file-download.service';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './cards-list.component.html',
  styleUrls: ['./cards-list.component.scss'],
})
export class CardsListComponent {
  displayedColumns: string[] = [
    'photo',
    'name',
    'gender',
    'dateOfBirth',
    'email',
    'phone',
    'address',
    'actions',
  ];

  pageSize = signal(10);
  pageIndex = signal(0);

  get cards() {
    return this.store.cards();
  }

  get loading() {
    return this.store.loading();
  }

  get totalCount() {
    return this.store.totalCount();
  }

  displayedCards = computed(() => {
    const cards = this.store.cards();
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return cards.slice(start, end);
  });

  constructor(
    private store: CardsStore,
    private dialog: MatDialog,
    private fileDownload: FileDownloadService,
    private toast: ToastService
  ) {}


  onPageChange(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  getPhotoUrl(card: BusinessCard): string {
    if (card.photo) {
      return card.photo.startsWith('data:')
        ? card.photo
        : `data:image/jpeg;base64,${card.photo}`;
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFRUVFRUUiLz4KPHBhdGggZD0iTTIwIDEyQzE3LjI0IDEyIDE1IDE0LjI0IDE1IDE3QzE1IDE5Ljc2IDE3LjI0IDIyIDIwIDIyQzIyLjc2IDIyIDI1IDE5Ljc2IDI1IDE3QzI1IDE0LjI0IDIyLjc2IDEyIDIwIDEyWk0yMCAyNEMxNi42NyAyNCAxMCAyNS4zNCAxMCAyOFYzMEgzMFYyOEMzMCAyNS4zNCAyMy4zMyAyNCAyMCAyNFoiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+';
  }

  formatDate(date: string | null): string {
    if (!date) return '-';
    try {
      // Handle ISO date format from backend
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return '-';
      return dateObj.toLocaleDateString();
    } catch {
      return '-';
    }
  }

  deleteCard(card: BusinessCard): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Business Card',
        message: `Are you sure you want to delete "${card.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.deleteCard(card.id);
      }
    });
  }
}
