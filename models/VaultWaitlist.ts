// MongoDB Model for Agent Vault Waitlist Signups (per-vault, wallet-based)

import mongoose, { Schema, Document } from 'mongoose';

export interface IVaultWaitlist extends Document {
  wallet_address: string;
  vault_id: string;
  created_at: Date;
}

const VaultWaitlistSchema = new Schema<IVaultWaitlist>(
  {
    wallet_address: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    vault_id: {
      type: String,
      required: true,
      index: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'vault_waitlist',
  }
);

VaultWaitlistSchema.index({ wallet_address: 1, vault_id: 1 }, { unique: true });

export const VaultWaitlist =
  mongoose.models.VaultWaitlist ||
  mongoose.model<IVaultWaitlist>('VaultWaitlist', VaultWaitlistSchema);
