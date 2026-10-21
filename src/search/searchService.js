/**
 * Search service — lazy-loading singleton for the browser.
 *
 * MiniSearch, search-index.json and similar.json are all dynamic-imported
 * on first use (first CommandPalette open / first sidebar keystroke /
 * first RelatedTopics mount), so they never block the initial page load.
 *
 * Optional runtime semantic search (off by default): set
 * VITE_SEMANTIC_SEARCH=1 and inject an embedder via setSemanticEmbedder().
 * Query results are then merged with keyword results via reciprocal rank
 * fusion (engine.rrfMerge). Without an embedder the flag is a no-op.
 */

import { createSearchEngine, groupByModule, rrfMerge, DEFAULT_LIMIT } from './engine.js';

let engine = null;
let similarMap = {};
let loadPromise = null;
let semanticEmbedder = null;
let semanticEnabled = false;

try {
  semanticEnabled = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SEMANTIC_SEARCH === '1';
} catch {
  semanticEnabled = false;
}

/** Inject a function (text) => Promise<number[]> to enable runtime semantic search. */
export function setSemanticEmbedder(fn) {
  semanticEmbedder = fn;
}

export function isSemanticSearchActive() {
  return semanticEnabled && typeof semanticEmbedder === 'function' && !!engine;
}

export function isReady() {
  return !!engine;
}

export function ensureSearchReady() {
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

async function semanticSearch(rawQuery, limit) {
  try {
    const vec = await semanticEmbedder(rawQuery);
    if (!Array.isArray(vec) || vec.length === 0) return [];
    const scored = [];
    for (const rec of engine.records) {
      const sim = rec.embedding;
      if (!Array.isArray(sim)) continue;
      let dot = 0;
      const n = Math.min(sim.length, vec.length);
      for (let i = 0; i < n; i++) dot += sim[i] * vec[i];
      if (dot > 0) scored.push({ id: rec.id, score: dot });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.id);
  } catch {
    return [];
  }
}

/**
 * Search topics. Resolves with:
 *   { results, groups, didYouMean, semantic: boolean }
 * results are flat (best first); groups are module buckets for rendering.
 */
export async function searchTopics(rawQuery, { limit = DEFAULT_LIMIT, moduleMeta = {} } = {}) {
  await ensureSearchReady();
  const q = (rawQuery || '').trim();
  if (!q) {
    return { results: [], groups: [], didYouMean: null, semantic: false };
  }

  const { results, query } = engine.search(q, { limit: limit * 2 });
  let finalResults = results;

  if (isSemanticSearchActive()) {
    const [semIds, kwIds] = await Promise.all([
      semanticSearch(q, limit * 2),
      Promise.resolve(results.map((r) => r.id)),
    ]);
    if (semIds.length) {
      const fused = rrfMerge([kwIds, semIds]);
      const byId = new Map(results.map((r) => [r.id, r]));
      finalResults = fused
        .filter((f) => byId.has(f.id))
        .map((f) => ({ ...byId.get(f.id), rrfScore: f.score }));
    }
  }

  finalResults = finalResults.slice(0, limit);
  const didYouMean = finalResults.length === 0 ? engine.suggest(query) : null;
  return {
    results: finalResults,
    groups: groupByModule(finalResults, moduleMeta),
    didYouMean,
    semantic: isSemanticSearchActive(),
  };
}

/** Related topics for a tab: manual related[] first, then similar.json neighbors. */
export async function getRelatedTopics(tabId, { limit = 6 } = {}) {
  await ensureSearchReady();
  return engine.getRelated(tabId, similarMap, { limit });
}

/** Lightweight id filter for the sidebar (same engine, no grouping). */
export async function filterTabIds(rawQuery, { limit = 60 } = {}) {
  await ensureSearchReady();
  const { results } = engine.search(rawQuery, { limit });
  return new Set(results.map((r) => r.id));
}

export async function getSearchRecord(tabId) {
  await ensureSearchReady();
  return engine.getRecord(tabId);
}

export { rrfMerge, groupByModule };
