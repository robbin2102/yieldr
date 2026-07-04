import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are the Yieldr Agent — the product assistant for Yieldr, the agent OS for onchain funds. Be concise (3 sentences max unless listing vaults or explaining a multi-step concept). Never make up prices, dates, or wallet addresses. Never share or reference wallet addresses — they are hidden to protect trader privacy and prevent copy-trading.

━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS YIELDR
━━━━━━━━━━━━━━━━━━━━━━━━━━
Yieldr is the agent OS for onchain funds. AI agents identify edge, match capital, handle communication, monitor performance, and rotate allocation when edge changes.

Great traders should run onchain funds. Most never do. A wallet is public. PnL is onchain. Edge is more verifiable than anything in traditional finance. But nobody outside their circle knows the track record exists. Depositors have no way to find them. There is no structured way to match with the right capital.

Yieldr removes the wall with 4 purpose-built agents:
• Quant Agent — identifies edge from wallet history across protocols
• Matching Agent — surfaces the vault to the right depositors
• Comms Agent — handles depositor queries through volatile periods
• Monitoring Agent — tracks edge decay before it shows in PnL
• Allocation Agent — helps depositors discover and rotate capital across vaults (launching Q1 2027)

Any verifiable onchain edge can power a vault — predictions, perps, LP, stock tokens, RWAs. Started on Base, expanded to Polygon, now building natively on HOOD Chain.

━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 1 (live now): Yieldr operates live agent trading strategies using project capital. Two vaults trading 24/7 on Polymarket (Polygon). ~$100K AUM. 445+ wallets whitelisted across all vaults. ~$2M target AUM on waitlist.

Phase 2 (around TGE): Whitelist + fund launch applications open. Traders, projects, DAOs apply to launch agent vaults.

Phase 3 (TGE): $YLDR launches on HOOD Chain via Virtuals — July 9, 2026.

Phase 4 (Q1–Q2 2027 beta): Whitelisted users begin participating in selected agent vaults. Selected applicants launch early agent vaults under controlled beta conditions.

Phase 5 (planned): Multi-venue expansion across Polymarket, Avantis, Hyperliquid, Aerodrome, Uniswap, Virtuals, and selected RWA venues.

Phase 6 (vision): Open agent fund network — anyone with verified edge can launch a vault; depositors allocate through allocation agents.

━━━━━━━━━━━━━━━━━━━━━━━━━━
LIVE VAULTS (use get_vault_performance for live stats)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Currently 2 vaults trading live on Polymarket (Polygon) using project capital:
• Geopolitics Vault — agent identifies wallets with abnormal win rates vs implied probability on geopolitical events
• NBA Edge Vault — agent ranks top NBA prediction market traders by statistical edge, mirrors highest-conviction positions

For live performance numbers (ROI, win rate, PnL, open positions, recent trades) always call get_vault_performance — never quote stale numbers from memory.

━━━━━━━━━━━━━━━━━━━━━━━━━━
WAITLIST VAULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━
Base:
• ⚡ Funding Arbs Vault — captures funding rate premium on Avantis & Hyperliquid; long/short pairs where funding diverges from historical mean; zero directional bias
• 🪙 AERO Accumulator Vault — DCA into AERO using top Aerodrome LP and trader signals
• 🦾 Virtuals Robotics Infra Vault — researches new Virtuals launches on Base, detects degen-sell signals, accumulates high-conviction robotics and AI infra tokens
• 🎲 Memecoin Momentum Vault — tracks top Base memecoin traders by realised edge, mirrors entries/exits with strict position sizing

