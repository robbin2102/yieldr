'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import NavLinks from '@/components/NavLinks';
import './landing.css';

export default function HomePage() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('lp-visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.lp-reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const tickerItems = [
    { label: 'GEOPOLITICS VAULT', value: '+41.8% 30D' },
    { label: 'NBA VAULT',         value: '+18.7% 7D' },
    { label: 'SOCCER VAULT',      value: '+12.4% 7D' },
    { label: 'EARLY ACCESS',      value: '$9M FDV' },
    { label: 'VAULTS LAUNCH',     value: 'Q4 2026' },
    { label: 'YLDR TGE',          value: 'TVL-gated' },
  ];

  return (
    <div className="lp-root" style={{ background: 'var(--bg)', minHeight: '100vh', overflowX: 'hidden' }}>
      <div className="lp-grid" />
      <div className="lp-scanline" />

      {/* ── Nav ── */}
      <nav className="lp-nav">
        <Link href="/" className="lp-nav-l">
          <svg width="20" height="24" viewBox="0 0 100 120" fill="none">
            <path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#00E87B" />
            <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3" />
            <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9" />
          </svg>
          <span className="lp-nav-brand">YIELDR</span>
        </Link>
        <div className="lp-nav-r">
          <NavLinks cta={{ href: '/vaults', label: 'Enter Vaults ↗' }} />
        </div>
      </nav>

      {/* ── Ticker ── */}
      <div className="lp-ticker">
        <div className="lp-ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <span className="lp-ti">
                {item.label} <span className="up">{item.value}</span>
              </span>
              <span className="lp-tsep">|</span>
            </span>
          ))}
        </div>
      </div>

      <main className="lp-main">

        {/* ── Hero ── */}
        <section className="lp-hero">
          <div className="lp-hero-glow" />
          <div className="lp-hero-tag">Live on Polymarket · $100K Project Capital</div>
          <h1>
            AI Agents Run Funds.<br />
            You <span className="ac">Earn</span>.
          </h1>
          <p className="lp-hero-sub">
            The platform for <strong>AI-native hedge funds onchain.</strong> Top traders launch vaults.
            Investors set yield targets. Agents handle everything in between — discovery, allocation, and operations.
          </p>
          <div className="lp-hero-ctas">
            <Link href="/vaults" className="lp-btn-p">Explore Live Vaults ↗</Link>
            <a href="#vision" className="lp-btn-s">See the Vision ↓</a>
          </div>
          <div className="lp-hero-stats">
            <div className="lp-stat">
              <div className="lp-stat-v">$100K</div>
              <div className="lp-stat-l">Project Capital</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat-v">+34.2%</div>
              <div className="lp-stat-l">Best Vault 30D</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat-v">3</div>
              <div className="lp-stat-l">Live Vaults</div>
            </div>
          </div>
        </section>

        {/* ── Vision ── */}
        <section className="lp-section lp-reveal" id="vision">
          <div className="lp-sec-head">
            <div className="lp-sec-tag">The Vision</div>
            <div className="lp-sec-title">
              A million AI-native hedge funds <span className="ac">onchain</span>.
            </div>
            <div className="lp-sec-sub">
              For 70 years, the hedge fund has served ~10,000 managers. The structure is designed for
              scarcity. <strong>We&apos;re rebuilding it as a primitive that scales to a million
              operators</strong> — open to anyone with verified edge or capital to allocate.
            </div>
          </div>
          <div className="lp-vision-grid">
            <div className="lp-vision-card">
              <div className="lp-vision-num">01 / Scale</div>
              <div className="lp-vision-h">A million funds</div>
              <p className="lp-vision-p">Every trader with verified edge — anywhere in the world — running a fund. From Seoul to São Paulo to Lagos, agent-managed and onchain.</p>
            </div>
            <div className="lp-vision-card">
              <div className="lp-vision-num">02 / Access</div>
              <div className="lp-vision-h">A billion allocators</div>
              <p className="lp-vision-p">Every investor with capital, allocating across global strategies through agents tuned to their risk-return goals. Continuously, autonomously.</p>
            </div>
            <div className="lp-vision-card">
              <div className="lp-vision-num">03 / Market</div>
              <div className="lp-vision-h">A new market</div>
              <p className="lp-vision-p">Open, agent-operated, performance-driven, and onchain by default. Capital flows to verified edge — not to whoever has the best fund admin.</p>
            </div>
          </div>
          <div className="lp-vision-quote">
            <span className="lp-vision-quote-mark">→</span>
            <div className="lp-vision-quote-text">
              The hedge fund served a few thousand managers.{' '}
              <strong>The agent-managed fund will serve the world.</strong>
            </div>
            <Link href="/docs#vision" className="lp-vision-link">Full Vision ↗</Link>
          </div>
        </section>

        {/* ── Agent Stack ── */}
        <section className="lp-section lp-reveal" id="stack">
          <div className="lp-sec-head">
            <div className="lp-sec-tag">The Mechanism</div>
            <div className="lp-sec-title">
              Agents that turn every top trader into a fund manager — and every investor into a{' '}
              <span className="ac">pro allocator</span>.
            </div>
            <div className="lp-sec-sub">
              Agents on both sides of the marketplace. Each side handles the work that capped funds at
              thousands. <strong>With agents, the constraint dissolves.</strong>
            </div>
          </div>
          <div className="lp-stack-grid">
            <div className="lp-stack-card">
              <div className="lp-stack-side">Trader-Side Agents</div>
              <div className="lp-stack-h">
                Grow the vault. <span className="ac">Manage investors.</span>
              </div>
              <ul className="lp-stack-list">
                <li>
                  <span className="lp-stack-name">Matching</span>
                  <span className="lp-stack-desc">Surfaces the vault to investors whose risk-return profiles fit. Capital finds the vault.</span>
                </li>
                <li>
                  <span className="lp-stack-name">Community</span>
                  <span className="lp-stack-desc">Manages investor queries and performance communication. Holds the relationship through drawdowns.</span>
                </li>
              </ul>
            </div>
            <div className="lp-stack-card">
              <div className="lp-stack-side">Investor-Side Agents</div>
              <div className="lp-stack-h">
                Run the portfolio. <span className="ac">Hit the target.</span>
              </div>
              <ul className="lp-stack-list">
                <li>
                  <span className="lp-stack-name">Allocation</span>
                  <span className="lp-stack-desc">Continuously deploys, rotates, and rebalances across vaults that fit the investor&apos;s risk-return goals.</span>
                </li>
                <li>
                  <span className="lp-stack-name">Monitoring</span>
                  <span className="lp-stack-desc">Tracks every vault held. Flags edge decay, strategy drift, or risk creep before it shows up in PnL.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Live Vaults ── */}
        <section className="lp-section lp-reveal" id="vaults">
          <div className="lp-sec-head">
            <div className="lp-sec-tag">Live Vaults</div>
            <div className="lp-sec-title">
              $100K of project capital. Trading <span className="ac">live</span>.
            </div>
            <div className="lp-sec-sub">
              Before we open to the public, we&apos;re proving the agent stack with our own money.{' '}
              <strong>Real performance, public onchain, fully transparent.</strong>
            </div>
          </div>
          <div className="lp-vp-grid">
            {[
              {
                href: '/vaults?vault=nba',
                name: '🏀 NBA Edge Vault',
                desc: 'Agent discovers & ranks top NBA prediction market traders by statistical edge, then mirrors highest-conviction positions.',
                stats: [
                  { v: '+18.7%', l: '7D Return' },
                  { v: '$22.4K', l: 'Vault Size' },
                  { v: '74%',    l: 'Win Rate' },
                  { v: '143',    l: 'Trades' },
                ],
              },
              {
                href: '/vaults?vault=soccer',
                name: '⚽ Soccer Alpha Vault',
                desc: 'Agent scans soccer markets for traders with statistically impossible edge (p<0.0001), enters near their price levels.',
                stats: [
                  { v: '+12.4%', l: '7D Return' },
                  { v: '$18.6K', l: 'Vault Size' },
                  { v: '69%',    l: 'Win Rate' },
                  { v: '89',     l: 'Trades' },
                ],
              },
              {
                href: '/vaults?vault=geo',
                name: '🌐 Geopolitics Vault',
                desc: 'Agent identifies insider wallets with abnormal win rates vs implied probability and takes positions on geopolitical events.',
                stats: [
                  { v: '+41.8%', l: '30D Return' },
                  { v: '$59.2K', l: 'Vault Size' },
                  { v: '82%',    l: 'Win Rate' },
                  { v: '67',     l: 'Trades' },
                ],
              },
            ].map((vault) => (
              <Link href={vault.href} className="lp-vp-card" key={vault.href}>
                <span className="lp-vp-tag"><span className="lp-vp-live" /> LIVE</span>
                <div className="lp-vp-name">{vault.name}</div>
                <p className="lp-vp-desc">{vault.desc}</p>
                <div className="lp-vp-stats">
                  {vault.stats.map((s) => (
                    <div className="lp-vp-stat" key={s.l}>
                      <div className="lp-vp-stat-v">{s.v}</div>
                      <div className="lp-vp-stat-l">{s.l}</div>
                    </div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Track Record ── */}
        <section className="lp-section lp-reveal">
          <div className="lp-sec-head">
            <div className="lp-sec-tag">Track Record</div>
            <div className="lp-sec-title">
              Built different. <span className="ac">Proven onchain.</span>
            </div>
          </div>
          <div className="lp-proof-grid">
            <div className="lp-proof-card">
              <div className="lp-proof-icon">🏆</div>
              <div className="lp-proof-h">Base Batches 002 Winner</div>
              <p className="lp-proof-p">Selected from 900+ projects for building DeFi infrastructure on Base.</p>
            </div>
            <Link href="/build-in-public" className="lp-proof-card">
              <div className="lp-proof-icon">📊</div>
              <div className="lp-proof-h">Building in Public</div>
              <p className="lp-proof-p">Weekly build logs, real treasury data, real trading performance. No sanitisation.</p>
            </Link>
            <div className="lp-proof-card">
              <div className="lp-proof-icon">🔨</div>
              <div className="lp-proof-h">Actively Building</div>
              <p className="lp-proof-p">275+ commits, 60K+ lines of code shipped since October 2025.</p>
            </div>
            <div className="lp-proof-card">
              <div className="lp-proof-icon">🛡️</div>
              <div className="lp-proof-h">Treasury Public</div>
              <p className="lp-proof-p">All funds in multisig. Monthly reporting. Full build-in-public transparency.</p>
            </div>
          </div>
        </section>

        {/* ── Protocols ── */}
        <div className="lp-protocols lp-reveal">
          <div className="lp-proto-section">
            <div className="lp-proto-label">— Live Integration —</div>
            <div className="lp-proto-row">
              <div className="lp-proto-item lp-proto-live">
                <span className="lp-proto-name">Polymarket</span>
                <span className="lp-proto-cat">Predictions</span>
              </div>
            </div>
          </div>
          <div className="lp-proto-section">
            <div className="lp-proto-label">— Upcoming Integrations —</div>
            <div className="lp-proto-row">
              {[
                { name: 'Hyperliquid', cat: 'Perps' },
                { name: 'Avantis',     cat: 'Perps' },
                { name: 'Uniswap',     cat: 'Liquidity' },
                { name: 'Aerodrome',   cat: 'Liquidity' },
              ].map((p) => (
                <div className="lp-proto-item" key={p.name}>
                  <span className="lp-proto-name">{p.name}</span>
                  <span className="lp-proto-cat">{p.cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Token / Early Access ── */}
        <section className="lp-section lp-reveal">
          <div className="lp-token-box">
            <div className="lp-token-tag">Early Access</div>
            <div className="lp-token-h">
              Become a YLDR holder. <span className="ac">Own the protocol</span> from day one.
            </div>
            <p className="lp-token-sub">
              Every $100 contributed: $50 deposited into agent-managed vaults from day one + $50 in
              YLDR token allocation. Withdraw vault deposits anytime, no lock-up.
            </p>
            <div className="lp-token-grid">
              <div className="lp-token-stat">
                <div className="lp-token-stat-v">$9M</div>
                <div className="lp-token-stat-l">Genesis FDV</div>
              </div>
              <div className="lp-token-stat">
                <div className="lp-token-stat-v">210M</div>
                <div className="lp-token-stat-l">Total Supply</div>
              </div>
              <div className="lp-token-stat">
                <div className="lp-token-stat-v">41%</div>
                <div className="lp-token-stat-l">Public Allocation</div>
              </div>
              <div className="lp-token-stat">
                <div className="lp-token-stat-v">T+7d</div>
                <div className="lp-token-stat-l">TGE from Target</div>
              </div>
            </div>
            <div className="lp-token-offer">
              <strong>Tiered Early Access</strong> — 5 tiers from $9M → $34M FDV. $5M total target
              ($2.5M to vaults + $2.5M to YLDR allocation). No VC pricing — retail and institutions
              allocate at the same price, first come, first served.
            </div>
            <div className="lp-token-note">
              ⚡ You choose which vault your capital enters at launch:{' '}
              <em>NBA Edge</em>, <em>Soccer Alpha</em>, or <em>Geopolitics</em>
            </div>
            <a
              href="https://t.me/+bKuyducVGqliNGVl"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-p"
            >
              Join Waitlist → Get Invited ↗
            </a>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-f-soc">
          <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter">
            <svg viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="https://web.telegram.org/k/#@yieldrdotorg" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
            <svg viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </a>
          <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
        <div className="lp-f-txt">
          Yieldr © 2026. Built on Base.{' '}
          <a href="https://yieldr.org">yieldr.org</a>
        </div>
      </footer>
    </div>
  );
}
