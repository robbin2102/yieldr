'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import './landing.css';

const MARQUEE_ITEMS = [
  { text: 'HOOD CHAIN', hl: 'NOW LIVE' },
  { text: '🏆 BASE BATCHES 002', hl: 'WINNER' },
  { text: '🚀 CIRCUIT ACCELERATOR', hl: 'SINGAPORE' },
  { text: '⚡ QUANT AGENT', hl: 'LIVE NOW' },
];

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
  { name: 'FOMO', status: 'building' as const, statusLabel: 'Building', mono: 'FM' },
  { name: 'pump.fun', status: 'building' as const, statusLabel: 'Building', mono: 'PF' },
  { name: 'Polymarket', status: 'soon' as const, statusLabel: 'Upcoming', mono: 'PM' },
  { name: 'Uniswap', status: 'soon' as const, statusLabel: 'Upcoming', mono: 'UNI' },
  { name: 'Aerodrome', status: 'soon' as const, statusLabel: 'Upcoming', mono: 'AERO' },
];

const CHAINS = [
  {
    cls: 'base' as const,
    name: 'Base',
    badge: 'live' as const,
    desc: 'Full support today — meme & alt coin history, OG wallet tracking, and the Quant Terminal all run natively on Base.',
    mono: 'B',
  },
  {
    cls: 'rh' as const,
    name: 'Robinhood Chain',
    badge: 'live' as const,
    desc: 'Wallet scans and signal tracking extend to Robinhood Chain — including tokenized-equity activity as that market grows.',
    mono: 'RH',
  },
  {
    cls: '' as const,
    name: 'Solana',
    badge: 'soon' as const,
    desc: 'Wallet scans on Solana are coming next — home to some of the fastest-moving meme markets onchain.',
    mono: 'SOL',
  },
];

const SPARK_HEIGHTS = [
  62,38,45,50,58,72,30,48,66,55,40,35,60,68,44,52,74,28,42,56,64,48,36,58,70,46,32,54,62,40,50,66,44,58,72,34,48,60,52,38,64,56,42,68,50,46,
];
const SPARK_LOSS_IDX = new Set([1,6,10,15,19,23,27,30,34,38,42,45]);

function AnimatedCount({ target, prefix = '', className = 'hp-tick-val hp-num' }: { target: number; prefix?: string; className?: string }) {
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
      if (el) el.textContent = prefix + val.toLocaleString('en-US');
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, prefix]);
  return <div className={className} ref={ref}>{prefix}0</div>;
}

// TODO: point at the Quant Agent wallet-scan tool once that page exists in this app.
function handlePlaceholderCta(e: React.MouseEvent) {
  e.preventDefault();
}

