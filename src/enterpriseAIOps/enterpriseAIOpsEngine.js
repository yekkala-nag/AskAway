/**
 * Enterprise AI Architecture & Operations Engine
 * Framework for Managing Token Limits, FinOps, Routing, and Multi-Stage Processing at an Organizational Scale
 */

// 1. Organizational Token Governance Framework (4 Core Pillars)
export const ENTERPRISE_PILLARS = [
  {
    id: "gateway_caching",
    title: "1. Centralized AI Gateway & Semantic Caching",
    icon: "🛡️",
    summary: "Decouple app services from LLM providers via a reverse proxy AI gateway with tiered caching.",
    metrics: { savings: "35% - 50% Token Reduction", latency: "<15ms Cache Hits", risk: "Low" },
    mechanisms: [
      "Exact-match string hash caching (Redis) for deterministic system prompts & queries.",
      "Vector-based semantic caching (Milvus/Qdrant) with cosine threshold (0.92+) for recurring semantic intents.",
      "Org-wide rate limiting, token quota enforcement, and department-level cost allocation tags.",
      "Zero-downtime failover across Azure OpenAI, AWS Bedrock, and GCP Vertex AI."
    ]
  },
  {
    id: "model_routing",
    title: "2. Dynamic Model Cascades & Intelligent Routing",
    icon: "🔀",
    summary: "Route requests dynamically based on task complexity, input token size, and SLA requirements.",
    metrics: { savings: "60% - 75% Cost Reduction", latency: "2x - 4x Faster P95", risk: "Low" },
    mechanisms: [
      "Lightweight embedding / SLM classifier (e.g. Llama-3-8B / Claude 3.5 Haiku) evaluates prompt difficulty.",
      "Low-complexity tasks (classification, simple extraction) route to ultra-cheap SLMs ($0.05/M tokens).",
      "High-complexity reasoning (multi-hop logic, code gen, compliance) escalates to Frontier Models.",
      "Speculative decoding & cascade retry: if SLM confidence < 0.85, escalate to reasoning LLM."
    ]
  },
  {
    id: "rag_optimization",
    title: "3. Advanced RAG & Token Compression Pipeline",
    icon: "⚡",
    summary: "Multi-stage context refinement to eliminate 'Lost in the Middle' and minimize prompt payload.",
    metrics: { savings: "80% - 92% Input Tokens", latency: "Sub-500ms Retrieval", risk: "Medium" },
    mechanisms: [
      "Hybrid Vector Search combining BM25 keyword matching with Dense Embeddings.",
      "Cross-Encoder Re-ranker (Cohere / BGE-Reranker) selecting top-K most relevant chunks.",
      "Context-aware token pruning (LLMLingua) stripping redundant syntactic tokens.",
      "Needle positioning: injecting high-relevance evidence at prompt primacy and recency zones."
    ]
  },
  {
    id: "map_reduce_ops",
    title: "4. Map-Reduce Batch Processing for Long Documents",
    icon: "📑",
    summary: "Distributed asynchronous map-reduce patterns for contracts, regulatory filings, and codebases.",
    metrics: { savings: "100% Corpus Coverage", latency: "Parallel Async Workers", risk: "Low" },
    mechanisms: [
      "Document chunking by semantic AST/markdown boundaries into parallel worker payloads.",
      "Parallel Map Phase: Small worker LLMs extract structured JSON schemas from each chunk concurrently.",
      "Intermediate aggregation: hierarchical clustering of extracted entities and findings.",
      "Master Reduce Phase: Frontier LLM synthesizes structured extracts into executive summary."
    ]
  }
];

// Executive Alignment & Guide for Architectural Visuals
export const EXECUTIVE_VISUAL_GUIDES = [
  {
    id: "rag_pipeline_guide",
    title: "1. Advanced RAG & Token Optimization Pipeline",
    icon: "⚡",
    audience: "For Engineers & Solution Architects",
    tagline: "Minimizing token payload while maximizing semantic grounding",
    description: "This diagram shows the ideal data flow for minimizing token usage while maximizing accuracy. It highlights how a user query is checked against a semantic cache first (saving tokens entirely if there's a match), then passed through hybrid search and a reranker to isolate only the most relevant text, compressed to remove noise, and finally sent to the LLM.",
    keyTakeaway: "Eliminates duplicate calls via Redis cache and stops 90%+ of irrelevant noise from reaching the LLM."
  },
  {
    id: "dynamic_routing_guide",
    title: "2. Dynamic Model Routing (The Router Pattern)",
    icon: "🔀",
    audience: "For Tech Leads & FinOps Stakeholders",
    tagline: "Cost and token governance through intelligent tier dispatch",
    description: "This flowchart illustrates cost and token governance. Instead of sending every request to a massive, expensive model, an 'AI Router' evaluates the complexity of the incoming request. Simple tasks are routed to small, fast, low-token models, while complex reasoning tasks are routed to large models. This dramatically reduces overall token consumption across an organization.",
    keyTakeaway: "Reduces organization-wide token spend by 60% - 75% without degrading complex reasoning accuracy."
  },
  {
    id: "map_reduce_guide",
    title: "3. Map-Reduce Pattern for Long Documents",
    icon: "📑",
    audience: "For Platform Teams & Compliance Architects",
    tagline: "Handling oversized inputs that exceed any single context window",
    description: "This infographic breaks down how to handle inputs that are simply too large for any single context window. It shows a massive document being split into manageable chunks (Map phase), processed in parallel by the LLM to generate intermediate summaries, and then combined into a single, cohesive final output (Reduce phase).",
    keyTakeaway: "Enables 100% corpus coverage over 500+ page contracts with parallel horizontal scalability."
  }
];

