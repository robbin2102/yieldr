'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  const [activePage, setActivePage] = useState('what-is-yieldr');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showPage = (pageId: string) => {
    setActivePage(pageId);
    window.scrollTo(0, 0);
    setSidebarOpen(false);
  };

  return (
    <div className="docs-layout">
      {/* Sidebar Overlay */}
      <div
        className={`docs-sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Header */}
      <header className="docs-header">
        <div className="docs-header-left">
          <Link href="/" className="docs-logo">
            <span className="docs-logo-text">YIELDR</span>
            <span className="docs-logo-divider">|</span>
            <span className="docs-logo-subtitle">Docs</span>
          </Link>
        </div>
        <div className="docs-header-right">
          <Link href="/" className="docs-header-link">Home</Link>
          <Link href="/team" className="docs-header-link">Team</Link>
          <Link href="/build-in-public" className="docs-header-link">Build Progress</Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="docs-menu-btn"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <nav className={`docs-sidebar ${sidebarOpen ? 'active' : ''}`}>
        <div className="docs-sidebar-section">
          <div className="docs-sidebar-title">
            <span>📖</span> Getting Started
          </div>
          <button onClick={() => showPage('what-is-yieldr')} className={`docs-sidebar-link ${activePage === 'what-is-yieldr' ? 'active' : ''}`}>What is Yieldr?</button>
          <button onClick={() => showPage('the-problem')} className={`docs-sidebar-link ${activePage === 'the-problem' ? 'active' : ''}`}>The Problem</button>
          <button onClick={() => showPage('quick-start')} className={`docs-sidebar-link ${activePage === 'quick-start' ? 'active' : ''}`}>Quick Start</button>
        </div>

        <div className="docs-sidebar-section">
          <div className="docs-sidebar-title">
            <span>🤖</span> Product
          </div>
          <button onClick={() => showPage('how-it-works')} className={`docs-sidebar-link ${activePage === 'how-it-works' ? 'active' : ''}`}>How It Works</button>
          <button onClick={() => showPage('tokenomics')} className={`docs-sidebar-link ${activePage === 'tokenomics' ? 'active' : ''}`}>Tokenomics</button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="docs-main">
        <div className="docs-content">

          {/* What is Yieldr Page */}
          {activePage === 'what-is-yieldr' && (
            <section>
              <h1>What is Yieldr?</h1>
              <p className="docs-subtitle">AI-enabled decentralized asset management.</p>

              <p>Yieldr is a platform where <strong>investors can discover top Traders & Fund Managers onchain</strong> while <strong>Traders can validate performance, raise capital, and scale to fund management</strong> — all powered by AI agents and secured by smart contracts.</p>

              <div className="docs-callout success">
                <div className="docs-callout-title">
                  💡 The Vision
                </div>
                <p className="docs-callout-content">A two-sided marketplace where investors discover top trading alpha while traders build track records and raise capital. AI agents power discovery, research & analysis, execution and portfolio management — becoming autonomous over time. Smart contracts enable trustless execution.</p>
              </div>

              <h2>What You Get Today (Phase 1)</h2>

              <p>Phase 1 focuses on the <strong>Intelligence Layer</strong> — AI agents that deliver standalone value:</p>

              <ul>
                <li><strong>Discover</strong> — Find top traders across Avantis, Hyperliquid, Aerodrome, Uniswap, and more</li>
                <li><strong>Analyze</strong> — Understand what drives alpha: win rates, risk profiles, trading styles</li>
                <li><strong>Advise</strong> — Get recommendations on your portfolio, positions, and timing</li>
                <li><strong>Monitor</strong> — Track your positions and get alerts when things need attention</li>
              </ul>

              <h2>Who It's For</h2>

              <div className="docs-cards-grid">
                <div className="docs-card">
                  <div className="docs-card-icon">💰</div>
                  <div className="docs-card-title">Investors</div>
                  <p className="docs-card-text">Discover top traders, understand their strategies, deploy capital with confidence.</p>
                </div>
                <div className="docs-card">
                  <div className="docs-card-icon">📈</div>
                  <div className="docs-card-title">Traders</div>
                  <p className="docs-card-text">Build verified track records, benchmark & improve your edge, scale to fund management.</p>
                </div>
              </div>
            </section>
          )}

          {/* The Problem Page */}
          {activePage === 'the-problem' && (
            <section>
              <h1>The Problem</h1>
              <p className="docs-subtitle">Why earning and scaling alpha in DeFi is harder than it should be.</p>

              <h2>For Investors</h2>
              <p>You want to earn alpha by following top DeFi traders. But you face two problems:</p>

              <h3>🔍 Discovery Problem</h3>
              <p>Finding top traders across DeFi protocols is fragmented and manual. There's no unified view of who's actually generating alpha across Avantis, Hyperliquid, Polymarket, Kalshi, Aerodrome, Uniswap, and other protocols.</p>
              <div className="docs-callout success">
                <p className="docs-callout-content"><strong>→ Solved by:</strong> AI agents discover and rank top traders across protocols <span className="docs-badge success">MVP</span></p>
              </div>

              <h3>🤝 Trust Problem</h3>
              <p>Copy trading platforms exist, but there's no way to validate the performance they claim. Even when wallet addresses are provided, there's massive friction to pull transaction data and do true analysis.</p>
              <div className="docs-callout success">
                <p className="docs-callout-content"><strong>→ Solved by:</strong> AI analyzes on-chain transactions, explains alpha drivers <span className="docs-badge success">MVP</span></p>
              </div>

              <h2>For Traders</h2>

              <h3>✓ Validation Problem</h3>
              <p>No place to publicly validate performance in a verifiable way. No path from managing $200K personal capital to $2M+ with outside investors.</p>

              <h3>🔒 Edge Preservation Problem</h3>
              <p>Top traders don't want their wallet transactions parsed and strategies reverse-engineered. No incentive structure exists for them to let their alpha be accessible to investors.</p>
            </section>
          )}

          {/* Quick Start Page */}
          {activePage === 'quick-start' && (
            <section>
              <h1>Quick Start</h1>
              <p className="docs-subtitle">Get started in 30 seconds.</p>

              <div className="docs-steps-flow">
                <div className="docs-steps-flow-row">
                  <div className="docs-step"><strong>1.</strong> Name Your Agent</div>
                  <div className="docs-step-arrow">→</div>
                  <div className="docs-step"><strong>2.</strong> Connect Wallet</div>
                  <div className="docs-step-arrow">→</div>
                  <div className="docs-step"><strong>3.</strong> Start Chatting</div>
                </div>
              </div>

              <h2>Example Queries</h2>

              <div className="docs-examples">
                <div className="docs-example">
                  <div className="docs-example-code">"Find traders with &gt;60% win rate and &lt;15% max drawdown"</div>
                </div>
                <div className="docs-example">
                  <div className="docs-example-code">"ETH SHORTS on Avantis are up 75%, good time to take profits?"</div>
                </div>
                <div className="docs-example">
                  <div className="docs-example-code">"What are top wallets doing with $DEGEN?"</div>
                </div>
              </div>
            </section>
          )}

          {/* How It Works Page */}
          {activePage === 'how-it-works' && (
            <section>
              <h1>How It Works</h1>
              <p className="docs-subtitle">Two layers that power decentralized asset management.</p>

              <p>Yieldr combines two layers to enable trustless asset management at scale:</p>

              <div className="docs-cards-grid">
                <div className="docs-card" style={{ border: '2px solid var(--accent-green)' }}>
                  <div className="docs-card-icon">🧠</div>
                  <div className="docs-card-title">Intelligence Layer <span className="docs-badge success">Now</span></div>
                  <p className="docs-card-text">AI agents that discover top traders, analyze alpha drivers, advise on positions, and monitor your portfolio.</p>
                </div>
                <div className="docs-card">
                  <div className="docs-card-icon">🔐</div>
                  <div className="docs-card-title">Trust Layer <span className="docs-badge neutral">v1.0</span></div>
                  <p className="docs-card-text">Smart contracts that enable trustless execution — auto trading, fund management, risk controls, and compensation.</p>
                </div>
              </div>

              <div className="docs-callout info">
                <div className="docs-callout-title">💡 Why Two Layers?</div>
                <p className="docs-callout-content" style={{ marginBottom: '0.5rem' }}><strong>Intelligence without trust</strong> = You know who's good but can't safely invest with them.</p>
                <p className="docs-callout-content" style={{ marginBottom: '0.5rem' }}><strong>Trust without intelligence</strong> = You can execute safely but don't know who to invest with.</p>
                <p className="docs-callout-content"><strong>Both layers together</strong> = True decentralized asset management.</p>
              </div>
            </section>
          )}

          {/* Tokenomics Page */}
          {activePage === 'tokenomics' && (
            <section>
              <h1>Tokenomics</h1>
              <p className="docs-subtitle">Supply structure and public allocation tiers.</p>

              <div className="docs-stats-box">
                <div className="docs-stats-box-icon">⚡</div>
                <div className="docs-stats-box-title">YLDR</div>
                <p className="docs-stats-box-subtitle">Use Yieldr = Burn YLDR</p>
                <div className="docs-stats-grid">
                  <div className="docs-stat">
                    <div className="docs-stat-value">210M</div>
                    <div className="docs-stat-label">Total Supply</div>
                  </div>
                  <div className="docs-stat">
                    <div className="docs-stat-value">9.05%</div>
                    <div className="docs-stat-label">Public Allocation</div>
                  </div>
                  <div className="docs-stat">
                    <div className="docs-stat-value">~$5M</div>
                    <div className="docs-stat-label">Target Raise</div>
                  </div>
                  <div className="docs-stat">
                    <div className="docs-stat-value">BASE</div>
                    <div className="docs-stat-label">Network</div>
                  </div>
                </div>
              </div>

              <h2>Public Allocation Tiers</h2>

              <div className="docs-table-wrapper">
                <table className="docs-table">
                  <thead>
                    <tr>
                      <th>Tier</th>
                      <th>Tokens</th>
                      <th>Price</th>
                      <th>FDV</th>
                      <th>Raise</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="table-row-header">Genesis</td>
                      <td>1.5M</td>
                      <td className="table-highlight">$0.057</td>
                      <td>$12M</td>
                      <td>$85.5K</td>
                    </tr>
                    <tr>
                      <td className="table-row-header">Pre-Seed</td>
                      <td>2.0M</td>
                      <td className="table-highlight">$0.10</td>
                      <td>$21M</td>
                      <td>$200K</td>
                    </tr>
                    <tr>
                      <td className="table-row-header">Seed</td>
                      <td>3.0M</td>
                      <td className="table-highlight">$0.20</td>
                      <td>$42M</td>
                      <td>$600K</td>
                    </tr>
                    <tr>
                      <td className="table-row-header">Growth</td>
                      <td>4.5M</td>
                      <td className="table-highlight">$0.30</td>
                      <td>$63M</td>
                      <td>$1.35M</td>
                    </tr>
                    <tr>
                      <td className="table-row-header">Scale</td>
                      <td>8.0M</td>
                      <td className="table-highlight">$0.357</td>
                      <td>$75M</td>
                      <td>$2.86M</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="docs-table-note">
                <strong>Total:</strong> 19M YLDR (9.05%) | <strong>Target Raise:</strong> ~$5.09M
              </p>

              <div className="docs-callout warning">
                <div className="docs-callout-title">📋 Pre-TGE Disclosure</div>
                <p className="docs-callout-content">Full allocation breakdown will be published <strong>30 days before TGE</strong>. All team and strategic allocations follow 1-year cliff + 3-year monthly vesting.</p>
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
