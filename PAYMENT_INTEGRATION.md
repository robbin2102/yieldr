# Payment Flow Integration Guide

## Overview
The USDC payment system is now fully integrated with RainbowKit wallet connect. The flow works as follows:

1. User inputs USDC amount
2. System calculates tier, price, and YLDR allocation
3. User clicks "Connect Wallet" → RainbowKit modal opens
4. User selects wallet (MetaMask, Coinbase Wallet, WalletConnect, etc.)
5. System checks if wallet is on Base network
6. If not on Base, prompts user to switch network
7. Once connected and on Base, auto-triggers USDC transfer
8. User approves USDC transfer in wallet
9. Transaction is confirmed and recorded to MongoDB
10. Success modal shows with allocation details

## Quick Start

### 1. Environment Setup

Add to your `.env.local`:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yieldr?retryWrites=true&w=majority

# WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Treasury Wallet (already set)
NEXT_PUBLIC_TREASURY_WALLET=0xB56C6247F39A992dbcF172a4308386A23d0ea15C

# API Authentication Key (generate secure random string)
API_AUTH_KEY=your_secure_random_key_here
```

### 2. Add to Your Page

```tsx
'use client';

import { useState } from 'react';
import { EarlyAccessPopup } from '@/app/components/payment/EarlyAccessPopup';

export default function YourPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsPopupOpen(true)}>
        Get Early Access
      </button>

      <EarlyAccessPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </div>
  );
}
```

### 3. Test the Flow

Visit `/early-access-example` to see a working demo.

## Payment Flow Details

### Step 1: Input Amount & Calculate Allocation

- User enters USDC amount (minimum $100)
- System shows:
  - Current tier (Genesis, Pre-Seed, Seed, Growth, Scale)
  - Current price per YLDR
  - FDV (Fully Diluted Valuation)
  - Tier progress (% filled)
  - "X until next tier (+Y% price increase)" hint
  - Estimated YLDR tokens user will receive

### Step 2: Connect Wallet (RainbowKit)

When user clicks "Connect Wallet":
- RainbowKit modal opens automatically
- Shows all available wallets:
  - MetaMask
  - Coinbase Wallet
  - WalletConnect (mobile wallets)
  - Rainbow Wallet
  - And more...
- User selects and connects wallet

### Step 3: Network Check

After connection:
- System checks if wallet is on Base (Chain ID: 8453)
- If on wrong network:
  - Button text changes to "Switch to Base Network →"
  - Shows warning: "⚠️ Please switch to Base network"
  - Clicking button triggers network switch request
- If user approves, network switches to Base

### Step 4: USDC Transfer

Once connected on Base:
- System checks USDC balance
- If sufficient balance:
  - Button text changes to "Contribute →"
  - Clicking triggers USDC transfer to treasury
  - Wallet prompts for approval and signature
  - Processing modal shows while transaction confirms

### Step 5: Success & Recording

After confirmation:
- Transaction recorded to MongoDB with:
  - Wallet address
  - USDC amount
  - YLDR allocation
  - Price and tier
  - TX hash, block number
  - IP address and user agent (compliance)
- Success modal shows:
  - Contribution amount
  - YLDR allocated
  - Distribution date (TGE Q1 2027)
  - Link to view transaction on Basescan
  - Discord invite CTA

## Technical Architecture

### Frontend Components

```
app/components/payment/
├── EarlyAccessPopup.tsx    # Main payment UI
├── ProcessingModal.tsx     # Transaction processing state
├── SuccessModal.tsx        # Success screen with details
└── ErrorModal.tsx          # Error handling with retry
```

### Hooks

```
hooks/
├── usePaymentFlow.ts       # Orchestrates entire flow
├── useRaiseStats.ts        # Fetches tier and raise data
├── useUSDCBalance.ts       # Checks USDC balance
└── useUSDCTransfer.ts      # Executes USDC transfer
```

### API Routes

```
app/api/
├── raise-stats/route.ts    # GET current tier info
├── contributions/route.ts  # POST/GET contributions
└── allocate/route.ts       # POST allocation preview (protected)
```

### Data Models

```
models/
├── Contribution.ts         # Contribution records
└── RaiseStats.ts          # Global raise statistics
```

## Multi-Tier Allocations

The system automatically handles contributions that span multiple tiers:

**Example:**
- Current: $50,000 raised (Genesis tier @ $0.057)
- User contributes: $40,000
- System calculates:
  - $35,500 @ Genesis ($0.057) = 622,807 YLDR
  - $4,500 @ Pre-Seed ($0.10) = 45,000 YLDR
  - **Total: 667,807 YLDR**
  - **Effective price: $0.0599**

The breakdown is shown in the popup if contribution spans tiers.

## Security Features

### API Authentication
Internal API calls use `x-api-key` header to prevent external manipulation:

```typescript
// Protected endpoint example
const response = await fetch('/api/allocate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.API_AUTH_KEY,
  },
  body: JSON.stringify({ usdc_amount: 1000 }),
});
```

### Data Integrity
- Unique `tx_hash` constraint prevents duplicate contributions
- Records IP address and user agent for compliance
- Tracks contributor count (unique wallets)
- All amounts validated (minimum $100)

### Network Security
- Forces Base network (Chain ID: 8453)
- Treasury address hardcoded: `0xB56C6247F39A992dbcF172a4308386A23d0ea15C`
- USDC contract: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

## Monitoring

### Check Raise Stats

```bash
curl https://your-domain.com/api/raise-stats
```

Response:
```json
{
  "success": true,
  "data": {
    "totalRaised": 125000,
    "totalYldrAllocated": 1500000,
    "contributorCount": 45,
    "currentTier": {
      "name": "Pre-Seed",
      "price": 0.10,
      "fdv": 21000000
    },
    "tierProgress": 34.5,
    "usdcToNextTier": 160500
  }
}
```

### Check Wallet Contributions

```bash
curl "https://your-domain.com/api/contributions?wallet=0x..."
```

## Troubleshooting

### Issue: RainbowKit modal doesn't open
- Ensure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set in `.env.local`
- Check browser console for errors
- Verify RainbowKit CSS is imported in `app/layout.tsx`

### Issue: Network switch fails
- User may have rejected the request
- Some wallets don't support programmatic network switching
- User can manually switch in their wallet

### Issue: Transaction fails
- Check user has enough USDC balance
- Verify user is on Base network
- Check gas fees are available (ETH on Base)
- View error details in browser console

### Issue: Contribution not recorded
- Check MongoDB connection in `.env.local`
- Verify API route is accessible
- Check server logs for errors
- Ensure transaction was confirmed on-chain

## Development

### Run locally
```bash
npm run dev
# Visit http://localhost:3000/early-access-example
```

### Test with different wallets
1. MetaMask: Install browser extension
2. Coinbase Wallet: Use mobile app with WalletConnect
3. Rainbow: Use mobile app with WalletConnect

### Test network switching
1. Connect wallet on Ethereum mainnet
2. Click "Connect Wallet"
3. Should prompt to switch to Base

## Production Checklist

- [ ] Set production `MONGODB_URI`
- [ ] Generate secure `API_AUTH_KEY`
- [ ] Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- [ ] Verify treasury address is correct
- [ ] Test full flow on testnet first
- [ ] Monitor MongoDB for contributions
- [ ] Set up analytics/monitoring
- [ ] Test error scenarios
- [ ] Verify Discord invite link works
- [ ] Check Basescan links are correct

## Support

For issues or questions:
- Check browser console for errors
- Review MongoDB logs
- Check server logs in production
- Test on Base testnet first
