export type VaultId = 'geo' | 'nba' | 'soccer' | 'esports' | 'soccerAlpha';

export const VAULT_META: Record<VaultId, {
  id: VaultId;
  name: string;
  emoji: string;
  description: string;
  fallback: {
    totalPnl:          number;
    pnl30d:            number;
    capitalDeployed30d: number;
    winRate:           number;
    daysWonRate:       number;
    trades:            number;
  };
}> = {
  geo: {
    id: 'geo',
    name: 'Politics Edge Vault',
    emoji: '🌐',
    description:
      'Human-curated thesis on geopolitical events. Agents scan prediction markets for insider wallets with abnormal win rates vs implied probability, then execute positions within trader-defined risk parameters.',
    fallback: {
      totalPnl:          24768,
      pnl30d:            2303,
      capitalDeployed30d: 14847,
      winRate:           82,
      daysWonRate:       61.3,
      trades:            67,
    },
  },
  nba: {
    id: 'nba',
    name: 'NBA Edge Vault',
    emoji: '🏀',
    description:
      'Trader-designed strategy: agents discover and rank top NBA prediction market traders by statistical edge, profile their betting patterns, and execute positions at the highest-conviction price levels within human-set rules.',
    fallback: {
      totalPnl:          4190,
      pnl30d:            980,
      capitalDeployed30d: 7200,
      winRate:           74,
      daysWonRate:       58.0,
      trades:            143,
    },
  },
  soccer: {
    id: 'soccer',
    name: 'NHL Alpha Vault',
    emoji: '🏒',
    description:
      'Agents scan NHL prediction markets for traders with statistically impossible edge (p-score < 0.0001). Human trader validates patterns, sets entry rules. Agents execute positions near top-trader price levels with automated risk controls.',
    fallback: {
      totalPnl:          2312,
      pnl30d:            420,
      capitalDeployed30d: 4800,
      winRate:           69,
      daysWonRate:       55.0,
      trades:            89,
    },
  },
  esports: {
    id: 'esports',
    name: 'E-Sports Ninja Vault',
    emoji: '🎮',
    description:
      'Agents scan e-sports prediction markets for traders with exceptional win rates on CS:GO, Valorant, and League of Legends markets. Human trader sets risk rules; agents execute near top-trader price levels with automated controls.',
    fallback: {
      totalPnl:          0,
      pnl30d:            0,
      capitalDeployed30d: 0,
      winRate:           0,
      daysWonRate:       0,
      trades:            0,
    },
  },
  soccerAlpha: {
    id: 'soccerAlpha',
    name: 'Soccer Alpha Vault',
    emoji: '⚽',
    description:
      'Agents scan soccer prediction markets for traders with statistically impossible edge (p-score < 0.0001). Human trader validates patterns, sets entry rules. Agents execute positions near top-trader price levels with automated risk controls.',
    fallback: {
      totalPnl:          0,
      pnl30d:            0,
      capitalDeployed30d: 0,
      winRate:           0,
      daysWonRate:       0,
      trades:            0,
    },
  },
};

// Fallback open positions (shown until monitoring service populates DB)
export const FALLBACK_POSITIONS: Record<VaultId, Array<{
  market: string; side: string; size: string;
  entry: string; pnl: string; pnlPositive: boolean; time: string;
}>> = {
  geo: [
    { market: 'US TikTok Ban Enforcement',   side: 'YES', size: '$2,000', entry: '$0.58', pnl: '+$840', pnlPositive: true,  time: '6d ago' },
    { market: 'China Taiwan Blockade Drill', side: 'NO',  size: '$2,500', entry: '$0.78', pnl: '+$500', pnlPositive: true,  time: '7d ago' },
    { market: 'OPEC+ Production Cut',        side: 'YES', size: '$1,800', entry: '$0.41', pnl: '+$360', pnlPositive: true,  time: '8d ago' },
    { market: 'EU Defense Spending Bill',    side: 'YES', size: '$2,200', entry: '$0.66', pnl: '-$110', pnlPositive: false, time: '10d ago' },
    { market: 'NK Missile Test April',       side: 'YES', size: '$1,500', entry: '$0.37', pnl: '+$225', pnlPositive: true,  time: '12d ago' },
  ],
  nba: [
    { market: 'Lakers vs Warriors Apr 6',  side: 'GSW', size: '$800', entry: '$0.52', pnl: '+$120', pnlPositive: true,  time: '2h ago' },
    { market: 'Mavs vs Nuggets Apr 6',     side: 'DEN', size: '$700', entry: '$0.48', pnl: '+$85',  pnlPositive: true,  time: '3h ago' },
    { market: 'Knicks vs Bucks Apr 6',     side: 'NYK', size: '$650', entry: '$0.56', pnl: '-$45',  pnlPositive: false, time: '5h ago' },
    { market: 'Celtics vs Heat Apr 7',     side: 'BOS', size: '$900', entry: '$0.65', pnl: '+$60',  pnlPositive: true,  time: '8h ago' },
    { market: 'Thunder vs Cavs Apr 7',     side: 'OKC', size: '$750', entry: '$0.58', pnl: '+$30',  pnlPositive: true,  time: '10h ago' },
    { market: 'Suns vs Pacers Apr 7',      side: 'PHX', size: '$600', entry: '$0.44', pnl: '+$15',  pnlPositive: true,  time: '12h ago' },
  ],
  esports:     [],
  soccer:      [],
  soccerAlpha: [],
};

