import { Routes } from '@angular/router';
import { LoginScreen } from './auth/feature/login-screen/login-screen';
import { authGuard } from './auth';
import { CouponsCalendar } from './portfolio/feature/coupons-calendar/coupons-calendar';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginScreen,
  },
  {
    path: 'calendar',
    component: CouponsCalendar,
    canActivate: [authGuard],
  },
];
