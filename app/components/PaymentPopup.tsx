'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { parseUnits, type Address } from 'viem';
import { TREASURY_WALLET, USDC_TOKEN_ADDRESS } from '@/lib/types/contribution';

// ERC20 ABI for approve and transfer
const USDC_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
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

export function PaymentPopup({ isOpen, onClose }: PaymentPopupProps) {
  const { address, isConnected } = useAccount();
  const [usdcAmount, setUsdcAmount] = useState('1000');
  const [currentTier, setCurrentTier] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'approve' | 'transfer' | 'success'>('input');
  const [error, setError] = useState('');

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  // Fetch current tier
  useEffect(() => {
    async function fetchTier() {
      try {
        const res = await fetch('/api/tiers');
        const data = await res.json();
        if (data.success) {
          setCurrentTier(data.currentTier);
        }
      } catch (err) {
        console.error('Error fetching tier:', err);
      }
    }
    if (isOpen) {
      fetchTier();
    }
  }, [isOpen]);

  // Calculate YLDR allocation
  const yldrAmount = currentTier
    ? (parseFloat(usdcAmount) || 0) / currentTier.pricePerToken
    : 0;

  // Handle transaction success
  useEffect(() => {
    if (isSuccess && hash && step === 'transfer') {
      // Record contribution in database
      recordContribution(hash);
    }
  }, [isSuccess, hash, step]);

  const recordContribution = async (txHash: string) => {
    try {
      const res = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          usdcAmount: parseFloat(usdcAmount),
          txHash,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep('success');
      } else {
        setError(data.error || 'Failed to record contribution');
      }
    } catch (err) {
      setError('Failed to record contribution');
    }
  };

  const handleTransfer = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet');
      return;
    }

    if (!usdcAmount || parseFloat(usdcAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const amount = parseUnits(usdcAmount, 6); // USDC has 6 decimals

      setStep('transfer');
      writeContract({
        address: USDC_TOKEN_ADDRESS as Address,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [TREASURY_WALLET as Address, amount],
      });
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('input');
    setError('');
    setUsdcAmount('1000');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#111111] p-4 border-b border-[#1A1A1A] flex items-center justify-between sticky top-0">
          <h2 className="text-lg font-bold">Get Early Access to YLDR</h2>
          <button
            onClick={handleClose}
            className="w-8 h-8 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg hover:border-[#FF4757] hover:text-[#FF4757] transition-all flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {step === 'success' ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2">Success!</h3>
              <p className="text-[#A0A0A0] mb-4">
                You've successfully allocated {yldrAmount.toFixed(2)} YLDR tokens!
              </p>
              <p className="text-sm text-[#666666] mb-6">
                Tokens will be distributed at TGE (Q1 2027)
              </p>
              <button
                onClick={handleClose}
                className="w-full py-3 bg-[#00C805] text-black font-bold rounded-lg hover:bg-[#00E006] transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Current Tier Info */}
              {currentTier && (
                <div className="bg-[#111111] border border-[#1A1A1A] rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#00C805] text-black text-xs font-bold px-2 py-1 rounded">
                        {currentTier.name.toUpperCase()}
                      </span>
                      <span className="text-sm text-[#A0A0A0]">
                        FDV: ${(currentTier.fdv / 1000000).toFixed(0)}M
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg font-bold">
                        ${currentTier.pricePerToken.toFixed(3)} / YLDR
                      </div>
                      <div className="text-xs text-[#00C805]">
                        {((150000000 / currentTier.fdv) * currentTier.pricePerToken).toFixed(0)}x potential at TGE
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div className="mb-4">
                <label className="text-sm text-[#A0A0A0] mb-2 block">
                  Contribute USDC
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={usdcAmount}
                    onChange={(e) => setUsdcAmount(e.target.value)}
                    placeholder="$ 1,000"
                    className="flex-1 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg px-4 py-3 font-mono text-lg focus:outline-none focus:border-[#00C805] transition-all"
                    disabled={loading || isConfirming}
                  />
                  <button className="bg-[#0A0A0A] border border-[#252525] rounded-lg px-4 text-[#00C805] text-sm font-semibold hover:bg-[rgba(0,200,5,0.15)] transition-all">
                    MAX
                  </button>
                </div>
              </div>

              {/* Receive Preview */}
              <div className="bg-[#0A0A0A] rounded-lg p-3 text-center mb-4">
                <div className="text-xs text-[#666666]">You'll receive</div>
                <div className="font-mono text-2xl font-bold text-[#00C805]">
                  ~{yldrAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} YLDR
                </div>
                <div className="text-xs text-[#666666]">at TGE (Q1 2027)</div>
              </div>

              {/* YLDR Utility */}
              <div className="mb-4">
                <div className="text-xs text-[#666666] uppercase tracking-wider mb-3">
                  What YLDR is used for
                </div>
                <div className="space-y-2">
                  {[
                    { icon: '⚡', title: 'AI Compute Credits', desc: 'Burned when using AI agents' },
                    { icon: '🔓', title: 'Beta Access', desc: 'Early product access pre-TGE' },
                    { icon: '💬', title: 'Exclusive Community', desc: 'Private Discord access' },
                    { icon: '🗳️', title: 'Governance Rights', desc: 'Snapshot voting power' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-2 p-2 bg-[#111111] border border-[#1A1A1A] rounded-lg"
                    >
                      <div className="text-xl">{item.icon}</div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{item.title}</div>
                        <div className="text-xs text-[#666666]">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROI Scenarios */}
              <div className="mb-6">
                <div className="text-xs text-[#666666] uppercase tracking-wider mb-2">
                  ROI Scenarios at TGE
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { fdv: '$150M', value: '$12,500', multiple: '12.5x' },
                    { fdv: '$300M', value: '$25,000', multiple: '25x' },
                    { fdv: '$500M', value: '$41,666', multiple: '42x' },
                  ].map((scenario, i) => (
                    <div
                      key={i}
                      className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-2 text-center"
                    >
                      <div className="text-xs text-[#666666] mb-1">{scenario.fdv}</div>
                      <div className="font-mono text-sm font-bold">{scenario.value}</div>
                      <div className="text-xs text-[#00C805] font-semibold">
                        {scenario.multiple}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-[rgba(255,71,87,0.1)] border border-[rgba(255,71,87,0.3)] rounded-lg text-[#FF4757] text-sm">
                  {error}
                </div>
              )}

              {/* Connect Wallet or Transfer Button */}
              {!isConnected ? (
                <div className="mb-4">
                  <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                      <button
                        onClick={openConnectModal}
                        className="w-full py-3 bg-[#00C805] text-black font-bold rounded-lg hover:bg-[#00E006] transition-all flex items-center justify-center gap-2"
                      >
                        <span>Connect Wallet</span>
                        <span>→</span>
                      </button>
                    )}
                  </ConnectButton.Custom>
                </div>
              ) : (
                <button
                  onClick={handleTransfer}
                  disabled={loading || isConfirming || isPending}
                  className="w-full py-3 bg-[#00C805] text-black font-bold rounded-lg hover:bg-[#00E006] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {loading || isConfirming || isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Transfer USDC</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              )}

              {/* Treasury Info */}
              <div className="flex items-center justify-center gap-2 text-xs text-[#666666] mb-4">
                <span>Treasury:</span>
                <a
                  href={`https://basescan.org/address/${TREASURY_WALLET}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00C805] hover:underline"
                >
                  {TREASURY_WALLET.slice(0, 6)}...{TREASURY_WALLET.slice(-4)}
                </a>
              </div>

              {/* Note */}
              <p className="text-center text-xs text-[#666666] leading-relaxed">
                Tokens distributed at TGE. Read{' '}
                <a href="/docs" className="text-[#00C805] underline">
                  docs
                </a>{' '}
                to learn more.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
