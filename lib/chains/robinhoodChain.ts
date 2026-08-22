// Robinhood Chain — not (yet) part of viem's bundled chain list, so it's
// defined here manually. Mainnet launched July 1, 2026.
//
// Chain ID, RPC, explorer, and native gas token confirmed via Robinhood's
// own RPC-provider documentation and the official Arbitrum mainnet-launch
// announcement (Robinhood Chain is an Arbitrum Orbit chain settling to
// Ethereum, gas paid in ETH).

import { defineChain } from 'viem';

export const robinhoodChain = defineChain({
  id: 4663,
  name: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.mainnet.chain.robinhood.com'] },
  },
  blockExplorers: {
    default: { name: 'Robinhood Chain Explorer', url: 'https://robinhoodchain.blockscout.com' },
  },
});
