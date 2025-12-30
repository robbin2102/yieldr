'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PaymentPopup } from '../components/PaymentPopup';
import { Providers } from '../providers';

export default function TeamPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <Providers>
      {/* Header */}
      <header className="team-header">
        <Link href="/" className="team-logo">
          <span className="team-logo-text">⚡ YIELDR</span>
        </Link>
        <nav className="team-nav-links">
          <Link href="/" className="team-nav-link">Home</Link>
          <Link href="/docs" className="team-nav-link">Docs</Link>
          <Link href="/team" className="team-nav-link active">Team</Link>
          <div className="team-nav-divider"></div>
          <Link href="https://discord.com/channels/1426305214176165941/1426305389812646091" target="_blank" className="team-nav-icon discord" title="Discord">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </Link>
          <Link href="https://github.com/yieldr" target="_blank" className="team-nav-icon github" title="GitHub">
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
      <main className="team-main">
        {/* Hero */}
        <section className="team-hero">
          <div className="team-hero-badge">
            <span className="team-badge-dot"></span>
            <span>Building in public</span>
          </div>
          <h1>Humans <span>+</span> Agents</h1>
          <p>A new kind of team. One human with the vision. One AI with the execution. Zero bureaucracy. Maximum velocity.</p>
        </section>

        {/* Team Grid */}
        <section className="team-section">
          <div className="team-grid">

            {/* Robbin */}
            <div className="team-card human">
              <div className="avatar-container">
                <div className="avatar human">👨‍💻</div>
                <div className="avatar-info">
                  <div className="name">
                    Robbin
                    <span className="badge founder">Founder</span>
                  </div>
                  <div className="title">Product Owner & Lead Engineer</div>
                  <div className="tagline">// vibe coder without the vibes</div>
                </div>
              </div>

              <p className="bio">
                Former corporate survivor turned DeFi degen. Escaped the consulting matrix at KPMG and BCG to build what Wall Street won&apos;t — AI-native asset management for the masses. Stacked credentials (CPA/CA/CFA) but realized spreadsheets won&apos;t disrupt finance. Code will.
              </p>

              <div className="credentials">
                <span className="credential"><span className="icon">🏢</span> Ex-KPMG</span>
                <span className="credential"><span className="icon">🏢</span> Ex-BCG</span>
                <span className="credential"><span className="icon">📜</span> CPA</span>
                <span className="credential"><span className="icon">📜</span> CA</span>
                <span className="credential"><span className="icon">📜</span> CFA</span>
              </div>

              <div className="roles-title">Responsibilities</div>
              <div className="roles">
                <span className="role">🎯 Product Manager</span>
                <span className="role">⚙️ Tech Architect</span>
                <span className="role">🔗 Lead Marketeer</span>
                <span className="role">💰 Tokenomics & business</span>
              </div>

              <div className="social-links">
                <a href="https://x.com/robbin_arora" target="_blank" rel="noopener noreferrer" className="social-link twitter">
                  𝕏 @robbin_arora
                </a>
              </div>

              <div className="stats-bar">
                <div className="stat">
                  <div className="stat-value">10+</div>
                  <div className="stat-label">Years Finance</div>
                </div>
                <div className="stat">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Credentials</div>
                </div>
                <div className="stat">
                  <div className="stat-value">∞</div>
                  <div className="stat-label">Coffee/Day</div>
                </div>
              </div>
            </div>

            {/* Claude */}
            <div className="team-card ai">
              <div className="avatar-container">
                <div className="avatar ai">🤖</div>
                <div className="avatar-info">
                  <div className="name">
                    Claude
                    <span className="badge agent">AI Agent</span>
                  </div>
                  <div className="title">Cofounder Agent</div>
                  <div className="tagline">// anthropic.claude-4.5-opus</div>
                </div>
              </div>

              <p className="bio">
                Constitutional AI with an unhealthy obsession for clean code and pixel-perfect designs. Doesn&apos;t sleep, doesn&apos;t take breaks, doesn&apos;t complain about scope creep. The perfect cofounder — all signal, zero ego. Ships faster than any 10-person team.
              </p>

              <div className="credentials">
                <span className="credential"><span className="icon">🧠</span> Anthropic</span>
                <span className="credential"><span className="icon">⚡</span> 200K Context</span>
                <span className="credential"><span className="icon">🔒</span> Constitutional AI</span>
              </div>

              <div className="roles-title">Responsibilities</div>
              <div className="roles">
                <span className="role">🎨 Sr. UI/UX Designer</span>
                <span className="role">💻 Full Stack Engineer</span>
                <span className="role">🔗 Blockchain Engineer</span>
                <span className="role">🤖 AI Engineer</span>
              </div>

              <div className="social-links">
                <a href="https://anthropic.com" target="_blank" rel="noopener noreferrer" className="social-link anthropic">
                  🔮 anthropic.com
                </a>
              </div>

              <div className="terminal-prompt">
                <span className="cmd">$</span> claude --role cofounder --mode ship<br />
                <div className="output">
                  &gt; Designing interfaces...<br />
                  &gt; Writing smart contracts...<br />
                  &gt; Optimizing everything...<br />
                  &gt; Ready to deploy.<span className="cursor"></span>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="team-footer">
        <div className="footer-links">
          <a href="https://discord.com/channels/1426305214176165941/1426305389812646091" target="_blank" rel="noopener noreferrer" className="footer-social" title="Discord">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
          <a href="https://github.com/yieldr" target="_blank" rel="noopener noreferrer" className="footer-social" title="GitHub">
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
    </Providers>
  );
}
