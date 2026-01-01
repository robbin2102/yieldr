// MongoDB Model for Raise Statistics Tracking

import mongoose, { Schema, Document } from 'mongoose';

export interface IRaiseStats extends Document {
  total_raised_usdc: number;
  total_yldr_allocated: number;
  current_tier: string;
  tier_raised_usdc: number;
  tier_yldr_remaining: number;
  contributor_count: number;
  last_updated: Date;
}

const RaiseStatsSchema = new Schema<IRaiseStats>(
  {
    total_raised_usdc: {
      type: Number,
      required: true,
      default: 0,
    },
    total_yldr_allocated: {
      type: Number,
      required: true,
      default: 0,
    },
    current_tier: {
      type: String,
      required: true,
      default: 'Genesis',
    },
    tier_raised_usdc: {
      type: Number,
      required: true,
      default: 0,
    },
    tier_yldr_remaining: {
      type: Number,
      required: true,
      default: 1_500_000, // Genesis tokens
    },
    contributor_count: {
      type: Number,
      required: true,
      default: 0,
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'raise_stats',
  }
);

export const RaiseStats =
  mongoose.models.RaiseStats ||
  mongoose.model<IRaiseStats>('RaiseStats', RaiseStatsSchema);