// 2. Enterprise Sample Document Corpora for Simulations
export const SAMPLE_ENTERPRISE_DATASETS = [
  {
    id: "legal_msa",
    name: "Master Services Agreement (MSA)",
    rawTokens: 320000,
    domain: "Legal & Procurement",
    sampleQuery: "What is our maximum liability exposure if a cloud data breach occurs in Year 2?",
    chunks: [
      { id: "C1", title: "Section 4.1: General Indemnification Cap", tokens: 5200, score: 0.94, text: "Aggregate liability capped at 12 months fees ($5,000,000 USD) except for Gross Negligence." },
      { id: "C2", title: "Section 4.2: Data Security Super-Cap", tokens: 4800, score: 0.98, text: "Data breach claims under Article 9 are subject to a 3x Multiplier Super-Cap ($15,000,000 USD)." },
      { id: "C3", title: "Section 7.3: Service Level Credits", tokens: 6100, score: 0.35, text: "99.9% monthly uptime target. Credits capped at 15% of monthly recurring bill." },
      { id: "C4", title: "Section 9.4: Mandatory 72-Hour Breach Notice", tokens: 4100, score: 0.89, text: "Vendor shall notify Customer in writing within 72 hours of confirming unauthorized access." },
      { id: "C5", title: "Section 12.1: Governing Law & Jurisdiction", tokens: 3900, score: 0.22, text: "This Agreement shall be governed by Delaware State corporate law." }
    ],
    generatedAnswer: "Based on Section 4.2 (Data Security Super-Cap), data breach claims are subject to a 3x multiplier above general indemnity, capping your maximum liability exposure at $15,000,000 USD in Year 2. Mandatory breach notification is required within 72 hours under Section 9.4."
  },
  {
    id: "sec_10k",
    name: "Q4 SEC 10-K Financial Filing",
    rawTokens: 185000,
    domain: "Finance & Regulatory",
    sampleQuery: "Summarize YoY revenue growth, GPU capex commitments, and R&D cloud amortizations.",
    chunks: [
      { id: "F1", title: "Item 7: MD&A - Revenue Breakdown", tokens: 5800, score: 0.96, text: "Consolidated enterprise revenue grew 34% YoY to $14.2B driven by generative AI cloud services." },
      { id: "F2", title: "Note 8: Capital Expenditure Commitments", tokens: 4900, score: 0.92, text: "Committed $3.8B in multi-year GPU cluster procurement through 2027." },
      { id: "F3", title: "Note 14: Stock-Based Compensation", tokens: 6200, score: 0.18, text: "Equity compensation expense totaled $680M for the trailing twelve months." },
      { id: "F4", title: "Item 8: R&D Software Capitalization", tokens: 4400, score: 0.88, text: "Cloud infrastructure amortizations of $1.1B recognized under cost of revenues." }
    ],
    generatedAnswer: "Enterprise revenue grew 34% YoY to $14.2B. Capital expenditure commitments include $3.8B allocated for multi-year GPU clusters, with $1.1B in R&D cloud infrastructure amortizations recognized under cost of revenue."
  },
  {
    id: "codebase_repo",
    name: "Enterprise Microservices Monorepo",
    rawTokens: 450000,
    domain: "Software Engineering & Security",
    sampleQuery: "Identify all unauthenticated gRPC endpoints in the authentication gateway.",
    chunks: [
      { id: "S1", title: "gateway/auth_interceptor.go:L45", tokens: 3200, score: 0.97, text: "Whitelisted public endpoints: /healthz, /metrics, and /v1/auth/login. All others require JWT." },
      { id: "S2", title: "services/billing/handler.go:L112", tokens: 4100, score: 0.28, text: "Billing webhook listener verifies HMAC-SHA256 signature headers." },
      { id: "S3", title: "gateway/grpc_routes.go:L88", tokens: 3800, score: 0.93, text: "Endpoint /v1/debug/pprof was mistakenly excluded from authentication interceptor chain." }
    ],
    generatedAnswer: "Security Audit Findings: While standard public endpoints are limited to `/healthz`, `/metrics`, and `/v1/auth/login`, endpoint `/v1/debug/pprof` in `grpc_routes.go:L88` bypasses the authentication interceptor chain and must be gated immediately."
  }
];

// 3. Live RAG Pipeline Simulator Function
export function RUN_RAG_PIPELINE_SIMULATION(datasetId, isCacheHit, topKCount, compressionPercent) {
  const dataset = SAMPLE_ENTERPRISE_DATASETS.find(d => d.id === datasetId) || SAMPLE_ENTERPRISE_DATASETS[0];

  if (isCacheHit) {
    return {
      status: "CACHE_HIT",
      stage: "Tier-1 Semantic Cache Hit (Redis / Qdrant)",
      inputTokens: 0,
      retrievedTokens: 0,
      compressedTokens: 0,
      tokenReductionPct: 100,
      latencyMs: 12,
      costUsd: 0.00001,
      modelUsed: "Instant Semantic Cache Store",
      response: `[SEMANTIC CACHE HIT - 12ms] ${dataset.generatedAnswer}`,
      traceSteps: [
        { node: "User Query", detail: `Inbound query: "${dataset.sampleQuery}"`, time: "0ms" },
        { node: "Semantic Cache", detail: "Cosine Similarity: 0.972 (Threshold > 0.94) -> Exact match found", time: "12ms" }
      ]
    };
  }

  // Uncached Multi-Stage Execution
  const rawTokens = dataset.rawTokens;
  const candidateTokens = Math.min(rawTokens, 60000);
  
  // Sort and pick top-K chunks
  const rankedChunks = [...dataset.chunks].sort((a, b) => b.score - a.score).slice(0, topKCount);
  const rerankedTokens = rankedChunks.reduce((acc, c) => acc + c.tokens, 0);

  // Apply LLMLingua compression
  const compressRatio = compressionPercent / 100;
  const compressedTokens = Math.round(rerankedTokens * (1 - compressRatio));

  const totalReductionPct = (((rawTokens - compressedTokens) / rawTokens) * 100).toFixed(1);
  const latencyMs = Math.round(180 + (topKCount * 45) + (compressedTokens * 0.04));
  const costUsd = ((compressedTokens / 1_000_000) * 5.00 + (350 / 1_000_000) * 15.00).toFixed(5);

  return {
    status: "CACHE_MISS_PROCESSED",
    stage: "Multi-Stage RAG + Token Pruning Completed",
    rawTokens,
    candidateTokens,
    rerankedTokens,
    compressedTokens,
    tokenReductionPct: totalReductionPct,
    latencyMs,
    costUsd,
    modelUsed: "Frontier LLM (GPT-4o / Claude 3.5 Sonnet)",
    rankedChunks,
    response: dataset.generatedAnswer,
    traceSteps: [
      { node: "User Query", detail: `Inbound prompt with ${rawTokens.toLocaleString()} token corpus attached.`, time: "0ms" },
      { node: "Semantic Cache", detail: "Similarity: 0.76 (Below 0.94 threshold) -> Cache Miss.", time: "14ms" },
      { node: "Hybrid Vector Search", detail: `BM25 + Dense retrieval filtered down to ${candidateTokens.toLocaleString()} tokens (Top 12 candidates).`, time: "140ms" },
      { node: "Cross-Encoder Reranker", detail: `Re-scored semantic relevance: Kept top-${topKCount} highest scoring chunks (${rerankedTokens.toLocaleString()} tokens).`, time: `${140 + topKCount * 30}ms` },
      { node: "LLMLingua Token Compression", detail: `Pruned syntactic redundancy by ${compressionPercent}% -> Final prompt: ${compressedTokens.toLocaleString()} tokens.`, time: `${180 + topKCount * 40}ms` },
      { node: "Frontier LLM Generation", detail: `Grounding completed without 'Lost in the Middle' distraction. Output generated in ${latencyMs}ms.`, time: `${latencyMs}ms` }
    ]
  };
}

