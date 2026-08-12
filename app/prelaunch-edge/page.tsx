'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import './page.css';
import { NAV_MARK, CRED_BADGE, EDGE_B64, AVATARS } from './images';

// [isWin, heightPct] — static trade bars for the overview chart
const TRADE_BARS: [boolean, number][] = [
  [true,55],[false,28],[true,70],[true,45],[true,82],[true,38],
  [false,45],[true,60],[true,35],[true,72],[false,20],[true,48],
  [true,88],[true,52],[false,35],[true,65],[true,42],[true,75],
  [true,30],[false,55],[true,68],[true,50],[true,85],[false,25],
  [true,58],[true,40],[true,78],[false,30],[true,62],[true,47],
  [true,90],[false,38],[true,55],[true,70],[false,22],[true,48],
  [true,65],[true,33],[false,42],[true,80],[true,58],[true,45],
  [false,28],[true,72],[true,52],[true,68],[true,40],[true,85],
];

const AGENT_TABS = ['overview', 'entry', 'exit', 'sizing'] as const;
type AgentTab = (typeof AGENT_TABS)[number];
type TermTab = 'leaders' | 'signals' | 'alerts';
type Billing = 'm' | 'a';

const PRICES = {
  Scout:  { m: 50,  a: 38 },
  Trader: { m: 100, a: 75 },
  Desk:   { m: 199, a: 149 },
};

const FAQ_ITEMS = [
  {
    q: 'Am I buying a token right now?',
    a: "No. You're prepaying for the Quant Agent and Terminal subscription, same as any SaaS pre-order. The 1x–2x token reward is a bonus tied to your subscription, not a separate token sale.",
  },
  {
    q: 'When am I actually charged?',
    a: 'Once, today — your Genesis payment. Your subscription doesn\'t start running until the beta product goes live, so there are no charges between now and launch. What you pay today is credited against your first billing period once the product launches.',
  },
  {
    q: 'Does Yieldr ever trade for me?',
    a: 'No. Yieldr is intelligence only — read-only wallet analysis and market signals. It never custodies funds or executes trades on your behalf.',
  },
  {
    q: 'What if I don\'t renew after the free trial?',
    a: 'Your Genesis reward is earned by your prepayment today, not by staying subscribed forever. Product access requires an active subscription once the free trial ends at public launch.',
  },
];

