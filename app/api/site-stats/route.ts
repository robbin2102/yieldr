import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SiteStats } from '@/models/SiteStats';
import { Subscription } from '@/models/Subscription';
import { PLAN_PRICES, MONTHS_PER_YEAR, type PlanName, type BillingCycle } from '@/config/plans';

export const dynamic = 'force-dynamic';

// No baseline padding — every number here is the true actual count from
// Mongo. This fallback only fires if the DB itself is unreachable, so it's
// zeroed rather than a marketing number that could be mistaken for real data.
const DEFAULTS = {
  demoPreviewsRun: 0,
  genesisMembers: 0,
  genesisSlotsTotal: 1000,
  prelaunchArr: 0,
};

export async function GET() {
  try {
    await connectDB();

    let stats = await SiteStats.findOne({ key: 'main' });
    if (!stats) {
      stats = await SiteStats.create({ key: 'main' });
    }

    // ARR = sum of each wallet's CURRENT active plan's monthly rate x 12 —
    // not a sum of past usdc_amount payments, which are one-time Genesis
    // charges (and for upgrades, only the price differential) rather than a
    // recurring rate. One row per wallet (its most recent confirmed
    // subscription) gives the plan/cycle actually driving future billing.
    const latestPerWallet = await Subscription.aggregate([
      { $match: { status: 'confirmed' } },
      { $sort: { created_at: -1 } },
      {
        $group: {
          _id: '$wallet_address',
          plan_name: { $first: '$plan_name' },
          billing_cycle: { $first: '$billing_cycle' },
        },
      },
    ]);

    const prelaunchArr = latestPerWallet.reduce((sum, s) => {
      const plan = PLAN_PRICES[s.plan_name as PlanName];
      if (!plan) return sum;
      const monthlyRate = (s.billing_cycle as BillingCycle) === 'annual' ? plan.annual : plan.monthly;
      return sum + monthlyRate * MONTHS_PER_YEAR;
    }, 0);

    return NextResponse.json({
      success: true,
      data: {
        demoPreviewsRun: stats.demo_previews_count,
        genesisMembers: latestPerWallet.length,
        genesisSlotsTotal: stats.genesis_slots_total,
        prelaunchArr,
      },
    });
  } catch (error) {
    console.error('Error fetching site stats:', error);
    return NextResponse.json({ success: false, data: DEFAULTS }, { status: 200 });
  }
}
