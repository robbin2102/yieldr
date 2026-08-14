// MongoDB Model for Genesis Subscription Payment Records

import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  wallet_address: string;
  plan_name: 'Scout' | 'Trader' | 'Desk';
  billing_cycle: 'monthly' | 'annual';
  usdc_amount: number; // on-chain verified amount actually paid
  reward_min_usdc: number;
  reward_max_usdc: number;
  reward_payout_window: string;
  subscription_start: string;
  access_months: number;

  tx_hash: string;
  token: 'USDC' | 'USDT';
  network: string;
  chain_id: number;
  treasury_address: string;

  status: 'confirmed' | 'failed';
  created_at: Date;
  ip_address?: string;
  user_agent?: string;
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
    access_months: { type: Number, required: true, default: 12 },

    tx_hash: { type: String, required: true, unique: true, index: true },
    token: { type: String, required: true, enum: ['USDC', 'USDT'] },
    network: { type: String, required: true },
    chain_id: { type: Number, required: true },
    treasury_address: { type: String, required: true },

    status: { type: String, required: true, enum: ['confirmed', 'failed'], default: 'confirmed' },
    created_at: { type: Date, default: Date.now, index: true },
    ip_address: { type: String },
    user_agent: { type: String },
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
