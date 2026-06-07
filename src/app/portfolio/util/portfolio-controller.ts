import { Service, signal } from '@angular/core';
import { UserSecurity } from '../type';

@Service()
export class PortfolioController {
  readonly holdings = signal<UserSecurity[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
}
