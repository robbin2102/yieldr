// API route to get current tier information
import { NextResponse } from 'next/server';
import { getTiersCollection } from '@/lib/db/mongodb';
import { TierName, TIER_CONFIG } from '@/lib/types/contribution';

export async function GET() {
  try {
    const tiersCollection = await getTiersCollection();
    const tiers = await tiersCollection.find({}).toArray();

    // If no tiers in database, return config
    if (tiers.length === 0) {
      return NextResponse.json({
        tiers: Object.values(TIER_CONFIG),
        currentTier: TIER_CONFIG.Genesis,
      });
    }

    // Find current tier (first tier that isn't sold out)
    const currentTier = tiers.find(
      (tier) => tier.tokensSold < tier.tokensAvailable
    ) || tiers[tiers.length - 1];

    return NextResponse.json({
      tiers,
      currentTier,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching tiers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tiers', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { tierName, tokensSold } = await request.json() as {
      tierName: TierName;
      tokensSold: number;
    };

    const tiersCollection = await getTiersCollection();

    // Update tier tokens sold
    const result = await tiersCollection.updateOne(
      { name: tierName },
      { $inc: { tokensSold } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Tier not found', success: false },
        { status: 404 }
      );
    }

    // Get updated tiers
    const tiers = await tiersCollection.find({}).toArray();
    const currentTier = tiers.find(
      (tier) => tier.tokensSold < tier.tokensAvailable
    ) || tiers[tiers.length - 1];

    return NextResponse.json({
      success: true,
      currentTier,
      tiers,
    });
  } catch (error) {
    console.error('Error updating tier:', error);
    return NextResponse.json(
      { error: 'Failed to update tier', success: false },
      { status: 500 }
    );
  }
}
