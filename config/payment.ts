// Payment Configuration Constants

// USDC Token (Base)
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const USDC_DECIMALS = 6;

// Treasury Wallet
export const TREASURY_ADDRESS = '0xB56C6247F39A992dbcF172a4308386A23d0ea15C';

// Network
export const CHAIN_ID = 8453; // Base
export const NETWORK_NAME = 'Base';

// Contribution Limits
export const MIN_CONTRIBUTION = 1; // $1 USDC (for testing)

// Explorer
export const EXPLORER_URL = 'https://basescan.org';

// Discord
export const DISCORD_INVITE = 'https://discord.gg/c8qq9DKkjM';

// API Authentication
export const API_AUTH_KEY = process.env.API_AUTH_KEY || '';

// API Endpoints
export const API_ENDPOINTS = {
  raiseStats: '/api/raise-stats',
  contributions: '/api/contributions',
  allocate: '/api/allocate',
} as const;