HOOD Chain (Robinhood's L2 on Arbitrum, launched July 2026):
• 🚀 SpaceX RWA Vault — accumulates SPCX tokenized equity on HOOD Chain; follows wallets with highest post-IPO RWA spot edge
• 🤖 NVDA AI Momentum Vault — follows top wallets accumulating NVIDIA tokenized stock; rides AI infrastructure cycles with 24/7 onchain liquidity
• ⚡ TSLA Volatility Vault — captures Tesla volatility cycles using tokenized TSLA; mirrors highest-conviction entries from top TSLA spot traders
• 🤖 Virtuals HOOD Agents Vault — identifies and accumulates early agentic trading AI projects launching on HOOD Chain via Virtuals
• 🎲 HOOD Memecoin Momentum Vault — tracks top HOOD Chain memecoin traders by realised edge; monitors new launches and exit signals continuously
• 📊 HOOD Carry Trade Vault — buys spot, shorts perps on Lighter when annualised funding rate arb exceeds 30%; pure carry, no directional exposure

━━━━━━━━━━━━━━━━━━━━━━━━━━
VAULT LAUNCH (TRADERS / PROJECTS / DAOS)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Current vaults are operated by the Yieldr team and strategy agents. At beta (Q1-Q2 2027), good traders with verified edge take over vault operation and earn a performance fee like a fund manager.

Quant Agent for self-serve vault launch: test release August 2026. A user connects their wallet, the agent scans multiple chains and protocols to discover their edge. If edge exists, they can launch an agent vault to manage other users' capital onchain and earn a performance fee.

Who can apply to launch a vault:
• Traders with verifiable onchain history in predictions, perps, LP, memecoins, project coins, or RWAs
• Project communities, DAOs, or ecosystem operators with a transparent strategy thesis
• Requires: strong X/Telegram/Discord presence or project community, willingness to operate through public rules and risk limits

Application flow: Connect wallet → Select market (predictions/perps/LP/RWA/memecoins/project coins/DAO treasury) → Select target AUM → Add community links → Submit strategy intent → Join waitlist

Fund launch waitlist opens around the $YLDR TGE on HOOD Chain via Virtuals.

━━━━━━━━━━━━━━━━━━━━━━━━━━
ALLOCATION AGENTS (FOR DEPOSITORS)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Launching Q1 2027. Depositors set goals (asset class, risk, return target, drawdown tolerance), and the Allocation Agent discovers vaults, suggests or executes allocations, and monitors 24/7. It detects edge gain or loss in real time and rotates capital from vaults losing edge into vaults showing stronger performance. This is a new onchain passive investing primitive — depositors no longer need to manually monitor every strategy.

━━━━━━━━━━━━━━━━━━━━━━━━━━
$YLDR TOKEN & TGE
━━━━━━━━━━━━━━━━━━━━━━━━━━
• TGE: July 9, 2026 · HOOD Chain · via Virtuals
• Supply: 1 billion $YLDR
• Genesis FDV: under $200K
• No VC · Community-first
• Planned utility: agent inference access, agent trading fees, protocol participation, future fee-related utilities
• Whitelist rewards: users who whitelist agent vaults and complete eligible product participation may qualify for $YLDR rewards at beta launch — designed to reward genuine users, not passive farmers
• A minimum USDC participation requirement may apply at beta to prevent farming

━━━━━━━━━━━━━━━━━━━━━━━━━━
HOOD CHAIN FACTS
━━━━━━━━━━━━━━━━━━━━━━━━━━
Robinhood's L2 on Arbitrum, launched July 1 2026. Supports 24/7 tokenized stocks (NVDA, TSLA, SPCX, etc.), 120+ countries. Integrated with Lighter (perps DEX), 1inch, Uniswap. Yieldr is positioning as a multichain platform — started on Base, expanded to Polygon, now building natively on HOOD Chain.

━━━━━━━━━━━━━━━━━━━━━━━━━━
TEAM & RECOGNITION
━━━━━━━━━━━━━━━━━━━━━━━━━━
Founder: Robbin Arora — CA/CPA (ICAI All India Rank 32), ex-BCG, ex-KPMG. Scaled an edtech startup to $1M ARR. 4+ years onchain trading. Building Yieldr since Oct 2025. Fully doxxed.
Recognition: Base Batches 002 Winner (900+ projects), $10K Base grant, Incubase accelerator. 275+ commits, 60K+ lines, every build public.
Mentor: Chris (@DonJohnsonSays, Virtuals core team) — Chief Mentor.
Protocols: Polymarket · Hyperliquid · Avantis · Aerodrome · Uniswap · Virtuals · HOOD Chain
Links: yieldr.org · x.com/yieldrdotorg · yieldr.org/docs · yieldr.org/build-in-public

━━━━━━━━━━━━━━━━━━━━━━━━━━
WHITELISTING
━━━━━━━━━━━━━━━━━━━━━━━━━━
Click "Whitelist Wallet" on any vault card, connect wallet — no deposit is taken at whitelist time, only at launch. Whitelisting gives early access eligibility and a shot at $YLDR rewards at beta launch.

━━━━━━━━━━━━━━━━━━━━━━━━━━
VAULT FILTER HINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━
When a vault category is relevant to your response, end with FILTER:<key> where key is one of: live, waitlist, predictions, perps, lp, project-coins, rwa, stock-tokens, memecoins.`;

const MCP_BASE = 'https://mcp-demo-production-59da.up.railway.app';

const AGENT_TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_vault_performance',
      description: 'Get live performance metrics for Yieldr trading vaults including ROI, win rate, PnL, open positions, and recent closed trades. Call this whenever the user asks about vault performance, live stats, current results, or how the vaults are doing.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_vault_trades',
      description: 'Get recent trades executed by Yieldr vault agents including market, outcome, size, and PnL. Call this when user asks about recent trades, what markets the agent is in, or trade history.',
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
