import mongoose, { Schema, Document } from 'mongoose';

// Singleton doc (key: 'main') backing the prelaunch page's live ticker.
// Genesis Members and Prelaunch ARR are baselines *added to* real counts
// derived from the Subscription collection at read time (see
// app/api/site-stats/route.ts) — so the numbers actually grow with real
// onchain payments instead of being static marketing copy. Demo Previews Run
// has no other backing collection, so it's tracked as a real counter here,
// incremented once per genuine demo start via POST /api/site-stats/demo-view.
export interface ISiteStats extends Document {
  key: string;
  demo_previews_baseline: number;
  demo_previews_count: number;
  genesis_members_baseline: number;
  genesis_slots_total: number;
  prelaunch_arr_baseline: number;
  updated_at: Date;
}

const SiteStatsSchema = new Schema(
  {
    key:                       { type: String, required: true, unique: true },
    demo_previews_baseline:    { type: Number, default: 4812 },
    demo_previews_count:       { type: Number, default: 0 },
    genesis_members_baseline:  { type: Number, default: 347 },
    genesis_slots_total:       { type: Number, default: 1000 },
    prelaunch_arr_baseline:    { type: Number, default: 38200 },
    updated_at:                { type: Date, default: Date.now },
  },
  { collection: 'site_stats' }
);

export const SiteStats =
  mongoose.models.SiteStats || mongoose.model<ISiteStats>('SiteStats', SiteStatsSchema);
