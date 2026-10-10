import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizedImpact, scoreNovelty, scoreCreativity, generateEpisodeCurve, rubricLabel,
} from '../src/agentCreativity/agentCreativityEngine.js';

test('normalizedImpact: midpoint', () => {
  assert.equal(normalizedImpact(72, 40, 90), 0.64);
});

test('normalizedImpact: clamps above top to 1', () => {
  assert.equal(normalizedImpact(120, 40, 90), 1);
});

test('normalizedImpact: clamps below baseline to 0', () => {
  assert.equal(normalizedImpact(10, 40, 90), 0);
});

test('normalizedImpact: baseline==top edge (score>=top → 1)', () => {
  assert.equal(normalizedImpact(50, 50, 50), 1);
});

test('normalizedImpact: baseline==top edge (score<top → 0)', () => {
  assert.equal(normalizedImpact(20, 50, 50), 0);
});

test('rubric boundaries: 0, 2, 4 flags', () => {
  assert.equal(scoreNovelty({}), 0);
  assert.equal(scoreNovelty({ recombines: true, transfers: true }), 2);
  assert.equal(scoreNovelty({ recombines: true, transfers: true, breaksAssumption: true, opensLineage: true }), 4);
});

test('rubric labels match boundaries', () => {
  assert.equal(rubricLabel(0), 'Routine');
  assert.equal(rubricLabel(4), 'Transformational');
});

test('scoreCreativity: feasibility gate zeroes output', () => {
  const r = scoreCreativity({ novelty: 4, impact: 1, feasible: false });
  assert.equal(r.creativity, 0);
  assert.equal(r.verdict, 'BLOCKED');
});

test('scoreCreativity: standout exact value', () => {
  const r = scoreCreativity({ novelty: 4, impact: 1, feasible: true });
  assert.equal(r.creativity, 1);
  assert.equal(r.verdict, 'STANDOUT');
});

test('scoreCreativity: mid readout exact value', () => {
  const r = scoreCreativity({ novelty: 2, impact: 0.5, feasible: true });
  assert.equal(r.creativity, 0.5);
  assert.equal(r.verdict, 'PROMISING');
});

test('curve: 10 points, novelty monotonic non-increasing', () => {
  for (const s of ['greedy', 'tree-search', 'evolutionary']) {
    const pts = generateEpisodeCurve(s, 10);
    assert.equal(pts.length, 10);
    for (let i = 1; i < pts.length; i++) {
      assert.ok(pts[i].novelty <= pts[i - 1].novelty, `${s} novelty rose at ep ${i + 1}`);
    }
  }
});

test('curve: deterministic values (greedy ep1, tree-search length)', () => {
  const g = generateEpisodeCurve('greedy', 10);
  assert.deepEqual(g[0], { episode: 1, novelty: 0.45, impact: 0.5 });
  assert.equal(g[9].novelty < g[0].novelty, true);
  assert.equal(g[9].impact > g[0].impact, true);
});
