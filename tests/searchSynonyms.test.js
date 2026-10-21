import test from 'node:test';
import assert from 'node:assert/strict';
import {
  expandQuery,
  buildSearchQuery,
  buildSynonymLookup,
  tokenize,
  STOP_WORDS,
} from '../src/search/synonyms.js';

test('tokenize splits and normalizes', () => {
  assert.deepEqual(tokenize('Graph-RAG: 2024!'), ['graph', 'rag', '2024']);
  assert.deepEqual(tokenize(''), []);
});

test('stop words are dropped from concept queries', () => {
  const { droppedTokens } = expandQuery('how do agents remember things');
  assert.ok(droppedTokens.includes('how'));
  assert.ok(droppedTokens.includes('do'));
  assert.ok(droppedTokens.includes('things'));
});

test('synonym groups expand abbreviations (mcp ↔ model context protocol)', () => {
  const { groups } = expandQuery('mcp');
  assert.equal(groups.length, 1);
  assert.ok(groups[0].tokens.includes('mcp'));
});

test('multi-word typed phrase collapses into one group with singles', () => {
  const { groups } = expandQuery('model context protocol');
  assert.equal(groups.length, 1);
  assert.ok(groups[0].tokens.includes('mcp'));
  assert.equal(groups[0].phrase, 'model context protocol');
});

test('rag expands to retrieval augmented generation singles', () => {
  const { groups } = expandQuery('rag');
  assert.ok(groups[0].tokens.includes('rag'));
  assert.ok(groups[0].tokens.includes('retrieval'));
});

test('mitigation verbs are marked soft', () => {
  const { groups } = expandQuery('stop hallucinations');
  const soft = groups.filter((g) => g.soft);
  const hard = groups.filter((g) => !g.soft);
  assert.equal(soft.length, 1);
  assert.ok(soft[0].tokens.includes('stop'));
  assert.ok(hard.length >= 1);
  assert.ok(hard.some((g) => g.tokens.includes('hallucination')));
});

test('all-soft query still produces a query string', () => {
  const { query, softQuery } = buildSearchQuery('mitigate');
  assert.ok(query.length > 0);
  assert.equal(softQuery, '', 'soft-only queries have no separate soft clause');
});

test('buildSearchQuery AND-s hard groups and keeps softQuery separate', () => {
  // Two hard groups ("agent" + "memory") must be AND-ed explicitly
  const two = buildSearchQuery('agent memory');
  assert.ok(two.query.includes(' AND '), two.query);
  // One hard group + one soft: hard query stays clean, verb goes to softQuery
  const { query, softQuery } = buildSearchQuery('stop hallucinations');
  assert.ok(query.includes('hallucination'), query);
  assert.ok(softQuery.includes('stop'), softQuery);
  assert.ok(!query.includes('stop'), `soft verb leaked into hard query: ${query}`);
});

test('multi-word synonym members never OR in as loose tokens', () => {
  // "lstm" group contains the phrase "long short-term memory" — it must not
  // be OR-ed as loose tokens (that would drag in every memory tab).
  const { query } = buildSearchQuery('lstm');
  assert.ok(query.includes('lstm'), query);
  assert.ok(!query.includes('long'), query);
});

test('query-time only: the index documents are not rewritten', () => {
  const lookup = buildSynonymLookup();
  assert.ok(lookup.get('mcp').members.includes('model context protocol'));
  assert.ok(lookup.get('llmops'));
  assert.ok(lookup.get('eval').members.includes('evaluation'));
});

test('stop words cover question filler', () => {
  for (const w of ['how', 'what', 'the', 'things', 'does']) {
    assert.ok(STOP_WORDS.has(w), w);
  }
});
