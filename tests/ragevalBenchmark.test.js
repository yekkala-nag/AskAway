import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  BENCH_QUERIES,
  BENCH_TRUTHS,
  BENCH_DECOYS,
  AB_LESSON,
  seededRng,
  generatePollutedDataset,
  predictPlainConcat,
  predictLabeledTruth,
  scoreExactMatch,
  checkComplexityCapacity,
  runABBenchmark
} from '../src/ragEvals/ragEvalEngine.js';

describe('ragevalBenchmark dataset generator', () => {
  it('is deterministic for the same seed', () => {
    const a = generatePollutedDataset(6, 7, true);
    const b = generatePollutedDataset(6, 7, true);
    assert.deepEqual(a, b);
  });

  it('emits N items each with one true value plus two decoys', () => {
    const d = generatePollutedDataset(6, 7, true);
    assert.equal(d.length, 6);
    for (const item of d) {
      assert.equal(item.decoys.length, 2);
      assert.equal(item.polluted, true);
      assert.ok(!item.decoys.includes(item.trueValue));
    }
    assert.deepEqual(d.map((x) => x.query), BENCH_QUERIES.slice(0, 6));
    assert.deepEqual(d.map((x) => x.trueValue), BENCH_TRUTHS.slice(0, 6));
  });

  it('pins exact seeded values for seed 7', () => {
    const d = generatePollutedDataset(6, 7, true);
    assert.deepEqual(d[0].decoys, ['Shift A', '410 kg']);
    assert.equal(d[0].contextPlain, '42 units / Shift A / 410 kg');
    assert.equal(
      d[0].contextLabeled,
      'VERIFIED: 42 units | UNVERIFIED: Shift A, 410 kg | Resolve conflicts in favor of VERIFIED.'
    );
    assert.deepEqual(d[1].decoys, ['Gate D', 'Zone 7']);
    assert.equal(d[1].contextPlain, 'Gate C / Gate D / Zone 7');
    assert.deepEqual(d[5].decoys, ['Zone 7', '55 units']);
    assert.equal(d[5].trueValue, 'Zone 4');
  });

  it('emits clean items with no decoys when pollution is off', () => {
    const d = generatePollutedDataset(4, 7, false);
    assert.equal(d.length, 4);
    for (const item of d) {
      assert.deepEqual(item.decoys, []);
      assert.equal(item.polluted, false);
      assert.equal(item.contextPlain, item.trueValue);
    }
    assert.equal(d[0].contextLabeled, 'VERIFIED: 42 units');
  });

  it('respects the requested query count', () => {
    assert.equal(generatePollutedDataset(3, 7, true).length, 3);
    assert.equal(generatePollutedDataset(0, 7, true).length, 0);
  });

  it('seededRng is deterministic and bounded', () => {
    const r1 = seededRng(7);
    const r2 = seededRng(7);
    const seq1 = [r1(), r1(), r1()];
    const seq2 = [r2(), r2(), r2()];
    assert.deepEqual(seq1, seq2);
    for (const v of seq1) assert.ok(v >= 0 && v < 1);
    assert.ok(BENCH_DECOYS.length >= 12);
  });
});

describe('ragevalBenchmark scorers', () => {
  it('plain-concat misses even rows and hits odd rows under pollution', () => {
    const d = generatePollutedDataset(6, 7, true);
    assert.equal(predictPlainConcat(d[0]), 'Shift A');
    assert.equal(predictPlainConcat(d[1]), 'Gate C');
    assert.equal(predictPlainConcat(d[2]), '87 units');
    assert.equal(predictPlainConcat(d[3]), '14 days');
  });

  it('labeled-truth always recovers the true value', () => {
    const d = generatePollutedDataset(6, 7, true);
    for (const item of d) assert.equal(predictLabeledTruth(item), item.trueValue);
  });

  it('plain-concat is perfect when pollution is off', () => {
    const d = generatePollutedDataset(6, 7, false);
    for (const item of d) assert.equal(predictPlainConcat(item), item.trueValue);
  });

  it('exact-match scorer reports exact counts', () => {
    const d = generatePollutedDataset(6, 7, true);
    assert.deepEqual(scoreExactMatch(d, predictPlainConcat), { correct: 3, total: 6, accuracy: 0.5 });
    assert.deepEqual(scoreExactMatch(d, predictLabeledTruth), { correct: 6, total: 6, accuracy: 1 });
    assert.deepEqual(scoreExactMatch([], predictPlainConcat), { correct: 0, total: 0, accuracy: 0 });
  });
});

describe('ragevalBenchmark complexity-vs-capacity rule', () => {
  it('flags regression for small tier plus conflict-resolution prompt', () => {
    assert.equal(checkComplexityCapacity('small', true).regressionFlag, true);
    assert.equal(checkComplexityCapacity('large', true).regressionFlag, false);
    assert.equal(checkComplexityCapacity('small', false).regressionFlag, false);
    assert.equal(checkComplexityCapacity('balanced', true).regressionFlag, false);
  });

  it('small tier regresses labeled-truth to plain-concat levels', () => {
    const d = generatePollutedDataset(6, 7, true);
    const r = runABBenchmark(d, 'small');
    assert.equal(r.regressionFlag, true);
    assert.deepEqual(r.plain, { correct: 3, total: 6, accuracy: 0.5 });
    assert.deepEqual(r.effectiveLabeled, { correct: 3, total: 6, accuracy: 0.5 });
    assert.equal(r.winner, 'tie');
    assert.ok(r.verdict.includes('Regression'));
    assert.equal(r.lesson, AB_LESSON);
  });

  it('large tier lets labeled-truth win outright', () => {
    const d = generatePollutedDataset(6, 7, true);
    const r = runABBenchmark(d, 'large');
    assert.equal(r.regressionFlag, false);
    assert.deepEqual(r.effectiveLabeled, { correct: 6, total: 6, accuracy: 1 });
    assert.equal(r.winner, 'labeled');
    assert.ok(r.capacityNote.includes('holds'));
  });

  it('clean contexts tie without a regression story', () => {
    const d = generatePollutedDataset(6, 7, false);
    const r = runABBenchmark(d, 'large');
    assert.equal(r.winner, 'tie');
    assert.ok(r.verdict.includes('No pollution'));
  });
});
