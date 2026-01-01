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
    tokensAvailable: 2000000,
    tokensSold: 0,
    pricePerToken: 0.043,
    fdv: 9000000,
    targetRaise: 86000,
  },
  'Pre-Seed': {
    name: 'Pre-Seed',
    tokensAvailable: 2500000,
    tokensSold: 0,
    pricePerToken: 0.075,
    fdv: 15750000,
    targetRaise: 187500,
  },
  Seed: {
    name: 'Seed',
    tokensAvailable: 4000000,
    tokensSold: 0,
    pricePerToken: 0.15,
    fdv: 31500000,
    targetRaise: 600000,
  },
  Growth: {
    name: 'Growth',
    tokensAvailable: 6000000,
    tokensSold: 0,
    pricePerToken: 0.225,
    fdv: 47250000,
    targetRaise: 1350000,
  },
  Scale: {
    name: 'Scale',
    tokensAvailable: 10500000,
    tokensSold: 0,
    pricePerToken: 0.27,
    fdv: 56700000,
    targetRaise: 2835000,
  },
};

// Constants
export const TOTAL_PUBLIC_ALLOCATION = 25000000; // 25M YLDR (11.9%)
export const TOTAL_TARGET_RAISE = 5058500; // ~$5.06M
export const TREASURY_WALLET = process.env.NEXT_PUBLIC_TREASURY_WALLET || '0xB56C6247F39A992dbcF172a4308386A23d0ea15C'; // Correct treasury multisig
export const USDC_TOKEN_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Base USDC
