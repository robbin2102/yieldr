'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './v3.css';
import NetworkCanvas from './NetworkCanvas';
import ScanTerminal from './ScanTerminal';
import Reveal from './Reveal';

const DEFAULT_WAITLIST_COUNT = 542;
const WAITLIST_AUM = 2_100_000;

function fmtAumM(n: number) { return `$${(n / 1_000_000).toFixed(1)}M`; }
function fmtUsd(n: number) { return `$${Math.round(n).toLocaleString('en-US')}`; }

export default function V3LandingPage() {
  const [waitlist, setWaitlist] = useState(DEFAULT_WAITLIST_COUNT);
  const [arr, setArr] = useState(0);
  const [members, setMembers] = useState(0);
  const [glitched, setGlitched] = useState(false);

  useEffect(() => {
    setGlitched(true);
    fetch('/api/quant-waitlist').then(r => r.json()).then(d => {
      if (d?.success && typeof d.count === 'number') setWaitlist(d.count);
    }).catch(() => {});
    fetch('/api/site-stats').then(r => r.json()).then(d => {
      if (d?.success && d.data) {
        if (typeof d.data.prelaunchArr === 'number') setArr(d.data.prelaunchArr);
        if (typeof d.data.genesisMembers === 'number') setMembers(d.data.genesisMembers);
      }
    }).catch(() => {});
  }, []);

  const tapeItems = [
    { l: 'QUANTS ON WAITLIST', v: waitlist.toLocaleString('en-US') },
    { l: 'AUM ON WAITLIST', v: fmtAumM(WAITLIST_AUM) },
    { l: 'PRELAUNCH ARR', v: fmtUsd(arr) },
    { l: 'GENESIS MEMBERS', v: `${members}` },
    { l: 'QUANT AGENT', v: 'Q4 2026' },
    { l: 'VAULTS LIVE', v: '2 · Polymarket' },
  ];

  return (
    <div className="v3-root">
      <div className="v3-devbar">v3 design review — landing page only, not linked from production. <Link href="/">Back to production →</Link></div>
      <NetworkCanvas />
      <div className="v3-scanlines" />
      <div className="v3-vignette" />

      <div className="v3-nav">
        <div className="v3-wrap v3-nav-in">
          <div className="v3-nav-id"><span className="v3-nav-dot" />yieldr/v3</div>
          <div className="v3-nav-links">
            <a href="#system">system</a>
            <a href="#roadmap">roadmap</a>
            <a href="#stack">stack</a>
            <a href="#where">chains</a>
          </div>
        </div>
      </div>

      <div className="v3-hero">
        <div className="v3-wrap v3-hero-grid">
          <div>
            <div className="v3-prompt">building the agent layer for onchain funds</div>
            <h1 className={`v3-h1${glitched ? ' v3-glitch' : ''}`}>The <span className="em">Agent OS</span> for onchain funds.</h1>
            <p className="v3-hero-sub">
              100M+ crypto traders, 95% of them lose money — the top 5% have real, provable edge and no
              infrastructure to turn it into a fund. This terminal is grading a sample wallet live, the same
              way it will grade yours.
            </p>
            <div className="v3-hero-ctas">
              <Link href="/v2/prelaunch-edge" className="v3-btn-p">Reserve Genesis access →</Link>
              <a href="#system" className="v3-btn-s">See the stack ↓</a>
            </div>
            <div className="v3-hero-note">read-only wallet scan · nothing custodied, nothing traded on your behalf</div>
          </div>
          <ScanTerminal />
        </div>
      </div>

      <div className="v3-tape">
        <div className="v3-tape-in" style={{ animation: 'v3-tape-scroll 28s linear infinite' }}>
          {[...tapeItems, ...tapeItems, ...tapeItems].map((it, i) => (
            <div className="v3-tape-item" key={i}>{it.l} <b className="v3-num">{it.v}</b></div>
          ))}
        </div>
      </div>
      <style>{`@keyframes v3-tape-scroll { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }`}</style>

      <Reveal>
        <div className="v3-wrap" id="system">
          <div className="v3-tag">system architecture</div>
          <h2 className="v3-h2">Three layers. One stack.</h2>
          <p className="v3-p">Most DeFi products stop at the capital layer. Yieldr's the agent layer on top — the part that actually runs the fund.</p>
          <div className="v3-layers">
            <div className="v3-layer"><div className="v3-layer-idx">01</div><div className="v3-layer-name">Capital Layer</div><div className="v3-layer-desc">Deposits, withdrawals, accounting, fee logic, risk limits, onchain transparency.</div></div>
            <div className="v3-layer"><div className="v3-layer-idx">02</div><div className="v3-layer-name">Strategy Layer</div><div className="v3-layer-desc">Predictions, perps, LP, memecoins, project coins, RWAs, stock tokens.</div></div>
            <div className="v3-layer is-agent"><div className="v3-layer-idx">03</div><div className="v3-layer-name">Agent Layer</div><div className="v3-layer-desc">Quant Agent grades edge. Matching, Comms, and Monitoring agents run everything else.</div></div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="v3-wrap" id="roadmap">
          <div className="v3-tag">roadmap</div>
          <h2 className="v3-h2">One stack, shipping in phases.</h2>
          <div className="v3-ls">
            <div className="v3-ls-head"><span>when</span><span>phase</span><span /></div>
            <div className="v3-ls-row is-now">
              <div className="v3-ls-when">Q4 2026</div>
              <div><div className="v3-ls-name">01 · Quant Agent</div><div className="v3-ls-desc">Grades your onchain Entry, Exit, and Sizing into one composite Edge score.</div></div>
              <Link href="/v2/prelaunch-edge" className="v3-ls-cta">reserve →</Link>
            </div>
            <div className="v3-ls-row">
              <div className="v3-ls-when">Q1 2027</div>
              <div><div className="v3-ls-name">02 · Quant Terminal</div><div className="v3-ls-desc">Real-time signals and top-trader flow across FOMO and pump.fun.</div></div>
              <span />
            </div>
            <div className="v3-ls-row">
              <div className="v3-ls-when">Q1 2027</div>
              <div><div className="v3-ls-name">03 · Agent Vaults</div><div className="v3-ls-desc">A proven edge becomes a fund depositors can join, audited before public capital lands.</div></div>
              <span />
            </div>
            <div className="v3-ls-row">
              <div className="v3-ls-when">Q4 2027</div>
              <div><div className="v3-ls-name">04 · Allocation Agent</div><div className="v3-ls-desc">Matches depositor capital to vaults by risk and return profile.</div></div>
              <span />
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="v3-wrap" id="stack">
          <div className="v3-tag">diff</div>
          <h2 className="v3-h2">Without Yieldr / With Yieldr</h2>
          <div className="v3-layers" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="v3-layer">
              <div className="v3-layer-desc" style={{ color: '#e2585c' }}>
                − Can't tell if wins are edge, luck, or beta<br />
                − Track record invisible outside your circle<br />
                − Depositors can't find or trust your edge<br />
                − Scaling means risking more of your own money
              </div>
            </div>
            <div className="v3-layer is-agent">
              <div className="v3-layer-desc" style={{ color: 'var(--accent-2)' }}>
                + Quant Agent grades your edge, honestly<br />
                + Agent Vaults turn edge into a fund<br />
                + Matching Agent finds you depositors<br />
                + You keep trading — the stack runs the fund
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="v3-wrap" id="where">
          <div className="v3-tag">where it's headed</div>
          <h2 className="v3-h2">Built first for Base and Robinhood Chain.</h2>
          <p className="v3-p">Nothing below is live yet — Quant Agent reads wallets natively on these chains once it launches in Q4 2026.</p>
          <div className="v3-status-grid">
            <div className="v3-status-card"><div className="v3-status-name">Base <span className="v3-status-badge">In Dev</span></div><div className="v3-status-desc">Meme &amp; alt coin history, OG wallet tracking — first chain supported at launch.</div></div>
            <div className="v3-status-card"><div className="v3-status-name">Robinhood Chain <span className="v3-status-badge">In Dev</span></div><div className="v3-status-desc">Tokenized-equity activity, extending as that market grows.</div></div>
            <div className="v3-status-card"><div className="v3-status-name">Solana <span className="v3-status-badge">Planned</span></div><div className="v3-status-desc">Fast-moving meme markets, planned next.</div></div>
          </div>
        </div>
      </Reveal>

      <div className="v3-foot">
        <div className="v3-wrap">
          <div className="v3-foot-in">
            <span>© 2026 yieldr · agent os for onchain funds</span>
            <div className="v3-foot-r">
              <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">x</a>
              <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer">github</a>
              <Link href="/v2/prelaunch-edge">reserve genesis access</Link>
            </div>
          </div>
          <div className="v3-legal">
            Nothing on this site constitutes an offer to sell or solicitation to buy any security or financial instrument, or financial advice of any kind. Performance data reflects Yieldr project capital, not external depositor capital. Past performance is not indicative of future results. Not available to residents of the United States, United Kingdom, Canada, China, or jurisdictions where offering crypto financial services is restricted.
          </div>
        </div>
      </div>
    </div>
  );
}
