import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ImportCardsComponent } from '@components/import-cards/import-cards.component';

@Component({
  selector: 'app-import-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, ImportCardsComponent],
  template: `
    <div class="import-page">
      <mat-card>
        <app-import-cards></app-import-cards>
      </mat-card>
    </div>
  `,
})
export class ImportPageComponent {}