function animateCount(
  setter: (v: number) => void,
  target: number,
  dur: number,
) {
  const t0 = performance.now();
  function step(t: number) {
    const p = Math.min(1, (t - t0) / dur);
    setter(Math.floor(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export default function PrelaunchEdgePage() {
  const [billing, setBilling] = useState<Billing>('m');
  const [agentTab, setAgentTab] = useState<AgentTab>('overview');
  const [agentIdx, setAgentIdx] = useState(0);
  const [termTab, setTermTab] = useState<TermTab>('leaders');
  const [scanActive, setScanActive] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [faqOpen, setFaqOpen] = useState<Set<number>>(new Set([0]));
  const [scans, setScans] = useState(0);
  const [buyers, setBuyers] = useState(0);
  const [arr, setArr] = useState(0);
  const [progAnimating, setProgAnimating] = useState(true);

  const agentAutoRef = useRef(true);
  const agentPausedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Ticker animation
  useEffect(() => {
    animateCount(setScans, 4812, 1400);
    animateCount(setBuyers, 347, 1600);
    animateCount(setArr, 38200, 1600);
  }, []);

  // Agent tab auto-rotation
  useEffect(() => {
    if (!agentAutoRef.current) return;
    setProgAnimating(false);
    requestAnimationFrame(() => setProgAnimating(true));
    const timer = setInterval(() => {
      if (!agentAutoRef.current || agentPausedRef.current) return;
      setAgentIdx(prev => {
        const next = (prev + 1) % AGENT_TABS.length;
        setAgentTab(AGENT_TABS[next]);
        setProgAnimating(false);
        requestAnimationFrame(() => setProgAnimating(true));
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSetAgentTab = useCallback((tab: AgentTab, idx: number) => {
    agentAutoRef.current = false;
    setAgentTab(tab);
    setAgentIdx(idx);
  }, []);

  const startScan = useCallback(() => {
    if (scanActive) return;
    setScanLoading(true);
    setTimeout(() => {
      setScanLoading(false);
      setScanActive(true);
      if (iframeRef.current) {
        iframeRef.current.src = `data:text/html;base64,${EDGE_B64}`;
      }
    }, 1200);
  }, [scanActive]);

  const closeScan = useCallback(() => {
    setScanActive(false);
    if (iframeRef.current) iframeRef.current.src = '';
  }, []);

  const toggleFaq = useCallback((idx: number) => {
    setFaqOpen(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }, []);

  const scrollToPricing = () => {
    document.getElementById('pe-pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pe-root">
      {/* NAV */}
      <nav className="pe-nav">
        <div className="pe-wrap pe-nav-in">
          <div className="pe-nav-id">
            <div className="pe-nav-mark">
              <img src={NAV_MARK} alt="Yieldr" />
            </div>
            <span className="pe-nav-name">YIELDR</span>
          </div>
          <button className="pe-nav-cta" onClick={startScan}>Scan My Wallet</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="pe-hero">
        <div className="pe-wrap">
          <span className="pe-eyebrow">
            <span className="pe-dot" />
            Genesis window open · closes in 30 days or 1,000 members
          </span>
          <h1 className="pe-h1">Find Your <em>Edge</em>, Onchain.</h1>
          <p className="pe-hero-sub">
            A quant agent that grades your onchain entries, exits, and sizing. A live terminal that watches OG wallets and demand shifts before they move markets.
          </p>
          <div className="pe-hero-ctas">
            <button
              className={`pe-btn-p${scanLoading ? ' pe-loading' : ''}`}
              onClick={startScan}
            >
              <span className="pe-spin" />
              <span className="pe-lbl">Scan My Wallet →</span>
            </button>
            <button className="pe-btn-s" onClick={scrollToPricing}>See Genesis Pricing</button>
          </div>
          <div className="pe-hero-note">
            Connect a read-only wallet · nothing custodied, nothing traded on your behalf · ~30 seconds
          </div>

          <div className={`pe-console${scanActive ? ' active' : ''}`}>
            <div className="pe-console-hd">
              <span className="pe-lbl">● Live · scanning onchain history</span>
              <button className="pe-console-close" onClick={closeScan}>Close ✕</button>
            </div>
            <div>
              <iframe ref={iframeRef} title="Edge Analysis" style={{ width: '100%', height: 760, border: 'none', display: 'block', background: '#000' }} />
            </div>
          </div>
        </div>
      </div>

      {/* LIVE TICKER */}
      <div className="pe-ticker">
        <div className="pe-wrap pe-ticker-in">
          <div className="pe-tick-cell">
            <div className="pe-tick-lbl"><span className="pe-ld" />Wallets Scanned</div>
            <div className="pe-tick-val pe-num">{scans.toLocaleString()}</div>
            <div className="pe-tick-src">live · this session</div>
          </div>
          <div className="pe-tick-cell">
            <div className="pe-tick-lbl">Genesis Members</div>
            <div className="pe-tick-val pe-num win">{buyers.toLocaleString()}</div>
            <div className="pe-tick-src">of 1,000 slots</div>
          </div>
          <div className="pe-tick-cell">
            <div className="pe-tick-lbl">Prelaunch ARR</div>
            <div className="pe-tick-val pe-num">${arr.toLocaleString()}</div>
            <div className="pe-tick-src">from onchain USDC receipts</div>
          </div>
        </div>
      </div>

      {/* QUANT AGENT SHOWCASE */}
      <div className="pe-sec" style={{ paddingTop: 60 }} id="pe-agent">
        <div className="pe-wrap">
          <div className="pe-slbl"><span>Quant Agent</span><span className="pe-ln" /></div>
          <h2 className="pe-sec-h">This is what your edge looks like — under the hood.</h2>
          <p className="pe-sec-p">One composite score, three graded categories underneath it — Entry, Exit, and Sizing, each weighted by how much it actually predicts your results.</p>

          <div
            className="pe-showcase"
            onMouseEnter={() => { agentPausedRef.current = true; }}
            onMouseLeave={() => { agentPausedRef.current = false; }}
          >
            <div className="pe-sc-tabs">
              {(['Overview', 'Entry', 'Exit', 'Sizing'] as const).map((label, i) => {
                const tabKey = AGENT_TABS[i];
                const isOn = agentTab === tabKey;
                const pct = ['', '25%', '40%', '35%'][i];
                return (
                  <button
                    key={tabKey}
                    className={`pe-sc-tab${isOn ? ' on' : ''}`}
                    onClick={() => handleSetAgentTab(tabKey, i)}
                  >
                    {label}{pct && <span className="pe-n">{pct}</span>}
                    {isOn && (
                      <div
                        className={`pe-sc-progress${progAnimating ? ' animating' : ''}`}
                        style={{ width: progAnimating ? '100%' : '0%' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Overview */}
            <div className={`pe-sc-body pe-sc-panel${agentTab === 'overview' ? ' on' : ''}`}>
              <div className="pe-sc-text">
                <span className="pe-tag">Your Edge, Composite</span>
                <h3>76 out of 100 — a real, repeatable edge</h3>
                <p>Not a vibe check. A weighted composite pulled straight from onchain trade history, benchmarked against 2,400 meme &amp; alt traders.</p>
              </div>
              <div>
                <div className="pe-hb-row">
                  <div className="pe-hero-figure">
                    <span className="pe-hero-num">76</span>
                    <span className="pe-hero-max">/ 100</span>
                    <span className="pe-hero-badge">Strong Edge</span>
                  </div>
                  <div className="pe-hero-side"><span className="pe-hero-delta">▲ +15 vs 6wk ago</span></div>
                </div>
                <div className="pe-hero-cohort">Better edge than <b>8 in 10</b> meme &amp; alt traders we track.</div>
                <div className="pe-hero-verdict">You&apos;ve got a <span className="hl">real, repeatable edge</span> — carried by elite exits, held back by occasional sniping.</div>
                <div className="pe-hero-weights">
                  <div className="pe-hw-item"><span className="pe-hw-dot" style={{ background: 'var(--win)' }} />Exit — 40% of grade</div>
                  <div className="pe-hw-item"><span className="pe-hw-dot" style={{ background: 'var(--warn)' }} />Sizing — 35% of grade</div>
                  <div className="pe-hw-item"><span className="pe-hw-dot" style={{ background: 'var(--agent)' }} />Entry — 25% of grade</div>
                </div>
              </div>
              <div className="pe-trade-chart">
                <div className="pe-trade-bars">
                  {TRADE_BARS.map(([win, h], i) => (
                    <div key={i} className={`pe-trade-bar${win ? ' win' : ' loss'}`} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="pe-trade-chart-ft">
                  <span>Every trade, last 90 days</span>
                  <span>293 of 293 shown</span>
                </div>
              </div>
            </div>

            {/* Entry */}
            <div className={`pe-sc-body pe-sc-panel${agentTab === 'entry' ? ' on' : ''}`}>
              <div className="pe-sc-text">
                <span className="pe-tag">Entry · 25% of grade</span>
                <h3>You wait for the dip — and it pays off</h3>
                <p>Every buy classified by setup. Waiting for a pullback wins almost 3x more than sniping the launch — the data settles the argument you have with yourself every time.</p>
              </div>
              <div>
                <div className="pe-cat-hd-mini">
                  <div className="pe-cat-hd-l">
                    <div className="pe-cat-ic">🎯</div>
                    <div>
                      <div className="pe-cat-name">Entry — When You Buy</div>
                      <div className="pe-cat-sub">How your timing on the way in affects the outcome</div>
                    </div>
                  </div>
                  <div className="pe-cat-hd-r">
                    <span className="pe-cat-weight">25% of grade</span>
                    <span className="pe-cat-grade warn">Needs Work</span>
                  </div>
                </div>
                <div className="pe-type-row loss">
                  <div className="pe-type-label">Sniped the launch</div>
                  <div className="pe-type-track"><div className="pe-type-fill loss" style={{ width: '24%' }} /></div>
                  <div className="pe-type-meta"><span className="wr">24 / 100 win</span><span className="amt loss">-$1,850</span></div>
                </div>
                <div className="pe-type-row win">
                  <div className="pe-type-label">Waited for a dip</div>
                  <div className="pe-type-track"><div className="pe-type-fill win" style={{ width: '63%' }} /></div>
                  <div className="pe-type-meta"><span className="wr">63 / 100 win</span><span className="amt win">+$5,700</span></div>
                </div>
                <div className="pe-type-row">
                  <div className="pe-type-label">Chased a breakout</div>
                  <div className="pe-type-track"><div className="pe-type-fill warn" style={{ width: '38%' }} /></div>
                  <div className="pe-type-meta"><span className="wr">38 / 100 win</span><span className="amt loss">-$310</span></div>
                </div>
                <div className="pe-pattern loss">
                  <div className="pe-pattern-txt">
                    <b className="loss">Sniping is your #1 leak.</b> 17 trades bought in the first 15 minutes. Result: -$1,850, only 1 in 4 won.
                    <div className="pe-pattern-chips">
                      <span className="pe-pchip flat">⚠ no better than 60 days ago</span>
                      <span className="pe-pchip n">17 trades · enough to trust</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exit */}
            <div className={`pe-sc-body pe-sc-panel${agentTab === 'exit' ? ' on' : ''}`}>
              <div className="pe-sc-text">
                <span className="pe-tag">Exit · 40% of grade</span>
                <h3>Elite exits — this is what carries your edge</h3>
                <p>You capture 50% of a token&apos;s peak on average. Most traders we track only get 14%. This one category is doing most of the work.</p>
              </div>
              <div>
                <div className="pe-cat-hd-mini">
                  <div className="pe-cat-hd-l">
                    <div className="pe-cat-ic">💰</div>
                    <div>
                      <div className="pe-cat-name">Exit — When You Sell</div>
                      <div className="pe-cat-sub">How much of the move you actually capture</div>
                    </div>
                  </div>
                  <div className="pe-cat-hd-r">
                    <span className="pe-cat-weight">40% of grade</span>
                    <span className="pe-cat-grade">Elite</span>
                  </div>
                </div>
                <div className="pe-cap-wrap">
                  <div className="pe-cap-lbl-row"><span>Peak captured</span><span><b>50%</b> of the way to the top, on average</span></div>
                  <div className="pe-cap-track">
                    <div className="pe-cap-fill" style={{ width: '50%' }} />
                    <div className="pe-cap-mark" style={{ left: '14%' }} />
                    <div className="pe-cap-mark-lbl" style={{ left: '14%' }}>avg trader: 14%</div>
                  </div>
                </div>
                <div className="pe-cap-wrap" style={{ marginTop: 28 }}>
                  <div className="pe-cap-lbl-row"><span>Round-trip rate</span><span><b>13%</b> of winners turn into losers</span></div>
                  <div className="pe-cap-track">
                    <div className="pe-cap-fill warn" style={{ width: '13%' }} />
                    <div className="pe-cap-mark" style={{ left: '52%' }} />
                    <div className="pe-cap-mark-lbl" style={{ left: '52%' }}>avg trader: 52%</div>
                  </div>
                </div>
                <div style={{ marginTop: 28 }}>
                  <div className="pe-cap-lbl-row"><span>How you exit winners</span><span /></div>
                  <div className="pe-seg-bar">
                    <div className="pe-seg" style={{ background: 'var(--win)', width: '70%' }} />
                    <div className="pe-seg" style={{ background: 'var(--ink-3)', width: '18%' }} />
                    <div className="pe-seg" style={{ background: 'var(--loss)', width: '12%' }} />
                  </div>
                  <div className="pe-seg-legend">
                    <div className="pe-seg-item"><span className="pe-dot-sq" style={{ background: 'var(--win)' }} />Sold in pieces — 70%</div>
                    <div className="pe-seg-item"><span className="pe-dot-sq" style={{ background: 'var(--ink-3)' }} />Sold all at once — 18%</div>
                    <div className="pe-seg-item"><span className="pe-dot-sq" style={{ background: 'var(--loss)' }} />Held too long — 12%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sizing */}
            <div className={`pe-sc-body pe-sc-panel${agentTab === 'sizing' ? ' on' : ''}`}>
              <div className="pe-sc-text">
                <span className="pe-tag">Sizing · 35% of grade</span>
                <h3>You size up on conviction — that&apos;s not luck</h3>
                <p>You bet 2.1x more on trades that end up winning than ones that end up losing. That&apos;s a real, repeatable signal, measurable across hundreds of trades — not hindsight.</p>
              </div>
              <div>
                <div className="pe-cat-hd-mini">
                  <div className="pe-cat-hd-l">
                    <div className="pe-cat-ic">⚖️</div>
                    <div>
                      <div className="pe-cat-name">Sizing — How Much You Bet</div>
                      <div className="pe-cat-sub">Whether your conviction matches your outcomes</div>
                    </div>
                  </div>
                  <div className="pe-cat-hd-r">
                    <span className="pe-cat-weight">35% of grade</span>
                    <span className="pe-cat-grade">Solid</span>
                  </div>
                </div>
                <div className="pe-ladder">
                  <div className="pe-ladder-row">
                    <div className="pe-ladder-label">On winners</div>
                    <div className="pe-ladder-track"><div className="pe-ladder-fill win" style={{ width: '100%' }}><span>$612 avg</span></div></div>
                  </div>
                  <div className="pe-ladder-row">
                    <div className="pe-ladder-label">On losers</div>
                    <div className="pe-ladder-track"><div className="pe-ladder-fill loss" style={{ width: '47%' }}><span>$290 avg</span></div></div>
                  </div>
                </div>
                <div className="pe-ladder-ratio">You bet 2.1x more on winners than losers — real conviction sizing.</div>
                <div className="pe-spectrum">
                  <div className="pe-spectrum-lbl"><span>Erratic</span><span>Disciplined</span></div>
                  <div className="pe-spectrum-track"><div className="pe-spectrum-marker" style={{ left: '82%' }} /></div>
                  <div className="pe-spectrum-tag">Disciplined bettor — low erratic sizing (CoV 0.28)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUANT TERMINAL SHOWCASE */}
      <div className="pe-sec" style={{ paddingTop: 0 }}>
        <div className="pe-wrap">
          <div className="pe-slbl"><span>Quant Terminal</span><span className="pe-ln" /></div>
          <h2 className="pe-sec-h">The same agent, watching every wallet worth watching.</h2>
          <p className="pe-sec-p">Works natively across FOMO and pump.fun — the two apps meme traders actually live in — so top-trader edge, demand/supply signals, and alerts all sit in one feed instead of ten open tabs.</p>

          <div className="pe-showcase">
            <div className="pe-sc-tabs">
              {(['leaders', 'signals', 'alerts'] as TermTab[]).map((t, i) => (
                <button
                  key={t}
                  className={`pe-sc-tab${termTab === t ? ' on' : ''}`}
                  onClick={() => setTermTab(t)}
                >
                  {['Top Trader Edge', 'Demand & Supply', 'Agent Alerts'][i]}
                </button>
              ))}
            </div>

            {/* Leaders */}
            <div className={`pe-sc-body pe-sc-panel${termTab === 'leaders' ? ' on' : ''}`}>
              <div className="pe-sc-text">
                <span className="pe-tag">Ranked By Edge, Not Followers</span>
                <h3>See exactly how top traders print on FOMO and pump.fun</h3>
                <p>The agent tracks wallets across both apps meme traders actually live in, and reasons on the ones actually making money — ranked by validated edge score and real PnL, not follower count.</p>
              </div>
              <div>
                <div className="pe-lbd-hd">
                  <span className="pe-cat-name" style={{ fontSize: 13 }}>Traders · Ranked by Edge Score</span>
                  <span className="pe-lbd-pnl">PNL WINDOW: 7D</span>
                </div>
                {[
                  { name: 'loganlim_x', app: 'FOMO', edge: 78, pnl: '+$974.8K', win: true, av: AVATARS[0] },
                  { name: 'theveeman', app: 'FOMO', edge: 71, pnl: '+$835.8K', win: true, av: AVATARS[1] },
                  { name: 'PoorGoat_', app: 'FOMO', edge: 64, pnl: '+$1.55M', win: true, av: AVATARS[2] },
                  { name: 'SolSwizzle', app: 'pump.fun', edge: 12, pnl: '+$95', win: true, av: AVATARS[3] },
                  { name: 'formlesscrab125', app: 'pump.fun', edge: 8, pnl: '-$181.1K', win: false, av: AVATARS[4] },
                ].map(row => (
                  <div className="pe-lb2-row" key={row.name}>
                    <div className="pe-lb2-av"><img src={row.av} alt="" /></div>
                    <div className="pe-lb2-name">
                      {row.name}
                      <span className="pe-lb2-app">
                        <img src={row.app === 'FOMO' ? '/images/fomo.png' : '/images/pump.png'} alt={row.app} />
                      </span>
                    </div>
                    <div className="pe-lb2-edge">EDGE <b>{row.edge}</b></div>
                    <div className="pe-lb2-pnl" style={{ color: row.win ? 'var(--win)' : 'var(--loss)' }}>{row.pnl}</div>
                  </div>
                ))}
                <div className="pe-app-legend">
                  <div className="pe-app-legend-item">
                    <img src="/images/pump.png" alt="" />Tracked on pump.fun
                  </div>
                </div>
              </div>
            </div>

            {/* Demand & Supply */}
            <div className={`pe-sc-body pe-sc-panel${termTab === 'signals' ? ' on' : ''}`}>
              <div className="pe-sc-text">
                <span className="pe-tag">Demand vs Supply</span>
                <h3>Be the first to know who&apos;s pumping it — and who&apos;s dumping it</h3>
                <p>Every coin gets the same read: real OG accumulation vs deployer-funded dumping, side by side, so you&apos;re never the last one to find out a team is exiting into strength.</p>
              </div>
              <div>
                <div className="pe-pair-cols">
                  <div>
                    <div className="pe-pair-hd" style={{ color: 'var(--win)' }}>▲ CASHCAT · Accumulation</div>
                    <div className="pe-flow-row">
                      <div className="pe-flow-cell">
                        <div className="pe-flow-k">Net OG Flow</div>
                        <div className="pe-flow-v" style={{ color: 'var(--win)' }}>+$62.8K</div>
                        <div className="pe-flow-sub">34 buys / 4 sells · 5m</div>
                      </div>
                      <div className="pe-flow-cell">
                        <div className="pe-flow-k">Buyer Growth</div>
                        <div className="pe-flow-v" style={{ color: 'var(--win)' }}>+62 net</div>
                        <div className="pe-flow-sub">15m window</div>
                      </div>
                    </div>
                    <div className="pe-sig">
                      <div className="pe-sig-top">🔺 OG Influx</div>
                      <div className="pe-sig-num">+$61.4K bought · 20 of 52 OGs</div>
                      <div className="pe-sig-txt">38% of tracked OGs added this hour, zero net exits.</div>
                      <div className="pe-sig-prob">86% ± 7% · High confidence</div>
                    </div>
                  </div>
                  <div>
                    <div className="pe-pair-hd" style={{ color: 'var(--loss)' }}>▼ MYRAD · Distribution</div>
                    <div className="pe-flow-row">
                      <div className="pe-flow-cell">
                        <div className="pe-flow-k">Net OG Flow</div>
                        <div className="pe-flow-v" style={{ color: 'var(--loss)' }}>-$41.2K</div>
                        <div className="pe-flow-sub">3 buys / 19 sells · 5m</div>
                      </div>
                      <div className="pe-flow-cell">
                        <div className="pe-flow-k">Buyer Growth</div>
                        <div className="pe-flow-v" style={{ color: 'var(--loss)' }}>-8 net</div>
                        <div className="pe-flow-sub">15m window</div>
                      </div>
                    </div>
                    <div className="pe-sig loss">
                      <div className="pe-sig-top">🔻 Dev/Team Bundle Dump</div>
                      <div className="pe-sig-num">$12.4K sold · 0 buys · 3 wallets</div>
                      <div className="pe-sig-txt">Cumulative since launch: $94.2K across 23 wallets.</div>
                      <div className="pe-sig-prob">86% ± 7% · High confidence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Alerts */}
            <div className={`pe-sc-body pe-sc-panel${termTab === 'alerts' ? ' on' : ''}`}>
              <div className="pe-sc-text">
                <span className="pe-tag">One Agent, Every Source</span>
                <h3>Reasoning across signals and X, so you don&apos;t have to</h3>
                <p>No more five terminals and ten open tabs. The agent synthesizes onchain flow with social chatter into one plain-language read — and flags risk before anyone pitches you the &quot;next CASHCAT.&quot;</p>
              </div>
              <div>
                <div className="pe-chat-feed">
                  <div className="pe-chat-card synth">
                    <div className="pe-chat-tag">◆ Yieldr Agent — Synthesis</div>
                    <div className="pe-chat-body">Two bullish signals are firing together on <b>CASHCAT</b>: OGs are accumulating while new buyer growth runs 4x+ baseline. That convergence is what genuine organic growth looks like — not just a volume spike.</div>
                  </div>
                  <div className="pe-chat-card up">
                    <div className="pe-chat-tag">▲ Demand Ignition</div>
                    <div className="pe-chat-body"><b>+62 new wallets/15m · 4.2x baseline.</b> New holders, OG buying, and social chatter all rising together.</div>
                  </div>
                  <div className="pe-chat-card risk">
                    <div className="pe-chat-tag">⚠ Yieldr Agent — Risk</div>
                    <div className="pe-chat-body"><b>MYRAD</b> looks the opposite of CASHCAT right now: $12.4K sold in the last hour by wallets that never bought (bundler pattern). Not something you&apos;re holding — but worth knowing before anyone pitches it to you.</div>
                  </div>
                </div>
                <div className="pe-chat-input-row">
                  <div className="pe-chat-input">Ask about a trader, coin, or your edge...</div>
                  <button className="pe-chat-send">→</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CREDIBILITY */}
      <div className="pe-sec" style={{ paddingTop: 0 }}>
        <div className="pe-wrap">
          <div className="pe-slbl"><span>Why Trust This</span><span className="pe-ln" /></div>
          <h2 className="pe-sec-h">Before you pay — who&apos;s actually building this.</h2>
          <div className="pe-cred-grid" style={{ marginTop: 20 }}>
            <a className="pe-cred-card" href="https://x.com/buildonbase/status/2023855121189220609" target="_blank" rel="noopener noreferrer">
              <div className="pe-cred-top">
                <div className="pe-cred-ic">🏆</div>
                <span className="pe-cred-badge"><img src={CRED_BADGE} alt="" />Base Batches 002</span>
              </div>
              <div className="pe-cred-name">Base Batches 002 Winner</div>
              <div className="pe-cred-desc">Selected from 900+ projects for building DeFi infrastructure on Base. Part of the Incubase accelerator. View the announcement →</div>
            </a>
            <a className="pe-cred-card" href="https://www.circuit-accelerator.com/" target="_blank" rel="noopener noreferrer">
              <div className="pe-cred-top">
                <div className="pe-cred-ic">🚀</div>
                <span className="pe-cred-badge"><img src={CRED_BADGE} alt="" />Base × Newcampus</span>
              </div>
              <div className="pe-cred-name">Circuit Accelerator</div>
              <div className="pe-cred-desc">Backed by Base × Newcampus HQ — selected for the Circuit accelerator cohort in Singapore. View the program →</div>
            </a>
            <a className="pe-cred-card" href="https://www.yieldr.org/build-in-public" target="_blank" rel="noopener noreferrer">
              <div className="pe-cred-top">
                <div className="pe-cred-ic">📊</div>
              </div>
              <div className="pe-cred-name">Building in Public</div>
              <div className="pe-cred-desc">Weekly build logs, real treasury data, live trading performance. No sanitisation, no narrative management. See the log →</div>
            </a>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div className="pe-sec" id="pe-pricing">
        <div className="pe-wrap">
          <div className="pe-slbl"><span>Genesis Pricing</span><span className="pe-ln" /></div>
          <h2 className="pe-sec-h">Lock this price before public launch.</h2>
          <p className="pe-sec-p">Genesis subscribers pay this price for as long as they stay subscribed. Public pricing at Q4 launch will be higher.</p>

          <div className="pe-toggle-row">
            <div className="pe-toggle">
              <button className={billing === 'm' ? 'on' : ''} onClick={() => setBilling('m')}>Monthly</button>
              <button className={billing === 'a' ? 'on' : ''} onClick={() => setBilling('a')}>Annual</button>
            </div>
            <span className="pe-save-tag">Annual saves up to 25%</span>
          </div>

          <div className="pe-plans">
            {/* Scout */}
            <div className="pe-plan">
              <div className="pe-plan-name">Scout</div>
              <div className="pe-plan-desc">The insurance tier — for one wallet, one clear answer</div>
              <div className="pe-plan-price">
                <span className="n pe-mono">${PRICES.Scout[billing]}</span>
                <span className="u">/mo</span>
              </div>
              <div className={`pe-plan-orig${billing === 'a' ? ' show' : ''}`}>$600/yr billed monthly</div>
              <div className="pe-plan-credits">⚡ 1M agent inference credits / mo</div>
              <ul>
                <li>Quant Agent — 1 wallet, full Edge Grade</li>
                <li>Entry / Exit / Sizing breakdown + agent chat</li>
                <li>No live Terminal, no real-time alerts</li>
              </ul>
              <button className="pe-plan-btn">Reserve Scout</button>
              <div className="pe-plan-reward">🎁 Genesis reward: 1x–2x back in $YLDR at TGE</div>
            </div>

            {/* Trader */}
            <div className="pe-plan hi">
              <div className="pe-plan-badge">Most Reserved</div>
              <div className="pe-plan-name">Trader</div>
              <div className="pe-plan-desc">Full terminal, live alerts, built for daily use</div>
              <div className="pe-plan-price">
                <span className="n pe-mono">${PRICES.Trader[billing]}</span>
                <span className="u">/mo</span>
              </div>
              <div className={`pe-plan-orig${billing === 'a' ? ' show' : ''}`}>$1,200/yr billed monthly</div>
              <div className="pe-plan-credits">⚡ 5M agent inference credits / mo</div>
              <ul>
                <li>Everything in Scout, 3 wallets tracked</li>
                <li>Full Quant Terminal — signals, chart lenses, leaderboard</li>
                <li>Live alerts: pullback setups, OG exits, dev dumps</li>
              </ul>
              <button className="pe-plan-btn">Reserve Trader</button>
              <div className="pe-plan-reward">🎁 Genesis reward: 1x–2x back in $YLDR at TGE</div>
            </div>

            {/* Desk */}
            <div className="pe-plan">
              <div className="pe-plan-name">Desk</div>
              <div className="pe-plan-desc">Unlimited wallets, priority signal delivery</div>
              <div className="pe-plan-price">
                <span className="n pe-mono">${PRICES.Desk[billing]}</span>
                <span className="u">/mo</span>
              </div>
              <div className={`pe-plan-orig${billing === 'a' ? ' show' : ''}`}>$2,388/yr billed monthly</div>
              <div className="pe-plan-credits">⚡ 20M agent inference credits / mo</div>
              <ul>
                <li>Everything in Trader, unlimited wallets</li>
                <li>Priority / lowest-latency signal delivery</li>
                <li>First access to new markets (predictions, liquidity — 2027)</li>
              </ul>
              <button className="pe-plan-btn">Reserve Desk</button>
              <div className="pe-plan-reward">🎁 Genesis reward: 1x–2x back in $YLDR at TGE</div>
            </div>
          </div>
        </div>
      </div>

      {/* REWARD */}
      <div className="pe-sec" style={{ paddingTop: 0 }}>
        <div className="pe-wrap">
          <div className="pe-reward">
            <div className="pe-reward-grid">
              <div>
                <span className="pe-badge-pill" style={{ color: 'var(--agent)', background: 'var(--agent-dim)', border: '1px solid var(--agent-line)' }}>Genesis Reward</span>
                <h2 className="pe-sec-h" style={{ marginTop: 16, maxWidth: 480 }}>Worst case, you get your money back. Best case, you double it.</h2>
                <p className="pe-sec-p" style={{ maxWidth: 480 }}>Every Genesis subscription is airdropped back in tokens at TGE — somewhere between <b style={{ color: 'var(--ink-1)' }}>1x and 2x</b> what you paid. You keep full product access either way.</p>
                <div className="pe-asset-row">
                  <span className="pe-asset-chip">$YLDR</span>
                  <span className="pe-asset-chip">$SPCX</span>
                  <span className="pe-asset-chip">$TSLA</span>
                </div>
                <div className="pe-reward-fine" style={{ marginTop: 10 }}>Your airdrop may be paid in $YLDR, stock-linked tokens like $SPCX or $TSLA, or a mix of both in value — final composition confirmed before TGE.</div>
              </div>
              <div>
                <div className="pe-reward-range">
                  <div className="pe-rr-box floor"><div className="k">Floor</div><div className="v">1.0x</div></div>
                  <div className="pe-rr-arrow">→</div>
                  <div className="pe-rr-box ceil"><div className="k">Ceiling</div><div className="v">2.0x</div></div>
                </div>
                <div className="pe-reward-fine">Valued in tokens at TGE launch price, distributed to your wallet within 30 days of TGE. Where you land in the range isn&apos;t announced in advance. Final composition and exact terms confirmed before TGE.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="pe-sec" style={{ paddingTop: 0 }}>
        <div className="pe-wrap" style={{ maxWidth: 760, margin: '0 auto', paddingLeft: 28, paddingRight: 28 }}>
          <div className="pe-slbl"><span>Before You Reserve</span><span className="pe-ln" /></div>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`pe-faq-item${faqOpen.has(i) ? ' open' : ''}`}>
              <div className="pe-faq-q" onClick={() => toggleFaq(i)}>
                {item.q}
                <span className="pe-chev">▾</span>
              </div>
              <div className="pe-faq-a"><p>{item.a}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="pe-wrap">
        <div className="pe-final">
          <h2>You can&apos;t fix a leak you can&apos;t see. See yours now.</h2>
          <p>Run your Edge Analysis, see exactly what it finds, then decide.</p>
          <div style={{ marginTop: 26 }}>
            <button className={`pe-btn-p${scanLoading ? ' pe-loading' : ''}`} onClick={startScan}>
              <span className="pe-spin" />
              <span className="pe-lbl">Scan My Wallet →</span>
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="pe-foot">
        <div className="pe-wrap pe-foot-in">
          <div className="pe-foot-l">© 2026 Yieldr · Agent Stack for onchain funds</div>
          <div className="pe-foot-r">
            <a href="#">Docs</a>
            <a href="#">X</a>
            <a href="#">Referral Program</a>
          </div>
        </div>
      </div>
    </div>
  );
}
