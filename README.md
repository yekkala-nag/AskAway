# AI Interactive RAG

An interactive learning platform for AI engineering — **RAG systems, agents, prompt engineering, LLM evaluation, and production AI** — built as a React + Vite single-page app with 198 lazily-loaded topic tabs, interactive diagrams, pipeline simulators, and quizzes.

## What's inside

- **198 topic tabs** across 6 umbrella areas: Foundations & Architecture, Data & Platform Layers, RAG Architectures & Pipelines, Context & Memory Engineering, Agent Systems & Frameworks, Production & Frontiers.
- Each topic lives in its own folder under `src/` as a `*Tab.jsx` component plus an `*Engine.js` data/logic module, all registered in `src/registry/tabsRegistry.js`.
- Interactive components: RAG pipeline simulator, LangChain/LangGraph comparisons, zoomable figures, prompt workbench, RAG playground, diagnostic quizzes, skill trees.
- `src/services/` holds reusable logic (prompt composer, quality evaluator, framework recommender, output contracts, mastery tracking) exercised by the test suite.

## Stack

| Layer | Tech |
| --- | --- |
| Web app | React 18, Vite 5 |
| Tests | Node built-in test runner (`node --test`) |
| Mobile | Capacitor 8 (Android + iOS) |
| Deploy | Vercel (`vercel.json` SPA rewrite) |
| Content | 72 diagrams/SVGs in `public/assets/`, design tokens in `src/design-system/` |

## Getting started

```bash
npm install
npm run dev        # start dev server
npm test           # run 67 tests (node --test tests/*.test.js)
npm run build      # production build → dist/
npm run preview    # preview the production build
```

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
  components/         layout/, ui/, overview/, ragPlayground/, workbench/
  services/           prompt/quality/framework logic shared across tabs
  design-system/      tokens, global styles, diagram tokens
  <topic folders>/    ~130 topic modules (Tab.jsx + engine.js)
  hubPages/           hub landing pages grouping related topics
tests/                11 test suites, 67 assertions
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
- `MOBILE_APP_GUIDE.md` — Capacitor setup
