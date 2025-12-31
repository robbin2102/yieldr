// Hook: Check USDC Balance on Base

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { USDC_ADDRESS, USDC_DECIMALS } from '@/config/payment';

const USDC_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

export function useUSDCBalance() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState(0);

  const { data, isLoading, refetch } = useReadContract({
    address: USDC_ADDRESS as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && isConnected,
    },
  });

  useEffect(() => {
    if (data) {
      const balanceInUsdc = parseFloat(formatUnits(data as bigint, USDC_DECIMALS));
      setBalance(balanceInUsdc);
    } else {
      setBalance(0);
    }
  }, [data]);

  return {
    balance,
    isLoading,
    refetch,
  };
}
