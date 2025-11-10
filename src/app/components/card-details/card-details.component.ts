import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CardsStore } from '@stores/cards.store';
import { BusinessCard } from '@models/business-card.model';
import { ToastService } from '@services/toast.service';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.compponent.scss'],
})
export class CardDetailsComponent {
  card!: ReturnType<typeof computed<BusinessCard | null>>;
  showQr = signal(false);

  get loading(): boolean {
    return this.store.loading();
  }

  constructor(
    private route: ActivatedRoute,
    private store: CardsStore,
    private toast: ToastService
  ) {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;
    this.card = computed(() => {
      if (id === null) return null;
      return this.store.cards().find((c) => c.id === id) || null;
    });
  }

  getPhotoUrl(): string {
    const card = this.card();
    if (!card) return this.getDefaultAvatar();
    
    if (card.photo) {
      return card.photo.startsWith('data:')
        ? card.photo
        : `data:image/jpeg;base64,${card.photo}`;
    }
    return this.getDefaultAvatar();
  }

  getDefaultAvatar(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjYwIiBmaWxsPSIjRUVFRUVFIi8+CjxwYXRoIGQ9Ik02MCAzNkM1MS42MTIgMzYgNDUgNDIuNjEyIDQ1IDUxQzQ1IDU5LjM4OCA1MS42MTIgNjYgNjAgNjZDNjguMzg4IDY2IDc1IDU5LjM4OCA3NSA1MUM3NSA0Mi42MTIgNjguMzg4IDM2IDYwIDM2Wk02MCA3MkM0NS4wMSA3MiAzMCA3Ni4wMiAzMCA4NEwzMCA5MEg5MFY4NEM5MCA3Ni4wMiA3NC45OSA3MiA2MCA3MloiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+';
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

  copyToClipboard(): void {
    const card = this.card();
    if (!card) return;

    const text = `
Name: ${card.name}
Gender: ${card.gender || '-'}
Date of Birth: ${this.formatDate(card.dateOfBirth)}
Email: ${card.email}
Phone: ${card.phone}
Address: ${card.address}
    `.trim();

    navigator.clipboard.writeText(text).then(
      () => {
        this.toast.showSuccess('Card details copied to clipboard');
      },
      () => {
        this.toast.showError('Failed to copy to clipboard');
      }
    );
  }

  toggleQr(): void {
    this.showQr.update((v) => !v);
  }

  getQrData(): string {
    const card = this.card();
    if (!card) return '';

    return JSON.stringify(
      {
        id: card.id,
        name: card.name,
        gender: card.gender,
        dateOfBirth: card.dateOfBirth,
        email: card.email,
        phone: card.phone,
        address: card.address,
      },
      null,
      2
    );
  }
}
