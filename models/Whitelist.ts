// MongoDB Model for Whitelisted Wallets per Agent Vault

import mongoose, { Schema, Document } from 'mongoose';

export interface IWhitelist extends Document {
  wallet_address: string;
  vault_id: string;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

const WhitelistSchema = new Schema<IWhitelist>(
  {
    wallet_address: { type: String, required: true, lowercase: true, index: true },
    vault_id:       { type: String, required: true, index: true },
    ip_address:     { type: String },
    user_agent:     { type: String },
    created_at:     { type: Date, default: Date.now },
  },
  { collection: 'whitelists' }
);

// One whitelist entry per wallet per vault
WhitelistSchema.index({ wallet_address: 1, vault_id: 1 }, { unique: true });

export const Whitelist =
  mongoose.models.Whitelist || mongoose.model<IWhitelist>('Whitelist', WhitelistSchema);
