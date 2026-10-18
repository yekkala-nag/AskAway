import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PATTERNS,
  CONTEXT_TECHNIQUES,
  TRAJECTORY_METRICS,
  PATTERNS_CODE,
  MAX_ITERATIONS,
  REPETITION_LIMIT,
  pickPattern,
  circuitBreaker,
  loopCost,
} from '../src/agentPatterns/patternsEngine.js';

const PATTERN_IDS = new Set(PATTERNS.map((p) => p.id));

test('PATTERNS: six entries with unique names and full field set', () => {
  assert.equal(PATTERNS.length, 6);
  const names = PATTERNS.map((p) => p.name);
  assert.equal(new Set(names).size, 6);
  assert.deepEqual(PATTERNS.map((p) => p.id), ['react', 'sequential', 'router', 'supervisor', 'reflection', 'swarm']);
  assert.deepEqual(PATTERNS.map((p) => p.n), [1, 2, 3, 4, 5, 6]);
  for (const p of PATTERNS) {
    for (const field of ['id', 'n', 'name', 'icon', 'how', 'contextTip', 'pros', 'cons', 'useWhen', 'avoidWhen']) {
      assert.ok(p[field], `${p.id} is missing ${field}`);
    }
    assert.ok(Array.isArray(p.pros) && p.pros.length >= 1, `${p.id} needs pros`);
    assert.ok(Array.isArray(p.cons) && p.cons.length >= 1, `${p.id} needs cons`);
  }
});

test('pickPattern: all-false profile falls back to react', () => {
  const r = pickPattern({});
  assert.deepEqual(r.patterns, ['react']);
  assert.ok(r.reasons.react.length > 0);
  const r2 = pickPattern({ knownSteps: false, mixedIntent: false, parallelizable: false, openEnded: false, highStakes: false });
  assert.deepEqual(r2.patterns, ['react']);
  assert.deepEqual(pickPattern(null).patterns, ['react']);
});

test('pickPattern: known steps without parallelism maps to sequential', () => {
  assert.deepEqual(pickPattern({ knownSteps: true }).patterns, ['sequential']);
  assert.ok(pickPattern({ knownSteps: true }).reasons.sequential.length > 0);
});

test('pickPattern: mixed intent maps to router', () => {
  assert.deepEqual(pickPattern({ mixedIntent: true }).patterns, ['router']);
});

test('pickPattern: open-ended maps to react', () => {
  assert.deepEqual(pickPattern({ openEnded: true }).patterns, ['react']);
});

test('pickPattern: open-ended parallel research sandbox maps to swarm', () => {
  assert.deepEqual(pickPattern({ openEnded: true, parallelizable: true }).patterns, ['swarm']);
});

test('pickPattern: high stakes maps to reflection + supervisor', () => {
  assert.deepEqual(pickPattern({ highStakes: true }).patterns, ['reflection', 'supervisor']);
});

test('pickPattern: known + parallelizable maps to supervisor', () => {
  assert.deepEqual(pickPattern({ knownSteps: true, parallelizable: true }).patterns, ['supervisor']);
});

test('pickPattern: every recommendation references a known pattern and carries a reason', () => {
  const profiles = [
    {},
    { knownSteps: true },
    { mixedIntent: true },
    { openEnded: true, parallelizable: true },
    { highStakes: true, mixedIntent: true, knownSteps: true, parallelizable: true, openEnded: true },
  ];
  for (const profile of profiles) {
    const r = pickPattern(profile);
    assert.ok(r.patterns.length >= 1, 'at least one recommendation always');
    for (const id of r.patterns) {
      assert.ok(PATTERN_IDS.has(id), `unknown pattern id: ${id}`);
      assert.ok(r.reasons[id], `missing reason for ${id}`);
    }
  }
});

test('circuitBreaker: three identical consecutive calls trip', () => {
  assert.equal(REPETITION_LIMIT, 3);
  assert.equal(circuitBreaker(3, ['search_docs', 'search_docs', 'search_docs']).trip, true);
  assert.equal(circuitBreaker(4, ['a', 'b', 'b', 'b']).trip, true);
  assert.ok(circuitBreaker(3, ['search_docs', 'search_docs', 'search_docs']).reason.includes('search_docs'));
});

test('circuitBreaker: distinct or too-short call history stays clear', () => {
  assert.equal(circuitBreaker(3, ['search_docs', 'read_file', 'summarize']).trip, false);
  assert.equal(circuitBreaker(2, ['a', 'a']).trip, false);
  assert.equal(circuitBreaker(0, []).trip, false);
  assert.equal(circuitBreaker(5, ['a', 'b', 'a', 'b', 'a']).trip, false);
  assert.equal(circuitBreaker(5, ['a', 'b', 'a', 'b', 'a']).reason, '');
});

test('circuitBreaker: iteration cap trips even with distinct calls', () => {
  assert.equal(MAX_ITERATIONS, 12);
  assert.equal(circuitBreaker(MAX_ITERATIONS - 1, ['a', 'b', 'c']).trip, false);
  assert.equal(circuitBreaker(MAX_ITERATIONS, ['a', 'b', 'c']).trip, true);
  assert.ok(circuitBreaker(MAX_ITERATIONS, []).reason.includes('12'));
});

test('CONTEXT_TECHNIQUES: five entries with saving and detail', () => {
  assert.equal(CONTEXT_TECHNIQUES.length, 5);
  for (const t of CONTEXT_TECHNIQUES) {
    assert.ok(t.name && t.saving && t.detail, 'every technique needs name/saving/detail');
  }
  assert.equal(new Set(CONTEXT_TECHNIQUES.map((t) => t.name)).size, 5);
});

test('TRAJECTORY_METRICS: three entries with what it catches and spike meaning', () => {
  assert.equal(TRAJECTORY_METRICS.length, 3);
  for (const m of TRAJECTORY_METRICS) {
    assert.ok(m.metric && m.whatItCatches && m.spikeMeans, 'every metric needs all three fields');
  }
  assert.equal(new Set(TRAJECTORY_METRICS.map((m) => m.metric)).size, 3);
});

test('PATTERNS_CODE: supervisor pseudocode with ledger and local-context workers', () => {
  assert.equal(typeof PATTERNS_CODE, 'string');
  const lines = PATTERNS_CODE.split('\n');
  assert.ok(lines.length >= 20 && lines.length <= 30, `expected ~25 lines, got ${lines.length}`);
  assert.ok(PATTERNS_CODE.includes('ledger'));
  assert.ok(PATTERNS_CODE.includes('run_supervised'));
  assert.ok(PATTERNS_CODE.includes('load_local'));
  assert.ok(PATTERNS_CODE.includes('check_breakers'));
  assert.ok(!PATTERNS_CODE.includes('${'), 'no unescaped template interpolation in pseudocode');
});

test('loopCost: caching beats resending everything as N grows', () => {
  const c1 = loopCost(1, 1200, 400);
  assert.deepEqual(c1, { uncached: 1600, cached: 1600, saved: 0, pct: 0 });
  const c5 = loopCost(5, 1200, 400);
  assert.equal(c5.uncached, 12000);
  assert.equal(c5.cached, 3200);
  assert.equal(c5.saved, 8800);
  assert.equal(c5.pct, 73);
  const c10 = loopCost(10, 1200, 800);
  assert.ok(c10.cached < c10.uncached);
  assert.ok(c10.pct > c5.pct, 'savings percentage grows with iteration count');
});
