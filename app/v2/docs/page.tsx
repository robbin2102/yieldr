'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../v2.css';
import './docs2.css';

const NAV = [
  { key: 'what-is-yieldr', label: 'What is Yieldr' },
  { key: 'the-problem', label: 'The Problem' },
  { key: 'the-solution', label: 'The Solution' },
  { key: 'agent-vaults', label: 'Agent Vaults' },
  { key: 'fund-launch-waitlist', label: 'Fund Launch Waitlist' },
  { key: 'dao-deposits', label: 'DAO & Treasury Depositors' },
  { key: 'allocation-agents', label: 'Allocation Agents' },
  { key: 'depositor-whitelist', label: 'Depositor Whitelist' },
  { key: 'yldr-token', label: '$YLDR Token' },
  { key: 'roadmap', label: 'Roadmap' },
  { key: 'risk', label: 'Risk & Restrictions' },
];

export default function V2DocsPage() {
  const [active, setActive] = useState('what-is-yieldr');

  return (
    <div className="v2-root docs2-root">
      <div className="v2-devbar">
        Design review build. <Link href="/">Back to production →</Link>
      </div>

      <div className="v2-nav">
        <div className="v2-wrap v2-nav-in">
          <Link href="/v2" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
            <div className="v2-nav-mark"><span /></div>
            <div className="v2-nav-name">Yieldr</div>
            <div className="v2-nav-tag">v2</div>
          </Link>
          <div className="v2-nav-right">
            <div className="v2-nav-links">
              <Link href="/v2">Home</Link>
              <Link href="/v2/explorer">Vaults</Link>
              <Link href="/v2/build-in-public">Build Log</Link>
            </div>
            <Link href="/v2/prelaunch-edge" className="v2-nav-cta">Reserve Genesis Access</Link>
          </div>
        </div>
      </div>

      <div className="docs2-body v2-wrap">
        <aside className="docs2-side">
          {NAV.map((n) => (
            <button key={n.key} className={active === n.key ? 'is-active' : ''} onClick={() => setActive(n.key)}>{n.label}</button>
          ))}
        </aside>

        <main className="docs2-main">
          {active === 'what-is-yieldr' && (
            <section>
              <div className="v2-slbl">Overview</div>
              <h1 className="v2-sec-h" style={{ fontSize: 36 }}>The <em style={{ fontStyle: 'italic', color: 'var(--accent-strong)' }}>Agent OS</em> for onchain funds.</h1>
              <p className="docs2-lead">Connect your wallet, prove your edge, and launch an agent vault — turning your onchain performance into recurring revenue.</p>
              <h2>What Yieldr does</h2>
              <p>Yieldr grades your onchain trading history into a single Edge score, then gives you the agent stack to turn that edge into a fund: Matching Agent finds depositors, Comms &amp; Monitoring Agents run the relationship, and Allocation Agent (later) rotates depositor capital toward the strongest edge.</p>
              <ul className="docs2-list">
                <li>Quant Agent — reads your wallet, grades Entry/Exit/Sizing, tells you if your edge is real</li>
                <li>Quant Terminal — real-time signals and top-trader flow on the apps you already trade on</li>
                <li>Agent Vaults — turn a proven edge into a fund depositors can join</li>
                <li>Allocation Agent — matches depositor capital to the vaults that fit it</li>
              </ul>
            </section>
          )}

          {active === 'the-problem' && (
            <section>
              <div className="v2-slbl">Why Yieldr Exists</div>
              <h1 className="v2-sec-h" style={{ fontSize: 32 }}>Great traders should run onchain funds. Most never do.</h1>
              <p className="docs2-lead">Your wallet is public. Your PnL is onchain. Your edge is more verifiable than anything in traditional finance. But you are still only trading your own capital.</p>
              <h2>The wall</h2>
              <p>Proving edge is not the same as operating a fund. Fund operations — depositor comms, accounting, risk limits, capital matching — is a full-time job most traders never wanted and can't justify building for themselves alone.</p>
              <h2>Yieldr removes the wall</h2>
              <p>The agent stack takes over everything except the trading itself: it grades your edge, matches you to depositors, and runs the ongoing relationship — so scaling means the agents doing more work, not you risking more of your own money.</p>
            </section>
          )}

          {active === 'the-solution' && (
            <section>
              <div className="v2-slbl">How It Works</div>
              <h1 className="v2-sec-h" style={{ fontSize: 32 }}>Every verified onchain edge gets an agent stack.</h1>
              <p className="docs2-lead">The vault is the capital layer. The agents are the operating layer. Together they turn onchain performance into recurring revenue.</p>
              <div className="docs2-stack">
                <div className="docs2-stack-row is-agent"><b>Agent Layer</b><span>Edge detection, matching, comms, monitoring, allocation rotation</span></div>
                <div className="docs2-stack-row"><b>Strategy Layer</b><span>Predictions, perps, LP, memecoins, project coins, RWAs, stock tokens</span></div>
                <div className="docs2-stack-row"><b>Capital Layer</b><span>Deposits, withdrawals, accounting, fee logic, risk limits, onchain transparency</span></div>
              </div>
              <h2>The outcome</h2>
              <p>Traders scale edge without becoming fund operators. Depositors allocate through agents instead of manually monitoring every vault. Yieldr becomes the operating system for onchain funds.</p>
            </section>
          )}

          {active === 'agent-vaults' && (
            <section>
              <div className="v2-slbl">Product</div>
              <h1 className="v2-sec-h" style={{ fontSize: 32 }}>What are Agent Vaults?</h1>
              <p className="docs2-lead">Agent vaults are onchain funds operated through the Yieldr agent stack.</p>
              <h2>Agent Vault = Capital Layer + Strategy Layer + Agent Layer</h2>
              <p>Primitive DeFi vaults hold capital and follow fixed strategies. Agent vaults are dynamic, monitored, explainable, and connected to an agent network — every position, risk limit, and fee is legible onchain.</p>
              <h2>Categories</h2>
              <ul className="docs2-list">
                <li>Predictions — Polymarket and similar markets</li>
                <li>Perps — funding arbitrage, directional and hedged strategies</li>
                <li>LP — liquidity provision on major DEXs</li>
                <li>Project coins &amp; memecoins — early accumulation on verified wallet signal</li>
                <li>RWAs &amp; stock tokens — tokenized equity exposure on Robinhood Chain</li>
              </ul>
            </section>
          )}

          {active === 'fund-launch-waitlist' && (
            <section>
              <div className="v2-slbl">Apply</div>
              <h1 className="v2-sec-h" style={{ fontSize: 32 }}>Fund Launch Waitlist</h1>
              <p className="docs2-lead">Any trader can connect a wallet, run Quant Agent to prove edge, and join the waitlist to launch an agent vault. No community required — edge is the only prerequisite.</p>
              <h2>Who should apply</h2>
              <p>Verifiable onchain edge in predictions, perps, LP, memecoins, or project coins; strong X/Telegram/Discord presence is a plus but not required; willing to operate through public rules and risk limits.</p>
              <h2>After signup</h2>
              <p>Yieldr reviews wallet, strategy, and community. Applicants may receive fund readiness status, strategy feedback, vault category recommendation, whitelist campaign support, and early launch eligibility.</p>
            </section>
          )}

          {active === 'dao-deposits' && (
            <section>
              <div className="v2-slbl">Depositors</div>
              <h1 className="v2-sec-h" style={{ fontSize: 32 }}>DAO &amp; Treasury Depositors</h1>
              <p className="docs2-lead">DAOs and protocol treasuries can allocate pooled capital across agent vaults — accessing asset classes and active strategies previously out of reach for most treasury operators.</p>
              <h2>Why DAOs deposit</h2>
              <p>Most DAO treasuries sit in stablecoins or native tokens. Active deployment into perps, predictions, LP, RWAs, or project coins requires expertise and monitoring most DAOs cannot sustain internally — agent vaults do that work.</p>
            </section>
          )}

          {active === 'allocation-agents' && (
            <section>
              <div className="v2-slbl">Roadmap Feature</div>
              <h1 className="v2-sec-h" style={{ fontSize: 32 }}>Depositor Allocation Agents</h1>
              <p className="docs2-lead">Discover, monitor, and allocate across agent vaults. Instead of manually checking every vault, depositor goals are set once and agents continuously monitor opportunities.</p>
              <h2>Why it matters</h2>
              <p>Depositors stop babysitting positions. The Allocation Agent rotates capital as edge decays or improves, matched against the risk and return profile set once at the start.</p>
            </section>
          )}

          {active === 'depositor-whitelist' && (
            <section>
              <div className="v2-slbl">Early Access</div>
              <h1 className="v2-sec-h" style={{ fontSize: 32 }}>Depositor Whitelist</h1>
              <p className="docs2-lead">Whitelist your wallet for upcoming agent vaults. Whitelisting signals interest in vault access before public launch.</p>
            </section>
          )}

          {active === 'yldr-token' && (
            <section>
              <div className="v2-slbl">Token</div>
              <h1 className="v2-sec-h" style={{ fontSize: 32 }}>$YLDR Token</h1>
              <p className="docs2-lead">The protocol token for the Yieldr agent OS — designed around agent access, agent trading, protocol participation, and future protocol utility.</p>
              <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-m)', fontSize: 13 }}>Final utility mechanics may evolve as the product and legal structure mature. Nothing here constitutes a commitment to specific token mechanics or returns.</p>
            </section>
          )}

          {active === 'roadmap' && (
            <section>
              <div className="v2-slbl">Roadmap</div>
              <h1 className="v2-sec-h" style={{ fontSize: 32 }}>From Quant Agent trials to the open agent fund network.</h1>
              <div className="v2-rm-list" style={{ marginTop: 24 }}>
                <div className="v2-rm-item is-now">
                  <div className="v2-rm-num">01</div>
                  <div><div className="v2-rm-when">Q4 2026</div><div className="v2-rm-name">Quant Agent Trials</div><div className="v2-rm-desc">Waitlisted traders get access to edge detection and wallet analysis across supported protocols and chains.</div></div>
                  <Link href="/v2/prelaunch-edge" className="v2-rm-cta">Reserve access →</Link>
                </div>
                <div className="v2-rm-item">
                  <div className="v2-rm-num">02</div>
                  <div><div className="v2-rm-when">Q1 2027</div><div className="v2-rm-name">Quant Terminal + Vault Applications</div><div className="v2-rm-desc">Whitelist and fund launch applications open for traders with proven edge.</div></div>
                  <span />
                </div>
                <div className="v2-rm-item">
                  <div className="v2-rm-num">03</div>
                  <div><div className="v2-rm-when">Q1 2027</div><div className="v2-rm-name">Public Deposits</div><div className="v2-rm-desc">Whitelisted vaults open for public deposits after audit. Matching, Comms, and Monitoring agents run live operations.</div></div>
                  <span />
                </div>
                <div className="v2-rm-item">
                  <div className="v2-rm-num">04</div>
                  <div><div className="v2-rm-when">2027+</div><div className="v2-rm-name">Open Agent Fund Network</div><div className="v2-rm-desc">Anyone with verified edge can launch; depositors allocate through allocation agents.</div></div>
                  <span />
                </div>
              </div>
            </section>
          )}

          {active === 'risk' && (
            <section>
              <div className="v2-slbl">Legal</div>
              <h1 className="v2-sec-h" style={{ fontSize: 32 }}>Risk and Restrictions</h1>
              <p className="docs2-lead">Yieldr is experimental onchain infrastructure.</p>
              <p>Nothing on this site constitutes an offer to sell or solicitation to buy any security or financial instrument, or financial advice of any kind. Performance data reflects Yieldr project capital, not external depositor capital. Past performance is not indicative of future results. Not available to residents of the United States, United Kingdom, Canada, China, or jurisdictions where offering crypto financial services is restricted.</p>
            </section>
          )}
        </main>
      </div>

      <div className="v2-foot">
        <div className="v2-wrap v2-foot-in">
          <div className="v2-foot-l">© 2026 Yieldr · Agent OS for onchain funds</div>
          <div className="v2-foot-r">
            <Link href="/v2">Home</Link>
            <Link href="/v2/explorer">Vaults</Link>
            <Link href="/v2/build-in-public">Build Log</Link>
            <Link href="/v2/prelaunch-edge">Reserve Genesis Access</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
