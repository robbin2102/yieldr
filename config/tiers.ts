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
    tokens: 2_000_000,
    supplyPercent: 0.95,
    price: 0.043,
    fdv: 9_000_000,
    raiseTarget: 86_000,
    cumulativeRaise: 86_000,
  },
  {
    name: 'Pre-Seed',
    tokens: 2_500_000,
    supplyPercent: 1.19,
    price: 0.075,
    fdv: 15_750_000,
    raiseTarget: 187_500,
    cumulativeRaise: 273_500,
  },
  {
    name: 'Seed',
    tokens: 4_000_000,
    supplyPercent: 1.90,
    price: 0.15,
    fdv: 31_500_000,
    raiseTarget: 600_000,
    cumulativeRaise: 873_500,
  },
  {
    name: 'Growth',
    tokens: 6_000_000,
    supplyPercent: 2.86,
    price: 0.225,
    fdv: 47_250_000,
    raiseTarget: 1_350_000,
    cumulativeRaise: 2_223_500,
  },
  {
    name: 'Scale',
    tokens: 10_500_000,
    supplyPercent: 5.0,
    price: 0.27,
    fdv: 56_700_000,
    raiseTarget: 2_835_000,
    cumulativeRaise: 5_058_500,
  },
];

export const TOTAL_ALLOCATION = 25_000_000; // 25M YLDR
export const TOTAL_SUPPLY_PERCENT = 11.9;
export const TARGET_RAISE = 5_058_500; // ~$5.06M
