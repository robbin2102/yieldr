// Hook: Orchestrate Complete Payment Flow (multi-chain, multi-token)

import { useEffect, useRef } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useUSDCBalance } from './useUSDCBalance';
import { useUSDCTransfer } from './useUSDCTransfer';
import { usePayment } from '@/app/context/PaymentContext';
import { useRaiseStats, useAllocationPreview } from './useRaiseStats';
import { SUPPORTED_CHAINS, type TokenId } from '@/config/payment';

export function usePaymentFlow(selectedToken: TokenId = 'USDC') {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  const { balance, refetch: refetchBalance, otherBalances, scanDone } = useUSDCBalance(selectedToken);
  const { transfer, hash, isPending, isConfirming, isConfirmed, error: transferError } = useUSDCTransfer();
  const { contributionAmount, selectedVault, setStatus, setTxHash, setAllocationData, setHasCompletedPayment } = usePayment();
  const { totalRaised } = useRaiseStats();
  const allocation = useAllocationPreview(contributionAmount, totalRaised);

  const recordedTransactions = useRef<Set<string>>(new Set());

  const chainConfig = SUPPORTED_CHAINS[chainId];
  const tokenConfig = chainConfig?.tokens[selectedToken];
  const isSupported = !!chainConfig;

  // Log connection state
  useEffect(() => {
    if (isConnected && address) {
      console.log('=== Payment Flow State ===');
      console.log('Address:', address);
      console.log('Chain:', chain?.name, '(', chainId, ')');
      console.log('Supported:', isSupported);
      console.log('Token:', selectedToken);
      console.log('Token Config:', tokenConfig ? `${tokenConfig.address} (${tokenConfig.decimals} decimals)` : 'NONE');
      console.log('Balance:', balance);
      console.log('Amount:', contributionAmount);
      console.log('Can pay:', isSupported && !!tokenConfig && balance >= contributionAmount);
      console.log('==========================');
    }
  }, [isConnected, address, chainId, balance, selectedToken, contributionAmount]);

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && hash && !recordedTransactions.current.has(hash)) {
      console.log('Payment confirmed! Hash:', hash);
      recordedTransactions.current.add(hash);
      setTxHash(hash);
      setStatus('success');
      setAllocationData({
        yldrAmount: allocation.yldrAmount,
        effectivePrice: allocation.effectivePrice,
        breakdown: allocation.breakdown,
      });
      setHasCompletedPayment(true);
      recordContribution(hash);
      refetchBalance();
    }
  }, [isConfirmed, hash]);

  // Handle errors
  useEffect(() => {
    if (transferError) {
      console.error('Transfer error:', transferError);
      setStatus('error');
    }
  }, [transferError]);

  // Handle pending/confirming states
  useEffect(() => {
    if (isPending || isConfirming) {
      setStatus('processing');
    }
  }, [isPending, isConfirming]);

  const recordContribution = async (txHash: string) => {
    try {
      const payload = {
        wallet_address: address,
        usdc_amount: contributionAmount,
        tx_hash: txHash,
        network: chainConfig?.name ?? 'Base',
        chain_id: chainId,
        token: selectedToken,
        selected_vault: selectedVault ?? undefined,
      };

      console.log('Recording contribution:', payload);

      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success && data.data.discord_invite) {
        setAllocationData({
          yldrAmount: allocation.yldrAmount,
          effectivePrice: allocation.effectivePrice,
          breakdown: allocation.breakdown,
          discord_invite: data.data.discord_invite,
        });
      }
    } catch (error) {
      console.error('Error recording contribution:', error);
    }
  };

  const initiatePayment = async () => {
    try {
      console.log('=== initiatePayment ===');
      console.log('Connected:', isConnected, '| Supported:', isSupported);
      console.log('Token:', selectedToken, '| Balance:', balance, '| Amount:', contributionAmount);

      if (!isConnected) {
        if (openConnectModal) openConnectModal();
        return;
      }

      if (!isSupported || !tokenConfig) {
        console.error('Chain not supported or token not available');
        setStatus('error');
        return;
      }

      if (balance < contributionAmount) {
        console.error(`Insufficient balance: have $${balance}, need $${contributionAmount}`);
        setStatus('error');
        return;
      }

      setStatus('processing');
      console.log('Calling transfer:', contributionAmount, selectedToken, 'on', chainConfig?.name);
      await transfer(contributionAmount, tokenConfig);
    } catch (error) {
      console.error('Payment initiation error:', error);
      setStatus('error');
    }
  };

  return {
    initiatePayment,
    isConnected,
    address,
    balance,
    isProcessing: isPending || isConfirming,
    txHash: hash,
    chainId,
    chainName: chainConfig?.name,
    isSupported,
    tokenConfig,
    otherBalances,
    scanDone,
  };
}
