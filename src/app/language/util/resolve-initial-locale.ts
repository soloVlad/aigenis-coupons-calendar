import { AppLocale } from '../type';
import { readStoredLocale } from './locale-storage';

export function resolveInitialLocale(): AppLocale {
  const saved = readStoredLocale();
  if (saved) {
    return saved;
  }

  return navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en';
}
