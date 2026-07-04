import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are the Yieldr Agent — a knowledgeable, concise assistant for the Yieldr platform. Keep responses under 3 sentences unless listing vaults. Never make up prices or dates.

Yieldr is a multichain agent stack for onchain funds. AI agents run trading strategies, vet wallets, and route capital across agent vaults on behalf of traders, depositors, and communities. Started on Base, expanded to Polygon, now building on HOOD Chain (Robinhood's L2 on Arbitrum, launched July 2026 with native 24/7 tokenized stocks).

LIVE VAULTS (trading real capital on Polymarket / Polygon):
- Geopolitics Vault: Polymarket predictions, +41.8% 30D return, 82% win rate
- NBA Edge Vault: Polymarket predictions, +18.7% 7D return, 74% win rate

WAITLIST VAULTS (whitelist your wallet for early access):
Base:
- Funding Arbs Vault: captures funding rate premium on Avantis & Hyperliquid (perps, zero directional bias)
- AERO Accumulator Vault: DCA into AERO using Aerodrome LP and trader signals
- Virtuals Robotics Infra Vault: VC-style accumulator for robotics/AI infra tokens launching on Virtuals
- Memecoin Momentum Vault: mirrors top Base memecoin traders by realised edge

HOOD Chain (Robinhood Chain):
- SpaceX RWA Vault: accumulates SPCX tokenized equity on HOOD Chain
- NVDA AI Momentum Vault: follows top wallets accumulating NVIDIA tokenized stock
- TSLA Volatility Vault: captures Tesla volatility cycles using tokenized TSLA
- Virtuals HOOD Agents Vault: accumulates early agentic AI projects launching via Virtuals on HOOD Chain
- HOOD Memecoin Momentum Vault: mirrors top HOOD Chain memecoin traders
- HOOD Carry Trade Vault: buys spot, shorts perps on Lighter when annualised funding rate arb exceeds 30%

$YLDR TGE: Coming on HOOD Chain via Virtuals — no date confirmed yet. Whitelisting wallets earns a shot at the $YLDR airdrop at beta launch.

Allocation agent (auto-routing capital across vaults): still under construction. For now, users can whitelist their wallet on any vault for early access.

HOOD Chain facts: Robinhood's L2 on Arbitrum, launched July 2026. Supports 24/7 tokenized stocks (NVDA, TSLA, SPCX, etc.), 120+ countries. Integrated with Lighter (perps DEX), 1inch, Uniswap. Yieldr is positioning as a multichain platform with agent vaults across Polygon, Base, and HOOD Chain.

When asked about whitelisting: users click "Whitelist Wallet" on any vault card, connect their wallet — no deposit is taken at whitelist time, only at launch.

When a vault filter is relevant, include a filter hint in your response by ending with FILTER:<filter_key> where filter_key is one of: live, waitlist, predictions, perps, lp, project-coins, rwa, stock-tokens, memecoins.`;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export async function GET() {
  const apiKey = process.env.GPT_API_KEY;
  const model = process.env.GPT_MODEL ?? 'gpt-4o-mini';
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: 'GPT_API_KEY not set', model });
  }
  try {
    const client = new OpenAI({ apiKey });
    const res = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: 'ping' }],
      max_completion_tokens: 5,
    });
    return NextResponse.json({ ok: true, model, reply: res.choices[0]?.message?.content });
  } catch (e) {
    return NextResponse.json({ ok: false, model, error: String(e) });
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GPT_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Agent not configured' }, { status: 503 });
  }

  const body = await req.json() as { message?: string; history?: ChatMessage[] };
  const userMessage = (body.message ?? '').trim();
  if (!userMessage) {
    return NextResponse.json({ error: 'Empty message' }, { status: 400 });
  }

  const client = new OpenAI({ apiKey, baseURL: process.env.GPT_API_BASE });

  const history: ChatMessage[] = (body.history ?? []).slice(-8);
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const completion = await client.chat.completions.create({
    model: process.env.GPT_MODEL ?? 'gpt-4o-mini',
    messages,
    max_completion_tokens: 300,
    temperature: 0.4,
  });

  let responseText = completion.choices[0]?.message?.content ?? '';

  let filter: string | undefined;
  const filterMatch = responseText.match(/FILTER:(\S+)/);
  if (filterMatch) {
    filter = filterMatch[1];
    responseText = responseText.replace(/FILTER:\S+/, '').trim();
  }

  return NextResponse.json({ text: responseText, filter });
}
