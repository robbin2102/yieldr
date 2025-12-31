'use client';

// Example: How to integrate EarlyAccessPopup into your pages

import { useState } from 'react';
import { EarlyAccessPopup } from '@/app/components/payment/EarlyAccessPopup';

export default function EarlyAccessExample() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Yieldr Token Sale</h1>
      <p>Get early access to YLDR tokens</p>

      <button
        onClick={() => setIsPopupOpen(true)}
        style={{
          background: '#00C805',
          color: '#000',
          padding: '1rem 2rem',
          border: 'none',
          borderRadius: '10px',
          fontSize: '1rem',
          fontWeight: '700',
          cursor: 'pointer',
          marginTop: '2rem',
        }}
      >
        Get Early Access
      </button>

      <EarlyAccessPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
}
