import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SIX_REQUIREMENTS,
  CONTEXT_TAX,
  REQUIREMENTS_CODE,
} from '../src/enterpriseGrade/enterpriseEngine.js';

test('SIX_REQUIREMENTS: six unique requirements, each with failure mode', () => {
  assert.equal(SIX_REQUIREMENTS.length, 6);
  const names = SIX_REQUIREMENTS.map((r) => r.name);
  assert.equal(new Set(names).size, 6);
  SIX_REQUIREMENTS.forEach((r, i) => {
    assert.equal(r.n, i + 1);
    assert.ok(r.detail.length > 30, 'each requirement teaches detail');
    assert.ok(r.failureWithout.length > 20, 'each requirement names its failure');
  });
  assert.ok(names.includes('Temporal awareness'));
  assert.ok(names.includes('Entity resolution & relationships'));
});

test('CONTEXT_TAX: four signals with fragmented vs persisted contrast', () => {
  assert.equal(CONTEXT_TAX.length, 4);
  CONTEXT_TAX.forEach((t) => {
    assert.ok(t.signal && t.fragmented && t.persisted && t.exampleCost);
    assert.notEqual(t.fragmented, t.persisted);
  });
  const signals = CONTEXT_TAX.map((t) => t.signal);
  assert.ok(signals.some((s) => s.includes('Vector-only')));
});

test('REQUIREMENTS_CODE: pseudocode teaches resolve/policy/retrieve, no attribution', () => {
  assert.ok(REQUIREMENTS_CODE.includes('layer.resolve'));
  assert.ok(REQUIREMENTS_CODE.includes('policy.allows'));
  assert.ok(!/https?:\/\/|Vespa|Arango|The New Stack|OpenAI/i.test(REQUIREMENTS_CODE));
});
