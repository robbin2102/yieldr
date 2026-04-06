'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import './bip.css';

const GITHUB  = 'https://github.com/robbin2102/yieldr-app';
const TWITTER = 'https://x.com/yieldrdotorg';

const COMMIT_DATA = [
  { month: 'Oct', count: 43 },
  { month: 'Nov', count: 48 },
  { month: 'Dec', count: 62 },
  { month: 'Jan', count: 10 },
  { month: 'Feb', count: 12 },
  { month: 'Mar', count: 110 },
];

const MAX_COUNT = Math.max(...COMMIT_DATA.map(d => d.count));
const CHART_MAX_PX = 90;

// SVG icons inline
const IconX = () => (
  <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const IconGH = () => (
  <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
);

export default function BuildInPublicPage() {
  useEffect(() => {
    // animate commit chart bars
    const fills = document.querySelectorAll('.bip-cc-fill');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          fills.forEach((f, i) => {
            setTimeout(() => {
              (f as HTMLElement).style.height = (f as HTMLElement).dataset.h + 'px';
            }, i * 100);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    const chart = document.querySelector('.bip-cc-bars');
    if (chart) observer.observe(chart);

    // reveal animation
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.bip-reveal').forEach(el => revealObs.observe(el));

    return () => { observer.disconnect(); revealObs.disconnect(); };
  }, []);

  return (
    <>
      <div className="bip-grid" />
      <div className="bip-scan" />
      {/* Page wrapper */}
      <div>
        {/* ── Nav ── */}
        <nav className="bip-nav">
          <div className="bip-nav-l">
            <Link href="/" className="bip-nav-brand">YIELDR</Link>
          </div>
          <div className="bip-nav-r">
            <nav className="bip-nav-links">
              <Link href="/">Home</Link>
              <Link href="/vaults">Vaults</Link>
              <Link href="/build-in-public" className="active">Build Log</Link>
            </nav>
            <div className="bip-nav-soc">
              <a href={TWITTER} target="_blank" rel="noopener noreferrer" title="X / Twitter"><IconX /></a>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" title="GitHub"><IconGH /></a>
            </div>
            <Link href="/vaults" className="bip-nav-cta">Enter Vaults ↗</Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="bip-hero bip-reveal">
          <p className="updated">Building in Public — April 2026</p>
          <h1>Building in Public</h1>
          <p className="sub">
            Real code. Real commits. Real capital at stake.{' '}
            <strong>Everything shipped, tracked openly from day one.</strong>
          </p>
          <div className="bip-badges">
            <span className="bip-badge green">Base Batches 002 Winner</span>
            <span className="bip-badge green">6 Months In</span>
            <span className="bip-badge">Delaware C-Corp</span>
            <span className="bip-badge">~275 Commits</span>
            <span className="bip-badge">2 Contributors</span>
          </div>
        </div>

        {/* ── Main ── */}
        <main className="bip-main">
          <div className="bip-wrap">

          {/* ── 01 Overview ── */}
          <section className="bip-sec bip-reveal">
            <div className="bip-sec-num">01 — Overview</div>
            <h2 className="bip-sec-h">By the numbers</h2>
            <p className="bip-sec-sub">Running totals since October 2025.</p>

            <div className="bip-ov-label">Project Stats</div>
            <div className="bip-ov-grid">
              <div className="bip-ov-card">
                <div className="bip-ov-v">6</div>
                <div className="bip-ov-l">Months Building</div>
              </div>
              <div className="bip-ov-card">
                <div className="bip-ov-v white">+62.5K</div>
                <div className="bip-ov-l">Lines of Code</div>
                <div className="bip-ov-sub">from +28.7K in Dec</div>
              </div>
              <div className="bip-ov-card">
                <div className="bip-ov-v">+$14.1K</div>
                <div className="bip-ov-l">Trading PnL</div>
                <div className="bip-ov-sub">Oct 25 – Feb 26</div>
              </div>
              <div className="bip-ov-card">
                <div className="bip-ov-v white">$5,000</div>
                <div className="bip-ov-l">Base Grant</div>
                <div className="bip-ov-sub">Batches 002</div>
              </div>
              <div className="bip-ov-card">
                <div className="bip-ov-v white">7</div>
                <div className="bip-ov-l">Railway Services</div>
                <div className="bip-ov-sub">live in production</div>
              </div>
              <div className="bip-ov-card">
                <div className="bip-ov-v white">2</div>
                <div className="bip-ov-l">Contributors</div>
              </div>
            </div>

            <div className="bip-ov-label">Dev Metrics</div>
            <div className="bip-dm-grid">
              <div className="bip-dm-card">
                <div className="bip-dm-v">~275</div>
                <div className="bip-dm-l">Commits</div>
              </div>
              <div className="bip-dm-card">
                <div className="bip-dm-v">60+</div>
                <div className="bip-dm-l">Features</div>
              </div>
              <div className="bip-dm-card">
                <div className="bip-dm-v">114+</div>
                <div className="bip-dm-l">Bug Fixes</div>
              </div>
              <div className="bip-dm-card">
                <div className="bip-dm-v">631</div>
                <div className="bip-dm-l">Files</div>
              </div>
              <div className="bip-dm-card">
                <div className="bip-dm-v">394</div>
                <div className="bip-dm-l">Source Files</div>
              </div>
              <div className="bip-dm-card">
                <div className="bip-dm-v">7</div>
                <div className="bip-dm-l">Services</div>
              </div>
              <div className="bip-dm-card">
                <div className="bip-dm-v">2</div>
                <div className="bip-dm-l">Contributors</div>
              </div>
            </div>

            <div className="bip-cc-box">
              <div className="bip-cc-title">Commits by Month — Oct 2025 to Mar 2026</div>
              <div className="bip-cc-bars">
                {COMMIT_DATA.map((d) => {
                  const h = Math.round((d.count / MAX_COUNT) * CHART_MAX_PX);
                  return (
                    <div className="bip-cc-bar" key={d.month}>
                      <div className="bip-cc-count">{d.count}</div>
                      <div
                        className="bip-cc-fill"
                        style={{ height: 0 }}
                        data-h={h}
                      />
                      <div className="bip-cc-month">{d.month}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── 02 Development Timeline ── */}
          <section className="bip-sec bip-reveal">
            <div className="bip-sec-num">02 — Development Timeline</div>
            <h2 className="bip-sec-h">What shipped, when.</h2>
            <p className="bip-sec-sub">Chronological build log from inception. Every module linked to its commit.</p>

            {/* April 2026 — In Progress */}
            <div className="bip-tl-month bip-reveal">
              <div className="bip-tl-head">
                <span className="bip-tl-name">April 2026</span>
                <span className="bip-tl-badge active">In Progress</span>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Agent Trading Vault Infrastructure</div>
                <p className="bip-tl-item-p">Vault smart contracts, agent execution framework, and deposit/withdrawal flows. Strategies being tested with $100K of project capital across NBA, Soccer, and Geopolitics prediction market vaults. Public launch targeted Q3 2026.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag green">Vaults</span>
                  <span className="bip-tag blue">Smart Contracts</span>
                  <span className="bip-tag">Agents</span>
                  <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer" className="bip-link">Browse Repo</a>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">LLM Orchestration Layer</div>
                <p className="bip-tl-item-p">Unifying all data modules — market data, trader profiles, position context — into a single agent reasoning layer for trade decision-making.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag green">AI</span>
                  <span className="bip-tag">Architecture</span>
                  <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer" className="bip-link">Browse Repo</a>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">YLDR Token Sale — Early Access</div>
                <p className="bip-tl-item-p">Tier 1 early access at $12M FDV. 50% into Base USDC vault earning 4.5% APY, 50% YLDR allocation. Token consumed by agent cycles — deflationary by design.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag green">Token</span>
                  <span className="bip-tag green">Live</span>
                  <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer" className="bip-link">Browse Repo</a>
                </div>
              </div>
            </div>

            {/* March 2026 — Complete */}
            <div className="bip-tl-month bip-reveal">
              <div className="bip-tl-head">
                <span className="bip-tl-name">March 2026</span>
                <span className="bip-tl-badge complete">Complete</span>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Agent Monitoring System</div>
                <p className="bip-tl-item-p">Scheduled background worker evaluates user-defined monitoring tasks at configurable intervals. Claude Haiku evaluator analyses tool-call output against position context — generates alerts with severity levels and per-indicator signal pills. Full CRUD via MCP tool.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag green">Claude AI</span>
                  <span className="bip-tag blue">MCP</span>
                  <span className="bip-tag">LLM Tooling</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/2b233c8" target="_blank" rel="noopener noreferrer" className="bip-link">DB+CRUD</a>
                    <a href="https://github.com/robbin2102/yieldr-app/commit/bf51ec3" target="_blank" rel="noopener noreferrer" className="bip-link">Scheduler</a>
                    <a href="https://github.com/robbin2102/yieldr-app/commit/4aad003" target="_blank" rel="noopener noreferrer" className="bip-link">MCP Tool</a>
                    <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/monitoring-scheduler" target="_blank" rel="noopener noreferrer" className="bip-link">Browse Service</a>
                  </div>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Agent Explorer &amp; Detail Pages</div>
                <p className="bip-tl-item-p">Agent cards with live status, signal pills, alert counts, last-run timestamps. Detail view with per-indicator market read panel, alerts history. Terminal-style redesign of the agent chat page.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag">UI</span>
                  <span className="bip-tag">Agents</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/bf1036b" target="_blank" rel="noopener noreferrer" className="bip-link">Explorer+Detail</a>
                    <a href="https://github.com/robbin2102/yieldr-app/commit/2dbb790" target="_blank" rel="noopener noreferrer" className="bip-link">Terminal Redesign</a>
                    <a href="https://github.com/robbin2102/yieldr-app/tree/main/app/agents" target="_blank" rel="noopener noreferrer" className="bip-link">Browse Pages</a>
                  </div>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Agent Launch UI &amp; Onboarding</div>
                <p className="bip-tl-item-p">Agent creation flow: name availability check, market selection (Perps / Predictions / Liquidity), wallet connect. Auto-redirect for returning users. Wallet-first authentication.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag">UI</span>
                  <span className="bip-tag">Design</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/tree/main/app/demo" target="_blank" rel="noopener noreferrer" className="bip-link">Browse Pages</a>
                  </div>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Binance Derivatives Fetcher</div>
                <p className="bip-tl-item-p">8h settled funding rates + 1h predicted premium index. OI history at 15-minute granularity. Long/short ratio tracking. 7-day backfill on startup across 100 tracked coins. Deployed to Railway.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag">Railway</span>
                  <span className="bip-tag">Data Infra</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/5b3b15d" target="_blank" rel="noopener noreferrer" className="bip-link">View Code</a>
                    <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/binance-fetcher" target="_blank" rel="noopener noreferrer" className="bip-link">Browse Service</a>
                  </div>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">AI Hedge Fund — Trader Profiler v2</div>
                <p className="bip-tl-item-p">Deep profiling of Polymarket traders: corrected win rate, cashflow-based profit factor, ROCE per timeframe (1d/7d/15d/30d), PnL consistency scoring. Insider detection score, whale classification, category sub-leagues.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag green">AI</span>
                  <span className="bip-tag">Polymarket</span>
                  <span className="bip-tag">Research</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/fa03254" target="_blank" rel="noopener noreferrer" className="bip-link">View Code</a>
                    <a href="https://github.com/robbin2102/yieldr-app/tree/main/scripts/ai-hedge-fund" target="_blank" rel="noopener noreferrer" className="bip-link">Browse Script</a>
                  </div>
                </div>
              </div>
            </div>

            {/* February 2026 — Complete */}
            <div className="bip-tl-month bip-reveal">
              <div className="bip-tl-head">
                <span className="bip-tl-name">February 2026</span>
                <span className="bip-tl-badge complete">Complete</span>
              </div>
              <div className="bip-tl-highlight win">Base Batches 002 — Builder Track Winner</div>
              <div className="bip-tl-highlight vision">
                <strong>Product Vision (Feb 2026):</strong> An AI-native hedge fund platform with three agent roles — Quant, Trader, and PM — that level up every participant in DeFi. Retail users launch a Quant Agent to discover alpha, a Trader Agent to execute it, and a PM Agent to manage risk across their portfolio. Top traders launch onchain funds managed by agents: accept deposits, deploy capital within predefined risk parameters, and earn 2/20 hedge fund fees — entirely onchain.
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Market Intelligence Service</div>
                <p className="bip-tl-item-p">Hourly technical data ingestion for top 100 crypto assets. TAAPI: 20+ indicators per coin (RSI, MACD, EMA, Bollinger, ADX, Ichimoku, Supertrend, Fibonacci, Squeeze Momentum, 60+ candlestick patterns). CoinGlass: liquidation data, taker volume, basis. Coinbase OHLCV candles. Daily macro: BTC/ETH ETF flows, Fear & Greed, stablecoin mcap. Dynamic coin list from top 100 by OI. Deployed to Railway.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag">Railway</span>
                  <span className="bip-tag blue">LLM Tooling</span>
                  <span className="bip-tag">Data Infra</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/9170b00" target="_blank" rel="noopener noreferrer" className="bip-link">View Code</a>
                    <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/market-intelligence" target="_blank" rel="noopener noreferrer" className="bip-link">Browse Service</a>
                  </div>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">MCP Server — 7 Market Intelligence Tools</div>
                <p className="bip-tl-item-p">get_market_snapshot, fetch_live_indicator, get_macro_snapshot, get_funding_rate_history, get_funding_rate_current, get_derivatives_history, get_coin_price. Full real-time market context for the AI agent.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag blue">MCP</span>
                  <span className="bip-tag green">Claude AI</span>
                  <span className="bip-tag blue">LLM Tooling</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/0531350" target="_blank" rel="noopener noreferrer" className="bip-link">Macro+3tools</a>
                    <a href="https://github.com/robbin2102/yieldr-app/commit/f892ff3" target="_blank" rel="noopener noreferrer" className="bip-link">Derivatives+Funding</a>
                    <a href="https://github.com/robbin2102/yieldr-app/commit/2031f6d" target="_blank" rel="noopener noreferrer" className="bip-link">Price tool</a>
                    <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/mcp-server/src/tools/market" target="_blank" rel="noopener noreferrer" className="bip-link">Browse Tools</a>
                  </div>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Market Data Context Services (initial pipeline)</div>
                <p className="bip-tl-item-p">TAAPI bulk fetcher prototype with multi-batch candlestick pattern detection. Fibonacci/PSAR/Squeeze structure indicators via direct GET fallback.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag blue">LLM Tooling</span>
                  <span className="bip-tag">Data Infra</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/90c40be" target="_blank" rel="noopener noreferrer" className="bip-link">Multi-coin fetch</a>
                    <a href="https://github.com/robbin2102/yieldr-app/commit/51cd4e2" target="_blank" rel="noopener noreferrer" className="bip-link">Structure indicators</a>
                  </div>
                </div>
              </div>
            </div>

            {/* January 2026 — Complete */}
            <div className="bip-tl-month bip-reveal">
              <div className="bip-tl-head">
                <span className="bip-tl-name">January 2026</span>
                <span className="bip-tl-badge complete">Complete</span>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Top Wallets Swap Monitoring</div>
                <p className="bip-tl-item-p">Avantis event listener: real-time onchain trade event indexing (open/close/liquidation) via EventListener + EventCorrelator + MetricsComputer. Hyperliquid indexer: backfiller + live position tracking for top 1,500+ wallets.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag">Base</span>
                  <span className="bip-tag">Avantis</span>
                  <span className="bip-tag">Hyperliquid</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/avantis-listener" target="_blank" rel="noopener noreferrer" className="bip-link">Avantis Listener</a>
                    <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/hyperliquid-indexer" target="_blank" rel="noopener noreferrer" className="bip-link">Hyperliquid Indexer</a>
                  </div>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Wallet Performance Metrics Service</div>
                <p className="bip-tl-item-p">Extended MetricsComputer: PnL consistency scoring, ROCE trending, trading-day frequency analysis. Per-wallet 30d metrics powering get_top_perp_traders MCP tool.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag">Analytics</span>
                  <span className="bip-tag blue">LLM Tooling</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/tree/main/services/mcp-server/src/tools/top-traders" target="_blank" rel="noopener noreferrer" className="bip-link">Browse Tools</a>
                  </div>
                </div>
              </div>
            </div>

            {/* December 2025 — Complete */}
            <div className="bip-tl-month bip-reveal">
              <div className="bip-tl-head">
                <span className="bip-tl-name">December 2025</span>
                <span className="bip-tl-badge complete">Complete</span>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Prediction Markets Monitoring</div>
                <p className="bip-tl-item-p">Top traders activity tracking on prediction markets.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag">Polymarket</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/d3f0549" target="_blank" rel="noopener noreferrer" className="bip-link">View Code</a>
                  </div>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Trending Tokens Service</div>
                <p className="bip-tl-item-p">Top 100 trending tokens monitoring on Base.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag">Base</span>
                  <span className="bip-tag blue">LLM Tooling</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/b7c7986" target="_blank" rel="noopener noreferrer" className="bip-link">View Code</a>
                  </div>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Early Access Landing + Payments</div>
                <p className="bip-tl-item-p">Token purchase flow with wallet connect integration.</p>
                <div className="bip-tl-tags">
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/948e8e2" target="_blank" rel="noopener noreferrer" className="bip-link">View Code</a>
                  </div>
                </div>
              </div>
            </div>

            {/* November 2025 — Complete */}
            <div className="bip-tl-month bip-reveal">
              <div className="bip-tl-head">
                <span className="bip-tl-name">November 2025</span>
                <span className="bip-tl-badge complete">Complete</span>
              </div>
              <div className="bip-tl-highlight win">Base Batches 002 — Finalist</div>
              <div className="bip-tl-highlight vision">
                <strong>Product Vision (Nov 2025):</strong> AI-enabled decentralised asset management. Investors discover top traders and fund managers onchain. Traders validate performance, raise capital, and scale to fund management — powered by AI agents as the intelligence layer and smart contracts as the trust layer.
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Real-time Trades Monitoring</div>
                <p className="bip-tl-item-p">Live trade feed service for top traders across perpetual protocols.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag">Avantis</span>
                  <span className="bip-tag">Hyperliquid</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/04b60e8" target="_blank" rel="noopener noreferrer" className="bip-link">View Code</a>
                  </div>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Performance Metrics Service</div>
                <p className="bip-tl-item-p">ROI, win rate, drawdown, Sharpe ratio calculations for trader ranking.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag">Avantis</span>
                  <span className="bip-tag">Hyperliquid</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/cb4b121" target="_blank" rel="noopener noreferrer" className="bip-link">View Code</a>
                  </div>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">Liquidity Positions Analyser</div>
                <p className="bip-tl-item-p">LP position tracking with impermanent loss calculations and fee earnings.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag">Uniswap</span>
                  <span className="bip-tag">Aerodrome</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/703251b" target="_blank" rel="noopener noreferrer" className="bip-link">View Code</a>
                  </div>
                </div>
              </div>
            </div>

            {/* October 2025 — Complete */}
            <div className="bip-tl-month bip-reveal">
              <div className="bip-tl-head">
                <span className="bip-tl-name">October 2025</span>
                <span className="bip-tl-badge complete">Complete</span>
              </div>
              <div className="bip-tl-highlight win">Base Batches — Submission</div>
              <div className="bip-tl-highlight vision">
                <strong>Product Vision:</strong> Decentralized Asset Management. Investors discover top traders across perps &amp; liquidity markets and coinvest with them. Traders raise &amp; manage funds onchain with risk controls coded in smart contracts.
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">MVP v1.0 — Top Traders Indexing + Onboarding</div>
                <p className="bip-tl-item-p">Wallet connection with automatic scanning. Live position data indexing from perpetual protocols. Deployed on final day of submission (Oct 24).</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag">Avantis</span>
                  <span className="bip-tag">Hyperliquid</span>
                  <span className="bip-tag">GitHub</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/516071e" target="_blank" rel="noopener noreferrer" className="bip-link">View Code</a>
                    <a href="https://github.com/robbin2102/yieldr-app/commit/a729e9d" target="_blank" rel="noopener noreferrer" className="bip-link">Legacy App</a>
                  </div>
                </div>
              </div>
              <div className="bip-tl-item">
                <div className="bip-tl-item-h">AI Trading Test Launch</div>
                <p className="bip-tl-item-p">Claude AI-allocated $5K account for live perp trading validation. Foundation for verifying the agent-assisted trading thesis.</p>
                <div className="bip-tl-tags">
                  <span className="bip-tag green">Claude AI</span>
                  <span className="bip-tag">Avantis</span>
                  <div className="bip-links">
                    <a href="https://github.com/robbin2102/yieldr-app/commit/50a4a07" target="_blank" rel="noopener noreferrer" className="bip-link">View Code</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 03 Roadmap ── */}
          <section className="bip-sec bip-reveal">
            <div className="bip-sec-num">03 — Roadmap</div>
            <h2 className="bip-sec-h">What&apos;s next</h2>
            <p className="bip-sec-sub">Active items only. No vaporware.</p>
            <div className="bip-rm-grid">
              <div className="bip-rm-card">
                <div className="bip-rm-status active">Active</div>
                <div className="bip-rm-h">Agent Trading Vaults</div>
                <p className="bip-rm-p">$100K live testing across NBA, Soccer, and Geopolitics vaults. Smart contract infrastructure for public deposits and performance fees. Target: Q3 2026.</p>
              </div>
              <div className="bip-rm-card">
                <div className="bip-rm-status active">Active</div>
                <div className="bip-rm-h">YLDR Early Access</div>
                <p className="bip-rm-p">Token sale at $12M FDV. 50% USDC vault (4.5% APY), 50% YLDR allocation. Burn-for-access utility model. TGE Q1 2027.</p>
              </div>
              <div className="bip-rm-card">
                <div className="bip-rm-status planned">Planned</div>
                <div className="bip-rm-h">Actionable Insights Engine</div>
                <p className="bip-rm-p">Alpha generation from market + trader data combined. Move from here&apos;s what&apos;s happening to here&apos;s what to do about it.</p>
              </div>
              <div className="bip-rm-card">
                <div className="bip-rm-status planned">Planned</div>
                <div className="bip-rm-h">Onchain 2/20 Fees</div>
                <p className="bip-rm-p">Any trader can launch a vault, invite depositors, and earn hedge fund-style performance fees entirely onchain with smart contract enforcement.</p>
              </div>
            </div>
          </section>

          </div>{/* /bip-wrap */}
        </main>

        {/* CTA */}
        <div className="bip-cta">
          <div className="bip-cta-h">Ready to put capital to work?</div>
          <p className="bip-cta-p">Join the early access. Token sale live now at $12M FDV.</p>
          <Link href="/vaults" className="bip-btn">Enter Vaults ↗</Link>
        </div>

        {/* Footer */}
        <footer className="bip-footer">
          <div className="bip-footer-soc">
            <a href={TWITTER} target="_blank" rel="noopener noreferrer"><IconX /></a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer"><IconGH /></a>
          </div>
          <p className="bip-footer-txt">Built different. Updated monthly. All figures real.</p>
          <p className="bip-footer-end">Yieldr © 2025–2026 · Delaware C-Corp · <a href={GITHUB}>Open on GitHub</a></p>
        </footer>

      </div>
    </>
  );
}
