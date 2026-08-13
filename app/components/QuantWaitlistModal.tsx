'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

interface QuantWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuantWaitlistModal({ isOpen, onClose }: QuantWaitlistModalProps) {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [status, setStatus] = useState<'idle' | 'joining' | 'joined' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMsg('');
      setAlreadyJoined(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleJoin = async () => {
    if (!address) return;
    setStatus('joining');
    setErrorMsg('');
    try {
      const res = await fetch('/api/quant-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: address }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Something went wrong');
      }
      setAlreadyJoined(Boolean(data.alreadyJoined));
      setStatus('joined');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  const truncated = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div className="hp-wl-overlay" onClick={onClose}>
      <div className="hp-wl-modal" onClick={(e) => e.stopPropagation()}>
        <button className="hp-wl-close" onClick={onClose} aria-label="Close">×</button>

        {status !== 'joined' && (
          <>
            <span className="hp-wl-tag">Quant Agent · Launching Soon</span>
            <h3 className="hp-wl-title">Join the Quant Waitlist</h3>
            <p className="hp-wl-sub">
              The Quant Agent isn&apos;t live yet — connect a read-only wallet to reserve your spot.
              We&apos;ll notify you the moment it goes live.
            </p>

            {!isConnected ? (
              <button className="hp-wl-btn" onClick={openConnectModal}>Connect Wallet →</button>
            ) : (
              <>
                <div className="hp-wl-wallet">
                  <span className="hp-wl-dot" />
                  {truncated}
                </div>
                <button className="hp-wl-btn" onClick={handleJoin} disabled={status === 'joining'}>
                  {status === 'joining' ? 'Joining...' : 'Join Quant Waitlist →'}
                </button>
                {status === 'error' && <div className="hp-wl-error">{errorMsg}</div>}
              </>
            )}
            <div className="hp-wl-note">Read-only wallet scan · nothing custodied, nothing traded on your behalf</div>
          </>
        )}

        {status === 'joined' && (
          <div className="hp-wl-success">
            <div className="hp-wl-check">✓</div>
            <h3 className="hp-wl-title">{alreadyJoined ? "You're already in" : "You're on the list"}</h3>
            <p className="hp-wl-sub">
              {alreadyJoined
                ? `${truncated} is already on the Quant Agent waitlist.`
                : `${truncated} has been added to the Quant Agent waitlist. We'll reach out when it's live.`}
            </p>
            <button className="hp-wl-btn hp-wl-btn-s" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
