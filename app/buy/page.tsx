'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './buy.css';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { usePayment } from '@/app/context/PaymentContext';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';
import { SUPPORTED_CHAINS, getExplorerUrl, type TokenId } from '@/config/payment';
import NavLinks from '@/components/NavLinks';

// ── Constants ──────────────────────────────────────────────────────────────
type VaultId = 'geo' | 'nba' | 'soccerAlpha';
const TOTAL_SUPPLY  = 210_000_000;
const CURRENT_FDV   = 9_000_000;
const TGE_FDV       = 75_000_000;
const TOKENS_PER_USD = TOTAL_SUPPLY / CURRENT_FDV;

const VAULT_OPTS: { id: VaultId; icon: string; name: string; roi: string }[] = [
  { id: 'geo',         icon: '🌐', name: 'Geopolitics',  roi: '' },
  { id: 'nba',         icon: '🏀', name: 'NBA Edge',      roi: '' },
  { id: 'soccerAlpha', icon: '⚽', name: 'Soccer Alpha',  roi: '' },
];

const PRESET_AMOUNTS = [100, 500, 1000, 5000];
const MIN_AMOUNT = 1;

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
  const router = useRouter();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { setContributionAmount, setSelectedVault: setCtxVault, status, setStatus, allocationData } = usePayment();

  const [selectedVault, setSelectedVault] = useState<VaultId | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenId>('USDC');
  const [amount, setAmount]               = useState(1000);
  const [customInput, setCustomInput]     = useState('1,000');
  const [activePreset, setActivePreset]   = useState<number | null>(1000);
  const [spotsLeft, setSpotsLeft]         = useState<number | null>(null);
  const [vaultRois, setVaultRois]         = useState<Partial<Record<VaultId, string>>>({});
  const [bestRoi, setBestRoi]             = useState<string | null>(null);
  const [countdown, setCountdown]         = useState<number | null>(null);
  const [redirectFailed, setRedirectFailed] = useState(false);

  const { initiatePayment, isProcessing, txHash, balance, chainName, isSupported, otherBalances, scanDone } = usePaymentFlow(selectedToken);
  const chainConfig = SUPPORTED_CHAINS[chainId];
  const availableTokens = chainConfig ? Object.keys(chainConfig.tokens) as TokenId[] : [];

  // Auto-select first available token when chain changes
  useEffect(() => {
    if (availableTokens.length > 0 && !availableTokens.includes(selectedToken)) {
      setSelectedToken(availableTokens[0]);
    }
  }, [chainId]);

  // ── Countdown + redirect after successful payment ────────────────────────
  useEffect(() => {
    if (status === 'success' && txHash && countdown === null) {
      setCountdown(5);
      setRedirectFailed(false);
    }
  }, [status, txHash]);

  useEffect(() => {
    if (countdown === null || countdown < 0) return;
    if (countdown === 0) {
      try { router.push('/subscriptions'); }
      catch { setRedirectFailed(true); }
      return;
    }
    const t = setTimeout(() => setCountdown(c => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, router]);

  // ── Fetch live stats ─────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/site-config').then(r => r.json()).then(({ data }) => {
      if (!data) return;
      setSpotsLeft(data.spots_remaining ?? null);
    }).catch(() => {});

    fetch('/api/vaults/data').then(r => r.json()).then(({ data }) => {
      if (!data) return;
      const rois: Partial<Record<VaultId, string>> = {};
      let best = -Infinity;
      for (const id of ['geo','nba','soccerAlpha'] as VaultId[]) {
        const roi = data[id]?.stats?.roi30d;
        if (typeof roi === 'number') {
          rois[id] = `+${roi.toFixed(1)}%`;
          if (roi > best) { best = roi; setBestRoi(`+${roi.toFixed(1)}%`); }
        }
      }
      setVaultRois(rois);
    }).catch(() => {});
  }, []);

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

  // Find the best other-chain balance that can cover the amount
  const bestOtherChain = scanDone && balance < amount && otherBalances.length > 0
    ? otherBalances.reduce((best, ob) => ob.balance > best.balance ? ob : best, otherBalances[0])
    : null;

  // ── Payment handler ───────────────────────────────────────────────────────
  const handleBuy = useCallback(async () => {
    if (!selectedVault) return;
    if (amount < MIN_AMOUNT) { setStatus('error'); return; }
    setContributionAmount(amount);
    setCtxVault(selectedVault);

    // If insufficient balance but funds found elsewhere, switch chain/token
    if (bestOtherChain) {
      if (bestOtherChain.chainId !== chainId) {
        switchChain({ chainId: bestOtherChain.chainId });
      }
      setSelectedToken(bestOtherChain.token);
      return;
    }

    await initiatePayment();
  }, [selectedVault, amount, setContributionAmount, initiatePayment, setStatus, bestOtherChain, switchChain, setSelectedToken, chainId]);

  const { half, tokens, tgeValue } = calcSplit(amount);

  const btnLabel = () => {
    if (!selectedVault) return 'Select a vault above to continue';
    if (isProcessing)   return 'Processing…';
    if (!isConnected)   return `Connect Wallet & Pay — ${VAULT_OPTS.find(v => v.id === selectedVault)?.name} Vault ↗`;
    if (!isSupported)   return 'Switch to a supported network';
    if (bestOtherChain && bestOtherChain.chainId === chainId) return `Switch to ${bestOtherChain.token} & Pay $${fmtNum(amount)} ↗`;
    if (bestOtherChain) return `Switch to ${bestOtherChain.chainName} & Pay $${fmtNum(amount)} ${bestOtherChain.token} ↗`;
    return `Deposit $${fmtNum(amount)} ${selectedToken} on ${chainName} — ${VAULT_OPTS.find(v => v.id === selectedVault)?.name} ↗`;
  };

  const btnDisabled = !selectedVault || isProcessing || amount < MIN_AMOUNT || (isConnected && !isSupported);

  const explorerUrl = getExplorerUrl(chainId);

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
        <div className="bp-nav-r">
          <Link href="/explorer" className="bp-nav-back">&#8592; Back to Vaults</Link>
          <NavLinks showSocials={false} />
        </div>
      </nav>

      <main className="bp-main">
        <div className="bp-container">

          {/* Head */}
          <div className="bp-head">
            <h1>Early Access — YLDR</h1>
            <p>Choose your vault, deposit USDC or USDT. Half starts earning 4.5% APY today and migrates to your chosen agent vault at Q3 2026 launch. Half is your YLDR token allocation at the lowest valuation.</p>
          </div>

          {/* Live strip */}
          <div className="bp-live-strip">
            <div className="bp-ls-item">
              <div className="bp-ls-v">{bestRoi ?? '—'}</div>
              <div className="bp-ls-l">Best Vault 30D</div>
            </div>
            <div className="bp-ls-item">
              <div className="bp-ls-v">$9M</div>
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
            ⏳ Tier 1 pricing ends May 31st · Next tier is 2x FDV
          </div>

          {/* Status messages */}
          {status === 'processing' && (
            <div className="bp-status processing">⏳ Transaction in progress — do not close this page…</div>
          )}
          {status === 'error' && (
            <div className="bp-status error">
              {amount < MIN_AMOUNT
                ? `Minimum contribution is $${MIN_AMOUNT}`
                : isConnected && !isSupported
                ? 'Please switch to Base, Ethereum, Polygon, or BNB Chain'
                : balance < amount
                ? `Insufficient ${selectedToken} balance (have $${balance.toFixed(2)})${otherBalances.length > 0 ? ' — see other chains below' : ''}`
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
                  <span className="bp-vault-check">&#10003;</span>
                  <span className="bp-vault-icon">{v.icon}</span>
                  <span className="bp-vault-name">{v.name}</span>
                  <span className="bp-vault-roi">{vaultRois[v.id] ?? '—'} 30D</span>
                </div>
              ))}
            </div>
            <div className="bp-vault-note">
              Your USDC earns 4.5% APY in a Base vault today. At Q3 2026 launch, it migrates to this agent trading vault.
            </div>

            {/* Step 2: Amount + Token */}
            <div className="bp-section-label">Step 2 — Select amount</div>

            {/* Chain + Token selector */}
            {isConnected && (
              <div className="bp-chain-row">
                <div className="bp-chain-info">
                  <span className="bp-chain-dot" /> {chainName ?? 'Unknown'} {isSupported ? '' : '(unsupported)'}
                </div>
                {isSupported && availableTokens.length > 1 && (
                  <div className="bp-token-toggle">
                    {availableTokens.map(t => (
                      <button
                        key={t}
                        className={`bp-token-btn${selectedToken === t ? ' active' : ''}`}
                        onClick={() => setSelectedToken(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
                {isSupported && availableTokens.length === 1 && (
                  <div className="bp-token-single">{availableTokens[0]}</div>
                )}
                {isConnected && isSupported && (
                  <div className="bp-balance">
                    Balance: <strong>${balance.toFixed(2)}</strong> {selectedToken}
                  </div>
                )}
              </div>
            )}

            {/* Unsupported chain — switch buttons */}
            {isConnected && !isSupported && (
              <div className="bp-switch-chain">
                <div className="bp-switch-label">Switch to a supported network:</div>
                <div className="bp-switch-btns">
                  {Object.entries(SUPPORTED_CHAINS).map(([id, cfg]) => (
                    <button
                      key={id}
                      className="bp-switch-btn"
                      onClick={() => switchChain({ chainId: Number(id) })}
                    >
                      {cfg.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Funds on other chains/tokens — show when current balance is low */}
            {isConnected && isSupported && scanDone && balance < amount && otherBalances.length > 0 && (
              <div className="bp-switch-chain">
                <div className="bp-switch-label">
                  💡 You have stablecoins available:
                </div>
                <div className="bp-switch-btns">
                  {otherBalances.map((ob, i) => (
                    <button
                      key={i}
                      className="bp-switch-btn"
                      onClick={() => {
                        if (ob.chainId !== chainId) switchChain({ chainId: ob.chainId });
                        setSelectedToken(ob.token);
                      }}
                    >
                      {ob.chainId === chainId ? `${ob.token}` : ob.chainName}: ${ob.balance.toFixed(2)} {ob.token}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                  USDC Vault (4.5% APY now)
                  <span className="bp-split-sub">Migrates to agent vault Q3 2026</span>
                </span>
                <span className="bp-split-val">${fmtNum(half)}</span>
              </div>
              <div className="bp-split-row">
                <span className="bp-split-lbl">
                  YLDR Token @ $9M FDV
                  <span className="bp-split-sub">12-month linear vest from TGE</span>
                </span>
                <span className="bp-split-val">${fmtNum(half)}</span>
              </div>
              <div className="bp-split-row">
                <span className="bp-split-lbl">YLDR Tokens Received</span>
                <span className="bp-split-val white">{fmtNum(tokens)}</span>
              </div>
              <div className="bp-split-row">
                <span className="bp-split-lbl">Projected value at $75M TGE FDV</span>
                <span className="bp-split-val">${fmtNum(tgeValue)}</span>
              </div>
            </div>

            {/* Earning callout */}
            <div className="bp-earning">
              <div className="bp-earning-big">Your USDC starts earning 4.5% APY immediately</div>
              <div className="bp-earning-small">No lock-up on USDC portion &bull; Withdraw anytime before vault migration</div>
            </div>

            {/* CTA */}
            <button className="bp-btn" disabled={btnDisabled} onClick={handleBuy}>
              {btnLabel()}
            </button>
            <div className="bp-fine">
              Accepts USDC &amp; USDT on Base, Ethereum, Polygon, BNB Chain &bull; Min $1 &bull; YLDR: 12-month vest from TGE Q1 2027
            </div>
          </div>

          {/* Trust */}
          <div className="bp-trust">
            <div className="bp-trust-grid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="bp-trust-item"><img src="https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760730551690x161831425309488800/_base-square%20%282%29.svg" alt="Base" /> Batches 002 Winner</div>
              <div className="bp-trust-item">&#128274; Multisig Treasury</div>
              <div className="bp-trust-item">&#128279; Onchain Verifiable</div>
              <div className="bp-trust-item">&#128214; Build-in-Public</div>
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

      {/* ── Success Modal ── */}
      {status === 'success' && txHash && (
        <div className="bp-modal-overlay">
          <div className="bp-modal">
            <div className="bp-modal-icon">&#10003;</div>
            <div className="bp-modal-title">Payment Confirmed!</div>
            <div className="bp-modal-sub">
              Your ${fmtNum(amount)} {selectedToken} deposit on {chainName} was successful.
            </div>

            <div className="bp-modal-details">
              <div className="bp-modal-row">
                <span>Total Deposited</span>
                <span>${fmtNum(amount)} {selectedToken}</span>
              </div>
              <div className="bp-modal-divider" />
              <div className="bp-modal-row">
                <span>Stablecoin Vault (4.5% APY)</span>
                <span className="green">${fmtNum(half)}</span>
              </div>
              <div className="bp-modal-row">
                <span>YLDR Token Allocation</span>
                <span className="green">{fmtNum(allocationData?.yldrAmount ?? tokens)} YLDR</span>
              </div>
              {allocationData?.effectivePrice && (
                <div className="bp-modal-row">
                  <span>Price per YLDR</span>
                  <span>${allocationData.effectivePrice.toFixed(4)}</span>
                </div>
              )}
              <div className="bp-modal-divider" />
              <div className="bp-modal-row">
                <span>Network</span>
                <span>{chainName}</span>
              </div>
              <div className="bp-modal-row">
                <span>Transaction</span>
                <span>
                  <a href={`${explorerUrl}/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                    {txHash.slice(0, 8)}...{txHash.slice(-6)} &#8599;
                  </a>
                </span>
              </div>
            </div>

            {!redirectFailed && countdown !== null && countdown > 0 ? (
              <div className="bp-modal-countdown">
                Redirecting to your allocation in {countdown}s...
              </div>
            ) : redirectFailed || (countdown !== null && countdown <= 0) ? (
              <Link href="/subscriptions" className="bp-modal-cta">
                View My Allocation &#8599;
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
