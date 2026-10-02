import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CALCULATE_SAMPLING_DISTRIBUTION,
  SAMPLE_PROMPTS
} from '../src/llmSampling/samplingEngine.js';

const PROMPT = SAMPLE_PROMPTS[0];

const run = (overrides = {}) =>
  CALCULATE_SAMPLING_DISTRIBUTION({
    rawCandidates: PROMPT.vocabCandidates,
    temperature: 0.7,
    topK: 7,
    topP: 0.9,
    minP: 0.05,
    repetitionPenalty: 1.0,
    isGreedy: false,
    ...overrides
  });

const survivors = (dist) => dist.filter((d) => d.isSurviving);

test('distribution is sorted descending and renormalized to sum 1', () => {
  const dist = run();
  const probs = dist.map((d) => d.finalProb);
  for (let i = 1; i < probs.length; i++) {
    assert.ok(probs[i - 1] >= probs[i], 'finalProb must be sorted descending');
  }
  const sum = survivors(dist).reduce((s, d) => s + d.finalProb, 0);
  assert.ok(Math.abs(sum - 1) < 0.005, `survivor probs must sum to ~1, got ${sum}`);
});

test('higher temperature flattens the distribution (top-1 mass drops)', () => {
  const sharp = survivors(run({ temperature: 0.3 }))[0].finalProb;
  const flat = survivors(run({ temperature: 1.5 }))[0].finalProb;
  assert.ok(sharp > flat, `expected T=0.3 top-1 (${sharp}) > T=1.5 top-1 (${flat})`);
  assert.ok(sharp > 0.6, 'low temperature should be peaked');
  assert.ok(flat < 0.75, 'high temperature should flatten');
});

test('greedy decoding (T = 0) gives argmax token probability 1.0', () => {
  const dist = run({ temperature: 0, isGreedy: true });
  const alive = survivors(dist);
  assert.equal(alive.length, 1);
  assert.equal(alive[0].finalProb, 1);
  assert.equal(alive[0].token, ' []');
  for (const d of dist) {
    if (d.token !== ' []') assert.equal(d.finalProb, 0);
  }
});

test('top-k cutoff keeps exactly K tokens', () => {
  for (const k of [1, 2, 4]) {
    const dist = run({ topK: k, topP: 1.0, minP: 0 });
    assert.equal(survivors(dist).length, k, `topK=${k}`);
  }
});

test('top-p keeps a prefix whose retained raw mass is at least p', () => {
  for (const p of [0.5, 0.9, 1.0]) {
    const dist = run({ topP: p, minP: 0, topK: 7 });
    const mass = survivors(dist).reduce((s, d) => s + d.rawProb, 0);
    assert.ok(mass >= p - 1e-6, `retained mass ${mass} must be >= top-p ${p}`);
  }
});

test('min-p drops tokens below min_p * top probability', () => {
  const minP = 0.5;
  const dist = run({ minP, topP: 1.0, topK: 7 });
  const maxProb = Math.max(...dist.map((d) => d.rawProb));
  for (const d of dist) {
    if (d.isSurviving) {
      assert.ok(d.rawProb >= maxProb * minP - 1e-9, `survivor ${d.token} above min-p threshold`);
    }
  }
  assert.ok(survivors(dist).length < dist.length, 'min-p must cut at least one tail token');
});

test('repetition penalty flattens positive-logit mass', () => {
  const base = survivors(run({ repetitionPenalty: 1.0 }))[0].finalProb;
  const penalized = survivors(run({ repetitionPenalty: 1.5 }))[0].finalProb;
  assert.ok(penalized < base, `penalty should reduce top-1 (${penalized} >= ${base})`);
});

test('surviving flag matches the conjunction of filter flags', () => {
  const dist = run({ topK: 3, topP: 0.8, minP: 0.1 });
  for (const d of dist) {
    assert.equal(
      d.isSurviving,
      d.isKeptByTopK && d.isKeptByTopP && d.isKeptByMinP,
      `flags inconsistent for ${d.token}`
    );
  }
});

test('empty candidate list returns empty distribution', () => {
  assert.deepEqual(CALCULATE_SAMPLING_DISTRIBUTION({ rawCandidates: [] }), []);
  assert.deepEqual(CALCULATE_SAMPLING_DISTRIBUTION({}), []);
});
