import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Whitelist } from '@/models/Whitelist';
import { KNOWN_VAULT_IDS } from '@/lib/whitelist';

export const dynamic = 'force-dynamic';

const TEST_WALLET = '0xtest_debug_wallet_yieldr';

/**
 * GET /api/debug/whitelist?wallet=0x...&vault_id=geo
 *
 * Without params   → full diagnostic: mongo ping + recent 20 entries + per-vault counts
 * ?wallet=0x...    → look up all vaults this wallet is registered for
 * ?vault_id=geo    → list recent 10 entries for that vault
 * ?run_test=1      → write a test entry, read it back, then delete it (write-path smoke test)
 */
export async function GET(request: Request) {
  const start = Date.now();
  const { searchParams } = new URL(request.url);
  const wallet   = searchParams.get('wallet');
  const vaultId  = searchParams.get('vault_id');
  const runTest  = searchParams.get('run_test') === '1';

  // ── 1. DB connection ────────────────────────────────────────
  let dbMs: number;
  try {
    await connectDB();
    dbMs = Date.now() - start;
  } catch (err) {
    return NextResponse.json({
      ok: false,
      stage: 'db_connect',
      error: String(err),
    }, { status: 500 });
  }

  // ── 2. Write-path smoke test ─────────────────────────────────
  if (runTest) {
    const testVault = 'geo';
    let writeOk = false;
    let readOk  = false;
    let deleteOk = false;
    let writeErr: string | null = null;

    try {
      await Whitelist.deleteOne({ wallet_address: TEST_WALLET, vault_id: testVault });
      await Whitelist.create({
        wallet_address: TEST_WALLET,
        vault_id: testVault,
        ip_address: '127.0.0.1',
        user_agent: 'debug-test',
      });
      writeOk = true;

      const doc = await Whitelist.findOne({ wallet_address: TEST_WALLET, vault_id: testVault }).lean();
      readOk = !!doc;

      await Whitelist.deleteOne({ wallet_address: TEST_WALLET, vault_id: testVault });
      deleteOk = true;
    } catch (err) {
      writeErr = String(err);
    }

    return NextResponse.json({
      ok: writeOk && readOk && deleteOk,
      test: 'write → read → delete',
      db_connect_ms: dbMs,
      write: writeOk,
      read_back: readOk,
      cleanup: deleteOk,
      error: writeErr,
      total_ms: Date.now() - start,
    });
  }

  // ── 3. Wallet lookup ─────────────────────────────────────────
  if (wallet) {
    try {
      const entries = await Whitelist.find({ wallet_address: wallet.toLowerCase() })
        .select('vault_id created_at ip_address user_agent')
        .sort({ created_at: -1 })
        .lean<{ vault_id: string; created_at: Date; ip_address?: string; user_agent?: string }[]>();

      return NextResponse.json({
        ok: true,
        wallet: wallet.toLowerCase(),
        registered_vaults: entries.map((e) => e.vault_id),
        entries,
        db_connect_ms: dbMs,
        total_ms: Date.now() - start,
      });
    } catch (err) {
      return NextResponse.json({ ok: false, stage: 'wallet_lookup', error: String(err) }, { status: 500 });
    }
  }

  // ── 4. Vault-specific recent entries ─────────────────────────
  if (vaultId) {
    if (!KNOWN_VAULT_IDS.includes(vaultId)) {
      return NextResponse.json({
        ok: false,
        error: `Unknown vault_id. Valid: ${KNOWN_VAULT_IDS.join(', ')}`,
      }, { status: 400 });
    }
    try {
      const entries = await Whitelist.find({ vault_id: vaultId })
        .select('wallet_address created_at ip_address')
        .sort({ created_at: -1 })
        .limit(10)
        .lean<{ wallet_address: string; created_at: Date; ip_address?: string }[]>();

      const total = await Whitelist.countDocuments({ vault_id: vaultId });

      return NextResponse.json({
        ok: true,
        vault_id: vaultId,
        total_in_db: total,
        recent_10: entries,
        db_connect_ms: dbMs,
        total_ms: Date.now() - start,
      });
    } catch (err) {
      return NextResponse.json({ ok: false, stage: 'vault_lookup', error: String(err) }, { status: 500 });
    }
  }

  // ── 5. Full diagnostic (no params) ───────────────────────────
  try {
    const counts: Record<string, number> = {};
    await Promise.all(
      KNOWN_VAULT_IDS.map(async (id) => {
        counts[id] = await Whitelist.countDocuments({ vault_id: id });
      })
    );

    const total = await Whitelist.countDocuments({});

    const recent = await Whitelist.find({})
      .select('wallet_address vault_id created_at ip_address')
      .sort({ created_at: -1 })
      .limit(20)
      .lean<{ wallet_address: string; vault_id: string; created_at: Date; ip_address?: string }[]>();

    return NextResponse.json({
      ok: true,
      summary: {
        total_entries: total,
        by_vault: counts,
      },
      recent_20: recent,
      db_connect_ms: dbMs,
      total_ms: Date.now() - start,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, stage: 'full_diagnostic', error: String(err) }, { status: 500 });
  }
}
