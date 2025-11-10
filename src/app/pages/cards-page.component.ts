import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardFiltersComponent } from '@components/card-filters/card-filters.component';
import { CardsListComponent } from '@components/card-list/cards-list.component';

@Component({
  selector: 'app-cards-page',
  standalone: true,
  imports: [CommonModule, CardFiltersComponent, CardsListComponent],
  template: `
    <app-card-filters></app-card-filters>
    <app-cards-list></app-cards-list>
  `,
})
export class CardsPageComponent {}

