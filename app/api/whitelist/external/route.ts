import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { registerWallet } from '@/lib/whitelist';

export const dynamic = 'force-dynamic';

// Third-party integration endpoint — same Mongo collection as /api/whitelist,
// gated by a static API key instead of relying on same-origin browser calls.
export async function POST(request: Request) {
  const expectedKey = process.env.WHITELIST_API_KEY;
  if (!expectedKey) {
    return NextResponse.json({ ok: false, message: 'External whitelist API is not configured' }, { status: 500 });
  }

  const providedKey = request.headers.get('x-api-key');
  if (providedKey !== expectedKey) {
    return NextResponse.json({ ok: false, message: 'Invalid or missing API key' }, { status: 401 });
  }

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
    console.error('[/api/whitelist/external POST]', err);
    return NextResponse.json({ ok: false, message: 'Something went wrong' }, { status: 500 });
  }
}
