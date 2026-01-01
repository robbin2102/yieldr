# Environment Variable Compatibility Check

## ❗ IMPORTANT FINDING

The `.env.local.example` file is **INCOMPLETE** and missing Discord variables!

---

## Environment Variables Used in Code

Here are ALL the environment variables actually used in the codebase:

### ✅ Required Variables

| Variable Name | Used In | Purpose |
|--------------|---------|---------|
| `MONGODB_URI` | `lib/mongodb.ts` | MongoDB database connection |
| `API_AUTH_KEY` | `config/payment.ts` | API authentication |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | `lib/wagmi.ts` | RainbowKit wallet connection |

### ⚠️ Optional Variables (Features will fail if missing)

| Variable Name | Used In | Purpose | If Missing |
|--------------|---------|---------|------------|
| `DISCORD_BOT_TOKEN` | `lib/discord.ts` | Discord bot authentication | Discord invites won't work |
| `DISCORD_EARLY_ACCESS_CHANNEL_ID` | `lib/discord.ts` | Target channel for invites | Discord invites won't work |

### ℹ️ NOT USED (in .env.local.example but not used in code)

| Variable Name | Status |
|--------------|--------|
| `NEXT_PUBLIC_TREASURY_WALLET` | ❌ NOT USED - Treasury address is hardcoded in `config/payment.ts` |
| `NEXT_PUBLIC_CHAIN_ID` | ❌ NOT USED - Chain ID is hardcoded in `config/payment.ts` |

---

## What's in `.env.local.example` (INCOMPLETE)

```env
# What .env.local.example currently has:
MONGODB_URI=...
NEXT_PUBLIC_TREASURY_WALLET=...        # ❌ NOT ACTUALLY USED
NEXT_PUBLIC_CHAIN_ID=...               # ❌ NOT ACTUALLY USED
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
API_AUTH_KEY=...

# ⚠️ MISSING Discord variables!
```

---

## What Your `.env.local` SHOULD Have

```env
# Required - App won't work without these
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yieldr?retryWrites=true&w=majority
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
API_AUTH_KEY=your_secure_random_key

# Optional - Discord features won't work without these
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_EARLY_ACCESS_CHANNEL_ID=your_discord_channel_id

# These are in .env.local.example but NOT actually used in code
# You can have them, but they do nothing:
# NEXT_PUBLIC_TREASURY_WALLET=0xB56C6247F39A992dbcF172a4308386A23d0ea15C
# NEXT_PUBLIC_CHAIN_ID=8453
```

---

## ⚠️ CORRECTING MY EARLIER MISTAKE

In my documentation, I incorrectly mentioned:
- ❌ `DISCORD_GUILD_ID` (WRONG)

The correct variable name is:
- ✅ `DISCORD_EARLY_ACCESS_CHANNEL_ID` (CORRECT)

Sorry for the confusion!

---

## Will Your Existing `.env.local` Work?

### ✅ YES, if you have:
1. `MONGODB_URI`
2. `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
3. `API_AUTH_KEY`

### ⚠️ PARTIAL, if missing:
- `DISCORD_BOT_TOKEN`
- `DISCORD_EARLY_ACCESS_CHANNEL_ID`

Without Discord variables, the app will:
- ✅ Work for payments
- ✅ Work for allocations
- ✅ Work for wallet connection
- ❌ **Fail to generate Discord invites** (will throw error in `lib/discord.ts:6`)

---

## Checking Your Current `.env.local`

Run this command to see what you have:

```bash
cat .env.local | grep -E "MONGODB_URI|DISCORD|API_AUTH_KEY|WALLETCONNECT"
```

### Expected Output:
```
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=abc123...
API_AUTH_KEY=some_key...
DISCORD_BOT_TOKEN=...                        # If you have this
DISCORD_EARLY_ACCESS_CHANNEL_ID=...          # If you have this
```

---

## What Happens If Variables Are Missing?

### Missing `MONGODB_URI`
```
❌ Error: Please add your MongoDB URI to .env.local
```
**Impact:** App won't start

### Missing `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
```
⚠️ Warning: WalletConnect Project ID not found. Wallet connection may not work.
```
**Impact:** Wallet connection will fail

