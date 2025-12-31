'use client';

// Success Modal: Show after successful payment

import React from 'react';
import { usePayment } from '@/app/context/PaymentContext';
import { DISCORD_INVITE, EXPLORER_URL } from '@/config/payment';
import { formatNumber } from '@/lib/tierCalculations';

export function SuccessModal() {
  const { txHash, contributionAmount, reset } = usePayment();

  // Calculate approximate YLDR (simplified - should fetch from API response)
  const approximateYldr = contributionAmount * 15; // Rough estimate

  return (
    <div className="modal-overlay">
      <div className="modal-container success-modal">
        <div className="modal-content">
          <div className="success-icon">✅</div>
          <h2 className="modal-title">Payment Successful!</h2>

          <div className="success-details">
            <div className="success-stat">
              <span className="stat-label">Contribution</span>
              <span className="stat-value">${contributionAmount.toLocaleString()} USDC</span>
            </div>
            <div className="success-stat">
              <span className="stat-label">YLDR Allocated</span>
              <span className="stat-value highlight">~{formatNumber(approximateYldr)} YLDR</span>
            </div>
            <div className="success-stat">
              <span className="stat-label">Distribution</span>
              <span className="stat-value">TGE (Q1 2027)</span>
            </div>
          </div>

          {txHash && (
            <a
              href={`${EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
            >
              View Transaction →
            </a>
          )}

          <div className="discord-cta">
            <p>Join our Discord to stay updated on development progress</p>
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="discord-button"
            >
              Join Discord
            </a>
          </div>

          <button className="modal-button-secondary" onClick={reset}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
