'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import NavLinks from '@/components/NavLinks';
import './bip.css';

const GITHUB  = 'https://github.com/robbin2102/yieldr-app';
const TWITTER = 'https://x.com/yieldrdotorg';

const COMMIT_DATA = [
  { short: 'Oct', count: 41,  level: 1 },
  { short: 'Nov', count: 114, level: 2 },
  { short: 'Dec', count: 163, level: 3 },
  { short: 'Jan', count: 159, level: 3 },
  { short: 'Feb', count: 63,  level: 1 },
  { short: 'Mar', count: 310, level: 4 },
  { short: 'Apr', count: 45,  level: 1 },
  { short: 'May', count: 83,  level: 2 },
  { short: 'Jun', count: 94,  level: 2 },
];

function GhGrid() {
  return (
    <div className="gh-wrap">
      <div className="cc-title">Commits by month</div>
      <div className="gh-grid">
        {COMMIT_DATA.map(({ short, count, level }) => (
          <div className="gh-col" key={short}>
            <div className="gh-boxes">
              {[0,1,2,3].map(i => (
                <div key={i} className={`gh-box gh-l${level}`} title={`${count} commits`} />
              ))}
            </div>
            <div className="gh-month">{short}</div>
            <div className="gh-count">{count}</div>
          </div>
        ))}
      </div>
      <div className="gh-legend">
        <span>Less</span>
        {[0,1,2,3,4].map(l => <div key={l} className={`gh-box gh-l${l}`} />)}
        <span>More</span>
      </div>
    </div>
  );
}

function GhLink({ url, label = 'View commit' }: { url: string; label?: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="tl-gh-link">
      <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
      {label}
    </a>
  );
}

