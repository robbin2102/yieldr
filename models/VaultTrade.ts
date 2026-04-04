import mongoose, { Schema, Document } from 'mongoose';

export interface IVaultTrade extends Document {
  wallet: string;
  market: string;
  side: 'YES' | 'NO';
  entry_price: number;
  exit_price?: number | null;
  size_usdc: number;
  pnl_usdc?: number | null;
  status: 'open' | 'win' | 'loss';
  condition_id?: string | null;
  opened_at: Date;
  closed_at?: Date | null;
}

const VaultTradeSchema = new Schema(
  {
    wallet:       { type: String, required: true, index: true },
    market:       { type: String, required: true },
    side:         { type: String, enum: ['YES', 'NO'], required: true },
    entry_price:  { type: Number, required: true },
    exit_price:   { type: Number, default: null },
    size_usdc:    { type: Number, required: true },
    pnl_usdc:     { type: Number, default: null },
    status:       { type: String, enum: ['open', 'win', 'loss'], required: true },
    condition_id: { type: String, default: null },
    opened_at:    { type: Date, required: true },
    closed_at:    { type: Date, default: null },
  },
  { collection: 'vault_trades' }
);

VaultTradeSchema.index({ wallet: 1, opened_at: -1 });
VaultTradeSchema.index({ wallet: 1, status: 1 });

export default mongoose.models.VaultTrade ||
  mongoose.model<IVaultTrade>('VaultTrade', VaultTradeSchema);
