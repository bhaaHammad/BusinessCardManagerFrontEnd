import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpService } from '@services/http.service';
import { CreateBusinessCardRequest } from '@models/dtos/create-business-card.dto';
import { ApiResponse } from '@models/responses/api.response';

@Injectable({
  providedIn: 'root',
})
export class ImportApiService {
  private readonly basePath = '/api/business-cards/import';

  constructor(private http: HttpService) {}

  previewFile(file: File): Observable<{
    cards: CreateBusinessCardRequest[];
    errors: string[];
    totalRows: number;
    validRows: number;
    invalidRows: number;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .postFormData<
        ApiResponse<{
          cards: CreateBusinessCardRequest[];
          errors: string[];
          totalRows: number;
          validRows: number;
          invalidRows: number;
        }>
      >(`${this.basePath}/preview`, formData)
      .pipe(
        map((response) => {
          if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to preview file');
          }
          return response.data.result;
        })
      );
  }
}
