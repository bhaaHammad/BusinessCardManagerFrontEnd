import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@services/http.service';
import { BusinessCard } from '@models/business-card.model';
import { BusinessCardFilters } from '@models/business-card-filters.model';
import { CreateBusinessCardRequest } from '@models/dtos/create-business-card.model';

@Injectable({
  providedIn: 'root',
})
export class CardsApiService {
  private readonly basePath = '/api/cards';

  constructor(private http: HttpService) {}

  list(filters?: BusinessCardFilters): Observable<BusinessCard[]> {
    const params: Record<string, string> = {};
    if (filters?.name) params['name'] = filters.name;
    if (filters?.dateOfBirth) params['dob'] = filters.dateOfBirth;
    if (filters?.phone) params['phone'] = filters.phone;
    if (filters?.gender) params['gender'] = filters.gender;
    if (filters?.email) params['email'] = filters.email;

    return this.http.get<BusinessCard[]>(this.basePath, params);
  }

  create(card: CreateBusinessCardRequest): Observable<BusinessCard> {
    return this.http.post<BusinessCard>(this.basePath, card);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/${id}`);
  }

  export(format: 'csv' | 'xml'): Observable<Blob> {
    return this.http.post<Blob>(`${this.basePath}/export?format=${format}`, {});
  }
}

