import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { QrImportComponent } from "@components/qr-import/qr-import.component";

@Component({
  selector: 'app-qr-import-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, QrImportComponent],
  template: `
    <div class="import-page">
      <mat-card>
        <app-qr-import>
        </app-qr-import>
      </mat-card>
    </div>
  `,
})
export class ImportQrPageComponent {}
