// Hook: Orchestrate Complete Payment Flow

import { useEffect } from 'react';
import { useAccount, useConnect, useSwitchChain } from 'wagmi';
import { useUSDCBalance } from './useUSDCBalance';
import { useUSDCTransfer } from './useUSDCTransfer';
import { usePayment } from '@/app/context/PaymentContext';
import { useRaiseStats, useAllocationPreview } from './useRaiseStats';
import { CHAIN_ID, NETWORK_NAME } from '@/config/payment';

export function usePaymentFlow() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { switchChain } = useSwitchChain();
  const { balance, refetch: refetchBalance } = useUSDCBalance();
  const { transfer, hash, isPending, isConfirming, isConfirmed, error: transferError } = useUSDCTransfer();
  const { contributionAmount, setStatus, setTxHash, setAllocationData, setHasCompletedPayment } = usePayment();
  const { totalRaised } = useRaiseStats();
  const allocation = useAllocationPreview(contributionAmount, totalRaised);

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && hash) {
      setTxHash(hash);
      setStatus('success');

      // Save allocation data for display
      setAllocationData({
        yldrAmount: allocation.yldrAmount,
        effectivePrice: allocation.effectivePrice,
        breakdown: allocation.breakdown,
      });

      // Mark payment as completed
      setHasCompletedPayment(true);

      // Record contribution to database
      recordContribution(hash);

      // Refetch balance after successful transfer
      refetchBalance();
    }
  }, [isConfirmed, hash, allocation]);

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

  // Auto-trigger transfer after wallet connects and switches to correct chain
  useEffect(() => {
    if (isConnected && address && chain) {
      // Log wallet connection details
      console.log('=== Wallet Connected ===');
      console.log('Address:', address);
      console.log('Chain ID:', chain.id);
      console.log('Chain Name:', chain.name);
      console.log('USDC Balance:', balance);
      console.log('Contribution Amount:', contributionAmount);
      console.log('=======================');

      // Auto-trigger transfer if on correct chain, has balance, and not already processing
      console.log('Checking auto-trigger conditions:');
      console.log('- Chain ID matches?', chain.id === CHAIN_ID, `(${chain.id} === ${CHAIN_ID})`);
      console.log('- Has balance?', balance >= contributionAmount, `(${balance} >= ${contributionAmount})`);
      console.log('- Amount > 0?', contributionAmount > 0);
      console.log('- Not pending?', !isPending);
      console.log('- Not confirming?', !isConfirming);
      console.log('- No hash?', !hash);

      if (
        chain.id === CHAIN_ID &&
        balance >= contributionAmount &&
        contributionAmount > 0 &&
        !isPending &&
        !isConfirming &&
        !hash
      ) {
        console.log('✅ All conditions met! Auto-triggering USDC transfer...');
        setTimeout(() => {
          transfer(contributionAmount);
        }, 500); // Small delay to ensure everything is ready
      } else {
        console.log('❌ Auto-trigger conditions not met');
      }
    }
  }, [isConnected, address, chain?.id, balance]);

  const recordContribution = async (txHash: string) => {
    try {
      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wallet_address: address,
          usdc_amount: contributionAmount,
          tx_hash: txHash,
          network: NETWORK_NAME,
          chain_id: CHAIN_ID,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        console.error('Failed to record contribution:', data.error);
      }
    } catch (error) {
      console.error('Error recording contribution:', error);
    }
  };

  const initiatePayment = async () => {
    try {
      // Step 1: Connect wallet if not connected
      if (!isConnected) {
        const injectedConnector = connectors.find((c) => c.id === 'injected');
        if (injectedConnector) {
          connect({ connector: injectedConnector });
        }
        return;
      }

      // Step 2: Switch to Base if needed
      if (chain?.id !== CHAIN_ID) {
        try {
          await switchChain({ chainId: CHAIN_ID });
        } catch (error) {
          console.error('Failed to switch network:', error);
          setStatus('error');
          return;
        }
      }

      // Step 3: Check balance
      if (balance < contributionAmount) {
        setStatus('error');
        return;
      }

      // Step 4: Execute transfer
      setStatus('processing');
      await transfer(contributionAmount);
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
  };
}
