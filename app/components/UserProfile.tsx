'use client';

// User Profile Dropdown Component

import { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useUSDCBalance } from '@/hooks/useUSDCBalance';
import { formatUsd } from '@/lib/tierCalculations';

interface UserProfileProps {
  onViewAllocation: () => void;
}

// Generate consistent random avatar based on wallet address
function getAvatarForAddress(address: string): string {
  const avatars = ['👤', '🧑', '👨', '👩', '🧔', '👱', '🧑‍🦰', '👨‍🦱', '👩‍🦳', '🧑‍🦲'];
  const index = parseInt(address.slice(2, 4), 16) % avatars.length;
  return avatars[index];
}

export function UserProfile({ onViewAllocation }: UserProfileProps) {
  const { address } = useAccount();
  const { balance } = useUSDCBalance();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (!address) return null;

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const avatar = getAvatarForAddress(address);

  return (
    <div className="user-profile" ref={dropdownRef}>
      <button
        className="profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
      >
        <span className="profile-avatar">{avatar}</span>
        <span className="profile-address">{truncatedAddress}</span>
        <span className="profile-chevron">▼</span>
      </button>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <span className="profile-avatar-large">{avatar}</span>
            <div className="profile-info">
              <div className="profile-address-full">{truncatedAddress}</div>
              <div className="profile-balance">
                <span className="balance-label">USDC Balance:</span>
                <span className="balance-value">{formatUsd(balance)}</span>
              </div>
            </div>
          </div>

          <div className="profile-dropdown-divider"></div>

          <button
            className="profile-menu-item"
            onClick={() => {
              setIsOpen(false);
              onViewAllocation();
            }}
          >
            <span className="menu-item-icon">📊</span>
            <span className="menu-item-text">My Allocation</span>
          </button>

          <button
            className="profile-menu-item"
            onClick={() => {
              window.open('https://basescan.org/address/' + address, '_blank');
            }}
          >
            <span className="menu-item-icon">🔍</span>
            <span className="menu-item-text">View on Basescan</span>
          </button>
        </div>
      )}
    </div>
  );
}
