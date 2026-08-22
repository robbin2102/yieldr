'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseUnits, type Address } from 'viem';
import { TREASURY_WALLET, USDC_TOKEN_ADDRESS } from '@/lib/types/contribution';

const USDC_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Default Genesis tier (fallback if API fails)
const DEFAULT_TIER = {
  name: 'Genesis',
  tokensAvailable: 2000000,
  tokensSold: 0,
  pricePerToken: 0.043,
  fdv: 9000000,
  targetRaise: 86000,
};

export function PaymentPopup({ isOpen, onClose }: PaymentPopupProps) {
  const { address, isConnected } = useAccount();
  const [usdcAmount, setUsdcAmount] = useState('1000');
  const [currentTier, setCurrentTier] = useState<any>(DEFAULT_TIER);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    async function fetchTier() {
      try {
        const res = await fetch('/api/tiers');
        const data = await res.json();
        if (data.success && data.currentTier) {
          setCurrentTier(data.currentTier);
        }
      } catch (err) {
        console.error('Error fetching tier:', err);
        // Keep using DEFAULT_TIER
      }
    }
    if (isOpen) {
      fetchTier();
    }
  }, [isOpen]);

  const yldrAmount = currentTier ? (parseFloat(usdcAmount) || 0) / currentTier.pricePerToken : 0;

  useEffect(() => {
    if (isSuccess && hash) {
      recordContribution(hash);
    }
  }, [isSuccess, hash]);

  const recordContribution = async (txHash: string) => {
    try {
      await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          usdcAmount: parseFloat(usdcAmount),
          txHash,
        }),
      });
    } catch (err) {
      console.error('Failed to record contribution:', err);
    }
  };

  const handleTransfer = async () => {
    if (!isConnected || !address || !usdcAmount) return;

    try {
      const amount = parseUnits(usdcAmount, 6);
      writeContract({
        address: USDC_TOKEN_ADDRESS as Address,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [TREASURY_WALLET as Address, amount],
      });
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`popup-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick}>
      <div className="popup-card">
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
                  <span className="tier-fdv">FDV: ${(currentTier.fdv / 1000000).toFixed(0)}M</span>
                </div>
                <div className="tier-price">
                  <div className="price-value">${currentTier.pricePerToken.toFixed(3)} / YLDR</div>
                  <div className="price-potential">12x potential at TGE</div>
                </div>
              </div>

              <div className="contribute-input">
                <div className="contribute-label">Contribute USDC</div>
                <div className="contribute-field">
                  <input
                    type="text"
                    className="contribute-input-field"
                    value={usdcAmount}
                    onChange={(e) => setUsdcAmount(e.target.value)}
                    placeholder="$ 1,000"
                  />
                  <button className="max-btn">MAX</button>
                </div>
              </div>

              <div className="receive-preview">
                <div className="receive-label">You'll receive</div>
                <div className="receive-amount">~{yldrAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} YLDR</div>
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
                  <div className="utility-name">AI Compute Credits <span className="deflationary-badge">🔥 DEFLATIONARY</span></div>
                  <div className="utility-desc">YLDR tokens fuel your AI agent — consumed when chatting, analyzing trades, monitoring traders, and executing strategies. Every YLDR used is burned. Fixed supply.</div>
                </div>
              </div>
              <div className="utility-item">
                <div className="utility-icon">🔓</div>
                <div className="utility-content">
                  <div className="utility-name">Beta Access</div>
                  <div className="utility-desc">Pre-TGE holders unlock full agent capabilities as features roll out each quarter of 2026. Train and fine-tune your agent before public launch.</div>
                </div>
              </div>
              <div className="utility-item">
                <div className="utility-icon">💬</div>
                <div className="utility-content">
                  <div className="utility-name">Exclusive Community</div>
                  <div className="utility-desc">Access private Discord with direct team interaction, product feedback sessions, and priority updates on development.</div>
                </div>
              </div>
              <div className="utility-item">
                <div className="utility-icon">🗳️</div>
                <div className="utility-content">
                  <div className="utility-name">Governance Rights</div>
                  <div className="utility-desc">Snapshot voting on protocol decisions, feature prioritization, and treasury allocations.</div>
                </div>
              </div>
            </div>
          </div>

          {/* ROI Section */}
          <div className="popup-roi">
            <div className="roi-title">ROI Scenarios at TGE</div>
            <div className="roi-grid">
              <div className="roi-item">
                <div className="roi-fdv">$150M FDV</div>
                <div className="roi-value">$12,500</div>
                <div className="roi-multiple">12.5x</div>
              </div>
              <div className="roi-item">
                <div className="roi-fdv">$300M FDV</div>
                <div className="roi-value">$25,000</div>
                <div className="roi-multiple">25x</div>
              </div>
              <div className="roi-item">
                <div className="roi-fdv">$500M FDV</div>
                <div className="roi-value">$41,666</div>
                <div className="roi-multiple">42x</div>
              </div>
            </div>
          </div>

          {!isConnected ? (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button className="popup-cta" onClick={openConnectModal}>
                  <span>Connect Wallet</span>
                  <span>→</span>
                </button>
              )}
            </ConnectButton.Custom>
          ) : (
            <button
              className="popup-cta"
              onClick={handleTransfer}
              disabled={isPending || isConfirming}
            >
              {isPending || isConfirming ? (
                <span>Processing...</span>
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
            <a href={`https://basescan.org/address/${TREASURY_WALLET}`} target="_blank" rel="noopener noreferrer">
              {TREASURY_WALLET.slice(0, 6)}...{TREASURY_WALLET.slice(-4)}
            </a>
            <span>|</span>
            <a href={`https://basescan.org/address/${TREASURY_WALLET}`} target="_blank" rel="noopener noreferrer">
              View on Basescan
            </a>
          </div>

          <p className="popup-note">
            Tokens distributed at TGE. Read <a href="/docs" target="_blank">docs</a> to learn more about <a href="/docs" target="_blank">product</a> & <a href="/docs" target="_blank">tokenomics</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
