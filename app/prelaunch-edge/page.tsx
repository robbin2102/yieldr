'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';
import Universe from '../Universe';
import { NAV_MARK, CRED_BADGE, EDGE_B64, BASE_LOGO, RH_LOGO } from './images';
import { PLAN_PRICES, MONTHS_PER_YEAR, computeChargeAmount, type PlanName, type BillingCycle } from '@/config/plans';
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

type Billing = 'm' | 'a';

const PRICES = {
  Scout:  { m: PLAN_PRICES.Scout.monthly,  a: PLAN_PRICES.Scout.annual },
  Trader: { m: PLAN_PRICES.Trader.monthly, a: PLAN_PRICES.Trader.annual },
  Desk:   { m: PLAN_PRICES.Desk.monthly,   a: PLAN_PRICES.Desk.annual },
};

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
    a: "Your Genesis reward is earned by your prepayment today, not by staying subscribed forever. Monthly plans auto-renew at your locked Genesis rate until you cancel. Annual plans simply end after 12 months — renewing after that means resubscribing at the public rate.",
  },
];

const CREDITS = {
  Scout: '1M',
  Trader: '5M',
  Desk: '15M',
};


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
  const [faqOpen, setFaqOpen] = useState<Set<number>>(new Set([0]));
  const [scans, setScans] = useState(0);
  const [buyers, setBuyers] = useState(0);
  const [arr, setArr] = useState(0);
  const [slotsTotal, setSlotsTotal] = useState(1000);

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
    balanceLoading,
    otherBalances,
    scanErrors,
    scanDone,
    isSupported: isChainSupported,
    chainId: activeChainId,
    chainName: activeChainName,
    currentSubscription,
    currentSubscriptionLoaded,
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

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const demoSectionRef = useRef<HTMLDivElement>(null);
  const [demoStarted, setDemoStarted] = useState(false);

  const demoViewLoggedRef = useRef(false);
  const startDemo = useCallback(() => {
    setDemoStarted(true);
    if (!demoViewLoggedRef.current) {
      demoViewLoggedRef.current = true;
      fetch('/api/site-stats/demo-view', { method: 'POST' }).catch(() => {});
    }
  }, []);

  // Ticker — pulled from Mongo (baseline + real onchain/demo counts) rather
  // than hardcoded, so the numbers actually reflect what's happened. Falls
  // No baseline padding — these are the true actual counts from Mongo.
  // Falls back to zero (not a marketing number) only if the fetch itself
  // fails outright.
  useEffect(() => {
    fetch('/api/site-stats')
      .then(r => r.json())
      .then(d => {
        const stats = d?.data ?? {};
        animateCount(setScans, stats.demoPreviewsRun ?? 0, 1400);
        animateCount(setBuyers, stats.genesisMembers ?? 0, 1600);
        animateCount(setArr, stats.prelaunchArr ?? 0, 1600);
        setSlotsTotal(stats.genesisSlotsTotal ?? 1000);
      })
      .catch(() => {
        animateCount(setScans, 0, 1400);
        animateCount(setBuyers, 0, 1600);
        animateCount(setArr, 0, 1600);
      });
  }, []);

  // The demo runs a ~20s scripted walkthrough on its own timer as soon as it
  // loads — starting it on page mount meant it was mid-sequence while people
  // were still reading the hero. It now only loads once the user actually
  // asks for it: clicking "Preview the Demo", or scrolling the section into
  // view themselves. Once started it keeps running to completion regardless
  // of where they scroll to next.
  useEffect(() => {
    if (demoStarted) return;
    const el = demoSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) startDemo();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [demoStarted, startDemo]);

  useEffect(() => {
    if (demoStarted && iframeRef.current) {
      iframeRef.current.src = `data:text/html;base64,${EDGE_B64}`;
    }
  }, [demoStarted]);

  // autoscan=1 query param — auto-scroll to demo section and start it
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autoscan') === '1') {
      startDemo();
      const t = setTimeout(() => {
        document.getElementById('pe-demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    startDemo();
    document.getElementById('pe-demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [startDemo]);

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

  // Annual billing prepays the discounted monthly rate for the full year, once —
  // this is the plan's full sticker price, before accounting for anything the
  // wallet has already paid toward its current plan.
  const fullPlanPrice = billing === 'a' ? checkoutPlan.a * MONTHS_PER_YEAR : checkoutPlan.m;
  const selectedCycle: BillingCycle = billing === 'a' ? 'annual' : 'monthly';

  // A wallet holds exactly one plan at a time. Once connected, figure out
  // whether this selection is a fresh purchase, a valid upgrade (charged only
  // the differential), a re-purchase of the plan already owned, or not an
  // upgrade at all — computeChargeAmount is the exact function the payment
  // hook (and the server) use to decide the real charge, so this is only a
  // preview, never a second source of truth.
  const currentSubPending = isConnected && !currentSubscriptionLoaded;
  const chargeDecision = checkoutPlan.name && isConnected && currentSubscriptionLoaded
    ? computeChargeAmount(checkoutPlan.name, selectedCycle, currentSubscription)
    : null;
  const alreadyOwned = chargeDecision !== null && !chargeDecision.ok && chargeDecision.reason === 'already-owned';
  const notAnUpgrade = chargeDecision !== null && !chargeDecision.ok && chargeDecision.reason === 'not-an-upgrade';
  const isUpgradePurchase = chargeDecision !== null && chargeDecision.ok && chargeDecision.isUpgrade;
  // Amount actually charged: the upgrade differential once known, otherwise
  // the full price (best-effort display before a wallet is connected).
  const checkoutPrice = chargeDecision && chargeDecision.ok ? chargeDecision.amount : fullPlanPrice;

  // Balance on the ACTIVE chain/token is unknown until the scan resolves — never
  // let a click through before we actually know whether it can succeed, or a
  // payment attempt can be submitted (and revert on-chain) against a balance we
  // hadn't confirmed yet.
  const balancePending = isConnected && isChainSupported && balanceLoading;
  const insufficientBalance = isConnected && isChainSupported && !balanceLoading && tokenBalance < checkoutPrice;
  const payDisabled =
    paymentStep === 'connecting' || paymentStep === 'awaiting-signature' || paymentStep === 'confirming' || paymentStep === 'recording' ||
    (isConnected && !isChainSupported) || balancePending || insufficientBalance ||
    currentSubPending || alreadyOwned || notAnUpgrade;

  // A single, always-visible picker across every chain/token this wallet has
  // a scanned balance on — no forced network-switch wall, no dead-end error.
  // The wallet's actual connected chain (if supported) is included so the
  // "pay without switching anything" option is always the most obvious one;
  // clicking any other option switches chain (if needed) and selects its
  // token before the user ever hits Pay Now.
  const payOptions = useMemo(() => {
    const opts: { chainId: number; chainName: string; token: TokenId; balance: number; isCurrent: boolean }[] = [];
    if (isChainSupported && activeChainName) {
      opts.push({ chainId: activeChainId, chainName: activeChainName, token: selectedToken, balance: tokenBalance, isCurrent: true });
    }
    for (const ob of otherBalances) {
      opts.push({ chainId: ob.chainId, chainName: ob.chainName, token: ob.token, balance: ob.balance, isCurrent: false });
    }
    // Options that can actually cover this purchase float to the top; ties
    // broken by balance size so the "obviously best" choice is first.
    return opts.sort((a, b) => {
      const aOk = a.balance >= checkoutPrice;
      const bOk = b.balance >= checkoutPrice;
      if (aOk !== bOk) return aOk ? -1 : 1;
      return b.balance - a.balance;
    });
  }, [isChainSupported, activeChainId, activeChainName, selectedToken, tokenBalance, otherBalances, checkoutPrice]);

  const balanceScanPending = !balanceLoading && !scanDone && payOptions.length === 0;
  const noSufficientOption = scanDone && !balanceLoading && payOptions.length > 0 && !payOptions.some(o => o.balance >= checkoutPrice);

  const handlePayNow = useCallback(() => {
    if (!checkoutPlan.name) return;
    pay(checkoutPlan.name, selectedCycle);
  }, [checkoutPlan.name, selectedCycle, pay]);

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
      <Universe />
      {/* NAV */}
      <nav className="pe-nav">
        <div className="pe-wrap pe-nav-in">
          <div className="pe-nav-id" style={{ cursor: 'pointer' }} onClick={() => router.push('/')}>
            <div className="pe-nav-mark">
              <img src={NAV_MARK} alt="Yieldr" />
            </div>
            <span className="pe-nav-name">Yieldr</span>
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
            Reserve now · Quant Agent goes live Q4 2026
          </span>
          <h1 className="pe-h1">Reserve your edge <em>before</em> it goes live.</h1>
          <p className="pe-hero-sub">
            Quant Agent launches Q4 2026. Lock Genesis pricing today with one payment — pay nothing else until Quant Terminal ships — and earn 1x–2x back in tokens either way.
          </p>

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
          <div
            className="pe-tick-cell clickable"
            role="button"
            tabIndex={0}
            onClick={() => router.push('/subscriptions#community-trx')}
            onKeyDown={(e) => { if (e.key === 'Enter') router.push('/subscriptions#community-trx'); }}
          >
            <div className="pe-tick-lbl">Genesis Members</div>
            <div className="pe-tick-val pe-num win">{buyers.toLocaleString()}</div>
            <div className="pe-tick-src">of {slotsTotal.toLocaleString()} slots</div>
          </div>
          <div
            className="pe-tick-cell clickable"
            role="button"
            tabIndex={0}
            onClick={() => router.push('/subscriptions#community-trx')}
            onKeyDown={(e) => { if (e.key === 'Enter') router.push('/subscriptions#community-trx'); }}
          >
            <div className="pe-tick-lbl">Prelaunch ARR</div>
            <div className="pe-tick-val pe-num">${arr.toLocaleString()}</div>
            <div className="pe-tick-src">from onchain USDC receipts</div>
          </div>
        </div>
      </div>

      {/* DEMO PREVIEW */}
      <div className="pe-sec" id="pe-demo" ref={demoSectionRef}>
        <div className="pe-wrap">
          <span className="pe-demo-badge"><span className="pe-dt" />Demo Preview · Live Wallet Scanning Launches Q4 2026</span>
          <h2 className="pe-sec-h">See exactly how Quant Agent will read your wallet.</h2>
          <p className="pe-sec-p">This is a scripted walkthrough of the real product using a sample wallet — not a live connection yet. When Quant Agent goes live in Q4 2026, this becomes your actual scan.</p>
          <div className="pe-console active" style={{ maxWidth: 920, marginTop: 24 }}>
            <div className="pe-console-hd">
              <span className="pe-lbl">◆ Demo mode · sample wallet</span>
            </div>
            <div className="pe-console-frame" style={{ position: 'relative' }}>
              {!demoStarted && (
                <button className="pe-console-start" onClick={startDemo}>
                  <span className="pe-console-start-icon">▶</span>
                  Preview the Demo
                </button>
              )}
              <iframe
                ref={iframeRef}
                title="Edge Analysis Demo"
                sandbox="allow-scripts"
                style={{ width: '100%', height: 760, border: 'none', display: 'block', background: '#000' }}
              />
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
                <div className="pe-chain-name">Base <span className="pe-chain-live">In Development</span></div>
                <div className="pe-chain-desc">First chain supported at launch — meme &amp; alt coin history, OG wallet tracking, and the Quant Terminal all run natively on Base.</div>
              </div>
            </div>
            <div className="pe-chain-card rh">
              <div className="pe-chain-logo"><img src={RH_LOGO} alt="Robinhood Chain" /></div>
              <div>
                <div className="pe-chain-name">Robinhood Chain <span className="pe-chain-live">In Development</span></div>
                <div className="pe-chain-desc">Wallet scans and signal tracking extending to Robinhood Chain — including tokenized-equity activity as that market grows.</div>
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

          <div className="pe-showcase" style={{ marginTop: 22 }}>
            <div className="pe-sc-body" style={{ gridTemplateColumns: '1fr', minHeight: 0 }}>
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
                <div className="pe-hw-item"><span className="pe-hw-dot" style={{ background: 'var(--win)' }} />Exit — 40% of grade · Elite</div>
                <div className="pe-hw-item"><span className="pe-hw-dot" style={{ background: 'var(--warn)' }} />Sizing — 35% of grade · Solid</div>
                <div className="pe-hw-item"><span className="pe-hw-dot" style={{ background: 'var(--agent)' }} />Entry — 25% of grade · Needs Work</div>
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
          </div>
        </div>
      </div>

      {/* QUANT TERMINAL TEASER */}
      <div className="pe-sec" style={{ paddingTop: 0 }}>
        <div className="pe-wrap">
          <div className="pe-slbl"><span>Quant Terminal</span><span className="pe-ln" /></div>
          <h2 className="pe-sec-h">The same agent, watching every wallet worth watching.</h2>
          <p className="pe-sec-p">Real-time signals and top-trader flow across FOMO and pump.fun — the two apps meme traders actually live in — ships alongside the Quant Terminal.</p>
          <div className="pe-final" style={{ marginTop: 22, padding: '36px 32px' }}>
            <span className="pe-badge-pill" style={{ color: 'var(--agent)', background: 'var(--agent-dim)', border: '1px solid var(--agent-line)' }}>Roadmap · Q1 2027</span>
            <h2 style={{ marginTop: 16, fontSize: 24 }}>Not live yet — Genesis subscribers get first access.</h2>
            <p style={{ maxWidth: 520 }}>Quant Agent (Q4 2026) reads your wallet and grades your edge. Quant Terminal follows in Q1 2027 with live leaderboards, demand/supply signals, and agent alerts across every wallet worth watching — not just yours.</p>
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
          <p className="pe-sec-p">Nothing is charged between now and Terminal&apos;s Q1 2027 launch either way. Monthly locks your first month at the Genesis rate, then auto-renews monthly from launch. Annual prepays the full 12 months today at a lower rate — nothing else to pay all year. Example: the Desk annual plan is ~$1,800 once ($149/mo × 12), and earns an estimated $1,800–$3,600 back in tokens.</p>

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
          <h2>The price goes up at launch. Lock it in before then.</h2>
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
                  {/* On the success screen, dismissing the confirmation should still land the
                      user on their subscription — not silently cancel the pending redirect and
                      strand them back on this page with no indication anything happened. */}
                  <button className="pe-modal-close" onClick={() => router.push('/subscriptions')}>✕</button>
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
                    Access starts <b>{lastSubscription.subscriptionStart}</b> when Quant Terminal ships
                    {lastSubscription.renewsAutomatically
                      ? <> — covers your <b>first month</b>, then auto-renews monthly at your locked Genesis rate.</>
                      : <> — <b>{lastSubscription.accessMonths} months</b> fully prepaid, nothing else to pay until then.</>}
                    {' '}Your reward is airdropped in <b>$YLDR</b>, or stock-linked tokens like <b>$SPCX</b>/<b>$TSLA</b>, valued at TGE price.
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
                      <div className="pe-modal-plan-cycle">
                        {isUpgradePurchase
                          ? `Upgrade from ${currentSubscription?.planName} ${currentSubscription?.billingCycle}`
                          : billing === 'a' ? 'Annual rate · 12 months prepaid' : 'Monthly rate · 1st month, then auto-renews'}
                      </div>
                    </div>
                    <div className="pe-modal-plan-price">${checkoutPrice.toFixed(2)}</div>
                  </div>

                  {alreadyOwned ? (
                    <div className="pe-modal-note">
                      You already have the <b>{checkoutPlan.name} {billing === 'a' ? 'annual' : 'monthly'}</b> plan. Pick a different plan or billing cycle above to upgrade, or visit your <a href="/subscriptions" style={{ color: 'var(--win)' }}>subscriptions</a> to review it.
                    </div>
                  ) : notAnUpgrade ? (
                    <div className="pe-modal-note">
                      {checkoutPlan.name} {billing === 'a' ? 'annual' : 'monthly'} isn&apos;t an upgrade from your current <b>{currentSubscription?.planName} {currentSubscription?.billingCycle}</b> plan — its price doesn&apos;t exceed what you&apos;ve already paid. Choose a higher plan or annual billing instead.
                    </div>
                  ) : (
                    <>
                      <div className="pe-modal-note">
                        {isUpgradePurchase ? (
                          <>You&apos;re charged <b>${checkoutPrice.toFixed(2)} today</b> — the difference between what you&apos;ve already paid and {checkoutPlan.name} {billing === 'a' ? 'annual' : 'monthly'}&apos;s full price. {billing === 'a' ? <>This prepays <b>12 months</b> from Terminal&apos;s <b>Q1 2027 launch</b>.</> : <>From <b>Q1 2027 launch</b>, this <b>auto-renews monthly</b> at ${checkoutPlan.m}/mo until you cancel.</>}</>
                        ) : billing === 'a' ? (
                          <>You&apos;re charged <b>once, today</b>. This prepays <b>12 months</b> of Quant Terminal access starting from its <b>Q1 2027 launch</b> — not from today — so there&apos;s <b>nothing else to pay</b> for that whole first year.</>
                        ) : (
                          <>You&apos;re charged <b>once, today</b>, for your <b>first month</b> at the Genesis rate — nothing else is charged before Terminal&apos;s <b>Q1 2027 launch</b>. From launch, this <b>auto-renews monthly</b> at ${checkoutPlan.m}/mo until you cancel.</>
                        )}
                      </div>
                      <div className="pe-modal-reward">
                        <div className="pe-k">Estimated Genesis Reward</div>
                        <div className="pe-v">${checkoutPrice.toFixed(2)} – ${(checkoutPrice * 2).toFixed(2)} in USDC value</div>
                        <div className="pe-s">1x–2x your payment, airdropped in $YLDR or stock-linked tokens ($SPCX/$TSLA) at TGE + 30 days.</div>
                      </div>
                    </>
                  )}

                  {isConnected && (
                    <div className="pe-modal-pay-with">
                      <div className="pe-k">Pay with</div>
                      {balanceScanPending ? (
                        <div className="pe-modal-balance-scanning">Checking balances on Base, Ethereum, Polygon, BNB Chain, and Robinhood Chain...</div>
                      ) : payOptions.length === 0 ? (
                        <div className="pe-modal-switch">
                          <div className="pe-modal-switch-note">No stablecoin balance found on any supported chain for this wallet. Switch to fund one:</div>
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
                          <div className="pe-modal-pay-options">
                            {payOptions.map((opt) => {
                              const sufficient = opt.balance >= checkoutPrice;
                              return (
                                <button
                                  key={`${opt.chainId}-${opt.token}`}
                                  type="button"
                                  className={`pe-modal-pay-option${opt.isCurrent ? ' current' : ''}${sufficient ? ' ok' : ' low'}`}
                                  disabled={isSwitchingChain}
                                  onClick={() => {
                                    if (opt.chainId !== activeChainId) switchChain({ chainId: opt.chainId });
                                    setSelectedToken(opt.token);
                                  }}
                                >
                                  <span className="pe-modal-pay-option-chain">
                                    <span className="pe-modal-chain-dot" />
                                    {opt.chainName}
                                    {opt.isCurrent && <span className="pe-modal-pay-option-tag">connected</span>}
                                  </span>
                                  <span className="pe-modal-pay-option-bal">${opt.balance.toFixed(2)} {opt.token}</span>
                                </button>
                              );
                            })}
                          </div>
                          {noSufficientOption && (
                            <div className="pe-modal-scan-errors low">
                              Not enough balance on any chain above to cover this ${checkoutPrice.toFixed(2)} payment — add funds to one and it&apos;ll update here.
                            </div>
                          )}
                          {scanErrors.length > 0 && (
                            <div className="pe-modal-scan-errors">
                              Couldn&apos;t check balance on {scanErrors.map((e, i) => (
                                <span key={i}>{i > 0 ? ', ' : ''}{e.chainName} ({e.message})</span>
                              ))} — RPC issue, not necessarily a zero balance.
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {paymentStep === 'error' && paymentError && (
                    <div className="pe-modal-error">{paymentError}</div>
                  )}

                  {alreadyOwned || notAnUpgrade ? (
                    <div className="pe-modal-actions">
                      <button className="pe-modal-btn pay" onClick={() => router.push('/subscriptions')}>View My Subscriptions →</button>
                    </div>
                  ) : (
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
                            : currentSubPending
                            ? 'Checking your account...'
                            : !isChainSupported
                            ? 'Switch to a supported network'
                            : balancePending
                            ? 'Checking balance...'
                            : insufficientBalance
                            ? `Insufficient ${selectedToken} balance`
                            : isUpgradePurchase
                            ? `Pay $${checkoutPrice.toFixed(2)} to Upgrade`
                            : `Pay $${checkoutPrice.toFixed(2)} Now`
                        )}
                      </button>
                      <div className={`pe-modal-wallet-state${isConnected ? ' connected' : ''}`}>
                        {isConnected && address ? `Wallet connected · ${address.slice(0, 6)}...${address.slice(-4)}` : 'No wallet connected'}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
