import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { authInterceptor } from './auth';
import {
  AVAILABLE_LOCALES,
  LocaleService,
  TranslocoHttpLoader,
} from './language';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideIonicAngular({
      mode: 'md',
    }),
    provideTransloco({
      config: {
        availableLangs: [...AVAILABLE_LOCALES],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(() => inject(LocaleService).init()),
  ],
};
