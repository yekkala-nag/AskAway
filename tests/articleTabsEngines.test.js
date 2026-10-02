import test from 'node:test';
import assert from 'node:assert/strict';

import {
  PHASES, CRAM_VS_UNDERSTAND, PROGRESS_MEASURES, LESSONS,
  trainAccAt, testAccAt, phaseAt,
} from '../src/grokking/grokkingEngine.js';
import {
  ROUTE_SET, REQUEST_LOG, evalPolicy, APPROACHES, CONTRACT_STEPS, EVAL_DIMENSIONS,
} from '../src/decisionLayer/decisionLayerEngine.js';
import {
  PATTERNS, ATTACK_VECTORS, evaluateStack, RESEARCH_STACK,
} from '../src/agentGuardrails/agentGuardrailsEngine.js';
import {
  HEAD_SWAP, PARAMS, accuracyAt, confusionAt, DATASET,
} from '../src/system1Head/system1HeadEngine.js';
import {
  COMMANDS, DIY_COMMANDS, composePrompt, customInstructionText,
} from '../src/slashCommands/slashCommandsEngine.js';

// ── grokking ──
test('grokking: train accuracy saturates by 1k steps, test stays near random early', () => {
  assert.equal(trainAccAt(780), 1);
  assert.equal(trainAccAt(1000), 1);
  assert.ok(testAccAt(1000) < 0.16, 'test still near chance at 1k');
  assert.ok(testAccAt(20000) > 0.96, 'test near-perfect after the click');
});

test('grokking: phases cover the full timeline', () => {
  assert.equal(PHASES.length, 4);
  assert.equal(phaseAt(500).id, 'fit');
  assert.equal(phaseAt(5000).id, 'plateau');
  assert.equal(phaseAt(15000).id, 'takeover');
  assert.equal(phaseAt(40000).id, 'general');
});

test('grokking: reference tables are populated', () => {
  assert.equal(CRAM_VS_UNDERSTAND.length, 6);
  assert.equal(PROGRESS_MEASURES.length, 4);
  assert.equal(LESSONS.length, 5);
});

// ── decision layer ──
test('decision layer: every request has scores for every route', () => {
  for (const r of REQUEST_LOG) {
    const sum = ROUTE_SET.reduce((s, route) => s + r.scores[route], 0);
    assert.ok(Math.abs(sum - 1) < 0.02, `${r.id} scores sum ${sum}`);
  }
});

test('decision layer: policy evaluation — strict threshold reduces coverage', () => {
  const loose = evalPolicy(0.55, 0.0);
  const strict = evalPolicy(0.90, 0.15);
  assert.ok(loose.coverage > strict.coverage);
  assert.ok(strict.risk <= loose.risk + 1e-9);
  assert.equal(loose.total, 12);
  assert.equal(loose.autoCount + loose.abstain, 12);
  assert.ok(loose.rows.every((row) => ['auto ✓', 'auto ✗', 'abstain'].includes(row.verdict)));
});

test('decision layer: contract and eval structures are complete', () => {
  assert.equal(CONTRACT_STEPS.length, 5);
  assert.equal(EVAL_DIMENSIONS.length, 4);
  assert.equal(APPROACHES.length, 3);
  assert.ok(APPROACHES.every((a) => a.latencyMs > 0 && a.costPer1k > 0));
});

// ── agent guardrails ──
test('guardrails: no patterns covers nothing; full stack leaves sandbox escape open', () => {
  const none = evaluateStack([]);
  assert.equal(none.covered.length, 0);
  assert.equal(none.coverage, 0);

  const all = evaluateStack(PATTERNS.map((p) => p.id));
  assert.equal(all.covered.length, ATTACK_VECTORS.length - 1);
  assert.deepEqual(all.residual.map((v) => v.id), ['sandbox_escape']);
  assert.ok(all.complete, 'full pattern set closes every modeled critical vector except sandbox');
});

test('guardrails: patterns reference real attack vectors', () => {
  const ids = new Set(ATTACK_VECTORS.map((v) => v.id));
  for (const p of PATTERNS) {
    for (const b of p.blocks) assert.ok(ids.has(b), `${p.id} blocks unknown ${b}`);
  }
  assert.equal(RESEARCH_STACK.length, 6);
});

// ── system 1 head ──
test('head swap: 3,074 trainable params, accuracy is a rising 0.5→1 curve', () => {
  assert.equal(PARAMS.headParams, 3074);
  assert.equal(accuracyAt(0), 0.5);
  assert.ok(accuracyAt(10) > accuracyAt(5));
  assert.ok(accuracyAt(50) <= 0.995);
  const a = accuracyAt(20), b = accuracyAt(30);
  assert.ok(a <= b, 'accuracy never decreases');
});

test('head swap: confusion matrix always accounts for all 40 examples', () => {
  for (let e = 0; e <= 50; e += 5) {
    const c = confusionAt(e);
    assert.equal(c.tp + c.fn, 20);
    assert.equal(c.tn + c.fp, 20);
    assert.equal(c.tp + c.fn + c.fp + c.tn, 40);
  }
  assert.equal(HEAD_SWAP.length, 7);
  assert.equal(DATASET.length, 10);
  assert.ok(DATASET.some((d) => d.label === 'mismatch'));
});

// ── slash commands ──
test('slash commands: 9 built-ins, each composes with its command prefix', () => {
  assert.equal(COMMANDS.length, 9);
  for (const c of COMMANDS) {
    assert.match(c.cmd, /^\/[a-z]+$/);
    const composed = composePrompt(c.cmd, 'do the thing');
    assert.equal(composed, `${c.cmd} do the thing`);
    assert.ok(c.effect.length > 10 && c.expect.length > 10);
  }
  assert.equal(DIY_COMMANDS.length, 4);
});

test('slash commands: instruction text includes every DIY command, no URLs', () => {
  const text = customInstructionText();
  for (const d of DIY_COMMANDS) assert.ok(text.includes(d.cmd), `missing ${d.cmd}`);
  assert.ok(!/https?:\/\//.test(text), 'no external links');
});
