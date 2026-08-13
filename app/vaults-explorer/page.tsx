'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { QuantWaitlistModal } from '../components/QuantWaitlistModal';
import { VaultWaitlistModal } from '../components/VaultWaitlistModal';
import '../landing.css';
import './vaults-explorer.css';

const FEATURED_VAULTS = [
  {
    id: 'virtuals-robotics-infra',
    chain: 'base' as const,
    chainLabel: 'BASE',
    category: '🤖 Virtuals · Base · Robotics Infra',
    title: '🦾 Virtuals Robotics Infra Vault',
    desc: 'Agent researches new Virtuals launches on Base, monitors project milestones, detects degen-sell signals from top wallets, and accumulates high-conviction robotics and AI infrastructure tokens for long-term value growth.',
    aum: '$40.0K',
    fee: '≤20%',
    baseline: 20,
  },
  {
    id: 'spacex-rwa',
    chain: 'hood' as const,
    chainLabel: 'HOOD CHAIN',
    category: '🏦 HOOD Chain · Robinhood Chain · RWA',
    title: '🚀 SpaceX RWA Vault',
    desc: 'Accumulates SPCX tokenized equity natively on Robinhood Chain, following wallets with the highest post-IPO RWA spot edge.',
    aum: '$438.8K',
    fee: '≤25%',
    baseline: 39,
  },
];

const UPCOMING_VAULTS = [
  { id: 'avantis-perps-momentum', chain: 'base' as const, chainLabel: 'BASE', title: 'Avantis Perps Momentum Vault', category: '📈 Avantis · Perps' },
  { id: 'hyperliquid-og-flow', chain: 'other' as const, chainLabel: 'HYPERLIQUID', title: 'Hyperliquid OG Flow Vault', category: '📊 Hyperliquid · Perps' },
  { id: 'aerodrome-lp-rotation', chain: 'base' as const, chainLabel: 'BASE', title: 'Aerodrome LP Rotation Vault', category: '🌀 Aerodrome · DeFi LP' },
  { id: 'uniswap-alpha-rotation', chain: 'base' as const, chainLabel: 'BASE', title: 'Uniswap Alpha Rotation Vault', category: '🦄 Uniswap · DEX' },
  { id: 'polymarket-smart-money', chain: 'other' as const, chainLabel: 'POLYGON', title: 'Polymarket Smart Money Vault', category: '🎲 Polymarket · Prediction Markets' },
  { id: 'fomo-meme-momentum', chain: 'base' as const, chainLabel: 'BASE', title: 'FOMO Meme Momentum Vault', category: '🔥 FOMO · Memecoins' },
  { id: 'pumpfun-sniper-defense', chain: 'other' as const, chainLabel: 'SOLANA', title: 'pump.fun Sniper Defense Vault', category: '🎯 pump.fun · Memecoins' },
  { id: 'hood-rwa-basket', chain: 'hood' as const, chainLabel: 'HOOD CHAIN', title: 'HOOD Chain RWA Basket Vault', category: '🏦 Robinhood Chain · RWA' },
  { id: 'solana-og-wallet', chain: 'other' as const, chainLabel: 'SOLANA', title: 'Solana OG Wallet Vault', category: '🐊 Solana · Memecoins' },
  { id: 'cross-chain-yield-rotation', chain: 'other' as const, chainLabel: 'MULTI-CHAIN', title: 'Cross-Chain Yield Rotation Vault', category: '♻️ Multi-Chain · Yield' },
];

