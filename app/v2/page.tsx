'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import './v2.css';

const DEFAULT_WAITLIST_COUNT = 542;
const WAITLIST_AUM = 2_100_000;

const ROADMAP = [
  {
    num: '01',
    when: 'Q4 2026',
    name: 'Quant Agent',
    desc: 'Reads your onchain wallet history and grades your Entry, Exit, and Sizing into one composite Edge score — tells you if your performance is repeatable or luck.',
    isNow: true,
    cta: { label: 'Reserve Genesis access →', href: '/v2/prelaunch-edge' },
  },
  {
    num: '02',
    when: 'Q1 2027',
    name: 'Quant Terminal',
    desc: 'Real-time signals and top-trader flow across FOMO and pump.fun, for anyone tracking meme and alt markets.',
  },
  {
    num: '03',
    when: 'Q1 2027',
    name: 'Agent Vaults',
    desc: 'Traders with a proven Edge launch an agent-operated vault depositors can actually allocate into — audited before any public capital lands.',
  },
  {
    num: '04',
    when: 'Q4 2027',
    name: 'Allocation Agent',
    desc: 'Matches passive depositors to vaults by risk and return profile, and rotates capital as edge decays or improves.',
  },
];

const PROBLEM_ITEMS = [
  "You can't tell if your wins are edge, luck, or beta",
  'Nobody outside your circle knows your track record exists',
  'Depositors have no way to find you or trust your edge',
  'You scale by risking more of your own money, not theirs',
];

const SOLUTION_ITEMS = [
  'Quant Agent grades your onchain history and tells you where your edge is real — and where it isn’t',
  'Agent Vaults turn a proven edge into a fund depositors can join, without you becoming a fund operator',
  'Matching, Comms, and Monitoring agents handle depositor relations and track edge decay for you',
  'You keep trading. The agent stack runs the fund around it.',
];

