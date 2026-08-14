'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { QuantWaitlistModal } from './components/QuantWaitlistModal';
import './landing.css';

const MARQUEE_ITEMS = [
  { text: 'HOOD CHAIN', hl: 'NOW LIVE' },
  { text: '🏆 BASE BATCHES 002', hl: 'WINNER' },
  { text: '🚀 CIRCUIT ACCELERATOR', hl: 'SINGAPORE' },
  { text: '⚡ QUANT AGENT', hl: 'AUG 30' },
];

// Quant Agent goes live 30-Aug-2026, 9:00 PM SGT (UTC+8) = 13:00 UTC
const QUANT_LAUNCH_AT = new Date('2026-08-30T13:00:00Z');
const DEFAULT_WAITLIST_COUNT = 542;
const WAITLIST_AUM = 2_100_000;

const PROBLEM_ITEMS = [
  "You can't tell if your wins are edge, luck, or beta",
  'Nobody outside your circle knows your track record exists',
  'Depositors have no way to find you or trust your edge',
  'You scale by risking more of your own money, not theirs',
];

const SOLUTION_ITEMS = [
  'Quant Agent analyzes your wallet and tells you where your edge is real — and where it isn’t',
  <>Allocation Agent surfaces your vault to the right depositors <span style={{ color: 'var(--ink-3)' }}>(Phase 4)</span></>,
  <>Comms &amp; Monitoring Agents handle depositor queries and track edge decay <span style={{ color: 'var(--ink-3)' }}>(later)</span></>,
  'You keep trading. Agents handle the rest.',
];

const VAULT_TEASERS = [
  {
    chain: 'base' as const,
    chainLabel: 'BASE',
    category: '🤖 Virtuals · Base · Robotics Infra',
    title: '🦾 Virtuals Robotics Infra Vault',
    desc: 'Agent researches new Virtuals launches on Base, monitors project milestones, detects degen-sell signals from top wallets, and accumulates high-conviction robotics and AI infrastructure tokens for long-term value growth.',
    aum: '$40.0K',
    fee: '≤20%',
    waitlisted: '20',
  },
  {
    chain: 'hood' as const,
    chainLabel: 'HOOD CHAIN',
    category: '🏦 HOOD Chain · Robinhood Chain · RWA',
    title: '🚀 SpaceX RWA Vault',
    desc: 'Accumulates SPCX tokenized equity natively on Robinhood Chain, following wallets with the highest post-IPO RWA spot edge.',
    aum: '$438.8K',
    fee: '≤25%',
    waitlisted: '39',
  },
];

const CREDIBILITY = [
  {
    icon: '🏆',
    name: 'Base Batches 002 — Builder Track Winner',
    desc: 'Selected from 900+ projects for building DeFi infra on Base. Part of Incubase.',
    href: 'https://x.com/buildonbase/status/2023855121189220609',
  },
  {
    icon: '🚀',
    name: 'Circuit Accelerator 🇸🇬',
    desc: 'Selected for the Circuit accelerator in Singapore — backed by Base × Newcampus HQ.',
    href: 'https://www.circuit-accelerator.com/',
  },
  {
    icon: '📊',
    name: 'Building in Public',
    desc: 'Weekly build logs, real treasury data, live trading performance.',
    href: '/build-in-public',
  },
];

const MARKETS = [
  { name: 'FOMO', status: 'building' as const, statusLabel: 'Building', img: '/images/fomo.png' },
  { name: 'pump.fun', status: 'building' as const, statusLabel: 'Building', img: '/images/pump.png' },
  { name: 'Polymarket', status: 'soon' as const, statusLabel: 'Upcoming', img: '/images/poly.png' },
  { name: 'Uniswap', status: 'soon' as const, statusLabel: 'Upcoming', img: '/images/uni.png' },
  { name: 'Aerodrome', status: 'soon' as const, statusLabel: 'Upcoming', img: '/images/aero.png' },
];

const CHAINS = [
  {
    cls: 'base' as const,
    name: 'Base',
    badge: 'live' as const,
    desc: 'Full support today — meme & alt coin history, OG wallet tracking, and the Quant Terminal all run natively on Base.',
    img: '/images/base.png',
  },
  {
    cls: 'rh' as const,
    name: 'Robinhood Chain',
    badge: 'live' as const,
    desc: 'Wallet scans and signal tracking extend to Robinhood Chain — including tokenized-equity activity as that market grows.',
    img: '/images/hood.png',
  },
  {
    cls: '' as const,
    name: 'Solana',
    badge: 'soon' as const,
    desc: 'Wallet scans on Solana are coming next — home to some of the fastest-moving meme markets onchain.',
    img: '/images/sol.png',
  },
];

