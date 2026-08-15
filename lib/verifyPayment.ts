// On-chain payment verification — server-side source of truth for subscription payments.
//
// The client (browser wallet) cannot be trusted to self-report how much it paid or
// where it sent funds — a modified frontend, a tampered request, or a replayed old
// tx_hash could otherwise be used to fabricate a "payment" record. This module reads
// the transaction directly from each chain's RPC and only accepts payments whose
// on-chain ERC20 Transfer log actually moved the claimed token, from the claimed
// wallet, to the Yieldr treasury address, for at least the claimed amount.

import { createPublicClient, http, formatUnits, type Chain } from 'viem';
import { base, mainnet, polygon, bsc } from 'viem/chains';
import { robinhoodChain } from '@/lib/chains/robinhoodChain';
import { SUPPORTED_CHAINS, TREASURY_ADDRESS, getProxyRpcUrl, type TokenId } from '@/config/payment';

const VIEM_CHAINS: Record<number, Chain> = {
  8453: base,
  1: mainnet,
  137: polygon,
  56: bsc,
  4663: robinhoodChain,
};

// Server-to-server call to the same RPC proxy the client uses — the real
// provider keys never need to live in this app's own env vars at all, on
// either side of the client/server boundary.

// keccak256("Transfer(address,address,uint256)")
const TRANSFER_TOPIC0 =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

const TREASURY_TOPIC = `0x${TREASURY_ADDRESS.toLowerCase().replace(/^0x/, '').padStart(64, '0')}`;

export interface VerifyPaymentInput {
  chainId: number;
  txHash: `0x${string}`;
  token: TokenId;
  walletAddress: string;
}

export interface VerifyPaymentResult {
  ok: boolean;
  error?: string;
  /** On-chain verified amount, in human units (e.g. 100.0 USDC). Only set when ok. */
  amount?: number;
  network?: string;
}

function topicToAddress(topic: string): string {
  return `0x${topic.slice(-40)}`.toLowerCase();
}

async function getReceiptWithRetry(
  client: ReturnType<typeof createPublicClient>,
  hash: `0x${string}`,
  attempts = 4,
  delayMs = 1500
) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await client.getTransactionReceipt({ hash });
    } catch (err) {
      if (i === attempts - 1) throw err;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error('unreachable');
}

/**
 * Verifies that `txHash` on `chainId` contains a successful ERC20 Transfer of
 * `token` from `walletAddress` to the Yieldr treasury address. Returns the
 * actual on-chain amount — callers must use THIS amount, never a client-supplied one.
 */
export async function verifyOnchainPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
  const { chainId, txHash, token, walletAddress } = input;

  const chainCfg = SUPPORTED_CHAINS[chainId];
  if (!chainCfg) return { ok: false, error: 'Unsupported chain' };

  const tokenCfg = chainCfg.tokens[token];
  if (!tokenCfg) return { ok: false, error: 'Unsupported token for this chain' };

  const viemChain = VIEM_CHAINS[chainId];
  const rpcUrl = getProxyRpcUrl(chainId);
  if (!viemChain || !rpcUrl) return { ok: false, error: 'No RPC configured for this chain' };

  if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) return { ok: false, error: 'Malformed transaction hash' };

  const client = createPublicClient({ chain: viemChain, transport: http(rpcUrl) });

  let receipt;
  try {
    receipt = await getReceiptWithRetry(client, txHash);
  } catch {
    return { ok: false, error: 'Transaction not found on-chain (yet)' };
  }

  if (receipt.status !== 'success') {
    return { ok: false, error: 'Transaction did not succeed on-chain' };
  }

  // Find every Transfer log emitted by the EXPECTED token contract that pays the
  // EXPECTED treasury address FROM the claimed wallet — not just any log in the
  // tx (a tx can contain multiple transfers, e.g. an approve + transfer, or an
  // attacker padding the tx with unrelated transfers to a different recipient).
  // Summing every qualifying log (rather than taking just the first) means a
  // legitimately split/routed payment still verifies correctly; it does not
  // weaken the check, since every summed log independently satisfies the same
  // token-contract / recipient / sender constraints.
  const matchingLogs = receipt.logs.filter(log => {
    if (log.address.toLowerCase() !== tokenCfg.address.toLowerCase()) return false;
    if (!log.topics[0] || log.topics[0].toLowerCase() !== TRANSFER_TOPIC0) return false;
    if (!log.topics[1] || !log.topics[2]) return false;
    if (log.topics[2].toLowerCase() !== TREASURY_TOPIC) return false;
    return topicToAddress(log.topics[1]) === walletAddress.toLowerCase();
  });

  if (matchingLogs.length === 0) {
    return { ok: false, error: 'No transfer from this wallet to the Yieldr treasury address found in this transaction' };
  }

  const rawAmount = matchingLogs.reduce((sum, log) => sum + BigInt(log.data), BigInt(0));
  const amount = parseFloat(formatUnits(rawAmount, tokenCfg.decimals));

  if (!(amount > 0)) {
    return { ok: false, error: 'On-chain transfer amount is zero' };
  }

  return { ok: true, amount, network: chainCfg.name };
}
