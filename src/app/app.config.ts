import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { AppConfigService } from './core/config/app-config';

registerLocaleData(localeIt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    { provide: LOCALE_ID, useValue: 'it' },
    provideAppInitializer(() => inject(AppConfigService).load()),
  ],
};
