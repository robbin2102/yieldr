// API route to handle YLDR token contributions
import { NextResponse } from 'next/server';
import { getContributionsCollection, getTiersCollection } from '@/lib/db/mongodb';
import { Contribution, TierName } from '@/lib/types/contribution';

// GET all contributions or by wallet address
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');

    const contributionsCollection = await getContributionsCollection();

    if (walletAddress) {
      // Get contributions for specific wallet
      const contributions = await contributionsCollection
        .find({ walletAddress: walletAddress.toLowerCase() })
        .sort({ timestamp: -1 })
        .toArray();

      const totalYLDR = contributions.reduce(
        (sum, c) => sum + c.yldrAllocated,
        0
      );
      const totalUSDC = contributions.reduce((sum, c) => sum + c.usdcAmount, 0);

      return NextResponse.json({
        success: true,
        contributions,
        totalYLDR,
        totalUSDC,
      });
    }

    // Get all contributions (admin view)
    const contributions = await contributionsCollection
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      contributions,
      total: contributions.length,
    });
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contributions', success: false },
      { status: 500 }
    );
  }
}

// POST new contribution
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      usdcAmount,
      txHash,
    }: {
      walletAddress: string;
      usdcAmount: number;
      txHash: string;
    } = body;

    // Validate inputs
    if (!walletAddress || !usdcAmount || !txHash) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Get current tier
    const tiersCollection = await getTiersCollection();
    const tiers = await tiersCollection.find({}).toArray();
    const currentTier = tiers.find(
      (tier) => tier.tokensSold < tier.tokensAvailable
    );

    if (!currentTier) {
      return NextResponse.json(
        { error: 'All tiers sold out', success: false },
        { status: 400 }
      );
    }

    // Calculate YLDR allocation
    const yldrAmount = usdcAmount / currentTier.pricePerToken;
    const remainingInTier =
      currentTier.tokensAvailable - currentTier.tokensSold;

    if (yldrAmount > remainingInTier) {
      return NextResponse.json(
        {
          error: `Only ${remainingInTier.toFixed(2)} YLDR remaining in ${currentTier.name} tier`,
          success: false,
        },
        { status: 400 }
      );
    }

    // Create contribution record
    const contribution: Contribution = {
      walletAddress: walletAddress.toLowerCase(),
      usdcAmount,
      yldrAllocated: yldrAmount,
      tierAtPurchase: currentTier.name as TierName,
      pricePerToken: currentTier.pricePerToken,
      timestamp: new Date(),
      txHash,
      status: 'confirmed',
    };

    const contributionsCollection = await getContributionsCollection();
    const result = await contributionsCollection.insertOne(contribution);

    // Update tier tokens sold
    await tiersCollection.updateOne(
      { name: currentTier.name },
      { $inc: { tokensSold: yldrAmount } }
    );

    // Get updated tier info
    const updatedTiers = await tiersCollection.find({}).toArray();
    const newCurrentTier = updatedTiers.find(
      (tier) => tier.tokensSold < tier.tokensAvailable
    ) || updatedTiers[updatedTiers.length - 1];

    return NextResponse.json({
      success: true,
      contribution: { ...contribution, _id: result.insertedId },
      currentTier: newCurrentTier,
      message: `Successfully allocated ${yldrAmount.toFixed(2)} YLDR at ${currentTier.name} tier price`,
    });
  } catch (error) {
    console.error('Error creating contribution:', error);
    return NextResponse.json(
      { error: 'Failed to create contribution', success: false },
      { status: 500 }
    );
  }
}
