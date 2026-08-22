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
import { robinhoodChain } from './chains/robinhoodChain';
import { getProxyRpcUrl } from '@/config/payment';

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
  chains: [base, mainnet, polygon, bsc, robinhoodChain],
  ssr: true,
  // Every chain reads through the RPC proxy — the real provider keys live
  // only on that service, never in this app's own env vars.
  transports: {
    [base.id]: http(getProxyRpcUrl(base.id)),
    [mainnet.id]: http(getProxyRpcUrl(mainnet.id)),
    [polygon.id]: http(getProxyRpcUrl(polygon.id)),
    [bsc.id]: http(getProxyRpcUrl(bsc.id)),
    [robinhoodChain.id]: http(getProxyRpcUrl(robinhoodChain.id)),
  },
});
