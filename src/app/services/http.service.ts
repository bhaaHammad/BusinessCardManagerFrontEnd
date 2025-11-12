import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: Record<string, string | number | boolean>, p0?: { responseType: string; }): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<T>(`${this.baseUrl}${url}`, { params: httpParams });
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${url}`);
  }

  postFormData<T>(url: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, formData);
  }
}