const SPARK_HEIGHTS = [
  62,38,45,50,58,72,30,48,66,55,40,35,60,68,44,52,74,28,42,56,64,48,36,58,70,46,32,54,62,40,50,66,44,58,72,34,48,60,52,38,64,56,42,68,50,46,
];
const SPARK_LOSS_IDX = new Set([1,6,10,15,19,23,27,30,34,38,42,45]);

function fmtAumM(n: number): string {
  return `$${(n / 1_000_000).toFixed(1)}M`;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'LIVE NOW';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

function useCountdown(target: Date) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setRemaining(target.getTime() - Date.now());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);
  return remaining;
}

function XIcon() {
  return <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

function GitHubIcon() {
  return <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z" /></svg>;
}

function AnimatedCount({ target, prefix = '', format, className = 'hp-tick-val hp-num' }: { target: number; prefix?: string; format?: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dur = 1600;
    let raf = 0;
    const t0 = performance.now();
    function step(t: number) {
      const p = Math.min(1, (t - t0) / dur);
      const val = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      if (el) el.textContent = format ? format(val) : prefix + val.toLocaleString('en-US');
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, prefix, format]);
  return <div className={className} ref={ref}>{format ? format(0) : prefix + '0'}</div>;
}


export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(DEFAULT_WAITLIST_COUNT);
  const launchRemaining = useCountdown(QUANT_LAUNCH_AT);

  useEffect(() => {
    fetch('/api/quant-waitlist')
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && typeof d.count === 'number') setWaitlistCount(d.count);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="hp-root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <div className="hp-nav">
        <div className="hp-wrap hp-nav-in">
          <div className="hp-nav-id">
            <div className="hp-nav-mark">
              <img src="/nav-mark.png" alt="Yieldr" />
            </div>
            <div className="hp-nav-name">YIELDR</div>
          </div>
          <div className="hp-nav-right">
            <div className={`hp-nav-links${mobileNavOpen ? ' hp-open' : ''}`}>
              <a href="#roadmap">Roadmap</a>
              <Link href="/explorer">Vaults</Link>
              <Link href="/build-in-public">Build Log</Link>
              <Link href="/docs">Docs</Link>
            </div>
            <div className="hp-nav-soc">
              <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"><XIcon /></a>
              <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon /></a>
            </div>
            <Link href="/prelaunch-edge" className="hp-nav-cta">Find Your Edge</Link>
            <button
              className="hp-nav-burger"
              onClick={() => setMobileNavOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileNavOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      <div className="hp-marquee-wrap">
        <div className="hp-marquee">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} style={{ display: 'contents' }}>
              <span className="hp-marquee-item">
                {item.text} <b>{item.hl}</b>
              </span>
              <span className="hp-marquee-sep">·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="hp-hero">
        <div className="hp-wrap">
          <span className="hp-eyebrow"><span className="hp-dot" />Quant Agent launches Aug 30 · Genesis window open</span>
          <h1>Agent stack for <em>onchain funds</em>.</h1>
          <p className="hp-hero-sub">
            Discover your edge. Convert it into a fund. The Quant Agent grades your onchain entries, exits, and
            sizing — join the waitlist to be first in when it goes live. Later phases turn it into a fund you
            don&apos;t have to run yourself.
          </p>
          <div className="hp-hero-ctas">
            <Link href="/prelaunch-edge" className="hp-btn-p">Find Your Edge →</Link>
            <button
              className="hp-btn-tertiary"
              onClick={() => document.getElementById('vaults')?.scrollIntoView({ behavior: 'smooth' })}
            >
              or see what&apos;s next: agent vaults ↗
            </button>
          </div>
          <div className="hp-hero-note">Read-only wallet scan · nothing custodied, nothing traded on your behalf</div>
        </div>
      </div>

      <div className="hp-ticker">
        <div className="hp-wrap hp-ticker-in hp-ticker-in-3">
          <div className="hp-tick-card">
            <div className="hp-tick-lbl"><span className="hp-ld" />Quants on Waitlist</div>
            <AnimatedCount target={waitlistCount} className="hp-tick-val hp-num hp-win" />
            <div className="hp-tick-src">reserved for Quant Agent launch</div>
          </div>
          <div className="hp-tick-card">
            <div className="hp-tick-lbl"><span className="hp-ld" />AUM on Waitlist</div>
            <AnimatedCount target={WAITLIST_AUM} format={fmtAumM} className="hp-tick-val hp-num hp-win" />
            <div className="hp-tick-src">committed across waitlisted vaults</div>
          </div>
          <div className="hp-tick-card hp-tick-card-cd">
            <div className="hp-tick-lbl">Quant Agent Launches In</div>
            <div className="hp-tick-val hp-num hp-countdown">
              {launchRemaining === null ? '—' : formatCountdown(launchRemaining)}
            </div>
            <div className="hp-tick-src">30 Aug 2026 · 9:00 PM SGT</div>
          </div>
        </div>
      </div>

      <div className="hp-sec" id="roadmap">
        <div className="hp-wrap">
          <div className="hp-slbl"><span>Where We Are</span><span className="hp-ln" /></div>
          <h2 className="hp-sec-h">One agent stack, shipping in phases.</h2>
          <p className="hp-sec-p">
            Quant Agent launches Aug 30 — join the waitlist to be first in when Genesis access opens.
            Everything after it is real, in progress, and dated honestly.
          </p>

          <div className="hp-rm-product-grid">
            <div className="hp-rm-product-card">
              <div className="hp-rm-product-inner">
                <div>
                  <div className="hp-rm-num">01 · Q3 2026</div>
                  <div className="hp-rm-status hp-proof">Launching Aug 30</div>
                  <div className="hp-rm-name">Quant Agent</div>
                  <div className="hp-rm-desc">Reads your wallet, grades Entry/Exit/Sizing, tells you if your edge is real.</div>
                </div>
                <div className="hp-rm-visual">
                  <div className="hp-hb-row">
                    <div className="hp-hero-figure">
                      <span className="hp-hero-num" style={{ fontSize: 40 }}>76</span>
                      <span className="hp-hero-max" style={{ fontSize: 14 }}>/ 100</span>
                      <span className="hp-hero-badge" style={{ fontSize: 9.5 }}>Strong Edge</span>
                    </div>
                    <div className="hp-hero-side"><span className="hp-hero-delta" style={{ fontSize: 10 }}>▲ +15 vs 6wk ago</span></div>
                  </div>
                  <div className="hp-hero-cohort">Better edge than <b>8 in 10</b> meme &amp; alt traders we track.</div>
                  <div className="hp-hero-verdict" style={{ fontSize: 14 }}>
                    You&apos;ve got a <span className="hp-hl">real, repeatable edge</span> — carried by elite exits, held back by occasional sniping.
                  </div>
                  <div className="hp-hero-weights">
                    <div className="hp-hw-item"><span className="hp-hw-dot" style={{ background: 'var(--win)' }} />Exit — 40%</div>
                    <div className="hp-hw-item"><span className="hp-hw-dot" style={{ background: 'var(--warn)' }} />Sizing — 35%</div>
                    <div className="hp-hw-item"><span className="hp-hw-dot" style={{ background: 'var(--agent)' }} />Entry — 25%</div>
                  </div>
                  <div className="hp-spark-row">
                    {SPARK_HEIGHTS.map((h, i) => (
                      <div
                        key={i}
                        className="hp-spark-bar"
                        style={{ height: `${h}%`, background: SPARK_LOSS_IDX.has(i) ? 'var(--loss)' : 'var(--win)' }}
                      />
                    ))}
                  </div>
                  <div className="hp-spark-hd"><span>Every trade, last 90 days</span><span>293 of 293 shown</span></div>
                </div>
              </div>
            </div>

            <div className="hp-rm-product-card">
              <div className="hp-rm-product-inner">
                <div>
                  <div className="hp-rm-num">02 · Q1 2027</div>
                  <div className="hp-rm-status hp-next">Building Next</div>
                  <div className="hp-rm-name">Quant Terminal</div>
                  <div className="hp-rm-desc">Demand/supply signals, agent alerts, top-trader edge across FOMO &amp; pump.fun.</div>
                </div>
                <div className="hp-rm-visual">
                  <div className="hp-tok-hd2">
                    <div className="hp-tok-av2"><img src="/images/cashcat.png" alt="CASHCAT" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'inherit'}} /></div>
                    <div>
                      <div className="hp-tok-name2">CASHCAT <span className="hp-tok-leaf">🍃</span></div>
                      <div className="hp-tok-addr2">0x020b...1018b4</div>
                    </div>
                    <div className="hp-tok-stats2">
                      <div className="hp-tok-stat2"><div className="hp-k">MCAP</div><div className="hp-v">$166M</div></div>
                      <div className="hp-tok-stat2"><div className="hp-k">24H</div><div className="hp-v" style={{ color: 'var(--win)' }}>▲25%</div></div>
                      <div className="hp-tok-stat2"><div className="hp-k">LIQUIDITY</div><div className="hp-v">$2.2M</div></div>
                      <div className="hp-tok-stat2"><div className="hp-k">HOLDERS</div><div className="hp-v">52K</div></div>
                    </div>
                  </div>
                  <div className="hp-flow-row2">
                    <div className="hp-flow-cell2">
                      <div className="hp-flow-k">Net OG Flow</div>
                      <div className="hp-gbar-track"><div className="hp-gbar-marker" style={{ left: '68%' }} /></div>
                      <div className="hp-fc-val">+$62.8K net</div>
                      <div className="hp-fc-sub">34 OG buys / 4 sells · 5m</div>
                    </div>
                    <div className="hp-flow-cell2">
                      <div className="hp-flow-k">Buyer Growth</div>
                      <div className="hp-mini-chart">
                        {[55, 40, 22, 70, 88, 58].map((h, i) => (
                          <div key={i} className="hp-b" style={{ height: `${h}%`, background: h < 30 ? 'var(--loss)' : 'var(--win)' }} />
                        ))}
                      </div>
                      <div className="hp-fc-sub">+62 net · 15m</div>
                    </div>
                    <div className="hp-flow-cell2">
                      <div className="hp-flow-k">Pool Liquidity Flow</div>
                      <div className="hp-gbar-track"><div className="hp-gbar-marker" style={{ left: '58%' }} /></div>
                      <div className="hp-fc-sub">+$24.1K net · $38.6K in / $14.5K out</div>
                    </div>
                    <div className="hp-flow-cell2">
                      <div className="hp-flow-k">Net Volume Flow</div>
                      <div className="hp-vbar-track">
                        <div style={{ width: '68%', background: 'var(--win)' }} />
                        <div style={{ width: '32%', background: 'var(--loss)' }} />
                      </div>
                      <div className="hp-fc-sub">+$19.3K net · $52.4K buy / $33.1K sell</div>
                    </div>
                  </div>
                  <div className="hp-sig-label">Active Signals — What&apos;s Happening Right Now</div>
                  <div className="hp-sig-row2">
                    <div className="hp-sig">
                      <div className="hp-sig-top">🔺 OG Influx</div>
                      <div className="hp-sig-num" style={{ color: 'var(--ink-1)' }}>+$61.4K bought · 20 of 52 OGs</div>
                      <div className="hp-sig-txt">38% of tracked OGs added this hour, zero net exits.</div>
                      <div className="hp-sig-prob">86% ± 7% · High confidence</div>
                    </div>
                    <div className="hp-sig">
                      <div className="hp-sig-top">🔺 Demand Ignition</div>
                      <div className="hp-sig-num" style={{ color: 'var(--ink-1)' }}>+62 wallets/15m · 4.2x baseline</div>
                      <div className="hp-sig-txt">New holders, OG buying, and social chatter rising together.</div>
                      <div className="hp-sig-prob">84% ± 6% · High confidence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hp-rm-later-grid">
            <div className="hp-rm-step">
              <div className="hp-rm-num">03 · Q3 2027</div>
              <div className="hp-rm-status hp-proof">Coming</div>
              <div className="hp-rm-name">Agent Vaults</div>
              <div className="hp-rm-desc">Top traders with edge launch agent-operated vaults — currently gathering commitments — to real outside deposits.</div>
            </div>
            <div className="hp-rm-step">
              <div className="hp-rm-num">04 · Q4 2027</div>
              <div className="hp-rm-status hp-later">Coming</div>
              <div className="hp-rm-name">Allocation Agent</div>
              <div className="hp-rm-desc">Matches an investor&apos;s risk/return goals with agent vaults to generate target yields &amp; returns.</div>
            </div>
          </div>

          <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center' }}>
            <Link href="/prelaunch-edge" className="hp-btn-p">Find Your Edge →</Link>
          </div>
        </div>
      </div>

      <div className="hp-sec" style={{ paddingTop: 0 }}>
        <div className="hp-wrap">
          <div className="hp-slbl"><span>The Problem</span><span className="hp-ln" /></div>
          <h2 className="hp-sec-h">Most traders don&apos;t know if they have an edge. The ones who do have no way to turn it into a fund.</h2>
          <p className="hp-sec-p">
            Your wallet is public. Your PnL is onchain. It&apos;s more verifiable than any track record in
            traditional finance — but almost nobody is reading it right.
          </p>
          <div className="hp-ps-grid">
            <div className="hp-ps-card hp-bad">
              <div className="hp-ps-hd hp-bad">✕ Without Yieldr</div>
              {PROBLEM_ITEMS.map((txt, i) => (
                <div className="hp-ps-item" key={i}><span className="hp-ps-mark hp-bad">×</span>{txt}</div>
              ))}
            </div>
            <div className="hp-ps-card hp-good">
              <div className="hp-ps-hd hp-good">→ With Yieldr</div>
              {SOLUTION_ITEMS.map((node, i) => (
                <div className="hp-ps-item" key={i}><span className="hp-ps-mark hp-good">→</span>{node}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hp-sec" style={{ paddingTop: 0 }} id="vaults">
        <div className="hp-wrap">
          <div className="hp-slbl"><span>Up Next</span><span className="hp-ln" /></div>
          <h2 className="hp-sec-h">12 agent vaults are already gathering commitments.</h2>
          <p className="hp-sec-p">
            Together targeting $2.1M in AUM across Base, HOOD Chain, and beyond. Whitelist a wallet now to be
            first in when Agent Vaults open — this is what Phase 4 (Allocation Agent) turns into real,
            depositable funds.
          </p>
          <div className="hp-ticker-in hp-ticker-in-3" style={{ margin: '22px 0' }}>
            <div className="hp-tick-card">
              <div className="hp-tick-lbl">Agent Vaults</div>
              <div className="hp-tick-val hp-num" style={{ fontSize: 26 }}>12</div>
            </div>
            <div className="hp-tick-card">
              <div className="hp-tick-lbl">Target AUM</div>
              <div className="hp-tick-val hp-num hp-win" style={{ fontSize: 26 }}>$2.1M</div>
            </div>
            <div className="hp-tick-card">
              <div className="hp-tick-lbl">Featured Below</div>
              <div className="hp-tick-val hp-num" style={{ fontSize: 26 }}>2</div>
            </div>
          </div>
          <div className="hp-vault2-grid">
            {VAULT_TEASERS.map((v) => (
              <div className="hp-vcard2" key={v.title}>
                <div className="hp-vcard2-badges">
                  <span className="hp-vb-waitlist"><span className="hp-dt" />WAITLIST</span>
                  <span className={`hp-vb-chain hp-${v.chain}`}>{v.chainLabel}</span>
                  <button className="hp-vb-cta">Whitelist Wallet</button>
                </div>
                <div className="hp-vcard2-cat">{v.category}</div>
                <div className="hp-vcard2-title">{v.title}</div>
                <p className="hp-vcard2-desc">{v.desc}</p>
                <div className="hp-vcard2-stats">
                  <div className="hp-vcard2-stat"><div className="hp-v">{v.aum}</div><div className="hp-k">TARGET AUM</div></div>
                  <div className="hp-vcard2-stat"><div className="hp-v">{v.fee}</div><div className="hp-k">PERF FEE</div></div>
                  <div className="hp-vcard2-stat"><div className="hp-v">{v.waitlisted}</div><div className="hp-k">WAITLISTED</div></div>
                </div>
                <div className="hp-vcard2-foot">{v.waitlisted} wallets whitelisted</div>
              </div>
            ))}
          </div>
          <div className="hp-vault-more">
            <div className="hp-vault-more-txt">
              10 more vaults are in development across Avantis, Hyperliquid, Aerodrome, and more chains —{' '}
              <b>opening to depositors as the Allocation Agent ships.</b>
            </div>
            <Link href="/explorer" className="hp-btn-s">Explore All Agent Vaults ↗</Link>
          </div>
          <div className="hp-vault-legal">
            Vaults are not yet live for outside deposits · Target figures are estimates, not guarantees · Not available to residents of restricted jurisdictions.
          </div>
        </div>
      </div>

      <div className="hp-sec" style={{ paddingTop: 0 }}>
        <div className="hp-wrap">
          <div className="hp-slbl"><span>Built Different</span><span className="hp-ln" /></div>
          <h2 className="hp-sec-h">Proven onchain.</h2>
          <div className="hp-cred-grid" style={{ marginTop: 20 }}>
            {CREDIBILITY.map((c) => {
              const isInternal = c.href.startsWith('/');
              const inner = (
                <>
                  <div className="hp-cred-top"><div className="hp-cred-ic">{c.icon}</div></div>
                  <div className="hp-cred-name" style={{ fontSize: 15 }}>{c.name}</div>
                  <div className="hp-cred-desc">{c.desc}</div>
                </>
              );
              return isInternal ? (
                <Link className="hp-cred-card" href={c.href} key={c.name} style={{ textDecoration: 'none', display: 'block' }}>
                  {inner}
                </Link>
              ) : (
                <a className="hp-cred-card" href={c.href} key={c.name} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                  {inner}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="hp-sec" style={{ paddingTop: 0 }}>
        <div className="hp-wrap">
          <div className="hp-slbl"><span>Who This Is For</span><span className="hp-ln" /></div>
          <h2 className="hp-sec-h">Built for traders on the apps you already use.</h2>
          <p className="hp-sec-p">
            FOMO and pump.fun integrations are in progress, going fully live alongside the Quant Terminal —
            Polymarket, Uniswap, and Aerodrome follow as the agent stack expands into predictions and DeFi.
          </p>
          <div className="hp-market-grid">
            {MARKETS.map((m) => (
              <div className="hp-market-card" key={m.name}>
                <div className="hp-market-logo">
                  <img src={m.img} alt={m.name} />
                </div>
                <div className="hp-market-name">{m.name}</div>
                <div className={`hp-market-status hp-${m.status}`}>{m.statusLabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hp-sec" style={{ paddingTop: 0 }}>
        <div className="hp-wrap">
          <div className="hp-slbl"><span>Where It Runs</span><span className="hp-ln" /></div>
          <h2 className="hp-sec-h">Live on Base and Robinhood Chain today.</h2>
          <p className="hp-sec-p">
            Quant Agent is live on Base and Robinhood Chain now — connect a wallet on either and the agent
            picks up your full trade history automatically. Solana support is coming next.
          </p>
          <div className="hp-chain-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
            {CHAINS.map((c) => (
              <div className={`hp-chain-card ${c.cls ? `hp-${c.cls}` : ''}`} key={c.name}>
                <div className="hp-chain-logo">
                  <img src={c.img} alt={c.name} />
                </div>
                <div>
                  <div className="hp-chain-name">{c.name} <span className={c.badge === 'live' ? 'hp-chain-live' : 'hp-chain-soon'}>{c.badge === 'live' ? 'Live' : 'Upcoming'}</span></div>
                  <div className="hp-chain-desc">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hp-foot">
        <div className="hp-wrap hp-foot-in">
          <div className="hp-foot-l">
            © 2026 Yieldr · Agent stack for onchain funds ·{' '}
            <a href="https://www.yieldr.org" style={{ textDecoration: 'none' }}>yieldr.org</a>
          </div>
          <div className="hp-foot-r">
            <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="hp-foot-soc"><XIcon /></a>
            <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hp-foot-soc"><GitHubIcon /></a>
            <Link href="/explorer">Vaults</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/build-in-public">Build Log</Link>
          </div>
        </div>
        <div className="hp-legal-block">
          Nothing on this site constitutes an offer to sell or solicitation to buy any security or financial
          instrument, or financial advice of any kind. Performance data reflects Yieldr project capital, not
          external depositor capital. Past performance is not indicative of future results. Not available to
          residents of the United States, United Kingdom, Canada, China, or jurisdictions where offering
          crypto financial services is restricted.
        </div>
      </div>

      <QuantWaitlistModal isOpen={waitlistModalOpen} onClose={() => setWaitlistModalOpen(false)} />
    </div>
  );
}
