'use client';

// Success Modal: Show after successful payment

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePayment } from '@/app/context/PaymentContext';
import { EXPLORER_URL } from '@/config/payment';
import { formatNumber, formatPrice, formatUsd } from '@/lib/tierCalculations';

const DISCORD_INVITE = 'https://discord.gg/c8qq9DKkjM';

export function SuccessModal() {
  const router = useRouter();
  const { txHash, contributionAmount, allocationData, reset, status } = usePayment();
  const [countdown, setCountdown] = useState(3);

  // Only show when status is success and we have allocation data
  if (status !== 'success' || !allocationData) return null;

  const { yldrAmount, effectivePrice, breakdown, discord_invite } = allocationData;

  // Countdown timer (just updates the number)
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // Redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      console.log('⏰ Auto-redirecting to allocations page...');
      // Don't call reset() - let allocations page handle the refresh
      router.push('/allocations');
    }
  }, [countdown, router]);

  const handleClose = () => {
    console.log('✅ Closing success modal and redirecting to allocations...');
    // Don't call reset() - let allocations page handle the refresh
    router.push('/allocations');
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-container success-modal">
        <div className="modal-content">
          <div className="success-icon">🎉</div>
          <h2 className="modal-title">Allocation Successful!</h2>
          <p className="modal-subtitle">Welcome to YLDR Early Access</p>

          {/* Main allocation display */}
          <div className="allocation-main">
            <div className="allocation-amount-display">
              <span className="yldr-amount">{formatNumber(yldrAmount)} YLDR</span>
              <span className="allocation-label">Allocated at TGE (Q1 2027)</span>
            </div>
          </div>

          {/* Transaction and price details */}
          <div className="success-details">
            <div className="success-stat">
              <span className="stat-label">Contribution</span>
              <span className="stat-value">{formatUsd(contributionAmount)} USDC</span>
            </div>
            <div className="success-stat">
              <span className="stat-label">Avg. Price</span>
              <span className="stat-value">{formatPrice(effectivePrice)}/YLDR</span>
            </div>
          </div>

          {/* Tier breakdown if spans multiple tiers */}
          {breakdown.length > 1 && (
            <div className="tier-breakdown-section">
              <h4>Allocation Breakdown</h4>
              {breakdown.map((item, i) => (
                <div key={i} className="breakdown-row">
                  <span className="breakdown-tier">{item.tier}</span>
                  <span className="breakdown-tokens">{formatNumber(item.tokens)} YLDR @ {formatPrice(item.price)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Transaction link */}
          {txHash && (
            <a
              href={`${EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
            >
              View on Basescan →
            </a>
          )}

          {/* Discord CTA */}
          <div className="discord-cta">
            <div className="cta-icon">💬</div>
            <h3>Claim Exclusive Beta Access</h3>
            <p>Join our private Discord for direct team interaction, product updates, and priority support</p>
            <p className="discord-warning">⚠️ This is a one-time invite. Do not share.</p>
            <a
              href={discord_invite || DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="discord-button"
            >
              Join Discord Community
            </a>
          </div>

          {/* Build progress link */}
          <a href="/build-in-public" className="build-link">
            View Build Progress →
          </a>

          {/* Auto-redirect countdown */}
          <div className="modal-redirect-notice">
            <span className="redirect-icon">↗️</span>
            <span className="redirect-text">
              Redirecting to your allocations page in <strong>{countdown}s</strong>
            </span>
          </div>

          <button className="modal-button-secondary" onClick={handleClose}>
            View My Allocations Now →
          </button>
        </div>
      </div>
    </div>
  );
}
