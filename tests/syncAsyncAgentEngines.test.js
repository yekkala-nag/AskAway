import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SYNC_LIMIT_S,
  EXAMPLE_LONG_RUN_S,
  SYNC_STEPS,
  ASYNC_STAGES,
  INFRA_ROWS,
  FAILURE_MODES,
  DECISION_PRESETS,
  evaluateSyncRun,
  simulateAsyncRun,
  pickPattern,
  CODE_SYNC,
  CODE_ASYNC,
} from '../src/syncAsyncAgent/syncAsyncAgentEngine.js';

test('sync: run inside the timeout succeeds with no waste', () => {
  const r = evaluateSyncRun(10, 29);
  assert.equal(r.success, true);
  assert.equal(r.verdict, 'SUCCESS');
  assert.equal(r.droppedAt, null);
  assert.equal(r.wastedSeconds, 0);
});

test('sync: 45s run on a 29s limit drops at 29s with 16s wasted', () => {
  const r = evaluateSyncRun(EXAMPLE_LONG_RUN_S, SYNC_LIMIT_S);
  assert.equal(r.success, false);
  assert.equal(r.verdict, 'TIMEOUT');
  assert.equal(r.droppedAt, 29);
  assert.equal(r.wastedSeconds, 16);
});

test('sync: boundary run exactly at the limit still succeeds', () => {
  const r = evaluateSyncRun(29, 29);
  assert.equal(r.success, true);
  assert.equal(r.verdict, 'SUCCESS');
  assert.equal(r.wastedSeconds, 0);
});

test('async: 45s run polling every 10s yields 5 polls and 9 checkpoints', () => {
  const r = simulateAsyncRun(45, 10, 5);
  assert.equal(r.polls, 5);
  assert.equal(r.checkpoints, 9);
  assert.equal(r.totalWallSeconds, 45);
});

test('async: poll count rounds up for uneven divisions', () => {
  const r = simulateAsyncRun(45, 20, 5);
  assert.equal(r.polls, 3);
  assert.equal(r.checkpoints, 9);
});

test('picker: short simple job inside the window goes SYNC', () => {
  const r = pickPattern({ durationS: 4, toleranceS: 10, complexity: 1 });
  assert.equal(r.pattern, 'SYNC');
  assert.equal(r.reason, 'Short, simple, and fits inside the wait window — hold the connection.');
});

test('picker: run past the 29s gateway limit goes ASYNC with gateway reason', () => {
  const r = pickPattern({ durationS: 45, toleranceS: 60, complexity: 1 });
  assert.equal(r.pattern, 'ASYNC');
  assert.equal(r.reason, 'Run exceeds the illustrative 29s gateway limit — the connection would drop.');
});

test('picker: run past patience but under the gateway goes ASYNC with wait-window reason', () => {
  const r = pickPattern({ durationS: 25, toleranceS: 10, complexity: 2 });
  assert.equal(r.pattern, 'ASYNC');
  assert.equal(r.reason, 'Run exceeds the wait window — return a job id instead of holding the line.');
});

test('picker: short tangled job goes ASYNC for complexity', () => {
  const r = pickPattern({ durationS: 12, toleranceS: 30, complexity: 5 });
  assert.equal(r.pattern, 'ASYNC');
  assert.equal(r.reason, 'High-complexity multi-step work — checkpoint it in the background.');
});

test('engine: reference tables are populated', () => {
  assert.equal(SYNC_LIMIT_S, 29);
  assert.equal(EXAMPLE_LONG_RUN_S, 45);
  assert.equal(SYNC_STEPS.length, 4);
  assert.equal(ASYNC_STAGES.length, 5);
  assert.equal(INFRA_ROWS.length, 5);
  assert.equal(FAILURE_MODES.length, 3);
  assert.equal(DECISION_PRESETS.length, 5);
});

test('engine: presets pick the expected patterns', () => {
  const got = DECISION_PRESETS.map((p) => pickPattern(p).pattern);
  assert.deepEqual(got, ['SYNC', 'SYNC', 'ASYNC', 'ASYNC', 'ASYNC']);
});

test('engine: code snippets are non-empty strings without template hazards', () => {
  for (const snippet of [CODE_SYNC, CODE_ASYNC]) {
    assert.equal(typeof snippet, 'string');
    assert.ok(snippet.length > 50);
    assert.ok(!snippet.includes('${'), 'no unescaped ${ in embedded code strings');
  }
});
