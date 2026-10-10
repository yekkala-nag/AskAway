import test from 'node:test';
import assert from 'node:assert/strict';

import {
  HYPE_VALUE_CHAIN,
  HYPE_CONSUMER_ODDS,
  HYPE_FOUNDATIONS,
  HYPE_CLAIM_DECODER,
  triageHypeClaim,
} from '../src/enterpriseAIOps/enterpriseAIOpsEngine.js';

test('hype: value chain has five layers ending with adopters', () => {
  assert.equal(HYPE_VALUE_CHAIN.length, 5);
  assert.deepEqual(HYPE_VALUE_CHAIN.map((l) => l.id), ['chips', 'clouds', 'platforms', 'builders', 'adopters']);
  assert.equal(HYPE_VALUE_CHAIN[0].layer, '1. Chips & hardware');
  assert.equal(HYPE_VALUE_CHAIN[4].layer, '5. Adopters');
});

test('hype: consumer odds are genericized with no firm names', () => {
  assert.equal(HYPE_CONSUMER_ODDS.length, 3);
  assert.deepEqual(HYPE_CONSUMER_ODDS.map((o) => o.id), ['illusion', 'lastmile', 'paynow']);
  for (const o of HYPE_CONSUMER_ODDS) {
    assert.match(o.stat, /Industry surveys report/);
  }
  assert.equal(HYPE_CONSUMER_ODDS[0].name, 'Accessibility illusion');
  assert.equal(HYPE_CONSUMER_ODDS[1].name, 'Last-mile gap');
  assert.equal(HYPE_CONSUMER_ODDS[2].name, 'Pay now vs prove later');
});

test('hype: foundations cover math and systems thinking', () => {
  assert.equal(HYPE_FOUNDATIONS.length, 2);
  assert.equal(HYPE_FOUNDATIONS[0].name, 'Math first — or trusted secondhand');
  assert.equal(HYPE_FOUNDATIONS[1].name, 'Systems thinking');
});

test('hype: triage routes new+relevant deep, neither parked, mixed to evidence', () => {
  assert.deepEqual(triageHypeClaim({ isNew: true, isRelevant: true }), {
    verdict: 'go-deep',
    nextStep: 'Reproduce on your data with an independent eval before committing.',
  });
  assert.deepEqual(triageHypeClaim({ isNew: false, isRelevant: false }), {
    verdict: 'park',
    nextStep: 'File it away; revisit only if the use case changes.',
  });
  assert.deepEqual(triageHypeClaim({ isNew: true, isRelevant: false }), {
    verdict: 'revisit-with-evidence',
    nextStep: 'Ask for messy-data results or a production reference, then re-triage.',
  });
  assert.deepEqual(triageHypeClaim({ isNew: false, isRelevant: true }), {
    verdict: 'revisit-with-evidence',
    nextStep: 'Ask for messy-data results or a production reference, then re-triage.',
  });
});

test('hype: claim decoder covers all five patterns', () => {
  assert.equal(HYPE_CLAIM_DECODER.length, 5);
  assert.deepEqual(HYPE_CLAIM_DECODER.map((c) => c.pattern), [
    'Benchmark on clean data',
    'Survivor case study',
    'Demo, not workflow',
    'Rebranded old tool',
    'Anthropomorphic headcount framing',
  ]);
  assert.equal(
    HYPE_CLAIM_DECODER[0].question,
    'What happens on our messy inputs with duplicates and missing fields?'
  );
  assert.equal(
    HYPE_CLAIM_DECODER[4].question,
    'Which named tasks, at what error rate, with what human review cost?'
  );
});
