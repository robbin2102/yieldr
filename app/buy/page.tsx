'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import './buy.css';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { usePayment } from '@/app/context/PaymentContext';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';
import { useUSDCBalance } from '@/hooks/useUSDCBalance';

// ── Constants ──────────────────────────────────────────────────────────────
type VaultId = 'geo' | 'nba' | 'soccer';
const TOTAL_SUPPLY  = 210_000_000;
const CURRENT_FDV   = 12_000_000;
const TGE_FDV       = 75_000_000;
const TOKENS_PER_USD = TOTAL_SUPPLY / CURRENT_FDV; // 17.5

const VAULT_OPTS: { id: VaultId; icon: string; name: string; roi: string }[] = [
  { id: 'geo',    icon: '🌐', name: 'Geopolitics', roi: '' },
  { id: 'nba',    icon: '🏀', name: 'NBA Edge',     roi: '' },
  { id: 'soccer', icon: '⚽', name: 'Soccer Alpha',  roi: '' },
];

const PRESET_AMOUNTS = [100, 500, 1000, 5000];
const MIN_AMOUNT = 100;

// ── Helpers ────────────────────────────────────────────────────────────────
function calcSplit(amount: number) {
  const half       = amount / 2;
  const tokens     = Math.round(half * TOKENS_PER_USD);
  const tgeValue   = Math.round(half * (TGE_FDV / CURRENT_FDV));
  return { half, tokens, tgeValue };
}

