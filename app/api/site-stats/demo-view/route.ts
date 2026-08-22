import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SiteStats } from '@/models/SiteStats';

export const dynamic = 'force-dynamic';

// Fired once by the client each time the prelaunch demo actually starts
// playing (not on page load) — backs the "Demo Previews Run" ticker with a
// real counter instead of a hardcoded animation target.
export async function POST() {
  try {
    await connectDB();
    await SiteStats.findOneAndUpdate(
      { key: 'main' },
      { $inc: { demo_previews_count: 1 }, $set: { updated_at: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error incrementing demo view count:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
