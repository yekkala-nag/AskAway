import { useState, useEffect } from 'react';
import * as Primitives from '../components/layout/Primitives';
import { Hero, CodeBlock, Stepper } from '../components/ui/Content';
import { Card, Badge, Button, Callout } from '../components/ui/Core';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import ZoomableImage from '../components/ui/ZoomableImage.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Workflow from '../components/ui/Workflow.jsx';
import { Reveal, AnimatedNumber } from '../components/ui/AnimatedReveal.jsx';

const { Container, Section, Grid, Flex, Stack } = Primitives;

// ============================================
// FINANCIAL & SDLC CASE STUDY DATA & DIAGRAMS
// ============================================

const FINANCIAL_CASE_STUDY = {
  title: "Advisor Intelligence Copilot — Enterprise Financial RAG Platform",
  subtitle: "Production Case Study: Grounded Wealth Management Assistant with Real-Time Event Streaming & Regulatory Audit Lineage",
  problem: "4,000 wealth advisors spent 25+ minutes per client request searching across fragmented PDF term sheets, research notes, and policy docs—risking non-compliant advice.",
  metrics: {
    business: [
      { label: "Research Time per Client Request", before: "25 mins", after: "9 mins", change: "-64%" },
      { label: "Market Event Prep Time", before: "60 mins", after: "15 mins", change: "-75%" },
      { label: "Advisor Satisfaction Score", before: "3.2 / 5", after: "4.4 / 5", change: "+37.5%" }
    ],
    technical: [
      { label: "Simple Chat p95 Latency", target: "< 5.0s", actual: "3.8s" },
      { label: "Retrieval Recall@10", target: "> 90%", actual: "94.2%" },
      { label: "Citation Accuracy", target: "> 95%", actual: "96.5%" }
    ],
    risk: [
      { label: "Hallucination Rate in QA", target: "< 1.0%", actual: "0.4%" },
      { label: "Policy Non-Compliance", target: "< 0.5%", actual: "0.3%" },
      { label: "Audit Log Completeness", target: "100%", actual: "100%" }
    ]
  },
  useCases: [
    {
      id: "market_event",
      name: "1. Market Event Impact Analysis",
      event: "Central bank raises interest rates by 25 basis points (Policy Rate: 5.50%)",
      eventPayload: {
        event_id: "EVT-2026-FED-0814",
        source: "Kafka:market.fed.events",
        asset_class_impacted: ["Fixed Income", "Real Estate REITs", "Growth Tech"],
        severity: "HIGH_REVENUE_IMPACT",
        timestamp: "2026-08-15T14:30:00Z"
      },
      flow: [
        "Kafka stream receives rate decision event JSON",
        "Flink event engine identifies duration-sensitive asset classes",
        "Hybrid retrieval fetches fixed income research notes and bond duration tables",
        "Portfolio API queries book to find sensitive client portfolios (>35% bond allocation)",
        "LLM generates personalized advisor talking points with exact research citations"
      ],
      simResult: {
        latencyMs: 3820,
        clientsAffected: "412 Portfolios",
        complianceStatus: "✓ MAS / FINMA COMPLIANT",
        generatedSummary: "Generated talking points for 412 duration-sensitive clients. Recommendation: Rotate from long-duration US Treasuries (10Y+) into 2Y floating-rate notes (FRNs) to mitigate duration drag.",
        citations: ["ResearchNote_FixedIncome_2026_08.pdf#p4", "CentralBankPolicy_Aug2026.pdf#Clause_3"]
      }
    },
    {
      id: "suitability",
      name: "2. Client Suitability Check",
      event: "Advisor asks: 'Is Structured Product X suitable for Client B (Accredited Investor in SG)?'",
      eventPayload: {
        client_id: "SG-WM-88301",
        risk_profile: "MODERATE",
        jurisdiction: "Singapore (MAS FAA)",
        product_isin: "XS2491029411",
        notional_usd: 500000
      },
      flow: [
        "Calls CRM API for Client B risk profile, net worth ($4.8M), and jurisdiction rules",
        "Retrieves Product X term sheet, payout formula, and MAS suitability policies",
        "Evaluates concentration limits (<15% structured products) & minimum investment threshold ($250k)",
        "LLM generates suitability recommendation with mandatory policy clause citations"
      ],
      simResult: {
        latencyMs: 2940,
        clientsAffected: "Client SG-88301",
        complianceStatus: "✓ SUITABLE WITH CONDITIONS",
        generatedSummary: "Product X is SUITABLE for Client B under MAS FAA guidelines (Client qualifies as Accredited Investor, min threshold $250k met, portfolio structured product concentration remains at 10.4% <= 15% limit).",
        citations: ["ProductX_TermSheet_v2.pdf#p2", "MAS_Suitability_Policy_2026.pdf#Clause_4.2"]
      }
    },
    {
      id: "earnings",
      name: "3. Earnings Report Summarization",
      event: "Advisor asks: 'Summarize latest XYZ Bank Q2 earnings surprise & impact on internal equity stance'",
      eventPayload: {
        ticker: "XYZ.N",
        quarter: "Q2 2026",
        revenue_actual: "$12.4B (vs $11.9B exp)",
        eps_actual: "$1.85 (vs $1.72 exp)",
        internal_coverage_stance: "OVERWEIGHT"
      },
      flow: [
        "Retrieves earnings transcript, analyst notes, and historical valuation multiples",
        "Summarizes earnings surprise (+7.5% EPS beat), key revenue drivers, and credit loss provisions",
        "Cross-references bank's internal research stance and target price ($142.00)"
      ],
      simResult: {
        latencyMs: 2610,
        clientsAffected: "1,208 Equity Portfolios",
        complianceStatus: "✓ INTERNAL RESEARCH APPROVED",
        generatedSummary: "XYZ Bank delivered strong Q2 results (+7.5% EPS beat driven by wealth management fee growth and net interest margin resilience). Maintained OVERWEIGHT rating with $142 target price.",
        citations: ["XYZ_Q2_2026_Transcript.pdf#p8", "Global_Equity_Research_Daily_0814.pdf#p2"]
      }
    },
    {
      id: "downgrade",
      name: "4. Downgraded Issuer Alert",
      event: "Rating agency downgrades Acme Global Corp from BBB- to BB+ (Crossover to High Yield)",
      eventPayload: {
        issuer: "Acme Global Corp",
        isin: "US004128AA92",
        old_rating: "BBB- (Investment Grade)",
        new_rating: "BB+ (High Yield / Fallen Angel)",
        timestamp: "2026-08-15T11:15:00Z"
      },
      flow: [
        "Flink receives rating downgrade stream & triggers issuer entity resolution",
        "Queries Portfolio API to identify all 37 affected client portfolios holding Acme debt",
        "Retrieves credit policy guidance on downgraded fallen angels and mandate constraints",
        "Generates pre-approved client communication template for advisor outreach"
      ],
      simResult: {
        latencyMs: 1980,
        clientsAffected: "37 Portfolios",
        complianceStatus: "⚠️ MANDATE REMEDIATION REQUIRED",
        generatedSummary: "Found 37 client accounts holding $3.4M total exposure. 12 institutional mandates prohibit High Yield bonds and require portfolio rebalancing within 30 business days per Credit Policy Section 8.1.",
        citations: ["CreditRiskPolicy_FallenAngels_2026.pdf#Clause_8.1", "AcmeCorp_RatingAction_0815.pdf#p1"]
      }
    }
  ]
};

