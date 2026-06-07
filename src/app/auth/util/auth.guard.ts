import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthController } from './auth-controller';

export const authGuard: CanActivateFn = () => {
  if (inject(AuthController).isAuthenticated) {
    return true;
  }

  return inject(Router).createUrlTree(['/login']);
};
