import { Service } from '@angular/core';
import {
  addDays,
  differenceInDays,
  format,
  getYear,
  parse,
  parseISO,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { round } from '../../misc';
import { CouponEvent, MonthGroup, UserSecurity } from '../type';

const DATE_FORMAT = 'yyyy-MM-dd';

@Service()
export class CouponScheduleService {
  buildMonthGroups(holdings: UserSecurity[]): MonthGroup[] {
    const bondHoldings = holdings.filter(
      (holding) => holding.definition.product === 'bond',
    );
    const events = bondHoldings.flatMap((holding) => [
      ...this.#buildCouponEvents(holding),
      ...this.#buildNominalEvent(holding),
    ]);

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
        events: [...group.events].sort((a, b) =>
          a.date.localeCompare(b.date) || a.kind.localeCompare(b.kind),
        ),
        monthTotal: round(group.monthTotal),
      }))
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  }

  filterMonthGroupsByYear(
    monthGroups: MonthGroup[],
    year: number,
    options?: { remainingOnly?: boolean },
  ): MonthGroup[] {
    const prefix = `${year}-`;
    const todayStr = format(new Date(), DATE_FORMAT);
    const remainingOnly =
      options?.remainingOnly ?? year === getYear(new Date());

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
          monthTotal: round(
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
    const todayStr = format(new Date(), DATE_FORMAT);
    const isCurrentYear = year === getYear(new Date());

    return round(
      monthGroups
        .flatMap((group) => group.events)
        .filter((event) => event.date.startsWith(`${year}-`))
        .filter((event) => !isCurrentYear || event.date >= todayStr)
        .reduce((sum, event) => sum + event.totalAmount, 0),
    );
  }

  #formatMonthOnly(monthKey: string): string {
    const date = parse(`${monthKey}-01`, DATE_FORMAT, new Date());

    return format(date, 'LLLL', { locale: ru });
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
    const periodDays = differenceInDays(
      parseISO(nextDate),
      parseISO(periodStart),
    );

    if (periodDays <= 0) {
      return [];
    }

    const amountPerBond = round(
      definition.nominal *
        (definition.coupon_rate / 100) *
        (periodDays / 365),
    );

    const dates =
      nextDate === maturityDate
        ? [nextDate]
        : this.#projectCouponDates(nextDate, maturityDate, periodDays);

    return dates.map((date) => ({
      kind: 'coupon' as const,
      date,
      bondSymbol: definition.parent_symbol,
      stateSecurityId: definition.state_security_id,
      quantity,
      amountPerBond,
      totalAmount: round(amountPerBond * quantity),
      currency: definition.currency,
      isEstimated: true as const,
    }));
  }

  #buildNominalEvent(holding: UserSecurity): CouponEvent[] {
    const { definition, amount: quantity } = holding;
    const maturityDate = definition.maturity_date;

    if (!maturityDate || quantity <= 0 || definition.nominal <= 0) {
      return [];
    }

    return [
      {
        kind: 'nominal' as const,
        date: maturityDate,
        bondSymbol: definition.parent_symbol,
        stateSecurityId: definition.state_security_id,
        quantity,
        amountPerBond: definition.nominal,
        totalAmount: round(definition.nominal * quantity),
        currency: definition.currency,
        isEstimated: true as const,
      },
    ];
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

      const upcoming = format(
        addDays(parseISO(current), periodDays),
        DATE_FORMAT,
      );
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

  #formatMonthLabel(date: string): string {
    return format(parseISO(date), 'LLLL yyyy', { locale: ru });
  }
}
