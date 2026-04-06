'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import './bip.css';

const GITHUB  = 'https://github.com/robbin2102/yieldr-app';
const TWITTER = 'https://x.com/yieldrdotorg';

const commits = [
  { month: 'Oct', count: 43 },
  { month: 'Nov', count: 48 },
  { month: 'Dec', count: 62 },
  { month: 'Jan', count: 10 },
  { month: 'Feb', count: 12 },
  { month: 'Mar', count: 110 },
];

export default function BuildInPublicPage() {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Commit chart animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const fills = document.querySelectorAll<HTMLDivElement>('.cc-fill');
          fills.forEach((f, i) => {
            setTimeout(() => { f.style.height = f.dataset.h + 'px'; }, i * 100);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const chartEl = document.querySelector('.commit-chart');
    if (chartEl) observer.observe(chartEl);

    // Reveal animations
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    return () => {
      observer.disconnect();
      revealObs.disconnect();
    };
  }, []);

  const maxC = Math.max(...commits.map(c => c.count));

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div className="grid-overlay" />
      <div className="scanline" />

      <nav>
        <div className="nav-l">
          <svg className="nav-logo" viewBox="0 0 100 120"><path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#00E87B"/><ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3"/><circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9"/></svg>
          <span className="nav-brand">YIELDR</span>
        </div>
        <div className="nav-r">
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/vaults">Vaults</Link>
            <Link href="/build-in-public" className="active">Build Log</Link>
          </div>
          <div className="nav-soc">
            <a href={TWITTER} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
          </div>
          <Link href="/vaults" className="nav-cta">Enter Vaults &#8599;</Link>
        </div>
      </nav>

      <main className="bip-main">

        {/* PAGE HERO */}
        <div className="page-hero">
          <div className="updated">Updated monthly &middot; Week 1 Mar 2026 &middot; 275+ commits shipped</div>
          <h1>Building in Public</h1>
          <div className="sub">Transparent development. <strong>No bullshit.</strong> Real treasury data, real trading performance, real commit history. Every module, every expense, tracked openly from day one.</div>
          <div className="badges">
            <div className="badge green"><img src="https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760730551690x161831425309488800/_base-square%20%282%29.svg" alt="Base" /> Base Batches 002 Winner</div>
            <div className="badge">6 Months In</div>
            <div className="badge">Delaware C-Corp</div>
            <div className="badge">~275 Commits</div>
            <div className="badge">2 Contributors</div>
          </div>
        </div>

        {/* 01 OVERVIEW */}
        <div className="overview reveal">
          <div className="sec-num">01 — Overview</div>
          <div className="ov-label">By the numbers — running totals since October 2025</div>
          <div className="ov-grid">
            <div className="ov-card"><div className="ov-v white">6</div><div className="ov-l">Months Building</div></div>
            <div className="ov-card"><div className="ov-v">+62.5K</div><div className="ov-l">Lines of Code</div><div className="ov-sub">from +28.7K in Dec</div></div>
            <div className="ov-card"><div className="ov-v white">$10K</div><div className="ov-l">Base Grant</div><div className="ov-sub">Batches 002</div></div>
            <div className="ov-card"><div className="ov-v white">3</div><div className="ov-l">Vaults in Testing</div><div className="ov-sub">$100K capital</div></div>
          </div>
        </div>

        {/* DEV METRICS */}
        <div className="dev-metrics reveal">
          <div className="ov-label">Development Metrics</div>
          <div className="dm-grid">
            <div className="dm-card"><div className="dm-v">~275</div><div className="dm-l">Commits</div></div>
            <div className="dm-card"><div className="dm-v">60+</div><div className="dm-l">Features</div></div>
            <div className="dm-card"><div className="dm-v">114+</div><div className="dm-l">Bug Fixes</div></div>
            <div className="dm-card"><div className="dm-v">631</div><div className="dm-l">Files</div></div>
            <div className="dm-card"><div className="dm-v">394</div><div className="dm-l">Source Files</div></div>
            <div className="dm-card"><div className="dm-v">2</div><div className="dm-l">Contributors</div></div>
          </div>
        </div>

        {/* COMMIT CHART */}
        <div className="commit-chart reveal">
          <div className="cc-box">
            <div className="cc-title">Commits by month</div>
            <div className="cc-bars" ref={barsRef}>
              {commits.map((c) => {
                const h = Math.max(4, (c.count / maxC) * 90);
                return (
                  <div key={c.month} className="cc-bar">
                    <div className="cc-count">{c.count}</div>
                    <div className="cc-fill" style={{ height: 0 }} data-h={h} />
                    <div className="cc-month">{c.month}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 02 DEVELOPMENT TIMELINE */}
        <div className="content-section reveal">
          <div className="sec-divider">
            <div className="sec-num">02 — Development Timeline</div>
            <div className="sec-h">What shipped, when.</div>
            <div className="sec-sub">Chronological build log from inception. The data infrastructure, agent tooling, and market intelligence layer that powers the trading vaults.</div>
          </div>

          <div className="timeline">

            {/* APRIL 2026 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">April – Q3 2026</span>
                <span className="tl-month-badge active">&#9679; In Progress</span>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Agent Trading Vault Infrastructure</div>
                <div className="tl-item-p">Vault smart contracts, agent execution framework, and deposit/withdrawal flows. Strategies being tested with $100K of project capital across NBA, Soccer, and Geopolitics prediction market vaults. Public launch targeted Q3 2026.</div>
                <div className="tl-tags"><span className="tl-tag green">Vaults</span><span className="tl-tag">Smart Contracts</span><span className="tl-tag">Agents</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">LLM Orchestration Layer</div>
                <div className="tl-item-p">Unifying all data modules — market data, trader profiles, position context — into a single agent reasoning layer for trade decision-making.</div>
                <div className="tl-tags"><span className="tl-tag">AI</span><span className="tl-tag">Architecture</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">YLDR Token Sale — Early Access</div>
                <div className="tl-item-p">Tier 1 early access at $9M FDV. 50% into Base USDC vault earning 4.5% APY, 50% YLDR allocation. Token consumed by agent cycles — deflationary by design.</div>
                <div className="tl-tags"><span className="tl-tag green">Token</span><span className="tl-tag">Live</span></div>
              </div>
            </div>

            {/* MARCH 2026 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">March 2026</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Agent Monitoring System</div>
                <div className="tl-item-p">Scheduled background worker evaluates user-defined monitoring tasks at configurable intervals. Claude Haiku evaluator analyses tool-call output against position context — generates alerts with severity levels and per-indicator signal pills. Full CRUD via MCP tool.</div>
                <div className="tl-tags"><span className="tl-tag">Claude AI</span><span className="tl-tag">MCP</span><span className="tl-tag">LLM Tooling</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Agent Explorer &amp; Detail Pages</div>
                <div className="tl-item-p">Agent cards with live status, signal pills, alert counts, last-run timestamps. Detail view with per-indicator market read panel (green/yellow/red signals), alerts history. Terminal-style redesign of the agent chat page.</div>
                <div className="tl-tags"><span className="tl-tag">UI</span><span className="tl-tag">Agents</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Agent Launch UI &amp; Onboarding</div>
                <div className="tl-item-p">Agent creation flow: name availability check, market selection (Perps / Predictions / Liquidity), wallet connect. Auto-redirect for returning users. Wallet-first authentication.</div>
                <div className="tl-tags"><span className="tl-tag">UI</span><span className="tl-tag">Design</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Binance Derivatives Fetcher</div>
                <div className="tl-item-p">8h settled funding rates + 1h predicted premium index. OI history at 15-minute granularity. Long/short ratio tracking. 7-day backfill on startup across 100 tracked coins. Deployed to Railway.</div>
                <div className="tl-tags"><span className="tl-tag">Railway</span><span className="tl-tag">Data Infra</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">AI Hedge Fund — Trader Profiler v2</div>
                <div className="tl-item-p">Deep profiling of Polymarket traders: corrected win rate, cashflow-based profit factor, ROCE per timeframe (1d/7d/15d/30d), PnL consistency scoring. Insider detection score, whale classification, category sub-leagues. Foundation for the vault strategy engine.</div>
                <div className="tl-tags"><span className="tl-tag">AI</span><span className="tl-tag">Polymarket</span><span className="tl-tag">Research</span></div>
              </div>
            </div>

            {/* FEBRUARY 2026 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">February 2026</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-highlight win">&#127942; Base Batches 002 — Builder Track Winner</div>
              <div className="tl-item">
                <div className="tl-item-h">Market Intelligence Service</div>
                <div className="tl-item-p">Hourly technical data ingestion for top 100 crypto assets. TAAPI: 20+ indicators per coin (RSI, MACD, EMA, Bollinger, ADX, Ichimoku, Supertrend, Fibonacci, 60+ candlestick patterns). CoinGlass: liquidation data, taker volume, basis. Coinbase OHLCV candles. Daily macro: BTC/ETH ETF flows, Fear &amp; Greed, stablecoin mcap. Dynamic coin list from top 100 by OI. Deployed to Railway.</div>
                <div className="tl-tags"><span className="tl-tag">Railway</span><span className="tl-tag">LLM Tooling</span><span className="tl-tag">Data Infra</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">MCP Server — 7 New Market Intelligence Tools</div>
                <div className="tl-item-p">get_market_snapshot, fetch_live_indicator, get_macro_snapshot, get_funding_rate_history, get_funding_rate_current, get_derivatives_history, get_coin_price. Full real-time market context for the AI agent.</div>
                <div className="tl-tags"><span className="tl-tag">MCP</span><span className="tl-tag">Claude AI</span><span className="tl-tag">LLM Tooling</span></div>
              </div>
            </div>

            {/* JANUARY 2026 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">January 2026</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Top Wallets Swap Monitoring</div>
                <div className="tl-item-p">Avantis event listener: real-time onchain trade event indexing (open/close/liquidation). Hyperliquid indexer: backfiller + live position tracking for top 1,500+ wallets.</div>
                <div className="tl-tags"><span className="tl-tag">Base</span><span className="tl-tag">Avantis</span><span className="tl-tag">Hyperliquid</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Wallet Performance Metrics Service</div>
                <div className="tl-item-p">PnL consistency scoring, ROCE trending, trading-day frequency analysis. Per-wallet 30d metrics powering the get_top_perp_traders MCP tool.</div>
                <div className="tl-tags"><span className="tl-tag">Analytics</span><span className="tl-tag">LLM Tooling</span></div>
              </div>
            </div>

            {/* DECEMBER 2025 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">December 2025</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Prediction Markets Monitoring</div>
                <div className="tl-item-p">Top traders activity tracking on prediction markets.</div>
                <div className="tl-tags"><span className="tl-tag">Polymarket</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Trending Tokens Service</div>
                <div className="tl-item-p">Top 100 trending tokens monitoring on Base.</div>
                <div className="tl-tags"><span className="tl-tag">Base</span><span className="tl-tag">LLM Tooling</span></div>
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
              <div className="tl-item">
                <div className="tl-item-h">Real-time Trades Monitoring</div>
                <div className="tl-item-p">Live trade feed service for top traders across perpetual protocols.</div>
                <div className="tl-tags"><span className="tl-tag">Avantis</span><span className="tl-tag">Hyperliquid</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Performance Metrics Service</div>
                <div className="tl-item-p">ROI, win rate, drawdown, Sharpe ratio calculations for trader ranking.</div>
                <div className="tl-tags"><span className="tl-tag">Avantis</span><span className="tl-tag">Hyperliquid</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">Liquidity Positions Analyser</div>
                <div className="tl-item-p">LP position tracking with impermanent loss calculations and fee earnings.</div>
                <div className="tl-tags"><span className="tl-tag">Uniswap</span><span className="tl-tag">Aerodrome</span></div>
              </div>
            </div>

            {/* OCTOBER 2025 */}
            <div className="tl-month">
              <div className="tl-month-head">
                <span className="tl-month-name">October 2025</span>
                <span className="tl-month-badge complete">&#10003; Complete</span>
              </div>
              <div className="tl-highlight win">&#127942; Base Batches — Submission</div>
              <div className="tl-item">
                <div className="tl-item-h">MVP v1.0 — Top Traders Indexing + Onboarding</div>
                <div className="tl-item-p">Wallet connection with automatic scanning. Live position data indexing from perpetual protocols. Deployed on final day of submission (Oct 24).</div>
                <div className="tl-tags"><span className="tl-tag">Avantis</span><span className="tl-tag">Hyperliquid</span><span className="tl-tag">GitHub</span></div>
              </div>
              <div className="tl-item">
                <div className="tl-item-h">AI Trading Test Launch</div>
                <div className="tl-item-p">Claude AI-allocated $5K account for live perp trading validation. Foundation for verifying the agent-assisted trading thesis.</div>
                <div className="tl-tags"><span className="tl-tag">Claude AI</span><span className="tl-tag">Avantis</span></div>
              </div>
            </div>

          </div>
        </div>

        {/* 03 ROADMAP */}
        <div className="content-section reveal">
          <div className="sec-divider">
            <div className="sec-num">03 — Roadmap</div>
            <div className="sec-h">What&apos;s next</div>
            <div className="sec-sub">No vapourware — only things actively being scoped and built.</div>
          </div>
          <div className="roadmap-grid">
            <div className="rm-card">
              <div className="rm-status active">&#9679; Active</div>
              <div className="rm-h">Agent Trading Vaults</div>
              <div className="rm-p">$100K live testing across NBA, Soccer, and Geopolitics vaults. Smart contract infrastructure for public deposits and performance fees. Target: Q3 2026.</div>
            </div>
            <div className="rm-card">
              <div className="rm-status active">&#9679; Active</div>
              <div className="rm-h">YLDR Early Access</div>
              <div className="rm-p">Token sale at $9M FDV. 50% USDC vault (4.5% APY), 50% YLDR allocation. Burn-for-access utility model. TGE Q1 2027.</div>
            </div>
            <div className="rm-card">
              <div className="rm-status planned">&#9675; Planned</div>
              <div className="rm-h">Actionable Insights Engine</div>
              <div className="rm-p">Alpha generation from market + trader data combined. Move from &quot;here&apos;s what&apos;s happening&quot; to &quot;here&apos;s what to do about it.&quot;</div>
            </div>
            <div className="rm-card">
              <div className="rm-status planned">&#9675; Planned</div>
              <div className="rm-h">Onchain 2/20 Fees</div>
              <div className="rm-p">Any trader can launch a vault, invite depositors, and earn hedge fund-style performance fees — fully onchain with smart contract enforcement.</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="build-cta reveal">
          <div className="build-cta-h">The infrastructure is built. The vaults are trading.</div>
          <div className="build-cta-p">Six months of shipping. Now open for early access.</div>
          <Link href="/vaults" className="btn-p">Enter Vaults — Early Access &#8599;</Link>
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
