import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Whitelist } from '@/models/Whitelist';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    if (!wallet || typeof wallet !== 'string') {
      return NextResponse.json({ ok: false, data: null }, { status: 400 });
    }

    const entries = await Whitelist.find({ wallet_address: wallet.toLowerCase() })
      .select('vault_id')
      .lean<{ vault_id: string }[]>();

    return NextResponse.json({ ok: true, data: entries.map((e) => e.vault_id) });
  } catch (err) {
    console.error('[/api/whitelist/mine GET]', err);
    return NextResponse.json({ ok: false, data: null }, { status: 500 });
  }
}