// Fallback closed trades
export const FALLBACK_TRADES: Record<VaultId, Array<{
  market: string; entry: string; size: string;
  pnl: string; status: 'win' | 'loss'; time: string;
}>> = {
  geo: [
    { market: 'US-Iran Nuclear Deal 2026',      entry: 'YES @ $0.32', size: '$2,400', pnl: '+$1,890', status: 'win',  time: '4m ago'  },
    { market: 'Trump Tariff Extension Q2',      entry: 'NO @ $0.41',  size: '$1,800', pnl: '+$1,250', status: 'win',  time: '22m ago' },
    { market: 'EU-China Trade Agreement',       entry: 'YES @ $0.28', size: '$2,100', pnl: '+$2,340', status: 'win',  time: '1h ago'  },
    { market: 'Russia-Ukraine Ceasefire July',  entry: 'NO @ $0.55',  size: '$1,500', pnl: '-$420',   status: 'loss', time: '3h ago'  },
    { market: 'Fed Emergency Rate Cut',         entry: 'NO @ $0.72',  size: '$3,200', pnl: '+$2,880', status: 'win',  time: '5h ago'  },
    { market: 'BRICS Currency Launch 2026',     entry: 'YES @ $0.18', size: '$1,200', pnl: '+$840',   status: 'win',  time: '8h ago'  },
    { market: 'Taiwan Strait Incident Q2',      entry: 'NO @ $0.82',  size: '$2,800', pnl: '+$1,960', status: 'win',  time: '12h ago' },
    { market: 'Saudi-Iran Normalization',       entry: 'YES @ $0.44', size: '$1,900', pnl: '+$1,520', status: 'win',  time: '18h ago' },
    { market: 'UK General Election Snap',       entry: 'YES @ $0.35', size: '$1,400', pnl: '-$620',   status: 'loss', time: '1d ago'  },
    { market: 'India-Pak De-escalation',        entry: 'YES @ $0.61', size: '$2,200', pnl: '+$1,100', status: 'win',  time: '1d ago'  },
    { market: 'Venezuela Regime Change',        entry: 'NO @ $0.69',  size: '$1,700', pnl: '+$1,360', status: 'win',  time: '2d ago'  },
    { market: 'NATO Article 5 Invocation',      entry: 'NO @ $0.91',  size: '$4,100', pnl: '+$3,690', status: 'win',  time: '2d ago'  },
    { market: 'Japan Rate Hike March',          entry: 'YES @ $0.52', size: '$2,600', pnl: '+$1,820', status: 'win',  time: '3d ago'  },
    { market: 'Brazil Impeachment 2026',        entry: 'NO @ $0.45',  size: '$1,300', pnl: '-$390',   status: 'loss', time: '4d ago'  },
    { market: 'Middle East Peace Summit',       entry: 'YES @ $0.22', size: '$1,600', pnl: '+$1,280', status: 'win',  time: '5d ago'  },
  ],
  nba: [
    { market: 'Lakers vs Celtics Apr 2',    entry: 'LAL @ $0.38', size: '$800',   pnl: '+$520', status: 'win',  time: '8m ago'  },
    { market: 'Nuggets vs Bucks Apr 1',     entry: 'MIL @ $0.44', size: '$650',   pnl: '+$340', status: 'win',  time: '45m ago' },
    { market: 'Warriors vs Heat Mar 31',    entry: 'GSW @ $0.55', size: '$900',   pnl: '-$280', status: 'loss', time: '2h ago'  },
    { market: 'Sixers vs Knicks Mar 30',    entry: 'NYK @ $0.62', size: '$750',   pnl: '+$210', status: 'win',  time: '4h ago'  },
    { market: 'Suns vs Mavs Mar 29',        entry: 'DAL @ $0.41', size: '$600',   pnl: '+$430', status: 'win',  time: '6h ago'  },
    { market: 'Celtics vs Thunder Mar 28',  entry: 'BOS @ $0.58', size: '$1,100', pnl: '+$680', status: 'win',  time: '10h ago' },
    { market: 'Nuggets vs Wolves Mar 27',   entry: 'DEN @ $0.52', size: '$850',   pnl: '+$290', status: 'win',  time: '14h ago' },
    { market: 'Lakers vs Clippers Mar 26',  entry: 'LAC @ $0.46', size: '$700',   pnl: '-$180', status: 'loss', time: '20h ago' },
    { market: 'Hawks vs Cavs Mar 25',       entry: 'CLE @ $0.71', size: '$950',   pnl: '+$150', status: 'win',  time: '1d ago'  },
    { market: 'Rockets vs Kings Mar 24',    entry: 'HOU @ $0.48', size: '$600',   pnl: '+$380', status: 'win',  time: '1d ago'  },
    { market: 'Bucks vs Pacers Mar 23',     entry: 'MIL @ $0.55', size: '$800',   pnl: '+$310', status: 'win',  time: '2d ago'  },
    { market: 'Heat vs Bulls Mar 22',       entry: 'MIA @ $0.63', size: '$750',   pnl: '-$190', status: 'loss', time: '2d ago'  },
    { market: 'Thunder vs Spurs Mar 21',    entry: 'OKC @ $0.74', size: '$1,000', pnl: '+$220', status: 'win',  time: '3d ago'  },
    { market: 'Celtics vs Sixers Mar 20',   entry: 'BOS @ $0.61', size: '$900',   pnl: '+$450', status: 'win',  time: '3d ago'  },
    { market: 'Wolves vs Suns Mar 19',      entry: 'MIN @ $0.44', size: '$650',   pnl: '+$510', status: 'win',  time: '4d ago'  },
  ],
  soccer:      [],
  esports:     [],
  soccerAlpha: [],
};
