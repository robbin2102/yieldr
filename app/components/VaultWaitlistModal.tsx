'use client';

import { WalletWaitlistModal } from './WalletWaitlistModal';

interface VaultWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaultId: string;
  vaultName: string;
}

export function VaultWaitlistModal({ isOpen, onClose, vaultId, vaultName }: VaultWaitlistModalProps) {
  return (
    <WalletWaitlistModal
      isOpen={isOpen}
      onClose={onClose}
      apiPath="/api/vault-waitlist"
      extraBody={{ vault_id: vaultId }}
      tag="Agent Vault · Not Yet Live"
      title={`Whitelist for ${vaultName}`}
      subtitle="Agent Vaults aren't open for deposits yet — connect a read-only wallet to whitelist it now and be first in when this vault opens."
      joinLabel="Whitelist Wallet →"
      entityLabel={`${vaultName} waitlist`}
    />
  );
}
