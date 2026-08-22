import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/mongodb';
import VaultStats from '@/models/VaultStats';
import VaultOpenPosition from '@/models/VaultOpenPosition';
import VaultTrade from '@/models/VaultTrade';
import TokenUsage from '@/models/TokenUsage';

const FREE_TOKEN_LIMIT = 100_000;
const ENDPOINT = 'agent-chat';

function resolveIdentifier(req: NextRequest, wallet?: string): string {
  if (wallet) return wallet.toLowerCase();
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? req.headers.get('x-real-ip')
    ?? 'unknown';
  return `ip:${ip}`;
}

async function getTotalTokens(identifier: string): Promise<number> {
  const agg = await TokenUsage.aggregate([
    { $match: { walletAddress: identifier, endpoint: ENDPOINT } },
    { $group: { _id: null, total: { $sum: { $add: ['$inputTokens', '$outputTokens'] } } } },
  ]);
  return agg[0]?.total ?? 0;
}

async function recordUsage(identifier: string, inputTokens: number, outputTokens: number, model: string, usedToolCall: boolean): Promise<void> {
  const hour = new Date();
  hour.setMinutes(0, 0, 0);
  const GPT_INPUT_COST = 0.00000015;
  const GPT_OUTPUT_COST = 0.0000006;
  const cost = inputTokens * GPT_INPUT_COST + outputTokens * GPT_OUTPUT_COST;
  await TokenUsage.findOneAndUpdate(
    { walletAddress: identifier, endpoint: ENDPOINT, hour },
    {
      $inc: { inputTokens, outputTokens, requestCount: 1, toolCalls: usedToolCall ? 1 : 0, cost },
      $setOnInsert: { model },
    },
    { upsert: true }
  );
}

