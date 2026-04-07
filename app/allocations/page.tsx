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
const CURRENT_FDV = 9_000_000;
const TWITTER = 'https://x.com/yieldrdotorg';
const GITHUB  = 'https://github.com/robbin2102/yieldr-app';

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

export default function AllocationsPage() {
  const { address, isConnected, isReconnecting, isConnecting } = useAccount();
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
  const tgeProj2    = (totalUsdc / 2) * (TGE_FDV / CURRENT_FDV);

  // Pagination
  const totalPages = Math.ceil(publicContribs.length / ITEMS_PER_PAGE);
  const pageItems  = publicContribs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="ap-root">
        <div className="ap-grid-bg" />
        <div className="ap-scanline" />

        {/* Nav */}
        <nav className="ap-nav">
          <Link href="/" className="ap-nav-l">
            <svg width="20" height="24" viewBox="0 0 100 120"><path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#00E87B"/><ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3"/><circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9"/></svg>
            <span className="ap-nav-brand">YIELDR</span>
          </Link>
          <div className="ap-nav-r">
            <div className="ap-nav-links">
              <Link href="/">Home</Link>
              <Link href="/vaults">Vaults</Link>
              <Link href="/build-in-public">Build Log</Link>
            </div>
            <div className="ap-nav-soc">
              <a href={TWITTER} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
            </div>
            <Link href="/buy" className="ap-nav-cta">Buy More &#8599;</Link>
          </div>
        </nav>

        <main className="ap-main">

          {isReconnecting || isConnecting ? (
            <div className="ap-not-connected">
              <div className="ap-nc-title">Connecting...</div>
              <div className="ap-nc-sub">Reconnecting to your wallet...</div>
            </div>
          ) : !isConnected ? (
            <div className="ap-not-connected">
              <div className="ap-nc-title">Connect Wallet</div>
              <div className="ap-nc-sub">Connect your wallet to view your allocation and deposit history.</div>
              <ConnectButton />
            </div>
          ) : (
            <>
              {/* Page Header */}
              <div className="ap-hero">
                <div className="ap-hero-tag">My Allocation</div>
                <h1 className="ap-hero-title">Your Early Access Position</h1>
                <div className="ap-hero-sub">
                  {address?.slice(0,6)}...{address?.slice(-4)} &middot; {userStats?.contributionCount ?? 0} deposit{(userStats?.contributionCount ?? 0) !== 1 ? 's' : ''}
                </div>
              </div>

              {/* How it works banner */}
              <div className="ap-how-box">
                <div className="ap-how-label">How Early Access Works</div>
                <div className="ap-how-text">
                  Every <strong>$100</strong> deposited = <strong>$50</strong> into a Base USDC vault earning <span className="green">4.5% APY</span> from day one
                  (migrates to your chosen agent trading vault at Q3 2026 launch) + <strong>$50</strong> in <span className="green">YLDR token allocation</span> at $9M FDV.
                </div>
              </div>

              {/* Summary Stats */}
              <div className="ap-stats-grid">
                <div className="ap-stat-card">
                  <div className="ap-stat-v">{loading ? <Skel s="md" /> : `$${fmt(totalUsdc)}`}</div>
                  <div className="ap-stat-l">Total Deposited</div>
                </div>
                <div className="ap-stat-card">
                  <div className="ap-stat-v green">{loading ? <Skel s="md" /> : `$${fmt(usdcVault)}`}</div>
                  <div className="ap-stat-l">USDC Vault (4.5% APY)</div>
                </div>
                <div className="ap-stat-card">
                  <div className="ap-stat-v">{loading ? <Skel s="md" /> : `${fmtInt(totalYldr)} YLDR`}</div>
                  <div className="ap-stat-l">Token Allocation</div>
                </div>
                <div className="ap-stat-card">
                  <div className="ap-stat-v green">{loading ? <Skel s="md" /> : `$${fmt(tgeProj2)}`}</div>
                  <div className="ap-stat-l">TGE Projection ($75M)</div>
                </div>
              </div>

              {/* Two-column: Allocation + Discord */}
              <div className="ap-cols">

                {/* Left: Allocation breakdown */}
                <div className="ap-card">
                  <div className="ap-card-title">Allocation Breakdown</div>

                  <div className="ap-alloc-block">
                    <div className="ap-alloc-tag">USDC Vault — Earning Now</div>
                    <div className="ap-alloc-val">{loading ? <Skel s="lg" /> : `$${fmt(usdcVault)}`}</div>
                    <div className="ap-alloc-meta">Earning <span>4.5% APY</span> &middot; Migrates to agent vault <span>Q3 2026</span></div>
                  </div>

                  <div className="ap-alloc-block">
                    <div className="ap-alloc-tag">YLDR Token Allocation</div>
                    <div className="ap-alloc-val">{loading ? <Skel s="lg" /> : `${fmtInt(totalYldr)} YLDR`}</div>
                    <div className="ap-alloc-meta">Avg price <span>${fmt(avgPrice, 4)}</span> &middot; TGE <span>Q1 2027</span> &middot; 12-month vest</div>
                  </div>

                  <div className="ap-detail-rows">
                    <div className="ap-detail-row">
                      <span className="ap-detail-l">USDC value deposited for YLDR</span>
                      <span className="ap-detail-v">${fmt(yldrValue)}</span>
                    </div>
                    <div className="ap-detail-row">
                      <span className="ap-detail-l">TGE projection at $75M FDV</span>
                      <span className="ap-detail-v green">${fmt(tgeProj2)}</span>
                    </div>
                    <div className="ap-detail-row">
                      <span className="ap-detail-l">Potential return (vs YLDR cost)</span>
                      <span className="ap-detail-v green">{yldrValue > 0 ? `${fmt((tgeProj2 / yldrValue) * 100, 1)}%` : '—'}</span>
                    </div>
                  </div>

                  {contributions.length > 0 && (
                    <div className="ap-tx-link">
                      Last tx:{' '}
                      <a href={`${EXPLORER_URL}/tx/${contributions[0].tx_hash}`} target="_blank" rel="noopener noreferrer">
                        {contributions[0].tx_hash.slice(0,10)}...{contributions[0].tx_hash.slice(-8)} &#8599;
                      </a>
                    </div>
                  )}

                  <Link href="/buy" className="ap-btn-primary">Buy More Allocation &#8599;</Link>
                </div>

                {/* Right: Discord + Deposit History */}
                <div className="ap-card ap-card-center">
                  <div className="ap-card-title">Exclusive Access</div>
                  <div className="ap-discord-emoji">&#128172;</div>
                  <div className="ap-discord-h">Join Early Backers Discord</div>
                  <div className="ap-discord-p">
                    Get exclusive access to the early backers channel, direct line to the founder, and real-time vault performance updates.
                  </div>
                  {discordClaimed ? (
                    <>
                      <div className="ap-discord-done">&#10003; Invite claimed</div>
                      <button className="ap-btn-outline" onClick={handleJoinDiscord}>Rejoin Discord &#8594;</button>
                    </>
                  ) : (
                    <button className="ap-btn-primary" onClick={handleJoinDiscord}>
                      {discordInvite ? 'Claim Exclusive Invite ↗' : 'Join Discord ↗'}
                    </button>
                  )}

                  {/* Recent tx history */}
                  {contributions.length > 1 && (
                    <div className="ap-history">
                      <div className="ap-card-title">Deposit History</div>
                      {contributions.slice(0, 5).map((c, i) => (
                        <div className="ap-detail-row" key={i}>
                          <span className="ap-detail-l">{timeAgo(c.created_at)}</span>
                          <span className="ap-detail-v">${fmt(c.usdc_amount)} &#8594; {fmtInt(c.yldr_allocation)} YLDR</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Public Tracker */}
              <div className="ap-card">
                <div className="ap-tracker-head">
                  <div className="ap-tracker-title">Community Deposits</div>
                  <div className="ap-tracker-count">{publicContribs.length} total</div>
                </div>
                <div className="ap-table-wrap">
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
                          <td className="white">{c.wallet_address.slice(0,6)}...{c.wallet_address.slice(-4)}</td>
                          <td>${fmt(c.usdc_amount)}</td>
                          <td className="green">${fmt(c.usdc_amount / 2)}</td>
                          <td className="green">{fmtInt(c.yldr_allocation)}</td>
                          <td>${fmt(c.yldr_price, 4)}</td>
                          <td>{c.allocation_tier}</td>
                          <td>{timeAgo(c.created_at)}</td>
                          <td>
                            <a href={`${EXPLORER_URL}/tx/${c.tx_hash}`} target="_blank" rel="noopener noreferrer">
                              {c.tx_hash.slice(0,6)}... &#8599;
                            </a>
                          </td>
                        </tr>
                      ))}
                      {pageItems.length === 0 && !loading && (
                        <tr><td colSpan={8} style={{textAlign:'center',padding:'2rem',color:'var(--t3)'}}>No deposits yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="ap-pagination">
                    <button className="ap-pg-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&#8592; Prev</button>
                    <span className="ap-pg-info">Page {currentPage} of {totalPages}</span>
                    <button className="ap-pg-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next &#8594;</button>
                  </div>
                )}
              </div>

            </>
          )}
        </main>

        <footer className="ap-footer">
          <div className="ap-f-soc">
            <a href={TWITTER} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
          </div>
          <div className="ap-f-txt">Yieldr &copy; 2025. Built on Base. <a href="https://yieldr.org">yieldr.org</a></div>
          <div className="ap-f-end">Updated monthly. All figures real. No sanitisation.</div>
        </footer>
      </div>
    </>
  );
}
