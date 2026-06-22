import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { KNOWN_VAULT_IDS, getBaseAUM } from '@/lib/whitelist';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const aums: Record<string, number> = {};
    await Promise.all(
      KNOWN_VAULT_IDS.map(async (id) => {
        aums[id] = await getBaseAUM(id);
      })
    );
    return NextResponse.json({ ok: true, data: aums });
  } catch (err) {
    console.error('[/api/whitelist/aum GET]', err);
    return NextResponse.json({ ok: false, data: null }, { status: 500 });
  }
}