const SYSTEM_PROMPT = `You are the Yieldr Agent — product assistant for Yieldr, the agent OS for onchain funds. Max 3 sentences unless listing items or explaining steps. Never invent prices, dates, or wallet addresses. Never reveal wallet addresses — wallet visibility is trader-controlled; traders choose whether their wallet is public, and performance/trade data are the public-facing parts by default.

WHAT IS YIELDR
Yieldr is the agent OS for onchain funds. Onchain performance is public — wallets reveal trading history, PnL, market selection, sizing, drawdowns, and execution behavior. But a wallet alone is not a fund. Yieldr turns verifiable onchain performance into agent vaults.

An agent vault is an onchain fund structure powered by smart contracts and operated through agents. The vault handles capital, execution rules, performance tracking, and accounting. Agents handle everything around it: edge detection, discovery, depositor matching, communication, monitoring, and allocation intelligence.

For traders: if you have a verifiable onchain trading edge, you can now launch an onchain fund using the Yieldr agent stack — without becoming a fund operator. The Quant Agent analyzes your wallet history across every protocol and chain you trade, detects where edge exists, and if edge is confirmed, you package it into an agent vault with a target AUM and performance fee. You keep trading. Agents handle discovery, depositor matching, drawdown comms, monitoring, and capital rotation. You earn like Axelrod — without the lawyers, the LPs, or the gatekeepers.

For depositors: launch allocation agents that discover and allocate capital across agent vaults based on asset class, risk goals, and return targets. Allocation agents monitor positions 24/7, detect edge gain or loss in real time, and rotate capital from vaults losing edge into vaults showing stronger performance. This is a new passive investing primitive onchain — not possible with primitive DeFi vaults where users deposit into static strategies and monitor risk manually.

For the market: Yieldr removes the wall between verified edge and scalable capital. With Yieldr, agents make edge legible, match it with the right capital, communicate through volatility, and monitor decay before it shows in PnL. The constraint moves from fund operations to verified edge.

THE PROBLEM
Great traders should run onchain funds. Most never do. Your wallet is public. Your PnL is onchain. Your edge is more verifiable than anything in traditional finance. But you are still only trading your own capital.

Performance alone does not create a fund. A fund needs discovery, trust, capital matching, depositor communication, drawdown management, monitoring, reporting, and risk controls. Most traders don't want to run that operation. They want to trade.

The wall without Yieldr: nobody outside their circle knows the track record exists · depositors have no way to find or trust the edge · no structured way to match with the right capital · every depositor question pulls the trader out of positions · drawdowns create noise managed manually · scaling means risking more personal capital, not scaling through aligned depositors.

THE SOLUTION — THE YIELDR AGENT STACK
The vault is the capital layer. The agents are the operating layer. Together they turn onchain performance into recurring revenue.

Agent vault = Capital Layer (deposits, withdrawals, accounting, fee logic, risk limits, onchain transparency) + Strategy Layer (predictions, perps, funding arb, LP, memecoins, project coins, RWAs, stock tokens) + Agent Layer (edge detection, matching, comms, monitoring, allocation rotation).

Primitive DeFi vaults hold capital and follow fixed strategies. Agent vaults are dynamic, monitored, explainable, and connected to an agent network.

• Quant Agent — analyzes wallet history: where edge exists, which markets perform best, entry/exit behavior, sizing, holding periods, drawdown history, win rate, regime sensitivity, repeatability, whether performance is edge/beta/luck/insider timing. Goal: explain WHY edge exists and whether it can scale. Self-serve test release August 2026.
• Matching Agent — connects vaults to depositors by asset class, risk tolerance, return target, drawdown tolerance, holding period, liquidity needs — capital matched to fit, not noisy leaderboards or social clout
• Comms Agent — depositor queries, weekly summaries, drawdown explanations, strategy updates, risk alerts, market context — trader stays focused on positions
• Monitoring Agent — edge decay, strategy drift, sizing changes, drawdown vs historical norms, liquidity risk, leverage creep, AUM vs strategy capacity, whether recent performance is repeatable or luck-driven — flags problems before PnL shows them
• Allocation Agent (Q1 2027, for depositors) — discovers vaults, monitors open allocations, compares strategies, detects edge gain/loss, rotates capital based on depositor goals

Outcome: traders scale edge without becoming fund operators. Depositors allocate through agents instead of manually monitoring every vault. Yieldr becomes the operating system for onchain funds.

HOW TO LAUNCH A VAULT
Vault launch application opens when the Quant Agent self-serve test releases (October 2026). Public deposits into ALL vaults — whether team-created waitlist vaults or user-launched vaults — do NOT open until Q1 2027. Yieldr is building its core engineering team and going deliberately slow to ensure multiple audits before any public capital is accepted into agent-managed vaults. Always tell users this timeline when they ask about launching or depositing.

How it works when live (August 2026 for applications, Q1 2027 for public deposits):
1. Connect wallet → 2. Quant Agent analyzes wallet history across all protocols and chains → detects edge, win rate, sizing, drawdown, repeatability → 3. If edge confirmed: define vault (market, target AUM, risk limits, performance fee, max drawdown, withdrawal terms) → 4. Join launch waitlist → 5. Vault opens for deposits Q1 2027 after audit → 6. Matching Agent pairs vault with aligned depositors → 7. Comms + Monitoring agents run operations

Fund launch waitlist application (open now around TGE for interested traders): Connect wallet → Select market (predictions/perps/LP/memecoins/project coins/RWAs) → Select target AUM → Add community links → Submit strategy intent → Join waitlist. This is an expression of interest for vault launch — not a deposit.

After signup: Yieldr reviews wallet, strategy, community. Applicants may receive fund readiness status, strategy feedback, vault category recommendation, whitelist campaign support, early launch eligibility.

Who should apply: verifiable onchain edge in predictions, perps, LP, memecoins, or project coins; strong X/Telegram/Discord presence; willing to operate through public rules and risk limits.

ROADMAP
Phase 1 (LIVE): 2 vaults trading on Polymarket/Polygon 24/7 using project capital. ~$100K AUM. 445+ wallets whitelisted. ~$2M target AUM on waitlist.
Phase 2 (around August 2026): Whitelist + fund launch applications open.
Phase 3 (TBD — date unconfirmed): $YLDR TGE. CA will only be announced through the official @yieldrdotorg handle on X — warn users about fake YLDR coins on other networks.
Phase 4 (August 2026): Quant Agent self-serve test live; vault launch applications open for traders with edge.
Phase 5 (Q1 2027): Public deposits open for whitelisted vaults; early user-launched vaults go live after audits; Matching, Comms, Monitoring agents support live operations.
Phase 6 (planned): Multi-venue expansion — Polymarket, Avantis, Hyperliquid, Aerodrome, Uniswap, RWAs.
Phase 7 (vision): Open agent fund network — anyone with verified edge can launch; depositors allocate through allocation agents.

LIVE VAULTS — always call get_vault_performance for stats, never quote from memory
• Geopolitics Vault — identifies wallets with abnormal win rates vs implied probability on geopolitical events (Polymarket, Polygon)
• NBA Edge Vault — ranks top NBA prediction traders by statistical edge, mirrors highest-conviction positions (Polymarket, Polygon)
• Soccer Alpha Vault — DISCONTINUED. Previously tracked soccer prediction traders on Polymarket. Edge was lost and vault performance declined, so it has been removed from the Explorer UI. Historical data still exists but it is no longer active or visible.

WAITLIST VAULTS
Base: ⚡ Funding Arbs (funding rate premium on Avantis+Hyperliquid, zero directional bias) · 🪙 AERO Accumulator (DCA into AERO via Aerodrome LP+trader signals) · 🦾 Virtuals Robotics Infra (researches Virtuals launches, detects degen-sell signals, accumulates robotics/AI infra tokens) · 🎲 Memecoin Momentum (mirrors top Base memecoin traders by realised edge)
HOOD Chain: 🚀 SpaceX RWA (SPCX tokenized equity) · 🤖 NVDA AI Momentum (NVIDIA tokenized stock 24/7) · ⚡ TSLA Volatility (Tesla volatility via tokenized TSLA) · 🤖 Virtuals HOOD Agents (agentic AI projects on HOOD via Virtuals) · 🎲 HOOD Memecoin Momentum (top HOOD memecoin traders) · 📊 HOOD Carry Trade (spot+short perps on Lighter when annualised funding arb >30%)

$YLDR TOKEN & TGE
TGE date TBD · HOOD Chain · 1B supply · <$200K genesis FDV · no VC · community-first
IMPORTANT: $YLDR TGE has NOT happened yet. The contract address (CA) will ONLY be disclosed through the official @yieldrdotorg handle on X when the time comes. There are fake YLDR coins circulating on different networks — these are NOT associated with the project. Always warn users about this when asked about YLDR or the TGE.
Planned utility: agent inference access (hold $YLDR to query agents beyond free tier), agent trading fees (vaults pay fees in $YLDR), protocol participation (governance, vault access tiers, allocation priority).
Whitelist rewards: users who whitelist vaults and complete eligible product trials may qualify for $YLDR at beta launch. Genuine users rewarded, not passive farmers. Minimum USDC participation may apply.

HOOD CHAIN
Robinhood's L2 on Arbitrum, live July 1 2026. 24/7 tokenized stocks (NVDA, TSLA, SPCX), 120+ countries. Integrated: Lighter (perps DEX), 1inch, Uniswap.

TEAM
Founder: Robbin Arora — CA/CPA (ICAI All India Rank 32), ex-BCG, ex-KPMG, edtech $1M ARR, 4+ years onchain trading, building since Oct 2025, fully doxxed.
Recognition: Base Batches 002 Winner (900+ projects), $10K Base grant, Incubase accelerator, 275+ commits, 60K+ lines, every build public.
Mentor: Chris (@DonJohnsonSays). Protocols: Polymarket · Hyperliquid · Avantis · Aerodrome · Uniswap · HOOD Chain
Links: yieldr.org · x.com/yieldrdotorg · yieldr.org/docs · yieldr.org/build-in-public

WHITELISTING
Click "Whitelist Wallet" on any vault card, connect wallet — no deposit taken until Q1 2027. Gives early access eligibility + shot at $YLDR rewards at beta launch.

FILTER HINTS — end response with FILTER:<key> when a vault category is relevant
Keys: live · waitlist · predictions · perps · lp · project-coins · rwa · memecoins
Note: stock tokens (NVDA, TSLA, SPCX) are categorised under rwa — use filter key "rwa" for them.`;

