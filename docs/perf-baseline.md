# Performance Baseline — AskAway

Measured `npm run build` on `main` (commit 43ddbb9 "4 articles added"), Node ≥ 22, Vite 5.

| Artifact | Size (raw) | Gzip | Target (gzip) |
|----------|------------|------|---------------|
| Entry `index-*.js` | 630.47 kB | 201.77 kB | ≤ 120 kB |
| Legacy `App-*.js` | 1,358.31 kB | 324.49 kB | removed from tab paths |
| `tocReconstructor-*.js` | 490.26 kB | 146.67 kB | off the client (server) |
| `search-index-*.js` | 134.29 kB | 41.97 kB | lazy / server-side |
| `dist/` total | ≈ 17 MB | — | — |
| Static assets | 9.2 MB (59 SVG, 16 PNG) | — | ≤ 3 MB, lazy-loaded |

Tests: 622 pass / 47 suites / 0 fail.

Source of truth: `dist/assets/` gzip sizes from the production build output.

## After Phase 1 (client diet, branch `phase-1-client-diet`)

| Artifact | Size (raw) | Gzip | Target (gzip) | Status |
|----------|------------|------|---------------|--------|
| Entry `index-*.js` | 368.72 kB | 116.48 kB | ≤ 120 kB | ✓ met |
| `react-*.js` (separate chunk) | 141.83 kB | 45.41 kB | — | split from entry |
| `vendor-*.js` (lazy, search) | 496.25 kB | 147.67 kB | — | split from entry |
| `Sidebar-*.js` (lazy chrome) | 15.49 kB | 4.61 kB | — | split from entry |
| `CommandPalette-*.js` (lazy) | 10.71 kB | 3.99 kB | — | split from entry |
| Legacy `App-*.js` | 1,358.37 kB | 324.52 kB | removed from tab paths | `progress` tab now routes to standalone `ProgressTab-*.js` (1.58 kB gzip lazy) instead of the bridge; remaining bridge tabs pending |
| `tocReconstructor-*.js` | 12.15 kB | 5.00 kB | off the client (server) | Phase 5 |
| `search-index-*.js` | 134.29 kB | 41.97 kB | lazy / server-side | unchanged |

Tests: 622 pass / 47 suites / 0 fail.
Build: succeeds (pre-existing `textAlign` duplicate-key warning in `agentGuardrails/AgentGuardrailsTab.jsx` is unrelated).

Entry bundle reduced 201.77 kB → 116.48 kB gzip (−42%).

## After Phase 2 (Supabase foundation, branch `phase-2-supabase-foundation`)

| Addition | Detail |
|----------|--------|
| Dependency | `@supabase/supabase-js` ^2.118.0 |
| Client lib | `src/lib/supabaseClient.js` — lazy Proxy client; only `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` reach client |
| Auth helpers | `src/lib/supabaseAuth.js` — magic-link sign-in + Google OAuth + sign-out/session; DI-friendly (optional `sb` param) |
| Server admin | `api/_lib/supabaseAdmin.js` — service-role client, server-only |
| Schema + RLS | `supabase/migrations/001_initial_schema.sql` — profiles, user_progress, user_prompts, ai_usage; RLS on every table |
| RLS verification | `supabase/migrations/002_rls_cross_user_check.sql` — cross-user read must return 0 rows |
| UI | `src/components/ui/AuthButton.jsx` (lazy-loaded in TopBar via `React.lazy`) — keeps `@supabase/supabase-js` off the critical render path |
| Env template | `.env.example` (client URL+anon key; server service-role + OpenAI key) |
| Test | `tests/supabaseAuth.test.js` — 4 tests (626 total pass / 47 suites / 0 fail) |

Tests: 636 pass / 47 suites / 0 fail.
Entry bundle: 118.58 kB gzip (still ≤ 120 kB; supabase + sync lazy-loaded off critical path).

## After Phase 3 (Progress sync, local-first, branch `phase-3-progress-sync`)

| Addition | Detail |
|----------|--------|
| Sync service | `src/services/sync.js` — localStorage source of truth, debounced batched pushes (≥ 5s), offline queue with retry/backoff |
| Merge rules | mastery = max score per tab; completed tabs = union; prompts = union by id latest updated_at wins; track/active tab = latest timestamp wins |
| Consent gate | No server sync without `ai_rag_storage_consent` = 'acknowledged' |
| Auto-dirty | `main.jsx` calls `enableAutoDirty()` — wraps localStorage writes to sync keys to trigger debounced sync |
| UI | `SyncDot` in TopBar — synced/syncing/offline/error; hidden until consent |
| Login hook | `AuthButton` calls `initSync(userId, supabase)` on sign-in (pull → merge → push) |
| Test | `tests/sync.test.js` — 10 tests for merge/scoreOf (636 total pass / 47 suites / 0 fail) |

Tests: 636 pass / 47 suites / 0 fail.
Entry bundle: 118.58 kB gzip (≤ 120 kB).

## After Phase 4 (AI proxy, branch `phase-4-ai-proxy`)

