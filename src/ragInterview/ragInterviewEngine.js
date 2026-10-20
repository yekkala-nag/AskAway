// ── RAG interview engine — 30 senior/staff answers + simulator math ─────────
// Original teaching content. No external sources, URLs, or citations.
// Illustrative numbers only.

export const SECTIONS = [
  { id: 'fund', n: 'I', name: 'RAG Fundamentals & Architecture', icon: '🏛️' },
  { id: 'ingest', n: 'II', name: 'Data Ingestion & Chunking', icon: '✂️' },
  { id: 'vec', n: 'III', name: 'Embeddings & Vector Databases', icon: '🧭' },
  { id: 'query', n: 'IV', name: 'Advanced Query Processing', icon: '🔍' },
  { id: 'eval', n: 'V', name: 'Evaluation & Metrics', icon: '⚖️' },
  { id: 'prod', n: 'VI', name: 'Production, Security & Optimization', icon: '🏭' },
];

export const QUESTIONS = [
  // ── I. Fundamentals ──
  { n: 1, s: 'fund', q: 'What is Retrieval-Augmented Generation (RAG)?', core: 'An architecture that grounds generation in external data fetched at inference time, instead of relying only on what the model memorized in its weights — reducing hallucination and keeping answers current.', insight: 'Retrieval quality is the ceiling of generation quality. No prompt engineering fixes a pipeline that retrieves garbage — budget for retrieval first.' },
  { n: 2, s: 'fund', q: 'How does RAG differ from fine-tuning?', core: 'Fine-tuning updates weights to learn formats, styles, or reasoning patterns. RAG freezes weights and injects context at runtime.', insight: 'They are complementary, not exclusive: fine-tune for format/tone/reasoning patterns, retrieve for facts and dynamic knowledge — e.g., tune a small cheap model to be a great RAG router.' },
  { n: 3, s: 'fund', q: 'Core components of a production RAG pipeline?', core: 'Ingestion (parse/chunk) → embedding → vector storage → retrieval → augmentation → generation.', insight: 'The hidden 7th component is evaluation & observability. Without a golden dataset and tracing you are flying blind and cannot prove a change improved anything.' },
  { n: 4, s: 'fund', q: 'What is "Lost in the Middle" and how do you mitigate it?', core: 'LLMs show U-shaped attention: they favor the start and end of a prompt and under-read the middle.', insight: 'Mitigate by reranking to top 3–5 chunks (not 10+), ordering by relevance with the best chunk first (and restated last), and map-reducing huge contexts instead of stuffing them.' },
  { n: 5, s: 'fund', q: 'When GraphRAG over standard Vector RAG?', core: 'Vector RAG struggles with multi-hop questions that connect facts across documents; GraphRAG extracts entities and relationships into a graph and traverses them.', insight: 'GraphRAG is expensive to build and run — use it only when queries genuinely need relationship mapping. For most FAQs, plain vector retrieval is faster and cheaper.' },

  // ── II. Ingestion ──
  { n: 6, s: 'ingest', q: 'What is chunking, and why is naive fixed-size chunking dangerous?', core: 'Chunking splits documents so each piece embeds well. Blindly slicing every N tokens cuts sentences, paragraphs, and code in half, destroying meaning.', insight: 'Default to recursive character chunking with 10–20% overlap; level up to semantic chunking (split at similarity drops) or parent-child retrieval — retrieve small children for precision, pass the parent for context.' },
  { n: 7, s: 'ingest', q: 'How do you handle PDFs with tables and images?', core: 'Plain text extractors mangle PDFs — tables become noise. Specialized parsers and document-intelligence services preserve structure.', insight: 'Invest in the ingestion layer: convert tables to Markdown (or summarize to prose) before embedding; caption images with a vision-language model and embed the captions.' },
  { n: 8, s: 'ingest', q: 'What is metadata filtering, and why is it non-negotiable?', core: 'Attach attributes (department, date, doc_id, access_level) to chunks and pre-filter them at query time, before vector search.', insight: 'This is your RBAC mechanism. Never trust the prompt to "only look at HR docs" — enforce filters at the database layer to guarantee isolation and lift precision.' },
  { n: 9, s: 'ingest', q: 'How do you handle data drift or document updates?', core: 'Old vectors linger after content changes, so retrieval keeps serving stale facts. Track content per document and invalidate on change.', insight: 'Hash-based invalidation: store a content hash with the doc; on ingest, if the hash changed, cascade-delete every vector for that doc_id, then upsert fresh chunks. Never blind-append updates.' },
  { n: 10, s: 'ingest', q: 'What is the impact of chunk overlap, and how do you tune it?', core: 'Overlap keeps context that spans a boundary from being lost between neighboring chunks.', insight: 'Too little loses context; too much duplicates noise and burns context budget. Start at 10–15% (500 size / 50 overlap) and tune against your context-relevance metric — not by feel.' },

  // ── III. Embeddings & vectors ──
  { n: 11, s: 'vec', q: 'How do you choose an embedding model?', core: 'Weigh domain specificity, language support, dimension size, latency, and cost — not just the most famous hosted option.', insight: 'Check public embedding leaderboards, but build a domain-specific golden set: smaller self-hosted models often beat generic giants on technical or legal text, cheaper and private.' },
  { n: 12, s: 'vec', q: 'Dense vs. sparse retrieval — which is better?', core: 'Dense vectors capture meaning ("car" ≈ "automobile"); sparse methods (BM25/TF-IDF) capture exact keywords — SKUs, acronyms, proper nouns.', insight: 'Neither wins universally: dense fails on exact IDs, sparse fails on synonyms. Run hybrid search and let validation data set the balance.' },
  { n: 13, s: 'vec', q: 'Explain Hybrid Search and Reciprocal Rank Fusion (RRF).', core: 'Hybrid runs dense and sparse searches in parallel; RRF merges both rankings by rewarding documents that rank well in either list — no score normalization needed.', insight: 'RRF is nearly parameter-free (constant k≈60). When you need fine control, switch to a weighted linear blend (0.7 dense + 0.3 sparse) and grid-search weights on your validation set.' },
  { n: 14, s: 'vec', q: 'What is a re-ranker, and why is it the highest-ROI upgrade?', core: 'A cross-encoder scores the query and each candidate jointly, producing far more accurate relevance than embedding similarity alone.', insight: 'Two-stage retrieval: fast cheap search for top-50 (recall), then the expensive cross-encoder narrows to top 3–5 (precision). Speed where it counts, accuracy where it matters.' },
  { n: 15, s: 'vec', q: 'How do you scale a vector database to millions of documents?', core: 'From single-node in-memory indexes to distributed or managed vector stores — pick by corpus size, QPS, and ops appetite.', insight: 'Insist on HNSW-class indexing; tune ef_construction and M (recall vs. build speed vs. RAM), and load-test QPS and tail latency before committing to any vendor.' },

  // ── IV. Query processing ──
  { n: 16, s: 'query', q: 'What is query transformation/rewriting, and when is it needed?', core: 'Users ask vague questions; a fast cheap model rewrites the query into a search-optimized form before retrieval.', insight: 'Step-back prompting (retrieve foundational context first) and sub-query decomposition ("compare Q1 vs Q2 revenue" → two searches) rescue recall on complex questions.' },
  { n: 17, s: 'query', q: 'Explain HyDE (Hypothetical Document Embeddings).', core: 'Generate a fake answer to the query, embed that hypothetical document, and search with it instead of the raw question.', insight: 'It bridges vocabulary mismatch (users word things differently than documents) but adds latency and can hallucinate a misleading vector — reserve it for abstract queries where baseline retrieval fails.' },
  { n: 18, s: 'query', q: 'What is Agentic RAG?', core: 'An agent orchestrates retrieval instead of a fixed pipeline: decide whether to retrieve, which tool to use (vector, SQL, web), evaluate results, and loop to refine.', insight: 'Powerful but non-deterministic and slow. Use it for exploratory workflows; keep high-QPS user-facing chat on deterministic graph-style pipelines.' },
  { n: 19, s: 'query', q: 'How do you handle multi-turn conversational RAG?', core: 'Stuffing chat history into the retriever dilutes intent with noise. Condense history into one standalone query first.', insight: 'Query condensation: prompt a cheap model with "given this conversation, write one standalone search query for the latest intent" — retrieve with THAT, not the transcript.' },
  { n: 20, s: 'query', q: 'What is a "Router" in a RAG architecture?', core: 'A classifier (small model or few-shot prompted LLM) that sends each query to the right pipeline: chit-chat, vector lookup, or text-to-SQL.', insight: 'The hallmark of a mature system is edge handling: greetings bypass retrieval (saving cost), metadata questions hit the index, data questions hit SQL — all decided before generation.' },

  // ── V. Evaluation ──
  { n: 21, s: 'eval', q: 'How do you evaluate a RAG system?', core: 'Score retrieval and generation separately — end-to-end vibes hide which half broke.', insight: 'Build a golden dataset of 100–500 (query, expected context, expected answer) triplets and run it as regression testing in CI: if a prompt change drops faithfulness by 5%, the PR blocks.' },
  { n: 22, s: 'eval', q: 'Explain the core RAG metrics.', core: 'Context relevance (how much retrieved context is useful), context recall (did we retrieve all needed facts), faithfulness (is the answer derived from context), answer relevance (does it address the question).', insight: 'Faithfulness and context recall carry the most signal: low recall → fix chunking/embedding; low faithfulness → fix the generation prompt or add a reranker. Each metric names its own fix.' },
  { n: 23, s: 'eval', q: 'Pitfalls of LLM-as-a-judge?', core: 'Scalable and cheap, but judges are systematically biased.', insight: 'Verbosity bias (longer wins), self-enhancement bias (same-family answers win), position bias (first option wins). Mitigate: multiple judge models, shuffled orders, and human-audited samples.' },
  { n: 24, s: 'eval', q: 'How do you measure retrieval quality without ground-truth answers?', core: 'Hit rate@K (was the right doc in top K?) and MRR (how high did it rank?) work with only queries and a corpus.', insight: 'Bootstrap the rest synthetically: generate questions FROM your documents with a model to create pseudo-ground truth, then treat it as a golden set until humans can audit it.' },
  { n: 25, s: 'eval', q: 'What is tracing, and why is it mandatory?', core: 'A trace records inputs, outputs, latency, and tokens of every step (chunk, embed, retrieve, generate) for one request.', insight: 'When a user says "weird answer," tracing shows instantly whether chunking, retrieval, or generation failed. You cannot debug what you cannot trace.' },

  // ── VI. Production ──
  { n: 26, s: 'prod', q: 'How do you reduce RAG latency?', core: 'Each sequential hop (embed → search → rerank → generate) adds network time; attack the critical path.', insight: 'Semantic caching for near-duplicate queries, parallel embedding work, streaming to cut time-to-first-token, and aggressive context pruning — in that order of ROI.' },
  { n: 27, s: 'prod', q: 'How do you definitively prevent hallucinations in RAG?', core: 'You cannot reach 100%; you can drive it near zero with citation-forcing generation.', insight: 'Prompt: "answer ONLY from context, cite [Source: doc_id] per claim, otherwise output a fixed abstention string" — then programmatically verify every cited id exists in the retrieved metadata, flagging strays.' },
  { n: 28, s: 'prod', q: 'Top security risks in RAG and mitigations?', core: 'Prompt injection via retrieved text, data leakage across permissions, and PII embedded into a shared vector space.', insight: 'Isolate context in strict delimiters and rank instructions above data; enforce RBAC as metadata pre-filters at the database — never at the LLM; scrub PII during ingestion before anything is embedded.' },
  { n: 29, s: 'prod', q: 'How do you handle out-of-domain or unanswerable queries?', core: 'The vector store always returns the "closest" documents, so the model happily forces a confident wrong answer.', insight: 'Insert a relevance/NLI gate before generation: score context-vs-query relevance; below threshold, trigger a fixed fallback ("outside my area"). Abstention is a feature, not a failure.' },
  { n: 30, s: 'prod', q: 'The biggest mistake teams make building RAG?', core: 'Starting with the model — weeks of temperature and prompt tweaks while parsing is broken and chunking is naive.', insight: 'Start with the data: spend ~70% of effort on ingestion, chunking, and a golden eval set. A mediocre model with perfect retrieval beats a genius model with garbage retrieval, every time.' },
];

