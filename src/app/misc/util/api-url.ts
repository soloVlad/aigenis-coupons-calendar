import { environment } from '../../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;

export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}

export function isApiRequest(url: string): boolean {
  return url.startsWith(API_BASE_URL);
}

export function isLoginRequest(url: string): boolean {
  return url.includes('/api/v4/user/sign-in');
}