// 4. Live Dynamic Model Router Simulation Function
export const PRESET_ROUTER_PROMPTS = [
  {
    id: "p1",
    label: "Simple Ticket Classification",
    prompt: "Classify this customer support ticket into: Billing, Technical, or Cancellation.",
    complexity: 0.14,
    reason: "Direct lexical categorization with zero multi-hop deduction.",
    routedTo: "Small/Fast Model (Claude 3.5 Haiku / Llama-3.2-3B)",
    cost: "$0.00012",
    latency: "110ms",
    baselineCost: "$0.00350"
  },
  {
    id: "p2",
    label: "Regex & Structured Extraction",
    prompt: "Extract all VAT tax ID numbers and total Euro amounts into a valid JSON array.",
    complexity: 0.28,
    reason: "Syntactic pattern extraction with predefined output schema.",
    routedTo: "Small/Fast Model (Claude 3.5 Haiku / Llama-3.2-3B)",
    cost: "$0.00028",
    latency: "185ms",
    baselineCost: "$0.00520"
  },
  {
    id: "p3",
    label: "Cross-Border Regulatory Compliance",
    prompt: "Analyze whether our GDPR data transfer mechanism complies with EU-US Data Privacy Framework Adequacy Decisions, cross-referencing Schrems II jurisprudence.",
    complexity: 0.94,
    reason: "Multi-hop legal reasoning, jurisprudential precedence, and high liability risk.",
    routedTo: "Large/Reasoning Model (GPT-4o / Claude 3.5 Sonnet)",
    cost: "$0.00480",
    latency: "1,240ms",
    baselineCost: "$0.00480"
  },
  {
    id: "p4",
    label: "Complex Code Refactoring & Security Audit",
    prompt: "Refactor this distributed lock manager to eliminate race conditions under split-brain network partitions using Raft consensus.",
    complexity: 0.88,
    reason: "Algorithmic state machine reasoning and high concurrency edge cases.",
    routedTo: "Large/Reasoning Model (GPT-4o / Claude 3.5 Sonnet)",
    cost: "$0.00420",
    latency: "1,150ms",
    baselineCost: "$0.00420"
  }
];

export function RUN_DYNAMIC_ROUTER_SIMULATION(selectedPromptId) {
  const item = PRESET_ROUTER_PROMPTS.find(p => p.id === selectedPromptId) || PRESET_ROUTER_PROMPTS[0];
  const isHighComplexity = item.complexity >= 0.50;

  return {
    prompt: item.prompt,
    complexityScore: item.complexity,
    isHighComplexity,
    classificationReason: item.reason,
    targetModel: item.routedTo,
    latency: item.latency,
    cost: item.cost,
    baselineCost: item.baselineCost,
    savingsPct: isHighComplexity ? "0% (Reasoning Essential)" : "96.5% Cost Reduction vs Frontier"
  };
}

// 5. Live Map-Reduce Document Engine Simulator Function
export function RUN_MAP_REDUCE_SIMULATION(partitionCount) {
  const partitions = [];
  const baseTokensPerChunk = Math.round(280000 / partitionCount);

  const topics = [
    { title: "Liability & Indemnity Caps", finding: "Aggregate cap $5M; data breach super-cap $15M" },
    { title: "GDPR & Data Security Provisions", finding: "Mandatory 72-hr notification; EU standard contractual clauses" },
    { title: "SLA Uptime & Service Credits", finding: "99.9% uptime requirement with 15% monthly bill credit remedy" },
    { title: "Intellectual Property & Licensing", finding: "Customer retains all derivative model IP and embedding data" },
    { title: "Termination for Convenience", finding: "30-day written notice; $50k early exit transition fee" },
    { title: "Audit & Regulatory Inspection", finding: "Annual SOC2 Type II audit rights granted with 14-day notice" }
  ];

  for (let i = 0; i < partitionCount; i++) {
    const topic = topics[i % topics.length];
    partitions.push({
      partitionId: `P-${i + 1}`,
      title: `Chunk ${i + 1}: ${topic.title}`,
      tokenCount: baseTokensPerChunk + ((i % 3) * 1200),
      workerModel: "Parallel Worker (Llama-3-8B)",
      status: "Mapped (200 OK)",
      extractedJson: {
        section: topic.title,
        extractedKeyFact: topic.finding,
        confidence: 0.98
      }
    });
  }

  return {
    totalCorpusTokens: 280000,
    partitionCount,
    partitions,
    reduceSynthesis: {
      inputTokensToReducer: partitionCount * 450, // Only 1,800 tokens to master LLM
      reducerModel: "Master Synthesis LLM (GPT-4o / Claude 3.5 Sonnet)",
      overallRisk: "MEDIUM-BALANCED",
      summary: `Synthesized findings across all ${partitionCount} parallel document chunks. Overall liability exposure is capped at $15M for cyber incidents, with full IP ownership retained by Customer and 99.9% SLA guarantees.`
    }
  };
}

