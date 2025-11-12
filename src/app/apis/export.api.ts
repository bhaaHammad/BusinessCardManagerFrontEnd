import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CardsStore } from '@stores/cards.store';

@Injectable({
  providedIn: 'root',
})
export class ExportApiService {
  private readonly basePath = '/api/business-cards/export';

  constructor(private http: HttpClient, private store: CardsStore) {}

  exportAsCsv(): void {
    const params = this.buildParams();

    this.http
      .get(`${this.basePath}/csv`, {
        params,
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => this.downloadFile(blob, 'BusinessCards.csv'),
        error: (err) => alert('Failed to export CSV.'),
      });
  }

  exportAsXml(): void {
    const params = this.buildParams();

    this.http
      .get(`${this.basePath}/xml`, {
        params,
        responseType: 'blob',
      })
      .subscribe({
        next: (blob) => this.downloadFile(blob, 'BusinessCards.xml'),
        error: (err) => alert('Failed to export XML.'),
      });
  }

  private buildParams(): HttpParams {
    const filters = this.store.filters();
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.append(key, value as string);
      }
    });

    return params;
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
