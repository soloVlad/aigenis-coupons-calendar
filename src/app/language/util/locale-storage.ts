import { AppLocale, isAppLocale } from '../type';

export const LOCALE_STORAGE_KEY = 'app-locale';

export function readStoredLocale(): AppLocale | null {
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  return isAppLocale(saved) ? saved : null;
}

export function storeLocale(locale: AppLocale): void {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
