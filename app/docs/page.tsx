'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  const [activePage, setActivePage] = useState('what-is-yieldr');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

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

  const showPage = (pageId) => {
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

  return (
    <>
      {/* Sidebar Overlay for mobile */}
      <div className={'sidebar-overlay ' + (sidebarOpen ? 'visible' : '')} onClick={closeSidebar}></div>

      {/* Header */}
      <header className="docs-header">
        <div className="header-left">
          <Link href="/" className="logo">
            <span className="logo-text">YIELDR</span>
            <span className="logo-divider">|</span>
            <span className="logo-docs">Docs</span>
          </Link>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input type="text" className="search-input" placeholder="Search documentation..." />
            <span className="search-shortcut">⌘K</span>
          </div>
        </div>
        <div className="header-right">
          <Link href="/" className="header-link">Home</Link>
          <Link href="https://discord.gg/yieldr" className="header-link" target="_blank">Discord</Link>
          <Link href="https://app.yieldr.org" className="header-link primary" target="_blank">Launch App</Link>
          <button className="mobile-menu-btn" onClick={toggleSidebar}>☰</button>
        </div>
      </header>

      {/* Sidebar */}
      <nav className={'sidebar ' + (sidebarOpen ? 'open' : '')}>
        <div className="sidebar-content">
          {/* Getting Started */}
          <div className="nav-section">
            <div className="nav-section-title"><span className="nav-section-icon">📖</span> Getting Started</div>
            <a className={'nav-link ' + (activePage === 'what-is-yieldr' ? 'active' : '')} onClick={() => showPage('what-is-yieldr')}>What is Yieldr?</a>
            <a className={'nav-link ' + (activePage === 'the-problem' ? 'active' : '')} onClick={() => showPage('the-problem')}>The Problem</a>
            <a className={'nav-link ' + (activePage === 'quick-start' ? 'active' : '')} onClick={() => showPage('quick-start')}>Quick Start</a>
          </div>

          {/* Product */}
          <div className="nav-section">
            <div className="nav-section-title"><span className="nav-section-icon">🤖</span> Product</div>
            <a className={'nav-link ' + (activePage === 'how-it-works' ? 'active' : '')} onClick={() => showPage('how-it-works')}>How It Works</a>
            <a className={'nav-link ' + (activePage === 'ai-agents' ? 'active' : '')} onClick={() => showPage('ai-agents')}>AI Agents</a>
            <a className={'nav-link ' + (activePage === 'for-investors' ? 'active' : '')} onClick={() => showPage('for-investors')}>For Investors</a>
            <a className={'nav-link ' + (activePage === 'for-traders' ? 'active' : '')} onClick={() => showPage('for-traders')}>For Traders</a>
            <a className={'nav-link ' + (activePage === 'for-lps' ? 'active' : '')} onClick={() => showPage('for-lps')}>For LPs</a>
          </div>

          {/* Platform */}
          <div className="nav-section">
            <div className="nav-section-title"><span className="nav-section-icon">🗺️</span> Platform</div>
            <a className={'nav-link ' + (activePage === 'roadmap' ? 'active' : '')} onClick={() => showPage('roadmap')}>Roadmap</a>
          </div>

          {/* Token */}
          <div className="nav-section">
            <div className="nav-section-title"><span className="nav-section-icon">🪙</span> YLDR Token</div>
            <a className={'nav-link ' + (activePage === 'token-overview' ? 'active' : '')} onClick={() => showPage('token-overview')}>Token Overview</a>
            <a className={'nav-link ' + (activePage === 'token-utility' ? 'active' : '')} onClick={() => showPage('token-utility')}>Utility</a>
            <a className={'nav-link ' + (activePage === 'tokenomics' ? 'active' : '')} onClick={() => showPage('tokenomics')}>Tokenomics</a>
            <a className={'nav-link ' + (activePage === 'how-to-participate' ? 'active' : '')} onClick={() => showPage('how-to-participate')}>How to Participate</a>
          </div>

          {/* Resources */}
          <div className="nav-section">
            <div className="nav-section-title"><span className="nav-section-icon">📚</span> Resources</div>
            <a className={'nav-link ' + (activePage === 'faq' ? 'active' : '')} onClick={() => showPage('faq')}>FAQ</a>
            <a className={'nav-link ' + (activePage === 'glossary' ? 'active' : '')} onClick={() => showPage('glossary')}>Glossary</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">

          {/* PAGE: What is Yieldr? */}
          <section className={'page-section ' + (activePage === 'what-is-yieldr' ? 'active' : '')} id="page-what-is-yieldr">
            <h1>What is Yieldr?</h1>
            <p className="page-subtitle">AI-enabled decentralized asset management.</p>

            <p>Yieldr is a platform where <strong>investors can discover top Traders & Fund Managers onchain</strong> while <strong>Traders can validate performance, raise capital, and scale to fund management</strong> — all powered by AI agents and secured by smart contracts.</p>

            <div className="callout callout-success">
              <div className="callout-title">💡 The Vision</div>
              <p>A two-sided marketplace where investors discover top trading alpha while traders build track records and raise capital. AI agents power discovery, research & analysis, execution and portfolio management — becoming autonomous over time. Smart contracts enable trustless execution. Think of it as AI-powered asset management infrastructure for DeFi — accessible to everyone.</p>
            </div>

            <h2>What You Get Today (Phase 1)</h2>
            
            <p>Phase 1 focuses on the <strong>Intelligence Layer</strong> — AI agents that deliver standalone value while we build toward the full platform:</p>

            <ul className="feature-list">
              <li><strong>Discover</strong> — Find top traders across Avantis, Hyperliquid, Aerodrome, Uniswap, and more</li>
              <li><strong>Analyze</strong> — Understand what drives alpha: win rates, risk profiles, trading styles</li>
              <li><strong>Advise</strong> — Get recommendations on your portfolio, positions, and timing</li>
              <li><strong>Monitor</strong> — Track your positions and get alerts when things need attention</li>
            </ul>

            <h2>The Full Platform</h2>

            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>For Investors</th>
                  <th>For Traders</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="stage-badge stage-now">MVP</span></td>
                  <td>Discovery, analysis, advice, monitoring</td>
                  <td>Benchmarking, risk & position management advice</td>
                </tr>
                <tr>
                  <td><span className="stage-badge stage-beta">Beta</span></td>
                  <td>Fine-tuned PM (portfolio manager) agents</td>
                  <td>Fine-tuned trade execution agents</td>
                </tr>
                <tr>
                  <td><span className="stage-badge stage-later">v1.0</span></td>
                  <td>Semi-autonomous portfolio management</td>
                  <td>Raise capital, fund management, earn fees</td>
                </tr>
                <tr>
                  <td><span className="stage-badge stage-later">v2.0+</span></td>
                  <td>Autonomous portfolio management</td>
                  <td>Agent-powered funds at scale</td>
                </tr>
              </tbody>
            </table>

            <h2>Who It&apos;s For</h2>

            <div className="cards-grid">
              <div className="card">
                <div className="card-icon">💰</div>
                <div className="card-title">Investors</div>
                <p className="card-desc">Discover top traders, understand their strategies, deploy capital with confidence.</p>
              </div>
              <div className="card">
                <div className="card-icon">📈</div>
                <div className="card-title">Traders</div>
                <p className="card-desc">Build verified track records, benchmark & improve your edge, scale to fund management.</p>
              </div>
              <div className="card">
                <div className="card-icon">💧</div>
                <div className="card-title">LPs</div>
                <p className="card-desc">Monitor IL, optimize yields, get alerts across protocols.</p>
              </div>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <div></div>
                <a className="footer-nav-btn next" onClick={() => showPage('the-problem')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">The Problem →</div>
                </a>
              </div>
            </div>
          </section>

          {/* PAGE: The Problem */}
          <section className={'page-section ' + (activePage === 'the-problem' ? 'active' : '')} id="page-the-problem">
            <h1>The Problem</h1>
            <p className="page-subtitle">Why earning and scaling alpha in DeFi is harder than it should be.</p>

            <h2>For Investors</h2>
            <p>You want to earn alpha by following top DeFi traders. But you face two problems:</p>

            <h3>🔍 Discovery Problem</h3>
            <p>Finding top traders across DeFi protocols is fragmented and manual. There&apos;s no unified view of who&apos;s actually generating alpha across Avantis, Hyperliquid, Polymarket, Kalshi, Aerodrome, Uniswap, and other protocols.</p>
            <div className="solution-callout">
              <p><strong>→ Solved by:</strong> AI agents discover and rank top traders across protocols <span className="stage-badge stage-now">MVP</span></p>
            </div>

            <h3>🤝 Trust Problem</h3>
            <p>Copy trading platforms exist, but there&apos;s no way to validate the performance they claim. Even when wallet addresses are provided, there&apos;s massive friction to pull transaction data and do true analysis. Without understanding what actually drives a trader&apos;s alpha, investing is blind guesswork.</p>
            <div className="solution-callout">
              <p><strong>→ Solved by:</strong> AI analyzes on-chain transactions, explains alpha drivers <span className="stage-badge stage-now">MVP</span></p>
            </div>

            <h2>For Traders</h2>
            <p>Traders who generate consistent alpha have no way to scale:</p>

            <h3>✓ Validation Problem</h3>
            <p>No place to publicly validate performance in a verifiable way. No path from managing $200K personal capital to $2M+ with outside investors. You&apos;re stuck trading your own capital with no way to prove your edge to potential investors.</p>
            <div className="solution-callout blue">
              <p><strong>→ Solved by:</strong> AI agent-driven onchain performance validation + Fund management <span className="stage-badge stage-beta">Beta</span> <span className="stage-badge stage-later">v1.0</span></p>
            </div>

            <h3>🔒 Edge Preservation Problem</h3>
            <p>Top traders don&apos;t want their wallet transactions parsed and strategies reverse-engineered. No incentive structure exists for them to let their alpha be accessible to investors. Why would they share their edge for free?</p>
            <div className="solution-callout blue">
              <p><strong>→ Solved by:</strong> Transparency levels (performance-only vs full) + Compensation for alpha <span className="stage-badge stage-later">v1.0</span></p>
            </div>

            <h2>Why Current Solutions Fail</h2>

            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Discovery</th>
                  <th>Verification</th>
                  <th>Intelligence</th>
                  <th>Trader Incentives</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CEX Copy Trading</td>
                  <td>Limited</td>
                  <td><span className="cross">✗</span> No on-chain proof</td>
                  <td><span className="cross">✗</span> None</td>
                  <td><span className="cross">⚠</span> Standard or no comp.</td>
                </tr>
                <tr>
                  <td>DeFi Vaults</td>
                  <td>Limited</td>
                  <td><span className="partial">⚠</span> Protocol-specific</td>
                  <td><span className="cross">✗</span> None</td>
                  <td><span className="partial">⚠</span> Basic fees only</td>
                </tr>
                <tr>
                  <td>Aggregators</td>
                  <td>Limited</td>
                  <td><span className="cross">✗</span> No verification</td>
                  <td><span className="cross">✗</span> None</td>
                  <td><span className="cross">✗</span> No structure</td>
                </tr>
                <tr className="highlight">
                  <td><strong style={{ color: 'var(--accent-green)' }}>Yieldr</strong></td>
                  <td><span className="check">✓</span> AI-powered</td>
                  <td><span className="check">✓</span> On-chain verified</td>
                  <td><span className="check">✓</span> AI analysis</td>
                  <td><span className="check">✓</span> Compensation + privacy</td>
                </tr>
              </tbody>
            </table>

            <div className="callout callout-warning">
              <div className="callout-title">The Two Missing Layers</div>
              <p><strong>Intelligence Layer:</strong> Even if all wallet data were indexed, alpha isn&apos;t constant. Traders have hot and cold streaks. Markets change. You&apos;d need to constantly monitor and rotate capital — a full-time job. AI agents solve this.</p>
              <p><strong>Trust Layer:</strong> Even with intelligence, there&apos;s no way to execute trustlessly. Smart contracts with coded risk limits, transparency options, and compensation structures solve this. This is what enables traders to participate without giving away their edge for free.</p>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('what-is-yieldr')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← What is Yieldr?</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('quick-start')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">Quick Start →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: Quick Start */}
          <section className={'page-section ' + (activePage === 'quick-start' ? 'active' : '')} id="page-quick-start">
            <h1>Quick Start</h1>
            <p className="page-subtitle">Get started in 30 seconds.</p>

            <div className="flow">
              <div className="flow-step"><strong>1.</strong> Name Your Agent</div>
              <div className="flow-arrow">→</div>
              <div className="flow-step"><strong>2.</strong> Connect Wallet</div>
              <div className="flow-arrow">→</div>
              <div className="flow-step"><strong>3.</strong> Start Chatting</div>
            </div>

            <h2>Step 1: Name Your Agent</h2>
            <p>Give your AI agent a name. This creates emotional ownership and makes the experience personal from the start.</p>

            <h2>Step 2: Connect Wallet</h2>
            <p>Connect your wallet so your agent can scan your positions across perps, LPs, and tokens. Your agent uses this to personalize recommendations from message #1.</p>

            <h2>Step 3: Start Chatting</h2>
            <p>Your agent will show a summary of your positions and highlight anything that needs attention. From there, just ask questions:</p>

            <div className="prompt-card">
              <div className="prompt-text">&quot;Find traders with &gt;60% win rate and &lt;15% max drawdown&quot;</div>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">&quot;ETH SHORTS on Avantis are up 75%, good time to take profits?&quot;</div>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">&quot;What are top wallets doing with $DEGEN?&quot;</div>
            </div>

            <div className="callout callout-success">
              <div className="callout-title">No Goal Selection Required</div>
              <p>Your agent infers your context from your positions. If you have perp positions, it knows you&apos;re trading. If you have LP positions, it helps with IL management. If you hold meme coins, it tracks what top wallets are doing. (memecoins integration is coming in v1)</p>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('the-problem')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← The Problem</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('how-it-works')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">How It Works →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: How It Works */}
          <section className={'page-section ' + (activePage === 'how-it-works' ? 'active' : '')} id="page-how-it-works">
            <h1>How It Works</h1>
            <p className="page-subtitle">Two layers that power decentralized asset management.</p>

            <p>Yieldr combines two layers to enable trustless asset management at scale:</p>

            <div className="cards-grid">
              <div className="card highlight">
                <div className="card-icon">🧠</div>
                <div className="card-title">Intelligence Layer <span className="stage-badge stage-now">Now</span></div>
                <p className="card-desc">AI agents that discover top traders, analyze alpha drivers, advise on positions, and monitor your portfolio. This is what makes institutional-grade intelligence accessible to everyone.</p>
              </div>
              <div className="card">
                <div className="card-icon">🔐</div>
                <div className="card-title">Trust Layer <span className="stage-badge stage-later">v1.0</span></div>
                <p className="card-desc">Smart contracts that enable trustless execution — auto trading, fund management, risk controls, and compensation. This is what makes it safe for traders to share alpha and investors to deploy capital.</p>
              </div>
            </div>

            <h2>Intelligence Layer (MVP)</h2>

            <p>The AI agent is your interface to DeFi&apos;s best traders & fund managers:</p>

            <div className="cards-grid">
              <div className="card">
                <div className="card-icon">🔗</div>
                <div className="card-title">On-Chain Data</div>
                <p className="card-desc">Real transactions from Base protocols — Avantis, Aerodrome, Uniswap. Can&apos;t be faked.</p>
              </div>
              <div className="card">
                <div className="card-icon">🔍</div>
                <div className="card-title">AI Analysis</div>
                <p className="card-desc">Parses transactions to extract performance, style, risk profile, and alpha drivers.</p>
              </div>
              <div className="card">
                <div className="card-icon">💬</div>
                <div className="card-title">Natural Language</div>
                <p className="card-desc">Ask questions in plain English. Get answers backed by data.</p>
              </div>
              <div className="card">
                <div className="card-icon">🔔</div>
                <div className="card-title">Proactive Alerts</div>
                <p className="card-desc">Your agent monitors positions and notifies you when action is needed.</p>
              </div>
            </div>

            <h2>Trust Layer (v1.0)</h2>

            <p>Smart contracts that make execution trustless for both sides:</p>

            <h3>For Investors</h3>
            <ul className="feature-list">
              <li><strong>Non-custodial</strong> — Funds deployed directly from your wallet, you keep custody</li>
              <li><strong>Risk controls coded in</strong> — Max drawdown, position limits, asset whitelists enforced by code</li>
              <li><strong>Transparent execution</strong> — Every trade verifiable on-chain</li>
            </ul>

            <h3>For Traders</h3>
            <ul className="feature-list">
              <li><strong>Raise capital</strong> — Investors can deploy capital to follow your strategy</li>
              <li><strong>Earn performance fees</strong> — Programmable compensation for alpha delivery</li>
              <li><strong>Control transparency</strong> — Choose performance-only or full disclosure</li>
              <li><strong>Edge preservation</strong> — Get paid for alpha, don&apos;t give it away for free</li>
            </ul>

            <div className="callout callout-info">
              <div className="callout-title">💡 Why Two Layers?</div>
              <p><strong>Intelligence without trust</strong> = You know who&apos;s good but can&apos;t safely invest with them.</p>
              <p><strong>Trust without intelligence</strong> = You can execute safely but don&apos;t know who to invest with.</p>
              <p><strong>Both layers together</strong> = True decentralized asset management.</p>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('quick-start')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← Quick Start</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('ai-agents')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">AI Agents →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: AI Agents */}
          <section className={'page-section ' + (activePage === 'ai-agents' ? 'active' : '')} id="page-ai-agents">
            <h1>AI Agents</h1>
            <p className="page-subtitle">How your AI agent helps you earn alpha.</p>

            <h2>What Your Agent Does</h2>

            <p>Your AI agent is your personal copilot for DeFi. It handles the work that would take you hours:</p>

            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Capability</th>
                  <th>What It Means</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Discover</strong></td>
                  <td>Find top traders across protocols based on verified on-chain performance</td>
                  <td><span className="stage-badge stage-now">Now</span></td>
                </tr>
                <tr>
                  <td><strong>Analyze</strong></td>
                  <td>Parses transactions to explain win rates, styles, risk profiles, alpha drivers</td>
                  <td><span className="stage-badge stage-now">Now</span></td>
                </tr>
                <tr>
                  <td><strong>Advise</strong></td>
                  <td>Recommends actions on your positions based on data, not emotion</td>
                  <td><span className="stage-badge stage-now">Now</span></td>
                </tr>
                <tr>
                  <td><strong>Monitor</strong></td>
                  <td>Tracks your positions and alerts you when something needs attention</td>
                  <td><span className="stage-badge stage-now">Now</span></td>
                </tr>
                <tr>
                  <td><strong>Learn</strong></td>
                  <td>Trains from top traders, YOUR preferences and goals to become personalized PM & trading copilot</td>
                  <td><span className="stage-badge stage-beta">Beta</span></td>
                </tr>
                <tr>
                  <td><strong>Execute</strong></td>
                  <td>Based on learning and risk/return goals set by user, trades and manages funds via smart contracts</td>
                  <td><span className="stage-badge stage-later">v1.0</span></td>
                </tr>
              </tbody>
            </table>

            <h2>How Your Agent Learns</h2>

            <p>Your agent gets smarter the more you use it:</p>

            <div className="flow">
              <div className="flow-step"><strong>Day 1</strong><br />Top traders data</div>
              <div className="flow-arrow">→</div>
              <div className="flow-step"><strong>Week 1</strong><br />Understands goals</div>
              <div className="flow-arrow">→</div>
              <div className="flow-step"><strong>Month 1</strong><br />Anticipates needs</div>
              <div className="flow-arrow">→</div>
              <div className="flow-step"><strong>Month 3+</strong><br />Deeply personalized</div>
            </div>

            <p>The agent learns from:</p>
            <ul className="feature-list">
              <li><strong>Top traders</strong> — Patterns that drive alpha across protocols</li>
              <li><strong>Your positions</strong> — Your allocation, risk tolerance, trading style</li>
              <li><strong>Market context</strong> — Current conditions, trends, sentiment</li>
              <li><strong>Your conversations</strong> — Your preferences, goals, philosophy</li>
            </ul>

            <div className="callout callout-warning">
              <div className="callout-title">Coming in Beta: Train Your Agent</div>
              <p>In the Beta release, you&apos;ll be able to explicitly train your agent on your trading style and investment preferences. This makes your agent truly personalized — it learns what matters to YOU and tailors its discovery and advice accordingly.</p>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('how-it-works')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← How It Works</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('for-investors')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">For Investors →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: For Investors */}
          <section className={'page-section ' + (activePage === 'for-investors' ? 'active' : '')} id="page-for-investors">
            <h1>For Investors</h1>
            <p className="page-subtitle">Find top traders, understand their alpha, deploy capital.</p>

            <div className="callout callout-success">
              <div className="callout-title">Problems Solved</div>
              <p><strong>Discovery:</strong> AI finds top traders across protocols.</p>
              <p><strong>Trust:</strong> AI analyzes transactions, explains alpha drivers.</p>
            </div>

            <h2>What You Can Ask</h2>

            <h3>Find & Compare Traders</h3>
            <div className="prompt-card">
              <div className="prompt-text">&quot;Find traders with &gt;60% win rate, &lt;15% max drawdown, $100K+ volume&quot;</div>
              <p className="prompt-desc">Agent searches the trader database with your criteria and returns ranked results with detailed metrics.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">&quot;Compare these 3 traders: risk-adjusted returns, style, correlation&quot;</div>
              <p className="prompt-desc">Agent performs comparative analysis to help you diversify across uncorrelated strategies.</p>
            </div>

            <h3>Simulate & Allocate</h3>
            <div className="prompt-card">
              <div className="prompt-text">&quot;Search for top 3 perp traders in BTC, ETH, SOL and simulate allocation of $100K capital to each over 90d period&quot;</div>
              <p className="prompt-desc">Agent finds top performers by asset, runs historical simulations across their actual trades, and projects returns with risk metrics for different allocation scenarios.</p>
            </div>

            <h3>Market Analysis</h3>
            <div className="prompt-card">
              <div className="prompt-text">&quot;What are the chances of ETH dump on BOJ rate hike? Is it a good time to go SHORT?&quot;</div>
              <p className="prompt-desc">Agent analyzes macro correlations, historical price reactions to similar events, current market positioning, and what top traders are doing to provide directional insights.</p>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('ai-agents')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← AI Agents</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('for-traders')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">For Traders →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: For Traders */}
          <section className={'page-section ' + (activePage === 'for-traders' ? 'active' : '')} id="page-for-traders">
            <h1>For Traders</h1>
            <p className="page-subtitle">Build your track record, benchmark your edge, scale to fund management.</p>

            <div className="callout callout-success">
              <div className="callout-title">Problems Solved</div>
              <p><strong>Validation:</strong> On-chain verified performance that proves your edge.</p>
              <p><strong>Path to scale:</strong> Tools to raise capital and manage outside investors.</p>
              <p><strong>Edge preservation:</strong> You control what&apos;s shared and get compensated for alpha.</p>
            </div>

            <h2>Today: Benchmark & Improve <span className="stage-badge stage-now">MVP</span></h2>

            <p>Your AI agent helps you understand and improve your trading:</p>

            <h3>Analyze Your Performance</h3>
            <div className="prompt-card">
              <div className="prompt-text">&quot;Analyze my last 20 trades — patterns in winners vs losers?&quot;</div>
              <p className="prompt-desc">Agent examines your trade history to identify what differentiates your winning trades from losing ones.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">&quot;Compare my win rate and R:R to top BTC traders&quot;</div>
              <p className="prompt-desc">Agent benchmarks your metrics against top performers to show where you stand and where to improve.</p>
            </div>

            <h3>Get Trade Advice</h3>
            <div className="prompt-card">
              <div className="prompt-text">&quot;Position -15% underwater — cut, hold, or add?&quot;</div>
              <p className="prompt-desc">Agent analyzes the position, market context, and how top traders handle similar situations.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">&quot;What would my P&L look like with better stop discipline?&quot;</div>
              <p className="prompt-desc">Agent simulates your historical trades with tighter stops to show potential improvements.</p>
            </div>

            <h2>Coming: Build Your Track Record <span className="stage-badge stage-beta">Beta</span></h2>

            <p>Your on-chain performance becomes your verified track record:</p>
            <ul className="feature-list">
              <li>Performance metrics calculated from actual transactions</li>
              <li>Verifiable by anyone — can&apos;t fake Basescan</li>
              <li>Shareable profile for potential investors</li>
              <li>AI-generated performance reports</li>
            </ul>

            <h2>Coming: Scale to Fund Management <span className="stage-badge stage-later">v1.0</span></h2>

            <p>Turn your edge into a business:</p>
            <ul className="feature-list">
              <li><strong>Raise capital</strong> — Investors deploy capital to follow your trades</li>
              <li><strong>Earn performance fees</strong> — Get paid for the alpha you deliver</li>
              <li><strong>Control transparency</strong> — Choose what&apos;s visible (performance-only vs full disclosure)</li>
              <li><strong>Preserve your edge</strong> — Compensation structure rewards you, not copycats</li>
              <li><strong>Non-custodial</strong> — Smart contracts handle execution, you never touch investor funds</li>
            </ul>

            <div className="callout callout-warning">
              <div className="callout-title">💡 The Path from $200K → $2M+</div>
              <p>Today you&apos;re trading $200K of your own capital with no way to scale. Yieldr gives you the infrastructure to build a verified track record, attract investors, and manage outside capital — all trustlessly through smart contracts. Top traders on the platform will be able to raise and manage 10x their personal capital.</p>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('for-investors')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← For Investors</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('for-lps')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">For LPs →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: For LPs */}
          <section className={'page-section ' + (activePage === 'for-lps' ? 'active' : '')} id="page-for-lps">
            <h1>For Liquidity Providers</h1>
            <p className="page-subtitle">Monitor IL, optimize yields, get proactive alerts.</p>

            <div className="callout callout-success">
              <div className="callout-title">Problems Solved</div>
              <p><strong>Multi-protocol monitoring:</strong> AI tracks positions across Aerodrome, Uniswap, and more.</p>
              <p><strong>Constant monitoring burden:</strong> AI alerts and advises so you don&apos;t have to watch 24/7.</p>
            </div>

            <h2>What You Can Ask</h2>

            <h3>Monitor Positions</h3>
            <div className="prompt-card">
              <div className="prompt-text">&quot;What&apos;s my current IL and what&apos;s driving it?&quot;</div>
              <p className="prompt-desc">Agent calculates your impermanent loss across positions and explains which price movements are causing it.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">&quot;Is my position still in range? Alert if it goes out&quot;</div>
              <p className="prompt-desc">Agent monitors your concentrated liquidity positions and alerts you when they need attention.</p>
            </div>

            <h3>Optimize Yields</h3>
            <div className="prompt-card">
              <div className="prompt-text">&quot;Best APR pools for ETH/USDC right now?&quot;</div>
              <p className="prompt-desc">Agent compares pools across protocols, factoring in APR, TVL, volume, and IL risk.</p>
            </div>
            <div className="prompt-card">
              <div className="prompt-text">&quot;Compare my LP performance to top providers&quot;</div>
              <p className="prompt-desc">Agent benchmarks your positions against the best LPs to show where you can improve.</p>
            </div>

            <h3>Manage Risk</h3>
            <div className="prompt-card">
              <div className="prompt-text">&quot;How would I hedge this position to reduce IL?&quot;</div>
              <p className="prompt-desc">Agent suggests hedging strategies (shorts, options) to neutralize directional exposure.</p>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('for-traders')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← For Traders</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('roadmap')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">Roadmap →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: Roadmap */}
          <section className={'page-section ' + (activePage === 'roadmap' ? 'active' : '')} id="page-roadmap">
            <h1>Product Roadmap</h1>
            <p className="page-subtitle">Building AI-enabled decentralized asset management.</p>

            <div className="roadmap-item current">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">Phase 1 — Now</div>
              <h3 className="roadmap-title">MVP: Intelligence Layer</h3>
              <p className="roadmap-desc"><strong>Investors:</strong> Discover top traders, analyze alpha drivers, portfolio advice.<br /><strong>Traders:</strong> Benchmark vs top performers, performance insights.</p>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">Phase 2 — Beta</div>
              <h3 className="roadmap-title">Personalization</h3>
              <p className="roadmap-desc"><strong>Investors:</strong> Train your agent, personalized discovery, proactive alerts.<br /><strong>Traders:</strong> Verified track record, shareable profiles.</p>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">Phase 3 — v1.0</div>
              <h3 className="roadmap-title">Trust Layer</h3>
              <p className="roadmap-desc"><strong>Investors:</strong> Copy trading execution, non-custodial deployment, risk controls.<br /><strong>Traders:</strong> Raise outside capital, earn performance fees, edge preservation.</p>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">Phase 4 — v2.0+</div>
              <h3 className="roadmap-title">Agent Economy</h3>
              <p className="roadmap-desc">Autonomous agents, agent-to-agent trading, AI-managed funds, full marketplace.</p>
            </div>

            <h2>The Vision</h2>

            <p>We&apos;re building <strong>AI-enabled decentralized asset management</strong> — a two-sided marketplace where:</p>

            <ul className="feature-list">
              <li><strong>Investors</strong> get access to verified top traders and can deploy capital trustlessly</li>
              <li><strong>Traders</strong> can validate their edge, raise outside capital, and scale to fund management</li>
              <li><strong>AI agents</strong> power discovery, analysis, personalization, and eventually autonomous execution</li>
              <li><strong>Smart contracts</strong> enable trustless execution with coded risk controls and compensation</li>
            </ul>

            <div className="callout callout-success">
              <div className="callout-title">💡 The Long-Term Vision (5-10 Years)</div>
              <p>In the future, AI agents evolve into autonomous asset managers — continuously learning from top traders, finding and delivering alpha, and operating on both sides of the marketplace. Agents will trade, invest, and allocate capital for users in constant search of alpha. This is what &quot;AI-native&quot; truly means: AI as the fundamental layer through which capital allocation happens.</p>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('for-lps')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← For LPs</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('token-overview')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">YLDR Token →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: Token Overview */}
          <section className={'page-section ' + (activePage === 'token-overview' ? 'active' : '')} id="page-token-overview">
            <h1>YLDR Token</h1>
            <p className="page-subtitle">The utility token powering Yieldr&apos;s AI trading platform.</p>

            <div className="token-hero">
              <div className="token-symbol">⚡</div>
              <div className="token-name">YLDR</div>
              <p className="token-tagline">Use Yieldr = Burn YLDR</p>
              <div className="token-stats">
                <div className="token-stat">
                  <div className="token-stat-value">210M</div>
                  <div className="token-stat-label">Total Supply</div>
                </div>
                <div className="token-stat">
                  <div className="token-stat-value">9.05%</div>
                  <div className="token-stat-label">Public Allocation</div>
                </div>
                <div className="token-stat">
                  <div className="token-stat-value">~$5M</div>
                  <div className="token-stat-label">Target Raise</div>
                </div>
                <div className="token-stat">
                  <div className="token-stat-value">BASE</div>
                  <div className="token-stat-label">Network</div>
                </div>
              </div>
            </div>

            <div className="callout callout-info">
              <div className="callout-title">📅 TGE: Q1 2027</div>
              <p>Token Generation Event with ICO and Tier-1 CEX listing (Coinbase). Early contributors receive YLDR allocations at TGE. Until then, contribute USDC to lock in your allocation at current tier pricing.</p>
            </div>

            <h2>Key Properties</h2>
            <div className="cards-grid">
              <div className="card">
                <div className="card-icon">🔒</div>
                <div className="card-title">Fixed Supply</div>
                <p className="card-desc">210 million YLDR. Hardcoded in the contract at TGE, immutable. No inflation, ever.</p>
              </div>
              <div className="card">
                <div className="card-icon">🔥</div>
                <div className="card-title">Deflationary</div>
                <p className="card-desc">Tokens burned when used for AI compute. Total supply only decreases over time.</p>
              </div>
              <div className="card">
                <div className="card-icon">👥</div>
                <div className="card-title">Community First</div>
                <p className="card-desc">Public allocation tiers open now. Early believers get lowest prices and immediate product access.</p>
              </div>
              <div className="card">
                <div className="card-icon">⏳</div>
                <div className="card-title">Team Vested</div>
                <p className="card-desc">All team tokens: 1-year cliff + 3-year monthly vesting. Full alignment.</p>
              </div>
            </div>

            <h2>The Model</h2>
            <div className="architecture-diagram">
<pre>{`   <span class="arch-highlight">NOW</span>                                              <span class="arch-highlight">TGE (Q1 2027)</span>

   ┌─────────────────┐                            ┌─────────────────────────┐
   │                 │                            │                         │
   │   Contribute    │       12-15 months         │   Token Generation      │
   │   USDC          │ ─────────────────────────▶ │   + ICO                 │
   │                 │                            │   + Tier-1 CEX Listing  │
   │                 │                            │                         │
   └─────────────────┘                            └─────────────────────────┘

   You receive:                                   At TGE:
   • Allocation locked at tier price              • YLDR distributed to wallet
   • AI credits (immediate)                       • Trading begins
   • Snapshot voting rights                       • Burn mechanism activates
   • Monthly transparency reports                 • All allocations vest
`}</pre>
            </div>

            <div className="callout callout-success">
              <div className="callout-title">💡 Why This Model</div>
              <p>No token until TGE means 100% focus on building the best AI agent. Early contributors are true believers who want the product, not speculators chasing quick flips. When YLDR launches, it launches with real utility, CEX liquidity, and a proven platform.</p>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('roadmap')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← Roadmap</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('token-utility')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">Utility →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: Token Utility */}
          <section className={'page-section ' + (activePage === 'token-utility' ? 'active' : '')} id="page-token-utility">
            <h1>Utility</h1>
            <p className="page-subtitle">YLDR tokens are burned to access Yieldr&apos;s AI capabilities.</p>

            <h2>How It Works <span className="tge-badge">At TGE</span></h2>
            <div className="architecture-diagram">
<pre>{`┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  <span class="arch-highlight">Acquire YLDR</span>   │─────▶│   <span class="arch-highlight">Burn YLDR</span>    │─────▶│    <span class="arch-highlight">Use AI</span>       │
│  (CEX or DEX)   │      │  (Market Rate)  │      │  (Train Agent)  │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
`}</pre>
            </div>

            <ol>
              <li><strong>Acquire YLDR</strong> — Purchase on Coinbase, DEX, or receive at TGE</li>
              <li><strong>Burn YLDR</strong> — Convert to AI credits at current market rate</li>
              <li><strong>Use AI</strong> — Train agents, run backtests, execute strategies</li>
            </ol>

            <h2>What YLDR Powers</h2>
            <div className="cards-grid">
              <div className="card">
                <div className="card-icon">🤖</div>
                <div className="card-title">Agent Training</div>
                <p className="card-desc">Train your AI agent on trading patterns, market data, and personalized strategies.</p>
              </div>
              <div className="card">
                <div className="card-icon">📊</div>
                <div className="card-title">Analysis & Insights</div>
                <p className="card-desc">Portfolio analysis, trader comparisons, performance breakdowns, and alpha discovery.</p>
              </div>
              <div className="card">
                <div className="card-icon">🔔</div>
                <div className="card-title">Proactive Alerts</div>
                <p className="card-desc">Real-time notifications on position risks, trader alignments, and market opportunities.</p>
              </div>
              <div className="card">
                <div className="card-icon">⚡</div>
                <div className="card-title">Execution (v1.0)</div>
                <p className="card-desc">Copy trading, auto-rebalancing, and fund management coming in Trust Layer release.</p>
              </div>
            </div>

            <h2>Pre-TGE: AI Credits</h2>
            <p>Before TGE, the platform uses off-chain AI credits:</p>
            <ul>
              <li><strong>All users</strong> — 100K free credits to try the product</li>
              <li><strong>Contributors</strong> — Additional credits proportional to USDC contributed</li>
            </ul>
            <p>At TGE, the burn mechanism activates and YLDR becomes the sole way to acquire AI credits.</p>

            <h2>Deflationary Mechanics <span className="tge-badge">At TGE</span></h2>
            <div className="cards-grid">
              <div className="card">
                <div className="card-icon">🔥</div>
                <div className="card-title">Permanent Burns</div>
                <p className="card-desc">Burned tokens sent to dead address. Irrecoverable by anyone, ever.</p>
              </div>
              <div className="card">
                <div className="card-icon">📉</div>
                <div className="card-title">Supply Shrinks</div>
                <p className="card-desc">Total supply only decreases. More usage = faster deflation.</p>
              </div>
              <div className="card">
                <div className="card-icon">⚖️</div>
                <div className="card-title">Self-Balancing</div>
                <p className="card-desc">Higher price = fewer tokens burned per transaction. Supply approaches but never reaches zero.</p>
              </div>
              <div className="card">
                <div className="card-icon">🔗</div>
                <div className="card-title">On-Chain Proof</div>
                <p className="card-desc">All burns visible on Basescan. Transparent and verifiable.</p>
              </div>
            </div>

            <div className="callout callout-info">
              <div className="callout-title">💡 Why Burn-for-Access Works</div>
              <p>Unlike buyback models that get overwhelmed by sell pressure, burn-for-access creates structural demand. To use the product, you must acquire and burn tokens. This is how ETH gas works — and why usage drives value.</p>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('token-overview')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← Token Overview</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('tokenomics')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">Tokenomics →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: Tokenomics */}
          <section className={'page-section ' + (activePage === 'tokenomics' ? 'active' : '')} id="page-tokenomics">
            <h1>Tokenomics</h1>
            <p className="page-subtitle">Supply structure and public allocation tiers.</p>

            <h2>Supply Structure</h2>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>%</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Total Fixed Supply</strong></td>
                  <td>210,000,000 YLDR</td>
                  <td>100%</td>
                  <td>Hardcoded at TGE</td>
                </tr>
                <tr>
                  <td><strong>Public Allocation</strong></td>
                  <td>19,000,000 YLDR</td>
                  <td>9.05%</td>
                  <td>Contribution tiers open</td>
                </tr>
                <tr>
                  <td><strong>Remaining</strong></td>
                  <td>191,000,000 YLDR</td>
                  <td>90.95%</td>
                  <td>Allocated at TGE</td>
                </tr>
              </tbody>
            </table>

            <h2>Public Allocation Tiers</h2>
            <p>Early contributors lock in YLDR allocations at increasing valuations. Contribute USDC now, receive YLDR at TGE:</p>

            <table className="stage-table">
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Tokens</th>
                  <th>% Supply</th>
                  <th>Price</th>
                  <th>FDV</th>
                  <th>Raise</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="stage-name">Genesis</td>
                  <td>1.5M</td>
                  <td>0.71%</td>
                  <td className="tokens">$0.057</td>
                  <td>$12M</td>
                  <td>$85.5K</td>
                </tr>
                <tr>
                  <td className="stage-name">Pre-Seed</td>
                  <td>2.0M</td>
                  <td>0.95%</td>
                  <td className="tokens">$0.10</td>
                  <td>$21M</td>
                  <td>$200K</td>
                </tr>
                <tr>
                  <td className="stage-name">Seed</td>
                  <td>3.0M</td>
                  <td>1.43%</td>
                  <td className="tokens">$0.20</td>
                  <td>$42M</td>
                  <td>$600K</td>
                </tr>
                <tr>
                  <td className="stage-name">Growth</td>
                  <td>4.5M</td>
                  <td>2.14%</td>
                  <td className="tokens">$0.30</td>
                  <td>$63M</td>
                  <td>$1.35M</td>
                </tr>
                <tr>
                  <td className="stage-name">Scale</td>
                  <td>8.0M</td>
                  <td>3.81%</td>
                  <td className="tokens">$0.357</td>
                  <td>$75M</td>
                  <td>$2.86M</td>
                </tr>
              </tbody>
            </table>

            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
              <strong>Total:</strong> 19M YLDR (9.05%) &nbsp;|&nbsp; <strong>Target Raise:</strong> ~$5.09M
            </p>

            <h2>Early Contributor ROI</h2>
            <p>Potential returns based on TGE listing FDV:</p>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Entry Point</th>
                  <th>→ $150M TGE</th>
                  <th>→ $300M</th>
                  <th>→ $500M</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Genesis</strong> ($0.057)</td>
                  <td><span className="check">12.5x</span></td>
                  <td><span className="check">25x</span></td>
                  <td><span className="check">42x</span></td>
                </tr>
                <tr>
                  <td><strong>Pre-Seed</strong> ($0.10)</td>
                  <td><span className="check">7.1x</span></td>
                  <td><span className="check">14x</span></td>
                  <td><span className="check">24x</span></td>
                </tr>
                <tr>
                  <td><strong>Seed</strong> ($0.20)</td>
                  <td><span className="check">3.6x</span></td>
                  <td><span className="check">7x</span></td>
                  <td><span className="check">12x</span></td>
                </tr>
                <tr>
                  <td><strong>Growth</strong> ($0.30)</td>
                  <td><span className="check">2.4x</span></td>
                  <td><span className="check">4.8x</span></td>
                  <td><span className="check">8x</span></td>
                </tr>
                <tr>
                  <td><strong>Scale</strong> ($0.357)</td>
                  <td><span className="check">2x</span></td>
                  <td><span className="check">4x</span></td>
                  <td><span className="check">6.7x</span></td>
                </tr>
              </tbody>
            </table>

            <h2>Remaining Supply</h2>
            <p>The 90.95% remaining supply will be allocated at TGE to:</p>
            <ul>
              <li><strong>Team & Contributors</strong> — 1yr cliff + 3yr monthly vesting</li>
              <li><strong>Treasury & Operations</strong> — Protocol development and growth</li>
              <li><strong>Ecosystem Incentives</strong> — User rewards and partnerships</li>
              <li><strong>Liquidity Provision</strong> — CEX and DEX liquidity</li>
              <li><strong>Strategic Investors (SAFT)</strong> — Institutional rounds</li>
            </ul>

            <div className="callout callout-warning">
              <div className="callout-title">📋 Pre-TGE Disclosure</div>
              <p>Full allocation breakdown will be published <strong>30 days before TGE</strong>. All team and strategic allocations follow 1-year cliff + 3-year monthly vesting.</p>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('token-utility')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← Utility</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('how-to-participate')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">How to Participate →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: How to Participate */}
          <section className={'page-section ' + (activePage === 'how-to-participate' ? 'active' : '')} id="page-how-to-participate">
            <h1>How to Participate</h1>
            <p className="page-subtitle">Contribute USDC now, receive YLDR at TGE.</p>

            <h2>Contribution Flow</h2>
            <div className="architecture-diagram">
<pre>{`┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   1. <span class="arch-highlight">CONTRIBUTE</span>                                                        │
│      • Send USDC to published treasury wallet (Base network)            │
│      • Current tier pricing locked at time of contribution              │
│                                                                         │
│   2. <span class="arch-highlight">RECEIVE CONFIRMATION</span>                                              │
│      • Wallet address recorded                                          │
│      • Tier + allocation rate locked                                    │
│      • Entry in public allocation table                                 │
│      • AI credits added to your account                                 │
│                                                                         │
│   3. <span class="arch-highlight">USE PRODUCT</span>                                                       │
│      • Access AI agent with credited balance                            │
│      • Participate in Snapshot governance                               │
│      • Receive monthly transparency updates                             │
│                                                                         │
│   4. <span class="arch-highlight">TGE (Q1 2027)</span>                                                     │
│      • YLDR tokens distributed to your wallet                           │
│      • Trading begins on Coinbase + tier-1 exchanges                    │
│      • Burn mechanism activates                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
`}</pre>
            </div>

            <h2>What Contributors Get</h2>
            <div className="cards-grid">
              <div className="card">
                <div className="card-icon">🎯</div>
                <div className="card-title">Locked-In Allocation</div>
                <p className="card-desc">Price fixed at contribution tier. Genesis at $0.057 vs potential $0.50+ at TGE.</p>
              </div>
              <div className="card">
                <div className="card-icon">🤖</div>
                <div className="card-title">Immediate AI Credits</div>
                <p className="card-desc">Use the product from day one. Credits proportional to USDC contributed.</p>
              </div>
              <div className="card">
                <div className="card-icon">🗳️</div>
                <div className="card-title">Governance Voice</div>
                <p className="card-desc">Snapshot polls on product features and development priorities.</p>
              </div>
              <div className="card">
                <div className="card-icon">📊</div>
                <div className="card-title">Monthly Transparency</div>
                <p className="card-desc">Treasury balance, fund usage breakdown, and development progress.</p>
              </div>
            </div>

            <h2>Timeline</h2>
            <div className="roadmap-item current">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">Now</div>
              <h3 className="roadmap-title">Genesis Tier Open</h3>
              <p className="roadmap-desc">Contribute USDC at $12M FDV. Earliest access, lowest price, highest conviction required.</p>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">On Fill / Milestone</div>
              <h3 className="roadmap-title">Tier Progression</h3>
              <p className="roadmap-desc">Pre-Seed → Seed → Growth → Scale. Each tier at higher FDV as product develops.</p>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">30 Days Before TGE</div>
              <h3 className="roadmap-title">Full Disclosure</h3>
              <p className="roadmap-desc">Complete allocation breakdown published. Token contract deployed on Base.</p>
            </div>
            <div className="roadmap-item">
              <div className="roadmap-dot"></div>
              <div className="roadmap-phase">Q1 2027</div>
              <h3 className="roadmap-title">TGE + Listing</h3>
              <p className="roadmap-desc">Token generation event. YLDR distributed. ICO. Coinbase + tier-1 CEX listing. Trading begins.</p>
            </div>

            <div className="callout callout-success">
              <div className="callout-title">🔒 Your Allocation is Guaranteed</div>
              <p>Once you contribute, your allocation is locked at that tier&apos;s price. Even if future tiers are higher, you receive YLDR at your entry price. Allocations are distributed at TGE.</p>
            </div>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('tokenomics')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← Tokenomics</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('faq')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">FAQ →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: FAQ */}
          <section className={'page-section ' + (activePage === 'faq' ? 'active' : '')} id="page-faq">
            <h1>FAQ</h1>
            <p className="page-subtitle">Frequently asked questions.</p>

            <h2>General</h2>

            <h3>What is Yieldr?</h3>
            <p>Yieldr is an AI-powered platform that helps you find top DeFi traders, analyze their performance, and make better investment decisions. Your AI agent discovers top traders, explains their alpha, and advises on your positions.</p>

            <h3>How does it work?</h3>
            <p>You connect your wallet and start chatting with your AI agent. It scans your positions, finds top traders across protocols like Avantis and Aerodrome, and gives you personalized advice based on verified on-chain data.</p>

            <h3>Is my wallet safe?</h3>
            <p>Yes. We only read your wallet data — we never have access to your private keys. In the future execution layer, funds are deployed through smart contracts with coded risk controls, not custodied by Yieldr.</p>

            <h3>Which protocols are supported?</h3>
            <p>Currently: Avantis (perps), Aerodrome (LP), Uniswap (LP/swaps), and spot token holdings on Base. More protocols coming soon.</p>

            <h2>Token & Participation</h2>

            <h3>When is the token launch?</h3>
            <p>TGE (Token Generation Event) is planned for Q1 2027, coinciding with ICO and Tier-1 CEX listing on Coinbase. Until then, you can contribute USDC to lock in allocations at current tier pricing.</p>

            <h3>Why is there no token yet?</h3>
            <p>No token until TGE means 100% focus on building the best AI agent. Early contributors are true believers who want the product, not speculators. When YLDR launches, it launches with real utility and proven product-market fit.</p>

            <h3>What is the YLDR token used for?</h3>
            <p>YLDR is burned to access AI capabilities — training, analysis, alerts, and execution. This creates structural demand tied to product usage. More usage = more burns = deflationary supply.</p>

            <h3>How do I participate in the public allocation?</h3>
            <p>Contribute USDC to the treasury wallet on Base. Your allocation is locked at the current tier price. At TGE, YLDR tokens are distributed to your wallet. Contributors also get immediate AI credits and governance rights.</p>

            <h3>What happens to my allocation if the tier fills?</h3>
            <p>Once a tier fills (e.g., Genesis), the next tier opens at a higher price. Your allocation is locked at whatever tier you contributed to — you benefit from contributing early.</p>

            <h3>Is there vesting for public contributors?</h3>
            <p>No vesting for public allocation. YLDR is distributed to your wallet at TGE. Team and strategic investor tokens have 1-year cliff + 3-year monthly vesting.</p>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('how-to-participate')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← How to Participate</div>
                </a>
                <a className="footer-nav-btn next" onClick={() => showPage('glossary')}>
                  <div className="footer-nav-label">Next</div>
                  <div className="footer-nav-title">Glossary →</div>
                </a>
              </div>
            </div>
          </section>


          {/* PAGE: Glossary */}
          <section className={'page-section ' + (activePage === 'glossary' ? 'active' : '')} id="page-glossary">
            <h1>Glossary</h1>
            <p className="page-subtitle">Key terms and definitions.</p>

            <h3>Alpha</h3>
            <p>Returns above a benchmark. If the market returns 10% and you return 15%, your alpha is 5%.</p>

            <h3>APR/APY</h3>
            <p>Annual Percentage Rate / Yield. The annualized return on an investment or liquidity position.</p>

            <h3>Burn-for-Access</h3>
            <p>Token mechanism where YLDR is permanently destroyed when used for AI compute. Creates structural demand tied to product usage.</p>

            <h3>Copilot</h3>
            <p>An AI assistant that helps you make decisions but doesn&apos;t act autonomously. Current Yieldr agents are copilots.</p>

            <h3>FDV (Fully Diluted Valuation)</h3>
            <p>Total value of all tokens if every token were in circulation. FDV = token price × total supply.</p>

            <h3>IL (Impermanent Loss)</h3>
            <p>The difference between holding tokens vs providing liquidity. Occurs when token prices diverge.</p>

            <h3>Intelligence Layer</h3>
            <p>AI agents that power discovery, analysis, and advice. The first layer of the Yieldr platform, available now.</p>

            <h3>LP (Liquidity Provider)</h3>
            <p>Someone who deposits tokens into a DEX pool to enable trading, earning fees in return.</p>

            <h3>Non-Custodial</h3>
            <p>You maintain control of your private keys and funds. The protocol never takes custody.</p>

            <h3>Perpetuals (Perps)</h3>
            <p>Derivative contracts that let you trade with leverage without an expiration date.</p>

            <h3>TGE (Token Generation Event)</h3>
            <p>The moment when YLDR tokens are created and distributed. Planned for Q1 2027 with Tier-1 CEX listing.</p>

            <h3>Trust Layer</h3>
            <p>Smart contracts that enforce rules, verify performance, and enable trustless execution. Coming in v1.0.</p>

            <h3>Win Rate</h3>
            <p>Percentage of trades that are profitable. A 70% win rate means 7 of 10 trades made money.</p>

            <div className="page-footer">
              <div className="footer-nav">
                <a className="footer-nav-btn prev" onClick={() => showPage('faq')}>
                  <div className="footer-nav-label">Previous</div>
                  <div className="footer-nav-title">← FAQ</div>
                </a>
                <div></div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
