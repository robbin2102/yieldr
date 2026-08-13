'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

interface WalletWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiPath: string;
  extraBody?: Record<string, unknown>;
  tag: string;
  title: string;
  subtitle: string;
  joinLabel: string;
  entityLabel: string;
}

export function WalletWaitlistModal({
  isOpen,
  onClose,
  apiPath,
  extraBody,
  tag,
  title,
  subtitle,
  joinLabel,
  entityLabel,
}: WalletWaitlistModalProps) {
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
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: address, ...extraBody }),
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
            <span className="hp-wl-tag">{tag}</span>
            <h3 className="hp-wl-title">{title}</h3>
            <p className="hp-wl-sub">{subtitle}</p>

            {!isConnected ? (
              <button className="hp-wl-btn" onClick={openConnectModal}>Connect Wallet →</button>
            ) : (
              <>
                <div className="hp-wl-wallet">
                  <span className="hp-wl-dot" />
                  {truncated}
                </div>
                <button className="hp-wl-btn" onClick={handleJoin} disabled={status === 'joining'}>
                  {status === 'joining' ? 'Joining...' : joinLabel}
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
                ? `${truncated} is already on the ${entityLabel}.`
                : `${truncated} has been added to the ${entityLabel}. We'll reach out when it's live.`}
            </p>
            <button className="hp-wl-btn hp-wl-btn-s" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
