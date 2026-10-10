import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  GATE_TRIGGERS,
  DECISION_NODES,
  STYLE_MATRIX,
  TOKEN_MULTIPLIER_PARALLEL_CREW,
  evaluateGate,
  estimateTokenCost,
  recommendStyle,
  decideRoute,
  getStyleById,
  listStyleIds
} from '../src/frameworkCompare/decisionEngine.js';

describe('decisionEngine gate', () => {
  it('exposes exactly 4 gate triggers', () => {
    assert.equal(GATE_TRIGGERS.length, 4);
    assert.deepEqual(GATE_TRIGGERS.map(t => t.id), [
      'context-overflow',
      'parallel-subtasks',
      'divergent-prompts',
      'separate-critic'
    ]);
  });

  it('empty gate stays single-agent', () => {
    assert.deepEqual(evaluateGate([]), {
      triggered: [],
      triggeredCount: 0,
      needsMultiAgent: false,
      guidance: 'No gate trigger fired: start single-agent and split only on evidence.'
    });
  });

  it('single trigger justifies multi-agent', () => {
    const g = evaluateGate(['parallel-subtasks']);
    assert.equal(g.needsMultiAgent, true);
    assert.equal(g.triggeredCount, 1);
    assert.deepEqual(g.triggered, ['parallel-subtasks']);
    assert.equal(g.guidance, 'Multi-agent justified: 1 of 4 gate trigger(s) fired.');
  });

  it('accepts an object map and dedupes unknown ids', () => {
    const g = evaluateGate({ 'context-overflow': true, 'parallel-subtasks': false, 'nope': true });
    assert.deepEqual(g.triggered, ['context-overflow']);
    assert.equal(g.needsMultiAgent, true);
    const dup = evaluateGate(['parallel-subtasks', 'parallel-subtasks']);
    assert.equal(dup.triggeredCount, 1);
  });
});

describe('decisionEngine cost model', () => {
  it('parallel crew of 4 multiplies tokens by 4', () => {
    assert.equal(TOKEN_MULTIPLIER_PARALLEL_CREW, 4);
    assert.deepEqual(estimateTokenCost(1000, 4), {
      baseTokens: 1000,
      agentCount: 4,
      multiplier: 4,
      totalTokens: 4000,
      overheadVsSingle: 3000
    });
  });

  it('defaults to a crew of 4', () => {
    const c = estimateTokenCost(500);
    assert.equal(c.totalTokens, 2000);
    assert.equal(c.multiplier, 4);
  });

  it('single agent has zero overhead', () => {
    assert.deepEqual(estimateTokenCost(500, 1), {
      baseTokens: 500,
      agentCount: 1,
      multiplier: 1,
      totalTokens: 500,
      overheadVsSingle: 0
    });
  });
});

describe('decisionEngine recommendations', () => {
  it('lists 5 generic styles with best fit + watch out', () => {
    assert.deepEqual(listStyleIds(), [
      'state-machine',
      'role-based-org-chart',
      'conversational-debate',
      'type-safe-python',
      'minimal-native-sdk'
    ]);
    for (const s of STYLE_MATRIX) {
      assert.ok(s.strength && s.limitation && s.bestFor && s.bestFit && s.watchOut);
    }
    assert.equal(getStyleById('state-machine').name, 'State Machine');
    assert.equal(getStyleById('missing'), null);
  });

  it('has 3 decision nodes', () => {
    assert.deepEqual(DECISION_NODES.map(n => n.id), ['mental-model', 'durability', 'ecosystem']);
  });

  it('debate mental model wins', () => {
    const r = recommendStyle({ mentalModel: 'debate', durability: 'ephemeral', ecosystem: 'flexible' });
    assert.equal(r.styleId, 'conversational-debate');
    assert.equal(r.styleName, 'Conversational Debate');
  });

  it('minimal-deps ecosystem wins over team model', () => {
    const r = recommendStyle({ mentalModel: 'team', durability: 'ephemeral', ecosystem: 'minimal-deps' });
    assert.equal(r.styleId, 'minimal-native-sdk');
  });

  it('typed-python ecosystem selects type-safe style', () => {
    const r = recommendStyle({ mentalModel: 'states', durability: 'ephemeral', ecosystem: 'typed-python' });
    assert.equal(r.styleId, 'type-safe-python');
  });

  it('team model selects org chart', () => {
    const r = recommendStyle({ mentalModel: 'team', durability: 'ephemeral', ecosystem: 'flexible' });
    assert.equal(r.styleId, 'role-based-org-chart');
  });

  it('resumable durability selects state machine', () => {
    const r = recommendStyle({ mentalModel: 'states', durability: 'resumable', ecosystem: 'flexible' });
    assert.equal(r.styleId, 'state-machine');
  });

  it('decideRoute gates to single-agent without triggers', () => {
    const d = decideRoute([], { mentalModel: 'team', durability: 'ephemeral', ecosystem: 'flexible' });
    assert.equal(d.route, 'single-agent');
    assert.equal(d.recommendation.styleId, 'minimal-native-sdk');
  });

  it('decideRoute passes through to style nodes when gated', () => {
    const d = decideRoute(['separate-critic'], { mentalModel: 'team', durability: 'ephemeral', ecosystem: 'flexible' });
    assert.equal(d.route, 'multi-agent');
    assert.equal(d.recommendation.styleId, 'role-based-org-chart');
  });
});
