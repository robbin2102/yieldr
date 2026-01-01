'use client';

// Error Modal: Show when payment fails

import React from 'react';
import { usePayment } from '@/app/context/PaymentContext';

export function ErrorModal() {
  const { reset } = usePayment();

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="error-icon">❌</div>
          <h2 className="modal-title">Payment Failed</h2>
          <p className="modal-message">
            Your transaction could not be completed. Please try again.
          </p>
          <button className="modal-button" onClick={reset}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
