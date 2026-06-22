'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EarlyAccessPopup } from '../components/payment/EarlyAccessPopup';
import { UserProfile } from '../components/UserProfile';
import { usePayment } from '../context/PaymentContext';
import { useAccount } from 'wagmi';
import './docs.css';

const PAGE_ORDER = [
  'what-is-yieldr',
  'the-problem',
  'the-solution',
  'agent-vaults',
  'fund-launch-waitlist',
  'community-project-vaults',
  'allocation-agents',
  'depositor-whitelist',
  'yldr-token',
  'roadmap',
  'risk-restrictions',
  'connect',
] as const;

const PAGE_TITLES: Record<string, string> = {
  'what-is-yieldr': 'What is Yieldr?',
  'the-problem': 'The Problem',
  'the-solution': 'The Solution',
  'agent-vaults': 'Agent Vaults',
  'fund-launch-waitlist': 'Fund Launch Waitlist',
  'community-project-vaults': 'Community & Project Vaults',
  'allocation-agents': 'Allocation Agents',
  'depositor-whitelist': 'Depositor Whitelist',
  'yldr-token': '$YLDR Token',
  roadmap: 'Roadmap',
  'risk-restrictions': 'Risk & Restrictions',
  connect: 'Connect',
};

const SECTION_NUMS: Record<string, string> = {
  'what-is-yieldr': '01', 'the-problem': '02', 'the-solution': '03', 'agent-vaults': '04',
  'fund-launch-waitlist': '05', 'community-project-vaults': '06', 'allocation-agents': '07',
  'depositor-whitelist': '08', 'yldr-token': '09', roadmap: '10', 'risk-restrictions': '11', connect: '12',
};

