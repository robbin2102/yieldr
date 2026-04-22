'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import NavLinks from '@/components/NavLinks';
import './landing.css';

export default function HomePage() {
  // Intersection observer — reveal sections on scroll
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
    { label: 'GEOPOLITICS VAULT', value: '+41.8% 30D', up: true },
    { label: 'NBA VAULT', value: '+18.7% 7D', up: true },
    { label: 'NHL VAULT', value: '+12.4% 7D', up: true },
    { label: 'USDC YIELD', value: '4.5% APY', up: true },
    { label: 'YLDR TGE', value: 'Q1 2027', up: true },
    { label: 'EARLY ACCESS', value: '$9M FDV', up: true },
    { label: '842 SUBSCRIBERS', value: null, up: false },
    { label: 'VAULTS LAUNCH', value: 'Q3 2026', up: true },
  ];

  return (
    <div className="lp-root">
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
                {item.label}
                {item.value && (
                  <span className={item.up ? 'up' : 'dn'}>{item.value}</span>
                )}
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
          <div className="lp-hero-tag">Agentic Trading Vaults — Live on Polymarket</div>
          <h1>
            AI Agents Trade.<br />
            You <span className="ac">Earn</span>.
          </h1>
          <p className="lp-hero-sub">
            Use agents to find edge across prediction markets and trade 24/7 with proven
            strategies. Deposit into a vault. Let the agent compound.
          </p>
          <div className="lp-hero-ctas">
            <Link href="/vaults" className="lp-btn-p">
              Enter Vaults — Early Access ↗
            </Link>
            <a href="#how" className="lp-btn-s">How it works ↓</a>
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
              <div className="lp-stat-v">842</div>
              <div className="lp-stat-l">Subscribers</div>
            </div>
            <div className="lp-stat">
              <div className="lp-stat-v">3</div>
              <div className="lp-stat-l">Live Vaults</div>
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="lp-how lp-reveal" id="how">
          <div className="lp-sec-head">
            <div className="lp-sec-tag">How It Works</div>
            <div className="lp-sec-title">Four steps to your onchain hedge fund</div>
          </div>
          <div className="lp-how-grid">
            {[
              {
                step: '01',
                icon: '🔍',
                title: 'Discover Edge',
                body: 'Use quant agents to research and backtest strategies from 30K+ traders and 10M+ trades indexed — or bring your own playbook.',
                arrow: true,
              },
              {
                step: '02',
                icon: '⚡',
                title: 'Automate Execution',
                body: 'Define your trade execution strategy with risk parameters and watch the agent execute flawlessly, around the clock.',
                arrow: true,
              },
              {
                step: '03',
                icon: '📈',
                title: 'Deposit & Earn',
                body: 'Returns compound in the vault. Track PnL, trades, and agent reasoning in real time. Withdraw anytime — no lock-ups.',
                arrow: true,
              },
              {
                step: '04',
                icon: '🤝',
                title: 'Invite & Earn More',
                body: 'Invite depositors into your vault and set a 2/20 performance fee — earn like hedge funds, but entirely onchain.',
                arrow: false,
              },
            ].map((card) => (
              <div className="lp-how-card" key={card.step}>
                <div className="lp-how-num">Step {card.step}</div>
                <div className="lp-how-icon">{card.icon}</div>
                <div className="lp-how-h">{card.title}</div>
                <p className="lp-how-p">{card.body}</p>
                {card.arrow && <span className="lp-how-arrow">→</span>}
              </div>
            ))}
          </div>
        </section>

        {/* ── Live Vaults ── */}
        <section className="lp-vp lp-reveal" id="vaults">
          <div className="lp-sec-head">
            <div className="lp-sec-tag">Live Vaults</div>
            <div className="lp-sec-title">$100K of project capital. Trading live.</div>
            <div className="lp-sec-sub">
              Before we open to the public, we&apos;re proving it with our own money.
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
                name: '🏒 NHL Edge Vault',
                desc: 'Agent scans NHL prediction markets for traders with statistically impossible edge (p<0.0001), enters near their price levels.',
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
                <div className="lp-vp-tag">
                  <span className="lp-vp-live" /> LIVE
                </div>
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
        <section className="lp-proof lp-reveal">
          <div className="lp-sec-head">
            <div className="lp-sec-tag">Track Record</div>
            <div className="lp-sec-title">Built different. Proven onchain.</div>
          </div>
          <div className="lp-proof-grid">
            <div className="lp-proof-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="lp-proof-logo"
                src="https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760730551690x161831425309488800/_base-square%20%282%29.svg"
                alt="Base"
              />
              <div className="lp-proof-h">Base Batches 002 Winner</div>
              <p className="lp-proof-p">
                Selected from 900+ projects for building DeFi infrastructure on Base.
              </p>
            </div>
            <Link href="/build-in-public" className="lp-proof-card">
              <div className="lp-proof-icon">📊</div>
              <div className="lp-proof-h">Building in Public</div>
              <p className="lp-proof-p">
                Weekly build logs, real treasury data, real trading performance. No sanitisation.
              </p>
            </Link>
            <div className="lp-proof-card">
              <div className="lp-proof-icon">🔨</div>
              <div className="lp-proof-h">Actively Building</div>
              <p className="lp-proof-p">
                275+ commits, 60K+ lines of code shipped since October 2025.
              </p>
            </div>
            <div className="lp-proof-card">
              <div className="lp-proof-icon">🛡️</div>
              <div className="lp-proof-h">Treasury Public</div>
              <p className="lp-proof-p">
                All funds in multisig. Monthly reporting. Full build-in-public transparency.
              </p>
            </div>
          </div>
        </section>

        {/* ── Protocols ── */}
        <div className="lp-protocols lp-reveal">
          <div className="lp-proto-section">
            <div className="lp-proto-label">Live Integration</div>
            <div className="lp-proto-row">
              <div className="lp-proto-item lp-proto-live">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://polymarket.com/images/brand/icon-blue.png" alt="Polymarket" />
                <span className="lp-proto-name">Polymarket</span>
              </div>
            </div>
          </div>
          <div className="lp-proto-section">
            <div className="lp-proto-label">Upcoming Integrations</div>
            <div className="lp-proto-row">
              {[
                {
                  src: 'https://nftevening.com/wp-content/uploads/2025/03/hyperliquid-logo.png',
                  name: 'Hyperliquid',
                  cat: 'Perps',
                },
                {
                  src: 'https://www.avantisfi.com/images/avantis-logo.svg',
                  name: 'Avantis',
                  cat: 'Perps',
                },
                {
                  src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxiwWCpFc4gAmdCBNs4jdn04D0FyVDS8NtmA&s',
                  name: 'Uniswap',
                  cat: 'Liquidity',
                },
                {
                  src: 'https://aerodrome.finance/brand-kit/AERO/symbol.png',
                  name: 'Aerodrome',
                  cat: 'Liquidity',
                },
              ].map((p) => (
                <div className="lp-proto-item lp-proto-upcoming" key={p.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.name} />
                  <span className="lp-proto-name">{p.name}</span>
                  <span className="lp-proto-cat">{p.cat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Token / Early Access CTA ── */}
        <section className="lp-token lp-reveal">
          <div className="lp-token-box">
            <div className="lp-token-h">Early Access: YLDR Token</div>
            <p className="lp-token-sub">
              Get vault access + YLDR allocation at the earliest stage. Choose your preferred
              vault, and your capital starts earning from day one.
            </p>
            <div className="lp-token-grid">
              <div className="lp-token-stat">
                <div className="lp-token-stat-v">$9M</div>
                <div className="lp-token-stat-l">FDV</div>
              </div>
              <div className="lp-token-stat">
                <div className="lp-token-stat-v">210M</div>
                <div className="lp-token-stat-l">Total Supply</div>
              </div>
              <div className="lp-token-stat">
                <div className="lp-token-stat-v">Q1 &apos;27</div>
                <div className="lp-token-stat-l">TGE</div>
              </div>
            </div>
            <div className="lp-token-offer">
              <strong>Early Access Offer:</strong> Every $100 deposited = $50 into a Base USDC
              vault earning <strong>4.5% APY</strong> from day one (migrates to agent trading
              vaults at Q3 2026 launch) + $50 in YLDR token allocation at $9M FDV
            </div>
            <div className="lp-token-note">
              ⚡ You choose which vault your capital enters on launch:{' '}
              <em>NBA Edge</em>, <em>NHL Edge</em>, or <em>Geopolitics</em>
            </div>
            <Link href="/vaults" className="lp-btn-p">
              Choose Your Vault — Early Access ↗
            </Link>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-f-soc">
          <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://github.com/robbin2102/yieldr-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </div>
        <div className="lp-f-txt">
          Yieldr © 2025. Built on Base.{' '}
          <a href="https://yieldr.org">yieldr.org</a>
        </div>
      </footer>
    </div>
  );
}
