# Yieldr RPC Proxy

Forwards a fixed allowlist of read-only JSON-RPC calls to the real RPC provider (Alchemy). The provider keys live only in this service's env vars — the main Next.js app never holds them, on either the client or server side.

## Local development

```bash
cd rpc-proxy
npm install
cp .env.example .env   # fill in your real Alchemy URLs
npm start
```

Runs on `http://localhost:8787` by default. Check it's up:

```bash
curl http://localhost:8787/health
```

## Deploying to Railway

1. In your existing Railway project, add a **New Service** → **Deploy from GitHub repo** → select this repo.
2. In that service's **Settings → Source**, set **Root Directory** to `rpc-proxy` (this is a subdirectory of the main app's repo, not the repo root).
3. In **Variables**, add the same keys as `.env.example`: `RPC_BASE`, `RPC_ETHEREUM`, `RPC_POLYGON`, `RPC_BSC`, `RPC_ROBINHOOD`, and `ALLOWED_ORIGINS` (set this to your production domain, plus `http://localhost:3000` if you also want local dev to reach the deployed proxy instead of running one locally).
4. Deploy. Railway auto-detects the Node app from `package.json` and runs `npm install && npm start`.
5. Once deployed, note the service's public URL (Settings → Networking → Generate Domain if one isn't assigned yet) — this is what goes into the main app's `NEXT_PUBLIC_RPC_PROXY_URL`.

## Adding a new chain

Add an entry to `UPSTREAM_ENV_VARS` in `server.js`, set the matching env var, and add the same chain ID → path mapping in the main app's `config/payment.ts` (`RPC_PROXY_CHAIN_PATHS`).