// 6. Organization Token FinOps Savings Calculator
export function CALCULATE_ENTERPRISE_SAVINGS(monthlyRequests, avgRawTokens, cacheHitRate, smallModelRouteRate) {
  const baselineCostPerReq = (avgRawTokens / 1_000_000) * 5.00 + (800 / 1_000_000) * 15.00;
  const baselineMonthlyCost = monthlyRequests * baselineCostPerReq;

  const cachedCount = monthlyRequests * (cacheHitRate / 100);
  const cacheCost = cachedCount * 0.0001;

  const uncachedCount = monthlyRequests - cachedCount;
  const smallModelCount = uncachedCount * (smallModelRouteRate / 100);
  const frontierCount = uncachedCount - smallModelCount;

  const compressedTokens = avgRawTokens * 0.10; // 90% token reduction via RAG + compression

  const smallModelCost = smallModelCount * ((compressedTokens / 1_000_000) * 0.25 + (400 / 1_000_000) * 1.25);
  const frontierCost = frontierCount * ((compressedTokens / 1_000_000) * 5.00 + (800 / 1_000_000) * 15.00);

  const optimizedMonthlyCost = cacheCost + smallModelCost + frontierCost;
  const monthlySavings = baselineMonthlyCost - optimizedMonthlyCost;
  const savingsPercent = Math.max(0, ((monthlySavings / baselineMonthlyCost) * 100)).toFixed(1);
  const annualSavings = monthlySavings * 12;

  return {
    baselineMonthlyCost: baselineMonthlyCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    optimizedMonthlyCost: optimizedMonthlyCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    monthlySavings: monthlySavings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    annualSavings: annualSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    savingsPercent,
    cachedRequests: cachedCount.toLocaleString('en-US'),
    smallRoutedRequests: smallModelCount.toLocaleString('en-US'),
    frontierRoutedRequests: frontierCount.toLocaleString('en-US')
  };
}

// 7. Cost-Benefit Analysis Matrix
export const COST_BENEFIT_MATRIX = [
  {
    strategy: "Semantic Cache",
    effort: "Low",
    tokenSavings: "20 - 40%",
    accuracyImpact: "None (Exact/Cosine match)",
    timeToProduction: "1 - 2 weeks",
    techStack: "Redis Vector Store, Qdrant, LiteLLM",
    capexOpex: "$50 - $200 / mo Redis instance",
    keyRisk: "Stale cache invalidation"
  },
  {
    strategy: "Reranking (Cross-Encoder)",
    effort: "Medium",
    tokenSavings: "30 - 50%",
    accuracyImpact: "+15 - 25% (Higher MRR / NDCG)",
    timeToProduction: "2 - 3 weeks",
    techStack: "Cohere Rerank v3, BGE-Reranker, FlashRank",
    capexOpex: "$1.00 / 1k queries or self-hosted GPU",
    keyRisk: "Added 80-180ms P95 latency"
  },
  {
    strategy: "Dynamic Routing (Classifier)",
    effort: "High",
    tokenSavings: "40 - 70%",
    accuracyImpact: "+5 - 10% (SLA specialized models)",
    timeToProduction: "4 - 6 weeks",
    techStack: "Llama-3-8B / Haiku classifier, LiteLLM router",
    capexOpex: "$0.05 / 1M classification tokens",
    keyRisk: "Misclassification on edge-case queries"
  },
  {
    strategy: "Map-Reduce Long Doc Pattern",
    effort: "Medium",
    tokenSavings: "60 - 85% (vs raw full-prompt)",
    accuracyImpact: "+20 - 30% (Zero context truncation)",
    timeToProduction: "3 - 4 weeks",
    techStack: "LangChain / Celery / Ray parallel workers",
    capexOpex: "Worker SLM concurrency costs",
    keyRisk: "Intermediate JSON schema drift"
  },
  {
    strategy: "Prompt Compression (LLMLingua)",
    effort: "Low",
    tokenSavings: "30 - 60%",
    accuracyImpact: "99.2% accuracy retention",
    timeToProduction: "1 - 2 weeks",
    techStack: "LLMLingua-2, ONNX Runtime, HuggingFace",
    capexOpex: "Minimal CPU overhead (~20ms)",
    keyRisk: "Pruning rare domain acronyms"
  }
];

// 8. Model Window & Context Engineering Comparison
export const MODEL_WINDOW_COMPARISON = [
  {
    model: "Claude 3.5 Sonnet / Opus",
    windowSize: "200,000 Tokens",
    inputPrice: "$3.00 / $15.00 per M",
    outputPrice: "$15.00 / $75.00 per M",
    recallAt90Depth: "98.5%",
    effectiveWorkingMemory: "120,000 Tokens",
    bestWorkload: "Complex multi-file code editing, legal synthesis, long-horizon tool agents",
    degradationWarning: "Attention softens beyond 150k tokens if queries lack clear grounding anchors."
  },
  {
    model: "GPT-4o / GPT-4 Turbo",
    windowSize: "128,000 Tokens",
    inputPrice: "$2.50 / $5.00 per M",
    outputPrice: "$10.00 / $15.00 per M",
    recallAt90Depth: "96.2%",
    effectiveWorkingMemory: "80,000 Tokens",
    bestWorkload: "Structured JSON schema output, high-speed API workflows, function calling",
    degradationWarning: "U-shaped attention dip in the 40-70% middle range for unstructured text."
  },
  {
    model: "Gemini 1.5 Pro / Flash",
    windowSize: "1,000,000 - 2,000,000 Tokens",
    inputPrice: "$1.25 / $3.50 per M",
    outputPrice: "$5.00 / $10.50 per M",
    recallAt90Depth: "99.1% (Multimodal Needle)",
    effectiveWorkingMemory: "800,000 Tokens",
    bestWorkload: "1-hour video ingestion, multi-year audio transcripts, whole-codebase audits",
    degradationWarning: "High prompt caching recommended; single raw 1M call incurs $3.50+ and 8-15s latency."
  },
  {
    model: "Llama 3.1 70B / 8B (Self-Hosted)",
    windowSize: "128,000 Tokens",
    inputPrice: "$0.15 - $0.60 per M",
    outputPrice: "$0.60 - $1.80 per M",
    recallAt90Depth: "94.0%",
    effectiveWorkingMemory: "64,000 Tokens",
    bestWorkload: "Air-gapped on-premise RAG, PII sanitization, internal classification router",
    degradationWarning: "Requires RoPE frequency scaling tuning on vLLM/TGI for stable 128k execution."
  }
];

