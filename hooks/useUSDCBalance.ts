// Hook: Read stablecoin balance on current chain

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { formatUnits } from 'viem';
import { SUPPORTED_CHAINS, ERC20_ABI, type TokenId } from '@/config/payment';

export function useUSDCBalance(selectedToken: TokenId = 'USDC') {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [balance, setBalance] = useState(0);

  const chainConfig = SUPPORTED_CHAINS[chainId];
  const tokenConfig = chainConfig?.tokens[selectedToken];

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
      setBalance(bal);
    } else {
      setBalance(0);
    }
  }, [data, tokenConfig?.decimals]);

  return {
    balance,
    isLoading,
    refetch,
  };
}
