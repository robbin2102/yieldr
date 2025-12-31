'use client';

// Payment Context: Manage Payment State Across Components

import React, { createContext, useContext, useState, ReactNode } from 'react';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'error';

interface PaymentContextType {
  status: PaymentStatus;
  setStatus: (status: PaymentStatus) => void;
  contributionAmount: number;
  setContributionAmount: (amount: number) => void;
  txHash: string | null;
  setTxHash: (hash: string | null) => void;
  reset: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [contributionAmount, setContributionAmount] = useState<number>(1000);
  const [txHash, setTxHash] = useState<string | null>(null);

  const reset = () => {
    setStatus('idle');
    setTxHash(null);
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
