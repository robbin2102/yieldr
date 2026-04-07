// Wagmi and RainbowKit configuration — Multi-chain support
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  phantomWallet,
  rainbowWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { base, mainnet, polygon, bsc } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId && typeof window !== 'undefined') {
  console.warn('WalletConnect Project ID not found. Wallet connection may not work.');
}

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        phantomWallet,
        coinbaseWallet,
        walletConnectWallet,
        rainbowWallet,
        trustWallet,
      ],
    },
  ],
  {
    appName: 'Yieldr',
    projectId,
  }
);

export const config = createConfig({
  connectors,
  chains: [base, mainnet, polygon, bsc],
  ssr: true,
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_RPC_BASE),
    [mainnet.id]: http(process.env.NEXT_PUBLIC_RPC_ETHEREUM),
    [polygon.id]: http(process.env.NEXT_PUBLIC_RPC_POLYGON),
    [bsc.id]: http(process.env.NEXT_PUBLIC_RPC_BSC),
  },
});
