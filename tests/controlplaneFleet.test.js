import test from 'node:test';
import assert from 'node:assert/strict';

import {
  FLEET_SPRAWL,
  FLEET_PILLARS,
  FLEET_COST_TABLE,
  GLOBAL_POLICIES,
  ROUTER_TIERS,
  routeFleetTask,
  BUDGET_THRESHOLDS,
  evaluateFleetBudget,
  TRACE_FIELDS,
  FLEET_TRACE_SAMPLE,
} from '../src/agentControlPlane/agentControlPlaneEngine.js';

test('fleet: sprawl concept is genericized with no firm names', () => {
  assert.equal(FLEET_SPRAWL.headline, 'Agents multiply faster than governance');
  assert.match(FLEET_SPRAWL.forecast, /Industry analyst forecasts report/);
  assert.equal(FLEET_SPRAWL.drivers.length, 3);
});

test('fleet: five pillars end with cost', () => {
  assert.equal(FLEET_PILLARS.length, 5);
  assert.deepEqual(FLEET_PILLARS.map((p) => p.id), ['lifecycle', 'security', 'observability', 'risk', 'cost']);
  assert.match(FLEET_PILLARS[4].detail, /Routing plus budgets/);
});

test('fleet: cost table contrasts one agent vs fleet', () => {
  assert.equal(FLEET_COST_TABLE.length, 5);
  assert.equal(FLEET_COST_TABLE[0].dimension, 'Policy changes');
  assert.equal(FLEET_COST_TABLE[0].oneAgent, 'Edit one prompt');
  assert.equal(FLEET_COST_TABLE[0].fleet, 'One rule republished to every agent');
});

test('fleet: global policies cover attribute access and guardrails', () => {
  assert.equal(GLOBAL_POLICIES.length, 2);
  assert.equal(GLOBAL_POLICIES[0].name, 'Attribute-based access');
  assert.match(GLOBAL_POLICIES[0].detail, /tool-level permissioning/);
  assert.equal(GLOBAL_POLICIES[1].name, 'Per-request guardrails');
  assert.match(GLOBAL_POLICIES[1].detail, /block or mask sensitive data/);
});

test('fleet: router tiers route by complexity with exact costs', () => {
  assert.equal(ROUTER_TIERS.length, 3);
  assert.deepEqual(routeFleetTask(0.2, 1000), {
    tier: 'light', tierName: 'Light tier', costUsd: 0.02, latencyMs: 120, tokens: 1000,
  });
  assert.deepEqual(routeFleetTask(0.5, 1000), {
    tier: 'standard', tierName: 'Standard tier', costUsd: 0.12, latencyMs: 450, tokens: 1000,
  });
  assert.deepEqual(routeFleetTask(0.9, 2000), {
    tier: 'reasoning', tierName: 'Reasoning tier', costUsd: 1.2, latencyMs: 1400, tokens: 2000,
  });
});

test('fleet: budget thresholds trip nudge, alert, and block', () => {
  assert.equal(BUDGET_THRESHOLDS.length, 4);
  assert.deepEqual(evaluateFleetBudget({ spend: 500, budget: 1000 }), {
    ratio: 0.5, status: 'within', action: 'No action — spend is inside budget.',
  });
  assert.deepEqual(evaluateFleetBudget({ spend: 800, budget: 1000 }), {
    ratio: 0.8, status: 'nudge-to-cheaper', action: 'Nudge new tasks to a cheaper tier.',
  });
  assert.deepEqual(evaluateFleetBudget({ spend: 950, budget: 1000 }), {
    ratio: 0.95, status: 'alert', action: 'Alert the owner; require acknowledgement.',
  });
  assert.deepEqual(evaluateFleetBudget({ spend: 1200, budget: 1000 }), {
    ratio: 1.2, status: 'block', action: 'Block non-approved dispatches until budget resets.',
  });
});

test('fleet: unified trace carries name, args, errors, tokens, latency', () => {
  assert.deepEqual(TRACE_FIELDS, ['name', 'args', 'errors', 'tokens', 'latency']);
  assert.equal(FLEET_TRACE_SAMPLE.length, 4);
  assert.equal(FLEET_TRACE_SAMPLE[0].name, 'lookup_order');
  assert.equal(FLEET_TRACE_SAMPLE[2].errors, 'approval_required');
});
