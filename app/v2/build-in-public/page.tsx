'use client';

import Link from 'next/link';
import '../v2.css';
import './bip2.css';

const GITHUB = 'https://github.com/robbin2102/yieldr-app';
const TWITTER = 'https://x.com/yieldrdotorg';

const COMMIT_DATA = [
  { short: 'Oct', count: 41, level: 1 },
  { short: 'Nov', count: 114, level: 2 },
  { short: 'Dec', count: 163, level: 3 },
  { short: 'Jan', count: 159, level: 3 },
  { short: 'Feb', count: 63, level: 1 },
  { short: 'Mar', count: 310, level: 4 },
  { short: 'Apr', count: 45, level: 1 },
  { short: 'May', count: 83, level: 2 },
  { short: 'Jun', count: 94, level: 2 },
];

const MONTHS = [
  { name: 'July 2026', badge: 'active' as const, summary: 'Multi-chain expansion to HOOD Chain. $YLDR TGE coming — the token is deflationary by design, consumed by agent execution cycles.' },
  { name: 'June 2026', badge: 'complete' as const, summary: 'Hyperliquid quant agent shipped and in testing for a project internal vault. WebSocket whale monitor re-architected across shards. Vault waitlist expanded with wallet whitelist for early access.' },
  { name: 'May 2026', badge: 'complete' as const, summary: 'Built and deployed the Hyperliquid Signals service for a test HL vault strategy. Alert engine with WAKEUP/WHALE_FLIP strategy detection laid the foundation for the June execution agent.' },
  { name: 'April 2026', badge: 'complete' as const, summary: 'Smaller engineering month — focus on data infrastructure stability and vault tracking. Vault tracker writes live stats to MongoDB powering the public vault display.' },
  { name: 'March 2026', badge: 'complete' as const, summary: 'Biggest engineering month — the full agent execution stack shipped. Trader profiling, prediction market signal detection, and live on-chain trade execution all came together.' },
  { name: 'January 2026', badge: 'complete' as const, summary: 'Built the real-time event indexers and the wallet performance metrics service — the data foundation for the Trader Profiler that shipped in March.' },
  { name: 'December 2025', badge: 'complete' as const, summary: 'Extended market coverage to prediction markets. Built the trending tokens service tracking top 100 Base tokens. Early access landing with USDC payment flow went live.' },
];

export default function V2BuildInPublicPage() {
  return (
    <div className="v2-root bip2-root">
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
          <div className="v2-nav-links">
            <a href={TWITTER} target="_blank" rel="noopener noreferrer">X</a>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </div>

      <div className="bip2-hero">
        <div className="v2-wrap">
          <div className="v2-eyebrow"><span className="dot" />No sanitisation, no narrative management</div>
          <h1 className="v2-h1">Built in public, <em>month by month</em>.</h1>
          <p className="v2-hero-sub">Real commit history, real treasury data, real trading performance — the log below is unedited.</p>
        </div>
      </div>

      <div className="v2-sec">
        <div className="v2-wrap">
          <div className="v2-slbl">Commit Activity</div>
          <h2 className="v2-sec-h">Nine months, one repo.</h2>
          <div className="bip2-gh">
            <div className="bip2-gh-grid">
              {COMMIT_DATA.map(({ short, count, level }) => (
                <div className="bip2-gh-col" key={short}>
                  <div className="bip2-gh-boxes">
                    {[0, 1, 2, 3].map((i) => <div key={i} className={`bip2-gh-box lvl${level}`} title={`${count} commits`} />)}
                  </div>
                  <div className="bip2-gh-month">{short}</div>
                  <div className="bip2-gh-count v2-num">{count}</div>
                </div>
              ))}
            </div>
            <div className="bip2-gh-legend">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((l) => <div key={l} className={`bip2-gh-box lvl${l}`} />)}
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      <div className="v2-sec" style={{ borderBottom: 'none' }}>
        <div className="v2-wrap">
          <div className="v2-slbl">Build Log</div>
          <h2 className="v2-sec-h">What actually shipped.</h2>
          <div className="bip2-timeline">
            {MONTHS.map((m) => (
              <div className="bip2-tl-row" key={m.name}>
                <div className="bip2-tl-head">
                  <span className="bip2-tl-name">{m.name}</span>
                  <span className={`bip2-tl-badge is-${m.badge}`}>{m.badge === 'active' ? '● In Progress' : '✓ Complete'}</span>
                </div>
                <p className="bip2-tl-summary">{m.summary}</p>
              </div>
            ))}
          </div>
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
