// Hook: Fetch and Track Raise Statistics

import { useState, useEffect } from 'react';
import { TierInfo, getCurrentTier, calculateAllocation, AllocationResult } from '@/lib/tierCalculations';
import { ALLOCATION_TIERS } from '@/config/tiers';

interface RaiseStatsData {
  totalRaised: number;
  totalYldrAllocated: number;
  contributorCount: number;
  tierInfo: TierInfo;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRaiseStats(): RaiseStatsData {
  const [totalRaised, setTotalRaised] = useState(0);
  const [totalYldrAllocated, setTotalYldrAllocated] = useState(0);
  const [contributorCount, setContributorCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/raise-stats');
      const data = await res.json();

      if (data.success) {
        setTotalRaised(data.data.totalRaised);
        setTotalYldrAllocated(data.data.totalYldrAllocated);
        setContributorCount(data.data.contributorCount);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch raise stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const tierInfo = getCurrentTier(totalRaised);

  return {
    totalRaised,
    totalYldrAllocated,
    contributorCount,
    tierInfo,
    isLoading,
    error,
    refetch: fetchStats,
  };
}

export function useAllocationPreview(usdcAmount: number, totalRaised: number): AllocationResult {
  return calculateAllocation(usdcAmount, totalRaised);
}
