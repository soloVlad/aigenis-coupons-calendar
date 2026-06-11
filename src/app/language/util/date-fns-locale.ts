import { enUS, ru } from 'date-fns/locale';
import { AppLocale } from '../type';

export function getDateFnsLocale(locale: AppLocale) {
  return locale === 'ru' ? ru : enUS;
}
