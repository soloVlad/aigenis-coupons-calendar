import { SecureStorage } from '@aparajita/capacitor-secure-storage';
import { LoginRequest } from '../type';

const CREDENTIALS_KEY = 'saved_credentials';

function isLoginRequest(value: unknown): value is LoginRequest {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const credentials = value as Record<string, unknown>;
  return typeof credentials['phone'] === 'string' && typeof credentials['password'] === 'string';
}

export async function readStoredCredentials(): Promise<LoginRequest | null> {
  const stored = await SecureStorage.get(CREDENTIALS_KEY);
  if (typeof stored === 'string') {
    try {
      const parsed: unknown = JSON.parse(stored);
      return isLoginRequest(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  return isLoginRequest(stored) ? stored : null;
}

export async function storeCredentials(credentials: LoginRequest): Promise<void> {
  await SecureStorage.set(CREDENTIALS_KEY, JSON.stringify(credentials));
}

export async function clearStoredCredentials(): Promise<void> {
  await SecureStorage.remove(CREDENTIALS_KEY);
}
