import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DUAL_FLOW, DUAL_LIMITS, EXFIL_URL_EXAMPLE } from '../src/agentGuardrails/agentGuardrailsEngine.js';

describe('DUAL_FLOW steps', () => {
  it('has exactly 5 steps numbered 1..5', () => {
    assert.equal(DUAL_FLOW.length, 5);
    assert.deepEqual(DUAL_FLOW.map((s) => s.step), [1, 2, 3, 4, 5]);
  });

  it('actor sequence is controller → privileged → controller → quarantined → controller', () => {
    assert.deepEqual(DUAL_FLOW.map((s) => s.actor), [
      'controller',
      'privileged',
      'controller',
      'quarantined',
      'controller',
    ]);
  });

  it('every step carries action and sees', () => {
    for (const s of DUAL_FLOW) {
      assert.ok(s.action && s.action.length > 30, `step ${s.step} action`);
      assert.ok(s.sees && s.sees.length > 30, `step ${s.step} sees`);
    }
  });

  it('privileged plans with variables and never sees raw data', () => {
    const privileged = DUAL_FLOW.filter((s) => s.actor === 'privileged');
    assert.equal(privileged.length, 1);
    const blob = `${privileged[0].action} ${privileged[0].sees}`;
    assert.match(blob, /\$VAR/);
    assert.match(blob, /never sees|never seen|not the content|never held/i);
  });

  it('quarantined reader is tool-less and sees only untrusted text', () => {
    const q = DUAL_FLOW.find((s) => s.actor === 'quarantined');
    assert.equal(q.step, 4);
    const blob = `${q.action} ${q.sees}`;
    assert.match(blob, /tool-less|no tools/i);
    assert.match(blob, /untrusted/i);
  });

  it('controller substitutes only at display time', () => {
    const last = DUAL_FLOW[4];
    assert.equal(last.actor, 'controller');
    const blob = `${last.action} ${last.sees}`;
    assert.match(blob, /substitut/i);
    assert.match(blob, /display time/i);
  });
});

describe('DUAL_LIMITS shape', () => {
  it('exactly 3 limits with limit, detail, mitigation', () => {
    assert.equal(DUAL_LIMITS.length, 3);
    for (const l of DUAL_LIMITS) {
      assert.ok(l.limit && l.limit.length > 5);
      assert.ok(l.detail && l.detail.length > 30, `${l.limit} detail`);
      assert.ok(l.mitigation && l.mitigation.length > 20, `${l.limit} mitigation`);
    }
  });

  it('covers poisoned summary with a clickable link, shared substrate, and non-shield', () => {
    const blob = JSON.stringify(DUAL_LIMITS);
    assert.match(blob, /link/i);
    assert.match(blob, /memory|network|context/i);
    assert.match(blob, /not a complete shield|layer|injection/i);
    assert.match(blob, /untrustworthy|poison/i);
  });
});

describe('EXFIL_URL_EXAMPLE keywords', () => {
  it('describes base64 data hidden in a query-string URL', () => {
    const blob = JSON.stringify(EXFIL_URL_EXAMPLE);
    assert.match(blob, /base64/i);
    assert.match(blob, /query-string|query string|\?d=/i);
    assert.match(blob, /attacker/i);
    assert.match(blob, /stolen/i);
  });

  it('notes the privileged layer never sees the payload content', () => {
    assert.match(EXFIL_URL_EXAMPLE.blindSpot, /never sees/i);
    assert.match(EXFIL_URL_EXAMPLE.blindSpot, /leak/i);
    assert.match(EXFIL_URL_EXAMPLE.request, /<base64/i);
  });

  it('mitigation names blocklist/allowlist outbound domain control', () => {
    assert.match(EXFIL_URL_EXAMPLE.mitigation, /blocklist/i);
    assert.match(EXFIL_URL_EXAMPLE.mitigation, /allowlist/i);
    assert.match(EXFIL_URL_EXAMPLE.mitigation, /outbound/i);
    assert.match(EXFIL_URL_EXAMPLE.mitigation, /domains/i);
  });
});
