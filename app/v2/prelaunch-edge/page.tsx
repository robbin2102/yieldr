'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../v2.css';
import './pe2.css';

type Billing = 'm' | 'a';

const PRICES = {
  Scout: { m: 50, a: 38 },
  Trader: { m: 100, a: 75 },
  Desk: { m: 199, a: 149 },
};

const PLANS = [
  {
    name: 'Scout' as const,
    tag: 'The insurance tier — for one wallet, one clear answer',
    credits: '1M',
    features: ['1 wallet, full Edge Grade', 'Entry / Exit / Sizing breakdown + agent chat', 'No live Terminal, no real-time alerts'],
  },
  {
    name: 'Trader' as const,
    tag: 'Full terminal, live alerts, built for daily use',
    credits: '5M',
    features: ['Everything in Scout, 3 wallets tracked', 'Full Quant Terminal — signals, chart lenses, leaderboard', 'Live alerts: pullback setups, OG exits, dev dumps'],
    featured: true,
  },
  {
    name: 'Desk' as const,
    tag: 'Unlimited wallets, priority signal delivery',
    credits: '15M',
    features: ['Everything in Trader, unlimited wallets', 'Priority / lowest-latency signal delivery', 'First access to new markets (2027)'],
  },
];

const FAQ_ITEMS = [
  {
    q: 'Is the demo above my real wallet?',
    a: "No — it's a scripted walkthrough on a sample wallet, so you can see exactly how the product works before Quant Agent goes live in Q4 2026. Once it's live, this becomes a real scan of your own wallet.",
  },
  {
    q: 'Am I buying a token right now?',
    a: "No. You're prepaying for the Quant Terminal subscription, same as any SaaS pre-order. The 1x–2x token reward is a bonus tied to your subscription, not a separate token sale.",
  },
  {
    q: 'When am I actually charged, and when does access start?',
    a: "You're charged once, today, either way — nothing runs between now and Terminal's Q1 2027 launch. Monthly plans reserve your first month at the Genesis rate; billing then auto-renews monthly once Terminal goes live. Annual plans prepay the full 12 months today, so there's nothing else to pay for that whole first year.",
  },
  {
    q: 'Does Yieldr ever trade for me?',
    a: 'No. Yieldr is intelligence only — read-only wallet analysis and market signals. It never custodies funds or executes trades on your behalf.',
  },
  {
    q: 'What happens after my access period ends?',
    a: "Monthly plans auto-renew at your locked Genesis rate until you cancel. Annual plans simply end after 12 months — renewing after that means resubscribing at the public rate.",
  },
];

