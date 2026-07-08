import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
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
  try {
    const { value } = await SecureStoragePlugin.get({ key: CREDENTIALS_KEY });
    const parsed: unknown = JSON.parse(value);
    return isLoginRequest(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function storeCredentials(credentials: LoginRequest): Promise<void> {
  await SecureStoragePlugin.set({ key: CREDENTIALS_KEY, value: JSON.stringify(credentials) });
}

export async function clearStoredCredentials(): Promise<void> {
  await SecureStoragePlugin.remove({ key: CREDENTIALS_KEY });
}
