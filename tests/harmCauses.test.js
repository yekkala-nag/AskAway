import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HARMS, CAUSES, LINKS, FIX_STRATEGY, HARM_WORKFLOW,
  causesForHarm, harmsForCause, mitigationFor, residualHarm,
  HARM_PHASE1, HARM_PHASE2, LAYERS,
} from '../src/harmcauses/harmCausesEngine.js';

test('taxonomy: 6 harms, 9 causes, every link references real ids', () => {
  assert.equal(HARMS.length, 6);
  assert.equal(CAUSES.length, 9);
  for (const l of LINKS) {
    assert.ok(HARMS.some((h) => h.id === l.harm), `${l.harm} exists`);
    assert.ok(CAUSES.some((c) => c.id === l.cause), `${l.cause} exists`);
    assert.ok(l.strength >= 1 && l.strength <= 3);
  }
  // every harm has at least one cause; every cause has at least one harm
  for (const h of HARMS) assert.ok(causesForHarm(h.id).length >= 1, `${h.id} has causes`);
  for (const c of CAUSES) assert.ok(harmsForCause(c.id).length >= 1, `${c.id} has harms`);
});

test('causesForHarm sorted by strength desc', () => {
  const cs = causesForHarm('discrimination');
  for (let i = 1; i < cs.length; i += 1) assert.ok(cs[i - 1].strength >= cs[i].strength);
  assert.equal(cs[0].strength, 3);
});

test('every cause has a mitigation with residual < 3', () => {
  for (const c of CAUSES) {
    const m = mitigationFor(c.id);
    assert.ok(m, `${c.id} has mitigation`);
    assert.ok(m.lever.length > 10);
    assert.ok(m.residual < 3, `${c.id} residual under full strength`);
  }
});

test('residualHarm: no controls = full base; all controls < base', () => {
  const none = residualHarm('discrimination', []);
  assert.equal(none.pct, 100);
  assert.equal(none.base, none.residual);
  const all = residualHarm('discrimination', causesForHarm('discrimination').map((c) => c.id));
  assert.ok(all.residual < all.base, 'mitigations reduce residual');
  assert.ok(all.pct < 100 && all.pct > 0);
  const partial = residualHarm('discrimination', ['trainbias']);
  assert.ok(partial.residual < none.residual && partial.residual > all.residual);
});

test('fix strategies and workflow are complete', () => {
  assert.equal(FIX_STRATEGY.length, 3);
  assert.deepEqual(FIX_STRATEGY.map((f) => f.id), ['upstream', 'midstream', 'downstream']);
  assert.equal(HARM_WORKFLOW.length, 5);
  for (const s of HARM_WORKFLOW) {
    assert.ok(s.job.length > 15);
    assert.ok(s.output.length > 5);
  }
  assert.equal(LAYERS.length, 6);
  const layerIds = new Set(LAYERS.map((l) => l.id));
  for (const c of CAUSES) assert.ok(layerIds.has(c.layer), `${c.layer} is a known layer`);
});

test('two-phase gate: phase 1 withholds, phase 2 defines columns', () => {
  assert.match(HARM_PHASE1, /DO NOT RUN/i);
  assert.match(HARM_PHASE1, /approved/i);
  assert.match(HARM_PHASE1, /do NOT recommend controls/i);
  assert.match(HARM_PHASE2, /\| Harm \| Technical Cause \| Cause Layer \| Control \| Residual Risk \|/);
  assert.match(HARM_PHASE2, /upstream, midstream, or downstream/i);
});

test('no attribution strings in engine exports', () => {
  const blob = JSON.stringify({ HARMS, CAUSES, LINKS, HARM_WORKFLOW, LAYERS });
  assert.ok(!/https?:|towardsdatascience|openai|anthropic/i.test(blob));
});
