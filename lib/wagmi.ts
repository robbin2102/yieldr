// Wagmi and RainbowKit configuration
'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';
import type { Config } from 'wagmi';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId && typeof window !== 'undefined') {
  console.warn('WalletConnect Project ID not found. Wallet connection may not work.');
}

let wagmiConfig: Config | undefined;

export const config = typeof window !== 'undefined'
  ? (() => {
      if (!wagmiConfig) {
        wagmiConfig = getDefaultConfig({
          appName: 'Yieldr',
          projectId,
          chains: [base],
          ssr: true,
        });
      }
      return wagmiConfig;
    })()
  : {} as Config;
