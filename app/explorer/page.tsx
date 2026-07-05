'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import NavLinks from '@/components/NavLinks';
import './explorer.css';

type VaultCat = 'predictions' | 'perps' | 'lp' | 'project-coins' | 'rwa' | 'memecoins' | 'stock-tokens';
type VaultStatus = 'live' | 'waitlist';
type VaultChain = 'polygon' | 'base' | 'hood';
type Vault = {
  id: string;
  name: string;
  proto: string;
  desc: string;
  status: VaultStatus;
  cat: VaultCat;
  chain: VaultChain;
  stats: Array<{ v: string; l: string }>;
};

const VAULTS: Vault[] = [
  {
    id: 'geo', name: '🌐 Geopolitics Vault', proto: '🔮 Polymarket · Predictions',
    desc: 'Agent identifies wallets with abnormal win rates vs implied probability on geopolitical events.',
    status: 'live', cat: 'predictions', chain: 'polygon',
    stats: [{ v: '+41.8%', l: '30D Return' }, { v: '$59.2K', l: 'AUM' }, { v: '82%', l: 'Win Rate' }],
  },
  {
    id: 'nba', name: '🏀 NBA Edge Vault', proto: '🔮 Polymarket · Predictions',
    desc: 'Agent ranks top NBA prediction market traders by statistical edge, mirrors highest-conviction positions.',
    status: 'live', cat: 'predictions', chain: 'polygon',
    stats: [{ v: '+18.7%', l: '7D Return' }, { v: '$22.4K', l: 'AUM' }, { v: '74%', l: 'Win Rate' }],
  },
  {
    id: 'funding', name: '⚡ Funding Arbs Vault', proto: '📈 Avantis · Hyperliquid · Perps',
    desc: 'Captures funding rate premium on Avantis & Hyperliquid by holding long/short pairs where funding diverges from historical mean. Zero directional bias.',
    status: 'waitlist', cat: 'perps', chain: 'base',
    stats: [{ v: '$75K', l: 'Target AUM' }, { v: '≤20%', l: 'Perf Fee' }, { v: '', l: 'Waitlisted' }],
  },
  {
    id: 'aero', name: '🪙 AERO Accumulator Vault', proto: '💧 Aerodrome · LP',
    desc: "DCA into Base's largest DEX token using top Aerodrome LP and trader signals. Agents execute and pace.",
    status: 'waitlist', cat: 'lp', chain: 'base',
    stats: [{ v: '$48K', l: 'Target AUM' }, { v: '≤15%', l: 'Perf Fee' }, { v: '', l: 'Waitlisted' }],
  },
  {
    id: 'virtuals-robotics', name: '🦾 Virtuals Robotics Infra Vault', proto: '🤖 Virtuals · Base · Robotics Infra',
    desc: 'Agent researches new Virtuals launches on Base, monitors project milestones, detects degen-sell signals from top wallets, and accumulates high-conviction robotics and AI infrastructure tokens for long-term value growth.',
    status: 'waitlist', cat: 'project-coins', chain: 'base',
    stats: [{ v: '$40K', l: 'Target AUM' }, { v: '≤20%', l: 'Perf Fee' }, { v: '', l: 'Waitlisted' }],
  },
  {
    id: 'spacex', name: '🚀 SpaceX RWA Vault', proto: '🏦 HOOD Chain · Robinhood Chain · RWA',
    desc: 'Accumulates SPCX tokenized equity natively on Robinhood Chain, following wallets with the highest post-IPO RWA spot edge.',
    status: 'waitlist', cat: 'rwa', chain: 'hood',
    stats: [{ v: '$28K', l: 'Target AUM' }, { v: '≤25%', l: 'Perf Fee' }, { v: '', l: 'Waitlisted' }],
  },
  {
    id: 'nvda', name: '🤖 NVDA AI Momentum Vault', proto: '🏦 HOOD Chain · Stock Tokens',
    desc: 'Follows top wallets accumulating NVIDIA tokenized stock on Robinhood Chain. Agent rides AI infrastructure cycles with 24/7 onchain liquidity.',
    status: 'waitlist', cat: 'stock-tokens', chain: 'hood',
    stats: [{ v: '$65K', l: 'Target AUM' }, { v: '≤20%', l: 'Perf Fee' }, { v: '', l: 'Waitlisted' }],
  },
  {
    id: 'tsla', name: '⚡ TSLA Volatility Vault', proto: '🏦 HOOD Chain · Stock Tokens',
    desc: 'Captures Tesla volatility cycles using tokenized TSLA on Robinhood Chain. Agent mirrors highest-conviction entries from top TSLA spot traders.',
    status: 'waitlist', cat: 'stock-tokens', chain: 'hood',
    stats: [{ v: '$55K', l: 'Target AUM' }, { v: '≤20%', l: 'Perf Fee' }, { v: '', l: 'Waitlisted' }],
  },
  {
    id: 'meme', name: '🎲 Memecoin Momentum Vault', proto: '🎰 Base · Memecoins',
    desc: 'Tracks top Base memecoin traders by realised edge and mirrors entries/exits with strict position sizing.',
    status: 'waitlist', cat: 'memecoins', chain: 'base',
    stats: [{ v: '$19K', l: 'Target AUM' }, { v: '', l: 'Waitlisted' }],
  },
  {
    id: 'hood-agents', name: '🤖 Virtuals HOOD Agents Vault', proto: '🏦 HOOD Chain · Virtuals · Agentic AI',
    desc: 'Agent identifies and accumulates early agentic trading AI projects launching on HOOD Chain via Virtuals. Monitors top wallet accumulation signals and project progress to build positions in agentic finance tokens.',
    status: 'waitlist', cat: 'project-coins', chain: 'hood',
    stats: [{ v: '$45K', l: 'Target AUM' }, { v: '≤20%', l: 'Perf Fee' }, { v: '', l: 'Waitlisted' }],
  },
  {
    id: 'hood-meme', name: '🎲 HOOD Memecoin Momentum Vault', proto: '🏦 HOOD Chain · Memecoins',
    desc: 'Tracks top HOOD Chain memecoin traders by realised edge and mirrors entries/exits with strict position sizing. Agent monitors new launches and exit signals continuously.',
    status: 'waitlist', cat: 'memecoins', chain: 'hood',
    stats: [{ v: '$22K', l: 'Target AUM' }, { v: '', l: 'Waitlisted' }],
  },
  {
    id: 'hood-carry', name: '📊 HOOD Carry Trade Vault', proto: '🏦 HOOD Chain · Lighter · Carry Trade',
    desc: 'Agent monitors funding rate gaps between spot DEX prices and Lighter perpetuals on HOOD Chain. Enters carry positions when annualised rate arbitrage exceeds 30% — buys spot, shorts perps, earns the spread.',
    status: 'waitlist', cat: 'perps', chain: 'hood',
    stats: [{ v: '$60K', l: 'Target AUM' }, { v: '≤18%', l: 'Perf Fee' }, { v: '', l: 'Waitlisted' }],
  },
];

