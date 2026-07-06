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
  'community-project-vaults': 'DAO & Treasury Depositors',
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
        { id: 'community-project-vaults', label: 'DAO & Treasury Depositors' },
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

            <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer" title="GitHub">
              <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
          {hasCompletedPayment && isConnected ? (
            <UserProfile />
          ) : (
            <Link href="/explorer" className="dx-nav-cta">Explore Vaults ↗</Link>
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
            <h1>The <span className="ac">agent stack</span> for onchain funds.</h1>
            <p className="dx-subtitle">Connect your wallet, prove your edge, and launch an agent vault — turning your onchain performance into recurring revenue.</p>
            <p>Yieldr helps traders and depositors use agents to launch, operate, monitor, and allocate across onchain funds.</p>
            <p>Agents identify edge, match capital, handle communication, monitor performance, and rotate allocation when edge changes.</p>

            <SectionTag pageId="what-is-yieldr" />
            <h2>Yieldr is the agent OS for onchain funds.</h2>
            <p>Onchain performance is public. Wallets reveal trading history, PnL, market selection, sizing, drawdowns, and execution behavior. But a wallet alone is not a fund.</p>
            <p>Yieldr turns verifiable onchain performance into agent vaults.</p>
            <p>An agent vault is an onchain fund structure powered by smart contracts and operated through agents. The vault handles capital, execution rules, performance tracking, and accounting. The agents handle the work around it: edge detection, discovery, depositor matching, communication, monitoring, and allocation intelligence.</p>

            <h2>What Yieldr does</h2>

            <h3>For Traders</h3>
            <p>Launch an agent vault from verifiable onchain edge.</p>
            <p>Yieldr helps traders prove their edge, package it into a strategy, define risk limits, attract aligned depositors, communicate performance, and monitor drift.</p>
            <p>The trader keeps trading. Agents handle the rest.</p>

            <h3>For Depositors</h3>
            <p>Depositors range from individuals to DAOs and treasuries allocating pooled capital into vetted onchain trading strategies across asset classes — perps, predictions, RWAs, and ecosystem baskets — that were previously hard to access with confidence.</p>
            <p>Depositors can launch allocation agents that discover and allocate capital across agent vaults based on asset class, risk goals, and return targets.</p>
            <p>Allocation agents monitor positions across vaults 24/7. They detect edge gain or edge loss in real time, evaluate every trade, and can decide when to rotate capital from a vault losing edge into a vault showing stronger performance.</p>
            <p>Agent vaults and allocation agents create a new passive investing primitive onchain.</p>
            <p>This is not possible with primitive DeFi vaults, where users deposit into static strategies and monitor risk manually.</p>

            <h3>For the Market</h3>
            <p>Yieldr removes the wall between verified edge and scalable capital.</p>
            <p>Without Yieldr, strong traders stay trapped inside their own wallet. Their track record is public, but hard to discover. Depositors cannot easily evaluate or trust the edge. Communication breaks down during drawdowns. Scaling means taking more personal risk.</p>
            <p>With Yieldr, agents make the edge legible, match it with the right capital, communicate through volatility, and monitor decay before it shows up in PnL.</p>
            <p>The constraint moves from fund operations to verified edge.</p>

            <PageFooter pageId="what-is-yieldr" />
          </section>

          {/* PAGE 02: The Problem */}
          <section className={'dx-page ' + (activePage === 'the-problem' ? 'active' : '')} id="page-the-problem">
            <SectionTag pageId="the-problem" />
            <h1>Great traders should run onchain funds. Most never do.</h1>
            <p className="dx-subtitle">Your wallet is public. Your PnL is onchain. Your edge is more verifiable than anything in traditional finance. But you are still only trading your own capital.</p>

            <p>A trader may have strong performance, but performance alone does not create a fund. A fund needs discovery, trust, capital matching, depositor communication, drawdown management, monitoring, reporting, and risk controls.</p>
            <p>Most traders do not want to run that operation.</p>
            <p>They want to trade.</p>

            <h2>Without Yieldr</h2>
            <p>Strong traders face the same wall:</p>
            <ul className="dx-list">
              <li>Nobody outside their circle knows their track record exists.</li>
              <li>Depositors have no way to find them or trust their edge.</li>
              <li>There is no structured way to match with the right capital.</li>
              <li>Every depositor question pulls the trader out of their positions.</li>
              <li>Drawdowns create noise that must be managed manually.</li>
              <li>Scaling means risking more personal capital instead of scaling through aligned depositors.</li>
            </ul>

            <h2>The Wall</h2>
            <ul className="dx-list">
              <li>No discovery layer.</li>
              <li>No depositor matching.</li>
              <li>No communication when markets move.</li>
              <li>No monitoring when strategy drifts.</li>
              <li>No way to scale edge without scaling personal risk.</li>
            </ul>

            <h2>Yieldr Removes the Wall</h2>
            <p>With Yieldr:</p>
            <ul className="dx-list">
              <li>Quant Agent identifies edge from wallet history.</li>
              <li>Matching Agent surfaces vaults to the right depositors.</li>
              <li>Comms Agent handles depositor queries through volatile periods.</li>
              <li>Monitoring Agent tracks edge decay before it shows up in PnL.</li>
              <li>Allocation Agent helps depositors rotate capital toward vaults gaining edge.</li>
            </ul>
            <p>The trader keeps trading.</p>
            <p>Agents handle the rest.</p>

            <PageFooter pageId="the-problem" />
          </section>

          {/* PAGE 03: The Solution */}
          <section className={'dx-page ' + (activePage === 'the-solution' ? 'active' : '')} id="page-the-solution">
            <SectionTag pageId="the-solution" />
            <h1>Yieldr gives every verified onchain edge an agent stack.</h1>
            <p className="dx-subtitle">The vault is the capital layer. The agents are the operating layer. Together, they turn onchain performance into recurring revenue.</p>

            <h2>The Yieldr Agent Stack</h2>

            <h3>Quant Agent</h3>
            <p>The Quant Agent analyzes wallet history and strategy performance.</p>
            <p>It identifies:</p>
            <ul className="dx-list">
              <li>Where the edge exists</li>
              <li>Which markets the wallet performs best in</li>
              <li>Entry and exit behavior</li>
              <li>Position sizing</li>
              <li>Holding periods</li>
              <li>Drawdown history</li>
              <li>Win rate and loss profile</li>
              <li>Regime sensitivity</li>
              <li>Repeatability of returns</li>
              <li>Whether performance is edge, beta, luck, or insider-like timing</li>
            </ul>
            <p>The goal is not just to show PnL.</p>
            <p>The goal is to explain why the edge exists and whether it can scale.</p>

            <h3>Matching Agent</h3>
            <p>The Matching Agent connects agent vaults with depositors whose goals fit the strategy.</p>
            <p>It evaluates:</p>
            <ul className="dx-list">
              <li>Asset class preference</li>
              <li>Risk tolerance</li>
              <li>Return target</li>
              <li>Drawdown tolerance</li>
              <li>Holding period</li>
              <li>Market exposure</li>
              <li>Liquidity needs</li>
              <li>Strategy type</li>
              <li>Vault performance</li>
              <li>Edge strength</li>
            </ul>
            <p>Instead of relying on noisy leaderboards or social clout, capital is matched to vaults based on fit.</p>

            <h3>Comms Agent</h3>
            <p>The Comms Agent handles depositor communication.</p>
            <p>It can:</p>
            <ul className="dx-list">
              <li>Answer depositor questions</li>
              <li>Summarize weekly performance</li>
              <li>Explain drawdowns</li>
              <li>Describe strategy changes</li>
              <li>Report market context</li>
              <li>Explain risk events</li>
              <li>Translate trading activity into simple updates</li>
              <li>Keep depositors informed through volatility</li>
            </ul>
            <p>This keeps the trader focused on positions while depositors stay informed.</p>

            <h3>Monitoring Agent</h3>
            <p>The Monitoring Agent tracks risk, edge decay, and strategy drift.</p>
            <p>It watches:</p>
            <ul className="dx-list">
              <li>Whether the vault is still following its stated strategy</li>
              <li>Whether edge is improving or degrading</li>
              <li>Whether position sizing is changing</li>
              <li>Whether drawdown exceeds historical norms</li>
              <li>Whether liquidity risk is increasing</li>
              <li>Whether leverage is creeping up</li>
              <li>Whether AUM is becoming too large for the strategy</li>
              <li>Whether recent performance is repeatable or luck-driven</li>
            </ul>
            <p>The Monitoring Agent flags problems before they become obvious in PnL.</p>

            <h3>Allocation Agent</h3>
            <p>The Allocation Agent works for depositors.</p>
            <p>It discovers vaults, monitors open allocations, compares strategies, and rotates capital based on depositor goals.</p>
            <p>It can track:</p>
            <ul className="dx-list">
              <li>Which vaults are gaining edge</li>
              <li>Which vaults are losing edge</li>
              <li>Which strategies fit the depositor&apos;s risk-return target</li>
              <li>Whether allocation should be increased, reduced, or exited</li>
              <li>Whether a different vault offers better risk-adjusted opportunity</li>
            </ul>
            <p>This creates passive onchain investing across active agent vaults.</p>

            <h2>The Outcome</h2>
            <p>Traders can scale edge without becoming fund operators.</p>
            <p>Depositors can allocate through agents instead of manually monitoring every vault.</p>
            <p>Yieldr becomes the operating system for onchain funds.</p>

            <PageFooter pageId="the-solution" />
          </section>

          {/* PAGE 04: Agent Vaults */}
          <section className={'dx-page ' + (activePage === 'agent-vaults' ? 'active' : '')} id="page-agent-vaults">
            <SectionTag pageId="agent-vaults" />
            <h1>What are Agent Vaults?</h1>
            <p className="dx-subtitle">Agent vaults are onchain funds operated through the Yieldr agent stack.</p>
            <p>They combine smart contract vault infrastructure with agents that identify edge, support execution, communicate performance, monitor risk, and help capital move toward strategies that are working.</p>
            <p>A primitive DeFi vault usually does one thing: it holds capital and follows a fixed strategy.</p>
            <p>An agent vault is different.</p>
            <p>It is dynamic, monitored, explainable, and connected to an agent network.</p>

            <h2>Agent Vault = Capital Layer + Strategy Layer + Agent Layer</h2>

            <h3>1. Capital Layer</h3>
            <p>The vault holds and tracks capital onchain.</p>
            <p>It is designed to support:</p>
            <ul className="dx-list">
              <li>Deposits</li>
              <li>Withdrawals</li>
              <li>Strategy accounting</li>
              <li>Performance tracking</li>
              <li>Fee logic</li>
              <li>Risk limits</li>
              <li>Public reporting</li>
              <li>Vault status</li>
              <li>Onchain transparency</li>
            </ul>
            <p>The vault is where capital lives.</p>

            <h3>2. Strategy Layer</h3>
            <p>Each vault has a strategy domain.</p>
            <p>Examples:</p>
            <ul className="dx-list">
              <li>Prediction markets</li>
              <li>Perps strategies</li>
              <li>Funding-rate arbitrage</li>
              <li>Base memecoin trading</li>
              <li>Project coin accumulation</li>
              <li>Virtuals ecosystem strategies</li>
              <li>Aerodrome liquidity strategies</li>
              <li>Uniswap liquidity strategies</li>
              <li>RWA accumulation</li>
              <li>DAO treasury strategies</li>
            </ul>
            <p>The strategy defines what the vault is trying to do.</p>

            <h3>3. Agent Layer</h3>
            <p>Agents operate around the vault.</p>
            <p>They help with:</p>
            <ul className="dx-list">
              <li>Edge detection</li>
              <li>Depositor matching</li>
              <li>Performance communication</li>
              <li>Risk monitoring</li>
              <li>Strategy drift alerts</li>
              <li>Trade explanation</li>
              <li>Allocation rotation</li>
              <li>Vault comparison</li>
              <li>Depositor updates</li>
              <li>Fund readiness analysis</li>
            </ul>
            <p>The agents make the vault intelligent.</p>

            <h2>How Agent Vaults Work</h2>

            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 1 — Connect Wallet</div>
              <div className="dx-prompt-desc">
                <p>A trader or strategy operator connects a wallet.</p>
                <p>Yieldr uses wallet activity and linked strategy data to understand past performance, market exposure, and potential edge.</p>
              </div>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 2 — Prove Edge</div>
              <div className="dx-prompt-desc">
                <p>The Quant Agent analyzes the wallet.</p>
                <p>It looks for patterns in:</p>
                <ul className="dx-list">
                  <li>PnL</li>
                  <li>Entry timing</li>
                  <li>Exit timing</li>
                  <li>Sizing</li>
                  <li>Market selection</li>
                  <li>Holding period</li>
                  <li>Drawdown control</li>
                  <li>Repeatability</li>
                  <li>Liquidity conditions</li>
                  <li>Risk-adjusted returns</li>
                </ul>
                <p>The output is an edge profile.</p>
              </div>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 3 — Define Vault Strategy</div>
              <div className="dx-prompt-desc">
                <p>The strategy is packaged into an agent vault.</p>
                <p>The vault defines:</p>
                <ul className="dx-list">
                  <li>Market</li>
                  <li>Asset class</li>
                  <li>Target AUM</li>
                  <li>Risk level</li>
                  <li>Execution approach</li>
                  <li>Fees</li>
                  <li>Withdrawal terms</li>
                  <li>Max drawdown</li>
                  <li>Max position size</li>
                  <li>Liquidity constraints</li>
                  <li>Disclosure requirements</li>
                </ul>
              </div>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 4 — Match Depositors</div>
              <div className="dx-prompt-desc">
                <p>The Matching Agent identifies depositors whose goals fit the vault.</p>
                <p>It matches based on:</p>
                <ul className="dx-list">
                  <li>Asset class</li>
                  <li>Return target</li>
                  <li>Risk tolerance</li>
                  <li>Drawdown limits</li>
                  <li>Time horizon</li>
                  <li>Liquidity preference</li>
                  <li>Strategy type</li>
                </ul>
                <p>Capital is matched to strategy fit, not noise.</p>
              </div>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 5 — Run and Monitor</div>
              <div className="dx-prompt-desc">
                <p>Once active, the vault executes its strategy according to defined rules.</p>
                <p>Agents continuously monitor:</p>
                <ul className="dx-list">
                  <li>Performance</li>
                  <li>Risk</li>
                  <li>Edge gain or loss</li>
                  <li>Strategy drift</li>
                  <li>Depositor alignment</li>
                  <li>Liquidity</li>
                  <li>Market changes</li>
                  <li>Position behavior</li>
                </ul>
              </div>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 6 — Communicate</div>
              <div className="dx-prompt-desc">
                <p>The Comms Agent keeps depositors informed.</p>
                <p>It can generate:</p>
                <ul className="dx-list">
                  <li>Weekly updates</li>
                  <li>Trade summaries</li>
                  <li>Drawdown explanations</li>
                  <li>Strategy notes</li>
                  <li>Risk alerts</li>
                  <li>Market context</li>
                  <li>Performance reviews</li>
                </ul>
                <p>This keeps the vault transparent without forcing the trader to become a full-time IR desk.</p>
              </div>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 7 — Allocate and Rotate</div>
              <div className="dx-prompt-desc">
                <p>Depositors can use Allocation Agents to monitor vaults continuously.</p>
                <p>If a vault loses edge, risk increases, or another vault better matches the depositor&apos;s target, the Allocation Agent can recommend or execute rotation according to user-defined rules.</p>
              </div>
            </div>

            <h2>Why Agent Vaults Matter</h2>
            <p>Agent vaults make onchain funds scalable.</p>
            <p>They solve the missing operating layer:</p>
            <ul className="dx-list">
              <li>Discovery</li>
              <li>Matching</li>
              <li>Communication</li>
              <li>Monitoring</li>
              <li>Reporting</li>
              <li>Risk intelligence</li>
              <li>Capital rotation</li>
              <li>Edge validation</li>
            </ul>
            <p>This is what primitive vaults cannot do.</p>
            <p>Primitive vaults hold capital.</p>
            <p>Agent vaults operate strategies.</p>

            <h2>Agent Vault Categories</h2>

            <h3>Prediction Vaults</h3>
            <p>Vaults that trade prediction markets using wallet intelligence, implied probability, market pricing, and category-specific edge.</p>
            <p>Example venues: Polymarket.</p>

            <h3>Perps Vaults</h3>
            <p>Vaults that trade perps strategies such as directional trades, funding-rate arbitrage, basis trades, or market-neutral setups.</p>
            <p>Example venues: Avantis and Hyperliquid.</p>

            <h3>Liquidity Vaults</h3>
            <p>Vaults that deploy into LP strategies across concentrated liquidity, incentive programs, and ecosystem liquidity campaigns.</p>
            <p>Example venues: Aerodrome and Uniswap.</p>

            <h3>Project Coin Vaults</h3>
            <p>Vaults that accumulate or rotate across project tokens using transparent rules and agent-monitored execution.</p>
            <p>Example ecosystems: Virtuals and Base project coins.</p>

            <h3>Memecoin Vaults</h3>
            <p>Vaults that trade high-volatility Base-native assets using wallet signals, liquidity filters, momentum signals, and risk limits.</p>

            <h3>RWA Vaults</h3>
            <p>Vaults that accumulate or trade tokenized real-world asset exposure where onchain liquidity and pricing data are available.</p>

            <h3>Allocator Funds <span className="dx-tag-inline">Future</span></h3>
            <p>A future vault type distinct from trader-run agent vaults. Where an agent vault packages a trader&apos;s edge, an Allocator Fund packages an allocator&apos;s track record of allocating across agent vaults — pooling passive capital behind a fund manager who runs an Allocation Agent on their behalf.</p>
            <p>This is the onchain equivalent of a fund-of-funds or pension fund structure: capital aggregated by an allocator with a demonstrable history of vault selection and rotation decisions, evaluated with the same edge-attribution rigor the Quant Agent applies to traders today — extended one layer up to the allocation decision itself.</p>
            <p>This vault type is gated on platform maturity. Allocator track records cannot exist until sufficient vault history does. Allocator Funds are not part of the current product and will not be available at TGE. See the Roadmap for sequencing.</p>

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
            <p className="dx-subtitle">Any trader can connect a wallet, run a Quant Agent to prove edge, and join the waitlist to launch an agent vault. No community required — edge is the only prerequisite.</p>

            <h2>Who Should Apply?</h2>
            <p>Apply if you have verifiable onchain trading history and want to launch an agent vault to manage capital. That&apos;s it.</p>
            <p>You do not need an existing community, X following, or social presence. Yieldr is a decentralised platform — edge is proven by agents, not by audience size.</p>
            <p>Optionally, traders can add social links (X, Telegram, Discord, website) to add a layer of credibility and trust for depositors — but this is voluntary, not required. Anonymous wallets with strong edge qualify.</p>
            <p>Relevant backgrounds include:</p>
            <ul className="dx-list">
              <li>Perps traders with a history on Avantis or Hyperliquid</li>
              <li>Prediction market traders on Polymarket</li>
              <li>Memecoin and project coin traders on Base or Virtuals</li>
              <li>LP strategists on Aerodrome or Uniswap</li>
              <li>RWA traders with onchain history</li>
              <li>Any trader with repeatable, measurable edge across any supported market</li>
            </ul>

            <h2>Application Flow</h2>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">01 — Connect Wallet</div>
              <p className="dx-prompt-desc">Connect the wallet that holds your trading history. This is the wallet the Quant Agent will analyze.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">02 — Select Market</div>
              <div className="dx-prompt-desc">
                <p>Choose the market where you want to launch an agent vault:</p>
                <ul className="dx-list">
                  <li>Project Coins — Virtuals ecosystem</li>
                  <li>Memecoins — Base</li>
                  <li>Perps — Avantis + Hyperliquid</li>
                  <li>Predictions — Polymarket</li>
                  <li>Liquidity — Aerodrome + Uniswap</li>
                  <li>RWAs — selected onchain RWA venues</li>
                </ul>
              </div>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">03 — Select Target AUM</div>
              <div className="dx-prompt-desc">
                <p>Choose the amount of capital the vault is designed to support:</p>
                <ul className="dx-list">
                  <li>$0–$100K</li>
                  <li>$100K–$250K</li>
                  <li>$250K–$500K</li>
                  <li>$500K–$1M</li>
                  <li>$1M+</li>
                </ul>
              </div>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">04 — Add Social Links (Optional)</div>
              <p className="dx-prompt-desc">Optionally add X, Telegram, Discord, or a website. These give depositors an additional signal of credibility but are not required for waitlist eligibility.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">05 — Describe Strategy Intent</div>
              <p className="dx-prompt-desc">Briefly describe what the agent vault will do — the market, the strategy type, and the edge you believe exists in your wallet history.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">06 — Join Waitlist</div>
              <p className="dx-prompt-desc">Your wallet is added to the fund launch waitlist.</p>
            </div>

            <h2>What Happens After Signup?</h2>
            <p>Yieldr does not manually review or approve fund applications. The platform is decentralised — agents determine vault readiness, not the Yieldr team.</p>
            <p>Here is how the path to launch works:</p>
            <ul className="dx-list">
              <li>The Quant Agent analyzes your wallet history to identify and score your edge.</li>
              <li>The Monitoring Agent tracks your edge continuously across protocols — measuring whether it is sustained, improving, or degrading over time.</li>
              <li>Vaults with sustained, measurable edge go live to accept public deposits when Yieldr opens full beta in Q1 2027.</li>
            </ul>
            <p>Before beta launch, the Yieldr team may directly onboard a small number of top traders to run agent vaults on a whitelist basis — using Yieldr&apos;s agent infrastructure and under closer collaboration. This is separate from the open waitlist process.</p>

            <PageFooter pageId="fund-launch-waitlist" />
          </section>

          {/* PAGE 06: DAO & Treasury Depositors */}
          <section className={'dx-page ' + (activePage === 'community-project-vaults' ? 'active' : '')} id="page-community-project-vaults">
            <SectionTag pageId="community-project-vaults" />
            <h1>DAO &amp; Treasury Depositors</h1>
            <p className="dx-subtitle">DAOs and protocol treasuries can allocate pooled capital across agent vaults — accessing asset classes and active strategies that were previously out of reach for most treasury operators.</p>

            <h2>Why DAOs Deposit Into Agent Vaults</h2>
            <p>Most DAO treasuries sit in stablecoins or native tokens. Active deployment into perps, prediction markets, LP strategies, RWAs, or project coins requires expertise, monitoring, and operational overhead that most DAOs cannot sustain internally.</p>
            <p>Agent vaults change that equation.</p>
            <p>A DAO can allocate treasury capital into a vetted agent vault — where a verified trader or strategy operates the edge, agents monitor risk and performance continuously, and the DAO can exit according to vault withdrawal terms. No internal trading desk required.</p>

            <h2>Asset Classes DAOs Can Access</h2>
            <p>Through agent vaults, DAOs and treasuries can allocate into strategies that most treasury operators cannot actively run themselves:</p>
            <ul className="dx-list">
              <li>Perps directional and funding-rate strategies</li>
              <li>Prediction market strategies</li>
              <li>Base project coins and ecosystem tokens</li>
              <li>Virtuals ecosystem exposure</li>
              <li>Aerodrome and Uniswap LP strategies</li>
              <li>RWA accumulation</li>
              <li>Multi-asset allocation across vault types</li>
            </ul>

            <h2>How DAOs Participate</h2>

            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 1 — Whitelist a Vault</div>
              <p className="dx-prompt-desc">DAOs whitelist agent vaults that match treasury objectives — by asset class, risk level, return target, and strategy type.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 2 — Deploy an Allocation Agent</div>
              <div className="dx-prompt-desc">
                <p>The Allocation Agent discovers and monitors matching vaults. It evaluates:</p>
                <ul className="dx-list">
                  <li>Edge strength and repeatability</li>
                  <li>Drawdown history and risk controls</li>
                  <li>Strategy fit vs. treasury goals</li>
                  <li>Liquidity and withdrawal terms</li>
                </ul>
              </div>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 3 — Allocate and Monitor</div>
              <p className="dx-prompt-desc">Capital is deployed into the selected vault. The Allocation Agent monitors performance and edge continuously — 24/7 — and flags when rotation or exit should be considered.</p>
            </div>
            <div className="dx-prompt-card">
              <div className="dx-prompt-text">Step 4 — Rotate When Edge Shifts</div>
              <p className="dx-prompt-desc">If a vault loses edge, drawdown exceeds limits, or a better-fit opportunity appears, the Allocation Agent recommends or executes rotation according to DAO-defined rules.</p>
            </div>

            <h2>Disclosure Requirements</h2>
            <p>DAOs allocating into vaults that hold assets affiliated with their own protocol should ensure that relationship is clearly disclosed in the vault documentation.</p>
            <p>Allocation decisions should be made on the basis of edge, risk fit, and treasury objectives — not promotional alignment.</p>

            <div className="dx-callout dx-callout-warning">
              <div className="dx-callout-title">Important</div>
              <p>Depositing into agent vaults involves market risk, smart contract risk, liquidity risk, and strategy risk. DAOs should independently evaluate vault strategy, operator track record, and withdrawal terms before allocating treasury capital.</p>
            </div>

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
              <div className="dx-prompt-desc">
                <p>Depositors define:</p>
                <ul className="dx-list">
                  <li>Asset classes</li>
                  <li>Risk tolerance</li>
                  <li>Return target</li>
                  <li>Drawdown tolerance</li>
                  <li>Preferred markets</li>
                  <li>Liquidity needs</li>
                  <li>Time horizon</li>
                </ul>
              </div>
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
              <div className="dx-prompt-desc">
                <p>The agent monitors:</p>
                <ul className="dx-list">
                  <li>Open vault positions</li>
                  <li>Vault-level performance</li>
                  <li>Trade-level performance</li>
                  <li>Edge gain or edge loss</li>
                  <li>Strategy drift</li>
                  <li>Drawdown</li>
                  <li>Liquidity</li>
                  <li>Risk changes</li>
                </ul>
              </div>
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
            <p>$YLDR is designed to power the economic layer of the Yieldr agent stack — connecting agent usage, vault activity, and protocol governance into a single token.</p>

            <h3>Agent Inference Access</h3>
            <p>Querying Yieldr agents — the Quant Agent, Comms Agent, Monitoring Agent, and Allocation Agent — requires inference compute. $YLDR holders get access to agent queries beyond the free tier. The more you hold, the deeper your access: from basic vault explorer queries to full quant analysis runs across multi-protocol wallet history. This makes $YLDR the key to unlocking the full agent OS, not just the explorer.</p>

            <h3>Agent Trading Fees</h3>
            <p>Agent vaults earn performance fees when they outperform. A share of these fees flows through the protocol in $YLDR — creating a direct connection between vault performance and token demand. As more vaults go live and more capital is deployed through agents, fee volume grows. $YLDR captures a portion of that activity rather than value leaking to generic stablecoins or ETH.</p>

            <h3>Protocol Participation</h3>
            <p>$YLDR holders participate in protocol decisions: which vaults get featured, which agent modules get prioritized, allocation of protocol treasury, and future parameter changes. Holding $YLDR aligns you with the network you're using — not just a passive fee capture, but an active stake in the direction of the agent OS.</p>

            <h3>Vault Access Tiers</h3>
            <p>Certain high-performing or capacity-constrained vaults may require $YLDR to access. This creates a natural demand mechanism: the most sought-after vaults on the network gate allocation priority through token holdings, ensuring aligned, long-term depositors get first access over short-term capital that would otherwise dilute edge.</p>

            <p className="dx-subtitle">Final utility mechanics may evolve as the product and legal structure mature. Nothing here constitutes a commitment to specific token mechanics or returns.</p>

            <h2>TGE</h2>
            <div className="dx-token-hero">
              <div className="dx-token-symbol">⚡</div>
              <div className="dx-token-name">YLDR</div>
              <div className="dx-token-stats">
                <div>
                  <div className="dx-token-stat-value">Jul 2026</div>
                  <div className="dx-token-stat-label">TGE Date</div>
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
            <p>Tokenomics information and Virtuals launch details will be published before launch.</p>

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

            <div className="dx-timeline">
              <div className="dx-roadmap-item current">
                <div className="dx-roadmap-connector"></div>
                <div className="dx-roadmap-dot"></div>
                <div className="dx-roadmap-content">
                  <div className="dx-roadmap-phase">Phase 1</div>
                  <div className="dx-roadmap-date live">Live Now</div>
                  <h3 className="dx-roadmap-title">Live Agent Trading</h3>
                  <p className="dx-roadmap-desc">Yieldr operates live agent trading strategies using project capital. Current focus: Polymarket prediction trading, wallet edge detection, agent research workflows, public performance reporting, and build-in-public transparency.</p>
                </div>
              </div>

              <div className="dx-roadmap-item">
                <div className="dx-roadmap-connector"></div>
                <div className="dx-roadmap-dot"></div>
                <div className="dx-roadmap-content">
                  <div className="dx-roadmap-phase">Phase 2</div>
                  <div className="dx-roadmap-date">Jul 2026</div>
                  <h3 className="dx-roadmap-title">$YLDR TGE + Waitlist Opens</h3>
                  <p className="dx-roadmap-desc">$YLDR launches on HOOD Chain via Virtuals. Tokenomics and launch page published before launch. Depositor whitelist and fund launch waitlist open — traders connect wallets, select markets, and join the vault pipeline.</p>
                </div>
              </div>

              <div className="dx-roadmap-item">
                <div className="dx-roadmap-connector"></div>
                <div className="dx-roadmap-dot"></div>
                <div className="dx-roadmap-content">
                  <div className="dx-roadmap-phase">Phase 3</div>
                  <div className="dx-roadmap-date">Aug 2026</div>
                  <h3 className="dx-roadmap-title">Quant Agent Trials</h3>
                  <p className="dx-roadmap-desc">Waitlisted traders get access to the Quant Agent — edge detection and wallet analysis across supported protocols and chains. Traders can run their first edge profile, understand where performance exists, and begin the vault readiness process.</p>
                </div>
              </div>

              <div className="dx-roadmap-item">
                <div className="dx-roadmap-connector"></div>
                <div className="dx-roadmap-dot"></div>
                <div className="dx-roadmap-content">
                  <div className="dx-roadmap-phase">Phase 4</div>
                  <div className="dx-roadmap-date">Dec 2026</div>
                  <h3 className="dx-roadmap-title">Full Agent Stack</h3>
                  <p className="dx-roadmap-desc">Monitoring Agent, Comms Agent, and Allocation Agent roll out. Traders and depositors can access the full agent OS: continuous edge monitoring, depositor communication, and allocation intelligence across the vault pipeline.</p>
                </div>
              </div>

              <div className="dx-roadmap-item">
                <div className="dx-roadmap-connector"></div>
                <div className="dx-roadmap-dot"></div>
                <div className="dx-roadmap-content">
                  <div className="dx-roadmap-phase">Phase 5</div>
                  <div className="dx-roadmap-date">Q1 2027</div>
                  <h3 className="dx-roadmap-title">Vault Infrastructure</h3>
                  <p className="dx-roadmap-desc">Onchain vault infrastructure deploys. Waitlisted traders with sustained, agent-verified edge begin launching agent vaults. Whitelisted depositors gain access to make deposits into selected vaults for the first time.</p>
                </div>
              </div>

              <div className="dx-roadmap-item">
                <div className="dx-roadmap-connector"></div>
                <div className="dx-roadmap-dot"></div>
                <div className="dx-roadmap-content">
                  <div className="dx-roadmap-phase">Phase 6</div>
                  <div className="dx-roadmap-date">Q1–Q2 2027</div>
                  <h3 className="dx-roadmap-title">Full Beta Launch</h3>
                  <p className="dx-roadmap-desc">Full beta opens across agent vaults, depositor whitelist, and allocation agents. Matching, comms, monitoring, and allocation agents operate across the live vault network. Expansion across Polymarket, Avantis, Hyperliquid, Aerodrome, Uniswap, Virtuals, and selected RWA venues.</p>
                </div>
              </div>

              <div className="dx-roadmap-item">
                <div className="dx-roadmap-connector"></div>
                <div className="dx-roadmap-dot"></div>
                <div className="dx-roadmap-content">
                  <div className="dx-roadmap-phase">Phase 7 — Vision</div>
                  <div className="dx-roadmap-date">Open Network</div>
                  <h3 className="dx-roadmap-title">Open Agent Fund Network</h3>
                  <p className="dx-roadmap-desc">Any trader with verified edge can launch an agent vault. Any depositor can discover, whitelist, and allocate across vaults through allocation agents. Yieldr becomes the agent OS for onchain funds.</p>
                </div>
              </div>

              <div className="dx-roadmap-item future">
                <div className="dx-roadmap-connector"></div>
                <div className="dx-roadmap-dot"></div>
                <div className="dx-roadmap-content">
                  <div className="dx-roadmap-phase">Future Roadmap</div>
                  <div className="dx-roadmap-date future-date">Gated on ~10k users</div>
                  <h3 className="dx-roadmap-title">Allocator Funds</h3>
                  <p className="dx-roadmap-desc">Allocation Agents with the best vault-selection track records on Yieldr can themselves become poolable. These are not human-managed funds — they are agent-run vaults that mirror the allocation logic of top-performing Allocation Agents, continuously rebalancing across agent vaults based on edge signals. Passive depositors access optimised allocation without running their own agent.</p>
                  <p className="dx-roadmap-desc">Requires the same edge-attribution rigor the Quant Agent applies to traders, extended to allocation decisions. Gated on sufficient vault track record data existing on the platform.</p>
                  <p className="dx-roadmap-desc dx-roadmap-note">An Allocator Fund differs from an Agent Vault: an Agent Vault is built on a trader&apos;s edge, an Allocator Fund is built on an Allocation Agent&apos;s track record of allocating across agent vaults.</p>
                </div>
              </div>
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
              <a className="dx-card" href="https://web.telegram.org/k/#-3972760184" target="_blank" rel="noopener noreferrer">
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
              <li><Link href="/">Website — yieldr.org</Link></li>
              <li><Link href="/docs">Docs — yieldr.org/docs</Link></li>
              <li><Link href="/explorer">Explorer — yieldr.org/explorer</Link></li>
              <li><Link href="/build-in-public">Build Log — yieldr.org/build-log</Link></li>
            </ul>

            <PageFooter pageId="connect" />
          </section>

        </main>
      </div>

      <EarlyAccessPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
}
