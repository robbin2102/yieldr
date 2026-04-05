import mongoose, { Schema, Document } from 'mongoose';

export interface IVaultDeposit extends Document {
  wallet_address: string;
  tx_hash: string;

  // Total deposit
  total_usdc: number;

  // 50% → USDC Vault
  usdc_vault_amount: number;      // total_usdc / 2
  usdc_vault_apy: number;         // 4.5 %
  selected_vault: string | null;  // 'geo' | 'nba' | 'soccer'
  vault_migration_target: string; // 'Q3 2026'

  // 50% → YLDR Token
  yldr_token_amount: number;      // tokens received
  yldr_usdc_value: number;        // total_usdc / 2
  yldr_price_per_token: number;   // e.g. 0.043
  yldr_fdv: number;               // e.g. 9_000_000
  yldr_tier: string;              // 'Genesis'
  yldr_tge_date: string;          // 'Q1 2027'
  yldr_vest_months: number;       // 12

  // On-chain
  network: string;
  chain_id: number;
  treasury_address: string;

  // Meta
  status: string;
  deposited_at: Date;
  ip_address?: string;
}

const VaultDepositSchema = new Schema(
  {
    wallet_address:       { type: String, required: true, lowercase: true, index: true },
    tx_hash:              { type: String, required: true, unique: true },

    total_usdc:           { type: Number, required: true, min: 0 },

    usdc_vault_amount:    { type: Number, required: true },
    usdc_vault_apy:       { type: Number, default: 4.5 },
    selected_vault:       { type: String, default: null },   // geo | nba | soccer | null
    vault_migration_target: { type: String, default: 'Q3 2026' },

    yldr_token_amount:    { type: Number, required: true },
    yldr_usdc_value:      { type: Number, required: true },
    yldr_price_per_token: { type: Number, required: true },
    yldr_fdv:             { type: Number, required: true },
    yldr_tier:            { type: String, default: '' },
    yldr_tge_date:        { type: String, default: 'Q1 2027' },
    yldr_vest_months:     { type: Number, default: 12 },

    network:              { type: String, default: 'Base' },
    chain_id:             { type: Number, default: 8453 },
    treasury_address:     { type: String, default: '' },

    status:               { type: String, default: 'confirmed' },
    deposited_at:         { type: Date, default: Date.now },
    ip_address:           { type: String },
  },
  { collection: 'vault_deposits' }
);

VaultDepositSchema.index({ wallet_address: 1, deposited_at: -1 });

export default mongoose.models.VaultDeposit ||
  mongoose.model<IVaultDeposit>('VaultDeposit', VaultDepositSchema);
