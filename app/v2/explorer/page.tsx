'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../v2.css';
import './ex2.css';

type VaultStatus = 'live' | 'waitlist';
type Vault = {
  id: string; name: string; proto: string; desc: string;
  status: VaultStatus; cat: string; chain: string;
  stats: Array<{ v: string; l: string }>;
};

const VAULTS: Vault[] = [
  { id: 'geo', name: 'Geopolitics Vault', proto: 'Polymarket · Predictions', desc: 'Agent identifies wallets with abnormal win rates vs implied probability on geopolitical events.', status: 'live', cat: 'predictions', chain: 'polygon', stats: [{ v: '+41.8%', l: '30D Return' }, { v: '$59.2K', l: 'AUM' }, { v: '82%', l: 'Win Rate' }] },
  { id: 'nba', name: 'NBA Edge Vault', proto: 'Polymarket · Predictions', desc: 'Agent ranks top NBA prediction market traders by statistical edge, mirrors highest-conviction positions.', status: 'live', cat: 'predictions', chain: 'polygon', stats: [{ v: '+18.7%', l: '7D Return' }, { v: '$22.4K', l: 'AUM' }, { v: '74%', l: 'Win Rate' }] },
  { id: 'funding', name: 'Funding Arbs Vault', proto: 'Avantis · Hyperliquid · Perps', desc: 'Captures funding rate premium on Avantis & Hyperliquid by holding long/short pairs where funding diverges from historical mean.', status: 'waitlist', cat: 'perps', chain: 'base', stats: [{ v: '$75K', l: 'Target AUM' }, { v: '≤20%', l: 'Perf Fee' }] },
  { id: 'aero', name: 'AERO Accumulator Vault', proto: 'Aerodrome · LP', desc: "DCA into Base's largest DEX token using top Aerodrome LP and trader signals.", status: 'waitlist', cat: 'lp', chain: 'base', stats: [{ v: '$48K', l: 'Target AUM' }, { v: '≤15%', l: 'Perf Fee' }] },
  { id: 'virtuals-robotics', name: 'Virtuals Robotics Infra Vault', proto: 'Virtuals · Base · Robotics', desc: 'Agent researches new Virtuals launches on Base and accumulates high-conviction robotics and AI infra tokens.', status: 'waitlist', cat: 'project-coins', chain: 'base', stats: [{ v: '$40K', l: 'Target AUM' }, { v: '≤20%', l: 'Perf Fee' }] },
  { id: 'spacex', name: 'SpaceX RWA Vault', proto: 'Robinhood Chain · RWA', desc: 'Accumulates SPCX tokenized equity natively on Robinhood Chain, following top post-IPO RWA spot edge.', status: 'waitlist', cat: 'rwa', chain: 'hood', stats: [{ v: '$28K', l: 'Target AUM' }, { v: '≤25%', l: 'Perf Fee' }] },
  { id: 'nvda', name: 'NVDA AI Momentum Vault', proto: 'Robinhood Chain · Stock Tokens', desc: 'Follows top wallets accumulating NVIDIA tokenized stock on Robinhood Chain.', status: 'waitlist', cat: 'rwa', chain: 'hood', stats: [{ v: '$65K', l: 'Target AUM' }, { v: '≤20%', l: 'Perf Fee' }] },
  { id: 'tsla', name: 'TSLA Volatility Vault', proto: 'Robinhood Chain · Stock Tokens', desc: 'Captures Tesla volatility cycles using tokenized TSLA on Robinhood Chain.', status: 'waitlist', cat: 'rwa', chain: 'hood', stats: [{ v: '$55K', l: 'Target AUM' }, { v: '≤20%', l: 'Perf Fee' }] },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'waitlist', label: 'Waitlist' },
  { key: 'predictions', label: 'Predictions' },
  { key: 'perps', label: 'Perps' },
  { key: 'lp', label: 'LP' },
  { key: 'project-coins', label: 'Project Coins' },
  { key: 'rwa', label: 'RWA' },
];

export default function V2ExplorerPage() {
  const [filter, setFilter] = useState('all');

  const shown = VAULTS.filter((v) => {
    if (filter === 'all') return true;
    if (filter === 'live' || filter === 'waitlist') return v.status === filter;
    return v.cat === filter;
  });

  return (
    <div className="v2-root ex2-root">
      <div className="v2-devbar">
        Design review build — whitelisting is disabled here. <Link href="/">Back to production →</Link>
      </div>

      <div className="v2-nav">
        <div className="v2-wrap v2-nav-in">
          <Link href="/v2" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <div className="v2-nav-mark"><span /></div>
            <div className="v2-nav-name">Yieldr</div>
            <div className="v2-nav-tag">v2</div>
          </Link>
          <button className="v2-nav-cta" disabled title="Wallet connect disabled in design review">Connect Wallet</button>
        </div>
      </div>

      <div className="ex2-hero">
        <div className="v2-wrap">
          <div className="v2-eyebrow"><span className="dot" />2 vaults live on project capital · 7 gathering commitments</div>
          <h1 className="v2-h1">Agent vaults, <em>by category</em>.</h1>
          <p className="v2-hero-sub">Two vaults are trading real project capital today. The rest are waitlisting depositors ahead of the Q1 2027 public launch.</p>
        </div>
      </div>

      <div className="ex2-body v2-wrap">
        <div className="ex2-filters">
          {FILTERS.map((f) => (
            <button key={f.key} className={filter === f.key ? 'is-active' : ''} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>

        <div className="ex2-grid">
          {shown.map((v) => (
            <div className="ex2-card" key={v.id}>
              <div className="ex2-card-top">
                <span className={`ex2-status is-${v.status}`}>{v.status === 'live' ? 'Live' : 'Waitlist'}</span>
                <span className="ex2-proto">{v.proto}</span>
              </div>
              <div className="ex2-name">{v.name}</div>
              <div className="ex2-desc">{v.desc}</div>
              <div className="ex2-stats">
                {v.stats.map((s) => (
                  <div key={s.l}><div className="ex2-stat-v v2-num">{s.v}</div><div className="ex2-stat-l">{s.l}</div></div>
                ))}
              </div>
              <button className="v2-btn-s" style={{ width: '100%', marginTop: 18 }} disabled title="Whitelisting disabled in design review">
                {v.status === 'live' ? 'View Vault' : 'Whitelist Wallet'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="v2-foot">
        <div className="v2-wrap v2-foot-in">
          <div className="v2-foot-l">© 2026 Yieldr · Agent OS for onchain funds</div>
          <div className="v2-foot-r">
            <Link href="/v2">Home</Link>
            <Link href="/v2/docs">Docs</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
