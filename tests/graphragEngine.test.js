import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ENTITY_PAIRS,
  evaluateEntityGate,
  SUBGRAPH_NODES,
  evaluatePruning,
  USE_CASES,
  THRESHOLDS,
  GRAY_FLOOR,
} from '../src/graphragSystem1/graphragEngine.js';

test('entity pairs are labeled probabilities', () => {
  assert.equal(ENTITY_PAIRS.length, 10);
  for (const p of ENTITY_PAIRS) {
    assert.equal(typeof p.same, 'boolean');
    assert.ok(p.p > 0 && p.p < 1, `p out of range: ${p.p}`);
    assert.ok(p.left && p.right);
  }
});

test('gate at 0.92: no false merges, gray band routes to System 2', () => {
  const r = evaluateEntityGate(0.92);
  assert.equal(r.tp, 4);   // 0.97, 0.96, 0.94, 0.93
  assert.equal(r.fp, 0);
  assert.equal(r.fn, 2);   // 0.91, 0.83 distinct-labeled same
  assert.equal(r.tn, 4);
  assert.equal(r.precision, 1);
  assert.ok(Math.abs(r.recall - 4 / 6) < 1e-9);
  // non-merge pairs above the gray floor: 0.88, 0.83, 0.78, 0.71, 0.69, 0.91
  assert.equal(r.llmCalls, 6);
  assert.ok(r.costTotal > 0);
  assert.ok(r.costS2 > r.costS1); // LLM calls dominate the batch cost
});

test('lowering the threshold trades precision for LLM calls', () => {
  const low = evaluateEntityGate(0.5);
  assert.equal(low.llmCalls, 0);            // System 1 decides everything
  assert.equal(low.recall, 1);              // all true pairs merged
  assert.ok(low.precision < evaluateEntityGate(0.92).precision);

  let prevCalls = -1;
  for (let t = 0.5; t <= 0.99; t += 0.01) {
    const r = evaluateEntityGate(Number(t.toFixed(2)));
    assert.ok(r.llmCalls >= prevCalls, `LLM calls must not decrease at t=${t}`);
    prevCalls = r.llmCalls;
  }
});

test('verdict function respects the gray floor', () => {
  const r = evaluateEntityGate(0.95);
  assert.equal(r.verdictOf({ p: 0.96 }), 'merge');
  assert.equal(r.verdictOf({ p: 0.70 }), 'system2');
  assert.equal(r.verdictOf({ p: 0.20 }), 'distinct');
  assert.equal(r.verdictOf({ p: GRAY_FLOOR }), 'system2');
});

test('subgraph tokens sum and pruning floor at 0.65', () => {
  const total = SUBGRAPH_NODES.reduce((s, n) => s + n.tokens, 0);
  assert.equal(total, 3310);
  assert.equal(SUBGRAPH_NODES.length, 14);

  const r = evaluatePruning(0.65);
  assert.equal(r.keptCount, 8);
  assert.equal(r.droppedCount, 6);
  assert.equal(r.tokensAfter, 2370);        // 410+340+380+290+150+260+300+240
  assert.equal(r.tokensBefore - r.tokensAfter, r.tokensDropped);
  assert.ok(Math.abs(r.pctCut - (940 / 3310) * 100) < 1e-9);
  assert.ok(Math.abs(r.costBefore - 3310 * 0.003) < 1e-9);
  assert.ok(Math.abs(r.costAfter - 2370 * 0.003) < 1e-9);
  assert.ok(r.costAfter < r.costBefore);
});

test('pruning is monotonic: higher floor never keeps more tokens', () => {
  let prev = Infinity;
  for (let t = 0; t <= 0.95; t += 0.05) {
    const r = evaluatePruning(Number(t.toFixed(2)));
    assert.ok(r.tokensAfter <= prev, `tokens must not increase at t=${t}`);
    prev = r.tokensAfter;
  }
  const all = evaluatePruning(0);
  assert.equal(all.keptCount, 14);
  assert.equal(all.pctCut, 0);
  const none = evaluatePruning(1);
  assert.equal(none.keptCount, 0);
  assert.equal(none.costAfter, 0);
});

test('use cases and thresholds cover all three stages and primitives', () => {
  assert.ok(USE_CASES.length >= 7);
  const stages = new Set(USE_CASES.map((u) => u.stage));
  assert.deepEqual([...stages].sort(), ['Ingestion', 'Maintenance', 'Query']);
  for (const u of USE_CASES) {
    assert.ok(u.primitive.includes('noul') || u.primitive.includes('choice') || u.primitive.includes('score'));
    assert.ok(u.escape.length > 0);
  }
  assert.ok(THRESHOLDS.length >= 5);
  const prims = new Set(THRESHOLDS.map((t) => t.primitive));
  for (const p of ['noul', 'choice', 'score']) assert.ok(prims.has(p), `missing ${p}`);
});