export default function BuildInPublicPage() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="grid-overlay" />
      <div className="scanline" />

      <nav className="bip-nav">
        <div className="nav-l">
          <svg className="nav-logo" viewBox="0 0 100 120"><path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#00E87B"/><ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3"/><circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9"/></svg>
          <span className="nav-brand">YIELDR</span>
        </div>
        <div className="nav-r">
          <NavLinks cta={{ href: '/vaults', label: 'Enter Vaults ↗' }} />
        </div>
      </nav>

      <main className="bip-main">

        {/* HERO */}
        <div className="page-hero">
          <div className="updated">Updated monthly · Week 1 Jul 2026 · ~1,089 commits shipped</div>
          <h1>Building in Public</h1>
          <div className="sub">Transparent development. <strong>No bullshit.</strong> Real trading performance, real commit history. Every module tracked openly from day one.</div>
          <div className="badges">
            <div className="badge green"><img src="https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760730551690x161831425309488800/_base-square%20%282%29.svg" alt="Base" /> Base Batches 002 Winner</div>
            <div className="badge">9 Months In</div>
            <div className="badge">~1,089 Commits</div>
            <div className="badge">2 Contributors</div>
          </div>
        </div>

        {/* 01 OVERVIEW */}
        <div className="overview reveal">
          <div className="sec-num">01 — Overview</div>
          <div className="ov-label">By the numbers — running totals since October 2025</div>
          <div className="ov-grid">
            <div className="ov-card"><div className="ov-v white">9</div><div className="ov-l">Months Building</div></div>
            <div className="ov-card"><div className="ov-v">+85K</div><div className="ov-l">Lines of Code</div></div>
            <div className="ov-card"><div className="ov-v white">$10K</div><div className="ov-l">Base Grant</div><div className="ov-sub">Batches 002</div></div>
            <div className="ov-card"><div className="ov-v white">3</div><div className="ov-l">Vaults in Testing</div><div className="ov-sub">$100K capital</div></div>
          </div>
        </div>

        {/* DEV METRICS */}
        <div className="dev-metrics reveal">
          <div className="ov-label">Development Metrics</div>
          <div className="dm-grid">
            <div className="dm-card"><div className="dm-v">~1,089</div><div className="dm-l">Commits</div></div>
            <div className="dm-card"><div className="dm-v">80+</div><div className="dm-l">Features</div></div>
            <div className="dm-card"><div className="dm-v">200+</div><div className="dm-l">Bug Fixes</div></div>
            <div className="dm-card"><div className="dm-v">2</div><div className="dm-l">Contributors</div></div>
          </div>
        </div>

        {/* COMMIT GRID */}
        <div className="commit-chart reveal">
          <div className="cc-box">
            <GhGrid />
          </div>
        </div>

        {/* 02 DEVELOPMENT TIMELINE */}
        <div className="content-section reveal">
          <div className="sec-divider">
            <div className="sec-num">02 — Development Timeline</div>
            <div className="sec-h">What shipped, when.</div>
            <div className="sec-sub">Chronological build log. The data infrastructure, agent tooling, and execution layer that powers the trading vaults.</div>
          </div>

          <div className="timeline">

            {/* JULY 2026 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">July 2026</span>
                <span className="tl-month-badge active">&#9679; In Progress</span>
              </div>
              <div className="tl-summary">Multi-chain expansion to HOOD Chain. $YLDR TGE launching via Virtuals — the token is deflationary by design, consumed by agent execution cycles.</div>
              <div className="tl-item">
                <div className="tl-item-h">Multi-Chain Expansion — HOOD Chain</div>
                <div className="tl-item-p">Expanding Yieldr to HOOD Chain (Robinhood Chain), an Arbitrum L2 with native 24/7 tokenized stock trading. SpaceX (SPCX), NVDA, TSLA, Virtuals HOOD Agents, and HOOD Carry Trade vaults added to the waitlist.</div>
                <div className="tl-tags"><span className="tl-tag green">HOOD Chain</span><span className="tl-tag">Stock Tokens</span><span className="tl-tag">Multi-Chain</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">$YLDR Token Generation Event</div>
                <div className="tl-item-p">$YLDR TGE launching via Virtuals on HOOD Chain. Deflationary by design — token consumed by agent execution cycles.</div>
                <div className="tl-tags"><span className="tl-tag green">Token</span><span className="tl-tag green">Virtuals</span><span className="tl-tag green">Live</span></div>
              </div>
            </div>

            {/* JUNE 2026 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">June 2026</span>
                <span className="tl-month-badge active">&#9679; In Progress</span>
              </div>
              <div className="tl-summary">Shipped the full quant signal execution agent on Hyperliquid — the signals service from May went live with real capital. ALO order logic, fill verification, margin-based position sizing, and per-strategy capital caps. WebSocket whale monitor re-architected across shards to bypass Hyperliquid&apos;s 30-user-per-connection limit. Vault waitlist expanded with a wallet whitelist for early access.</div>
              <div className="tl-item">
                <div className="tl-item-h">Quant Signal Execution Agent — Hyperliquid Live</div>
                <div className="tl-item-p">Full execution agent wired to the alert engine: ALO order placement with fill verification, margin-based position sizing, per-strategy capital caps, and configurable hold periods. WAKEUP_LS/SS and WHALE_SCALEUP_4H signal strategies with symmetric long/short rules. Backtest framework with per-strategy win/loss summary and forward-return lag analysis.</div>
                <div className="tl-tags"><span className="tl-tag green">Hyperliquid</span><span className="tl-tag">Quant</span><span className="tl-tag">Agents</span><span className="tl-tag">Railway</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/72e99d46ef750d3164b41730095815eea9a6d660" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">WebSocket Whale Monitor — Sharded Architecture</div>
                <div className="tl-item-p">Re-architected the whale position monitor across multiple WebSocket connections to bypass Hyperliquid&apos;s 30-user-per-connection limit. Dynamic resharding as cohort size changes, reconnect reason tracking, and event-loop offloading for zero stalls.</div>
                <div className="tl-tags"><span className="tl-tag">Hyperliquid</span><span className="tl-tag">Data Infra</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/382e8a0d8bf5a637ded99e7590e0dd4d991f53af" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Agent Dashboard — Live Execution Monitor</div>
                <div className="tl-item-p">Dashboard tab for the Hyperliquid execution agent: open positions with live mark price and PnL%, strategy performance table with Total ROI and Net Avg/Trade, activity feed, health panel. Pause/resume controls via API.</div>
                <div className="tl-tags"><span className="tl-tag">Agents</span><span className="tl-tag">UI</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/ef531d78e984e44d8085fc56a043e70eca3b152c" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Vault Waitlist + Wallet Whitelist</div>
                <div className="tl-item-p">Multiple agent vaults added to the waitlist. Users can whitelist their wallets for early access before public vault launch.</div>
                <div className="tl-tags"><span className="tl-tag green">Vaults</span><span className="tl-tag">Early Access</span></div>
              </div>
            </div>

            {/* MAY 2026 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">May 2026</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-summary">Built and deployed the Hyperliquid Signals service for a test HL vault strategy. Alert engine with WAKEUP/WHALE_FLIP strategy detection laid the foundation for the June execution agent. OOM hardening across 6 rounds stabilised the Railway deployment for long-running operation.</div>
              <div className="tl-item">
                <div className="tl-item-h">Hyperliquid Signals Service</div>
                <div className="tl-item-p">Bloomberg-style dashboard tracking top whale positions across 1,500+ wallets. Deployed on Railway with 34k-row leaderboard handling, 5-minute timeout, and 3-attempt retry. Full service + dashboard shipped from the hyperliquid-signals feature branch.</div>
                <div className="tl-tags"><span className="tl-tag">Hyperliquid</span><span className="tl-tag">Railway</span><span className="tl-tag">Data Infra</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/92c8211bbc434ed1cb1c3d0ba9eb51c8364e175a" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Convergence Engine v2 + Alert Engine</div>
                <div className="tl-item-p">9 distinct signals with skill-quartile tiering across 4 detail pages. Alert engine detecting WAKEUP and WHALE_FLIP strategy patterns. Backtest infrastructure with configurable --top-coins and date-range filters built as foundation for June&apos;s live execution.</div>
                <div className="tl-tags"><span className="tl-tag">Quant</span><span className="tl-tag">LLM Tooling</span><span className="tl-tag">Agents</span></div>
              </div>
            </div>

            {/* APRIL 2026 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">April 2026</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-summary">Smaller engineering month — focus on data infrastructure stability and vault tracking. Deployed a dedicated Railway service to track vault PnL and capital in real-time. Fixed CoinGlass API degradation and corrected the OHLCV exchange feed. Vault tracker writes live stats to MongoDB powering the public vault display.</div>
              <div className="tl-item">
                <div className="tl-item-h">Vault Tracker Service</div>
                <div className="tl-item-p">Railway service tracking vault PnL, capital deployed, and cumulative returns in real-time. Queries DB by trader label rather than env vars. Fixed negative vault_size_usdc and incorrect cumulative PnL calculation.</div>
                <div className="tl-tags"><span className="tl-tag">Railway</span><span className="tl-tag green">Vaults</span><span className="tl-tag">Data Infra</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/78ba02405a050d9dcb10b8632c195bf6a8fd7de0" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Data Feed Fixes</div>
                <div className="tl-item-p">Disabled degraded CoinGlass API endpoints and corrected the OHLCV fetcher using the wrong exchange as source — keeping the market intelligence pipeline clean.</div>
                <div className="tl-tags"><span className="tl-tag">Data Infra</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/abc41a3091b1abefd54024157611764609f4eb08" />
              </div>
            </div>

            {/* MARCH 2026 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">March 2026</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-summary">Biggest engineering month — the full agent execution stack shipped. Trader profiling, prediction market signal detection, and live on-chain trade execution all came together. Polymarket trading agents went live this month: capital scaled gradually through testing, and the internal onchain fund is now managed with up to $100K cap. Avantis perps execution and 7 new MCP tools gave agents complete market context and trade capabilities.</div>
              <div className="tl-item">
                <div className="tl-item-h">Agent Monitoring System</div>
                <div className="tl-item-p">Scheduled background worker evaluates user-defined monitoring tasks at configurable intervals. Claude Haiku evaluator analyses tool-call output against position context — generates alerts with severity levels and per-indicator signal pills. Full CRUD via MCP tool.</div>
                <div className="tl-tags"><span className="tl-tag">Claude AI</span><span className="tl-tag">MCP</span><span className="tl-tag">LLM Tooling</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/b1365fb" label="View commit" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Agent Explorer &amp; Detail Pages</div>
                <div className="tl-item-p">Agent cards with live status, signal pills, alert counts, last-run timestamps. Detail view with per-indicator market read panel (green/yellow/red signals), alerts history. Terminal-style redesign of the agent chat page.</div>
                <div className="tl-tags"><span className="tl-tag">UI</span><span className="tl-tag">Agents</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/d32fb21" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Agent Launch UI &amp; Onboarding</div>
                <div className="tl-item-p">Agent creation flow: name availability check, market selection (Perps / Predictions / Liquidity), wallet connect. Auto-redirect for returning users. Wallet-first authentication.</div>
                <div className="tl-tags"><span className="tl-tag">UI</span><span className="tl-tag">Design</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/bbdbda7" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Binance Derivatives Fetcher</div>
                <div className="tl-item-p">8h settled funding rates + 1h predicted premium index. OI history at 15-minute granularity. Long/short ratio tracking. 7-day backfill on startup across 100 tracked coins. Deployed to Railway.</div>
                <div className="tl-tags"><span className="tl-tag">Railway</span><span className="tl-tag">Data Infra</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/8092178" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">AI Hedge Fund — Trader Profiler v2</div>
                <div className="tl-item-p">Deep profiling of Polymarket traders: corrected win rate, cashflow-based profit factor, ROCE per timeframe (1d/7d/15d/30d), PnL consistency scoring. Insider detection score, whale classification, category sub-leagues. With profiling complete, Polymarket trading agents went live — capital deployed gradually through testing, now running as an internal onchain fund with up to $100K cap.</div>
                <div className="tl-tags"><span className="tl-tag">AI</span><span className="tl-tag">Polymarket</span><span className="tl-tag">Research</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/fa032549b35b29b9a2e9ac4ecb600cd8abe680fe" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Avantis Live Trade Execution — Agent-Driven Perps</div>
                <div className="tl-item-p">End-to-end agent trade execution on Avantis perpetuals across 5 phases: open_trade/close_trade MCP tools, USDC approval flow, TP/SL logic, Python execution service on Railway. Strategy templates + trade signal evaluator wired to agent chat.</div>
                <div className="tl-tags"><span className="tl-tag green">Avantis</span><span className="tl-tag">MCP</span><span className="tl-tag">Agents</span><span className="tl-tag">Railway</span><span className="tl-tag green">On-chain</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/126bfd400b075c12e31ca230a99f9614e1b9301c" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">MCP Polymarket Tools</div>
                <div className="tl-item-p">get_pm_market and get_pm_user_activity tools giving agents live Polymarket market data, user positions, and activity feed. Wired to agent chat with 100-activity cap and minimum value filter for signal quality.</div>
                <div className="tl-tags"><span className="tl-tag">MCP</span><span className="tl-tag">Polymarket</span><span className="tl-tag">LLM Tooling</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/0ea240ff32306dab8ee91e43afd1917b52146faf" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Gamma API — Prediction Market Signal Analysis</div>
                <div className="tl-item-p">Deep edge analysis across Polymarket markets using Gamma API. Full scan + 7-day 1-minute price histories. First-touch entry analysis across 641 markets. Foundation for the vault strategy signal layer.</div>
                <div className="tl-tags"><span className="tl-tag">Polymarket</span><span className="tl-tag">Research</span><span className="tl-tag">Data Infra</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/b2e6c016f39e19581656c37f8462ecca61511256" />
              </div>
            </div>

            {/* FEBRUARY 2026 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">February 2026</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-highlight win">&#127942; Base Batches 002 — Builder Track Winner</div>
              <div className="tl-summary">Won the Base Batches 002 Builder Track. Deployed the market intelligence service — hourly ingestion of 20+ technical indicators across the top 100 crypto assets from TAAPI, CoinGlass, and Coinbase. Wired 7 new MCP tools giving agents complete real-time market context across price, funding, derivatives, and macro data.</div>
              <div className="tl-item">
                <div className="tl-item-h">Market Intelligence Service</div>
                <div className="tl-item-p">Hourly technical data ingestion for top 100 crypto assets. TAAPI: 20+ indicators per coin (RSI, MACD, EMA, Bollinger, ADX, Ichimoku, Supertrend, Fibonacci, 60+ candlestick patterns). CoinGlass: liquidation data, taker volume, basis. Coinbase OHLCV candles. Daily macro: BTC/ETH ETF flows, Fear &amp; Greed, stablecoin mcap. Dynamic coin list from top 100 by OI. Deployed to Railway.</div>
                <div className="tl-tags"><span className="tl-tag">Railway</span><span className="tl-tag">LLM Tooling</span><span className="tl-tag">Data Infra</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/0aeccec" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">MCP Server — 7 New Market Intelligence Tools</div>
                <div className="tl-item-p">get_market_snapshot, fetch_live_indicator, get_macro_snapshot, get_funding_rate_history, get_funding_rate_current, get_derivatives_history, get_coin_price. Full real-time market context for the AI agent.</div>
                <div className="tl-tags"><span className="tl-tag">MCP</span><span className="tl-tag">Claude AI</span><span className="tl-tag">LLM Tooling</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/a71b8ee" />
              </div>
            </div>

            {/* JANUARY 2026 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">January 2026</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-summary">Built the real-time event indexers — Avantis onchain trade events streaming as they happen, and a Hyperliquid backfiller tracking live positions across 1,500+ wallets. Wallet performance metrics service went live computing PnL consistency, ROCE trends, and 30-day analytics per wallet, powering the get_top_perp_traders MCP tool.</div>
              <div className="tl-item">
                <div className="tl-item-h">Top Wallets Swap Monitoring</div>
                <div className="tl-item-p">Avantis event listener: real-time onchain trade event indexing (open/close/liquidation). Hyperliquid indexer: backfiller + live position tracking for top 1,500+ wallets.</div>
                <div className="tl-tags"><span className="tl-tag">Base</span><span className="tl-tag">Avantis</span><span className="tl-tag">Hyperliquid</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/ddffeba" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Wallet Performance Metrics Service</div>
                <div className="tl-item-p">PnL consistency scoring, ROCE trending, trading-day frequency analysis. Per-wallet 30d metrics powering the get_top_perp_traders MCP tool.</div>
                <div className="tl-tags"><span className="tl-tag">Analytics</span><span className="tl-tag">LLM Tooling</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/e690115" />
              </div>
            </div>

            {/* DECEMBER 2025 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">December 2025</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-summary">Extended market coverage to prediction markets — Polymarket top trader activity indexed and monitored for strategy signals. Built the trending tokens service tracking top 100 Base tokens with holder tagging. Early access landing with USDC payment flow went live.</div>
              <div className="tl-item">
                <div className="tl-item-h">Prediction Markets Monitoring</div>
                <div className="tl-item-p">Top traders activity tracking on prediction markets.</div>
                <div className="tl-tags"><span className="tl-tag">Polymarket</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/971682f" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Trending Tokens Service</div>
                <div className="tl-item-p">Top 100 trending tokens monitoring on Base.</div>
                <div className="tl-tags"><span className="tl-tag">Base</span><span className="tl-tag">LLM Tooling</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/defde0e" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Early Access Landing + Payments</div>
                <div className="tl-item-p">Token purchase flow with wallet connect integration.</div>
                <div className="tl-tags"><span className="tl-tag">UI</span></div>
              </div>
            </div>

            {/* NOVEMBER 2025 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">November 2025</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-highlight win">&#127942; Base Batches 002 — Finalist</div>
              <div className="tl-summary">Reached the Base Batches 002 Finals. Core analytics stack took shape — live trade feeds across perpetuals protocols, LP position tracking with impermanent loss calculations, and full ROI/Sharpe/drawdown metrics for trader ranking.</div>
              <div className="tl-item">
                <div className="tl-item-h">Real-time Trades Monitoring</div>
                <div className="tl-item-p">Live trade feed service for top traders across perpetual protocols.</div>
                <div className="tl-tags"><span className="tl-tag">Avantis</span><span className="tl-tag">Hyperliquid</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/91f701d" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Performance Metrics Service</div>
                <div className="tl-item-p">ROI, win rate, drawdown, Sharpe ratio calculations for trader ranking.</div>
                <div className="tl-tags"><span className="tl-tag">Avantis</span><span className="tl-tag">Hyperliquid</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/6c81a08" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Liquidity Positions Analyser</div>
                <div className="tl-item-p">LP position tracking with impermanent loss calculations and fee earnings.</div>
                <div className="tl-tags"><span className="tl-tag">Uniswap</span><span className="tl-tag">Aerodrome</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/afdc6b9" />
              </div>
            </div>

            {/* OCTOBER 2025 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">October 2025</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-highlight win">&#127942; Base Batches — Submission</div>
              <div className="tl-summary">Built the MVP and submitted to Base Batches in the final days of the window. Wallet scanner with automatic position indexing from Avantis and Hyperliquid deployed on submission day. Simultaneously launched a $5K Claude AI-managed test account for live perp trading — first real-world validation of the agent-assisted trading thesis.</div>
              <div className="tl-item">
                <div className="tl-item-h">MVP v1.0 — Top Traders Indexing + Onboarding</div>
                <div className="tl-item-p">Wallet connection with automatic scanning. Live position data indexing from perpetual protocols. Deployed on final day of submission (Oct 24).</div>
                <div className="tl-tags"><span className="tl-tag">Avantis</span><span className="tl-tag">Hyperliquid</span><span className="tl-tag">GitHub</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/c091fa8" />
              </div>
              <div className="tl-item">
                <div className="tl-item-h">AI Trading Test Launch</div>
                <div className="tl-item-p">Claude AI-allocated $5K account for live perp trading validation. Foundation for verifying the agent-assisted trading thesis.</div>
                <div className="tl-tags"><span className="tl-tag">Claude AI</span><span className="tl-tag">Avantis</span></div>
                <GhLink url="https://github.com/robbin2102/yieldr-app/commit/d041ae0" />
              </div>
            </div>

          </div>
        </div>

        {/* 03 ROADMAP */}
        <div className="content-section reveal">
          <div className="sec-divider">
            <div className="sec-num">03 — Roadmap</div>
            <div className="sec-h">What&apos;s next</div>
            <div className="sec-sub">Planned milestones from Q3 2026 through full beta. <Link href="/docs#roadmap" className="sec-docs-link">Full roadmap in docs ↗</Link></div>
          </div>
          <div className="roadmap-grid">
            <div className="rm-card">
              <div className="rm-status active">&#9679; In Progress — Q3 2026</div>
              <div className="rm-h">Multi-Chain Expansion</div>
              <div className="rm-p">HOOD Chain (Robinhood Arbitrum L2), SpaceX and tokenized stock vaults, $YLDR TGE via Virtuals. Quant Agent trials open to waitlisted traders.</div>
              <div className="rm-tags"><span className="tl-tag green">HOOD Chain</span><span className="tl-tag">Multi-Chain</span><span className="tl-tag green">Token</span></div>
            </div>
            <div className="rm-card">
              <div className="rm-status planned">&#9675; Planned — Q4 2026</div>
              <div className="rm-h">Full Agent Stack</div>
              <div className="rm-p">Monitoring Agent, Comms Agent, and Allocation Agent roll out. Traders and depositors access the complete agent OS — edge monitoring, depositor communication, and allocation intelligence.</div>
              <div className="rm-tags"><span className="tl-tag">Agents</span><span className="tl-tag">MCP</span></div>
            </div>
            <div className="rm-card">
              <div className="rm-status planned">&#9675; Planned — Q1 2027</div>
              <div className="rm-h">Vault Infrastructure &amp; Beta Deposits</div>
              <div className="rm-p">Vault smart contracts deploy. Waitlisted traders with agent-verified edge launch vaults. Whitelisted depositors make first deposits into selected agent vaults.</div>
              <div className="rm-tags"><span className="tl-tag green">Vaults</span><span className="tl-tag">Smart Contracts</span></div>
            </div>
            <div className="rm-card">
              <div className="rm-status planned">&#9675; Planned — Q1–Q2 2027</div>
              <div className="rm-h">Full Beta Launch</div>
              <div className="rm-p">Full beta opens across agent vaults, depositor whitelist, and allocation agents. Matching, comms, monitoring, and allocation agents operate across the live vault network.</div>
              <div className="rm-tags"><span className="tl-tag">Open Network</span></div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="build-cta reveal">
          <div className="build-cta-h">9 months of shipping. The infrastructure is built.</div>
          <div className="build-cta-p">Agents are live. Vaults are in testing. Early access is open.</div>
          <Link href="/vaults" className="btn-p">Enter Vaults — Early Access ↗</Link>
        </div>

      </main>

      <footer className="bip-footer">
        <div className="f-soc">
          <a href={TWITTER} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
        </div>
        <div className="f-txt">Yieldr &copy; 2025. Built on Base. <a href="https://yieldr.org">yieldr.org</a></div>
        <div className="f-end">Updated monthly. All figures real. No sanitisation.</div>
      </footer>
    </>
  );
}