const SDLC_CASE_STUDY_DATA = {
  title: "DevContext Copilot — A Real-Time RAG Platform for the Software Development Life Cycle (SDLC)",
  subtitle: "Production Case Study: Grounding Every Engineering Answer in Code, Docs, Tickets, Runbooks, & Incident Context",
  companyContext: {
    org: "Global IT Services & Product Engineering Enterprise",
    engineers: "~4,000 engineers across 40+ delivery teams",
    codebase: "600+ microservices and multiple monorepos (Java, Python, TypeScript, Go)",
    toolchain: ["GitHub Enterprise", "Jira", "Confluence", "ServiceNow", "PagerDuty", "Jenkins/GitHub Actions", "Datadog", "Slack"],
    compliance: ["SOC 2", "ISO 27001", "Client contractual confidentiality boundaries"]
  },
  painPoints: [
    { point: "Knowledge silos across code, Confluence, Jira, ServiceNow, Slack", impact: "Engineers spend 60–90 min/day searching" },
    { point: "Slow developer onboarding", impact: "6+ weeks to first production contribution" },
    { point: "High Mean Time to Resolution (MTTR)", impact: "Postmortems & runbooks never found during incidents (48 min MTTR)" },
    { point: "Duplicated code & reinvented patterns", impact: "Low reuse, inconsistent quality across teams" },
    { point: "Tribal knowledge loss with attrition", impact: "Undocumented decisions resurfacing as production bugs" },
    { point: "Compliance & security policy drift", impact: "Coding standards & secure-coding rules not consistently applied" },
    { point: "Generic AI assistants unsafe", impact: "Hallucinated APIs, leaked credentials, client confidentiality breaches" }
  ],
  sdlcPhases: [
    {
      phase: "1. Requirements",
      persona: "Product Owner / Analyst",
      query: '"Did we build KYC document verification for a banking client before? Show stories, estimates, and defects."',
      flow: "Ticket search (KYC, doc-verification) → retrieve 3 past epics, estimates, defect clusters → retrieve compliance reqs → output: prior-art summary, realistic estimate range, citations.",
      simTrace: {
        latencyMs: 640,
        sourcesRetrieved: ["Jira Epic PROD-1420", "ADR-041 (KYC Doc Pipeline)", "Defect Cluster #241 (OCR rotation)"],
        toolCalls: ["jira_search(jql='text ~ \"KYC verification\"')", "confluence_get_page('ADR-041')"],
        sandboxStatus: "N/A (Documentation / Prior Art Search)",
        resultSummary: "Found 3 past epics across 2 client deliveries. Estimated effort: 3 sprints (12-14 SP). Identified 2 common defect patterns in passport OCR rotation and MRZ checksum validation.",
        citations: ["jira.corp/browse/PROD-1420", "wiki.corp/spaces/ARCH/pages/ADR-041", "jira.corp/browse/DEF-241"]
      }
    },
    {
      phase: "2. Design",
      persona: "Architect / Tech Lead",
      query: '"Which ADRs govern event sourcing for ledger services, and what is the dependency impact of schema changes?"',
      flow: "ADR retrieval → schema specs → graph traversal (consumers of ledger events) → output: governing decisions, 7 consumer services, compatibility risks, citations.",
      simTrace: {
        latencyMs: 820,
        sourcesRetrieved: ["ADR-019 (Event Sourcing with Kafka)", "Avro Schema ledger-events-v3.avsc", "Neo4j Dependency Graph"],
        toolCalls: ["neo4j_traverse(node='LedgerEvents', rel='CONSUMED_BY')", "git_diff('ledger-events-v3.avsc')"],
        sandboxStatus: "N/A (Graph Traversal & Schema Check)",
        resultSummary: "Governed by ADR-019. 7 downstream consumer services identified (payment-gateway, audit-svc, reporting-pipeline, settlement-svc, fee-calc, fraud-detector, notify-svc). Schema backward-compatibility verified.",
        citations: ["wiki.corp/spaces/ARCH/pages/ADR-019", "github.corp/ledger-service/schemas/ledger-events-v3.avsc", "graph.corp/nodes/LedgerEvents"]
      }
    },
    {
      phase: "3. Development",
      persona: "Developer (IDE + ChatOps)",
      query: '"Where is refund idempotency validated, and show the pattern to reuse?"',
      flow: "Symbol lookup idempotency → semantic code search → rerank → return RefundService.java#L120-L148 + pattern explanation → sandbox compile validation.",
      simTrace: {
        latencyMs: 510,
        sourcesRetrieved: ["RefundService.java#L120-L148", "IdempotencyValidator.java", "IdempotencyAspectTest.java"],
        toolCalls: ["ctags_exact_symbol('validateIdempotencyKey')", "docker_sandbox_compile(target='RefundServiceTest')"],
        sandboxStatus: "✓ COMPILE_SUCCESS (pass@1 sandbox in 380ms)",
        resultSummary: "Refund idempotency is enforced via Redis distributed lock in RefundService.java#L120 using @IdempotentOperation annotation. Pattern reusable across all transactional endpoints.",
        citations: ["github.corp/payment-gateway/src/main/java/RefundService.java#L120-L148", "github.corp/common-lib/IdempotencyValidator.java#L45"]
      }
    },
    {
      phase: "4. Testing",
      persona: "QA Engineer",
      query: '"Generate edge-case tests for FX conversion service based on past defects."',
      flow: "Defect search (FX, rounding, timezone) → retrieve 12 historical defects → retrieve current impl → generate tests → run in sandbox; show only passing tests + citations.",
      simTrace: {
        latencyMs: 1140,
        sourcesRetrieved: ["FX-902 (Rounding drift on JPY pairs)", "FX-941 (Leap year leap second)", "FXConversionService.java"],
        toolCalls: ["jira_defect_search(component='FX', type='Bug')", "docker_sandbox_run_junit(testClass='FXConversionEdgeCaseTest')"],
        sandboxStatus: "✓ 4/4 UNIT TESTS PASSED IN SANDBOX",
        resultSummary: "Generated 4 parameterized test cases covering JPY 0-decimal rounding, negative FX spread handling, leap-year timezone jumps, and extreme currency volatility limits.",
        citations: ["jira.corp/browse/FX-902", "jira.corp/browse/FX-941", "github.corp/fx-service/src/test/FXConversionEdgeCaseTest.java#L1-L85"]
      }
    },
    {
      phase: "5. Deployment",
      persona: "DevOps / Release Mgr",
      query: '"What changed in the last 3 deploys of payment-gateway, and what is the rollback runbook?"',
      flow: "Deploy events tool → commit/PR summaries → runbook retrieval → change-policy check → output: change list, risk flags, rollback steps with citations.",
      simTrace: {
        latencyMs: 730,
        sourcesRetrieved: ["ArgoCD Deployment Log (v2.4.1, v2.4.0, v2.3.9)", "PR #841, #852, #860", "runbook-payment-gateway-rollback.md"],
        toolCalls: ["argocd_get_history(app='payment-gateway', limit=3)", "confluence_get_runbook('payment-gateway-rollback')"],
        sandboxStatus: "N/A (Release History & Runbook Match)",
        resultSummary: "Last 3 deploys: v2.4.1 (Kafka consumer retry fix), v2.4.0 (3DS2 authentication upgrade), v2.3.9 (db connection pool tuning). Rollback runbook: execute 'helm rollback payment-gateway 84' with zero-downtime drain.",
        citations: ["argocd.corp/apps/payment-gateway/history", "github.corp/payment-gateway/pulls/860", "wiki.corp/spaces/SRE/pages/runbook-payment-gateway-rollback.md"]
      }
    },
    {
      phase: "6. Operations",
      persona: "SRE / On-call",
      query: '"p99 latency spiked after deploy — find similar past incidents and the fix."',
      flow: "PagerDuty alert → automatic incident context pack within seconds: recent deploys, similar postmortems, runbook payment-latency.md, dependency health → draft cited summary to Slack.",
      simTrace: {
        latencyMs: 420,
        sourcesRetrieved: ["PagerDuty Alert #PD-9921", "INC-4811 Postmortem (Connection Pool Exhaustion)", "payment-latency.md Runbook"],
        toolCalls: ["pagerduty_get_alert('PD-9921')", "datadog_get_metrics(service='payment-gateway', metric='db.pool.wait_time')"],
        sandboxStatus: "N/A (Real-Time Incident Pack)",
        resultSummary: "Incident Context Pack generated in 420ms: Matched against INC-4811 (94% similarity). Root cause: HikariCP connection pool exhaustion after replica failover. Immediate mitigation: scale max_pool_size to 60 via dynamic config.",
        citations: ["pagerduty.corp/incidents/PD-9921", "wiki.corp/spaces/INCIDENTS/pages/INC-4811-postmortem.md", "datadog.corp/apm/payment-gateway/db-wait"]
      }
    }
  ],
  successMetrics: [
    { metric: "Onboarding time to first PR", before: "6 wks", after: "3.2 wks", delta: "-46%" },
    { metric: "MTTR (P1/P2 incidents)", before: "48 min", after: "26 min", delta: "-46%" },
    { metric: "PR cycle time", before: "30 hrs", after: "20 hrs", delta: "-33%" },
    { metric: "Daily search time per engineer", before: "75 min", after: "30 min", delta: "-60%" },
    { metric: "Suggestion acceptance (merged)", before: "—", after: "38%", delta: "High Adoption" },
    { metric: "Secret leakage incidents", before: "—", after: "0", delta: "100% Secure" },
    { metric: "Developer satisfaction", before: "—", after: "4.3 / 5", delta: "Positive NPS" }
  ],
  queryPipeline12Steps: [
    { step: 1, name: "Authenticate & Tenant Load", detail: "Load developer identity, team permissions, and confidentiality tenant boundary." },
    { step: 2, name: "Classify Intent", detail: "Classify intent: explain / find-code / debug / design / incident / test-gen." },
    { step: 3, name: "Extract Symbols & Entities", detail: "Extract exact method names, service identifiers, error signatures, and file paths." },
    { step: 4, name: "Symbol-Index Exact Lookup", detail: "Query ctags/LSP exact symbol index for 100% precision on identifiers." },
    { step: 5, name: "Semantic Code Search", detail: "Run dense vector search over code embeddings for natural language intent." },
    { step: 6, name: "Doc & ADR Search", detail: "Search Confluence ADRs, architecture standards, and operational runbooks." },
    { step: 7, name: "Ticket & Postmortem Search", detail: "Match stack-trace signatures against historical Jira tickets & postmortems." },
    { step: 8, name: "Service Graph Traversal", detail: "Traverse dependency topology for multi-service impact questions." },
    { step: 9, name: "Live Tool Execution", detail: "Call live tools for real-time telemetry (CI logs, APM metrics, deploy events)." },
    { step: 10, name: "RRF Merge & ACL Filters", detail: "Reciprocal Rank Fusion merge → apply ACL, confidentiality, license, & commit_sha staleness filters." },
    { step: 11, name: "Cross-Encoder Code Reranker", detail: "Rescore top candidate chunks and attach compressed repo map for context." },
    { step: 12, name: "Grounded Code Generation", detail: "LLM generates answer with strict repo/file#Lx-Ly citations and sandbox pass@1 validation." }
  ],
  guardrailLayers: [
    { layer: "Input Layer", controls: "Confidentiality tenant enforcement, prompt injection detection, tenant token verification" },
    { layer: "Retrieval Layer", controls: "ACL permissions, branch/staleness commit_sha filters, restricted-repo blocklist" },
    { layer: "Context Layer", controls: "Gitleaks-style secret scanning & credential redaction before sending to LLM" },
    { layer: "Generation Layer", controls: "Compile & sandbox-test validation (pass@1), hallucinated-API symbol existence check" },
    { layer: "Output Layer", controls: "License copyleft check, confidence threshold gate, human-approval flag for infra changes, audit logging" }
  ],
  lessonsLearned: [
    "Code RAG is retrieval engineering plus compiler discipline — validation (compile/test) is a guardrail, not a nicety.",
    "Symbols beat sentences — exact identifier search (ctags/BM25) is non-negotiable.",
    "Staleness is the #1 trust killer — engineers forgive bad prose, never stale code.",
    "The repo map is the cheapest big win for LLM orientation.",
    "Incident RAG pays for the platform — MTTR reduction justified the entire investment.",
    "Confidentiality is architecture, not policy — tenants must exist in indexes, models, and logs."
  ],
  sdlcStarStory: {
    situation: "4,000-engineer enterprise with knowledge siloed across Git, Confluence, and Jira; MTTR was 48 mins and developer onboarding took 6 weeks.",
    task: "Build a real-time, phase-aware SDLC RAG copilot with verified citations, multi-tenant confidentiality isolation, and zero secret leakage.",
    action: "Architected AST-based code indexing with commit_sha staleness control; hybrid symbol+semantic retrieval; service dependency graph; incident context packs via Kafka/Flink; sandbox compile/test validation; secret & license guardrails.",
    result: "MTTR reduced by -46% (48m → 26m), onboarding time halved (6wks → 3.2wks), 38% suggestion acceptance rate, zero secret incidents, 4.3/5 satisfaction."
  }
};

const SDLC_DIAGRAMS = [
  {
    id: "ast_chunking",
    title: "S1: Tree-Sitter AST Code-Chunking Architecture",
    description: "Language-aware AST parsing extracts function and class chunks while preserving scope breadcrumbs and signature metadata.",
    image: "/assets/sdlc_ast_code_chunking_flow.png",
    nodes: [
      { step: "Source File", detail: "RefundService.java (Raw Source Code)" },
      { step: "Tree-Sitter AST", detail: "Parses file into Class, Method, & Import AST nodes" },
      { step: "Symbol Extraction", detail: "Extracts processRefund(), validateIdempotencyKey(), postToLedger()" },
      { step: "Chunk Packaging", detail: "Attaches metadata: repo > file > symbol + signature + commit_sha" },
      { step: "Vector & Symbol Index", detail: "Indexed in parallel to Dense Vector DB + ctags Symbol Index" }
    ]
  },
  {
    id: "incident_pack",
    title: "S2: Real-Time Incident Context-Pack Generator Flow",
    description: "Event-driven pipeline automatically assembles runbooks, postmortems, recent deploys, and APM metrics when PagerDuty fires.",
    image: "/assets/sdlc_incident_context_pack_flow.png",
    nodes: [
      { step: "PagerDuty Trigger", detail: "Alert: payment-gateway p99 latency > 2s" },
      { step: "Kafka / Flink Stream", detail: "Processes alert, resolves service entity & severity score" },
      { step: "Parallel Retrieval", detail: "Fetches: Runbooks + Past Postmortems + Recent Commits + APM Health" },
      { step: "Context Pack Assembly", detail: "Compresses retrieved evidence & formats cited mitigation draft" },
      { step: "ChatOps Delivery", detail: "Automated bot posts cited incident pack to Slack channel in < 5 seconds" }
    ]
  },
  {
    id: "staleness",
    title: "S3: Commit-SHA Staleness Control Webhook Flow",
    description: "Webhook-driven incremental re-indexing combined with query-time commit_sha HEAD validation.",
    image: "/assets/sdlc_staleness_control_flow.png",
    nodes: [
      { step: "Git Push Webhook", detail: "Developer pushes commit '9f2c1ab' to main branch" },
      { step: "Incremental Re-Index", detail: "Triggers micro-job: re-indexes only touched files; flags old chunks as superseded" },
      { step: "Query-Time HEAD Check", detail: "Retrieval engine checks chunk.commit_sha against branch HEAD" },
      { step: "Drift Down-Ranking", detail: "Stale chunks are either refreshed on the fly or down-ranked" }
    ]
  },
  {
    id: "eval_suite",
    title: "S4: Multi-Metric Code RAG Evaluation Suite",
    description: "Continuous CI/CD regression suite evaluating retrieval, sandbox code compilation, and zero secret leakage.",
    image: "/assets/sdlc_eval_dashboard_mock.png",
    nodes: [
      { step: "Recall@10 (0.92)", detail: "Target > 90% on 800+ golden query-symbol ground truth pairs" },
      { step: "pass@1 Compile (0.78)", detail: "78% pass rate for generated unit tests in isolated Docker sandbox" },
      { step: "Merge Acceptance (38%)", detail: "38% of suggested PR review comments accepted & merged by developers" },
      { step: "Zero Secret Leaks (0)", detail: "100% pass on pre-LLM & post-LLM Gitleaks entropy scans" }
    ]
  },
  {
    id: "tenant_isolation",
    title: "S5: Multi-Tenant Confidentiality Isolation Topology",
    description: "Gateway tenant tokens enforce physical/logical index & model sharding with cross-tenant blocking.",
    image: "/assets/sdlc_tenant_isolation_flow.png",
    nodes: [
      { step: "Auth Gateway", detail: "Validates request token & extracts tenant_id (Tenant A / B / C)" },
      { step: "Pre-Retrieval Filter", detail: "Applies strict WHERE tenant_id = user.tenant_id filter at Vector DB" },
      { step: "Isolated Shards", detail: "Tenant A repos/indexes/models physically isolated from Tenant B" },
      { step: "Cross-Tenant Block", detail: "Hard firewall (T1 x--x T2) prevents cross-client code data leaks" }
    ]
  }
];

