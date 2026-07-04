import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TokenUsage from '@/models/TokenUsage';

export const dynamic = 'force-dynamic';

const FREE_TOKEN_LIMIT = 100_000;

function getIdentifier(req: NextRequest, wallet?: string): string {
  if (wallet) return wallet.toLowerCase();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown';
  return `ip:${ip}`;
}

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet') ?? undefined;
  const identifier = getIdentifier(req, wallet);

  try {
    await connectDB();

    const agg = await TokenUsage.aggregate([
      { $match: { walletAddress: identifier, endpoint: 'agent-chat' } },
      { $group: { _id: null, input: { $sum: '$inputTokens' }, output: { $sum: '$outputTokens' } } },
    ]);

    const input = agg[0]?.input ?? 0;
    const output = agg[0]?.output ?? 0;
    const tokensUsed = input + output;

    return NextResponse.json({ ok: true, tokensUsed, limit: FREE_TOKEN_LIMIT, remaining: Math.max(0, FREE_TOKEN_LIMIT - tokensUsed) });
  } catch (e) {
    console.error('[agent/tokens GET]', e);
    return NextResponse.json({ ok: true, tokensUsed: 0, limit: FREE_TOKEN_LIMIT, remaining: FREE_TOKEN_LIMIT });
  }
}
