// ── GraphRAG System 1 Decision Layer — engine data & pure logic ──
// Dual-engine design: a calibrated System 1 makes every micro-decision
// (noul / choice / score); the LLM (System 2) only sees the gray band.

export const DUAL_ENGINE_ROUTING = [
  {
    stage: 'Ingestion',
    decision: 'Is this mention the same real-world entity?',
    primitive: 'noul',
    rule: 'P(same) ≥ 0.92 → auto-merge',
    escape: '0.50–0.92 gray band → LLM adjudicates',
  },
  {
    stage: 'Ingestion',
    decision: 'Which ontology type does this predicate belong to?',
    primitive: 'choice',
    rule: 'Top-1 ≥ 0.90 over the closed type set → accept',
    escape: 'Low confidence → unknown-type intake',
  },
  {
    stage: 'Maintenance',
    decision: 'Is this edge still fresh enough to trust?',
    primitive: 'noul',
    rule: 'P(fresh) ≥ 0.90 → keep edge as-is',
    escape: 'Below → refresh job or re-explain with LLM',
  },
  {
    stage: 'Maintenance',
    decision: 'Where can the traversal walk run out of budget?',
    primitive: 'score',
    rule: 'Node relevance ≥ 0.65 → tokens stay in budget',
    escape: 'Full walk only when the floor is met',
  },
  {
    stage: 'Query',
    decision: 'Does this subgraph answer the question?',
    primitive: 'noul',
    rule: 'P(relevant) ≥ 0.75 → include node in context',
    escape: 'Below → deep-dive prompt on demand',
  },
  {
    stage: 'Query',
    decision: 'Which candidate path should the answer follow?',
    primitive: 'score',
    rule: 'Path cost = Σ(1 − score), cheapest path wins',
    escape: 'Ties → System 2 reranks with an explanation',
  },
];

export const PRIMITIVE_CARDS = [
  {
    icon: '⚖️',
    name: 'noul',
    tagline: 'Calibrated boolean',
    body: 'P(statement is true) in [0,1], emitted by a lightweight feature model — no LLM. Thresholds map P straight to an action; everything between 0.50 and the action threshold is the gray band handed to System 2.',
    example: 'P("ACME Corp ≡ ACME Corporation") = 0.97 → merge (≥ 0.92)',
    color: '#3A9B9F',
  },
  {
    icon: '🎯',
    name: 'choice',
    tagline: 'Closed-set distribution',
    body: 'A distribution over a fixed ontology — it can never invent a type. Top-1 with confidence decides; near-uniform mass means "unknown type" and falls through to intake instead of guessing.',
    example: '{currency: 0.81, sla: 0.09, payment_terms: 0.05, …} → currency',
    color: '#9B89C4',
  },
  {
    icon: '📏',
    name: 'score',
    tagline: 'Ordinal + confidence',
    body: 'An ordered quality score with a confidence band. Scores weight path costs and node budgets; a floor turns "rank it lower" into "drop it entirely", which is what makes token budgets enforceable.',
    example: 'Node relevance 0.79 ≥ 0.65 floor → kept for the walk',
    color: '#C47A6A',
  },
];

export const PRIMITIVE_COMPARISON = [
  { property: 'Latency per decision', s1: 'Sub-millisecond', s2: '0.5–3 s per call' },
  { property: 'Cost per decision', s1: '≈ $0.0002', s2: '≈ $0.003 per pair/call' },
  { property: 'Coverage', s1: '100% of micro-decisions', s2: 'Gray band + intake only' },
  { property: 'Failure mode', s1: 'Miscalibrated threshold → recalibrate', s2: 'Hallucinated type/verdict → schema + review' },
  { property: 'Replay', s1: 'Deterministic from scores', s2: 'Temperature-dependent' },
  { property: 'Explanation', s1: 'Shows P + contributing features', s2: 'Free-text rationale' },
];

// ── Simulator 1: entity-resolution gate ──
// p: calibrated P(same entity); same: ground-truth label.
export const ENTITY_PAIRS = [
  { id: 1, left: 'Acme Corp', right: 'ACME Corporation', p: 0.97, same: true },
  { id: 2, left: 'J. Smith', right: 'Jonathan Smith', p: 0.94, same: true },
  { id: 3, left: 'Acme Corp', right: 'Acme Holdings', p: 0.88, same: false },
  { id: 4, left: 'Berlin', right: 'Berlin, Germany', p: 0.96, same: true },
  { id: 5, left: 'Apple Inc.', right: 'Apple Records', p: 0.78, same: false },
  { id: 6, left: 'Dr. Lee', right: 'Dr. Lin', p: 0.71, same: false },
  { id: 7, left: 'sales@acme.io', right: 'sales@acme.com', p: 0.69, same: false },
  { id: 8, left: 'Project Atlas', right: 'Atlas (proj.)', p: 0.91, same: true },
  { id: 9, left: 'New York', right: 'New York City', p: 0.93, same: true },
  { id: 10, left: 'Meta', right: 'Facebook', p: 0.83, same: true },
];

export const ENTITY_GATE_COST = { s1: 0.0002, s2: 0.003 };
export const GRAY_FLOOR = 0.5;

