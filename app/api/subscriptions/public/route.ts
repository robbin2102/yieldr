// API Route: Get Public Subscription Payments (Last 100)

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Subscription } from '@/models/Subscription';

export async function GET() {
  try {
    await connectDB();

    const subscriptions = await Subscription.find({ status: 'confirmed' })
      .sort({ created_at: -1 })
      .limit(100)
      .select('wallet_address plan_name billing_cycle usdc_amount reward_min_usdc reward_max_usdc tx_hash created_at chain_id network token');

    const totalPaid = subscriptions.reduce((sum, s) => sum + s.usdc_amount, 0);

    return NextResponse.json({
      success: true,
      data: {
        subscriptions,
        summary: {
          totalPaid,
          subscriptionCount: subscriptions.length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching public subscriptions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch public subscriptions', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
