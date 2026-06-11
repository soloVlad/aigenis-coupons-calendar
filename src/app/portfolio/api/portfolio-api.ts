import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { EMPTY, expand, Observable } from 'rxjs';
import { map, reduce } from 'rxjs/operators';
import { PaginatedResponse, UserSecurity } from '../type';

@Service()
export class PortfolioApi {
  readonly #http = inject(HttpClient);

  getUserSecurities(page = 1, pageSize = 500): Observable<PaginatedResponse<UserSecurity>> {
    const params = new HttpParams().set('page', page).set('page_size', pageSize);

    return this.#http.get<PaginatedResponse<UserSecurity>>(
      '/aigenis-api/api/v1/user_security_definition/',
      { params },
    );
  }

  getAllUserSecurities(): Observable<UserSecurity[]> {
    return this.getUserSecurities().pipe(
      expand((response) =>
        response.pagination.next != null ? this.getUserSecurities(response.pagination.next) : EMPTY,
      ),
      map((response) => response.results),
      reduce((holdings, pageHoldings) => [...holdings, ...pageHoldings], [] as UserSecurity[]),
    );
  }
}
