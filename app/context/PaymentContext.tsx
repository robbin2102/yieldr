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
  // Initialize from localStorage if available
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [contributionAmount, setContributionAmount] = useState<number>(1000);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [allocationData, setAllocationData] = useState<AllocationData | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yldr_allocation_data');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const [hasCompletedPayment, setHasCompletedPayment] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('yldr_has_completed_payment') === 'true';
    }
    return false;
  });

  // Persist to localStorage when these values change
  const setAllocationDataPersistent = (data: AllocationData | null) => {
    setAllocationData(data);
    if (typeof window !== 'undefined') {
      if (data) {
        localStorage.setItem('yldr_allocation_data', JSON.stringify(data));
      } else {
        localStorage.removeItem('yldr_allocation_data');
      }
    }
  };

  const setHasCompletedPaymentPersistent = (completed: boolean) => {
    setHasCompletedPayment(completed);
    if (typeof window !== 'undefined') {
      if (completed) {
        localStorage.setItem('yldr_has_completed_payment', 'true');
      } else {
        localStorage.removeItem('yldr_has_completed_payment');
      }
    }
  };

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
        setAllocationData: setAllocationDataPersistent,
        hasCompletedPayment,
        setHasCompletedPayment: setHasCompletedPaymentPersistent,
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
