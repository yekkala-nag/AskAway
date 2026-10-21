import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  createSearchEngine,
  rrfMerge,
  groupByModule,
  damerauLevenshtein,
} from '../src/search/engine.js';
import { highlightSegments } from '../src/search/highlight.js';

const { records } = JSON.parse(
  await readFile(new URL('../src/search/search-index.json', import.meta.url), 'utf8')
);
const { similar } = JSON.parse(
  await readFile(new URL('../src/search/similar.json', import.meta.url), 'utf8')
);
const engine = createSearchEngine(records);

const topIds = (q, n = 3) => engine.search(q, { limit: 10 }).results.slice(0, n).map((r) => r.id);

test('index shape: one record per tab with required fields', () => {
  assert.ok(records.length > 100, 'index should cover the registry');
  for (const r of records) {
    assert.equal(typeof r.id, 'string');
    assert.equal(typeof r.title, 'string');
    assert.equal(typeof r.module, 'string');
    assert.ok(Array.isArray(r.tags));
    assert.ok(Array.isArray(r.aliases));
    assert.ok(Array.isArray(r.related));
  }
});

// ── 15+ sample queries (typos, abbreviations, concepts) ────────────────────
const SAMPLE_QUERIES = [
  { q: 'rag', expected: 'rag' },
  { q: 'mcp', expected: 'mcpclient' },
  { q: 'model context protocol', expected: 'mcpclient' },
  { q: 'stop hallucinations', expected: 'hallucination' },
  { q: 'reduce hallucinations', expected: 'hallucination' },
  { q: 'how do agents remember things', expected: 'agentmemory' },
  { q: 'agent memory', expected: 'agentmemory' },
  { q: 'langgraph', expected: 'langgraph' },
  { q: 'fine tune llm', expected: 'llmfinetuning' },
  { q: 'qlora', expected: 'llmfinetuning' },
  { q: 'vector database', expected: 'vectordbops' },
  { q: 'chunking', expected: 'ragchunking' },
  { q: 'lstm', expected: 'lstm' },
  { q: 'human in the loop', expected: 'agenthitl' },
  { q: 'text to sql', expected: 'texttosql' },
  { q: 'reranking', expected: 'rerankers' },
  { q: 'guardrails', expected: 'guardrails' },
  { q: 'prompt injection', expected: 'guardrails' },
  { q: 'diffusion', expected: 'diffusionmodels' },
  { q: 'eval', expected: 'llmevals' },
  // typos
  { q: 'memroy', expected: 'agentmemory' },
  { q: 'hallucnation', expected: 'hallucination' },
  { q: 'guadrails', expected: 'guardrails' },
  { q: 'strucutred outputs', expected: 'structuredoutputs' },
  { q: 'grapph rag', expectedInTop3: ['rag', 'temporalgraphrag', 'graphrag_system1', 'graphtraversalknowledge'] },
];

for (const { q, expected, expectedInTop3 } of SAMPLE_QUERIES) {
  test(`query: ${JSON.stringify(q)}`, () => {
    const ids = topIds(q);
    assert.ok(ids.length > 0, `expected hits for ${q}`);
    if (expected) {
      assert.equal(ids[0], expected, `expected "${q}" → ${expected}, got ${ids.join(', ')}`);
    }
    if (expectedInTop3) {
      assert.ok(
        ids.some((id) => expectedInTop3.includes(id)),
        `expected one of ${expectedInTop3.join('/')} in top 3 for "${q}", got ${ids.join(', ')}`
      );
    }
  });
}

// 15-query acceptance battery: canonical hub must land in the top 3.
const ACCEPTANCE_QUERIES = [
  ['rag', ['rag']],
  ['retreival', ['rag', 'filtering']],
  ['MCP', ['mcpclient']],
  ['model context protocol', ['mcpclient']],
  ['guardrails', ['guardrails']],
  ['lstm', ['lstm']],
  ['how do agents remember things', ['agentmemory']],
  ['reduce hallucinations', ['hallucination']],
  ['hybrid search bm25', ['rag', 'filtering']],
  ['finops cost', ['finops']],
  ['observability', ['observability']],
  ['multi agent swarm', ['zerocostmultiagent', 'multiagent', 'multiagentcoord']],
  ['chunking', ['ragchunking']],
  ['langgraph', ['langgraph']],
  ['tensor', ['keras3', 'archconcepts', 'selfattention']],
];

