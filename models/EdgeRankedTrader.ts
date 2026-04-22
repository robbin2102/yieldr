import mongoose, { Schema } from 'mongoose';

const EdgeRankedTraderSchema = new Schema(
  { wallet: String, edge: Number, p_val: Number },
  { collection: 'ahf-edgeRankedTraders' }
);

export default mongoose.models.EdgeRankedTrader ||
  mongoose.model('EdgeRankedTrader', EdgeRankedTraderSchema);
