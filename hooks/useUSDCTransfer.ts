// Hook: Execute USDC Transfer to Treasury

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { USDC_ADDRESS, USDC_DECIMALS, TREASURY_ADDRESS } from '@/config/payment';

const USDC_ABI = [
  {
    type: 'function',
    name: 'transfer',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export function useUSDCTransfer() {
  const { data: hash, writeContract, error: writeError, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const transfer = async (amount: number) => {
    try {
      const amountInWei = parseUnits(amount.toString(), USDC_DECIMALS);

      writeContract({
        address: USDC_ADDRESS as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'transfer',
        args: [TREASURY_ADDRESS as `0x${string}`, amountInWei],
      });
    } catch (error) {
      console.error('Transfer error:', error);
      throw error;
    }
  };

  return {
    transfer,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: writeError,
  };
}