export default function VaultsExplorerPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [vaultModal, setVaultModal] = useState<{ id: string; name: string } | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(FEATURED_VAULTS.map((v) => [v.id, v.baseline]))
  );

  useEffect(() => {
    FEATURED_VAULTS.forEach((v) => {
      fetch(`/api/vault-waitlist?vault=${v.id}`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.success && typeof d.count === 'number') {
            setCounts((prev) => ({ ...prev, [v.id]: d.count }));
          }
        })
        .catch(() => {});
    });
  }, []);

  return (
    <div className="hp-root">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <div className="hp-nav">
        <div className="hp-wrap hp-nav-in">
          <Link href="/" className="hp-nav-id" style={{ textDecoration: 'none' }}>
            <div className="hp-nav-mark">
              <img src="/nav-mark.png" alt="Yieldr" />
            </div>
            <div className="hp-nav-name">YIELDR</div>
          </Link>
          <div className="hp-nav-right">
            <div className={`hp-nav-links${mobileNavOpen ? ' hp-open' : ''}`}>
              <Link href="/vaults-explorer">Vaults</Link>
              <Link href="/buy">Buy</Link>
              <Link href="/build-in-public">Build Log</Link>
              <Link href="/docs">Docs</Link>
              <Link href="/team">Team</Link>
            </div>
            <button className="hp-nav-cta" onClick={() => setWaitlistModalOpen(true)}>Join Quant Waitlist</button>
            <button
              className="hp-nav-burger"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileNavOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      <div className="hp-sec" style={{ paddingBottom: 0 }}>
        <div className="hp-wrap">
          <div className="hp-slbl"><span>Agent Vaults</span><span className="hp-ln" /></div>
          <h1 className="hp-sec-h" style={{ fontSize: 'clamp(28px,4vw,40px)' }}>12 agent vaults are already gathering commitments.</h1>
          <p className="hp-sec-p" style={{ maxWidth: 640 }}>
            Together targeting $1.8M in AUM across Base, HOOD Chain, and beyond. Whitelist a wallet now to be
            first in when Agent Vaults open — this is what Phase 4 (Allocation Agent) turns into real,
            depositable funds.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, margin: '22px 0', border: '1px solid var(--hair)', borderRadius: 14, overflow: 'hidden', background: 'var(--hair)' }}>
            <div style={{ background: 'var(--surface)', padding: '16px 20px', textAlign: 'center' }}>
              <div className="hp-tok-stat2"><div className="hp-k" style={{ fontSize: 9.5 }}>Agent Vaults</div><div className="hp-v" style={{ fontSize: 20 }}>12</div></div>
            </div>
            <div style={{ background: 'var(--surface)', padding: '16px 20px', textAlign: 'center' }}>
              <div className="hp-tok-stat2"><div className="hp-k" style={{ fontSize: 9.5 }}>Target AUM</div><div className="hp-v" style={{ fontSize: 20, color: 'var(--win)' }}>$1.8M</div></div>
            </div>
            <div style={{ background: 'var(--surface)', padding: '16px 20px', textAlign: 'center' }}>
              <div className="hp-tok-stat2"><div className="hp-k" style={{ fontSize: 9.5 }}>Live for Deposits</div><div className="hp-v" style={{ fontSize: 20 }}>0</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="hp-sec" style={{ paddingTop: 20 }}>
        <div className="hp-wrap">
          <div className="hp-slbl"><span>Featured</span><span className="hp-ln" /></div>
          <div className="hp-vault2-grid">
            {FEATURED_VAULTS.map((v) => (
              <div className="hp-vcard2" key={v.id}>
                <div className="hp-vcard2-badges">
                  <span className="hp-vb-waitlist"><span className="hp-dt" />WAITLIST</span>
                  <span className={`hp-vb-chain hp-${v.chain}`}>{v.chainLabel}</span>
                  <button className="hp-vb-cta" onClick={() => setVaultModal({ id: v.id, name: v.title })}>Whitelist Wallet</button>
                </div>
                <div className="hp-vcard2-cat">{v.category}</div>
                <div className="hp-vcard2-title">{v.title}</div>
                <p className="hp-vcard2-desc">{v.desc}</p>
                <div className="hp-vcard2-stats">
                  <div className="hp-vcard2-stat"><div className="hp-v">{v.aum}</div><div className="hp-k">TARGET AUM</div></div>
                  <div className="hp-vcard2-stat"><div className="hp-v">{v.fee}</div><div className="hp-k">PERF FEE</div></div>
                  <div className="hp-vcard2-stat"><div className="hp-v">{counts[v.id] ?? v.baseline}</div><div className="hp-k">WAITLISTED</div></div>
                </div>
                <div className="hp-vcard2-foot">{counts[v.id] ?? v.baseline} wallets whitelisted</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hp-sec" style={{ paddingTop: 0 }}>
        <div className="hp-wrap">
          <div className="hp-slbl"><span>In Development</span><span className="hp-ln" /></div>
          <p className="hp-sec-p" style={{ marginTop: 0, marginBottom: 20 }}>
            10 more vaults across Avantis, Hyperliquid, Aerodrome, and more chains — opening to depositors as
            the Allocation Agent ships.
          </p>
          <div className="ve-grid">
            {UPCOMING_VAULTS.map((v) => (
              <div className="ve-card" key={v.id}>
                <div className="ve-card-top">
                  <span className={`hp-vb-chain hp-${v.chain}`}>{v.chainLabel}</span>
                  <span className="ve-card-status">In Development</span>
                </div>
                <div className="ve-card-cat">{v.category}</div>
                <div className="ve-card-title">{v.title}</div>
                <button className="ve-card-cta" onClick={() => setVaultModal({ id: v.id, name: v.title })}>Notify Me →</button>
              </div>
            ))}
          </div>
          <div className="hp-vault-legal" style={{ marginTop: 20 }}>
            Vaults are not yet live for outside deposits · Target figures are estimates, not guarantees · Not available to residents of restricted jurisdictions.
          </div>
        </div>
      </div>

      <div className="hp-foot">
        <div className="hp-wrap hp-foot-in">
          <div className="hp-foot-l">
            © 2026 Yieldr · Agent stack for onchain funds ·{' '}
            <a href="https://www.yieldr.org" style={{ textDecoration: 'none' }}>yieldr.org</a>
          </div>
          <div className="hp-foot-r">
            <a href="https://x.com/yieldrdotorg" target="_blank" rel="noopener noreferrer">X</a>
            <Link href="/vaults-explorer">Vaults</Link>
            <Link href="/buy">Buy</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/build-in-public">Build Log</Link>
            <Link href="/team">Team</Link>
          </div>
        </div>
      </div>

      <QuantWaitlistModal isOpen={waitlistModalOpen} onClose={() => setWaitlistModalOpen(false)} />
      {vaultModal && (
        <VaultWaitlistModal
          isOpen={Boolean(vaultModal)}
          onClose={() => setVaultModal(null)}
          vaultId={vaultModal.id}
          vaultName={vaultModal.name}
        />
      )}
    </div>
  );
}
