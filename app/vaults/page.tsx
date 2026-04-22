'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import NavLinks from '@/components/NavLinks';
import './vaults.css';
import {
  VAULT_META,
  FALLBACK_POSITIONS,
  FALLBACK_TRADES,
  type VaultId,
} from '@/config/vaults';

// ── Types ──────────────────────────────────────────────────────────────────
type ChartPoint = { date: string; pnl: number };
type Position   = { market: string; side: string; size: string; entry: string; pnl: string; pnlPositive: boolean; time: string };
type Trade      = { market: string; entry: string; size: string; pnl: string; status: 'win' | 'loss'; time: string };
type VaultState = {
  stats: {
    totalPnl: number; pnl30d: number | null; capitalDeployed30d: number; openPositionsValue: number;
    winRate: number; daysWonRate: number; trades: number;
  };
  chartPoints: ChartPoint[];
  positions: Position[];
  closedTrades: Trade[];
  wallet?: string;
};
type GlobalState = { totalPnl: number; totalCapital: number; combinedRoi: number; lastTradeAt: string; totalSubscribers: number };

const VAULT_IDS: VaultId[] = ['geo', 'nba', 'soccerAlpha'];

// ── Skeleton helper ────────────────────────────────────────────────────────
function Skel({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return <span className={`vp-skel vp-skel-${size}`} />;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtUsd(n: number): string {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtPnl(n: number): string {
  return (n >= 0 ? '+$' : '-$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function totalUnrealisedPnl(positions: Position[]): { text: string; positive: boolean } {
  const total = positions.reduce((s, p) => {
    const v = parseFloat(p.pnl.replace(/[$,+]/g, ''));
    return s + (p.pnl.startsWith('-') ? -v : v);
  }, 0);
  return { text: fmtPnl(total), positive: total >= 0 };
}
// ── Build initial state from fallbacks ────────────────────────────────────
function buildFallbackState(): Record<VaultId, VaultState> {
  const out = {} as Record<VaultId, VaultState>;
  for (const id of VAULT_IDS) {
    const m = VAULT_META[id];
    out[id] = {
      stats: {
        totalPnl:           m.fallback.totalPnl,
        pnl30d:             m.fallback.pnl30d,
        capitalDeployed30d: m.fallback.capitalDeployed30d,
        openPositionsValue: 0,
        winRate:            m.fallback.winRate,
        daysWonRate:        m.fallback.daysWonRate,
        trades:             m.fallback.trades,
      },
      chartPoints:  [],
      positions:    FALLBACK_POSITIONS[id],
      closedTrades: FALLBACK_TRADES[id],
    };
  }
  return out;
}

// ── Interactive Chart ──────────────────────────────────────────────────────
function VaultChart({ points, gradId }: { points: ChartPoint[]; gradId: string }) {
  const lineRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ leftPct: number; crossX: number; pnl: number; date: string } | null>(null);

  const W = 800, H = 140, PAD = 5;

  const coords = useMemo(() => {
    if (points.length < 2) return [];
    const minPnl = Math.min(0, ...points.map((p) => p.pnl));
    const maxPnl = Math.max(...points.map((p) => p.pnl), 0.01);
    const range  = maxPnl - minPnl || 1;
    return points.map((p, i) => ({
      svgX: Math.round((i / (points.length - 1)) * W),
      svgY: Math.round(H - PAD - ((p.pnl - minPnl) / range) * (H - PAD * 2)),
      date: p.date,
      pnl:  p.pnl,
    }));
  }, [points]);

  const linePath = coords.length
    ? `M${coords.map((c) => `${c.svgX},${c.svgY}`).join(' L')}`
    : `M0,${H * 0.5} L${W},${H * 0.5}`;
  const fillPath = coords.length
    ? `${linePath} L${W},${H} L0,${H}Z`
    : `M0,${H * 0.5} L${W},${H * 0.5} L${W},${H} L0,${H}Z`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!coords.length || !lineRef.current) return;
    const rect = lineRef.current.getBoundingClientRect();
    const svgX  = ((e.clientX - rect.left) / rect.width) * W;
    let nearest = coords[0];
    let minDist = Infinity;
    for (const c of coords) {
      const d = Math.abs(c.svgX - svgX);
      if (d < minDist) { minDist = d; nearest = c; }
    }
    setTooltip({
      leftPct: (nearest.svgX / W) * 100,
      crossX:  nearest.svgX,
      pnl:     nearest.pnl,
      date:    nearest.date,
    });
  }

  return (
    <>
      <div className="vp-chart-label">Cumulative PnL — All Time</div>
      <div
        ref={lineRef}
        className="vp-chart-line"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <svg className="vp-chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#00E87B" stopOpacity=".2" />
              <stop offset="100%" stopColor="#00E87B" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={linePath} fill="none" stroke="#00E87B" strokeWidth="2" />
          <path d={fillPath} fill={`url(#${gradId})`} />
          {tooltip && (
            <line
              x1={tooltip.crossX} y1="0"
              x2={tooltip.crossX} y2={H}
              stroke="rgba(255,255,255,.2)" strokeWidth="1" strokeDasharray="3,2"
            />
          )}
        </svg>
        {tooltip && (
          <div
            className="vp-chart-tooltip"
            style={{ left: `${Math.min(Math.max(tooltip.leftPct, 8), 72)}%` }}
          >
            <div className="vp-chart-tt-date">{tooltip.date}</div>
            <div className={`vp-chart-tt-pnl${tooltip.pnl < 0 ? ' neg' : ''}`}>
              {tooltip.pnl >= 0 ? '+' : '−'}${Math.abs(tooltip.pnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Component ──────────────────────────────────────────────────────────────
function VaultsPageInner() {
  const searchParams = useSearchParams();
  const vaultParam   = searchParams.get('vault') as VaultId | null;
  const [activeVault, setActiveVault] = useState<VaultId>(
    vaultParam && VAULT_IDS.includes(vaultParam) ? vaultParam : 'geo'
  );
  const [isLoading, setIsLoading]   = useState(true);
  const [vaultData, setVaultData]   = useState<Record<VaultId, VaultState>>(buildFallbackState);
  const [global, setGlobal]         = useState<GlobalState>({ totalPnl: 0, totalCapital: 0, combinedRoi: 0, lastTradeAt: '—', totalSubscribers: 0 });
  const [spotsLeft, setSpotsLeft]   = useState(127);
  const [deadline, setDeadline]     = useState<Date>(() => { const d = new Date(); d.setDate(d.getDate() + 90); return d; });
  const [countdown, setCountdown]   = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ type: 'agent' | 'user' | 'system'; text: string }>>([
    { type: 'system', text: '⚡ Vault agent connected' },
    { type: 'agent',  text: 'Welcome! I can tell you about any of our three vaults, how the human + agent strategy works, or early access terms. What would you like to know?' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ── Fetch live data ────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [vRes, cRes] = await Promise.all([
          fetch('/api/vaults/data'),
          fetch('/api/site-config'),
        ]);
        if (vRes.ok) {
          const { data } = await vRes.json();
          if (data) {
            setVaultData((prev: Record<VaultId, VaultState>) => {
              const next = { ...prev };
              for (const id of VAULT_IDS) {
                const d = data[id];
                if (!d) continue;
                next[id] = {
                  stats:        d.stats         ?? prev[id].stats,
                  chartPoints:  d.chartPoints   ?? prev[id].chartPoints,
                  positions:    d.openPositions ?? prev[id].positions,
                  closedTrades: d.closedTrades  ?? prev[id].closedTrades,
                  wallet:       d.wallet,
                };
              }
              return next;
            });
            if (data._global) setGlobal(data._global);
          }
        }
        if (cRes.ok) {
          const { data: cd } = await cRes.json();
          if (cd) {
            setSpotsLeft(cd.spots_remaining ?? 127);
            if (cd.deadline) setDeadline(new Date(cd.deadline));
          }
        }
      } catch {
        // silently use fallback data
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // ── Countdown timer ────────────────────────────────────────────────────
  useEffect(() => {
    function tick() {
      const diff = deadline.getTime() - Date.now();
      if (diff <= 0) { setCountdown('Closed'); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000)  / 60000);
      setCountdown(`${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`);
    }
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, [deadline]);

  // ── Auto-scroll chat ───────────────────────────────────────────────────
  useEffect(() => {
    if (chatMessages.length <= 2) return;
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ── Chat send ──────────────────────────────────────────────────────────
  function sendChat() {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((m: typeof chatMessages) => [...m, { type: 'user', text }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages((m: typeof chatMessages) => [
        ...m,
        { type: 'agent', text: '🚧 <strong>Coming soon</strong> — full vault agent chat is in active development. Check the Build Log for updates!' },
      ]);
    }, 600);
  }

  const av   = vaultData[activeVault];
  const meta = VAULT_META[activeVault as VaultId];
  const unr  = totalUnrealisedPnl(av.positions);

  return (
    <div className="vp-root">
      <div className="vp-grid" />
      <div className="vp-scanline" />

      {/* ── Nav ── */}
      <nav className="vp-nav">
        <Link href="/" className="vp-nav-l">
          <svg width="20" height="24" viewBox="0 0 100 120" fill="none">
            <path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#00E87B" />
            <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3" />
            <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9" />
          </svg>
          <span className="vp-nav-brand">YIELDR</span>
        </Link>
        <div className="vp-nav-r">
          <NavLinks cta={{ href: '/buy', label: 'Early Access ↗' }} />
        </div>
      </nav>

      {/* ── Status Bar ── */}
      <div className="vp-status-bar">
        <div className="vp-sb-left">
          <div className="vp-sb-live"><span className="vp-sb-dot" /> 3 Vaults Testing</div>
          <span>Last trade: <span className="vp-sb-val">{isLoading ? <Skel size="sm" /> : global.lastTradeAt}</span></span>
          <span>Human + Agent</span>
        </div>
        <div className="vp-sb-right">
          <span>Capital: <span className="vp-sb-val">{isLoading ? <Skel size="md" /> : fmtUsd(global.totalCapital)}</span></span>
          <span>Subscribers: <span className="vp-sb-val">{isLoading ? <Skel size="sm" /> : global.totalSubscribers || '—'}</span></span>
          <span>All-Time PnL: <span className="vp-sb-val">{isLoading ? <Skel size="md" /> : fmtPnl(global.totalPnl)}</span></span>
        </div>
      </div>

      <main className="vp-main">

        {/* ── Page Header ── */}
        <div className="vp-page-head">
          <div className="vp-ph-left">
            <h1>Agent Trading Vaults</h1>
            <p>$100K of project capital trading live across 3 strategies. Agents find edge, execute trades, compound returns.</p>
          </div>
          <div className="vp-ph-right">
            <div className="vp-ph-stat">
              <div className={`vp-ph-stat-v${global.totalPnl < 0 ? ' red' : ''}`}>
                {isLoading ? <Skel size="xl" /> : fmtPnl(global.totalPnl)}
              </div>
              <div className="vp-ph-stat-l">All-Time PnL</div>
            </div>
            <div className="vp-ph-stat">
              <div className="vp-ph-stat-v">{isLoading ? <Skel size="lg" /> : `+${global.combinedRoi.toFixed(1)}%`}</div>
              <div className="vp-ph-stat-l">Combined ROI</div>
            </div>
          </div>
        </div>

        {/* ── Vault Tabs ── */}
        <div className="vp-vault-tabs">
          {VAULT_IDS.map((id) => (
            <button
              key={id}
              className={`vp-vtab${activeVault === id ? ' active' : ''}`}
              onClick={() => setActiveVault(id)}
            >
              {VAULT_META[id].emoji} {VAULT_META[id].name.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div className="vp-vault-detail">

          {/* ── Left — Vault Panel ── */}
          <div>
            {VAULT_IDS.map((id) => {
              const d = vaultData[id];
              const m = VAULT_META[id];
              const u = totalUnrealisedPnl(d.positions);
              return (
                <div key={id} className={`vp-vault-panel${activeVault === id ? ' active' : ''}`}>

                  {/* Header */}
                  <div className="vp-vd-header">
                    <div className="vp-vd-info">
                      <h2>{m.emoji} {m.name}</h2>
                      <span className="vp-vd-testing-tag">Testing Phase · Project Capital</span>
                      <p>{m.description}</p>
                    </div>
                    <div className="vp-vd-pnl">
                      <div className={`vp-vd-pnl-v${d.stats.totalPnl < 0 ? ' red' : ''}`}>
                        {isLoading ? <Skel size="xl" /> : fmtPnl(d.stats.totalPnl)}
                      </div>
                      <div className="vp-vd-pnl-l">All-Time PnL</div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="vp-vd-stats">
                    <div className="vp-vd-stat">
                      <div className="vp-vd-stat-v green">
                        {isLoading ? <Skel size="sm" /> : `${d.stats.winRate}%`}
                      </div>
                      <div className="vp-vd-stat-l">Win Rate</div>
                    </div>
                    <div className="vp-vd-stat">
                      <div className="vp-vd-stat-v white">
                        {isLoading ? <Skel size="md" /> : fmtUsd(d.stats.capitalDeployed30d)}
                      </div>
                      <div className="vp-vd-stat-l">Avg Capital 30D</div>
                    </div>
                    <div className="vp-vd-stat">
                      <div className="vp-vd-stat-v white">
                        {isLoading ? <Skel size="sm" /> : `${d.stats.daysWonRate}%`}
                      </div>
                      <div className="vp-vd-stat-l">Days Winning</div>
                    </div>
                    <div className="vp-vd-stat">
                      <div className={`vp-vd-stat-v ${d.stats.pnl30d == null ? 'white' : d.stats.pnl30d >= 0 ? 'green' : 'red'}`}>
                        {isLoading ? <Skel size="sm" /> : d.stats.pnl30d == null ? '—' : fmtPnl(d.stats.pnl30d)}
                      </div>
                      <div className="vp-vd-stat-l">30D PnL</div>
                    </div>
                  </div>

                  {/* PnL Chart */}
                  <div className="vp-vd-chart">
                    <VaultChart points={d.chartPoints} gradId={`vg-${id}`} />
                  </div>

                  {/* Mobile-only CTA strip — shown right after chart */}
                  <div className="vp-mobile-cta-strip">
                    <div className="vp-mcs-text">
                      <span className="vp-mcs-label">50% USDC (4.5% APY) · 50% YLDR @$9M FDV</span>
                      <span className="vp-mcs-sub">Tier 1 pricing ends May 31st</span>
                    </div>
                    <Link href="/buy" className="vp-mcs-btn">Get Early Access ↗</Link>
                  </div>

                  {/* Open Positions */}
                  <div className="vp-open-positions">
                    <div className="vp-op-head">
                      <span className="vp-op-title"><span className="vp-op-dot" /> Open Positions</span>
                      <span className="vp-op-count">{d.positions.length} active</span>
                    </div>
                    <div className="vp-op-cols">
                      <span>Market</span><span>Position</span><span>Size</span>
                      <span>Entry</span><span>Unrealised PnL</span><span>Opened</span>
                    </div>
                    {d.positions.map((p: Position, i: number) => (
                      <div className="vp-op-row" key={i}>
                        <span className="mkt">{p.market}</span>
                        <span className="yel">{p.side}</span>
                        <span>{p.size}</span>
                        <span>{p.entry}</span>
                        <span className={p.pnlPositive ? 'grn' : 'red'}>{p.pnl}</span>
                        <span className="tim">{p.time}</span>
                      </div>
                    ))}
                    <div className="vp-op-total">
                      <span className="lbl">Total Unrealised</span>
                      <span className={u.positive ? 'val-g' : 'val-r'}>{u.text}</span>
                    </div>
                  </div>

                  {/* Closed Trades */}
                  <div className="vp-trade-history">
                    <div className="vp-th-head">
                      <span className="vp-th-title">Closed Trades</span>
                      <span className="vp-th-count">Showing {d.closedTrades.length} of {d.stats.trades}</span>
                    </div>
                    <div className="vp-th-cols">
                      <span>Market</span><span>Entry / Exit</span><span>Size</span>
                      <span>PnL</span><span>Status</span><span>When</span>
                    </div>
                    {d.closedTrades.map((t: Trade, i: number) => (
                      <div className="vp-th-row" key={i}>
                        <span className="mkt">{t.market}</span>
                        <span>{t.entry}</span>
                        <span>{t.size}</span>
                        <span className={t.status === 'win' ? 'win' : 'loss'}>{t.pnl}</span>
                        <span className={t.status === 'win' ? 'win' : 'loss'}>
                          {t.status === 'win' ? '✓ Won' : '✗ Lost'}
                        </span>
                        <span className="tim">{t.time}</span>
                      </div>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>

          {/* ── Right Column ── */}
          <div>
            {/* Urgency bar */}
            <div className="vp-urgency-bar">
              <div className="vp-ub-text">
                ⏳ Tier 1 pricing ends May 31st · Next tier is 2x FDV
              </div>
            </div>

            {/* CTA Box */}
            <div className="vp-cta-box" id="buy">
              <div className="vp-cta-h">Get Early Access</div>
              <div className="vp-cta-sub">
                Every $100 deposited = $50 into a Base USDC vault earning 4.5% APY from day one (migrates to your chosen agent trading vault at Q4 2026 launch) + $50 in YLDR token allocation at $9M FDV.
              </div>
              <div className="vp-cta-split">
                <div className="vp-cta-split-item">
                  <div className="vp-cta-split-v">50%</div>
                  <div className="vp-cta-split-l">USDC Vault (4.5% APY)</div>
                </div>
                <div className="vp-cta-split-item">
                  <div className="vp-cta-split-v">50%</div>
                  <div className="vp-cta-split-l">YLDR @ $9M FDV</div>
                </div>
              </div>
              <div className="vp-cta-note">⚡ USDC earning from day 1 → moves to agent vault at Q3 launch</div>

              <Link href="/buy" className="vp-cta-btn">
                Buy YLDR — Early Access ↗
              </Link>
              <div className="vp-cta-fine">
                Min $100 USDC on Base • USDC vault: withdraw anytime • YLDR: 12-month vest from TGE Q1 2027
              </div>
            </div>

            {/* Trust Box */}
            <div className="vp-trust-box">
              <div className="vp-tb-title">Trust &amp; Security</div>
              {[
                { lbl: 'Base Batches',      val: '002 Winner ✓', green: true  },
                { lbl: 'Treasury',          val: 'Multisig',      green: false },
                { lbl: 'Build Log',         val: 'Public ✓',      green: true  },
                { lbl: 'Vault Subscribers', val: isLoading ? '…' : String(global.totalSubscribers || '—'), green: false },
                { lbl: 'Telegram',          val: 'Coming Soon', green: false },
              ].map((item) => (
                <div className="vp-tb-item" key={item.lbl}>
                  <span className="lbl">{item.lbl}</span>
                  <span className={`val${item.green ? ' green' : ''}`}>{item.val}</span>
                </div>
              ))}
              <div className="vp-tb-item">
                <span className="lbl">Onchain Proof</span>
                {(() => {
                  const wallets: Record<string, { full: string; short: string }> = {
                    geo:         { full: '0xcb516a0c8b8ba2e42ff5c123e2f624d6cce6359d', short: '0xcb51…359d' },
                    nba:         { full: '0x52ed504e3c3c7cfceaa61dc4f23a6e29d79f8db7', short: '0x52ed…8db7' },
                    soccerAlpha: { full: '0x1ba1bb6aa2490adbbbbb314bc07ff21a8cc71ce4', short: '0x1ba1…1ce4' },
                  };
                  const w = wallets[activeVault];
                  const href = activeVault === 'geo'
                    ? `https://polygonscan.com/address/${w.full}`
                    : undefined;
                  return w ? (
                    href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="val green" style={{ textDecoration: 'none' }}>
                        {w.short} ✓
                      </a>
                    ) : (
                      <span className="val green">{w.short} ✓</span>
                    )
                  ) : (
                    <span className="val green">Verifiable ✓</span>
                  );
                })()}
              </div>
            </div>

            {/* Agent Chat */}
            <div className="vp-agent-chat">
              <div className="vp-ac-head">
                <span className="vp-ac-dot" />
                <span className="vp-ac-title">Chat with Vault Agent — Ask anything</span>
              </div>
              <div className="vp-ac-messages">
                {chatMessages.map((msg: { type: string; text: string }, i: number) => (
                  <div key={i} className={`vp-ac-msg ${msg.type}`}>
                    {msg.type === 'system' ? (
                      <><span className="ck">⚡</span> {msg.text}</>
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="vp-ac-input">
                <input
                  type="text"
                  placeholder="Ask about strategy, performance, early access..."
                  value={chatInput}
                  onChange={(e: { target: { value: string } }) => setChatInput(e.target.value)}
                  onKeyDown={(e: { key: string }) => e.key === 'Enter' && sendChat()}
                />
                <button onClick={sendChat}>Send</button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Sticky mobile CTA bar */}
      <div className="vp-sticky-cta">
        <div className="vp-sct-left">
          <div className="vp-sct-label">Get Early Access</div>
          <div className="vp-sct-sub">50% USDC APY · 50% YLDR @$9M FDV</div>
        </div>
        <Link href="/buy" className="vp-sct-btn">Buy YLDR ↗</Link>
      </div>

      <footer className="vp-footer">
        <div className="vp-footer-txt">
          Yieldr © 2025. Built on Base. Performance shown is from live testing with project capital and not indicative of future results.{' '}
          <a href="https://yieldr.org">yieldr.org</a>
        </div>
      </footer>
    </div>
  );
}

export default function VaultsPage() {
  return (
    <Suspense fallback={null}>
      <VaultsPageInner />
    </Suspense>
  );
}
