'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavLinks from '@/components/NavLinks';
import './landing.css';

const LIVE_VAULTS = [
  {
    href: '/explorer',
    proto: 'Polymarket · Predictions',
    name: '🌐 Geopolitics Vault',
    desc: 'Agent identifies wallets with abnormal win rates vs implied probability on geopolitical events.',
    stats: [{ v: '+41.8%', l: '30D Return' }, { v: '82%', l: 'Win Rate' }],
  },
  {
    href: '/explorer',
    proto: 'Polymarket · Predictions',
    name: '🏀 NBA Edge Vault',
    desc: 'Agent ranks top NBA prediction market traders by statistical edge, mirrors highest-conviction positions.',
    stats: [{ v: '+18.7%', l: '7D Return' }, { v: '74%', l: 'Win Rate' }],
  },
];

const WAITLIST_VAULTS = [
  {
    proto: 'Avantis · Hyperliquid · Perps',
    name: '⚡ Funding Arbs Vault',
    desc: 'Captures funding rate premium on Avantis & Hyperliquid by holding long/short pairs where funding diverges from historical mean. Zero directional bias.',
    stats: [{ v: '$75K', l: 'Target AUM' }, { v: '312', l: 'Waitlisted' }],
  },
  {
    proto: 'Aerodrome · LP',
    name: '🪙 AERO Accumulator Vault',
    desc: "DCA into Base's largest DEX token using top Aerodrome LP and trader signals. Agents execute and pace.",
    stats: [{ v: '$48K', l: 'Target AUM' }, { v: '234', l: 'Waitlisted' }],
  },
  {
    proto: 'Virtuals · Bankr · Project Coins',
    name: '🌐 Base Ecosystem Vault',
    desc: 'Curated basket of Virtuals, Bankr, and Base ecosystem tokens following highest-edge wallets.',
    stats: [{ v: '$32K', l: 'Target AUM' }, { v: '189', l: 'Waitlisted' }],
  },
  {
    proto: 'Uniswap · Aerodrome · RWA',
    name: '🚀 SpaceX RWA Vault',
    desc: 'Accumulates SpaceX tokenised equity on Uniswap and Aerodrome, following wallets with the highest RWA spot edge.',
    stats: [{ v: '$28K', l: 'Target AUM' }, { v: '112', l: 'Waitlisted' }],
  },
];

const TICKER_ITEMS = [
  { label: 'GEOPOLITICS VAULT', value: '+41.8% 30D', up: true },
  { label: 'NBA EDGE VAULT', value: '+18.7% 7D', up: true },
  { label: 'YLDR TGE', value: 'JULY 2026', up: true },
  { label: 'GENESIS FDV', value: '$9M', up: true },
  { label: 'BASE BATCHES 002', value: 'WINNER', up: true },
  { label: '102 WALLETS', value: 'WHITELISTED', up: true },
  { label: 'FUNDING ARBS VAULT', value: 'WAITLIST OPEN', up: true },
  { label: 'SPACEX RWA VAULT', value: 'WAITLIST OPEN', up: true },
];

