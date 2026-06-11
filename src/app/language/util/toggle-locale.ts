import { AppLocale } from '../type';

export function toggleLocale(locale: AppLocale): AppLocale {
  return locale === 'en' ? 'ru' : 'en';
}
