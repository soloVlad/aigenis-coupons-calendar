import { AppLocale } from '../type';

export function getIntlLocale(locale: AppLocale): string {
  return locale === 'ru' ? 'ru-BY' : 'en-GB';
}
