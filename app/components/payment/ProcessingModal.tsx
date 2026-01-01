'use client';

// Processing Modal: Show during transaction processing

import React from 'react';

export function ProcessingModal() {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-content">
          <div className="spinner"></div>
          <h2 className="modal-title">Processing Payment...</h2>
          <p className="modal-message">
            Please wait while your transaction is being confirmed on the blockchain.
          </p>
          <p className="modal-hint">This may take a few moments.</p>
        </div>
      </div>
    </div>
  );
}
