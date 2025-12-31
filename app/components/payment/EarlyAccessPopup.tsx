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
  const [shouldAutoTransfer, setShouldAutoTransfer] = useState(false);
  const { status, contributionAmount, setContributionAmount } = usePayment();
  const { initiatePayment, isConnected, address, balance, isProcessing, chainId, isCorrectNetwork } = usePaymentFlow();
  const { totalRaised, tierInfo, isLoading: statsLoading } = useRaiseStats();

  const usdcAmount = parseFloat(inputValue) || 0;
  const allocation = useAllocationPreview(usdcAmount, totalRaised);

  // Update contribution amount when input changes
  useEffect(() => {
    setContributionAmount(usdcAmount);
  }, [usdcAmount, setContributionAmount]);

  // Auto-trigger payment after wallet connects and network is correct
  useEffect(() => {
    if (isConnected && isCorrectNetwork && shouldAutoTransfer && !isProcessing) {
      setShouldAutoTransfer(false);
      // Small delay to ensure balance is loaded
      setTimeout(() => {
        initiatePayment();
      }, 500);
    }
  }, [isConnected, isCorrectNetwork, shouldAutoTransfer, isProcessing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setInputValue(value);
  };

  const handleMaxClick = () => {
    if (balance > 0) {
      setInputValue(balance.toString());
    }
  };

  const handleButtonClick = () => {
    if (!isConnected) {
      // Set flag to auto-transfer after connection
      setShouldAutoTransfer(true);
    }
    initiatePayment();
  };

  const isValidAmount = usdcAmount >= MIN_CONTRIBUTION;
  const hasBalance = !isConnected || balance >= usdcAmount;

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    if (!isConnected) return 'Connect Wallet →';
    if (isConnected && !isCorrectNetwork) return 'Switch to Base Network →';
    if (!isValidAmount) return `Min $${MIN_CONTRIBUTION} USDC`;
    if (!hasBalance) return 'Insufficient Balance';
    return 'Contribute →';
  };

  const isDisabled = isProcessing || (isConnected && isCorrectNetwork && (!isValidAmount || !hasBalance));

  if (!isOpen) return null;

  const { currentTier, nextTier, tierProgress, usdcToNextTier, priceIncreaseAtNextTier } = tierInfo;

  return (
    <>
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup-container" onClick={(e) => e.stopPropagation()}>
          <button className="popup-close" onClick={onClose}>×</button>

          <h2 className="popup-title">Get Early Access to YLDR</h2>

          {/* Current Tier Display */}
          <div className="tier-badge-section">
            <div className="tier-badge">
              <span className="tier-name">{currentTier.name.toUpperCase()}</span>
              <span className="tier-fdv">FDV: {formatUsd(currentTier.fdv)}</span>
            </div>
            <div className="tier-price">
              <span className="price-value">{formatPrice(currentTier.price)}</span>
              <span className="price-label">/ YLDR</span>
            </div>
          </div>

          {/* Tier Progress */}
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

          {/* Wallet Status */}
          {isConnected && (
            <div className="wallet-status">
              <div className="wallet-status-item">
                <span className="status-label">Connected:</span>
                <span className="status-value">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              </div>
              {!isCorrectNetwork && (
                <div className="wallet-status-warning">
                  ⚠️ Please switch to Base network
                </div>
              )}
            </div>
          )}

          {/* Connect Wallet / Contribute Button */}
          <button
            className="connect-wallet-btn"
            onClick={handleButtonClick}
            disabled={isDisabled}
          >
            {getButtonText()}
          </button>

          {/* What YLDR is used for */}
          <div className="utility-section">
            <h3 className="utility-title">What YLDR is used for</h3>

            <div className="utility-grid">
              <div className="utility-item">
                <div className="utility-icon">⚡</div>
                <div className="utility-content">
                  <div className="utility-name">
                    AI Compute Credits
                    <span className="deflationary-badge">🔥 DEFLATIONARY</span>
                  </div>
                  <p className="utility-desc">
                    YLDR tokens fuel your AI agent — consumed when chatting, analyzing trades,
                    monitoring traders, and executing strategies. Every YLDR used is burned. Fixed supply.
                  </p>
                </div>
              </div>

              <div className="utility-item">
                <div className="utility-icon">🔓</div>
                <div className="utility-content">
                  <div className="utility-name">Beta Access</div>
                  <p className="utility-desc">
                    Pre-TGE holders unlock full agent capabilities as features roll out each quarter of 2026.
                    Train and fine-tune your agent before public launch.
                  </p>
                </div>
              </div>

              <div className="utility-item">
                <div className="utility-icon">💬</div>
                <div className="utility-content">
                  <div className="utility-name">Exclusive Community</div>
                  <p className="utility-desc">
                    Access private Discord with direct team interaction, product feedback sessions,
                    and priority updates on development.
                  </p>
                </div>
              </div>

              <div className="utility-item">
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
            <a href="https://yieldr.org/docs" target="_blank">docs</a>
            {' '}to learn more about{' '}
            <a href="https://yieldr.org/docs/product" target="_blank">product</a>
            {' '}&{' '}
            <a href="https://yieldr.org/docs/tokenomics" target="_blank">tokenomics</a>.
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
