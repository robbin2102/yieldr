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
    console.log('=== Transaction Status Check ===');
    console.log('isConfirmed:', isConfirmed);
    console.log('hash:', hash);
    console.log('isPending:', isPending);
    console.log('isConfirming:', isConfirming);
    console.log('================================');

    if (isConfirmed && hash) {
      console.log('🎉 Transaction confirmed! Hash:', hash);
      console.log('Setting status to success and showing modal...');

      setTxHash(hash);
      setStatus('success');

      // Save allocation data for display
      setAllocationData({
        yldrAmount: allocation.yldrAmount,
        effectivePrice: allocation.effectivePrice,
        breakdown: allocation.breakdown,
      });

      console.log('Allocation data saved:', {
        yldrAmount: allocation.yldrAmount,
        effectivePrice: allocation.effectivePrice,
        breakdownCount: allocation.breakdown.length,
      });

      // Mark payment as completed
      setHasCompletedPayment(true);

      // Record contribution to database (non-blocking)
      recordContribution(hash);

      // Refetch balance after successful transfer
      refetchBalance();
    }
  }, [isConfirmed, hash, allocation, isPending, isConfirming]);

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

  // Log wallet connection status (no auto-trigger for security)
  useEffect(() => {
    if (isConnected && address && chain) {
      console.log('=== Wallet Connected ===');
      console.log('Address:', address);
      console.log('Chain ID:', chain.id);
      console.log('Chain Name:', chain.name);
      console.log('USDC Balance:', balance);
      console.log('Contribution Amount:', contributionAmount);
      console.log('Ready for payment?', chain.id === CHAIN_ID && balance >= contributionAmount);
      console.log('=======================');
    }
  }, [isConnected, address, chain?.id, balance]);

  const recordContribution = async (txHash: string) => {
    try {
      const payload = {
        wallet_address: address,
        usdc_amount: contributionAmount,
        tx_hash: txHash,
        network: NETWORK_NAME,
        chain_id: CHAIN_ID,
      };

      console.log('=== Recording Contribution to API ===');
      console.log('Payload:', JSON.stringify(payload, null, 2));
      console.log('Validating payload fields:');
      console.log('  - wallet_address:', payload.wallet_address);
      console.log('  - usdc_amount:', payload.usdc_amount);
      console.log('  - tx_hash:', payload.tx_hash);
      console.log('  - network:', payload.network);
      console.log('  - chain_id:', payload.chain_id);
      console.log('=====================================');

      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('API Response Status:', response.status);

      const data = await response.json();
      console.log('API Response Data:', data);

      if (!data.success) {
        console.error('❌ Failed to record contribution:', data.error);
      } else {
        console.log('✅ Contribution recorded successfully!', data.data);
      }
    } catch (error) {
      console.error('❌ Error recording contribution:', error);
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
