import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ORG_VOCAB, BUILD_ORDER, ORG_ROLES,
  evaluateOrgChart, accountabilityMessage,
  KANBAN_STAGES, SPEC_PARTS, nextStage, checkSpec,
  FAILURE_MODES, evaluateRoleTightness,
  DAY_ONE_NEEDS, WORKFLOW_VS_PROCESS, ACCOUNTABILITY_RULES,
  reviewCapacity,
} from '../src/agentOrgChart/agentOrgChartEngine.js';

test('vocab and build order are populated', () => {
  assert.equal(ORG_VOCAB.length, 4);
  assert.deepEqual(ORG_VOCAB.map((v) => v.term), ['worker', 'position', 'role', 'responsibility']);
  assert.deepEqual(BUILD_ORDER.map((b) => b.name), ['List the jobs', 'Write the role', 'Hire the worker']);
  assert.equal(ORG_ROLES.length, 5);
  assert.equal(ORG_ROLES[0].id, 'lead');
  assert.equal(ORG_ROLES[0].mustBeHuman, true);
});

test('evaluateOrgChart: full healthy chart with human lead', () => {
  const r = evaluateOrgChart({ lead: 'human', planner: 'ai', builder: 'ai', reviewer: 'human', messenger: 'ai' });
  assert.equal(r.status, 'healthy');
  assert.equal(r.missingHumanAtTop, false);
  assert.equal(r.topFilled, true);
  assert.deepEqual(r.unstaffed, []);
  assert.equal(r.humanCount, 2);
  assert.equal(r.aiCount, 3);
  assert.equal(r.staffed, 5);
  assert.deepEqual(r.chain.map((c) => c.id), ['lead', 'planner', 'builder', 'reviewer', 'messenger']);
});

test('evaluateOrgChart: ai at top flags no-human-at-top', () => {
  const r = evaluateOrgChart({ lead: 'ai', planner: 'ai', builder: 'ai', reviewer: 'ai', messenger: 'ai' });
  assert.equal(r.status, 'no-human-at-top');
  assert.equal(r.missingHumanAtTop, true);
  assert.equal(r.topFilled, true);
});

test('evaluateOrgChart: empty chart is incomplete with all seats open', () => {
  const r = evaluateOrgChart({});
  assert.equal(r.status, 'incomplete');
  assert.equal(r.topFilled, false);
  assert.equal(r.missingHumanAtTop, true);
  assert.deepEqual(r.unstaffed, ['lead', 'planner', 'builder', 'reviewer', 'messenger']);
});

test('evaluateOrgChart: partial staffing lists open seats', () => {
  const r = evaluateOrgChart({ lead: 'human', builder: 'ai' });
  assert.equal(r.status, 'incomplete');
  assert.deepEqual(r.unstaffed, ['planner', 'reviewer', 'messenger']);
  assert.equal(r.humanCount, 1);
  assert.equal(r.aiCount, 1);
});

test('accountabilityMessage covers all branches exactly', () => {
  assert.equal(accountabilityMessage(evaluateOrgChart({})), 'Nobody sits at the top seat — priorities have no owner.');
  assert.equal(
    accountabilityMessage(evaluateOrgChart({ lead: 'ai', planner: 'ai', builder: 'ai', reviewer: 'ai', messenger: 'ai' })),
    'Top seat is filled but not by a person — nobody can answer for outcomes.'
  );
  assert.equal(
    accountabilityMessage(evaluateOrgChart({ lead: 'human', builder: 'ai' })),
    'Open seats: planner, reviewer, messenger — outcomes without owners drift.'
  );
  assert.equal(
    accountabilityMessage(evaluateOrgChart({ lead: 'human', planner: 'ai', builder: 'ai', reviewer: 'human', messenger: 'ai' })),
    'Every seat staffed, a person sits at the top — the chain of responsibility is complete.'
  );
});

test('kanban stages order and nextStage walk the full path', () => {
  assert.deepEqual(KANBAN_STAGES.map((s) => s.id), ['backlog', 'spec', 'approve', 'build', 'review']);
  assert.equal(nextStage('backlog'), 'spec');
  assert.equal(nextStage('spec'), 'approve');
  assert.equal(nextStage('approve'), 'build');
  assert.equal(nextStage('build'), 'review');
  assert.equal(nextStage('review'), null);
  assert.equal(nextStage('nope'), null);
});

test('checkSpec requires all three parts', () => {
  assert.deepEqual(SPEC_PARTS.map((p) => p.id), ['requirements', 'design', 'todo']);
  assert.deepEqual(checkSpec({ requirements: 'r', design: 'd', todo: 't' }), { complete: true, missing: [] });
  assert.deepEqual(checkSpec({ requirements: 'r', design: '', todo: 't' }), { complete: false, missing: ['design'] });
  assert.deepEqual(checkSpec({}), { complete: false, missing: ['requirements', 'design', 'todo'] });
  assert.deepEqual(checkSpec({ requirements: '   ', design: 'd', todo: 't' }), { complete: false, missing: ['requirements'] });
});

test('failure modes table has the four rows', () => {
  assert.equal(FAILURE_MODES.length, 4);
  assert.deepEqual(FAILURE_MODES.map((f) => f.id), ['self-trigger', 'chatter', 'not-human', 'politics']);
  for (const f of FAILURE_MODES) {
    assert.ok(f.symptom.length > 0 && f.cause.length > 0 && f.fix.length > 0);
  }
});

test('evaluateRoleTightness: broad without board is politics-risk', () => {
  const r = evaluateRoleTightness('broad', false);
  assert.equal(r.status, 'politics-risk');
  assert.ok(r.warning.includes('Broad roles'));
});

test('evaluateRoleTightness: tight plus board is healthy', () => {
  const r = evaluateRoleTightness('tight', true);
  assert.equal(r.status, 'healthy');
  assert.ok(r.warning.includes('Tight roles plus a task board'));
});

test('evaluateRoleTightness: middle branches', () => {
  assert.equal(evaluateRoleTightness('broad', true).status, 'strained');
  assert.equal(evaluateRoleTightness('balanced', true).status, 'healthy');
  assert.equal(evaluateRoleTightness('balanced', false).status, 'strained');
  assert.equal(evaluateRoleTightness('tight', false).status, 'strained');
});

test('accountability reference data populated', () => {
  assert.equal(DAY_ONE_NEEDS.length, 2);
  assert.equal(WORKFLOW_VS_PROCESS.length, 2);
  assert.equal(ACCOUNTABILITY_RULES.length, 3);
  assert.deepEqual(ACCOUNTABILITY_RULES.map((r) => r.id), ['human-top', 'plan-not-pile', 'one-owner']);
});

test('reviewCapacity: small pile fits, big pile does not', () => {
  assert.deepEqual(reviewCapacity(5, 5, 60), {
    needed: 25,
    minutesAvailable: 60,
    feasible: true,
    verdict: 'Review fits the shift — approve card by card.',
  });
  const big = reviewCapacity(30, 5, 60);
  assert.equal(big.needed, 150);
  assert.equal(big.feasible, false);
  assert.equal(big.verdict, 'Review does not fit — shrink scope or approve the plan earlier, not the pile later.');
});