const SDLC_90_DAY_ROADMAP = [
  {
    phase: "Phase 1: Days 0–30",
    title: "Docs & Runbooks RAG + ChatOps",
    badge: "Foundation",
    items: [
      "Ingest Confluence docs, ADRs, coding standards, and operational runbooks",
      "Deploy Slack ChatOps bot for natural language policy Q&A",
      "Establish 100-item golden evaluation dataset for policy retrieval",
      "Set up basic RBAC and user permission filtering"
    ]
  },
  {
    phase: "Phase 2: Days 31–60",
    title: "Code Indexing (AST) + IDE Plugin",
    badge: "Code RAG",
    items: [
      "Implement Tree-Sitter AST chunking for Java, Python, TS, and Go",
      "Build ctags/LSP symbol index for exact method & class lookup",
      "Release VS Code & JetBrains IDE plugins with sub-second latency",
      "Deploy Docker sandbox container for pass@1 code compilation checks"
    ]
  },
  {
    phase: "Phase 3: Days 61–90",
    title: "Real-Time Packs, GraphRAG & PR Assist",
    badge: "Advanced Operations",
    items: [
      "Connect Kafka/Flink stream for real-time CI failure & PagerDuty packs",
      "Construct Neo4j service dependency graph for multi-hop impact analysis",
      "Deploy automated read-only PR review assistant with standards citations",
      "Establish DORA productivity analytics baselines (MTTR, PR cycle time)"
    ]
  }
];

const SDLC_CHALLENGES_MATRIX = [
  { challenge: "Stale code after refactors", mitigation: "Git webhook incremental re-index + commit_sha HEAD validation at query time." },
  { challenge: "Monorepo scale (10M+ LOC)", mitigation: "Per-service index shards, compressed repo maps, and hierarchical retrieval." },
  { challenge: "Hallucinated APIs & methods", mitigation: "AST symbol-index existence check + sandbox compile/test validation before display." },
  { challenge: "Secrets in retrieved snippets", mitigation: "Pre-LLM & post-LLM Gitleaks entropy scanning + automated credential redaction." },
  { challenge: "License copyleft contamination", mitigation: "Per-repo license metadata + copyleft detector filter on generated suggestions." },
  { challenge: "Multi-client confidentiality", mitigation: "Tenant-isolated index shards & model hosting + hard DB-level ACL filters." },
  { challenge: "Identifier exact match misses", mitigation: "Exact ctags/LSP symbol index + BM25 lexical search fused via RRF." },
  { challenge: "Context window overflow", mitigation: "Compressed Repo Maps (tree + top symbols) + function-level AST chunks." },
  { challenge: "Evaluation blind spots", mitigation: "Multi-metric Golden Set testing (Recall@10, pass@1, MRR, zero secret leaks)." },
  { challenge: "Developer adoption & trust", mitigation: "Verifiable repo/file#line citations + owner links + inline feedback buttons." },
  { challenge: "IDE latency (under 1s requirement)", mitigation: "Redis semantic cache + lightweight embedding models + pre-filtered ANN search." },
  { challenge: "Knowledge hygiene ceiling", mitigation: "Automated documentation quality scoring & stale doc flagging." },
  { challenge: "Developer skill atrophy risk", mitigation: "Interactive 'Explain Mode' providing step-by-step logic breakdowns instead of auto-patching." }
];

const SDLC_WHERE_USEFUL_MATRIX = {
  useful: [
    { title: "Developer Onboarding", desc: "Halves time for new engineers to merge their first production PR (6 wks → 3.2 wks)." },
    { title: "Real-Time Incident Response", desc: "Assembles context packs (runbooks, postmortems, commits) in under 5s during P1 alerts." },
    { title: "Legacy Code Modernization", desc: "Reduces architecture analysis time by -50% and migration defects by -25%." },
    { title: "Test Debt & Flaky Tests", desc: "Generates defect-history-driven test cases validated in a pass@1 sandbox." },
    { title: "Audit & Compliance Evidence", desc: "Reduces compliance audit prep from days to minutes with exact file:line citations." },
    { title: "M&A Technical Due Diligence", desc: "Quickly maps service topology, dependencies, security risks, and technical debt." }
  ],
  notUseful: [
    { title: "Tiny Greenfield Teams (<10 Devs)", desc: "Codebase fits in developers' heads; setup & maintenance overhead exceeds ROI." },
    { title: "Zero Knowledge Hygiene", desc: "No written ADRs, runbooks, or tickets; RAG cannot retrieve missing documentation." },
    { title: "Purely Algorithmic Tasks", desc: "Tasks requiring heavy mathematical computation or pure creative UI styling without codebase facts." }
  ]
};

const BANKING_MODERNIZATION_CASE = {
  title: "Banking Legacy Modernization Mini-Case Study",
  subtitle: "Applying SDLC RAG to Modernize 15-Year-Old Monolithic Core Banking Microservices",
  metrics: [
    { label: "Architecture Analysis Time", delta: "-50%", detail: "Engineers mapped legacy dependency graphs in days instead of weeks." },
    { label: "Compliance Audit Prep", delta: "Days → Minutes", detail: "Instant retrieval of governing ADRs and security audit trails." },
    { label: "Migration Defect Rate", delta: "-25%", detail: "Sandbox compile validation prevented hallucinated API bugs." }
  ]
};

// ============================================
// SIMULATOR DATA: 9-STEP SYSTEM DESIGN BLUEPRINT
// ============================================

const SYSTEM_DESIGN_SCENARIOS = {
  sdlc: {
    id: "sdlc",
    name: "💻 Enterprise Monorepo SDLC Copilot",
    sla: "2000ms",
    scale: "4,000 engineers, 600+ microservices, 10M+ LOC",
    targetUsers: "Software Engineers, SREs, QA, Tech Leads",
    queryExample: "Where is refund idempotency validated in payment-gateway, and show unit test pattern to reuse?",
    steps: [
      {
        step: 1,
        title: "Step 1: Clarify Requirements & Latency Budget",
        keyQuestions: ["What are user personas (Dev, SRE)?", "What is target latency (IDE <1s, Chat <2s)?", "What is data scale (10M+ LOC, monorepos)?", "Is RBAC required per repo?"],
        decision: "Sub-second IDE inline completion (<800ms) and <2.0s ChatOps latency SLA. Strict repo-level tenant isolation.",
        latency: 0,
        payload: { user: "dev@acme.com", tenant: "payments-squad", target_sla_ms: 2000, current_accumulated_ms: 0 },
        tradeoff: "Fast shallow retrieval vs deep multi-hop AST search."
      },
      {
        step: 2,
        title: "Step 2: Define Use Cases & Intent Routing",
        keyQuestions: ["What queries will developers ask?", "Is this static code search or dynamic incident response?"],
        decision: "Route queries into 6 SDLC intent categories: code_find, debug, adr_lookup, test_gen, incident_pack, release_notes.",
        latency: 15,
        payload: { query: "Where is refund idempotency validated?", intent: "code_find", target_symbol: "RefundService.processRefund" },
        tradeoff: "Single universal prompt vs intent-specialized prompt templates."
      },
      {
        step: 3,
        title: "Step 3: NFRs, Security & Confidentiality",
        keyQuestions: ["How to prevent secret leakage?", "How to handle multi-client confidentiality?", "Can copyleft code pollute internal repos?"],
        decision: "Enforce pre-retrieval tenant filtering WHERE tenant_id = user.tenant. Scan pre-LLM & post-LLM with Gitleaks. Block GPL copyleft chunks.",
        latency: 25,
        payload: { tenant_filter: "WHERE repo_access CONTAINS 'payments-gateway' AND confidentiality <= 'internal'", secret_scan_status: "PASSED" },
        tradeoff: "Strict ACL filtering overhead vs security data leakage risk."
      },
      {
        step: 4,
        title: "Step 4: Describe Data Sources & Ingestion Streams",
        keyQuestions: ["What data stores exist?", "How are git pushes tracked?"],
        decision: "Ingest Git repos, Confluence ADRs, Jira tickets, and PagerDuty events. Connect Git push webhooks for incremental re-indexing.",
        latency: 40,
        payload: { sources: ["Git (GitHub Ent)", "Confluence ADRs", "Jira Defect History"], active_commit_sha: "9f2c1ab" },
        tradeoff: "Real-time git push indexing vs scheduled batch re-indexing."
      },
      {
        step: 5,
        title: "Step 5: Ingestion & Chunking Pipeline (AST)",
        keyQuestions: ["How to chunk code files?", "How to store symbols?"],
        decision: "Use Tree-Sitter AST parser to chunk at Function & Class boundaries. Attach repo > service > file > symbol breadcrumbs + ctags symbol index.",
        latency: 80,
        payload: { chunking: "Tree-Sitter AST", breadcrumb: "payments/src/RefundService.java > processRefund()", symbol_index: "ctags_fast_lookup" },
        tradeoff: "Line-based chunking (fast, naive) vs Tree-Sitter AST chunking (precise, scope-aware)."
      },
      {
        step: 6,
        title: "Step 6: Query Execution & Hybrid Retrieval Engine",
        keyQuestions: ["How to find exact method names?", "How to merge vector and keyword hits?"],
        decision: "Execute exact ctags symbol search + BM25 + CodeBERT embeddings in parallel. Fuse using Reciprocal Rank Fusion (RRF) + Cross-encoder reranker.",
        latency: 280,
        payload: { dense_hits: 50, bm25_hits: 50, rrf_fused_top10: ["RefundService.java#L120-L148"], rerank_score: 0.96 },
        tradeoff: "Dense vector search alone (misses exact identifiers) vs Hybrid RRF + Cross-encoder (100% symbol recall)."
      },
      {
        step: 7,
        title: "Step 7: Grounded Generation & Sandbox Validation",
        keyQuestions: ["How to stop hallucinated APIs?", "How to verify generated code?"],
        decision: "Inject compressed Repo Map + top chunks. Pass generated code to Docker sandbox for pass@1 compile & unit test execution.",
        latency: 1250,
        payload: { generated_snippet: "public boolean validateIdempotencyKey(String key) { ... }", sandbox_pass1: "COMPILE_SUCCESS", citations: ["RefundService.java#L120"] },
        tradeoff: "Raw LLM output (fast, unverified) vs Docker sandbox pass@1 validation (+500ms, zero compile bugs)."
      },
      {
        step: 8,
        title: "Step 8: Production Safeguards, Caching & Observability",
        keyQuestions: ["How to optimize sub-second IDE queries?", "How to log lineage?"],
        decision: "Cache frequent symbol queries in Redis semantic cache. Log request token, retrieved commit_sha, and LLM output lineage.",
        latency: 30,
        payload: { redis_cache: "HIT_SEMANTIC_MATCH", audit_logged: true, total_latency_ms: 1640 },
        tradeoff: "Exact string cache vs Semantic vector cache in Redis."
      },
      {
        step: 9,
        title: "Step 9: Architecture Trade-Offs & Final Blueprint Summary",
        keyQuestions: ["What are core system trade-offs?"],
        decision: "Summarize: AST chunking + Hybrid RRF + Docker Sandbox pass@1 + Commit_SHA staleness control = Enterprise Code RAG Success.",
        latency: 0,
        payload: { final_system_score: "Production-Ready", recall_10: "94.2%", mttr_reduction: "-46%" },
        tradeoff: "Cost & complexity vs 100% developer trust & zero secret leaks."
      }
    ]
  },

  wealth: {
    id: "wealth",
    name: "🏦 Wealth Management Advisor Intelligence Copilot",
    sla: "5000ms",
    scale: "4,000 advisors, 50,000 PDF term sheets, 100,000 client portfolios",
    targetUsers: "Wealth Managers, Private Bankers, Compliance Officers",
    queryExample: "Is Product X suitable for Client B in Singapore after central bank interest rate hike?",
    steps: [
      {
        step: 1,
        title: "Step 1: Clarify Requirements & Latency Budget",
        keyQuestions: ["Who are advisors?", "What is regulatory penalty for non-compliance?", "Is 5s latency acceptable for complex research?"],
        decision: "< 5.0s p95 Chat latency SLA. 100% regulatory audit compliance, zero hallucinated suitability advice.",
        latency: 0,
        payload: { user: "advisor_341@bank.com", jurisdiction: "SG", max_client_exposure_pct: 10, target_sla_ms: 5000, current_accumulated_ms: 0 },
        tradeoff: "Ultra-fast ungrounded chat vs 100% policy-cited regulatory compliance."
      },
      {
        step: 2,
        title: "Step 2: Define Use Cases & Intent Routing",
        keyQuestions: ["What scenarios occur daily?"],
        decision: "Route to: market_event_impact, client_suitability, term_sheet_summarizer, issuer_downgrade_alert.",
        latency: 20,
        payload: { query: "Client B suitability for Product X", intent: "client_suitability", client_id: "SG-88301" },
        tradeoff: "Generic chat vs deterministic policy-routed agent."
      },
      {
        step: 3,
        title: "Step 3: NFRs, Security & Regulatory Compliance",
        keyQuestions: ["How to isolate client PII?", "How to enforce MAS/FINMA cross-border rules?"],
        decision: "Pre-retrieval WHERE jurisdiction CONTAINS 'SG' AND client_tier >= product.min_tier. Redact PII pre-LLM.",
        latency: 35,
        payload: { acl_filter: "WHERE jurisdiction = 'SG' AND risk_clearance >= 'HIGH'", pii_redaction: "CLEARED" },
        tradeoff: "On-prem private vector DB vs public cloud embedding API."
      },
      {
        step: 4,
        title: "Step 4: Describe Data Sources & Ingestion Streams",
        keyQuestions: ["Where does data live?"],
        decision: "Ingest PDF term sheets, MAS compliance rules, internal equity research, and live Kafka market streams.",
        latency: 60,
        payload: { sources: ["PDF Term Sheets (50k)", "Kafka Rate Stream", "CRM Portfolio API"], kafka_topic: "market-events-v1" },
        tradeoff: "Real-time market streaming vs static daily PDF batch indexing."
      },
      {
        step: 5,
        title: "Step 5: Ingestion & Chunking Pipeline (Clause & Table OCR)",
        keyQuestions: ["How to parse financial tables?"],
        decision: "Use Layout-Aware PDF Parser (Marker/Unstructured) + Clause-Level Chunking (100-250 tokens). Extract structured product tables as Markdown.",
        latency: 120,
        payload: { pdf_parser: "Layout-Aware OCR", chunking: "Clause-Level (Section 4.2)", table_extracted: "MIN_INVESTMENT_USD_250K" },
        tradeoff: "Naive text extraction (breaks tables) vs Layout OCR + Table Markdown extraction."
      },
      {
        step: 6,
        title: "Step 6: Query Execution & Hybrid Retrieval Engine",
        keyQuestions: ["How to handle ISIN codes and policy terms?"],
        decision: "Dense Finance-BERT vectors + BM25 ISIN lookup fused via RRF. Call CRM API to fetch Client B portfolio risk limits.",
        latency: 340,
        payload: { crm_api_result: { client: "Client B", net_worth: "$5M", risk_tolerance: "Moderate" }, top_policy_chunk: "Suitability_SG_v3.pdf#Clause_2" },
        tradeoff: "Vector search alone vs Hybrid Search + Live CRM API Tool Calling."
      },
      {
        step: 7,
        title: "Step 7: Grounded Generation & Faithfulness Guardrails",
        keyQuestions: ["How to guarantee zero hallucinated financial claims?"],
        decision: "LLM generates advice with mandatory policy citations. Run RAGAS Faithfulness check before displaying response.",
        latency: 2200,
        payload: { suitability_decision: "SUITABLE_WITH_CONSTRAINTS", rationale: "Product X duration matches Client B risk profile", faith_score: 0.98 },
        tradeoff: "LLM free generation vs Faithfulness guardrail validation."
      },
      {
        step: 8,
        title: "Step 8: Production Safeguards, Caching & Audit Lineage",
        keyQuestions: ["How to satisfy regulatory auditors?"],
        decision: "Log complete request lineage (advisor ID, prompt, retrieved clauses, generated advice) to write-once WORM storage for 7 years.",
        latency: 45,
        payload: { worm_storage_log_id: "AUDIT-2026-9f8a", audit_status: "COMPLIANT", total_latency_ms: 2820 },
        tradeoff: "Minimal logging vs full immutable audit lineage."
      },
      {
        step: 9,
        title: "Step 9: Architecture Trade-Offs & Final Blueprint Summary",
        keyQuestions: ["What are core system trade-offs?"],
        decision: "Summarize: Clause-level chunking + Live CRM Tool Calls + RAGAS Faithfulness + 7-year WORM Audit = Financial RAG Success.",
        latency: 0,
        payload: { final_system_score: "Production-Ready", research_time_saved: "-64%", citation_accuracy: "96.5%" },
        tradeoff: "Latency vs 100% regulatory compliance."
      }
    ]
  }
};

