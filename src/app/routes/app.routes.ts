import { ImportQrPageComponent } from '@pages/qr-import.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/cards',
    pathMatch: 'full',
  },
  {
    path: 'cards',
    loadChildren: () =>
      import('@routes/cards.routes').then((m) => m.cardsRoutes),
  },
  {
    path: 'import',
    loadComponent: () =>
      import('@pages/import-page.component').then((m) => m.ImportPageComponent),
  },
  {
    path: 'qr',
    loadComponent: () =>
      import('@pages/qr-import.component').then((m) => m.ImportQrPageComponent),
  },
];