export const INTERVIEW_PIVOT = 'Core concept in 1–2 sentences, then pivot: "In production, the real challenge is…" — that turns a textbook recital into a peer-level trade-off discussion.';

// ── Simulator math ──────────────────────────────────────────────────────────

// U-shaped attention: 1.0 at the edges, ~0.3 in the middle.
export function attentionAt(pos, n) {
  if (n <= 1) return 1;
  if (pos < 0 || pos >= n) return 0;
  return Math.round((1 - 0.7 * Math.sin((Math.PI * pos) / (n - 1))) * 100) / 100;
}

export function chunkStats(size = 500, overlap = 50) {
  if (size < 1) throw new Error('size must be >= 1');
  if (overlap < 0 || overlap >= size) throw new Error('overlap must be in [0, size)');
  const step = size - overlap;
  return { step, redundancyPct: Math.round((overlap / size) * 1000) / 10 };
}

export const CHUNK_STRATEGIES = [
  { strategy: 'Fixed-size', how: 'Slice every N tokens blindly', risk: 'Cuts sentences, code blocks, tables mid-thought', when: 'Never for production' },
  { strategy: 'Recursive character', how: 'Split on separators in priority order (paras → sentences → words) with overlap', risk: 'Still size-bound at the last level', when: 'Solid default for prose' },
  { strategy: 'Semantic', how: 'Split where embedding similarity between adjacent sentences drops', risk: 'Chunk sizes vary; needs an embedding pass', when: 'Long, heterogeneous documents' },
  { strategy: 'Parent–child (auto-merging)', how: 'Retrieve precise small children; pass their merged parent to the generator', risk: 'Two indexes to maintain', when: 'Precision AND context both matter' },
];

