import { Service } from '@angular/core';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { LoginRequest } from '../type';
import {
  clearStoredCredentials,
  readStoredCredentials,
  storeCredentials,
} from './credentials-storage';

const ACCESS_TOKEN_KEY = 'access_token';

@Service()
export class AuthController {
  #accessToken = '';

  get accessToken() {
    return this.#accessToken;
  }

  set accessToken(token: string) {
    this.#accessToken = token;
    SecureStoragePlugin.set({ key: ACCESS_TOKEN_KEY, value: token });
  }

  get isAuthenticated() {
    return this.#accessToken.length > 0;
  }

  async init(): Promise<void> {
    try {
      const { value } = await SecureStoragePlugin.get({ key: ACCESS_TOKEN_KEY });
      this.#accessToken = value;
    } catch {
      this.#accessToken = '';
    }
  }

  getStoredCredentials(): Promise<LoginRequest | null> {
    return readStoredCredentials();
  }

  saveCredentials(credentials: LoginRequest): Promise<void> {
    return storeCredentials(credentials);
  }

  clearCredentials(): Promise<void> {
    return clearStoredCredentials();
  }

  logout() {
    this.#accessToken = '';
    SecureStoragePlugin.remove({ key: ACCESS_TOKEN_KEY });
    clearStoredCredentials();
  }
}
