import { inject, Service, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { AppLocale } from '../type';
import { resolveInitialLocale, storeLocale, toggleLocale as toggleLocaleUtil } from '../util';

@Service()
export class LocaleService {
  readonly #transloco = inject(TranslocoService);

  readonly activeLang = signal<AppLocale>('en');

  async init(): Promise<void> {
    const lang = await resolveInitialLocale();
    document.documentElement.lang = lang;
    this.activeLang.set(lang);

    await firstValueFrom(this.#transloco.load(lang));
    this.#transloco.setActiveLang(lang);
  }

  async toggleLocale(): Promise<void> {
    const next = toggleLocaleUtil(this.activeLang());
    await storeLocale(next);
    document.documentElement.lang = next;
    this.activeLang.set(next);
    this.#transloco.setActiveLang(next);
  }
}
