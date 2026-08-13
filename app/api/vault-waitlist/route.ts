// API Route: Agent Vault Waitlist (wallet-based, per-vault)

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { VaultWaitlist } from '@/models/VaultWaitlist';

// Baseline counts representing existing signups prior to this DB-backed counter,
// matching the figures already shown on the homepage vault teasers.
const BASE_WAITLIST_COUNTS: Record<string, number> = {
  'virtuals-robotics-infra': 20,
  'spacex-rwa': 39,
};

function baseCount(vaultId: string): number {
  return BASE_WAITLIST_COUNTS[vaultId] ?? 0;
}

export async function GET(request: NextRequest) {
  const vaultId = request.nextUrl.searchParams.get('vault');
  if (!vaultId) {
    return NextResponse.json({ success: false, message: 'Missing vault id' }, { status: 400 });
  }
  try {
    await connectDB();
    const dbCount = await VaultWaitlist.countDocuments({ vault_id: vaultId });
    return NextResponse.json({ success: true, count: baseCount(vaultId) + dbCount });
  } catch (error) {
    console.error('Error fetching vault waitlist count:', error);
    return NextResponse.json({ success: true, count: baseCount(vaultId) });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { wallet_address, vault_id } = await request.json();

    if (!wallet_address || typeof wallet_address !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(wallet_address)) {
      return NextResponse.json({ success: false, message: 'Please provide a valid wallet address' }, { status: 400 });
    }
    if (!vault_id || typeof vault_id !== 'string') {
      return NextResponse.json({ success: false, message: 'Missing vault id' }, { status: 400 });
    }

    await connectDB();

    const existing = await VaultWaitlist.findOne({ wallet_address: wallet_address.toLowerCase(), vault_id });
    const dbCount = await VaultWaitlist.countDocuments({ vault_id });

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyJoined: true,
        message: "You're already on the waitlist",
        count: baseCount(vault_id) + dbCount,
      });
    }

    await VaultWaitlist.create({ wallet_address: wallet_address.toLowerCase(), vault_id });

    return NextResponse.json({
      success: true,
      alreadyJoined: false,
      message: 'Successfully joined the vault waitlist',
      count: baseCount(vault_id) + dbCount + 1,
    });
  } catch (error) {
    console.error('Vault waitlist error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
