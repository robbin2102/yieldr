'use client';

// Early Access Popup: Main payment interface with tier display

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
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

  const handleConnectClick = (openModal: () => void) => {
    if (usdcAmount < MIN_CONTRIBUTION) {
      alert(`Minimum contribution is $${MIN_CONTRIBUTION} USDC. Please enter at least $${MIN_CONTRIBUTION}.`);
      return;
    }
    openModal();
  };

  // Auto-trigger payment after wallet connects if amount is valid
  useEffect(() => {
    if (isConnected && usdcAmount >= MIN_CONTRIBUTION && balance >= usdcAmount && !isProcessing) {
      // Small delay to ensure wallet is fully connected
      const timer = setTimeout(() => {
        initiatePayment();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  const isValidAmount = usdcAmount >= MIN_CONTRIBUTION;
  const hasBalance = !isConnected || balance >= usdcAmount;
  const isDisabled = isProcessing || (isConnected && (!isValidAmount || !hasBalance));

  if (!isOpen) return null;

  const { currentTier } = tierInfo;

  // Debug: Log treasury address to verify correct import
  console.log('Treasury Address:', TREASURY_ADDRESS);

  // Calculate potential multiplier at different FDV scenarios
  const fdvScenarios = [
    { fdv: 150_000_000, label: '$150M FDV' },
    { fdv: 300_000_000, label: '$300M FDV' },
    { fdv: 500_000_000, label: '$500M FDV' },
  ];

  return (
    <>
      <div className="popup-overlay active" onClick={onClose}>
        <div className="popup-card" onClick={(e) => e.stopPropagation()}>
          <div className="popup-header">
            <span className="popup-title">Get Early Access to YLDR</span>
            <button className="popup-close" onClick={onClose}>×</button>
          </div>
          <div className="popup-body">
            {/* Allocation Section */}
            <div className="popup-allocation">
              <div className="popup-allocation-header">
                <div className="popup-tier">
                  <span className="tier-badge">{currentTier.name.toUpperCase()}</span>
                  <span className="tier-fdv">FDV: {formatUsd(currentTier.fdv)}</span>
                </div>
                <div className="tier-price">
                  <div className="price-value">{formatPrice(currentTier.price)} / YLDR</div>
                  <div className="price-potential">
                    {((150_000_000 / currentTier.fdv)).toFixed(1)}x potential at TGE
                  </div>
                </div>
              </div>

              <div className="contribute-input">
                <div className="contribute-label">Contribute USDC</div>
                <div className="contribute-field">
                  <input
                    type="text"
                    className="contribute-input-field"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="$ 1,000"
                  />
                  <button className="max-btn" onClick={handleMaxClick}>MAX</button>
                </div>
              </div>

              <div className="receive-preview">
                <div className="receive-label">You'll receive</div>
                <div className="receive-amount">~{formatNumber(allocation.yldrAmount)} YLDR</div>
                <div className="receive-timing">at TGE (Q1 2027)</div>
              </div>
            </div>

            {/* Utility Section */}
            <div className="popup-utility">
              <div className="utility-title">What YLDR is used for</div>
              <div className="utility-grid">
                <div className="utility-item">
                  <div className="utility-icon">⚡</div>
                  <div className="utility-content">
                    <div className="utility-name">
                      AI Compute Credits <span className="deflationary-badge">🔥 DEFLATIONARY</span>
                    </div>
                    <div className="utility-desc">
                      YLDR fuels your AI agent. Every YLDR used is burned. Fixed supply.
                    </div>
                  </div>
                </div>
                <div className="utility-item">
                  <div className="utility-icon">🔓</div>
                  <div className="utility-content">
                    <div className="utility-name">Beta Access</div>
                    <div className="utility-desc">
                      Unlock agent capabilities as features roll out in 2026.
                    </div>
                  </div>
                </div>
                <div className="utility-item">
                  <div className="utility-icon">💬</div>
                  <div className="utility-content">
                    <div className="utility-name">Exclusive Community</div>
                    <div className="utility-desc">
                      Private Discord with direct team interaction and updates.
                    </div>
                  </div>
                </div>
                <div className="utility-item">
                  <div className="utility-icon">🗳️</div>
                  <div className="utility-content">
                    <div className="utility-name">Governance Rights</div>
                    <div className="utility-desc">
                      Snapshot voting on protocol decisions and treasury.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Section */}
            <div className="popup-roi">
              <div className="roi-title">ROI Scenarios at TGE</div>
              <div className="roi-grid">
                {fdvScenarios.map((scenario, index) => {
                  const tokensValue = allocation.yldrAmount * (scenario.fdv / 210_000_000);
                  const multiple = tokensValue / usdcAmount;
                  return (
                    <div className="roi-item" key={index}>
                      <div className="roi-fdv">{scenario.label}</div>
                      <div className="roi-value">${tokensValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      <div className="roi-multiple">{multiple.toFixed(1)}x</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {!isConnected ? (
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button className="popup-cta" onClick={() => handleConnectClick(openConnectModal)}>
                    <span>Connect Wallet</span>
                    <span>→</span>
                  </button>
                )}
              </ConnectButton.Custom>
            ) : (
              <button
                className="popup-cta"
                onClick={initiatePayment}
                disabled={isDisabled}
              >
                {isProcessing ? (
                  <span>Processing...</span>
                ) : !isValidAmount ? (
                  <span>Min ${MIN_CONTRIBUTION} USDC</span>
                ) : !hasBalance ? (
                  <span>Insufficient Balance</span>
                ) : (
                  <>
                    <span>Transfer USDC</span>
                    <span>→</span>
                  </>
                )}
              </button>
            )}

            <div className="popup-treasury">
              <span>Treasury:</span>
              <a href={`${EXPLORER_URL}/address/${TREASURY_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                {TREASURY_ADDRESS.slice(0, 6)}...{TREASURY_ADDRESS.slice(-4)}
              </a>
              <span>|</span>
              <a href={`${EXPLORER_URL}/address/${TREASURY_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                View on Basescan
              </a>
            </div>

            <p className="popup-note">
              Tokens distributed at TGE. Read <a href="/docs" target="_blank">docs</a> to learn more about <a href="/docs" target="_blank">product</a> & <a href="/docs" target="_blank">tokenomics</a>.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {status === 'processing' && <ProcessingModal />}
      {status === 'success' && <SuccessModal />}
      {status === 'error' && <ErrorModal />}
    </>
  );
}