const FILTERS: Array<{ key: string; label: string; sep?: boolean }> = [
  { key: 'all', label: 'All' },
  { key: 'live', label: 'Live' },
  { key: 'waitlist', label: 'Waitlist' },
  { key: 'predictions', label: 'Predictions', sep: true },
  { key: 'perps', label: 'Perps' },
  { key: 'lp', label: 'LP' },
  { key: 'project-coins', label: 'Project Coins' },
  { key: 'rwa', label: 'RWA' },
  { key: 'stock-tokens', label: 'Stock Tokens' },
  { key: 'memecoins', label: 'Memecoins' },
];

const CHAIN_FILTERS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'All Chains' },
  { key: 'polygon', label: 'Polygon' },
  { key: 'base', label: 'Base' },
  { key: 'hood', label: 'HOOD Chain' },
];

// The Yieldr Agent is still under construction — full allocation-agent
// capabilities (vault discovery, matching, and capital routing) ship in beta.
// Until then, every answer points back to whitelisting for early access.
const RESPONSES: Array<{ triggers: string[]; text: string; filter?: string }> = [
  {
    triggers: ['what is yieldr', 'what\'s yieldr', 'about yieldr'],
    text: "Yieldr is an agent stack for onchain funds — AI agents run trading strategies, vet wallets, and will soon route capital across agent vaults on behalf of traders, depositors, and communities. The allocation agent itself is still under construction; meanwhile you can whitelist your wallet on any agent vault below for early access.",
  },
  {
    triggers: ['hello', 'hi', 'hey', 'sup', 'what can you do', 'who are you', 'what are you', 'help'],
    text: "I'm the Yieldr Agent. Once live in beta, I'll help you discover vaults, explain strategies, and allocate capital across agent vaults automatically — I'm still under construction, so I can talk you through vaults, the $YLDR TGE, or whitelisting today. Whitelist your wallet on any vault below for early access in the meantime.",
  },
  {
    triggers: ['live vault', 'live', 'geopolitics', 'nba'],
    text: "Allocation agents aren't live yet, so I can't route capital into the live vaults for you — but the 🌐 Geopolitics Vault and 🏀 NBA Edge Vault are trading real project capital on Polymarket right now. Whitelist a waitlisted vault below to be ready for what's next.",
    filter: 'live',
  },
  {
    triggers: ['perp', 'funding', 'avantis', 'hyperliquid'],
    text: "Rotating capital across perps strategies is on my roadmap, but I'm still in beta build. The ⚡ Funding Arbs Vault captures the funding-rate premium on Avantis & Hyperliquid — whitelist it now to be first in at launch.",
    filter: 'perps',
  },
  {
    triggers: ['predict', 'polymarket'],
    text: "Comparing prediction-market vaults by edge and win rate is exactly what I'll do once live — that logic isn't built yet. In the meantime, check out the live Polymarket vaults above or whitelist a waitlisted one for early access.",
    filter: 'predictions',
  },
  {
    triggers: ['lp', 'liquidity', 'aerodrome', 'uniswap'],
    text: "I'll eventually help you evaluate LP and liquidity vaults automatically, but that's still being built. Whitelist the 🪙 AERO Accumulator Vault now to get early access when it launches.",
    filter: 'lp',
  },
  {
    triggers: ['rwa', 'real world', 'spacex', 'spcx'],
    text: "RWA vault allocation is part of what I'll handle once live — still under construction for now. Whitelist the 🚀 SpaceX RWA Vault on HOOD Chain to be considered for early access at launch.",
    filter: 'rwa',
  },
  {
    triggers: ['nvda', 'nvidia', 'tsla', 'tesla', 'stock token', 'stock', 'hood chain', 'hood', 'robinhood chain'],
    text: "Stock token vaults on HOOD Chain (Robinhood Chain) are a new frontier for Yieldr — 24/7 tokenized equity, 120+ countries. Whitelist the 🤖 NVDA AI Momentum Vault or ⚡ TSLA Volatility Vault for early access when they launch.",
    filter: 'stock-tokens',
  },
  {
    triggers: ['virtuals', 'robotics', 'infra', 'base ecosystem', 'project coin'],
    text: "Yieldr has two Virtuals vaults in the pipeline — 🦾 Virtuals Robotics Infra Vault on Base (VC-style accumulator, researches launches, detects degen-sell signals) and 🤖 Virtuals HOOD Agents Vault on HOOD Chain (agentic finance AI projects). Whitelist either below for early access.",
    filter: 'project-coins',
  },
  {
    triggers: ['memecoin', 'meme', 'hood meme'],
    text: "Memecoin vaults are available on both Base and HOOD Chain. 🎲 Memecoin Momentum Vault (Base) and 🎲 HOOD Memecoin Momentum Vault (HOOD Chain) — both mirror top traders by realised edge with strict position sizing. Whitelist below.",
    filter: 'memecoins',
  },
  {
    triggers: ['carry', 'lighter', 'funding rate', 'hood carry'],
    text: "The 📊 HOOD Carry Trade Vault on HOOD Chain buys spot and shorts perps on Lighter when annualised funding rate arb exceeds 30%. Pure carry — no directional exposure. Whitelist below for early access.",
    filter: 'perps',
  },
  {
    triggers: ['launch', 'start a vault', 'create a vault', 'become a trader'],
    text: "Helping traders launch their own agent vault is one of my core jobs — but that flow is still in beta build. Join the Fund Launch Waitlist or check the docs for what launching a vault involves.",
  },
  {
    triggers: ['allocate', 'allocation', 'rotate', 'deposit', 'capital'],
    text: "Routing depositor capital across agent vaults based on risk and return targets is exactly what I'll do once live — that feature is still under construction. Whitelist your wallet on any vault now to be ready when allocation agents go live.",
  },
  {
    triggers: ['tge', 'token', 'yldr', 'airdrop'],
    text: "⚡ $YLDR TGE is coming on HOOD Chain via Virtuals — no date confirmed yet. I can't pull live token data yet — once I'm live I'll keep you updated automatically. Whitelist your wallet now for early access and a shot at a $YLDR airdrop at beta launch.",
  },
  {
    triggers: ['whitelist', 'waitlist', 'early access'],
    text: 'Click "Whitelist Wallet" on any vault card to connect your wallet and reserve your spot. No deposit is taken at whitelist time — only at launch. That\'s the fastest way in while I\'m still under construction.',
  },
];

