// ── Duplicate content audit engine — corpus of 9 anonymized sources,
// similarity model with a two-phase gated audit prompt, detect-only.
// Original teaching content. No sources, URLs, or authors.

// ── Corpus: 9 sources, first-appearing order = S1…S9 ────────────────────────

export const CORPUS = [
  { id: 'S1', short: 'Agent Freedom', theme: 'Constrained agent autonomy',
    excerpt: 'Agents perform better when the action/tool vocabulary is constrained; governance that survives agency lives outside the loop.',
    tags: ['agents', 'governance', 'constraints', 'tools'] },
  { id: 'S2', short: 'Agent Waste', theme: 'Coding-agent work efficiency',
    excerpt: 'Coding agents often solve the task while burning large amounts of redundant work — retries, thrash, and dead-end tool calls.',
    tags: ['agents', 'efficiency', 'coding', 'waste'] },
  { id: 'S3', short: 'Evolvable Scaffold', theme: 'Application structure that can evolve',
    excerpt: 'A scaffold at the gate: design AI applications so the architecture can absorb model and product change without rewrites.',
    tags: ['agents', 'architecture', 'scaffold', 'evolution'] },
  { id: 'S4', short: 'Decision API Guide', theme: 'Bounded decision endpoints',
    excerpt: 'A practical guide to a decision API returning predicates, choices, and scores over a finite answer space, with policy checks and a human gate.',
    tags: ['agents', 'decisions', 'bounded-output', 'human-gate'] },
  { id: 'S5', short: 'Temperature-0 Myth', theme: 'Generation nondeterminism',
    excerpt: 'Setting temperature to zero does not make outputs deterministic; nondeterminism lives beneath the sampling knob.',
    tags: ['sampling', 'determinism', 'inference', 'evaluation'] },
  { id: 'S6', short: 'Untrusted Sources', theme: 'Safe reading of untrusted content',
    excerpt: 'AI agents read untrusted sources safely via quarantine readers, dual-model splits, and treating extracted content as hostile.',
    tags: ['agents', 'security', 'untrusted-input', 'governance'] },
  { id: 'S7', short: 'Six Architectures', theme: 'Advanced agent architectures',
    excerpt: 'Six production-oriented agent architectures beyond basic reasoning loops: supervisors, swarms, pipelines, and hybrids.',
    tags: ['agents', 'architecture', 'patterns', 'production'] },
  { id: 'S8', short: 'Six Data Requirements', theme: 'Data layer for production agents',
    excerpt: 'Six architectural data requirements — semantic clarity, entity resolution, temporal awareness, auditability, agentic integration, unified persistence — that separate pilots from production.',
    tags: ['agents', 'data', 'production', 'governance', 'architecture'] },
  { id: 'S9', short: 'Retrieval Funnel', theme: 'Retrieval before ranking',
    excerpt: 'No reranker can fix bad retrieval; design retrieval as a multi-stage funnel so ranking only spends on candidates that can change the outcome.',
    tags: ['rag', 'retrieval', 'ranking', 'funnel', 'production'] },
];

export const THRESHOLDS = [
  { id: 'exact', label: 'Exact match', pct: 100, band: 'Exact Duplicate', note: 'Byte-level or near-identical wording' },
  { id: 'probable', label: 'Probable Duplicate', pct: 80, band: 'Probable Duplicate', note: 'Semantic similarity above 80% — flag for review' },
  { id: 'related', label: 'Related', pct: 50, band: 'Related — Keep', note: 'Shared theme, distinct scope' },
  { id: 'distinct', label: 'Distinct', pct: 20, band: 'Distinct — Keep', note: 'No meaningful overlap' },
];

export const PROBABLE_DUPLICATE_CUTOFF = 80;

// ── Pairwise audit findings (detect-only; percentages are assessments) ──────

export const AUDIT_PAIRS = [
  { a: 'S1', b: 'S7', pct: 45, type: 'Semantic', action: 'Keep both — constraint thesis vs architecture catalog; adjacent, not duplicate' },
  { a: 'S1', b: 'S6', pct: 55, type: 'Semantic', action: 'Keep both — shared governance theme; distinct threat model (freedom vs untrusted input)' },
  { a: 'S1', b: 'S4', pct: 50, type: 'Semantic', action: 'Keep both — product guide vs general constraint thesis' },
  { a: 'S3', b: 'S7', pct: 50, type: 'Semantic', action: 'Keep both — scaffold lifecycle vs pattern catalog; different depth' },
  { a: 'S2', b: 'S3', pct: 40, type: 'Semantic', action: 'Keep both — waste measurement vs architecture for change' },
  { a: 'S7', b: 'S8', pct: 45, type: 'Semantic', action: 'Keep both — agent topology vs data foundation; same production frame, different layer' },
  { a: 'S8', b: 'S9', pct: 40, type: 'Semantic', action: 'Keep both — data architecture vs retrieval funnel design' },
  { a: 'S6', b: 'S8', pct: 40, type: 'Semantic', action: 'Keep both — untrusted-input handling vs auditability/governance data' },
  { a: 'S1', b: 'S5', pct: 15, type: 'Semantic', action: 'Keep — agent governance vs sampling mechanics; unrelated scopes' },
];

export const EXACT_DUPLICATES = [];

