import test from 'node:test';
import assert from 'node:assert/strict';

// ── agent observability ──
import {
  SAMPLE_RUNS, evaluateRun, SPAN_TYPES, ALERTS, SAMPLING_TIERS, PRIVACY_RULES, PIPELINE_STEPS,
} from '../src/agentObservability/agentObservabilityEngine.js';

const TH = { ratio: 6, tokenMultiplier: 5 };

test('observability: clean run produces a single ok finding', () => {
  const findings = evaluateRun(SAMPLE_RUNS[0], TH);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].level, 'ok');
});

test('observability: duplicate tool run flags the redundant sibling', () => {
  const findings = evaluateRun(SAMPLE_RUNS[1], TH);
  const dup = findings.find((f) => f.text.includes('refund_lookup') && f.text.includes('2×'));
  assert.ok(dup, 'duplicate tool call detected');
  assert.equal(dup.level, 'warn');
});

test('observability: runaway run raises duration, error and token alarms', () => {
  const findings = evaluateRun(SAMPLE_RUNS[2], { ratio: 6, tokenMultiplier: 2 });
  const texts = findings.map((f) => f.text).join(' | ');
  assert.ok(texts.includes('3× — redundant tool loop'));
  assert.ok(texts.includes('p99 threshold 30s'));
  assert.ok(texts.includes('failed step(s)'));
  assert.ok(texts.includes('runaway loop alarm fires'), 'tight token threshold trips the alarm');
  assert.ok(findings.some((f) => f.level === 'error'));
});

test('observability: reference tables are populated', () => {
  assert.equal(SPAN_TYPES.length, 5);
  assert.equal(ALERTS.length, 4);
  assert.equal(SAMPLING_TIERS.length, 5);
  assert.equal(PRIVACY_RULES.length, 4);
  assert.equal(PIPELINE_STEPS.length, 4);
});

// ── cost tollbooth ──
import {
  PRICE_TIERS, CACHE_WINDOWS, TRIMS, CHEAT_SHEET, conversationCost, spacedCost,
} from '../src/costTollBooth/costTollBoothEngine.js';

const TURNS = [{ in: 900, out: 450 }, { in: 900, out: 450 }, { in: 900, out: 450 }];

test('cost: warm cache cuts the replay cost below the naive baseline', () => {
  const r = conversationCost(TURNS, { windowMin: 60, gapMin: 0, tierKey: 'middle', cacheEnabled: true });
  assert.equal(r.misses, 0);
  assert.ok(r.cost < r.naive, 'cache always cheaper');
  assert.ok(r.savings > 0 && r.savingsPct > 0);
  assert.ok(Math.abs(r.savings - (r.naive - r.cost)) < 1e-9);
  assert.equal(r.outputTokens, 1350);
});

test('cost: a gap beyond the cache window forces full-price re-reads', () => {
  const warm = conversationCost(TURNS, { windowMin: 60, gapMin: 0, tierKey: 'middle', cacheEnabled: true });
  const cold = conversationCost(TURNS, { windowMin: 5, gapMin: 30, tierKey: 'middle', cacheEnabled: true });
  assert.ok(cold.misses > warm.misses);
  assert.ok(cold.cost > warm.cost);
  assert.ok(cold.savingsPct < warm.savingsPct);
});

test('cost: cache disabled matches the naive baseline exactly', () => {
  const r = conversationCost(TURNS, { windowMin: 60, gapMin: 0, tierKey: 'light', cacheEnabled: false });
  assert.ok(Math.abs(r.cost - r.naive) < 1e-9, 'no cache → no savings');
  assert.equal(r.misses, 0);
});

test('cost: spaced questions lose part of the cache benefit', () => {
  const opts = { windowMin: 60, tierKey: 'top', cacheEnabled: true };
  const burst = spacedCost(10, 0, opts);
  const daily = spacedCost(10, 1440, opts);
  assert.ok(burst.savingsPct > daily.savingsPct, 'daily gaps bust the cache window');
});

test('cost: tiers and reference tables are populated', () => {
  assert.ok(PRICE_TIERS.light && PRICE_TIERS.middle && PRICE_TIERS.top);
  assert.equal(CACHE_WINDOWS.length, 4);
  assert.equal(TRIMS.length, 6);
  assert.equal(CHEAT_SHEET.length, 8);
});

// ── agent control plane ──
import {
  PLANES, NINE_STEPS, TIERS, evaluateTier, APPROVAL_FIELDS, AUDIT_EVENTS, EVALS, UNTRUSTED_DEFENSES,
} from '../src/agentControlPlane/agentControlPlaneEngine.js';

