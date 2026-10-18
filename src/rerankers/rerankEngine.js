// ============================================================================
// RERANKERS + LATE INTERACTION ENGINE
// Cross-encoder, Cohere/bge, RankGPT, ColBERT, HyDE, query expansion
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const RERANKER_TABLE = [
  { method: "Cross-encoder (bge-reranker, MiniLM)", how: "Joint query+doc scoring, top-50 → top-5", cost: "$$", gain: "+10–20% precision", use: "Default production upgrade" },
  { method: "API reranker (Cohere)", how: "Hosted scoring, multilingual", cost: "$$$", gain: "+12–25%", use: "Multilingual / no-GPU teams" },
  { method: "RankGPT (LLM listwise)", how: "LLM orders candidates with reasoning", cost: "$$$$", gain: "+15–30% (small sets)", use: "High-stakes ≤20 candidates" },
  { method: "ColBERT late interaction", how: "Token-level MaxSim, no joint encode", cost: "$$ (index heavy)", gain: "+8–18% + fine matches", use: "Term-heavy / long docs" },
  { method: "HyDE (hypothetical doc)", how: "LLM drafts answer → embed draft → retrieve", cost: "$$", gain: "+recall on vague queries", use: "Vocabulary-mismatch queries" }
];

export const QUERY_REWRITES = [
  { pattern: "Expand synonyms", example: "'refund window' → + 'return period, reimbursement term'", when: "Vocabulary drift" },
  { pattern: "Decompose multi-hop", example: "'X for CA in 2024?' → [filter CA] + [year 2024] + [concept X]", when: "Scoped questions" },
  { pattern: "HyDE draft", example: "Draft plausible answer, retrieve with its embedding", when: "Short / vague queries" },
  { pattern: "Step-back abstraction", example: "Ask general principle, then specific", when: "Reasoning queries" }
];

// ── Simulator: rerank a candidate list ──────────────────────────────────────
const CANDIDATES = [
  { id: "c1", text: "Refund window definitions and policy scope", bi: 0.81, cross: 0.93 },
  { id: "c2", text: "Unrelated HR onboarding checklist", bi: 0.77, cross: 0.12 },
  { id: "c3", text: "Return period and reimbursement terms FAQ", bi: 0.62, cross: 0.88 },
  { id: "c4", text: "Office holiday calendar 2024", bi: 0.71, cross: 0.05 },
  { id: "c5", text: "Amendment to refund window 30d → 14d", bi: 0.58, cross: 0.95 },
  { id: "c6", text: "Cafeteria menu and catering policy", bi: 0.66, cross: 0.08 }
];

export const RERANK = (mode = "cross", k = 3) => {
  const key = mode === "cross" ? "cross" : "bi";
  const ranked = [...CANDIDATES].sort((a, b) => b[key] - a[key]).slice(0, k);
  const rel = new Set(["c1", "c3", "c5"]);
  const prec = ranked.filter(c => rel.has(c.id)).length / ranked.length;
  return {
    mode: mode === "cross" ? "Cross-encoder rerank (top-50 → top-k)" : "Bi-encoder only (no rerank)",
    ranked, precision: +prec.toFixed(2),
    note: mode === "cross" ? "c5 (0.58 bi → 0.95 cross) rescued; distractors c2/c4 buried." : "Distractors c2/c4 outrank true c3/c5 — this is why you rerank."
  };
};

export const PYTHON_RERANK_CODE = `# ============================================================================
# RERANK PIPELINE: bi-encoder recall -> cross-encoder / ColBERT / RankGPT
# ============================================================================
from sentence_transformers import SentenceTransformer, CrossEncoder

bi = SentenceTransformer("all-MiniLM-L6-v2")
cross = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def retrieve_then_rerank(query: str, corpus: list[str], k: int = 5):
    import numpy as np
    q = bi.encode([query])[0]
    D = bi.encode(corpus)
    sims = (D @ q) / (np.linalg.norm(D, axis=1) * np.linalg.norm(q) + 1e-9)
    top50 = sorted(range(len(corpus)), key=lambda i: -sims[i])[:50]
    pairs = [(query, corpus[i]) for i in top50]
    scores = cross.predict(pairs)
    ranked = sorted(zip(top50, scores), key=lambda t: -t[1])[:k]
    return [(corpus[i], float(s)) for i, s in ranked]

# ColBERT: replace cross.predict with token MaxSim; HyDE: embed LLM draft as query.
`;

// ── Retrieval funnel: recall ceiling + staged narrowing ─────────────────────
// No reranker can rank a document retrieval never surfaced.

export const FUNNEL_STAGES = [
  { stage: 'Lexical match', how: 'Exact-term scoring over the whole corpus', candidatesOut: 1000, recall: 0.92, cost: '$', ms: 5 },
  { stage: 'Vector search', how: 'Embedding neighbors over the lexical shortlist + index', candidatesOut: 400, recall: 0.90, cost: '$', ms: 12 },
  { stage: 'Hybrid fusion', how: 'Blend lexical and vector ranks; dedupe; metadata filters', candidatesOut: 150, recall: 0.96, cost: '$', ms: 3 },
  { stage: 'Cross-encoder rerank', how: 'Expensive joint query+doc scoring on finalists only', candidatesOut: 10, recall: 0.98, cost: '$$$', ms: 90 },
];

// End-to-end recall ≈ product of per-stage recalls (stages are conditional gates).
export function funnelRecall(recalls) {
  if (!Array.isArray(recalls) || recalls.length === 0) return 0;
  return Math.round(recalls.reduce((p, r) => p * r, 1) * 10000) / 10000;
}

export function bottleneckStage(recalls) {
  let min = 0;
  recalls.forEach((r, i) => { if (r < recalls[min]) min = i; });
  return min;
}

export function rerankCeiling(recalls) {
  // Ceiling = recall of everything upstream of the reranker.
  const upstream = recalls.slice(0, -1);
  return funnelRecall(upstream.length ? upstream : recalls);
}

export const FUNNEL_CODE = `# Retrieval as a funnel: cheap-and-wide first, expensive-and-narrow last
def funnel(query, k=10):
    stage1 = lexical_search(query, top_n=1000)     # ms, nearly free
    stage2 = vector_search(query, top_n=400)       # index lookup
    stage3 = hybrid_fuse(stage1, stage2, n=150)    # rank blend + dedupe
    stage4 = cross_encoder(query, stage3, n=10)    # $$$ but only 150 pairs
    return stage4[:k]

# End recall = product of stage recalls.
# A perfect reranker over stage3 still tops out at stage3's recall.
# If agents iterate: every missing doc = another search-evaluate loop.
`;
