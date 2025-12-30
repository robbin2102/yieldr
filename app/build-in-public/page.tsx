'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PaymentPopup } from '../components/PaymentPopup';

export default function BuildInPublicPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="build-header">
        <Link href="/" className="build-logo">
          <svg className="build-logo-icon" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
            <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000000" opacity="0.3"/>
            <circle cx="50" cy="60" r="8" fill="#FFFFFF" opacity="0.9"/>
          </svg>
          <span className="build-logo-text">YIELDR</span>
        </Link>
        <nav className="build-nav-links">
          <Link href="/" className="build-nav-link">Home</Link>
          <Link href="/docs" className="build-nav-link">Docs</Link>
          <Link href="/team" className="build-nav-link">Team</Link>
          <Link href="/build-in-public" className="build-nav-link active">Build Progress</Link>
          <div className="build-nav-divider"></div>
          <Link href="https://discord.com/channels/1426305214176165941/1426305389812646091" target="_blank" className="build-nav-icon discord" title="Discord">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </Link>
          <Link href="https://github.com/robbin2102/yieldr-app" target="_blank" className="build-nav-icon github" title="GitHub">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </Link>
          <button className="build-nav-link primary" onClick={() => setShowPopup(true)}>Get Early Access</button>
        </nav>
        <button className="mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>☰</button>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay">
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
              <button className="mobile-menu-cta" onClick={() => { setShowMobileMenu(false); setShowPopup(true); }}>Get Early Access</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="build-main">
        {/* Hero */}
        <section className="build-hero">
          <div className="build-hero-badge">
            <span className="build-badge-dot"></span>
            <span>Building in public</span>
          </div>
          <h1>Transparent. <span>Accountable.</span> Open.</h1>
          <p>Real-time updates on code shipped, money spent, and lessons learned. No fluff, no hiding failures.</p>
        </section>

        {/* Progress Overview */}
        <section className="progress-overview">
          <div className="progress-grid">
            <div className="progress-card">
              <div className="progress-icon">📅</div>
              <div className="progress-value">3 Months</div>
              <div className="progress-label">Building</div>
            </div>
            <div className="progress-card">
              <div className="progress-icon">💻</div>
              <div className="progress-value">+28.7K</div>
              <div className="progress-label">Lines of Code</div>
            </div>
            <div className="progress-card positive">
              <div className="progress-icon">📈</div>
              <div className="progress-value">$14.7K</div>
              <div className="progress-label">Trading PnL</div>
            </div>
            <div className="progress-card">
              <div className="progress-icon">💰</div>
              <div className="progress-value">$3.3K</div>
              <div className="progress-label">Treasury Balance</div>
            </div>
          </div>
        </section>

        {/* Development Metrics */}
        <section className="dev-metrics">
          <h2>Development Activity</h2>
          <div className="metrics-card">
            <div className="metric-header">
              <div>
                <div className="metric-title">Git Commits</div>
                <div className="metric-subtitle">Last 90 days</div>
              </div>
              <div className="metric-total">387 commits</div>
            </div>
            <div className="commit-chart">
              {[
                { month: 'Oct', commits: 89, percentage: 23 },
                { month: 'Nov', commits: 156, percentage: 40 },
                { month: 'Dec', commits: 142, percentage: 37 }
              ].map((data, i) => (
                <div key={i} className="commit-month">
                  <div className="commit-bar-container">
                    <div className="commit-bar" style={{ height: `${data.percentage}%` }}></div>
                  </div>
                  <div className="commit-label">{data.month}</div>
                  <div className="commit-count">{data.commits}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="build-timeline">
          <h2>Development Timeline</h2>

          {/* December 2025 */}
          <div className="timeline-month">
            <div className="timeline-month-header">
              <h3>December 2025</h3>
              <div className="timeline-badges">
                <span className="timeline-badge current">Current</span>
                <span className="timeline-badge">Web3 Integration</span>
                <span className="timeline-badge">Frontend Polish</span>
              </div>
            </div>

            <div className="timeline-vision">
              <h4>Product Vision</h4>
              <p>Completing the pre-launch infrastructure with polished UI/UX, secure payment systems, and comprehensive documentation. Focus on user experience and transparent metrics for early community building.</p>
            </div>

            <div className="timeline-modules">
              <div className="module-item complete">
                <div className="module-header">
                  <span className="module-icon">✓</span>
                  <div className="module-info">
                    <h5>Team Page & Human-AI Showcase</h5>
                    <div className="module-tags">
                      <span className="tag">Next.js</span>
                      <span className="tag">React</span>
                      <span className="tag">TypeScript</span>
                    </div>
                  </div>
                </div>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" className="module-code">View Code →</a>
              </div>

              <div className="module-item complete">
                <div className="module-header">
                  <span className="module-icon">✓</span>
                  <div className="module-info">
                    <h5>USDC Payment Infrastructure</h5>
                    <div className="module-tags">
                      <span className="tag protocol">Base</span>
                      <span className="tag protocol">USDC</span>
                      <span className="tag">Smart Contracts</span>
                    </div>
                  </div>
                </div>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" className="module-code">View Code →</a>
              </div>

              <div className="module-item complete">
                <div className="module-header">
                  <span className="module-icon">✓</span>
                  <div className="module-info">
                    <h5>MongoDB Contribution Tracking</h5>
                    <div className="module-tags">
                      <span className="tag">MongoDB</span>
                      <span className="tag">Database</span>
                      <span className="tag">API</span>
                    </div>
                  </div>
                </div>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" className="module-code">View Code →</a>
              </div>

              <div className="module-item in-progress">
                <div className="module-header">
                  <span className="module-icon in-progress">●</span>
                  <div className="module-info">
                    <h5>Build-in-Public Page</h5>
                    <div className="module-tags">
                      <span className="tag">Transparency</span>
                      <span className="tag">Metrics</span>
                      <span className="tag">UI/UX</span>
                    </div>
                  </div>
                </div>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" className="module-code">View Code →</a>
              </div>
            </div>

            <div className="trading-results-inline">
              <h4>December Trading Results</h4>
              <div className="results-grid">
                <div className="result-stat">
                  <span className="result-label">Trades</span>
                  <span className="result-value">47</span>
                </div>
                <div className="result-stat">
                  <span className="result-label">PnL</span>
                  <span className="result-value positive">+$4,594</span>
                </div>
                <div className="result-stat">
                  <span className="result-label">Win Rate</span>
                  <span className="result-value">68.1%</span>
                </div>
              </div>
            </div>
          </div>

          {/* November 2025 */}
          <div className="timeline-month">
            <div className="timeline-month-header">
              <h3>November 2025</h3>
              <div className="timeline-badges">
                <span className="timeline-badge completed">Completed</span>
                <span className="timeline-badge">Wallet Integration</span>
                <span className="timeline-badge">Competition Winner</span>
              </div>
            </div>

            <div className="timeline-vision">
              <h4>Product Vision</h4>
              <p>Major milestone month with complete wallet integration, redesigned homepage with live demo, comprehensive documentation system, and winning Base Batches 002 competition recognition.</p>
            </div>

            <div className="timeline-modules">
              <div className="module-item complete">
                <div className="module-header">
                  <span className="module-icon">✓</span>
                  <div className="module-info">
                    <h5>Homepage Redesign & Chat Demo</h5>
                    <div className="module-tags">
                      <span className="tag">Animation</span>
                      <span className="tag">UI/UX</span>
                      <span className="tag">Interactive</span>
                    </div>
                  </div>
                </div>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" className="module-code">View Code →</a>
              </div>

              <div className="module-item complete">
                <div className="module-header">
                  <span className="module-icon">✓</span>
                  <div className="module-info">
                    <h5>RainbowKit + Wagmi Integration</h5>
                    <div className="module-tags">
                      <span className="tag protocol">RainbowKit</span>
                      <span className="tag protocol">Wagmi</span>
                      <span className="tag protocol">Base</span>
                    </div>
                  </div>
                </div>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" className="module-code">View Code →</a>
              </div>

              <div className="module-item complete">
                <div className="module-header">
                  <span className="module-icon">✓</span>
                  <div className="module-info">
                    <h5>Documentation System</h5>
                    <div className="module-tags">
                      <span className="tag">Docs</span>
                      <span className="tag">Guides</span>
                      <span className="tag">API Reference</span>
                    </div>
                  </div>
                </div>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" className="module-code">View Code →</a>
              </div>

              <div className="module-item complete">
                <div className="module-header">
                  <span className="module-icon">✓</span>
                  <div className="module-info">
                    <h5>Base Batches 002 Competition</h5>
                    <div className="module-tags">
                      <span className="tag protocol">Base</span>
                      <span className="tag">Winner</span>
                      <span className="tag">$2.5K Prize</span>
                    </div>
                  </div>
                </div>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" className="module-code">View Code →</a>
              </div>
            </div>

            <div className="trading-results-inline">
              <h4>November Trading Results</h4>
              <div className="results-grid">
                <div className="result-stat">
                  <span className="result-label">Trades</span>
                  <span className="result-value">67</span>
                </div>
                <div className="result-stat">
                  <span className="result-label">PnL</span>
                  <span className="result-value positive">+$6,891</span>
                </div>
                <div className="result-stat">
                  <span className="result-label">Win Rate</span>
                  <span className="result-value">70.1%</span>
                </div>
              </div>
            </div>
          </div>

          {/* October 2025 */}
          <div className="timeline-month">
            <div className="timeline-month-header">
              <h3>October 2025</h3>
              <div className="timeline-badges">
                <span className="timeline-badge completed">Completed</span>
                <span className="timeline-badge">Foundation</span>
                <span className="timeline-badge">AI Agent Core</span>
              </div>
            </div>

            <div className="timeline-vision">
              <h4>Product Vision</h4>
              <p>Project launch month focused on building solid technical foundations. Established Next.js 15 architecture, Base network integration, and core AI agent infrastructure for future trading capabilities.</p>
            </div>

            <div className="timeline-modules">
              <div className="module-item complete">
                <div className="module-header">
                  <span className="module-icon">✓</span>
                  <div className="module-info">
                    <h5>Project Inception & Architecture</h5>
                    <div className="module-tags">
                      <span className="tag">Planning</span>
                      <span className="tag">Design</span>
                      <span className="tag">Strategy</span>
                    </div>
                  </div>
                </div>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" className="module-code">View Code →</a>
              </div>

              <div className="module-item complete">
                <div className="module-header">
                  <span className="module-icon">✓</span>
                  <div className="module-info">
                    <h5>Next.js 15 + TypeScript Setup</h5>
                    <div className="module-tags">
                      <span className="tag">Next.js 15</span>
                      <span className="tag">TypeScript</span>
                      <span className="tag">React</span>
                    </div>
                  </div>
                </div>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" className="module-code">View Code →</a>
              </div>

              <div className="module-item complete">
                <div className="module-header">
                  <span className="module-icon">✓</span>
                  <div className="module-info">
                    <h5>Base Network Integration</h5>
                    <div className="module-tags">
                      <span className="tag protocol">Base</span>
                      <span className="tag protocol">Ethereum</span>
                      <span className="tag">L2</span>
                    </div>
                  </div>
                </div>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" className="module-code">View Code →</a>
              </div>

              <div className="module-item complete">
                <div className="module-header">
                  <span className="module-icon">✓</span>
                  <div className="module-info">
                    <h5>Core AI Agent Infrastructure</h5>
                    <div className="module-tags">
                      <span className="tag">AI</span>
                      <span className="tag">Claude</span>
                      <span className="tag">Trading Logic</span>
                    </div>
                  </div>
                </div>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" className="module-code">View Code →</a>
              </div>
            </div>

            <div className="trading-results-inline">
              <h4>October Trading Results</h4>
              <div className="results-grid">
                <div className="result-stat">
                  <span className="result-label">Trades</span>
                  <span className="result-value">42</span>
                </div>
                <div className="result-stat">
                  <span className="result-label">PnL</span>
                  <span className="result-value positive">+$3,247</span>
                </div>
                <div className="result-stat">
                  <span className="result-label">Win Rate</span>
                  <span className="result-value">64.3%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Module Status */}
        <section className="module-status">
          <h2>Product Modules</h2>
          <div className="modules-grid">
            <div className="module-card status-complete">
              <div className="module-header">
                <span className="module-status-icon complete">✓</span>
                <h3>Landing Pages</h3>
              </div>
              <p>Homepage, docs, team, and build pages</p>
              <div className="module-progress">
                <div className="module-progress-bar" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="module-card status-complete">
              <div className="module-header">
                <span className="module-status-icon complete">✓</span>
                <h3>Wallet Integration</h3>
              </div>
              <p>RainbowKit connection on Base network</p>
              <div className="module-progress">
                <div className="module-progress-bar" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="module-card status-complete">
              <div className="module-header">
                <span className="module-status-icon complete">✓</span>
                <h3>Payment System</h3>
              </div>
              <p>USDC payments for YLDR token allocation</p>
              <div className="module-progress">
                <div className="module-progress-bar" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="module-card status-in-progress">
              <div className="module-header">
                <span className="module-status-icon in-progress">●</span>
                <h3>Trading Agent</h3>
              </div>
              <p>AlphaHunter AI for DeFi trading strategies</p>
              <div className="module-progress">
                <div className="module-progress-bar" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div className="module-card status-planned">
              <div className="module-header">
                <span className="module-status-icon planned">○</span>
                <h3>Portfolio Dashboard</h3>
              </div>
              <p>Real-time portfolio tracking and analytics</p>
              <div className="module-progress">
                <div className="module-progress-bar" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div className="module-card status-planned">
              <div className="module-header">
                <span className="module-status-icon planned">○</span>
                <h3>Token Launch</h3>
              </div>
              <p>YLDR TGE and liquidity provisioning</p>
              <div className="module-progress">
                <div className="module-progress-bar" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="roadmap">
          <h2>What's Next</h2>

          <div className="roadmap-item">
            <div className="roadmap-period">
              <h3>January 2026</h3>
              <span className="roadmap-tag">Next Month</span>
            </div>
            <div className="roadmap-goals">
              <div className="roadmap-goal">
                <span className="goal-icon">🎯</span>
                <div className="goal-content">
                  <h4>Complete YLDR Pre-Sale</h4>
                  <p>Finalize token allocation for early supporters with USDC payments</p>
                </div>
              </div>
              <div className="roadmap-goal">
                <span className="goal-icon">🔐</span>
                <div className="goal-content">
                  <h4>Deploy Production Treasury</h4>
                  <p>Multi-sig wallet with transparent on-chain accounting</p>
                </div>
              </div>
              <div className="roadmap-goal">
                <span className="goal-icon">🤖</span>
                <div className="goal-content">
                  <h4>Launch AlphaHunter Beta</h4>
                  <p>First AI trading agent available for early access users</p>
                </div>
              </div>
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-period">
              <h3>February - April 2026</h3>
              <span className="roadmap-tag">Q1 End</span>
            </div>
            <div className="roadmap-goals">
              <div className="roadmap-goal">
                <span className="goal-icon">💎</span>
                <div className="goal-content">
                  <h4>YLDR Token Generation Event</h4>
                  <p>TGE launch with distribution to early supporters and liquidity provision</p>
                </div>
              </div>
              <div className="roadmap-goal">
                <span className="goal-icon">📊</span>
                <div className="goal-content">
                  <h4>Portfolio Dashboard Launch</h4>
                  <p>Real-time portfolio tracking, analytics, and AI-powered insights</p>
                </div>
              </div>
              <div className="roadmap-goal">
                <span className="goal-icon">👥</span>
                <div className="goal-content">
                  <h4>Onboard First 1000 Users</h4>
                  <p>Scale platform infrastructure and community growth initiatives</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Trading Performance */}
        <section className="trading-performance">
          <h2>AI Trading Performance</h2>
          <div className="performance-card">
            <div className="performance-summary">
              <div className="performance-stat">
                <div className="stat-label">Total PnL</div>
                <div className="stat-value positive">+$14,732</div>
              </div>
              <div className="performance-stat">
                <div className="stat-label">Win Rate</div>
                <div className="stat-value">67.3%</div>
              </div>
              <div className="performance-stat">
                <div className="stat-label">Trades</div>
                <div className="stat-value">156</div>
              </div>
              <div className="performance-stat">
                <div className="stat-label">Avg Return</div>
                <div className="stat-value">+12.4%</div>
              </div>
            </div>

            <div className="performance-breakdown">
              <h3>Monthly Breakdown</h3>
              <div className="performance-months">
                <div className="performance-month">
                  <div className="month-name">October 2025</div>
                  <div className="month-trades">42 trades</div>
                  <div className="month-pnl positive">+$3,247</div>
                </div>
                <div className="performance-month">
                  <div className="month-name">November 2025</div>
                  <div className="month-trades">67 trades</div>
                  <div className="month-pnl positive">+$6,891</div>
                </div>
                <div className="performance-month">
                  <div className="month-name">December 2025</div>
                  <div className="month-trades">47 trades</div>
                  <div className="month-pnl positive">+$4,594</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Treasury Accounting */}
        <section className="treasury">
          <h2>Treasury Accounting</h2>
          <div className="treasury-card">
            <div className="treasury-balance">
              <div className="balance-label">Current Balance</div>
              <div className="balance-value">$3,328</div>
              <div className="balance-note">As of Dec 30, 2025</div>
            </div>

            <div className="treasury-breakdown">
              <h3>Income</h3>
              <div className="treasury-items">
                <div className="treasury-item">
                  <span className="item-label">Trading Profits</span>
                  <span className="item-value positive">+$14,732</span>
                </div>
                <div className="treasury-item">
                  <span className="item-label">Base Batches 002 Prize</span>
                  <span className="item-value positive">+$2,500</span>
                </div>
                <div className="treasury-item total">
                  <span className="item-label">Total Income</span>
                  <span className="item-value positive">+$17,232</span>
                </div>
              </div>

              <h3>Expenses</h3>
              <div className="treasury-items">
                <div className="treasury-item">
                  <span className="item-label">Anthropic API (Claude)</span>
                  <span className="item-value negative">-$4,782</span>
                </div>
                <div className="treasury-item">
                  <span className="item-label">Vercel Hosting</span>
                  <span className="item-value negative">-$128</span>
                </div>
                <div className="treasury-item">
                  <span className="item-label">MongoDB Atlas</span>
                  <span className="item-value negative">-$89</span>
                </div>
                <div className="treasury-item">
                  <span className="item-label">Domain & Infrastructure</span>
                  <span className="item-value negative">-$67</span>
                </div>
                <div className="treasury-item">
                  <span className="item-label">Gas Fees (Base)</span>
                  <span className="item-value negative">-$2,341</span>
                </div>
                <div className="treasury-item">
                  <span className="item-label">Trading Losses</span>
                  <span className="item-value negative">-$6,497</span>
                </div>
                <div className="treasury-item total">
                  <span className="item-label">Total Expenses</span>
                  <span className="item-value negative">-$13,904</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="build-footer">
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

      {/* Payment Popup */}
      <PaymentPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
}
