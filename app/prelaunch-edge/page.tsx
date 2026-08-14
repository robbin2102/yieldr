'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';
import { NAV_MARK, CRED_BADGE, EDGE_B64, AVATARS, BASE_LOGO, RH_LOGO, FOMO_ICON, PUMP_ICON } from './images';
import { PLAN_PRICES, MONTHS_PER_YEAR, type PlanName } from '@/config/plans';
import { getExplorerUrl, SUPPORTED_CHAINS, type TokenId } from '@/config/payment';
import { usePayment } from '../context/PaymentContext';
import { useSubscriptionPayment } from '@/hooks/useSubscriptionPayment';
import { useAccount, useSwitchChain } from 'wagmi';

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
  Scout:  { m: PLAN_PRICES.Scout.monthly,  a: PLAN_PRICES.Scout.annual },
  Trader: { m: PLAN_PRICES.Trader.monthly, a: PLAN_PRICES.Trader.annual },
  Desk:   { m: PLAN_PRICES.Desk.monthly,   a: PLAN_PRICES.Desk.annual },
};

const FAQ_ITEMS = [
  {
    q: 'Is the demo above my real wallet?',
    a: "No — it's a scripted walkthrough on a sample wallet, so you can see exactly how the product works before Quant Agent goes live on Aug 30. Once it's live, this becomes a real scan of your own wallet.",
  },
  {
    q: 'Am I buying a token right now?',
    a: "No. You're prepaying for the Quant Terminal subscription, same as any SaaS pre-order. The 1x–2x token reward is a bonus tied to your subscription, not a separate token sale.",
  },
  {
    q: 'When am I actually charged, and when does access start?',
    a: "You're charged once, today. Your 12-month Quant Terminal access window doesn't start until Terminal itself launches in Q1 2027 — so there's nothing else to pay between now and then, and your access runs a full year from the day it goes live, not from today.",
  },
  {
    q: 'Does Yieldr ever trade for me?',
    a: 'No. Yieldr is intelligence only — read-only wallet analysis and market signals. It never custodies funds or executes trades on your behalf.',
  },
  {
    q: "What if I don't renew after my 12 months?",
    a: 'Your Genesis reward is earned by your prepayment today, not by staying subscribed forever. Continued Terminal access after your 12-month Genesis window requires a normal subscription at the public rate.',
  },
];

const CREDITS = {
  Scout: '1M',
  Trader: '5M',
  Desk: '15M',
};

