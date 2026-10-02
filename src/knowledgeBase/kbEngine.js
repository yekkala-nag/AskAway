// ============================================================================
// EFFICIENT KNOWLEDGE BASE ENGINE FOR AI MODELS
// ============================================================================

export const TOP_10_SEED_QUESTIONS = [
  { id: "q1", category: "Auth", question: "How do I rotate API client secrets?", status: "VALIDATED" },
  { id: "q2", category: "Auth", question: "What is the maximum token lifetime?", status: "VALIDATED" },
  { id: "q3", category: "Billing", question: "How are enterprise overage rates calculated?", status: "VALIDATED" },
  { id: "q4", category: "Billing", question: "Where can I download consolidated VAT invoices?", status: "VALIDATED" },
  { id: "q5", category: "Architecture", question: "What is the failover SLA across multi-region clusters?", status: "VALIDATED" },
  { id: "q6", category: "Security", question: "How is data encrypted at rest and in transit?", status: "VALIDATED" },
  { id: "q7", category: "Compliance", question: "What is the data retention policy under GDPR?", status: "VALIDATED" },
  { id: "q8", category: "DevOps", question: "How do I configure Prometheus scraping for the agent gateway?", status: "VALIDATED" },
  { id: "q9", category: "Support", question: "What is the priority escalation matrix for P1 outages?", status: "VALIDATED" },
  { id: "q10", category: "API", question: "What HTTP headers are required for idempotency?", status: "VALIDATED" }
];

export const RAW_CORPUS_SAMPLES = [
  {
    id: "doc_01",
    title: "API Secret Rotation & Ingress Gateway v2.1",
    rawText: `API Gateway Documentation v2.1\n\nPage 1 of 12\n\nTo rotate API client secrets, navigate to Settings > Security > Credentials. Click 'Generate New Secret'. The old secret remains valid for a 24-hour grace period.\n\nLegal Notice: Confidential and proprietary to Enterprise Corp. Page 1 of 12.`,
    cleanedText: `To rotate API client secrets, navigate to Settings > Security > Credentials. Click 'Generate New Secret'. The old secret remains valid for a 24-hour grace period.`,
    boilerplateFound: ["Page 1 of 12", "Legal Notice: Confidential and proprietary to Enterprise Corp. Page 1 of 12."],
    isDuplicate: false,
    rbacRole: "Engineering"
  },
  {
    id: "doc_02",
    title: "Duplicate: API Secret Rotation Policy (Copy)",
    rawText: `To rotate client secrets, go to Settings > Security > Credentials and click 'Generate New Secret'. Old secret valid for 24h grace period.`,
    cleanedText: `To rotate client secrets, go to Settings > Security > Credentials and click 'Generate New Secret'. Old secret valid for 24h grace period.`,
    boilerplateFound: [],
    isDuplicate: true,
    duplicateOf: "doc_01",
    similarityScore: 0.96,
    rbacRole: "Engineering"
  },
  {
    id: "doc_03",
    title: "Executive Compensation & Equity Tranches",
    rawText: `Tier-1 Executive Board Equity Vesting Schedule: Tranche A vests on 36-month cliff with 25% annual distribution.`,
    cleanedText: `Tier-1 Executive Board Equity Vesting Schedule: Tranche A vests on 36-month cliff with 25% annual distribution.`,
    boilerplateFound: [],
    isDuplicate: false,
    rbacRole: "Executive / HR"
  }
];

export const INDEXING_STRATEGIES = [
  {
    id: "flat",
    name: "FLAT (Brute-Force L2/Cosine)",
    searchComplexity: "O(N)",
    indexBuildTime: "Instant (<1 sec)",
    recallAccuracy: "100.0%",
    memoryUsage: "Low (Raw vectors only)",
    latency100k: "45.0 ms",
    latency1M: "420.0 ms",
    bestFor: "Small Knowledge Bases (<10,000 chunks) where 100% exact recall is required."
  },
  {
    id: "ivf",
    name: "IVF (Inverted File Index with Voronoi Cells)",
    searchComplexity: "O(N / K)",
    indexBuildTime: "Fast (K-Means clustering)",
    recallAccuracy: "94.5% - 98.0%",
    memoryUsage: "Medium (Centroid lists)",
    latency100k: "8.2 ms",
    latency1M: "28.0 ms",
    bestFor: "Medium Knowledge Bases (10K - 1M chunks) balancing fast build times with sub-30ms search."
  },
  {
    id: "hnsw",
    name: "HNSW (Hierarchical Navigable Small World Graph)",
    searchComplexity: "O(log N)",
    indexBuildTime: "Slower (Multi-layer graph construction)",
    recallAccuracy: "99.2% - 99.8%",
    memoryUsage: "High (+1.5x to 2x for graph edges)",
    latency100k: "1.8 ms",
    latency1M: "4.5 ms",
    bestFor: "Enterprise Scale (1M - 100M+ chunks) requiring ultra-low latency (<5ms) and 99%+ recall."
  }
];

export const LIFECYCLE_STAGES = [
  {
    stage: 1,
    title: "Top-10 Core FAQ Seeding",
    icon: "🌱",
    summary: "Identify and cleanly document the 10 most critical domain questions before expanding scale.",
    deliverable: "Golden validation dataset with baseline answers."
  },
  {
    stage: 2,
    title: "Cleansing & Deduplication Engine",
    icon: "🧹",
    summary: "Strip headers, footers, navigation crumbs, and merge semantic near-duplicates (>92% similarity).",
    deliverable: "15–30% reduced index bloat and zero duplicate retrieval collisions."
  },
  {
    stage: 3,
    title: "Atomic Semantic Chunking & RBAC Tagging",
    icon: "🔒",
    summary: "Chunk by single coherent concept + attach strict role-based access control (Admin, Engineering, Public).",
    deliverable: "Context-contained chunks with deterministic security boundaries."
  },
  {
    stage: 4,
    title: "Vector Index Selection (Flat vs IVF vs HNSW)",
    icon: "⚡",
    summary: "Select optimal indexing topology matching corpus scale and query latency SLAs.",
    deliverable: "Sub-5ms search latency with >99% recall."
  },
  {
    stage: 5,
    title: "Continuous Evaluation Loop & Freshness TTLs",
    icon: "⏳",
    summary: "Track query failure telemetry, auto-expire deprecated policies, and re-embed updated documentation.",
    deliverable: "Self-healing, fresh, hallucination-free knowledge base."
  }
];
