// Allocation Tier Configuration for YLDR Early Access

export interface AllocationTier {
  name: string;
  tokens: number;          // Total tokens in tier
  supplyPercent: number;   // % of total supply
  price: number;           // USDC per YLDR
  fdv: number;             // Fully Diluted Valuation
  raiseTarget: number;     // Total USDC to raise in this tier
  cumulativeRaise: number; // Total raised including previous tiers
}

export const ALLOCATION_TIERS: AllocationTier[] = [
  {
    name: 'Genesis',
    tokens: 1_500_000,
    supplyPercent: 0.71,
    price: 0.057,
    fdv: 12_000_000,
    raiseTarget: 85_500,
    cumulativeRaise: 85_500,
  },
  {
    name: 'Pre-Seed',
    tokens: 2_000_000,
    supplyPercent: 0.95,
    price: 0.10,
    fdv: 21_000_000,
    raiseTarget: 200_000,
    cumulativeRaise: 285_500,
  },
  {
    name: 'Seed',
    tokens: 3_000_000,
    supplyPercent: 1.43,
    price: 0.20,
    fdv: 42_000_000,
    raiseTarget: 600_000,
    cumulativeRaise: 885_500,
  },
  {
    name: 'Growth',
    tokens: 4_500_000,
    supplyPercent: 2.14,
    price: 0.30,
    fdv: 63_000_000,
    raiseTarget: 1_350_000,
    cumulativeRaise: 2_235_500,
  },
  {
    name: 'Scale',
    tokens: 8_000_000,
    supplyPercent: 3.81,
    price: 0.357,
    fdv: 75_000_000,
    raiseTarget: 2_856_000,
    cumulativeRaise: 5_091_500,
  },
];

export const TOTAL_ALLOCATION = 19_000_000; // 19M YLDR
export const TOTAL_SUPPLY_PERCENT = 9.05;
export const TARGET_RAISE = 5_091_500; // ~$5.09M