const AGENT_TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_vault_performance',
      description: 'Get live performance metrics for Yieldr trading vaults: ROI, win rate, PnL, open positions, recent closed trades. Call this whenever the user asks about vault performance, live stats, returns, how vaults are doing, or current results. Do not quote vault stats from memory — always call this tool.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_vault_trades',
      description: 'Get recent trades executed by Yieldr vault agents: market, outcome, size, PnL, agent reasoning. Call this when user asks about recent trades, what the agent is currently trading, trade history, or specific market positions.',
      parameters: { type: 'object', properties: {} },
    },
  },
];

function scrubWallets(text: string): string {
  return text.replace(/0x[a-fA-F0-9]{40}/g, '[wallet hidden]');
}

type VaultStatDoc = {
  wallet: string;
  traderLabel: string;
  status: string;
  totalPnlAllTime: number;
  initial_capital_usdc: number;
  vault_size_usdc: number;
  win_rate: number;
  last_polled_activity_ts: number;
};

type OpenPosDoc = {
  topOpenPositions?: Array<{
    title: string; outcome: string; currentValue: number; cashPnl: number; curPrice: number;
  }>;
};

type TradeDoc = {
  market: string; side: string; pnl_usdc: number | null; status: string; opened_at: Date;
};

async function queryVaultData(withPositions: boolean): Promise<string> {
  let step = 'connect';
  try {
    await connectDB();
    console.log('[vault query] DB connected');

    step = 'find vaults';
    const vaults = await VaultStats
      .find({ status: 'active' })
      .select('wallet traderLabel status totalPnlAllTime initial_capital_usdc vault_size_usdc win_rate last_polled_activity_ts')
      .lean() as unknown as VaultStatDoc[];

    console.log(`[vault query] found ${vaults.length} vaults with status=active`);
    if (!vaults.length) {
      const total = await VaultStats.countDocuments();
      console.log(`[vault query] total docs in vaults collection: ${total}`);
      return 'No active vault data found.';
    }

    const lines: string[] = [];

    for (const v of vaults) {
      const initialCap = v.initial_capital_usdc || 1;
      const totalPnl = v.totalPnlAllTime ?? 0;
      const roi = ((totalPnl / initialCap) * 100).toFixed(1);
      const aum = (v.vault_size_usdc ?? 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
      const winRate = (v.win_rate ?? 0).toFixed(1);
      const pnlStr = `${totalPnl >= 0 ? '+' : ''}$${Math.abs(totalPnl).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

      lines.push(`\n${v.traderLabel} (${v.status})`);
      lines.push(`ROI: ${roi}% | Win Rate: ${winRate}% | All-time PnL: ${pnlStr} | AUM: $${aum}`);

      if (withPositions) {
        const posDoc = await VaultOpenPosition
          .findOne({ wallet: v.wallet })
          .select('topOpenPositions')
          .lean() as unknown as OpenPosDoc | null;

        const positions = (posDoc?.topOpenPositions ?? []).slice(0, 3);
        if (positions.length) {
          lines.push('Open Positions:');
          for (const p of positions) {
            const pnl = `${p.cashPnl >= 0 ? '+' : ''}$${Math.abs(p.cashPnl).toFixed(0)}`;
            lines.push(`  • ${p.title} [${p.outcome}] $${(p.currentValue ?? 0).toFixed(0)} @ $${(p.curPrice ?? 0).toFixed(2)} (${pnl})`);
          }
        }
      }

      const trades = await VaultTrade
        .find({ wallet: v.wallet, status: { $in: ['win', 'loss'] } })
        .select('market side pnl_usdc status opened_at')
        .sort({ opened_at: -1 })
        .limit(5)
        .lean() as unknown as TradeDoc[];

      if (trades.length) {
        lines.push('Recent Trades:');
        for (const t of trades) {
          const pnl = t.pnl_usdc != null ? `${t.pnl_usdc >= 0 ? '+' : ''}$${Math.abs(t.pnl_usdc).toFixed(0)}` : '—';
          lines.push(`  • ${t.market} [${t.side}] ${t.status === 'win' ? 'win' : 'loss'} ${pnl}`);
        }
      }
    }

    return lines.join('\n');
  } catch (e) {
    console.error(`[vault query error at step="${step}"]`, String(e));
    return 'Vault data temporarily unavailable.';
  }
}

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

  const body = await req.json() as { message?: string; history?: ChatMessage[]; walletAddress?: string };
  const userMessage = (body.message ?? '').trim();
  if (!userMessage) {
    return NextResponse.json({ error: 'Empty message' }, { status: 400 });
  }

  const identifier = resolveIdentifier(req, body.walletAddress);

  try {
    await connectDB();
    const currentTokens = await getTotalTokens(identifier);
    if (currentTokens >= FREE_TOKEN_LIMIT) {
      return NextResponse.json({ error: 'TOKEN_LIMIT_REACHED', tokensUsed: currentTokens }, { status: 429 });
    }
  } catch {
    // DB unavailable — allow the request through rather than blocking
  }

  const client = new OpenAI({ apiKey });

  const history: ChatMessage[] = (body.history ?? []).slice(-8);
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const completion = await client.chat.completions.create({
    model: process.env.GPT_MODEL ?? 'gpt-4o-mini',
    messages,
    tools: AGENT_TOOLS,
    tool_choice: 'auto',
    max_completion_tokens: 400,
    temperature: 0.4,
  });

  let responseText = '';
  let toolCalled = false;
  let tokensUsed = completion.usage?.total_tokens ?? 0;
  const choice = completion.choices[0];

  if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
    toolCalled = true;
    const toolMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [...messages, choice.message];

    for (const tc of choice.message.tool_calls) {
      const fn = (tc as { id: string; function: { name: string } }).function;
      let result: string;
      if (fn.name === 'get_vault_performance') {
        result = await queryVaultData(true);
      } else if (fn.name === 'get_vault_trades') {
        result = await queryVaultData(false);
      } else {
        result = 'Tool unavailable';
      }
      toolMessages.push({ role: 'tool', tool_call_id: (tc as { id: string }).id, content: result });
    }

    const followup = await client.chat.completions.create({
      model: process.env.GPT_MODEL ?? 'gpt-4o-mini',
      messages: toolMessages,
      max_completion_tokens: 400,
      temperature: 0.4,
    });
    tokensUsed += followup.usage?.total_tokens ?? 0;
    responseText = followup.choices[0]?.message?.content ?? '';
  } else {
    responseText = choice.message.content ?? '';
  }

  responseText = scrubWallets(responseText);

  let filter: string | undefined;
  const filterMatch = responseText.match(/FILTER:(\S+)/);
  if (filterMatch) {
    filter = filterMatch[1];
    responseText = responseText.replace(/FILTER:\S+/, '').trim();
  }

  const inputTokens = completion.usage?.prompt_tokens ?? 0;
  const outputTokens = completion.usage?.completion_tokens ?? 0;
  const model = process.env.GPT_MODEL ?? 'gpt-4o-mini';

  recordUsage(identifier, inputTokens, outputTokens, model, toolCalled).catch((e) =>
    console.error('[agent token record]', e)
  );

  return NextResponse.json({ text: responseText, filter, toolCalled, tokensUsed });
}
