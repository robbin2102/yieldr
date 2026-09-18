'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePayment } from './context/PaymentContext';
import Universe from './Universe';
import HeroTrace from './HeroTrace';
import LabDemo from './LabDemo';
import PatternLibrary from './PatternLibrary';
import VaultBuilder from './VaultBuilder';
import { useAgentCycle, AgentSteps, AgentLog } from './AgentConsole';
import './landing.css';

const DEPTH_SECTIONS = [
  { id: 'top', label: 'Top' },
  { id: 'lab', label: 'Proof' },
  { id: 'patterns', label: 'Patterns' },
  { id: 'vaults', label: 'Vaults' },
  { id: 'agents', label: 'Agents' },
  { id: 'apps', label: 'Apps' },
  { id: 'access', label: 'Access' },
];

function XIcon() {
  return <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}
function GitHubIcon() {
  return <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z" /></svg>;
}

function AnimatedStat({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((es, ob) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      ob.unobserve(e.target);
      if (reduced || target === 0) { el.textContent = target.toLocaleString('en-US') + suffix; return; }
      const t0 = performance.now(), dur = 900;
      const step = (t: number) => {
        const p = Math.max(0, Math.min(1, (t - t0) / dur));
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, suffix]);
  return <b className="num" ref={ref}>0</b>;
}

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [genesisMembers, setGenesisMembers] = useState(0);
  const [selectedPatterns, setSelectedPatterns] = useState<Set<string>>(new Set(['dip']));
  const { hasCompletedPayment } = usePayment();
  const railRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const { activeStep, shown } = useAgentCycle();
  const [activeSection, setActiveSection] = useState('top');

  useEffect(() => {
    fetch('/api/site-stats').then((r) => r.json()).then((d) => {
      if (d?.success && d.data && typeof d.data.genesisMembers === 'number') setGenesisMembers(d.data.genesisMembers);
    }).catch(() => {});
  }, []);

  // Scroll-progress rail + solid nav on scroll (ported from the source design)
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const bar = railRef.current?.firstElementChild as HTMLElement | null;
        if (bar) bar.style.width = (max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0) * 100 + '%';
        navRef.current?.classList.toggle('solid', window.scrollY > 40);

        // Which section marker the reader has scrolled past — closest
        // anchor whose top is at or above the viewport midline.
        let current = DEPTH_SECTIONS[0].id;
        for (const s of DEPTH_SECTIONS) {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) current = s.id;
        }
        setActiveSection(current);

        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Entrance reveals for every .rise / .edgeline element
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('inview');
      io.unobserve(e.target);
    }), { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.rise, .edgeline, .lab').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function togglePattern(id: string) {
    setSelectedPatterns((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  return (
    <div className="v3-page">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <div id="rail" ref={railRef}><i /></div>
      <Universe />
      <div className="aurora" />
      <nav id="depth" aria-label="Section">
        {DEPTH_SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} aria-label={s.label} className={activeSection === s.id ? 'on' : ''} />
        ))}
      </nav>

      <header className="nav" id="nav" ref={navRef}>
        <Link className="brand" href="/">
          <div className="nav-mark"><img src="/nav-mark.png" alt="Yieldr" /></div>
          Yieldr
        </Link>
        <div className="nav-right">
          <nav className={`nav-links${mobileNavOpen ? ' open' : ''}`}>
            <a href="#lab" onClick={() => setMobileNavOpen(false)}>Roadmap</a>
            <Link href="/build-in-public" onClick={() => setMobileNavOpen(false)}>Build Log</Link>
            {hasCompletedPayment && <Link href="/subscriptions" onClick={() => setMobileNavOpen(false)}>Subscriptions</Link>}
          </nav>
          <div className="nav-soc">
            <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"><XIcon /></a>
            <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitHubIcon /></a>
          </div>
          <Link className="cta green" href="/prelaunch-edge">Find Your Edge <span className="dot">↗</span></Link>
          <button className="nav-burger" aria-label="Toggle menu" aria-expanded={mobileNavOpen} onClick={() => setMobileNavOpen((v) => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="hero" id="top">
        <div className="hero-bg" />
        <div className="wrap">
          <div className="rise">
            <div className="eyebrow">Onchain funds, run by agents</div>
            <h1>Invest in the <em>edge</em>,<br />not the trade.</h1>
            <p className="hero-sub">Yieldr maps how the best onchain traders repeatedly win, proves it isn&apos;t luck, and turns it into agent-run vaults anyone can back or launch.</p>
            <div className="hero-acts">
              <a className="cta green" href="#lab">See a real edge <span className="dot">↓</span></a>
              <a className="cta ghost" href="#patterns">Browse the pattern library <span className="dot">→</span></a>
            </div>
            <div className="hero-stats">
              <div><AnimatedStat target={100542} /><span>TRADES ANALYZED<em>across 1,284 wallets</em></span></div>
              <div><AnimatedStat target={47} /><span>VALIDATED TRADER EDGES</span></div>
              <div><AnimatedStat target={genesisMembers} /><span>GENESIS SUBSCRIBERS</span></div>
            </div>
          </div>
          <div className="trace rise d2">
            <div className="trace-head">
              <span className="who"><i className="av">w</i> wanderer · 0x7f3a…c21e</span>
              <span className="live"><i />READING</span>
            </div>
            <HeroTrace />
            <div className="trace-foot">
              <span className="tlab">High-Conviction Dip Buyer<small>86 OCCURRENCES · 63 TOKENS · STABLE</small></span>
              <span className="score">8.6<small>/10</small></span>
            </div>
          </div>
        </div>
      </section>

      <section className="world">
        <div className="stage">
          <div className="inner">
            <span className="mark">World I · <b>the record</b></span>
            <h2>Every trade leaves<br />a <em>trace</em>.</h2>
            <p>1,284 wallets, public and permanent. Most people read a wallet as a single number. A record this dense is not a number — it is a sky.</p>
          </div>
          <span className="cue">keep going<i /></span>
        </div>
      </section>

      {/* ============ LAB ============ */}
      <section className="lab" id="lab">
        <div className="wrap">
          <div className="lab-head">
            <div className="rise">
              <div className="eyebrow">Selection pressure</div>
              <h2><span className="strike">PnL is not an edge.</span><br />A pattern that survives is.</h2>
            </div>
            <p className="lede rise d1">A wallet is a public record — 293 swaps across 48 tokens in eleven weeks. Most people read it as one number. We apply pressure instead: nothing counts as an edge until it has survived every attempt to kill it. Switch the tests on and watch the curve.</p>
          </div>
          <div className="edgeline rise" style={{ marginBottom: 28 }} />
          <LabDemo />
        </div>
      </section>

      <section className="world">
        <div className="stage">
          <div className="inner">
            <span className="mark">World II · <b>selection</b></span>
            <h2>Noise is not<br /><em>pattern</em>.</h2>
            <p>Scatter resolves into structure at one specific angle. So does a trader. What repeats under pressure is the only thing worth owning.</p>
          </div>
          <span className="cue">apply pressure<i /></span>
        </div>
      </section>

      {/* ============ PATTERN LIBRARY ============ */}
      <section className="lib" id="patterns">
        <div className="wrap">
          <div className="lib-head">
            <div className="rise">
              <div className="eyebrow">Growth forms</div>
              <h2>What a validated edge<br />actually looks like.</h2>
            </div>
            <p className="lede rise d1">Real patterns read from swaps and price history alone. Pick the ones you believe in — they carry down into the builder below.</p>
          </div>
          <PatternLibrary selected={selectedPatterns} onToggle={togglePattern} />
          <div className="lib-foot rise">
            <p>Risk flags are detected the same way edges are, and are excluded from every vault automatically. An agent never trades a trader&apos;s weak states.</p>
            <a className="cta ink" href="#vaults">Take selection to the builder <span className="dot">↓</span></a>
          </div>
        </div>
      </section>

      <section className="world">
        <div className="stage">
          <div className="inner">
            <span className="mark">World III · <b>inheritance</b></span>
            <h2>An edge has<br /><span className="alt">a genome</span>.</h2>
            <p>Entry, sizing, exit, restraint. Read them apart and they can be recombined — a fund assembled from the behaviours of people who never met.</p>
          </div>
          <span className="cue">compose it<i /></span>
        </div>
      </section>

      {/* ============ VAULT BUILDER ============ */}
      <section className="vault" id="vaults">
        <div className="wrap">
          <div className="rise">
            <span className="soon">AGENT VAULTS · Q1 2027</span>
            <h2>Everyone becomes<br />a fund manager.</h2>
            <p className="lede">Pick the patterns you believe in, from any traders. Launch a vault. Others back it, your agent runs it, you earn the fee.</p>
            <p className="vault-note">This is a preview of the vault builder. Quant Agent — the wallet-grading engine behind it — opens for Genesis subscribers in Q4 2026.</p>
          </div>
          <VaultBuilder selected={selectedPatterns} onRemove={togglePattern} />
        </div>
      </section>

      <section className="world">
        <div className="stage">
          <div className="inner">
            <span className="mark">World IV · <b>the operator</b></span>
            <h2>It runs while<br />you <span className="warm">sleep</span>.</h2>
            <p>Roots do not deliberate. Your agent watches, fires on the pattern, re-scores the edge, and retreats before it dies — and shows depositors every reason why.</p>
          </div>
          <span className="cue">watch it work<i /></span>
        </div>
      </section>

      {/* ============ AGENT ============ */}
      <section className="agent" id="agents">
        <div className="wrap">
          <div className="rise">
            <div className="eyebrow">The operator</div>
            <h2>Your agent runs it.<br />You don&apos;t.</h2>
            <p className="lede">Every Yieldr subscriber gets an agent. It watches the traders behind your vault, acts only when a validated pattern fires, and retreats when the edge fades.</p>
            <AgentSteps activeStep={activeStep} />
          </div>
          <AgentLog shown={shown} />
        </div>
      </section>

      {/* ============ APPS ============ */}
      <section className="apps" id="apps">
        <div className="wrap">
          <div className="apps-head">
            <div className="rise"><div className="eyebrow">Coverage</div><h2>Meets you where you already trade.</h2></div>
            <p className="lede rise d1">Find the edge behind the top traders where they trade, then turn it into a fund. pump.fun is next; Polymarket, Uniswap and Aerodrome follow as Agent Vaults expand into predictions and DeFi.</p>
          </div>
        </div>
        <div className="wrap">
          <div className="rail rise">
            <div className="app"><div className="nm">FOMO</div><div className="st bld">◐ In Development</div><div className="ch">Base · Solana<br />Robinhood Chain</div></div>
            <div className="app"><div className="nm">pump.fun</div><div className="st bld">◐ Building</div><div className="ch">Solana</div></div>
            <div className="app"><div className="nm">Polymarket</div><div className="st up">○ Upcoming</div><div className="ch">Predictions</div></div>
            <div className="app"><div className="nm">Uniswap</div><div className="st up">○ Upcoming</div><div className="ch">DeFi</div></div>
            <div className="app"><div className="nm">Aerodrome</div><div className="st up">○ Upcoming</div><div className="ch">Base</div></div>
          </div>
        </div>
      </section>

      {/* ============ MANIFESTO ============ */}
      <section className="mani" id="access">
        <div className="wrap">
          <h2 className="rise">Every real edge<br /><em>deserves a fund.</em></h2>
          <p className="rise d1">Yieldr puts it onchain, runs it with agents, and lets anyone back it. Agent Vaults are the next thing we ship.</p>
          <div className="rise d2" style={{ marginTop: 32 }}>
            <Link className="cta green" href="/prelaunch-edge">Reserve Genesis access <span className="dot">→</span></Link>
          </div>
          <p className="fine rise d3">Quant Agent launches Q4 2026. Agent Vaults open to deposits in Q1 2027.</p>
        </div>
      </section>

      {/* ============ CREDIBILITY + FOOTER ============ */}
      <section className="cred">
        <div className="wrap rise">
          <a href="https://x.com/buildonbase/status/2023855121189220609" target="_blank" rel="noopener noreferrer">
            <b>Base Batches 002 · Builder Track winner</b>
            <p>Selected from 900+ projects for building fund infrastructure on Base. Part of Incubase.</p>
            <span>Announced by @buildonbase ↗</span>
          </a>
          <a href="https://www.circuit-accelerator.com/" target="_blank" rel="noopener noreferrer">
            <b>Circuit Accelerator, Singapore</b>
            <p>Backed by Base and Newcampus. Building alongside the teams shaping onchain finance.</p>
            <span>circuit-accelerator.com ↗</span>
          </a>
          <Link href="/build-in-public">
            <b>Built in public</b>
            <p>Weekly build logs with real treasury numbers and live pattern research. Nothing hidden.</p>
            <span>yieldr.org/build-in-public ↗</span>
          </Link>
        </div>
      </section>
      <footer className="foot">
        <div className="wrap">
          <div className="top">
            <span>© 2026 Yieldr · Agent stack for onchain funds</span>
            <nav>
              <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">X</a>
              <Link href="/build-in-public">Build log</Link>
              <Link href="/explorer">Vaults</Link>
            </nav>
          </div>
          <p className="disc">
            Nothing on this site constitutes an offer to sell or solicitation to buy any security or financial
            instrument, or financial advice of any kind. Pattern examples are illustrative. Performance data
            reflects Yieldr project capital, not external depositor capital. Past behaviour is not a guarantee
            of future results. Agent Vaults are not yet open to outside deposits; they are planned for Q1 2027.
            Not available to residents of the United States, United Kingdom, Canada, China, or jurisdictions
            where offering crypto financial services is restricted.
          </p>
        </div>
      </footer>
    </div>
  );
}

