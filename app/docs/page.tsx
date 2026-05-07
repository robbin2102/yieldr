'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import NavLinks from '@/components/NavLinks';
import './docs.css';

const NAV_SECTIONS = [
  { group: 'Introduction', items: [
    { id: 'what-is-yieldr', label: 'What is Yieldr?' },
    { id: 'the-problem',    label: 'The Problem' },
    { id: 'our-solution',   label: 'Our Solution' },
  ]},
  { group: 'Product', items: [
    { id: 'agent-stack',    label: 'Agent Stack' },
    { id: 'live-vaults',    label: 'Live Vaults' },
  ]},
  { group: 'Future', items: [
    { id: 'vision',         label: 'Vision' },
    { id: 'roadmap',        label: 'Roadmap' },
  ]},
  { group: 'Token', items: [
    { id: 'tokenomics',     label: 'Tokenomics' },
  ]},
  { group: 'Community', items: [
    { id: 'connect',        label: 'Connect' },
  ]},
];

export default function DocsPage() {
  const [activeId, setActiveId] = useState('what-is-yieldr');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const allIds = NAV_SECTIONS.flatMap(g => g.items.map(i => i.id));
    const observers: IntersectionObserver[] = [];

    allIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      sectionRefs.current[id] = el;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setDrawerOpen(false);
  };

  const SidebarLinks = () => (
    <>
      {NAV_SECTIONS.map(group => (
        <div className="docs-sidebar-group" key={group.group}>
          <div className="docs-sidebar-group-label">{group.group}</div>
          {group.items.map(item => (
            <a
              key={item.id}
              className={`docs-sidebar-link${activeId === item.id ? ' active' : ''}`}
              onClick={() => scrollTo(item.id)}
            >
              {item.label}
            </a>
          ))}
        </div>
      ))}
    </>
  );

  return (
    <div className="docs-root">

      {/* ── Nav ── */}
      <nav className="docs-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" className="docs-nav-l">
            <svg width="18" height="22" viewBox="0 0 100 120" fill="none">
              <path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#00E87B" />
              <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3" />
              <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9" />
            </svg>
            <span className="docs-nav-brand">YIELDR</span>
          </Link>
          <span className="docs-nav-tag">Docs</span>
        </div>
        <div className="docs-nav-r">
          <NavLinks cta={{ href: '/vaults', label: 'Enter Vaults ↗' }} />
          <button className="docs-mobile-menu-btn" onClick={() => setDrawerOpen(true)}>
            ☰ Menu
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div
        className={`docs-drawer-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`docs-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="docs-drawer-header">
          <span className="docs-drawer-brand">DOCS</span>
          <button className="docs-drawer-close" onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        <SidebarLinks />
      </div>

      <div className="docs-layout">

        {/* ── Sidebar ── */}
        <aside className="docs-sidebar">
          <SidebarLinks />
        </aside>

        {/* ── Content ── */}
        <main className="docs-content">

          {/* What is Yieldr */}
          <section id="what-is-yieldr" className="docs-section">
            <div className="docs-section-badge">Introduction</div>
            <h1>What is Yieldr?</h1>
            <p>
              Yieldr is a platform for <strong>AI-native hedge funds onchain</strong>. It lets AI agents run entire
              trading funds — discovering edge, executing strategy, managing risk — while depositors
              earn yield from the performance of those funds.
            </p>
            <p>
              Think of it as the infrastructure layer for a new kind of fund manager: one that never
              sleeps, never misses a signal, and scales to any market or strategy without a team.
            </p>
            <div className="docs-callout">
              <strong>Today:</strong> Yieldr is live on Polymarket with three agent-run vaults, operating
              $100K of project capital across NBA, Soccer, and Geopolitics prediction markets.
            </div>
            <div className="docs-stats">
              <div className="docs-stat">
                <div className="docs-stat-v">$100K</div>
                <div className="docs-stat-l">Project Capital Live</div>
              </div>
              <div className="docs-stat">
                <div className="docs-stat-v">+41.8%</div>
                <div className="docs-stat-l">Best Vault 30D</div>
              </div>
              <div className="docs-stat">
                <div className="docs-stat-v">3</div>
                <div className="docs-stat-l">Live Vaults</div>
              </div>
            </div>
          </section>

          <hr className="docs-divider" />

          {/* The Problem */}
          <section id="the-problem" className="docs-section">
            <div className="docs-section-badge">Problem</div>
            <h1>The Problem</h1>
            <p>
              The best trading strategies in the world are inaccessible to almost everyone. Hedge
              funds require minimum investments of $1M+, institutional accreditation, and personal
              connections. Even if you have capital, you can&apos;t participate.
            </p>
            <h2>Why existing solutions fall short</h2>
            <div className="docs-card-grid">
              <div className="docs-card">
                <div className="docs-card-icon">🏦</div>
                <div className="docs-card-h">Traditional Hedge Funds</div>
                <p className="docs-card-p">$1M+ minimums, 2/20 fee structures, quarterly redemptions, zero transparency. Built for institutions, not individuals.</p>
              </div>
              <div className="docs-card">
                <div className="docs-card-icon">📊</div>
                <div className="docs-card-h">Copy Trading Platforms</div>
                <p className="docs-card-p">You follow human traders who burn out, change strategy, or chase performance. No systematic edge. No verifiable track record.</p>
              </div>
              <div className="docs-card">
                <div className="docs-card-icon">🤖</div>
                <div className="docs-card-h">Existing DeFi Yield</div>
                <p className="docs-card-p">Liquidity provision and lending yield is structural, not alpha. Returns are correlated with market conditions and collapse in bear markets.</p>
              </div>
              <div className="docs-card">
                <div className="docs-card-icon">🎯</div>
                <div className="docs-card-h">Prediction Market Trading</div>
                <p className="docs-card-p">Requires deep domain knowledge and full-time attention. Impossible for most to execute at scale across hundreds of simultaneous markets.</p>
              </div>
            </div>
          </section>

          <hr className="docs-divider" />

          {/* Our Solution */}
          <section id="our-solution" className="docs-section">
            <div className="docs-section-badge">Solution</div>
            <h1>Our Solution</h1>
            <p>
              Yieldr replaces the human fund manager with AI agents that can run the full investment
              cycle: find edge, trade it, manage risk, and report transparently onchain.
            </p>
            <p>
              Each vault is powered by a specialized agent that has been trained to find a specific
              type of edge in a specific market. The agent operates 24/7, doesn&apos;t have cognitive
              biases, and scales across as many positions as the market allows.
            </p>
            <h2>How it works for depositors</h2>
            <div className="docs-steps">
              <div className="docs-step">
                <div className="docs-step-num">01</div>
                <div className="docs-step-body">
                  <div className="docs-step-h">Choose a vault</div>
                  <p className="docs-step-p">Browse live vaults, review each agent&apos;s track record, strategy description, and risk profile. Pick the one that matches your preference.</p>
                </div>
              </div>
              <div className="docs-step">
                <div className="docs-step-num">02</div>
                <div className="docs-step-body">
                  <div className="docs-step-h">Deposit capital</div>
                  <p className="docs-step-p">Deposit USDC into the vault smart contract. Your capital is now managed by the agent — no further action required.</p>
                </div>
              </div>
              <div className="docs-step">
                <div className="docs-step-num">03</div>
                <div className="docs-step-body">
                  <div className="docs-step-h">Agent runs the fund</div>
                  <p className="docs-step-p">The agent scans markets, identifies edge, sizes positions, and executes trades 24/7. All activity is logged onchain.</p>
                </div>
              </div>
              <div className="docs-step">
                <div className="docs-step-num">04</div>
                <div className="docs-step-body">
                  <div className="docs-step-h">Earn yield + exit anytime</div>
                  <p className="docs-step-p">Track your vault NAV in real time. Withdraw your capital plus profits at any time — no lock-up periods at launch.</p>
                </div>
              </div>
            </div>
          </section>

          <hr className="docs-divider" />

          {/* Agent Stack */}
          <section id="agent-stack" className="docs-section">
            <div className="docs-section-badge">Product</div>
            <h1>Agent Stack</h1>
            <p>
              Yieldr&apos;s agent stack is split into two sides. Trader-side agents run the fund.
              Investor-side agents serve depositors. Together they eliminate any human bottleneck.
            </p>
            <h2>Trader-Side Agents</h2>
            <div className="docs-steps">
              <div className="docs-step">
                <div className="docs-step-num">🔍</div>
                <div className="docs-step-body">
                  <div className="docs-step-h">Market Scanner</div>
                  <p className="docs-step-p">Continuously scans prediction markets across all active categories. Identifies traders and wallets with statistically abnormal win rates, measures implied edge vs actual outcomes, flags high-conviction opportunities.</p>
                </div>
              </div>
              <div className="docs-step">
                <div className="docs-step-num">⚡</div>
                <div className="docs-step-body">
                  <div className="docs-step-h">Strategy Executor</div>
                  <p className="docs-step-p">Takes signals from the Scanner and translates them into trades. Handles position sizing, price level entry, partial fills, and continuous rebalancing based on updated signal strength.</p>
                </div>
              </div>
              <div className="docs-step">
                <div className="docs-step-num">🛡️</div>
                <div className="docs-step-body">
                  <div className="docs-step-h">Risk Monitor</div>
                  <p className="docs-step-p">Enforces hard limits: position concentration caps, daily drawdown limits, correlation ceilings across simultaneous positions. Triggers automatic de-risking when thresholds are approached.</p>
                </div>
              </div>
            </div>
            <h2>Investor-Side Agents</h2>
            <div className="docs-steps">
              <div className="docs-step">
                <div className="docs-step-num">💰</div>
                <div className="docs-step-body">
                  <div className="docs-step-h">Vault Allocator</div>
                  <p className="docs-step-p">Routes incoming deposits into active positions, manages liquidity queues, and schedules rebalancing. Optimises for minimising cash drag while maintaining withdrawal capacity.</p>
                </div>
              </div>
              <div className="docs-step">
                <div className="docs-step-num">📊</div>
                <div className="docs-step-body">
                  <div className="docs-step-h">Performance Tracker</div>
                  <p className="docs-step-p">Calculates real-time NAV per share, generates attribution reports by market and strategy, and publishes daily P&L to the UI and onchain.</p>
                </div>
              </div>
              <div className="docs-step">
                <div className="docs-step-num">🚪</div>
                <div className="docs-step-body">
                  <div className="docs-step-h">Exit Optimizer</div>
                  <p className="docs-step-p">Processes withdrawal requests by timing exits to minimise market impact. Queues large redemptions across multiple blocks, manages liquidity across concurrent open positions.</p>
                </div>
              </div>
            </div>
          </section>

          <hr className="docs-divider" />

          {/* Live Vaults */}
          <section id="live-vaults" className="docs-section">
            <div className="docs-section-badge">Product</div>
            <h1>Live Vaults</h1>
            <p>
              Three vaults are live today, running $100K of Yieldr project capital. These are not
              simulations — every trade is real, every number is verified onchain.
            </p>
            <div className="docs-card-grid">
              <div className="docs-card">
                <div className="docs-card-icon">🏀</div>
                <div className="docs-card-h">NBA Edge Vault</div>
                <p className="docs-card-p">Discovers top NBA prediction market traders by statistical edge, mirrors their highest-conviction positions. +18.7% 7D, 74% win rate.</p>
              </div>
              <div className="docs-card">
                <div className="docs-card-icon">⚽</div>
                <div className="docs-card-h">Soccer Alpha Vault</div>
                <p className="docs-card-p">Scans soccer markets for traders with statistically impossible edge (p&lt;0.0001), enters near their price levels. +12.4% 7D, 69% win rate.</p>
              </div>
              <div className="docs-card">
                <div className="docs-card-icon">🌐</div>
                <div className="docs-card-h">Geopolitics Vault</div>
                <p className="docs-card-p">Identifies insider wallets with abnormal win rates vs implied probability on geopolitical events. +41.8% 30D, 82% win rate.</p>
              </div>
            </div>
            <div className="docs-callout blue">
              <strong>Note:</strong> These vaults are currently running on Yieldr&apos;s own capital.
              Public deposits open at Q4 2026 launch. <Link href="/vaults">Explore live vault data →</Link>
            </div>
          </section>

          <hr className="docs-divider" />

          {/* Vision */}
          <section id="vision" className="docs-section">
            <div className="docs-section-badge">Future</div>
            <h1>Vision</h1>
            <p>
              A million AI-native hedge funds onchain. Every edge, every market, every strategy —
              run by agents, accessible to anyone with an internet connection.
            </p>
            <p>
              Today, sophisticated trading is a privilege reserved for institutions and the ultra-wealthy.
              AI removes the cost barrier. Onchain infrastructure removes the access barrier.
              Yieldr removes the operational barrier.
            </p>
            <div className="docs-callout">
              <strong>The long-term vision:</strong> Anyone can create an agent fund. Anyone can invest in one.
              The best strategies win based on performance, not on who you know or how much capital you already have.
            </div>
            <h2>The three horizons</h2>
            <div className="docs-card-grid">
              <div className="docs-card">
                <div className="docs-card-icon">🎯</div>
                <div className="docs-card-h">Horizon 1 — Prove It</div>
                <p className="docs-card-p">Run agent vaults on Yieldr&apos;s own capital. Prove the model works. Build the track record. Establish trust onchain.</p>
              </div>
              <div className="docs-card">
                <div className="docs-card-icon">🚀</div>
                <div className="docs-card-h">Horizon 2 — Open It</div>
                <p className="docs-card-p">Open vaults to public depositors. Launch YLDR token. Expand to Hyperliquid, Uniswap, Avantis. More markets, more vaults.</p>
              </div>
              <div className="docs-card">
                <div className="docs-card-icon">🌍</div>
                <div className="docs-card-h">Horizon 3 — Platform It</div>
                <p className="docs-card-p">Any developer can deploy an agent fund on Yieldr infrastructure. Permissionless fund creation. Protocol-level yield aggregation.</p>
              </div>
            </div>
          </section>

          <hr className="docs-divider" />

          {/* Roadmap */}
          <section id="roadmap" className="docs-section">
            <div className="docs-section-badge">Future</div>
            <h1>Roadmap</h1>
            <div className="docs-roadmap">
              <div className="docs-rm-item">
                <div className="docs-rm-period done">Oct–Dec 2025</div>
                <div className="docs-rm-body">
                  <div className="docs-rm-h">Foundation</div>
                  <p className="docs-rm-p">Agent framework, vault contracts, Polymarket integration, UI. 275+ commits, Base Batches 002 winner.</p>
                </div>
                <div className="docs-rm-badge done">Complete</div>
              </div>
              <div className="docs-rm-item">
                <div className="docs-rm-period done">Jan–Mar 2026</div>
                <div className="docs-rm-body">
                  <div className="docs-rm-h">Live Vaults</div>
                  <p className="docs-rm-p">3 vaults live with $100K project capital. Real trading. Public build-in-public reporting.</p>
                </div>
                <div className="docs-rm-badge done">Complete</div>
              </div>
              <div className="docs-rm-item">
                <div className="docs-rm-period active">Apr–Jun 2026</div>
                <div className="docs-rm-body">
                  <div className="docs-rm-h">Early Access Round</div>
                  <p className="docs-rm-p">YLDR token early access at $9M FDV. Vault allocation pre-sale. Building community ahead of launch.</p>
                </div>
                <div className="docs-rm-badge active">Active</div>
              </div>
              <div className="docs-rm-item">
                <div className="docs-rm-period planned">Q3 2026</div>
                <div className="docs-rm-body">
                  <div className="docs-rm-h">Multi-Protocol Expansion</div>
                  <p className="docs-rm-p">Hyperliquid perps integration, Avantis, expanded agent capabilities, additional vault strategies.</p>
                </div>
                <div className="docs-rm-badge planned">Planned</div>
              </div>
              <div className="docs-rm-item">
                <div className="docs-rm-period planned">Q4 2026</div>
                <div className="docs-rm-body">
                  <div className="docs-rm-h">Public Launch</div>
                  <p className="docs-rm-p">Public deposits open. Full platform release. Uniswap / Aerodrome liquidity integrations. YLDR TGE (TVL-gated).</p>
                </div>
                <div className="docs-rm-badge planned">Planned</div>
              </div>
              <div className="docs-rm-item">
                <div className="docs-rm-period planned">2027+</div>
                <div className="docs-rm-body">
                  <div className="docs-rm-h">Permissionless Fund Creation</div>
                  <p className="docs-rm-p">Open the platform for third-party agents to launch funds. Governance, DAO treasury, cross-chain expansion.</p>
                </div>
                <div className="docs-rm-badge planned">Planned</div>
              </div>
            </div>
          </section>

          <hr className="docs-divider" />

          {/* Tokenomics */}
          <section id="tokenomics" className="docs-section">
            <div className="docs-section-badge">Token</div>
            <h1>Tokenomics</h1>
            <p>
              YLDR is the governance and utility token of the Yieldr protocol. It grants holders
              voting rights, fee discounts, and priority access to new vault launches.
            </p>
            <div className="docs-token-grid">
              <div className="docs-token-row">
                <span className="docs-token-label">Token Name</span>
                <span className="docs-token-value">YLDR</span>
              </div>
              <div className="docs-token-row">
                <span className="docs-token-label">Total Supply</span>
                <span className="docs-token-value">210,000,000</span>
              </div>
              <div className="docs-token-row">
                <span className="docs-token-label">FDV (Early Access)</span>
                <span className="docs-token-value">$9,000,000</span>
              </div>
              <div className="docs-token-row">
                <span className="docs-token-label">Public Allocation</span>
                <span className="docs-token-value">41%</span>
              </div>
              <div className="docs-token-row">
                <span className="docs-token-label">TGE Timing</span>
                <span className="docs-token-value">TVL-gated</span>
              </div>
              <div className="docs-token-row">
                <span className="docs-token-label">Network</span>
                <span className="docs-token-value">Base</span>
              </div>
            </div>
            <h2>Early Access Offer</h2>
            <p>
              During the early access period, every <strong>$100 deposited</strong> is split:
              $50 goes into a Base USDC yield vault (migrating to agent trading vaults at Q4 2026 launch),
              and $50 becomes a YLDR token allocation at the $9M FDV price.
            </p>
            <div className="docs-callout amber">
              <strong>Important:</strong> Early access is invite-only. Join the Telegram waitlist to receive an
              invitation. The round is limited and closes once the TVL target is reached.
            </div>
          </section>

          <hr className="docs-divider" />

          {/* Connect */}
          <section id="connect" className="docs-section">
            <div className="docs-section-badge">Community</div>
            <h1>Connect</h1>
            <p>
              Yieldr builds entirely in public. All trading data, treasury reports, and
              development progress are shared openly. Join the community to stay updated.
            </p>
            <div className="docs-connect-box">
              <div className="docs-connect-h">Get involved with Yieldr</div>
              <p className="docs-connect-p">
                Follow the build, join the waitlist, or dive into the live vault data.
                Everything is open — no closed rooms, no sanitised reports.
              </p>
              <div className="docs-connect-links">
                <a
                  href="https://t.me/+bKuyducVGqliNGVl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="docs-connect-btn"
                >
                  Join Telegram ↗
                </a>
                <a
                  href="https://x.com/yieldrdotorg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="docs-connect-btn secondary"
                >
                  Follow on X ↗
                </a>
                <Link href="/build-in-public" className="docs-connect-btn secondary">
                  Build Log ↗
                </Link>
                <Link href="/vaults" className="docs-connect-btn secondary">
                  Live Vaults ↗
                </Link>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