const SYSTEM_DESIGN_STEPS = [
  { step: "Step 1: Clarify Requirements & Latency Budget", detail: "Clarify users, data types, freshness (real-time vs batch), RBAC needs, latency SLA target, compliance auditing." },
  { step: "Step 2: Define Use Cases & Intent Routing", detail: "Map query intents (code_find, policy_qa, incident_pack), select specialized prompt templates and tool tools." },
  { step: "Step 3: NFRs, Security & Confidentiality", detail: "Define p95 latency SLA, 99.9% availability, pre-retrieval RBAC/ABAC tenant filters, PII redaction, secret scanning." },
  { step: "Step 4: Describe Data Sources & Ingestion Streams", detail: "Unstructured (Git, PDFs, Confluence) + Structured APIs (Jira, CRM, Telemetry) + Streaming (Kafka/Flink)." },
  { step: "Step 5: Ingestion & Chunking Pipeline Strategy", detail: "Tree-Sitter AST chunking for code, Clause/Section chunking for policies, Layout-OCR for tables, symbol metadata indexing." },
  { step: "Step 6: Query Execution & Hybrid Retrieval Engine", detail: "Parallel dense vector search + BM25 keyword search fused via Reciprocal Rank Fusion (RRF) + Cross-encoder reranker." },
  { step: "Step 7: Grounded Generation & Sandbox Validation", detail: "Inject compressed Repo Maps, generate code/prose with exact citations, validate in Docker sandbox (pass@1) or RAGAS faith check." },
  { step: "Step 8: Production Safeguards, Caching & Audit Lineage", detail: "Redis semantic caching, rate limiting, prompt versioning, WORM audit logging for regulatory compliance." },
  { step: "Step 9: Architecture Trade-Offs & Final Blueprint Summary", detail: "Analyze Dense vs Hybrid, Chunk size vs Noise, Sandbox validation vs Speed, Fine-Tuning vs RAG." }
];

