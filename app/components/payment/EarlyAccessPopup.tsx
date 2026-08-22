'use client';

// Early Access Popup: Main payment interface with tier display

import { useState, useEffect } from 'react';
import { usePayment } from '@/app/context/PaymentContext';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';
import { useRaiseStats, useAllocationPreview } from '@/hooks/useRaiseStats';
import { formatNumber, formatUsd, formatPrice } from '@/lib/tierCalculations';
import { MIN_CONTRIBUTION, TREASURY_ADDRESS, EXPLORER_URL } from '@/config/payment';
import { SuccessModal } from './SuccessModal';
import { ErrorModal } from './ErrorModal';
import { ProcessingModal } from './ProcessingModal';

interface EarlyAccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EarlyAccessPopup({ isOpen, onClose }: EarlyAccessPopupProps) {
  const [inputValue, setInputValue] = useState('1000');
  const [utilityExpanded, setUtilityExpanded] = useState(false);
  const { status, contributionAmount, setContributionAmount } = usePayment();
  const { initiatePayment, isConnected, balance, isProcessing } = usePaymentFlow();
  const { totalRaised, tierInfo, isLoading: statsLoading } = useRaiseStats();

  const usdcAmount = parseFloat(inputValue) || 0;
  const allocation = useAllocationPreview(usdcAmount, totalRaised);

