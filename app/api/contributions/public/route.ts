// API Route: Get Public Contributions (Last 100)

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Contribution } from '@/models/Contribution';

export async function GET() {
  try {
    console.log('\n=== 📊 GET PUBLIC CONTRIBUTIONS ===');

    await connectDB();
    console.log('✅ Database connection established');

    console.log('🔍 Fetching last 100 confirmed contributions...');
    const contributions = await Contribution.find({
      status: 'confirmed',
    })
      .sort({ created_at: -1 })
      .limit(100)
      .select('wallet_address usdc_amount yldr_allocation yldr_price allocation_tier fdv_at_purchase tx_hash created_at');

    console.log(`✅ Found ${contributions.length} public contributions`);

    const totalUsdc = contributions.reduce((sum, c) => sum + c.usdc_amount, 0);
    const totalYldr = contributions.reduce((sum, c) => sum + c.yldr_allocation, 0);

    const responseData = {
      success: true,
      data: {
        contributions,
        summary: {
          totalUsdc,
          totalYldr,
          contributionCount: contributions.length,
        },
      },
    };

    console.log('📊 Public Summary:', {
      totalUsdc,
      totalYldr,
      count: contributions.length,
    });
    console.log('=================================\n');

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('\n❌ ERROR FETCHING PUBLIC CONTRIBUTIONS ❌');
    console.error('Error type:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    console.error('=================================\n');
    return NextResponse.json(
      { success: false, error: 'Failed to fetch public contributions', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
