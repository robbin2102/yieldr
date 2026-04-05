'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { usePayment } from '../context/PaymentContext';
import { EXPLORER_URL, DISCORD_INVITE } from '@/config/payment';
import './allocations.css';

interface Contribution {
  wallet_address: string;
  usdc_amount: number;
  yldr_allocation: number;
  yldr_price: number;
  allocation_tier: string;
  fdv_at_purchase: number;
  tx_hash: string;
  created_at: string;
}

interface AllocationStats {
  totalUsdc: number;
  totalYldr: number;
  avgPrice: number;
  contributionCount: number;
}

const ITEMS_PER_PAGE = 10;
const TGE_FDV = 75_000_000;
const CURRENT_FDV = 12_000_000;

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function fmtInt(n: number) { return Math.round(n).toLocaleString('en-US'); }

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Skel({ s = 'md' }: { s?: 'sm' | 'md' | 'lg' }) {
  return <span className={`ap-skel ap-skel-${s}`} />;
}

const YieldrLogo = () => (
  <svg width="20" height="24" viewBox="0 0 100 120">
    <path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#00E87B"/>
    <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3"/>
    <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9"/>
  </svg>
);

export default function AllocationsPage() {
  const { address, isConnected } = useAccount();
  const { hasCompletedPayment, allocationData, txHash, status, reset } = usePayment();

  const [userStats, setUserStats]             = useState<AllocationStats | null>(null);
  const [contributions, setContributions]     = useState<Contribution[]>([]);
  const [publicContribs, setPublicContribs]   = useState<Contribution[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [discordInvite, setDiscordInvite]     = useState<string | null>(null);
  const [discordClaimed, setDiscordClaimed]   = useState(false);
  const [currentPage, setCurrentPage]         = useState(1);

  useEffect(() => {
    if (!address) { setLoading(false); return; }
    if (allocationData?.discord_invite) setDiscordInvite(allocationData.discord_invite);
    const claimed = localStorage.getItem(`yldr_discord_invite_used_${address}`) === 'true';
    setDiscordClaimed(claimed);

    async function fetchData() {
      try {
        const [uRes, pRes] = await Promise.all([
          fetch(`/api/contributions?wallet=${address}`),
          fetch('/api/contributions/public'),
        ]);
        const ud = await uRes.json();
        const pd = await pRes.json();
        if (ud.success) {
          setUserStats(ud.data.summary);
          setContributions(ud.data.contributions ?? []);
          if (ud.data.discord_invite) setDiscordInvite(ud.data.discord_invite);
        }
        if (pd.success) setPublicContribs(pd.data.contributions);
      } catch { /* silently fail */ }
      finally { setLoading(false); }
    }
    fetchData();
  }, [address, allocationData]);

  // Refresh after successful payment
  useEffect(() => {
    if (status !== 'success' || !hasCompletedPayment || !address) return;
    const t = setTimeout(async () => {
      try {
        const [uRes, pRes] = await Promise.all([
          fetch(`/api/contributions?wallet=${address}`),
          fetch('/api/contributions/public'),
        ]);
        const ud = await uRes.json();
        const pd = await pRes.json();
        if (ud.success) { setUserStats(ud.data.summary); setContributions(ud.data.contributions ?? []); }
        if (pd.success) setPublicContribs(pd.data.contributions);
      } catch { /* ignore */ }
      reset();
    }, 1500);
    return () => clearTimeout(t);
  }, [status, hasCompletedPayment, address, reset]);

  const handleJoinDiscord = () => {
    if (!address) return;
    localStorage.setItem(`yldr_discord_invite_used_${address}`, 'true');
    setDiscordClaimed(true);
    window.open(discordInvite || DISCORD_INVITE, '_blank');
  };

  // Derived values
  const totalUsdc   = userStats?.totalUsdc ?? 0;
  const totalYldr   = userStats?.totalYldr ?? 0;
  const avgPrice    = userStats?.avgPrice ?? 0;
  const usdcVault   = totalUsdc / 2;
  const yldrValue   = totalUsdc / 2;
  const tgeProjection = totalYldr * (TGE_FDV / (avgPrice > 0 ? (1 / avgPrice) * CURRENT_FDV : CURRENT_FDV));
  // simpler: tgeProjection = (totalUsdc/2) * (TGE_FDV/CURRENT_FDV)
  const tgeProj2    = (totalUsdc / 2) * (TGE_FDV / CURRENT_FDV);

  // Pagination
  const totalPages = Math.ceil(publicContribs.length / ITEMS_PER_PAGE);
  const pageItems  = publicContribs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="ap-root">
      <div className="ap-grid" />

      {/* Nav */}
      <nav className="ap-nav">
        <div className="ap-nav-l">
          <YieldrLogo />
          <span className="ap-nav-brand">YIELDR</span>
        </div>
        <div className="ap-nav-r">
          <Link href="/vaults" className="ap-nav-link">Vaults</Link>
          <Link href="/buy" className="ap-nav-cta">Buy More ↗</Link>
        </div>
      </nav>

      <main className="ap-main">

        {!isConnected ? (
          <div className="ap-not-connected">
            <div className="ap-nc-title">Connect Wallet</div>
            <div className="ap-nc-sub">Connect your wallet to view your allocation and deposit history.</div>
            <ConnectButton />
          </div>
        ) : (
          <>
            <div className="ap-page-head">
              <div className="ap-page-title">My Allocation</div>
              <div className="ap-page-sub">{address?.slice(0,6)}…{address?.slice(-4)} • {userStats?.contributionCount ?? 0} deposit{(userStats?.contributionCount ?? 0) !== 1 ? 's' : ''}</div>
            </div>

            {/* Summary row */}
            <div className="ap-summary">
              <div className="ap-summary-item">
                <div className="ap-summary-v">{loading ? <Skel s="md" /> : `$${fmt(totalUsdc)}`}</div>
                <div className="ap-summary-l">Total Deposited</div>
              </div>
              <div className="ap-summary-item">
                <div className="ap-summary-v">{loading ? <Skel s="md" /> : `$${fmt(usdcVault)}`}</div>
                <div className="ap-summary-l">USDC Vault (4.5% APY)</div>
              </div>
              <div className="ap-summary-item">
                <div className="ap-summary-v">{loading ? <Skel s="md" /> : fmtInt(totalYldr)}</div>
                <div className="ap-summary-l">YLDR Tokens</div>
              </div>
              <div className="ap-summary-item">
                <div className="ap-summary-v">{loading ? <Skel s="md" /> : `$${fmt(tgeProj2)}`}</div>
                <div className="ap-summary-l">TGE Projection ($75M)</div>
              </div>
            </div>

            {/* Two-column */}
            <div className="ap-grid2">

              {/* Left: Allocation breakdown */}
              <div className="ap-card">
                <div className="ap-card-title">Your Allocation Breakdown</div>

                <div className="ap-split-block">
                  <div className="ap-split-label">💰 USDC Vault — Earning Now</div>
                  <div className="ap-split-amount">{loading ? <Skel s="lg" /> : `$${fmt(usdcVault)}`}</div>
                  <div className="ap-split-meta">Earning <span>4.5% APY</span> · Migrates to agent vault <span>Q3 2026</span></div>
                </div>

                <div className="ap-split-block">
                  <div className="ap-split-label">🪙 YLDR Token Allocation</div>
                  <div className="ap-split-amount">{loading ? <Skel s="lg" /> : `${fmtInt(totalYldr)} YLDR`}</div>
                  <div className="ap-split-meta">Avg price <span>${fmt(avgPrice, 4)}</span> · TGE <span>Q1 2027</span> · 12-month vest</div>
                </div>

                <div className="ap-row">
                  <span className="ap-row-l">USDC value deposited for YLDR</span>
                  <span className="ap-row-v">${fmt(yldrValue)}</span>
                </div>
                <div className="ap-row">
                  <span className="ap-row-l">TGE projection at $75M FDV</span>
                  <span className="ap-row-v green">${fmt(tgeProj2)}</span>
                </div>
                <div className="ap-row">
                  <span className="ap-row-l">Potential return (vs YLDR cost)</span>
                  <span className="ap-row-v green">{yldrValue > 0 ? `${fmt((tgeProj2 / yldrValue) * 100, 1)}%` : '—'}</span>
                </div>

                {contributions.length > 0 && (
                  <div className="ap-tx">
                    Last tx:{' '}
                    <a href={`${EXPLORER_URL}/tx/${contributions[0].tx_hash}`} target="_blank" rel="noopener noreferrer">
                      {contributions[0].tx_hash.slice(0,10)}…{contributions[0].tx_hash.slice(-8)} ↗
                    </a>
                  </div>
                )}

                <Link href="/buy" className="ap-btn">Buy More Allocation ↗</Link>
              </div>

              {/* Right: Discord */}
              <div className="ap-card ap-discord">
                <div className="ap-card-title">Exclusive Access</div>
                <div className="ap-discord-icon">💬</div>
                <div className="ap-discord-title">Join Early Backers Discord</div>
                <div className="ap-discord-sub">
                  Get exclusive access to the early backers channel, direct line to the founder, and real-time vault performance updates.
                </div>
                {discordClaimed ? (
                  <>
                    <div className="ap-discord-claimed">✓ Invite claimed</div>
                    <button className="ap-btn outline" style={{marginTop:'.75rem'}} onClick={handleJoinDiscord}>Rejoin Discord →</button>
                  </>
                ) : (
                  <button className="ap-btn" onClick={handleJoinDiscord}>
                    {discordInvite ? 'Claim Exclusive Invite ↗' : 'Join Discord ↗'}
                  </button>
                )}

                {/* Recent tx history */}
                {contributions.length > 1 && (
                  <div style={{marginTop:'1.5rem', textAlign:'left'}}>
                    <div className="ap-card-title">Deposit History</div>
                    {contributions.slice(0, 5).map((c, i) => (
                      <div className="ap-row" key={i}>
                        <span className="ap-row-l">{timeAgo(c.created_at)}</span>
                        <span className="ap-row-v">
                          ${fmt(c.usdc_amount)} → {fmtInt(c.yldr_allocation)} YLDR
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Public tracker */}
            <div className="ap-card">
              <div className="ap-tracker-head">
                <div className="ap-tracker-title">Community Deposits</div>
                <div className="ap-tracker-count">{publicContribs.length} total</div>
              </div>
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>Wallet</th>
                    <th>Total USDC</th>
                    <th>USDC Vault</th>
                    <th>YLDR Tokens</th>
                    <th>Price/YLDR</th>
                    <th>Tier</th>
                    <th>When</th>
                    <th>TX</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((c, i) => (
                    <tr key={i}>
                      <td className="white">{c.wallet_address.slice(0,6)}…{c.wallet_address.slice(-4)}</td>
                      <td>${fmt(c.usdc_amount)}</td>
                      <td className="green">${fmt(c.usdc_amount / 2)}</td>
                      <td className="green">{fmtInt(c.yldr_allocation)}</td>
                      <td>${fmt(c.yldr_price, 4)}</td>
                      <td>{c.allocation_tier}</td>
                      <td>{timeAgo(c.created_at)}</td>
                      <td>
                        <a href={`${EXPLORER_URL}/tx/${c.tx_hash}`} target="_blank" rel="noopener noreferrer">
                          {c.tx_hash.slice(0,6)}… ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                  {pageItems.length === 0 && !loading && (
                    <tr><td colSpan={8} style={{textAlign:'center',padding:'2rem',color:'var(--t3)'}}>No deposits yet.</td></tr>
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="ap-pagination">
                  <button className="ap-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Prev</button>
                  <span className="ap-page-info">Page {currentPage} of {totalPages}</span>
                  <button className="ap-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next →</button>
                </div>
              )}
            </div>

          </>
        )}
      </main>

      <footer className="ap-footer">
        <div className="ap-footer-txt">
          Yieldr © 2025. Built on Base. Performance shown is from live testing with project capital and not indicative of future results.{' '}
          <a href="https://yieldr.org">yieldr.org</a>
        </div>
      </footer>
    </div>
  );
}
