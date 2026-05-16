import { Injectable } from '@angular/core';

@Injectable()
export class AuthController {
  #accessToken: string = '';

  get accessToken() {
    return this.#accessToken;
  }

  set accessToken(token: string) {
    this.#accessToken = token;
  }
}
