import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { apiUrl } from '../../misc';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse } from '../type/auth-api.types';

@Service()
export class AuthApi {
  readonly #httpClient = inject(HttpClient);

  login(params: LoginRequest): Observable<LoginResponse> {
    return this.#httpClient.post<LoginResponse>(apiUrl('/api/v4/user/sign-in/'), params);
  }
}
