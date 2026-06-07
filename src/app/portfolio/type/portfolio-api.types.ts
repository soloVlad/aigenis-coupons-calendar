export type PaginatedResponse<T> = {
  pagination: {
    count: number;
    next: number | null;
    previous: number | null;
  };
  results: T[];
};

export type SecurityDefinition = {
  id: number;
  parent_symbol: string;
  state_security_id: string;
  security_symbol: string;
  product: string;
  currency: string;
  nominal: number;
  coupon_rate: number;
  issue_date: string;
  last_coupon_date: string | null;
  next_coupon_date: string | null;
  coupon_payment_date: string | null;
  maturity_date: string;
};

export type UserSecurity = {
  id: number;
  amount: number;
  definition: SecurityDefinition;
};

export type CouponEvent = {
  date: string;
  bondSymbol: string;
  stateSecurityId: string;
  quantity: number;
  amountPerBond: number;
  totalAmount: number;
  currency: string;
  isEstimated: true;
};

export type MonthGroup = {
  monthKey: string;
  monthLabel: string;
  events: CouponEvent[];
  monthTotal: number;
  currency: string;
};