  // Update contribution amount when input changes
  useEffect(() => {
    setContributionAmount(usdcAmount);
  }, [usdcAmount, setContributionAmount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setInputValue(value);
  };

  const handleMaxClick = () => {
    if (balance > 0) {
      setInputValue(balance.toString());
    }
  };

  const isValidAmount = usdcAmount >= MIN_CONTRIBUTION;
  const hasBalance = !isConnected || balance >= usdcAmount;

  const handlePaymentClick = () => {
    console.log('=== Payment button clicked ===');
    console.log('isConnected:', isConnected);
    console.log('isValidAmount:', isValidAmount);
    console.log('hasBalance:', hasBalance);
    console.log('isDisabled:', isDisabled);
    initiatePayment();
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    if (!isConnected) return 'Connect Wallet →';
    if (!isValidAmount) return `Min $${MIN_CONTRIBUTION} USDC`;
    if (!hasBalance) return 'Insufficient Balance';
    return 'Contribute →';
  };

  const isDisabled = isProcessing || (isConnected && (!isValidAmount || !hasBalance));

  if (!isOpen) return null;

  const { currentTier, nextTier, tierProgress, usdcToNextTier, priceIncreaseAtNextTier } = tierInfo;

  return (
    <>
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-container" onClick={(e) => e.stopPropagation()}>
          <button className="popup-close" onClick={onClose}>×</button>

          <h2 className="popup-title">Get Early Access to YLDR</h2>

          {/* Current Tier Display - Compact */}
          <div className="tier-badge-section-mobile">
            <div className="tier-compact-line">
              <span className="tier-name">{currentTier.name.toUpperCase()}</span>
              <span className="tier-separator">•</span>
              <span className="tier-price-inline">{formatPrice(currentTier.price)}</span>
            </div>
            {nextTier && (
              <div className="tier-next-info">
                {formatUsd(usdcToNextTier)} left → {nextTier.name} (+{priceIncreaseAtNextTier.toFixed(0)}%)
              </div>
            )}
          </div>

          {/* Desktop Tier Display */}
          <div className="tier-badge-section-desktop">
            <div className="tier-badge">
              <span className="tier-name">{currentTier.name.toUpperCase()}</span>
              <span className="tier-fdv">FDV: {formatUsd(currentTier.fdv)}</span>
            </div>
            <div className="tier-price">
              <span className="price-value">{formatPrice(currentTier.price)}</span>
              <span className="price-label">/ YLDR</span>
            </div>
          </div>

          {/* Thin Tier Progress Bar */}
          <div className="tier-progress-section">
            <div className="tier-progress-bar">
              <div
                className="tier-progress-fill"
                style={{ width: `${tierProgress}%` }}
              />
            </div>
            <div className="tier-progress-info">
              <span>{tierProgress.toFixed(1)}% filled</span>
              {nextTier && (
                <span className="next-tier-hint">
                  {formatUsd(usdcToNextTier)} until {nextTier.name} (+{priceIncreaseAtNextTier.toFixed(0)}% price)
                </span>
              )}
            </div>
          </div>

          {/* USDC Input */}
          <div className="contribute-section">
            <label className="contribute-label">Contribute USDC</label>
            <div className="contribute-input-wrapper">
              <span className="input-prefix">$</span>
              <input
                type="text"
                className="contribute-input"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="1,000"
              />
              <button className="max-btn" onClick={handleMaxClick}>MAX</button>
            </div>
            {isConnected && (
              <div className="balance-info">
                Balance: {formatUsd(balance)} USDC on Base
              </div>
            )}
          </div>

          {/* Allocation Preview */}
          <div className="allocation-preview">
            <span className="allocation-label">You'll receive</span>
            <div className="allocation-amount">
              ~{formatNumber(allocation.yldrAmount)} YLDR
            </div>
            <span className="allocation-timing">at TGE (Q1 2027)</span>

            {/* Show breakdown if spans multiple tiers */}
            {allocation.breakdown.length > 1 && (
              <div className="allocation-breakdown">
                {allocation.breakdown.map((item, i) => (
                  <div key={i} className="breakdown-item">
                    <span>{formatNumber(item.tokens)} @ {formatPrice(item.price)}</span>
                    <span className="breakdown-tier">{item.tier}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* What YLDR is used for - Collapsible on mobile only */}
          <div className="utility-section">
            <button
              className="utility-toggle"
              onClick={() => setUtilityExpanded(!utilityExpanded)}
            >
              <span className="utility-toggle-text">What YLDR is used for</span>
              <span className="utility-toggle-icon">{utilityExpanded ? '▼' : '▶'}</span>
            </button>

            <div className={`utility-grid ${utilityExpanded ? 'expanded' : ''}`}>
              <div className="utility-item utility-mobile-show">
                <div className="utility-icon">⚡</div>
                <div className="utility-content">
                  <div className="utility-name">
                    AI Compute Credits
                    <span className="deflationary-badge">🔥 DEFLATIONARY</span>
                  </div>
                  <p className="utility-desc utility-desc-full">
                    YLDR tokens fuel your AI agent — consumed when chatting, analyzing trades,
                    monitoring traders, and executing strategies. Every YLDR used is burned. Fixed supply.
                  </p>
                  <p className="utility-desc utility-desc-mobile">
                    Consumed & burned per use
                  </p>
                </div>
              </div>

              <div className="utility-item utility-mobile-show">
                <div className="utility-icon">🔓</div>
                <div className="utility-content">
                  <div className="utility-name">Beta Access</div>
                  <p className="utility-desc utility-desc-full">
                    Pre-TGE holders unlock full agent capabilities as features roll out each quarter of 2026.
                    Train and fine-tune your agent before public launch.
                  </p>
                  <p className="utility-desc utility-desc-mobile">
                    Unlock full agent capabilities
                  </p>
                </div>
              </div>

              <div className="utility-item utility-desktop-only">
                <div className="utility-icon">💬</div>
                <div className="utility-content">
                  <div className="utility-name">Exclusive Community</div>
                  <p className="utility-desc">
                    Access private Discord with direct team interaction, product feedback sessions,
                    and priority updates on development.
                  </p>
                </div>
              </div>

              <div className="utility-item utility-desktop-only">
                <div className="utility-icon">🗳️</div>
                <div className="utility-content">
                  <div className="utility-name">Governance Rights</div>
                  <p className="utility-desc">
                    Snapshot voting on protocol decisions, feature prioritization, and treasury allocations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Scenarios at TGE - Mobile shows 1, Desktop shows 3 */}
          <div className="roi-section">
            <h3 className="roi-title">
              ROI Scenarios at TGE <span className="roi-subtitle">(assuming 1k USDC purchase)</span>
            </h3>

            {/* Mobile: Single scenario */}
            <div className="roi-grid roi-grid-mobile">
              <div className="roi-item">
                <div className="roi-fdv">$300M FDV</div>
                <div className="roi-return">$33,200</div>
                <div className="roi-multiple">33.2x</div>
              </div>
            </div>

            {/* Desktop: All scenarios */}
            <div className="roi-grid roi-grid-desktop">
              <div className="roi-item">
                <div className="roi-fdv">$150M FDV</div>
                <div className="roi-return">$16,600</div>
                <div className="roi-multiple">16.6x</div>
              </div>
              <div className="roi-item">
                <div className="roi-fdv">$300M FDV</div>
                <div className="roi-return">$33,200</div>
                <div className="roi-multiple">33.2x</div>
              </div>
              <div className="roi-item">
                <div className="roi-fdv">$500M FDV</div>
                <div className="roi-return">$55,400</div>
                <div className="roi-multiple">55.4x</div>
              </div>
            </div>
          </div>

          {/* Connect Wallet Button */}
          <button
            className="connect-wallet-btn"
            onClick={handlePaymentClick}
            disabled={isDisabled}
          >
            {getButtonText()}
          </button>

          {/* Treasury Info */}
          <div className="treasury-info">
            <span>Treasury:</span>
            <a
              href={`${EXPLORER_URL}/address/${TREASURY_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="treasury-address"
            >
              {TREASURY_ADDRESS.slice(0, 6)}...{TREASURY_ADDRESS.slice(-4)}
            </a>
            <span className="treasury-badge">multisig</span>
            <span>|</span>
            <a
              href={`${EXPLORER_URL}/address/${TREASURY_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Basescan
            </a>
          </div>

          <p className="popup-footer">
            Tokens distributed at TGE. Read{' '}
            <a href="/docs" target="_blank">docs</a>
            {' '}to learn more about{' '}
            <a href="/docs#what-is-yieldr" target="_blank">product</a>
            {' '}&{' '}
            <a href="/docs#tokenomics" target="_blank">tokenomics</a>.
          </p>
        </div>
      </div>

      {/* Modals */}
      {status === 'processing' && <ProcessingModal />}
      {status === 'success' && <SuccessModal />}
      {status === 'error' && <ErrorModal />}
    </>
  );
}
