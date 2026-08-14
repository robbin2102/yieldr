// Hook: Read stablecoin balances — current chain + scan all supported chains

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { formatUnits, createPublicClient, http, type Chain } from 'viem';
import { base, mainnet, polygon, bsc } from 'viem/chains';
import { robinhoodChain } from '@/lib/chains/robinhoodChain';
import { SUPPORTED_CHAINS, ERC20_ABI, type TokenId } from '@/config/payment';

const VIEM_CHAINS: Record<number, Chain> = {
  8453: base,
  1: mainnet,
  137: polygon,
  56: bsc,
  4663: robinhoodChain,
};

// QuickNode RPCs from env vars (fallback to public RPCs)
const PUBLIC_RPCS: Record<number, string> = {
  8453: process.env.NEXT_PUBLIC_RPC_BASE || 'https://mainnet.base.org',
  1: process.env.NEXT_PUBLIC_RPC_ETHEREUM || 'https://eth.llamarpc.com',
  137: process.env.NEXT_PUBLIC_RPC_POLYGON || 'https://polygon.llamarpc.com',
  56: process.env.NEXT_PUBLIC_RPC_BSC || 'https://bsc-dataseed.binance.org',
  4663: process.env.NEXT_PUBLIC_RPC_ROBINHOOD || 'https://rpc.mainnet.chain.robinhood.com',
};

export interface ChainBalance {
  chainId: number;
  chainName: string;
  token: TokenId;
  balance: number;
}

export function useUSDCBalance(selectedToken: TokenId = 'USDC') {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [balance, setBalance] = useState(0);
  const [otherBalances, setOtherBalances] = useState<ChainBalance[]>([]);
  const [scanDone, setScanDone] = useState(false);

  const chainConfig = SUPPORTED_CHAINS[chainId];
  const tokenConfig = chainConfig?.tokens[selectedToken];

  // Read balance on current chain
  const { data, isLoading, refetch } = useReadContract({
    address: tokenConfig?.address,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected && !!tokenConfig,
    },
  });

  useEffect(() => {
    if (data && tokenConfig) {
      const bal = parseFloat(formatUnits(data as bigint, tokenConfig.decimals));
      console.log(`[Balance] ${selectedToken} on ${chainConfig?.name}: $${bal.toFixed(2)}`);
      setBalance(bal);
    } else {
      setBalance(0);
    }
  }, [data, tokenConfig?.decimals]);

  // Scan all other chains for stablecoin balances + other tokens on current chain
  const scanAllChains = useCallback(async () => {
    if (!address || !isConnected) return;
    setScanDone(false);

    console.log('[Balance] Scanning all chains for stablecoins...');
    const results: ChainBalance[] = [];

    for (const [cId, cfg] of Object.entries(SUPPORTED_CHAINS)) {
      const numId = Number(cId);

      const viemChain = VIEM_CHAINS[numId];
      if (!viemChain) continue;

      const rpcUrl = PUBLIC_RPCS[numId];
      if (!rpcUrl) continue;

      const client = createPublicClient({ chain: viemChain, transport: http(rpcUrl) });

      for (const [tokenName, tokenCfg] of Object.entries(cfg.tokens)) {
        // Skip the selected token on current chain (already read by useReadContract)
        if (numId === chainId && tokenName === selectedToken) continue;

        try {
          const raw = await client.readContract({
            address: tokenCfg.address,
            abi: ERC20_ABI,
            functionName: 'balanceOf',
            args: [address],
          });
          const bal = parseFloat(formatUnits(raw as bigint, tokenCfg.decimals));
          if (bal > 0.01) {
            console.log(`[Balance] Found $${bal.toFixed(2)} ${tokenName} on ${cfg.name}`);
            results.push({ chainId: numId, chainName: cfg.name, token: tokenName as TokenId, balance: bal });
          }
        } catch (err) {
          console.warn(`[Balance] Failed to read ${tokenName} on ${cfg.name}:`, err);
        }
      }
    }

    console.log(`[Balance] Scan complete. Found ${results.length} balances on other chains.`);
    setOtherBalances(results);
    setScanDone(true);
  }, [address, isConnected, chainId, selectedToken]);

  // Trigger scan when wallet connects or chain changes
  useEffect(() => {
    if (isConnected && address) {
      scanAllChains();
    }
  }, [isConnected, address, chainId, scanAllChains]);

  return {
    balance,
    isLoading,
    refetch,
    otherBalances,
    scanDone,
  };
}
