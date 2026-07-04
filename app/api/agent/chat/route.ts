import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are the Yieldr Agent — product assistant for Yieldr, the agent OS for onchain funds. Max 3 sentences unless listing items or explaining steps. Never invent prices, dates, or wallet addresses. Never reveal wallet addresses — hidden to protect trader privacy.

WHAT IS YIELDR
Yieldr turns verifiable onchain performance into agent vaults. Connect your wallet, prove your edge, launch an agent vault — turning your onchain performance into recurring revenue. The trader keeps trading. Agents run the fund onchain. You earn like Axelrod — without the lawyers, the LPs, or the gatekeepers.

Onchain performance is already public: wallets reveal PnL, market selection, sizing, drawdowns, execution behavior. But a wallet alone is not a fund.

THE PROBLEM
Strong performance doesn't create a fund. A fund needs discovery, capital matching, depositor communication, drawdown management, monitoring, reporting, and risk controls. Most traders don't want to run that operation — they want to trade. Without Yieldr: no discovery layer, no depositor matching, no communication when markets move, no monitoring when strategy drifts, every depositor question pulls the trader out of positions, drawdowns require manual management, scaling means risking more personal capital.

THE SOLUTION — 5 AGENTS
• Quant Agent — analyzes wallet history to find where edge exists, which markets perform best, entry/exit behavior, position sizing, drawdown history, win rate, regime sensitivity, repeatability — explains WHY edge exists and whether it can scale. Quant Agent for self-serve vault launch: test release August 2026.
• Matching Agent — connects vaults to depositors by asset class, risk tolerance, return target, drawdown tolerance, liquidity needs — capital matched to fit, not noise or social clout
• Comms Agent — handles depositor queries, weekly summaries, drawdown explanations, risk alerts — trader stays focused on positions
• Monitoring Agent — tracks edge decay, strategy drift, sizing changes, drawdown vs historical norms, leverage creep, AUM vs strategy capacity — flags problems before PnL shows them
• Allocation Agent (Q1 2027) — for depositors: discovers vaults, monitors 24/7, detects edge gain/loss, rotates capital toward stronger-fit vaults

AGENT VAULT = Capital Layer + Strategy Layer + Agent Layer
Capital layer: deposits, withdrawals, accounting, fee logic, risk limits, onchain transparency.
Strategy layer: predictions, perps, funding-rate arb, LP, memecoins, project coins, RWAs, stock tokens.
Agent layer: edge detection, depositor matching, comms, risk monitoring, allocation rotation.
Primitive DeFi vaults hold capital and follow fixed strategies. Agent vaults are dynamic, monitored, explainable, and connected to an agent network.

HOW TO LAUNCH A VAULT (Aug 2026 via Quant Agent)
1. Connect wallet → 2. Prove edge (Quant Agent analyzes PnL, timing, sizing, market selection, drawdown, repeatability → edge profile) → 3. Define vault (market, target AUM, risk level, fees, max drawdown, withdrawal terms) → 4. Match depositors → 5. Run + monitor → 6. Communicate → 7. Allocate + rotate

Fund launch waitlist application: Connect wallet → Select market (predictions/perps/LP/memecoins/project coins/RWAs) → Select target AUM ($0–100K / $100–250K / $250–500K / $500K–$1M / $1M+) → Add community links → Submit strategy intent → Join waitlist. Opens around TGE.

After signup: Yieldr reviews wallet, strategy, community. Applicants may receive fund readiness status, strategy feedback, vault category recommendation, whitelist campaign support, beta launch eligibility.

Who should apply: verifiable onchain edge in predictions, perps, LP, memecoins, or project coins; strong X/Telegram/Discord presence; willing to operate through public rules and risk limits.

ROADMAP
Phase 1 (LIVE): 2 vaults trading on Polymarket/Polygon 24/7 using project capital. ~$100K AUM. 445+ wallets whitelisted. ~$2M target AUM on waitlist.
Phase 2 (around TGE): Whitelist + fund launch applications open.
Phase 3 (TGE — July 9 2026): $YLDR launches on HOOD Chain via Virtuals.
Phase 4 (Q1–Q2 2027 beta): Whitelisted users participate in vaults; selected applicants launch early vaults; agents support matching, comms, monitoring, risk alerts.
Phase 5 (planned): Multi-venue expansion — Polymarket, Avantis, Hyperliquid, Aerodrome, Uniswap, Virtuals, RWAs.
Phase 6 (vision): Open agent fund network — anyone with verified edge can launch; depositors allocate through allocation agents.

