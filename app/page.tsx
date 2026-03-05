'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { EarlyAccessPopup } from './components/payment/EarlyAccessPopup';
import { UserProfile } from './components/UserProfile';
import { usePayment } from './context/PaymentContext';

export default function HomePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const demoStartedRef = useRef(false);
  const { hasCompletedPayment } = usePayment();
  const { isConnected } = useAccount();

  // Intersection observer for fade-in sections
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('lp-visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.lp-fade').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Animated agent terminal demo
  useEffect(() => {
    if (demoStartedRef.current) return;

    const messages = [
      { t: 'l', x: 'Wallet connected — scanning positions across Avantis, Hyperliquid, Polymarket...' },
      { t: 'l', x: 'Found 1 BTC/USDC SHORT on Avantis · 2 positions on Polymarket' },
      { t: 'a', x: '<strong>Portfolio scanned.</strong> BTC short up <span class="lp-gr">+$20K (+200%)</span>. Polymarket: Fed rate cut YES at 68¢ ($5K), ETH ETF approval NO at 72¢ ($3K). $50K USDC idle.' },
      { t: 'u', x: 'Should I take profits on my BTC short?' },
      { t: 'l', x: 'Scanning top perp trader positioning on Hyperliquid & Avantis...' },
      { t: 'a', x: '<strong>Take partial profits.</strong> 67% of top traders closing shorts. Close 50% to lock <span class="lp-gr">$10K</span>, trail stop at $95K on rest.' },
      { t: 'u', x: 'My Fed rate cut position — whales are selling. Should I hold?' },
      { t: 'l', x: 'Analyzing Polymarket whale activity on Fed markets...' },
      { t: 'a', x: '<strong>Careful.</strong> 3 whale wallets sold $400K YES in last 4hrs. Odds dropped 76% to 72%. Your entry at 68¢ still has margin — set exit at 60¢ to protect downside.' },
      { t: 'u', x: 'Find alpha in Aerodrome LPs right now.' },
      { t: 'l', x: 'Scanning concentrated liquidity pools on Aerodrome...' },
      { t: 'a', x: '<strong>Top pick:</strong> cbBTC/USDC pool at <span class="lp-gr">184% APR</span>. TVL $12M, fees +$5.7K/week. Hedge IL with BTC short 0.65 BTC @ 5x for net <span class="lp-gr">~142% APR</span>.' },
    ];

    let index = 0;

    function addMsg() {
      if (index >= messages.length) return;
      const dm = document.getElementById('lpDemoMessages');
      if (!dm) return;

      const m = messages[index];
      const el = document.createElement('div');
      el.className = 'lp-dm';

      if (m.t === 'l') {
        el.innerHTML = `<div class="lp-dlg"><span class="lp-ck">⚡</span> ${m.x}</div>`;
      } else if (m.t === 'u') {
        el.innerHTML = `<div class="lp-dmu">${m.x}</div>`;
      } else {
        el.innerHTML = `<div class="lp-dma"><div class="lp-dmav">🤖</div><div class="lp-dmb">${m.x}</div></div>`;
      }

      dm.appendChild(el);
      dm.scrollTop = dm.scrollHeight;
      index++;

      const delay = m.t === 'l' ? 800 : m.t === 'u' ? 2000 : 2500;
      setTimeout(addMsg, delay);
    }

    const demoSection = document.querySelector('.lp-dms');
    if (!demoSection) return;

    const demoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !demoStartedRef.current) {
            demoStartedRef.current = true;
            setTimeout(addMsg, 500);
            demoObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    demoObserver.observe(demoSection);

    return () => demoObserver.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── Landing Page Design System ── */
        :root {
          --lp-bg: #000;
          --lp-bg2: #0a0a0a;
          --lp-bg3: #0d0d0d;
          --lp-bg4: #111;
          --lp-bg5: #141414;
          --lp-b1: #1a1a1a;
          --lp-b2: #222;
          --lp-g: #00C805;
          --lp-gd: rgba(0,200,5,0.15);
          --lp-r: #FF4444;
          --lp-y: #FFB800;
          --lp-t1: #e0e0e0;
          --lp-t2: #888;
          --lp-t3: #555;
          --lp-fm: 'JetBrains Mono', monospace;
          --lp-fd: 'Space Grotesk', sans-serif;
        }

        /* Scanline overlay */
        .lp-wrap::after {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.03) 2px,rgba(0,0,0,.03) 4px);
          pointer-events: none;
          z-index: 9999;
        }

        /* Grid background */
        .lp-gridbg {
          position: fixed;
          inset: 0;
          background-image: linear-gradient(rgba(0,200,5,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,5,.03) 1px,transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Nav ── */
        .lp-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 52px;
          background: rgba(0,0,0,.88);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--lp-b1);
          font-family: var(--lp-fm);
        }
        .lp-nl { display: flex; align-items: center; gap: .5rem; text-decoration: none; }
        .lp-nlogo { width: 22px; height: 26px; }
        .lp-nbrand { font-family: var(--lp-fd); font-weight: 700; font-size: 1rem; letter-spacing: 2px; color: var(--lp-t1); }
        .lp-nlinks { display: flex; align-items: center; gap: 1.5rem; }
        .lp-nlinks a { font-size: .7rem; color: var(--lp-t2); text-decoration: none; letter-spacing: .5px; text-transform: uppercase; transition: color .2s; }
        .lp-nlinks a:hover { color: var(--lp-t1); }
        .lp-ncta {
          font-family: var(--lp-fm); font-size: .7rem; font-weight: 600;
          letter-spacing: .5px; padding: .45rem 1.2rem;
          background: var(--lp-g); color: #000; border: none; cursor: pointer;
          text-transform: uppercase; transition: all .2s; text-decoration: none; display: inline-block;
        }
        .lp-ncta:hover { background: #00e006; text-decoration: none; }
        .lp-nsoc { display: flex; gap: .75rem; align-items: center; margin-left: .5rem; }
        .lp-nsoc a { display: flex; align-items: center; }
        .lp-nsoc svg { width: 16px; height: 16px; fill: var(--lp-t3); transition: fill .2s; }
        .lp-nsoc a:hover svg { fill: var(--lp-t1); }
        .lp-nav-right { display: flex; align-items: center; gap: 1rem; }

        /* Mobile hamburger */
        .lp-hamburger {
          display: none; background: none; border: none;
          cursor: pointer; color: var(--lp-t2); font-size: 1.2rem; padding: .25rem;
        }

        /* ── Ticker ── */
        .lp-ticker {
          position: fixed; top: 52px; left: 0; right: 0;
          z-index: 99; height: 28px;
          background: var(--lp-bg2); border-bottom: 1px solid var(--lp-b1);
          overflow: hidden; display: flex; align-items: center;
        }
        .lp-ticker-track {
          display: flex; animation: lp-ts 45s linear infinite; white-space: nowrap;
        }
        @keyframes lp-ts { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .lp-ti { font-family: var(--lp-fm); font-size: .65rem; color: var(--lp-t2); padding: 0 1.5rem; display: flex; align-items: center; gap: .4rem; }
        .lp-ti .lp-up { color: var(--lp-g); }
        .lp-ti .lp-dn { color: var(--lp-r); }
        .lp-tsep { color: var(--lp-b2); padding: 0 .5rem; font-size: .65rem; }

        /* ── Main ── */
        .lp-main { position: relative; z-index: 1; padding-top: 80px; font-family: var(--lp-fm); }
        .lp-sec { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }

        /* ── Hero ── */
        .lp-hero { padding-top: 4rem; padding-bottom: 3rem; text-align: center; }
        .lp-hctx { font-size: .72rem; color: var(--lp-t3); letter-spacing: .5px; line-height: 1.7; max-width: 520px; margin: 0 auto 1.5rem; }
        .lp-hero h1 { font-family: var(--lp-fd); font-size: clamp(2.2rem,5vw,3.4rem); font-weight: 700; letter-spacing: -1px; line-height: 1.1; margin-bottom: 1rem; color: var(--lp-t1); }
        .lp-hero h1 .lp-ac { color: var(--lp-g); }
        .lp-hsub { font-size: .85rem; color: var(--lp-t2); line-height: 1.6; max-width: 580px; margin: 0 auto 2rem; font-weight: 300; }
        .lp-hctas { display: flex; gap: 1rem; justify-content: center; align-items: center; margin-bottom: 2.5rem; flex-wrap: wrap; }
        .lp-bp {
          font-family: var(--lp-fm); font-size: .8rem; font-weight: 600;
          padding: .75rem 2rem; background: var(--lp-g); color: #000;
          border: none; cursor: pointer; letter-spacing: .5px;
          transition: all .2s; display: inline-flex; align-items: center; gap: .5rem; text-decoration: none;
        }
        .lp-bp:hover { background: #00e006; transform: translateY(-1px); text-decoration: none; }
        .lp-bs {
          font-family: var(--lp-fm); font-size: .75rem; color: var(--lp-t2);
          background: none; border: 1px solid var(--lp-b2); padding: .7rem 1.5rem;
          cursor: pointer; transition: all .2s; text-decoration: none;
          display: inline-flex; align-items: center; gap: .4rem;
        }
        .lp-bs:hover { border-color: var(--lp-t3); color: var(--lp-t1); text-decoration: none; }
        .lp-hstats { display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; }
        .lp-st { text-align: center; }
        .lp-sv { font-family: var(--lp-fd); font-size: 1.3rem; font-weight: 700; color: var(--lp-g); }
        .lp-sl { font-size: .6rem; color: var(--lp-t3); text-transform: uppercase; letter-spacing: 1px; margin-top: .2rem; }

        /* ── Fade in ── */
        .lp-fade { opacity: 0; transform: translateY(20px); transition: opacity .6s ease, transform .6s ease; }
        .lp-visible { opacity: 1; transform: translateY(0); }

        /* ── Gaps comparison ── */
        .lp-gaps { padding: 3rem 2rem; max-width: 1100px; margin: 0 auto; }
        .lp-glbl { font-size: .65rem; color: var(--lp-t3); text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-bottom: 1.5rem; font-family: var(--lp-fm); }
        .lp-gg { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1.5rem; align-items: stretch; }
        .lp-gc { border: 1px solid var(--lp-b1); background: var(--lp-bg3); padding: 1.5rem; }
        .lp-gch { font-size: .65rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; padding-bottom: .75rem; border-bottom: 1px solid var(--lp-b1); font-family: var(--lp-fm); }
        .lp-gc.lp-ws .lp-gch { color: var(--lp-t3); }
        .lp-gc.lp-yl .lp-gch { color: var(--lp-g); }
        .lp-gis { display: flex; flex-direction: column; gap: .6rem; }
        .lp-gi { font-size: .72rem; color: var(--lp-t2); display: flex; align-items: center; gap: .5rem; }
        .lp-gi .lp-ic { font-size: .6rem; width: 16px; text-align: center; flex-shrink: 0; }
        .lp-gc.lp-ws .lp-gi .lp-ic { color: var(--lp-t3); }
        .lp-gc.lp-yl .lp-gi .lp-ic { color: var(--lp-g); }
        .lp-gc.lp-yl { border-color: rgba(0,200,5,.2); background: linear-gradient(135deg,rgba(0,200,5,.03),transparent); }
        .lp-gc.lp-yl .lp-gi { color: var(--lp-t1); }
        .lp-gdiv { display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: var(--lp-t3); }
        .lp-gfn { font-size: .6rem; color: var(--lp-t3); text-align: center; padding-top: .75rem; font-family: var(--lp-fm); }
        .lp-gc.lp-ws .lp-gfn { color: var(--lp-r); opacity: .6; }
        .lp-gc.lp-yl .lp-gfn { color: var(--lp-g); }

        /* ── Dashboard ── */
        .lp-ds { padding: 4rem 2rem; max-width: 1100px; margin: 0 auto; }
        .lp-sh { text-align: center; margin-bottom: 2rem; }
        .lp-stag { font-size: .6rem; text-transform: uppercase; letter-spacing: 2px; color: var(--lp-g); margin-bottom: .5rem; font-family: var(--lp-fm); }
        .lp-sttl { font-family: var(--lp-fd); font-size: 1.6rem; font-weight: 600; color: var(--lp-t1); }
        .lp-ssub { font-size: .75rem; color: var(--lp-t2); margin-top: .4rem; font-family: var(--lp-fm); }
        .lp-db { border: 1px solid var(--lp-b1); background: var(--lp-bg3); }
        .lp-dbar { display: flex; align-items: center; justify-content: space-between; padding: .6rem 1rem; border-bottom: 1px solid var(--lp-b1); background: var(--lp-bg2); }
        .lp-dbl { display: flex; align-items: center; gap: .5rem; font-size: .65rem; color: var(--lp-t2); font-family: var(--lp-fm); }
        .lp-dbdot { width: 6px; height: 6px; background: var(--lp-g); border-radius: 50%; animation: lp-pu 2s ease-in-out infinite; }
        @keyframes lp-pu { 0%,100%{opacity:1} 50%{opacity:.4} }
        .lp-dbr { font-size: .6rem; color: var(--lp-t3); font-family: var(--lp-fm); }
        .lp-dgrid { display: grid; grid-template-columns: 1fr 1fr; }
        .lp-dpan { padding: 1rem; border-right: 1px solid var(--lp-b1); }
        .lp-dpan:last-child { border-right: none; }
        .lp-ph { font-size: .6rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--lp-t3); padding-bottom: .6rem; border-bottom: 1px solid var(--lp-b1); margin-bottom: .75rem; font-family: var(--lp-fm); }
        .lp-sig { display: flex; gap: .6rem; padding: .5rem 0; border-bottom: 1px solid rgba(255,255,255,.03); }
        .lp-sig:last-of-type { border-bottom: none; }
        .lp-sdot { width: 6px; height: 6px; border-radius: 50%; margin-top: .35rem; flex-shrink: 0; }
        .lp-sdot.lp-sg { background: var(--lp-g); }
        .lp-sdot.lp-sy { background: var(--lp-y); }
        .lp-sdot.lp-sr { background: var(--lp-r); }
        .lp-stxt { font-size: .7rem; color: var(--lp-t2); line-height: 1.5; font-family: var(--lp-fm); }
        .lp-stxt strong { color: var(--lp-t1); font-weight: 500; }
        .lp-tr { display: flex; justify-content: space-between; align-items: center; padding: .5rem 0; border-bottom: 1px solid rgba(255,255,255,.03); }
        .lp-tr:last-child { border-bottom: none; }
        .lp-tinf { display: flex; flex-direction: column; gap: .15rem; }
        .lp-tadr { font-size: .7rem; color: var(--lp-t1); font-weight: 500; font-family: var(--lp-fm); }
        .lp-tmet { font-size: .6rem; color: var(--lp-t3); font-family: var(--lp-fm); }
        .lp-tpnl { font-size: .75rem; font-weight: 600; color: var(--lp-g); font-family: var(--lp-fm); }
        .lp-alpr { margin-top: .75rem; padding: .5rem .75rem; background: var(--lp-gd); border-left: 2px solid var(--lp-g); font-size: .62rem; color: var(--lp-t2); display: flex; align-items: center; gap: .4rem; font-family: var(--lp-fm); }

        /* ── Agent Terminal ── */
        .lp-dms { padding: 3rem 2rem; max-width: 1100px; margin: 0 auto; }
        .lp-dc { border: 1px solid var(--lp-b1); background: var(--lp-bg3); overflow: hidden; }
        .lp-dtb { display: flex; align-items: center; gap: .4rem; padding: .6rem 1rem; background: var(--lp-bg2); border-bottom: 1px solid var(--lp-b1); }
        .lp-dd { width: 8px; height: 8px; border-radius: 50%; }
        .lp-dd.r { background: #FF5F57; }
        .lp-dd.y { background: #FFBD2E; }
        .lp-dd.g { background: #28C840; }
        .lp-dtt { font-size: .6rem; color: var(--lp-t3); margin-left: .5rem; font-family: var(--lp-fm); }
        .lp-dcont { position: relative; min-height: 380px; max-height: 420px; overflow: hidden; }
        .lp-dmsg { padding: 1rem; display: flex; flex-direction: column; gap: .75rem; overflow-y: auto; max-height: 350px; }
        .lp-dm { opacity: 0; transform: translateY(10px); animation: lp-ma .4s ease forwards; }
        @keyframes lp-ma { to { opacity: 1; transform: translateY(0); } }
        .lp-dmu { align-self: flex-end; background: var(--lp-bg5); border: 1px solid var(--lp-b2); padding: .5rem .75rem; font-size: .72rem; color: var(--lp-t1); max-width: 70%; font-family: var(--lp-fm); }
        .lp-dma { display: flex; gap: .6rem; max-width: 85%; }
        .lp-dmav { width: 28px; height: 28px; background: var(--lp-gd); border: 1px solid rgba(0,200,5,.2); display: flex; align-items: center; justify-content: center; font-size: .8rem; flex-shrink: 0; border-radius: 2px; }
        .lp-dmb { background: var(--lp-bg2); border: 1px solid var(--lp-b1); padding: .6rem .75rem; font-size: .7rem; line-height: 1.6; color: var(--lp-t2); font-family: var(--lp-fm); }
        .lp-dmb strong { color: var(--lp-t1); }
        .lp-gr { color: var(--lp-g); }
        .lp-rd { color: var(--lp-r); }
        .lp-dlg { font-size: .62rem; color: var(--lp-t3); display: flex; align-items: center; gap: .4rem; padding: .2rem 0; font-family: var(--lp-fm); }
        .lp-ck { color: var(--lp-g); }
        .lp-dco { position: absolute; bottom: 0; left: 0; right: 0; padding: 2.5rem 1rem 1.5rem; background: linear-gradient(transparent,var(--lp-bg3) 50%); text-align: center; }

        /* ── Vision ── */
        .lp-vs { padding: 4rem 2rem; max-width: 1100px; margin: 0 auto; }
        .lp-vq { font-size: .72rem; color: var(--lp-t3); text-align: center; max-width: 540px; margin: 0 auto 2.5rem; line-height: 1.7; font-style: italic; font-family: var(--lp-fm); }
        .lp-pl { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; border: 1px solid var(--lp-b1); }
        .lp-ps { padding: 1.5rem 1rem; border-right: 1px solid var(--lp-b1); position: relative; }
        .lp-ps:last-child { border-right: none; }
        .lp-ps.lp-act { background: linear-gradient(180deg,rgba(0,200,5,.05),transparent); }
        .lp-pst { font-size: .55rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: .75rem; font-family: var(--lp-fm); }
        .lp-ps.lp-act .lp-pst { color: var(--lp-g); }
        .lp-ps:not(.lp-act) .lp-pst { color: var(--lp-t3); }
        .lp-pn { font-family: var(--lp-fd); font-size: 1rem; font-weight: 600; margin-bottom: .4rem; color: var(--lp-t1); }
        .lp-pdesc { font-size: .68rem; color: var(--lp-t2); line-height: 1.5; font-family: var(--lp-fm); }
        .lp-parr { position: absolute; right: -6px; top: 50%; transform: translateY(-50%); color: var(--lp-t3); font-size: .7rem; z-index: 2; font-family: var(--lp-fm); }
        .lp-plb { text-align: center; padding: 1.5rem; font-size: .8rem; color: var(--lp-t2); border: 1px solid var(--lp-b1); border-top: none; background: var(--lp-bg3); font-family: var(--lp-fm); }
        .lp-plb strong { color: var(--lp-t1); }

        /* ── Proof ── */
        .lp-prs { padding: 3rem 2rem; max-width: 1100px; margin: 0 auto; }
        .lp-prg { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--lp-b1); border: 1px solid var(--lp-b1); }
        .lp-prc { background: var(--lp-bg3); padding: 1.5rem; text-decoration: none; transition: background .2s; display: block; }
        .lp-prc:hover { background: var(--lp-bg4); text-decoration: none; }
        .lp-pri { font-size: 1.2rem; margin-bottom: .75rem; }
        .lp-prt { font-family: var(--lp-fd); font-size: .85rem; font-weight: 600; color: var(--lp-t1); margin-bottom: .3rem; }
        .lp-prd { font-size: .68rem; color: var(--lp-t3); line-height: 1.5; font-family: var(--lp-fm); }
        .lp-prh { margin-top: 1.5rem; padding: 1rem 1.5rem; border: 1px solid var(--lp-b1); background: var(--lp-bg3); text-align: center; }
        .lp-prht { font-size: .75rem; color: var(--lp-t2); font-family: var(--lp-fm); }
        .lp-prht strong { color: var(--lp-g); }
        .lp-prhs { font-size: .6rem; color: var(--lp-t3); margin-top: .3rem; font-family: var(--lp-fm); }

        /* ── Final CTA ── */
        .lp-fc { padding: 4rem 2rem; max-width: 1100px; margin: 0 auto; text-align: center; }
        .lp-fcq { font-family: var(--lp-fd); font-size: 1.4rem; font-weight: 600; margin-bottom: .5rem; color: var(--lp-t1); }
        .lp-fcs { font-size: .75rem; color: var(--lp-t2); margin-bottom: 1.5rem; font-family: var(--lp-fm); }
        .lp-fcs strong { color: var(--lp-g); }

        /* ── Partners ── */
        .lp-parts { padding: 2rem; max-width: 1100px; margin: 0 auto; text-align: center; border-top: 1px solid var(--lp-b1); }
        .lp-partl { font-size: .55rem; text-transform: uppercase; letter-spacing: 3px; color: var(--lp-t3); margin-bottom: 1.2rem; font-family: var(--lp-fm); }
        .lp-partlg { display: flex; justify-content: center; align-items: center; gap: 2.5rem; flex-wrap: wrap; }
        .lp-partlg img { height: 22px; opacity: .35; filter: grayscale(100%) brightness(2); transition: opacity .2s; }
        .lp-partlg img:hover { opacity: .7; }

        /* ── Footer ── */
        .lp-footer { padding: 2rem; text-align: center; border-top: 1px solid var(--lp-b1); }
        .lp-fsoc { display: flex; justify-content: center; gap: 1rem; margin-bottom: .75rem; }
        .lp-fsoc a { display: flex; align-items: center; }
        .lp-fsoc svg { width: 16px; height: 16px; fill: var(--lp-t3); transition: fill .2s; }
        .lp-fsoc a:hover svg { fill: var(--lp-t1); }
        .lp-ftxt { font-size: .6rem; color: var(--lp-t3); font-family: var(--lp-fm); }
        .lp-ftxt a { color: var(--lp-g); }

        /* ── Mobile Menu ── */
        .lp-mobile-menu {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,.95); backdrop-filter: blur(12px);
          display: flex; flex-direction: column; padding: 1.5rem;
          font-family: var(--lp-fm);
        }
        .lp-mm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .lp-mm-close { background: none; border: none; color: var(--lp-t2); font-size: 1.5rem; cursor: pointer; }
        .lp-mm-links { display: flex; flex-direction: column; gap: 1rem; }
        .lp-mm-link { font-size: .85rem; color: var(--lp-t2); text-decoration: none; letter-spacing: .5px; text-transform: uppercase; padding: .75rem 0; border-bottom: 1px solid var(--lp-b1); }
        .lp-mm-link:hover { color: var(--lp-t1); }
        .lp-mm-cta { margin-top: 1.5rem; padding: .85rem; background: var(--lp-g); color: #000; font-family: var(--lp-fm); font-size: .8rem; font-weight: 600; text-transform: uppercase; text-decoration: none; text-align: center; display: block; border: none; cursor: pointer; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .lp-nlinks { display: none; }
          .lp-hamburger { display: flex; }
          .lp-hero h1 { font-size: 2rem; }
          .lp-hstats { gap: 1.5rem; }
          .lp-gg { grid-template-columns: 1fr; }
          .lp-gdiv { transform: rotate(90deg); padding: .5rem 0; }
          .lp-dgrid { grid-template-columns: 1fr; }
          .lp-dpan { border-right: none; border-bottom: 1px solid var(--lp-b1); }
          .lp-dpan:last-child { border-bottom: none; }
          .lp-pl { grid-template-columns: 1fr 1fr; }
          .lp-ps { border-bottom: 1px solid var(--lp-b1); }
          .lp-parr { display: none; }
          .lp-prg { grid-template-columns: 1fr; }
          .lp-hctas { flex-direction: column; }
          .lp-hstats { gap: 1rem; }
          .lp-nav { padding: 0 1rem; }
          .lp-sec { padding: 0 1rem; }
          .lp-gaps, .lp-ds, .lp-dms, .lp-vs, .lp-prs, .lp-fc, .lp-parts { padding-left: 1rem; padding-right: 1rem; }
        }

        @media (max-width: 480px) {
          .lp-pl { grid-template-columns: 1fr; }
          .lp-hstats { gap: 1.5rem; }
          .lp-sttl { font-size: 1.3rem; }
        }
      `}</style>

      <div className="lp-wrap">
        <div className="lp-gridbg" />

        {/* ── Navigation ── */}
        <nav className="lp-nav">
          <Link href="/" className="lp-nl">
            <svg className="lp-nlogo" viewBox="0 0 100 120">
              <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
              <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3"/>
              <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9"/>
            </svg>
            <span className="lp-nbrand">YIELDR</span>
          </Link>

          <div className="lp-nav-right">
            <div className="lp-nlinks">
              <Link href="/docs">Docs</Link>
              <Link href="/team">Team</Link>
              <Link href="/build-in-public">Build Progress</Link>
              <div className="lp-nsoc">
                <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://discord.com/channels/1426305214176165941/1426305389812646091" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419s.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419s.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                </a>
                <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
              {hasCompletedPayment && isConnected ? (
                <UserProfile />
              ) : (
                <a href="https://app.yieldr.org/demo" className="lp-ncta">Launch Your Quant</a>
              )}
            </div>
            <button className="lp-hamburger" onClick={() => setShowMobileMenu(true)} aria-label="Open menu">
              ☰
            </button>
          </div>
        </nav>

        {/* ── Mobile Menu ── */}
        {showMobileMenu && (
          <div className="lp-mobile-menu">
            <div className="lp-mm-header">
              <Link href="/" className="lp-nl" onClick={() => setShowMobileMenu(false)}>
                <svg style={{width:22,height:26}} viewBox="0 0 100 120">
                  <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
                  <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3"/>
                  <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9"/>
                </svg>
                <span className="lp-nbrand">YIELDR</span>
              </Link>
              <button className="lp-mm-close" onClick={() => setShowMobileMenu(false)}>✕</button>
            </div>
            <div className="lp-mm-links">
              <Link href="/docs" className="lp-mm-link" onClick={() => setShowMobileMenu(false)}>Docs</Link>
              <Link href="/team" className="lp-mm-link" onClick={() => setShowMobileMenu(false)}>Team</Link>
              <Link href="/build-in-public" className="lp-mm-link" onClick={() => setShowMobileMenu(false)}>Build Progress</Link>
              {hasCompletedPayment && isConnected && (
                <Link href="/allocations" className="lp-mm-link" onClick={() => setShowMobileMenu(false)}>My Allocation</Link>
              )}
            </div>
            <a href="https://app.yieldr.org/demo" className="lp-mm-cta" onClick={() => setShowMobileMenu(false)}>
              Launch Your Quant — Free ↗
            </a>
            {!hasCompletedPayment && (
              <button className="lp-mm-cta" style={{marginTop:'.75rem',background:'transparent',border:'1px solid #1a1a1a',color:'#888'}} onClick={() => { setShowMobileMenu(false); setShowPopup(true); }}>
                Get Early Access
              </button>
            )}
          </div>
        )}

        {/* ── Ticker ── */}
        <div className="lp-ticker">
          <div className="lp-ticker-track">
            {[
              { label: 'BTC', val: '$86,412 ▼1.8%', up: false },
              { label: 'ETH', val: '$3,418 ▲0.6%', up: true },
              { label: 'HL Funding', val: '-0.012%', up: false },
              { label: 'Top trader 0xA3..4f', val: 'closed BTC short 12m ago', up: true },
              { label: 'ETH OI', val: '$4.2B ▲3.1%', up: true },
              { label: 'Polymarket: Fed rate cut', val: '72% YES', up: true },
              { label: 'AERO TVL', val: '$1.8B ▲2.4%', up: true },
              { label: 'Liquidations 24h', val: '$142M', up: false },
            ].map((item, i) => (
              <span key={i} style={{display:'contents'}}>
                <span className="lp-ti">{item.label} <span className={item.up ? 'lp-up' : 'lp-dn'}>{item.val}</span></span>
                <span className="lp-tsep">|</span>
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {[
              { label: 'BTC', val: '$86,412 ▼1.8%', up: false },
              { label: 'ETH', val: '$3,418 ▲0.6%', up: true },
              { label: 'HL Funding', val: '-0.012%', up: false },
              { label: 'Top trader 0xA3..4f', val: 'closed BTC short 12m ago', up: true },
              { label: 'ETH OI', val: '$4.2B ▲3.1%', up: true },
              { label: 'Polymarket: Fed rate cut', val: '72% YES', up: true },
              { label: 'AERO TVL', val: '$1.8B ▲2.4%', up: true },
              { label: 'Liquidations 24h', val: '$142M', up: false },
            ].map((item, i) => (
              <span key={`d${i}`} style={{display:'contents'}}>
                <span className="lp-ti">{item.label} <span className={item.up ? 'lp-up' : 'lp-dn'}>{item.val}</span></span>
                <span className="lp-tsep">|</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Main ── */}
        <main className="lp-main">

          {/* ── Hero ── */}
          <section className="lp-sec lp-hero">
            <p className="lp-hctx">The hedge fund desk, now onchain.</p>
            <h1>Every Trader Gets a <span className="lp-ac">Quant</span></h1>
            <p className="lp-hsub">AI agents that find alpha, watch your positions, and pre-empt moves — onchain, for everyone.</p>
            <div className="lp-hctas">
              <a href="https://app.yieldr.org/demo" className="lp-bp">Launch Your Quant — Free ↗</a>
              <a href="#dashboard" className="lp-bs">See how it works ↓</a>
            </div>
            <div className="lp-hstats">
              <div className="lp-st"><div className="lp-sv">30K+</div><div className="lp-sl">Traders Indexed</div></div>
              <div className="lp-st"><div className="lp-sv">2K+</div><div className="lp-sl">Markets Monitored</div></div>
              <div className="lp-st"><div className="lp-sv">100+</div><div className="lp-sl">Signals</div></div>
              <div className="lp-st"><div className="lp-sv">3</div><div className="lp-sl">Protocols</div></div>
            </div>
          </section>

          {/* ── Gaps Comparison ── */}
          <section className="lp-gaps lp-fade">
            <div className="lp-glbl">Same markets. Different firepower.</div>
            <div className="lp-gg">
              <div className="lp-gc lp-ws">
                <div className="lp-gch">Wall Street Hedge Fund</div>
                <div className="lp-gis">
                  <div className="lp-gi"><span className="lp-ic">✓</span> Analyst team scanning 24/7</div>
                  <div className="lp-gi"><span className="lp-ic">✓</span> Quant backtesting &amp; signals</div>
                  <div className="lp-gi"><span className="lp-ic">✓</span> Real-time risk management</div>
                  <div className="lp-gi"><span className="lp-ic">✓</span> Execution desk</div>
                </div>
                <div className="lp-gfn">$5M+ AUM minimum</div>
              </div>
              <div className="lp-gdiv">→</div>
              <div className="lp-gc lp-yl">
                <div className="lp-gch">With Yieldr</div>
                <div className="lp-gis">
                  <div className="lp-gi"><span className="lp-ic">✓</span> AI quant finds alpha across protocols</div>
                  <div className="lp-gi"><span className="lp-ic">✓</span> Monitors signals &amp; positions 24/7</div>
                  <div className="lp-gi"><span className="lp-ic">✓</span> Pre-empts moves with alerts</div>
                  <div className="lp-gi"><span className="lp-ic">✓</span> Execution agents (coming soon)</div>
                </div>
                <div className="lp-gfn">Open to everyone. Starting free.</div>
              </div>
            </div>
          </section>

          {/* ── Dashboard ── */}
          <section className="lp-ds lp-fade" id="dashboard">
            <div className="lp-sh">
              <div className="lp-stag">Your Quant, Live</div>
              <div className="lp-sttl">See what the agent surfaces</div>
              <div className="lp-ssub">Real-time alpha signals and top trader positioning across DeFi</div>
            </div>
            <div className="lp-db">
              <div className="lp-dbar">
                <div className="lp-dbl"><div className="lp-dbdot" /><span>Yieldr Agent — Monitoring 3 protocols</span></div>
                <div className="lp-dbr">Last updated: 2m ago</div>
              </div>
              <div className="lp-dgrid">
                <div className="lp-dpan">
                  <div className="lp-ph">Alpha Signals</div>
                  <div className="lp-sig">
                    <div className="lp-sdot lp-sg" />
                    <div className="lp-stxt"><strong>ETH funding flipped negative</strong> — 3 of top 10 traders opened longs. Historically bullish.</div>
                  </div>
                  <div className="lp-sig">
                    <div className="lp-sdot lp-sy" />
                    <div className="lp-stxt"><strong>Polymarket whale divergence</strong> — Fed rate cut at 72% but 3 insider wallets selling YES. Odds likely to drop.</div>
                  </div>
                  <div className="lp-sig">
                    <div className="lp-sdot lp-sr" />
                    <div className="lp-stxt"><strong>Liquidation cluster at $85.2K</strong> — $38M in longs stacked. Cascading risk elevated.</div>
                  </div>
                  <div className="lp-alpr"><span>📡</span> Polymarket odds shift alert → sent to 247 agents via Telegram</div>
                </div>
                <div className="lp-dpan">
                  <div className="lp-ph">Top Traders</div>
                  <div className="lp-tr">
                    <div className="lp-tinf"><span className="lp-tadr">0xA3..4f</span><span className="lp-tmet">73% WR · Sharpe 2.4 · Perps · closing BTC shorts</span></div>
                    <span className="lp-tpnl">+$342K</span>
                  </div>
                  <div className="lp-tr">
                    <div className="lp-tinf"><span className="lp-tadr">0x7B..2e</span><span className="lp-tmet">68% WR · Sharpe 1.9 · Perps · scaling into ETH</span></div>
                    <span className="lp-tpnl">+$218K</span>
                  </div>
                  <div className="lp-tr">
                    <div className="lp-tinf"><span className="lp-tadr">poly_insider</span><span className="lp-tmet">Brier 0.12 · 81% WR · Predictions · event timing edge</span></div>
                    <span className="lp-tpnl">+$89K</span>
                  </div>
                  <div className="lp-tr">
                    <div className="lp-tinf"><span className="lp-tadr">pm_quant</span><span className="lp-tmet">Brier 0.18 · 74% WR · Predictions · crypto &amp; politics</span></div>
                    <span className="lp-tpnl">+$156K</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Agent Terminal Demo ── */}
          <section className="lp-dms lp-fade">
            <div className="lp-sh">
              <div className="lp-stag">Agent Terminal</div>
              <div className="lp-sttl">Ask anything about your positions</div>
            </div>
            <div className="lp-dc">
              <div className="lp-dtb">
                <div className="lp-dd r" /><div className="lp-dd y" /><div className="lp-dd g" />
                <span className="lp-dtt">yieldr-agent — 0x7a3f...9c2e</span>
              </div>
              <div className="lp-dcont">
                <div className="lp-dmsg" id="lpDemoMessages" />
                <div className="lp-dco">
                  <a href="https://app.yieldr.org/demo" className="lp-bp">Launch Your Quant — Free</a>
                </div>
              </div>
            </div>
          </section>

          {/* ── Vision ── */}
          <section className="lp-vs lp-fade">
            <div className="lp-sh">
              <div className="lp-stag">The Vision</div>
              <div className="lp-sttl">From Quant to Hedge Fund</div>
            </div>
            <p className="lp-vq">&ldquo;Satoshi gave everyone money without banks. We&apos;re giving every trader a hedge fund without Wall Street.&rdquo;</p>
            <div className="lp-pl">
              <div className="lp-ps lp-act">
                <div className="lp-pst">● Live Now</div>
                <div className="lp-pn">Quant</div>
                <div className="lp-pdesc">Your AI quant. Discovers alpha, monitors positions, pre-empts moves 24/7.</div>
                <span className="lp-parr">→</span>
              </div>
              <div className="lp-ps">
                <div className="lp-pst">○ Next</div>
                <div className="lp-pn">Trader</div>
                <div className="lp-pdesc">Executes at optimal price. Hedges automatically. MEV protected.</div>
                <span className="lp-parr">→</span>
              </div>
              <div className="lp-ps">
                <div className="lp-pst">○ V2</div>
                <div className="lp-pn">PM</div>
                <div className="lp-pdesc">Manages risk across your portfolio. Stops losses before they compound.</div>
                <span className="lp-parr">→</span>
              </div>
              <div className="lp-ps">
                <div className="lp-pst">○ Vision</div>
                <div className="lp-pn">Onchain Vault</div>
                <div className="lp-pdesc">Anyone can invest. AI manages. Smart contracts enforce. 2/20 fees onchain.</div>
              </div>
            </div>
            <div className="lp-plb"><strong>Every good trader becomes a fund manager.</strong> Every investor gets institutional intelligence.</div>
          </section>

          {/* ── Proof / Recognition ── */}
          <section className="lp-prs lp-fade">
            <div className="lp-prg">
              <Link href="/build-in-public" className="lp-prc">
                <div className="lp-pri">🏆</div>
                <div className="lp-prt">Base Batches 002 Winner</div>
                <div className="lp-prd">Selected from 900+ projects for building DeFi infrastructure on Base.</div>
              </Link>
              <Link href="/build-in-public" className="lp-prc">
                <div className="lp-pri">📊</div>
                <div className="lp-prt">Building in Public</div>
                <div className="lp-prd">Weekly updates on code shipped, milestones hit, and treasury usage.</div>
              </Link>
              <Link href="/team" className="lp-prc">
                <div className="lp-pri">🔐</div>
                <div className="lp-prt">Treasury Public</div>
                <div className="lp-prd">All funds in multisig. Usage reported monthly. Full transparency.</div>
              </Link>
            </div>
            <div className="lp-prh">
              <div className="lp-prht">Founder put $5K on Avantis using Yieldr as copilot. It&apos;s <strong>$20K</strong> now.</div>
              <div className="lp-prhs">Verifiable onchain: defirobbin.base.eth</div>
            </div>
          </section>

          {/* ── Final CTA ── */}
          <section className="lp-fc lp-fade">
            <div className="lp-fcq">Wall Street has quants. Now you do too.</div>
            <div className="lp-fcs"><strong>500K free AI credits.</strong> No signup. No catch.</div>
            <a href="https://app.yieldr.org/demo" className="lp-bp">Launch Your Quant ↗</a>
          </section>

          {/* ── Partners ── */}
          <div className="lp-parts lp-fade">
            <div className="lp-partl">Integrated Protocols</div>
            <div className="lp-partlg">
              <img src="https://b22290bb4d42a7d0d0d796b264519fb5.cdn.bubble.io/f1760735602576x626366481309788300/Avantis%20White%20Logo%20-%20Vertical.png" alt="Avantis" />
              <img src="https://nftevening.com/wp-content/uploads/2025/03/hyperliquid-logo.png" alt="Hyperliquid" />
              <img src="https://avatars.githubusercontent.com/u/31669764?s=280&v=4" alt="Polymarket" />
            </div>
          </div>

        </main>

        {/* ── Footer ── */}
        <footer className="lp-footer">
          <div className="lp-fsoc">
            <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://github.com/robbin2102/yieldr-app" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
          <div className="lp-ftxt">Built different. <a href="https://yieldr.org">yieldr.org</a></div>
        </footer>
      </div>

      {/* Payment Popup — kept for early access flow */}
      <EarlyAccessPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
}