function fmtNum(n: number) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// ── Component ──────────────────────────────────────────────────────────────
export default function BuyPage() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { setContributionAmount, status, setStatus } = usePayment();
  const { initiatePayment, isProcessing, txHash } = usePaymentFlow();
  const { balance } = useUSDCBalance();

  const [selectedVault, setSelectedVault] = useState<VaultId | null>(null);
  const [amount, setAmount]               = useState(1000);
  const [customInput, setCustomInput]     = useState('1,000');
  const [activePreset, setActivePreset]   = useState<number | null>(1000);
  const [spotsLeft, setSpotsLeft]         = useState<number | null>(null);
  const [countdown, setCountdown]         = useState('');
  const [deadline, setDeadline]           = useState<Date>(() => {
    const d = new Date(); d.setDate(d.getDate() + 14); return d;
  });
  const [vaultRois, setVaultRois]         = useState<Partial<Record<VaultId, string>>>({});
  const [bestRoi, setBestRoi]             = useState<string | null>(null);

  // ── Fetch live stats ─────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/site-config').then(r => r.json()).then(({ data }) => {
      if (!data) return;
      setSpotsLeft(data.spots_remaining ?? null);
      if (data.deadline) setDeadline(new Date(data.deadline));
    }).catch(() => {});

    fetch('/api/vaults/data').then(r => r.json()).then(({ data }) => {
      if (!data) return;
      const rois: Partial<Record<VaultId, string>> = {};
      let best = -Infinity;
      for (const id of ['geo','nba','soccer'] as VaultId[]) {
        const roi = data[id]?.stats?.roi30d;
        if (typeof roi === 'number') {
          rois[id] = `+${roi.toFixed(1)}%`;
          if (roi > best) { best = roi; setBestRoi(`+${roi.toFixed(1)}%`); }
        }
      }
      setVaultRois(rois);
    }).catch(() => {});
  }, []);

  // ── Countdown ─────────────────────────────────────────────────────────────
  useEffect(() => {
    function tick() {
      const diff = deadline.getTime() - Date.now();
      if (diff <= 0) { setCountdown('Closed'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      setCountdown(`${d} days ${h}h`);
    }
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, [deadline]);

  // ── Sync amount to PaymentContext ────────────────────────────────────────
  useEffect(() => {
    setContributionAmount(amount);
  }, [amount, setContributionAmount]);

  // ── Amount handlers ───────────────────────────────────────────────────────
  function pickPreset(val: number) {
    setAmount(val);
    setCustomInput(val.toLocaleString());
    setActivePreset(val);
  }

  function handleCustomInput(raw: string) {
    setCustomInput(raw);
    setActivePreset(null);
    const n = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (!isNaN(n) && n > 0) setAmount(n);
  }

  // ── Payment handler ───────────────────────────────────────────────────────
  const handleBuy = useCallback(async () => {
    if (!selectedVault) return;
    if (amount < MIN_AMOUNT) { setStatus('error'); return; }
    setContributionAmount(amount);
    await initiatePayment();
  }, [selectedVault, amount, setContributionAmount, initiatePayment, setStatus]);

  const { half, tokens, tgeValue } = calcSplit(amount);

  const btnLabel = () => {
    if (!selectedVault) return 'Select a vault above to continue';
    if (isProcessing)   return 'Processing…';
    if (!isConnected)   return `Connect Wallet & Buy — ${VAULT_OPTS.find(v => v.id === selectedVault)?.name} Vault ↗`;
    return `Deposit $${fmtNum(amount)} USDC — ${VAULT_OPTS.find(v => v.id === selectedVault)?.name} Vault ↗`;
  };

  const btnDisabled = !selectedVault || isProcessing || amount < MIN_AMOUNT;

  return (
    <div className="bp-root">
      <div className="bp-grid" />

      {/* Nav */}
      <nav className="bp-nav">
        <div className="bp-nav-l">
          <svg width="20" height="24" viewBox="0 0 100 120">
            <path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#00E87B"/>
            <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3"/>
            <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9"/>
          </svg>
          <span className="bp-nav-brand">YIELDR</span>
        </div>
        <Link href="/vaults" className="bp-nav-back">← Back to Vaults</Link>
      </nav>

      <main className="bp-main">
        <div className="bp-container">

          {/* Head */}
          <div className="bp-head">
            <h1>Early Access — YLDR</h1>
            <p>Choose your vault, deposit USDC. Half starts earning 4.5% APY today and migrates to your chosen agent vault at Q3 2026 launch. Half is your YLDR token allocation at the lowest valuation.</p>
          </div>

          {/* Live strip */}
          <div className="bp-live-strip">
            <div className="bp-ls-item">
              <div className="bp-ls-v">{bestRoi ?? '—'}</div>
              <div className="bp-ls-l">Best Vault 30D</div>
            </div>
            <div className="bp-ls-item">
              <div className="bp-ls-v">$12M</div>
              <div className="bp-ls-l">Current FDV</div>
            </div>
            <div className="bp-ls-item">
              <div className="bp-ls-v">842</div>
              <div className="bp-ls-l">Subscribers</div>
            </div>
            <div className="bp-ls-item">
              <div className="bp-ls-v">{spotsLeft ?? '—'}</div>
              <div className="bp-ls-l">Spots Left</div>
            </div>
          </div>

          {/* Urgency */}
          <div className="bp-urgency">
            ⏳ Early access closes in <strong>{countdown || '—'}</strong> — Next round at <strong>$25M FDV</strong>
          </div>

          {/* Status messages */}
          {status === 'processing' && (
            <div className="bp-status processing">⏳ Transaction in progress — do not close this page…</div>
          )}
          {status === 'success' && txHash && (
            <div className="bp-status success">
              ✓ Payment confirmed!{' '}
              <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                View on Basescan ↗
              </a>
            </div>
          )}
          {status === 'error' && (
            <div className="bp-status error">
              {amount < MIN_AMOUNT
                ? `Minimum contribution is $${MIN_AMOUNT} USDC`
                : balance < amount
                ? `Insufficient USDC balance (have $${balance.toFixed(2)})`
                : 'Transaction failed — please try again'}
            </div>
          )}

          {/* Buy box */}
          <div className="bp-box">

            {/* Step 1: Vault */}
            <div className="bp-section-label">Step 1 — Choose your vault for Q3 launch</div>
            <div className="bp-vault-grid">
              {VAULT_OPTS.map(v => (
                <div
                  key={v.id}
                  className={`bp-vault-opt${selectedVault === v.id ? ' selected' : ''}`}
                  onClick={() => setSelectedVault(v.id)}
                >
                  <span className="bp-vault-check">✓</span>
                  <span className="bp-vault-icon">{v.icon}</span>
                  <span className="bp-vault-name">{v.name}</span>
                  <span className="bp-vault-roi">{vaultRois[v.id] ?? '—'} 30D</span>
                </div>
              ))}
            </div>
            <div className="bp-vault-note">
              Your USDC earns 4.5% APY in a Base vault today. At Q3 2026 launch, it migrates to this agent trading vault.
            </div>

            {/* Step 2: Amount */}
            <div className="bp-section-label">Step 2 — Select amount (USDC)</div>
            <div className="bp-amount-section">
              <div className="bp-amount-row">
                {PRESET_AMOUNTS.map(p => (
                  <button
                    key={p}
                    className={`bp-amount-btn${activePreset === p ? ' active' : ''}`}
                    onClick={() => pickPreset(p)}
                  >
                    ${p.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="text"
                className="bp-amount-input"
                placeholder="Or enter custom amount…"
                value={customInput}
                onChange={e => handleCustomInput(e.target.value)}
              />
            </div>

            {/* Split breakdown */}
            <div className="bp-split">
              <div className="bp-split-title">Your Allocation</div>
              <div className="bp-split-row">
                <span className="bp-split-lbl">
                  💰 USDC Vault (4.5% APY now)
                  <span className="bp-split-sub">Migrates to agent vault Q3 2026</span>
                </span>
                <span className="bp-split-val">${fmtNum(half)}</span>
              </div>
              <div className="bp-split-row">
                <span className="bp-split-lbl">
                  🪙 YLDR Token @ $12M FDV
                  <span className="bp-split-sub">12-month linear vest from TGE</span>
                </span>
                <span className="bp-split-val">${fmtNum(half)}</span>
              </div>
              <div className="bp-split-row">
                <span className="bp-split-lbl">📊 YLDR Tokens Received</span>
                <span className="bp-split-val white">{fmtNum(tokens)}</span>
              </div>
              <div className="bp-split-row">
                <span className="bp-split-lbl">💎 Projected value at $75M TGE FDV</span>
                <span className="bp-split-val">${fmtNum(tgeValue)}</span>
              </div>
            </div>

            {/* Earning callout */}
            <div className="bp-earning">
              <div className="bp-earning-big">Your USDC starts earning 4.5% APY immediately</div>
              <div className="bp-earning-small">No lock-up on USDC portion • Withdraw anytime before vault migration</div>
            </div>

            {/* CTA */}
            <button className="bp-btn" disabled={btnDisabled} onClick={handleBuy}>
              {btnLabel()}
            </button>
            <div className="bp-fine">
              Min $100 USDC on Base • USDC vault: withdraw anytime • YLDR: 12-month vest from TGE Q1 2027 • Performance data from live testing, not guaranteed
            </div>
          </div>

          {/* Trust */}
          <div className="bp-trust">
            <div className="bp-trust-grid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="bp-trust-item"><img src="https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760730551690x161831425309488800/_base-square%20%282%29.svg" alt="Base" /> Batches 002 Winner</div>
              <div className="bp-trust-item">🔒 Multisig Treasury</div>
              <div className="bp-trust-item">🔗 Onchain Verifiable</div>
              <div className="bp-trust-item">📖 Build-in-Public</div>
            </div>
          </div>

          {/* Social proof */}
          <div className="bp-social">
            <div className="bp-social-avatars">
              {['🐋','🦊','🐸','🦉','🐺'].map((e, i) => (
                <div key={i} className="bp-avatar">{e}</div>
              ))}
              <div className="bp-avatar special">+837</div>
            </div>
            <div className="bp-social-txt"><strong>842 subscribers</strong> already in.</div>
          </div>

        </div>
      </main>
    </div>
  );
}
