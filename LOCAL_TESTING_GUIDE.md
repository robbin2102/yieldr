# Local Testing Guide - Pre-Deployment
**Branch:** claude/review-recent-branches-NPhea
**Based on:** claude/review-payment-fixes-MeFMk (latest, cleanest code)

## Quick Start

### 1. Setup Environment
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your values:
# - MONGODB_URI
# - DISCORD_BOT_TOKEN
# - DISCORD_GUILD_ID
# - API_AUTH_KEY
```

### 2. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

---

## Testing Checklist

### ✅ Homepage (/)
- [ ] Page loads without errors
- [ ] Black background with green accents
- [ ] Animated chat demo works
- [ ] "Get Early Access" button opens popup
- [ ] Wallet connect button visible
- [ ] Navigation menu works
- [ ] Mobile hamburger menu works

### ✅ Payment Flow
1. **Connect Wallet**
   - [ ] Click "Connect Wallet" in popup
   - [ ] RainbowKit modal opens
   - [ ] Successfully connect wallet
   - [ ] Wallet address shows in UI

2. **Enter Contribution**
   - [ ] Input field accepts numbers
   - [ ] Minimum $1 USDC enforced
   - [ ] Tier selection works (Starter/Pro/Premium/Whale)
   - [ ] YLDR token calculation shows
   - [ ] Effective price displays

3. **Complete Payment**
   - [ ] "Contribute Now" button enabled
   - [ ] USDC transfer triggers
   - [ ] Processing modal shows
   - [ ] Success modal appears
   - [ ] 3-second countdown timer works
   - [ ] Auto-redirect to /allocations

### ✅ Allocations Page (/allocations)
1. **After Payment**
   - [ ] Page loads after redirect
   - [ ] Data refreshes automatically (1.5s delay)
   - [ ] Personal stats show correct YLDR amount
   - [ ] Transaction hash links to basescan
   - [ ] Effective price displayed

2. **Discord Integration**
   - [ ] Discord invite link appears (if eligible)
   - [ ] "Join Discord" button works
   - [ ] Marks invite as "used" in localStorage
   - [ ] Button changes to "Already Joined" after click

3. **Public Tracker**
   - [ ] Shows all contributions
   - [ ] Pagination works (10 per page)
   - [ ] Wallet addresses truncated correctly
   - [ ] YLDR amounts displayed
   - [ ] Timestamps show correctly

4. **User Profile Dropdown**
   - [ ] Crypto icon avatar shows (💎 🪙 💰 etc.)
   - [ ] Wallet address truncated
   - [ ] YLDR balance displays
   - [ ] "My Allocation" stays on page
   - [ ] "Disconnect" wallet works

### ✅ Docs Page (/docs)
- [ ] Timeline renders correctly
- [ ] "Get Early Access" button works
- [ ] User profile in nav bar
- [ ] Mobile responsive

### ✅ Team Page (/team)
- [ ] Manager cards display
- [ ] No platform icons (removed)
- [ ] "Get Early Access" button works
- [ ] User profile in nav bar

### ✅ Build in Public Page (/build-in-public)
- [ ] Treasury balance shows
- [ ] Timeline displays
- [ ] Progress cards render
- [ ] GitHub commit links work
- [ ] Roadmap visible

---

## Key Features to Verify

### 🔄 Data Refresh After Payment
**What to check:**
1. Make a payment
2. Wait for success modal
3. Get redirected to /allocations
4. Verify data updates within 2 seconds
5. New contribution appears in tracker

**Code location:** `app/allocations/page.tsx:87-127`

### 💎 Crypto Icon Avatars
**What to check:**
1. Connect wallet
2. Check user profile dropdown
3. Should see crypto icons: 💎 🪙 💰 🔷 ⚡ 🌟 🔶 🟢 🔵 🟣
4. Icon is consistent for same wallet address

**Code location:** `app/components/UserProfile.tsx:16-19`

### ⏰ Success Modal Improvements
**What to check:**
1. Complete payment
2. Success modal shows
3. Countdown updates every second
4. Auto-redirect at 0 seconds
5. Can manually click "View My Allocation"
6. Data refresh happens on allocations page (not before redirect)

**Code location:** `app/components/payment/SuccessModal.tsx:23-41`

---

## Common Issues & Solutions

### Issue: "localStorage is not defined"
**Solution:** This should be fixed with dynamic imports. If it appears:
- Check browser console
- Verify `app/providers.tsx` uses dynamic import
- Restart dev server

### Issue: "Cannot connect to database"
**Solution:**
- Check `.env.local` has correct MONGODB_URI
- Ensure MongoDB is accessible
- Check network connection

### Issue: "USDC transfer fails"
**Solution:**
- Ensure wallet has USDC on Base network
- Check USDC_ADDRESS in `config/payment.ts` is correct
- Verify sufficient USDC balance
- Approve USDC spending if needed

### Issue: "Data doesn't refresh after payment"
**Solution:**
- Check browser console for errors
- Verify API routes are working
- Check MongoDB connection
- Look for errors in terminal

### Issue: "Discord invite doesn't appear"
**Solution:**
- Check `.env.local` has DISCORD_BOT_TOKEN and DISCORD_GUILD_ID
- Verify bot has permissions in Discord server
- Check contribution meets minimum threshold
- Look at API response in network tab

---

## Performance Testing

### Build Test
```bash
npm run build
```
**Expected:** No errors, successful build

### Production Preview
```bash
npm run build
npm run start
```
**Expected:** Runs on http://localhost:3000

### Lighthouse Scores (Target)
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## Database Verification

### Check Contributions Collection
```javascript
// MongoDB query
db.contributions.find({}).sort({ createdAt: -1 }).limit(10)
```

**Expected fields:**
- wallet_address
- usdc_amount
- yldr_amount
- effective_price
- txHash
- tier
- discord_invite (optional)
- createdAt

---

## API Endpoints to Test

### GET `/api/contributions?wallet={address}`
**Expected:** User's contribution data

### GET `/api/contributions/public`
**Expected:** All contributions (paginated)

### POST `/api/allocate`
**Body:**
```json
{
  "wallet": "0x...",
  "amount": 100,
  "tier": "Starter",
  "txHash": "0x...",
  "effectivePrice": 0.05,
  "yldrAmount": 2000
}
```
**Expected:** Success response with Discord invite

### GET `/api/raise-stats`
**Expected:** Total raised, contributor count, etc.

---

## Environment Variables Required

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Discord Bot
DISCORD_BOT_TOKEN=...
DISCORD_GUILD_ID=...

# API Authentication
API_AUTH_KEY=...

# Optional: Analytics
NEXT_PUBLIC_GA_ID=...
```

