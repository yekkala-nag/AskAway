import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  // pre-existing exports still intact
  THREE_RL_BASELINES,
  SIMULATE_DYNAMIC_PRICING_MDP,
  // bandit merge exports
  BANDIT_REWARD_MODELS,
  createSeededRng,
  updateRunningMean,
  meanOfRewards,
  defaultTrueRates,
  runBanditSession,
  cumulativeSum,
  findCrossoverStep,
  comparePolicies
} from '../src/reinforcementLearning/rlEngine.js';

describe('banditMerge engine intact', () => {
  it('keeps the original baselines export', () => {
    assert.equal(THREE_RL_BASELINES.length, 4);
    assert.equal(typeof SIMULATE_DYNAMIC_PRICING_MDP, 'function');
  });
});

describe('banditMerge seeded RNG', () => {
  it('is deterministic for the same seed', () => {
    const a = createSeededRng(7);
    const b = createSeededRng(7);
    assert.equal(a(), b());
    assert.equal(a(), b());
  });

  it('produces the exact first value for seed 7', () => {
    assert.equal(createSeededRng(7)(), 0.011704753153026104);
  });

  it('differs across seeds', () => {
    assert.notEqual(createSeededRng(7)(), createSeededRng(8)());
  });
});

describe('banditMerge running-mean estimator', () => {
  it('updates the mean exactly', () => {
    assert.equal(updateRunningMean(0.5, 3, 1), 0.625);
    assert.equal(updateRunningMean(0, 0, 1), 1);
    assert.equal(updateRunningMean(1, 1, 0), 0.5);
  });

  it('averages reward lists', () => {
    assert.equal(meanOfRewards([1, 0, 1, 1]), 0.75);
    assert.equal(meanOfRewards([]), 0);
  });
});

describe('banditMerge reward taxonomy', () => {
  it('exposes fixed / adversarial / random-process models', () => {
    assert.deepEqual(BANDIT_REWARD_MODELS.map(m => m.id), ['fixed', 'adversarial', 'random-process']);
    for (const m of BANDIT_REWARD_MODELS) {
      assert.ok(m.name && m.description && m.example);
    }
  });

  it('builds deterministic default rates', () => {
    assert.deepEqual(defaultTrueRates(2), [0.3, 0.8]);
    assert.deepEqual(defaultTrueRates(3), [0.3, 0.55, 0.8]);
    assert.deepEqual(defaultTrueRates(1), [0.5]);
  });
});

describe('banditMerge simulation', () => {
  it('greedy locks onto the worse arm with seed 7', () => {
    const g = runBanditSession({ trueRates: [0.3, 0.7], steps: 200, epsilon: 0, seed: 7 });
    assert.equal(g.totalReward, 47);
    assert.equal(g.winRate, 0.235);
    assert.deepEqual(g.pullCounts, [200, 0]);
  });

  it('epsilon-greedy escapes and wins with seed 7', () => {
    const e = runBanditSession({ trueRates: [0.3, 0.7], steps: 200, epsilon: 0.1, seed: 7 });
    assert.equal(e.totalReward, 126);
    assert.equal(e.winRate, 0.63);
    assert.deepEqual(e.pullCounts, [25, 175]);
  });

  it('comparePolicies reports the crossover', () => {
    const c = comparePolicies({ trueRates: [0.3, 0.7], steps: 200, epsilon: 0.1, seed: 7 });
    assert.equal(c.greedyWinRate, 0.235);
    assert.equal(c.exploratoryWinRate, 0.63);
    assert.equal(c.winRateDelta, 0.395);
    assert.equal(c.crossoverStep, 8);
  });

  it('finds crossover steps and -1 when never overtaken', () => {
    assert.equal(findCrossoverStep([0, 1, 1, 2], [0, 0, 1, 3]), 3);
    assert.equal(findCrossoverStep([5, 6, 7], [1, 2, 3]), -1);
    assert.deepEqual(cumulativeSum([1, 0, 1]), [1, 1, 2]);
  });
});