const CODE_PSEUDOCODES = {
  retrieval: `# 1. HYBRID RETRIEVAL & RERANKING PSEUDOCODE
def retrieve(query, user):
    permissions = get_user_permissions(user)
    intent = classify_intent(query)
    entities = extract_entities(query)
    
    filters = {
        "access_control": permissions,
        "effective_date_lte": current_date(),
        "superseded": False,
        "jurisdiction": entities.get("jurisdiction"),
        "document_type": intent.allowed_document_types
    }
    
    # Execute parallel dense and sparse searches
    dense_results = vector_search(query=query, filters=filters, top_k=100)
    sparse_results = bm25_search(query=query, filters=filters, top_k=100)
    
    # Fuse candidate lists via Reciprocal Rank Fusion
    merged_results = reciprocal_rank_fusion(dense_results, sparse_results)
    
    # Rescore top candidates with Cross-Encoder Reranker
    reranked_results = cross_encoder_rerank(query=query, documents=merged_results, top_n=10)
    
    return compress_context(reranked_results)`,

  orchestration: `# 2. AGENTIC RAG ORCHESTRATION PSEUDOCODE
def answer_query(query, user):
    if not authorize(user, query):
        return access_denied_response()
        
    intent = classify_intent(query)
    
    # Execute deterministic API tool calls for live data
    client_data = call_client_portfolio_api(user, query) if intent.requires_client_data else None
    market_data = call_market_data_api(query) if intent.requires_market_data else None
    
    # Retrieve grounded document chunks
    retrieved_docs = retrieve(query, user)
    
    # Assemble structured context
    context = assemble_context(
        retrieved_docs=retrieved_docs,
        client_data=client_data,
        market_data=market_data
    )
    
    prompt = build_system_prompt(query=query, context=context, user=user)
    response = llm.generate(prompt)
    
    # Enforce post-generation guardrail verification
    guardrail_result = run_guardrails(query=query, response=response, context=context)
    if not guardrail_result.passed:
        return safe_fallback_response(guardrail_result)
        
    log_audit_trail(user=user, query=query, retrieved_docs=retrieved_docs, response=response)
    return response`,

  evaluation: `# 3. CONTINUOUS EVALUATION RUNNER PSEUDOCODE
def evaluate_rag_pipeline(golden_dataset):
    results = []
    for item in golden_dataset:
        response = rag_system.answer(item.question)
        
        retrieval_score = evaluate_recall(
            retrieved_sources=response.sources,
            expected_sources=item.expected_sources
        )
        faithfulness_score = evaluate_faithfulness(
            answer=response.answer,
            context=response.context
        )
        citation_score = evaluate_citation_accuracy(
            citations=response.citations,
            context=response.context
        )
        
        results.append({
            "question": item.question,
            "retrieval_recall": retrieval_score,
            "faithfulness": faithfulness_score,
            "citation_accuracy": citation_score
        })
        
    return aggregate_eval_metrics(results)`
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function RAGCaseStudiesTab() {
  const [activeMode, setActiveMode] = useState('casestudy'); // 'casestudy', 'systemdesign', 'star'
  const [activeCaseStudyTab, setActiveCaseStudyTab] = useState('sdlc'); // 'sdlc' or 'financial'
  const [activeSdlcPhase, setActiveSdlcPhase] = useState(0);
  const [activeDiagram, setActiveDiagram] = useState('ast_chunking');
  const [activeDiagStep, setActiveDiagStep] = useState(0);
  const [activeUseCase, setActiveUseCase] = useState('market_event');
  const [simStep, setSimStep] = useState(0);
  const [activePseudocode, setActivePseudocode] = useState('retrieval');
  const [copiedCode, setCopiedCode] = useState(false);

  // System Design Simulator state
  const [simScenario, setSimScenario] = useState('sdlc');
  const [simCurrentStep, setSimCurrentStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isSdlcSimulating, setIsSdlcSimulating] = useState(false);
  const [isFinSimulating, setIsFinSimulating] = useState(false);

  // Tuner Config state
  const [configChunking, setConfigChunking] = useState('ast');
  const [configRetrieval, setConfigRetrieval] = useState('hybrid');
  const [configGuardrails, setConfigGuardrails] = useState('docker_pass1');
  const [configSecurity, setConfigSecurity] = useState('gitleaks_acl');
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);

  // Auto-play timer for System Design Simulator
  useEffect(() => {
    let interval = null;
    if (isAutoPlay) {
      interval = setInterval(() => {
        setSimCurrentStep(prev => {
          if (prev >= 8) {
            setIsAutoPlay(false);
            return 8;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const copyCodeToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const runLivePipelineSimulation = () => {
    setIsSimulatingRun(true);
    setSimCurrentStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step > 8) {
        clearInterval(interval);
        setIsSimulatingRun(false);
      } else {
        setSimCurrentStep(step);
      }
    }, 600);
  };

  const currentScenarioData = SYSTEM_DESIGN_SCENARIOS[simScenario] || SYSTEM_DESIGN_SCENARIOS.sdlc;
  const currentStepData = currentScenarioData.steps[simCurrentStep];

  // Calculate accumulated latency up to current step with tuner adjustments
  const baseLatency = currentScenarioData.steps.slice(0, simCurrentStep + 1).reduce((acc, s) => acc + s.latency, 0);
  const guardrailLatency = configGuardrails === 'docker_pass1' ? 450 : configGuardrails === 'ragas_faithfulness' ? 600 : 0;
  const searchLatencyDelta = configRetrieval === 'hybrid' ? 40 : configRetrieval === 'dense' ? 10 : 5;
  const calculatedLatency = baseLatency + (simCurrentStep >= 5 ? searchLatencyDelta : 0) + (simCurrentStep >= 6 ? guardrailLatency : 0);
  
  const targetSlaMs = parseInt(currentScenarioData.sla);
  const latencyPct = Math.min(100, Math.round((calculatedLatency / targetSlaMs) * 100));

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="rag"
        moduleLabel="Enterprise Systems & Case Studies"
        title="Enterprise RAG Case Studies & Blueprints"
        description="Comprehensive real-world architectures featuring DevContext Copilot (SDLC RAG Platform), Financial Advisor Copilot, 9-Step System Design Blueprint & Interactive Simulator, STAR Stories, and Production Pseudocodes."
        metrics={[
          { label: 'Production Cases', value: '2 Enterprise' },
          { label: 'System Design', value: '9-Step Blueprint' },
          { label: 'Simulator', value: 'Interactive' },
          { label: 'SDLC Visuals', value: '6 Flow Diagrams' },
        ]}
      />

      <Container size="wide">
        {/* TOP NAVIGATION MODES */}
        <div style={{
          display: 'flex',
          gap: 'var(--ds-space-2)',
          marginBottom: 'var(--ds-space-8)',
          background: 'var(--ds-color-bg-surface)',
          padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)',
          border: '1px solid var(--ds-color-border-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'casestudy', label: '🏢 Enterprise Case Studies', desc: 'DevContext SDLC & Advisor Copilot' },
            { id: 'systemdesign', label: '⚡ 9-Step System Design Simulator', desc: 'Interactive Blueprint & Latency Budget' },
            { id: 'star', label: '🚀 STAR & Pseudocodes', desc: 'Production Code & STAR Stories' }
          ].map(mode => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              style={{
                flex: 1,
                minWidth: '220px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)',
                border: 'none',
                background: activeMode === mode.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent',
                color: activeMode === mode.id ? 'white' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeMode === mode.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)'
              }}
            >
              <div style={{ fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}>{mode.label}</div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeMode === mode.id ? 0.9 : 0.7 }}>
                {mode.desc}
              </div>
            </button>
          ))}
        </div>

        {/* MODE 1: ENTERPRISE CASE STUDIES (SDLC RAG & FINANCIAL ADVISOR) */}
        {activeMode === 'casestudy' && (
          <Stack gap={6}>
            {/* SUB TAB SELECTOR FOR CASE STUDIES */}
            <Flex gap={3} style={{ marginBottom: 'var(--ds-space-2)' }}>
              <button
                onClick={() => setActiveCaseStudyTab('sdlc')}
                style={{
                  padding: 'var(--ds-space-3) var(--ds-space-5)',
                  borderRadius: 'var(--ds-radius-md)',
                  border: '1px solid',
                  borderColor: activeCaseStudyTab === 'sdlc' ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                  background: activeCaseStudyTab === 'sdlc' ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-bg-surface)',
                  color: activeCaseStudyTab === 'sdlc' ? 'white' : 'var(--ds-color-text-primary)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: 'var(--ds-font-size-body)'
                }}
              >
                💻 DevContext Copilot (SDLC RAG Platform)
              </button>
              <button
                onClick={() => setActiveCaseStudyTab('financial')}
                style={{
                  padding: 'var(--ds-space-3) var(--ds-space-5)',
                  borderRadius: 'var(--ds-radius-md)',
                  border: '1px solid',
                  borderColor: activeCaseStudyTab === 'financial' ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                  background: activeCaseStudyTab === 'financial' ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-bg-surface)',
                  color: activeCaseStudyTab === 'financial' ? 'white' : 'var(--ds-color-text-primary)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: 'var(--ds-font-size-body)'
                }}
              >
                🏢 Financial Advisor Intelligence Copilot
              </button>
            </Flex>

            {/* VIEW 1: SDLC RAG CASE STUDY (DevContext Copilot) */}
            {activeCaseStudyTab === 'sdlc' && (
              <Stack gap={6}>
                <Card style={{ padding: 'var(--ds-space-6)', background: 'linear-gradient(135deg, rgba(202,138,4,0.12) 0%, rgba(13,148,136,0.12) 100%)' }}>
                  <Stack gap={3}>
                    <Flex gap={2} align="center">
                      <Badge variant="warning">Detailed SDLC RAG Case Study</Badge>
                      <Badge variant="subtle">Enterprise Monorepo Scale</Badge>
                    </Flex>
                    <h2 style={{ fontSize: 'var(--ds-font-size-h1)', margin: 0 }}>{SDLC_CASE_STUDY_DATA.title}</h2>
                    <h4 style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}>{SDLC_CASE_STUDY_DATA.subtitle}</h4>
                    <p style={{ fontSize: 'var(--ds-font-size-bodyLg)', color: 'var(--ds-color-text-primary)' }}>
                      <strong>Enterprise Context:</strong> {SDLC_CASE_STUDY_DATA.companyContext.org} with {SDLC_CASE_STUDY_DATA.companyContext.engineers}, managing {SDLC_CASE_STUDY_DATA.companyContext.codebase}.
                    </p>
                  </Stack>
                </Card>

                {/* PAIN POINTS & IMPACT */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>Enterprise Pain Points vs DevContext Copilot Impact</h3>
                  </Section.Header>
                  <Grid columns={2} gap={3}>
                    {SDLC_CASE_STUDY_DATA.painPoints.map((p, idx) => (
                      <Card key={idx} style={{ padding: 'var(--ds-space-4)' }}>
                        <Stack gap={1}>
                          <span style={{ fontWeight: 'bold', color: 'var(--ds-color-text-primary)' }}>❌ {p.point}</span>
                          <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-state-success-light)', fontWeight: 'semibold' }}>
                            🎯 Impact: {p.impact}
                          </span>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </Section>

                {/* 6 SDLC PHASE WORKFLOWS */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>6 SDLC Phase Coverage & Example Workflows</h3>
                    <p style={{ color: 'var(--ds-color-text-secondary)' }}>Click an SDLC phase to inspect the query flow from requirements to incident response.</p>
                  </Section.Header>

                  <Grid columns={3} gap={3} style={{ marginBottom: 'var(--ds-space-4)' }}>
                    {SDLC_CASE_STUDY_DATA.sdlcPhases.map((sp, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSdlcPhase(idx)}
                        style={{
                          padding: 'var(--ds-space-4)',
                          borderRadius: 'var(--ds-radius-md)',
                          border: '1px solid',
                          borderColor: activeSdlcPhase === idx ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                          background: activeSdlcPhase === idx ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                          color: activeSdlcPhase === idx ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontWeight: activeSdlcPhase === idx ? 'bold' : 'normal'
                        }}
                      >
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>{sp.persona}</div>
                        <div style={{ fontSize: 'var(--ds-font-size-body)', marginTop: '2px' }}>{sp.phase}</div>
                      </button>
                    ))}
                  </Grid>

                  {/* ACTIVE SDLC PHASE DETAILS */}
                  {(() => {
                    const activeP = SDLC_CASE_STUDY_DATA.sdlcPhases[activeSdlcPhase];
                    const trace = activeP.simTrace;
                    return (
                      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
                        <Stack gap={4}>
                          <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                            <Badge variant="warning">{activeP.phase} — {activeP.persona}</Badge>
                            <Button
                              size="sm"
                              variant={isSdlcSimulating ? "danger" : "primary"}
                              onClick={() => {
                                setIsSdlcSimulating(true);
                                setTimeout(() => setIsSdlcSimulating(false), 900);
                              }}
                            >
                              {isSdlcSimulating ? "⏳ Simulating Pipeline..." : "🚀 Run Live Query Simulation"}
                            </Button>
                          </Flex>

                          <div>
                            <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>EXAMPLE DEVELOPER QUERY:</span>
                            <h3 style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-primary)' }}>{activeP.query}</h3>
                          </div>

                          <div>
                            <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>12-STEP QUERY PIPELINE FLOW:</span>
                            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', lineHeight: '1.6' }}>{activeP.flow}</p>
                          </div>

                          {/* INTERACTIVE TELEMETRY & SANDBOX STATUS CARD */}
                          {trace && (
                            <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)' }}>
                              <Stack gap={3}>
                                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                                  <Badge variant="info">⚡ Live Query Telemetry Trace</Badge>
                                  <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontWeight: 'bold' }}>
                                    p95 Latency: {trace.latencyMs}ms (Budget: &lt;2000ms)
                                  </span>
                                </Flex>

                                <Grid columns={2} gap={3}>
                                  <div>
                                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>RETRIEVED ARTIFACTS:</span>
                                    <ul style={{ margin: '4px 0 0 0', paddingLeft: 'var(--ds-space-4)', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                                      {trace.sourcesRetrieved.map((s, i) => (
                                        <li key={i}>{s}</li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div>
                                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>LIVE TOOL CALLS:</span>
                                    <ul style={{ margin: '4px 0 0 0', paddingLeft: 'var(--ds-space-4)', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-module-foundations-primary)', fontFamily: 'var(--ds-font-family-mono)' }}>
                                      {trace.toolCalls.map((t, i) => (
                                        <li key={i}>{t}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </Grid>

                                <div style={{ background: 'var(--ds-color-bg-canvas)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                                  <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>SANDBOX & COMPLIANCE GATE:</span>
                                  <div style={{ fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'bold', color: trace.sandboxStatus.includes('✓') ? '#5EC4C8' : 'var(--ds-color-text-primary)', marginTop: '2px' }}>
                                    {trace.sandboxStatus}
                                  </div>
                                </div>

                                <div>
                                  <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>GROUNDED ANSWER SYNTHESIS:</span>
                                  <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)', lineHeight: '1.5' }}>
                                    {trace.resultSummary}
                                  </p>
                                </div>

                                <div>
                                  <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>VERIFIED CITATIONS:</span>
                                  <Flex gap={2} style={{ marginTop: '4px', flexWrap: 'wrap' }}>
                                    {trace.citations.map((c, i) => (
                                      <Badge key={i} variant="subtle" style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: '11px' }}>
                                        📄 {c}
                                      </Badge>
                                    ))}
                                  </Flex>
                                </div>
                              </Stack>
                            </Card>
                          )}
                        </Stack>
                      </Card>
                    );
                  })()}
                </Section>

                {/* 12-STEP QUERY PIPELINE */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>The 12-Step Query Pipeline (Code & Telemetry RAG)</h3>
                  </Section.Header>
                  <Grid columns={3} gap={3}>
                    {SDLC_CASE_STUDY_DATA.queryPipeline12Steps.map((s) => (
                      <Card key={s.step} style={{ padding: 'var(--ds-space-4)' }}>
                        <Stack gap={1}>
                          <Flex align="center" gap={2}>
                            <Badge variant="primary">Step {s.step}</Badge>
                            <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{s.name}</strong>
                          </Flex>
                          <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                            {s.detail}
                          </p>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </Section>

                {/* PILOT RESULTS DASHBOARD */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>Production Pilot Results & Metrics</h3>
                  </Section.Header>
                  <Grid columns={4} gap={3}>
                    {SDLC_CASE_STUDY_DATA.successMetrics.map((m, idx) => (
                      <Card key={idx} style={{ padding: 'var(--ds-space-4)', textAlign: 'center' }}>
                        <Stack gap={1}>
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>{m.metric}</span>
                          <div style={{ fontSize: 'var(--ds-font-size-h2)', fontWeight: 'bold', color: 'var(--ds-color-module-foundations-primary)' }}>
                            {m.after}
                          </div>
                          {m.before !== "—" && (
                            <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>
                              Was: {m.before}
                            </span>
                          )}
                          <Badge variant="success">{m.delta}</Badge>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </Section>

                {/* 5-LAYER GUARDRAIL CONTROLS */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>5-Layer Defense-in-Depth Guardrail Controls</h3>
                  </Section.Header>
                  <Stack gap={2}>
                    {SDLC_CASE_STUDY_DATA.guardrailLayers.map((g, idx) => (
                      <Card key={idx} style={{ padding: 'var(--ds-space-3)' }}>
                        <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                          <strong style={{ minWidth: '160px', color: 'var(--ds-color-module-foundations-primary)' }}>{g.layer}</strong>
                          <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', flex: 1 }}>{g.controls}</span>
                        </Flex>
                      </Card>
                    ))}
                  </Stack>
                </Section>

                {/* LESSONS LEARNED */}
                <Callout variant="tip" title="Lessons Learned from SDLC RAG Production Deployment">
                  <ol style={{ margin: 0, paddingLeft: 'var(--ds-space-5)' }}>
                    {SDLC_CASE_STUDY_DATA.lessonsLearned.map((l, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>{l}</li>
                    ))}
                  </ol>
                </Callout>

                {/* VISUAL ARCHITECTURE FLOW DIAGRAMS */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>🎨 Visual Architecture & Flow Diagrams</h3>
                    <p style={{ color: 'var(--ds-color-text-secondary)' }}>Click to inspect architecture flows for core SDLC RAG sub-systems.</p>
                  </Section.Header>
                  <Flex gap={2} style={{ marginBottom: 'var(--ds-space-4)', flexWrap: 'wrap' }}>
                    {SDLC_DIAGRAMS.map(d => (
                      <button
                        key={d.id}
                        onClick={() => { setActiveDiagram(d.id); setActiveDiagStep(0); }}
                        style={{
                          padding: 'var(--ds-space-2) var(--ds-space-4)',
                          borderRadius: 'var(--ds-radius-md)',
                          border: '1px solid',
                          borderColor: activeDiagram === d.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                          background: activeDiagram === d.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                          color: activeDiagram === d.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-secondary)',
                          cursor: 'pointer',
                          fontWeight: activeDiagram === d.id ? 'bold' : 'normal',
                          fontSize: 'var(--ds-font-size-bodySm)'
                        }}
                      >
                        {d.title.split(':')[0]}
                      </button>
                    ))}
                  </Flex>

                  {(() => {
                    const diag = SDLC_DIAGRAMS.find(d => d.id === activeDiagram) || SDLC_DIAGRAMS[0];
                    return (
                      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
                        <Stack gap={4}>
                          <div>
                            <Badge variant="warning">{diag.title}</Badge>
                            <p style={{ marginTop: 'var(--ds-space-2)', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-body)' }}>{diag.description}</p>
                          </div>

                          {diag.image && (
                            <DiagramImage
                              src={diag.image}
                              alt={diag.title}
                              caption={diag.description}
                            />
                          )}

                          <Stack gap={3}>
                            <Flex justify="space-between" align="center">
                              <h4 style={{ color: 'var(--ds-color-text-primary)', margin: 0 }}>Interactive Execution Flow Sequence:</h4>
                              <Badge variant="subtle">Click any step below to inspect flow details</Badge>
                            </Flex>
                            <Stepper
                              activeStep={activeDiagStep}
                              onStepClick={(index) => setActiveDiagStep(index)}
                              steps={diag.nodes.map((node, idx) => ({
                                label: node.step,
                                detail: node.detail,
                                status: idx < activeDiagStep ? 'complete' : idx === activeDiagStep ? 'current' : 'upcoming'
                              }))}
                            />

                            {/* ACTIVE DIAGRAM STEP INSPECTOR CARD */}
                            {diag.nodes[activeDiagStep] && (
                              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-module-foundations-primary)' }}>
                                <Stack gap={2}>
                                  <Flex justify="space-between" align="center">
                                    <Badge variant="success">Step {activeDiagStep + 1} Selected: {diag.nodes[activeDiagStep].step}</Badge>
                                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>
                                      Step {activeDiagStep + 1} of {diag.nodes.length}
                                    </span>
                                  </Flex>
                                  <p style={{ margin: 0, color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-body)', fontWeight: 'bold', lineHeight: '1.5' }}>
                                    {diag.nodes[activeDiagStep].detail}
                                  </p>
                                </Stack>
                              </Card>
                            )}
                          </Stack>
                        </Stack>
                      </Card>
                    );
                  })()}
                </Section>

                {/* 90-DAY IMPLEMENTATION ROADMAP */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>🗺️ 90-Day Enterprise SDLC Implementation Roadmap</h3>
                    <p style={{ color: 'var(--ds-color-text-secondary)' }}>A phased 10-step rollout plan from documentation Q&A to full code indexing and real-time incident packs.</p>
                  </Section.Header>
                  <Grid columns={3} gap={4}>
                    {SDLC_90_DAY_ROADMAP.map((r, idx) => (
                      <Card key={idx} variant="bordered" style={{ padding: 'var(--ds-space-4)' }}>
                        <Stack gap={2}>
                          <Flex justify="space-between" align="center">
                            <Badge variant="primary">{r.phase}</Badge>
                            <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>{r.badge}</span>
                          </Flex>
                          <h4 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>{r.title}</h4>
                          <ul style={{ margin: 0, paddingLeft: 'var(--ds-space-4)', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>
                            {r.items.map((item, i) => (
                              <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
                            ))}
                          </ul>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </Section>

                {/* 14 ENTERPRISE SDLC CHALLENGES & MITIGATIONS MATRIX */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>⚡ 14 Enterprise SDLC RAG Challenges & Engineering Mitigations</h3>
                    <p style={{ color: 'var(--ds-color-text-secondary)' }}>Production gotchas and architectural solutions mapped from real-world deployments.</p>
                  </Section.Header>
                  <Grid columns={2} gap={3}>
                    {SDLC_CHALLENGES_MATRIX.map((c, idx) => (
                      <Card key={idx} style={{ padding: 'var(--ds-space-3)' }}>
                        <Stack gap={1}>
                          <span style={{ fontWeight: 'bold', color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                            ⚠️ {c.challenge}
                          </span>
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-state-success-light)' }}>
                            ✅ <strong>Mitigation:</strong> {c.mitigation}
                          </span>
                        </Stack>
                      </Card>
                    ))}
                  </Grid>
                </Section>

                {/* WHERE USEFUL VS WHEN NOT TO USE MATRIX */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>🎯 Where SDLC RAG Delivers ROI vs When NOT to Use</h3>
                  </Section.Header>
                  <Grid columns={2} gap={4}>
                    <Card style={{ padding: 'var(--ds-space-4)', background: 'rgba(22,163,74,0.04)', border: '1px solid rgba(22,163,74,0.2)' }}>
                      <h4 style={{ color: '#16A34A', marginBottom: 'var(--ds-space-3)' }}>✅ High-Value Adoption Use Cases</h4>
                      <Stack gap={2}>
                        {SDLC_WHERE_USEFUL_MATRIX.useful.map((u, i) => (
                          <div key={i}>
                            <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{u.title}</strong>
                            <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>{u.desc}</p>
                          </div>
                        ))}
                      </Stack>
                    </Card>

                    <Card style={{ padding: 'var(--ds-space-4)', background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.2)' }}>
                      <h4 style={{ color: '#DC2626', marginBottom: 'var(--ds-space-3)' }}>❌ When NOT to Use RAG</h4>
                      <Stack gap={2}>
                        {SDLC_WHERE_USEFUL_MATRIX.notUseful.map((n, i) => (
                          <div key={i}>
                            <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>{n.title}</strong>
                            <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>{n.desc}</p>
                          </div>
                        ))}
                      </Stack>
                    </Card>
                  </Grid>
                </Section>

                {/* BANKING LEGACY MODERNIZATION MINI-CASE STUDY */}
                <Card style={{ padding: 'var(--ds-space-5)', background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(13,148,136,0.08) 100%)' }}>
                  <Stack gap={3}>
                    <Badge variant="info">Banking Legacy Modernization Mini-Case Study</Badge>
                    <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>{BANKING_MODERNIZATION_CASE.title}</h3>
                    <p style={{ margin: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>{BANKING_MODERNIZATION_CASE.subtitle}</p>
                    <Grid columns={3} gap={3} style={{ marginTop: 'var(--ds-space-2)' }}>
                      {BANKING_MODERNIZATION_CASE.metrics.map((m, i) => (
                        <div key={i} style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                          <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>{m.label}</span>
                          <div style={{ fontSize: 'var(--ds-font-size-h2)', fontWeight: 'bold', color: 'var(--ds-color-module-foundations-primary)' }}>{m.delta}</div>
                          <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '4px 0 0 0' }}>{m.detail}</p>
                        </div>
                      ))}
                    </Grid>
                  </Stack>
                </Card>
              </Stack>
            )}

            {/* VIEW 2: FINANCIAL ADVISOR CASE STUDY */}
            {activeCaseStudyTab === 'financial' && (
              <Stack gap={6}>
                <Card style={{ padding: 'var(--ds-space-6)', background: 'linear-gradient(135deg, rgba(13,148,136,0.08) 0%, rgba(37,99,235,0.08) 100%)' }}>
                  <Stack gap={3}>
                    <Badge variant="warning">Financial Advisory Case Study</Badge>
                    <h2 style={{ fontSize: 'var(--ds-font-size-h1)', margin: 0 }}>{FINANCIAL_CASE_STUDY.title}</h2>
                    <h4 style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}>{FINANCIAL_CASE_STUDY.subtitle}</h4>
                    <p style={{ fontSize: 'var(--ds-font-size-bodyLg)', color: 'var(--ds-color-text-primary)' }}>
                      <strong>Business Problem:</strong> {FINANCIAL_CASE_STUDY.problem}
                    </p>
                  </Stack>
                </Card>

                {/* METRICS DASHBOARD */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>Production High-Level Success Metrics</h3>
                  </Section.Header>
                  <Grid columns={3} gap={4}>
                    <Card style={{ padding: 'var(--ds-space-4)' }}>
                      <h4 style={{ color: 'var(--ds-color-module-foundations-primary)', marginBottom: 'var(--ds-space-3)' }}>💼 Business Impact</h4>
                      {FINANCIAL_CASE_STUDY.metrics.business.map((m, i) => (
                        <div key={i} style={{ marginBottom: 'var(--ds-space-3)' }}>
                          <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>{m.label}</div>
                          <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
                            <span style={{ textDecoration: 'line-through', color: 'var(--ds-color-text-tertiary)' }}>{m.before}</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--ds-color-state-success-light)' }}>→ {m.after}</span>
                            <Badge variant="success">{m.change}</Badge>
                          </div>
                        </div>
                      ))}
                    </Card>

                    <Card style={{ padding: 'var(--ds-space-4)' }}>
                      <h4 style={{ color: '#3A9B9F', marginBottom: 'var(--ds-space-3)' }}>⚡ Technical Latency & Recall</h4>
                      {FINANCIAL_CASE_STUDY.metrics.technical.map((m, i) => (
                        <div key={i} style={{ marginBottom: 'var(--ds-space-3)' }}>
                          <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>{m.label}</div>
                          <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
                            <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-tertiary)' }}>Target: {m.target}</span>
                            <span style={{ fontWeight: 'bold', color: '#3A9B9F' }}>Actual: {m.actual}</span>
                          </div>
                        </div>
                      ))}
                    </Card>

                    <Card style={{ padding: 'var(--ds-space-4)' }}>
                      <h4 style={{ color: '#DC2626', marginBottom: 'var(--ds-space-3)' }}>🛡️ Risk & Compliance</h4>
                      {FINANCIAL_CASE_STUDY.metrics.risk.map((m, i) => (
                        <div key={i} style={{ marginBottom: 'var(--ds-space-3)' }}>
                          <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>{m.label}</div>
                          <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
                            <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-tertiary)' }}>Target: {m.target}</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--ds-color-state-success-light)' }}>Achieved: {m.actual}</span>
                          </div>
                        </div>
                      ))}
                    </Card>
                  </Grid>
                </Section>

                {/* REAL-TIME USE CASES & SIMULATOR */}
                <Section variant="bordered">
                  <Section.Header>
                    <h3 style={{ margin: 0 }}>Real-Time Financial Advisory Use Cases</h3>
                    <p style={{ color: 'var(--ds-color-text-secondary)' }}>Select a real-world scenario to examine how event streaming and agentic RAG process user queries.</p>
                  </Section.Header>
                  <Grid columns={4} gap={3} style={{ marginBottom: 'var(--ds-space-4)' }}>
                    {FINANCIAL_CASE_STUDY.useCases.map(uc => (
                      <button
                        key={uc.id}
                        onClick={() => { setActiveUseCase(uc.id); setSimStep(0); }}
                        style={{
                          padding: 'var(--ds-space-4)',
                          borderRadius: 'var(--ds-radius-md)',
                          border: '1px solid',
                          borderColor: activeUseCase === uc.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                          background: activeUseCase === uc.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                          color: activeUseCase === uc.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontWeight: activeUseCase === uc.id ? 'bold' : 'normal'
                        }}
                      >
                        {uc.name}
                      </button>
                    ))}
                  </Grid>

                  {/* ACTIVE USE CASE DETAILS */}
                  {(() => {
                    const uc = FINANCIAL_CASE_STUDY.useCases.find(u => u.id === activeUseCase);
                    const res = uc.simResult;
                    return (
                      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
                        <Stack gap={4}>
                          <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <Badge variant="info">Triggering Event / Query</Badge>
                              <h3 style={{ marginTop: 'var(--ds-space-2)', color: 'var(--ds-color-text-primary)' }}>{uc.event}</h3>
                            </div>
                            <Button
                              size="sm"
                              variant={isFinSimulating ? "danger" : "primary"}
                              onClick={() => {
                                setIsFinSimulating(true);
                                setTimeout(() => setIsFinSimulating(false), 900);
                              }}
                            >
                              {isFinSimulating ? "⚡ Ingesting Kafka Event..." : "⚡ Stream Real-Time Event"}
                            </Button>
                          </Flex>

                          {/* LIVE KAFKA EVENT JSON PAYLOAD */}
                          {uc.eventPayload && (
                            <Card style={{ padding: 'var(--ds-space-3)', background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)' }}>
                              <Stack gap={1}>
                                <Flex justify="space-between" align="center">
                                  <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                                    📡 LIVE INGESTED EVENT PAYLOAD (KAFKA / FLINK JSON)
                                  </span>
                                  <Badge variant="subtle">Topic: market.events.v1</Badge>
                                </Flex>
                                <CodeBlock code={JSON.stringify(uc.eventPayload, null, 2)} language="json" />
                              </Stack>
                            </Card>
                          )}

                          <div>
                            <h4 style={{ marginBottom: 'var(--ds-space-3)' }}>Step-by-Step Execution Sequence:</h4>
                            <Stepper
                              activeStep={simStep}
                              onStepClick={(index) => setSimStep(index)}
                              steps={uc.flow.map((stepText, idx) => ({
                                label: `Step ${idx + 1}`,
                                detail: stepText,
                                status: idx < simStep ? 'complete' : idx === simStep ? 'current' : 'upcoming'
                              }))}
                            />
                          </div>

                          <Flex gap={3}>
                            <Button
                              size="sm"
                              disabled={simStep === 0}
                              onClick={() => setSimStep(s => Math.max(0, s - 1))}
                            >
                              ← Previous Step
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              disabled={simStep >= uc.flow.length - 1}
                              onClick={() => setSimStep(s => Math.min(uc.flow.length - 1, s + 1))}
                            >
                              Next Execution Step →
                            </Button>
                          </Flex>

                          {/* LIVE ADVISOR CITED OUTPUT & COMPLIANCE VERIFICATION */}
                          {res && (
                            <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-module-foundations-primary)' }}>
                              <Stack gap={3}>
                                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '8px' }}>
                                  <Badge variant="success">💼 Grounded Advisor Intelligence Output</Badge>
                                  <span style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontWeight: 'bold' }}>
                                    Latency: {res.latencyMs}ms | Scope: {res.clientsAffected}
                                  </span>
                                </Flex>

                                <div style={{ background: 'var(--ds-color-bg-canvas)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                                  <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>REGULATORY COMPLIANCE VERIFICATION:</span>
                                  <div style={{ fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'bold', color: res.complianceStatus.includes('✓') ? '#5EC4C8' : '#C47A6A', marginTop: '2px' }}>
                                    {res.complianceStatus}
                                  </div>
                                </div>

                                <div>
                                  <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>SYNTHESIZED ADVISOR RECOMMENDATION:</span>
                                  <p style={{ margin: '4px 0 0 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-primary)', lineHeight: '1.5' }}>
                                    {res.generatedSummary}
                                  </p>
                                </div>

                                <div>
                                  <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)', fontWeight: 'bold' }}>POLICY & RESEARCH CITATIONS:</span>
                                  <Flex gap={2} style={{ marginTop: '4px', flexWrap: 'wrap' }}>
                                    {res.citations.map((c, i) => (
                                      <Badge key={i} variant="subtle" style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: '11px' }}>
                                        📜 {c}
                                      </Badge>
                                    ))}
                                  </Flex>
                                </div>
                              </Stack>
                            </Card>
                          )}
                        </Stack>
                      </Card>
                    );
                  })()}
                </Section>
              </Stack>
            )}
          </Stack>
        )}

        {/* MODE 2: 9-STEP SYSTEM DESIGN SIMULATOR & ENHANCEMENT */}
        {activeMode === 'systemdesign' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-6)', background: 'linear-gradient(135deg, rgba(202,138,4,0.12) 0%, rgba(147,51,234,0.12) 100%)' }}>
              <Stack gap={3}>
                <Flex gap={2} align="center">
                  <Badge variant="warning">System Design Framework</Badge>
                  <Badge variant="success">Interactive Architecture Simulator</Badge>
                </Flex>
                <h2 style={{ fontSize: 'var(--ds-font-size-h1)', margin: 0 }}>9-Step RAG System Design Blueprint Simulator</h2>
                <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodyLg)', margin: 0 }}>
                  An interactive step-by-step simulator to practice architecting production RAG systems. Test SLA latency budgets, tweak interactive architecture parameters, inspect live JSON query payloads, and run live query simulations.
                </p>
              </Stack>
            </Card>

            {/* AI GENERATED SYSTEM DESIGN ARCHITECTURE DIAGRAM */}
            <Section variant="bordered">
              <Section.Header>
                <h3 style={{ margin: 0 }}>🎨 9-Step System Design Master Architecture Diagram</h3>
                <p style={{ color: 'var(--ds-color-text-secondary)' }}>AI-generated end-to-end architecture topology covering all 9 system design phases.</p>
              </Section.Header>
              <DiagramImage
                src="/assets/rag_system_design_9step_blueprint.png"
                alt="9-Step Enterprise RAG System Design Blueprint"
                caption="9-Step Enterprise RAG System Design Blueprint — From SLA & Requirements to Ingestion, Hybrid Search, RAGAS Evals, and Safeguards."
              />
            </Section>

            {/* INTERACTIVE PIPELINE ARCHITECTURE TUNER */}
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>⚙️ Interactive Pipeline Architecture Tuner</h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>
                      Tweak pipeline parameters below to see live updates to Retrieval Recall@10, Latency SLA, and Compilation / Secret Security Score!
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={isSimulatingRun ? "danger" : "primary"}
                    onClick={() => runLivePipelineSimulation()}
                  >
                    {isSimulatingRun ? "⏳ Running Simulation..." : "🚀 Run Live Query Simulation"}
                  </Button>
                </Flex>

                <Grid columns={4} gap={3}>
                  <div>
                    <label style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>1. Chunking Strategy</label>
                    <select
                      value={configChunking}
                      onChange={(e) => setConfigChunking(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: 'var(--ds-radius-md)', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)' }}
                    >
                      <option value="ast">Tree-Sitter AST (Function/Class)</option>
                      <option value="fixed">Fixed Token (512 tokens)</option>
                      <option value="clause">Clause-Level (Section 4.2)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>2. Search Retrieval Mode</label>
                    <select
                      value={configRetrieval}
                      onChange={(e) => setConfigRetrieval(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: 'var(--ds-radius-md)', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)' }}
                    >
                      <option value="hybrid">Hybrid RRF (Dense + BM25)</option>
                      <option value="dense">Dense Vector Only</option>
                      <option value="sparse">BM25 Keyword Only</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>3. Sandbox & Guardrails</label>
                    <select
                      value={configGuardrails}
                      onChange={(e) => setConfigGuardrails(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: 'var(--ds-radius-md)', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)' }}
                    >
                      <option value="docker_pass1">Docker Sandbox pass@1 Compile</option>
                      <option value="ragas_faithfulness">RAGAS Faithfulness Check</option>
                      <option value="none">No Guardrails (Raw Output)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>4. Security & ACL Scanner</label>
                    <select
                      value={configSecurity}
                      onChange={(e) => setConfigSecurity(e.target.value)}
                      style={{ width: '100%', marginTop: '4px', padding: '8px', borderRadius: 'var(--ds-radius-md)', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)' }}
                    >
                      <option value="gitleaks_acl">Gitleaks Scan + Pre-Retrieval ACL</option>
                      <option value="disabled">Disabled (High Risk)</option>
                    </select>
                  </div>
                </Grid>

                {/* LIVE ARCHITECTURE METRICS CARDS */}
                <Grid columns={4} gap={3} style={{ marginTop: 'var(--ds-space-2)' }}>
                  <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>Retrieval Recall@10</span>
                    <div style={{ fontSize: 'var(--ds-font-size-h3)', fontWeight: 'bold', color: configRetrieval === 'hybrid' ? '#5EC4C8' : '#C47A6A' }}>
                      {configRetrieval === 'hybrid' ? '94.2%' : configRetrieval === 'dense' ? '71.0%' : '68.5%'}
                    </div>
                  </div>
                  <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>Syntax & Compilation Pass Rate</span>
                    <div style={{ fontSize: 'var(--ds-font-size-h3)', fontWeight: 'bold', color: configChunking === 'ast' && configGuardrails === 'docker_pass1' ? '#5EC4C8' : '#DC2626' }}>
                      {configChunking === 'ast' && configGuardrails === 'docker_pass1' ? '98.5%' : configChunking === 'ast' ? '82.0%' : '62.4%'}
                    </div>
                  </div>
                  <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>Total Pipeline Latency</span>
                    <div style={{ fontSize: 'var(--ds-font-size-h3)', fontWeight: 'bold', color: '#3A9B9F' }}>
                      {calculatedLatency}ms
                    </div>
                  </div>
                  <div style={{ background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>Secret & Policy Leaks</span>
                    <div style={{ fontSize: 'var(--ds-font-size-h3)', fontWeight: 'bold', color: configSecurity === 'gitleaks_acl' ? '#5EC4C8' : '#DC2626' }}>
                      {configSecurity === 'gitleaks_acl' ? '0 Secrets' : '⚠️ 12 Leaks'}
                    </div>
                  </div>
                </Grid>
              </Stack>
            </Card>

            {/* INTERACTIVE SIMULATOR CONTROLS */}
            <Section variant="bordered">
              <Section.Header>
                <Flex justify="space-between" align="center" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>⚡ Interactive System Design Step-by-Step Simulator</h3>
                    <p style={{ color: 'var(--ds-color-text-secondary)', margin: 0 }}>Select an enterprise scenario and step through the 9 system design phases.</p>
                  </div>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      variant={isAutoPlay ? "danger" : "primary"}
                      onClick={() => setIsAutoPlay(!isAutoPlay)}
                    >
                      {isAutoPlay ? "⏸ Pause Auto-Play" : "▶ Play Auto-Simulation ⚡"}
                    </Button>
                  </Flex>
                </Flex>
              </Section.Header>

              {/* SCENARIO SELECTOR */}
              <Flex gap={3} style={{ marginBottom: 'var(--ds-space-4)', flexWrap: 'wrap' }}>
                {Object.values(SYSTEM_DESIGN_SCENARIOS).map(sc => (
                  <button
                    key={sc.id}
                    onClick={() => { setSimScenario(sc.id); setSimCurrentStep(0); setIsAutoPlay(false); }}
                    style={{
                      padding: 'var(--ds-space-3) var(--ds-space-5)',
                      borderRadius: 'var(--ds-radius-md)',
                      border: '1px solid',
                      borderColor: simScenario === sc.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                      background: simScenario === sc.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-bg-surface)',
                      color: simScenario === sc.id ? 'white' : 'var(--ds-color-text-primary)',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: 'var(--ds-font-size-bodySm)'
                    }}
                  >
                    {sc.name}
                  </button>
                ))}
              </Flex>

              {/* SCENARIO OVERVIEW CARD */}
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-canvas)', marginBottom: 'var(--ds-space-4)' }}>
                <Grid columns={4} gap={3}>
                  <div>
                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>Target SLA Budget</span>
                    <div style={{ fontSize: 'var(--ds-font-size-h3)', fontWeight: 'bold', color: 'var(--ds-color-module-foundations-primary)' }}>
                      {currentScenarioData.sla}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>Scale & Workload</span>
                    <div style={{ fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'bold', color: 'var(--ds-color-text-primary)' }}>
                      {currentScenarioData.scale}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>Target Personas</span>
                    <div style={{ fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'bold', color: 'var(--ds-color-text-primary)' }}>
                      {currentScenarioData.targetUsers}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-tertiary)' }}>Example Query</span>
                    <div style={{ fontSize: 'var(--ds-font-size-caption)', fontStyle: 'italic', color: 'var(--ds-color-text-secondary)' }}>
                      "{currentScenarioData.queryExample}"
                    </div>
                  </div>
                </Grid>
              </Card>

              {/* STEP BUTTON NAVIGATION (STEP 1 - 9) */}
              <Grid columns={9} gap={2} style={{ marginBottom: 'var(--ds-space-5)' }}>
                {SYSTEM_DESIGN_STEPS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSimCurrentStep(idx); setIsAutoPlay(false); }}
                    style={{
                      padding: 'var(--ds-space-3) 0',
                      borderRadius: 'var(--ds-radius-md)',
                      border: '1px solid',
                      borderColor: simCurrentStep === idx ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                      background: simCurrentStep === idx ? 'var(--ds-color-module-foundations-primary)' : idx < simCurrentStep ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                      color: simCurrentStep === idx ? 'white' : idx < simCurrentStep ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 'var(--ds-font-size-bodySm)'
                    }}
                  >
                    Step {idx + 1}
                  </button>
                ))}
              </Grid>

              {/* LATENCY BUDGET GAUGE BAR */}
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-canvas)', marginBottom: 'var(--ds-space-5)' }}>
                <Flex justify="space-between" align="center" style={{ marginBottom: 'var(--ds-space-2)' }}>
                  <span style={{ fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'bold', color: 'var(--ds-color-text-primary)' }}>
                    ⏱ Accumulated Latency Budget Progress:
                  </span>
                  <span style={{ fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'bold', color: latencyPct > 90 ? '#DC2626' : '#16A34A' }}>
                    {calculatedLatency}ms / {targetSlaMs}ms ({latencyPct}%)
                  </span>
                </Flex>
                <div style={{
                  height: '10px',
                  width: '100%',
                  background: 'var(--ds-color-border-subtle)',
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${latencyPct}%`,
                    background: latencyPct > 90 ? '#DC2626' : 'linear-gradient(90deg, #5EC4C8, #C47A6A)',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </Card>

              {/* ACTIVE STEP SIMULATION DETAILS */}
              <Card style={{ padding: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)' }}>
                <Stack gap={5}>
                  <Flex justify="space-between" align="center">
                    <Badge variant="warning">{currentStepData.title}</Badge>
                    <Badge variant="info">Phase Latency Contribution: +{currentStepData.latency}ms</Badge>
                  </Flex>

                  <Grid columns={2} gap={4}>
                    {/* LEFT COLUMN: INTERVIEWER QUESTIONS & ARCHITECTURE DECISION */}
                    <Stack gap={3}>
                      <div>
                        <h4 style={{ color: 'var(--ds-color-module-foundations-primary)', marginBottom: 'var(--ds-space-2)' }}>
                          ❓ Key Questions to Clarify with Interviewer:
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: 'var(--ds-space-4)', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                          {currentStepData.keyQuestions.map((q, i) => (
                            <li key={i} style={{ marginBottom: '4px' }}>{q}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 style={{ color: 'var(--ds-color-state-success-light)', marginBottom: 'var(--ds-space-2)' }}>
                          ✅ Selected Architecture Decision:
                        </h4>
                        <p style={{ margin: 0, color: 'var(--ds-color-text-primary)', fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'semibold', lineHeight: '1.5' }}>
                          {currentStepData.decision}
                        </p>
                      </div>

                      <div>
                        <h4 style={{ color: '#DC2626', marginBottom: 'var(--ds-space-2)' }}>
                          ⚖️ Core Trade-Off to Discuss:
                        </h4>
                        <p style={{ margin: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)', fontStyle: 'italic' }}>
                          {currentStepData.tradeoff}
                        </p>
                      </div>
                    </Stack>

                    {/* RIGHT COLUMN: LIVE SIMULATED JSON PAYLOAD INSPECTOR */}
                    <Stack gap={2}>
                      <Flex justify="space-between" align="center">
                        <span style={{ fontSize: 'var(--ds-font-size-caption)', fontWeight: 'bold', color: 'var(--ds-color-text-tertiary)' }}>
                          LIVE PIPELINE STEP JSON PAYLOAD
                        </span>
                        <Badge variant="subtle">Step {simCurrentStep + 1} of 9</Badge>
                      </Flex>
                      <CodeBlock
                        code={JSON.stringify({
                          ...currentStepData.payload,
                          config_active: {
                            chunking: configChunking,
                            search: configRetrieval,
                            guardrails: configGuardrails,
                            security: configSecurity
                          }
                        }, null, 2)}
                        language="json"
                      />
                    </Stack>
                  </Grid>

                  {/* SIMULATOR STEPPER CONTROLS */}
                  <Flex justify="space-between" align="center">
                    <Button
                      size="sm"
                      disabled={simCurrentStep === 0}
                      onClick={() => { setSimCurrentStep(s => Math.max(0, s - 1)); setIsAutoPlay(false); }}
                    >
                      ← Previous Step
                    </Button>

                    <span style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>
                      Step {simCurrentStep + 1} of 9
                    </span>

                    <Button
                      size="sm"
                      variant="primary"
                      disabled={simCurrentStep >= 8}
                      onClick={() => { setSimCurrentStep(s => Math.min(8, s + 1)); setIsAutoPlay(false); }}
                    >
                      Next Step →
                    </Button>
                  </Flex>
                </Stack>
              </Card>
            </Section>

            {/* MODEL CANDIDATE ANSWER SCRIPT */}
            <Callout variant="tip" title="Model Candidate Answer Script (Tailored to Selected Scenario)">
              <p style={{ margin: 0, lineHeight: 'var(--ds-font-lineHeight-relaxed)', fontSize: 'var(--ds-font-size-body)' }}>
                <em>"I would architect this {currentScenarioData.name} by starting with SLA targets ({currentScenarioData.sla}). For security, I enforce pre-retrieval tenant filtering ({configSecurity}). Ingestion uses {configChunking === 'ast' ? 'Tree-Sitter AST chunking for code' : 'clause-level OCR for docs'}. Search uses {configRetrieval === 'hybrid' ? 'Hybrid RRF (Dense + BM25)' : 'Dense vector search'}. Output is verified via {configGuardrails === 'docker_pass1' ? 'Docker Sandbox pass@1 compile check' : 'RAGAS Faithfulness check'} before returning cited file#line references."</em>
              </p>
            </Callout>
          </Stack>
        )}

        {/* MODE 3: STAR METHOD & PRODUCTION PSEUDOCODES */}
        {activeMode === 'star' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)' }}>
              <Stack gap={3}>
                <Badge variant="success">STAR Interview Framework</Badge>
                <h3 style={{ margin: 0 }}>DevContext Copilot — SDLC RAG STAR Story</h3>
                <Grid columns={4} gap={3} style={{ marginTop: 'var(--ds-space-2)' }}>
                  <div style={{ background: 'var(--ds-color-bg-canvas)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <strong style={{ color: 'var(--ds-color-module-foundations-primary)' }}>S — Situation</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-bodySm)', margin: '4px 0 0 0' }}>{SDLC_CASE_STUDY_DATA.sdlcStarStory.situation}</p>
                  </div>
                  <div style={{ background: 'var(--ds-color-bg-canvas)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <strong style={{ color: '#3A9B9F' }}>T — Task</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-bodySm)', margin: '4px 0 0 0' }}>{SDLC_CASE_STUDY_DATA.sdlcStarStory.task}</p>
                  </div>
                  <div style={{ background: 'var(--ds-color-bg-canvas)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <strong style={{ color: '#C47A6A' }}>A — Action</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-bodySm)', margin: '4px 0 0 0' }}>{SDLC_CASE_STUDY_DATA.sdlcStarStory.action}</p>
                  </div>
                  <div style={{ background: 'var(--ds-color-bg-canvas)', padding: 'var(--ds-space-3)', borderRadius: 'var(--ds-radius-md)' }}>
                    <strong style={{ color: '#16A34A' }}>R — Result</strong>
                    <p style={{ fontSize: 'var(--ds-font-size-bodySm)', margin: '4px 0 0 0' }}>{SDLC_CASE_STUDY_DATA.sdlcStarStory.result}</p>
                  </div>
                </Grid>
              </Stack>
            </Card>

            {/* PSEUDOCODE VIEWER */}
            <Section variant="bordered">
              <Section.Header>
                <h3 style={{ margin: 0 }}>Production Pseudocodes to Show in Interviews</h3>
                <p style={{ color: 'var(--ds-color-text-secondary)' }}>Click to view copyable Python pseudocode for key architecture layers.</p>
              </Section.Header>

              <Flex gap={2} style={{ marginBottom: 'var(--ds-space-4)' }}>
                {[
                  { id: 'retrieval', label: '1. Hybrid Retrieval & Reranking' },
                  { id: 'orchestration', label: '2. Agentic RAG Orchestration' },
                  { id: 'evaluation', label: '3. Continuous Evaluation Runner' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setActivePseudocode(p.id)}
                    style={{
                      padding: 'var(--ds-space-2) var(--ds-space-4)',
                      borderRadius: 'var(--ds-radius-md)',
                      border: '1px solid',
                      borderColor: activePseudocode === p.id ? 'var(--ds-color-module-foundations-primary)' : 'var(--ds-color-border-subtle)',
                      background: activePseudocode === p.id ? 'var(--ds-color-module-foundations-light)' : 'var(--ds-color-bg-surface)',
                      color: activePseudocode === p.id ? 'var(--ds-color-module-foundations-dark)' : 'var(--ds-color-text-secondary)',
                      cursor: 'pointer',
                      fontWeight: activePseudocode === p.id ? 'bold' : 'normal'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </Flex>

              <Card style={{ padding: 'var(--ds-space-4)' }}>
                <Flex justify="space-between" align="center" style={{ marginBottom: 'var(--ds-space-3)' }}>
                  <span style={{ fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 'bold', color: 'var(--ds-color-text-secondary)' }}>
                    PRODUCTION PYTHON REFERENCE
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => copyCodeToClipboard(CODE_PSEUDOCODES[activePseudocode])}>
                    {copiedCode ? '✓ Copied' : '📋 Copy Code Snippet'}
                  </Button>
                </Flex>
                <CodeBlock code={CODE_PSEUDOCODES[activePseudocode]} language="python" />
              </Card>
            </Section>
          </Stack>
        )}
        {/* ─── INTERACTIVE ENHANCEMENTS SHOWCASE: IMAGE + WORKFLOW + TABLE + ANIMATION ─── */}
        <Section style={{ marginTop: 'var(--ds-space-12)' }}>
          <Reveal variant="rise">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--ds-space-4)' }}>
              <h2 style={{ margin: 0, fontSize: 'var(--ds-font-size-h1)' }}>🪄 Interactive RAG Showcase</h2>
              <Badge variant="module" moduleId="rag">Image · Workflow · Table · Animation</Badge>
            </div>
            <p style={{ marginTop: 0, color: 'var(--ds-color-text-secondary)', maxWidth: 820 }}>
              All four enhancement primitives in one place: a zoomable, hotspot-annotated architecture diagram; a step-through
              workflow builder; a sortable, filterable challenge matrix; and scroll-reveal animation with animated counters.
            </p>
          </Reveal>

          <Stack gap={6}>
            <Reveal variant="rise" delay={60}>
              <ZoomableImage
                src="/assets/sdlc_incident_context_pack_flow.png"
                title="Real-Time Incident Context-Pack Architecture"
                caption="Tap the numbered hotspots to inspect the real-time incident context pipeline; click the figure for a zoomable fullscreen view."
                accent="rag"
                hotspots={[
                  { x: 14, y: 32, label: 'Alert Trigger', title: 'PagerDuty', body: 'Event ingestion triggered upon latency/error threshold breach.' },
                  { x: 38, y: 30, label: 'Stream Processing', title: 'Kafka / Flink', body: 'Resolves service topology, affected service entity and blast radius.' },
                  { x: 60, y: 42, label: 'Parallel Retrieval', title: 'Context Pack', body: 'Pulls runbooks, past postmortems, recent commit SHAs, and APM telemetry.' },
                  { x: 82, y: 36, label: 'ChatOps Delivery', title: 'Slack Incident Bot', body: 'Automated cited mitigation draft posted to on-call engineers in <5 seconds.' },
                ]}
              />
            </Reveal>

            <Reveal variant="rise" delay={120}>
              <Workflow
                accent="rag"
                accentLabel="9-Step Blueprint"
                title="From Requirements to Production RAG"
                description="The canonical enterprise RAG system-design flow. Hit ▶ Play to animate."
                steps={SYSTEM_DESIGN_STEPS.map((s) => ({
                  title: s.step, description: s.detail, icon: '🧩',
                }))}
              />
            </Reveal>

            <Reveal variant="rise" delay={180}>
              <DataTable
                caption="SDLC RAG Challenges & Mitigations"
                columns={[
                  { key: 'challenge', label: 'Challenge', sortable: false },
                  { key: 'mitigation', label: 'Mitigation', sortable: false },
                ]}
                rows={SDLC_CHALLENGES_MATRIX}
                rowKey={(r) => r.challenge}
              />
            </Reveal>

            <Reveal variant="scale" delay={240}>
              <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
                {[
                  { label: 'Retrieval Recall@10', value: 94.2, suffix: '%', decimals: 1, color: 'var(--ds-color-module-rag-primary)' },
                  { label: 'Citation Accuracy', value: 96.5, suffix: '%', decimals: 1, color: 'var(--ds-color-module-rag-primary)' },
                  { label: 'Hallucination Rate', value: 0.4, suffix: '%', decimals: 1, color: 'var(--ds-color-state-success-light)' },
                ].map((m) => (
                  <Card key={m.label} style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ds-color-text-tertiary)' }}>{m.label}</div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: m.color }}>
                      <AnimatedNumber value={m.value} decimals={m.decimals} suffix={m.suffix} />
                    </div>
                  </Card>
                ))}
              </Grid>
            </Reveal>
          </Stack>
        </Section>
      </Container>
    </div>
  );
}
