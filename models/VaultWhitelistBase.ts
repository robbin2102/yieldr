// Stores the randomized starting count/AUM shown for a vault's whitelist
// counters before real signups exist. Generated once on first request
// (or seeded manually), then persisted.

import mongoose, { Schema, Document } from 'mongoose';

export interface IVaultWhitelistBase extends Document {
  vault_id: string;
  base_count: number;
  base_aum: number;
  created_at: Date;
}

const VaultWhitelistBaseSchema = new Schema<IVaultWhitelistBase>(
  {
    vault_id:   { type: String, required: true, unique: true },
    base_count: { type: Number, required: true },
    base_aum:   { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: 'vault_whitelist_base' }
);

export const VaultWhitelistBase =
  mongoose.models.VaultWhitelistBase ||
  mongoose.model<IVaultWhitelistBase>('VaultWhitelistBase', VaultWhitelistBaseSchema);
