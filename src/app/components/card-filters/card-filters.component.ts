import { ExportApiService } from './../../apis/export.api';
import { Component, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CardsStore } from '@stores/cards.store';
import { BusinessCardFilters } from '@models/business-card-filters.model';
import { CardsApiService } from '@apis/cards.api';
import { environment } from '@env/environment';

@Component({
  selector: 'app-card-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './card-filters.component.html',
  styleUrls: ['./card-filters.component.scss'],
})
export class CardFiltersComponent implements OnInit {
  filterForm: FormGroup;
  hasFilters = signal(false);

  constructor(
    private fb: FormBuilder,
    private store: CardsStore,
    private exportApiService: ExportApiService
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      gender: [null],
      dateOfBirth: [null],
      email: [''],
      phone: [''],
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((values) => {
        const filters: BusinessCardFilters = {
          name: values.name || undefined,
          gender: values.gender || undefined,
          dateOfBirth: values.dateOfBirth
            ? this.formatDate(values.dateOfBirth)
            : undefined,
          email: values.email || undefined,
          phone: values.phone || undefined,
        };
        this.hasFilters.set(
          !!(
            filters.name ||
            filters.gender ||
            filters.dateOfBirth ||
            filters.email ||
            filters.phone
          )
        );
        this.store.updateFilters(filters);
      });
  }

  private formatDate(date: any): string {
    if (!date) return '';

    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return date;
  }

  ngOnInit(): void {
    const currentFilters = this.store.filters();
    if (currentFilters) {
      this.filterForm.patchValue({
        name: currentFilters.name || '',
        gender: currentFilters.gender || null,
        dateOfBirth: currentFilters.dateOfBirth
          ? new Date(currentFilters.dateOfBirth)
          : null,
        email: currentFilters.email || '',
        phone: currentFilters.phone || '',
      });
    }
  }

  exportAsCsv(): void {
    this.exportApiService.exportAsCsv();
  }

  exportAsXml(): void {
    this.exportApiService.exportAsXml();
  }

  clearFilters(): void {
    this.filterForm.reset({
      name: '',
      gender: null,
      dateOfBirth: null,
      email: '',
      phone: '',
    });
  }
}
