// MongoDB Model for Genesis Subscription Payment Records

import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  wallet_address: string;
  plan_name: 'Scout' | 'Trader' | 'Desk';
  billing_cycle: 'monthly' | 'annual';
  usdc_amount: number; // on-chain verified amount actually paid THIS transaction
                        // (the full plan price for a first purchase, or just the
                        // upgrade differential when is_upgrade is true)
  reward_min_usdc: number;
  reward_max_usdc: number;
  reward_payout_window: string;
  subscription_start: string;
  access_months: number;
  renews_automatically: boolean;

  // Upgrade audit trail — a wallet holds exactly one plan at a time; every
  // upgrade is its own record linked back to what it replaced, and
  // cumulative_usdc_paid is the running total invested toward the CURRENT
  // plan (used to price the next upgrade's differential).
  is_upgrade: boolean;
  upgraded_from_subscription_id?: mongoose.Types.ObjectId | null;
  upgraded_from_plan?: 'Scout' | 'Trader' | 'Desk' | null;
  upgraded_from_cycle?: 'monthly' | 'annual' | null;
  cumulative_usdc_paid: number;

  tx_hash: string;
  token: 'USDC' | 'USDT' | 'USDG';
  network: string;
  chain_id: number;
  treasury_address: string;

  status: 'confirmed' | 'failed';
  created_at: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    wallet_address: { type: String, required: true, lowercase: true, index: true },

    plan_name: { type: String, required: true, enum: ['Scout', 'Trader', 'Desk'] },
    billing_cycle: { type: String, required: true, enum: ['monthly', 'annual'] },

    usdc_amount: { type: Number, required: true, min: 0 },
    reward_min_usdc: { type: Number, required: true },
    reward_max_usdc: { type: Number, required: true },
    reward_payout_window: { type: String, required: true, default: 'TGE + 30 days' },
    subscription_start: { type: String, required: true, default: 'Q1 2027' },
    access_months: { type: Number, required: true, default: 1 },
    renews_automatically: { type: Boolean, required: true, default: true },

    is_upgrade: { type: Boolean, required: true, default: false },
    upgraded_from_subscription_id: { type: Schema.Types.ObjectId, ref: 'Subscription', default: null },
    upgraded_from_plan: { type: String, enum: ['Scout', 'Trader', 'Desk', null], default: null },
    upgraded_from_cycle: { type: String, enum: ['monthly', 'annual', null], default: null },
    cumulative_usdc_paid: { type: Number, required: true, min: 0 },

    tx_hash: { type: String, required: true, unique: true, index: true },
    token: { type: String, required: true, enum: ['USDC', 'USDT', 'USDG'] },
    network: { type: String, required: true },
    chain_id: { type: Number, required: true },
    treasury_address: { type: String, required: true },

    status: { type: String, required: true, enum: ['confirmed', 'failed'], default: 'confirmed' },
    created_at: { type: Date, default: Date.now, index: true },
  },
  {
    timestamps: true,
    collection: 'subscriptions',
  }
);

SubscriptionSchema.index({ wallet_address: 1, created_at: -1 });
SubscriptionSchema.index({ status: 1, created_at: -1 });

export const Subscription =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
