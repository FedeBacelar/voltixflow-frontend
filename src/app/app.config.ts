import {ApplicationConfig, LOCALE_ID} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error/error.interceptor';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },

    provideRouter(routes),
    provideHttpClient(withInterceptors([
      authInterceptor,
      errorInterceptor,
    ])),
  ]
};
