'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EarlyAccessPopup } from '../components/payment/EarlyAccessPopup';
import { UserProfile } from '../components/UserProfile';
import { usePayment } from '../context/PaymentContext';
import { useAccount } from 'wagmi';

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

export default function DocsPage() {
  const [activePage, setActivePage] = useState('what-is-yieldr');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { hasCompletedPayment } = usePayment();
  const { isConnected } = useAccount();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle hash navigation
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setActivePage(hash);
    }
  }, []);

  const showPage = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo(0, 0);
    if (isMobileView) {
      setSidebarOpen(false);
    }
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '#' + pageId);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

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

  const PageFooter = ({ pageId }: { pageId: string }) => {
    const { prev, next } = prevNext(pageId);
    return (
      <div className="page-footer">
        <div className="footer-nav">
          {prev ? (
            <a className="footer-nav-btn prev" onClick={() => showPage(prev)}>
              <div className="footer-nav-label">Previous</div>
              <div className="footer-nav-title">&larr; {PAGE_TITLES[prev]}</div>
            </a>
          ) : <div></div>}
          {next ? (
            <a className="footer-nav-btn next" onClick={() => showPage(next)}>
              <div className="footer-nav-label">Next</div>
              <div className="footer-nav-title">{PAGE_TITLES[next]} &rarr;</div>
            </a>
          ) : <div></div>}
        </div>
      </div>
    );
  };

  const NAV_SECTIONS: Array<{ icon: string; title: string; items: Array<{ id: string; label: string }> }> = [
    {
      icon: '📖', title: 'Getting Started', items: [
        { id: 'what-is-yieldr', label: 'What is Yieldr?' },
        { id: 'the-problem', label: 'The Problem' },
        { id: 'the-solution', label: 'The Solution' },
      ],
    },
    {
      icon: '🏦', title: 'Agent Vaults', items: [
        { id: 'agent-vaults', label: 'Agent Vaults' },
        { id: 'fund-launch-waitlist', label: 'Fund Launch Waitlist' },
        { id: 'community-project-vaults', label: 'Community & Project Vaults' },
      ],
    },
    {
      icon: '🧭', title: 'Depositors', items: [
        { id: 'allocation-agents', label: 'Allocation Agents' },
        { id: 'depositor-whitelist', label: 'Depositor Whitelist' },
      ],
    },
    {
      icon: '🪙', title: 'YLDR Token', items: [
        { id: 'yldr-token', label: 'Token Overview' },
        { id: 'roadmap', label: 'Roadmap' },
      ],
    },
    {
      icon: '📚', title: 'Resources', items: [
        { id: 'risk-restrictions', label: 'Risk & Restrictions' },
        { id: 'connect', label: 'Connect' },
      ],
    },
  ];

  return (
    <>
      {/* Sidebar Overlay for mobile */}
      <div className={'sidebar-overlay ' + (sidebarOpen ? 'visible' : '')} onClick={closeSidebar}></div>

      {/* Mobile Menu Overlay */}
      {sidebarOpen && isMobileView && (
        <div className="mobile-menu-overlay" onClick={closeSidebar}>
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
              <button className="mobile-menu-close" onClick={closeSidebar}>✕</button>
            </div>
            <div className="mobile-menu-content">
              {NAV_SECTIONS.map((section) => (
                <div className="mobile-menu-section" key={section.title}>
                  <div className="mobile-menu-section-title">{section.icon} {section.title}</div>
                  {section.items.map((item) => (
                    <a
                      key={item.id}
                      className={'mobile-menu-sublink ' + (activePage === item.id ? 'active' : '')}
                      onClick={() => navigateAndClose(item.id)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              ))}

              {/* Get Early Access CTA */}
              {hasCompletedPayment && isConnected ? (
                <Link
                  href="/allocations"
                  className="mobile-menu-cta"
                  onClick={closeSidebar}
                >
                  My Allocation
                </Link>
              ) : (
                <button
                  className="mobile-menu-cta"
                  onClick={() => {
                    closeSidebar();
                    setShowPopup(true);
                  }}
                >
                  Get Early Access
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header — shared nav style */}
      <nav className="snav">
        <Link href="/" className="snav-logo-link">
          <svg className="snav-logo-svg" viewBox="0 0 100 120">
            <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
            <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3"/>
            <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9"/>
          </svg>
          <span className="snav-brand">YIELDR</span>
        </Link>
        <div className="snav-links">
          <Link href="/">Home</Link>
          <Link href="/docs" className="snav-active">Docs</Link>
          <Link href="/team">Team</Link>
          <Link href="/build-in-public">Build Progress</Link>
        </div>
        <div className="snav-right">
          <div className="snav-soc">
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
            <a href="https://app.yieldr.org/demo" className="snav-cta">Launch Your Quant</a>
          )}
          <button className="snav-hamburger" onClick={toggleSidebar} aria-label="Open menu">☰</button>
        </div>
      </nav>

      {/* Sidebar */}
      <nav className={'sidebar ' + (sidebarOpen ? 'open' : '')}>
        <div className="sidebar-content">
          {NAV_SECTIONS.map((section) => (
            <div className="nav-section" key={section.title}>
              <div className="nav-section-title"><span className="nav-section-icon">{section.icon}</span> {section.title}</div>
              {section.items.map((item) => (
                <a
                  key={item.id}
                  className={'nav-link ' + (activePage === item.id ? 'active' : '')}
                  onClick={() => showPage(item.id)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">

          {/* PAGE 01: What is Yieldr? */}
          <section className={'page-section ' + (activePage === 'what-is-yieldr' ? 'active' : '')} id="page-what-is-yieldr">
            <h1>What is Yieldr?</h1>
            <p className="page-subtitle">Documentation · v2.0 · Updated July 2026</p>

            <div className="callout callout-success">
              <div className="callout-title">The agent stack for onchain funds.</div>
              <p>Connect your wallet, prove your edge, and launch an agent vault — turning your onchain performance into recurring revenue.</p>
            </div>

            <p>Yieldr helps traders, project communities, DAOs, and depositors use agents to launch, operate, monitor, and allocate across onchain funds.</p>
            <p>Agents identify edge, match capital, handle communication, monitor performance, and rotate allocation when edge changes.</p>

            <h2>Yieldr is the agent OS for onchain funds</h2>
            <p>Onchain performance is public. Wallets reveal trading history, PnL, market selection, sizing, drawdowns, and execution behavior. But a wallet alone is not a fund.</p>
            <p>Yieldr turns verifiable onchain performance into agent vaults.</p>
            <p>An agent vault is an onchain fund structure powered by smart contracts and operated through agents. The vault handles capital, execution rules, performance tracking, and accounting. The agents handle the work around it: edge detection, discovery, depositor matching, communication, monitoring, and allocation intelligence.</p>

            <h2>What Yieldr does</h2>

            <h3>For Traders</h3>
            <p>Launch an agent vault from verifiable onchain edge.</p>
            <p>Yieldr helps traders prove their edge, package it into a strategy, define risk limits, attract aligned depositors, communicate performance, and monitor drift.</p>
            <p>The trader keeps trading. Agents handle the rest.</p>

            <h3>For Project Communities</h3>
            <p>Agent vaults help projects and their communities deploy publicly transparent strategies to grow token liquidity and market depth.</p>
            <p>Projects can use agent vaults to coordinate liquidity, deepen markets, accumulate ecosystem exposure, and give communities a transparent view into strategy execution.</p>
            <p>Another use case is treasury deployment.</p>
            <p>DAOs and project treasuries can deploy funds into proven agent strategies with targeted risk-return goals across asset classes that are unavailable to most DAOs today, including perps, predictions, upcoming Base project coins, liquidity strategies, RWAs, and ecosystem baskets.</p>

            <h3>For Depositors</h3>
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
          <section className={'page-section ' + (activePage === 'the-problem' ? 'active' : '')} id="page-the-problem">
            <h1>Great traders should run onchain funds. Most never do.</h1>
            <p className="page-subtitle">Your wallet is public. Your PnL is onchain. Your edge is more verifiable than anything in traditional finance.</p>

            <p>But you are still only trading your own capital.</p>
            <p>A trader may have strong performance, but performance alone does not create a fund. A fund needs discovery, trust, capital matching, depositor communication, drawdown management, monitoring, reporting, and risk controls.</p>
            <p>Most traders do not want to run that operation. They want to trade.</p>

            <h2>Without Yieldr</h2>
            <p>Strong traders face the same wall:</p>
            <ul className="feature-list">
              <li>Nobody outside their circle knows their track record exists.</li>
              <li>Depositors have no way to find them or trust their edge.</li>
              <li>There is no structured way to match with the right capital.</li>
              <li>Every depositor question pulls the trader out of their positions.</li>
              <li>Drawdowns create noise that must be managed manually.</li>
              <li>Scaling means risking more personal capital instead of scaling through aligned depositors.</li>
            </ul>

            <h2>The Wall</h2>
            <ul className="feature-list">
              <li>No discovery layer.</li>
              <li>No depositor matching.</li>
              <li>No communication when markets move.</li>
              <li>No monitoring when strategy drifts.</li>
              <li>No way to scale edge without scaling personal risk.</li>
            </ul>

            <h2>Yieldr Removes the Wall</h2>
            <p>With Yieldr:</p>
            <ul className="feature-list">
              <li><strong>Quant Agent</strong> identifies edge from wallet history.</li>
              <li><strong>Matching Agent</strong> surfaces vaults to the right depositors.</li>
              <li><strong>Comms Agent</strong> handles depositor queries through volatile periods.</li>
              <li><strong>Monitoring Agent</strong> tracks edge decay before it shows up in PnL.</li>
              <li><strong>Allocation Agent</strong> helps depositors rotate capital toward vaults gaining edge.</li>
            </ul>

            <div className="callout callout-success">
              <p>The trader keeps trading. Agents handle the rest.</p>
            </div>

            <PageFooter pageId="the-problem" />
          </section>

          {/* PAGE 03: The Solution */}
          <section className={'page-section ' + (activePage === 'the-solution' ? 'active' : '')} id="page-the-solution">
            <h1>The Solution</h1>
            <p className="page-subtitle">Yieldr gives every verified onchain edge an agent stack.</p>

            <p>The vault is the capital layer. The agents are the operating layer. Together, they turn onchain performance into recurring revenue.</p>

            <h2>The Yieldr Agent Stack</h2>

            <h3>Quant Agent</h3>
            <p>The Quant Agent analyzes wallet history and strategy performance. It identifies:</p>
            <ul className="feature-list">
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
            <p>The goal is not just to show PnL. The goal is to explain why the edge exists and whether it can scale.</p>

            <h3>Matching Agent</h3>
            <p>The Matching Agent connects agent vaults with depositors whose goals fit the strategy. It evaluates:</p>
            <ul className="feature-list">
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
            <p>The Comms Agent handles depositor communication. It can:</p>
            <ul className="feature-list">
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
            <p>The Monitoring Agent tracks risk, edge decay, and strategy drift. It watches:</p>
            <ul className="feature-list">
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
            <p>The Allocation Agent works for depositors. It discovers vaults, monitors open allocations, compares strategies, and rotates capital based on depositor goals. It can track:</p>
            <ul className="feature-list">
              <li>Which vaults are gaining edge</li>
              <li>Which vaults are losing edge</li>
              <li>Which strategies fit the depositor&apos;s risk-return target</li>
              <li>Whether allocation should be increased, reduced, or exited</li>
              <li>Whether a different vault offers better risk-adjusted opportunity</li>
            </ul>
            <p>This creates passive onchain investing across active agent vaults.</p>

            <h2>The Outcome</h2>
            <p>Traders can scale edge without becoming fund operators.</p>
            <p>Project communities can run transparent liquidity and accumulation strategies.</p>
            <p>DAOs can deploy treasury capital into asset classes they could not previously access.</p>
            <p>Depositors can allocate through agents instead of manually monitoring every vault.</p>
            <p>Yieldr becomes the operating system for onchain funds.</p>

            <PageFooter pageId="the-solution" />
          </section>

          {/* PAGE 04: Agent Vaults */}
          <section className={'page-section ' + (activePage === 'agent-vaults' ? 'active' : '')} id="page-agent-vaults">
            <h1>What are Agent Vaults?</h1>
            <p className="page-subtitle">Onchain funds operated through the Yieldr agent stack.</p>

            <p>Agent vaults combine smart contract vault infrastructure with agents that identify edge, support execution, communicate performance, monitor risk, and help capital move toward strategies that are working.</p>
            <p>A primitive DeFi vault usually does one thing: it holds capital and follows a fixed strategy. An agent vault is different. It is dynamic, monitored, explainable, and connected to an agent network.</p>

            <h2>Agent Vault = Capital Layer + Strategy Layer + Agent Layer</h2>

            <h3>1. Capital Layer</h3>
            <p>The vault holds and tracks capital onchain. It is designed to support:</p>
            <ul className="feature-list">
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
            <p>Each vault has a strategy domain. Examples:</p>
            <ul className="feature-list">
              <li>Prediction markets</li>
              <li>Perps strategies</li>
              <li>Funding-rate arbitrage</li>
              <li>Base memecoin trading</li>
              <li>Project coin accumulation</li>
              <li>Virtuals ecosystem strategies</li>
              <li>Bankr project coin strategies</li>
              <li>Aerodrome liquidity strategies</li>
              <li>Uniswap liquidity strategies</li>
              <li>RWA accumulation</li>
              <li>DAO treasury strategies</li>
            </ul>
            <p>The strategy defines what the vault is trying to do.</p>

            <h3>3. Agent Layer</h3>
            <p>Agents operate around the vault. They help with:</p>
            <ul className="feature-list">
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

            <div className="prompt-card">
              <div className="prompt-text">Step 1 — Connect Wallet</div>
              <p className="prompt-desc">A trader, project, DAO, or strategy operator connects a wallet. Yieldr uses wallet activity and linked strategy data to understand past performance, market exposure, and potential edge.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">Step 2 — Prove Edge</div>
              <p className="prompt-desc">The Quant Agent analyzes the wallet for patterns in PnL, entry/exit timing, sizing, market selection, holding period, drawdown control, repeatability, liquidity conditions, and risk-adjusted returns. The output is an edge profile.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">Step 3 — Define Vault Strategy</div>
              <p className="prompt-desc">The strategy is packaged into an agent vault, defining market, asset class, target AUM, risk level, execution approach, fees, withdrawal terms, max drawdown, max position size, liquidity constraints, and disclosure requirements.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">Step 4 — Match Depositors</div>
              <p className="prompt-desc">The Matching Agent identifies depositors whose goals fit the vault based on asset class, return target, risk tolerance, drawdown limits, time horizon, liquidity preference, and strategy type. Capital is matched to strategy fit, not noise.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">Step 5 — Run and Monitor</div>
              <p className="prompt-desc">Once active, the vault executes its strategy according to defined rules. Agents continuously monitor performance, risk, edge gain or loss, strategy drift, depositor alignment, liquidity, market changes, and position behavior.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">Step 6 — Communicate</div>
              <p className="prompt-desc">The Comms Agent keeps depositors informed with weekly updates, trade summaries, drawdown explanations, strategy notes, risk alerts, market context, and performance reviews — without forcing the trader to become a full-time IR desk.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">Step 7 — Allocate and Rotate</div>
              <p className="prompt-desc">Depositors can use Allocation Agents to monitor vaults continuously. If a vault loses edge, risk increases, or another vault better matches the depositor&apos;s target, the Allocation Agent can recommend or execute rotation according to user-defined rules.</p>
            </div>

            <h2>Why Agent Vaults Matter</h2>
            <p>Agent vaults make onchain funds scalable. They solve the missing operating layer:</p>
            <ul className="feature-list">
              <li>Discovery</li>
              <li>Matching</li>
              <li>Communication</li>
              <li>Monitoring</li>
              <li>Reporting</li>
              <li>Risk intelligence</li>
              <li>Capital rotation</li>
              <li>Edge validation</li>
            </ul>
            <p>This is what primitive vaults cannot do. Primitive vaults hold capital. Agent vaults operate strategies.</p>

            <h2>Agent Vault Categories</h2>

            <h3>Prediction Vaults</h3>
            <p>Vaults that trade prediction markets using wallet intelligence, implied probability, market pricing, and category-specific edge. Example venues: Polymarket.</p>

            <h3>Perps Vaults</h3>
            <p>Vaults that trade perps strategies such as directional trades, funding-rate arbitrage, basis trades, or market-neutral setups. Example venues: Avantis and Hyperliquid.</p>

            <h3>Liquidity Vaults</h3>
            <p>Vaults that deploy into LP strategies across concentrated liquidity, incentive programs, and ecosystem liquidity campaigns. Example venues: Aerodrome and Uniswap.</p>

            <h3>Project Coin Vaults</h3>
            <p>Vaults that accumulate or rotate across project tokens using transparent rules and agent-monitored execution. Example ecosystems: Virtuals, Bankr, and Base project coins.</p>

            <h3>Memecoin Vaults</h3>
            <p>Vaults that trade high-volatility Base-native assets using wallet signals, liquidity filters, momentum signals, and risk limits.</p>

            <h3>RWA Vaults</h3>
            <p>Vaults that accumulate or trade tokenized real-world asset exposure where onchain liquidity and pricing data are available.</p>

            <h3>DAO Treasury Vaults</h3>
            <p>Vaults that help DAOs and project treasuries deploy funds into agent-monitored strategies across asset classes and risk profiles.</p>

            <div className="callout callout-warning">
              <div className="callout-title">Important</div>
              <p>Agent vaults are experimental. They may involve market risk, smart contract risk, execution risk, liquidity risk, strategy risk, agent error, and regulatory risk. Past performance is not indicative of future results. Agent outputs are not guarantees.</p>
            </div>

            <PageFooter pageId="agent-vaults" />
          </section>

          {/* PAGE 05: Fund Launch Waitlist */}
          <section className={'page-section ' + (activePage === 'fund-launch-waitlist' ? 'active' : '')} id="page-fund-launch-waitlist">
            <h1>Fund Launch Waitlist</h1>
            <p className="page-subtitle">Coming around the $YLDR TGE in July 2026.</p>

            <p>The waitlist is for traders, project communities, DAOs, LP strategists, perps traders, prediction-market traders, and ecosystem operators who want to launch agent vaults when Yieldr opens beta access.</p>

            <h2>Who Should Apply?</h2>
            <p>You should apply if you have:</p>
            <ul className="feature-list">
              <li>Verifiable onchain trading history</li>
              <li>A strong X, Telegram, Discord, or project community</li>
              <li>A project token or ecosystem strategy</li>
              <li>Repeatable edge in memecoins, perps, predictions, LP strategies, or project coins</li>
              <li>A DAO or treasury looking for agent-monitored allocation</li>
              <li>Interest in launching a transparent agent vault</li>
              <li>Willingness to operate through public rules, risk limits, and agent monitoring</li>
            </ul>

            <h2>Application Flow</h2>
            <div className="prompt-card">
              <div className="prompt-text">01 — Connect Wallet</div>
              <p className="prompt-desc">Connect the wallet that best represents your trading, project, or strategy history.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">02 — Select Market</div>
              <p className="prompt-desc">Choose the market where you want to launch an agent vault: Project Coins (Bankr + Virtuals), Memecoins (Base), Perps (Avantis + Hyperliquid), Predictions (Polymarket), Liquidity (Aerodrome + Uniswap), RWAs, or DAO Treasury Strategies.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">03 — Select Target AUM</div>
              <p className="prompt-desc">Choose the amount of capital the vault is designed to support: $0–$100K, $100K–$250K, $250K–$500K, $500K–$1M, or $1M+.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">04 — Add Community Links</div>
              <p className="prompt-desc">Add X, Telegram, Discord, website, project page, or DAO links.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">05 — Submit Strategy Intent</div>
              <p className="prompt-desc">Describe what the agent vault will do and why the wallet, project, DAO, or community has an edge.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">06 — Join Waitlist</div>
              <p className="prompt-desc">Your wallet is added to the fund launch waitlist.</p>
            </div>

            <h2>What Happens After Signup?</h2>
            <p>Yieldr reviews the wallet, strategy, and community profile. Applicants may receive:</p>
            <ul className="feature-list">
              <li>Fund readiness status</li>
              <li>Strategy feedback</li>
              <li>Agent vault category recommendation</li>
              <li>Whitelist campaign support</li>
              <li>Beta launch eligibility</li>
              <li>Access to agent vault tooling as it rolls out</li>
            </ul>

            <PageFooter pageId="fund-launch-waitlist" />
          </section>

          {/* PAGE 06: Community and Project Vaults */}
          <section className={'page-section ' + (activePage === 'community-project-vaults' ? 'active' : '')} id="page-community-project-vaults">
            <h1>Community and Project Vaults</h1>
            <p className="page-subtitle">Agent vaults designed for projects, token communities, DAOs, and ecosystem operators.</p>

            <p>They help communities run transparent strategies around liquidity, accumulation, treasury deployment, or ecosystem growth.</p>

            <h2>Use Cases</h2>

            <h3>Token Liquidity and Depth</h3>
            <p>Projects can use agent vaults to deploy transparent strategies that grow token liquidity and market depth. These vaults may support:</p>
            <ul className="feature-list">
              <li>Liquidity accumulation</li>
              <li>Market depth improvement</li>
              <li>Ecosystem token exposure</li>
              <li>LP strategies</li>
              <li>Treasury diversification</li>
              <li>Onchain reporting</li>
            </ul>

            <h3>Project Coin Accumulation</h3>
            <p>Communities can coordinate transparent accumulation strategies around project coins or ecosystem baskets. These vaults should define:</p>
            <ul className="feature-list">
              <li>Target asset or basket</li>
              <li>Target AUM</li>
              <li>Execution pacing</li>
              <li>Liquidity limits</li>
              <li>Risk controls</li>
              <li>Reporting cadence</li>
              <li>Conflict disclosures</li>
            </ul>

            <h3>DAO and Treasury Deployment</h3>
            <p>DAOs and project treasuries can use agent vaults to deploy funds into strategies with defined risk-return goals. This can include asset classes most DAOs do not actively access today, such as:</p>
            <ul className="feature-list">
              <li>Perps</li>
              <li>Predictions</li>
              <li>Base project coins</li>
              <li>Virtuals ecosystem tokens</li>
              <li>Bankr launches</li>
              <li>Aerodrome LP strategies</li>
              <li>RWA exposure</li>
              <li>Funding-rate strategies</li>
            </ul>

            <h3>Community Strategy Vaults</h3>
            <p>Communities with strong distribution can launch agent vaults around a specific thesis. Examples:</p>
            <ul className="feature-list">
              <li>Base ecosystem rotation</li>
              <li>Virtuals agent token basket</li>
              <li>Bankr project coin basket</li>
              <li>Aerodrome LP income strategy</li>
              <li>Prediction-market strategy</li>
              <li>Perps funding arbitrage strategy</li>
            </ul>

            <h2>Required Transparency</h2>
            <p>If a project, DAO, or community is affiliated with assets inside the vault, that relationship should be clearly disclosed.</p>
            <p>Community and project vaults should define:</p>
            <ul className="feature-list">
              <li>Strategy objective</li>
              <li>Asset universe</li>
              <li>Execution rules</li>
              <li>Liquidity constraints</li>
              <li>Risk limits</li>
              <li>Treasury or project affiliation</li>
              <li>Reporting cadence</li>
              <li>Withdrawal terms</li>
              <li>Vault status</li>
            </ul>
            <p>The goal is transparent strategy deployment, not opaque promotion.</p>

            <PageFooter pageId="community-project-vaults" />
          </section>

          {/* PAGE 07: Depositor Allocation Agents */}
          <section className={'page-section ' + (activePage === 'allocation-agents' ? 'active' : '')} id="page-allocation-agents">
            <h1>Depositor Allocation Agents</h1>
            <p className="page-subtitle">Discover, monitor, and allocate across agent vaults.</p>

            <p>Instead of manually checking every vault, depositor goals are set once and agents continuously monitor opportunities.</p>

            <h2>How Allocation Agents Work</h2>

            <div className="prompt-card">
              <div className="prompt-text">Step 1 — Set Goals</div>
              <p className="prompt-desc">Depositors define asset classes, risk tolerance, return target, drawdown tolerance, preferred markets, liquidity needs, and time horizon.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">Step 2 — Discover Vaults</div>
              <p className="prompt-desc">The Allocation Agent scans available agent vaults and identifies strategies that match the depositor&apos;s goals.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">Step 3 — Allocate Capital</div>
              <p className="prompt-desc">The agent can suggest or execute allocations based on user-defined permissions.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">Step 4 — Monitor 24/7</div>
              <p className="prompt-desc">The agent monitors open vault positions, vault-level performance, trade-level performance, edge gain or loss, strategy drift, drawdown, liquidity, and risk changes.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">Step 5 — Rotate When Needed</div>
              <p className="prompt-desc">If a vault loses edge or no longer fits the depositor&apos;s goals, the Allocation Agent can recommend or execute capital rotation into stronger-fit vaults.</p>
            </div>

            <h2>Why It Matters</h2>
            <p>This creates a new onchain passive investing model.</p>
            <p>Depositors no longer need to chase the loudest vault, manually monitor every strategy, or exit only after drawdowns become obvious.</p>
            <p>Agents can continuously detect which vaults are gaining or losing edge.</p>

            <PageFooter pageId="allocation-agents" />
          </section>

          {/* PAGE 08: Depositor Whitelist */}
          <section className={'page-section ' + (activePage === 'depositor-whitelist' ? 'active' : '')} id="page-depositor-whitelist">
            <h1>Depositor Whitelist</h1>
            <p className="page-subtitle">Whitelist your wallet for upcoming agent vaults.</p>

            <p>Depositors can whitelist wallets for upcoming agent vaults. Whitelisting signals interest in vault access before beta launch.</p>

            <h2>What Depositors Can Do</h2>
            <ul className="feature-list">
              <li>Explore agent vault categories</li>
              <li>Whitelist any agent vault</li>
              <li>Track waitlist growth</li>
              <li>Follow vault updates</li>
              <li>Join beta launch eligibility</li>
              <li>Participate in product trials where available</li>
            </ul>

            <h2>$YLDR Whitelist Rewards</h2>
            <p>Eligible users who whitelist and participate in qualifying agent vault product trials may earn $YLDR rewards at beta launch.</p>
            <p>Reward ranges, eligibility, minimum participation, and claim conditions are subject to final product and token launch rules.</p>
            <p>A minimum USDC participation requirement may apply to prevent low-quality farming and encourage genuine product usage.</p>

            <div className="callout callout-warning">
              <div className="callout-title">Important</div>
              <p>Whitelist participation does not guarantee profit, vault access, token allocation, or future rewards. Rewards may be limited by eligibility, jurisdiction, product usage, and final launch terms.</p>
            </div>

            <PageFooter pageId="depositor-whitelist" />
          </section>

          {/* PAGE 09: $YLDR Token */}
          <section className={'page-section ' + (activePage === 'yldr-token' ? 'active' : '')} id="page-yldr-token">
            <h1>$YLDR Token</h1>
            <p className="page-subtitle">The protocol token for the Yieldr agent OS.</p>

            <p>The token is designed around agent access, agent trading, protocol participation, and future protocol utility.</p>

            <h2>Planned Utility</h2>
            <p>$YLDR may be used for:</p>
            <ul className="feature-list">
              <li>Agent inference access</li>
              <li>Agent trading fees</li>
              <li>Protocol participation</li>
              <li>Future fee-related utilities</li>
            </ul>
            <p>Final utility may evolve as the product and legal structure mature.</p>

            <h2>TGE</h2>
            <div className="token-hero">
              <div className="token-symbol">⚡</div>
              <div className="token-name">YLDR</div>
              <div className="token-stats">
                <div className="token-stat">
                  <div className="token-stat-value">Jul 2026</div>
                  <div className="token-stat-label">Planned TGE</div>
                </div>
                <div className="token-stat">
                  <div className="token-stat-value">Virtuals</div>
                  <div className="token-stat-label">Launch Ecosystem</div>
                </div>
                <div className="token-stat">
                  <div className="token-stat-value">&lt;$200K</div>
                  <div className="token-stat-label">Genesis FDV</div>
                </div>
              </div>
            </div>
            <p>Tokenomics information and Virtuals launch page URL will be updated soon.</p>

            <h2>Whitelist Rewards</h2>
            <p>Users who whitelist agent vaults and complete eligible product participation may qualify for $YLDR rewards at beta launch.</p>
            <p>Reward mechanics are designed to reward genuine users, not passive farmers.</p>

            <div className="callout callout-warning">
              <div className="callout-title">Important</div>
              <p>$YLDR details are subject to change. Nothing in these docs constitutes an offer to sell or solicitation to buy any security or financial instrument. Token access and rewards may be restricted by jurisdiction.</p>
            </div>

            <PageFooter pageId="yldr-token" />
          </section>

          {/* PAGE 10: Roadmap */}
          <section className={'page-section ' + (activePage === 'roadmap' ? 'active' : '')} id="page-roadmap">
            <h1>Roadmap</h1>
            <p className="page-subtitle">From live agent trading to the open agent fund network.</p>

            <div className="roadmap-item current">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">Phase 1 — Live</div>
              <h3 className="roadmap-title">Live Agent Trading</h3>
              <p className="roadmap-desc">Yieldr operates live agent trading strategies using project capital. Current focus: Polymarket prediction trading, wallet edge detection, agent research workflows, public performance reporting, trading analytics, and build-in-public transparency.</p>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">Phase 2 — Coming around $YLDR TGE in July 2026</div>
              <h3 className="roadmap-title">Whitelist and Fund Launch Applications</h3>
              <p className="roadmap-desc">Users can whitelist wallets on upcoming agent vaults. Traders, projects, DAOs, and communities can apply to launch agent vaults. Yieldr begins forming the early vault pipeline across project coins, memecoins, perps, predictions, LP strategies, RWAs, and DAO treasury strategies.</p>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">Phase 3 — Planned July 2026</div>
              <h3 className="roadmap-title">$YLDR TGE</h3>
              <p className="roadmap-desc">$YLDR launches through the Virtuals ecosystem. Eligible users may participate according to final launch and jurisdictional rules. Tokenomics information and Virtuals launch page URL will be published before launch.</p>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">Phase 4 — Planned Q1–Q2 2027</div>
              <h3 className="roadmap-title">Beta Launch</h3>
              <p className="roadmap-desc">Whitelisted users begin participating in selected agent vaults. Selected launch applicants begin operating early agent vaults under controlled beta conditions. Agents begin supporting matching, comms, monitoring, reporting, risk alerts, and allocation intelligence.</p>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">Phase 5 — Planned</div>
              <h3 className="roadmap-title">Multi-Venue Expansion</h3>
              <p className="roadmap-desc">Yieldr expands agent vault support across Polymarket, Avantis, Hyperliquid, Aerodrome, Uniswap, Virtuals, Bankr, and selected RWA venues.</p>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">Phase 6 — Vision</div>
              <h3 className="roadmap-title">Open Agent Fund Network</h3>
              <p className="roadmap-desc">Anyone with verified edge can apply to launch an agent vault. Eligible depositors can discover, monitor, and allocate to agent vaults through allocation agents. Yieldr becomes the agent OS for onchain funds.</p>
            </div>

            <PageFooter pageId="roadmap" />
          </section>

          {/* PAGE 11: Risk and Restrictions */}
          <section className={'page-section ' + (activePage === 'risk-restrictions' ? 'active' : '')} id="page-risk-restrictions">
            <h1>Risk and Restrictions</h1>
            <p className="page-subtitle">Yieldr is experimental onchain infrastructure.</p>

            <p>Agent vaults and agent trading strategies may involve significant risk, including:</p>
            <ul className="feature-list">
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

            <div className="callout callout-warning">
              <div className="callout-title">Important</div>
              <p>Nothing in these docs is financial advice, investment advice, or an offer to sell or solicitation to buy any security, financial instrument, or investment product.</p>
            </div>

            <PageFooter pageId="risk-restrictions" />
          </section>

          {/* PAGE 12: Connect */}
          <section className={'page-section ' + (activePage === 'connect' ? 'active' : '')} id="page-connect">
            <h1>Connect</h1>
            <p className="page-subtitle">Follow the build.</p>

            <div className="cards-grid">
              <a className="card" href="https://t.me/+KhZW5qgC" target="_blank" rel="noopener noreferrer">
                <div className="card-icon">💬</div>
                <div className="card-title">Telegram</div>
                <p className="card-desc">Community, announcements, support.</p>
              </a>
              <a className="card" href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">
                <div className="card-icon">𝕏</div>
                <div className="card-title">X / Twitter</div>
                <p className="card-desc">Build updates, vault performance, agent vault pipeline, and market takes.</p>
              </a>
              <a className="card" href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer">
                <div className="card-icon">🐙</div>
                <div className="card-title">GitHub</div>
                <p className="card-desc">Open-source build logs, commits, and shipped modules.</p>
              </a>
            </div>

            <h2>Quick Links</h2>
            <ul className="feature-list">
              <li>Website — yieldr.org</li>
              <li>Docs — yieldr.org/docs</li>
              <li>Vaults — yieldr.org/vaults</li>
              <li>Build Log — yieldr.org/build-log</li>
            </ul>

            <PageFooter pageId="connect" />
          </section>

        </div>
      </main>

      {/* Payment Popup */}
      <EarlyAccessPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
}
