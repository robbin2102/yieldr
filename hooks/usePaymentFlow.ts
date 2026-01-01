// Hook: Orchestrate Complete Payment Flow

import { useEffect } from 'react';
import { useAccount, useConnect, useSwitchChain } from 'wagmi';
import { useUSDCBalance } from './useUSDCBalance';
import { useUSDCTransfer } from './useUSDCTransfer';
import { usePayment } from '@/app/context/PaymentContext';
import { CHAIN_ID, NETWORK_NAME } from '@/config/payment';

export function usePaymentFlow() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { switchChain } = useSwitchChain();
  const { balance, refetch: refetchBalance } = useUSDCBalance();
  const { transfer, hash, isPending, isConfirming, isConfirmed, error: transferError } = useUSDCTransfer();
  const { contributionAmount, setStatus, setTxHash } = usePayment();

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && hash) {
      setTxHash(hash);
      setStatus('success');

      // Record contribution to database
      recordContribution(hash);

      // Refetch balance after successful transfer
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
      if (
        chain.id === CHAIN_ID &&
        balance >= contributionAmount &&
        contributionAmount > 0 &&
        !isPending &&
        !isConfirming &&
        !hash
      ) {
        console.log('Auto-triggering USDC transfer...');
        setTimeout(() => {
          transfer(contributionAmount);
        }, 500); // Small delay to ensure everything is ready
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