// 9. Vector Database Vendor Evaluation Checklist
export const VECTOR_DB_EVALUATION = [
  {
    vendor: "Qdrant",
    hosting: "Managed Cloud or Self-Hosted Docker / K8s",
    hybridSearch: "Native BM25 Sparse + Dense Vector fusion",
    filteringSpeed: "Ultra-Fast (Rust HNSW + Payload Indexing)",
    costProfile: "Open-source free self-host; Cloud from $25/mo",
    compliance: "SOC2 Type II, HIPAA, ISO27001, GDPR",
    verdict: "Top choice for enterprise hybrid search, custom metadata filters, and low memory overhead."
  },
  {
    vendor: "Pinecone",
    hosting: "Fully Managed Serverless SaaS (AWS/GCP/Azure)",
    hybridSearch: "Sparse-Dense vectors via Pinecone Serverless",
    filteringSpeed: "High (Metadata filtering at index layer)",
    costProfile: "Serverless pay-per-read/write ($0.33/1M RUs)",
    compliance: "SOC2 Type II, HIPAA eligible, GDPR",
    verdict: "Best for zero-ops managed scaling with predictable burst read/write workloads."
  },
  {
    vendor: "Weaviate",
    hosting: "Managed Cloud, BYOC, or Self-Hosted K8s",
    hybridSearch: "Native Hybrid BM25 + Vector + GraphQL API",
    filteringSpeed: "High (Inverted Index + Vector HNSW)",
    costProfile: "Open-source free; Cloud from $0.085/hr cluster",
    compliance: "SOC2 Type II, HIPAA, GDPR",
    verdict: "Excellent for multi-modal vector search and complex graph-like object relationships."
  },
  {
    vendor: "PostgreSQL + pgvector",
    hosting: "AWS RDS / Supabase / Neon / Self-Hosted Postgres",
    hybridSearch: "Full-text search (tsvector) + HNSW pgvector",
    filteringSpeed: "Medium (Standard SQL WHERE + HNSW index)",
    costProfile: "Zero additional database infrastructure cost",
    compliance: "Inherits enterprise Postgres compliance",
    verdict: "Ideal for teams with existing Postgres infrastructure wanting unified ACID relational + vector storage."
  }
];

// 10. Performance Benchmarks: Reranking Models Compared
export const RERANKER_BENCHMARKS = [
  {
    model: "Cohere Rerank v3",
    latencyP50: "95ms",
    latencyP95: "160ms",
    ndcg10: "0.892",
    maxTokens: "4,096 tokens / doc",
    type: "Managed API (Cloud / Private VPC)",
    cost: "$1.00 / 1,000 queries",
    bestFor: "Enterprise multilingual accuracy and long-chunk document reranking"
  },
  {
    model: "BGE-Reranker-Large (BAAI)",
    latencyP50: "120ms (GPU)",
    latencyP95: "210ms (GPU)",
    ndcg10: "0.884",
    maxTokens: "512 tokens / doc",
    type: "Self-Hosted HuggingFace (PyTorch/Triton)",
    cost: "Compute GPU cost ($0.40/hr)",
    bestFor: "Air-gapped on-premise deployments with strict data sovereignty"
  },
  {
    model: "Cross-Encoder/ms-marco-MiniLM-L-6-v2",
    latencyP50: "35ms (CPU)",
    latencyP95: "70ms (CPU)",
    ndcg10: "0.841",
    maxTokens: "512 tokens / doc",
    type: "Self-Hosted Lightweight CPU / ONNX",
    cost: "Negligible (Runs on worker CPU)",
    bestFor: "Ultra-low latency microservices with high queries-per-second (QPS)"
  },
  {
    model: "FlashRank (Pruned MiniLM)",
    latencyP50: "18ms (CPU)",
    latencyP95: "40ms (CPU)",
    ndcg10: "0.825",
    maxTokens: "512 tokens / doc",
    type: "In-Process Python / Node.js Engine",
    cost: "$0 (Zero extra API calls or GPU)",
    bestFor: "Edge devices, local CLI tools, and sub-50ms latency SLAs"
  }
];

// 11. Security & Compliance Data Handling Patterns
export const SECURITY_COMPLIANCE_PATTERNS = [
  {
    title: "1. Client-Side PII/PHI Redaction Before Embedding",
    pattern: "Named Entity Recognition (NER) + Regular Expression token anonymization",
    benefit: "Guarantees that sensitive credit cards, SSNs, and patient names are never written to vector embeddings.",
    implementation: "Microsoft Presidio or SpaCy pipeline replacing PII with salted synthetic tokens `<CUSTOMER_UUID_78>`."
  },
  {
    title: "2. Tenant Namespace Partitioning in Vector Indices",
    pattern: "Cryptographic tenant isolation with strict metadata ACL filtering",
    benefit: "Prevents cross-tenant information leakage in multi-tenant SaaS environments.",
    implementation: "Qdrant payload filter `tenant_id: 'org_982'` enforced at the API gateway layer before vector distance calculation."
  },
  {
    title: "3. Chunk-Level Access Control Lists (ACLs)",
    pattern: "Synchronized IAM permission bitmaps attached to individual chunk payloads",
    benefit: "Ensures an executive-only confidential financial slide is invisible to unauthorized employees during RAG.",
    implementation: "Filter vector search with `user_groups OVERLAPS chunk.allowed_groups` during dense index retrieval."
  },
  {
    title: "4. Ephemeral Worker Sandbox Execution",
    pattern: "Stateless container workers with zero local disk persistence",
    benefit: "Complies with GDPR right-to-be-forgotten and prevents residual data leakage in temporary file caches.",
    implementation: "Docker worker containers spawned with `read_only: true` root filesystems and in-memory tmpfs."
  }
];

// 12. Pre-Flight Token Estimation & Safe Truncation Simulator
export function RUN_PREFLIGHT_TOKEN_SIMULATION(userPrompt, retrievedContext, maxAllowedTokens) {
  // Approximate cl100k_base tokenizer (average 3.8 chars per token for English text & code)
  const estimateTokens = (text) => Math.max(1, Math.ceil((text || '').trim().length / 3.8));

  const promptTokens = estimateTokens(userPrompt);
  const contextTokens = estimateTokens(retrievedContext);
  const totalRawTokens = promptTokens + contextTokens;

  let warningMessage = "";
  let finalContext = retrievedContext;
  let truncationApplied = false;
  let tokensTruncated = 0;

  if (totalRawTokens > maxAllowedTokens) {
    truncationApplied = true;
    const overflowTokens = totalRawTokens - maxAllowedTokens;
    tokensTruncated = overflowTokens;
    
    // Calculate characters to keep from the end of the context
    const keepFraction = Math.max(0.1, 1 - (overflowTokens / Math.max(1, contextTokens)));
    const contextCharsToKeep = Math.floor(retrievedContext.length * keepFraction);
    
    finalContext = retrievedContext.slice(-contextCharsToKeep);
    warningMessage = `[SYSTEM NOTICE: Input payload exceeded ${maxAllowedTokens.toLocaleString()} token safety threshold. Older context was dynamically truncated to prevent context overflow crash.]`;
  }

  const safePayload = warningMessage 
    ? `${warningMessage}\n\n=== RETAINED CONTEXT ===\n${finalContext}\n\n=== USER QUERY ===\n${userPrompt}`
    : `=== CONTEXT ===\n${finalContext}\n\n=== USER QUERY ===\n${userPrompt}`;

  const finalTokens = estimateTokens(safePayload);

  return {
    promptTokens,
    contextTokens,
    totalRawTokens,
    maxAllowedTokens,
    truncationApplied,
    tokensTruncated,
    warningMessage,
    finalContext,
    safePayload,
    finalTokens,
    safetyStatus: finalTokens <= maxAllowedTokens ? "SAFE_ENFORCED" : "TRUNCATED_MAX"
  };
}