export default function HomePage() {
  const [bannerOpen, setBannerOpen] = useState(true);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('lp-visible');
        });
      },
      { threshold: 0.07 }
    );
    document.querySelectorAll('.lp-reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lp-root">
      <div className="lp-grid" />
      <div className="lp-scanline" />

      {/* ── Banner ── */}
      {bannerOpen && (
        <div className="lp-banner">
          <span className="lp-banner-txt">
            <strong>$YLDR</strong> TGE on Virtuals · July 2026 · Whitelist any agent vault — earn up to{' '}
            <strong>100K $YLDR</strong> at beta launch ·
          </span>
          <a href="#token" className="lp-banner-link">Learn more →</a>
          <button className="lp-banner-close" aria-label="Dismiss" onClick={() => setBannerOpen(false)}>×</button>
        </div>
      )}

      {/* ── Nav ── */}
      <nav className="lp-nav">
        <Link href="/" className="lp-nav-l">
          <svg width="18" height="22" viewBox="0 0 100 120" fill="none">
            <path d="M50 8Q72 28 82 60Q72 92 50 112Q28 92 18 60Q28 28 50 8Z" fill="#00E87B" />
            <ellipse cx="50" cy="60" rx="16" ry="22" fill="#000" opacity=".25" />
            <circle cx="50" cy="60" r="9" fill="#fff" opacity=".88" />
          </svg>
          <span className="lp-nav-brand">YIELDR</span>
        </Link>
        <div className="lp-nav-r">
          <NavLinks cta={{ href: '/explorer', label: 'Explore Vaults ↗' }} />
        </div>
      </nav>

      {/* ── Ticker ── */}
      <div className="lp-ticker">
        <div className="lp-ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <span className="lp-ti">
                {item.label}
                <span className={item.up ? 'up' : 'dn'}>{item.value}</span>
              </span>
              <span className="lp-tsep">|</span>
            </span>
          ))}
        </div>
      </div>

      <main className="lp-main">

        {/* ── Hero ── */}
        <div className="lp-wrap">
          <section className="lp-hero">
            <div className="lp-hero-glow" />
            <h1>You bring the edge.<br /><span className="ac">Agents run the fund.</span></h1>
            <p className="lp-hero-tagline">The agent stack for onchain funds.</p>
            <p className="lp-hero-sub">
              Connect your wallet, prove your edge, and launch an agent vault — turning your
              onchain performance into <strong>recurring revenue.</strong>
            </p>
            <div className="lp-hero-ctas">
              <Link href="/explorer" className="lp-btn-p">Explore Agent Vaults ↗</Link>
            </div>
            <div className="lp-hero-metrics">
              <div className="lp-hm-panel">
                <div className="lp-hm-label"><span className="lp-hm-dot live" />Live now</div>
                <div className="lp-hm-stats">
                  <div><div className="lp-hm-v">$100K</div><div className="lp-hm-l">AUM Trading</div></div>
                  <div className="lp-hm-sep" />
                  <div><div className="lp-hm-v">2</div><div className="lp-hm-l">Agent Vaults</div></div>
                  <div className="lp-hm-sep" />
                  <div><div className="lp-hm-v">2</div><div className="lp-hm-l">Active Agents</div></div>
                </div>
              </div>
              <div className="lp-hm-panel">
                <div className="lp-hm-label"><span className="lp-hm-dot waitlist" />On waitlist</div>
                <div className="lp-hm-stats">
                  <div><div className="lp-hm-v">$5.2M</div><div className="lp-hm-l">Target AUM</div></div>
                  <div className="lp-hm-sep" />
                  <div><div className="lp-hm-v">102</div><div className="lp-hm-l">Wallets Whitelisted</div></div>
                </div>
                <div className="lp-hm-tge">⚡ $YLDR TGE · Virtuals · July 2026</div>
              </div>
            </div>
          </section>
        </div>

        <div className="lp-divider" />

        {/* ── Problem ── */}
        <div className="lp-wrap">
          <section className="lp-section lp-reveal">
            <div className="lp-sec-head">
              <div className="lp-sec-tag">The Problem</div>
              <div className="lp-sec-title">Great traders should run onchain funds.<br /><span className="ac">Most never do.</span></div>
              <p className="lp-sec-sub">
                Your wallet is public. Your PnL is onchain. Your edge is more verifiable than
                anything in traditional finance. But you&apos;re still only trading your own capital.
              </p>
            </div>
            <div className="lp-pd">
              <div className="lp-pd-col">
                <div className="lp-pd-header without">Without Yieldr</div>
                <ul className="lp-pd-items">
                  <li><span className="lp-pd-x">×</span>Nobody outside your circle knows your track record exists</li>
                  <li><span className="lp-pd-x">×</span>Depositors have no way to find you or trust your edge</li>
                  <li><span className="lp-pd-x">×</span>You have no way to match with the right capital</li>
                  <li><span className="lp-pd-x">×</span>Every depositor question pulls you out of your positions</li>
                  <li><span className="lp-pd-x">×</span>Drawdowns create noise you have to manage manually</li>
                  <li><span className="lp-pd-x">×</span>You scale by risking more of your own money, not theirs</li>
                </ul>
              </div>
              <div className="lp-pd-wall">
                <div className="lp-pd-wall-label">The wall</div>
                <div className="lp-pd-wall-item">No discovery layer</div>
                <div className="lp-pd-wall-item">No depositor matching</div>
                <div className="lp-pd-wall-item">No comms when markets move</div>
                <div className="lp-pd-wall-item">No way to scale edge without scaling personal risk</div>
                <div className="lp-pd-wall-arrow">↓</div>
                <div className="lp-pd-badge">Yieldr removes the wall</div>
              </div>
              <div className="lp-pd-col">
                <div className="lp-pd-header with">With Yieldr</div>
                <ul className="lp-pd-items">
                  <li><span className="lp-pd-check">→</span><span className="lp-pd-with">Quant Agent identifies your edge from your wallet history</span></li>
                  <li><span className="lp-pd-check">→</span><span className="lp-pd-with">Matching Agent surfaces your vault to the right depositors</span></li>
                  <li><span className="lp-pd-check">→</span><span className="lp-pd-with">Comms Agent handles depositor queries through volatile periods</span></li>
                  <li><span className="lp-pd-check">→</span><span className="lp-pd-with">Monitoring Agent tracks edge decay before it shows in PnL</span></li>
                  <li><span className="lp-pd-check">→</span><span className="lp-pd-with" style={{ color: 'var(--g)', fontWeight: 600 }}>You keep trading. Agents handle the rest.</span></li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* ── Vault Showcase ── */}
        <div className="lp-wrap">
          <section className="lp-section lp-reveal" id="vaults">
            <div className="lp-sec-head">
              <div className="lp-sec-tag">Agent Vaults</div>
              <div className="lp-sec-title"><span className="ac">Any edge. Any venue.</span> One agent vault.</div>
              <p className="lp-sec-sub">
                Predictions, perps, LP strategies, project coins, RWAs — any verifiable onchain edge
                can power a vault. Here&apos;s what&apos;s live and what&apos;s launching.
              </p>
              <div className="lp-proto-row">
                <span className="lp-proto-label">On</span>
                <span className="lp-proto-pill live">🔮 Polymarket</span>
                <span className="lp-proto-pill live">📈 Hyperliquid</span>
                <span className="lp-proto-pill">⚡ Avantis</span>
                <span className="lp-proto-pill">💧 Aerodrome</span>
                <span className="lp-proto-pill">🦄 Uniswap</span>
                <span className="lp-proto-pill">🤖 Virtuals</span>
                <span className="lp-proto-pill">🏦 Bankr</span>
              </div>
            </div>

            <div className="lp-vs-grid">
              {LIVE_VAULTS.map((v) => (
                <Link href={v.href} className="lp-vs-card" key={v.name}>
                  <div className="lp-vs-badge live"><span className="lp-vs-dot live" />Live</div>
                  <div className="lp-vs-proto">{v.proto}</div>
                  <div className="lp-vs-name">{v.name}</div>
                  <p className="lp-vs-desc">{v.desc}</p>
                  <div className="lp-vs-stats">
                    {v.stats.map((s) => (
                      <div className="lp-vs-stat" key={s.l}><div className="lp-vs-sv">{s.v}</div><div className="lp-vs-sl">{s.l}</div></div>
                    ))}
                  </div>
                  <div className="lp-vs-explore">View vault →</div>
                </Link>
              ))}
              {WAITLIST_VAULTS.map((v) => (
                <Link href="/explorer" className="lp-vs-card waitlist" key={v.name}>
                  <div className="lp-vs-badge waitlist"><span className="lp-vs-dot waitlist" />Waitlist</div>
                  <div className="lp-vs-proto">{v.proto}</div>
                  <div className="lp-vs-name">{v.name}</div>
                  <p className="lp-vs-desc">{v.desc}</p>
                  <div className="lp-vs-stats">
                    {v.stats.map((s) => (
                      <div className="lp-vs-stat" key={s.l}><div className="lp-vs-sv">{s.v}</div><div className="lp-vs-sl">{s.l}</div></div>
                    ))}
                  </div>
                  <div className="lp-vs-explore">Whitelist wallet →</div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Link href="/explorer" className="lp-btn-s">Explore all agent vaults ↗</Link>
            </div>
            <p className="lp-vs-fine">
              Past performance ≠ future results · Live performance reflects Yieldr project capital
              only · Not available to residents of restricted jurisdictions
            </p>
          </section>
        </div>

        {/* ── Credentials ── */}
        <div className="lp-wrap">
          <section className="lp-section lp-reveal">
            <div className="lp-sec-head" style={{ textAlign: 'center' }}>
              <div className="lp-sec-tag">Track Record</div>
              <div className="lp-sec-title" style={{ margin: '0 auto' }}>Built different. <span className="ac">Proven onchain.</span></div>
            </div>
            <div className="lp-cred-grid">
              <div className="lp-cred-card">
                <div className="lp-cred-icon">🏆</div>
                <div className="lp-cred-h">Base Batches 002 Winner</div>
                <p className="lp-cred-p">Selected from 900+ projects for building DeFi infrastructure on Base. Part of Incubase accelerator.</p>
              </div>
              <Link href="/build-in-public" className="lp-cred-card">
                <div className="lp-cred-icon">📊</div>
                <div className="lp-cred-h">Building in Public</div>
                <p className="lp-cred-p">Weekly build logs, real treasury data, live trading performance. No sanitisation, no narrative management.</p>
              </Link>
              <div className="lp-cred-card">
                <div className="lp-cred-icon">🔨</div>
                <div className="lp-cred-h">275+ Commits Shipped</div>
                <p className="lp-cred-p">60K+ lines of code since October 2025. Active daily development across the agent stack and vault infrastructure.</p>
              </div>
              <div className="lp-cred-card">
                <div className="lp-cred-icon">🛡️</div>
                <div className="lp-cred-h">Public Treasury</div>
                <p className="lp-cred-p">All project capital in multisig. Monthly reporting. Full transparency on capital deployment and vault performance.</p>
              </div>
            </div>
          </section>
        </div>

        {/* ── Final CTA / Token ── */}
        <div className="lp-wrap">
          <section className="lp-section lp-reveal" id="token">
            <div className="lp-fcta-box">
              <div className="lp-fcta-tag">⚡ $YLDR TGE · Virtuals · July 2026</div>
              <div className="lp-fcta-h">Own the protocol from day one.<br /><span className="ac">Earn while you wait.</span></div>
              <p className="lp-fcta-sub">
                Whitelist your wallet on any agent vault and earn between{' '}
                <strong>10K–100K $YLDR</strong>, claimable at beta launch Q1 &apos;27.
              </p>
              <p className="lp-fcta-fine">
                <em>We love degen farmers — but our agents don&apos;t.</em> A minimum $100 USDC
                deposit per wallet into an agent vault for 30 days is required to claim. Think of
                it as a product trial, not a farm.
              </p>
              <Link href="/explorer" className="lp-btn-p">Explore Agent Vaults ↗</Link>
            </div>
          </section>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="lp-footer">
        <div className="lp-f-soc">
          <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
          </a>
          <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z" /></svg>
          </a>
        </div>
        <div className="lp-f-txt">Yieldr © 2026 · Agent OS for onchain funds · <a href="https://yieldr.org">yieldr.org</a></div>
        <div className="lp-f-txt lp-f-links" style={{ marginTop: 6 }}>
          <Link href="/#token">Token</Link> · <Link href="/docs">Docs</Link> · <Link href="/build-in-public">Build Log</Link>
        </div>
        <div className="lp-f-disclaimer">
          Nothing on this site constitutes an offer to sell or solicitation to buy any security or
          financial instrument, or financial advice of any kind. Performance data reflects Yieldr
          project capital, not external depositor capital. Past performance is not indicative of
          future results. Not available to residents of the United States, United Kingdom, Canada,
          China, or jurisdictions where offering crypto financial services is restricted.
        </div>
      </footer>
    </div>
  );
}
