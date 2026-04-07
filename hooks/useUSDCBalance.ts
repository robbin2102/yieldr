// Hook: Read stablecoin balances — current chain + scan all supported chains

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { formatUnits, createPublicClient, http } from 'viem';
import { base, mainnet, polygon, bsc } from 'viem/chains';
import { SUPPORTED_CHAINS, ERC20_ABI, type TokenId } from '@/config/payment';

const VIEM_CHAINS: Record<number, typeof base> = {
  8453: base,
  1: mainnet,
  137: polygon,
  56: bsc,
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

  // Scan all other chains for stablecoin balances
  const scanAllChains = useCallback(async () => {
    if (!address || !isConnected) return;
    setScanDone(false);

    console.log('[Balance] Scanning all chains for stablecoins...');
    const results: ChainBalance[] = [];

    for (const [cId, cfg] of Object.entries(SUPPORTED_CHAINS)) {
      const numId = Number(cId);
      if (numId === chainId) continue; // skip current chain

      const viemChain = VIEM_CHAINS[numId];
      if (!viemChain) continue;

      const client = createPublicClient({ chain: viemChain, transport: http() });

      for (const [tokenName, tokenCfg] of Object.entries(cfg.tokens)) {
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
  }, [address, isConnected, chainId]);

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
