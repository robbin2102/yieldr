'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { usePayment } from '@/app/context/PaymentContext';
import { getExplorerUrl } from '@/config/payment';
import { NAV_MARK } from '@/app/prelaunch-edge/images';
import './subscriptions.css';

interface SubscriptionRecord {
  wallet_address: string;
  plan_name: string;
  billing_cycle: 'monthly' | 'annual';
  usdc_amount: number;
  reward_min_usdc: number;
  reward_max_usdc: number;
  reward_payout_window: string;
  subscription_start: string;
  access_months: number;
  renews_automatically: boolean;
  tx_hash: string;
  chain_id: number;
  network: string;
  token: string;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Skel() {
  return <span className="sp-skel" />;
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const { address, isConnected, isReconnecting, isConnecting, status: accountStatus } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { status, hasCompletedPayment } = usePayment();

  const [hydrated, setHydrated] = useState(false);
  const [mySubs, setMySubs] = useState<SubscriptionRecord[]>([]);
  const [myLoading, setMyLoading] = useState(false);
  const [publicSubs, setPublicSubs] = useState<SubscriptionRecord[]>([]);
  const [publicLoading, setPublicLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (isConnected || accountStatus === 'disconnected') setHydrated(true);
  }, [isConnected, accountStatus]);

  // This page only exists for wallets that have completed a Genesis payment —
  // send everyone else back to where they'd reserve one.
  useEffect(() => {
    if (!hasCompletedPayment) {
      router.replace('/prelaunch-edge');
    }
  }, [hasCompletedPayment, router]);

  useEffect(() => {
    fetch('/api/subscriptions/public')
      .then(r => r.json())
      .then(d => { if (d.success) setPublicSubs(d.data.subscriptions); })
      .catch(() => {})
      .finally(() => setPublicLoading(false));
  }, []);

  useEffect(() => {
    if (!address) { setMyLoading(false); return; }
    setMyLoading(true);
    fetch(`/api/subscriptions?wallet=${address}`)
      .then(r => r.json())
      .then(d => { if (d.success) setMySubs(d.data.subscriptions); })
      .catch(() => {})
      .finally(() => setMyLoading(false));
  }, [address, status]);

  const isWalletPending = !hydrated || isReconnecting || isConnecting;
  const showData = isConnected && !isWalletPending;

  const totalPaid = mySubs.reduce((s, c) => s + c.usdc_amount, 0);
  const totalRewardMin = mySubs.reduce((s, c) => s + c.reward_min_usdc, 0);
  const totalRewardMax = mySubs.reduce((s, c) => s + c.reward_max_usdc, 0);
  const activePlans = mySubs.length;

  const totalPages = Math.ceil(publicSubs.length / ITEMS_PER_PAGE);
  const pageItems = publicSubs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Render nothing while the redirect effect above sends unpaid visitors away.
  if (!hasCompletedPayment) {
    return null;
  }

