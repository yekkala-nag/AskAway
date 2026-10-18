// ── Zero-infra RAG: chunk → embed → cosine kNN retrieve → generate-or-abstain ──
// Illustrative numbers only. No external sources, no product names.

export const ZR_STAGES = [
  {
    n: 1, stage: 'Chunk', icon: '✂️',
    detail: 'Split documents into overlapping word windows (size 25 / overlap 5 for demos; real corpora use 200–500).',
    output: 'chunk strings',
  },
  {
    n: 2, stage: 'Embed', icon: '🧮',
    detail: 'A local embedding model maps each chunk to a vector. Angle between vectors ≈ semantic similarity.',
    output: 'matrix of vectors',
  },
  {
    n: 3, stage: 'Retrieve', icon: '🧭',
    detail: 'Cosine kNN over the matrix: score the query vector against every chunk vector, take the top k. Brute force is fine at small scale.',
    output: 'top-k chunk texts + distances',
  },
  {
    n: 4, stage: 'Generate', icon: '💬',
    detail: 'A small instruct model answers strictly from the retrieved context — or abstains when the context lacks the answer.',
    output: 'answer + sources',
  },
];

export const ZR_SCALING = [
  { corpus: '≤ 1k chunks', qps: 'any', option: 'Brute-force cosine (this tab)', why: 'A full scan of 1k vectors is sub-millisecond; indexing adds complexity for nothing.', cost: 'Zero infra' },
  { corpus: '1k – 100k chunks', qps: 'low–mid', option: 'In-memory approximate index', why: 'Neighbor graphs or hashing cut search from O(n) to O(log n) while staying in one process.', cost: 'A library, still no server' },
  { corpus: '100k – 10M chunks', qps: 'sustained', option: 'Managed vector store', why: 'Persistence, filters, replicas, and monitoring matter more than raw distance math now.', cost: 'A service bill' },
  { corpus: '> 10M chunks', qps: 'high', option: 'Distributed store + sharding', why: 'One machine no longer holds the matrix; partition and cache by tenant or topic.', cost: 'An ops team' },
];

export const ZR_CODE = `# The whole loop, no frameworks, no vector DB
def chunk(text, size=25, overlap=5):
    words = text.split()
    step = size - overlap
    return [" ".join(words[i:i+size])
            for i in range(0, len(words), step)]

# 1. chunk every document into one flat list
chunks  = [c for doc in docs for c in chunk(doc)]
# 2. embed once (local model, no API)
matrix = embedder.encode(chunks)

# 3. cosine kNN = score every row, sort, keep top k
def retrieve(query, k=3):
    qv  = embedder.encode(query)
    d   = 1 - cosine(qv, matrix)          # distance = 1 - similarity
    top = argsort(d)[:k]
    return [(chunks[i], d[i]) for i in top]

# 4. generate strictly from context; abstain if absent
answer = llm(answer_prompt(context, question))
# 5. print answer WITH its sources`;

export function chunkWords(text, size = 25, overlap = 5) {
  if (size < 1) throw new Error('chunk size must be >= 1');
  if (overlap < 0 || overlap >= size) throw new Error('overlap must be in [0, size)');
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const step = size - overlap;
  const chunks = [];
  for (let i = 0; i < words.length; i += step) {
    chunks.push(words.slice(i, i + size).join(' '));
  }
  return chunks;
}

export function chunkCount(words, size = 25, overlap = 5) {
  if (size < 1) throw new Error('chunk size must be >= 1');
  if (overlap < 0 || overlap >= size) throw new Error('overlap must be in [0, size)');
  if (words <= 0) return 0;
  const step = size - overlap;
  return Math.ceil(words / step);
}

export function cosineDistance(a, b) {
  if (a.length !== b.length) throw new Error('vectors must share a dimension');
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 1; // zero vector: maximally distant
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return 1 - dot / denom;
}

// top-k indices by ascending cosine distance; ties broken by original index (stable).
export function topK(query, matrix, k = 3) {
  if (k < 1) throw new Error('k must be >= 1');
  const scored = matrix.map((row, idx) => ({ idx, d: cosineDistance(query, row) }));
  scored.sort((x, y) => (x.d - y.d) || (x.idx - y.idx));
  return scored.slice(0, Math.min(k, scored.length));
}

// Answer-or-abstain heuristic: if no retrieved chunk shares a content word
// (>= 4 chars, lowercased) with the query, the honest move is to abstain.
const STOP = new Set(['what', 'which', 'where', 'when', 'does', 'this', 'that', 'with', 'from', 'your', 'have', 'about', 'into']);

function contentWords(text) {
  return String(text).toLowerCase().match(/[a-z]{4,}/g)?.filter((w) => !STOP.has(w)) ?? [];
}

export function answerPlan(contexts, query) {
  const qWords = new Set(contentWords(query));
  const shared = contexts.reduce((best, ctx) => {
    const cWords = new Set(contentWords(ctx));
    let n = 0;
    qWords.forEach((w) => { if (cWords.has(w)) n += 1; });
    return Math.max(best, n);
  }, 0);
  if (shared === 0) {
    return { action: 'abstain', reason: 'No retrieved chunk shares a content word with the query — context is silent; say so.', overlap: 0 };
  }
  return { action: 'answer', reason: `${shared} content word${shared === 1 ? '' : 's'} overlap between the query and retrieved context — answer strictly from it.`, overlap: shared };
}

export function bruteForceMillis(chunks, dims = 384) {
  // Rough scan cost model: a chunk-vector comparison touches dims multiplies.
  // Illustrative constant: ~2 ns per multiply-add on a laptop core.
  return Math.round((chunks * dims * 2) / 1e6 * 100) / 100; // ms
}
