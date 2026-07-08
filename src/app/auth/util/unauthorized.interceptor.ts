import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { ToastController } from '@ionic/angular/standalone';
import { catchError, finalize, from, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { isApiRequest, isLoginRequest, showToast } from '../../misc';
import { AuthApi } from '../api/auth-api';
import { AuthController } from './auth-controller';

export const AUTH_RETRY = new HttpContextToken<boolean>(() => false);

let reLogin$: Observable<void> | null = null;
let sessionExpiredHandled = false;

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        !isApiRequest(req.url) ||
        isLoginRequest(req.url) ||
        req.context.get(AUTH_RETRY)
      ) {
        return throwError(() => error);
      }

      const authController = inject(AuthController);
      const authApi = inject(AuthApi);
      const router = inject(Router);
      const transloco = inject(TranslocoService);
      const toastController = inject(ToastController);

      const handleSessionExpired = () => {
        authController.logout();

        if (!sessionExpiredHandled) {
          sessionExpiredHandled = true;
          router.navigate(['/login']);
          showToast(toastController, transloco.translate('errors.sessionExpired'), 'danger');
        }

        return throwError(() => error);
      };

      if (!reLogin$) {
        reLogin$ = from(authController.getStoredCredentials()).pipe(
          switchMap((credentials) => {
            if (!credentials) {
              return throwError(() => new Error('no credentials'));
            }

            return authApi.login(credentials);
          }),
          switchMap((response) => {
            authController.accessToken = response.access;
            sessionExpiredHandled = false;
            return from(Promise.resolve());
          }),
          shareReplay(1),
          finalize(() => {
            reLogin$ = null;
          }),
        );
      }

      return reLogin$.pipe(
        switchMap(() =>
          next(
            req.clone({
              context: req.context.set(AUTH_RETRY, true),
            }),
          ),
        ),
        catchError(() => handleSessionExpired()),
      );
    }),
  );
};
