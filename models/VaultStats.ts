import mongoose, { Schema, Document } from 'mongoose';

export interface IVaultStats extends Document {
  wallet: string;
  status: string;
  traderLabel: string;
  initial_capital_usdc: number;
  vault_size_usdc: number;
  totalPnlAllTime: number;
  totalRealizedPnl: number;
  totalUnrealizedPnl: number;
  win_rate: number;
  total_trades: number;
  sortino_ratio: number;
  avg_trade_size_usdc: number;
  avg_hold_days: number;
  kelly_fraction: number;
  avg_entry_odds: number;
  avg_profit_per_winner: number;
  avg_loss_per_loser: number;
  insiderSignalScore: number;
  signals: Record<string, boolean>;
  last_polled_activity_ts: number; // unix seconds
  profiledAt: Date;
}

const VaultStatsSchema = new Schema(
  {
    wallet:               { type: String, required: true, unique: true },
    status:               { type: String, default: 'active' },
    traderLabel:          { type: String, default: '' },
    initial_capital_usdc: { type: Number, default: 0 },
    vault_size_usdc:      { type: Number, default: 0 },
    totalPnlAllTime:      { type: Number, default: 0 },
    totalRealizedPnl:     { type: Number, default: 0 },
    totalUnrealizedPnl:   { type: Number, default: 0 },
    win_rate:             { type: Number, default: 0 },
    total_trades:         { type: Number, default: 0 },
    sortino_ratio:        { type: Number, default: 0 },
    avg_trade_size_usdc:  { type: Number, default: 0 },
    avg_hold_days:        { type: Number, default: 0 },
    kelly_fraction:       { type: Number, default: 0 },
    avg_entry_odds:       { type: Number, default: 0 },
    avg_profit_per_winner:{ type: Number, default: 0 },
    avg_loss_per_loser:   { type: Number, default: 0 },
    insiderSignalScore:   { type: Number, default: 0 },
    signals:              { type: Schema.Types.Mixed, default: {} },
    last_polled_activity_ts: { type: Number, default: 0 },
    profiledAt:           { type: Date },
  },
  { collection: 'vaults' }
);

export default mongoose.models.VaultStats ||
  mongoose.model<IVaultStats>('VaultStats', VaultStatsSchema);
