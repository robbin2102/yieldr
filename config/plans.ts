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

/**
 * How much access a single Genesis payment actually buys, and whether it
 * keeps billing after that.
 *
 *   - monthly cycle → covers ONE month of access once Terminal launches.
 *     After that first month, the subscription auto-renews monthly at the
 *     locked-in Genesis rate (recurring billing begins at launch — there is
 *     nothing to charge between now and then).
 *   - annual cycle  → the full 12 months is already paid for today. No
 *     renewal charge until the 12-month window ends.
 */
export function getAccessMonths(cycle: BillingCycle): number {
  return cycle === 'annual' ? MONTHS_PER_YEAR : 1;
}

/** True if this cycle keeps auto-charging (at the locked Genesis rate) after its initial access window. */
export function renewsAutomatically(cycle: BillingCycle): boolean {
  return cycle === 'monthly';
}

export const REWARD_MULTIPLIER_MIN = 1;
export const REWARD_MULTIPLIER_MAX = 2;
export const SUBSCRIPTION_START_LABEL = 'Q1 2027';
export const REWARD_PAYOUT_LABEL = 'TGE + 30 days';

// ── Upgrades ──────────────────────────────────────────────────────────────
//
// A wallet may hold exactly one Genesis subscription at a time:
//   - First payment for a wallet: charged the full plan price.
//   - Same plan + same cycle again: rejected — you already own it.
//   - A HIGHER-value plan/cycle: an upgrade — charged only the difference
//     between the new plan's full price and what's already been invested
//     (cumulativePaid), not the new plan's full price again. Monthly → annual
//     on the same plan, or moving up a tier (Scout → Trader → Desk) at any
//     cycle, are both upgrades as long as the new price exceeds what's
//     already been paid. Downgrades (or anything that wouldn't increase your
//     total investment) are rejected — there's nothing to charge for those.
//
// This function is the SINGLE place that decides what a wallet owes for a
// given (plan, cycle) request — both the client (to size the on-chain
// transfer) and the server (to independently verify it) call this exact
// function, so they cannot drift apart.

export interface CurrentSubscriptionInfo {
  planName: PlanName;
  billingCycle: BillingCycle;
  cumulativeUsdcPaid: number;
}

export type ChargeDecision =
  | { ok: true; isUpgrade: boolean; amount: number }
  | { ok: false; reason: 'already-owned' | 'not-an-upgrade' | 'invalid-plan' };

export function computeChargeAmount(
  planName: PlanName,
  billingCycle: BillingCycle,
  current: CurrentSubscriptionInfo | null
): ChargeDecision {
  const newFullPrice = getPlanPrice(planName, billingCycle);
  if (newFullPrice === null) {
    return { ok: false, reason: 'invalid-plan' };
  }

  if (!current) {
    return { ok: true, isUpgrade: false, amount: newFullPrice };
  }

  if (current.planName === planName && current.billingCycle === billingCycle) {
    return { ok: false, reason: 'already-owned' };
  }

  const differential = newFullPrice - current.cumulativeUsdcPaid;
  if (differential <= 0) {
    return { ok: false, reason: 'not-an-upgrade' };
  }

  return { ok: true, isUpgrade: true, amount: differential };
}
