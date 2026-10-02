import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildContract, validateAgainstContract, CONTRACT_NOTICE, CONTRACT_TEMPLATES } from '../src/services/outputContract.js';

describe('outputContract', () => {
  it('validates JSON contracts: keys, types, parse failures', () => {
    const c = buildContract({ format: 'json', requiredKeys: ['name', 'score'], types: { name: 'string', score: 'number' } });
    const good = validateAgainstContract(JSON.stringify({ name: 'x', score: 10 }), c);
    assert.equal(good.pass, true);
    assert.ok(good.notice === CONTRACT_NOTICE);
    const badType = validateAgainstContract(JSON.stringify({ name: 'x', score: 'ten' }), c);
    assert.equal(badType.pass, false);
    assert.ok(badType.failed >= 1);
    const notJson = validateAgainstContract('not json {', c);
    assert.equal(notJson.pass, false);
    const missingKey = validateAgainstContract(JSON.stringify({ name: 'x' }), c);
    assert.equal(missingKey.pass, false);
  });

  it('validates bullet/numbered counts and min/max', () => {
    const c = buildContract({ format: 'bullets', minItems: 2, maxItems: 4 });
    assert.equal(validateAgainstContract('- one\n- two', c).pass, true);
    assert.equal(validateAgainstContract('- only one', c).pass, false);
    assert.equal(validateAgainstContract('- 1\n- 2\n- 3\n- 4\n- 5', c).pass, false);
  });

  it('validates table columns and section presence', () => {
    const c = buildContract({ format: 'table', columns: ['Step', 'Owner'], sections: ['Summary'] });
    const r = validateAgainstContract('Summary\n| Step | Owner |\n|---|---|\n| 1 | me |', c);
    assert.equal(r.pass, true);
    const missing = validateAgainstContract('| Nope | Other |\n|---|---|', c);
    assert.equal(missing.pass, false);
  });

  it('never claims factual verification', () => {
    const c = buildContract({ format: 'json', requiredKeys: ['a'] });
    const r = validateAgainstContract('{"a":1}', c);
    const blob = JSON.stringify(r) + CONTRACT_NOTICE;
    assert.ok(!/factually correct|accurate answer|semantic score/i.test(blob));
  });

  it('ships reusable templates', () => {
    assert.ok(Object.keys(CONTRACT_TEMPLATES).length >= 5);
    for (const t of Object.values(CONTRACT_TEMPLATES)) assert.ok(t.format);
  });
});