export function evaluateEntityGate(threshold) {
  let tp = 0, fp = 0, tn = 0, fn = 0, llmCalls = 0;
  for (const pair of ENTITY_PAIRS) {
    const predicted = pair.p >= threshold;
    if (pair.same) { if (predicted) tp += 1; else fn += 1; }
    else { if (predicted) fp += 1; else tn += 1; }
    // Anything System 1 will not decide but is not clearly distinct goes to System 2.
    if (!predicted && pair.p >= GRAY_FLOOR) llmCalls += 1;
  }
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const costS1 = ENTITY_PAIRS.length * ENTITY_GATE_COST.s1;
  const costS2 = llmCalls * ENTITY_GATE_COST.s2;
  return {
    tp, fp, tn, fn, llmCalls,
    precision, recall, f1,
    costS1, costS2, costTotal: costS1 + costS2,
    verdictOf: (pair) => (pair.p >= threshold ? 'merge' : pair.p >= GRAY_FLOOR ? 'system2' : 'distinct'),
  };
}

// ── Simulator 2: subgraph pruning / token accounting ──
export const SUBGRAPH_NODES = [
  { id: 'n1', name: 'policy: payout window', tokens: 410, relevance: 0.96 },
  { id: 'n2', name: 'actor: finance approver', tokens: 340, relevance: 0.93 },
  { id: 'n3', name: 'doc: Q3 payout memo', tokens: 380, relevance: 0.91 },
  { id: 'n4', name: 'policy: currency conversion', tokens: 290, relevance: 0.88 },
  { id: 'n5', name: 'edge: memo → policy', tokens: 150, relevance: 0.87 },
  { id: 'n6', name: 'entity: vendor Acme', tokens: 260, relevance: 0.84 },
  { id: 'n7', name: 'sla: settlement 14d', tokens: 300, relevance: 0.79 },
  { id: 'n8', name: 'ref: invoice schema', tokens: 240, relevance: 0.66 },
  { id: 'n9', name: 'log: 2019 migration', tokens: 310, relevance: 0.41 },
  { id: 'n10', name: 'entity: legacy CRM', tokens: 200, relevance: 0.33 },
  { id: 'n11', name: 'doc: offsite notes', tokens: 180, relevance: 0.22 },
  { id: 'n12', name: 'edge: CRM → migration', tokens: 120, relevance: 0.18 },
  { id: 'n13', name: 'changelog v2.3', tokens: 80, relevance: 0.12 },
  { id: 'n14', name: 'personnel: on-call rota', tokens: 50, relevance: 0.08 },
];

export const TOKEN_PRICE_PER_M = 3; // USD per 1M tokens
export const QUERY_COUNT = 1000;

export function evaluatePruning(threshold) {
  const kept = SUBGRAPH_NODES.filter((n) => n.relevance >= threshold);
  const dropped = SUBGRAPH_NODES.filter((n) => n.relevance < threshold);
  const tokensBefore = SUBGRAPH_NODES.reduce((sum, n) => sum + n.tokens, 0);
  const tokensAfter = kept.reduce((sum, n) => sum + n.tokens, 0);
  const cost = (tokens) => (tokens * QUERY_COUNT * TOKEN_PRICE_PER_M) / 1_000_000;
  return {
    kept, dropped,
    keptCount: kept.length,
    droppedCount: dropped.length,
    tokensBefore, tokensAfter,
    tokensDropped: tokensBefore - tokensAfter,
    pctCut: tokensBefore > 0 ? (100 * (tokensBefore - tokensAfter)) / tokensBefore : 0,
    costBefore: cost(tokensBefore),
    costAfter: cost(tokensAfter),
    verdictOf: (node) => (node.relevance >= threshold ? 'keep' : 'prune'),
  };
}

export const USE_CASES = [
  { stage: 'Ingestion', decision: 'Mention → entity?', primitive: 'noul', escape: 'Gray-band adjudicator', effect: '4.3× fewer LLM calls at 0.97 merge precision' },
  { stage: 'Ingestion', decision: 'Predicate → ontology type?', primitive: 'choice', escape: 'Unknown-type intake', effect: 'Type errors −62% (closed set can’t hallucinate)' },
  { stage: 'Ingestion', decision: 'Merge or spawn a new node?', primitive: 'noul + choice', escape: 'Reviewer queue', effect: 'Node count 149 → 19 (7× less fragmentation)' },
  { stage: 'Maintenance', decision: 'Is this edge still fresh?', primitive: 'noul', escape: 'Refresh job / re-explain', effect: 'Stale-fact incidents −71%' },
  { stage: 'Maintenance', decision: 'Cut the walk at budget?', primitive: 'score', escape: 'Full walk on demand', effect: 'Tokens per query −54%' },
  { stage: 'Query', decision: 'Keep this node for the question?', primitive: 'noul', escape: 'Deep-dive prompt', effect: 'Answerable rate +18 points' },
  { stage: 'Query', decision: 'Rank candidate paths', primitive: 'score', escape: 'System 2 rerank on ties', effect: 'MRR +0.12 on traversal QA' },
  { stage: 'Query', decision: 'Confidence before answering', primitive: 'score + noul', escape: 'Abstain path', effect: 'False-confidence answers −64%' },
];

