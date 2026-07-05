'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import NavLinks from '@/components/NavLinks';
import './vaults.css';
import {
  VAULT_META,
  FALLBACK_POSITIONS,
  FALLBACK_TRADES,
} from '@/config/vaults';

// ── Types ──────────────────────────────────────────────────────────────────
type ChartPoint = { date: string; pnl: number };
type Position   = { market: string; side: string; size: string; entry: string; pnl: string; pnlPositive: boolean; time: string };
type Trade      = { market: string; entry: string; size: string; pnl: string; status: 'win' | 'loss'; time: string };
type VaultState = {
  stats: {
    totalPnl: number; pnl30d: number; capitalDeployed30d: number; vaultSize: number;
    openPositionsValue: number; winRate: number; daysWonRate: number; trades: number; initialCapital: number;
  };
  chartPoints: ChartPoint[];
  positions: Position[];
  closedTrades: Trade[];
  wallet?: string;
};

type ShownVaultId = 'geo' | 'nba';
const VAULT_IDS: ShownVaultId[] = ['geo', 'nba'];

const WALLETS: Record<ShownVaultId, { full: string; short: string }> = {
  geo: { full: '0xcb516a0c8b8ba2e42ff5c123e2f624d6cce6359d', short: '0xcb51…359d' },
  nba: { full: '0x52ed504e3c3c7cfceaa61dc4f23a6e29d79f8db7', short: '0x52ed…8db7' },
};


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
function buildFallbackState(): Record<ShownVaultId, VaultState> {
  const out = {} as Record<ShownVaultId, VaultState>;
  for (const id of VAULT_IDS) {
    const m = VAULT_META[id];
    out[id] = {
      stats: {
        totalPnl:           m.fallback.totalPnl,
        pnl30d:             m.fallback.pnl30d,
        capitalDeployed30d: m.fallback.capitalDeployed30d,
        vaultSize:          m.fallback.vaultSize,
        openPositionsValue: 0,
        winRate:            m.fallback.winRate,
        daysWonRate:        m.fallback.daysWonRate,
        trades:             m.fallback.trades,
        initialCapital:     m.fallback.initialCapital,
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
  const vaultParam   = searchParams.get('vault') as ShownVaultId | null;
  const [activeVault, setActiveVault] = useState<ShownVaultId>(
    vaultParam && VAULT_IDS.includes(vaultParam) ? vaultParam : 'geo'
  );
  const [isLoading, setIsLoading]   = useState(true);
  const [vaultData, setVaultData]   = useState<Record<ShownVaultId, VaultState>>(buildFallbackState);
  const [whitelisted, setWhitelisted] = useState<Set<ShownVaultId>>(new Set());
  const [whitelistCounts, setWhitelistCounts] = useState<Partial<Record<ShownVaultId, number>>>({});

  useEffect(() => {
    if (vaultParam && VAULT_IDS.includes(vaultParam)) setActiveVault(vaultParam);
  }, [vaultParam]);

  useEffect(() => {
    fetch('/api/whitelist')
      .then((r) => r.json())
      .then((d) => { if (d.ok && d.data) setWhitelistCounts((prev) => ({ ...prev, ...d.data })); })
      .catch(() => {});
  }, []);

  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (!isConnected || !address) return;
    fetch(`/api/whitelist/mine?wallet=${address}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.data) {
          setWhitelisted((prev) => {
            const next = new Set(prev);
            for (const id of d.data as ShownVaultId[]) next.add(id);
            return next;
          });
        }
      })
      .catch(() => {});
  }, [isConnected, address]);

  // ── Fetch live data ────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const vRes = await fetch('/api/vaults/data');
        if (vRes.ok) {
          const { data } = await vRes.json();
          if (data) {
            setVaultData((prev: Record<ShownVaultId, VaultState>) => {
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

  function handleConfirmWhitelist() {
    if (!address) return;
    setWhitelisted((prev) => new Set(prev).add(activeVault));
    fetch('/api/whitelist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: address, vault_id: activeVault }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.data) setWhitelistCounts((prev) => ({ ...prev, [activeVault]: d.data.count }));
      })
      .catch(() => {});
  }

  const av   = vaultData[activeVault];
  const meta = VAULT_META[activeVault];
  const unr  = totalUnrealisedPnl(av.positions);
  const roi  = av.stats.initialCapital > 0 ? (av.stats.totalPnl / av.stats.initialCapital) * 100 : 0;
  const otherVault = VAULT_IDS.find((id) => id !== activeVault)!;
  const otherMeta   = VAULT_META[otherVault];
  const otherData   = vaultData[otherVault];
  const otherRoi    = otherData.stats.initialCapital > 0 ? (otherData.stats.totalPnl / otherData.stats.initialCapital) * 100 : 0;
  const truncAddr   = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
  const wlState: 'connect' | 'confirm' | 'success' = whitelisted.has(activeVault)
    ? 'success'
    : isConnected ? 'confirm' : 'connect';

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
          <NavLinks />
        </div>
      </nav>

      <main className="vp-main">

        {/* ── Breadcrumb ── */}
        <div className="vp-breadcrumb">
          <Link href="/explorer">Vaults</Link>
          <span className="vp-bc-sep">/</span>
          <span className="vp-bc-current">{meta.name}</span>
        </div>

        {/* ── Vault Header ── */}
        <div className="vp-vd-header">
          <div className="vp-vd-info">
            <h2>{meta.emoji} {meta.name}</h2>
            <span className="vp-vd-testing-tag">Testing Phase · Project Capital</span>
            <p>{meta.description}</p>
          </div>
          <div className="vp-vd-pnl">
            <div className={`vp-vd-pnl-v${av.stats.totalPnl < 0 ? ' red' : ''}`}>
              {isLoading ? <Skel size="xl" /> : fmtPnl(av.stats.totalPnl)}
            </div>
            <div className="vp-vd-pnl-l">All-Time PnL</div>
            <div className={`vp-vd-roi${roi < 0 ? ' red' : ''}`}>
              {isLoading ? <Skel size="sm" /> : `${roi >= 0 ? '+' : ''}${roi.toFixed(1)}% ROI`}
            </div>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="vp-vault-detail">

          {/* ── Left — Vault Panel ── */}
          <div>
            {/* Stats row */}
            <div className="vp-vd-stats">
              <div className="vp-vd-stat">
                <div className="vp-vd-stat-v green">
                  {isLoading ? <Skel size="sm" /> : `${av.stats.winRate}%`}
                </div>
                <div className="vp-vd-stat-l">Win Rate</div>
              </div>
              <div className="vp-vd-stat">
                <div className="vp-vd-stat-v white">
                  {isLoading ? <Skel size="md" /> : fmtUsd(av.stats.vaultSize)}
                </div>
                <div className="vp-vd-stat-l">AUM</div>
              </div>
              <div className="vp-vd-stat">
                <div className="vp-vd-stat-v white">
                  {isLoading ? <Skel size="sm" /> : `${av.stats.daysWonRate}%`}
                </div>
                <div className="vp-vd-stat-l">Days Winning</div>
              </div>
              <div className="vp-vd-stat">
                <div className={`vp-vd-stat-v ${unr.positive ? 'green' : 'red'}`}>
                  {isLoading ? <Skel size="sm" /> : unr.text}
                </div>
                <div className="vp-vd-stat-l">Unrealised PnL</div>
              </div>
            </div>

            {/* PnL Chart */}
            <div className="vp-vd-chart">
              <VaultChart points={av.chartPoints} gradId={`vg-${activeVault}`} />
            </div>

            {/* Open Positions */}
            <div className="vp-open-positions">
              <div className="vp-op-head">
                <span className="vp-op-title"><span className="vp-op-dot" /> Open Positions</span>
                <span className="vp-op-count">
                  {av.positions.length} active
                  {av.stats.openPositionsValue > 0 && (
                    <> · <span className="vp-op-val">{fmtUsd(av.stats.openPositionsValue)}</span> deployed</>
                  )}
                </span>
              </div>
              <div className="vp-op-cols">
                <span>Market</span><span>Position</span><span>Size</span>
                <span>Entry</span><span>Unrealised PnL</span><span>Opened</span>
              </div>
              {av.positions.map((p: Position, i: number) => (
                <div className="vp-op-row" key={i}>
                  <span className="mkt">{p.market}</span>
                  <span className={p.side === 'YES' ? 'yes' : p.side === 'NO' ? 'no' : 'side'}>{p.side}</span>
                  <span>{p.size}</span>
                  <span>{p.entry}</span>
                  <span className={p.pnlPositive ? 'grn' : 'red'}>{p.pnl}</span>
                  <span className="tim">{p.time}</span>
                </div>
              ))}
              <div className="vp-op-total">
                <span className="lbl">Total Unrealised</span>
                <span className={unr.positive ? 'val-g' : 'val-r'}>{unr.text}</span>
              </div>
            </div>

            {/* Closed Trades */}
            <div className="vp-trade-history">
              <div className="vp-th-head">
                <span className="vp-th-title">Closed Trades</span>
                <span className="vp-th-count">Showing {av.closedTrades.length} of {av.stats.trades}</span>
              </div>
              <div className="vp-th-cols">
                <span>Market</span><span>Entry / Exit</span><span>Size</span>
                <span>PnL</span><span>Status</span><span>When</span>
              </div>
              {av.closedTrades.map((t: Trade, i: number) => (
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

          {/* ── Right Column ── */}
          <div>
            {/* Whitelist Card */}
            <div className="vp-wl-card">
              <div className="vp-wl-h">Whitelist This Vault</div>
              <div className="vp-wl-sub">
                Earn a variable $YLDR reward at beta launch. Deposit min. $100 USDC for 30 days at launch to claim.
              </div>
              <div className="vp-wl-counter">
                {whitelistCounts[activeVault] != null ? `${whitelistCounts[activeVault]} wallets whitelisted` : 'Loading whitelist count…'}
              </div>

              {wlState === 'connect' && (
                <button className="vp-wl-btn" onClick={() => openConnectModal?.()}>Connect Wallet to Whitelist</button>
              )}
              {wlState === 'confirm' && (
                <>
                  <div className="vp-wl-addr-row">
                    <span className="lbl">Wallet</span>
                    <span className="val"><span className="vp-wl-addr-dot" />{truncAddr}</span>
                  </div>
                  <button className="vp-wl-btn" onClick={handleConfirmWhitelist}>Confirm Whitelist ↗</button>
                  <div className="vp-wl-fine">No deposit taken now.</div>
                </>
              )}
              {wlState === 'success' && (
                <div className="vp-wl-success">
                  <div className="vp-wl-check">✓</div>
                  <div className="vp-wl-success-title">Wallet whitelisted</div>
                  <p>You&apos;re in for {meta.name}. We&apos;ll notify this wallet at beta launch.</p>
                </div>
              )}
            </div>

            {/* Trust Box */}
            <div className="vp-trust-box">
              <div className="vp-tb-title">Trust &amp; Security</div>
              {[
                { lbl: 'Base Batches', val: '002 Winner ✓', green: true },
                { lbl: 'Treasury',     val: 'Multisig',      green: false },
                { lbl: 'Build Log',    val: 'Public ✓',      green: true },
              ].map((item) => (
                <div className="vp-tb-item" key={item.lbl}>
                  <span className="lbl">{item.lbl}</span>
                  <span className={`val${item.green ? ' green' : ''}`}>{item.val}</span>
                </div>
              ))}
              <div className="vp-tb-item">
                <span className="lbl">Onchain Proof</span>
                <span
                  className="val green vp-tooltip"
                  data-tooltip="Wallet address hidden to protect trader privacy and prevent copy-trading. Traders can choose to make their wallet public."
                >
                  {WALLETS[activeVault].short} ✓
                </span>
              </div>
            </div>

            {/* Similar Vault */}
            <Link href={`/vaults?vault=${otherVault}`} className="vp-similar-card">
              <div className="vp-sc-title">Similar Vault</div>
              <div className="vp-sc-name">{otherMeta.emoji} {otherMeta.name}</div>
              <div className="vp-sc-stats">
                <div><span className="v">{otherData.stats.winRate}%</span><span className="l">Win Rate</span></div>
                <div><span className={`v ${otherRoi >= 0 ? 'green' : 'red'}`}>{otherRoi >= 0 ? '+' : ''}{otherRoi.toFixed(1)}%</span><span className="l">ROI</span></div>
              </div>
              <div className="vp-sc-cta">View Vault →</div>
            </Link>
          </div>

        </div>
      </main>

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
