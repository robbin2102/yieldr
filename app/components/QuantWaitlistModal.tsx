'use client';

import { WalletWaitlistModal } from './WalletWaitlistModal';

interface QuantWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuantWaitlistModal({ isOpen, onClose }: QuantWaitlistModalProps) {
  return (
    <WalletWaitlistModal
      isOpen={isOpen}
      onClose={onClose}
      apiPath="/api/quant-waitlist"
      tag="Quant Agent · Launching Soon"
      title="Join the Quant Waitlist"
      subtitle="The Quant Agent isn't live yet — connect a read-only wallet to reserve your spot. We'll notify you the moment it goes live."
      joinLabel="Join Quant Waitlist →"
      entityLabel="Quant Agent waitlist"
    />
  );
}
