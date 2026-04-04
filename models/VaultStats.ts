import mongoose, { Schema, Document } from 'mongoose';

export interface IVaultStats extends Document {
  wallet: string;
  status: string;
  totalPnlAllTime: number;
  totalCapitalDeployed: number;
  win_rate: number;
  win_rate_sample_size: number;
  timeframePnL: {
    '7d'?: { roce?: number };
    '30d'?: { roce?: number };
  };
  tradingConsistency?: {
    sortinoRatio?: number | null;
  };
  last_trade_at?: Date;
  last_updated: Date;
}

const VaultStatsSchema = new Schema(
  {
    wallet:               { type: String, required: true, unique: true },
    status:               { type: String, default: 'active' },
    totalPnlAllTime:      { type: Number, default: 0 },
    totalCapitalDeployed: { type: Number, default: 0 },
    win_rate:             { type: Number, default: 0 },
    win_rate_sample_size: { type: Number, default: 0 },
    timeframePnL:         { type: Schema.Types.Mixed, default: {} },
    tradingConsistency:   { type: Schema.Types.Mixed, default: {} },
    last_trade_at:        { type: Date },
    last_updated:         { type: Date, default: Date.now },
  },
  { collection: 'vaults' }
);

export default mongoose.models.VaultStats ||
  mongoose.model<IVaultStats>('VaultStats', VaultStatsSchema);
