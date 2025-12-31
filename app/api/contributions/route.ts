// API Route: Record and Query Contributions
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Contribution } from '@/models/Contribution';
import { RaiseStats } from '@/models/RaiseStats';
import { calculateAllocation, getCurrentTier } from '@/lib/tierCalculations';
import { API_AUTH_KEY } from '@/config/payment';

// Helper to verify API auth for internal calls
function verifyApiAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('x-api-key');
  return authHeader === API_AUTH_KEY;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      wallet_address,
      usdc_amount,
      tx_hash,
      network,
      chain_id,
    } = body;

    // Validate required fields
    if (!wallet_address || !usdc_amount || !tx_hash || !network || !chain_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for duplicate tx_hash
    const existing = await Contribution.findOne({ tx_hash });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Transaction already recorded' },
        { status: 409 }
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

    // Calculate allocation based on current tier
    const allocation = calculateAllocation(usdc_amount, stats.total_raised_usdc);

    // Create contribution record
    const contribution = await Contribution.create({
      wallet_address: wallet_address.toLowerCase(),
      usdc_amount,
      yldr_allocation: allocation.yldrAmount,
      yldr_price: allocation.effectivePrice,
      allocation_tier: allocation.tier,
      fdv_at_purchase: allocation.fdv,
      tx_hash,
      network,
      chain_id,
      status: 'confirmed',
      created_at: new Date(),
      confirmed_at: new Date(),
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
      user_agent: req.headers.get('user-agent'),
    });

    // Update raise stats
    const newTotalRaised = stats.total_raised_usdc + usdc_amount;
    const newTierInfo = getCurrentTier(newTotalRaised);

    // Check if this is a new contributor
    const existingContributor = await Contribution.findOne({
      wallet_address: wallet_address.toLowerCase(),
      _id: { $ne: contribution._id },
    });

    await RaiseStats.updateOne(
      {},
      {
        $inc: {
          total_raised_usdc: usdc_amount,
          total_yldr_allocated: allocation.yldrAmount,
          contributor_count: existingContributor ? 0 : 1,
        },
        $set: {
          current_tier: newTierInfo.currentTier.name,
          tier_yldr_remaining: newTierInfo.tokensRemainingInTier,
          last_updated: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        contribution_id: contribution._id,
        yldr_allocation: allocation.yldrAmount,
        yldr_price: allocation.effectivePrice,
        tier: allocation.tier,
        fdv: allocation.fdv,
        breakdown: allocation.breakdown,
      },
    });
  } catch (error) {
    console.error('Error recording contribution:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record contribution' },
      { status: 500 }
    );
  }
}

// Get contributions for a wallet
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { success: false, error: 'Wallet address required' },
        { status: 400 }
      );
    }

    const contributions = await Contribution.find({
      wallet_address: wallet.toLowerCase(),
      status: 'confirmed',
    }).sort({ created_at: -1 });

    const totalUsdc = contributions.reduce((sum, c) => sum + c.usdc_amount, 0);
    const totalYldr = contributions.reduce((sum, c) => sum + c.yldr_allocation, 0);

    return NextResponse.json({
      success: true,
      data: {
        contributions,
        summary: {
          totalUsdc,
          totalYldr,
          contributionCount: contributions.length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contributions' },
      { status: 500 }
    );
  }
}
