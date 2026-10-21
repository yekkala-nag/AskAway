/**
 * Search — the single public search service for AskAway.
 *
 * API:
 *   search(query, { limit }) -> Promise<Result[]>
 *     Result = { id, title, module, summary, matchedTerms, type, score }
 *   similar(tabId, { limit }) -> Promise<Related[]>
 *     manual `related` links first, then embedding/lexical neighbors, deduped,
 *     self excluded. Related = { id, title, module, summary, type, source }
 *   suggest(query) -> Promise<{ suggestion, from, to } | null>
 *   ensureReady() / isReady()  — first-open lazy loading of MiniSearch + JSON
 *   filterTabIds(query)        — lightweight id set for the sidebar
 *   setSemanticEmbedder(fn)    — opt-in runtime semantic search (off by default)
 *
 * Query pipeline: normalize → expand synonyms/abbreviations → MiniSearch
 * (boost title > tags = aliases > summary > body, prefix + fuzzy ~0.2) → rank.
 * The index (search-index.json) and similar.json are dynamic imports, so they
 * never enter the main bundle. Tab ids are never rewritten — results link
 * straight to `?tab=<id>`.
 */

import {
  createSearchEngine,
  rrfMerge,
  groupByModule,
  DEFAULT_LIMIT,
} from './engine.js';

let engine = null;
let similarMap = {};
let loadPromise = null;
let semanticEmbedder = null;
let semanticEnabled = false;

try {
  semanticEnabled =
    typeof import.meta !== 'undefined' && import.meta.env?.VITE_SEMANTIC_SEARCH === '1';
} catch {
  semanticEnabled = false;
}

export function setSemanticEmbedder(fn) {
  semanticEmbedder = fn;
}

export function isSemanticSearchActive() {
  return semanticEnabled && typeof semanticEmbedder === 'function' && !!engine;
}

export function isReady() {
  return !!engine;
}

/** Load MiniSearch + index + similar.json on first use. */
export function ensureReady() {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const [indexMod, similarMod] = await Promise.all([
      import('./search-index.json'),
      import('./similar.json'),
    ]);
    const records = indexMod.default?.records || indexMod.records || [];
    similarMap = similarMod.default?.similar || similarMod.similar || {};
    engine = createSearchEngine(records);
    return engine;
  })();
  return loadPromise;
}

const toResult = (hit) => {
  const rec = engine.getRecord(hit.id) || {};
  return {
    id: hit.id,
    title: hit.title || rec.title || hit.id,
    module: hit.module || rec.module || 'other',
    summary: hit.summary || rec.summary || '',
    matchedTerms: hit.terms || [],
    type: rec.kind || 'topic',
    score: hit.score,
  };
};

async function semanticIds(rawQuery, limit) {
  try {
    const vec = await semanticEmbedder(rawQuery);
    if (!Array.isArray(vec) || vec.length === 0) return [];
    const scored = [];
    for (const rec of engine.records) {
      if (!Array.isArray(rec.embedding)) continue;
      let dot = 0;
      const n = Math.min(rec.embedding.length, vec.length);
      for (let i = 0; i < n; i++) dot += rec.embedding[i] * vec[i];
      if (dot > 0) scored.push({ id: rec.id, score: dot });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.id);
  } catch {
    return [];
  }
}

/**
 * Ranked topic search.
 * @returns {Promise<Array<{id,title,module,summary,matchedTerms,type,score}>>}
 */
export async function search(rawQuery, { limit = DEFAULT_LIMIT } = {}) {
  await ensureReady();
  const q = (rawQuery || '').trim();
  if (!q) return [];
  const { results } = engine.search(q, { limit: limit * 2 });

  if (isSemanticSearchActive() && results.length) {
    const semIds = await semanticIds(q, limit * 2);
    if (semIds.length) {
      const fused = rrfMerge([results.map((r) => r.id), semIds]);
      const byId = new Map(results.map((r) => [r.id, r]));
      return fused
        .filter((f) => byId.has(f.id))
        .slice(0, limit)
        .map((f) => toResult(byId.get(f.id)));
    }
  }
  return results.slice(0, limit).map(toResult);
}

/**
 * Related topics for a tab: curated `related[]` first, then similar.json
 * neighbors; deduped, self excluded.
 */
export async function similar(tabId, { limit = 6 } = {}) {
  await ensureReady();
  const related = engine.getRelated(tabId, similarMap, { limit });
  return related.map((r) => {
    const rec = engine.getRecord(r.id) || {};
    return {
      id: r.id,
      title: r.title,
      module: r.module,
      summary: r.summary || '',
      type: rec.kind || 'topic',
      source: r.source,
    };
  });
}

/** "Did you mean…" for zero-result queries. */
export async function suggest(rawQuery) {
  await ensureReady();
  return engine.suggest(rawQuery);
}

/** Lightweight id filter for the sidebar (same engine, no grouping). */
export async function filterTabIds(rawQuery, { limit = 80 } = {}) {
  await ensureReady();
  const results = await search(rawQuery, { limit });
  return new Set(results.map((r) => r.id));
}

export async function getRecord(tabId) {
  await ensureReady();
  return engine.getRecord(tabId);
}

export { groupByModule, rrfMerge };