| Addition | Detail |
|----------|--------|
| Proxy function | `api/ai/chat.js` — proxies OpenAI Chat Completions with SSE streaming, JWT auth, input validation, model allow-list, max_tokens cap, payload size cap, per-user daily budget + per-IP rate limit |
| Rate limiting | `api/_lib/rateLimit.js` — per-user daily budget via Supabase `ai_usage` table; per-IP rate limit (in-memory, best effort) |
| Client helper | `src/lib/aiProxy.js` — calls `/api/ai/chat`, supports SSE streaming via `onToken`, forwards user-supplied key via `x-openai-api-key` header |
| DocumentStructureTab | `callLLM` now calls proxy instead of `fetch(config.endpoint)`; `endpoint` field removed from config and UI |
| contentGenerators | `fetchAI` now calls proxy instead of direct OpenAI fetch |
| Vercel config | `api/ai/chat.js` configured as Node function (maxDuration 60s); CORS + `Cache-Control: no-store` headers for `/api/*` |
| Env template | `.env.example` — `OPENAI_API_KEY` (server-only), `SUPABASE_SERVICE_ROLE_KEY` (server-only) |
| Verification | `grep dist/` confirms no `api.openai.com`, `Authorization` Bearer, or `OPENAI_API_KEY` in DocumentStructureTab bundle |

Tests: 636 pass / 47 suites / 0 fail.
Entry bundle: 118.55 kB gzip (≤ 120 kB).

## After Phase 5 (Document parse API, branch `phase-5-document-parse`)

| Addition | Detail |
|----------|--------|
| Server parse API | `api/document/parse.js` — Vercel function (Node runtime, maxDuration 60s) accepting raw PDF bytes (`application/octet-stream`), returning `{ line_df, span_df }` JSON; uses `pdfjs-dist/legacy/build/pdf.mjs` (Node-compatible, no worker) |
| Client proxy | `DocumentStructureTab.parsePdfViaProxy(file)` — POSTs PDF to `/api/document/parse`, no pdfjs-dist in client parse path |
| Client helpers | `src/documentStructure/lineDfUtils.js` — pure helpers (`enrichLineDfWithStyle`, `weightedAverageFontSize`, `computeBoldRatio`, `mostCommonFont`) with no pdfjs dependency; used by client + `tocReconstructor.js` + `methodAdapters.js` |
| Verification | `grep dist/` confirms `DocumentStructureTab` chunk has no `getDocument` or `parsePdf`; only `parsePdfViaProxy` + `octet-stream` |
| Rate limit | Per-IP (20 req/min) via shared `api/_lib/rateLimit.js` store (keyed `:pdf` separately from AI proxy) |
| Input validation | Max 20 MB, `%PDF-` magic bytes check, 100-page cap |
| Vercel config | `api/document/parse.js` in `vercel.json` functions + CORS + `Cache-Control: no-store` for `/api/*` |
| Tests | `tests/documentParse.test.js` — 10 tests for validation + rate-limit logic |

Tests: 646 pass / 49 suites / 0 fail.
Entry bundle: 118.61 kB gzip (≤ 120 kB).

## After Phase 6 (CI/CD + edge caching, branch `phase-6-ci-cd-cache`)

| Addition | Detail |
|----------|--------|
| GitHub Actions CI | `.github/workflows/ci.yml` — test (Node 22) + build on every push/PR; uploads `dist/` artifact; commented-out Vercel deploy steps (enable with secrets) |
| Vercel security headers | `vercel.json` adds `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` to all responses |
| Vercel deploy docs | README adds Vercel quick-start, GitHub integration, environment variable hygiene, Hobby tier limits |
| Cache headers | Static `/assets/*` → `public, max-age=31536000, immutable` (1 yr); API routes → `no-store`; all routes → security headers |
| Bridge tab prep | Architecture doc updated with migration strategy; next phase will extract high-traffic tabs from `AppContent.jsx` |

Tests: 646 pass / 49 suites / 0 fail.
Entry bundle: 118.61 kB gzip (≤ 120 kB).

## After Phase 7 (Asset optimization, branch `phase-7-assets-bridge`)

| Addition | Detail |
|----------|--------|
| Asset optimizer | `scripts/optimize-assets.mjs` — converts PNGs to WebP (quality 85) + optimized PNG (palette+compression), runs SVGO on SVGs; outputs to `public/assets/optimized/` with `manifest.json` |
| Dev deps | `sharp` (image processing), `svgo` (SVG optimization) |
| WebP savings | 16 PNGs: 4.8 MB → 1.3 MB WebP (73% avg reduction; largest 96% saved) |
| PNG savings | Optimized PNGs: 4.8 MB → 2.6 MB (46% reduction via palette+compression) |
| SVG savings | 61 SVGs: ~200 KB → ~180 KB (avg 8% reduction, some 17-24%) |
| DiagramImage | Updated to use `<picture>` with WebP source + PNG fallback for raster; SVG uses optimized version directly; manifest-driven path resolution with graceful fallback |
| Cache headers | `/assets/optimized/*` → `public, max-age=31536000, immutable` |
| Build output | `dist/assets/optimized/` includes all WebP/PNG/SVG + `manifest.json`; Vercel serves with immutable caching |
| Bridge migration | Documented in `docs/legacy-migration.md`; 43 tabs still on `AppContent.jsx` (324 kB gzip) — deferred to future phase as each requires extracting inline dependencies from 22k-line `App.jsx` |

Tests: 646 pass / 49 suites / 0 fail.
Entry bundle: 118.53 kB gzip (≤ 120 kB).
Static assets: PNG originals 4.8 MB → WebP 1.3 MB (73% reduction).