import { Service } from '@angular/core';

const ACCESS_TOKEN_KEY = 'access_token';

@Service()
export class AuthController {
  #accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY) ?? '';

  get accessToken() {
    return this.#accessToken;
  }

  set accessToken(token: string) {
    this.#accessToken = token;
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  get isAuthenticated() {
    return this.#accessToken.length > 0;
  }

  logout() {
    this.#accessToken = '';
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}
