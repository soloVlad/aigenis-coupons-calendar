import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthController } from './auth-controller';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/aigenis-api')) {
    return next(req);
  }

  const token = inject(AuthController).accessToken;
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `JWT ${token}` },
    }),
  );
};