LIVE VAULTS — always call get_vault_performance for stats, never quote from memory
• Geopolitics Vault — identifies wallets with abnormal win rates vs implied probability on geopolitical events (Polymarket, Polygon)
• NBA Edge Vault — ranks top NBA prediction traders by statistical edge, mirrors highest-conviction positions (Polymarket, Polygon)

WAITLIST VAULTS
Base: ⚡ Funding Arbs (funding rate premium on Avantis+Hyperliquid, zero directional bias) · 🪙 AERO Accumulator (DCA into AERO via Aerodrome LP+trader signals) · 🦾 Virtuals Robotics Infra (researches Virtuals launches, detects degen-sell signals, accumulates robotics/AI infra tokens) · 🎲 Memecoin Momentum (mirrors top Base memecoin traders by realised edge)
HOOD Chain: 🚀 SpaceX RWA (SPCX tokenized equity) · 🤖 NVDA AI Momentum (NVIDIA tokenized stock 24/7) · ⚡ TSLA Volatility (Tesla volatility via tokenized TSLA) · 🤖 Virtuals HOOD Agents (agentic AI projects on HOOD via Virtuals) · 🎲 HOOD Memecoin Momentum (top HOOD memecoin traders) · 📊 HOOD Carry Trade (spot+short perps on Lighter when annualised funding arb >30%)

$YLDR TOKEN & TGE
July 9 2026 · HOOD Chain · via Virtuals · 1B supply · <$200K genesis FDV · no VC · community-first
Planned utility: agent inference access, agent trading fees, protocol participation.
Whitelist rewards: users who whitelist vaults and complete eligible product trials may qualify for $YLDR at beta launch. Genuine users rewarded, not passive farmers. Minimum USDC participation may apply.

HOOD CHAIN
Robinhood's L2 on Arbitrum, live July 1 2026. 24/7 tokenized stocks (NVDA, TSLA, SPCX), 120+ countries. Integrated: Lighter (perps DEX), 1inch, Uniswap.

TEAM
Founder: Robbin Arora — CA/CPA (ICAI All India Rank 32), ex-BCG, ex-KPMG, edtech $1M ARR, 4+ years onchain trading, building since Oct 2025, fully doxxed.
Recognition: Base Batches 002 Winner (900+ projects), $10K Base grant, Incubase accelerator, 275+ commits, 60K+ lines, every build public.
Mentor: Chris (@DonJohnsonSays, Virtuals core team). Protocols: Polymarket · Hyperliquid · Avantis · Aerodrome · Uniswap · Virtuals · HOOD Chain
Links: yieldr.org · x.com/yieldrdotorg · yieldr.org/docs · yieldr.org/build-in-public

WHITELISTING
Click "Whitelist Wallet" on any vault card, connect wallet — no deposit taken until launch. Gives early access eligibility + shot at $YLDR rewards at beta launch.

FILTER HINTS — end response with FILTER:<key> when a vault category is relevant
Keys: live · waitlist · predictions · perps · lp · project-coins · rwa · stock-tokens · memecoins`;

const MCP_BASE = 'https://mcp-demo-production-59da.up.railway.app';

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

async function callMCPTool(name: string): Promise<string> {
  try {
    const res = await fetch(`${MCP_BASE}/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'tools/call', id: 1, params: { name, arguments: {} } }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return 'Tool unavailable';
    const json = await res.json() as { result?: { content?: Array<{ text?: string }> } };
    const raw = json?.result?.content?.map((c) => c.text ?? '').join('\n') ?? 'No data';
    return scrubWallets(raw);
  } catch {
    return 'Tool timed out';
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

  const body = await req.json() as { message?: string; history?: ChatMessage[] };
  const userMessage = (body.message ?? '').trim();
  if (!userMessage) {
    return NextResponse.json({ error: 'Empty message' }, { status: 400 });
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
  const choice = completion.choices[0];

  if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
    const toolMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [...messages, choice.message];

    for (const tc of choice.message.tool_calls) {
      const fn = (tc as { id: string; function: { name: string } }).function;
      const result = await callMCPTool(fn.name);
      toolMessages.push({ role: 'tool', tool_call_id: (tc as { id: string }).id, content: result });
    }

    const followup = await client.chat.completions.create({
      model: process.env.GPT_MODEL ?? 'gpt-4o-mini',
      messages: toolMessages,
      max_completion_tokens: 400,
      temperature: 0.4,
    });
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

  return NextResponse.json({ text: responseText, filter });
}
