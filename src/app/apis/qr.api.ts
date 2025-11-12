import { Injectable } from '@angular/core';
import { CreateBusinessCardRequest } from '@models/dtos/create-business-card.dto';
import { HttpService } from '@services/http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QrApiService {
  private readonly basePath = '/api/qr';

  constructor(private http: HttpService) {}

  importQr(file: File): Observable<CreateBusinessCardRequest> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<CreateBusinessCardRequest>(`${this.basePath}/import`, formData);
  }
}
