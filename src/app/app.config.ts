import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './routes/app.routes';
import { httpErrorInterceptor } from '@interceptors/http-error.interceptor';
import { mockHttpInterceptor } from '@interceptors/mock-http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([mockHttpInterceptor, httpErrorInterceptor])
    ),
  ],
};
