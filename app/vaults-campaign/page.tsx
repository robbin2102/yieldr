'use client';

import { Suspense } from 'react';
import { VaultsPageInner } from '../vaults/VaultsInner';

export default function VaultsCampaignPage() {
  return (
    <Suspense fallback={null}>
      <VaultsPageInner isCampaign={true} />
    </Suspense>
  );
}