### Missing `API_AUTH_KEY`
```
⚠️ API_AUTH_KEY will be empty string
```
**Impact:** API authentication may fail

### Missing Discord Variables
```
❌ Error: Discord bot token or channel ID not configured
```
**Impact:** Discord invite generation fails, but payment still works

---

## How to Fix Your `.env.local`

### Option 1: Add Missing Discord Variables (Recommended)
```bash
# Edit your .env.local
nano .env.local

# Add these lines if they're missing:
DISCORD_BOT_TOKEN=your_actual_bot_token
DISCORD_EARLY_ACCESS_CHANNEL_ID=your_actual_channel_id
```

### Option 2: Test Without Discord (for testing payments only)
Your app will work for payments without Discord variables, but:
- Discord invite generation will fail
- Error will show in logs when users complete payment
- Allocations page won't show Discord invite link

---

## Updated `.env.local.example` File

I should update `.env.local.example` to include Discord variables. Here's what it should be:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yieldr?retryWrites=true&w=majority

# WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# API Authentication Key (for internal API calls - generate a secure random string)
API_AUTH_KEY=your_secure_random_key_here

# Discord Bot (optional - for exclusive invite generation)
DISCORD_BOT_TOKEN=your_discord_bot_token_here
DISCORD_EARLY_ACCESS_CHANNEL_ID=your_discord_channel_id_here
```

---

## Code Evidence

### 1. MongoDB Usage (`lib/mongodb.ts:4-8`)
```typescript
if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

const MONGODB_URI: string = process.env.MONGODB_URI;
```

### 2. Discord Usage (`lib/discord.ts:1-7`)
```typescript
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_EARLY_ACCESS_CHANNEL_ID = process.env.DISCORD_EARLY_ACCESS_CHANNEL_ID;

export async function createExclusiveInvite(): Promise<string> {
  if (!DISCORD_BOT_TOKEN || !DISCORD_EARLY_ACCESS_CHANNEL_ID) {
    throw new Error('Discord bot token or channel ID not configured');
  }
```

### 3. WalletConnect Usage (`lib/wagmi.ts:5-9`)
```typescript
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId && typeof window !== 'undefined') {
  console.warn('WalletConnect Project ID not found. Wallet connection may not work.');
}
```

### 4. API Auth Usage (`config/payment.ts:24`)
```typescript
export const API_AUTH_KEY = process.env.API_AUTH_KEY || '';
```

---

## Summary

### ✅ The Good News:
The code in `claude/review-recent-branches-NPhea` uses **THE SAME environment variable names** as before. Nothing changed.

### ⚠️ The Issue:
The `.env.local.example` file is incomplete and:
1. **Missing** Discord variables (DISCORD_BOT_TOKEN, DISCORD_EARLY_ACCESS_CHANNEL_ID)
2. **Has** unused variables (NEXT_PUBLIC_TREASURY_WALLET, NEXT_PUBLIC_CHAIN_ID)

### ✅ Your Existing `.env.local`:
**Will work fine** if you already had these variables configured! The code hasn't changed the variable names.

### 📝 Action Required:
1. Check your `.env.local` has the Discord variables
2. If missing, add them (or accept that Discord invites won't work)
3. You can safely ignore/remove NEXT_PUBLIC_TREASURY_WALLET and NEXT_PUBLIC_CHAIN_ID (not used)

---

## Quick Test Command

```bash
# Test if all required variables are set
node -e "
const required = ['MONGODB_URI', 'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID', 'API_AUTH_KEY'];
const optional = ['DISCORD_BOT_TOKEN', 'DISCORD_EARLY_ACCESS_CHANNEL_ID'];
require('dotenv').config({ path: '.env.local' });
console.log('Required:');
required.forEach(v => console.log(\`  \${v}: \${process.env[v] ? '✅' : '❌'}\`));
console.log('Optional (Discord):');
optional.forEach(v => console.log(\`  \${v}: \${process.env[v] ? '✅' : '❌'}\`));
"
```

---

**Bottom Line:** Your existing `.env.local` should work fine! The code uses the same variable names as before.
