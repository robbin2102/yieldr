'use client';

import { useRaiseStats } from '@/hooks/useRaiseStats';
import { formatUsd, formatPrice } from '@/lib/tierCalculations';
import Link from 'next/link';

interface TierProgressProps {
  showCTA?: boolean;
  compact?: boolean;
  onGetAllocation?: () => void;
}

export function TierProgress({ showCTA = false, compact = false, onGetAllocation }: TierProgressProps) {
  const { tierInfo, isLoading } = useRaiseStats();

  if (isLoading) {
    return <div className="tier-progress-loading">Loading tier data...</div>;
  }

  const { currentTier, nextTier, tierProgress, usdcToNextTier, priceIncreaseAtNextTier } = tierInfo;

  // Calculate remaining capacity in current tier
  const tierCap = currentTier.cap;
  const tierFilled = (tierProgress / 100) * tierCap;
  const tierRemaining = tierCap - tierFilled;

  // Determine urgency level
  const urgencyLevel = tierProgress < 50 ? 'normal' : tierProgress < 80 ? 'medium' : 'high';
  const urgencyIcon = urgencyLevel === 'high' ? '🚨' : urgencyLevel === 'medium' ? '🔥' : '';
  const urgencyMessage = urgencyLevel === 'high'
    ? '- Almost Gone!'
    : tierProgress < 50
    ? ''
    : '';

  return (
    <div className={`tier-progress-card ${compact ? 'compact' : ''} ${urgencyLevel}`}>
      {/* Tier Header */}
      <div className="tier-progress-header">
        <h3 className="tier-progress-title">
          {urgencyIcon} {currentTier.name} Tier - {tierProgress.toFixed(0)}% Filled {urgencyMessage}
        </h3>
      </div>

      {/* Progress Bar */}
      <div className="tier-progress-bar-container">
        <div
          className={`tier-progress-bar-fill ${urgencyLevel}`}
          style={{ width: `${tierProgress}%` }}
        />
      </div>

      {/* Progress Stats */}
      <div className="tier-progress-stats">
        <span className="tier-progress-stat">${(tierFilled / 1000).toFixed(0)}K / ${(tierCap / 1000).toFixed(0)}K</span>
      </div>

      {/* Price Info */}
      <div className="tier-price-info">
        <div className="tier-price-row">
          <span className="tier-price-label">Current Price:</span>
          <span className="tier-price-value">{formatPrice(currentTier.price)}/YLDR</span>
        </div>
        {nextTier && (
          <div className="tier-price-row">
            <span className="tier-price-label">Next Tier ({nextTier.name}):</span>
            <span className="tier-price-value highlight">
              {formatPrice(nextTier.price)}/YLDR
              <span className="price-increase"> (+{priceIncreaseAtNextTier.toFixed(0)}%)</span>
            </span>
          </div>
        )}
      </div>

      {/* Urgency Message */}
      {urgencyLevel === 'high' && (
        <div className="tier-urgency-warning">
          ⚠️ Only {formatUsd(tierRemaining)} left before price increases {priceIncreaseAtNextTier.toFixed(0)}%!
        </div>
      )}
      {urgencyLevel === 'medium' && (
        <div className="tier-urgency-message">
          ⏳ Only {formatUsd(usdcToNextTier)} left at this price
        </div>
      )}

      {/* CTA Buttons */}
      {showCTA && (
        <div className="tier-progress-actions">
          <button
            className={`tier-cta-primary ${urgencyLevel === 'high' ? 'pulse' : ''}`}
            onClick={onGetAllocation}
          >
            Get Allocation Now
          </button>
          <Link href="/docs#tokenomics" className="tier-cta-secondary">
            View All Tiers →
          </Link>
        </div>
      )}
    </div>
  );
}