export const PIPELINE_STAGES = [
  { n: 1, stage: 'Parse & chunk', core: true },
  { n: 2, stage: 'Embed', core: true },
  { n: 3, stage: 'Vector store', core: true },
  { n: 4, stage: 'Retrieve', core: true },
  { n: 5, stage: 'Augment prompt', core: true },
  { n: 6, stage: 'Generate', core: true },
  { n: 7, stage: 'Evaluate & trace', core: false },
];

// ── Hybrid / RRF ────────────────────────────────────────────────────────────
// Two ranked lists (doc ids best-first). RRF: sum 1/(k + rank) across lists.
export function rrfMerge(denseRank, sparseRank, k = 60) {
  const scores = {};
  const add = (list, tag) => list.forEach((id, i) => {
    scores[id] = (scores[id] || 0) + 1 / (k + i + 1);
    scores[id] = scores[id]; // stable accumulation
    if (!scores[`${id}_lists`]) scores[`${id}_lists`] = [];
    if (!scores[`${id}_lists`].includes(tag)) scores[`${id}_lists`].push(tag);
  });
  add(denseRank, 'dense');
  add(sparseRank, 'sparse');
  return Object.keys(scores)
    .filter((id) => !id.endsWith('_lists'))
    .map((id) => ({ id, score: Math.round(scores[id] * 1e6) / 1e6, inLists: scores[`${id}_lists`] }))
    .sort((a, b) => b.score - a.score);
}

