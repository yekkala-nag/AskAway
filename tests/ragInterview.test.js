import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SECTIONS,
  QUESTIONS,
  attentionAt,
  chunkStats,
  CHUNK_STRATEGIES,
  PIPELINE_STAGES,
  rrfMerge,
  weightedMerge,
  triage,
  JUDGE_BIASES,
  LATENCY_HOPS,
  totalLatency,
  answerGate,
  QUERY_TRANSFORMS,
  RISK_TABLE,
  RAGI_CODE,
} from '../src/ragInterview/ragInterviewEngine.js';

test('question wall: 30 unique numbers across 6 sections', () => {
  assert.equal(QUESTIONS.length, 30);
  assert.deepEqual(QUESTIONS.map((q) => q.n), Array.from({ length: 30 }, (_, i) => i + 1));
  assert.equal(new Set(QUESTIONS.map((q) => q.s)).size, 6);
  for (const q of QUESTIONS) {
    assert.ok(SECTIONS.some((s) => s.id === q.s), `section ${q.s} known`);
    assert.ok(/[?]$/.test(q.q) || /^(Explain|What|How|When|Core)/.test(q.q), `Q${q.n} is phrased as a question`);
    assert.ok(q.core.length > 40, `Q${q.n} has a real core answer`);
    assert.ok(q.insight.length > 40, `Q${q.n} has a real pro insight`);
  }
  assert.deepEqual(QUESTIONS.reduce((m, q) => ({ ...m, [q.s]: (m[q.s] || 0) + 1 }), {}),
    { fund: 5, ingest: 5, vec: 5, query: 5, eval: 5, prod: 5 });
});

test('attention is U-shaped: edges high, middle low', () => {
  assert.equal(attentionAt(0, 9), 1);
  assert.equal(attentionAt(8, 9), 1);
  const mid = attentionAt(4, 9);
  assert.ok(mid <= 0.31, `middle ${mid} is the weak zone`);
  assert.ok(attentionAt(1, 9) > mid && attentionAt(7, 9) > mid, 'flanks beat the middle');
  assert.equal(attentionAt(0, 1), 1);
  assert.equal(attentionAt(99, 9), 0);
});

test('chunk stats: step and redundancy follow size/overlap', () => {
  assert.deepEqual(chunkStats(500, 50), { step: 450, redundancyPct: 10 });
  assert.equal(chunkStats(256, 64).redundancyPct, 25);
  assert.throws(() => chunkStats(500, 500), /overlap/);
  assert.throws(() => chunkStats(0, 0), /size/);
});

test('pipeline: 6 core stages + the hidden eval stage', () => {
  assert.equal(PIPELINE_STAGES.length, 7);
  assert.equal(PIPELINE_STAGES.filter((s) => s.core).length, 6);
  assert.equal(PIPELINE_STAGES[6].stage, 'Evaluate & trace');
  assert.equal(PIPELINE_STAGES[6].core, false);
  assert.equal(CHUNK_STRATEGIES.length, 4);
  assert.equal(CHUNK_STRATEGIES[0].strategy, 'Fixed-size');
});

test('RRF: shared docs win, one-list docs drop', () => {
  const merged = rrfMerge(['A', 'B', 'C'], ['A', 'D', 'B'], 60);
  assert.equal(merged[0].id, 'A', 'top of both lists wins');
  assert.equal(merged[0].inLists.length, 2);
  const scoreA = 1 / 61 + 1 / 61;
  assert.ok(Math.abs(merged[0].score - scoreA) < 1e-6);
  const b = merged.find((m) => m.id === 'B');
  const c = merged.find((m) => m.id === 'C');
  assert.ok(b.score > c.score, 'B (both lists) beats C (one list only)');
  assert.deepEqual(merged.map((m) => m.id), ['A', 'B', 'D', 'C']);
});

test('weighted blend: w drives the winner', () => {
  const dense = [{ id: 'A', score: 0.9 }, { id: 'B', score: 0.5 }];
  const sparse = [{ id: 'A', score: 0.3 }, { id: 'B', score: 0.9 }];
  assert.equal(weightedMerge(dense, sparse, 0.9)[0].id, 'A');
  assert.equal(weightedMerge(dense, sparse, 0.1)[0].id, 'B');
  assert.equal(weightedMerge(dense, sparse, 0.5)[0].id, 'B');
  assert.equal(weightedMerge(dense, sparse, 0.5)[0].score, 0.7);
});

test('triage names the fix for the broken metric', () => {
  assert.equal(triage(0.5, 0.9).healthy, false);
  assert.match(triage(0.5, 0.9).verdict, /recall/);
  assert.match(triage(0.9, 0.4).verdict, /faithfulness/);
  assert.equal(triage(0.9, 0.9).healthy, true);
  assert.match(triage(0.4, 0.4).verdict, /BOTH_BROKEN/);
});

test('judge biases, latency and gates behave', () => {
  assert.deepEqual(JUDGE_BIASES.map((b) => b.bias), ['Verbosity bias', 'Self-enhancement', 'Position bias']);
  assert.equal(totalLatency(false).ms, LATENCY_HOPS.reduce((s, h) => s + h.ms, 0));
  assert.equal(totalLatency(true).ms, 12);
  assert.equal(answerGate(0.9).action, 'answer');
  assert.equal(answerGate(0.2).action, 'fallback');
  assert.equal(answerGate(Number.NaN).action, 'fallback', 'no score → abstain');
});

test('tables/code present and attribution-free content', () => {
  assert.equal(QUERY_TRANSFORMS.length, 5);
  assert.equal(RISK_TABLE.length, 3);
  assert.ok(RAGI_CODE.includes('FALLBACK') && RAGI_CODE.includes('citations=True'));
  for (const row of [...CHUNK_STRATEGIES, ...QUERY_TRANSFORMS, ...RISK_TABLE, ...JUDGE_BIASES]) {
    for (const v of Object.values(row)) {
      if (typeof v === 'string') assert.ok(!/https?:\/\//.test(v), 'no URLs in content');
    }
  }
});
