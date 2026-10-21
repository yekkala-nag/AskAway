/**
 * Search engine factory — pure, dependency-light (MiniSearch only).
 * Used by the browser via searchService.js and directly by Node tests.
 */

import MiniSearch from 'minisearch';
import {
  buildSynonymLookup,
  buildSearchQuery,
  expandQuery,
  tokenize,
  STOP_WORDS,
} from './synonyms.js';
import { highlightSegments } from './highlight.js';

export const FIELD_BOOSTS = {
  title: 6,
  tags: 3,
  aliases: 3,
  summary: 2,
  body: 1,
};

// ~0.2 × term length, rounded up; minimum coverage for short-word transpositions
// (e.g. "memroy" → memory needs distance 2 at length 6).
export const fuzzyDistance = (term) =>
  term.length >= 6 ? 2 : term.length >= 4 ? 1 : 0;

export const DEFAULT_LIMIT = 16;

/**
 * @param {Array<object>} records — search-index.json records:
 *   { id, title, module, tags[], aliases[], summary, body?, related[] }
 */
export function createSearchEngine(records) {
  const lookup = buildSynonymLookup();
  // NOTE: combineWith is deliberately NOT set — explicit AND/OR in the
  // expanded query strings would otherwise be overridden by the option.
  const mini = new MiniSearch({
    fields: ['title', 'tags', 'aliases', 'summary', 'body'],
    storeFields: ['title', 'module', 'tags', 'aliases', 'summary', 'related'],
    idField: 'id',
    searchOptions: {
      boost: FIELD_BOOSTS,
      prefix: true,
      fuzzy: fuzzyDistance,
    },
    processTerm: (term) => {
      const t = term.toLowerCase();
      if (!t || STOP_WORDS.has(t)) return null;
      return t;
    },
  });
  mini.addAll(records);

  const byId = new Map(records.map((r) => [r.id, r]));

  const searchOpts = () => ({ boost: FIELD_BOOSTS, prefix: true, fuzzy: fuzzyDistance });

  /** Flat ranked search. Returns { results, query } where results have { id, score, ...stored }. */
  function search(rawQuery, { limit = DEFAULT_LIMIT } = {}) {
    const q = (rawQuery || '').trim();
    if (!q) return { results: [], query: q };
    const { query: luceneQuery, softQuery } = buildSearchQuery(q, lookup);
    let hits = [];
    try {
      hits = mini.search(luceneQuery, searchOpts());
    } catch {
      hits = [];
    }
    // Plain AND-ed original tokens: exact-match intent, fused in below.
    const plainTokens = tokenize(q)
      .filter((t) => !STOP_WORDS.has(t))
      .map((t) => t.replace(/([\\"()])/g, '\\$1'));
    let plainHits = [];
    if (plainTokens.length) {
      try {
        plainHits = mini.search(plainTokens.join(' AND '), searchOpts());
      } catch {
        plainHits = [];
      }
    }
    if (hits.length === 0) hits = plainHits;

    // Reciprocal rank fusion of synonym-expanded and plain rankings so
    // exact token matches (e.g. "rag" → 9 RAG Architectures) are not
    // drowned out by high-frequency synonym terms.
    if (hits.length && plainHits.length) {
      const fused = rrfMerge(
        [hits.map((h) => h.id), plainHits.map((h) => h.id)],
        60
      );
      const byIdHit = new Map(hits.map((h) => [h.id, h]));
      const plainRank = new Map(plainHits.map((h, i) => [h.id, i]));
      hits = fused
        .map((f) => {
          const h = byIdHit.get(f.id);
          if (!h) return null;
          const pr = plainRank.has(f.id) ? plainHits.find((x) => x.id === f.id) : null;
          return pr ? { ...h, score: h.score + pr.score } : h;
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score);
    }

    // Optional per-record rank multiplier (search-index.json `rank` field,
    // e.g. 1.4 for canonical overview tabs) + title exact-term bonus.
    if (hits.length) {
      hits = hits
        .map((h) => {
          const rec = byId.get(h.id);
          const titleTokens = new Set(tokenize(rec?.title || ''));
          let mult = typeof rec?.rank === 'number' ? rec.rank : 1;
          for (const t of h.terms || []) {
            if (titleTokens.has(t)) {
              mult *= 1.6;
              break;
            }
          }
          return mult !== 1 ? { ...h, score: h.score * mult } : h;
        })
        .sort((a, b) => b.score - a.score);
    }

    // Soft-group boost: common verbs ("stop", "reduce") only nudge docs
    // that already match the content terms — max +10% of the doc's score.
    if (softQuery && hits.length) {
      try {
        const softHits = mini.search(softQuery, searchOpts());
        if (softHits.length) {
          const softById = new Map(softHits.map((h) => [h.id, h.score]));
          const maxSoft = Math.max(...softById.values(), 1);
          hits = hits
            .map((h) => {
              const s = softById.get(h.id);
              return s ? { ...h, score: h.score * (1 + 0.1 * (s / maxSoft)) } : h;
            })
            .sort((a, b) => b.score - a.score);
        }
      } catch {
        /* soft boost is best-effort */
      }
    }
    const results = hits.slice(0, limit).map((h) => ({
      id: h.id,
      score: h.score,
      title: h.title,
      module: h.module,
      tags: h.tags || [],
      aliases: h.aliases || [],
      summary: h.summary || '',
      related: h.related || [],
      terms: h.terms || [],
    }));
    return { results, query: q };
  }

  function getRecord(id) {
    return byId.get(id) || null;
  }

  /**
   * "Did you mean..." — nearest vocabulary term to the least-recognized token.
   * Vocabulary = words from titles + tags + aliases.
   */
  function suggest(rawQuery) {
    const tokens = tokenize(rawQuery).filter((t) => !STOP_WORDS.has(t) && t.length > 2);
    if (tokens.length === 0) return null;
    const vocab = new Set();
    for (const r of records) {
      for (const t of tokenize(r.title)) if (t.length > 2) vocab.add(t);
      for (const arr of [r.tags, r.aliases]) {
        for (const entry of arr || []) {
          for (const t of tokenize(entry)) if (t.length > 2) vocab.add(t);
        }
      }
    }
    let best = null;
    for (const tok of tokens) {
      if (vocab.has(tok)) continue;
      // Already fuzzy-matched fine? Still offer a correction candidate.
      for (const v of vocab) {
        const d = damerauLevenshtein(tok, v);
        const maxD = tok.length <= 4 ? 1 : 2;
        if (d >= 1 && d <= maxD) {
          const cand = { from: tok, to: v, distance: d };
          if (!best || cand.distance < best.distance) best = cand;
        }
      }
    }
    if (!best) return null;
    const suggestion = rawQuery.replace(
      new RegExp(`\\b${escapeRegExp(best.from)}\\b`, 'i'),
      best.to
    );
    return { suggestion, from: best.from, to: best.to };
  }

  /** Related topics for a tab: manual `related[]` first, then similar.json neighbors. */
  function getRelated(id, similarMap = {}, { limit = 6 } = {}) {
    const rec = byId.get(id);
    if (!rec) return [];
    const seen = new Set([id]);
    const out = [];
    for (const rid of rec.related || []) {
      if (!seen.has(rid) && byId.has(rid)) {
        seen.add(rid);
        out.push({ id: rid, source: 'manual' });
      }
    }
    for (const neighbor of similarMap[id] || []) {
      const nid = typeof neighbor === 'string' ? neighbor : neighbor.id;
      if (!seen.has(nid) && byId.has(nid)) {
        seen.add(nid);
        out.push({ id: nid, source: 'similar' });
      }
      if (out.length >= limit) break;
    }
    return out.slice(0, limit).map((n) => ({
      ...n,
      title: byId.get(n.id).title,
      module: byId.get(n.id).module,
      summary: byId.get(n.id).summary,
    }));
  }

  return { search, suggest, getRecord, getRelated, records, mini };
}

// ── Helpers (exported for tests + UI) ──────────────────────────────────────

/** Damerau-Levenshtein distance (optimal string alignment), cheap for short words. */
export function damerauLevenshtein(a, b) {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (Math.abs(al - bl) > 3) return 99;
  const d = Array.from({ length: al + 1 }, (_, i) => [i, ...Array(bl).fill(0)]);
  for (let j = 0; j <= bl; j++) d[0][j] = j;
  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1); // transposition
      }
    }
  }
  return d[al][bl];
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Group results by module id, preserving module order of first appearance by best rank. */
export function groupByModule(results, moduleMeta = {}) {
  const groups = [];
  const byModule = new Map();
  for (const r of results) {
    const key = r.module || 'other';
    if (!byModule.has(key)) {
      const g = { module: key, title: moduleMeta[key]?.title || key, icon: moduleMeta[key]?.icon || '📦', items: [] };
      byModule.set(key, g);
      groups.push(g);
    }
    byModule.get(key).items.push(r);
  }
  return groups;
}

/**
 * Reciprocal rank fusion of multiple ranked id-lists.
 * rankings: array of arrays of ids (best first). Returns ids sorted by RRF score.
 */
export function rrfMerge(rankings, k = 60) {
  const scores = new Map();
  for (const ranking of rankings) {
    ranking.forEach((id, idx) => {
      scores.set(id, (scores.get(id) || 0) + 1 / (k + idx + 1));
    });
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));
}

export { expandQuery, buildSearchQuery, tokenize, highlightSegments };
