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
      <header className="team-header">
        <Link href="/" className="team-logo">
          <svg className="team-logo-icon" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
            <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000000" opacity="0.3"/>
            <circle cx="50" cy="60" r="8" fill="#FFFFFF" opacity="0.9"/>
          </svg>
          <span className="team-logo-text">YIELDR</span>
        </Link>
        <nav className="team-nav-links">
          <Link href="/" className="team-nav-link">Home</Link>
          <Link href="/docs" className="team-nav-link">Docs</Link>
          <Link href="/team" className="team-nav-link">Team</Link>
          <Link href="/build-in-public" className="team-nav-link active">Build Progress</Link>
          <div className="team-nav-divider"></div>
          <Link href="https://discord.com/channels/1426305214176165941/1426305389812646091" target="_blank" className="team-nav-icon discord" title="Discord">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </Link>
          <Link href="https://github.com/robbin2102/yieldr-app" target="_blank" className="team-nav-icon github" title="GitHub">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </Link>
          <button className="team-nav-link primary" onClick={() => setShowPopup(true)}>Get Early Access</button>
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
            <span>📊</span>
            <span>Updated Dec 2025</span>
          </div>
          <h1 className="page-title">Build in Public</h1>
          <p className="page-subtitle">Transparent development progress, milestones achieved, and treasury accounting. Every module, every commit, tracked.</p>
        </section>

        {/* Progress Overview */}
        <section className="progress-overview">
          <div className="progress-grid">
            <div className="progress-card">
              <div className="progress-value">3</div>
              <div className="progress-label">Months Building</div>
            </div>
            <div className="progress-card">
              <div className="progress-value">+28.7K</div>
              <div className="progress-label">Lines of Code</div>
            </div>
            <div className="progress-card">
              <div className="progress-value">$14.7K</div>
              <div className="progress-label">Trading PnL</div>
            </div>
            <div className="progress-card">
              <div className="progress-value">$3.3K</div>
              <div className="progress-label">Treasury Balance</div>
            </div>
          </div>
        </section>

        {/* Development Metrics */}
        <section className="dev-metrics">
          <div className="dev-metrics-header">
            <span>📊</span>
            <span>Development Metrics</span>
          </div>
          <div className="dev-metrics-grid">
            <div className="metric-item">
              <div className="metric-value">153</div>
              <div className="metric-label">Commits</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">45</div>
              <div className="metric-label">Features</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">71</div>
              <div className="metric-label">Bug Fixes</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">364</div>
              <div className="metric-label">Files</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">2</div>
              <div className="metric-label">Contributors</div>
            </div>
          </div>
          <div className="commit-bar">
            <div className="commit-bar-visual">
              <div className="commit-bar-segment oct"></div>
              <div className="commit-bar-segment nov"></div>
              <div className="commit-bar-segment dec"></div>
            </div>
            <div className="commit-bar-legend">
              <div className="legend-item"><div className="legend-dot oct"></div> Oct: 43</div>
              <div className="legend-item"><div className="legend-dot nov"></div> Nov: 48</div>
              <div className="legend-item"><div className="legend-dot dec"></div> Dec: 62</div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="build-timeline">
          <div className="section-header">
            <div className="section-icon">🛠️</div>
            <h2 className="section-title">Development Timeline</h2>
          </div>

          <div className="timeline">
            {/* December 2025 */}
            <div className="timeline-month">
              <div className="timeline-dot current"></div>
              <div className="month-header">
                <span className="month-name">December 2025</span>
                <span className="month-badge current">● In Progress</span>
              </div>
              <div className="modules-grid">
                <div className="module-item">
                  <div className="module-status complete">✓</div>
                  <div className="module-content">
                    <div className="module-name">Prediction Markets Monitoring</div>
                    <div className="module-desc">Top traders activity tracking on prediction markets</div>
                    <div className="module-footer">
                      <div className="module-tags">
                        <span className="module-tag polymarket">Polymarket</span>
                      </div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/d3f0549" target="_blank" className="view-code">View Code →</a>
                    </div>
                  </div>
                </div>

                <div className="module-item">
                  <div className="module-status complete">✓</div>
                  <div className="module-content">
                    <div className="module-name">Trending Tokens Service</div>
                    <div className="module-desc">Top 100 trending tokens monitoring on Base</div>
                    <div className="module-footer">
                      <div className="module-tags">
                        <span className="module-tag base">Base</span>
                        <span className="module-tag llm">LLM Tooling</span>
                      </div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/b7c7986" target="_blank" className="view-code">View Code →</a>
                    </div>
                  </div>
                </div>

                <div className="module-item">
                  <div className="module-status complete">✓</div>
                  <div className="module-content">
                    <div className="module-name">Early Access Landing + Payments</div>
                    <div className="module-desc">Token purchase flow with wallet connect integration</div>
                    <div className="module-footer">
                      <div className="module-tags"></div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/948e8e2" target="_blank" className="view-code">View Code →</a>
                    </div>
                  </div>
                </div>

                <div className="module-item">
                  <div className="module-status progress">●</div>
                  <div className="module-content">
                    <div className="module-name">AI Trading Test (Ongoing)</div>
                    <div className="module-desc">Continued $5K account testing with refined signals</div>
                    <div className="module-footer">
                      <div className="module-tags">
                        <span className="module-tag ai">Claude AI</span>
                        <span className="module-tag avantis">Avantis</span>
                      </div>
                    </div>
                    <div className="trading-result">
                      <span><span className="label">Max DD:</span> <span className="negative">-$450</span></span>
                      <span><span className="label">PnL (to date):</span> <span className="positive">+$2,830</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* November 2025 */}
            <div className="timeline-month">
              <div className="timeline-dot"></div>
              <div className="month-header">
                <span className="month-name">November 2025</span>
                <span className="month-badge complete">✓ Complete</span>
                <span className="month-badge milestone">🏆 Base Batches Winner</span>
              </div>
              <div className="month-vision">
                <div className="vision-label">Product Vision</div>
                <div className="vision-text"><strong>AI-enabled Decentralized Asset Management.</strong> Investors discover top Traders & Fund Managers onchain while Traders validate performance, raise capital, and scale to fund management — all powered by AI agents (intelligence layer) and secured by smart contracts (trust layer).</div>
              </div>
              <div className="modules-grid">
                <div className="module-item">
                  <div className="module-status complete">✓</div>
                  <div className="module-content">
                    <div className="module-name">Real-time Trades Monitoring</div>
                    <div className="module-desc">Live trade feed service for top traders across perpetual protocols</div>
                    <div className="module-footer">
                      <div className="module-tags">
                        <span className="module-tag avantis">Avantis</span>
                        <span className="module-tag hyperliquid">Hyperliquid</span>
                      </div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/04b60e8" target="_blank" className="view-code">View Code →</a>
                    </div>
                  </div>
                </div>

                <div className="module-item">
                  <div className="module-status complete">✓</div>
                  <div className="module-content">
                    <div className="module-name">Performance Metrics Service</div>
                    <div className="module-desc">ROI, win rate, drawdown, Sharpe ratio calculations for trader ranking</div>
                    <div className="module-footer">
                      <div className="module-tags">
                        <span className="module-tag avantis">Avantis</span>
                        <span className="module-tag hyperliquid">Hyperliquid</span>
                      </div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/cb4b121" target="_blank" className="view-code">View Code →</a>
                    </div>
                  </div>
                </div>

                <div className="module-item">
                  <div className="module-status complete">✓</div>
                  <div className="module-content">
                    <div className="module-name">Liquidity Positions Analyzer</div>
                    <div className="module-desc">LP position tracking with IL calculations and fee earnings</div>
                    <div className="module-footer">
                      <div className="module-tags">
                        <span className="module-tag uniswap">Uniswap</span>
                        <span className="module-tag aerodrome">Aerodrome</span>
                      </div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/703251b" target="_blank" className="view-code">View Code →</a>
                    </div>
                  </div>
                </div>

                <div className="module-item">
                  <div className="module-status complete">✓</div>
                  <div className="module-content">
                    <div className="module-name">AI Agents Architecture</div>
                    <div className="module-desc">Research and technical documentation for agent infrastructure</div>
                    <div className="module-footer">
                      <div className="module-tags">
                        <span className="module-tag ai">Research</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="module-item">
                  <div className="module-status complete">✓</div>
                  <div className="module-content">
                    <div className="module-name">AI Trading Test (Continued)</div>
                    <div className="module-desc">$5K account with Claude AI + top trader signal integration</div>
                    <div className="module-footer">
                      <div className="module-tags">
                        <span className="module-tag ai">Claude AI</span>
                        <span className="module-tag avantis">Avantis</span>
                      </div>
                    </div>
                    <div className="trading-result">
                      <span><span className="label">Max DD:</span> <span className="positive">$0</span></span>
                      <span><span className="label">PnL:</span> <span className="positive">+$11,847</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* October 2025 */}
            <div className="timeline-month">
              <div className="timeline-dot"></div>
              <div className="month-header">
                <span className="month-name">October 2025</span>
                <span className="month-badge complete">✓ Complete</span>
                <span className="month-badge milestone">🏆 Base Batches Submission</span>
              </div>
              <div className="month-vision">
                <div className="vision-label">Product Vision</div>
                <div className="vision-text"><strong>Decentralized Asset Management.</strong> Investors discover top traders across perps & liquidity markets and coinvest with them. Traders raise & manage funds onchain with risk controls coded in smart contracts.</div>
              </div>
              <div className="modules-grid">
                <div className="module-item">
                  <div className="module-status complete">✓</div>
                  <div className="module-content">
                    <div className="module-name">User Signup & Onboarding</div>
                    <div className="module-desc">Wallet connection with automatic scanning for perps and liquidity positions</div>
                    <div className="module-footer">
                      <div className="module-tags"></div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/516071e" target="_blank" className="view-code">View Code →</a>
                    </div>
                  </div>
                </div>

                <div className="module-item">
                  <div className="module-status complete">✓</div>
                  <div className="module-content">
                    <div className="module-name">Top Traders Indexing</div>
                    <div className="module-desc">Live position data indexing from perpetual protocols</div>
                    <div className="module-footer">
                      <div className="module-tags">
                        <span className="module-tag avantis">Avantis</span>
                        <span className="module-tag hyperliquid">Hyperliquid</span>
                      </div>
                      <a href="https://github.com/robbin2102/yieldr-app/commit/a729e9d" target="_blank" className="view-code">View Code →</a>
                    </div>
                  </div>
                </div>

                <div className="module-item">
                  <div className="module-status complete">✓</div>
                  <div className="module-content">
                    <div className="module-name">MVP v1.0 Deployment</div>
                    <div className="module-desc">Deployed on final day of submission (Oct 24)</div>
                    <div className="module-footer">
                      <div className="module-tags">
                        <span className="module-tag base">GitHub</span>
                      </div>
                      <div style={{display: 'flex', gap: '1rem'}}>
                        <a href="https://github.com/robbin2102/yieldr-app/commit/50a4a07" target="_blank" className="view-code" style={{opacity: 1}}>View Code →</a>
                        <a href="https://app.yieldr.org" target="_blank" className="view-code" style={{opacity: 1}}>View Legacy App →</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="module-item">
                  <div className="module-status complete">✓</div>
                  <div className="module-content">
                    <div className="module-name">AI Trading Test Launch</div>
                    <div className="module-desc">Claude AI-allocated $5K account for live perp trading validation</div>
                    <div className="module-footer">
                      <div className="module-tags">
                        <span className="module-tag ai">Claude AI</span>
                        <span className="module-tag avantis">Avantis</span>
                      </div>
                    </div>
                    <div className="trading-result">
                      <span><span className="label">Max DD:</span> <span className="negative">-$1,200</span></span>
                      <span><span className="label">PnL:</span> <span className="positive">+$531</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section className="roadmap-section">
          <div className="section-header">
            <div className="section-icon">📅</div>
            <h2 className="section-title">Development Roadmap</h2>
          </div>

          <div className="roadmap-month">
            <div className="roadmap-month-header">
              <span className="roadmap-month-title">January 2026</span>
              <span className="month-badge planned">Planned</span>
            </div>
            <div className="roadmap-weeks">
              <div className="roadmap-week">
                <div className="roadmap-week-header">
                  <span>📆</span>
                  <span>Week 1: Jan 6-12</span>
                </div>
                <div className="roadmap-week-items">
                  <div className="build-roadmap-item">
                    <span className="status planned">○</span>
                    <span>UI design for agent launch & user onboarding</span>
                  </div>
                </div>
              </div>
              <div className="roadmap-week">
                <div className="roadmap-week-header">
                  <span>📆</span>
                  <span>Week 2: Jan 13-20</span>
                </div>
                <div className="roadmap-week-items">
                  <div className="build-roadmap-item">
                    <span className="status planned">○</span>
                    <span>Top 1.5K wallets on Base - real-time swap monitoring</span>
                  </div>
                  <div className="build-roadmap-item">
                    <span className="status planned">○</span>
                    <span>Wallet performance metrics service</span>
                  </div>
                </div>
              </div>
              <div className="roadmap-week">
                <div className="roadmap-week-header">
                  <span>📆</span>
                  <span>Week 3: Jan 21-28</span>
                </div>
                <div className="roadmap-week-items">
                  <div className="build-roadmap-item">
                    <span className="status planned">○</span>
                    <span>Market data context services for LLM tooling:</span>
                  </div>
                  <div className="build-roadmap-item" style={{ paddingLeft: '1.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span className="status planned">○</span>
                    <span>Tier-1 CEX data feeds (OI, Funding rates, Volume, Orderflow)</span>
                  </div>
                  <div className="build-roadmap-item" style={{ paddingLeft: '1.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span className="status planned">○</span>
                    <span>Technical indicators (RSI, MACD, BBANDS, EMA 20D/50D, ATR)</span>
                  </div>
                  <div className="build-roadmap-item" style={{ paddingLeft: '1.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <span className="status planned">○</span>
                    <span>DEX pool data (Liquidity depth, Volume, Price impact)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="roadmap-month">
            <div className="roadmap-month-header">
              <span className="roadmap-month-title">February - April 2026</span>
              <span className="month-badge planned">Planned</span>
            </div>
            <div className="roadmap-weeks">
              <div className="roadmap-week">
                <div className="roadmap-week-header">
                  <span>🎯</span>
                  <span>6-10 Weeks Sprint</span>
                </div>
                <div className="roadmap-week-items">
                  <div className="build-roadmap-item">
                    <span className="status planned">○</span>
                    <span>Onboarding journey frontend integration (1 week)</span>
                  </div>
                  <div className="build-roadmap-item">
                    <span className="status planned">○</span>
                    <span>LLM tooling orchestration - bringing all data monitoring modules together as LLM tools and functions (3-4 weeks)</span>
                  </div>
                  <div className="build-roadmap-item">
                    <span className="status planned">○</span>
                    <span>Actionable insights engine - providing alpha to users (3-weeks)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Trading Performance */}
        <section className="trading-section">
          <div className="section-header">
            <div className="section-icon">📈</div>
            <h2 className="section-title">AI Trading Performance</h2>
          </div>

          <div className="treasury-summary">
            <div className="treasury-card">
              <div className="treasury-label">Starting Capital</div>
              <div className="treasury-value">$5,000</div>
              <div className="treasury-detail">Allocated Oct 2025</div>
            </div>
            <div className="treasury-card">
              <div className="treasury-label">Total PnL</div>
              <div className="treasury-value positive">+$14,677</div>
              <div className="treasury-detail">+293% ROI</div>
            </div>
            <div className="treasury-card highlight">
              <div className="treasury-label">Current Account Value</div>
              <div className="treasury-value positive">$19,677</div>
              <div className="treasury-detail">As of Dec 28, 2025</div>
            </div>
          </div>

          <div className="accounting-table">
            <div className="accounting-header">
              <span>Month</span>
              <span style={{textAlign:'right'}}>PnL</span>
              <span style={{textAlign:'right'}}>Max DD</span>
              <span style={{textAlign:'right'}}>Balance</span>
            </div>
            <div className="accounting-row">
              <div className="category">October 2025</div>
              <div className="amount positive">+$531</div>
              <div className="amount negative">-$1,200</div>
              <div className="amount">$5,531</div>
            </div>
            <div className="accounting-row">
              <div className="category">November 2025</div>
              <div className="amount positive">+$11,847</div>
              <div className="amount positive">$0</div>
              <div className="amount">$17,378</div>
            </div>
            <div className="accounting-row">
              <div className="category">December 2025 (to date)</div>
              <div className="amount positive">+$2,830</div>
              <div className="amount negative">-$450</div>
              <div className="amount">$19,677</div>
            </div>
            <div className="accounting-row total">
              <div className="category"><strong>Total</strong></div>
              <div className="amount positive"><strong>+$14,677</strong></div>
              <div className="amount negative">-$1,200</div>
              <div className="amount positive"><strong>$19,677</strong></div>
            </div>
          </div>

          <div className="verification-note">
            <span>🔍</span>
            <span>All trades verifiable on-chain via Avantis (Base) • Wallet: <a href="https://basescan.org/address/0x780BB763e1463D2236FEC780b7BD6ADb40AAa120" target="_blank" className="verify-link">0x780BB763...Aa120</a></span>
          </div>
        </section>

        {/* Treasury Accounting */}
        <section className="treasury-section">
          <div className="section-header">
            <div className="section-icon">💰</div>
            <h2 className="section-title">Treasury Accounting</h2>
          </div>

          <div className="treasury-summary">
            <div className="treasury-card">
              <div className="treasury-label">Opening Balance (Oct '25)</div>
              <div className="treasury-value">$0</div>
              <div className="treasury-detail">Self-funded bootstrap</div>
            </div>
            <div className="treasury-card">
              <div className="treasury-label">Total Receipts</div>
              <div className="treasury-value positive">+$5,000</div>
              <div className="treasury-detail">Base Batches 002 Grant</div>
            </div>
            <div className="treasury-card highlight">
              <div className="treasury-label">Current Balance</div>
              <div className="treasury-value positive">$3,255</div>
              <div className="treasury-detail">As of Dec 28, 2025</div>
            </div>
          </div>

          <div className="accounting-table">
            <div className="accounting-header">
              <span>Category</span>
              <span style={{textAlign:'right'}}>Oct</span>
              <span style={{textAlign:'right'}}>Nov</span>
              <span style={{textAlign:'right'}}>Dec</span>
            </div>

            <div className="accounting-row">
              <div className="category"><span className="icon">📥</span> Receipts</div>
              <div className="amount">-</div>
              <div className="amount">-</div>
              <div className="amount positive">+$5,000</div>
            </div>
            <div className="accounting-row sub">
              <div className="category">Base Batches 002 Grant</div>
              <div className="amount">-</div>
              <div className="amount">-</div>
              <div className="amount">$5,000</div>
            </div>

            <div className="accounting-row">
              <div className="category"><span className="icon">🤖</span> Claude Code</div>
              <div className="amount negative">-$100</div>
              <div className="amount negative">-$100</div>
              <div className="amount negative">-$100</div>
            </div>
            <div className="accounting-row">
              <div className="category"><span className="icon">🗄️</span> Database</div>
              <div className="amount negative">-$75</div>
              <div className="amount negative">-$75</div>
              <div className="amount negative">-$75</div>
            </div>
            <div className="accounting-row">
              <div className="category"><span className="icon">☁️</span> Servers</div>
              <div className="amount negative">-$120</div>
              <div className="amount negative">-$120</div>
              <div className="amount negative">-$120</div>
            </div>
            <div className="accounting-row">
              <div className="category"><span className="icon">💻</span> Hardware</div>
              <div className="amount">-</div>
              <div className="amount negative">-$1,450</div>
              <div className="amount">-</div>
            </div>
            <div className="accounting-row sub">
              <div className="category">MacBook for development</div>
              <div className="amount">-</div>
              <div className="amount">$1,450</div>
              <div className="amount">-</div>
            </div>
            <div className="accounting-row">
              <div className="category"><span className="icon">👤</span> Payroll</div>
              <div className="amount">$0</div>
              <div className="amount">$0</div>
              <div className="amount">$0</div>
            </div>
            <div className="accounting-row">
              <div className="category"><span className="icon">📢</span> Marketing</div>
              <div className="amount">$0</div>
              <div className="amount">$0</div>
              <div className="amount">$0</div>
            </div>
            <div className="accounting-row">
              <div className="category"><span className="icon">🏢</span> Office & Utils</div>
              <div className="amount">$0</div>
              <div className="amount">$0</div>
              <div className="amount">$0</div>
            </div>

            <div className="accounting-row total">
              <div className="category"><strong>Monthly Total</strong></div>
              <div className="amount negative">-$295</div>
              <div className="amount negative">-$1,745</div>
              <div className="amount positive">+$4,705</div>
            </div>
            <div className="accounting-row total">
              <div className="category"><strong>Running Balance</strong></div>
              <div className="amount negative">-$295</div>
              <div className="amount negative">-$2,040</div>
              <div className="amount positive">$3,255</div>
            </div>
          </div>

          <p style={{fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '1rem', textAlign: 'center'}}>
            * Negative balance Oct-Nov covered by founder. Treasury funded by Base Batches grant in Dec '25.
          </p>
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
