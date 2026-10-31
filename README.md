# AI Interactive RAG

An interactive learning platform for AI engineering — **RAG systems, agents, prompt engineering, LLM evaluation, and production AI** — built as a React + Vite single-page app with 200 lazily-loaded topic tabs, interactive diagrams, pipeline simulators, and quizzes.

## What's inside

- **200 topic tabs** across 6 umbrella areas: Foundations & Architecture, Data & Platform Layers, RAG Architectures & Pipelines, Context & Memory Engineering, Agent Systems & Frameworks, Production & Frontiers.
- Each topic lives in its own folder under `src/` as a `*Tab.jsx` component plus an `*Engine.js` data/logic module, all registered in `src/registry/tabsRegistry.js`.
- Interactive components: RAG pipeline simulator, LangChain/LangGraph comparisons, zoomable figures, prompt workbench, RAG playground, diagnostic quizzes, skill trees.
- `src/services/` holds reusable logic (prompt composer, quality evaluator, framework recommender, output contracts, mastery tracking) exercised by the test suite.

## Stack

| Layer | Tech |
| --- | --- |
| Web app | React 18, Vite 5 |
| Tests | Node built-in test runner (`node --test`) |
| Mobile | Capacitor 8 (Android + iOS) |
| Deploy | Hostinger Cloud (Node.js web app) or Vercel (`vercel.json` SPA rewrite) |
| Content | 72 diagrams/SVGs in `public/assets/`, design tokens in `src/design-system/` |

## Getting started

```bash
npm install
npm run dev        # start dev server
npm test           # run 67 tests (node --test tests/*.test.js)
npm run build      # production build → dist/
npm run preview    # preview the production build
```

## Deploy to Hostinger Cloud

Requires a plan with Web Apps: **Business Web Hosting** or **Cloud Startup** and above.

1. hPanel → **Websites → Add Website → Node.js web app** → **Import Git repository**.
2. Use these deploy settings (Hostinger auto-detects most of them):

   | Field | Value |
   | --- | --- |
   | Framework preset | `react` |
   | Node.js version | `22` (from `engines` / `.nvmrc`) |
   | Build command | `npm run build` |
   | Output directory | `dist` |
   | Entry file | *(leave empty — static frontend)* |

3. Deploy. Hostinger installs dependencies, runs the Vite build, and serves `dist/` from `public_html`.
4. Push to the connected branch to redeploy.

Do not hand-edit the generated `.htaccess`; redeploys regenerate it. The app uses `?tab=<id>` URLs, so no extra SPA rewrite is required. For archive deploys, exclude `node_modules/` and `dist/` (source is ~19 MB, under the 50 MB limit).

## Deploy to Vercel (recommended for serverless functions)

Vercel is the recommended platform when using the serverless API routes under `api/` (AI proxy, document parse). The `vercel.json` at the repo root configures the build, rewrites, function runtimes, and cache headers.

### Quick start (Vercel CLI)

```bash
npm i -g vercel
vercel login
vercel --prod
```

### GitHub integration (CI/CD)

1. Push this repo to GitHub.
2. In Vercel dashboard → **Add New Project** → Import the GitHub repo.
3. Framework preset: **Vite** (auto-detected).
4. Build command: `npm run build` (default).
5. Output directory: `dist` (default).
6. **Environment Variables** (Project Settings → Environment Variables):
   - `SUPABASE_URL` — `https://zmrplimcswbfhgkbslpx.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` — service-role key (server-only, from Supabase Dashboard → Settings → API)
   - `OPENAI_API_KEY` — OpenAI API key for the AI proxy (server-only)
   - Client-side vars (prefixed `VITE_`): `VITE_SUPABASE_URL=https://zmrplimcswbfhgkbslpx.supabase.co`, `VITE_SUPABASE_ANON_KEY` (anon key from Supabase Dashboard)
7. Deploy. Vercel runs the build, deploys `dist/` to the edge network, and provisions the Node.js serverless functions under `api/`.

### Vercel Hobby tier limits

| Limit | Value | Notes |
|-------|-------|-------|
| Serverless function duration | 60 s | `maxDuration: 60` in `vercel.json` |
| Function payload size | 4.5 MB | Our PDF parse caps at 20 MB — use smaller files on Hobby; upgrade to Pro for larger |
| Bandwidth | 100 GB/mo | Static assets cached at edge (`Cache-Control: immutable`) |
| Function invocations | 100k/mo | Sufficient for moderate AI proxy usage |

### Environment variable hygiene

- **Never** put secrets in `VITE_*` variables — they are embedded in the client bundle.
- Server-only vars (`SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`) must be set in the Vercel dashboard (Project Settings → Environment Variables), not in `.env` or the repo.

## Search

Global search (⌘K / Ctrl+K / `/`) and the sidebar filter run on **MiniSearch** with
typo tolerance, prefix matching, synonyms/abbreviations, module-grouped results,
match highlighting, "did you mean…", and per-tab "Related topics" / "More like this".
The index lazy-loads on first search open — nothing search-related is in the main bundle.

### Files

| File | Role |
| --- | --- |
| `src/search/search-index.json` | One metadata record per tab: `{ id, title, module, tags[], aliases[], summary, body?, related[], rank?, kind? }` — **hand-editable** |
| `src/search/synonyms.js` | Synonym/abbreviation groups + stop words (query-time only) |
| `src/search/engine.js` | MiniSearch factory: boosts (title > tags = aliases > summary > body), prefix, fuzzy, soft-verb handling, RRF fusion |
| `src/search/search.js` | Public API: `search` / `similar` / `suggest` / `filterTabIds` / `ensureReady`; lazy-loads the index and hosts the off-by-default semantic flag |
| `src/search/similar.json` | Generated top-5 similar tabs per tab (do not hand-edit) |
| `scripts/build-search-index.mjs` | Generates/refreshes `search-index.json` from the registry + tab source |
| `scripts/build-similar.mjs` | Embeds tabs and writes `similar.json` (cached, idempotent) |