// 13. Advanced Chunking Strategies
export const ADVANCED_CHUNKING_STRATEGIES = [
  {
    id: "parent_child",
    title: "1. Parent-Child (Auto-Merging) Chunking",
    bestFor: "Complex documents, technical manuals, and legal contracts",
    howItWorks: "Creates two sets of chunks: small Child chunks (200 tokens) strictly for vector indexing and pinpoint retrieval, plus larger Parent chunks (1000 tokens) passed to the LLM upon child retrieval.",
    whyItWins: "Pinpoint vector search accuracy combined with full surrounding semantic context to completely prevent fragmented hallucinations.",
    tools: "LlamaIndex AutoMergingRetriever / LangChain ParentDocumentRetriever",
    badge: "Most Popular in Enterprise"
  },
  {
    id: "semantic_chunking",
    title: "2. Semantic Chunking (Cosine Shift)",
    bestFor: "Long-form text, research articles, and unstructured reports",
    howItWorks: "Calculates embedding cosine distance between consecutive sentences. A new chunk boundary is triggered dynamically when semantic distance exceeds threshold (topic shift).",
    whyItWins: "Guarantees a coherent single thought or analytical paragraph is never artificially severed across token boundaries.",
    tools: "LangChain SemanticChunker / LlamaIndex SentenceWindowNodeParser",
    badge: "100% Meaning Preserved"
  },
  {
    id: "structural_chunking",
    title: "3. Structural / Document-Aware Chunking",
    bestFor: "PDFs, HTML web pages, financial filings, and Markdown docs",
    howItWorks: "Uses AST and layout analysis (Markdown headers #/##, HTML tables <table>, PDF layout bounding boxes) to define boundaries. Crucial rule: Never split a table or list.",
    whyItWins: "Maintains relational schema integrity and tabular context without breaking headers from data rows.",
    tools: "Unstructured.io / LlamaParse / AWS Textract",
    badge: "Essential for Tables & PDFs"
  },
  {
    id: "sliding_window",
    title: "4. Sliding Window with Overlap (Baseline)",
    bestFor: "General-purpose text, quick MVP implementations",
    howItWorks: "Fixed chunk window of 512 to 1024 tokens with 10% to 20% overlap (50-100 tokens) between consecutive chunks.",
    whyItWins: "Prevents critical keywords or sentences sitting on exact boundary splits from being lost during dense retrieval.",
    tools: "RecursiveCharacterTextSplitter",
    badge: "Baseline Standard"
  }
];

// 14. Enterprise Prompt Templates
export const ENTERPRISE_PROMPT_TEMPLATES = [
  {
    id: "strict_qa",
    title: "Template 1: Strict Zero-Hallucination Q&A",
    useCase: "Customer support, internal compliance knowledge bases, legal lookups",
    promptText: `You are an expert AI assistant for [Company Name]. Your task is to answer the user's question using ONLY the provided context. 

### RULES:
1. STRICTLY use only the provided context. Do not use your pre-existing knowledge.
2. If the answer is not explicitly stated in the context, you MUST reply: "I do not have enough information in the provided documents to answer this question."
3. You must cite your sources using bracketed numbers corresponding to the source document (e.g., [1], [2]).
4. Do not make up facts, figures, or policies.

### CONTEXT:
{context}

### USER QUESTION:
{question}

### ANSWER:`
  },
  {
    id: "multi_source",
    title: "Template 2: Multi-Source Synthesis & Conflict Resolution",
    useCase: "Conflicting policies, version migrations, cross-departmental documentation",
    promptText: `You are an analytical AI assistant. You have been provided with multiple excerpts from different documents to answer a user's question.

### INSTRUCTIONS:
1. Analyze all provided context blocks.
2. If the sources agree, synthesize a comprehensive answer.
3. If the sources conflict, explicitly state the conflict, identify which source is more recent (if dates are provided), and provide the answer based on the most current/authoritative source.
4. If the context does not contain the answer, state clearly what information is missing.
5. Always append a "Sources:" section at the end listing the titles of the documents used.

### CONTEXT BLOCKS:
{context}

### USER QUESTION:
{question}

### SYNTHESIZED ANSWER:`
  },
  {
    id: "query_decomp",
    title: "Template 3: Pre-Retrieval Query Decomposition",
    useCase: "Multi-part questions, comparative research, complex cross-topic user queries",
    promptText: `You are a query decomposition engine. Your goal is to break down a complex user question into 2-4 simple, standalone search queries that can be used to retrieve relevant documents from a vector database.

### RULES:
1. Output ONLY the search queries, one per line.
2. Do not include introductory text or explanations.
3. Ensure each query is self-contained and makes sense without the original question.

### ORIGINAL QUESTION:
{question}

### SEARCH QUERIES:`
  }
];