function animateCount(setter: (v: number) => void, target: number, dur: number) {
  const t0 = performance.now();
  function step(t: number) {
    const p = Math.min(1, (t - t0) / dur);
    setter(Math.floor(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export default function V2PrelaunchEdgePage() {
  const [billing, setBilling] = useState<Billing>('m');
  const [faqOpen, setFaqOpen] = useState<Set<number>>(new Set([0]));
  const [members, setMembers] = useState(0);
  const [arr, setArr] = useState(0);
  const [slotsTotal, setSlotsTotal] = useState(1000);

  useEffect(() => {
    fetch('/api/site-stats').then(r => r.json()).then(d => {
      const stats = d?.data ?? {};
      animateCount(setMembers, stats.genesisMembers ?? 0, 1200);
      animateCount(setArr, stats.prelaunchArr ?? 0, 1200);
      setSlotsTotal(stats.genesisSlotsTotal ?? 1000);
    }).catch(() => {});
  }, []);

  return (
    <div className="v2-root pe2-root">
      <div className="v2-devbar">
        Design review build — wallet connect &amp; payment are disabled here. <Link href="/">Back to production →</Link>
      </div>

      <div className="v2-nav">
        <div className="v2-wrap v2-nav-in">
          <div className="v2-nav-id">
            <Link href="/v2" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
              <div className="v2-nav-mark"><span /></div>
              <div className="v2-nav-name">Yieldr</div>
              <div className="v2-nav-tag">v2</div>
            </Link>
          </div>
          <div className="v2-nav-right">
            <div className="v2-nav-links">
              <Link href="/v2">Home</Link>
              <Link href="/v2/explorer">Vaults</Link>
              <Link href="/v2/build-in-public">Build Log</Link>
              <Link href="/v2/docs">Docs</Link>
            </div>
            <button className="v2-nav-cta" disabled title="Wallet connect disabled in design review">Connect Wallet</button>
          </div>
        </div>
      </div>

      <div className="pe2-hero">
        <div className="v2-wrap">
          <div className="v2-eyebrow"><span className="dot" />Reserve now · Quant Agent goes live Q4 2026</div>
          <h1 className="v2-h1">Become an early subscriber, <em>before</em> it goes live.</h1>
          <p className="v2-hero-sub">
            Quant Agent launches Q4 2026. Lock Genesis pricing today with one payment — pay nothing else until
            Quant Terminal ships — and earn 1x–2x back in tokens either way.
          </p>
          <div className="v2-hero-ctas">
            <a href="#pricing" className="v2-btn-p">Reserve Genesis Access →</a>
            <a href="#grade" className="v2-btn-s">See a sample Edge Grade ↓</a>
          </div>
          <div className="v2-hero-note">One payment, today · nothing charged again until Quant Terminal launches</div>
        </div>
      </div>

      <div className="v2-ticker">
        <div className="v2-wrap v2-ticker-grid">
          <div className="v2-tick">
            <div className="v2-tick-lbl">Genesis Members</div>
            <div className="v2-tick-val is-accent v2-num">{members}</div>
            <div className="v2-tick-src">of {slotsTotal.toLocaleString('en-US')} slots</div>
          </div>
          <div className="v2-tick">
            <div className="v2-tick-lbl">Prelaunch ARR</div>
            <div className="v2-tick-val is-accent v2-num">${arr.toLocaleString('en-US')}</div>
            <div className="v2-tick-src">from onchain USDC receipts</div>
          </div>
          <div className="v2-tick">
            <div className="v2-tick-lbl">Reward Range</div>
            <div className="v2-tick-val is-accent v2-num">1.0x – 2.0x</div>
            <div className="v2-tick-src">paid back in tokens at TGE</div>
          </div>
        </div>
      </div>

      <div className="v2-sec" id="grade">
        <div className="v2-wrap">
          <div className="v2-slbl">Quant Agent</div>
          <h2 className="v2-sec-h">This is what your edge looks like.</h2>
          <p className="v2-sec-p">One composite score, three graded categories underneath it — Entry, Exit, and Sizing, each weighted by how much it actually predicts your results.</p>
          <div className="pe2-grade-card">
            <div className="pe2-grade-score">
              <div className="pe2-grade-num v2-num">76<span>/100</span></div>
              <div className="pe2-grade-tag">Strong Edge · +15 vs 6wk ago</div>
            </div>
            <div className="pe2-grade-bars">
              <div className="pe2-grade-bar"><span>Exit</span><div className="pe2-bar-track"><div className="pe2-bar-fill" style={{ width: '40%' }} /></div><b>40%</b></div>
              <div className="pe2-grade-bar"><span>Sizing</span><div className="pe2-bar-track"><div className="pe2-bar-fill" style={{ width: '35%' }} /></div><b>35%</b></div>
              <div className="pe2-grade-bar"><span>Entry</span><div className="pe2-bar-track"><div className="pe2-bar-fill" style={{ width: '25%' }} /></div><b>25%</b></div>
            </div>
          </div>
        </div>
      </div>

      <div className="v2-sec">
        <div className="v2-wrap">
          <div className="v2-slbl">Where It Runs</div>
          <h2 className="v2-sec-h">Scan a wallet on either chain.</h2>
          <p className="v2-sec-p">Yieldr reads onchain history natively — connect any wallet on these networks once Quant Agent launches, and the agent picks up your full trade history automatically.</p>
          <div className="v2-chain-grid">
            <div className="v2-chain-card">
              <div className="v2-chain-logo"><img src="/images/base.png" alt="Base" /></div>
              <div>
                <div className="v2-chain-name">Base <span className="v2-chain-badge is-building">In Development</span></div>
                <div className="v2-chain-desc">Meme &amp; alt coin history, OG wallet tracking, and the Quant Terminal — the first chain supported at launch.</div>
              </div>
            </div>
            <div className="v2-chain-card">
              <div className="v2-chain-logo"><img src="/images/hood.png" alt="Robinhood Chain" /></div>
              <div>
                <div className="v2-chain-name">Robinhood Chain <span className="v2-chain-badge is-building">In Development</span></div>
                <div className="v2-chain-desc">Wallet scans extending to tokenized-equity activity as that market grows.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="v2-sec" id="pricing">
        <div className="v2-wrap">
          <div className="v2-slbl">Genesis Pricing</div>
          <h2 className="v2-sec-h">Pay once now. Pricing locks.</h2>
          <p className="v2-sec-p">
            Nothing is charged between now and Terminal's Q1 2027 launch either way. Monthly locks your first
            month at the Genesis rate, then auto-renews from launch. Annual prepays the full 12 months today
            at a lower rate.
          </p>
          <div className="pe2-billing-toggle">
            <button className={billing === 'm' ? 'is-active' : ''} onClick={() => setBilling('m')}>Monthly</button>
            <button className={billing === 'a' ? 'is-active' : ''} onClick={() => setBilling('a')}>Annual <span>saves up to 25%</span></button>
          </div>
          <div className="pe2-plan-grid">
            {PLANS.map((p) => (
              <div className={`pe2-plan-card${p.featured ? ' is-featured' : ''}`} key={p.name}>
                {p.featured && <div className="pe2-plan-badge">Most Reserved</div>}
                <div className="pe2-plan-name">{p.name}</div>
                <div className="pe2-plan-tag">{p.tag}</div>
                <div className="pe2-plan-price">${PRICES[p.name][billing]}<span>/mo</span></div>
                <div className="pe2-plan-credits">⚡ {p.credits} agent inference credits / mo</div>
                <ul className="pe2-plan-features">
                  {p.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
                <button className="v2-btn-p" style={{ width: '100%' }} disabled title="Payment disabled in design review">
                  Reserve {p.name}
                </button>
                <div className="pe2-plan-reward">🎁 Genesis reward: 1x–2x back in $YLDR at TGE</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="v2-sec">
        <div className="v2-wrap">
          <div className="v2-slbl">Before You Reserve</div>
          <h2 className="v2-sec-h">Questions, answered honestly.</h2>
          <div className="pe2-faq">
            {FAQ_ITEMS.map((f, i) => (
              <div className="pe2-faq-item" key={f.q}>
                <button
                  className="pe2-faq-q"
                  onClick={() => setFaqOpen((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                >
                  {f.q}
                  <span>{faqOpen.has(i) ? '−' : '+'}</span>
                </button>
                {faqOpen.has(i) && <div className="pe2-faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="v2-sec" style={{ borderBottom: 'none', textAlign: 'center' }}>
        <div className="v2-wrap">
          <h2 className="v2-sec-h" style={{ margin: '0 auto 16px', maxWidth: '28ch' }}>The price goes up at launch. Lock it in before then.</h2>
          <p className="v2-sec-p" style={{ margin: '0 auto 30px' }}>One payment today, nothing charged again until Quant Terminal ships — plus 1x–2x back in tokens.</p>
          <a href="#pricing" className="v2-btn-p">Reserve Genesis Access →</a>
        </div>
      </div>

      <div className="v2-foot">
        <div className="v2-wrap v2-foot-in">
          <div className="v2-foot-l">© 2026 Yieldr · Agent OS for onchain funds</div>
          <div className="v2-foot-r">
            <Link href="/v2">Home</Link>
            <Link href="/v2/explorer">Vaults</Link>
            <Link href="/v2/docs">Docs</Link>
            <Link href="/v2/build-in-public">Build Log</Link>
            <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">X</a>
          </div>
        </div>
      </div>
    </div>
  );
}
