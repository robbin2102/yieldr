import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VaultStats from '@/models/VaultStats';
import VaultTrade from '@/models/VaultTrade';
import VaultOpenPosition from '@/models/VaultOpenPosition';
import { VAULT_WALLETS, VAULT_META, type VaultId } from '@/config/vaults';

export const dynamic = 'force-dynamic';

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function computeChartPath(pnlSeries: number[]): { line: string; fill: string } | null {
  if (!pnlSeries || pnlSeries.length < 2) return null;
  const min = Math.min(0, ...pnlSeries);
  const max = Math.max(...pnlSeries);
  const range = max - min || 1;
  const W = 800, H = 140, PAD = 5;
  const pts = pnlSeries.map((v, i) => {
    const x = (i / (pnlSeries.length - 1)) * W;
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
    return `${Math.round(x)},${Math.round(y)}`;
  });
  const line = `M${pts.join(' L')}`;
  const fill = `${line} L${W},${H} L0,${H}Z`;
  return { line, fill };
}

export async function GET() {
  try {
    await connectDB();

    const vaultIds: VaultId[] = ['geo', 'nba', 'soccer'];
    const result: Record<string, unknown> = {};

    await Promise.all(
      vaultIds.map(async (id) => {
        const wallet = VAULT_WALLETS[id];
        const meta = VAULT_META[id];

        // Fetch stats, positions, trades concurrently
        const [statsDoc, posDoc, trades] = await Promise.all([
          wallet ? VaultStats.findOne({ wallet }).lean() : null,
          wallet ? VaultOpenPosition.findOne({ wallet }).lean() : null,
          wallet
            ? VaultTrade.find({ wallet, status: { $in: ['win', 'loss'] } })
                .sort({ opened_at: -1 })
                .limit(15)
                .lean()
            : [],
        ]);

        // Build stats — fall back to meta.fallback if DB empty
        const stats = statsDoc
          ? {
              totalPnl:  statsDoc.totalPnlAllTime ?? meta.fallback.totalPnl,
              roi7d:     (statsDoc.timeframePnL as Record<string, { roce?: number }>)?.['7d']?.roce ?? meta.fallback.roi7d,
              roi30d:    (statsDoc.timeframePnL as Record<string, { roce?: number }>)?.['30d']?.roce ?? meta.fallback.roi30d,
              vaultSize: statsDoc.totalCapitalDeployed ?? meta.fallback.vaultSize,
              winRate:   statsDoc.win_rate ?? meta.fallback.winRate,
              sortino:   (statsDoc.tradingConsistency as { sortinoRatio?: number })?.sortinoRatio ?? meta.fallback.sortino,
              trades:    statsDoc.win_rate_sample_size ?? meta.fallback.trades,
              lastTradeAt: statsDoc.last_trade_at ?? null,
            }
          : meta.fallback;

        // Build chart path from dailyPnLByFrame['30d'] if available
        let chartPath = { line: meta.fallback.chartPath, fill: meta.fallback.chartFill };
        const pnl30d = (posDoc?.dailyPnLByFrame as Record<string, number[]> | undefined)?.['30d'];
        if (pnl30d && pnl30d.length >= 2) {
          const computed = computeChartPath(pnl30d);
          if (computed) chartPath = computed;
        }

        // Build open positions from topOpenPositions
        const openPositions = posDoc?.topOpenPositions
          ? (posDoc.topOpenPositions as Array<{
              title: string; outcome: string; size: number;
              avgPrice: number; cashPnl: number;
            }>).map((p) => ({
              market: p.title,
              side:   p.outcome,
              size:   `$${p.size.toLocaleString()}`,
              entry:  `$${p.avgPrice.toFixed(2)}`,
              pnl:    (p.cashPnl >= 0 ? '+' : '') + `$${Math.abs(p.cashPnl).toLocaleString()}`,
              pnlPositive: p.cashPnl >= 0,
              time:   'live',
            }))
          : null; // null → use fallback in page

        // Build closed trades
        const closedTrades = (trades as Array<{
          market: string; side: string; entry_price: number;
          size_usdc: number; pnl_usdc: number | null;
          status: string; opened_at: Date;
        }>).length
          ? (trades as Array<{
              market: string; side: string; entry_price: number;
              size_usdc: number; pnl_usdc: number | null;
              status: string; opened_at: Date;
            }>).map((t) => ({
              market: t.market,
              entry:  `${t.side} @ $${t.entry_price.toFixed(2)}`,
              size:   `$${t.size_usdc.toLocaleString()}`,
              pnl:    t.pnl_usdc != null
                ? (t.pnl_usdc >= 0 ? '+' : '') + `$${Math.abs(t.pnl_usdc).toLocaleString()}`
                : '—',
              status: t.status as 'win' | 'loss',
              time:   formatTimeAgo(new Date(t.opened_at)),
            }))
          : null; // null → use fallback in page

        result[id] = { stats, chartPath, openPositions, closedTrades };
      })
    );

    // Global stats for status bar / page header
    const vaultDocs = await VaultStats.find({
      wallet: { $in: Object.values(VAULT_WALLETS).filter(Boolean) },
    }).lean();

    const globalPnl     = vaultDocs.reduce((s: number, v: Record<string, unknown>) => s + ((v.totalPnlAllTime as number) ?? 0), 0);
    const globalCapital = vaultDocs.reduce((s: number, v: Record<string, unknown>) => s + ((v.totalCapitalDeployed as number) ?? 0), 0);
    const lastTrade = vaultDocs
      .map((v: Record<string, unknown>) => v.last_trade_at as Date | undefined)
      .filter((d: Date | undefined): d is Date => Boolean(d))
      .sort((a: Date, b: Date) => b.getTime() - a.getTime())[0];

    result._global = {
      totalPnl:    vaultDocs.length ? globalPnl    : 34200,
      totalCapital: vaultDocs.length ? globalCapital : 100000,
      combinedRoi: vaultDocs.length ? ((globalPnl / Math.max(globalCapital, 1)) * 100) : 34.2,
      lastTradeAt: lastTrade ? formatTimeAgo(new Date(lastTrade as Date)) : '4m ago',
    };

    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    console.error('[/api/vaults/data]', err);
    return NextResponse.json({ ok: false, data: null }, { status: 500 });
  }
}
