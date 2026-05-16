import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../type/auth-api.types';

@Injectable()
export class AuthApi {
  readonly #httpClient = inject(HttpClient);

  login(params: LoginRequest): Observable<LoginResponse> {
    return this.#httpClient.post<LoginResponse>('/aigenis-api/api/v4/user/sign-in/', params);
  }
}
