// Hook: Read stablecoin balances — current chain + scan all supported chains

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { formatUnits, createPublicClient, http, type Chain } from 'viem';
import { base, mainnet, polygon, bsc } from 'viem/chains';
import { robinhoodChain } from '@/lib/chains/robinhoodChain';
import { SUPPORTED_CHAINS, ERC20_ABI, getProxyRpcUrl, type TokenId } from '@/config/payment';

const VIEM_CHAINS: Record<number, Chain> = {
  8453: base,
  1: mainnet,
  137: polygon,
  56: bsc,
  4663: robinhoodChain,
};

export interface ChainBalance {
  chainId: number;
  chainName: string;
  token: TokenId;
  balance: number;
}

export interface ChainScanError {
  chainId: number;
  chainName: string;
  token: TokenId;
  message: string;
}

export function useUSDCBalance(selectedToken: TokenId = 'USDC') {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [balance, setBalance] = useState(0);
  const [otherBalances, setOtherBalances] = useState<ChainBalance[]>([]);
  const [scanErrors, setScanErrors] = useState<ChainScanError[]>([]);
  const [scanDone, setScanDone] = useState(false);
  const scanGenRef = useRef(0);

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

  // Scan all other chains for stablecoin balances + other tokens on current chain.
  // Every chain/token combo is read in PARALLEL with its own timeout, and each
  // result is applied to state as soon as IT resolves — not batched behind the
  // slowest chain. Public RPCs vary a lot in reliability, so waiting for the
  // whole batch to settle before showing anything meant a balance found early
  // (e.g. Base) could sit invisible for many seconds behind one slow/dead RPC.
  // scanGenRef guards against a superseded scan's late results (e.g. the user
  // switches chains mid-scan) clobbering a newer one's.
  const scanAllChains = useCallback(async () => {
    if (!address || !isConnected) return;
    const gen = ++scanGenRef.current;
    setOtherBalances([]);
    setScanErrors([]);
    setScanDone(false);

    console.warn('[Balance] Scanning all chains via RPC proxy.');

    const jobs: Promise<void>[] = [];

    for (const [cId, cfg] of Object.entries(SUPPORTED_CHAINS)) {
      const numId = Number(cId);

      const viemChain = VIEM_CHAINS[numId];
      if (!viemChain) continue;

      const rpcUrl = getProxyRpcUrl(numId);
      if (!rpcUrl) continue;

      const client = createPublicClient({ chain: viemChain, transport: http(rpcUrl, { timeout: 15_000, retryCount: 1 }) });

      for (const [tokenName, tokenCfg] of Object.entries(cfg.tokens)) {
        // Skip the selected token on current chain (already read by useReadContract)
        if (numId === chainId && tokenName === selectedToken) continue;

        jobs.push(
          client
            .readContract({
              address: tokenCfg.address,
              abi: ERC20_ABI,
              functionName: 'balanceOf',
              args: [address],
            })
            .then((raw) => {
              if (scanGenRef.current !== gen) return;
              const bal = parseFloat(formatUnits(raw as bigint, tokenCfg.decimals));
              if (bal <= 0.01) return;
              console.log(`[Balance] Found $${bal.toFixed(2)} ${tokenName} on ${cfg.name}`);
              setOtherBalances((prev) => [
                ...prev,
                { chainId: numId, chainName: cfg.name, token: tokenName as TokenId, balance: bal },
              ]);
            })
            .catch((err) => {
              if (scanGenRef.current !== gen) return;
              // viem's top-level shortMessage is usually a generic phrase
              // ("HTTP request failed." / "The request took too long to
              // respond.") — the actually useful info (status code, response
              // body, root cause) lives on .status / .details /
              // .metaMessages / .cause. Pull all of it so a failure is
              // diagnosable instead of just "it's gone."
              const status = err?.status ?? err?.cause?.status;
              const details = err?.details;
              const metaMessages = Array.isArray(err?.metaMessages) ? err.metaMessages.join(' ') : undefined;
              const causeMessage = err?.cause?.shortMessage || err?.cause?.message;
              const shortMessage = err?.shortMessage || err?.message || String(err);
              const message = [
                shortMessage,
                status ? `HTTP ${status}` : null,
                details && details !== shortMessage ? details : null,
                metaMessages,
                causeMessage && causeMessage !== shortMessage ? causeMessage : null,
              ]
                .filter(Boolean)
                .join(' — ')
                .slice(0, 250);

              // Flat string, not an object arg — see note above on why.
              console.warn(
                `[Balance][RPC FAIL] chain=${cfg.name} token=${tokenName} url=${rpcUrl} ` +
                `errorName=${err?.name} status=${status ?? 'n/a'} shortMessage="${shortMessage}" ` +
                `details="${details ?? 'n/a'}" metaMessages="${metaMessages ?? 'n/a'}" ` +
                `causeName=${err?.cause?.name ?? 'n/a'} causeMessage="${causeMessage ?? 'n/a'}"`
              );

              setScanErrors((prev) => [
                ...prev,
                { chainId: numId, chainName: cfg.name, token: tokenName as TokenId, message },
              ]);
            })
        );
      }
    }

    await Promise.all(jobs);
    if (scanGenRef.current === gen) {
      console.log('[Balance] Scan complete.');
      setScanDone(true);
    }
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
    scanErrors,
    scanDone,
  };
}
