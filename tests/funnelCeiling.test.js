import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FUNNEL_STAGES,
  funnelRecall,
  bottleneckStage,
  rerankCeiling,
  FUNNEL_CODE,
} from '../src/rerankers/rerankEngine.js';

test('FUNNEL_STAGES: four narrowing stages with ascending cost', () => {
  assert.equal(FUNNEL_STAGES.length, 4);
  FUNNEL_STAGES.forEach((s, i) => {
    assert.ok(s.stage && s.how && typeof s.recall === 'number');
    assert.ok(s.recall > 0 && s.recall <= 1);
    assert.ok(s.ms > 0);
    if (i > 0) assert.ok(s.candidatesOut <= FUNNEL_STAGES[i - 1].candidatesOut, 'candidate counts must narrow');
  });
  assert.equal(FUNNEL_STAGES[0].cost, '$');
  assert.equal(FUNNEL_STAGES[3].cost, '$$$');
});

test('funnelRecall: exact product', () => {
  assert.equal(funnelRecall([0.9, 0.92]), 0.828);
  assert.equal(funnelRecall([0.92, 0.9, 0.96, 0.98]), 0.779);
  assert.equal(funnelRecall([1, 1, 1]), 1);
  assert.equal(funnelRecall([]), 0);
  assert.equal(funnelRecall(null), 0);
});

test('bottleneckStage: index of the lowest-recall stage', () => {
  assert.equal(bottleneckStage([0.92, 0.7, 0.96, 0.98]), 1);
  assert.equal(bottleneckStage([0.5, 0.9, 0.9, 0.9]), 0);
  // tie → first occurrence
  assert.equal(bottleneckStage([0.9, 0.9, 0.95]), 0);
});

test('rerankCeiling: product of everything upstream of the reranker', () => {
  assert.equal(rerankCeiling([0.9, 0.8, 1]), 0.72);
  // single-stage input degenerates to its own recall
  assert.equal(rerankCeiling([0.85]), 0.85);
});

test('FUNNEL_CODE: no attribution, contains the ceiling lesson', () => {
  assert.ok(FUNNEL_CODE.includes('cross_encoder'));
  assert.ok(FUNNEL_CODE.includes('product of stage recalls'));
  assert.ok(!/https?:\/\/|Vespa|Arango|OpenAI|LangGraph/i.test(FUNNEL_CODE));
});