---

## Files Changed in This Branch

### Configuration
- `config/payment.ts` - MIN_CONTRIBUTION = 1 (testing mode)

### Components
- `app/allocations/page.tsx` - Auto data refresh after payment
- `app/components/UserProfile.tsx` - Crypto icon avatars
- `app/components/payment/SuccessModal.tsx` - Better redirect flow

### No Other Changes
All other features from previous branches are already included:
- ✅ Payment flow with USDC
- ✅ Multi-tier allocation system
- ✅ Discord integration
- ✅ Public contribution tracker
- ✅ RainbowKit wallet integration
- ✅ MongoDB storage
- ✅ All pages (docs, team, build-in-public)

---

## Deployment Readiness

Before deploying to Vercel, ensure:

### ✅ All Tests Pass
- [ ] Local dev server runs without errors
- [ ] Build completes successfully
- [ ] All features tested and working
- [ ] No console errors in browser
- [ ] Mobile responsive

### ✅ Environment Setup
- [ ] Vercel environment variables configured
- [ ] MongoDB accessible from Vercel
- [ ] Discord bot configured
- [ ] Base network RPC working

### ✅ Code Quality
- [ ] No merge conflicts
- [ ] No commented-out code
- [ ] No debug console.logs (or acceptable)
- [ ] TypeScript compiles without errors

### ✅ Security
- [ ] No API keys in code
- [ ] Environment variables used correctly
- [ ] CORS configured properly
- [ ] Rate limiting considered

---

## Vercel Deployment Commands

```bash
# If deploying from this branch
git push -u origin claude/review-recent-branches-NPhea

# Vercel will auto-deploy from your connected branch
# Or manually trigger:
vercel --prod
```

---

## Support & Debugging

### View Logs
```bash
# Development
npm run dev

# Check console for:
# - "🔄 Payment success detected..." (allocations page)
# - "✅ Data refreshed successfully" (after payment)
# - "⏰ Auto-redirecting..." (success modal)
```

### Common Console Messages

**Good:**
```
✅ Using cached MongoDB connection
🔄 Payment success detected, closing popup and refreshing data...
✅ Data refreshed successfully
⏰ Auto-redirecting to allocations page...
```

**Bad (need to fix):**
```
❌ Error refreshing data: ...
⚠️ localStorage is not defined
🚨 Failed to connect to database
```

---

## Final Checklist Before Deploy

- [ ] Read BRANCH_RECONCILIATION_REPORT.md
- [ ] Understand what changed in last 7 days
- [ ] Test all features locally
- [ ] Verify database connections
- [ ] Check Discord bot works
- [ ] Test payment flow end-to-end
- [ ] Verify mobile responsive
- [ ] Build passes without errors
- [ ] Environment variables ready for Vercel
- [ ] Have rollback plan (can revert to previous deployment)

---

## Contact

If issues arise:
1. Check browser console
2. Check terminal/server logs
3. Review BRANCH_RECONCILIATION_REPORT.md
4. Check git history: `git log --oneline`
5. Compare with working branch: `git diff origin/main`

**Good luck with your deployment! 🚀**
