import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthController } from '../../../auth/util/auth-controller';
import { getIntlLocale, LanguageToggle, LocaleService } from '../../../language';
import { PortfolioApi } from '../../api/portfolio-api';
import { CashflowKind, MonthGroup } from '../../type';
import { CouponScheduleService } from '../../util/coupon-schedule-service';
import { PortfolioController } from '../../util/portfolio-controller';

@Component({
  selector: 'app-coupons-calendar',
  host: { class: 'ion-page' },
  templateUrl: './coupons-calendar.html',
  styleUrls: ['./coupons-calendar.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonSelect,
    IonSelectOption,
    IonList,
    IonItem,
    IonBadge,
    TranslocoPipe,
    LanguageToggle,
  ],
})
export class CouponsCalendar implements OnInit {
  readonly #portfolioApi = inject(PortfolioApi);
  readonly #portfolioCtrl = inject(PortfolioController);
  readonly #couponSchedule = inject(CouponScheduleService);
  readonly #authCtrl = inject(AuthController);
  readonly #router = inject(Router);
  readonly #transloco = inject(TranslocoService);
  readonly #locale = inject(LocaleService);

  protected readonly loading = this.#portfolioCtrl.loading;
  protected readonly error = this.#portfolioCtrl.error;
  protected readonly allMonthGroups = signal<MonthGroup[]>([]);
  protected readonly selectedYear = signal(new Date().getFullYear());

  protected readonly availableYears = computed(() =>
    this.#couponSchedule.getAvailableYears(this.allMonthGroups()),
  );

  protected readonly visibleMonthGroups = computed(() => {
    const locale = this.#locale.activeLang();

    return this.#couponSchedule.filterMonthGroupsByYear(
      this.allMonthGroups(),
      this.selectedYear(),
      { locale },
    );
  });

  protected readonly yearTotals = computed(() =>
    this.#couponSchedule.getYearTotals(
      this.allMonthGroups(),
      this.selectedYear(),
    ),
  );

  protected readonly currency = computed(
    () => this.allMonthGroups()[0]?.events[0]?.currency ?? 'BYN',
  );

  protected readonly isCurrentYear = computed(
    () => this.selectedYear() === new Date().getFullYear(),
  );

  protected readonly canGoPrevious = computed(() => {
    const years = this.availableYears();
    const index = years.indexOf(this.selectedYear());
    return index > 0;
  });

  protected readonly canGoNext = computed(() => {
    const years = this.availableYears();
    const index = years.indexOf(this.selectedYear());
    return index >= 0 && index < years.length - 1;
  });

  ngOnInit(): void {
    this.#loadHoldings();
  }

  protected refresh(event: CustomEvent): void {
    this.#loadHoldings(() => {
      (event.target as HTMLIonRefresherElement).complete();
    });
  }

  protected logout(): void {
    this.#authCtrl.logout();
    void this.#router.navigate(['/login']);
  }

  protected previousYear(): void {
    const years = this.availableYears();
    const index = years.indexOf(this.selectedYear());
    if (index > 0) {
      this.selectedYear.set(years[index - 1]);
    }
  }

  protected nextYear(): void {
    const years = this.availableYears();
    const index = years.indexOf(this.selectedYear());
    if (index >= 0 && index < years.length - 1) {
      this.selectedYear.set(years[index + 1]);
    }
  }

  protected onYearChange(event: CustomEvent): void {
    this.selectedYear.set(Number(event.detail.value));
  }

  protected formatAmount(amount: number, currency = this.currency()): string {
    return `${amount.toFixed(2)} ${currency}`;
  }

  protected formatDate(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      getIntlLocale(this.#locale.activeLang()),
      {
        day: 'numeric',
        month: 'long',
      },
    );
  }

  protected formatEventKind(kind: CashflowKind): string {
    return this.#transloco.translate(
      kind === 'coupon' ? 'eventKind.coupon' : 'eventKind.nominal',
    );
  }

  #loadHoldings(onComplete?: () => void): void {
    this.#portfolioCtrl.loading.set(true);
    this.#portfolioCtrl.error.set(null);

    this.#portfolioApi.getAllUserSecurities().subscribe({
      next: (holdings) => {
        this.#portfolioCtrl.holdings.set(holdings);
        const monthGroups = this.#couponSchedule.buildMonthGroups(holdings);
        this.allMonthGroups.set(monthGroups);
        this.#syncSelectedYear(monthGroups);
        this.#portfolioCtrl.loading.set(false);
        onComplete?.();
      },
      error: () => {
        this.#portfolioCtrl.error.set(
          this.#transloco.translate('errors.loadHoldings'),
        );
        this.#portfolioCtrl.loading.set(false);
        onComplete?.();
      },
    });
  }

  #syncSelectedYear(monthGroups: MonthGroup[]): void {
    const years = this.#couponSchedule.getAvailableYears(monthGroups);
    const currentYear = new Date().getFullYear();

    if (years.includes(currentYear)) {
      this.selectedYear.set(currentYear);
      return;
    }

    if (years.length > 0) {
      this.selectedYear.set(years[0]);
    }
  }
}
