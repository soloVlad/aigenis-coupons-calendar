import { Service } from '@angular/core';
import { CouponEvent, MonthGroup, UserSecurity } from '../type';

@Service()
export class CouponScheduleService {
  buildMonthGroups(holdings: UserSecurity[]): MonthGroup[] {
    const bondHoldings = holdings.filter(
      (holding) => holding.definition.product === 'bond',
    );
    const events = bondHoldings.flatMap((holding) =>
      this.#buildCouponEvents(holding),
    );

    const groups = new Map<string, MonthGroup>();

    for (const event of events) {
      const monthKey = event.date.slice(0, 7);
      const existing = groups.get(monthKey);

      if (existing) {
        existing.events.push(event);
        existing.monthTotal += event.totalAmount;
        continue;
      }

      groups.set(monthKey, {
        monthKey,
        monthLabel: this.#formatMonthLabel(event.date),
        events: [event],
        monthTotal: event.totalAmount,
        currency: event.currency,
      });
    }

    return [...groups.values()]
      .map((group) => ({
        ...group,
        events: [...group.events].sort((a, b) => a.date.localeCompare(b.date)),
        monthTotal: this.#round(group.monthTotal),
      }))
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }

  filterMonthGroupsByYear(
    monthGroups: MonthGroup[],
    year: number,
    options?: { remainingOnly?: boolean },
  ): MonthGroup[] {
    const prefix = `${year}-`;
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const remainingOnly =
      options?.remainingOnly ?? year === today.getFullYear();

    return monthGroups
      .filter((group) => group.monthKey.startsWith(prefix))
      .map((group) => {
        const events = remainingOnly
          ? group.events.filter((event) => event.date >= todayStr)
          : group.events;

        return {
          ...group,
          monthLabel: this.#formatMonthOnly(group.monthKey),
          events,
          monthTotal: this.#round(
            events.reduce((sum, event) => sum + event.totalAmount, 0),
          ),
        };
      })
      .filter((group) => group.events.length > 0);
  }

  getAvailableYears(monthGroups: MonthGroup[]): number[] {
    const years = new Set(
      monthGroups.map((group) => Number(group.monthKey.slice(0, 4))),
    );

    return [...years].sort((a, b) => a - b);
  }

  getYearTotal(monthGroups: MonthGroup[], year: number): number {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const isCurrentYear = year === today.getFullYear();

    return this.#round(
      monthGroups
        .flatMap((group) => group.events)
        .filter((event) => event.date.startsWith(`${year}-`))
        .filter((event) => !isCurrentYear || event.date >= todayStr)
        .reduce((sum, event) => sum + event.totalAmount, 0),
    );
  }

  #formatMonthOnly(monthKey: string): string {
    const [year, month] = monthKey.split('-').map(Number);

    return new Date(year, month - 1, 1).toLocaleDateString('ru-BY', {
      month: 'long',
    });
  }

  #buildCouponEvents(holding: UserSecurity): CouponEvent[] {
    const { definition, amount: quantity } = holding;
    const nextDate =
      definition.next_coupon_date ?? definition.coupon_payment_date;
    const maturityDate = definition.maturity_date;

    if (!nextDate || !maturityDate || quantity <= 0) {
      return [];
    }

    const periodStart = definition.last_coupon_date ?? definition.issue_date;
    const periodDays =
      nextDate === maturityDate
        ? this.#daysBetween(periodStart, nextDate)
        : this.#daysBetween(periodStart, nextDate);

    if (periodDays <= 0) {
      return [];
    }

    const amountPerBond = this.#round(
      definition.nominal *
        (definition.coupon_rate / 100) *
        (periodDays / 365),
    );

    const dates =
      nextDate === maturityDate
        ? [nextDate]
        : this.#projectCouponDates(nextDate, maturityDate, periodDays);

    return dates.map((date) => ({
      date,
      bondSymbol: definition.parent_symbol,
      stateSecurityId: definition.state_security_id,
      quantity,
      amountPerBond,
      totalAmount: this.#round(amountPerBond * quantity),
      currency: definition.currency,
      isEstimated: true as const,
    }));
  }

  #projectCouponDates(
    nextDate: string,
    maturityDate: string,
    periodDays: number,
  ): string[] {
    const dates: string[] = [];
    let current = nextDate;

    while (current <= maturityDate) {
      dates.push(current);

      if (current === maturityDate) {
        break;
      }

      const upcoming = this.#addDays(current, periodDays);
      if (upcoming <= current) {
        break;
      }

      if (upcoming > maturityDate) {
        if (dates.at(-1) !== maturityDate) {
          dates.push(maturityDate);
        }
        break;
      }

      current = upcoming;
    }

    return dates;
  }

  #daysBetween(from: string, to: string): number {
    const start = new Date(`${from}T00:00:00`);
    const end = new Date(`${to}T00:00:00`);
    return Math.round((end.getTime() - start.getTime()) / 86_400_000);
  }

  #addDays(date: string, days: number): string {
    const next = new Date(`${date}T00:00:00`);
    next.setDate(next.getDate() + days);
    return next.toISOString().slice(0, 10);
  }

  #formatMonthLabel(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString('ru-BY', {
      month: 'long',
      year: 'numeric',
    });
  }

  #round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
