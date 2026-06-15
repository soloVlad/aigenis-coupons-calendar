import { Preferences } from '@capacitor/preferences';
import { AppLocale, isAppLocale } from '../type';

export const LOCALE_STORAGE_KEY = 'app-locale';

export async function readStoredLocale(): Promise<AppLocale | null> {
  const { value } = await Preferences.get({ key: LOCALE_STORAGE_KEY });
  return isAppLocale(value) ? value : null;
}

export async function storeLocale(locale: AppLocale): Promise<void> {
  await Preferences.set({ key: LOCALE_STORAGE_KEY, value: locale });
}
