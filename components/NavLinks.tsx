'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount, useDisconnect } from 'wagmi';
import './nav-links.css';

interface NavLinksProps {
  cta?: { href: string; label: string };
  showSocials?: boolean;
}

const TWITTER = 'https://x.com/yieldrdotorg';
const GITHUB = 'https://github.com/robbin2102/yieldr-app';
const TELEGRAM = 'https://web.telegram.org/k/#@yieldrdotorg';

export default function NavLinks({ cta, showSocials = true }: NavLinksProps) {
  const pathname = usePathname();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hasContributions, setHasContributions] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  const profileRef = useRef<HTMLDivElement>(null);

  // Check if user has contributions
  useEffect(() => {
    if (!address) { setHasContributions(false); return; }
    fetch(`/api/contributions?wallet=${address}`)
      .then(r => r.json())
      .then(d => {
        if (d.success && d.data.contributions?.length > 0) {
          setHasContributions(true);
        }
      })
      .catch(() => {});
  }, [address]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileOpen]);

  const isActive = (path: string) => pathname === path;
  const truncAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const handleDisconnect = () => {
    disconnect();
    setProfileOpen(false);
    setHasContributions(false);
  };

  return (
    <>
      {/* Desktop links */}
      <nav className="ynav-links">
        <Link href="/" className={isActive('/') ? 'active' : ''}>Home</Link>
        <Link href="/vaults" className={isActive('/vaults') ? 'active' : ''}>Vaults</Link>
        <Link href="/build-in-public" className={isActive('/build-in-public') ? 'active' : ''}>Build Log</Link>
        <Link href="/allocations" className={`ynav-alloc${isActive('/allocations') ? ' active' : ''}`}>Allocations</Link>
        <a href={TELEGRAM} target="_blank" rel="noopener noreferrer">TG Channel</a>
      </nav>

      {showSocials && (
        <div className="ynav-soc">
          <a href={TWITTER} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </div>
      )}

      {/* Wallet profile (replaces CTA when connected with contributions) */}
      {isConnected && hasContributions ? (
        <div className="ynav-profile" ref={profileRef}>
          <button className="ynav-profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
            <span className="ynav-profile-dot" />
            {truncAddr}
            <svg className={`ynav-profile-chevron${profileOpen ? ' open' : ''}`} width="10" height="10" viewBox="0 0 10 10"><path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg>
          </button>
          {profileOpen && (
            <div className="ynav-profile-dropdown">
              <Link href="/allocations" className="ynav-profile-item" onClick={() => setProfileOpen(false)}>
                My Allocations
              </Link>
              <Link href="/buy" className="ynav-profile-item" onClick={() => setProfileOpen(false)}>
                Buy More
              </Link>
              <div className="ynav-profile-divider" />
              <button className="ynav-profile-item ynav-disconnect" onClick={handleDisconnect}>
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
      ) : cta ? (
        <Link href={cta.href} className="ynav-cta">{cta.label}</Link>
      ) : null}

      {/* Hamburger button (mobile) */}
      <button
        className="ynav-hamburger"
        onTouchEnd={e => { e.preventDefault(); setMenuOpen(true); }}
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        <span /><span /><span />
      </button>

      {/* Mobile menu overlay — rendered via portal to escape nav stacking context */}
      {mounted && menuOpen && createPortal(
        <div className="ynav-overlay" onClick={() => setMenuOpen(false)} onTouchEnd={() => setMenuOpen(false)}>
          <div className="ynav-menu" onClick={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
            <div className="ynav-menu-head">
              <div className="ynav-menu-brand">
                <svg width="20" height="24" viewBox="0 0 100 120">
                  <path d="M50 10Q70 30 80 60Q70 90 50 110Q30 90 20 60Q30 30 50 10Z" fill="#00E87B"/>
                  <ellipse cx="50" cy="60" rx="15" ry="20" fill="#000" opacity=".3"/>
                  <circle cx="50" cy="60" r="8" fill="#FFF" opacity=".9"/>
                </svg>
                <span>YIELDR</span>
              </div>
              <button className="ynav-menu-close" onClick={() => setMenuOpen(false)}>&#10005;</button>
            </div>

            {/* Mobile wallet info */}
            {isConnected && address && (
              <div className="ynav-menu-wallet">
                <span className="ynav-profile-dot" />
                <span>{truncAddr}</span>
              </div>
            )}

            <div className="ynav-menu-links">
              <Link href="/" className={isActive('/') ? 'active' : ''}>Home</Link>
              <Link href="/vaults" className={isActive('/vaults') ? 'active' : ''}>Vaults</Link>
              <Link href="/build-in-public" className={isActive('/build-in-public') ? 'active' : ''}>Build Log</Link>
              <Link href="/docs" className={isActive('/docs') ? 'active' : ''}>Docs</Link>
              <Link href="/allocations" className={`ynav-alloc-mobile${isActive('/allocations') ? ' active' : ''}`}>Allocations</Link>
              <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" className="ynav-tg">TG Channel ↗</a>
            </div>
            <div className="ynav-menu-footer">
              {isConnected ? (
                <button className="ynav-menu-disconnect" onClick={() => { handleDisconnect(); setMenuOpen(false); }}>
                  Disconnect Wallet
                </button>
              ) : null}
              {cta ? (
                <Link href={cta.href} className="ynav-menu-cta">{cta.label}</Link>
              ) : (
                <Link href="/buy" className="ynav-menu-cta">Buy YLDR &#8599;</Link>
              )}
              <div className="ynav-menu-soc">
                <a href={TWITTER} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
