// Yieldr RPC proxy
//
// Sits between the browser (and the main app's server-side payment
// verification) and the real RPC provider (Alchemy). The provider API keys
// live ONLY here, as env vars on whatever host runs this service — never in
// the main app, on either the client or server side. This is the only place
// in the whole system that ever holds them.
//
// Two things keep this safe to expose publicly even though its own URL is
// not a secret:
//   1. Method allowlist — only read-only calls the app actually needs are
//      forwarded (balance reads, transaction receipt polling, basic chain
//      sanity checks). Everything else is rejected outright, so this can
//      never become a general-purpose RPC gateway or be used to submit
//      transactions, even if someone finds the URL.
//   2. CORS origin allowlist — only requests from configured origins are
//      permitted from a browser context (server-to-server calls, which send
//      no Origin header, are allowed through for the main app's own backend
//      to use).

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 8787;

// Friendly path segment -> upstream RPC URL env var. Add a chain here (and
// to the env) to support it; anything without a configured URL is disabled.
const UPSTREAM_ENV_VARS = {
  base: 'RPC_BASE',
  ethereum: 'RPC_ETHEREUM',
  polygon: 'RPC_POLYGON',
  bsc: 'RPC_BSC',
  robinhood: 'RPC_ROBINHOOD',
};

const UPSTREAMS = {};
for (const [chain, envVar] of Object.entries(UPSTREAM_ENV_VARS)) {
  const url = process.env[envVar];
  if (url) UPSTREAMS[chain] = url;
}

// Every JSON-RPC method the app actually calls: ERC20 balanceOf reads
// (eth_call), transaction receipt polling after a payment (used both by the
// client waiting for confirmation and by the server verifying it), and a
// couple of basic sanity/read calls viem issues on its own. Nothing here can
// send or sign a transaction.
const ALLOWED_METHODS = new Set([
  'eth_call',
  'eth_getBalance',
  'eth_getTransactionReceipt',
  'eth_blockNumber',
  'eth_chainId',
  'net_version',
]);

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const app = express();
app.set('trust proxy', true); // Railway sits behind a proxy; needed for req.ip to be the real client IP
app.use(express.json({ limit: '256kb' }));
app.use(
  cors({
    origin(origin, callback) {
      // No Origin header = server-to-server call (our own backend, curl,
      // health checks) — not a browser request, so the origin allowlist
      // doesn't apply to it.
      if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new Error('Origin not allowed'));
    },
  })
);

// Minimal in-memory rate limit: N requests per IP per rolling window. This
// is a single-instance, best-effort guard against casual abuse if the URL
// gets scraped — not a substitute for the method allowlist above, which is
// what actually bounds the damage.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 120;
const hits = new Map();
setInterval(() => hits.clear(), RATE_LIMIT_WINDOW_MS).unref();

function rateLimit(req, res, next) {
  const ip = req.ip || 'unknown';
  const count = (hits.get(ip) || 0) + 1;
  hits.set(ip, count);
  if (count > RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  next();
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', configuredChains: Object.keys(UPSTREAMS) });
});

app.post('/rpc/:chain', rateLimit, async (req, res) => {
  const upstream = UPSTREAMS[req.params.chain];
  if (!upstream) {
    return res.status(404).json({ error: `Unknown or unconfigured chain: ${req.params.chain}` });
  }

  const body = req.body;
  // viem may batch several calls into one POST as a JSON array — check every
  // call in the batch, not just the first.
  const calls = Array.isArray(body) ? body : [body];

  for (const call of calls) {
    if (!call || typeof call.method !== 'string' || !ALLOWED_METHODS.has(call.method)) {
      return res.status(403).json({ error: `Method not allowed: ${call?.method ?? 'unknown'}` });
    }
  }

  try {
    const upstreamRes = await fetch(upstream, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await upstreamRes.json();
    res.status(upstreamRes.status).json(data);
  } catch (err) {
    console.error(`[rpc-proxy] upstream request failed for chain=${req.params.chain}:`, err);
    res.status(502).json({ error: 'Upstream RPC request failed' });
  }
});

// Catches the CORS middleware's rejection (and anything else unhandled) —
// without this, Express's default error handler returns a full stack trace
// with server file paths in the response body, which is its own small
// information leak on a publicly reachable service.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.warn(`[rpc-proxy] request rejected: ${err.message}`);
  res.status(403).json({ error: 'Forbidden' });
});

app.listen(PORT, () => {
  console.log(`RPC proxy listening on :${PORT}`);
  console.log(`Configured chains: ${Object.keys(UPSTREAMS).join(', ') || '(none — set RPC_* env vars)'}`);
  console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});