test('control plane: read-only with no signals stays T0 and auto-approved', () => {
  const r = evaluateTier({ sideEffect: 'read_only' });
  assert.equal(r.tier, 0);
  assert.equal(r.label, 'T0');
  assert.match(r.posture, /auto/);
  assert.ok(r.reasons.length >= 1);
});

test('control plane: irreversible actions floor at T4 even after escalations', () => {
  const r = evaluateTier({
    sideEffect: 'irreversible', identityInferred: true, untrustedInfluenced: true,
    crossTenantOrBulk: true, verified: false,
  });
  assert.equal(r.tier, 4, 'cap at T4');
  assert.match(r.posture, /deny/i);
  assert.equal(r.neverDemote, 'model confidence never lowers a tier');
});

test('control plane: untrusted content escalates a reversible write', () => {
  const base = evaluateTier({ sideEffect: 'reversible_write' });
  const escalated = evaluateTier({ sideEffect: 'reversible_write', untrustedInfluenced: true });
  assert.equal(base.tier, 2);
  assert.equal(escalated.tier, 3);
  assert.match(escalated.posture, /approval/i);
});

test('control plane: missing verification escalates', () => {
  const r = evaluateTier({ sideEffect: 'reversible_write', verified: false });
  assert.equal(r.tier, 3);
  assert.ok(r.reasons.some((x) => x.includes('verification')));
});

test('control plane: reference tables are complete', () => {
  assert.equal(PLANES.length, 3);
  assert.equal(NINE_STEPS.length, 9);
  assert.equal(TIERS.length, 5);
  assert.equal(APPROVAL_FIELDS.length, 7);
  assert.equal(AUDIT_EVENTS.length, 8);
  assert.equal(EVALS.length, 9);
  assert.equal(UNTRUSTED_DEFENSES.length, 6);
});

// ── agent lifecycle ──
import {
  LOOP_DECISION, BEHAVIORAL_CONTRACT, COORDINATION, DECISION_RIGHTS, RISKS,
  reviewCapacity, attemptStats,
} from '../src/agentLifecycle/agentLifecycleEngine.js';

test('lifecycle: 2% of 10k messages consumes all 200 review slots', () => {
  const r = reviewCapacity({ messagesPerDay: 10000, reviewSlots: 200, inconclusivePct: 2 });
  assert.equal(r.inconclusive, 200);
  assert.equal(r.headroom, 0);
  assert.equal(r.utilization, 1);
  assert.match(r.verdict, /TIGHT/);
});

test('lifecycle: exceeding the slot budget is reported as over capacity', () => {
  const r = reviewCapacity({ messagesPerDay: 10000, reviewSlots: 200, inconclusivePct: 4 });
  assert.ok(r.headroom < 0);
  assert.match(r.verdict, /OVER CAPACITY/);
});

test('lifecycle: half the slots in use leaves sustainable headroom', () => {
  const r = reviewCapacity({ messagesPerDay: 10000, reviewSlots: 400, inconclusivePct: 2 });
  assert.equal(r.headroom, 200);
  assert.match(r.verdict, /SUSTAINABLE/);
});

test('lifecycle: pass@k rises while all-k falls as attempts grow', () => {
  const one = attemptStats(1, 0.8);
  const three = attemptStats(3, 0.8);
  assert.ok(Math.abs(one.passAtK - 0.8) < 1e-12);
  assert.ok(Math.abs(one.allK - 0.8) < 1e-12);
  assert.ok(Math.abs(three.passAtK - 0.992) < 1e-12);
  assert.ok(Math.abs(three.allK - 0.512) < 1e-12);
  assert.ok(three.passAtK > one.passAtK && three.allK < one.allK);
});

test('lifecycle: reference tables are complete', () => {
  assert.equal(LOOP_DECISION.length, 2);
  assert.equal(BEHAVIORAL_CONTRACT.length, 5);
  assert.equal(COORDINATION.length, 6);
  assert.equal(DECISION_RIGHTS.length, 4);
  assert.equal(RISKS.length, 3);
});

// ── agentic UI workflow ──
import {
  WORKFLOWS, PARSE_FIELDS, wagnerWhitin, naivePolicies,
} from '../src/agenticUiWorkflow/agenticUiWorkflowEngine.js';

