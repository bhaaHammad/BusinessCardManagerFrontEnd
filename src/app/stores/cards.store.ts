import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';
import { CardsApiService } from '@apis/cards.api';
import { BusinessCard } from '@models/business-card.model';
import { ToastService } from '@services/toast.service';
import { BusinessCardFilters } from '@models/business-card-filters.model';
import { CreateBusinessCardRequest } from '@models/dtos/create-business-card.dto';

interface CardsState {
  cards: BusinessCard[];
  loading: boolean;
  error: string | null;
  filters: BusinessCardFilters;
}

@Injectable({
  providedIn: 'root',
})
export class CardsStore {
  private state = signal<CardsState>({
    cards: [],
    loading: false,
    error: null,
    filters: {},
  });

  cards = computed(() => this.state().cards);
  loading = computed(() => this.state().loading);
  error = computed(() => this.state().error);
  filters = computed(() => this.state().filters);
  totalCount = computed(() => this.state().cards.length);

  filteredCards = computed(() => {
    const cards = this.cards();
    const filters = this.filters();
    
    return cards.filter((card) => {
      if (filters.name && !card.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.email && !card.email.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }
      if (filters.phone && !card.phone.includes(filters.phone)) {
        return false;
      }
      if (filters.gender && card.gender !== filters.gender) {
        return false;
      }
      if (filters.dateOfBirth && card.dateOfBirth !== filters.dateOfBirth) {
        return false;
      }
      return true;
    });
  });

  constructor(
    private api: CardsApiService,
    private toast: ToastService
  ) {
    if (typeof window !== 'undefined') {
      this.loadCards();
    }
  }

  loadCards(filters?: BusinessCardFilters): void {
    this.state.update((s) => ({ ...s, loading: true, error: null, filters: filters || {} }));

    this.api.list(filters).subscribe({
      next: (cards) => {
        this.state.update((s) => ({ ...s, cards, loading: false }));
      },
      error: (error) => {
        this.state.update((s) => ({
          ...s,
          loading: false,
          error: error.message || 'Failed to load cards',
        }));
        this.toast.showError('Failed to load business cards');
      },
    });
  }

  createCard(card: CreateBusinessCardRequest): Observable<BusinessCard> {
    this.state.update((s) => ({ ...s, loading: true, error: null }));

    return new Observable((observer) => {
      this.api.create(card).subscribe({
        next: (newCard) => {
          this.state.update((s) => ({
            ...s,
            cards: [...s.cards, newCard],
            loading: false,
          }));
          this.toast.showSuccess('Business card created successfully');
          observer.next(newCard);
          observer.complete();
        },
        error: (error) => {
          this.state.update((s) => ({
            ...s,
            loading: false,
            error: error.message || 'Failed to create card',
          }));
          this.toast.showError('Failed to create business card');
          observer.error(error);
        },
      });
    });
  }

  deleteCard(id: string): void {
    const cardToDelete = this.state().cards.find((c) => c.id === id);
    if (!cardToDelete) {
      return;
    }

    this.state.update((s) => ({
      ...s,
      cards: s.cards.filter((c) => c.id !== id),
    }));

    this.api.delete(id).subscribe({
      next: () => {
        this.toast.showSuccess('Business card deleted successfully');
      },
      error: (error) => {
        this.state.update((s) => ({
          ...s,
          cards: [...s.cards, cardToDelete].sort((a, b) => a.name.localeCompare(b.name)),
        }));
        this.toast.showError('Failed to delete business card');
      },
    });
  }

  updateFilters(filters: BusinessCardFilters): void {
    this.state.update((s) => ({ ...s, filters }));
    this.loadCards(filters);
  }
}
