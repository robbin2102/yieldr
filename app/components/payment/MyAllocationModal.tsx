'use client';

// My Allocation Modal: Show user's allocation details

import React from 'react';
import { usePayment } from '@/app/context/PaymentContext';
import { EXPLORER_URL } from '@/config/payment';
import { formatNumber, formatPrice, formatUsd } from '@/lib/tierCalculations';

const DISCORD_INVITE = 'https://discord.gg/c8qq9DKkjM';

interface MyAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyAllocationModal({ isOpen, onClose }: MyAllocationModalProps) {
  const { txHash, contributionAmount, allocationData } = usePayment();

  if (!isOpen || !allocationData) return null;

  const { yldrAmount, effectivePrice, breakdown } = allocationData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container allocation-modal" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>

        <div className="modal-content">
          <h2 className="modal-title">My Allocation</h2>
          <p className="modal-subtitle">YLDR Early Access</p>

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

          {/* Quick actions */}
          <div className="quick-actions">
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="action-button discord"
            >
              💬 Join Discord
            </a>
            <a
              href="/build-in-public"
              className="action-button progress"
            >
              📊 View Progress
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