### How to add metadata for a new tab

1. Add the tab to `src/registry/tabsRegistry.js` as usual (never change existing ids — URLs are `?tab=<id>`).
2. Run `node scripts/build-search-index.mjs` — it drafts a record (title, module, tags from `keywords`, a summary scraped from the tab component). Existing hand-edits are preserved for any key already present; use `--force` to regenerate everything.
3. Improve the draft by editing the record in `search-index.json`:
   - `tags` / `aliases` — extra words people search for (aliases are great for abbreviations and alternate names)
   - `summary` — one line shown under each result
   - `related` — curated related tab ids (these rank above generated neighbors)
   - `rank` — optional score multiplier (e.g. `1.8` for the `rag` hub) for canonical overview tabs
4. Run `node scripts/build-similar.mjs` to refresh similar-topic neighbors (see below).

### How to add synonyms

Append a group in `src/search/synonyms.js` (lowercase, one array per equivalence class):

```js
['mcp', 'model context protocol'],                 // abbreviation ↔ expansion
{ soft: true, terms: ['prevent', 'stop', 'block'] } // soft: boosts only, never drives ranking
```

### How to regenerate similar.json

```bash
node scripts/build-similar.mjs                  # OpenAI embeddings if OPENAI_API_KEY is set…
node scripts/build-similar.mjs --lexical        # …otherwise (or with this flag) offline lexical mode
```

- The API key is read from `OPENAI_API_KEY` only (never hardcoded; override the model with `EMBEDDING_MODEL`).
- Vectors are cached in `scripts/.embedding-cache.json` (gitignored) keyed by content hash — only changed tabs are re-embedded; output is deterministic (no timestamps).
- Manual `related[]` links from `search-index.json` always rank ahead of generated neighbors.

Optional runtime **semantic query search** (off by default): set `VITE_SEMANTIC_SEARCH=1` and call `setSemanticEmbedder(fn)` from `search.js` with a `(text) => Promise<number[]>` function; results merge with keyword hits via reciprocal rank fusion.

### Search test checklist (expected top result)

| # | Query | Expected in top 3 |
| --- | --- | --- |
| 1 | `rag` | `rag` |
| 2 | `retreival` (typo) | `rag` or `filtering` |
| 3 | `MCP` | `mcpclient` |
| 4 | `model context protocol` | `mcpclient` |
| 5 | `guardrails` | `guardrails` |
| 6 | `lstm` | `lstm` |
| 7 | `how do agents remember things` | `agentmemory` |
| 8 | `reduce hallucinations` | `hallucination` |
| 9 | `hybrid search bm25` | `rag` or `filtering` |
| 10 | `finops cost` | `finops` |
| 11 | `observability` | `observability` |
| 12 | `multi agent swarm` | `multiagent` family (incl. `zerocostmultiagent`, `multiagentcoord`) |
| 13 | `chunking` | `ragchunking` |
| 14 | `langgraph` | `langgraph` |
| 15 | `tensor` | `keras3`, `archconcepts`, or `selfattention` |

These are asserted by `tests/searchEngine.test.js` (run with `npm test`).

## Mobile (Capacitor)

See [MOBILE_APP_GUIDE.md](MOBILE_APP_GUIDE.md).

```bash
npm run cap:build  # build web app and sync into android/ and ios/
npm run cap:android
npm run cap:ios
```

## Project layout

```
index.html            Vite entry
src/
  main.jsx            mounts AppNew + ErrorBoundary
  AppNew.jsx          app shell (sidebar/topbar routing)
  registry/           tabsRegistry.js (tab + category registry), curriculum,
                      exitChecks, diagnostics, antiPatterns, warStories
  search/             search-index.json, synonyms, MiniSearch engine, similar.json
  components/         layout/, ui/, overview/, search/, ragPlayground/, workbench/
  services/           prompt/quality/framework logic shared across tabs
  design-system/      tokens, global styles, diagram tokens
  <topic folders>/    ~130 topic modules (Tab.jsx + engine.js)
  hubPages/           hub landing pages grouping related topics
scripts/              build-search-index.mjs, build-similar.mjs
tests/                node --test suites (includes search engine tests)
public/assets/        diagrams and infographics (SVG/PNG)
android/, ios/        Capacitor native projects
export_playbook.py    exports playbook content
```

## Documentation

Specs and engineering notes at the repo root:

- `AGENTIC_RAG_LET_THE_AGENT_SEARCH.md`, `RAG_WORKFLOW_AND_LOOP_ENGINEERING_DISPATCHER.md` — agentic RAG design
- `DOCUMENT_STRUCTURE_LOOP_ENGINEERING.md`, `AGENTIC_DOCUMENT_PARSING_DISPATCHER.md` — document parsing
- `CROSS_REFERENCE_LOOP_ENGINEERING.md`, `TOOL_CALLING_AGENT_DEBUGGING.md` — loops and tool calling
- `ZERO_MODEL_FASTPATH_QUERY_ROUTER.md`, `AI_DATA_AGENT_BIGQUERY.md` — routing and data agents
- `AI_SLOP_DETECTION_HEURISTICS.md`, `REDESIGN_SPEC.md` — quality heuristics and UI redesign
- `ENHANCED_CONTENT.md` — AI-generated tables, workflows, code examples, and diagrams for advanced LLM techniques
- `MOBILE_APP_GUIDE.md` — Capacitor setup
