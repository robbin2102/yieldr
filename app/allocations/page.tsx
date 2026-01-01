'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { usePayment } from '../context/PaymentContext';
import { formatNumber, formatPrice, formatUsd } from '@/lib/tierCalculations';
import { UserProfile } from '../components/UserProfile';
import { EarlyAccessPopup } from '../components/payment/EarlyAccessPopup';
import { EXPLORER_URL, DISCORD_INVITE } from '@/config/payment';

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

export default function AllocationsPage() {
  const { address, isConnected } = useAccount();
  const { hasCompletedPayment, allocationData, txHash, status, reset } = usePayment();
  const [userStats, setUserStats] = useState<AllocationStats | null>(null);
  const [publicContributions, setPublicContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [discordInviteUsed, setDiscordInviteUsed] = useState(false);
  const [discordInvite, setDiscordInvite] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!address) return;

    // Check if we have discord_invite from allocationData (just after payment)
    if (allocationData?.discord_invite) {
      setDiscordInvite(allocationData.discord_invite);
    }

    async function fetchData() {
      try {
        // Fetch user's contributions
        const userRes = await fetch(`/api/contributions?wallet=${address}`);
        const userData = await userRes.json();

        if (userData.success) {
          setUserStats(userData.data.summary);
          // Get Discord invite from API response
          if (userData.data.discord_invite) {
            setDiscordInvite(userData.data.discord_invite);
          }
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
  }, [address, allocationData]);

  // Close popup and refetch data when coming from successful payment
  useEffect(() => {
    if (status === 'success' && hasCompletedPayment) {
      console.log('🔄 Payment success detected, closing popup and refreshing data...');

      // Close the early access popup immediately
      setShowPopup(false);

      // Refetch data after a short delay to ensure backend has processed
      const timer = setTimeout(async () => {
        if (!address) return;

        try {
          const userRes = await fetch(`/api/contributions?wallet=${address}`);
          const userData = await userRes.json();

          if (userData.success) {
            setUserStats(userData.data.summary);
            if (userData.data.discord_invite) {
              setDiscordInvite(userData.data.discord_invite);
            }
          }

          const publicRes = await fetch('/api/contributions/public');
          const publicData = await publicRes.json();

          if (publicData.success) {
            setPublicContributions(publicData.data.contributions);
          }

          console.log('✅ Data refreshed successfully');

          // Reset payment state after handling (only in allocations page)
          reset();
        } catch (error) {
          console.error('Error refreshing data:', error);
        }
      }, 1500); // Wait 1.5 seconds for backend to process

      return () => clearTimeout(timer);
    }
  }, [status, hasCompletedPayment, address, reset]);

  const handleJoinDiscord = () => {
    if (address) {
      localStorage.setItem(`yldr_discord_invite_used_${address}`, 'true');
      setDiscordInviteUsed(true);
      // Use the unique Discord invite if available, otherwise fall back to default
      const inviteUrl = discordInvite || DISCORD_INVITE;
      window.open(inviteUrl, '_blank');
      console.log('🎫 Opening Discord invite:', inviteUrl);
    }
  };

  if (!isConnected) {
    return (
      <div className="allocations-page">
        <header className="team-header">
          <Link href="/" className="team-logo">
            <svg className="team-logo-icon" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
              <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
              <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000000" opacity="0.3"/>
              <circle cx="50" cy="60" r="8" fill="#FFFFFF" opacity="0.9"/>
            </svg>
            <span className="team-logo-text">YIELDR</span>
          </Link>
          <nav className="team-nav-links">
            <Link href="/" className="team-nav-link">Home</Link>
            <Link href="/docs" className="team-nav-link">Docs</Link>
            <Link href="/team" className="team-nav-link">Team</Link>
            <Link href="/build-in-public" className="team-nav-link">Build Progress</Link>
            <div className="team-nav-divider"></div>
            <Link href="https://discord.com/channels/1426305214176165941/1426305389812646091" target="_blank" className="team-nav-icon discord">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </Link>
            <Link href="https://github.com/robbin2102/yieldr-app" target="_blank" className="team-nav-icon github">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </Link>
            <Link href="/" className="team-nav-link primary">
              Get Early Access
            </Link>
          </nav>
          <button className="mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>☰</button>
        </header>

        <div className="allocations-not-connected">
          <h1>Access Restricted</h1>
          <p>Connect your wallet to view your allocations.</p>
          <Link href="/" className="allocations-cta-link">
            Go to Homepage →
          </Link>
        </div>

        <footer className="team-footer">
          <div className="footer-links">
            <a href="https://discord.com/channels/1426305214176165941/1426305389812646091" target="_blank" rel="noopener noreferrer" className="footer-social">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
            <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer" className="footer-social">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer" className="footer-social">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
          <p>Built different. <a href="https://yieldr.org">yieldr.org</a></p>
        </footer>
      </div>
    );
  }

  // Pagination
  const totalPages = Math.ceil(publicContributions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentContributions = publicContributions.slice(startIndex, endIndex);

  return (
    <div className="allocations-page">
      {/* Header */}
      <header className="team-header">
        <Link href="/" className="team-logo">
          <svg className="team-logo-icon" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
            <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000000" opacity="0.3"/>
            <circle cx="50" cy="60" r="8" fill="#FFFFFF" opacity="0.9"/>
          </svg>
          <span className="team-logo-text">YIELDR</span>
        </Link>
        <nav className="team-nav-links">
          <Link href="/" className="team-nav-link">Home</Link>
          <Link href="/docs" className="team-nav-link">Docs</Link>
          <Link href="/team" className="team-nav-link">Team</Link>
          <Link href="/build-in-public" className="team-nav-link">Build Progress</Link>
          <div className="team-nav-divider"></div>
          <Link href="https://discord.com/channels/1426305214176165941/1426305389812646091" target="_blank" className="team-nav-icon discord" title="Discord">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </Link>
          <Link href="https://github.com/robbin2102/yieldr-app" target="_blank" className="team-nav-icon github" title="GitHub">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </Link>
          <UserProfile />
        </nav>
        <button className="mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>☰</button>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="mobile-menu-logo">
                <svg className="mobile-menu-logo-icon" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
                  <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000000" opacity="0.3"/>
                  <circle cx="50" cy="60" r="8" fill="#FFFFFF" opacity="0.9"/>
                </svg>
                <span className="mobile-menu-logo-text">YIELDR</span>
              </div>
              <button className="mobile-menu-close" onClick={() => setShowMobileMenu(false)}>✕</button>
            </div>
            <div className="mobile-menu-content">
              <Link href="/" className="mobile-menu-link" onClick={() => setShowMobileMenu(false)}>Home</Link>
              <Link href="/docs" className="mobile-menu-link" onClick={() => setShowMobileMenu(false)}>Docs</Link>
              <Link href="/team" className="mobile-menu-link" onClick={() => setShowMobileMenu(false)}>Team</Link>
              <Link href="/build-in-public" className="mobile-menu-link" onClick={() => setShowMobileMenu(false)}>Build Progress</Link>
              <Link href="/allocations" className="mobile-menu-link" onClick={() => setShowMobileMenu(false)}>My Allocation</Link>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="allocations-container">
        <h1 className="allocations-title">My YLDR Allocation</h1>

        {/* Two Column Layout */}
        <div className="allocations-grid">
          {/* Left Column - User Allocation */}
          <div className="allocation-card">
            <h2>Your Allocation</h2>

            <div className="allocation-stats">
              <div className="stat-row">
                <span className="stat-label">Contribution</span>
                <span className="stat-value">{formatUsd(userStats?.totalUsdc || 0)} USDC</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">YLDR Allocation</span>
                <span className="stat-value highlight">{formatNumber(userStats?.totalYldr || 0)} YLDR</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Average Price</span>
                <span className="stat-value">{formatPrice(userStats?.avgPrice || 0)}/YLDR</span>
              </div>
              {txHash && (
                <div className="stat-row">
                  <span className="stat-label">Transaction</span>
                  <a href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="tx-link-compact">
                    {txHash.slice(0, 10)}...{txHash.slice(-8)} →
                  </a>
                </div>
              )}
            </div>

            <div className="allocation-cta-subtle">
              <p className="cta-text">Want to increase your allocation?</p>
              <button onClick={() => setShowPopup(true)} className="cta-btn-subtle">Get More Allocation →</button>
            </div>
          </div>

          {/* Right Column - Discord */}
          <div className="discord-card-compact">
            <div className="discord-icon-compact">💬</div>
            <h3>Exclusive Beta Access</h3>
            {!discordInviteUsed ? (
              <>
                <p className="discord-warning-compact">⚠️ One-time invite. Do not share.</p>
                <p className="discord-desc-compact">
                  Join our private Discord for direct team access and priority updates.
                </p>
                <button className="discord-join-btn-compact" onClick={handleJoinDiscord}>
                  Join Discord Community
                </button>
              </>
            ) : (
              <>
                <p className="discord-claimed-compact">✅ Invite claimed</p>
                <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="discord-rejoin-btn-compact">
                  Rejoin Discord →
                </a>
              </>
            )}
          </div>
        </div>

        {/* Public Tracker */}
        <div className="tracker-section">
          <h2 className="tracker-title">Public Allocation Tracker</h2>

          {loading ? (
            <div className="tracker-loading">Loading...</div>
          ) : (
            <>
              <div className="tracker-table-wrapper">
                <table className="tracker-table-compact">
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
                    {currentContributions.map((contribution, i) => (
                      <tr key={i}>
                        <td className="wallet-cell">{contribution.wallet_address.slice(0, 6)}...{contribution.wallet_address.slice(-4)}</td>
                        <td className="num-cell">{formatUsd(contribution.usdc_amount)}</td>
                        <td className="num-cell">{formatNumber(contribution.yldr_allocation)}</td>
                        <td className="num-cell">{formatPrice(contribution.yldr_price)}</td>
                        <td>
                          <span className={`tier-badge-compact ${contribution.allocation_tier.toLowerCase()}`}>
                            {contribution.allocation_tier}
                          </span>
                        </td>
                        <td className="date-cell">{new Date(contribution.created_at).toLocaleDateString()}</td>
                        <td>
                          <a href={`${EXPLORER_URL}/tx/${contribution.tx_hash}`} target="_blank" rel="noopener noreferrer" className="tx-link-compact">
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="team-footer">
        <div className="footer-links">
          <a href="https://discord.com/channels/1426305214176165941/1426305389812646091" target="_blank" rel="noopener noreferrer" className="footer-social" title="Discord">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
          <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer" className="footer-social" title="GitHub">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer" className="footer-social" title="Twitter/X">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
        <p>Built different. <a href="https://yieldr.org">yieldr.org</a></p>
      </footer>

      {/* Early Access Popup for increasing allocation */}
      <EarlyAccessPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}
