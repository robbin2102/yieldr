// MongoDB Model for Contribution Records

import mongoose, { Schema, Document } from 'mongoose';

export interface IContribution extends Document {
  wallet_address: string;
  usdc_amount: number;
  yldr_allocation: number;
  yldr_price: number;
  allocation_tier: string;
  fdv_at_purchase: number;
  tx_hash: string;
  network: string;
  chain_id: number;
  status: 'pending' | 'confirmed' | 'failed';
  block_number?: number;
  gas_used?: string;
  created_at: Date;
  confirmed_at?: Date;
  ip_address?: string;
  user_agent?: string;
  referral_code?: string;
  notes?: string;
  discord_invite?: string;
}

const ContributionSchema = new Schema<IContribution>(
  {
    // Core transaction data
    wallet_address: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    usdc_amount: {
      type: Number,
      required: true,
      min: 100, // Minimum $100 USDC for production
    },
    yldr_allocation: {
      type: Number,
      required: true,
    },
    yldr_price: {
      type: Number,
      required: true,
    },
    allocation_tier: {
      type: String,
      required: true,
      enum: ['Genesis', 'Pre-Seed', 'Seed', 'Growth', 'Scale'],
    },
    fdv_at_purchase: {
      type: Number,
      required: true,
    },

    // Blockchain data
    tx_hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    network: {
      type: String,
      required: true,
      enum: ['Base', 'Ethereum', 'Arbitrum', 'Polygon', 'BNB'],
    },
    chain_id: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending',
    },
    block_number: {
      type: Number,
    },
    gas_used: {
      type: String,
    },

    // Timestamps
    created_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
    confirmed_at: {
      type: Date,
    },

    // Metadata
    ip_address: {
      type: String,
    },
    user_agent: {
      type: String,
    },
    referral_code: {
      type: String,
      index: true,
    },
    notes: {
      type: String,
    },
    discord_invite: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'contributions',
  }
);

// Indexes for common queries
ContributionSchema.index({ wallet_address: 1, created_at: -1 });
ContributionSchema.index({ allocation_tier: 1, status: 1 });
ContributionSchema.index({ status: 1, created_at: -1 });

// Virtual for formatted date
ContributionSchema.virtual('formatted_date').get(function () {
  return this.created_at.toISOString();
});

export const Contribution =
  mongoose.models.Contribution ||
  mongoose.model<IContribution>('Contribution', ContributionSchema);
