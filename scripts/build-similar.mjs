/**
 * build-similar.mjs — generate src/search/similar.json
 *
 * Embeds `title + summary + tags` for every tab and writes the top 5
 * nearest neighbors per tab (cosine similarity).
 *
 * Modes:
 *   - embed: OpenAI embeddings (text-embedding-3-small) when OPENAI_API_KEY
 *     is set. Batches requests; caches vectors in
 *     scripts/.embedding-cache.json keyed by content hash, so only
 *     changed tabs are re-embedded. Override model with EMBEDDING_MODEL.
 *   - lexical: deterministic local fallback (idf-weighted token overlap) used
 *     automatically when no API key is present. No key ever gets
 *     hardcoded; the env var is the only source.
 *
 * Idempotent: same inputs produce same output (no timestamps in the file).
 *
 * Usage:
 *   OPENAI_API_KEY=sk-...  node scripts/build-similar.mjs     # embeddings
 *   node scripts/build-similar.mjs --lexical                  # offline mode
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX_PATH = path.join(ROOT, 'src', 'search', 'search-index.json');
const OUT_PATH = path.join(ROOT, 'src', 'search', 'similar.json');
const CACHE_PATH = path.join(ROOT, 'scripts', '.embedding-cache.json');

const TOP_N = 5;
const FORCE_LEXICAL = process.argv.includes('--lexical');
const API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
const MODE = !FORCE_LEXICAL && API_KEY ? 'embed' : 'lexical';

const embedText = (r) =>
  [r.title, r.summary, (r.tags || []).join(' ')].filter(Boolean).join(' - ');

const sha1 = (s) => crypto.createHash('sha1').update(s).digest('hex');

// ---- Lexical fallback: idf-weighted bag-of-words vectors -------------------

const STOP = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'with',
  'is', 'are', 'be', 'as', 'by', 'from', 'into', 'it', 'its', 'this', 'that',
]);

function lexicalTokens(text) {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}+#]+/u)
    .map((t) => t.replace(/^[-.]+|[-.]+$/g, ''))
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function buildIdfVectors(texts) {
  const docs = texts.map(lexicalTokens);
  const df = new Map();
  for (const toks of docs) {
    for (const t of new Set(toks)) df.set(t, (df.get(t) || 0) + 1);
  }
  const N = docs.length;
  return docs.map((toks) => {
    const vec = new Map();
    for (const t of toks) {
      const idf = Math.log(1 + N / (1 + (df.get(t) || 0)));
      vec.set(t, (vec.get(t) || 0) + idf);
    }
    let norm = 0;
    for (const v of vec.values()) norm += v * v;
    norm = Math.sqrt(norm) || 1;
    for (const [k, v] of vec) vec.set(k, v / norm);
    return vec;
  });
}

function cosineDense(a, b) {
  let dot = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) dot += a[i] * b[i];
  return dot;
}

function cosineSparse(a, b) {
  let dot = 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  for (const [k, v] of small) {
    const w = large.get(k);
    if (w) dot += v * w;
  }
  return dot;
}

// ---- OpenAI embeddings (cached, batched) -----------------------------------

async function loadCache() {
  if (!existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(await readFile(CACHE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

async function embedOpenAI(texts, cache) {
  const vectors = new Array(texts.length);
  const missing = [];
  texts.forEach((t, idx) => {
    const h = sha1(MODEL + '\0' + t);
    const hit = cache[h];
    if (hit && hit.model === MODEL && Array.isArray(hit.vector)) {
      vectors[idx] = hit.vector;
    } else {
      missing.push({ idx, text: t, hash: h });
    }
  });
  if (missing.length) {
    console.log('Embedding ' + missing.length + '/' + texts.length + ' tabs (cache hits: ' + (texts.length - missing.length) + ')...');
    const BATCH = 64;
    for (let i = 0; i < missing.length; i += BATCH) {
      const batch = missing.slice(i, i + BATCH);
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + API_KEY,
        },
        body: JSON.stringify({ model: MODEL, input: batch.map((b) => b.text) }),
      });
      if (!res.ok) {
        throw new Error('OpenAI embeddings error ' + res.status + ': ' + (await res.text()));
      }
      const data = await res.json();
      data.data.forEach((d, j) => {
        const item = batch[j];
        vectors[item.idx] = d.embedding;
        cache[item.hash] = { model: MODEL, vector: d.embedding };
      });
      process.stdout.write('  batch ' + (Math.floor(i / BATCH) + 1) + '/' + Math.ceil(missing.length / BATCH) + ' done\n');
    }
  } else {
    console.log('All ' + texts.length + ' embeddings served from cache.');
  }
  return vectors;
}

// ---- Main ------------------------------------------------------------------

async function main() {
  const { records } = JSON.parse(await readFile(INDEX_PATH, 'utf8'));
  const texts = records.map(embedText);
  console.log('Mode: ' + MODE + (MODE === 'embed' ? ' (' + MODEL + ')' : ' (no API key - offline lexical fallback)'));

  let vectors;
  let cache = {};
  if (MODE === 'embed') {
    cache = await loadCache();
    vectors = await embedOpenAI(texts, cache);
    await writeFile(CACHE_PATH, JSON.stringify(cache));
  } else {
    vectors = buildIdfVectors(texts);
  }

  const sim = (i, j) =>
    MODE === 'embed'
      ? cosineDense(vectors[i], vectors[j])
      : cosineSparse(vectors[i], vectors[j]);

  const similar = {};
  for (let i = 0; i < records.length; i++) {
    const scored = [];
    for (let j = 0; j < records.length; j++) {
      if (i === j) continue;
      const s = sim(i, j);
      if (s > 0) scored.push({ id: records[j].id, score: Math.round(s * 10000) / 10000 });
    }
    scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
    similar[records[i].id] = scored.slice(0, TOP_N);
  }

  const output = {
    _meta: {
      description:
        'Top-5 nearest neighbors per tab (cosine over title+summary+tags). Generated by scripts/build-similar.mjs - do not hand-edit; edit search-index.json related[] for manual links.',
      mode: MODE,
      model: MODE === 'embed' ? MODEL : null,
      count: records.length,
    },
    similar,
  };
  await writeFile(OUT_PATH, JSON.stringify(output, null, 2) + '\n');
  console.log('Wrote ' + records.length + ' x ' + TOP_N + ' neighbors -> ' + path.relative(ROOT, OUT_PATH));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
