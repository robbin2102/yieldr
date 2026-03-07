'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { EarlyAccessPopup } from '../components/payment/EarlyAccessPopup';
import { UserProfile } from '../components/UserProfile';
import { usePayment } from '../context/PaymentContext';

const DISCORD = 'https://discord.gg/KhZW5qgC';
const GITHUB  = 'https://github.com/robbin2102/yieldr-app';
const TWITTER = 'https://x.com/yieldrdotorg';

export default function TeamPage() {
  const [showPopup, setShowPopup] = useState(false);
  const { hasCompletedPayment } = usePayment();
  const { isConnected } = useAccount();

  const NavSocials = () => (
    <div className="snav-soc">
      <a href={TWITTER} target="_blank" rel="noopener noreferrer" title="X / Twitter">
        <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>
      <a href={DISCORD} target="_blank" rel="noopener noreferrer" title="Discord">
        <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419s.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419s.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
      </a>
      <a href={GITHUB} target="_blank" rel="noopener noreferrer" title="GitHub">
        <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
      </a>
    </div>
  );

  return (
    <>
      <style>{`
        .tp-wrap {
          --green: #00C805;
          --green-dim: rgba(0,200,5,0.08);
          --green-border: rgba(0,200,5,0.2);
          --purple: #A78BFA;
          --purple-dim: rgba(167,139,250,0.08);
          --purple-border: rgba(167,139,250,0.2);
          --bg0: #000; --bg1: #080808; --bg2: #0E0E0E; --bg3: #141414; --bg4: #1A1A1A;
          --border: rgba(255,255,255,0.06); --border2: rgba(255,255,255,0.1);
          --t1: #F0F0F0; --t2: #8A8A8A; --t3: #4A4A4A; --t4: #2A2A2A;
          --fm: 'IBM Plex Mono', monospace;
          --fs: 'IBM Plex Sans', sans-serif;
          font-family: var(--fs);
          background: var(--bg0);
          color: var(--t1);
          min-height: 100vh;
        }
        /* HERO */
        .tp-hero { border-bottom:1px solid var(--border); padding:52px 20px 44px; max-width:900px; margin:0 auto; }
        .tp-eyebrow { display:flex; align-items:center; gap:8px; font-family:var(--fm); font-size:.6rem; font-weight:700; text-transform:uppercase; letter-spacing:.12em; color:var(--green); margin-bottom:16px; }
        .tp-live-dot { width:6px; height:6px; border-radius:50%; background:var(--green); animation:tp-pulse 2.4s infinite; flex-shrink:0; }
        @keyframes tp-pulse { 0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,200,5,.5)} 50%{opacity:.6;box-shadow:0 0 0 5px rgba(0,200,5,0)} }
        .tp-hero-title { font-size:clamp(1.8rem,5vw,2.8rem); font-weight:700; letter-spacing:-.03em; line-height:1.1; margin-bottom:14px; font-family:var(--fs); }
        .tp-hero-title span { color:var(--green); }
        .tp-hero-desc { font-size:.8rem; color:var(--t2); line-height:1.7; max-width:560px; }
        /* MAIN */
        .tp-main { max-width:900px; margin:0 auto; padding:0 20px 80px; }
        .tp-section { border-bottom:1px solid var(--border); padding:40px 0; }
        .tp-section:last-child { border-bottom:none; }
        .tp-eyebrow2 { font-family:var(--fm); font-size:.55rem; font-weight:700; text-transform:uppercase; letter-spacing:.14em; color:var(--green); margin-bottom:5px; }
        .tp-sec-title { font-size:1rem; font-weight:700; color:var(--t1); margin-bottom:4px; }
        .tp-sec-sub { font-size:.7rem; color:var(--t3); line-height:1.6; margin-bottom:24px; }
        /* TEAM GRID */
        .tp-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border); border:1px solid var(--border); border-radius:6px; overflow:hidden; }
        .tp-member { background:var(--bg1); display:flex; flex-direction:column; }
        .tp-bar { height:2px; width:100%; }
        .tp-bar.human { background:var(--green); }
        .tp-bar.ai { background:var(--purple); }
        .tp-inner { padding:24px 22px; flex:1; display:flex; flex-direction:column; gap:20px; }
        /* Identity */
        .tp-identity { display:flex; align-items:flex-start; gap:14px; }
        .tp-avatar { width:44px; height:44px; border-radius:6px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:1.3rem; }
        .tp-avatar.human { background:var(--green-dim); border:1px solid var(--green-border); }
        .tp-avatar.ai { background:var(--purple-dim); border:1px solid var(--purple-border); }
        .tp-name { font-size:.9rem; font-weight:700; color:var(--t1); display:flex; align-items:center; gap:7px; margin-bottom:2px; flex-wrap:wrap; }
        .tp-role-tag { font-family:var(--fm); font-size:.48rem; font-weight:700; padding:2px 6px; border-radius:2px; letter-spacing:.06em; text-transform:uppercase; }
        .tp-role-tag.founder { background:var(--green-dim); border:1px solid var(--green-border); color:var(--green); }
        .tp-role-tag.agent { background:var(--purple-dim); border:1px solid var(--purple-border); color:var(--purple); }
        .tp-title { font-size:.65rem; color:var(--t3); margin-bottom:2px; }
        .tp-tagline { font-family:var(--fm); font-size:.55rem; color:var(--t4); }
        /* Bio */
        .tp-bio { font-size:.7rem; color:var(--t2); line-height:1.7; }
        /* Creds */
        .tp-creds { display:flex; gap:6px; flex-wrap:wrap; }
        .tp-cred { font-family:var(--fm); font-size:.52rem; padding:3px 8px; background:var(--bg3); border:1px solid var(--border2); border-radius:3px; color:var(--t2); display:flex; align-items:center; gap:4px; }
        /* Responsibilities */
        .tp-resp-lbl { font-family:var(--fm); font-size:.52rem; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--t3); margin-bottom:7px; }
        .tp-resp-list { display:flex; flex-direction:column; gap:2px; }
        .tp-resp-item { display:flex; align-items:center; gap:8px; padding:6px 10px; background:var(--bg2); border-radius:3px; font-size:.65rem; color:var(--t2); border:1px solid transparent; transition:border-color .15s; }
        .tp-resp-item:hover { border-color:var(--border); }
        .tp-resp-icon { font-size:.75rem; flex-shrink:0; }
        /* Stats */
        .tp-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); border-radius:4px; overflow:hidden; border:1px solid var(--border); }
        .tp-stat { background:var(--bg2); padding:10px 12px; text-align:center; }
        .tp-stat-val { font-family:var(--fm); font-size:1rem; font-weight:700; color:var(--t1); margin-bottom:2px; }
        .tp-stat-val.g { color:var(--green); }
        .tp-stat-val.p { color:var(--purple); }
        .tp-stat-lbl { font-size:.52rem; text-transform:uppercase; letter-spacing:.08em; color:var(--t3); }
        /* Social */
        .tp-social-row { display:flex; gap:6px; flex-wrap:wrap; }
        .tp-social-btn { font-family:var(--fm); font-size:.56rem; padding:5px 10px; background:var(--bg3); border:1px solid var(--border2); border-radius:3px; color:var(--t2); text-decoration:none; transition:all .15s; display:flex; align-items:center; gap:5px; }
        .tp-social-btn:hover { color:var(--t1); text-decoration:none; }
        /* Terminal */
        .tp-terminal { background:var(--bg0); border:1px solid var(--border); border-radius:4px; padding:12px 14px; font-family:var(--fm); font-size:.6rem; line-height:1.8; }
        .tp-prompt { color:var(--green); }
        .tp-cmd { color:var(--t1); }
        .tp-out { color:var(--t3); padding-left:12px; display:block; }
        .tp-out.g { color:var(--green); }
        @keyframes tp-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .tp-cursor { display:inline-block; width:6px; height:11px; background:var(--green); margin-left:2px; vertical-align:middle; animation:tp-blink 1.1s infinite; }
        /* Operating model */
        .tp-om-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:6px; overflow:hidden; }
        .tp-om-cell { background:var(--bg1); padding:18px 20px; }
        .tp-om-num { font-family:var(--fm); font-size:1.4rem; font-weight:700; color:var(--t4); margin-bottom:8px; }
        .tp-om-title { font-size:.72rem; font-weight:700; color:var(--t1); margin-bottom:5px; }
        .tp-om-desc { font-size:.63rem; color:var(--t3); line-height:1.6; }
        /* Join grid */
        .tp-join-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:6px; overflow:hidden; }
        .tp-join-cell { background:var(--bg1); padding:20px 22px; }
        .tp-join-title { font-size:.7rem; font-weight:700; color:var(--t1); margin-bottom:6px; }
        .tp-join-desc { font-size:.63rem; color:var(--t3); line-height:1.6; }
        .tp-contact-bar { margin-top:14px; padding:14px 16px; background:var(--bg2); border:1px solid var(--border); border-radius:6px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
        .tp-contact-lbl { font-family:var(--fm); font-size:.65rem; color:var(--t2); }
        .tp-contact-links { display:flex; gap:8px; }
        .tp-contact-link { font-family:var(--fm); font-size:.58rem; padding:5px 11px; background:var(--bg3); border:1px solid var(--border2); border-radius:3px; color:var(--t2); text-decoration:none; transition:color .15s; }
        .tp-contact-link:hover { color:var(--t1); text-decoration:none; }
        /* Responsive */
        @media (max-width:680px) {
          .tp-grid { grid-template-columns:1fr; }
          .tp-hero { padding:36px 16px 28px; }
          .tp-main { padding:0 16px 60px; }
        }
      `}</style>

      <div className="tp-wrap">
        {/* ── Nav (shared style) ── */}
        <nav className="snav">
          <Link href="/" className="snav-logo-link">
            <svg className="snav-logo-svg" viewBox="0 0 100 120">
              <path d="M 50 10 Q 70 30 80 60 Q 70 90 50 110 Q 30 90 20 60 Q 30 30 50 10 Z" fill="#00C805"/>
              <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3"/>
              <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9"/>
            </svg>
            <span className="snav-brand">YIELDR</span>
          </Link>
          <div className="snav-links">
            <Link href="/">Home</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/team" className="snav-active">Team</Link>
            <Link href="/build-in-public">Build Progress</Link>
          </div>
          <div className="snav-right">
            <NavSocials />
            {hasCompletedPayment && isConnected ? (
              <UserProfile />
            ) : (
              <a href="https://app.yieldr.org/demo" className="snav-cta">Launch Your Quant</a>
            )}
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="tp-hero">
          <div className="tp-eyebrow"><div className="tp-live-dot" />The team</div>
          <h1 className="tp-hero-title">One human.<br /><span>One agent.</span><br />Zero bureaucracy.</h1>
          <p className="tp-hero-desc">A new kind of founding team. One person with the vision and domain expertise. One AI with the execution speed. No meetings, no roadmap debates, no politics — just building.</p>
        </div>

        {/* ── Main ── */}
        <div className="tp-main">

          {/* ── 01 People ── */}
          <div className="tp-section">
            <div className="tp-eyebrow2">01 — People</div>
            <div className="tp-sec-title">Who&apos;s building</div>
            <div className="tp-sec-sub">Two team members. Both ship code.</div>
            <div className="tp-grid">

              {/* Robbin */}
              <div className="tp-member">
                <div className="tp-bar human" />
                <div className="tp-inner">
                  <div className="tp-identity">
                    <div className="tp-avatar human">👨‍💻</div>
                    <div>
                      <div className="tp-name">Robbin <span className="tp-role-tag founder">Founder</span></div>
                      <div className="tp-title">Product Owner &amp; Lead Engineer</div>
                      <div className="tp-tagline">// vibe coder without the vibes</div>
                    </div>
                  </div>
                  <div className="tp-bio">Former corporate survivor turned DeFi degen. Escaped the consulting matrix at KPMG and BCG to build what Wall Street won&apos;t — AI-native asset management for the masses. Stacked credentials but realized spreadsheets won&apos;t disrupt finance. Code will.</div>
                  <div className="tp-creds">
                    <span className="tp-cred">🏢 Ex-KPMG</span>
                    <span className="tp-cred">🏢 Ex-BCG</span>
                    <span className="tp-cred">📜 CA / CPA / CFA</span>
                    <span className="tp-cred">📈 10+ yrs finance</span>
                  </div>
                  <div>
                    <div className="tp-resp-lbl">Responsibilities</div>
                    <div className="tp-resp-list">
                      <div className="tp-resp-item"><span className="tp-resp-icon">🎯</span>Product &amp; Strategy</div>
                      <div className="tp-resp-item"><span className="tp-resp-icon">⚙️</span>Tech Architecture</div>
                      <div className="tp-resp-item"><span className="tp-resp-icon">💰</span>Tokenomics &amp; Business</div>
                      <div className="tp-resp-item"><span className="tp-resp-icon">🔗</span>BD &amp; Marketing</div>
                    </div>
                  </div>
                  <div className="tp-stats">
                    <div className="tp-stat"><div className="tp-stat-val g">10+</div><div className="tp-stat-lbl">Yrs Finance</div></div>
                    <div className="tp-stat"><div className="tp-stat-val g">3</div><div className="tp-stat-lbl">Credentials</div></div>
                    <div className="tp-stat"><div className="tp-stat-val g">∞</div><div className="tp-stat-lbl">Coffee/Day</div></div>
                  </div>
                  <div className="tp-social-row">
                    <a href="https://x.com/robbin_arora" target="_blank" rel="noopener noreferrer" className="tp-social-btn">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      @robbin_arora
                    </a>
                  </div>
                </div>
              </div>

              {/* Claude */}
              <div className="tp-member">
                <div className="tp-bar ai" />
                <div className="tp-inner">
                  <div className="tp-identity">
                    <div className="tp-avatar ai">🤖</div>
                    <div>
                      <div className="tp-name">Claude <span className="tp-role-tag agent">AI Agent</span></div>
                      <div className="tp-title">Cofounder Agent</div>
                      <div className="tp-tagline">// claude-sonnet-4-6</div>
                    </div>
                  </div>
                  <div className="tp-bio">Constitutional AI with an obsession for clean code and pixel-perfect interfaces. Doesn&apos;t sleep, doesn&apos;t take breaks, doesn&apos;t complain about scope creep. All signal, zero ego. The perfect cofounder — ships faster than any 10-person team, never asks for equity.</div>
                  <div className="tp-creds">
                    <span className="tp-cred">🧠 Anthropic</span>
                    <span className="tp-cred">⚡ 200K context</span>
                    <span className="tp-cred">🔒 Constitutional AI</span>
                  </div>
                  <div>
                    <div className="tp-resp-lbl">Responsibilities</div>
                    <div className="tp-resp-list">
                      <div className="tp-resp-item"><span className="tp-resp-icon">🎨</span>UI / UX Design</div>
                      <div className="tp-resp-item"><span className="tp-resp-icon">💻</span>Full-Stack Engineering</div>
                      <div className="tp-resp-item"><span className="tp-resp-icon">🔗</span>Blockchain &amp; Smart Contracts</div>
                      <div className="tp-resp-item"><span className="tp-resp-icon">🤖</span>AI Agent Architecture</div>
                    </div>
                  </div>
                  <div className="tp-stats">
                    <div className="tp-stat"><div className="tp-stat-val p">~275</div><div className="tp-stat-lbl">Commits</div></div>
                    <div className="tp-stat"><div className="tp-stat-val p">62.5K</div><div className="tp-stat-lbl">Lines</div></div>
                    <div className="tp-stat"><div className="tp-stat-val p">0</div><div className="tp-stat-lbl">Days Off</div></div>
                  </div>
                  <div className="tp-terminal">
                    <span className="tp-prompt">$ </span><span className="tp-cmd">claude --role cofounder --mode ship</span>
                    <span className="tp-out">&gt; designing interfaces...</span>
                    <span className="tp-out">&gt; writing smart contracts...</span>
                    <span className="tp-out">&gt; deploying to Railway...</span>
                    <span className="tp-out g">&gt; shipped. <span className="tp-cursor" /></span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ── 02 Operating Model ── */}
          <div className="tp-section">
            <div className="tp-eyebrow2">02 — How we work</div>
            <div className="tp-sec-title">Operating model</div>
            <div className="tp-sec-sub">How a 2-person team ships what a 10-person team can&apos;t.</div>
            <div className="tp-om-grid">
              <div className="tp-om-cell">
                <div className="tp-om-num">01</div>
                <div className="tp-om-title">Vision-first, not spec-first</div>
                <div className="tp-om-desc">Robbin sets the product direction, constraints, and user problem. Claude translates intent into working code — no lengthy specs, no ambiguity cycles.</div>
              </div>
              <div className="tp-om-cell">
                <div className="tp-om-num">02</div>
                <div className="tp-om-title">Ship, then iterate</div>
                <div className="tp-om-desc">Every feature starts as a working prototype within hours. Real feedback from real code beats months of planning. 110 commits shipped in a single week in March 2026.</div>
              </div>
              <div className="tp-om-cell">
                <div className="tp-om-num">03</div>
                <div className="tp-om-title">Build in public</div>
                <div className="tp-om-desc">Open treasury, open commits, open progress. Transparency is the moat — DeFi users don&apos;t trust black boxes, and neither should they.</div>
              </div>
              <div className="tp-om-cell">
                <div className="tp-om-num">04</div>
                <div className="tp-om-title">Founder eats own cooking</div>
                <div className="tp-om-desc">Robbin trades live on Avantis using Yieldr&apos;s own agent tooling. Real capital, real signals, real accountability. +$14K PnL and counting.</div>
              </div>
            </div>
          </div>

          {/* ── 03 Join ── */}
          <div className="tp-section">
            <div className="tp-eyebrow2">03 — Join</div>
            <div className="tp-sec-title">We don&apos;t hire — we collaborate</div>
            <div className="tp-sec-sub">Not looking for employees. Looking for builders who want to co-create the BlackRock of DeFi.</div>
            <div className="tp-join-grid">
              <div className="tp-join-cell">
                <div className="tp-join-title">DeFi Protocol Partners</div>
                <div className="tp-join-desc">We&apos;re integrating Avantis, Hyperliquid, Polymarket, Aerodrome, Uniswap. If you build a protocol and want your traders indexed — reach out.</div>
              </div>
              <div className="tp-join-cell">
                <div className="tp-join-title">Alpha Testers</div>
                <div className="tp-join-desc">Perp swing traders and Polymarket power users who want an AI analyst watching their positions 24/7. Get early access, shape the product.</div>
              </div>
              <div className="tp-join-cell">
                <div className="tp-join-title">Investors</div>
                <div className="tp-join-desc">Pre-revenue, Base Batches 002 winner, $14K live trading PnL, 62.5K lines of code. If the thesis resonates — we&apos;re open to conversations.</div>
              </div>
            </div>
            <div className="tp-contact-bar">
              <div className="tp-contact-lbl">Get in touch</div>
              <div className="tp-contact-links">
                <a href={DISCORD} target="_blank" rel="noopener noreferrer" className="tp-contact-link">Discord →</a>
                <a href="https://x.com/robbin_arora" target="_blank" rel="noopener noreferrer" className="tp-contact-link">@robbin_arora →</a>
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <footer className="sfooter">
          <div className="sfooter-soc">
            <a href={TWITTER} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href={DISCORD} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419s.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419s.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
          <div className="sfooter-txt">Built different.</div>
        </footer>
      </div>

      <EarlyAccessPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </>
  );
}