export function bandFor(pct) {
  if (pct === 100) return 'Exact Duplicate';
  if (pct > PROBABLE_DUPLICATE_CUTOFF) return 'Probable Duplicate';
  if (pct >= 50) return 'Related — Keep';
  return 'Distinct — Keep';
}

export function sourceById(id) {
  return CORPUS.find((s) => s.id === id);
}

export function auditRows() {
  const rows = AUDIT_PAIRS.map((p) => {
    const A = sourceById(p.a);
    const B = sourceById(p.b);
    return {
      primaryId: p.a,
      primaryExcerpt: A.excerpt,
      dupId: p.b,
      dupExcerpt: B.excerpt,
      matchType: `${p.type} ${p.pct}%`,
      pct: p.pct,
      band: bandFor(p.pct),
      probable: p.pct > PROBABLE_DUPLICATE_CUTOFF,
      action: p.action,
    };
  });
  return rows.sort((x, y) => y.pct - x.pct);
}

export function probableDuplicates() {
  return auditRows().filter((r) => r.probable);
}

export function maxOverlap() {
  const rows = auditRows();
  return rows.length ? rows[0] : null;
}

// ── Jaccard-style theme overlap explorer ────────────────────────────────────

export function tagOverlap(idA, idB) {
  const A = sourceById(idA);
  const B = sourceById(idB);
  if (!A || !B) return { jaccard: 0, shared: [], onlyA: [], onlyB: [] };
  const setA = new Set(A.tags);
  const setB = new Set(B.tags);
  const shared = [...setA].filter((t) => setB.has(t));
  const union = new Set([...setA, ...setB]);
  return {
    jaccard: union.size ? shared.length / union.size : 0,
    shared,
    onlyA: [...setA].filter((t) => !setB.has(t)),
    onlyB: [...setB].filter((t) => !setA.has(t)),
  };
}

export function allPairs() {
  const out = [];
  for (let i = 0; i < CORPUS.length; i += 1) {
    for (let j = i + 1; j < CORPUS.length; j += 1) {
      const o = tagOverlap(CORPUS[i].id, CORPUS[j].id);
      out.push({ a: CORPUS[i].id, b: CORPUS[j].id, ...o });
    }
  }
  return out.sort((x, y) => y.jaccard - x.jaccard);
}

// ── Match taxonomy ──────────────────────────────────────────────────────────

export const MATCH_TYPES = [
  { id: 'exact', name: 'Exact', test: 'Normalized text is identical (or ≥99% after stripping boilerplate)', flag: 'Duplicate' },
  { id: 'semantic', name: 'Semantic', test: 'Meaning-level similarity on shared claims, structure, and conclusions', flag: '>80% → Probable Duplicate' },
  { id: 'theme', name: 'Thematic', test: 'Shared topic tags but different claims or depth — measured by tag Jaccard', flag: 'Related, not duplicate' },
];

// ── Two-phase gated audit prompt ────────────────────────────────────────────

export const AUDIT_PHASE1 = `ROLE
Act as a duplicate-content auditor.

CONTEXT
I will provide a corpus of documents (IDs, titles, and excerpts).

TASK — PHASE 1 (ALIGNMENT ONLY — DO NOT RUN THE AUDIT YET)
1. Restate the corpus scope and your understanding of the audit goal.
2. Ask up to 3 clarifying questions about thresholds (default: semantic >80% = Probable Duplicate), corpus order, and any exclusions.
3. Describe the table schema you will emit (Primary ID/Excerpt, Duplicate ID/Excerpt, Match Type + %, Recommended Action).
STOP. Wait for my explicit reply: "approved".

HARD RULES FOR PHASE 1
- Do NOT emit any audit table.
- Do NOT modify, rewrite, merge, or restructure any source content.
- Detect and report only.`;

export const AUDIT_PHASE2 = `TASK — PHASE 2 (EXECUTE — runs only after the word "approved")
Emit the duplicate-content audit as a Markdown table with exactly these columns:
| Primary Content ID/Excerpt | Duplicate Content ID/Excerpt | Match Type (Exact/Semantic) % | Recommended Action |

RULES
- Match Type must state Exact or Semantic plus a percentage.
- Flag any pair with semantic similarity >80% as "Probable Duplicate".
- The first-appearing / most complete source is the Primary; the later or less complete one is the Duplicate.
- Detect-only: NO rewriting, merging, or fixing of content.
- If no pair exceeds 80%, state that explicitly under the table.`;

export const AUDIT_COMPLIANCE = [
  { icon: '🔍', note: 'Detect-only contract — the prompt forbids rewriting, merging, or restructuring. An auditor that edits is an auditor that loses trust.' },
  { icon: '🚦', note: 'Phase 1 alignment before Phase 2 execution — the gate stops a confident table being dumped on a misunderstood corpus.' },
  { icon: '📏', note: 'One numeric threshold (>80%) carries the Probable Duplicate flag — thresholds chosen after seeing results are how audits get gamed.' },
];

export const PRIMARY_RULES = [
  { rule: 'First-appearing wins', detail: 'In a corpus scanned in order, the earliest complete document is the Primary — later restatements become Duplicates.' },
  { rule: 'Completeness wins', detail: 'If a later source is strictly more complete (superset of claims), it becomes the Primary even if it appears later.' },
  { rule: 'Ambiguity → both stay', detail: 'Neither is a strict superset: mark Related, keep both, and let a human decide — the audit never auto-picks.' },
];