export function weightedMerge(dense, sparse, w = 0.7) {
  // dense/sparse: [{id, score}] already normalized 0..1
  const map = {};
  dense.forEach((d) => { map[d.id] = { id: d.id, dense: d.score, sparse: 0 }; });
  sparse.forEach((d) => { map[d.id] = map[d.id] || { id: d.id, dense: 0, sparse: 0 }; map[d.id].sparse = d.score; });
  return Object.values(map)
    .map((r) => ({ ...r, score: Math.round((w * r.dense + (1 - w) * r.sparse) * 1e4) / 1e4 }))
    .sort((a, b) => b.score - a.score);
}

// ── Eval triage ─────────────────────────────────────────────────────────────
export function triage(recall = 0.9, faithfulness = 0.9) {
  const fixes = [];
  if (recall < 0.7) fixes.push('Low context recall → fix chunking strategy, embedding model, or retrieval breadth (k).');
  if (faithfulness < 0.7) fixes.push('Low faithfulness → constrain the prompt to context, add citations, or insert a reranker.');
  if (recall >= 0.7 && faithfulness >= 0.7) fixes.push('Both healthy → watch answer relevance and cost next.');
  return { recall, faithfulness, verdict: fixes.length > 1 ? 'BOTH_BROKEN' : fixes[0], healthy: recall >= 0.7 && faithfulness >= 0.7 };
}

