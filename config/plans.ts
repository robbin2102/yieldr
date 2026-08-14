// Genesis subscription plan catalogue — single source of truth for pricing.
// Shared by the prelaunch-edge checkout UI (client) and the /api/subscriptions
// route (server), so the server can independently derive the expected charge
// for a plan instead of trusting a client-submitted price.

export type PlanName = 'Scout' | 'Trader' | 'Desk';
export type BillingCycle = 'monthly' | 'annual';

export interface PlanPrice {
  monthly: number;
  annual: number;
}

export const PLAN_PRICES: Record<PlanName, PlanPrice> = {
  Scout: { monthly: 50, annual: 38 },
  Trader: { monthly: 100, annual: 75 },
  Desk: { monthly: 199, annual: 149 },
};

export const PLAN_NAMES = Object.keys(PLAN_PRICES) as PlanName[];

export function isPlanName(value: unknown): value is PlanName {
  return typeof value === 'string' && (PLAN_NAMES as string[]).includes(value);
}

export function isBillingCycle(value: unknown): value is BillingCycle {
  return value === 'monthly' || value === 'annual';
}

export const MONTHS_PER_YEAR = 12;

/**
 * Returns the actual one-time Genesis charge for a plan/cycle, or null if
 * either is invalid.
 *
 * PLAN_PRICES stores a PER-MONTH rate for both cycles (used as-is for the
 * "$X/mo" marketing price on the pricing cards). There is no recurring
 * billing in this product — every plan is a single upfront payment:
 *   - monthly cycle → one month's rate, charged once
 *   - annual cycle  → the discounted per-month rate × 12, charged once,
 *                      prepaying the full first year at the lower rate
 * This is the amount actually transferred on-chain and the amount the
 * server independently verifies against — it must stay in sync with both.
 */
export function getPlanPrice(name: PlanName, cycle: BillingCycle): number | null {
  const plan = PLAN_PRICES[name];
  if (!plan) return null;
  return cycle === 'annual' ? plan.annual * MONTHS_PER_YEAR : plan.monthly;
}

export const REWARD_MULTIPLIER_MIN = 1;
export const REWARD_MULTIPLIER_MAX = 2;
export const SUBSCRIPTION_ACCESS_MONTHS = 12;
export const SUBSCRIPTION_START_LABEL = 'Q1 2027';
export const REWARD_PAYOUT_LABEL = 'TGE + 30 days';
