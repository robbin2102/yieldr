// Types for YLDR token contributions

export type TierName = 'Genesis' | 'Pre-Seed' | 'Seed' | 'Growth' | 'Scale';

export interface Tier {
  name: TierName;
  tokensAvailable: number;
  tokensSold: number;
  pricePerToken: number;
  fdv: number;
  targetRaise: number;
}

export interface Contribution {
  _id?: string;
  walletAddress: string;
  usdcAmount: number;
  yldrAllocated: number;
  tierAtPurchase: TierName;
  pricePerToken: number;
  timestamp: Date;
  txHash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface TierConfig {
  Genesis: Tier;
  'Pre-Seed': Tier;
  Seed: Tier;
  Growth: Tier;
  Scale: Tier;
}

// Initial tier configuration
export const TIER_CONFIG: TierConfig = {
  Genesis: {
    name: 'Genesis',
    tokensAvailable: 1500000,
    tokensSold: 0,
    pricePerToken: 0.057,
    fdv: 12000000,
    targetRaise: 85500,
  },
  'Pre-Seed': {
    name: 'Pre-Seed',
    tokensAvailable: 2000000,
    tokensSold: 0,
    pricePerToken: 0.10,
    fdv: 21000000,
    targetRaise: 200000,
  },
  Seed: {
    name: 'Seed',
    tokensAvailable: 3000000,
    tokensSold: 0,
    pricePerToken: 0.20,
    fdv: 42000000,
    targetRaise: 600000,
  },
  Growth: {
    name: 'Growth',
    tokensAvailable: 4500000,
    tokensSold: 0,
    pricePerToken: 0.30,
    fdv: 63000000,
    targetRaise: 1350000,
  },
  Scale: {
    name: 'Scale',
    tokensAvailable: 8000000,
    tokensSold: 0,
    pricePerToken: 0.357,
    fdv: 75000000,
    targetRaise: 2856000,
  },
};

// Constants
export const TOTAL_PUBLIC_ALLOCATION = 19000000; // 19M YLDR (9.05%)
export const TOTAL_TARGET_RAISE = 5091500; // ~$5.09M
export const TREASURY_WALLET = process.env.NEXT_PUBLIC_TREASURY_WALLET || '0x780BB763e1463D2236FEC780b7BD6ADb40AAa120';
export const USDC_TOKEN_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Base USDC
