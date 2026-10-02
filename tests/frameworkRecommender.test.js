import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { classifyTask, recommendFrameworks, listTaskTypes } from '../src/services/frameworkRecommender.js';
import { getFramework } from '../src/services/frameworkLibrary.js';

describe('frameworkRecommender', () => {
  it('classifies obvious tasks with cited keywords', () => {
    const c = classifyTask('Debug this Python function, it throws an error');
    assert.ok(c.length > 0);
    assert.equal(c[0].type, 'coding');
    assert.ok(c[0].matched.includes('debug'));
  });

  it('recommends real frameworks with reasons for a writing task', () => {
    const r = recommendFrameworks('Write a blog post about our launch for marketers');
    assert.ok(r.recommendations.length >= 1 && r.recommendations.length <= 3);
    for (const rec of r.recommendations) {
      assert.ok(rec.name && rec.tier && rec.score >= 0);
      assert.ok(Array.isArray(rec.reasons) && rec.reasons.length > 0);
      assert.ok(typeof rec.tradeoffs === 'string' && rec.tradeoffs.length > 0);
    }
    assert.ok(r.detectedTypes.includes('writing'));
  });

  it('falls back honestly on empty input', () => {
    const r = recommendFrameworks('');
    assert.equal(r.fallback, true);
    assert.ok(r.recommendations.length > 0);
    assert.ok(r.recommendations.every((x) => x.score === 0));
  });

  it('offers a simpler alternative for Advanced picks', () => {
    const r = recommendFrameworks('Build an agent that uses search tools and APIs', { limit: 5 });
    const advanced = r.recommendations.filter((x) => x.tier === 'Advanced');
    assert.ok(advanced.length > 0);
    assert.ok(advanced.every((x) => typeof x.simplerAlternative === 'string' && x.simplerAlternative.length > 0));
  });

  it('respects the limit and never invents framework names', () => {
    const r = recommendFrameworks('plan my wedding itinerary and schedule', { limit: 2 });
    assert.equal(r.recommendations.length, 2);
    assert.ok(r.recommendations.every((x) => getFramework(x.name) !== null));
  });

  it('lists 9 task types', () => {
    assert.equal(listTaskTypes().length, 9);
  });
});
