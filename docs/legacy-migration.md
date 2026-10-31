# Legacy Migration Tracker

Tracks migration of bridge-backed tabs off `AppContent.jsx` → `App.jsx` into standalone
modules under `src/`. Status values: `planned`, `in-progress`, `migrated`, `verified`.

| Tab id | Status | Notes |
|--------|--------|-------|
| progress | verified | Extracted to `src/tabs/ProgressTab.jsx`; bridge chunk no longer loads for this tab. |

Highest-traffic bridge-backed tabs (candidates, order to be confirmed by traffic):
- overview, glossary, archconcepts, workflows, unhobbling, promptmgmt
- rag, pipeline, filtering, hierrag, qparseloop, prodrag
- genpatterns, fourpdfs, hallucbricks
- ctxeng, ctxmeasure, companybrain, contextgraph, vague, hallucination, memeng
- redesign, fiveassets, multiagent, agentsAsTools, codingAgentsNonProg
- langchain, langgraph, frameworkCompare, agentDebugging, agentTasks, aiProductBuilder
- aidataplatform, medallionArch, aiTestDataBottleneck, classicalML, activeLearning
- powerFeatures, frontiers, ragBeyond, practices, tokenBill, progress

## Phase 1 shell split (done)
- `Navigation.jsx` split into `TopBar.jsx` (static shell) + `Sidebar.jsx` (lazy chrome).
- `CommandPalette.jsx` extracted from `Navigation.jsx` (lazy).
- Entry bundle: 201.77 kB → 116.48 kB gzip.
- Bridge chunk (`App-*.js`, 324 kB gzip) still loads for any tab routed through `AppContent.jsx`; tab migrations (above) remove it per-tab.
