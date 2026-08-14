// Hook: Orchestrate a Genesis subscription plan payment (multi-chain, multi-token)
//
// Reuses the same low-level payment modules as the original contribution flow —
// useUSDCTransfer (hardcoded TREASURY_ADDRESS ERC20 transfer) and useUSDCBalance
// (balance + cross-chain scan) — so the on-chain transfer path and treasury
// destination are identical to what's already been audited elsewhere in the app.
// The destination address is never passed in from this hook's caller; it lives
// only inside useUSDCTransfer / config/payment.ts.

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useUSDCBalance } from './useUSDCBalance';
import { useUSDCTransfer } from './useUSDCTransfer';
import { usePayment, type LastSubscription } from '@/app/context/PaymentContext';
import { SUPPORTED_CHAINS, PREFERRED_CHAIN_ID, type TokenId } from '@/config/payment';
import { getPlanPrice, type PlanName, type BillingCycle } from '@/config/plans';

export type SubscriptionPaymentStep =
  | 'idle'
  | 'connecting'
  | 'awaiting-signature'
  | 'confirming'
  | 'recording'
  | 'success'
  | 'error';

export function useSubscriptionPayment(selectedToken: TokenId = 'USDC') {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  const { balance, otherBalances, scanDone } = useUSDCBalance(selectedToken);
  const { transfer, hash, isPending, isConfirming, isConfirmed, error: transferError } = useUSDCTransfer();
  const { setLastSubscription, setHasCompletedPayment } = usePayment();

  const [step, setStep] = useState<SubscriptionPaymentStep>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingPlan, setPendingPlan] = useState<{ name: PlanName; cycle: BillingCycle } | null>(null);

  const recordedTx = useRef<Set<string>>(new Set());
  const wantsToPayRef = useRef(false);

  const chainConfig = SUPPORTED_CHAINS[chainId] ?? SUPPORTED_CHAINS[PREFERRED_CHAIN_ID];
  const tokenConfig = chainConfig?.tokens[selectedToken];
  const isSupported = !!SUPPORTED_CHAINS[chainId];

  useEffect(() => {
    if (isPending || isConfirming) setStep(isPending ? 'awaiting-signature' : 'confirming');
  }, [isPending, isConfirming]);

  useEffect(() => {
    if (transferError) {
      setStep('error');
      setErrorMessage('Transaction was rejected or failed. Please try again.');
    }
  }, [transferError]);

  // Once the wallet connects, if the user had already clicked "pay", fire the transfer now.
  useEffect(() => {
    if (isConnected && wantsToPayRef.current && pendingPlan) {
      wantsToPayRef.current = false;
      void doTransfer(pendingPlan.name, pendingPlan.cycle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const recordSubscription = useCallback(async (planName: PlanName, cycle: BillingCycle, txHash: string) => {
    if (!address) return;
    setStep('recording');
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: address,
          plan_name: planName,
          billing_cycle: cycle,
          tx_hash: txHash,
          chain_id: chainId,
          token: selectedToken,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to verify payment');
      }

      const record: LastSubscription = {
        planName: data.data.plan_name,
        billingCycle: data.data.billing_cycle,
        usdcAmount: data.data.usdc_amount,
        rewardMinUsdc: data.data.reward_min_usdc,
        rewardMaxUsdc: data.data.reward_max_usdc,
        txHash,
        chainId,
        network: chainConfig?.name ?? 'Base',
        token: selectedToken,
        subscriptionStart: data.data.subscription_start,
        rewardPayoutWindow: data.data.reward_payout_window,
      };
      setLastSubscription(record);
      setHasCompletedPayment(true);
      setStep('success');
    } catch (err) {
      setStep('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to record payment');
    }
  }, [address, chainId, selectedToken, chainConfig, setLastSubscription, setHasCompletedPayment]);

  // When the on-chain transfer confirms, record it server-side (server re-verifies on-chain).
  useEffect(() => {
    if (isConfirmed && hash && !recordedTx.current.has(hash) && pendingPlan) {
      recordedTx.current.add(hash);
      void recordSubscription(pendingPlan.name, pendingPlan.cycle, hash);
    }
  }, [isConfirmed, hash, pendingPlan, recordSubscription]);

  const doTransfer = useCallback(async (planName: PlanName, cycle: BillingCycle) => {
    if (!tokenConfig) {
      setStep('error');
      setErrorMessage('This wallet is on an unsupported network. Please switch to Base, Ethereum, Polygon, BNB Chain, or Robinhood Chain.');
      return;
    }
    const price = getPlanPrice(planName, cycle);
    if (price === null) {
      setStep('error');
      setErrorMessage('Unable to resolve plan price.');
      return;
    }
    setErrorMessage(null);
    setStep('awaiting-signature');
    try {
      await transfer(price, tokenConfig);
    } catch {
      setStep('error');
      setErrorMessage('Transaction was rejected or failed. Please try again.');
    }
  }, [tokenConfig, transfer]);

  /** Entry point called by the checkout modal's "Pay Now" button. */
  const pay = useCallback((planName: PlanName, cycle: BillingCycle) => {
    setPendingPlan({ name: planName, cycle });
    setErrorMessage(null);

    if (!isConnected) {
      wantsToPayRef.current = true;
      setStep('connecting');
      if (openConnectModal) openConnectModal();
      return;
    }
    void doTransfer(planName, cycle);
  }, [isConnected, openConnectModal, doTransfer]);

  const resetPayment = useCallback(() => {
    setStep('idle');
    setErrorMessage(null);
    setPendingPlan(null);
    wantsToPayRef.current = false;
  }, []);

  return {
    pay,
    resetPayment,
    step,
    errorMessage,
    isConnected,
    address,
    balance,
    otherBalances,
    scanDone,
    isSupported,
    chainId,
    chainName: chainConfig?.name,
    txHash: hash,
  };
}