function processQuery(t: string): { text: string; filter?: string } {
  const lower = t.toLowerCase();
  for (const { triggers, text, filter } of RESPONSES) {
    if (triggers.some((kw) => lower.includes(kw))) return { text, filter };
  }
  return {
    text: "I can tell you about Yieldr, live vaults, perps, predictions, LP, RWA, project coins, launching a vault, or the $YLDR TGE — try asking about one of those. Full allocation-agent capabilities (auto-routing your capital) are still under construction, so for now whitelist your wallet on any agent vault below for early access.",
  };
}

const QUICK_REPLIES = ['What is Yieldr?', 'Live vaults', 'HOOD Chain', 'Launch a vault', 'TGE & $YLDR', 'How to whitelist'];

type ChatMsg = { type: 'agent' | 'user' | 'typing'; text: string; liveData?: boolean };

type LiveStats = { aum: number; winRate: number; returnPct: number };

function formatAgentText(text: string): string {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^[ \t]*[•·-] (.+)$/gm, '<span class="ex-chat-bullet">$1</span>')
    .replace(/\n/g, '<br>');
}

const FREE_TOKEN_LIMIT = 100_000;

function fmtAUM(n: number): string {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n}`;
}

export default function ExplorerPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [chainFilter, setChainFilter] = useState('all');
  const [modalVault, setModalVault] = useState<Vault | null>(null);
  const [modalState, setModalState] = useState<'connect' | 'confirm' | 'success'>('connect');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [targetAums, setTargetAums] = useState<Record<string, number>>({});
  const [liveStats, setLiveStats] = useState<Record<string, LiveStats>>({});
  const [myWhitelists, setMyWhitelists] = useState<Set<string>>(new Set());
  const [agentTokens, setAgentTokens] = useState(0);
  const [showYldrModal, setShowYldrModal] = useState(false);
  const [agentPanelOpen, setAgentPanelOpen] = useState(false);

  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    fetch('/api/whitelist')
      .then((r) => r.json())
      .then((d) => { if (d.ok && d.data) setCounts((prev) => ({ ...prev, ...d.data })); })
      .catch(() => {});

    fetch('/api/whitelist/aum')
      .then((r) => r.json())
      .then((d) => { if (d.ok && d.data) setTargetAums(d.data); })
      .catch(() => {});

    fetch('/api/vaults/data')
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok || !d.data) return;
        const next: Record<string, LiveStats> = {};
        for (const id of ['geo', 'nba', 'soccerAlpha']) {
          const v = d.data[id];
          if (!v?.stats) continue;
          const { vaultSize, winRate, totalPnl, initialCapital } = v.stats;
          next[id] = {
            aum: vaultSize ?? 0,
            winRate: winRate ?? 0,
            returnPct: initialCapital > 0 ? (totalPnl / initialCapital) * 100 : 0,
          };
        }
        setLiveStats(next);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isConnected || !address) {
      setMyWhitelists(new Set());
      return;
    }
    fetch(`/api/whitelist/mine?wallet=${address}`)
      .then((r) => r.json())
      .then((d) => { if (d.ok && d.data) setMyWhitelists(new Set(d.data)); })
      .catch(() => {});
  }, [isConnected, address]);

  useEffect(() => {
    const url = address ? `/api/agent/tokens?wallet=${address}` : '/api/agent/tokens';
    fetch(url)
      .then((r) => r.json())
      .then((d) => { if (d.ok) setAgentTokens(d.tokensUsed ?? 0); })
      .catch(() => {});
  }, [address]);

  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { type: 'agent', text: 'Hey, I\'m the Yieldr Agent. Ask me what Yieldr is, about any live or waitlisted vault, the $YLDR TGE, or how whitelisting works — full auto-allocation is still under construction, so until then, whitelist your wallet on any agent vault for early access.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // When wallet connects while a whitelist modal is open in "connect" state, advance to "confirm".
  useEffect(() => {
    if (modalVault && modalState === 'connect' && isConnected) {
      setModalState('confirm');
    }
  }, [isConnected, modalVault, modalState]);

  function openWhitelist(v: Vault) {
    setModalVault(v);
    setModalState(myWhitelists.has(v.id) ? 'success' : isConnected ? 'confirm' : 'connect');
  }
  function closeModal() {
    setModalVault(null);
    setModalState('connect');
  }
  function handleConfirm() {
    if (!modalVault || !address) return;
    setModalState('success');
    fetch('/api/whitelist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: address, vault_id: modalVault.id }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.data) setCounts((prev) => ({ ...prev, [modalVault.id]: d.data.count }));
      })
      .catch(() => {});
    setMyWhitelists((prev) => new Set(prev).add(modalVault.id));
  }

  function resolveStats(v: Vault): Array<{ v: string; l: string }> {
    const live = liveStats[v.id];
    const targetAum = targetAums[v.id];
    return v.stats.map((s) => {
      if (s.l === 'Waitlisted') return s;
      if (v.status === 'live' && live) {
        if (s.l === 'AUM') return { ...s, v: fmtAUM(live.aum) };
        if (s.l === 'Win Rate') return { ...s, v: `${live.winRate.toFixed(0)}%` };
        if (s.l === '30D Return' || s.l === '7D Return') {
          return { ...s, v: `${live.returnPct >= 0 ? '+' : ''}${live.returnPct.toFixed(1)}%` };
        }
      }
      if (v.status === 'waitlist' && s.l === 'Target AUM' && targetAum != null) {
        return { ...s, v: fmtAUM(targetAum) };
      }
      return s;
    });
  }

  const chatHistoryRef = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  async function sendQuery(raw: string) {
    const text = raw.trim();
    if (!text || agentTokens >= FREE_TOKEN_LIMIT) return;
    setChatMessages((m) => [...m, { type: 'user', text }, { type: 'typing', text: '…' }]);
    setChatInput('');

    chatHistoryRef.current = [...chatHistoryRef.current, { role: 'user' as const, content: text }].slice(-8);

    const liveDataHint = setTimeout(() => {
      setChatMessages((m) => m.map((msg) =>
        msg.type === 'typing' ? { ...msg, text: 'Fetching live vault data…' } : msg
      ));
    }, 2200);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: chatHistoryRef.current.slice(0, -1), walletAddress: address ?? null }),
      });
      clearTimeout(liveDataHint);
      const data = await res.json() as { text?: string; filter?: string; toolCalled?: boolean; tokensUsed?: number; error?: string };
      if (res.status === 429) { setAgentTokens(FREE_TOKEN_LIMIT); setChatMessages((m) => m.filter((msg) => msg.type !== 'typing')); return; }
      if (!res.ok || !data.text) throw new Error(data.error ?? 'No response');
      chatHistoryRef.current = [...chatHistoryRef.current, { role: 'assistant' as const, content: data.text }].slice(-8);
      setChatMessages((m) => [...m.filter((msg) => msg.type !== 'typing'), { type: 'agent', text: data.text!, liveData: data.toolCalled }]);
      if (data.filter) { setActiveFilter(data.filter); setChainFilter('all'); }
      if (data.tokensUsed) {
        setAgentTokens((prev) => prev + data.tokensUsed!);
      }
    } catch {
      clearTimeout(liveDataHint);
      setChatMessages((m) => [...m.filter((msg) => msg.type !== 'typing'), { type: 'agent', text: "I'm having trouble connecting right now — ask me about any vault, the $YLDR TGE, or whitelisting and I'll answer once I'm back online." }]);
    }
  }

  const filtered = VAULTS.filter((v) => {
    const matchChain = chainFilter === 'all' || v.chain === chainFilter;
    const matchStatus =
      activeFilter === 'all' ? true :
      activeFilter === 'live' || activeFilter === 'waitlist' ? v.status === activeFilter :
      v.cat === activeFilter;
    return matchChain && matchStatus;
  });
  const liveVaults = filtered.filter((v) => v.status === 'live');
  const waitlistVaults = filtered.filter((v) => v.status === 'waitlist');

  const truncAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div className="ex-root">
      {/* ── Nav ── */}
      <nav className="ex-nav">
        <Link href="/" className="ex-nav-l">
          <svg width="20" height="24" viewBox="0 0 100 120" fill="none">
            <path d="M50 8Q72 28 82 60Q72 92 50 112Q28 92 18 60Q28 28 50 8Z" fill="#00E87B" />
            <ellipse cx="50" cy="60" rx="16" ry="22" fill="#000" opacity=".25" />
            <circle cx="50" cy="60" r="9" fill="#fff" opacity=".88" />
          </svg>
          <span className="ex-nav-brand">YIELDR</span>
        </Link>
        <div className="ex-nav-r">
          <NavLinks />
        </div>
      </nav>

      <div className="ex-app-layout">
        {/* ── Explorer panel ── */}
        <div className="ex-explorer-panel">
          <div className="ex-explorer-head">
            <h1>Agent Vault Explorer</h1>
            <p>Browse live and upcoming agent vaults. Whitelist your wallet to earn $YLDR at beta launch.</p>
          </div>

          <div className="ex-filter-bar">
            {FILTERS.map((f) => (
              <span key={f.key} style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                {f.sep && <span className="ex-filter-sep" />}
                <button
                  className={`ex-filter-btn${activeFilter === f.key ? ' active' : ''}`}
                  onClick={() => setActiveFilter(f.key)}
                >
                  {f.label}
                </button>
              </span>
            ))}
          </div>
          <div className="ex-filter-bar ex-chain-filter-bar">
            {CHAIN_FILTERS.map((f) => (
              <button
                key={f.key}
                className={`ex-filter-btn ex-chain-btn${chainFilter === f.key ? ' active' : ''}`}
                onClick={() => setChainFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {liveVaults.length > 0 && (
            <>
              <div className="ex-section-label">Live</div>
              <div className="ex-vault-grid">
                {liveVaults.map((v) => (
                  <VaultCard key={v.id} v={v} count={counts[v.id]} stats={resolveStats(v)} whitelisted={myWhitelists.has(v.id)} onWhitelist={() => openWhitelist(v)} />
                ))}
              </div>
            </>
          )}

          {waitlistVaults.length > 0 && (
            <>
              <div className="ex-section-label">Waitlist</div>
              <div className="ex-vault-grid">
                {waitlistVaults.map((v) => (
                  <VaultCard key={v.id} v={v} count={counts[v.id]} stats={resolveStats(v)} whitelisted={myWhitelists.has(v.id)} onWhitelist={() => openWhitelist(v)} />
                ))}
              </div>
            </>
          )}

          {filtered.length === 0 && (
            <p style={{ color: 'var(--text-dim)', fontSize: '.8rem' }}>No vaults match this filter.</p>
          )}
        </div>

        {/* ── Agent panel ── */}
        {agentPanelOpen && <div className="ex-agent-backdrop" onClick={() => setAgentPanelOpen(false)} />}
        <div className={`ex-agent-panel${agentPanelOpen ? ' open' : ''}`}>
          <div className="ex-agent-hdr">
            <svg className="ex-agent-avatar" width="26" height="26" viewBox="0 0 100 120">
              <path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#00E87B" />
              <circle cx="50" cy="60" r="8" fill="#000" opacity=".3" />
            </svg>
            <div style={{ flex: 1 }}>
              <div className="ex-agent-name">YIELDR AGENT</div>
              <div className="ex-agent-status"><span className="ex-agent-status-dot" />Online</div>
            </div>
            <div className="ex-token-meter">
              <div className="ex-token-bar">
                <div className="ex-token-fill" style={{ width: `${Math.max(Math.min(agentTokens / FREE_TOKEN_LIMIT * 100, 100), agentTokens > 0 ? 2 : 0)}%`, background: agentTokens >= FREE_TOKEN_LIMIT * 0.9 ? '#f97316' : 'var(--g)' }} />
              </div>
              <div className="ex-token-label">{agentTokens.toLocaleString()} / 100K free</div>
              <div className="ex-token-hint" onClick={() => setShowYldrModal(true)}>More access with $YLDR →</div>
            </div>
            <button className="ex-agent-close-mobile" onClick={() => setAgentPanelOpen(false)} aria-label="Close agent">✕</button>
          </div>

          <div className="ex-chat-messages">
            {chatMessages.map((m, i) => (
              <div key={i} className={`ex-chat-msg ${m.type}`}>
                {m.type === 'typing'
                  ? <span className="ex-typing-text">{m.text}</span>
                  : <span dangerouslySetInnerHTML={{ __html: formatAgentText(m.text) }} />}
                {m.liveData && (
                  <span className="ex-live-badge">⚡ live data</span>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="ex-quick-replies">
            {QUICK_REPLIES.map((q) => (
              <button key={q} className="ex-qr-btn" onClick={() => sendQuery(q)}>{q}</button>
            ))}
          </div>

          {agentTokens >= FREE_TOKEN_LIMIT ? (
            <div className="ex-token-limit-msg">
              <div className="ex-token-limit-title">Free tier reached</div>
              <div className="ex-token-limit-body">$YLDR token holders get unlimited agent access. Token launch Aug 2026 — whitelist your wallet now for early access.</div>
              <button className="ex-token-limit-cta" onClick={() => { setActiveFilter('live'); setChainFilter('all'); }}>Whitelist a vault →</button>
            </div>
          ) : (
            <div className="ex-chat-input-area">
              <div className="ex-chat-input-box">
                <textarea
                  rows={1}
                  placeholder="Ask the agent anything..."
                  value={chatInput}
                  onChange={(e) => {
                    setChatInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendQuery(chatInput); }
                  }}
                />
                <button
                  className={`ex-chat-send${chatInput.trim() ? ' active' : ''}`}
                  onClick={() => sendQuery(chatInput)}
                  aria-label="Send"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile chat FAB ── */}
      <button
        className={`ex-chat-fab${agentPanelOpen ? ' fab-hidden' : ''}`}
        onClick={() => setAgentPanelOpen(true)}
        aria-label="Open AI agent"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── $YLDR access modal ── */}
      {showYldrModal && (
        <div className="ex-modal-overlay" onClick={() => setShowYldrModal(false)}>
          <div className="ex-yldr-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ex-yldr-close" onClick={() => setShowYldrModal(false)} aria-label="Close">✕</button>

            <div className="ex-yldr-header">
              <div className="ex-yldr-scanline" />
              <div className="ex-yldr-eyebrow">// ACCESS_CONTROL.md</div>
              <div className="ex-yldr-title">
                <span className="ex-yldr-title-free">FREE</span>
                <span className="ex-yldr-title-sep"> → </span>
                <span className="ex-yldr-title-paid">$YLDR</span>
              </div>
              <div className="ex-yldr-subtitle">You&apos;ve used your free compute. Stack $YLDR, unlock the grid.</div>
            </div>

            <div className="ex-yldr-tiers">
              <div className="ex-yldr-tier ex-yldr-tier--free">
                <div className="ex-yldr-tier-label">FREE TIER</div>
                <ul className="ex-yldr-tier-list">
                  <li><span className="ex-yldr-check ex-yldr-check--amber">✓</span> 100K tokens/lifetime</li>
                  <li><span className="ex-yldr-check ex-yldr-check--amber">✓</span> Basic vault explorer</li>
                  <li><span className="ex-yldr-x">✗</span> AI vault analyst</li>
                  <li><span className="ex-yldr-x">✗</span> Live position data</li>
                  <li><span className="ex-yldr-x">✗</span> Priority vault access</li>
                </ul>
                <div className="ex-yldr-tier-footer">gm anon. thats all u get.</div>
              </div>

              <div className="ex-yldr-tier ex-yldr-tier--paid">
                <div className="ex-yldr-tier-badge">SOON™</div>
                <div className="ex-yldr-tier-label">$YLDR HOLDER</div>
                <ul className="ex-yldr-tier-list">
                  <li><span className="ex-yldr-check">✓</span> Unlimited AI queries</li>
                  <li><span className="ex-yldr-check">✓</span> Full vault explorer</li>
                  <li><span className="ex-yldr-check">✓</span> Live position data</li>
                  <li><span className="ex-yldr-check">✓</span> Priority vault access</li>
                  <li><span className="ex-yldr-check">✓</span> Alpha before the plebs</li>
                </ul>
                <div className="ex-yldr-tier-footer">ngmi without it ngl.</div>
              </div>
            </div>

            <div className="ex-yldr-timeline">
              <div className="ex-yldr-tl-label">ROADMAP</div>
              <div className="ex-yldr-tl-track">
                <div className="ex-yldr-tl-node ex-yldr-tl-node--done">
                  <div className="ex-yldr-tl-dot" />
                  <div className="ex-yldr-tl-text">
                    <div className="ex-yldr-tl-date">Jul 9, 2026</div>
                    <div className="ex-yldr-tl-event">$YLDR TGE</div>
                  </div>
                </div>
                <div className="ex-yldr-tl-line" />
                <div className="ex-yldr-tl-node">
                  <div className="ex-yldr-tl-dot ex-yldr-tl-dot--future" />
                  <div className="ex-yldr-tl-text">
                    <div className="ex-yldr-tl-date">Aug 2026</div>
                    <div className="ex-yldr-tl-event">Holder access live</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ex-yldr-cta-wrap">
              <button
                className="ex-yldr-cta"
                onClick={() => { setShowYldrModal(false); setModalVault(VAULTS[0] ?? null); }}
              >
                Whitelist a vault now → earn $YLDR at launch
              </button>
              <div className="ex-yldr-cta-sub">Whitelist any vault today. No deposit required.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Whitelist modal ── */}
      {modalVault && (
        <div className="ex-modal-overlay" onClick={closeModal}>
          <div className="ex-wl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ex-wm-strip">
              <button className="ex-wm-close" onClick={closeModal} aria-label="Close">&#10005;</button>
              <div className="ex-wm-name">{modalVault.name}</div>
              <div className="ex-wm-proto">{modalVault.proto}</div>
              <div className="ex-wm-stats">
                {resolveStats(modalVault).map((s) => (
                  <div key={s.l}><div className="ex-wm-sv">{s.v}</div><div className="ex-wm-sl">{s.l}</div></div>
                ))}
              </div>
            </div>

            <div className="ex-wm-body">
              <div className="ex-wm-reward">
                <em>Earn a variable $YLDR reward</em> at beta launch. Deposit min. $100 USDC for 30 days at launch to claim.
                <div className="ex-wm-fine">*T&amp;Cs apply.</div>
              </div>
              <div className="ex-wm-counter">
                {counts[modalVault.id] != null ? `${counts[modalVault.id]} wallets whitelisted` : 'Loading whitelist count…'}
              </div>

              {modalState === 'connect' && (
                <div>
                  <button className="ex-btn-wl" onClick={() => openConnectModal?.()}>Connect Wallet to Whitelist</button>
                  <div className="ex-wm-terms">By connecting, you agree to the Yieldr Terms of Service.</div>
                </div>
              )}

              {modalState === 'confirm' && (
                <div>
                  <div className="ex-wm-addr-row">
                    <span className="lbl">Wallet</span>
                    <span className="val"><span className="ex-wm-addr-dot" />{truncAddr}</span>
                  </div>
                  <button className="ex-btn-wl" onClick={handleConfirm}>Confirm Whitelist ↗</button>
                  <div className="ex-wm-no-deposit">No deposit taken now.</div>
                </div>
              )}

              {modalState === 'success' && (
                <div className="ex-wm-success">
                  <div className="ex-wm-check">✓</div>
                  <div className="ex-wm-success-title">Wallet whitelisted.</div>
                  <p style={{ fontSize: '.78rem', color: 'var(--text-dim)' }}>
                    You&apos;re in for {modalVault.name}. We&apos;ll notify this wallet at beta launch.
                  </p>
                  <div className="ex-wm-share">
                    <button
                      className="ex-wm-share-btn"
                      onClick={() => navigator.clipboard?.writeText(`https://yieldr.org/explorer`)}
                    >
                      Copy vault link
                    </button>
                    <a
                      className="ex-wm-share-btn"
                      href={`https://x.com/intent/tweet?text=${encodeURIComponent(`Just whitelisted my wallet on ${modalVault.name.replace(/^[^\w]+/, '')} @yieldrdotorg — earn $YLDR at beta launch.`)}`}
                      target="_blank" rel="noopener noreferrer"
                    >
                      Post on X
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CHAIN_LABELS: Record<string, string> = { polygon: 'Polygon', base: 'Base', hood: 'HOOD Chain' };

