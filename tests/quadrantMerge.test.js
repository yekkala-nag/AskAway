import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  // pre-existing exports still intact
  EVAL_TASKS,
  SCORE_AGENT,
  // consistency-quadrant merge exports
  normalizedEditDistance,
  syntaxConsistency,
  normalizedEntropy,
  outputConsistency,
  classifyQuadrant,
  QUADRANT_GUIDE,
  TEMPERATURE_TRAJECTORY
} from '../src/agentEvals/agentEvalEngine.js';

describe('quadrantMerge engine intact', () => {
  it('keeps the original eval exports', () => {
    assert.equal(EVAL_TASKS.length, 4);
    assert.equal(typeof SCORE_AGENT, 'function');
    assert.equal(SCORE_AGENT(0.8, 3, 3, 4).verdict, 'GATE');
  });
});

describe('quadrantMerge normalizedEditDistance', () => {
  it('scores the classic kitten/sitting pair as 3/7', () => {
    assert.equal(normalizedEditDistance('kitten', 'sitting'), 3 / 7);
  });

  it('handles identity and empty edges', () => {
    assert.equal(normalizedEditDistance('abc', 'abc'), 0);
    assert.equal(normalizedEditDistance('', ''), 0);
    assert.equal(normalizedEditDistance('', 'abc'), 1);
    assert.equal(normalizedEditDistance('abc', ''), 1);
    assert.equal(normalizedEditDistance('a', 'b'), 1);
  });
});

describe('quadrantMerge syntaxConsistency', () => {
  it('returns 1 for identical repeats', () => {
    assert.equal(syntaxConsistency(['x = 1', 'x = 1', 'x = 1']), 1);
  });

  it('returns 1 for vacuous inputs', () => {
    assert.equal(syntaxConsistency([]), 1);
    assert.equal(syntaxConsistency(['solo']), 1);
  });

  it('returns 0 for a fully different pair', () => {
    assert.equal(syntaxConsistency(['a', 'b']), 0);
  });

  it('canonicalizes before comparing', () => {
    assert.equal(syntaxConsistency(['Hello   World', 'hello world']), 1);
  });

  it('scores kitten/sitting as 1 - 3/7', () => {
    assert.equal(syntaxConsistency(['kitten', 'sitting']), 0.5714);
  });
});

describe('quadrantMerge normalizedEntropy', () => {
  it('returns 0 for a single cluster', () => {
    assert.equal(normalizedEntropy([4]), 0);
  });

  it('returns 0 for empty input', () => {
    assert.equal(normalizedEntropy([]), 0);
  });

  it('returns 1 for all singletons', () => {
    assert.equal(normalizedEntropy([1, 1, 1, 1]), 1);
  });

  it('returns 1 for an even split', () => {
    assert.equal(normalizedEntropy([2, 2]), 1);
  });

  it('scores a 3-1 split exactly', () => {
    assert.equal(normalizedEntropy([3, 1]), 0.8113);
  });
});

describe('quadrantMerge outputConsistency', () => {
  it('returns 1 when every fingerprint agrees', () => {
    assert.equal(outputConsistency(['pass', 'pass', 'pass']), 1);
  });

  it('returns 1 for vacuous inputs', () => {
    assert.equal(outputConsistency([]), 1);
    assert.equal(outputConsistency(['solo']), 1);
  });

  it('returns 0 when every fingerprint differs', () => {
    assert.equal(outputConsistency(['a', 'b', 'c', 'd']), 0);
  });

  it('returns 0 for an even behavior split', () => {
    assert.equal(outputConsistency(['a', 'a', 'b', 'b']), 0);
  });

  it('scores a 3-1 behavior split exactly', () => {
    assert.equal(outputConsistency(['a', 'a', 'a', 'b']), 0.1887);
  });
});

describe('quadrantMerge classifyQuadrant', () => {
  it('maps each corner to its quadrant', () => {
    assert.equal(classifyQuadrant(0.9, 0.9), 'Q2');
    assert.equal(classifyQuadrant(0.9, 0.3), 'Q1');
    assert.equal(classifyQuadrant(0.3, 0.3), 'Q3');
    assert.equal(classifyQuadrant(0.3, 0.9), 'Q4');
  });

  it('counts threshold-edge values as high', () => {
    assert.equal(classifyQuadrant(0.8, 0.8), 'Q2');
    assert.equal(classifyQuadrant(0.8, 0.79), 'Q1');
    assert.equal(classifyQuadrant(0.79, 0.8), 'Q4');
  });

  it('honours a custom threshold including its edge', () => {
    assert.equal(classifyQuadrant(0.9, 0.9, 0.9), 'Q2');
    assert.equal(classifyQuadrant(0.7, 0.7, 0.9), 'Q3');
    assert.equal(classifyQuadrant(0.9, 0.7, 0.9), 'Q1');
  });

  it('defaults the threshold to 0.8', () => {
    assert.equal(classifyQuadrant(0.8, 0.8, undefined), 'Q2');
  });
});

describe('quadrantMerge QUADRANT_GUIDE', () => {
  it('covers all four quadrants with meaning and verdict', () => {
    assert.deepEqual(QUADRANT_GUIDE.map((g) => g.id), ['Q1', 'Q2', 'Q3', 'Q4']);
    for (const g of QUADRANT_GUIDE) {
      assert.ok(g.title && g.meaning && g.verdict && g.example);
    }
  });

  it('labels Q1 dangerous and Q4 most trustworthy', () => {
    const q1 = QUADRANT_GUIDE.find((g) => g.id === 'Q1');
    const q4 = QUADRANT_GUIDE.find((g) => g.id === 'Q4');
    assert.match(q1.verdict, /DANGEROUS/);
    assert.match(q4.verdict, /trustworthy/);
  });

  it('warns that Q2 agreement can be memorized', () => {
    const q2 = QUADRANT_GUIDE.find((g) => g.id === 'Q2');
    assert.match(q2.meaning, /memorized/);
  });
});

describe('quadrantMerge TEMPERATURE_TRAJECTORY', () => {
  it('ships at least two problem presets with point sweeps', () => {
    assert.ok(TEMPERATURE_TRAJECTORY.length >= 2);
    for (const t of TEMPERATURE_TRAJECTORY) {
      assert.ok(t.id && t.problem);
      assert.ok(t.points.length >= 3);
    }
  });

  it('keeps syntax monotonically decreasing as temperature rises', () => {
    for (const t of TEMPERATURE_TRAJECTORY) {
      for (let i = 1; i < t.points.length; i++) {
        assert.ok(t.points[i].temp > t.points[i - 1].temp, t.id + ' temps ascend');
        assert.ok(t.points[i].syntax < t.points[i - 1].syntax, t.id + ' syntax falls');
      }
    }
  });

  it('shows zero as jittery rather than deterministic', () => {
    for (const t of TEMPERATURE_TRAJECTORY) {
      assert.equal(t.points[0].temp, 0);
      assert.ok(t.points[0].syntax < 1, t.id + ' zero-temp syntax below 1');
    }
  });

  it('pins each optimum to a real sweep point', () => {
    for (const t of TEMPERATURE_TRAJECTORY) {
      assert.ok(t.points.some((pt) => pt.temp === t.optimalTemp), t.id + ' optimum on sweep');
    }
  });

  it('assigns different optima per problem', () => {
    const optima = TEMPERATURE_TRAJECTORY.map((t) => t.optimalTemp);
    assert.ok(new Set(optima).size >= 2);
  });
});
