import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteConfig extends Document {
  key: string;
  spots_total: number;
  spots_remaining: number;
  deadline: Date;
  active: boolean;
  updated_at: Date;
}

const SiteConfigSchema = new Schema(
  {
    key:              { type: String, required: true, unique: true },
    spots_total:      { type: Number, default: 500 },
    spots_remaining:  { type: Number, default: 127 },
    deadline:         { type: Date },
    active:           { type: Boolean, default: true },
    updated_at:       { type: Date, default: Date.now },
  },
  { collection: 'site_config' }
);

export default mongoose.models.SiteConfig ||
  mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);
