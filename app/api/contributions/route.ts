// API Route: Record and Query Contributions
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Contribution } from '@/models/Contribution';
import { RaiseStats } from '@/models/RaiseStats';
import { calculateAllocation, getCurrentTier } from '@/lib/tierCalculations';
import { API_AUTH_KEY } from '@/config/payment';
import { createExclusiveInvite } from '@/lib/discord';

// Helper to verify API auth for internal calls
function verifyApiAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('x-api-key');
  return authHeader === API_AUTH_KEY;
}

export async function POST(req: NextRequest) {
  try {
    console.log('\n=== 💾 CONTRIBUTION API CALLED ===');

    await connectDB();
    console.log('✅ Database connection established');

    const body = await req.json();
    console.log('📥 Received payload:', JSON.stringify(body, null, 2));

    const {
      wallet_address,
      usdc_amount,
      tx_hash,
      network,
      chain_id,
    } = body;

    // Validate required fields
    console.log('🔍 Validating required fields...');
    console.log('  - wallet_address:', wallet_address ? '✅' : '❌');
    console.log('  - usdc_amount:', usdc_amount ? '✅' : '❌');
    console.log('  - tx_hash:', tx_hash ? '✅' : '❌');
    console.log('  - network:', network ? '✅' : '❌');
    console.log('  - chain_id:', chain_id ? '✅' : '❌');

    if (!wallet_address || !usdc_amount || !tx_hash || !network || !chain_id) {
      console.error('❌ Validation failed: Missing required fields');
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    console.log('✅ All required fields present');

    // Check for duplicate tx_hash
    console.log('🔍 Checking for duplicate transaction...');
    const existing = await Contribution.findOne({ tx_hash });
    if (existing) {
      console.error('❌ Duplicate transaction found:', tx_hash);
      return NextResponse.json(
        { success: false, error: 'Transaction already recorded' },
        { status: 409 }
      );
    }
    console.log('✅ Transaction is unique');

    // Get current raise stats
    console.log('📊 Fetching current raise stats...');
    let stats = await RaiseStats.findOne();
    if (!stats) {
      console.log('⚠️  No stats found, creating initial stats...');
      stats = await RaiseStats.create({
        total_raised_usdc: 0,
        total_yldr_allocated: 0,
        current_tier: 'Genesis',
        tier_raised_usdc: 0,
        tier_yldr_remaining: 1_500_000,
        contributor_count: 0,
      });
      console.log('✅ Initial stats created');
    } else {
      console.log('📊 Current stats:', {
        total_raised: stats.total_raised_usdc,
        current_tier: stats.current_tier,
        contributors: stats.contributor_count,
      });
    }

    // Calculate allocation based on current tier
    console.log('🧮 Calculating allocation for $', usdc_amount, 'USDC...');
    const allocation = calculateAllocation(usdc_amount, stats.total_raised_usdc);
    console.log('✅ Allocation calculated:', {
      yldrAmount: allocation.yldrAmount,
      effectivePrice: allocation.effectivePrice,
      tier: allocation.tier,
      fdv: allocation.fdv,
      breakdown: allocation.breakdown,
    });

    // Create contribution record
    console.log('💾 Creating contribution record in MongoDB...');
    const contributionData = {
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
    };
    console.log('📝 Contribution data:', JSON.stringify(contributionData, null, 2));

    const contribution = await Contribution.create(contributionData);
    console.log('✅ Contribution saved to MongoDB! ID:', contribution._id);

    // Generate Discord invite
    let discordInvite: string | null = null;
    try {
      console.log('🎫 Generating exclusive Discord invite...');
      discordInvite = await createExclusiveInvite();
      console.log('✅ Discord invite created:', discordInvite);

      // Save the invite to the contribution
      contribution.discord_invite = discordInvite;
      await contribution.save();
      console.log('✅ Discord invite saved to contribution');
    } catch (discordError) {
      console.error('⚠️  Failed to create Discord invite:', discordError);
      // Continue without Discord invite - don't fail the entire transaction
    }

    // Update raise stats
    const newTotalRaised = stats.total_raised_usdc + usdc_amount;
    const newTierInfo = getCurrentTier(newTotalRaised);

    console.log('🔍 Checking if user is a new contributor...');
    const existingContributor = await Contribution.findOne({
      wallet_address: wallet_address.toLowerCase(),
      _id: { $ne: contribution._id },
    });
    const isNewContributor = !existingContributor;
    console.log(isNewContributor ? '🎉 New contributor!' : '🔄 Returning contributor');

    console.log('📊 Updating raise stats...');
    const statsUpdate = {
      $inc: {
        total_raised_usdc: usdc_amount,
        total_yldr_allocated: allocation.yldrAmount,
        contributor_count: isNewContributor ? 1 : 0,
      },
      $set: {
        current_tier: newTierInfo.currentTier.name,
        tier_yldr_remaining: newTierInfo.tokensRemainingInTier,
        last_updated: new Date(),
      },
    };
    console.log('📝 Stats update:', JSON.stringify(statsUpdate, null, 2));

    await RaiseStats.updateOne({}, statsUpdate);
    console.log('✅ Raise stats updated successfully!');

    const responseData = {
      success: true,
      data: {
        contribution_id: contribution._id,
        yldr_allocation: allocation.yldrAmount,
        yldr_price: allocation.effectivePrice,
        tier: allocation.tier,
        fdv: allocation.fdv,
        breakdown: allocation.breakdown,
        discord_invite: discordInvite,
      },
    };

    console.log('✅ Contribution processed successfully!');
    console.log('📤 Response:', JSON.stringify(responseData, null, 2));
    console.log('=================================\n');

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('\n❌ ERROR RECORDING CONTRIBUTION ❌');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Full error:', error);
    console.error('=================================\n');
    return NextResponse.json(
      { success: false, error: 'Failed to record contribution', details: error?.message },
      { status: 500 }
    );
  }
}

// Get contributions for a wallet
export async function GET(req: NextRequest) {
  try {
    console.log('\n=== 🔍 GET CONTRIBUTIONS API CALLED ===');

    await connectDB();
    console.log('✅ Database connection established');

    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');
    console.log('📥 Requested wallet:', wallet);

    if (!wallet) {
      console.error('❌ No wallet address provided');
      return NextResponse.json(
        { success: false, error: 'Wallet address required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching contributions for wallet:', wallet.toLowerCase());
    const contributions = await Contribution.find({
      wallet_address: wallet.toLowerCase(),
      status: 'confirmed',
    }).sort({ created_at: -1 });

    console.log('✅ Found', contributions.length, 'contributions');

    const totalUsdc = contributions.reduce((sum, c) => sum + c.usdc_amount, 0);
    const totalYldr = contributions.reduce((sum, c) => sum + c.yldr_allocation, 0);
    const avgPrice = totalYldr > 0 ? totalUsdc / totalYldr : 0;

    // Get Discord invite from the most recent contribution (if available)
    const discordInvite = contributions[0]?.discord_invite || null;

    const responseData = {
      success: true,
      data: {
        contributions,
        summary: {
          totalUsdc,
          totalYldr,
          avgPrice,
          contributionCount: contributions.length,
        },
        discord_invite: discordInvite,
      },
    };

    console.log('📊 Summary:', {
      totalUsdc,
      totalYldr,
      avgPrice,
      count: contributions.length,
    });
    console.log('=================================\n');

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('\n❌ ERROR FETCHING CONTRIBUTIONS ❌');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error?.message);
    console.error('Full error:', error);
    console.error('=================================\n');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contributions', details: error?.message },
      { status: 500 }
    );
  }
}
