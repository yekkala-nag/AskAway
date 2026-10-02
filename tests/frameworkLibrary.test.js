import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FRAMEWORKS, getFramework, listFrameworks } from '../src/services/frameworkLibrary.js';

describe('frameworkLibrary', () => {
  it('exposes 30 frameworks with required fields', () => {
    assert.equal(FRAMEWORKS.length, 30);
    for (const f of FRAMEWORKS) {
      for (const k of ['a', 'e', 'b', 'tier', 'icon', 'pts', 't']) {
        assert.ok(f[k] !== undefined && f[k] !== null && f[k] !== '', `missing ${k} on ${f.a}`);
      }
      assert.ok(Array.isArray(f.pts) && f.pts.length > 0);
      assert.ok(['Foundation', 'Structured', 'Advanced'].includes(f.tier));
    }
  });

  it('has unique names and templates', () => {
    const names = FRAMEWORKS.map((f) => f.a);
    assert.equal(new Set(names).size, 30);
  });

  it('getFramework resolves case-insensitively', () => {
    assert.equal(getFramework('trace').a, 'TRACE');
    assert.equal(getFramework('ReAct').a, 'ReAct');
    assert.equal(getFramework('nope'), null);
    assert.equal(getFramework(''), null);
  });

  it('listFrameworks returns name/tier/bestFor triples', () => {
    const list = listFrameworks();
    assert.equal(list.length, 30);
    assert.ok(list.every((x) => x.name && x.tier && x.bestFor));
  });
});
