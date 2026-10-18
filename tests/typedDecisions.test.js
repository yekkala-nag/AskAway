import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  QUESTION_TYPES,
  WHEN_TO_USE,
  TESTED_THRESHOLDS,
  DECISIONS_CODE,
  TYPED_NOTES,
  predicateToAction,
} from '../src/decisionLayer/decisionLayerEngine.js';

describe('predicateToAction boundaries', () => {
  it('probability exactly equal to the threshold passes', () => {
    const r = predicateToAction(0.7, 0.7);
    assert.equal(r.pass, true);
    assert.equal(r.thresholdUsed, 0.7);
    assert.equal(r.probability, 0.7);
    assert.equal(r.refusal, false);
    assert.equal(r.warning, null);
  });

  it('just under the threshold fails, just over passes', () => {
    assert.equal(predicateToAction(0.6999, 0.7).pass, false);
    assert.equal(predicateToAction(0.7001, 0.7).pass, true);
    assert.equal(predicateToAction(0, 0).pass, true);
    assert.equal(predicateToAction(1, 1).pass, true);
  });

  it('warns when the threshold was never tested', () => {
    const r = predicateToAction(0.74, 0.73);
    assert.equal(r.thresholdUsed, 0.73);
    assert.match(r.warning, /untested/i);
    assert.ok(TESTED_THRESHOLDS.includes(0.7) && !TESTED_THRESHOLDS.includes(0.73));
  });

  it('is refusal-safe: null or missing probability never throws', () => {
    const nul = predicateToAction(null, 0.7);
    assert.equal(nul.pass, false);
    assert.equal(nul.refusal, true);
    assert.equal(nul.probability, null);
    assert.match(nul.warning, /refus/i);
    const undef = predicateToAction(undefined, 0.7);
    assert.equal(undef.pass, false);
    assert.equal(undef.refusal, true);
    const nan = predicateToAction(NaN, 0.7);
    assert.equal(nan.pass, false);
    assert.equal(nan.refusal, true);
  });
});

describe('QUESTION_TYPES shape', () => {
  it('exposes exactly 3 question shapes in order', () => {
    assert.equal(QUESTION_TYPES.length, 3);
    assert.deepEqual(QUESTION_TYPES.map((q) => q.shape), ['predicate', 'choice', 'score']);
  });

  it('every shape carries returns, yourCodeOwns, and example', () => {
    for (const q of QUESTION_TYPES) {
      assert.ok(q.returns && q.returns.length > 20, `${q.shape} returns`);
      assert.ok(q.yourCodeOwns && q.yourCodeOwns.length > 20, `${q.shape} yourCodeOwns`);
      assert.ok(q.example && q.example.length > 5, `${q.shape} example`);
    }
  });

  it('predicate returns a probability, not a boolean', () => {
    const p = QUESTION_TYPES.find((q) => q.shape === 'predicate');
    assert.match(p.returns, /probability/i);
    assert.match(p.returns, /0 and 1|0–1|0-1/);
    assert.doesNotMatch(p.returns, /boolean a|returns a boolean/i);
    assert.match(p.yourCodeOwns, /threshold/i);
  });

  it('choice includes a general option', () => {
    const c = QUESTION_TYPES.find((q) => q.shape === 'choice');
    const blob = `${c.returns} ${c.yourCodeOwns} ${c.example}`;
    assert.match(blob, /general/i);
    assert.match(blob, /list/i);
  });

  it('score returns an ordered rubric level', () => {
    const s = QUESTION_TYPES.find((q) => q.shape === 'score');
    const blob = `${s.returns} ${s.yourCodeOwns} ${s.example}`;
    assert.match(blob, /rubric/i);
    assert.match(blob, /confidence/i);
  });
});

describe('WHEN_TO_USE rows', () => {
  it('has use/avoid/tell for endpoint, structured generation, and plain rules', () => {
    assert.equal(WHEN_TO_USE.length, 3);
    for (const row of WHEN_TO_USE) {
      assert.ok(row.approach && row.use && row.avoid && row.tell);
    }
    const blob = WHEN_TO_USE.map((r) => `${r.approach} ${r.use} ${r.avoid} ${r.tell}`).join(' | ');
    assert.match(blob, /decision endpoint/i);
    assert.match(blob, /structured generation/i);
    assert.match(blob, /plain rules/i);
    assert.match(blob, /arbitrary JSON/i);
    assert.match(blob, /order total > 500/);
  });

  it('plain-rule row is the deterministic one', () => {
    const rules = WHEN_TO_USE.find((r) => /plain rules/i.test(r.approach));
    assert.match(rules.tell, /arithmetic|equality/i);
    assert.doesNotMatch(rules.use, /freeform/i);
  });
});

describe('DECISIONS_CODE + notes', () => {
  it('routes refusals before reading fields and applies a threshold', () => {
    assert.match(DECISIONS_CODE, /refusal/);
    assert.match(DECISIONS_CODE, /CONFIDENCE_FLOOR/);
    assert.match(DECISIONS_CODE, /general/);
    assert.ok(DECISIONS_CODE.split('\n').length >= 15 && DECISIONS_CODE.split('\n').length <= 30);
  });

  it('notes cover batching, images, and cost intuition', () => {
    const blob = JSON.stringify(TYPED_NOTES);
    assert.match(blob, /one request|share one request/i);
    assert.match(blob, /128/);
    assert.match(blob, /input tokens/);
  });
});
