import { AppLocale } from '../type';
import { readStoredLocale } from './locale-storage';

export async function resolveInitialLocale(): Promise<AppLocale> {
  const saved = await readStoredLocale();
  if (saved) {
    return saved;
  }

  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}
