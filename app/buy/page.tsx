'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './buy.css';
import { useAccount, useChainId, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { usePayment } from '@/app/context/PaymentContext';
import { usePaymentFlow } from '@/hooks/usePaymentFlow';
import { SUPPORTED_CHAINS, getExplorerUrl, type TokenId, TREASURY_ADDRESS } from '@/config/payment';
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
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { setContributionAmount, setSelectedVault: setCtxVault, status, setStatus, allocationData, setAllocationData } = usePayment();

  const [selectedVault, setSelectedVault] = useState<VaultId | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenId>('USDC');
  const [amount, setAmount]               = useState(1000);
  const [customInput, setCustomInput]     = useState('1,000');
  const [activePreset, setActivePreset]   = useState<number | null>(1000);
  const [spotsLeft, setSpotsLeft]         = useState<number | null>(null);
  const [totalPnl, setTotalPnl]           = useState<string | null>(null);
  const [combinedRoi, setCombinedRoi]     = useState<string | null>(null);
  const [countdown, setCountdown]         = useState<number | null>(null);
  const [redirectFailed, setRedirectFailed] = useState(false);
  const [mobileStep, setMobileStep]         = useState<'pay' | 'confirm'>('pay');
  const [mobileNetwork, setMobileNetwork]   = useState<number>(8453);
  const [mobileToken, setMobileToken]       = useState<TokenId>('USDC');
  const [mobileWalletAddr, setMobileWalletAddr] = useState('');
  const [mobileTxInput, setMobileTxInput]   = useState('');
  const [mobileSubmitting, setMobileSubmitting] = useState(false);
  const [mobileSuccess, setMobileSuccess]   = useState<string | null>(null);
  const [mobileCopied, setMobileCopied]     = useState(false);

  const { initiatePayment, isProcessing, txHash, balance, chainName, isSupported, otherBalances, scanDone } = usePaymentFlow(selectedToken);

  // ── Mobile payment ───────────────────────────────────────────────────────
  const mobileChainCfg = SUPPORTED_CHAINS[mobileNetwork];
  const mobileTokenOpts = mobileChainCfg ? Object.keys(mobileChainCfg.tokens) as TokenId[] : ['USDC' as TokenId];

  // Sync token when network changes and token unavailable
  useEffect(() => {
    if (mobileChainCfg && !(mobileChainCfg.tokens as Record<string, unknown>)[mobileToken]) {
      setMobileToken(Object.keys(mobileChainCfg.tokens)[0] as TokenId);
    }
  }, [mobileNetwork]);

  const mobileTxHash = /^0x[a-fA-F0-9]{64}$/.test(mobileTxInput)
    ? mobileTxInput as `0x${string}`
    : undefined;

  // Reuse wagmi receipt listener for externally-initiated mobile tx
  useWaitForTransactionReceipt({
    hash: mobileTxHash,
    chainId: mobileNetwork,
    query: { enabled: !!mobileTxHash },
  });

  const truncAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  const mobileCanPay = !!selectedVault && amount >= MIN_AMOUNT;

  function getMobileLinks(amountUsd: number, chainId: number, token: TokenId) {
    const chainCfg = SUPPORTED_CHAINS[chainId];
    const tokenCfg = chainCfg?.tokens[token];
    if (!tokenCfg) return null;
    const decimals = tokenCfg.decimals;
    const wei = BigInt(Math.round(amountUsd * Math.pow(10, decimals))).toString();
    const tokenAddr = tokenCfg.address;
    // EIP-681 URI — handled natively by MetaMask, Phantom, Trust, Coinbase
    const eip681 = `ethereum:${tokenAddr}@${chainId}/transfer?address=${TREASURY_ADDRESS}&uint256=${wei}`;
    return {
      metamask: `https://metamask.app.link/send/${tokenAddr}@${chainId}/transfer?address=${TREASURY_ADDRESS}&uint256=${wei}`,
      phantom:  eip681,   // Phantom EVM supports ethereum: URI scheme
      trust:    eip681,   // Trust Wallet handles ethereum: URIs natively
      coinbase: eip681,   // Coinbase Wallet handles ethereum: URIs — NOT go.cb-w.com wrapper
      eip681,
    };
  }

  const mobileLinks = mobileCanPay ? getMobileLinks(amount, mobileNetwork, mobileToken) : null;
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
    if (status === 'success' && (txHash || mobileSuccess) && countdown === null) {
      setCountdown(5);
      setRedirectFailed(false);
    }
  }, [status, txHash, mobileSuccess]);

  useEffect(() => {
    if (countdown === null || countdown < 0) return;
    if (countdown === 0) {
      try { router.push('/allocations'); }
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
      if (!data?._global) return;
      const pnl = data._global.totalPnl;
      const roi = data._global.combinedRoi;
      if (typeof pnl === 'number') setTotalPnl((pnl >= 0 ? '+$' : '-$') + Math.abs(pnl).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
      if (typeof roi === 'number') setCombinedRoi((roi >= 0 ? '+' : '') + roi.toFixed(1) + '%');
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

  const handleMobileSubmit = useCallback(async () => {
    const walletAddr = mobileWalletAddr.trim() || (isConnected ? address : '');
    if (!walletAddr || !mobileTxHash || !selectedVault) return;
    setMobileSubmitting(true);
    const networkName = SUPPORTED_CHAINS[mobileNetwork]?.name ?? 'Base';
    try {
      const resp = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: walletAddr,
          usdc_amount: amount,
          tx_hash: mobileTxInput,
          network: networkName,
          chain_id: mobileNetwork,
          token: mobileToken,
          selected_vault: selectedVault,
        }),
      });
      const data = await resp.json();
      if (data.success) {
        setContributionAmount(amount);
        setCtxVault(selectedVault);
        if (data.data) {
          setAllocationData({
            yldrAmount: data.data.yldr_allocation ?? 0,
            effectivePrice: data.data.yldr_price ?? 0,
            breakdown: data.data.breakdown ?? [],
            discord_invite: data.data.discord_invite ?? null,
          });
        }
        setMobileSuccess(mobileTxInput);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setMobileSubmitting(false);
  }, [mobileWalletAddr, isConnected, address, mobileTxHash, mobileTxInput,
      selectedVault, amount, mobileNetwork, mobileToken,
      setContributionAmount, setCtxVault, setAllocationData, setStatus]);

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
          <Link href="/vaults" className="bp-nav-back">&#8592; Back to Vaults</Link>
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
              <div className="bp-ls-v">{totalPnl ?? '—'}</div>
              <div className="bp-ls-l">All-Time PnL</div>
            </div>
            <div className="bp-ls-item">
              <div className="bp-ls-v">{combinedRoi ?? '—'}</div>
              <div className="bp-ls-l">All-Time ROI</div>
            </div>
            <div className="bp-ls-item">
              <div className="bp-ls-v">$9M</div>
              <div className="bp-ls-l">Current FDV</div>
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

            {/* Desktop CTA — hidden on mobile via CSS */}
            <div className="bp-desktop-cta-wrap">
              <button className="bp-btn" disabled={btnDisabled} onClick={handleBuy}>
                {btnLabel()}
              </button>
              <div className="bp-fine">
                Accepts USDC &amp; USDT on Base, Ethereum, Polygon, BNB Chain &bull; Min $1 &bull; YLDR: 12-month vest from TGE Q1 2027
              </div>
            </div>

            {/* Mobile payment section — hidden on desktop via CSS */}
            <div className="bp-mobile-pay">
              {mobileStep === 'pay' ? (
                <>
                  {/* Network + token picker */}
                  <div className="bp-section-label" style={{marginTop: '.25rem'}}>Step 3 — Network &amp; token</div>
                  <div className="bp-mob-network">
                    {Object.entries(SUPPORTED_CHAINS).map(([id, cfg]) => (
                      <button
                        key={id}
                        className={`bp-mob-net-btn${mobileNetwork === Number(id) ? ' active' : ''}`}
                        onClick={() => setMobileNetwork(Number(id))}
                      >{cfg.name}</button>
                    ))}
                  </div>
                  {mobileTokenOpts.length > 1 && (
                    <div className="bp-mob-token-row">
                      {mobileTokenOpts.map(t => (
                        <button
                          key={t}
                          className={`bp-mob-tok-btn${mobileToken === t ? ' active' : ''}`}
                          onClick={() => setMobileToken(t)}
                        >{t}</button>
                      ))}
                    </div>
                  )}

                  {/* Wallet buttons */}
                  <div className="bp-section-label" style={{marginTop: '1rem'}}>Step 4 — Pay with your wallet</div>
                  {!mobileCanPay && <div className="bp-mobile-prereq">Select a vault and amount above first</div>}
                  <div className="bp-wallet-btns">
                    {/* MetaMask */}
                    <a className={`bp-wallet-btn${!mobileLinks ? ' bp-wallet-btn-disabled' : ''}`}
                       href={mobileLinks?.metamask ?? undefined} rel="noopener noreferrer">
                      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" style={{flexShrink:0}}>
                        <rect width="32" height="32" rx="6" fill="#F6851B"/>
                        <path d="M24 6L17 11.5L18.5 8.5L24 6Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.3"/>
                        <path d="M8 6L15 11.5L13.5 8.5L8 6Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.3"/>
                        <path d="M21.5 20.5L19.5 23L23 24L24 20.5Z" fill="#E4761B"/>
                        <path d="M8 20.5L9 24L12.5 23L10.5 20.5Z" fill="#E4761B"/>
                        <path d="M12.3 14.2L11 16L14.5 16.2L14.3 12L12.3 14.2Z" fill="#F6851B"/>
                        <path d="M19.7 14.2L17.7 12L17.5 16.2L21 16L19.7 14.2Z" fill="#F6851B"/>
                        <path d="M12.5 23L14.5 22L12.7 20.5Z" fill="#E4761B"/>
                        <path d="M17.5 22L19.5 23L19.3 20.5Z" fill="#E4761B"/>
                        <ellipse cx="13" cy="16" rx="2" ry="2.2" fill="white" opacity="0.9"/>
                        <ellipse cx="19" cy="16" rx="2" ry="2.2" fill="white" opacity="0.9"/>
                        <circle cx="13" cy="16" r="1.1" fill="#D57E3A"/>
                        <circle cx="19" cy="16" r="1.1" fill="#D57E3A"/>
                      </svg>
                      <span>MetaMask</span>
                    </a>
                    {/* Phantom */}
                    <a className={`bp-wallet-btn${!mobileLinks ? ' bp-wallet-btn-disabled' : ''}`}
                       href={mobileLinks?.phantom ?? undefined} rel="noopener noreferrer">
                      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" style={{flexShrink:0}}>
                        <defs>
                          <linearGradient id="pg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#534BB1"/>
                            <stop offset="1" stopColor="#551BF9"/>
                          </linearGradient>
                        </defs>
                        <rect width="32" height="32" rx="6" fill="url(#pg)"/>
                        <path d="M7 19.5C7 13.7 11.1 9 16 9C20.9 9 25 13.7 25 19.5V25.5L22 23.8L19.5 25.5L17 23.8L14.5 25.5L12 23.8L9 25.5V19.5Z" fill="white"/>
                        <circle cx="13" cy="18.5" r="2" fill="#534BB1"/>
                        <circle cx="19" cy="18.5" r="2" fill="#534BB1"/>
                      </svg>
                      <span>Phantom</span>
                    </a>
                    {/* Trust Wallet */}
                    <a className={`bp-wallet-btn${!mobileLinks ? ' bp-wallet-btn-disabled' : ''}`}
                       href={mobileLinks?.trust ?? undefined} rel="noopener noreferrer">
                      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" style={{flexShrink:0}}>
                        <rect width="32" height="32" rx="6" fill="#3375BB"/>
                        <path d="M16 6L24 9.5V17C24 22 20.5 26 16 27C11.5 26 8 22 8 17V9.5L16 6Z" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M12 17L15 20L21 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Trust Wallet</span>
                    </a>
                    {/* Coinbase Wallet */}
                    <a className={`bp-wallet-btn${!mobileLinks ? ' bp-wallet-btn-disabled' : ''}`}
                       href={mobileLinks?.coinbase ?? undefined} rel="noopener noreferrer">
                      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" style={{flexShrink:0}}>
                        <circle cx="16" cy="16" r="16" fill="#0052FF"/>
                        <circle cx="16" cy="16" r="9" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                        <path d="M20 12.5C18.2 10.2 13 10 11 13.5C9.5 16 10 20 13 22.5C15.5 24.5 20 23.5 22 20.5" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                      </svg>
                      <span>Coinbase Wallet</span>
                    </a>
                    {/* Copy EIP-681 link */}
                    {mobileLinks && (
                      <button className="bp-wallet-copy" onClick={() => {
                        navigator.clipboard.writeText(mobileLinks.eip681).then(() => {
                          setMobileCopied(true);
                          setTimeout(() => setMobileCopied(false), 2500);
                        });
                      }}>
                        {mobileCopied ? '✓ Copied!' : '⧉ Copy payment link — any other wallet'}
                      </button>
                    )}
                  </div>
                  <button className="bp-mobile-paid-btn" onClick={() => setMobileStep('confirm')}>
                    ✓ Payment sent — Confirm now →
                  </button>
                  <div className="bp-fine" style={{marginTop: '.5rem'}}>
                    Sending {mobileToken} on {mobileChainCfg?.name ?? 'Base'} · Min $1 · YLDR vests 12 months from TGE Q1 2027
                  </div>
                </>
              ) : (
                <>
                  <div className="bp-section-label">Step 5 — Confirm your payment</div>
                  <div className="bp-confirm-step">

                    {/* Wallet address — manual input, no connection required */}
                    <div>
                      <div className="bp-confirm-label">Your wallet address</div>
                      <div className="bp-confirm-addr-row">
                        <input
                          type="text"
                          className="bp-confirm-input"
                          placeholder={isConnected ? `Using: ${truncAddr} — or paste different` : '0x… copy from your wallet app'}
                          value={mobileWalletAddr}
                          onChange={e => setMobileWalletAddr(e.target.value.trim())}
                        />
                        {!isConnected && (
                          <button className="bp-confirm-auto-btn" onClick={() => openConnectModal?.()}>
                            Auto-fill
                          </button>
                        )}
                        {isConnected && !mobileWalletAddr && (
                          <span className="bp-confirm-connected-badge">✓</span>
                        )}
                      </div>
                      <div className="bp-confirm-addr-hint">
                        Works with any wallet — MetaMask, Phantom, Trust, Coinbase, or any EVM wallet
                      </div>
                    </div>

                    {/* TX hash */}
                    <div>
                      <div className="bp-confirm-label">Transaction hash</div>
                      <input
                        type="text"
                        className="bp-confirm-input"
                        placeholder="0x… (66 chars — copy from wallet tx history)"
                        value={mobileTxInput}
                        onChange={e => setMobileTxInput(e.target.value.trim())}
                      />
                    </div>

                    {/* Network info */}
                    <div className="bp-confirm-net">
                      <span>{mobileChainCfg?.name ?? 'Base'} · {mobileToken}</span>
                      <button className="bp-confirm-net-change" onClick={() => setMobileStep('pay')}>Change network</button>
                    </div>

                    {!selectedVault && (
                      <div className="bp-confirm-warning">← Go back and select a vault above first</div>
                    )}

                    <button
                      className="bp-confirm-submit"
                      disabled={!(mobileWalletAddr.trim() || (isConnected && address)) || !mobileTxHash || !selectedVault || mobileSubmitting}
                      onClick={handleMobileSubmit}
                    >
                      {mobileSubmitting ? 'Confirming…' : 'Confirm Payment →'}
                    </button>
                    <button className="bp-mobile-back" onClick={() => setMobileStep('pay')}>← Back</button>
                  </div>
                </>
              )}
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
          </div>

        </div>
      </main>

      {/* ── Success Modal ── */}
      {status === 'success' && (txHash || mobileSuccess) && (() => {
        const activeTx        = txHash || mobileSuccess!;
        const activeNetwork   = mobileSuccess ? (SUPPORTED_CHAINS[mobileNetwork]?.name ?? 'Base') : (chainName ?? 'Base');
        const activeExplorer  = mobileSuccess ? (SUPPORTED_CHAINS[mobileNetwork]?.explorer ?? 'https://basescan.org') : explorerUrl;
        return (
          <div className="bp-modal-overlay">
            <div className="bp-modal">
              <div className="bp-modal-icon">&#10003;</div>
              <div className="bp-modal-title">Payment Confirmed!</div>
              <div className="bp-modal-sub">
                Your ${fmtNum(amount)} USDC deposit on {activeNetwork} was successful.
              </div>

              <div className="bp-modal-details">
                <div className="bp-modal-row">
                  <span>Total Deposited</span>
                  <span>${fmtNum(amount)} USDC</span>
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
                  <span>{activeNetwork}</span>
                </div>
                <div className="bp-modal-row">
                  <span>Transaction</span>
                  <span>
                    <a href={`${activeExplorer}/tx/${activeTx}`} target="_blank" rel="noopener noreferrer">
                      {activeTx.slice(0, 8)}...{activeTx.slice(-6)} &#8599;
                    </a>
                  </span>
                </div>
              </div>

              {!redirectFailed && countdown !== null && countdown > 0 ? (
                <div className="bp-modal-countdown">
                  Redirecting to your allocation in {countdown}s...
                </div>
              ) : redirectFailed || (countdown !== null && countdown <= 0) ? (
                <Link href="/allocations" className="bp-modal-cta">
                  View My Allocation &#8599;
                </Link>
              ) : null}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
