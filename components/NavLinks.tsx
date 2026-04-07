'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import './nav-links.css';

interface NavLinksProps {
  cta?: { href: string; label: string };
  showSocials?: boolean;
}

const TWITTER = 'https://x.com/yieldrdotorg';
const GITHUB = 'https://github.com/robbin2102/yieldr-app';

export default function NavLinks({ cta, showSocials = true }: NavLinksProps) {
  const pathname = usePathname();
  const { isConnected } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasContributions, setHasContributions] = useState(false);
  const { address } = useAccount();

  // Check if user has contributions (show Allocations link)
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
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Desktop links */}
      <nav className="ynav-links">
        <Link href="/" className={isActive('/') ? 'active' : ''}>Home</Link>
        <Link href="/vaults" className={isActive('/vaults') ? 'active' : ''}>Vaults</Link>
        <Link href="/build-in-public" className={isActive('/build-in-public') ? 'active' : ''}>Build Log</Link>
        {(isConnected && hasContributions) && (
          <Link href="/allocations" className={`ynav-alloc${isActive('/allocations') ? ' active' : ''}`}>Allocations</Link>
        )}
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

      {cta && (
        <Link href={cta.href} className="ynav-cta">{cta.label}</Link>
      )}

      {/* Hamburger button (mobile) */}
      <button className="ynav-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
        <span /><span /><span />
      </button>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="ynav-overlay" onClick={() => setMenuOpen(false)}>
          <div className="ynav-menu" onClick={e => e.stopPropagation()}>
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
            <div className="ynav-menu-links">
              <Link href="/" className={isActive('/') ? 'active' : ''}>Home</Link>
              <Link href="/vaults" className={isActive('/vaults') ? 'active' : ''}>Vaults</Link>
              <Link href="/build-in-public" className={isActive('/build-in-public') ? 'active' : ''}>Build Log</Link>
              <Link href="/docs" className={isActive('/docs') ? 'active' : ''}>Docs</Link>
              {(isConnected && hasContributions) && (
                <Link href="/allocations" className={`ynav-alloc-mobile${isActive('/allocations') ? ' active' : ''}`}>Allocations</Link>
              )}
            </div>
            <div className="ynav-menu-footer">
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
        </div>
      )}
    </>
  );
}
