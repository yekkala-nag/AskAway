import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SCHEMA_BRIDGE_WEIGHTS_CARD,
  AGENT_LOOP_STAGES,
  AGENT_LOOP_MODES,
  AGENT_LOOP_MEMORY,
  AGENT_LOOP_FAILURES,
  RUN_AGENT_LOOP
} from '../src/toolCalling/toolsEngine.js';

test('cross-link card names weight-level fine-tuning without URL', () => {
  assert.equal(SCHEMA_BRIDGE_WEIGHTS_CARD.title, 'When the schema bridge needs weights');
  assert.deepEqual(SCHEMA_BRIDGE_WEIGHTS_CARD.signs, ['persistent chatty wrappers', 'near-miss tool choice']);
  assert.match(SCHEMA_BRIDGE_WEIGHTS_CARD.message, /weight level/);
  assert.ok(SCHEMA_BRIDGE_WEIGHTS_CARD.fineTuneTabName.length > 5);
  assert.doesNotMatch(JSON.stringify(SCHEMA_BRIDGE_WEIGHTS_CARD), /https?:\/\//);
});

test('agent loop stages are request → validate → execute → respond', () => {
  assert.deepEqual(AGENT_LOOP_STAGES.map((s) => s.id), ['request', 'validate', 'execute', 'respond']);
  assert.deepEqual(AGENT_LOOP_STAGES.map((s) => s.label), ['Request', 'Validate', 'Execute', 'Respond']);
});

test('agent loop modes cover single-tool then loop-until-done', () => {
  assert.deepEqual(AGENT_LOOP_MODES.map((m) => m.mode), ['single-tool', 'loop-until-done']);
});

test('cap logic: finishes within cap', () => {
  const r = RUN_AGENT_LOOP(2, 5);
  assert.equal(r.needed, 2);
  assert.equal(r.cap, 5);
  assert.equal(r.stepsTaken, 2);
  assert.equal(r.completed, true);
  assert.equal(r.fallback, null);
});

test('cap logic: runaway stops after max iterations with fallback', () => {
  const r = RUN_AGENT_LOOP(6, 3);
  assert.equal(r.needed, 6);
  assert.equal(r.cap, 3);
  assert.equal(r.stepsTaken, 3);
  assert.equal(r.completed, false);
  assert.equal(r.fallback, 'stopped after max iterations');
  assert.equal(r.transcript.length, 3);
});

test('cap logic: boundary needed == cap completes', () => {
  const r = RUN_AGENT_LOOP(3, 3);
  assert.equal(r.completed, true);
  assert.equal(r.stepsTaken, 3);
  assert.equal(r.fallback, null);
});

test('memory constraints table is trim/summarize/persist', () => {
  assert.deepEqual(AGENT_LOOP_MEMORY.map((m) => m.strategy), ['trim', 'summarize', 'persist']);
  for (const m of AGENT_LOOP_MEMORY) assert.ok(m.constraint.length > 5);
});

test('failure triage covers three paths', () => {
  assert.deepEqual(AGENT_LOOP_FAILURES.map((f) => f.failure), ['no tool requested', 'wrong args', 'misread result']);
  for (const f of AGENT_LOOP_FAILURES) assert.ok(f.triage.length > 5);
});
