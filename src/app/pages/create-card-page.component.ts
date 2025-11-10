import { Component } from '@angular/core';
import { CardFormComponent } from '@components/card-form/card-form.component';

@Component({
  selector: 'app-create-card-page',
  standalone: true,
  imports: [CardFormComponent],
  template: `<app-card-form></app-card-form>`,
})
export class CreateCardPageComponent {}

