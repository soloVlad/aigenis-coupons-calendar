import { Service } from '@angular/core';
import { SecureStorage } from '@aparajita/capacitor-secure-storage';

const ACCESS_TOKEN_KEY = 'access_token';

@Service()
export class AuthController {
  #accessToken = '';

  get accessToken() {
    return this.#accessToken;
  }

  set accessToken(token: string) {
    this.#accessToken = token;
    SecureStorage.set(ACCESS_TOKEN_KEY, token);
  }

  get isAuthenticated() {
    return this.#accessToken.length > 0;
  }

  async init(): Promise<void> {
    const token = await SecureStorage.get(ACCESS_TOKEN_KEY);
    this.#accessToken = typeof token === 'string' ? token : '';
  }

  logout() {
    this.#accessToken = '';
    SecureStorage.remove(ACCESS_TOKEN_KEY);
  }
}
