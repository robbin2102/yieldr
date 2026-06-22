import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getWhitelistStats } from '@/lib/whitelist';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const stats = await getWhitelistStats();
    return NextResponse.json({ ok: true, data: stats });
  } catch (err) {
    console.error('[/api/whitelist/stats GET]', err);
    return NextResponse.json({ ok: false, data: null }, { status: 500 });
  }
}
