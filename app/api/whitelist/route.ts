import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { KNOWN_VAULT_IDS, getDisplayCount, registerWallet } from '@/lib/whitelist';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const vaultId = searchParams.get('vault_id');

    if (vaultId) {
      const count = await getDisplayCount(vaultId);
      return NextResponse.json({ ok: true, data: { [vaultId]: count } });
    }

    const counts: Record<string, number> = {};
    await Promise.all(
      KNOWN_VAULT_IDS.map(async (id) => {
        counts[id] = await getDisplayCount(id);
      })
    );

    return NextResponse.json({ ok: true, data: counts });
  } catch (err) {
    console.error('[/api/whitelist GET]', err);
    return NextResponse.json({ ok: false, data: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { wallet_address, vault_id } = await request.json();

    if (!wallet_address || typeof wallet_address !== 'string' || !vault_id || typeof vault_id !== 'string') {
      return NextResponse.json(
        { ok: false, message: 'wallet_address and vault_id are required' },
        { status: 400 }
      );
    }

    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const user_agent  = request.headers.get('user-agent') ?? undefined;

    const count = await registerWallet(wallet_address, vault_id, ip_address, user_agent);
    return NextResponse.json({ ok: true, data: { count } });
  } catch (err) {
    console.error('[/api/whitelist POST]', err);
    return NextResponse.json({ ok: false, message: 'Something went wrong' }, { status: 500 });
  }
}
