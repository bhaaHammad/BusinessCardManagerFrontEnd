import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '@services/http.service';
import { BusinessCard, ApiResponse } from '@models/business-card.model';
import { BusinessCardFilters } from '@models/business-card-filters.model';
import { CreateBusinessCardRequest } from '@models/dtos/create-business-card.dto';

@Injectable({
  providedIn: 'root',
})
export class CardsApiService {
  private readonly basePath = '/api/business-cards';

  constructor(private http: HttpService) {}

  list(filters?: BusinessCardFilters): Observable<BusinessCard[]> {
    const params: Record<string, string> = {};
    if (filters?.name) params['name'] = filters.name;
    if (filters?.dateOfBirth) params['dob'] = filters.dateOfBirth;
    if (filters?.phone) params['phone'] = filters.phone;
    if (filters?.gender) params['gender'] = filters.gender;
    if (filters?.email) params['email'] = filters.email;

    return this.http.get<ApiResponse<BusinessCard[]>>(this.basePath, params).pipe(
      map((response) => response.data.result)
    );
  }

  create(card: CreateBusinessCardRequest): Observable<BusinessCard> {
    return this.http.post<ApiResponse<BusinessCard>>(this.basePath, card).pipe(
      map((response) => response.data.result)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.basePath}/${id}`).pipe(
      map(() => undefined)
    );
  }

  export(format: 'csv' | 'xml'): Observable<Blob> {
    return this.http.post<Blob>(`${this.basePath}/export?format=${format}`, {});
  }

  previewCsv(file: File): Observable<{
    cards: CreateBusinessCardRequest[];
    errors: string[];
    totalRows: number;
    validRows: number;
    invalidRows: number;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.postFormData<ApiResponse<{
      cards: CreateBusinessCardRequest[];
      errors: string[];
      totalRows: number;
      validRows: number;
      invalidRows: number;
    }>>(`${this.basePath}/import/csv/preview`, formData).pipe(
      map((response) => response.data.result)
    );
  }

  commitImport(cards: CreateBusinessCardRequest[]): Observable<{ message: string; importedCount: number }> {
    return this.http.post<ApiResponse<{ message: string; importedCount: number }>>(
      `${this.basePath}/import/csv/commit`,
      { cards }
    ).pipe(
      map((response) => response.data.result)
    );
  }
}

