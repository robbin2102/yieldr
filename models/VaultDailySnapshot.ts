import mongoose, { Schema, Document } from 'mongoose';

export interface IVaultDailySnapshot extends Document {
  wallet: string;
  date: Date;
  cumulative_pnl_usdc: number;
  daily_pnl_usdc: number;
  vault_size_usdc: number;
}

const VaultDailySnapshotSchema = new Schema(
  {
    wallet:              { type: String, required: true, index: true },
    date:                { type: Date,   required: true },
    cumulative_pnl_usdc: { type: Number, required: true },
    daily_pnl_usdc:      { type: Number, default: 0 },
    vault_size_usdc:     { type: Number, default: 0 },
  },
  { collection: 'vault_daily_snapshots' }
);

VaultDailySnapshotSchema.index({ wallet: 1, date: -1 }, { unique: true });

export default mongoose.models.VaultDailySnapshot ||
  mongoose.model<IVaultDailySnapshot>('VaultDailySnapshot', VaultDailySnapshotSchema);
