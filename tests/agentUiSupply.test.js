import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SURFACES, VECTORS, LIFECYCLE, CONTROLS, CHAIN_COMPARISON,
  DEFENSE_WORKFLOW, VECTOR_CONTROLS, vectorsForSurface, simulate, simulateAll,
  SUPPLY_PHASE1, SUPPLY_PHASE2,
} from '../src/agentUiSupply/agentUiSupplyEngine.js';

test('surfaces and vectors form a consistent graph', () => {
  assert.equal(SURFACES.length, 6);
  assert.ok(VECTORS.length >= 6);
  const surfaceIds = new Set(SURFACES.map((s) => s.id));
  const controlIds = new Set(CONTROLS.map((c) => c.id));
  for (const v of VECTORS) {
    assert.ok(surfaceIds.has(v.surface), `${v.id} has a real surface`);
    assert.ok(v.severity >= 1 && v.severity <= 5);
    assert.ok(v.impact.length > 10);
    const blockers = VECTOR_CONTROLS[v.id];
    assert.ok(Array.isArray(blockers) && blockers.length >= 1, `${v.id} has blockers`);
    for (const b of blockers) assert.ok(controlIds.has(b), `${b} is a real control`);
  }
  for (const s of SURFACES) {
    // most surfaces have named vectors; ui has redress
    assert.ok(s.detail.length > 20);
  }
});

test('vectorsForSurface filters and sorts by severity desc', () => {
  const skill = vectorsForSurface('skill');
  assert.ok(skill.length >= 2);
  for (let i = 1; i < skill.length; i += 1) assert.ok(skill[i - 1].severity >= skill[i].severity);
  assert.equal(vectorsForSurface('nope').length, 0);
});

test('lifecycle has five phases in order', () => {
  assert.deepEqual(LIFECYCLE.map((p) => p.id), ['author', 'publish', 'install', 'execute', 'persist']);
  for (const p of LIFECYCLE) {
    assert.ok(p.actor.length > 2);
    assert.ok(p.risk.length > 15);
  }
});

test('simulate: no controls → attack succeeds; all controls → all blocked', () => {
  const naked = simulate('skillbackdoor', []);
  assert.equal(naked.blocked, false);
  assert.equal(naked.remainingRisk, 1);

  const full = simulateAll(CONTROLS.map((c) => c.id));
  assert.equal(full.filter((r) => r.blocked).length, VECTORS.length, 'full stack blocks every vector');

  const partial = simulate('indirect', ['quarantine']);
  assert.equal(partial.blocked, true);
  assert.equal(partial.remainingRisk, 0.4, 'partial blocker coverage leaves residual');

  const sigOnly = simulateAll(['provenance']);
  assert.ok(sigOnly.find((r) => r.id === 'slopsquat').blocked);
  assert.ok(!sigOnly.find((r) => r.id === 'indirect').blocked, 'provenance does not stop injection');
});

test('defense workflow and chain comparison are complete', () => {
  assert.equal(DEFENSE_WORKFLOW.length, 5);
  assert.equal(CHAIN_COMPARISON.length, 5);
  for (const row of CHAIN_COMPARISON) {
    assert.ok(row.traditional.length > 5 && row.agentic.length > 5);
  }
});

test('two-phase gate: inventory first, table second', () => {
  assert.match(SUPPLY_PHASE1, /DO NOT RUN/i);
  assert.match(SUPPLY_PHASE1, /Inventory surfaces only/i);
  assert.match(SUPPLY_PHASE2, /\| Surface \| Attack Vector \| Impact \| Control \| Residual Risk \|/);
  assert.match(SUPPLY_PHASE2, /architectural/i);
  assert.match(SUPPLY_PHASE2, /unimplemented controls are residual risk/i);
});

test('no attribution strings', () => {
  const blob = JSON.stringify({ SURFACES, VECTORS, LIFECYCLE, CONTROLS, DEFENSE_WORKFLOW });
  assert.ok(!/https?:|towardsdatascience|openai|anthropic|npm|pypi/i.test(blob));
});
