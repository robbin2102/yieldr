// Tier Calculation Logic for YLDR Allocations

import { ALLOCATION_TIERS, AllocationTier } from '@/config/tiers';

export interface TierInfo {
  currentTier: AllocationTier;
  nextTier: AllocationTier | null;
  tierProgress: number;        // % of current tier filled
  tokensRemainingInTier: number;
  priceIncreaseAtNextTier: number; // % increase
  usdcToNextTier: number;      // USDC until next tier
}

export interface AllocationResult {
  yldrAmount: number;
  effectivePrice: number;
  tier: string;
  fdv: number;
  breakdown: {
    tier: string;
    tokens: number;
    price: number;
    usdc: number;
  }[];
}

/**
 * Get current tier based on total raised
 */
export function getCurrentTier(totalRaisedUsdc: number): TierInfo {
  let currentTier = ALLOCATION_TIERS[0];
  let nextTier: AllocationTier | null = ALLOCATION_TIERS[1] || null;
  let previousCumulative = 0;

  for (let i = 0; i < ALLOCATION_TIERS.length; i++) {
    const tier = ALLOCATION_TIERS[i];

    if (totalRaisedUsdc < tier.cumulativeRaise) {
      currentTier = tier;
      nextTier = ALLOCATION_TIERS[i + 1] || null;
      previousCumulative = i > 0 ? ALLOCATION_TIERS[i - 1].cumulativeRaise : 0;
      break;
    }

    // If we've exceeded all tiers, stay on last tier
    if (i === ALLOCATION_TIERS.length - 1) {
      currentTier = tier;
      nextTier = null;
      previousCumulative = ALLOCATION_TIERS[i - 1]?.cumulativeRaise || 0;
    }
  }

  const tierRaised = totalRaisedUsdc - previousCumulative;
  const tierProgress = (tierRaised / currentTier.raiseTarget) * 100;
  const tokensAllocatedInTier = tierRaised / currentTier.price;
  const tokensRemainingInTier = currentTier.tokens - tokensAllocatedInTier;
  const usdcToNextTier = currentTier.cumulativeRaise - totalRaisedUsdc;

  const priceIncreaseAtNextTier = nextTier
    ? ((nextTier.price - currentTier.price) / currentTier.price) * 100
    : 0;

  return {
    currentTier,
    nextTier,
    tierProgress: Math.min(tierProgress, 100),
    tokensRemainingInTier: Math.max(tokensRemainingInTier, 0),
    priceIncreaseAtNextTier,
    usdcToNextTier: Math.max(usdcToNextTier, 0),
  };
}

/**
 * Calculate YLDR allocation for a contribution amount
 * Handles tier boundaries (contribution might span multiple tiers)
 */
export function calculateAllocation(
  contributionUsdc: number,
  totalRaisedUsdc: number
): AllocationResult {
  let remainingUsdc = contributionUsdc;
  let totalYldr = 0;
  let currentRaised = totalRaisedUsdc;
  const breakdown: AllocationResult['breakdown'] = [];

  // Find starting tier
  let tierIndex = 0;
  for (let i = 0; i < ALLOCATION_TIERS.length; i++) {
    if (currentRaised < ALLOCATION_TIERS[i].cumulativeRaise) {
      tierIndex = i;
      break;
    }
    if (i === ALLOCATION_TIERS.length - 1) {
      tierIndex = i;
    }
  }

  // Process contribution across tiers
  while (remainingUsdc > 0 && tierIndex < ALLOCATION_TIERS.length) {
    const tier = ALLOCATION_TIERS[tierIndex];
    const previousCumulative = tierIndex > 0
      ? ALLOCATION_TIERS[tierIndex - 1].cumulativeRaise
      : 0;

    // How much USDC can this tier absorb?
    const tierCapacity = tier.cumulativeRaise - currentRaised;
    const usdcForThisTier = Math.min(remainingUsdc, tierCapacity);

    // Calculate tokens at this tier's price
    const tokensFromTier = usdcForThisTier / tier.price;

    totalYldr += tokensFromTier;
    remainingUsdc -= usdcForThisTier;
    currentRaised += usdcForThisTier;

    if (usdcForThisTier > 0) {
      breakdown.push({
        tier: tier.name,
        tokens: tokensFromTier,
        price: tier.price,
        usdc: usdcForThisTier,
      });
    }

    tierIndex++;
  }

  // Calculate effective price (weighted average)
  const effectivePrice = contributionUsdc / totalYldr;

  // Primary tier is the first one in breakdown
  const primaryTier = breakdown[0]?.tier || ALLOCATION_TIERS[0].name;
  const primaryTierData = ALLOCATION_TIERS.find(t => t.name === primaryTier)!;

  return {
    yldrAmount: Math.floor(totalYldr),
    effectivePrice,
    tier: primaryTier,
    fdv: primaryTierData.fdv,
    breakdown,
  };
}

/**
 * Format numbers for display
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export function formatUsd(num: number): string {
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatPrice(num: number): string {
  return `$${num.toFixed(3)}`;
}
