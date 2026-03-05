'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import s from './landing.module.css';

const DEMO_MESSAGES = [
  { t: 'l', x: 'Wallet connected — scanning positions across Avantis, Hyperliquid, Polymarket...' },
  { t: 'l', x: 'Found 1 BTC/USDC SHORT on Avantis · 2 positions on Polymarket' },
  { t: 'a', x: '<strong>Portfolio scanned.</strong> BTC short up <span class="gr">+$20K (+200%)</span>. Polymarket: Fed rate cut YES at 68¢ ($5K), ETH ETF approval NO at 72¢ ($3K). $50K USDC idle.' },
  { t: 'u', x: 'Should I take profits on my BTC short?' },
  { t: 'l', x: 'Scanning top perp trader positioning on Hyperliquid & Avantis...' },
  { t: 'a', x: '<strong>Take partial profits.</strong> 67% of top traders closing shorts. Close 50% to lock <span class="gr">$10K</span>, trail stop at $95K on rest.' },
  { t: 'u', x: 'My Fed rate cut position — whales are selling. Should I hold?' },
  { t: 'l', x: 'Analyzing Polymarket whale activity on Fed markets...' },
  { t: 'a', x: '<strong>Careful.</strong> 3 whale wallets sold $400K YES in last 4hrs. Odds dropped 76% → 72%. Your entry at 68¢ still has margin — set exit at 60¢ to protect downside.' },
  { t: 'u', x: 'Find alpha in Aerodrome LPs right now.' },
  { t: 'l', x: 'Scanning concentrated liquidity pools on Aerodrome...' },
  { t: 'a', x: '<strong>Top pick:</strong> cbBTC/USDC pool at <span class="gr">184% APR</span>. TVL $12M, fees +$5.7K/week. Hedge IL with BTC short 0.65 BTC @ 5x for net <span class="gr">~142% APR</span>.' },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const demoContainerRef = useRef<HTMLDivElement>(null);
  const demoStartedRef = useRef(false);
  const demoIndexRef = useRef(0);

  // Fade-in observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add(s.visible);
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(`.${s.fadeIn}`).forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Demo messages animation
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !demoStartedRef.current) {
            demoStartedRef.current = true;
            setTimeout(addNextMessage, 500);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    if (demoContainerRef.current) obs.observe(demoContainerRef.current);
    return () => obs.disconnect();
  }, []);

  function addNextMessage() {
    const container = document.getElementById('demoMessages');
    if (!container) return;
    const i = demoIndexRef.current;
    if (i >= DEMO_MESSAGES.length) return;

    const m = DEMO_MESSAGES[i];
    demoIndexRef.current++;

    const el = document.createElement('div');
    el.className = s.msgIn;

    if (m.t === 'l') {
      el.className = `${s.msgIn} ${s.msgLog}`;
      el.innerHTML = `<span class="${s.ck}">⚡</span> ${m.x}`;
    } else if (m.t === 'u') {
      el.className = `${s.msgIn} ${s.msgUser}`;
      el.innerHTML = m.x;
    } else {
      el.className = s.msgIn;
      el.innerHTML = `<div class="${s.msgAgent}"><div class="${s.msgAvatar}">🤖</div><div class="${s.msgBody}">${m.x}</div></div>`;
    }

    container.appendChild(el);
    container.scrollTop = container.scrollHeight;

    const delay = m.t === 'l' ? 800 : m.t === 'u' ? 2000 : 2500;
    setTimeout(addNextMessage, delay);
  }

  return (
    <div className={s.page}>
      <div className={s.gridbg} />

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className={s.nav}>
        <Link href="/" className={s.navLeft}>
          <svg className={s.navLogo} viewBox="0 0 100 120">
            <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
            <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3"/>
            <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9"/>
          </svg>
          <span className={s.navBrand}>YIELDR</span>
        </Link>

        {/* Desktop nav */}
        <div className={s.navLinks}>
          <Link href="/" className={s.navLink}>Home</Link>
          <Link href="/docs" className={s.navLink}>Docs</Link>
          <Link href="/team" className={s.navLink}>Team</Link>
          <Link href="/build-in-public" className={s.navLink}>Build Progress</Link>
          <div className={s.navSoc}>
            <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://discord.com/channels/1426305214176165941/1426305389812646091" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419s.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419s.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
            <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
          <a href="https://app.yieldr.org/demo" className={s.navCta}>Launch Your Quant</a>
        </div>

        {/* Hamburger */}
        <button className={s.hamburger} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`${s.mobileMenuOverlay} ${s.open}`} onClick={() => setMobileMenuOpen(false)}>
          <div className={s.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <Link href="/" className={s.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/docs" className={s.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Docs</Link>
            <Link href="/team" className={s.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Team</Link>
            <Link href="/build-in-public" className={s.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Build Progress</Link>
            <div className={s.mobileNavSoc}>
              <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://discord.com/channels/1426305214176165941/1426305389812646091" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419s.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419s.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
              <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
            <a href="https://app.yieldr.org/demo" className={s.mobileNavCta} onClick={() => setMobileMenuOpen(false)}>
              Launch Your Quant
            </a>
          </div>
        </div>
      )}

      {/* ── Ticker ───────────────────────────────────────── */}
      <div className={s.ticker}>
        <div className={s.tickerTrack}>
          {[...Array(2)].map((_, ri) => (
            <span key={ri}>
              <span className={s.tickerItem}>BTC <span className={s.dn}>$86,412 ▼1.8%</span></span><span className={s.tickerSep}>|</span>
              <span className={s.tickerItem}>ETH <span className={s.up}>$3,418 ▲0.6%</span></span><span className={s.tickerSep}>|</span>
              <span className={s.tickerItem}>HL Funding <span className={s.dn}>-0.012%</span></span><span className={s.tickerSep}>|</span>
              <span className={s.tickerItem}>Top trader 0xA3..4f <span className={s.up}>closed BTC short 12m ago</span></span><span className={s.tickerSep}>|</span>
              <span className={s.tickerItem}>ETH OI <span className={s.up}>$4.2B ▲3.1%</span></span><span className={s.tickerSep}>|</span>
              <span className={s.tickerItem}>Polymarket: Fed rate cut <span className={s.up}>72% YES</span></span><span className={s.tickerSep}>|</span>
              <span className={s.tickerItem}>AERO TVL <span className={s.up}>$1.8B ▲2.4%</span></span><span className={s.tickerSep}>|</span>
              <span className={s.tickerItem}>Liquidations 24h <span className={s.dn}>$142M</span></span><span className={s.tickerSep}>|</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────── */}
      <main className={s.main}>

        {/* Hero */}
        <section className={s.hero}>
          <p className={s.heroCtx}>The hedge fund desk, now onchain.</p>
          <h1 className={s.heroH1}>Every Trader Gets a <span className={s.ac}>Quant</span></h1>
          <p className={s.heroSub}>AI agents that find alpha, watch your positions, and pre-empt moves — onchain, for everyone.</p>
          <div className={s.heroCtas}>
            <a href="https://app.yieldr.org/demo" className={s.btnPrimary}>Launch Your Quant — Free ↗</a>
            <a href="#dashboard" className={s.btnSecondary}>See how it works ↓</a>
          </div>
          <div className={s.heroStats}>
            <div className={s.statItem}><div className={s.statValue}>30K+</div><div className={s.statLabel}>Traders Indexed</div></div>
            <div className={s.statItem}><div className={s.statValue}>2K+</div><div className={s.statLabel}>Markets Monitored</div></div>
            <div className={s.statItem}><div className={s.statValue}>100+</div><div className={s.statLabel}>Signals</div></div>
            <div className={s.statItem}><div className={s.statValue}>3</div><div className={s.statLabel}>Protocols</div></div>
          </div>
        </section>

        {/* Gap Section */}
        <section className={`${s.gapSection} ${s.fadeIn}`}>
          <div className={s.sectionLabel}>Same markets. Different firepower.</div>
          <div className={s.gapGrid}>
            <div className={`${s.gapCard} ${s.ws}`}>
              <div className={s.gapCardHead}>Wall Street Hedge Fund</div>
              <div className={s.gapItems}>
                <div className={s.gapItem}><span className={s.ic}>✓</span> Analyst team scanning 24/7</div>
                <div className={s.gapItem}><span className={s.ic}>✓</span> Quant backtesting &amp; signals</div>
                <div className={s.gapItem}><span className={s.ic}>✓</span> Real-time risk management</div>
                <div className={s.gapItem}><span className={s.ic}>✓</span> Execution desk</div>
              </div>
              <div className={s.gapFootnote}>$5M+ AUM minimum</div>
            </div>
            <div className={s.gapDivider}>→</div>
            <div className={`${s.gapCard} ${s.yl}`}>
              <div className={s.gapCardHead}>With Yieldr</div>
              <div className={s.gapItems}>
                <div className={s.gapItem}><span className={s.ic}>✓</span> AI quant finds alpha across protocols</div>
                <div className={s.gapItem}><span className={s.ic}>✓</span> Monitors signals &amp; positions 24/7</div>
                <div className={s.gapItem}><span className={s.ic}>✓</span> Pre-empts moves with alerts</div>
                <div className={s.gapItem}><span className={s.ic}>✓</span> Execution agents (coming soon)</div>
              </div>
              <div className={s.gapFootnote}>Open to everyone. Starting free.</div>
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        <section className={`${s.dashSection} ${s.fadeIn}`} id="dashboard">
          <div className={s.sectionHead}>
            <div className={s.sectionTag}>Your Quant, Live</div>
            <div className={s.sectionTitle}>See what the agent surfaces</div>
            <div className={s.sectionSub}>Real-time alpha signals and top trader positioning across DeFi</div>
          </div>
          <div className={s.dashBox}>
            <div className={s.dashBar}>
              <div className={s.dashBarLeft}>
                <div className={s.dashDot} />
                <span>Yieldr Agent — Monitoring 3 protocols</span>
              </div>
              <div className={s.dashBarRight}>Last updated: 2m ago</div>
            </div>
            <div className={s.dashGrid}>
              <div className={s.dashPanel}>
                <div className={s.panelHead}>Alpha Signals</div>
                <div className={s.signal}>
                  <div className={`${s.sigDot} ${s.g}`} />
                  <div className={s.sigText}><strong>ETH funding flipped negative</strong> — 3 of top 10 traders opened longs. Historically bullish.</div>
                </div>
                <div className={s.signal}>
                  <div className={`${s.sigDot} ${s.y}`} />
                  <div className={s.sigText}><strong>Polymarket whale divergence</strong> — Fed rate cut at 72% but 3 insider wallets selling YES. Odds likely to drop.</div>
                </div>
                <div className={s.signal}>
                  <div className={`${s.sigDot} ${s.r}`} />
                  <div className={s.sigText}><strong>Liquidation cluster at $85.2K</strong> — $38M in longs stacked. Cascading risk elevated.</div>
                </div>
                <div className={s.alertRow}>
                  <span>📣</span> Polymarket odds shift alert → sent to 247 agents via Telegram
                </div>
              </div>
              <div className={s.dashPanel}>
                <div className={s.panelHead}>Top Traders</div>
                <div className={s.traderRow}>
                  <div className={s.traderInfo}>
                    <span className={s.traderAddr}>0xA3..4f</span>
                    <span className={s.traderMeta}>73% WR · Sharpe 2.4 · Perps · closing BTC shorts</span>
                  </div>
                  <span className={s.traderPnl}>+$342K</span>
                </div>
                <div className={s.traderRow}>
                  <div className={s.traderInfo}>
                    <span className={s.traderAddr}>0x7B..2e</span>
                    <span className={s.traderMeta}>68% WR · Sharpe 1.9 · Perps · scaling into ETH</span>
                  </div>
                  <span className={s.traderPnl}>+$218K</span>
                </div>
                <div className={s.traderRow}>
                  <div className={s.traderInfo}>
                    <span className={s.traderAddr}>poly_insider</span>
                    <span className={s.traderMeta}>Brier 0.12 · 81% WR · Predictions · event timing edge</span>
                  </div>
                  <span className={s.traderPnl}>+$89K</span>
                </div>
                <div className={s.traderRow}>
                  <div className={s.traderInfo}>
                    <span className={s.traderAddr}>pm_quant</span>
                    <span className={s.traderMeta}>Brier 0.18 · 74% WR · Predictions · crypto &amp; politics</span>
                  </div>
                  <span className={s.traderPnl}>+$156K</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Agent Terminal */}
        <section className={`${s.termSection} ${s.fadeIn}`} ref={demoContainerRef}>
          <div className={s.sectionHead}>
            <div className={s.sectionTag}>Agent Terminal</div>
            <div className={s.sectionTitle}>Ask anything about your positions</div>
          </div>
          <div className={s.termBox}>
            <div className={s.termBar}>
              <div className={`${s.termDot} ${s.r}`} />
              <div className={`${s.termDot} ${s.y}`} />
              <div className={`${s.termDot} ${s.g}`} />
              <span className={s.termTitle}>yieldr-agent — 0x7a3f...9c2e</span>
            </div>
            <div className={s.termBody}>
              <div className={s.termMessages} id="demoMessages" />
              <div className={s.termCover}>
                <a href="https://app.yieldr.org/demo" className={s.btnPrimary}>Launch Your Quant — Free</a>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className={`${s.visionSection} ${s.fadeIn}`}>
          <div className={s.sectionHead}>
            <div className={s.sectionTag}>The Vision</div>
            <div className={s.sectionTitle}>From Quant to Hedge Fund</div>
          </div>
          <p className={s.visionQuote}>
            &ldquo;Satoshi gave everyone money without banks. We&apos;re giving every trader a hedge fund without Wall Street.&rdquo;
          </p>
          <div className={s.progressLane}>
            <div className={`${s.progressStep} ${s.active}`}>
              <div className={s.stepStatus}>● Live Now</div>
              <div className={s.stepName}>Quant</div>
              <div className={s.stepDesc}>Your AI quant. Discovers alpha, monitors positions, pre-empts moves 24/7.</div>
              <span className={s.stepArrow}>→</span>
            </div>
            <div className={s.progressStep}>
              <div className={s.stepStatus}>○ Next</div>
              <div className={s.stepName}>Trader</div>
              <div className={s.stepDesc}>Executes at optimal price. Hedges automatically. MEV protected.</div>
              <span className={s.stepArrow}>→</span>
            </div>
            <div className={s.progressStep}>
              <div className={s.stepStatus}>○ V2</div>
              <div className={s.stepName}>PM</div>
              <div className={s.stepDesc}>Manages risk across your portfolio. Stops losses before they compound.</div>
              <span className={s.stepArrow}>→</span>
            </div>
            <div className={s.progressStep}>
              <div className={s.stepStatus}>○ Vision</div>
              <div className={s.stepName}>Onchain Vault</div>
              <div className={s.stepDesc}>Anyone can invest. AI manages. Smart contracts enforce. 2/20 fees onchain.</div>
            </div>
          </div>
          <div className={s.progressFooter}>
            <strong>Every good trader becomes a fund manager.</strong> Every investor gets institutional intelligence.
          </div>
        </section>

        {/* Proof Section */}
        <section className={`${s.proofSection} ${s.fadeIn}`}>
          <div className={s.proofGrid}>
            <Link href="/build-in-public" className={s.proofCard}>
              <div className={s.proofIcon}>🏆</div>
              <div className={s.proofTitle}>Base Batches 002 Winner</div>
              <div className={s.proofDesc}>Selected from 900+ projects for building DeFi infrastructure on Base.</div>
            </Link>
            <Link href="/build-in-public" className={s.proofCard}>
              <div className={s.proofIcon}>📊</div>
              <div className={s.proofTitle}>Building in Public</div>
              <div className={s.proofDesc}>Weekly updates on code shipped, milestones hit, and treasury usage.</div>
            </Link>
            <Link href="/team" className={s.proofCard}>
              <div className={s.proofIcon}>🔐</div>
              <div className={s.proofTitle}>Treasury Public</div>
              <div className={s.proofDesc}>All funds in multisig. Usage reported monthly. Full transparency.</div>
            </Link>
          </div>
          <div className={s.founderBadge}>
            <div className={s.founderBadgeText}>
              Founder put $5K on Avantis using Yieldr as copilot. It&apos;s <strong>$20K</strong> now.
            </div>
            <div className={s.founderBadgeSub}>Verifiable onchain: defirobbin.base.eth</div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={`${s.ctaSection} ${s.fadeIn}`}>
          <div className={s.ctaTitle}>Wall Street has quants. Now you do too.</div>
          <div className={s.ctaSub}><strong>500K free AI credits.</strong> No signup. No catch.</div>
          <a href="https://app.yieldr.org/demo" className={s.btnPrimary}>Launch Your Quant ↗</a>
        </section>

        {/* Partners */}
        <div className={s.partners}>
          <div className={s.partnersLabel}>Integrated Protocols</div>
          <div className={s.partnerLogos}>
            <img src="https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760730551690x161831425309488800/_base-square%20%282%29.svg" alt="Base" />
            <img src="https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760735602576x626366481309788300/Avantis%20White%20Logo%20-%20Vertical.png" alt="Avantis" />
            <img src="https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760731058931x165828739392198200/aero.png" alt="Aerodrome" />
            <img src="https://nftevening.com/wp-content/uploads/2025/03/hyperliquid-logo.png" alt="Hyperliquid" />
            <img src="https://avatars.githubusercontent.com/u/31669764?s=280&v=4" alt="Polymarket" />
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className={s.footer}>
        <div className={s.footerSoc}>
          <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
        <div className={s.footerText}>Built different. <a href="https://yieldr.org">yieldr.org</a></div>
      </footer>
    </div>
  );
}