const LAUNCH_DATE = new Date('2026-08-30T00:00:00-07:00').getTime();
const pad = (n: number) => String(n).padStart(2, '0');

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
  const router = useRouter();
  const [billing, setBilling] = useState<Billing>('m');
  const [agentTab, setAgentTab] = useState<AgentTab>('overview');
  const [agentIdx, setAgentIdx] = useState(0);
  const [termTab, setTermTab] = useState<TermTab>('leaders');
  const [faqOpen, setFaqOpen] = useState<Set<number>>(new Set([0]));
  const [scans, setScans] = useState(0);
  const [buyers, setBuyers] = useState(0);
  const [arr, setArr] = useState(0);
  const [progAnimating, setProgAnimating] = useState(true);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<{ name: PlanName | ''; m: number; a: number }>({ name: '', m: 0, a: 0 });
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [selectedToken, setSelectedToken] = useState<TokenId>('USDC');

  const { isConnected, address } = useAccount();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const { lastSubscription, hasCompletedPayment } = usePayment();
  const {
    pay,
    resetPayment,
    step: paymentStep,
    errorMessage: paymentError,
    balance: tokenBalance,
    otherBalances,
    scanDone: balanceScanDone,
    isSupported: isChainSupported,
    chainId: activeChainId,
    chainName: activeChainName,
  } = useSubscriptionPayment(selectedToken);

  const chainConfigForToken = SUPPORTED_CHAINS[activeChainId];
  const availableTokens = chainConfigForToken ? (Object.keys(chainConfigForToken.tokens) as TokenId[]) : [];

  // Keep selectedToken valid whenever the wallet's chain changes.
  useEffect(() => {
    if (availableTokens.length > 0 && !availableTokens.includes(selectedToken)) {
      setSelectedToken(availableTokens[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChainId]);

  const agentAutoRef = useRef(true);
  const agentPausedRef = useRef(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Ticker animation
  useEffect(() => {
    animateCount(setScans, 4812, 1400);
    animateCount(setBuyers, 347, 1600);
    animateCount(setArr, 38200, 1600);
  }, []);

  // Load demo iframe on mount (always on — no longer gated behind a click)
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = `data:text/html;base64,${EDGE_B64}`;
    }
  }, []);

  // Countdown to launch
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, LAUNCH_DATE - Date.now());
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // autoscan=1 query param — auto-scroll to demo section
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autoscan') === '1') {
      const t = setTimeout(() => {
        document.getElementById('pe-demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
      return () => clearTimeout(t);
    }
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

  const toggleFaq = useCallback((idx: number) => {
    setFaqOpen(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }, []);

  const scrollToPricing = useCallback(() => {
    document.getElementById('pe-pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const scrollToDemo = useCallback(() => {
    document.getElementById('pe-demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const openCheckout = useCallback((name: PlanName, mPrice: number, aPrice: number) => {
    setCheckoutPlan({ name, m: mPrice, a: aPrice });
    setRedirectCountdown(null);
    resetPayment();
    setCheckoutOpen(true);
  }, [resetPayment]);

  const closeCheckout = useCallback(() => {
    setCheckoutOpen(false);
    setRedirectCountdown(null);
    resetPayment();
  }, [resetPayment]);

  // Annual billing prepays the discounted monthly rate for the full year, once.
  const checkoutPrice = billing === 'a' ? checkoutPlan.a * MONTHS_PER_YEAR : checkoutPlan.m;
  const insufficientBalance = isConnected && isChainSupported && balanceScanDone && tokenBalance < checkoutPrice && otherBalances.length === 0;
  const payDisabled =
    paymentStep === 'connecting' || paymentStep === 'awaiting-signature' || paymentStep === 'confirming' || paymentStep === 'recording' ||
    (isConnected && !isChainSupported) || insufficientBalance;

  const handlePayNow = useCallback(() => {
    if (!checkoutPlan.name) return;
    pay(checkoutPlan.name, billing === 'a' ? 'annual' : 'monthly');
  }, [checkoutPlan.name, billing, pay]);

  // Success → short countdown, then hand the user off to the subscriptions page.
  useEffect(() => {
    if (paymentStep !== 'success') return;
    setRedirectCountdown(5);
  }, [paymentStep]);

  useEffect(() => {
    if (redirectCountdown === null) return;
    if (redirectCountdown <= 0) {
      router.push('/subscriptions');
      return;
    }
    const t = setTimeout(() => setRedirectCountdown(c => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [redirectCountdown, router]);

  return (
    <div className="pe-root">
      {/* NAV */}
      <nav className="pe-nav">
        <div className="pe-wrap pe-nav-in">
          <div className="pe-nav-id" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
            <div className="pe-nav-mark">
              <img src={NAV_MARK} alt="Yieldr" />
            </div>
            <span className="pe-nav-name">YIELDR</span>
          </div>
          <div className="pe-nav-right">
            {hasCompletedPayment && (
              <button className="pe-nav-sub-link" onClick={() => router.push('/subscriptions')}>Subscriptions</button>
            )}
            <button className="pe-nav-cta" onClick={scrollToPricing}>Reserve Genesis Access</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="pe-hero">
        <div className="pe-wrap">
          <span className="pe-eyebrow">
            <span className="pe-dot" />
            Reserve now · Quant Agent goes live Aug 30
          </span>
          <h1 className="pe-h1">Reserve your edge <em>before</em> it goes live.</h1>
          <p className="pe-hero-sub">
            Quant Agent launches Aug 30. Lock Genesis pricing today with one payment — pay nothing else until Quant Terminal ships — and earn 1x–2x back in tokens either way.
          </p>

          <div className="pe-countdown">
            <div className="pe-cd-box"><div className="pe-cd-num">{pad(countdown.d)}</div><div className="pe-cd-lbl">Days</div></div>
            <div className="pe-cd-sep">:</div>
            <div className="pe-cd-box"><div className="pe-cd-num">{pad(countdown.h)}</div><div className="pe-cd-lbl">Hours</div></div>
            <div className="pe-cd-sep">:</div>
            <div className="pe-cd-box"><div className="pe-cd-num">{pad(countdown.m)}</div><div className="pe-cd-lbl">Min</div></div>
            <div className="pe-cd-sep">:</div>
            <div className="pe-cd-box"><div className="pe-cd-num">{pad(countdown.s)}</div><div className="pe-cd-lbl">Sec</div></div>
          </div>
          <div className="pe-countdown-note">Until Quant Agent goes live · Aug 30, 2026</div>

          <div className="pe-hero-ctas">
            <button className="pe-btn-p" onClick={scrollToPricing}>Reserve Genesis Access →</button>
            <button className="pe-btn-s" onClick={scrollToDemo}>Preview the Demo ↓</button>
          </div>
          <div className="pe-hero-note">
            One payment, today · nothing charged again until Quant Terminal launches
          </div>
        </div>
      </div>

      {/* LIVE TICKER */}
      <div className="pe-ticker">
        <div className="pe-wrap pe-ticker-in">
          <div className="pe-tick-cell">
            <div className="pe-tick-lbl"><span className="pe-ld" />Demo Previews Run</div>
            <div className="pe-tick-val pe-num">{scans.toLocaleString()}</div>
            <div className="pe-tick-src">since launch announcement</div>
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

      {/* DEMO PREVIEW */}
      <div className="pe-sec" id="pe-demo">
        <div className="pe-wrap">
          <span className="pe-demo-badge"><span className="pe-dt" />Demo Preview · Live Wallet Scanning Launches Aug 30</span>
          <h2 className="pe-sec-h">See exactly how Quant Agent will read your wallet.</h2>
          <p className="pe-sec-p">This is a scripted walkthrough of the real product using a sample wallet — not a live connection yet. When Quant Agent goes live Aug 30, this becomes your actual scan.</p>
          <div className="pe-console active" style={{ maxWidth: 920, marginTop: 24 }}>
            <div className="pe-console-hd">
              <span className="pe-lbl">◆ Demo mode · sample wallet</span>
            </div>
            <div className="pe-console-frame">
              <iframe ref={iframeRef} title="Edge Analysis Demo" style={{ width: '100%', height: 760, border: 'none', display: 'block', background: '#000' }} />
            </div>
          </div>
        </div>
      </div>

      {/* CHAIN SUPPORT */}
      <div className="pe-sec">
        <div className="pe-wrap">
          <div className="pe-slbl"><span>Where It Runs</span><span className="pe-ln" /></div>
          <h2 className="pe-sec-h">Scan a wallet on either chain.</h2>
          <p className="pe-sec-p">Yieldr reads onchain history natively — connect any wallet on these networks and the agent picks up your full trade history automatically.</p>
          <div className="pe-chain-grid">
            <div className="pe-chain-card base">
              <div className="pe-chain-logo"><img src={BASE_LOGO} alt="Base" /></div>
              <div>
                <div className="pe-chain-name">Base <span className="pe-chain-live">Live</span></div>
                <div className="pe-chain-desc">Full support today — meme &amp; alt coin history, OG wallet tracking, and the Quant Terminal all run natively on Base.</div>
              </div>
            </div>
            <div className="pe-chain-card rh">
              <div className="pe-chain-logo"><img src={RH_LOGO} alt="Robinhood Chain" /></div>
              <div>
                <div className="pe-chain-name">Robinhood Chain <span className="pe-chain-live">Live</span></div>
                <div className="pe-chain-desc">Wallet scans and signal tracking extend to Robinhood Chain — including tokenized-equity activity as that market grows.</div>
              </div>
            </div>
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
                        <img src={row.app === 'FOMO' ? FOMO_ICON : PUMP_ICON} alt={row.app} />
                      </span>
                    </div>
                    <div className="pe-lb2-edge">EDGE <b>{row.edge}</b></div>
                    <div className="pe-lb2-pnl" style={{ color: row.win ? 'var(--win)' : 'var(--loss)' }}>{row.pnl}</div>
                  </div>
                ))}
                <div className="pe-app-legend">
                  <div className="pe-app-legend-item">
                    <img src={PUMP_ICON} alt="" />Tracked on pump.fun
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
          <h2 className="pe-sec-h">Pay once now. Pricing locks. Access starts when Terminal ships.</h2>
          <p className="pe-sec-p">One payment today reserves 12 months of Quant Terminal access starting from its Q1 2027 launch — nothing else is charged in between. Example: the Desk annual plan is ~$1,800 once ($149/mo × 12), and earns an estimated $1,800–$3,600 back in tokens.</p>

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
              <div className="pe-plan-credits">⚡ {CREDITS.Scout} agent inference credits / mo</div>
              <ul>
                <li>Quant Agent — 1 wallet, full Edge Grade</li>
                <li>Entry / Exit / Sizing breakdown + agent chat</li>
                <li>No live Terminal, no real-time alerts</li>
              </ul>
              <button className="pe-plan-btn" onClick={() => openCheckout('Scout', PRICES.Scout.m, PRICES.Scout.a)}>Reserve Scout</button>
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
              <div className="pe-plan-credits">⚡ {CREDITS.Trader} agent inference credits / mo</div>
              <ul>
                <li>Everything in Scout, 3 wallets tracked</li>
                <li>Full Quant Terminal — signals, chart lenses, leaderboard</li>
                <li>Live alerts: pullback setups, OG exits, dev dumps</li>
              </ul>
              <button className="pe-plan-btn" onClick={() => openCheckout('Trader', PRICES.Trader.m, PRICES.Trader.a)}>Reserve Trader</button>
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
              <div className="pe-plan-credits">⚡ {CREDITS.Desk} agent inference credits / mo</div>
              <ul>
                <li>Everything in Trader, unlimited wallets</li>
                <li>Priority / lowest-latency signal delivery</li>
                <li>First access to new markets (predictions, liquidity — 2027)</li>
              </ul>
              <button className="pe-plan-btn" onClick={() => openCheckout('Desk', PRICES.Desk.m, PRICES.Desk.a)}>Reserve Desk</button>
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
          <h2>The price goes up Aug 30. Lock it in before then.</h2>
          <p>One payment today, nothing charged again until Quant Terminal ships — plus 1x–2x back in tokens.</p>
          <div style={{ marginTop: 26 }}>
            <button className="pe-btn-p" onClick={scrollToPricing}>Reserve Genesis Access →</button>
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

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <div
          className="pe-modal-overlay open"
          onClick={(e) => { if (paymentStep !== 'success' && e.target === e.currentTarget) closeCheckout(); }}
        >
          <div className="pe-modal">
            {paymentStep === 'success' && lastSubscription ? (
              <>
                <div className="pe-modal-hd">
                  <span className="pe-t">Payment Confirmed</span>
                  <button className="pe-modal-close" onClick={closeCheckout}>✕</button>
                </div>
                <div className="pe-modal-body">
                  <div className="pe-modal-success">
                    <div className="pe-modal-success-icon">✓</div>
                    <div className="pe-modal-success-title">You&apos;re in — Genesis {lastSubscription.planName}</div>
                    <div className="pe-modal-success-sub">
                      ${lastSubscription.usdcAmount.toFixed(2)} {lastSubscription.token} paid on {lastSubscription.network}
                    </div>
                  </div>
                  <div className="pe-modal-plan">
                    <div>
                      <div className="pe-modal-plan-name">Reward eligibility</div>
                      <div className="pe-modal-plan-cycle">Paid out {lastSubscription.rewardPayoutWindow}</div>
                    </div>
                    <div className="pe-modal-plan-price">${lastSubscription.rewardMinUsdc.toFixed(0)}–${lastSubscription.rewardMaxUsdc.toFixed(0)}</div>
                  </div>
                  <div className="pe-modal-note">
                    Access starts <b>{lastSubscription.subscriptionStart}</b> when Quant Terminal ships. Your reward is airdropped in <b>$YLDR</b>, or stock-linked tokens like <b>$SPCX</b>/<b>$TSLA</b>, valued at TGE price.
                  </div>
                  <div className="pe-modal-tx">
                    <a href={`${getExplorerUrl(lastSubscription.chainId)}/tx/${lastSubscription.txHash}`} target="_blank" rel="noopener noreferrer">
                      View transaction {lastSubscription.txHash.slice(0, 8)}...{lastSubscription.txHash.slice(-6)} ↗
                    </a>
                  </div>
                  <div className="pe-modal-actions">
                    <button className="pe-modal-btn pay" onClick={() => router.push('/subscriptions')}>View My Subscriptions →</button>
                    {redirectCountdown !== null && redirectCountdown > 0 && (
                      <div className="pe-modal-wallet-state">Redirecting in {redirectCountdown}s...</div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="pe-modal-hd">
                  <span className="pe-t">Confirm Genesis Reservation</span>
                  <button className="pe-modal-close" onClick={closeCheckout}>✕</button>
                </div>
                <div className="pe-modal-body">
                  <div className="pe-modal-plan">
                    <div>
                      <div className="pe-modal-plan-name">{checkoutPlan.name}</div>
                      <div className="pe-modal-plan-cycle">{billing === 'a' ? 'Annual rate · 12 months prepaid' : 'Monthly rate · Genesis price'}</div>
                    </div>
                    <div className="pe-modal-plan-price">${checkoutPrice}</div>
                  </div>
                  <div className="pe-modal-note">
                    You&apos;re charged <b>once, today</b>. This locks 12 months of Quant Terminal access starting from its <b>Q1 2027 launch</b> — not from today — so there&apos;s <b>nothing else to pay</b> between now and then.
                  </div>
                  <div className="pe-modal-reward">
                    <div className="pe-k">Estimated Genesis Reward</div>
                    <div className="pe-v">${checkoutPrice} – ${checkoutPrice * 2} in USDC value</div>
                    <div className="pe-s">1x–2x your payment, airdropped in $YLDR or stock-linked tokens ($SPCX/$TSLA) at TGE + 30 days.</div>
                  </div>

                  {isConnected && (
                    <div className="pe-modal-pay-with">
                      <div className="pe-k">Pay with</div>
                      {!isChainSupported ? (
                        <div className="pe-modal-switch">
                          <div className="pe-modal-switch-note">Your wallet is on an unsupported network. Switch to continue:</div>
                          <div className="pe-modal-switch-btns">
                            {Object.entries(SUPPORTED_CHAINS).map(([id, cfg]) => (
                              <button
                                key={id}
                                className="pe-modal-switch-btn"
                                disabled={isSwitchingChain}
                                onClick={() => switchChain({ chainId: Number(id) })}
                              >
                                {cfg.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="pe-modal-chain-row">
                            <span className="pe-modal-chain-dot" />
                            <span>{activeChainName}</span>
                            {availableTokens.length > 1 ? (
                              <div className="pe-modal-token-toggle">
                                {availableTokens.map(t => (
                                  <button
                                    key={t}
                                    className={selectedToken === t ? 'on' : ''}
                                    onClick={() => setSelectedToken(t)}
                                  >
                                    {t}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <span className="pe-modal-token-single">{availableTokens[0]}</span>
                            )}
                            <span className="pe-modal-balance">Balance: ${tokenBalance.toFixed(2)}</span>
                          </div>
                          {balanceScanDone && tokenBalance < checkoutPrice && otherBalances.length > 0 && (
                            <div className="pe-modal-switch">
                              <div className="pe-modal-switch-note">💡 You have stablecoins available elsewhere:</div>
                              <div className="pe-modal-switch-btns">
                                {otherBalances.map((ob, i) => (
                                  <button
                                    key={i}
                                    className="pe-modal-switch-btn"
                                    onClick={() => {
                                      if (ob.chainId !== activeChainId) switchChain({ chainId: ob.chainId });
                                      setSelectedToken(ob.token);
                                    }}
                                  >
                                    {ob.chainId === activeChainId ? ob.token : ob.chainName}: ${ob.balance.toFixed(2)} {ob.token}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {paymentStep === 'error' && paymentError && (
                    <div className="pe-modal-error">{paymentError}</div>
                  )}

                  <div className="pe-modal-actions">
                    <button
                      className="pe-modal-btn pay"
                      onClick={handlePayNow}
                      disabled={payDisabled}
                    >
                      {paymentStep === 'connecting' && 'Connecting Wallet...'}
                      {paymentStep === 'awaiting-signature' && 'Confirm in Wallet...'}
                      {paymentStep === 'confirming' && 'Confirming Transaction...'}
                      {paymentStep === 'recording' && 'Finalizing...'}
                      {(paymentStep === 'idle' || paymentStep === 'error') && (
                        !isConnected
                          ? 'Connect Wallet to Pay'
                          : !isChainSupported
                          ? 'Switch to a supported network'
                          : insufficientBalance
                          ? `Insufficient ${selectedToken} balance`
                          : `Pay $${checkoutPrice} Now`
                      )}
                    </button>
                    <div className={`pe-modal-wallet-state${isConnected ? ' connected' : ''}`}>
                      {isConnected && address ? `Wallet connected · ${address.slice(0, 6)}...${address.slice(-4)}` : 'No wallet connected'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
