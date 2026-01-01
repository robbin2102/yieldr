// Hook: Execute USDC Transfer to Treasury

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, erc20Abi } from 'viem';
import { USDC_ADDRESS, USDC_DECIMALS, TREASURY_ADDRESS } from '@/config/payment';

export function useUSDCTransfer() {
  const { data: hash, writeContract, error: writeError, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const transfer = async (amount: number) => {
    try {
      const amountInWei = parseUnits(amount.toString(), USDC_DECIMALS);

      console.log('=== USDC Transfer Details ===');
      console.log('USDC Contract Address:', USDC_ADDRESS);
      console.log('Treasury Address:', TREASURY_ADDRESS);
      console.log('Amount (USDC):', amount);
      console.log('Amount (Wei):', amountInWei.toString());
      console.log('Amount (BigInt):', amountInWei);
      console.log('Using erc20Abi from viem');
      console.log('============================');

      writeContract({
        address: USDC_ADDRESS as `0x${string}`,
        abi: erc20Abi,
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
