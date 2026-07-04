import mongoose, { Schema, Document } from 'mongoose';

export interface ITokenUsage extends Document {
  endpoint: string;
  hour: Date;
  walletAddress: string;
  cost: number;
  inputTokens: number;
  outputTokens: number;
  model: string;
  requestCount: number;
  toolCalls: number;
  createdAt: Date;
  updatedAt: Date;
}

const TokenUsageSchema = new Schema(
  {
    endpoint:      { type: String, required: true },
    hour:          { type: Date, required: true },
    walletAddress: { type: String, required: true, index: true },
    cost:          { type: Number, default: 0 },
    inputTokens:   { type: Number, default: 0 },
    outputTokens:  { type: Number, default: 0 },
    model:         { type: String, default: '' },
    requestCount:  { type: Number, default: 0 },
    toolCalls:     { type: Number, default: 0 },
  },
  { collection: 'token_usage', timestamps: true }
);

TokenUsageSchema.index({ walletAddress: 1, endpoint: 1, hour: 1 }, { unique: true });

export default mongoose.models.TokenUsage ||
  mongoose.model<ITokenUsage>('TokenUsage', TokenUsageSchema);