function VaultCard({ v, count, stats, whitelisted, onWhitelist }: { v: Vault; count?: number; stats: Array<{ v: string; l: string }>; whitelisted: boolean; onWhitelist: () => void }) {
  const body = (
    <>
      <div className="ex-vc-top">
        <span className={`ex-vc-badge ${v.status}`}>
          <span className="ex-vc-dot" />{v.status === 'live' ? 'Live' : 'Waitlist'}
        </span>
        <span className={`ex-vc-chain ex-vc-chain-${v.chain}`}>{CHAIN_LABELS[v.chain]}</span>
        {whitelisted ? (
          <span className="ex-vc-wl-done">✓ Whitelisted</span>
        ) : (
          <button
            className="ex-vc-wl-btn"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWhitelist(); }}
          >
            Whitelist Wallet
          </button>
        )}
      </div>
      <div className="ex-vc-proto">{v.proto}</div>
      <div className="ex-vc-name">{v.name}</div>
      <p className="ex-vc-desc">{v.desc}</p>
      <div className="ex-vc-stats">
        {stats.map((s) => (
          <div className="ex-vc-stat" key={s.l}>
            <div className="ex-vc-sv">{s.l === 'Waitlisted' ? (count ?? '—') : s.v}</div>
            <div className="ex-vc-sl">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="ex-vc-wl-count">{count != null ? `${count} wallets whitelisted` : 'Loading…'}</div>
    </>
  );

  if (v.status === 'live') {
    return (
      <Link href={`/vaults?vault=${v.id}`} className="ex-vc">
        {body}
      </Link>
    );
  }
  return <div className="ex-vc">{body}</div>;
}