  return (
    <div className="sp-root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav className="sp-nav">
        <div className="sp-wrap sp-nav-in">
          <div className="sp-nav-id" onClick={() => router.push('/')}>
            <div className="sp-nav-mark"><img src={NAV_MARK} alt="Yieldr" /></div>
            <span className="sp-nav-name">YIELDR</span>
          </div>
          <a href="/prelaunch-edge#pe-pricing" className="sp-nav-cta">Reserve Another Plan</a>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <div className="sp-wrap sp-hero">
          <span className="sp-eyebrow"><span />Genesis Subscriber</span>
          <h1 className="sp-h1">My Subscriptions</h1>
          <p className="sp-sub">
            Your Genesis payments, reward eligibility, and Quant Terminal access — all in one place. Access starts when Terminal ships in Q1 2027.
          </p>

          {isWalletPending ? (
            <p className="sp-sub">Connecting wallet...</p>
          ) : !isConnected ? (
            <div className="sp-connect-row">
              <button className="sp-btn-connect" onClick={openConnectModal}>Connect Wallet →</button>
              <span className="sp-sub" style={{ margin: 0 }}>Connect the wallet you paid with to see your subscriptions.</span>
            </div>
          ) : (
            <p className="sp-sub sp-mono">{address?.slice(0, 6)}...{address?.slice(-4)} · {activePlans} subscription{activePlans !== 1 ? 's' : ''}</p>
          )}
        </div>

        {/* STATS */}
        <div className="sp-wrap">
          <div className="sp-stats-grid">
            <div className="sp-stat-card">
              <div className="sp-stat-v">{myLoading ? <Skel /> : showData ? `$${fmt(totalPaid, 0)}` : '—'}</div>
              <div className="sp-stat-l">Total Paid</div>
            </div>
            <div className="sp-stat-card">
              <div className="sp-stat-v win">{myLoading ? <Skel /> : showData ? `$${fmt(totalRewardMin, 0)}–$${fmt(totalRewardMax, 0)}` : '—'}</div>
              <div className="sp-stat-l">Reward Eligibility (USDC value)</div>
            </div>
            <div className="sp-stat-card">
              <div className="sp-stat-v">{myLoading ? <Skel /> : showData ? activePlans : '—'}</div>
              <div className="sp-stat-l">Active Plans</div>
            </div>
            <div className="sp-stat-card">
              <div className="sp-stat-v">Q1 2027</div>
              <div className="sp-stat-l">Terminal Access Starts</div>
            </div>
          </div>
        </div>

        {!showData || mySubs.length === 0 ? (
          <div className="sp-wrap sp-sec">
            {showData && mySubs.length === 0 && !myLoading ? (
              <div className="sp-empty">
                <div className="sp-empty-h">No subscriptions yet for this wallet</div>
                <p className="sp-empty-p">Reserve a Genesis plan on the prelaunch page to lock pricing and start earning your token reward.</p>
                <a href="/prelaunch-edge#pe-pricing" className="sp-nav-cta" style={{ marginTop: 16, display: 'inline-block' }}>Reserve Genesis Access →</a>
              </div>
            ) : null}
          </div>
        ) : (
          <>
            {/* PLAN CARDS */}
            <div className="sp-wrap sp-sec">
              <div className="sp-slbl"><span>Your Plans</span><span className="sp-ln" /></div>
              <div className="sp-plans-grid">
                {mySubs.map((s, i) => (
                  <div className="sp-plan-card" key={i}>
                    <div className="sp-plan-card-hd">
                      <span className="sp-plan-card-name">{s.plan_name}</span>
                      <span className="sp-plan-card-cycle">{s.billing_cycle}</span>
                    </div>
                    <div className="sp-plan-card-amt">${fmt(s.usdc_amount)}</div>
                    <div className="sp-plan-card-row"><span>Reward eligibility</span><b>${fmt(s.reward_min_usdc, 0)}–${fmt(s.reward_max_usdc, 0)}</b></div>
                    <div className="sp-plan-card-row"><span>Payout window</span><b>{s.reward_payout_window}</b></div>
                    <div className="sp-plan-card-row"><span>Access starts</span><b>{s.subscription_start}</b></div>
                    <div className="sp-plan-card-row">
                      <span>{s.renews_automatically ? 'Billing' : 'Access period'}</span>
                      <b>{s.renews_automatically ? `1st month, then auto-renews monthly` : `${s.access_months} months prepaid`}</b>
                    </div>
                    <div className="sp-plan-card-row"><span>Network</span><b>{s.network}</b></div>
                    <div className="sp-plan-card-tx">
                      <a href={`${getExplorerUrl(s.chain_id)}/tx/${s.tx_hash}`} target="_blank" rel="noopener noreferrer">
                        {s.tx_hash.slice(0, 8)}...{s.tx_hash.slice(-6)} ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REWARD BANNER */}
            <div className="sp-wrap sp-sec" style={{ paddingTop: 0 }}>
              <div className="sp-reward-banner">
                <div className="sp-reward-banner-grid">
                  <div>
                    <span className="sp-badge-pill">Genesis Reward</span>
                    <div className="sp-reward-h">Worst case, you get your money back. Best case, you double it.</div>
                    <p className="sp-reward-p">Every Genesis payment is airdropped back in tokens <b style={{ color: 'var(--ink-1)' }}>{mySubs[0]?.reward_payout_window ?? 'TGE + 30 days'}</b> — somewhere between 1x and 2x what you paid, valued in USDC at the time of payout.</p>
                    <div className="sp-asset-row">
                      <span className="sp-asset-chip">$YLDR</span>
                      <span className="sp-asset-chip">$SPCX</span>
                      <span className="sp-asset-chip">$TSLA</span>
                    </div>
                  </div>
                  <div className="sp-reward-range">
                    <div className="sp-rr-box"><div className="k">Floor</div><div className="v">${fmt(totalRewardMin, 0)}</div></div>
                    <div className="sp-rr-box"><div className="k">Ceiling</div><div className="v">${fmt(totalRewardMax, 0)}</div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* PERSONAL HISTORY TABLE */}
            <div className="sp-wrap sp-sec" style={{ paddingTop: 0 }}>
              <div className="sp-card">
                <div className="sp-tracker-head">
                  <div className="sp-tracker-title">Payment History</div>
                  <div className="sp-tracker-count">{mySubs.length} total</div>
                </div>
                <div className="sp-table-wrap">
                  <table className="sp-table">
                    <thead>
                      <tr>
                        <th>Plan</th><th>Cycle</th><th>Amount</th><th>Reward Range</th><th>Network</th><th>When</th><th>TX</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mySubs.map((s, i) => (
                        <tr key={i}>
                          <td className="white">{s.plan_name}</td>
                          <td>{s.billing_cycle}</td>
                          <td>${fmt(s.usdc_amount)} {s.token}</td>
                          <td className="win">${fmt(s.reward_min_usdc, 0)}–${fmt(s.reward_max_usdc, 0)}</td>
                          <td>{s.network}</td>
                          <td>{timeAgo(s.created_at)}</td>
                          <td>
                            <a href={`${getExplorerUrl(s.chain_id)}/tx/${s.tx_hash}`} target="_blank" rel="noopener noreferrer">
                              {s.tx_hash.slice(0, 6)}... ↗
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* PUBLIC TRACKER */}
        <div className="sp-wrap sp-sec" style={{ paddingTop: 0 }}>
          <div className="sp-card">
            <div className="sp-tracker-head">
              <div className="sp-tracker-title">Community Subscriptions</div>
              <div className="sp-tracker-count">{publicSubs.length} total</div>
            </div>
            <div className="sp-table-wrap">
              <table className="sp-table">
                <thead>
                  <tr>
                    <th>Wallet</th><th>Plan</th><th>Cycle</th><th>Amount</th><th>Network</th><th>When</th><th>TX</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((s, i) => (
                    <tr key={i}>
                      <td className="white">{s.wallet_address.slice(0, 6)}...{s.wallet_address.slice(-4)}</td>
                      <td>{s.plan_name}</td>
                      <td>{s.billing_cycle}</td>
                      <td>${fmt(s.usdc_amount)} {s.token}</td>
                      <td>{s.network}</td>
                      <td>{timeAgo(s.created_at)}</td>
                      <td>
                        <a href={`${getExplorerUrl(s.chain_id)}/tx/${s.tx_hash}`} target="_blank" rel="noopener noreferrer">
                          {s.tx_hash.slice(0, 6)}... ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                  {pageItems.length === 0 && !publicLoading && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-3)' }}>No subscriptions yet.</td></tr>
                  )}
                  {publicLoading && (
                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink-3)' }}>Loading...</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 16 }}>
                <button className="sp-nav-cta" style={{ opacity: currentPage === 1 ? 0.5 : 1 }} disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Prev</button>
                <span className="sp-mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>Page {currentPage} of {totalPages}</span>
                <button className="sp-nav-cta" style={{ opacity: currentPage === totalPages ? 0.5 : 1 }} disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <div className="sp-foot">
        <div className="sp-wrap sp-foot-in">
          <div className="sp-foot-l">© 2026 Yieldr · Agent Stack for onchain funds</div>
          <div className="sp-foot-r">
            <a href="/docs">Docs</a>
            <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">X</a>
          </div>
        </div>
      </div>
    </div>
  );
}
