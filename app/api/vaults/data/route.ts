import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VaultStats from '@/models/VaultStats';
import VaultTrade from '@/models/VaultTrade';
import VaultOpenPosition from '@/models/VaultOpenPosition';
import VaultDailySnapshot from '@/models/VaultDailySnapshot';
import { VAULT_META, type VaultId } from '@/config/vaults';

export const dynamic = 'force-dynamic';

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTimeAgo(ts: number | Date): string {
  const ms = typeof ts === 'number' ? ts * 1000 : ts.getTime();
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtPnl(n: number): string {
  return (n >= 0 ? '+' : '') + `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function computeChartPath(cumPnl: number[]): { line: string; fill: string } | null {
  if (!cumPnl || cumPnl.length < 2) return null;
  const min = Math.min(0, ...cumPnl);
  const max = Math.max(...cumPnl, 0.01);
  const range = max - min || 1;
  const W = 800, H = 140, PAD = 5;
  const pts = cumPnl.map((v, i) => {
    const x = (i / (cumPnl.length - 1)) * W;
    const y = H - PAD - ((v - min) / range) * (H - PAD * 2);
    return `${Math.round(x)},${Math.round(y)}`;
  });
  const line = `M${pts.join(' L')}`;
  return { line, fill: `${line} L${W},${H} L0,${H}Z` };
}

function roiFromSnapshots(snapshots: { daily_pnl_usdc: number }[], days: number, capital: number): number {
  if (!capital || !snapshots.length) return 0;
  const slice = snapshots.slice(-days);
  const sum = slice.reduce((s, d) => s + (d.daily_pnl_usdc ?? 0), 0);
  return parseFloat(((sum / capital) * 100).toFixed(1));
}

// ── Sport keyword filters ──────────────────────────────────────────────────
const SPORT_KEYWORDS: Record<VaultId, string[]> = {
  geo:     [], // no filter — geopolitics accepts all markets
  soccerAlpha: [
    'soccer', 'football', 'premier league', 'la liga', 'bundesliga', 'serie a', 'ligue 1',
    'champions league', 'europa league', 'world cup', 'euro', 'copa',
    'liverpool', 'arsenal', 'chelsea', 'man city', 'manchester', 'tottenham', 'newcastle',
    'real madrid', 'barcelona', 'atletico', 'sevilla', 'valencia',
    'bayern', 'dortmund', 'leipzig', 'leverkusen',
    'juventus', 'inter', 'milan', 'napoli', 'roma',
    'psg', 'marseille', 'lyon', 'ajax', 'porto', 'benfica',
    'messi', 'ronaldo', 'haaland', 'mbappe',
  ],
  esports: [
    'esports', 'e-sports', 'cs2', 'csgo', 'cs:go', 'valorant', 'league of legends', 'lol',
    'dota', 'overwatch', 'fortnite', 'apex', 'rocket league', 'starcraft', 'counter-strike',
    'major', 'blast', 'esl', 'faceit', 'pgl', 'iem', 'navi', 'faze', 'astralis', 'vitality',
    'team liquid', 'g2', 'nip', 'heroic', 'fnatic', 'mibr',
  ],
  nba: [
    'nba', 'basketball', 'lakers', 'celtics', 'warriors', 'bulls', 'heat', 'nets', 'knicks',
    'bucks', 'suns', 'nuggets', 'clippers', 'hawks', 'sixers', '76ers', 'raptors', 'cavaliers',
    'cavs', 'pacers', 'hornets', 'grizzlies', 'pelicans', 'spurs', 'thunder', 'blazers',
    'rockets', 'jazz', 'kings', 'timberwolves', 'wolves', 'mavericks', 'mavs', 'magic',
    'pistons', 'wizards', 'playoffs', 'finals', 'nba mvp',
  ],
  soccer: [
    'nhl', 'hockey', 'stanley cup', 'bruins', 'maple leafs', 'rangers', 'blackhawks',
    'penguins', 'canadiens', 'red wings', 'kings', 'sharks', 'ducks', 'flyers', 'capitals',
    'lightning', 'avalanche', 'oilers', 'flames', 'canucks', 'senators', 'sabres', 'panthers',
    'coyotes', 'blues', 'predators', 'stars', 'wild', 'blue jackets', 'jets', 'hurricanes',
    'islanders', 'devils', 'golden knights', 'kraken',
  ],
};

function isRelevantPosition(title: string, vaultId: VaultId): boolean {
  const keywords = SPORT_KEYWORDS[vaultId];
  if (!keywords.length) return true; // geo: keep all
  const t = title.toLowerCase();
  return keywords.some((k) => t.includes(k));
}

// ── Main handler ───────────────────────────────────────────────────────────

export async function GET() {
  try {
    await connectDB();

    const vaultIds: VaultId[] = ['geo', 'nba', 'soccer', 'soccerAlpha']; // esports: hidden, indexing in background

    // Fetch all vault stat docs — map by traderLabel to vault ID
    const allStats = await VaultStats.find({}).lean() as unknown as Array<{
      wallet: string;
      traderLabel: string;
      initial_capital_usdc: number;
      vault_size_usdc: number;
      totalPnlAllTime: number;
      win_rate: number;
      win_rate_sample_size: number;
      profitFactor: number;
      tradingConsistency: { sortinoRatio: number };
      timeframePnL: Record<string, { pnl: number; roce: number; tradeCount: number }>;
      last_polled_activity_ts: number;
    }>;

    // Map traderLabel → vault ID
    const LABEL_TO_ID: Record<string, VaultId> = {
      'geopolitics vault':    'geo',
      'nba edge vault':       'nba',
      'nhl edge vault':       'soccer',
      'e-sports ninja vault': 'esports',
      'soccer alpha vault':   'soccerAlpha',
    };

    // Build a map: vaultId → doc
    const statsByLabel = new Map(
      allStats.map((d) => [LABEL_TO_ID[d.traderLabel?.toLowerCase()] ?? d.traderLabel?.toLowerCase(), d])
    );

    const result: Record<string, unknown> = {};

    await Promise.all(
      vaultIds.map(async (id) => {
        const statsDoc = statsByLabel.get(id);
        const meta = VAULT_META[id];

        if (!statsDoc) {
          result[id] = null; // no data yet → page uses fallback
          return;
        }

        const wallet = statsDoc.wallet;

        // ── Fetch related data concurrently ──────────────────────────────
        const [posDoc, trades, snapshots] = await Promise.all([
          VaultOpenPosition.findOne({ wallet }).lean(),
          VaultTrade.find({ wallet, status: { $in: ['win', 'loss'] } })
            .sort({ opened_at: -1 })
            .limit(15)
            .lean(),
          VaultDailySnapshot.find({ wallet })
            .sort({ date: 1 })   // oldest first → for chart + ROI
            .limit(30)
            .lean(),
        ]);

        const capital = statsDoc.initial_capital_usdc || 1;

        // ── ROI: use roce but only when trades exist in the period ─────────────
        // If tradeCount=0, roce reflects only unrealized PnL which is misleading
        const tf = statsDoc.timeframePnL ?? {};
        const roi7d  = (tf['7d']?.tradeCount  ?? 0) > 0 ? parseFloat((tf['7d']?.roce  ?? 0).toFixed(1)) : 0;
        const roi30d = (tf['30d']?.tradeCount ?? 0) > 0 ? parseFloat((tf['30d']?.roce ?? 0).toFixed(1)) : 0;

        // ── Chart from daily snapshots (cumulative curve) ───────────────
        const snaps = snapshots as unknown as { daily_pnl_usdc: number; cumulative_pnl_usdc: number }[];
        const cumSeries = snaps.map((d) => d.cumulative_pnl_usdc ?? 0);
        const chartPath = computeChartPath(cumSeries) ?? {
          line: meta.fallback.chartPath,
          fill: meta.fallback.chartFill,
        };

        // ── Open positions (filtered to sport-relevant markets only) ────
        const rawPositions = posDoc?.topOpenPositions as Array<{
          title: string; outcome: string; size: number;
          avgPrice: number; curPrice: number;
          currentValue: number; cashPnl: number; percentPnl: number;
        }> | undefined;

        const filteredPositions = rawPositions?.filter((p) => isRelevantPosition(p.title ?? '', id)) ?? [];

        const openPositionsValue = filteredPositions.reduce((s, p) => s + (p.currentValue ?? 0), 0);

        // ── Stats ───────────────────────────────────────────────────────
        // Vault size = initial capital + all-time PnL (current equity)
        const vaultSize = (statsDoc.initial_capital_usdc ?? 0) + (statsDoc.totalPnlAllTime ?? 0);

        const stats = {
          totalPnl:          statsDoc.totalPnlAllTime ?? 0,
          roi30d,
          vaultSize,
          openPositionsValue,
          winRate:           parseFloat((statsDoc.win_rate ?? 0).toFixed(1)),
          sortino:           parseFloat((statsDoc.tradingConsistency?.sortinoRatio ?? 0).toFixed(2)),
          profitFactor:      parseFloat((statsDoc.profitFactor ?? 0).toFixed(2)),
          trades:            statsDoc.win_rate_sample_size ?? 0,
          lastTradeTs:       statsDoc.last_polled_activity_ts ?? 0,
        };

        const openPositions = filteredPositions.length
          ? filteredPositions.map((p) => ({
              market:      p.title,
              side:        p.outcome,
              size:        `$${(p.currentValue ?? 0).toFixed(2)}`,
              entry:       `$${(p.avgPrice ?? 0).toFixed(2)}`,
              curPrice:    `$${(p.curPrice ?? p.avgPrice ?? 0).toFixed(2)}`,
              pnl:         fmtPnl(p.cashPnl ?? 0),
              pnlPositive: (p.cashPnl ?? 0) >= 0,
              time:        'live',
            }))
          : null;

        // ── Closed trades ───────────────────────────────────────────────
        const closedTrades = trades.length
          ? (trades as Array<{
              market: string; side: string; entry_price: number;
              size_usdc: number; pnl_usdc: number | null;
              status: string; opened_at: Date;
            }>).map((t) => ({
              market: t.market,
              entry:  `${t.side} @ $${(t.entry_price ?? 0).toFixed(2)}`,
              size:   `$${(t.size_usdc ?? 0).toLocaleString()}`,
              pnl:    t.pnl_usdc != null ? fmtPnl(t.pnl_usdc) : '—',
              status: t.status as 'win' | 'loss',
              time:   formatTimeAgo(new Date(t.opened_at)),
            }))
          : null;

        result[id] = { stats, chartPath, openPositions, closedTrades, wallet: statsDoc.wallet };
      })
    );

    // ── Global stats — only displayed vaults, not hidden ones ──────────
    const displayedStats = vaultIds
      .map((id) => statsByLabel.get(id))
      .filter((d): d is typeof allStats[0] => d != null);

    if (displayedStats.length) {
      const totalPnl     = displayedStats.reduce((s, v) => s + (v.totalPnlAllTime ?? 0), 0);
      const totalCapital = displayedStats.reduce((s, v) => s + (v.vault_size_usdc ?? 0), 0);
      const totalInitial = displayedStats.reduce((s, v) => s + (v.initial_capital_usdc ?? 0), 0);
      const latestTs     = Math.max(...displayedStats.map((v) => v.last_polled_activity_ts ?? 0));

      result._global = {
        totalPnl,
        totalCapital,
        combinedRoi: parseFloat(((totalPnl / Math.max(totalInitial, 1)) * 100).toFixed(1)),
        lastTradeAt: latestTs ? formatTimeAgo(latestTs) : '—',
      };
    } else {
      result._global = null;
    }

    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    console.error('[/api/vaults/data]', err);
    return NextResponse.json({ ok: false, data: null }, { status: 500 });
  }
}
