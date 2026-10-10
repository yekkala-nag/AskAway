import test from 'node:test';
import assert from 'node:assert/strict';

import {
  WEIGHTS, SUB_SCORES, GRADE_BANDS, LOOP_STEPS, COMMIT_TIMELINE,
  METHODS, EVIDENCE_ROWS, STOP_RULES, SKILL_RULES,
  clampScore, healthScore, weakestLink, gradeBand, gradeNote,
  deadCodeWalk, complexityHotspots, collapseDuplication, sameInstrumentCheck,
} from '../src/refactorHealth/refactorHealthEngine.js';

test('weights sum to 1 with 40/35/25 split', () => {
  assert.equal(WEIGHTS.duplication, 0.4);
  assert.equal(WEIGHTS.deadCode, 0.35);
  assert.equal(WEIGHTS.complexity, 0.25);
  assert.ok(Math.abs(WEIGHTS.duplication + WEIGHTS.deadCode + WEIGHTS.complexity - 1) < 1e-9);
});

test('healthScore is the weighted sum (55,70,62 -> 62)', () => {
  assert.equal(healthScore({ duplication: 55, deadCode: 70, complexity: 62 }), 62);
});

test('healthScore of perfect inputs is 100', () => {
  assert.equal(healthScore({ duplication: 100, deadCode: 100, complexity: 100 }), 100);
});

test('clampScore clamps and rounds', () => {
  assert.equal(clampScore(-5), 0);
  assert.equal(clampScore(140), 100);
  assert.equal(clampScore(62.6), 63);
});

test('weakestLink names the minimum sub-score', () => {
  assert.equal(weakestLink({ duplication: 55, deadCode: 70, complexity: 62 }), 'duplication');
  assert.equal(weakestLink({ duplication: 90, deadCode: 40, complexity: 80 }), 'deadCode');
});

test('gradeBand boundaries A-F', () => {
  assert.equal(gradeBand(95), 'A');
  assert.equal(gradeBand(90), 'A');
  assert.equal(gradeBand(85), 'B');
  assert.equal(gradeBand(75), 'C');
  assert.equal(gradeBand(62), 'D');
  assert.equal(gradeBand(40), 'F');
});

test('gradeNote matches band', () => {
  assert.equal(gradeNote(62), 'Dragging — fix before adding features.');
  assert.equal(gradeNote(95), 'Healthy — keep the loop running.');
});

test('deadCodeWalk reaches transitively from entries only', () => {
  const graph = { app: ['a', 'b'], a: ['c'], b: [], orphan: [] };
  assert.deepEqual(deadCodeWalk(graph, ['app']), ['a', 'app', 'b', 'c']);
});

test('complexityHotspots filters above threshold worst-first', () => {
  const units = [{ name: 'ok', branches: 4 }, { name: 'bad', branches: 12 }, { name: 'worst', branches: 20 }];
  assert.deepEqual(complexityHotspots(units, 8), ['worst', 'bad']);
});

test('collapseDuplication counts saved lines and helpers', () => {
  const r = collapseDuplication([{ id: 's1', lines: 20, copies: 3 }, { id: 's2', lines: 10, copies: 2 }]);
  assert.equal(r.totalDupLines, 50);
  assert.equal(r.helpers, 2);
  assert.deepEqual(r.rows, [{ id: 's1', saved: 40 }, { id: 's2', saved: 10 }]);
});

test('sameInstrumentCheck requires identical ruler', () => {
  assert.equal(sameInstrumentCheck('scan-v3', 'scan-v3'), true);
  assert.equal(sameInstrumentCheck('scan-v3', 'scan-v4'), false);
});

test('reference tables are populated', () => {
  assert.equal(SUB_SCORES.length, 3);
  assert.equal(GRADE_BANDS.length, 5);
  assert.equal(LOOP_STEPS.length, 5);
  assert.equal(COMMIT_TIMELINE.length, 5);
  assert.equal(METHODS.length, 3);
  assert.equal(EVIDENCE_ROWS.length, 4);
  assert.equal(STOP_RULES.length, 4);
  assert.equal(SKILL_RULES.length, 4);
});

test('commit timeline score climbs while removals grow', () => {
  const scores = COMMIT_TIMELINE.map((c) => c.score);
  const removed = COMMIT_TIMELINE.map((c) => c.removed);
  assert.deepEqual(scores, [58, 66, 74, 81, 87]);
  assert.deepEqual(removed, [0, 210, 480, 560, 690]);
});
