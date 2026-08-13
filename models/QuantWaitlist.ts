// MongoDB Model for Quant Agent Waitlist Signups

import mongoose, { Schema, Document } from 'mongoose';

export interface IQuantWaitlist extends Document {
  wallet_address: string;
  created_at: Date;
}

const QuantWaitlistSchema = new Schema<IQuantWaitlist>(
  {
    wallet_address: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'quant_waitlist',
  }
);

export const QuantWaitlist =
  mongoose.models.QuantWaitlist ||
  mongoose.model<IQuantWaitlist>('QuantWaitlist', QuantWaitlistSchema);
