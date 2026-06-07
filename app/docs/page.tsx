'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './docs.css';

const SECTION_IDS = ['what-is-yieldr', 'problem', 'solution', 'product', 'vision', 'roadmap', 'tokenomics', 'connect'];

export default function DocsPage() {
  const [activeId, setActiveId] = useState('what-is-yieldr');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function setActive() {
      const sections = document.querySelectorAll('main.docs-main section');
      let current = '';
      sections.forEach((sec) => {
        const top = sec.getBoundingClientRect().top;
        if (top <= 120) current = sec.id;
      });
      if (current) setActiveId(current);
    }
    window.addEventListener('scroll', setActive);
    setActive();
    return () => window.removeEventListener('scroll', setActive);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSidebarOpen(false);
  };

  const openSidebar = () => { setSidebarOpen(true); document.body.style.overflow = 'hidden'; };
  const closeSidebar = () => { setSidebarOpen(false); document.body.style.overflow = ''; };

  const sbLink = (id: string, num: string | null, label: string) => (
    <a
      key={id}
      className={`docs-sb-link${activeId === id ? ' active' : ''}`}
      onClick={() => scrollTo(id)}
    >
      {num && <span className="docs-sb-link-num">{num}</span>}
      {label}
    </a>
  );

  return (
    <div className="docs-root">
      <div className="docs-grid-overlay" />
      <div className="docs-scanline" />

      {/* NAV */}
      <nav className="docs-topnav">
        <div className="docs-nav-l">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <svg className="docs-nav-logo" viewBox="0 0 100 120" fill="none">
              <path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#00E87B" />
              <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3" />
              <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9" />
            </svg>
            <span className="docs-nav-brand">YIELDR</span>
          </Link>
        </div>
        <div className="docs-nav-r">
          <Link href="/">Home</Link>
          <Link href="/vaults">Vaults</Link>
          <Link href="/docs" className="active">Docs</Link>
          <Link href="/build-in-public">Build Log</Link>
          <Link href="/vaults" className="docs-nav-cta">Enter Vaults ↗</Link>
          <button className="docs-nav-hamburger" onClick={openSidebar} aria-label="Open docs menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`docs-sb-overlay${sidebarOpen ? ' visible' : ''}`}
        onClick={closeSidebar}
      />

      <div className="docs-layout">

        {/* SIDEBAR */}
        <aside className={`docs-aside${sidebarOpen ? ' open' : ''}`} id="docs-sidebar">
          <button className="docs-sb-close" onClick={closeSidebar} aria-label="Close menu">✕</button>

          <div className="docs-sb-section">
            <div className="docs-sb-title">Start Here</div>
            {sbLink('what-is-yieldr', '01', 'What is Yieldr?')}
            {sbLink('problem', '02', 'The Problem')}
            {sbLink('solution', '03', 'The Solution')}
          </div>
          <div className="docs-sb-section">
            <div className="docs-sb-title">Product</div>
            {sbLink('product', '04', 'Vaults & Agent Stack')}
          </div>
          <div className="docs-sb-section">
            <div className="docs-sb-title">Vision & Roadmap</div>
            {sbLink('vision', '05', 'Vision')}
            {sbLink('roadmap', '06', 'Roadmap')}
          </div>
          <div className="docs-sb-section">
            <div className="docs-sb-title">YLDR Token</div>
            {sbLink('tokenomics', '07', 'Tokenomics')}
          </div>
          <div className="docs-sb-section">
            <div className="docs-sb-title">Connect</div>
            {sbLink('connect', null, 'Telegram, X, GitHub')}
          </div>
        </aside>

        {/* MAIN */}
        <main className="docs-main">

          {/* HERO */}
          <div className="docs-page-tag">Documentation · v1.0 · Updated May 2026</div>
          <h1 className="docs-page-h1">The platform for <strong>AI-native hedge funds</strong> onchain.</h1>
          <p className="docs-page-sub">
            Top traders launch vaults and let agents run the fund. Investors deploy capital and let agents run the portfolio.{' '}
            <strong>Every part of fund operations and capital allocation that doesn&apos;t require a human is handled by the agent stack.</strong>
          </p>

          {/* 01 — WHAT IS YIELDR */}
          <section id="what-is-yieldr">
            <div className="docs-sec-num">01 — What is Yieldr?</div>
            <h2 className="docs-sec-h">A new asset management primitive — the agent-managed fund.</h2>
            <p className="docs-sec-sub">Built to scale to a million operators. Open to anyone with verified edge or capital to allocate.</p>

            <h3>What Yieldr does</h3>
            <div className="callout-row">
              <div className="callout">
                <span className="callout-num">→</span>
                <div className="callout-body">
                  <div className="callout-h">For Traders</div>
                  <p className="callout-p">Launch a vault. Agents handle investor matching, communication, and retention. Stay in your seat.</p>
                </div>
              </div>
              <div className="callout">
                <span className="callout-num">→</span>
                <div className="callout-body">
                  <div className="callout-h">For Investors</div>
                  <p className="callout-p">Set your risk-return target. Agents allocate across vaults continuously and rotate as performance shifts.</p>
                </div>
              </div>
              <div className="callout">
                <span className="callout-num">→</span>
                <div className="callout-body">
                  <div className="callout-h">For the Market</div>
                  <p className="callout-p">A new primitive: the agent-managed fund. Trustless, transparent, global, built for scale.</p>
                </div>
              </div>
            </div>

            <h3>What&apos;s live today</h3>
            <p>Three vaults trading project capital on Polymarket — <strong>NBA Edge</strong>, <strong>Soccer Alpha</strong>, <strong>Geopolitics</strong>. Real performance, public onchain. The proving ground for the agent stack.</p>

            <h3>Why now</h3>
            <p>Verifiable trader performance at scale. Agents capable of real operational and allocation decisions. Smart contracts for non-custodial fund structures. <strong>The pieces exist. Yieldr is the assembly.</strong></p>
          </section>

          {/* 02 — PROBLEM */}
          <section id="problem">
            <div className="docs-sec-num">02 — The Problem</div>
            <h2 className="docs-sec-h">The hedge fund is broken — and DeFi hasn&apos;t fixed it.</h2>
            <p className="docs-sec-sub">
              For 70 years, the hedge fund has been the highest-performing structure in finance. Access has stayed locked behind accreditation walls,
              million-dollar minimums, and jurisdictional moats. The world has produced ~10,000 funds. Millions of traders could run one. Almost none ever will.
            </p>

            <p><strong>DeFi was supposed to fix this. It hasn&apos;t.</strong> Vaults exist as a primitive, but a vault is not a fund.</p>

            <div className="callout-row">
              <div className="callout">
                <span className="callout-num">01</span>
                <div className="callout-body">
                  <div className="callout-h">Traders can launch vaults but can&apos;t grow them</div>
                  <p className="callout-p">Code handles execution. It doesn&apos;t bring in investors, explain the strategy, or hold the relationship through drawdowns. Top traders don&apos;t want to spend time on this, so they don&apos;t scale — and most onchain alpha stays capped at personal capital.</p>
                </div>
              </div>
              <div className="callout">
                <span className="callout-num">02</span>
                <div className="callout-body">
                  <div className="callout-h">Investors can&apos;t allocate across vaults at scale</div>
                  <p className="callout-p">Picking one vault isn&apos;t the job — continuous allocation against a risk-return target is. Which vaults fit my profile? How much in each? When to rotate? No one does this manually, so capital chases the loudest vault and exits at the worst time.</p>
                </div>
              </div>
              <div className="callout">
                <span className="callout-num">03</span>
                <div className="callout-body">
                  <div className="callout-h">The edge stays opaque</div>
                  <p className="callout-p">PnL is visible, strategy isn&apos;t. Capital flows to recent performance instead of underlying edge — and alpha gets crowded and decayed instead of compounded.</p>
                </div>
              </div>
            </div>

            <div className="hero-quote">A market that should have a million funds has a few thousand, and the wrong ones.</div>
          </section>

          {/* 03 — SOLUTION */}
          <section id="solution">
            <div className="docs-sec-num">03 — The Solution</div>
            <h2 className="docs-sec-h">An agent stack that turns every top trader into a fund manager — and every investor into a pro allocator, onchain.</h2>
            <p className="docs-sec-sub">Rebuild the hedge fund as a primitive that scales to a million operators. Agents on both sides.</p>

            <div className="callout-row solution">
              <div className="callout">
                <span className="callout-num">→</span>
                <div className="callout-body">
                  <div className="callout-h">Trader-side agents grow the vault</div>
                  <p className="callout-p">Investor matching by risk profile, transparent communication on performance, expectation management through drawdowns. Traders keep their focus on trading; agents handle everything that determines retention.</p>
                </div>
              </div>
              <div className="callout">
                <span className="callout-num">→</span>
                <div className="callout-body">
                  <div className="callout-h">Investor-side agents run the portfolio</div>
                  <p className="callout-p">Each investor&apos;s agent understands their risk-return goals and continuously allocates across vaults — deploying into strategies that fit, rotating out of underperformers, rebalancing as the landscape shifts.</p>
                </div>
              </div>
              <div className="callout">
                <span className="callout-num">→</span>
                <div className="callout-body">
                  <div className="callout-h">Agents detect and explain edge</div>
                  <p className="callout-p">Not just <em>who</em> wins, but <em>why</em> — entry patterns, sizing logic, market selection, holding periods. Capital flows to verified, understood edge.</p>
                </div>
              </div>
            </div>

            <p>Without the agent stack, every fund still needs human operators on both sides and the structure caps at thousands. <strong>With it, the constraint dissolves — and a million funds onchain becomes inevitable.</strong></p>
          </section>

          {/* 04 — PRODUCT */}
          <section id="product">
            <div className="docs-sec-num">04 — Vaults & Agent Stack</div>
            <h2 className="docs-sec-h">Where top traders run funds and investors allocate capital — both sides operated by agents.</h2>
            <p className="docs-sec-sub">
              A Yieldr vault is a smart contract that holds investor capital, executes the trader&apos;s strategy onchain, and reports performance in real time.
              The vault itself is the fund. Agents handle everything around it.
            </p>

            <h3>The Vault</h3>
            <div className="vault-list-box">
              <ul className="agent-list">
                <li>
                  <span className="agent-list-name">Non-custodial</span>
                  <span className="agent-list-desc">Capital pooled onchain. Investors deposit, withdraw, and track PnL directly through the contract. No intermediary.</span>
                </li>
                <li>
                  <span className="agent-list-name">Trader-operated</span>
                  <span className="agent-list-desc">Execution authorized through the vault. Exact mechanics defined per protocol integration.</span>
                </li>
                <li>
                  <span className="agent-list-name">Live performance</span>
                  <span className="agent-list-desc">Real-time PnL, win rate, drawdown, and trade history visible onchain.</span>
                </li>
                <li>
                  <span className="agent-list-name">Programmable fees</span>
                  <span className="agent-list-desc">Standard 2/20, custom splits, or performance-only — set at vault launch.</span>
                </li>
              </ul>
            </div>

            <h3 style={{ marginTop: 40 }}>The Agent Stack</h3>
            <p>Two agents on each side of the marketplace, plus an edge detection layer that serves both.</p>

            <div className="agent-grid">
              <div className="agent-block">
                <div className="agent-block-h">// Trader-Side Agents</div>
                <div className="agent-block-title">Handle the relationship between a trader and their investors</div>
                <ul className="agent-list">
                  <li>
                    <span className="agent-list-name">Matching</span>
                    <span className="agent-list-desc">Surfaces the vault to investors whose risk-return profiles fit the strategy. Capital finds the vault, no cold marketing required.</span>
                  </li>
                  <li>
                    <span className="agent-list-name">Community</span>
                    <span className="agent-list-desc">Manages investor queries on strategy and performance, explains market context, holds the relationship through drawdowns.</span>
                  </li>
                </ul>
              </div>

              <div className="agent-block">
                <div className="agent-block-h">// Investor-Side Agents</div>
                <div className="agent-block-title">Run the portfolio against the investor&apos;s target</div>
                <ul className="agent-list">
                  <li>
                    <span className="agent-list-name">Allocation</span>
                    <span className="agent-list-desc">Learns the investor&apos;s risk-return goals, then continuously deploys capital across vaults that fit. Sizes positions, rotates out of underperformers, rebalances as the landscape shifts.</span>
                  </li>
                  <li>
                    <span className="agent-list-name">Monitoring</span>
                    <span className="agent-list-desc">Tracks every vault the investor holds. Flags edge decay, strategy drift, or risk creep before it shows up in PnL.</span>
                  </li>
                </ul>
              </div>

              <div className="agent-block">
                <div className="agent-block-h">// Edge Detection</div>
                <div className="agent-block-title">The analytical layer that makes both sides intelligent</div>
                <ul className="agent-list">
                  <li>
                    <span className="agent-list-name">Trade Parsing</span>
                    <span className="agent-list-desc">Parses every trade across every vault to identify what&apos;s actually driving returns — entry timing, sizing logic, market selection, holding periods.</span>
                  </li>
                  <li>
                    <span className="agent-list-name">Edge Validation</span>
                    <span className="agent-list-desc">Distinguishes structural edge from luck and regime-dependent performance. Feeds matching and allocation agents.</span>
                  </li>
                </ul>
              </div>
            </div>

            <h3 style={{ marginTop: 48 }}>What&apos;s Live Today</h3>
            <p>Three vaults trading project capital on Polymarket. Built and operated by Yieldr to prove the agent stack before opening to outside traders.</p>

            <div className="vault-grid">
              <div className="vault-card">
                <span className="vault-pill">LIVE</span>
                <div className="vault-name">🏀 NBA Edge</div>
                <div className="vault-desc">Ranks top NBA prediction market traders by statistical edge, mirrors highest-conviction positions.</div>
              </div>
              <div className="vault-card">
                <span className="vault-pill">LIVE</span>
                <div className="vault-name">⚽ Soccer Alpha</div>
                <div className="vault-desc">Scans soccer markets for traders with statistically impossible edge (p &lt; 0.0001), enters at their price levels.</div>
              </div>
              <div className="vault-card">
                <span className="vault-pill">LIVE</span>
                <div className="vault-name">🌐 Geopolitics</div>
                <div className="vault-desc">Identifies insider wallets with abnormal win rates vs. implied probability, takes positions on geopolitical events.</div>
              </div>
            </div>

            <p style={{ marginTop: 24 }}>
              Live performance, vault sizes, and trade history at{' '}
              <Link href="/vaults">yieldr.org/vaults</Link>.
            </p>
          </section>

          {/* 05 — VISION */}
          <section id="vision">
            <div className="docs-sec-num">05 — Vision</div>
            <h2 className="docs-sec-h">A million AI-native hedge funds onchain.</h2>
            <p className="docs-sec-sub">
              For 70 years, the hedge fund has been the highest-performing structure in finance — and the most exclusive.
              Running one requires capital, infrastructure, and operational scale that perhaps 10,000 managers worldwide have ever assembled.
              Investing in one requires accreditation, networks, and minimums that exclude almost everyone.
            </p>

            <p>The result is a market designed for scarcity. The best traders never become managers. The best capital never reaches them. The structure caps the total amount of alpha the world can produce.</p>

            <p>DeFi has the technology to break this open. Vaults are global. Capital is permissionless. Performance is verifiable onchain by anyone, anywhere. <strong>The only missing piece is the operational layer — the part that turns a smart contract into a functioning fund and an investor into an active allocator.</strong></p>

            <p>Agents are that layer.</p>

            <p>When agents handle investor matching, communication, allocation, and monitoring, the constraint that capped the world at 10,000 funds dissolves. A trader in Seoul, São Paulo, or Lagos with verified edge can launch a fund as easily as deploying a vault. An investor anywhere in the world can deploy capital across hundreds of strategies that fit their target — managed continuously, autonomously, and at zero marginal cost.</p>

            <h3>This is what Yieldr is building toward</h3>
            <div className="callout-row">
              <div className="callout">
                <span className="callout-num">∞</span>
                <div className="callout-body">
                  <div className="callout-h">A million funds</div>
                  <p className="callout-p">Every trader with verified edge, anywhere in the world, running a fund.</p>
                </div>
              </div>
              <div className="callout">
                <span className="callout-num">∞</span>
                <div className="callout-body">
                  <div className="callout-h">A billion allocators</div>
                  <p className="callout-p">Every investor with capital, allocating across global strategies through agents tuned to their goals.</p>
                </div>
              </div>
              <div className="callout">
                <span className="callout-num">∞</span>
                <div className="callout-body">
                  <div className="callout-h">A new asset management market</div>
                  <p className="callout-p">Open, agent-operated, performance-driven, and onchain by default.</p>
                </div>
              </div>
            </div>

            <div className="hero-quote">The hedge fund as a 70-year-old institution served a few thousand managers and a few hundred thousand investors. The agent-managed fund will serve the world.</div>
          </section>

          {/* 06 — ROADMAP */}
          <section id="roadmap">
            <div className="docs-sec-num">06 — Roadmap</div>
            <h2 className="docs-sec-h">From three vaults to a million funds.</h2>

            <div className="roadmap">
              <div className="rm-item">
                <div className="rm-phase live">
                  PHASE 1
                  <span className="rm-status">● Live since Q4 2025</span>
                </div>
                <div>
                  <div className="rm-h">Internal Vaults</div>
                  <p className="rm-p">Three Yieldr-operated vaults trading project capital on Polymarket: <strong>NBA Edge</strong>, <strong>Soccer Alpha</strong>, <strong>Geopolitics</strong>. Building, refining, and proving the agent stack with our own money before opening it up.</p>
                </div>
              </div>

              <div className="rm-item">
                <div className="rm-phase now">
                  PHASE 2
                  <span className="rm-status">◐ Now</span>
                </div>
                <div>
                  <div className="rm-h">Capital Raise</div>
                  <p className="rm-p">Raising through tiered Early Access from <strong>$9M FDV</strong>. Tiers 1–2 open June–July 2026 via multi-curve pricing auction (bankr + Doppler, Aerodrome Ignition, or Uniswap CCA — mechanism TBD). Subsequent tiers priced at 5× the prior tier's FDV, opening annually from 2027.</p>
                </div>
              </div>

              <div className="rm-item">
                <div className="rm-phase">
                  PHASE 3
                  <span className="rm-status">○ Next</span>
                </div>
                <div>
                  <div className="rm-h">Marketplace Open on Polymarket</div>
                  <p className="rm-p">Whitelisted top traders launch vaults on Polymarket and manage capital raised in Phase 2. <strong>Allocation and Edge Detection agents go live</strong> — investor-side agents begin routing capital across vaults based on risk-return profile and verified edge.</p>
                </div>
              </div>

              <div className="rm-item">
                <div className="rm-phase">
                  PHASE 4
                  <span className="rm-status">○ Planned</span>
                </div>
                <div>
                  <div className="rm-h">Multi-Protocol Expansion</div>
                  <p className="rm-p">Vaults expand beyond prediction markets into perps (<strong>Hyperliquid, Avantis</strong>) and liquidity (<strong>Uniswap, Aerodrome</strong>). Trader-side agents — Matching and Community — go live. Full agent stack operational on both sides.</p>
                </div>
              </div>

              <div className="rm-item">
                <div className="rm-phase">
                  PHASE 5
                  <span className="rm-status">○ Vision</span>
                </div>
                <div>
                  <div className="rm-h">Open Marketplace</div>
                  <p className="rm-p">Anyone with verified onchain edge can launch a vault. Anyone with capital can deploy. Fully agent-run on both sides. <strong>The platform becomes infrastructure — Yieldr operates the layer, the market operates the funds.</strong></p>
                </div>
              </div>
            </div>
          </section>

          {/* 07 — TOKENOMICS */}
          <section id="tokenomics">
            <div className="docs-sec-num">07 — Tokenomics</div>
            <h2 className="docs-sec-h">YLDR — fixed supply, community-first, fair to all.</h2>
            <p className="docs-sec-sub">
              YLDR is the protocol token of Yieldr. No VC tiers, no private rounds at preferential pricing —
              retail and institutions allocate at the same price, first come, first served.
            </p>

            <div className="token-head">
              <div className="token-stat">
                <div className="token-stat-v">Base</div>
                <div className="token-stat-l">Network</div>
              </div>
              <div className="token-stat">
                <div className="token-stat-v">Jun–Jul 2026</div>
                <div className="token-stat-l">Fair Launch TGE</div>
              </div>
              <div className="token-stat">
                <div className="token-stat-v">$700K</div>
                <div className="token-stat-l">Raise Target</div>
              </div>
            </div>

            <h3>Fair Launch</h3>
            <p>YLDR will launch via a <strong>fair launch TGE on Base</strong> in June–July 2026. We are exploring Base ecosystem launchpads and raise mechanics to close a <strong>$700K USDC raise target</strong> — earmarked for product engineering and agent inference costs.</p>
            <p style={{ marginTop: '0.75rem' }}>No VC allocations. Team vesting TBD. Retail and institutions participate at the same price, first come, first served.</p>

            <h3>Utility</h3>
            <ul style={{ paddingLeft: '1.2rem', lineHeight: 2, fontSize: 14, color: 'var(--text-dim)' }}>
              <li>YLDR can be used to purchase agent inference for quant, trading and investing agents on the protocol.</li>
              <li>Holding and staking YLDR enables fee discounts for agents trading and investing.</li>
              <li>More utilities to be defined as the platform evolves into an agentic onchain fund management platform.</li>
            </ul>
          </section>

          {/* CONNECT */}
          <section id="connect">
            <div className="docs-sec-num">— Connect</div>
            <h2 className="docs-sec-h">Talk to us.</h2>
            <p className="docs-sec-sub">Questions, feedback, or want early access to vaults? Reach out on the channels below.</p>

            <div className="connect-grid">
              <a
                href="https://web.telegram.org/k/#@yieldrdotorg"
                target="_blank"
                rel="noopener noreferrer"
                className="connect-card"
              >
                <div className="connect-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </div>
                <div className="connect-card-body">
                  <div className="connect-card-h">Telegram</div>
                  <div className="connect-card-p">@yieldrdotorg — community, announcements, support.</div>
                </div>
                <div className="connect-arrow">↗</div>
              </a>

              <a
                href="https://x.com/yieldrdotorg"
                target="_blank"
                rel="noopener noreferrer"
                className="connect-card"
              >
                <div className="connect-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div className="connect-card-body">
                  <div className="connect-card-h">X / Twitter</div>
                  <div className="connect-card-p">@yieldrdotorg — build updates, vault performance, market takes.</div>
                </div>
                <div className="connect-arrow">↗</div>
              </a>

              <a
                href="https://github.com/robbin2102/yieldr-app"
                target="_blank"
                rel="noopener noreferrer"
                className="connect-card"
              >
                <div className="connect-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div className="connect-card-body">
                  <div className="connect-card-h">GitHub</div>
                  <div className="connect-card-p">Open source build. Track every commit and module shipped.</div>
                </div>
                <div className="connect-arrow">↗</div>
              </a>
            </div>
          </section>

          <div className="page-foot-nav">
            <Link href="/vaults" className="prev">
              <div className="foot-nav-l">← Live Now</div>
              <div className="foot-nav-t">Enter Vaults</div>
            </Link>
            <Link href="/build-in-public" className="next">
              <div className="foot-nav-l">Track Progress →</div>
              <div className="foot-nav-t">Build Log</div>
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}
