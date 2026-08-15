// Hook: Execute stablecoin transfer to Treasury (multi-chain, multi-token)

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { TREASURY_ADDRESS, type TokenConfig } from '@/config/payment';

export function useUSDCTransfer() {
  const { data: hash, writeContract, error: writeError, isPending } = useWriteContract();

  // NOTE: useWaitForTransactionReceipt's `isSuccess` means "we successfully
  // fetched a receipt" — NOT "the transaction succeeded on-chain". A reverted
  // transaction still produces a fetchable receipt (status: 'reverted'), so
  // callers must check `isReverted` before treating `isConfirmed` as a win.
  const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });
  const isReverted = isConfirmed && receipt?.status === 'reverted';

  const transfer = async (amount: number, tokenConfig: TokenConfig) => {
    try {
      const amountInWei = parseUnits(amount.toString(), tokenConfig.decimals);

      console.log('=== Stablecoin Transfer ===');
      console.log('Token:', tokenConfig.address);
      console.log('Treasury:', TREASURY_ADDRESS);
      console.log('Amount:', amount, '| Decimals:', tokenConfig.decimals);
      console.log('Wei:', amountInWei.toString());
      console.log('===========================');

      writeContract({
        address: tokenConfig.address,
        abi: tokenConfig.abi,
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
    isReverted,
    error: writeError,
  };
}
