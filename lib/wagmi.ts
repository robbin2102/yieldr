// Wagmi and RainbowKit configuration
'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId && typeof window !== 'undefined') {
  console.warn('WalletConnect Project ID not found. Wallet connection may not work.');
}

// Only initialize on client side to avoid localStorage errors during SSR
export const getWagmiConfig = () => {
  if (typeof window === 'undefined') {
    // Return a minimal config for SSR
    return null as any;
  }

  return getDefaultConfig({
    appName: 'Yieldr',
    projectId,
    chains: [base],
    ssr: true,
  });
};

export const config = getWagmiConfig();