export const JUDGE_BIASES = [
  { bias: 'Verbosity bias', what: 'Prefers longer, wordier answers regardless of correctness', fix: 'Score with rubric anchors; normalize answer length before judging' },
  { bias: 'Self-enhancement', what: 'Prefers answers from its own model family', fix: 'Mix judge models; audit a sample against human labels' },
  { bias: 'Position bias', what: 'Prefers whichever option is presented first', fix: 'Shuffle candidate order and aggregate over permutations' },
];

// ── Latency ─────────────────────────────────────────────────────────────────
export const LATENCY_HOPS = [
  { hop: 'Embed query', ms: 35 },
  { hop: 'Vector search', ms: 45 },
  { hop: 'Rerank top-50', ms: 90 },
  { hop: 'LLM first token', ms: 420 },
];

export function totalLatency(cacheHit = false) {
  if (cacheHit) return { ms: 12, label: 'semantic cache hit — return stored answer' };
  const ms = LATENCY_HOPS.reduce((s, h) => s + h.ms, 0);
  return { ms, label: 'cold path (embed → search → rerank → stream)' };
}

// ── Answerability gate ──────────────────────────────────────────────────────
export function answerGate(contextScore, threshold = 0.65) {
  if (typeof contextScore !== 'number' || Number.isNaN(contextScore)) return { action: 'fallback', reason: 'No score — abstain by default.' };
  return contextScore >= threshold
    ? { action: 'answer', reason: `Score ${contextScore.toFixed(2)} ≥ ${threshold} — context is relevant.` }
    : { action: 'fallback', reason: `Score ${contextScore.toFixed(2)} < ${threshold} — outside domain; use the fixed refusal.` };
}

export const QUERY_TRANSFORMS = [
  { name: 'Step-back', how: 'Ask for a broader, conceptual version of the query first', when: 'Specific question needs foundational context' },
  { name: 'Sub-query decomposition', how: 'Split compound questions into independent searches, then merge', when: 'Compare / multi-part questions' },
  { name: 'Query condensation', how: 'Rewrite history + latest turn into one standalone query', when: 'Multi-turn conversations' },
  { name: 'HyDE', how: 'Embed a hypothetical answer instead of the question', when: 'Vocabulary mismatch, abstract queries' },
  { name: 'Router dispatch', how: 'Classify intent, then pick chit-chat / index / SQL pipeline', when: 'Cost control, mixed workloads' },
];

export const RISK_TABLE = [
  { risk: 'Prompt injection', via: 'Malicious instructions hidden in retrieved documents', mitigation: 'Delimit context; rank system instructions above data; scan sources' },
  { risk: 'Data leakage', via: 'User retrieves docs beyond their permissions', mitigation: 'RBAC metadata pre-filters at the database — never trust the prompt' },
  { risk: 'PII exposure', via: 'Sensitive data embedded in a shared vector space', mitigation: 'Scrub PII at ingestion, before embedding ever runs' },
];

export const RAGI_CODE = `# Two-stage retrieval + answerability gate (the interview-in-code version)
candidates = hybrid_search(query, top_n=50)        # dense + sparse, RRF fused
top = cross_encoder(query, candidates, n=5)        # precision where it matters
gate = relevance_score(query, top)                 # NLI-style context check
if gate < 0.65:
    return FALLBACK                                # abstain is a feature
answer = generate(answer_prompt(top), citations=True)
assert every_citation_exists(answer, top)          # block stray sources`;
