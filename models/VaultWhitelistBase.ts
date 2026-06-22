// Stores the randomized starting count shown for a vault's whitelist counter
// before real signups exist. Generated once on first request, then persisted.

import mongoose, { Schema, Document } from 'mongoose';

export interface IVaultWhitelistBase extends Document {
  vault_id: string;
  base_count: number;
  created_at: Date;
}

const VaultWhitelistBaseSchema = new Schema<IVaultWhitelistBase>(
  {
    vault_id:   { type: String, required: true, unique: true },
    base_count: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: 'vault_whitelist_base' }
);

export const VaultWhitelistBase =
  mongoose.models.VaultWhitelistBase ||
  mongoose.model<IVaultWhitelistBase>('VaultWhitelistBase', VaultWhitelistBaseSchema);