const VAULT_TEASERS = [
  {
    category: 'Virtuals · Base · Robotics Infra',
    name: 'Virtuals Robotics Infra Vault',
    desc: 'Agent researches new Virtuals launches on Base, monitors project milestones, and accumulates high-conviction robotics and AI infrastructure tokens for long-term value growth.',
    aum: '$40.0K',
    fee: '≤20%',
    waitlisted: '20',
  },
  {
    category: 'Robinhood Chain · RWA',
    name: 'SpaceX RWA Vault',
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
    name: 'Circuit Accelerator, Singapore',
    desc: 'Selected for the Circuit accelerator — backed by Base × Newcampus HQ.',
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
  { name: 'FOMO', status: 'building' as const, statusLabel: 'In Development', img: '/images/fomo.png' },
  { name: 'pump.fun', status: 'building' as const, statusLabel: 'In Development', img: '/images/pump.png' },
  { name: 'Polymarket', status: 'soon' as const, statusLabel: 'Planned', img: '/images/poly.png' },
  { name: 'Uniswap', status: 'soon' as const, statusLabel: 'Planned', img: '/images/uni.png' },
  { name: 'Aerodrome', status: 'soon' as const, statusLabel: 'Planned', img: '/images/aero.png' },
];

const CHAINS = [
  {
    name: 'Base',
    badge: 'building' as const,
    desc: 'Wallet scans for meme and alt-coin history, plus OG wallet tracking — the first chain Quant Agent will support at launch.',
    img: '/images/base.png',
  },
  {
    name: 'Robinhood Chain',
    badge: 'building' as const,
    desc: 'Tokenized-equity activity scanning, extending Quant Agent to that market as it grows.',
    img: '/images/hood.png',
  },
  {
    name: 'Solana',
    badge: 'planned' as const,
    desc: 'Wallet scans on Solana are planned next — home to some of the fastest-moving meme markets onchain.',
    img: '/images/sol.png',
  },
];

function fmtAumM(n: number): string {
  return `$${(n / 1_000_000).toFixed(1)}M`;
}

function fmtArr(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

function AnimatedCount({ target, format, className }: { target: number; format?: (n: number) => string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dur = 1400;
    let raf = 0;
    const t0 = performance.now();
    function step(t: number) {
      const p = Math.min(1, (t - t0) / dur);
      const val = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      if (el) el.textContent = format ? format(val) : val.toLocaleString('en-US');
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, format]);
  return <div className={className} ref={ref}>{format ? format(0) : '0'}</div>;
}

export default function V2LandingPage() {
  const [waitlistCount, setWaitlistCount] = useState(DEFAULT_WAITLIST_COUNT);
  const [prelaunchArr, setPrelaunchArr] = useState(0);
  const [arrMembers, setArrMembers] = useState(0);

  useEffect(() => {
    fetch('/api/quant-waitlist').then(r => r.json()).then(d => {
      if (d?.success && typeof d.count === 'number') setWaitlistCount(d.count);
    }).catch(() => {});
    fetch('/api/site-stats').then(r => r.json()).then(d => {
      if (d?.success && d.data) {
        if (typeof d.data.prelaunchArr === 'number') setPrelaunchArr(d.data.prelaunchArr);
        if (typeof d.data.genesisMembers === 'number') setArrMembers(d.data.genesisMembers);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="v2-root">
      <div className="v2-devbar">
        Design review build — not live, not linked from the site. <Link href="/">Back to production →</Link>
      </div>

      <div className="v2-nav">
        <div className="v2-wrap v2-nav-in">
          <div className="v2-nav-id">
            <div className="v2-nav-mark"><span /></div>
            <div className="v2-nav-name">Yieldr</div>
            <div className="v2-nav-tag">v2</div>
          </div>
          <div className="v2-nav-right">
            <div className="v2-nav-links">
              <a href="#system">System</a>
              <Link href="/v2/explorer">Vaults</Link>
              <Link href="/v2/build-in-public">Build Log</Link>
              <Link href="/v2/docs">Docs</Link>
            </div>
            <Link href="/v2/prelaunch-edge" className="v2-nav-cta">Reserve Genesis Access</Link>
          </div>
        </div>
      </div>

      <div className="v2-hero">
        <div className="v2-wrap v2-hero-grid">
          <div>
            <div className="v2-eyebrow"><span className="dot" />Building the agent layer for onchain funds</div>
            <h1 className="v2-h1">The <em>Agent OS</em> for onchain funds.</h1>
            <p className="v2-hero-sub">
              100M+ crypto traders, and 95% of them lose money — the top 5% have real, provable edge but no
              infrastructure to turn it into a fund. Yieldr is the agent layer that closes that gap: one stack
              that grades your edge, runs the fund operations, and matches you to depositors.
            </p>
            <div className="v2-hero-ctas">
              <Link href="/v2/prelaunch-edge" className="v2-btn-p">Try Quant Agent — reserve Genesis →</Link>
              <a href="#system" className="v2-btn-s">See how the stack works ↓</a>
            </div>
            <div className="v2-hero-note">Read-only wallet scans · nothing custodied, nothing traded on your behalf</div>
          </div>
          <div className="v2-stack" id="system">
            <div className="v2-stack-row is-agent">
              <div className="v2-stack-lbl">Agent Layer</div>
              <div className="v2-stack-name">Edge, matching, comms, monitoring</div>
              <div className="v2-stack-desc">The part Yieldr builds — Quant Agent grades edge, Matching Agent finds depositors, Comms &amp; Monitoring run the relationship.</div>
            </div>
            <div className="v2-stack-row">
              <div className="v2-stack-lbl">Strategy Layer</div>
              <div className="v2-stack-name">Predictions, perps, LP, memecoins, RWAs</div>
              <div className="v2-stack-desc">Whatever markets your edge actually lives in.</div>
            </div>
            <div className="v2-stack-row">
              <div className="v2-stack-lbl">Capital Layer</div>
              <div className="v2-stack-name">Deposits, accounting, risk limits</div>
              <div className="v2-stack-desc">The vault primitives most DeFi products stop at.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="v2-ticker">
        <div className="v2-wrap v2-ticker-grid">
          <div className="v2-tick">
            <div className="v2-tick-lbl">Quants on Waitlist</div>
            <AnimatedCount target={waitlistCount} className="v2-tick-val is-accent v2-num" />
            <div className="v2-tick-src">reserved for Quant Agent launch</div>
          </div>
          <div className="v2-tick">
            <div className="v2-tick-lbl">AUM on Waitlist</div>
            <AnimatedCount target={WAITLIST_AUM} format={fmtAumM} className="v2-tick-val is-accent v2-num" />
            <div className="v2-tick-src">committed across waitlisted vaults</div>
          </div>
          <div className="v2-tick">
            <div className="v2-tick-lbl">Annual Recurring Revenue</div>
            <div className="v2-tick-val is-accent v2-num">{fmtArr(prelaunchArr)}</div>
            <div className="v2-tick-src">{arrMembers} paying member{arrMembers === 1 ? '' : 's'} · Genesis</div>
          </div>
        </div>
      </div>

      <div className="v2-sec">
        <div className="v2-wrap">
          <div className="v2-slbl">Roadmap</div>
          <h2 className="v2-sec-h">One agent stack, shipping in phases.</h2>
          <p className="v2-sec-p">
            Quant Agent is the first piece live for Genesis subscribers — everything after it builds on the
            same wallet-intelligence layer.
          </p>
          <div className="v2-rm-list">
            {ROADMAP.map((r) => (
              <div className={`v2-rm-item${r.isNow ? ' is-now' : ''}`} key={r.num}>
                <div className="v2-rm-num">{r.num}</div>
                <div>
                  <div className="v2-rm-when">{r.when}</div>
                  <div className="v2-rm-name">{r.name}</div>
                  <div className="v2-rm-desc">{r.desc}</div>
                </div>
                {r.cta ? <Link href={r.cta.href} className="v2-rm-cta">{r.cta.label}</Link> : <span />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="v2-sec">
        <div className="v2-wrap v2-two-col">
          <div>
            <div className="v2-col-h">The Problem</div>
            <div className="v2-list">
              {PROBLEM_ITEMS.map((t) => (
                <div className="v2-list-item is-loss" key={t}><span className="v2-mk">×</span><span>{t}</span></div>
              ))}
            </div>
          </div>
          <div>
            <div className="v2-col-h">The Agent Stack</div>
            <div className="v2-list">
              {SOLUTION_ITEMS.map((t) => (
                <div className="v2-list-item is-win" key={t}><span className="v2-mk">✓</span><span>{t}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="v2-sec" id="vaults">
        <div className="v2-wrap">
          <div className="v2-slbl">Coming After Quant Agent</div>
          <h2 className="v2-sec-h">Agent vaults, gathering commitments now.</h2>
          <p className="v2-sec-p">Two of the first vaults, waitlisting depositors ahead of the Q1 2027 launch.</p>
          <div className="v2-vault-grid">
            {VAULT_TEASERS.map((v) => (
              <div className="v2-vault-card" key={v.name}>
                <div className="v2-vault-cat">{v.category}</div>
                <div className="v2-vault-name">{v.name}</div>
                <div className="v2-vault-desc">{v.desc}</div>
                <div className="v2-vault-stats">
                  <div><div className="v2-vault-stat-lbl">Target AUM</div><div className="v2-vault-stat-val v2-num">{v.aum}</div></div>
                  <div><div className="v2-vault-stat-lbl">Perf. Fee</div><div className="v2-vault-stat-val v2-num">{v.fee}</div></div>
                  <div><div className="v2-vault-stat-lbl">Waitlisted</div><div className="v2-vault-stat-val v2-num">{v.waitlisted}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="v2-sec">
        <div className="v2-wrap">
          <div className="v2-slbl">Built Different</div>
          <h2 className="v2-sec-h">Proven onchain.</h2>
          <div className="v2-cred-grid" style={{ marginTop: 20 }}>
            {CREDIBILITY.map((c) => {
              const isInternal = c.href.startsWith('/');
              const inner = (
                <>
                  <div className="v2-cred-ic">{c.icon}</div>
                  <div className="v2-cred-name">{c.name}</div>
                  <div className="v2-cred-desc">{c.desc}</div>
                </>
              );
              return isInternal ? (
                <Link className="v2-cred-card" href={c.href} key={c.name}>{inner}</Link>
              ) : (
                <a className="v2-cred-card" href={c.href} key={c.name} target="_blank" rel="noopener noreferrer">{inner}</a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="v2-sec">
        <div className="v2-wrap">
          <div className="v2-slbl">Who This Is For</div>
          <h2 className="v2-sec-h">Meets you where you already trade.</h2>
          <p className="v2-sec-p">
            FOMO and pump.fun integrations are in development, launching alongside the Quant Terminal —
            Polymarket, Uniswap, and Aerodrome follow as the agent stack expands into predictions and DeFi.
          </p>
          <div className="v2-chip-grid">
            {MARKETS.map((m) => (
              <div className="v2-chip" key={m.name}>
                <div className="v2-chip-logo"><img src={m.img} alt={m.name} /></div>
                <div className="v2-chip-name">{m.name}</div>
                <div className={`v2-chip-status is-${m.status}`}>{m.statusLabel}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="v2-sec" style={{ borderBottom: 'none' }}>
        <div className="v2-wrap">
          <div className="v2-slbl">Where It's Headed</div>
          <h2 className="v2-sec-h">Built first for Base and Robinhood Chain.</h2>
          <p className="v2-sec-p">
            Quant Agent is being built to read wallet history natively on Base and Robinhood Chain first —
            connect a wallet on either once it launches, and the agent picks up your full trade history
            automatically. Solana support is planned next.
          </p>
          <div className="v2-chain-grid">
            {CHAINS.map((c) => (
              <div className="v2-chain-card" key={c.name}>
                <div className="v2-chain-logo"><img src={c.img} alt={c.name} /></div>
                <div>
                  <div className="v2-chain-name">
                    {c.name}
                    <span className={`v2-chain-badge is-${c.badge}`}>{c.badge === 'building' ? 'In Development' : 'Planned'}</span>
                  </div>
                  <div className="v2-chain-desc">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="v2-foot">
        <div className="v2-wrap v2-foot-in">
          <div className="v2-foot-l">© 2026 Yieldr · The Agent OS for onchain funds</div>
          <div className="v2-foot-r">
            <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer">GitHub</a>
            <Link href="/v2/explorer">Vaults</Link>
            <Link href="/v2/docs">Docs</Link>
            <Link href="/v2/build-in-public">Build Log</Link>
          </div>
        </div>
        <div className="v2-wrap">
          <div className="v2-legal">
            Nothing on this site constitutes an offer to sell or solicitation to buy any security or financial
            instrument, or financial advice of any kind. Performance data reflects Yieldr project capital, not
            external depositor capital. Past performance is not indicative of future results. Not available to
            residents of the United States, United Kingdom, Canada, China, or jurisdictions where offering
            crypto financial services is restricted.
          </div>
        </div>
      </div>
    </div>
  );
}
