// API Route: Get Current Raise Statistics

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { RaiseStats } from '@/models/RaiseStats';
import { getCurrentTier } from '@/lib/tierCalculations';

export async function GET() {
  try {
    await connectDB();

    // Get or create stats document
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

    const tierInfo = getCurrentTier(stats.total_raised_usdc);

    return NextResponse.json({
      success: true,
      data: {
        totalRaised: stats.total_raised_usdc,
        totalYldrAllocated: stats.total_yldr_allocated,
        contributorCount: stats.contributor_count,
        currentTier: tierInfo.currentTier,
        nextTier: tierInfo.nextTier,
        tierProgress: tierInfo.tierProgress,
        tokensRemainingInTier: tierInfo.tokensRemainingInTier,
        usdcToNextTier: tierInfo.usdcToNextTier,
        priceIncreaseAtNextTier: tierInfo.priceIncreaseAtNextTier,
      },
    });
  } catch (error) {
    console.error('Error fetching raise stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch raise stats' },
      { status: 500 }
    );
  }
}
