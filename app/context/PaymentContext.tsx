'use client';

// Payment Context: Manage Payment State Across Components

import React, { createContext, useContext, useState, ReactNode } from 'react';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

interface AllocationData {
  yldrAmount: number;
  effectivePrice: number;
  breakdown: {
    tier: string;
    tokens: number;
    price: number;
    usdc: number;
  }[];
}

interface PaymentContextType {
  status: PaymentStatus;
  setStatus: (status: PaymentStatus) => void;
  contributionAmount: number;
  setContributionAmount: (amount: number) => void;
  txHash: string | null;
  setTxHash: (hash: string | null) => void;
  allocationData: AllocationData | null;
  setAllocationData: (data: AllocationData | null) => void;
  hasCompletedPayment: boolean;
  setHasCompletedPayment: (completed: boolean) => void;
  reset: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [contributionAmount, setContributionAmount] = useState<number>(1000);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null);
  const [hasCompletedPayment, setHasCompletedPayment] = useState<boolean>(false);

  const reset = () => {
    setStatus('idle');
    setTxHash(null);
    // Don't reset allocation data or hasCompletedPayment - user should still see their allocation
  };

  return (
    <PaymentContext.Provider
      value={{
        status,
        setStatus,
        contributionAmount,
        setContributionAmount,
        txHash,
        setTxHash,
        allocationData,
        setAllocationData,
        hasCompletedPayment,
        setHasCompletedPayment,
        reset,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
