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
import { TREASURY_ADDRESS, SUPPORTED_CHAINS, type TokenId } from '@/config/payment';
import {
  isPlanName,
  isBillingCycle,
  getPlanPrice,
  REWARD_MULTIPLIER_MIN,
  REWARD_MULTIPLIER_MAX,
  REWARD_PAYOUT_LABEL,
  SUBSCRIPTION_START_LABEL,
  SUBSCRIPTION_ACCESS_MONTHS,
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
    if (token !== 'USDC' && token !== 'USDT') {
      return NextResponse.json({ success: false, error: 'Unsupported token' }, { status: 400 });
    }

    // Reject replays / duplicate submissions of the same transaction up front.
    const existing = await Subscription.findOne({ tx_hash: tx_hash.toLowerCase() });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Transaction already recorded' }, { status: 409 });
    }

    // The expected price comes from OUR OWN plan catalogue, never from the client.
    const expectedPrice = getPlanPrice(plan_name, billing_cycle);
    if (expectedPrice === null) {
      return NextResponse.json({ success: false, error: 'Unable to resolve plan price' }, { status: 400 });
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

    if (verification.amount + AMOUNT_TOLERANCE < expectedPrice) {
      return NextResponse.json(
        {
          success: false,
          error: `On-chain payment ($${verification.amount.toFixed(2)}) is below the ${plan_name} ${billing_cycle} price ($${expectedPrice})`,
        },
        { status: 402 }
      );
    }

    const verifiedAmount = verification.amount;
    const rewardMin = verifiedAmount * REWARD_MULTIPLIER_MIN;
    const rewardMax = verifiedAmount * REWARD_MULTIPLIER_MAX;

    const subscription = await Subscription.create({
      wallet_address: wallet_address.toLowerCase(),
      plan_name,
      billing_cycle,
      usdc_amount: verifiedAmount,
      reward_min_usdc: rewardMin,
      reward_max_usdc: rewardMax,
      reward_payout_window: REWARD_PAYOUT_LABEL,
      subscription_start: SUBSCRIPTION_START_LABEL,
      access_months: SUBSCRIPTION_ACCESS_MONTHS,
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