for (const [q, expectedAny] of ACCEPTANCE_QUERIES) {
  test(`acceptance: ${JSON.stringify(q)}`, () => {
    const ids = topIds(q);
    assert.ok(
      ids.some((id) => expectedAny.includes(id)),
      `expected one of ${expectedAny.join('/')} in top 3 for "${q}", got ${ids.join(', ')}`
    );
  });
}

test('empty query returns no results', () => {
  assert.deepEqual(engine.search('').results, []);
});

test('prefix matching: "langgr" finds langgraph', () => {
  const ids = topIds('langgr');
  assert.ok(ids.includes('langgraph'), `got ${ids.join(', ')}`);
});

test('did-you-mean suggests a correction for gibberish-ish tokens', () => {
  const { results, didYouMean } = engine.search('guadrals', { limit: 5 });
  if (results.length === 0) {
    // suggestion path
    assert.ok(didYouMean && didYouMean.suggestion.includes('guardrail'), JSON.stringify(didYouMean));
  } else {
    // fuzzy path already found guardrails
    assert.ok(results.some((r) => r.id.includes('guardrail')), results.map((r) => r.id).join(','));
  }
});

test('related topics: manual links rank first, self excluded', () => {
  const related = engine.getRelated('guardrails', similar, { limit: 6 });
  assert.ok(related.length > 0);
  assert.ok(!related.some((r) => r.id === 'guardrails'), 'self must be excluded');
  const manualIdx = related.findIndex((r) => r.source === 'manual');
  const similarIdx = related.findIndex((r) => r.source === 'similar');
  if (manualIdx !== -1 && similarIdx !== -1) {
    assert.ok(manualIdx < similarIdx, 'manual links rank first');
  }
});

test('related topics for every tab: ≤ limit, no self, known ids', () => {
  for (const r of records.slice(0, 30)) {
    const related = engine.getRelated(r.id, similar, { limit: 5 });
    assert.ok(related.length <= 5);
    assert.ok(!related.some((x) => x.id === r.id));
    for (const rel of related) {
      assert.ok(engine.getRecord(rel.id), `related id ${rel.id} must exist`);
    }
  }
});

test('groupByModule buckets results and preserves per-group rank order', () => {
  const results = engine.search('agent', { limit: 12 }).results;
  const groups = groupByModule(results, {});
  assert.ok(groups.length >= 1);
  // Same set of ids, and each group keeps its internal (score) order
  const flat = groups.flatMap((g) => g.items.map((i) => i.id));
  assert.equal(flat.length, results.length);
  assert.deepEqual(new Set(flat), new Set(results.map((r) => r.id)));
  for (const g of groups) {
    const ranks = g.items.map((i) => results.findIndex((r) => r.id === i.id));
    const sorted = [...ranks].sort((a, b) => a - b);
    assert.deepEqual(ranks, sorted, 'group items must keep global rank order');
  }
});

test('rrfMerge fuses rankings by rank', () => {
  const fused = rrfMerge([['a', 'b', 'c'], ['c', 'a']], 60);
  assert.equal(fused[0].id, 'a'); // rank1+rank2
  assert.equal(fused[1].id, 'c'); // rank3+rank1
  assert.equal(fused[2].id, 'b');
});

test('damerauLevenshtein handles transpositions', () => {
  assert.equal(damerauLevenshtein('memroy', 'memory'), 1);
  assert.equal(damerauLevenshtein('rag', 'rag'), 0);
  assert.ok(damerauLevenshtein('abc', 'xyz') >= 2);
});

test('highlightSegments marks matches', () => {
  const segs = highlightSegments('Vector DB Ops', ['vector', 'db']);
  assert.ok(segs.some((s) => s.match && s.text.toLowerCase() === 'vector'));
  assert.ok(segs.some((s) => s.match && s.text.toLowerCase() === 'db'));
  const none = highlightSegments('hello', []);
  assert.deepEqual(none, [{ text: 'hello', match: false }]);
});

test('similar.json has top-5 neighbors for every indexed tab', () => {
  for (const r of records) {
    const neighbors = similar[r.id];
    assert.ok(Array.isArray(neighbors), `missing neighbors for ${r.id}`);
    assert.ok(neighbors.length <= 5);
    assert.ok(!neighbors.some((n) => n.id === r.id), `self-neighbor for ${r.id}`);
  }
});
