// Payment Configuration Constants

// Treasury Safe Wallet (same address on all chains via CREATE2)
export const TREASURY_ADDRESS = '0xB56C6247F39A992dbcF172a4308386A23d0ea15C';

// Contribution Limits
export const MIN_CONTRIBUTION = 1; // $1 minimum for testing

// Discord
export const DISCORD_INVITE = 'https://discord.gg/c8qq9DKkjM';

// API Authentication
export const API_AUTH_KEY = process.env.API_AUTH_KEY || '';

// API Endpoints
export const API_ENDPOINTS = {
  raiseStats: '/api/raise-stats',
  contributions: '/api/contributions',
  allocate: '/api/allocate',
} as const;

// ── Standard ERC20 ABI (works for USDC everywhere + USDT on Polygon/BSC) ──
export const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

// ── USDT on Ethereum — non-standard, returns void instead of bool ──
export const USDT_ETH_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

// ── Stablecoin config per chain ──
export type TokenId = 'USDC' | 'USDT' | 'USDG';
export const TOKEN_IDS: TokenId[] = ['USDC', 'USDT', 'USDG'];

export interface TokenConfig {
  address: `0x${string}`;
  decimals: number;
  abi: typeof ERC20_ABI | typeof USDT_ETH_ABI;
}

export type ChainTokens = Partial<Record<TokenId, TokenConfig>>;

export const SUPPORTED_CHAINS: Record<number, { name: string; explorer: string; tokens: ChainTokens }> = {
  8453: {
    name: 'Base',
    explorer: 'https://basescan.org',
    tokens: {
      USDC: {
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        decimals: 6,
        abi: ERC20_ABI,
      },
    },
  },
  1: {
    name: 'Ethereum',
    explorer: 'https://etherscan.io',
    tokens: {
      USDC: {
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
        abi: ERC20_ABI,
      },
      USDT: {
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
        abi: USDT_ETH_ABI,
      },
    },
  },
  137: {
    name: 'Polygon',
    explorer: 'https://polygonscan.com',
    tokens: {
      USDC: {
        address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        decimals: 6,
        abi: ERC20_ABI,
      },
      USDT: {
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        decimals: 6,
        abi: ERC20_ABI,
      },
    },
  },
  56: {
    name: 'BNB Chain',
    explorer: 'https://bscscan.com',
    tokens: {
      USDC: {
        address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
        decimals: 18,
        abi: ERC20_ABI,
      },
      USDT: {
        address: '0x55d398326f99059fF775485246999027B3197955',
        decimals: 18,
        abi: ERC20_ABI,
      },
    },
  },
  4663: {
    name: 'Robinhood Chain',
    explorer: 'https://robinhoodchain.blockscout.com',
    tokens: {
      USDG: {
        address: '0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168',
        decimals: 6,
        abi: ERC20_ABI,
      },
    },
  },
};

export const PREFERRED_CHAIN_ID = 8453; // Base

// ── RPC proxy (standalone service, e.g. hosted on Railway) ──
//
// The real RPC provider keys (Alchemy etc.) live ONLY on that service, never
// in this app's env vars. This app just needs to know where the proxy is —
// that URL is not a secret, it's our own address, so it's fine to be
// NEXT_PUBLIC_. The proxy allowlists a fixed set of read-only JSON-RPC
// methods and rejects everything else, so even if this URL is scraped it
// can't be used to send transactions or as a general-purpose RPC gateway.
export const RPC_PROXY_BASE_URL = process.env.NEXT_PUBLIC_RPC_PROXY_URL || 'http://localhost:8787';

// Chain ID -> the path segment the proxy exposes for it (see rpc-proxy/server.js)
export const RPC_PROXY_CHAIN_PATHS: Record<number, string> = {
  8453: 'base',
  1: 'ethereum',
  137: 'polygon',
  56: 'bsc',
  4663: 'robinhood',
};

export function getProxyRpcUrl(chainId: number): string | undefined {
  const path = RPC_PROXY_CHAIN_PATHS[chainId];
  return path ? `${RPC_PROXY_BASE_URL}/rpc/${path}` : undefined;
}

// Helper: get explorer URL for a chain
export function getExplorerUrl(chainId: number): string {
  return SUPPORTED_CHAINS[chainId]?.explorer ?? 'https://basescan.org';
}

// Legacy exports for backward compatibility
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const USDC_DECIMALS = 6;
export const CHAIN_ID = 8453;
export const NETWORK_NAME = 'Base';
export const EXPLORER_URL = 'https://basescan.org';
