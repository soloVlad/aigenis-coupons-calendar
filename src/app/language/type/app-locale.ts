export type AppLocale = 'en' | 'ru';

export const AVAILABLE_LOCALES: readonly AppLocale[] = ['en', 'ru'];

export function isAppLocale(value: string | null): value is AppLocale {
  return value === 'en' || value === 'ru';
}
