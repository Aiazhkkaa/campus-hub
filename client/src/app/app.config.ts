import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeKk from '@angular/common/locales/kk';
import localeRu from '@angular/common/locales/ru';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';
import { AuthService } from './core/auth.service';

// Month and weekday names for Russian and Kazakh dates
registerLocaleData(localeRu, 'ru');
registerLocaleData(localeKk, 'kk');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
    // Before the app shows anything: if we have a saved token, load the user
    provideAppInitializer(() => inject(AuthService).restoreSession()),
  ],
};
