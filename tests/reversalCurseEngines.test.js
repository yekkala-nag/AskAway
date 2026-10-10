import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FACTS,
  MECHANISM_STEPS,
  SCALE_POINTS,
  FIXES,
  LIMITS,
  CODE_SIM,
  CODE_BOTH_ORDERS,
  forwardAccAtScale,
  reverseAccAtScale,
  quizItems,
  normalizeAnswer,
  isCorrect,
  scoreAnswers,
  mulberry32,
  makePairs,
  simulateDirectionalRecall,
} from '../src/reversalCurse/reversalCurseEngine.js';

test('facts: 4-6 entries with forward and reverse QA', () => {
  assert.ok(FACTS.length >= 4 && FACTS.length <= 6, `expected 4-6 facts, got ${FACTS.length}`);
  for (const f of FACTS) {
    assert.ok(f.id && f.subject && f.object);
    assert.ok(f.forwardQ && f.forwardA);
    assert.ok(f.reverseQ && f.reverseA);
  }
});

test('quizItems returns both directions', () => {
  const fwd = quizItems('forward');
  const rev = quizItems('reverse');
  assert.equal(fwd.length, FACTS.length);
  assert.equal(rev.length, FACTS.length);
  assert.ok(fwd[0].q !== rev[0].q, 'directions should ask different questions');
});

test('answer matching is case/whitespace tolerant', () => {
  assert.equal(normalizeAnswer('  The Blue Vault. '), 'blue vault');
  assert.ok(isCorrect('blue vault', 'Inside the blue vault'));
  assert.ok(isCorrect('THE GLOWMOTH', 'The glowmoth'));
  assert.ok(!isCorrect('', 'The glowmoth'));
  assert.ok(!isCorrect('something else entirely', 'The glowmoth'));
});

test('scoreAnswers grades a perfect forward run', () => {
  const answers = {};
  for (const f of FACTS) answers[f.id] = f.forwardA;
  const r = scoreAnswers(answers, 'forward');
  assert.equal(r.correct, FACTS.length);
  assert.equal(r.acc, 1);
  assert.equal(r.rows.length, FACTS.length);
});

test('scoreAnswers grades empty answers as zero', () => {
  const r = scoreAnswers({}, 'reverse');
  assert.equal(r.correct, 0);
  assert.equal(r.acc, 0);
});

test('scale helpers stay flat: forward high, reverse low', () => {
  assert.equal(SCALE_POINTS.length, 4);
  for (let i = 0; i < SCALE_POINTS.length; i += 1) {
    assert.ok(forwardAccAtScale(i) >= 0.9, `forward[${i}] should be high`);
    assert.ok(reverseAccAtScale(i) <= 0.2, `reverse[${i}] should be near chance`);
  }
  // clamping
  assert.equal(forwardAccAtScale(-99), forwardAccAtScale(0));
  assert.equal(reverseAccAtScale(999), reverseAccAtScale(SCALE_POINTS.length - 1));
});

test('content tables are populated', () => {
  assert.ok(MECHANISM_STEPS.length >= 3);
  assert.ok(FIXES.length >= 4);
  assert.ok(LIMITS.length >= 3);
  assert.ok(CODE_SIM.includes('never touched') || CODE_SIM.includes('never'));
  assert.ok(CODE_BOTH_ORDERS.includes('augmentBothOrders'));
});

test('mulberry32 is deterministic', () => {
  const a = mulberry32(7);
  const b = mulberry32(7);
  for (let i = 0; i < 10; i += 1) assert.equal(a(), b());
  const c = mulberry32(8);
  assert.notEqual(mulberry32(7)(), c(), 'different seeds should diverge (overwhelmingly likely)');
});

test('makePairs is deterministic with correct shape', () => {
  const r1 = makePairs(8, 7);
  const r2 = makePairs(8, 7);
  assert.deepEqual(r1, r2);
  assert.equal(r1.pairs.length, 8);
  assert.equal(r1.vocabSize, 16);
  const flat = r1.pairs.flat();
  assert.equal(new Set(flat).size, 16, 'pairs should use distinct entities');
});

test('simulation: trained-direction high, reverse near chance', () => {
  const r = simulateDirectionalRecall({ pairCount: 8, seed: 7, epochs: 12, lr: 1.0 });
  assert.equal(r.pairCount, 8);
  assert.equal(r.vocabSize, 16);
  assert.ok(Math.abs(r.chance - 1 / 16) < 1e-12);
  assert.ok(r.trainedAcc >= 0.9, `trainedAcc should be high, got ${r.trainedAcc}`);
  assert.ok(r.reverseAcc <= r.chance + 0.25, `reverseAcc ${r.reverseAcc} should be near chance ${r.chance}`);
  assert.equal(r.reverseRows.length, 8);
});

test('simulation is deterministic for a fixed seed', () => {
  const a = simulateDirectionalRecall({ pairCount: 6, seed: 3 });
  const b = simulateDirectionalRecall({ pairCount: 6, seed: 3 });
  assert.deepEqual(a, b);
});

test('simulation holds across sizes: reverse never rescued by pair count', () => {
  for (const n of [4, 8, 12]) {
    const r = simulateDirectionalRecall({ pairCount: n, seed: 11 });
    assert.ok(r.trainedAcc >= 0.9, `n=${n}: trained ${r.trainedAcc}`);
    assert.ok(r.reverseAcc <= r.chance + 0.3, `n=${n}: reverse ${r.reverseAcc} vs chance ${r.chance}`);
  }
});
