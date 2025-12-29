// Wagmi and RainbowKit configuration
'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
  console.warn('WalletConnect Project ID not found. Wallet connection may not work.');
}

export const config = getDefaultConfig({
  appName: 'Yieldr',
  projectId,
  chains: [base],
  ssr: true,
});
