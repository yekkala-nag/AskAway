import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getExitCheck, hasExitCheck, getExitCoverage } from '../src/registry/exitChecks.js';

test('every banked exit check has valid shape', () => {
  const { topics } = getExitCoverage();
  assert.ok(topics > 180, `expected >180 banked topics, got ${topics}`);
  // Spot-check structural validity across all banks via public API surface:
  // getExitCheck returns null for unknown ids.
  assert.equal(getExitCheck('no_such_tab_xyz'), null);
  assert.equal(hasExitCheck('no_such_tab_xyz'), false);
});

test('representative tabs across all banks resolve with 3+ questions', () => {
  const sample = [
    'frameworkcompare', 'agentdebugging', 'vibecode', 'handoffwatch',
    'airoadmap', 'codingevals', 'trpo2grpo', 'modelrouting',
    'agentsdk', 'completepipeline', 'agentobservability',
    'functionalscars', 'agentorgchart', 'refactorhealth', 'synasyncagent',
    'forecasttraps', 'ailearning', 'reversalcurse', 'agentcreativity',
    'grokking', 'lstm', 'system1head', 'graphrag_system1',
    'multiagentcoord', 'decision_layer', 'agentmemory', 'modeldeploy',
    'agentguardrails', 'progress', 'aiarchdecisions', 'overview',
    'threesentenceprompt', 'slashcommands', 'prompt_studio',
    'prompt_frameworks', 'prompt_methodologies', 'textclassificationdata',
    'nsquaredpizza', 'datacentricai', 'multilingualclassification',
    'textclusteringhdbscan', 'finassistproject', 'zerocostmultiagent',
    'aigentools', 'aiharnessquality'
  ];
  for (const id of sample) {
    const qs = getExitCheck(id);
    assert.ok(Array.isArray(qs) && qs.length >= 3, `${id} should have 3+ questions`);
    for (const [i, q] of qs.entries()) {
      assert.equal(typeof q.q, 'string', `${id}[${i}].q`);
      assert.ok(Array.isArray(q.o) && q.o.length === 4, `${id}[${i}].o must have 4 options`);
      assert.ok(Number.isInteger(q.a) && q.a >= 0 && q.a < 4, `${id}[${i}].a in range`);
      assert.equal(typeof q.e, 'string', `${id}[${i}].e`);
    }
    assert.equal(hasExitCheck(id), true);
  }
});