// 15. RAG Accuracy Operational Pro-Tips
export const RAG_ACCURACY_PRO_TIPS = [
  {
    title: "1. Enforce Metadata Filtering (Pre-Filtering)",
    icon: "🏷️",
    problem: "Vector similarity alone returns outdated 2022 policy instead of 2024 because semantics match.",
    solution: "Extract structured metadata (year, tenant, dept) before search and pass payload filters `db.search(query, filter={'year': 2024, 'dept': 'HR'})` to eliminate 90% of irrelevant candidates."
  },
  {
    title: "2. Implement 'Self-Querying' for Ambiguity",
    icon: "❓",
    problem: "Vague prompts ('Tell me about the project') waste vector and LLM tokens on hallucinated guesses.",
    solution: "Use a lightweight SLM classifier before retrieval to verify required entities (project name, date). If missing, intercept and prompt user for clarification before searching."
  },
  {
    title: "3. 'Lost in the Middle' Attention Mitigation",
    icon: "🎯",
    problem: "LLMs attend heavily to the top 10% and bottom 10% of prompts, dropping recall for evidence placed in the middle.",
    solution: "Sort retrieved context chunks by relevance score in a U-shape: Rank 1 at prompt Top, Rank 2 at prompt Bottom, and lower ranks in the middle."
  }
];

// 16. Fallback Scenarios & Multi-Tier Cascade Simulator
export const FALLBACK_SCENARIOS = [
  {
    id: "standard_payload",
    title: "Scenario 1: Normal Safe Payload (< 4,000 tokens)",
    description: "Input payload is within safe context bounds. Proceeds directly via Green Path to Tier-1 Primary LLM.",
    incomingTokens: 850,
    maxThreshold: 4000,
    expectedPath: "GREEN_PATH",
    primaryModel: "OpenAI GPT-4o",
    failoverTriggered: false
  },
  {
    id: "moderate_overflow",
    title: "Scenario 2: Moderate Overflow (4,920 tokens)",
    description: "Exceeds 4k limit by 23%. Triggers Amber Path: automated tail context truncation & LLMLingua compression.",
    incomingTokens: 4920,
    maxThreshold: 4000,
    expectedPath: "AMBER_PATH",
    primaryModel: "OpenAI GPT-4o (with [SYSTEM NOTICE])",
    failoverTriggered: false
  },
  {
    id: "massive_spillover",
    title: "Scenario 3: Severe Overload (38,500 tokens)",
    description: "Exceeds threshold by 9.6x. Red Path trips circuit breaker and orchestrates Distributed Map-Reduce fallback.",
    incomingTokens: 38500,
    maxThreshold: 4000,
    expectedPath: "RED_PATH_MAPREDUCE",
    primaryModel: "Map-Reduce Workers (Llama-3-8B) -> Master Reducer",
    failoverTriggered: true
  },
  {
    id: "provider_429_outage",
    title: "Scenario 4: Provider Outage / HTTP 429 Rate Limit",
    description: "Primary provider fails or returns 429 quota exhaustion. Circuit breaker trips and seamlessly fails over to AWS Bedrock Claude 3.5 Sonnet.",
    incomingTokens: 1850,
    maxThreshold: 4000,
    expectedPath: "TIER2_BEDROCK_FAILOVER",
    primaryModel: "Anthropic Claude 3.5 Sonnet (AWS Bedrock)",
    failoverTriggered: true
  },
  {
    id: "complete_cloud_outage",
    title: "Scenario 5: Multi-Cloud WAN Partition / Disaster",
    description: "Both Azure and AWS Bedrock APIs are unreachable. Automatic Tier-3 failover to on-premise local vLLM Llama 3.1 70B.",
    incomingTokens: 1400,
    maxThreshold: 4000,
    expectedPath: "TIER3_LOCAL_VLLM_FAILOVER",
    primaryModel: "Local On-Prem vLLM (Llama 3.1 70B)",
    failoverTriggered: true
  }
];

