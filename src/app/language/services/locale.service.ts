import { inject, Service, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { AppLocale } from '../type';
import {
  resolveInitialLocale,
  storeLocale,
  toggleLocale as toggleLocaleUtil,
} from '../util';

@Service()
export class LocaleService {
  readonly #transloco = inject(TranslocoService);

  readonly activeLang = signal<AppLocale>('en');

  init(): Promise<void> {
    const lang = resolveInitialLocale();
    document.documentElement.lang = lang;
    this.activeLang.set(lang);

    return firstValueFrom(this.#transloco.load(lang)).then(() => {
      this.#transloco.setActiveLang(lang);
    });
  }

  toggleLocale(): void {
    const next = toggleLocaleUtil(this.activeLang());
    storeLocale(next);
    document.documentElement.lang = next;
    this.activeLang.set(next);
    this.#transloco.setActiveLang(next);
  }
}
