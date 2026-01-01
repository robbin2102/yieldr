'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { usePayment } from '../context/PaymentContext';
import { formatNumber, formatPrice, formatUsd } from '@/lib/tierCalculations';
import { UserProfile } from '../components/UserProfile';
import { DISCORD_INVITE } from '@/config/payment';

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

export default function AllocationsPage() {
  const { address, isConnected } = useAccount();
  const { hasCompletedPayment, allocationData } = usePayment();
  const [userStats, setUserStats] = useState<AllocationStats | null>(null);
  const [publicContributions, setPublicContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [discordInviteUsed, setDiscordInviteUsed] = useState(false);

  useEffect(() => {
    if (!address) return;

    async function fetchData() {
      try {
        // Fetch user's contributions
        const userRes = await fetch(`/api/contributions?wallet=${address}`);
        const userData = await userRes.json();

        if (userData.success) {
          setUserStats(userData.data.summary);
        }

        // Fetch public contributions (last 100)
        const publicRes = await fetch('/api/contributions/public');
        const publicData = await publicRes.json();

        if (publicData.success) {
          setPublicContributions(publicData.data.contributions);
        }
      } catch (error) {
        console.error('Error fetching allocation data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Check if Discord invite was already used
    const inviteUsed = localStorage.getItem(`yldr_discord_invite_used_${address}`);
    setDiscordInviteUsed(inviteUsed === 'true');
  }, [address]);

  const handleJoinDiscord = () => {
    if (address) {
      localStorage.setItem(`yldr_discord_invite_used_${address}`, 'true');
      setDiscordInviteUsed(true);
      window.open(DISCORD_INVITE, '_blank');
    }
  };

  if (!isConnected || !hasCompletedPayment) {
    return (
      <div className="allocations-page">
        <div className="allocations-container">
          <div className="allocations-not-connected">
            <h1>My Allocations</h1>
            <p>Connect your wallet and complete a payment to view your allocations.</p>
            <Link href="/" className="allocations-cta-link">
              Go to Homepage →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="allocations-page">
      {/* Header */}
      <header className="allocations-header">
        <nav className="allocations-nav">
          <Link href="/" className="allocations-logo">
            <svg className="logo-icon" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
              <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
              <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000000" opacity="0.3"/>
              <circle cx="50" cy="60" r="8" fill="#FFFFFF" opacity="0.9"/>
            </svg>
            <span>YIELDR</span>
          </Link>
          <div className="allocations-nav-links">
            <Link href="/">Home</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/team">Team</Link>
            <Link href="/build-in-public">Build Progress</Link>
          </div>
          <UserProfile onViewAllocation={() => {}} />
        </nav>
      </header>

      <div className="allocations-container">
        <h1 className="allocations-title">My YLDR Allocation</h1>

        {/* User Allocation Stats */}
        <div className="allocations-user-stats">
          <div className="stats-card">
            <div className="stat-item">
              <span className="stat-label">Total Contribution</span>
              <span className="stat-value">{formatUsd(userStats?.totalUsdc || 0)} USDC</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">YLDR Allocation</span>
              <span className="stat-value">{formatNumber(userStats?.totalYldr || 0)} YLDR</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Average Price</span>
              <span className="stat-value">{formatPrice(userStats?.avgPrice || 0)}/YLDR</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Contributions</span>
              <span className="stat-value">{userStats?.contributionCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Discord Exclusive Access */}
        <div className="allocations-discord-section">
          <div className="discord-card">
            <div className="discord-icon">💬</div>
            <h2>Exclusive Beta Access - Discord Community</h2>
            {!discordInviteUsed ? (
              <>
                <p className="discord-warning">⚠️ <strong>One-time invite link.</strong> Once used, this link will be marked as claimed. Do not share this link with anyone.</p>
                <p className="discord-description">
                  Join our private Discord for direct team interaction, product feedback sessions,
                  beta feature access, and priority updates on development.
                </p>
                <button className="discord-join-btn" onClick={handleJoinDiscord}>
                  Join Discord Community (One-time Invite)
                </button>
              </>
            ) : (
              <>
                <p className="discord-claimed">✅ You've already claimed your Discord invite</p>
                <p className="discord-description">
                  If you haven't joined yet, use your original invite link. If you've lost access, contact support.
                </p>
                <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="discord-rejoin-btn">
                  Rejoin Discord →
                </a>
              </>
            )}
          </div>
        </div>

        {/* Get More Allocation CTA */}
        <div className="allocations-more-section">
          <div className="more-allocation-card">
            <h3>🚀 Increase Your Allocation</h3>
            <p>Currently in <strong>Genesis Tier</strong> at $0.057/YLDR</p>

            <div className="tier-comparison">
              <div className="tier-col">
                <span className="tier-name">Current (Genesis)</span>
                <span className="tier-price">$0.057</span>
                <span className="tier-desc">FDV: $12M</span>
              </div>
              <div className="tier-arrow">→</div>
              <div className="tier-col highlight">
                <span className="tier-name">Next (Pre-Seed)</span>
                <span className="tier-price">$0.10</span>
                <span className="tier-desc">FDV: $21M</span>
              </div>
            </div>

            <div className="potential-gains">
              <h4>Potential Gains at TGE (Q1 2027)</h4>
              <div className="gains-grid">
                <div className="gain-item">
                  <span className="gain-fdv">$150M FDV</span>
                  <span className="gain-value">12.5x</span>
                </div>
                <div className="gain-item">
                  <span className="gain-fdv">$300M FDV</span>
                  <span className="gain-value">25x</span>
                </div>
                <div className="gain-item">
                  <span className="gain-fdv">$500M FDV</span>
                  <span className="gain-value">42x</span>
                </div>
              </div>
            </div>

            <Link href="/" className="get-more-btn">
              Get More Allocation →
            </Link>
          </div>
        </div>

        {/* Public Allocation Tracker */}
        <div className="allocations-public-section">
          <h2 className="public-tracker-title">Public Allocation Tracker</h2>
          <p className="public-tracker-subtitle">Latest 100 contributions from the community</p>

          {loading ? (
            <div className="tracker-loading">Loading contributions...</div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="tracker-summary">
                <div className="summary-stat">
                  <span className="summary-label">Total Raised</span>
                  <span className="summary-value">
                    {formatUsd(publicContributions.reduce((sum, c) => sum + c.usdc_amount, 0))} USDC
                  </span>
                </div>
                <div className="summary-stat">
                  <span className="summary-label">Total YLDR Allocated</span>
                  <span className="summary-value">
                    {formatNumber(publicContributions.reduce((sum, c) => sum + c.yldr_allocation, 0))} YLDR
                  </span>
                </div>
                <div className="summary-stat">
                  <span className="summary-label">Contributors</span>
                  <span className="summary-value">{publicContributions.length}</span>
                </div>
              </div>

              {/* Contributions Table */}
              <div className="tracker-table-container">
                <table className="tracker-table">
                  <thead>
                    <tr>
                      <th>Wallet</th>
                      <th>USDC</th>
                      <th>YLDR</th>
                      <th>Price</th>
                      <th>Tier</th>
                      <th>Date</th>
                      <th>TX</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicContributions.map((contribution, i) => (
                      <tr key={i}>
                        <td className="wallet-cell">
                          {contribution.wallet_address.slice(0, 6)}...{contribution.wallet_address.slice(-4)}
                        </td>
                        <td className="usdc-cell">{formatUsd(contribution.usdc_amount)}</td>
                        <td className="yldr-cell">{formatNumber(contribution.yldr_allocation)}</td>
                        <td className="price-cell">{formatPrice(contribution.yldr_price)}</td>
                        <td className="tier-cell">
                          <span className={`tier-badge ${contribution.allocation_tier.toLowerCase()}`}>
                            {contribution.allocation_tier}
                          </span>
                        </td>
                        <td className="date-cell">
                          {new Date(contribution.created_at).toLocaleDateString()}
                        </td>
                        <td className="tx-cell">
                          <a
                            href={`https://basescan.org/tx/${contribution.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="tx-link"
                          >
                            View →
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="allocations-footer">
        <p>© 2026 YLDR. Built different.</p>
        <div className="footer-links">
          <Link href="/docs">Docs</Link>
          <Link href="/team">Team</Link>
          <a href="https://discord.gg/c8qq9DKkjM" target="_blank" rel="noopener noreferrer">Discord</a>
        </div>
      </footer>
    </div>
  );
}
