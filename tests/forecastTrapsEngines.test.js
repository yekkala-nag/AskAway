import test from 'node:test';
import assert from 'node:assert/strict';

import {
  HONEST_ERROR,
  TRAPS,
  EVALUATION_STEPS,
  RESIDUALS,
  BREAK_AT,
  CHECKLIST,
  CODE_AVAILABILITY,
  trapScores,
  isFeatureLegal,
  assertAvailability,
  delayLegal,
  walkForwardSplits,
  residualMean,
  breakSize,
  checkPlausibility,
  checklistProgress,
} from '../src/forecastTraps/forecastTrapsEngine.js';

test('traps: reference data has four traps with fixed discounts', () => {
  assert.equal(TRAPS.length, 4);
  assert.deepEqual(TRAPS.map((t) => t.id), ['peek', 'delay', 'echo', 'break']);
  assert.deepEqual(TRAPS.map((t) => t.discount), [4.1, 1.6, 1.1, 0.6]);
  assert.equal(HONEST_ERROR, 8.4);
});

test('trapScores: no traps active is honest', () => {
  assert.deepEqual(trapScores([]), { reported: 8.4, honest: 8.4, gap: 0, status: 'HONEST', applied: [] });
});

test('trapScores: peek alone is fantasy (8.4 - 4.1 = 4.3)', () => {
  const r = trapScores(['peek']);
  assert.equal(r.reported, 4.3);
  assert.equal(r.gap, 4.1);
  assert.equal(r.status, 'FANTASY');
  assert.deepEqual(r.applied, ['peek']);
});

test('trapScores: delay + echo is inflated (8.4 - 2.7 = 5.7)', () => {
  const r = trapScores(['delay', 'echo']);
  assert.equal(r.reported, 5.7);
  assert.equal(r.gap, 2.7);
  assert.equal(r.status, 'INFLATED');
});

test('trapScores: all four traps give reported 1.0, gap 7.4', () => {
  const r = trapScores(['peek', 'delay', 'echo', 'break']);
  assert.equal(r.reported, 1.0);
  assert.equal(r.gap, 7.4);
  assert.equal(r.status, 'FANTASY');
});

test('availability: legal boundary is inclusive', () => {
  assert.equal(isFeatureLegal(8, 10), true);
  assert.equal(isFeatureLegal(10, 10), true);
  assert.equal(isFeatureLegal(11, 10), false);
});

test('availability: audit splits legal from leaking rows', () => {
  const rows = [
    { feature: 'a', availableAt: 8, issueTime: 10 },
    { feature: 'b', availableAt: 10, issueTime: 10 },
    { feature: 'c', availableAt: 12, issueTime: 10 },
  ];
  const r = assertAvailability(rows);
  assert.equal(r.legalCount, 2);
  assert.equal(r.illegalCount, 1);
  assert.equal(r.ok, false);
  assert.deepEqual(r.illegal.map((x) => x.feature), ['c']);
  assert.equal(assertAvailability(rows.slice(0, 2)).ok, true);
});

test('delayLegal: reporting delay shifts the last legal period', () => {
  assert.equal(delayLegal(10, 2), 8);
  assert.equal(delayLegal(10, 0), 10);
});

test('walkForwardSplits: 12 periods, train 6, horizon 2 gives 5 folds', () => {
  const folds = walkForwardSplits(12, 6, 2);
  assert.equal(folds.length, 5);
  assert.deepEqual(folds[0], { fold: 1, train: [0, 5], test: [6, 7] });
  assert.deepEqual(folds[4], { fold: 5, train: [4, 9], test: [10, 11] });
});

test('residuals: break series has 24 points with a 3.0 level shift', () => {
  assert.equal(RESIDUALS.length, 24);
  assert.equal(BREAK_AT, 12);
  assert.equal(residualMean(RESIDUALS, 0, 12), 0);
  assert.equal(residualMean(RESIDUALS, 12, 24), 3);
  assert.equal(breakSize(RESIDUALS, 12), 3);
});

test('plausibility: below floor is TOO GOOD, near floor BORDERLINE, above PLAUSIBLE', () => {
  assert.deepEqual(checkPlausibility(1.0, 6.8), { ratio: 0.15, verdict: 'TOO GOOD' });
  assert.deepEqual(checkPlausibility(7.1, 6.8), { ratio: 1.04, verdict: 'BORDERLINE' });
  assert.deepEqual(checkPlausibility(9.5, 6.8), { ratio: 1.4, verdict: 'PLAUSIBLE' });
});

test('checklist: five questions with progress math', () => {
  assert.equal(CHECKLIST.length, 5);
  assert.equal(EVALUATION_STEPS.length, 3);
  assert.deepEqual(checklistProgress(['rerun', 'plot']), { done: 2, total: 5, pct: 40, ready: false });
  assert.deepEqual(checklistProgress(CHECKLIST.map((c) => c.id)), { done: 5, total: 5, pct: 100, ready: true });
});

test('engine: ships a code snippet string', () => {
  assert.equal(typeof CODE_AVAILABILITY, 'string');
  assert.ok(CODE_AVAILABILITY.includes('assert_available'));
  assert.ok(CODE_AVAILABILITY.includes('walk_forward'));
});
