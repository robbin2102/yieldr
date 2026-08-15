import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SiteStats } from '@/models/SiteStats';
import { Subscription } from '@/models/Subscription';

export const dynamic = 'force-dynamic';

const DEFAULTS = {
  demoPreviewsRun: 4812,
  genesisMembers: 347,
  genesisSlotsTotal: 1000,
  prelaunchArr: 38200,
};

export async function GET() {
  try {
    await connectDB();

    let stats = await SiteStats.findOne({ key: 'main' });
    if (!stats) {
      stats = await SiteStats.create({ key: 'main' });
    }

    const [genesisMembersReal, arrAgg] = await Promise.all([
      Subscription.distinct('wallet_address', { status: 'confirmed' }),
      Subscription.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$usdc_amount' } } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        demoPreviewsRun: stats.demo_previews_baseline + stats.demo_previews_count,
        genesisMembers: stats.genesis_members_baseline + genesisMembersReal.length,
        genesisSlotsTotal: stats.genesis_slots_total,
        prelaunchArr: stats.prelaunch_arr_baseline + (arrAgg[0]?.total ?? 0),
      },
    });
  } catch (error) {
    console.error('Error fetching site stats:', error);
    return NextResponse.json({ success: false, data: DEFAULTS }, { status: 200 });
  }
}
