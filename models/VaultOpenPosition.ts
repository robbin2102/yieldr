import mongoose, { Schema, Document } from 'mongoose';

export interface IOpenPos {
  title: string;
  outcome: string;
  size: number;
  avgPrice: number;
  curPrice: number;
  currentValue: number;
  cashPnl: number;
  percentPnl: number;
}

export interface IClosedPos {
  title: string;
  outcome: string;
  size: number;
  avgPrice: number;
  realizedPnl: number;
  timestamp: Date;
  status: string;
}

export interface IVaultOpenPosition extends Document {
  wallet: string;
  profiledAt: Date;
  topOpenPositions: IOpenPos[];
  recentClosedPositions: IClosedPos[];
  dailyPnLByFrame: {
    '1d': number[];
    '7d': number[];
    '15d': number[];
    '30d': number[];
  };
}

const VaultOpenPositionSchema = new Schema(
  {
    wallet:      { type: String, required: true, unique: true },
    profiledAt:  { type: Date, required: true },
    topOpenPositions:       { type: [Schema.Types.Mixed], default: [] },
    recentClosedPositions:  { type: [Schema.Types.Mixed], default: [] },
    recentHighConvictionTrades: { type: [Schema.Types.Mixed], default: [] },
    market_titles_summary:  { type: [Schema.Types.Mixed], default: [] },
    entryOddsBreakdown:     { type: [Schema.Types.Mixed], default: [] },
    strengths:  { type: [Schema.Types.Mixed], default: [] },
    weaknesses: { type: [Schema.Types.Mixed], default: [] },
    dailyPnLByFrame: {
      type: {
        '1d':  { type: [Number], default: [] },
        '7d':  { type: [Number], default: [] },
        '15d': { type: [Number], default: [] },
        '30d': { type: [Number], default: [] },
      },
      default: {},
    },
  },
  { collection: 'vault_openPositions' }
);

export default mongoose.models.VaultOpenPosition ||
  mongoose.model<IVaultOpenPosition>('VaultOpenPosition', VaultOpenPositionSchema);
