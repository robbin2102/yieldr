'use client';

import { Suspense } from 'react';
import { VaultsPageInner } from './VaultsInner';

export default function VaultsPage() {
  return (
    <Suspense fallback={null}>
      <VaultsPageInner isCampaign={false} />
    </Suspense>
  );
}
