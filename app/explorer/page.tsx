'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import NavLinks from '@/components/NavLinks';
import './explorer.css';

type VaultCat = 'predictions' | 'perps' | 'lp' | 'project-coins' | 'rwa' | 'memecoins';
type VaultStatus = 'live' | 'waitlist';
type Vault = {
  id: string;
  name: string;
  proto: string;
  desc: string;
  status: VaultStatus;
  cat: VaultCat;
  stats: Array<{ v: string; l: string }>;
  counter: string;
};

const VAULTS: Vault[] = [
  {
    id: 'geo', name: '🌐 Geopolitics Vault', proto: '🔮 Polymarket · Predictions',
    desc: 'Agent identifies wallets with abnormal win rates vs implied probability on geopolitical events.',
    status: 'live', cat: 'predictions',
    stats: [{ v: '+41.8%', l: '30D Return' }, { v: '$59.2K', l: 'AUM' }, { v: '82%', l: 'Win Rate' }],
    counter: '312 wallets whitelisted',
  },
  {
    id: 'nba', name: '🏀 NBA Edge Vault', proto: '🔮 Polymarket · Predictions',
    desc: 'Agent ranks top NBA prediction market traders by statistical edge, mirrors highest-conviction positions.',
    status: 'live', cat: 'predictions',
    stats: [{ v: '+18.7%', l: '7D Return' }, { v: '$22.4K', l: 'AUM' }, { v: '74%', l: 'Win Rate' }],
    counter: '187 wallets whitelisted',
  },
  {
    id: 'funding', name: '⚡ Funding Arbs Vault', proto: '📈 Avantis · Hyperliquid · Perps',
    desc: 'Captures funding rate premium on Avantis & Hyperliquid by holding long/short pairs where funding diverges from historical mean. Zero directional bias.',
    status: 'waitlist', cat: 'perps',
    stats: [{ v: '$75K', l: 'Target AUM' }, { v: '≤20%', l: 'Perf Fee' }, { v: '312', l: 'Waitlisted' }],
    counter: '312 wallets waitlisted',
  },
  {
    id: 'aero', name: '🪙 AERO Accumulator Vault', proto: '💧 Aerodrome · LP',
    desc: "DCA into Base's largest DEX token using top Aerodrome LP and trader signals. Agents execute and pace.",
    status: 'waitlist', cat: 'lp',
    stats: [{ v: '$48K', l: 'Target AUM' }, { v: '≤15%', l: 'Perf Fee' }, { v: '234', l: 'Waitlisted' }],
    counter: '234 wallets waitlisted',
  },
  {
    id: 'base', name: '🌐 Base Ecosystem Vault', proto: '🤖 Virtuals · Bankr · Project Coins',
    desc: 'Curated basket of Virtuals, Bankr, and Base ecosystem tokens following highest-edge wallets.',
    status: 'waitlist', cat: 'project-coins',
    stats: [{ v: '$32K', l: 'Target AUM' }, { v: '≤18%', l: 'Perf Fee' }, { v: '189', l: 'Waitlisted' }],
    counter: '189 wallets waitlisted',
  },
  {
    id: 'spacex', name: '🚀 SpaceX RWA Vault', proto: '🦄 Uniswap · Aerodrome · RWA',
    desc: 'Accumulates SpaceX tokenised equity on Uniswap and Aerodrome, following wallets with the highest RWA spot edge.',
    status: 'waitlist', cat: 'rwa',
    stats: [{ v: '$28K', l: 'Target AUM' }, { v: '≤25%', l: 'Perf Fee' }, { v: '112', l: 'Waitlisted' }],
    counter: '112 wallets waitlisted',
  },
  {
    id: 'meme', name: '🎲 Memecoin Momentum Vault', proto: '🎰 Base · Memecoins',
    desc: 'Tracks top Base memecoin traders by realised edge and mirrors entries/exits with strict position sizing.',
    status: 'waitlist', cat: 'memecoins',
    stats: [{ v: '$19K', l: 'Target AUM' }, { v: '98', l: 'Waitlisted' }],
    counter: '98 wallets waitlisted',
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
  { key: 'memecoins', label: 'Memecoins' },
];

const RESPONSES: Record<string, { text: string; filter?: string }> = {
  live: { text: 'We have 2 live vaults right now: the 🌐 Geopolitics Vault (+41.8% 30D, 82% win rate) and the 🏀 NBA Edge Vault (+18.7% 7D, 74% win rate). Both run on Polymarket prediction markets with real project capital.', filter: 'live' },
  perps: { text: 'The ⚡ Funding Arbs Vault captures the funding-rate premium on Avantis & Hyperliquid with zero directional bias. It\'s on the waitlist — whitelist your wallet now to be first in at launch.', filter: 'perps' },
  prediction: { text: 'Our prediction-market vaults scan Polymarket for wallets with statistically abnormal win rates, then mirror their highest-conviction positions within trader-set risk rules.', filter: 'predictions' },
  lp: { text: 'The 🪙 AERO Accumulator Vault DCAs into Aerodrome\'s native token using top LP and trader signals — a way to gain exposure to Base\'s largest DEX without manual timing.', filter: 'lp' },
  rwa: { text: 'The 🚀 SpaceX RWA Vault accumulates tokenised SpaceX equity on Uniswap and Aerodrome, following wallets with the highest spot edge on real-world assets.', filter: 'rwa' },
  tge: { text: '⚡ $YLDR TGE launches on Virtuals in July 2026. Whitelist any vault now and you can earn 10K–100K $YLDR at beta launch, claimable after a $100 min deposit for 30 days.' },
  yldr: { text: '$YLDR is the Yieldr protocol token, launching on Virtuals July 2026 at a $9M FDV (genesis). Whitelisting a vault wallet now earns you an allocation at beta launch.' },
  whitelist: { text: 'Click "Whitelist Wallet" on any vault card to connect your wallet and reserve your spot. No deposit is taken at whitelist time — only at launch.' },
};

function processQuery(t: string): { text: string; filter?: string } {
  const lower = t.toLowerCase();
  for (const key of Object.keys(RESPONSES)) {
    if (lower.includes(key)) return RESPONSES[key];
  }
  return { text: "I can tell you about live vaults, perps, predictions, LP, RWA strategies, the $YLDR TGE, or how whitelisting works. What would you like to know?" };
}

const QUICK_REPLIES = ['Live vaults', 'Perps', 'Predictions', 'LP', 'TGE', 'Earn $YLDR'];

type ChatMsg = { type: 'agent' | 'user' | 'typing'; text: string };

export default function ExplorerPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalVault, setModalVault] = useState<Vault | null>(null);
  const [modalState, setModalState] = useState<'connect' | 'confirm' | 'success'>('connect');

  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();

  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { type: 'agent', text: 'Hey, I\'m the Yieldr Agent. Ask me about any live or waitlisted vault, the $YLDR TGE, or how whitelisting works.' },
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
    setModalState(isConnected ? 'confirm' : 'connect');
  }
  function closeModal() {
    setModalVault(null);
    setModalState('connect');
  }
  function handleConfirm() {
    // ← Hook: sign whitelist message + POST to backend here
    setModalState('success');
  }

  function sendQuery(raw: string) {
    const text = raw.trim();
    if (!text) return;
    setChatMessages((m) => [...m, { type: 'user', text }, { type: 'typing', text: '…' }]);
    setChatInput('');
    setTimeout(() => {
      const res = processQuery(text);
      setChatMessages((m) => [...m.filter((msg) => msg.type !== 'typing'), { type: 'agent', text: res.text }]);
      if (res.filter) setActiveFilter(res.filter);
    }, 500);
  }

  const filtered = VAULTS.filter((v) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'live' || activeFilter === 'waitlist') return v.status === activeFilter;
    return v.cat === activeFilter;
  });
  const liveVaults = filtered.filter((v) => v.status === 'live');
  const waitlistVaults = filtered.filter((v) => v.status === 'waitlist');

  const truncAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div className="ex-root">
      {/* ── Nav ── */}
      <nav className="ex-nav">
        <Link href="/" className="ex-nav-l">
          <svg width="18" height="22" viewBox="0 0 100 120" fill="none">
            <path d="M50 8Q72 28 82 60Q72 92 50 112Q28 92 18 60Q28 28 50 8Z" fill="#00E87B" />
            <ellipse cx="50" cy="60" rx="16" ry="22" fill="#000" opacity=".25" />
            <circle cx="50" cy="60" r="9" fill="#fff" opacity=".88" />
          </svg>
          <span className="ex-nav-brand">YIELDR</span>
        </Link>
        <div className="ex-nav-r">
          <NavLinks cta={{ href: '/buy', label: 'Early Access ↗' }} />
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

          {liveVaults.length > 0 && (
            <>
              <div className="ex-section-label">Live</div>
              <div className="ex-vault-grid">
                {liveVaults.map((v) => (
                  <VaultCard key={v.id} v={v} onWhitelist={() => openWhitelist(v)} />
                ))}
              </div>
            </>
          )}

          {waitlistVaults.length > 0 && (
            <>
              <div className="ex-section-label">Waitlist</div>
              <div className="ex-vault-grid">
                {waitlistVaults.map((v) => (
                  <VaultCard key={v.id} v={v} onWhitelist={() => openWhitelist(v)} />
                ))}
              </div>
            </>
          )}

          {filtered.length === 0 && (
            <p style={{ color: 'var(--text-dim)', fontSize: '.8rem' }}>No vaults match this filter.</p>
          )}
        </div>

        {/* ── Agent panel ── */}
        <div className="ex-agent-panel">
          <div className="ex-agent-hdr">
            <svg className="ex-agent-avatar" width="26" height="26" viewBox="0 0 100 120">
              <path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#00E87B" />
              <circle cx="50" cy="60" r="8" fill="#000" opacity=".3" />
            </svg>
            <div>
              <div className="ex-agent-name">YIELDR AGENT</div>
              <div className="ex-agent-status"><span className="ex-agent-status-dot" />Online</div>
            </div>
          </div>

          <div className="ex-chat-messages">
            {chatMessages.map((m, i) => (
              <div key={i} className={`ex-chat-msg ${m.type}`}>{m.text}</div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="ex-quick-replies">
            {QUICK_REPLIES.map((q) => (
              <button key={q} className="ex-qr-btn" onClick={() => sendQuery(q)}>{q}</button>
            ))}
          </div>

          <div className="ex-chat-input-area">
            <div className="ex-chat-input-box">
              <textarea
                rows={1}
                placeholder="Ask the agent anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
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
        </div>
      </div>

      {/* ── Whitelist modal ── */}
      {modalVault && (
        <div className="ex-modal-overlay" onClick={closeModal}>
          <div className="ex-wl-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ex-wm-strip">
              <button className="ex-wm-close" onClick={closeModal} aria-label="Close">&#10005;</button>
              <div className="ex-wm-name">{modalVault.name}</div>
              <div className="ex-wm-proto">{modalVault.proto}</div>
              <div className="ex-wm-stats">
                {modalVault.stats.map((s) => (
                  <div key={s.l}><div className="ex-wm-sv">{s.v}</div><div className="ex-wm-sl">{s.l}</div></div>
                ))}
              </div>
            </div>

            <div className="ex-wm-body">
              <div className="ex-wm-reward">
                <em>Earn 10K–100K $YLDR</em> at beta launch. Deposit min. $100 USDC for 30 days at launch to claim.
                <div className="ex-wm-fine">*T&amp;Cs apply.</div>
              </div>
              <div className="ex-wm-counter">{modalVault.counter}</div>

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

function VaultCard({ v, onWhitelist }: { v: Vault; onWhitelist: () => void }) {
  return (
    <div className="ex-vc">
      <div className="ex-vc-top">
        <span className={`ex-vc-badge ${v.status}`}>
          <span className="ex-vc-dot" />{v.status === 'live' ? 'Live' : 'Waitlist'}
        </span>
        <button className="ex-vc-wl-btn" onClick={onWhitelist}>Whitelist Wallet</button>
      </div>
      <div className="ex-vc-proto">{v.proto}</div>
      <div className="ex-vc-name">{v.name}</div>
      <p className="ex-vc-desc">{v.desc}</p>
      <div className="ex-vc-stats">
        {v.stats.map((s) => (
          <div className="ex-vc-stat" key={s.l}><div className="ex-vc-sv">{s.v}</div><div className="ex-vc-sl">{s.l}</div></div>
        ))}
      </div>
    </div>
  );
}
