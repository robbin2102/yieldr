import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SiteConfig from '@/models/SiteConfig';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const doc = await SiteConfig.findOne({ key: 'early_access' }).lean();
    if (!doc) {
      // Return defaults if doc not yet seeded
      return NextResponse.json({
        ok: true,
        data: {
          spots_remaining: 127,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          active: true,
        },
      });
    }
    return NextResponse.json({
      ok: true,
      data: {
        spots_remaining: (doc as { spots_remaining: number }).spots_remaining,
        deadline: (doc as { deadline: Date }).deadline,
        active: (doc as { active: boolean }).active,
      },
    });
  } catch (err) {
    console.error('[/api/site-config]', err);
    return NextResponse.json({
      ok: false,
      data: { spots_remaining: 127, deadline: null, active: true },
    });
  }
}