export default function DocsPage() {
  const [activePage, setActivePage] = useState('what-is-yieldr');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { hasCompletedPayment } = usePayment();
  const { isConnected } = useAccount();

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) setActivePage(hash);
  }, []);

  const showPage = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo(0, 0);
    if (isMobileView) setSidebarOpen(false);
    if (typeof window !== 'undefined') window.history.pushState(null, '', '#' + pageId);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  const navigateAndClose = (pageId: string) => {
    showPage(pageId);
    setSidebarOpen(false);
  };

  const prevNext = (pageId: string) => {
    const i = PAGE_ORDER.indexOf(pageId as typeof PAGE_ORDER[number]);
    return {
      prev: i > 0 ? PAGE_ORDER[i - 1] : null,
      next: i < PAGE_ORDER.length - 1 ? PAGE_ORDER[i + 1] : null,
    };
  };

  const SectionTag = ({ pageId }: { pageId: string }) => (
    <div className="dx-tag">{SECTION_NUMS[pageId]} — {PAGE_TITLES[pageId]}</div>
  );

  const PageFooter = ({ pageId }: { pageId: string }) => {
    const { prev, next } = prevNext(pageId);
    return (
      <div className="dx-footer">
        <div className="dx-footer-nav">
          {prev ? (
            <a className="dx-footer-btn prev" onClick={() => showPage(prev)}>
              <div className="dx-footer-label">Previous</div>
              <div className="dx-footer-title">&larr; {PAGE_TITLES[prev]}</div>
            </a>
          ) : <div></div>}
          {next ? (
            <a className="dx-footer-btn next" onClick={() => showPage(next)}>
              <div className="dx-footer-label">Next</div>
              <div className="dx-footer-title">{PAGE_TITLES[next]} &rarr;</div>
            </a>
          ) : <div></div>}
        </div>
      </div>
    );
  };

  const NAV_SECTIONS: Array<{ title: string; items: Array<{ id: string; label: string }> }> = [
    {
      title: 'Start Here', items: [
        { id: 'what-is-yieldr', label: 'What is Yieldr?' },
        { id: 'the-problem', label: 'The Problem' },
        { id: 'the-solution', label: 'The Solution' },
      ],
    },
    {
      title: 'Agent Vaults', items: [
        { id: 'agent-vaults', label: 'Agent Vaults' },
        { id: 'fund-launch-waitlist', label: 'Fund Launch Waitlist' },
        { id: 'community-project-vaults', label: 'Community & Project Vaults' },
      ],
    },
    {
      title: 'Depositors', items: [
        { id: 'allocation-agents', label: 'Allocation Agents' },
        { id: 'depositor-whitelist', label: 'Depositor Whitelist' },
      ],
    },
    {
      title: 'YLDR Token', items: [
        { id: 'yldr-token', label: 'Token Overview' },
        { id: 'roadmap', label: 'Roadmap' },
      ],
    },
    {
      title: 'Resources', items: [
        { id: 'risk-restrictions', label: 'Risk & Restrictions' },
        { id: 'connect', label: 'Connect' },
      ],
    },
  ];

  return (
    <div className="dx-root">
      {/* Sidebar Overlay for mobile */}
      <div className={'dx-sidebar-overlay ' + (sidebarOpen ? 'visible' : '')} onClick={closeSidebar}></div>

      {/* Mobile Menu Overlay */}
      {sidebarOpen && isMobileView && (
        <div className="dx-mobile-menu-overlay" onClick={closeSidebar}>
          <div className="dx-mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="dx-mobile-menu-header">
              <div className="dx-mobile-menu-logo">
                <svg className="dx-mobile-menu-logo-icon" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00E87B"/>
                  <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000000" opacity="0.3"/>
                  <circle cx="50" cy="60" r="8" fill="#FFFFFF" opacity="0.9"/>
                </svg>
                <span className="dx-mobile-menu-logo-text">YIELDR</span>
              </div>
              <button className="dx-mobile-menu-close" onClick={closeSidebar}>✕</button>
            </div>
            <div className="dx-mobile-menu-content">
              {NAV_SECTIONS.map((section) => (
                <div className="dx-mobile-menu-section" key={section.title}>
                  <div className="dx-mobile-menu-section-title">{section.title}</div>
                  {section.items.map((item) => (
                    <a
                      key={item.id}
                      className={'dx-mobile-menu-sublink ' + (activePage === item.id ? 'active' : '')}
                      onClick={() => navigateAndClose(item.id)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              ))}

              {hasCompletedPayment && isConnected ? (
                <Link href="/allocations" className="dx-mobile-menu-cta" onClick={closeSidebar}>
                  My Allocation
                </Link>
              ) : (
                <button
                  className="dx-mobile-menu-cta"
                  onClick={() => { closeSidebar(); setShowPopup(true); }}
                >
                  Get Early Access
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <nav className="dx-nav">
        <Link href="/" className="dx-nav-l">
          <svg className="dx-nav-logo-svg" viewBox="0 0 100 120">
            <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00E87B"/>
            <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3"/>
            <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9"/>
          </svg>
          <span className="dx-nav-brand">YIELDR</span>
        </Link>
        <div className="dx-nav-links">
          <Link href="/">Home</Link>
          <Link href="/vaults">Vaults</Link>
          <Link href="/docs" className="dx-active">Docs</Link>
          <Link href="/build-in-public">Build Log</Link>
        </div>
        <div className="dx-nav-r">
          <div className="dx-nav-soc">
            <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer" title="X / Twitter">
              <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://discord.gg/KhZW5qgC" target="_blank" rel="noopener noreferrer" title="Discord">
              <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419s.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419s.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
            <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer" title="GitHub">
              <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
          {hasCompletedPayment && isConnected ? (
            <UserProfile />
          ) : (
            <a href="https://app.yieldr.org/demo" className="dx-nav-cta">Enter Vaults &nearr;</a>
          )}
          <button className="dx-nav-hamburger" onClick={toggleSidebar} aria-label="Open menu">☰</button>
        </div>
      </nav>

      <div className="dx-layout">
        {/* Sidebar */}
        <nav className="dx-sidebar">
          {NAV_SECTIONS.map((section) => (
            <div className="dx-nav-group" key={section.title}>
              <div className="dx-nav-group-title">{section.title}</div>
              {section.items.map((item) => (
                <a
                  key={item.id}
                  className={'dx-nav-item ' + (activePage === item.id ? 'active' : '')}
                  onClick={() => showPage(item.id)}
                >
                  {SECTION_NUMS[item.id]} {item.label}
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* Main Content */}
        <main className="dx-content">

          {/* PAGE 01: What is Yieldr? */}
          <section className={'dx-page ' + (activePage === 'what-is-yieldr' ? 'active' : '')} id="page-what-is-yieldr">
            <div className="dx-badge">Documentation · v2.0 · Updated July 2026</div>
            <h1>The platform for <span className="ac">AI-native hedge funds</span> onchain.</h1>
            <p className="dx-subtitle">Top traders launch vaults and let agents run the fund. Investors deploy capital and let agents run the portfolio. <strong>Every part of fund operations and capital allocation that doesn&apos;t require a human is handled by the agent stack.</strong></p>

            <SectionTag pageId="what-is-yieldr" />
            <h2>A new asset management primitive — the agent-managed fund.</h2>
            <p>Built to scale to a million operators. Open to anyone with verified edge or capital to allocate.</p>

            <p>Yieldr helps traders, project communities, DAOs, and depositors use agents to launch, operate, monitor, and allocate across onchain funds.</p>
            <p>Agents identify edge, match capital, handle communication, monitor performance, and rotate allocation when edge changes.</p>

            <h2>What Yieldr does</h2>

            <div className="dx-cards-grid">
              <div className="dx-card">
                <div className="dx-card-title">For Traders</div>
                <p className="dx-card-desc">Launch a vault. Agents handle investor matching, communication, and retention. Stay in your seat.</p>
              </div>
              <div className="dx-card">
                <div className="dx-card-title">For Investors</div>
                <p className="dx-card-desc">Set your risk-return target. Agents allocate across vaults continuously and rotate as performance shifts.</p>
              </div>
              <div className="dx-card">
                <div className="dx-card-title">For Project Communities</div>
                <p className="dx-card-desc">Deploy publicly transparent strategies to grow token liquidity, market depth, and treasury exposure.</p>
              </div>
              <div className="dx-card">
                <div className="dx-card-title">For Depositors</div>
                <p className="dx-card-desc">Launch allocation agents that discover, monitor, and rotate capital across agent vaults 24/7.</p>
              </div>
            </div>

            <h2>What&apos;s live today</h2>
            <p>Three vaults trading project capital on Polymarket — <strong>NBA Edge, Soccer Alpha, Geopolitics</strong>. Real performance, public onchain. The proving ground for the agent stack.</p>

            <h2>Why now</h2>
            <p>Verifiable trader performance at scale. Agents capable of real operational and allocation decisions. Smart contracts for non-custodial fund structures. <strong>The pieces exist. Yieldr is the assembly.</strong></p>

            <PageFooter pageId="what-is-yieldr" />
          </section>

          {/* PAGE 02: The Problem */}
          <section className={'dx-page ' + (activePage === 'the-problem' ? 'active' : '')} id="page-the-problem">
            <SectionTag pageId="the-problem" />
            <h1>The hedge fund is broken — and DeFi hasn&apos;t fixed it.</h1>
            <p className="dx-subtitle">For 70 years, the hedge fund has been the highest-performing structure in finance. Access has stayed locked behind accreditation walls, million-dollar minimums, and jurisdictional moats. The world has produced ~10,000 funds. Millions of traders could run one. Almost none ever will.</p>

            <p><strong>DeFi was supposed to fix this. It hasn&apos;t.</strong> Vaults exist as a primitive, but a vault is not a fund.</p>

            <div className="dx-prompt-card">
              <div className="dx-prompt-text">01</div>
              <p className="dx-prompt-desc"><strong>Traders can launch vaults but can&apos;t grow them.</strong> Code handles execution. It doesn&apos;t bring in investors, explain the strategy, or hold the relationship through drawdowns. Top traders don&apos;t want to spend time on this, so they don&apos;t scale — and most onchain alpha stays capped at personal capital.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">02</div>
              <p className="dx-prompt-desc"><strong>Investors can&apos;t allocate across vaults at scale.</strong> Picking one vault isn&apos;t the job — continuous allocation against a risk-return target is. Which vaults fit my profile? How much in each? When to rotate? No one does this manually, so capital chases the loudest vault instead of the best-fit one.</p>
            </div>

            <h2>Without Yieldr</h2>
            <ul className="dx-list">
              <li>Nobody outside their circle knows a trader&apos;s track record exists.</li>
              <li>Depositors have no way to find traders or trust their edge.</li>
              <li>There is no structured way to match capital with strategy fit.</li>
              <li>Every depositor question pulls the trader out of their positions.</li>
              <li>Drawdowns create noise that must be managed manually.</li>
              <li>Scaling means risking more personal capital instead of scaling through aligned depositors.</li>
            </ul>

            <PageFooter pageId="the-problem" />
          </section>

          {/* PAGE 03: The Solution */}
          <section className={'dx-page ' + (activePage === 'the-solution' ? 'active' : '')} id="page-the-solution">
            <SectionTag pageId="the-solution" />
            <h1>The Solution</h1>
            <p className="dx-subtitle">Yieldr gives every verified onchain edge an agent stack. The vault is the capital layer. The agents are the operating layer. Together, they turn onchain performance into recurring revenue.</p>

            <h2>The Yieldr Agent Stack</h2>

            <h3>Quant Agent</h3>
            <p>Analyzes wallet history and strategy performance — entry/exit behavior, sizing, drawdown history, win rate, regime sensitivity, and whether performance is edge, beta, luck, or insider-like timing. The goal is not just to show PnL, but to explain why the edge exists and whether it can scale.</p>

            <h3>Matching Agent</h3>
            <p>Connects agent vaults with depositors whose goals fit the strategy — asset class, risk tolerance, return target, drawdown tolerance, and liquidity needs. Capital is matched to fit, not noise.</p>

            <h3>Comms Agent</h3>
            <p>Handles depositor communication: weekly performance summaries, drawdown explanations, strategy notes, and risk alerts — keeping the trader focused on positions while depositors stay informed.</p>

            <h3>Monitoring Agent</h3>
            <p>Tracks risk, edge decay, and strategy drift — watching position sizing, drawdown, leverage, and AUM scale — and flags problems before they become obvious in PnL.</p>

            <h3>Allocation Agent</h3>
            <p>Works for depositors: discovers vaults, monitors open allocations, compares strategies, and rotates capital based on depositor goals — creating passive onchain investing across active agent vaults.</p>

            <h2>The Outcome</h2>
            <ul className="dx-list">
              <li>Traders can scale edge without becoming fund operators.</li>
              <li>Project communities can run transparent liquidity and accumulation strategies.</li>
              <li>DAOs can deploy treasury capital into asset classes they could not previously access.</li>
              <li>Depositors can allocate through agents instead of manually monitoring every vault.</li>
            </ul>
            <p>Yieldr becomes the operating system for onchain funds.</p>

            <PageFooter pageId="the-solution" />
          </section>

          {/* PAGE 04: Agent Vaults */}
          <section className={'dx-page ' + (activePage === 'agent-vaults' ? 'active' : '')} id="page-agent-vaults">
            <SectionTag pageId="agent-vaults" />
            <h1>What are Agent Vaults?</h1>
            <p className="dx-subtitle">Onchain funds operated through the Yieldr agent stack. A primitive DeFi vault usually does one thing: it holds capital and follows a fixed strategy. An agent vault is dynamic, monitored, explainable, and connected to an agent network.</p>

            <h2>Agent Vault = Capital Layer + Strategy Layer + Agent Layer</h2>

            <h3>1. Capital Layer</h3>
            <p>The vault holds and tracks capital onchain — deposits, withdrawals, strategy accounting, performance tracking, fee logic, risk limits, and public reporting. The vault is where capital lives.</p>

            <h3>2. Strategy Layer</h3>
            <p>Each vault has a strategy domain: prediction markets, perps strategies, funding-rate arbitrage, Base memecoin trading, project coin accumulation, liquidity strategies, RWA accumulation, or DAO treasury strategies. The strategy defines what the vault is trying to do.</p>

            <h3>3. Agent Layer</h3>
            <p>Agents operate around the vault — edge detection, depositor matching, performance communication, risk monitoring, strategy drift alerts, and allocation rotation. The agents make the vault intelligent.</p>

            <h2>How Agent Vaults Work</h2>

            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 1 — Connect Wallet</div>
              <p className="dx-prompt-desc">A trader, project, DAO, or strategy operator connects a wallet. Yieldr uses wallet activity and linked strategy data to understand past performance, market exposure, and potential edge.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 2 — Prove Edge</div>
              <p className="dx-prompt-desc">The Quant Agent analyzes the wallet for patterns in PnL, entry/exit timing, sizing, market selection, holding period, drawdown control, repeatability, liquidity conditions, and risk-adjusted returns. The output is an edge profile.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 3 — Define Vault Strategy</div>
              <p className="dx-prompt-desc">The strategy is packaged into an agent vault, defining market, asset class, target AUM, risk level, execution approach, fees, withdrawal terms, max drawdown, max position size, liquidity constraints, and disclosure requirements.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 4 — Match Depositors</div>
              <p className="dx-prompt-desc">The Matching Agent identifies depositors whose goals fit the vault based on asset class, return target, risk tolerance, drawdown limits, time horizon, liquidity preference, and strategy type.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 5 — Run and Monitor</div>
              <p className="dx-prompt-desc">Once active, the vault executes its strategy according to defined rules. Agents continuously monitor performance, risk, edge gain or loss, strategy drift, depositor alignment, liquidity, and position behavior.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 6 — Communicate</div>
              <p className="dx-prompt-desc">The Comms Agent keeps depositors informed with weekly updates, trade summaries, drawdown explanations, strategy notes, risk alerts, and market context — without forcing the trader to become a full-time IR desk.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 7 — Allocate and Rotate</div>
              <p className="dx-prompt-desc">Depositors can use Allocation Agents to monitor vaults continuously. If a vault loses edge, risk increases, or another vault better matches the depositor&apos;s target, the Allocation Agent can recommend or execute rotation according to user-defined rules.</p>
            </div>

            <h2>Agent Vault Categories</h2>
            <ul className="dx-list">
              <li><strong>Prediction Vaults</strong> — wallet intelligence and implied probability on Polymarket.</li>
              <li><strong>Perps Vaults</strong> — directional, funding-rate, and market-neutral strategies on Avantis and Hyperliquid.</li>
              <li><strong>Liquidity Vaults</strong> — concentrated liquidity and incentive campaigns on Aerodrome and Uniswap.</li>
              <li><strong>Project Coin Vaults</strong> — transparent accumulation across Virtuals, Bankr, and Base project coins.</li>
              <li><strong>Memecoin Vaults</strong> — high-volatility Base-native assets using wallet signals and risk limits.</li>
              <li><strong>RWA Vaults</strong> — tokenized real-world asset exposure where onchain liquidity and pricing data are available.</li>
              <li><strong>DAO Treasury Vaults</strong> — agent-monitored deployment across asset classes and risk profiles.</li>
            </ul>

            <div className="dx-callout dx-callout-warning">
              <div className="dx-callout-title">Important</div>
              <p>Agent vaults are experimental. They may involve market risk, smart contract risk, execution risk, liquidity risk, strategy risk, agent error, and regulatory risk. Past performance is not indicative of future results. Agent outputs are not guarantees.</p>
            </div>

            <PageFooter pageId="agent-vaults" />
          </section>

          {/* PAGE 05: Fund Launch Waitlist */}
          <section className={'dx-page ' + (activePage === 'fund-launch-waitlist' ? 'active' : '')} id="page-fund-launch-waitlist">
            <SectionTag pageId="fund-launch-waitlist" />
            <h1>Fund Launch Waitlist</h1>
            <p className="dx-subtitle">Coming around the $YLDR TGE in July 2026. For traders, project communities, DAOs, LP strategists, perps traders, prediction-market traders, and ecosystem operators who want to launch agent vaults when Yieldr opens beta access.</p>

            <h2>Who Should Apply?</h2>
            <ul className="dx-list">
              <li>Verifiable onchain trading history</li>
              <li>A strong X, Telegram, Discord, or project community</li>
              <li>A project token or ecosystem strategy</li>
              <li>Repeatable edge in memecoins, perps, predictions, LP strategies, or project coins</li>
              <li>A DAO or treasury looking for agent-monitored allocation</li>
              <li>Willingness to operate through public rules, risk limits, and agent monitoring</li>
            </ul>

            <h2>Application Flow</h2>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">01 — Connect Wallet</div>
              <p className="dx-prompt-desc">Connect the wallet that best represents your trading, project, or strategy history.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">02 — Select Market</div>
              <p className="dx-prompt-desc">Choose the market where you want to launch an agent vault: Project Coins (Bankr + Virtuals), Memecoins (Base), Perps (Avantis + Hyperliquid), Predictions (Polymarket), Liquidity (Aerodrome + Uniswap), RWAs, or DAO Treasury Strategies.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">03 — Select Target AUM</div>
              <p className="dx-prompt-desc">Choose the amount of capital the vault is designed to support: $0–$100K, $100K–$250K, $250K–$500K, $500K–$1M, or $1M+.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">04 — Add Community Links</div>
              <p className="dx-prompt-desc">Add X, Telegram, Discord, website, project page, or DAO links.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">05 — Submit Strategy Intent</div>
              <p className="dx-prompt-desc">Describe what the agent vault will do and why the wallet, project, DAO, or community has an edge.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">06 — Join Waitlist</div>
              <p className="dx-prompt-desc">Your wallet is added to the fund launch waitlist.</p>
            </div>

            <h2>What Happens After Signup?</h2>
            <p>Yieldr reviews the wallet, strategy, and community profile. Applicants may receive fund readiness status, strategy feedback, agent vault category recommendation, whitelist campaign support, beta launch eligibility, and access to agent vault tooling as it rolls out.</p>

            <PageFooter pageId="fund-launch-waitlist" />
          </section>

          {/* PAGE 06: Community and Project Vaults */}
          <section className={'dx-page ' + (activePage === 'community-project-vaults' ? 'active' : '')} id="page-community-project-vaults">
            <SectionTag pageId="community-project-vaults" />
            <h1>Community and Project Vaults</h1>
            <p className="dx-subtitle">Agent vaults designed for projects, token communities, DAOs, and ecosystem operators — built to run transparent strategies around liquidity, accumulation, treasury deployment, or ecosystem growth.</p>

            <h2>Use Cases</h2>

            <h3>Token Liquidity and Depth</h3>
            <p>Projects can deploy transparent strategies that grow token liquidity and market depth — liquidity accumulation, market depth improvement, LP strategies, treasury diversification, and onchain reporting.</p>

            <h3>Project Coin Accumulation</h3>
            <p>Communities can coordinate transparent accumulation strategies around project coins or ecosystem baskets, defining target asset, target AUM, execution pacing, liquidity limits, risk controls, and reporting cadence.</p>

            <h3>DAO and Treasury Deployment</h3>
            <p>DAOs and project treasuries can deploy funds into strategies with defined risk-return goals, including asset classes most DAOs do not actively access today — perps, predictions, Base project coins, Virtuals ecosystem tokens, Bankr launches, Aerodrome LP strategies, RWA exposure, and funding-rate strategies.</p>

            <h3>Community Strategy Vaults</h3>
            <p>Communities with strong distribution can launch agent vaults around a specific thesis: Base ecosystem rotation, Virtuals agent token basket, Bankr project coin basket, Aerodrome LP income strategy, prediction-market strategy, or perps funding arbitrage strategy.</p>

            <h2>Required Transparency</h2>
            <p>If a project, DAO, or community is affiliated with assets inside the vault, that relationship should be clearly disclosed. Community and project vaults should define strategy objective, asset universe, execution rules, liquidity constraints, risk limits, treasury or project affiliation, reporting cadence, withdrawal terms, and vault status.</p>
            <p>The goal is transparent strategy deployment, not opaque promotion.</p>

            <PageFooter pageId="community-project-vaults" />
          </section>

          {/* PAGE 07: Depositor Allocation Agents */}
          <section className={'dx-page ' + (activePage === 'allocation-agents' ? 'active' : '')} id="page-allocation-agents">
            <SectionTag pageId="allocation-agents" />
            <h1>Depositor Allocation Agents</h1>
            <p className="dx-subtitle">Discover, monitor, and allocate across agent vaults. Instead of manually checking every vault, depositor goals are set once and agents continuously monitor opportunities.</p>

            <h2>How Allocation Agents Work</h2>

            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 1 — Set Goals</div>
              <p className="dx-prompt-desc">Depositors define asset classes, risk tolerance, return target, drawdown tolerance, preferred markets, liquidity needs, and time horizon.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 2 — Discover Vaults</div>
              <p className="dx-prompt-desc">The Allocation Agent scans available agent vaults and identifies strategies that match the depositor&apos;s goals.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 3 — Allocate Capital</div>
              <p className="dx-prompt-desc">The agent can suggest or execute allocations based on user-defined permissions.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 4 — Monitor 24/7</div>
              <p className="dx-prompt-desc">The agent monitors open vault positions, vault-level performance, trade-level performance, edge gain or loss, strategy drift, drawdown, liquidity, and risk changes.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 5 — Rotate When Needed</div>
              <p className="dx-prompt-desc">If a vault loses edge or no longer fits the depositor&apos;s goals, the Allocation Agent can recommend or execute capital rotation into stronger-fit vaults.</p>
            </div>

            <h2>Why It Matters</h2>
            <p>This creates a new onchain passive investing model. Depositors no longer need to chase the loudest vault, manually monitor every strategy, or exit only after drawdowns become obvious. Agents can continuously detect which vaults are gaining or losing edge.</p>

            <PageFooter pageId="allocation-agents" />
          </section>

          {/* PAGE 08: Depositor Whitelist */}
          <section className={'dx-page ' + (activePage === 'depositor-whitelist' ? 'active' : '')} id="page-depositor-whitelist">
            <SectionTag pageId="depositor-whitelist" />
            <h1>Depositor Whitelist</h1>
            <p className="dx-subtitle">Whitelist your wallet for upcoming agent vaults. Whitelisting signals interest in vault access before beta launch.</p>

            <h2>What Depositors Can Do</h2>
            <ul className="dx-list">
              <li>Explore agent vault categories</li>
              <li>Whitelist any agent vault</li>
              <li>Track waitlist growth</li>
              <li>Follow vault updates</li>
              <li>Join beta launch eligibility</li>
              <li>Participate in product trials where available</li>
            </ul>

            <h2>$YLDR Whitelist Rewards</h2>
            <p>Eligible users who whitelist and participate in qualifying agent vault product trials may earn $YLDR rewards at beta launch. Reward ranges, eligibility, minimum participation, and claim conditions are subject to final product and token launch rules.</p>
            <p>A minimum USDC participation requirement may apply to prevent low-quality farming and encourage genuine product usage.</p>

            <div className="dx-callout dx-callout-warning">
              <div className="dx-callout-title">Important</div>
              <p>Whitelist participation does not guarantee profit, vault access, token allocation, or future rewards. Rewards may be limited by eligibility, jurisdiction, product usage, and final launch terms.</p>
            </div>

            <PageFooter pageId="depositor-whitelist" />
          </section>

          {/* PAGE 09: $YLDR Token */}
          <section className={'dx-page ' + (activePage === 'yldr-token' ? 'active' : '')} id="page-yldr-token">
            <SectionTag pageId="yldr-token" />
            <h1>$YLDR Token</h1>
            <p className="dx-subtitle">The protocol token for the Yieldr agent OS — designed around agent access, agent trading, protocol participation, and future protocol utility.</p>

            <h2>Planned Utility</h2>
            <ul className="dx-list">
              <li>Agent inference access</li>
              <li>Agent trading fees</li>
              <li>Protocol participation</li>
              <li>Future fee-related utilities</li>
            </ul>
            <p>Final utility may evolve as the product and legal structure mature.</p>

            <h2>TGE</h2>
            <div className="dx-token-hero">
              <div className="dx-token-symbol">⚡</div>
              <div className="dx-token-name">YLDR</div>
              <div className="dx-token-stats">
                <div>
                  <div className="dx-token-stat-value">Jul 2026</div>
                  <div className="dx-token-stat-label">Planned TGE</div>
                </div>
                <div>
                  <div className="dx-token-stat-value">Virtuals</div>
                  <div className="dx-token-stat-label">Launch Ecosystem</div>
                </div>
                <div>
                  <div className="dx-token-stat-value">&lt;$200K</div>
                  <div className="dx-token-stat-label">Genesis FDV</div>
                </div>
              </div>
            </div>
            <p>Tokenomics information and Virtuals launch page URL will be updated soon.</p>

            <h2>Whitelist Rewards</h2>
            <p>Users who whitelist agent vaults and complete eligible product participation may qualify for $YLDR rewards at beta launch. Reward mechanics are designed to reward genuine users, not passive farmers.</p>

            <div className="dx-callout dx-callout-warning">
              <div className="dx-callout-title">Important</div>
              <p>$YLDR details are subject to change. Nothing in these docs constitutes an offer to sell or solicitation to buy any security or financial instrument. Token access and rewards may be restricted by jurisdiction.</p>
            </div>

            <PageFooter pageId="yldr-token" />
          </section>

          {/* PAGE 10: Roadmap */}
          <section className={'dx-page ' + (activePage === 'roadmap' ? 'active' : '')} id="page-roadmap">
            <SectionTag pageId="roadmap" />
            <h1>Roadmap</h1>
            <p className="dx-subtitle">From live agent trading to the open agent fund network.</p>

            <div className="dx-roadmap-item current">
              <div className="dx-roadmap-dot"></div>
              <div className="dx-roadmap-phase">Phase 1 — Live</div>
              <h3 className="dx-roadmap-title">Live Agent Trading</h3>
              <p className="dx-roadmap-desc">Yieldr operates live agent trading strategies using project capital. Current focus: Polymarket prediction trading, wallet edge detection, agent research workflows, public performance reporting, trading analytics, and build-in-public transparency.</p>
            </div>
            <div className="dx-roadmap-item">
              <div className="dx-roadmap-dot"></div>
              <div className="dx-roadmap-phase">Phase 2 — Coming around $YLDR TGE in July 2026</div>
              <h3 className="dx-roadmap-title">Whitelist and Fund Launch Applications</h3>
              <p className="dx-roadmap-desc">Users can whitelist wallets on upcoming agent vaults. Traders, projects, DAOs, and communities can apply to launch agent vaults. Yieldr begins forming the early vault pipeline across project coins, memecoins, perps, predictions, LP strategies, RWAs, and DAO treasury strategies.</p>
            </div>
            <div className="dx-roadmap-item">
              <div className="dx-roadmap-dot"></div>
              <div className="dx-roadmap-phase">Phase 3 — Planned July 2026</div>
              <h3 className="dx-roadmap-title">$YLDR TGE</h3>
              <p className="dx-roadmap-desc">$YLDR launches through the Virtuals ecosystem. Eligible users may participate according to final launch and jurisdictional rules. Tokenomics information and Virtuals launch page URL will be published before launch.</p>
            </div>
            <div className="dx-roadmap-item">
              <div className="dx-roadmap-dot"></div>
              <div className="dx-roadmap-phase">Phase 4 — Planned Q1–Q2 2027</div>
              <h3 className="dx-roadmap-title">Beta Launch</h3>
              <p className="dx-roadmap-desc">Whitelisted users begin participating in selected agent vaults. Selected launch applicants begin operating early agent vaults under controlled beta conditions. Agents begin supporting matching, comms, monitoring, reporting, risk alerts, and allocation intelligence.</p>
            </div>
            <div className="dx-roadmap-item">
              <div className="dx-roadmap-dot"></div>
              <div className="dx-roadmap-phase">Phase 5 — Planned</div>
              <h3 className="dx-roadmap-title">Multi-Venue Expansion</h3>
              <p className="dx-roadmap-desc">Yieldr expands agent vault support across Polymarket, Avantis, Hyperliquid, Aerodrome, Uniswap, Virtuals, Bankr, and selected RWA venues.</p>
            </div>
            <div className="dx-roadmap-item">
              <div className="dx-roadmap-dot"></div>
              <div className="dx-roadmap-phase">Phase 6 — Vision</div>
              <h3 className="dx-roadmap-title">Open Agent Fund Network</h3>
              <p className="dx-roadmap-desc">Anyone with verified edge can apply to launch an agent vault. Eligible depositors can discover, monitor, and allocate to agent vaults through allocation agents. Yieldr becomes the agent OS for onchain funds.</p>
            </div>

            <PageFooter pageId="roadmap" />
          </section>

          {/* PAGE 11: Risk and Restrictions */}
          <section className={'dx-page ' + (activePage === 'risk-restrictions' ? 'active' : '')} id="page-risk-restrictions">
            <SectionTag pageId="risk-restrictions" />
            <h1>Risk and Restrictions</h1>
            <p className="dx-subtitle">Yieldr is experimental onchain infrastructure.</p>

            <p>Agent vaults and agent trading strategies may involve significant risk, including:</p>
            <ul className="dx-list">
              <li>Market risk</li>
              <li>Smart contract risk</li>
              <li>Liquidity risk</li>
              <li>Oracle risk</li>
              <li>Execution risk</li>
              <li>Strategy risk</li>
              <li>Impermanent loss</li>
              <li>Leverage risk</li>
              <li>Counterparty or protocol risk</li>
              <li>Regulatory risk</li>
              <li>Agent error or model risk</li>
            </ul>

            <p>Past performance is not indicative of future results. Live performance may reflect Yieldr project capital only.</p>
            <p>Agent outputs are informational and operational. They are not guarantees.</p>
            <p>Depositors should understand the vault strategy, risks, restrictions, and eligibility requirements before participating.</p>
            <p>Yieldr may restrict access in certain jurisdictions.</p>

            <div className="dx-callout dx-callout-warning">
              <div className="dx-callout-title">Important</div>
              <p>Nothing in these docs is financial advice, investment advice, or an offer to sell or solicitation to buy any security, financial instrument, or investment product.</p>
            </div>

            <PageFooter pageId="risk-restrictions" />
          </section>

          {/* PAGE 12: Connect */}
          <section className={'dx-page ' + (activePage === 'connect' ? 'active' : '')} id="page-connect">
            <SectionTag pageId="connect" />
            <h1>Connect</h1>
            <p className="dx-subtitle">Follow the build.</p>

            <div className="dx-cards-grid">
              <a className="dx-card" href="https://t.me/+KhZW5qgC" target="_blank" rel="noopener noreferrer">
                <div className="dx-card-icon">💬</div>
                <div className="dx-card-title">Telegram</div>
                <p className="dx-card-desc">Community, announcements, support.</p>
              </a>
              <a className="dx-card" href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">
                <div className="dx-card-icon">𝕏</div>
                <div className="dx-card-title">X / Twitter</div>
                <p className="dx-card-desc">Build updates, vault performance, agent vault pipeline, and market takes.</p>
              </a>
              <a className="dx-card" href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer">
                <div className="dx-card-icon">🐙</div>
                <div className="dx-card-title">GitHub</div>
                <p className="dx-card-desc">Open-source build logs, commits, and shipped modules.</p>
              </a>
            </div>

            <h2>Quick Links</h2>
            <ul className="dx-list">
              <li>Website — yieldr.org</li>
              <li>Docs — yieldr.org/docs</li>
              <li>Vaults — yieldr.org/vaults</li>
              <li>Build Log — yieldr.org/build-log</li>
            </ul>

            <PageFooter pageId="connect" />
          </section>

        </main>
      </div>

      <EarlyAccessPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}