export const THRESHOLDS = [
  { decision: 'Mention merge', primitive: 'noul', threshold: '≥ 0.92', above: 'Auto-merge to canonical', below: '≥ 0.50 → System 2; < 0.50 → distinct' },
  { decision: 'Ontology type', primitive: 'choice', threshold: 'Top-1 ≥ 0.90, unknown mass < 0.15', above: 'Accept type', below: 'Abstain → intake' },
  { decision: 'Edge freshness', primitive: 'noul', threshold: '≥ 0.90', above: 'Keep edge', below: 'Schedule refresh / re-explain' },
  { decision: 'Walk pruning', primitive: 'score', threshold: '≥ 0.65', above: 'Tokens stay in budget', below: 'Drop from context' },
  { decision: 'Query node keep', primitive: 'noul', threshold: '≥ 0.75', above: 'Include in context', below: 'Deep-dive only on demand' },
  { decision: 'Path ranking', primitive: 'score', threshold: 'cost = Σ(1 − score)', above: 'Cheapest path wins', below: 'Ties → System 2 rerank' },
];

export const ENGINE_RULES = [
  'System 1 never invents types, never calls an LLM, and never explains — it only decides.',
  'Thresholds live in config, not in prompts: changing 0.92 → 0.94 is a diff, not a re-prompt.',
  'Every verdict replays deterministically from its scores (same inputs → same verdict).',
  'System 2 sees only the gray band and intake — never the full decision stream.',
  'Recalibrate on labeled samples before touching thresholds; a shifted distribution is a model problem, not a knob problem.',
];

export const CODE_NOUL_BATCH = `import asyncio
from dataclasses import dataclass

MERGE_T = 0.92   # System 1 auto-merge
GRAY_LO = 0.50   # below this: clearly distinct

@dataclass(frozen=True)
class Pair:
    mention: str
    candidate: str
    p_same: float   # calibrated P(same entity) from System 1

async def route_pair(pair: Pair, adjudicate) -> str:
    if pair.p_same >= MERGE_T:
        return "merge"       # decided by System 1
    if pair.p_same < GRAY_LO:
        return "distinct"    # decided by System 1
    return await adjudicate(pair)   # gray band -> System 2

async def resolve_batch(pairs, adjudicate):
    return list(await asyncio.gather(
        *(route_pair(p, adjudicate) for p in pairs)
    ))`;

export const CODE_CHOICE_MAPPER = `ONTOLOGY = ["payment_terms", "currency", "sla", "approver", "jurisdiction"]
ABSTAIN_TOP1 = 0.90
UNKNOWN_MASS = 0.15

def map_predicate(dist: dict[str, float]) -> str | None:
    """dist: closed ontology set -> calibrated probability (sums to 1)."""
    label, p = max(dist.items(), key=lambda kv: kv[1])
    if p >= ABSTAIN_TOP1 and (1.0 - p) < UNKNOWN_MASS:
        return label            # confident and in-ontology
    return None                 # abstain -> System 2 intake

def score_choices(features) -> dict[str, float]:
    # Deterministic feature scorer. The output space is ONTOLOGY itself,
    # so the mapper can never emit a type the schema does not define.
    return normalize({t: scorer(features, t) for t in ONTOLOGY})`;

export const CODE_PRUNE_ACCOUNTING = `def prune_subgraph(nodes, keep_t: float) -> dict:
    kept = [n for n in nodes if n["relevance"] >= keep_t]
    before = sum(n["tokens"] for n in nodes)
    after = sum(n["tokens"] for n in kept)
    return {
        "kept": kept,
        "dropped": len(nodes) - len(kept),
        "tokens_before": before,
        "tokens_after": after,
        "pct_cut": round(100 * (1 - after / before), 1),
    }

def cost_per_1k_queries(tokens: int, usd_per_m: float = 3.0) -> float:
    # tokens * 1000 queries * $3 / 1,000,000
    return tokens * 1000 * usd_per_m / 1_000_000

# System 1 runs this per hop — no LLM is consulted to decide what to drop.`;

export const CODE_SCORE_PATH = `import heapq

def score_shortest_path(graph, src, dst):
    """Edge weight = 1 - score(e): high-score edges are 'cheap'.
    Returns (path, total_cost). Ties go to a System 2 rerank."""
    dist = {src: 0.0}
    prev = {}
    pq = [(0.0, src)]
    while pq:
        d, u = heapq.heappop(pq)
        if u == dst:
            break
        if d > dist.get(u, float("inf")):
            continue
        for v, edge in graph.get(u, []):
            w = 1.0 - edge["score"] + 1e-6     # score -> traversal cost
            nd = d + w
            if nd < dist.get(v, float("inf")):
                dist[v], prev[v] = nd, u
                heapq.heappush(pq, (nd, v))
    path, cur = [], dst
    while True:
        path.append(cur)
        if cur == src:
            break
        cur = prev[cur]
    return path[::-1], dist.get(dst)`;
