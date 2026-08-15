// API Route: Record and Query Genesis Subscription Payments
//
// SECURITY: the client only tells us which plan/cycle/chain/token/tx it believes
// it paid with — every fact that actually matters (amount, sender, recipient,
// success) is re-derived from the chain itself in verifyOnchainPayment() before
// anything is written to the database. A tampered client cannot fabricate a
// subscription, redirect the recorded treasury address, or inflate the paid
// amount / reward eligibility.

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Subscription } from '@/models/Subscription';
import { verifyOnchainPayment } from '@/lib/verifyPayment';
import { TREASURY_ADDRESS, SUPPORTED_CHAINS, TOKEN_IDS, type TokenId } from '@/config/payment';
import {
  isPlanName,
  isBillingCycle,
  computeChargeAmount,
  getAccessMonths,
  renewsAutomatically,
  REWARD_MULTIPLIER_MIN,
  REWARD_MULTIPLIER_MAX,
  REWARD_PAYOUT_LABEL,
  SUBSCRIPTION_START_LABEL,
  type PlanName,
  type BillingCycle,
} from '@/config/plans';

// Small tolerance for floating point / gas-adjacent rounding on the client side.
const AMOUNT_TOLERANCE = 0.01;

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      wallet_address,
      plan_name,
      billing_cycle,
      tx_hash,
      chain_id,
      token,
    } = body;

    if (!wallet_address || typeof wallet_address !== 'string' || !/^0x[a-fA-F0-9]{40}$/.test(wallet_address)) {
      return NextResponse.json({ success: false, error: 'Invalid wallet address' }, { status: 400 });
    }
    if (!isPlanName(plan_name)) {
      return NextResponse.json({ success: false, error: 'Invalid plan name' }, { status: 400 });
    }
    if (!isBillingCycle(billing_cycle)) {
      return NextResponse.json({ success: false, error: 'Invalid billing cycle' }, { status: 400 });
    }
    if (!tx_hash || typeof tx_hash !== 'string' || !/^0x[a-fA-F0-9]{64}$/.test(tx_hash)) {
      return NextResponse.json({ success: false, error: 'Invalid transaction hash' }, { status: 400 });
    }
    const chainId = Number(chain_id);
    const chainCfg = SUPPORTED_CHAINS[chainId];
    if (!chainCfg) {
      return NextResponse.json({ success: false, error: 'Unsupported chain' }, { status: 400 });
    }
    if (!TOKEN_IDS.includes(token)) {
      return NextResponse.json({ success: false, error: 'Unsupported token' }, { status: 400 });
    }

    // Reject replays / duplicate submissions of the same transaction up front.
    const existing = await Subscription.findOne({ tx_hash: tx_hash.toLowerCase() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Transaction already recorded' }, { status: 409 });
    }

    // A wallet holds exactly one plan at a time. Look up its current one (the
    // most recent confirmed record) to decide whether this is a first
    // purchase, a valid upgrade (charged only the differential), a
    // re-purchase of the exact same plan (rejected), or a non-upgrade
    // (rejected) — computeChargeAmount is the SAME function the client used
    // to size the on-chain transfer, so there's nothing to drift.
    const currentRecord = await Subscription.findOne({
      wallet_address: wallet_address.toLowerCase(),
      status: 'confirmed',
    }).sort({ created_at: -1 });

    const current = currentRecord
      ? {
          planName: currentRecord.plan_name as PlanName,
          billingCycle: currentRecord.billing_cycle as BillingCycle,
          cumulativeUsdcPaid: currentRecord.cumulative_usdc_paid,
        }
      : null;

    const charge = computeChargeAmount(plan_name, billing_cycle, current);
    if (!charge.ok) {
      const messages: Record<typeof charge.reason, string> = {
        'already-owned': `You already have the ${plan_name} ${billing_cycle} plan.`,
        'not-an-upgrade': `${plan_name} ${billing_cycle} isn't an upgrade from your current plan.`,
        'invalid-plan': 'Unable to resolve plan price.',
      };
      return NextResponse.json({ success: false, error: messages[charge.reason] }, { status: 409 });
    }

    // Re-derive the truth from the chain: real sender, real recipient, real amount.
    const verification = await verifyOnchainPayment({
      chainId,
      txHash: tx_hash as `0x${string}`,
      token: token as TokenId,
      walletAddress: wallet_address,
    });

    if (!verification.ok || verification.amount === undefined) {
      return NextResponse.json(
        { success: false, error: verification.error ?? 'On-chain payment verification failed' },
        { status: 402 }
      );
    }

    if (verification.amount + AMOUNT_TOLERANCE < charge.amount) {
      return NextResponse.json(
        {
          success: false,
          error: `On-chain payment ($${verification.amount.toFixed(2)}) is below the required ${charge.isUpgrade ? 'upgrade' : ''} amount ($${charge.amount.toFixed(2)})`,
        },
        { status: 402 }
      );
    }

    const verifiedAmount = verification.amount;
    const rewardMin = verifiedAmount * REWARD_MULTIPLIER_MIN;
    const rewardMax = verifiedAmount * REWARD_MULTIPLIER_MAX;
    const cumulativePaid = (current?.cumulativeUsdcPaid ?? 0) + verifiedAmount;

    const subscription = await Subscription.create({
      wallet_address: wallet_address.toLowerCase(),
      plan_name,
      billing_cycle,
      usdc_amount: verifiedAmount,
      reward_min_usdc: rewardMin,
      reward_max_usdc: rewardMax,
      reward_payout_window: REWARD_PAYOUT_LABEL,
      subscription_start: SUBSCRIPTION_START_LABEL,
      access_months: getAccessMonths(billing_cycle),
      renews_automatically: renewsAutomatically(billing_cycle),
      is_upgrade: charge.isUpgrade,
      upgraded_from_subscription_id: currentRecord?._id ?? null,
      upgraded_from_plan: current?.planName ?? null,
      upgraded_from_cycle: current?.billingCycle ?? null,
      cumulative_usdc_paid: cumulativePaid,
      tx_hash: tx_hash.toLowerCase(),
      token,
      network: verification.network ?? chainCfg.name,
      chain_id: chainId,
      treasury_address: TREASURY_ADDRESS,
      status: 'confirmed',
      created_at: new Date(),
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
      user_agent: req.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        subscription_id: subscription._id,
        plan_name,
        billing_cycle,
        usdc_amount: verifiedAmount,
        reward_min_usdc: rewardMin,
        reward_max_usdc: rewardMax,
        subscription_start: SUBSCRIPTION_START_LABEL,
        reward_payout_window: REWARD_PAYOUT_LABEL,
        access_months: getAccessMonths(billing_cycle),
        renews_automatically: renewsAutomatically(billing_cycle),
        is_upgrade: charge.isUpgrade,
        cumulative_usdc_paid: cumulativePaid,
      },
    });
  } catch (error) {
    console.error('Error recording subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record subscription', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const wallet = searchParams.get('wallet');
    if (!wallet) {
      return NextResponse.json({ success: false, error: 'Wallet address required' }, { status: 400 });
    }

    const subscriptions = await Subscription.find({
      wallet_address: wallet.toLowerCase(),
      status: 'confirmed',
    }).sort({ created_at: -1 });

    const totalPaid = subscriptions.reduce((sum, s) => sum + s.usdc_amount, 0);
    const totalRewardMin = subscriptions.reduce((sum, s) => sum + s.reward_min_usdc, 0);
    const totalRewardMax = subscriptions.reduce((sum, s) => sum + s.reward_max_usdc, 0);

    return NextResponse.json({
      success: true,
      data: {
        subscriptions,
        summary: {
          totalPaid,
          totalRewardMin,
          totalRewardMax,
          subscriptionCount: subscriptions.length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