export default function HomePage() {
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
              <svg width="32" height="32" viewBox="0 0 100 120" fill="none">
                <path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#17E37A" />
                <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3" />
                <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9" />
              </svg>
            </div>
            <div className="hp-nav-name">YIELDR</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div
              className="hp-nav-links"
              style={{ display: 'flex', gap: 20, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}
            >
              <a href="#roadmap" style={{ textDecoration: 'none' }}>Roadmap</a>
              <Link href="/vaults" style={{ textDecoration: 'none' }}>Vaults</Link>
              <Link href="/buy" style={{ textDecoration: 'none' }}>Buy</Link>
              <Link href="/allocations" style={{ textDecoration: 'none' }}>Allocations</Link>
              <Link href="/build-in-public" style={{ textDecoration: 'none' }}>Build Log</Link>
              <Link href="/docs" style={{ textDecoration: 'none' }}>Docs</Link>
              <Link href="/team" style={{ textDecoration: 'none' }}>Team</Link>
            </div>
            <button className="hp-nav-cta" onClick={handlePlaceholderCta}>Find Your Edge</button>
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
          <span className="hp-eyebrow"><span className="hp-dot" />Quant Agent is live · Genesis window open</span>
          <h1>Agent stack for <em>onchain funds</em>.</h1>
          <p className="hp-hero-sub">
            Discover your edge. Convert it into a fund. Connect your wallet — the Quant Agent reveals your
            real, repeatable edge today. Later phases turn it into a fund you don&apos;t have to run yourself.
          </p>
          <div className="hp-hero-ctas">
            <button className="hp-btn-p" onClick={handlePlaceholderCta}>Find Your Edge →</button>
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
        <div className="hp-wrap hp-ticker-in">
          <div className="hp-tick-cell">
            <div className="hp-tick-lbl"><span className="hp-ld" />Wallets Scanned</div>
            <AnimatedCount target={4812} />
            <div className="hp-tick-src">Quant Agent · live</div>
          </div>
          <div className="hp-tick-cell">
            <div className="hp-tick-lbl">Genesis Members</div>
            <AnimatedCount target={347} className="hp-tick-val hp-num hp-win" />
            <div className="hp-tick-src">of 1,000 slots</div>
          </div>
          <div className="hp-tick-cell">
            <div className="hp-tick-lbl">Prelaunch ARR</div>
            <AnimatedCount target={38200} prefix="$" />
            <div className="hp-tick-src">from onchain USDC receipts</div>
          </div>
        </div>
      </div>

      <div className="hp-sec" id="roadmap">
        <div className="hp-wrap">
          <div className="hp-slbl"><span>Where We Are</span><span className="hp-ln" /></div>
          <h2 className="hp-sec-h">One agent stack, shipping in phases.</h2>
          <p className="hp-sec-p">
            Quant Agent is live today — that&apos;s what Genesis access buys first. Everything after it is
            real, in progress, and dated honestly.
          </p>

          <div className="hp-rm-product-grid">
            <div className="hp-rm-product-card">
              <div className="hp-rm-product-inner">
                <div>
                  <div className="hp-rm-num">01 · Q3 2026</div>
                  <div className="hp-rm-status hp-live">Live Now</div>
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
                    <div className="hp-tok-av2">🐱</div>
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
            <button className="hp-btn-p" onClick={handlePlaceholderCta}>Find Your Edge →</button>
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
            Together targeting $1.8M in AUM across Base, HOOD Chain, and beyond. Whitelist a wallet now to be
            first in when Agent Vaults open — this is what Phase 4 (Allocation Agent) turns into real,
            depositable funds.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, margin: '22px 0', border: '1px solid var(--hair)', borderRadius: 14, overflow: 'hidden', background: 'var(--hair)' }}>
            <div style={{ background: 'var(--surface)', padding: '16px 20px', textAlign: 'center' }}>
              <div className="hp-tok-stat2"><div className="hp-k" style={{ fontSize: 9.5 }}>Agent Vaults</div><div className="hp-v" style={{ fontSize: 20 }}>12</div></div>
            </div>
            <div style={{ background: 'var(--surface)', padding: '16px 20px', textAlign: 'center' }}>
              <div className="hp-tok-stat2"><div className="hp-k" style={{ fontSize: 9.5 }}>Target AUM</div><div className="hp-v" style={{ fontSize: 20, color: 'var(--win)' }}>$1.8M</div></div>
            </div>
            <div style={{ background: 'var(--surface)', padding: '16px 20px', textAlign: 'center' }}>
              <div className="hp-tok-stat2"><div className="hp-k" style={{ fontSize: 9.5 }}>Featured Below</div><div className="hp-v" style={{ fontSize: 20 }}>2</div></div>
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
            <Link href="/vaults" className="hp-btn-s">Explore All Agent Vaults ↗</Link>
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
                <div className="hp-market-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-3)', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: 'var(--ink-2)' }}>{m.mono}</div>
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
                <div className="hp-chain-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-3)', fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: 'var(--ink-2)' }}>{c.mono}</div>
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
            <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">X</a>
            <Link href="/vaults">Vaults</Link>
            <Link href="/buy">Buy</Link>
            <Link href="/allocations">Allocations</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/build-in-public">Build Log</Link>
            <Link href="/team">Team</Link>
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
    </div>
  );
}