export function RUN_FALLBACK_CASCADE_SIMULATION(scenarioId, manualCircuitTrip = false) {
  const scenario = FALLBACK_SCENARIOS.find(s => s.id === scenarioId) || FALLBACK_SCENARIOS[0];

  let circuitBreakerStatus = manualCircuitTrip ? "OPEN (TRIPPED)" : "CLOSED (HEALTHY)";
  let activePath = scenario.expectedPath;
  let activeProvider = scenario.primaryModel;
  let latencyMs = 180;
  let deliveryStatus = "200 OK (Delivered)";
  let traceSteps = [];

  // Step 1: Pre-Flight Token Ingestion
  traceSteps.push({
    node: "Pre-Flight Token Estimator",
    detail: `Estimated payload at ${scenario.incomingTokens.toLocaleString()} tokens against max limit of ${scenario.maxThreshold.toLocaleString()} tokens.`,
    time: "1.2ms",
    status: "PASS"
  });

  if (scenarioId === "standard_payload" && !manualCircuitTrip) {
    activePath = "GREEN_PATH";
    activeProvider = "Tier-1: OpenAI GPT-4o";
    latencyMs = 210;
    traceSteps.push({
      node: "Safety Threshold Gate",
      detail: "Payload within safe 80% boundary. Proceeding via Green Path to Primary Model.",
      time: "2.1ms",
      status: "GREEN"
    });
    traceSteps.push({
      node: "Primary Inference",
      detail: "OpenAI GPT-4o responded with full grounded answer.",
      time: "208ms",
      status: "SUCCESS"
    });
  } else if (scenarioId === "moderate_overflow" && !manualCircuitTrip) {
    activePath = "AMBER_PATH";
    activeProvider = "Tier-1: OpenAI GPT-4o (Truncated Payload)";
    latencyMs = 245;
    const truncatedTokens = scenario.incomingTokens - scenario.maxThreshold;
    traceSteps.push({
      node: "Safety Threshold Gate",
      detail: `Overflow detected (+${truncatedTokens} tokens). Triggering Amber Path graceful degradation.`,
      time: "3.5ms",
      status: "AMBER"
    });
    traceSteps.push({
      node: "Auto-Truncation & System Notice",
      detail: "Sliced older context tail; injected '[SYSTEM NOTICE: Input exceeded 4,000 token limit]'.",
      time: "5.1ms",
      status: "PROCESSED"
    });
    traceSteps.push({
      node: "Primary Inference",
      detail: "OpenAI GPT-4o completed inference on safe 3,950-token payload.",
      time: "238ms",
      status: "SUCCESS"
    });
  } else if (scenarioId === "massive_spillover" && !manualCircuitTrip) {
    activePath = "RED_PATH_MAPREDUCE";
    activeProvider = "Distributed Map-Reduce Cluster (4x SLM Workers + Master LLM)";
    circuitBreakerStatus = "OPEN (DEVIATED)";
    latencyMs = 620;
    traceSteps.push({
      node: "Safety Threshold Gate",
      detail: "Massive 38,500 token payload detected (>9x safe threshold). Direct prompt rejected.",
      time: "2.8ms",
      status: "CIRCUIT_TRIP"
    });
    traceSteps.push({
      node: "Map-Reduce Orchestrator",
      detail: "Partitioned corpus into 8x 4.8k token chunks across concurrent Llama-3-8B workers.",
      time: "320ms",
      status: "PARALLEL_MAP"
    });
    traceSteps.push({
      node: "Master Synthesis Reduce",
      detail: "Combined 8 intermediate JSON schemas into unified executive compliance brief.",
      time: "298ms",
      status: "REDUCE_SUCCESS"
    });
  } else if (scenarioId === "provider_429_outage" || manualCircuitTrip) {
    activePath = "TIER2_BEDROCK_FAILOVER";
    activeProvider = "Tier-2 Failover: Anthropic Claude 3.5 Sonnet (AWS Bedrock)";
    circuitBreakerStatus = "OPEN (FAILOVER ACTIVE)";
    latencyMs = 380;
    traceSteps.push({
      node: "Primary Provider Gateway",
      detail: "OpenAI API returned HTTP 429 Too Many Requests (Rate Limit / Quota Spikes).",
      time: "45ms",
      status: "FAIL"
    });
    traceSteps.push({
      node: "Circuit Breaker Interceptor",
      detail: "Circuit breaker tripped. Zero error thrown to client. Instant failover triggered.",
      time: "48ms",
      status: "CIRCUIT_TRIPPED"
    });
    traceSteps.push({
      node: "Secondary Provider Failover",
      detail: "Routed payload to Anthropic Claude 3.5 Sonnet on AWS Bedrock with 200 OK delivery.",
      time: "332ms",
      status: "FAILOVER_SUCCESS"
    });
  } else if (scenarioId === "complete_cloud_outage") {
    activePath = "TIER3_LOCAL_VLLM_FAILOVER";
    activeProvider = "Tier-3 Fallback: Local On-Premise vLLM (Llama 3.1 70B)";
    circuitBreakerStatus = "OPEN (AIR-GAP MODE)";
    latencyMs = 120;
    traceSteps.push({
      node: "Multi-Cloud Health Probes",
      detail: "Azure OpenAI (Timeout > 5s) & AWS Bedrock (503 Service Unavailable).",
      time: "65ms",
      status: "FAIL"
    });
    traceSteps.push({
      node: "Air-Gapped Local Interceptor",
      detail: "Tripped disaster recovery failover to internal Kubernetes vLLM cluster.",
      time: "68ms",
      status: "AIR_GAP_ACTIVATED"
    });
    traceSteps.push({
      node: "On-Premises Inference",
      detail: "vLLM (Llama 3.1 70B) served request locally with zero external network dependency.",
      time: "52ms",
      status: "AIR_GAP_SUCCESS"
    });
  }

  return {
    scenario,
    circuitBreakerStatus,
    activePath,
    activeProvider,
    latencyMs,
    deliveryStatus,
    traceSteps,
    simulatedResponse: `[SUCCESS: ${activeProvider}] Processed ${scenario.incomingTokens.toLocaleString()} tokens via ${activePath}. Grounded output generated with zero user-facing error.`
  };
}

// 17. Hype Defense: five-layer value chain + triage + claim decoder

export const HYPE_VALUE_CHAIN = [
  { id: 'chips', layer: '1. Chips & hardware', role: 'Makers of accelerators and silicon capacity.' },
  { id: 'clouds', layer: '2. Clouds & labs', role: 'Providers of large-scale training and hosted inference.' },
  { id: 'platforms', layer: '3. Platforms', role: 'Gateways, vector stores, and evaluation tooling.' },
  { id: 'builders', layer: '4. Builders', role: 'Teams wiring models into products and workflows.' },
  { id: 'adopters', layer: '5. Adopters', role: 'End customers who must operate, pay for, and defend the outcome.' },
];

export const HYPE_CONSUMER_ODDS = [
  {
    id: 'illusion',
    name: 'Accessibility illusion',
    detail: 'A chat box looks like a finished product, so buyers mistake a demo for deployed capability.',
    stat: 'Industry surveys report most teams experiment while only a minority reaches production deployment.',
  },
  {
    id: 'lastmile',
    name: 'Last-mile gap',
    detail: 'Evaluation, access control, cost guardrails, and incident handling fall on the adopter, not the demo.',
    stat: 'Industry surveys report pilot win rates far above sustained production win rates.',
  },
  {
    id: 'paynow',
    name: 'Pay now vs prove later',
    detail: 'Contracts and usage meters start immediately while evidence of value arrives quarters later.',
    stat: 'Industry surveys report buyers paying full price before independent verification completes.',
  },
];

export const HYPE_FOUNDATIONS = [
  {
    id: 'math',
    name: 'Math first — or trusted secondhand',
    detail: 'Work the numbers yourself when you can; otherwise rely only on independently verifiable measurements.',
  },
  {
    id: 'systems',
    name: 'Systems thinking',
    detail: 'Judge the whole pipeline — retrieval, policy, cost, and operations — never the model call alone.',
  },
];

export const HYPE_CLAIM_DECODER = [
  { pattern: 'Benchmark on clean data', example: 'Scores 95% on a curated set', question: 'What happens on our messy inputs with duplicates and missing fields?' },
  { pattern: 'Survivor case study', example: 'One team saved a fortune', question: 'How many comparable teams tried and saw no gain?' },
  { pattern: 'Demo, not workflow', example: 'Watch it answer in seconds', question: 'Who handles approvals, errors, retries, and audit in production?' },
  { pattern: 'Rebranded old tool', example: 'All-new intelligence layer', question: 'What changed besides the label — model, data, eval, or only marketing?' },
  { pattern: 'Anthropomorphic headcount framing', example: 'Does the work of ten analysts', question: 'Which named tasks, at what error rate, with what human review cost?' },
];

export function triageHypeClaim({ isNew, isRelevant }) {
  if (isNew && isRelevant) {
    return { verdict: 'go-deep', nextStep: 'Reproduce on your data with an independent eval before committing.' };
  }
  if (!isNew && !isRelevant) {
    return { verdict: 'park', nextStep: 'File it away; revisit only if the use case changes.' };
  }
  return { verdict: 'revisit-with-evidence', nextStep: 'Ask for messy-data results or a production reference, then re-triage.' };
}


