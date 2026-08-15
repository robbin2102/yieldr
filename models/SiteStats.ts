import mongoose, { Schema, Document } from 'mongoose';

// Singleton doc (key: 'main') backing the prelaunch page's live ticker.
// Genesis Members and Prelaunch ARR are NOT stored here — they're computed
// straight from the Subscription collection at read time (see
// app/api/site-stats/route.ts), so the ticker always shows the true actual
// count, never a padded/baseline number. Demo Previews Run has no other
// backing collection, so it's tracked as a real counter here, incremented
// once per genuine demo start via POST /api/site-stats/demo-view.
// genesis_slots_total is a real program config value (total slots on offer),
// not a derived count, so it stays admin-editable here.
export interface ISiteStats extends Document {
  key: string;
  demo_previews_count: number;
  genesis_slots_total: number;
  updated_at: Date;
}

const SiteStatsSchema = new Schema(
  {
    key:                 { type: String, required: true, unique: true },
    demo_previews_count: { type: Number, default: 0 },
    genesis_slots_total: { type: Number, default: 1000 },
    updated_at:          { type: Date, default: Date.now },
  },
  { collection: 'site_stats' }
);

export const SiteStats =
  mongoose.models.SiteStats || mongoose.model<ISiteStats>('SiteStats', SiteStatsSchema);
