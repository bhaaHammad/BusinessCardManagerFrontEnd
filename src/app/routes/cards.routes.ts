import { Routes } from '@angular/router';
import { CardDetailsComponent } from '@components/card-details/card-details.component';
import { CardsPageComponent } from '@pages/cards-page.component';
import { CreateCardPageComponent } from '@pages/create-card-page.component';

export const cardsRoutes: Routes = [
  {
    path: '',
    component: CardsPageComponent,
  },
  {
    path: 'new',
    component: CreateCardPageComponent,
  },
  {
    path: ':id',
    component: CardDetailsComponent,
  },
];

