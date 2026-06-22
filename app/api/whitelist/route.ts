import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Whitelist } from '@/models/Whitelist';
import { VaultWhitelistBase } from '@/models/VaultWhitelistBase';

export const dynamic = 'force-dynamic';

// Once a vault's real whitelist count passes this, the randomized base count
// is dropped entirely and only the real count is shown.
const BASE_COUNT_CUTOFF = 500;

// Agent vault ids surfaced for whitelisting on /explorer and /vaults
const KNOWN_VAULT_IDS = ['geo', 'nba', 'funding', 'aero', 'base', 'spacex', 'meme'];

async function getBaseCount(vaultId: string): Promise<number> {
  const existing = await VaultWhitelistBase.findOne({ vault_id: vaultId }).lean();
  if (existing) return (existing as unknown as { base_count: number }).base_count;

  const base_count = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
  try {
    const doc = await VaultWhitelistBase.create({ vault_id: vaultId, base_count });
    return doc.base_count;
  } catch {
    // Lost a race with a concurrent request — read back the winner's value.
    const doc = await VaultWhitelistBase.findOne({ vault_id: vaultId }).lean();
    return (doc as unknown as { base_count: number })?.base_count ?? base_count;
  }
}

async function getDisplayCount(vaultId: string): Promise<number> {
  const actual = await Whitelist.countDocuments({ vault_id: vaultId });
  if (actual > BASE_COUNT_CUTOFF) return actual;
  const base = await getBaseCount(vaultId);
  return base + actual;
}

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

    try {
      await Whitelist.create({
        wallet_address: wallet_address.toLowerCase(),
        vault_id,
        ip_address,
        user_agent,
      });
    } catch (err: unknown) {
      const isDuplicate = err instanceof Error && (err as { code?: number }).code === 11000;
      if (!isDuplicate) throw err;
      // already whitelisted for this vault — not an error
    }

    const count = await getDisplayCount(vault_id);
    return NextResponse.json({ ok: true, data: { count } });
  } catch (err) {
    console.error('[/api/whitelist POST]', err);
    return NextResponse.json({ ok: false, message: 'Something went wrong' }, { status: 500 });
  }
}
