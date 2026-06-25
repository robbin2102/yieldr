import { Whitelist } from '@/models/Whitelist';
import { VaultWhitelistBase } from '@/models/VaultWhitelistBase';

// Agent vault ids surfaced for whitelisting on /explorer and /vaults
export const KNOWN_VAULT_IDS = ['geo', 'nba', 'funding', 'aero', 'base', 'spacex', 'meme'];

// Once a vault's real whitelist count passes this, the randomized base count
// is dropped entirely and only the real count is shown.
const BASE_COUNT_CUTOFF = 500;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getOrCreateBase(vaultId: string): Promise<{ base_count: number; base_aum: number }> {
  const existing = await VaultWhitelistBase.findOne({ vault_id: vaultId }).lean<{
    base_count: number;
    base_aum?: number;
  }>();

  if (existing && typeof existing.base_aum === 'number') {
    return { base_count: existing.base_count, base_aum: existing.base_aum };
  }

  // Backfill a record created before base_aum existed.
  if (existing) {
    const base_aum = randomInt(50_000, 500_000);
    const updated = await VaultWhitelistBase.findOneAndUpdate(
      { vault_id: vaultId, base_aum: { $exists: false } },
      { $set: { base_aum } },
      { new: true }
    ).lean<{ base_count: number; base_aum: number }>();
    return updated ?? { base_count: existing.base_count, base_aum };
  }

  const base_count = randomInt(30, 100);
  const base_aum = randomInt(50_000, 500_000);
  try {
    const doc = await VaultWhitelistBase.create({ vault_id: vaultId, base_count, base_aum });
    return { base_count: doc.base_count, base_aum: doc.base_aum };
  } catch {
    // Lost a race with a concurrent request — read back the winner's value.
    const doc = await VaultWhitelistBase.findOne({ vault_id: vaultId }).lean<{
      base_count: number;
      base_aum: number;
    }>();
    return doc ?? { base_count, base_aum };
  }
}

export async function getDisplayCount(vaultId: string): Promise<number> {
  const actual = await Whitelist.countDocuments({ vault_id: vaultId });
  if (actual > BASE_COUNT_CUTOFF) return actual;
  const { base_count } = await getOrCreateBase(vaultId);
  return base_count + actual;
}

export async function getBaseAUM(vaultId: string): Promise<number> {
  const { base_aum } = await getOrCreateBase(vaultId);
  return base_aum;
}

export async function registerWallet(
  walletAddress: string,
  vaultId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<number> {
  try {
    await Whitelist.create({
      wallet_address: walletAddress.toLowerCase(),
      vault_id: vaultId,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (err: unknown) {
    const isDuplicate = err instanceof Error && (err as { code?: number }).code === 11000;
    if (!isDuplicate) throw err;
    // already whitelisted for this vault — not an error
  }

  return getDisplayCount(vaultId);
}

export async function getWhitelistStats(): Promise<{
  total_aum: number;
  total_wallets: number;
  vault_count: number;
}> {
  let total_aum = 0;
  let total_wallets = 0;

  await Promise.all(
    KNOWN_VAULT_IDS.map(async (id) => {
      const [count, aum] = await Promise.all([getDisplayCount(id), getBaseAUM(id)]);
      total_wallets += count;
      total_aum += aum;
    })
  );

  return { total_aum, total_wallets, vault_count: KNOWN_VAULT_IDS.length };
}