test('workflow: Wagner–Whitin finds the cheaper middle ground', () => {
  const d = [40, 60, 30, 70, 50, 40, 60, 80];
  const opt = wagnerWhitin(d, 500, 3);
  const naive = naivePolicies(d, 500, 3);
  assert.equal(opt.total, 2490);
  assert.equal(opt.batches.length, 3);
  assert.equal(naive.single.cost, 5450);
  assert.equal(naive.single.batches, 1);
  assert.equal(naive.lotForLot.cost, 4000);
  assert.equal(naive.lotForLot.batches, 8);
  assert.ok(opt.total < naive.single.cost);
  assert.ok(opt.total < naive.lotForLot.cost);
});

test('workflow: tiny example checks out by hand', () => {
  const opt = wagnerWhitin([10, 20, 30], 100, 1);
  assert.equal(opt.total, 180, 'single batch: 100 + (50+20)*1 holding');
  assert.equal(opt.batches.length, 1);
  assert.equal(opt.batches[0].qty, 60);
});

test('workflow: reference tables are complete', () => {
  assert.equal(WORKFLOWS.length, 2);
  assert.equal(WORKFLOWS[0].steps.length, 4);
  assert.equal(WORKFLOWS[1].steps.length, 5);
  assert.equal(PARSE_FIELDS.length, 5);
});

// ── temporal graph rag ──
import {
  FACTS, PIPELINE, FAILURE_MODES,
  temporalRetrieve, naiveRetrieve, recencyWeight, wasFactTrue,
} from '../src/temporalGraphRag/temporalGraphRagEngine.js';

const CEO = (f) => f.map((x) => `${x.object}:${x.weight.toFixed(4)}`);

test('temporal: query on 2023-11-18 admits Bob but not Charlie', () => {
  const r = temporalRetrieve(FACTS, 'Company', 'CEO', '2023-11-18', 365);
  assert.deepEqual(r.map((f) => f.object), ['Bob', 'Alice']);
  assert.ok(Math.abs(r[0].weight - 0.9981) < 1e-4, `Bob got ${CEO(r)[0]}`);
  assert.ok(Math.abs(r[1].weight - 0.1396) < 1e-3, `Alice got ${CEO(r)[1]}`);
});

test('temporal: query on 2023-12-01 ranks the full chaotic week', () => {
  const r = temporalRetrieve(FACTS, 'Company', 'CEO', '2023-12-01', 365);
  assert.deepEqual(r.map((f) => f.date), ['2023-11-21', '2023-11-19', '2023-11-17', '2021-01-15']);
  const expected = [0.9812, 0.9775, 0.9738, 0.1362];
  r.forEach((f, i) => assert.ok(Math.abs(f.weight - expected[i]) < 1e-3, `${f.object} → ${f.weight}`));
});

test('temporal: a 7-day half-life separates the chaotic week', () => {
  const r = temporalRetrieve(FACTS, 'Company', 'CEO', '2023-12-01', 7);
  assert.ok(Math.abs(r[0].weight - 0.3715) < 1e-3);
  assert.ok(Math.abs(r[1].weight - 0.3048) < 1e-3);
  assert.ok(r[3].weight < 1e-9, 'Alice is ancient news at half-life 7');
  assert.ok(r[0].weight - r[2].weight > 0.12, 'spread much wider than at 365 days');
});

test('temporal: naive search returns every CEO at once', () => {
  const n = naiveRetrieve(FACTS, 'Company', 'CEO');
  assert.equal(n.length, 4);
  assert.deepEqual(n.map((f) => f.object), ['Alice', 'Bob', 'Charlie', 'Bob']);
  assert.ok(n.every((f) => f.naiveScore === 1));
});

test('temporal: interval logic answers "was X actually CEO then?"', () => {
  assert.equal(wasFactTrue(FACTS, 'CEO', 'Bob', '2023-11-18'), true);
  assert.equal(wasFactTrue(FACTS, 'CEO', 'Bob', '2023-11-20'), false, 'Charlie held the role on the 20th');
  assert.equal(wasFactTrue(FACTS, 'CEO', 'Bob', '2023-12-01'), true);
  assert.equal(wasFactTrue(FACTS, 'CEO', 'Alice', '2023-11-18'), false);
});

test('temporal: future facts cap at 1.0 and never rank above present ones', () => {
  assert.equal(recencyWeight('2023-12-10', '2023-12-01', 365), 1.0);
  const r = temporalRetrieve(FACTS, 'Company', 'CEO', '2023-11-18', 365);
  assert.ok(!r.some((f) => f.date > '2023-11-18'), 'future facts excluded');
});

test('temporal: reference tables are complete', () => {
  assert.equal(PIPELINE.length, 5);
  assert.equal(FAILURE_MODES.length, 4);
  assert.equal(FACTS.length, 5);
});
