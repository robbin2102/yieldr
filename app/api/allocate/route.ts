// API Route: Calculate Allocation Preview (Protected)
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { RaiseStats } from '@/models/RaiseStats';
import { calculateAllocation } from '@/lib/tierCalculations';
import { API_AUTH_KEY } from '@/config/payment';

// Helper to verify API auth for internal calls
function verifyApiAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('x-api-key');
  return authHeader === API_AUTH_KEY;
}

export async function POST(req: NextRequest) {
  try {
    // Verify API authentication for internal calls
    if (!verifyApiAuth(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const { usdc_amount } = body;

    if (!usdc_amount || usdc_amount < 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid contribution amount. Minimum $100 USDC.' },
        { status: 400 }
      );
    }

    // Get current raise stats
    let stats = await RaiseStats.findOne();
    if (!stats) {
      stats = await RaiseStats.create({
        total_raised_usdc: 0,
        total_yldr_allocated: 0,
        current_tier: 'Genesis',
        tier_raised_usdc: 0,
        tier_yldr_remaining: 1_500_000,
        contributor_count: 0,
      });
    }

    // Calculate allocation
    const allocation = calculateAllocation(usdc_amount, stats.total_raised_usdc);

    return NextResponse.json({
      success: true,
      data: {
        yldr_allocation: allocation.yldrAmount,
        yldr_price: allocation.effectivePrice,
        tier: allocation.tier,
        fdv: allocation.fdv,
        breakdown: allocation.breakdown,
      },
    });
  } catch (error) {
    console.error('Error calculating allocation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate allocation' },
      { status: 500 }
    );
  }
}
