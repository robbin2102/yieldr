// API Route: Quant Agent Waitlist (wallet-based)

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { QuantWaitlist } from '@/models/QuantWaitlist';

// Baseline count representing existing signups prior to this DB-backed counter.
const BASE_WAITLIST_COUNT = 542;

export async function GET() {
  try {
    await connectDB();
    const dbCount = await QuantWaitlist.countDocuments();
    return NextResponse.json({ success: true, count: BASE_WAITLIST_COUNT + dbCount });
  } catch (error) {
    console.error('Error fetching quant waitlist count:', error);
    return NextResponse.json({ success: true, count: BASE_WAITLIST_COUNT });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { wallet_address } = await request.json();

    if (!wallet_address || typeof wallet_address !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(wallet_address)) {
      return NextResponse.json({ success: false, message: 'Please provide a valid wallet address' }, { status: 400 });
    }

    await connectDB();

    const existing = await QuantWaitlist.findOne({ wallet_address: wallet_address.toLowerCase() });
    const dbCount = await QuantWaitlist.countDocuments();

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyJoined: true,
        message: "You're already on the waitlist",
        count: BASE_WAITLIST_COUNT + dbCount,
      });
    }

    await QuantWaitlist.create({ wallet_address: wallet_address.toLowerCase() });

    return NextResponse.json({
      success: true,
      alreadyJoined: false,
      message: 'Successfully joined the Quant Agent waitlist',
      count: BASE_WAITLIST_COUNT + dbCount + 1,
    });
  } catch (error) {
    console.error('Quant waitlist error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
