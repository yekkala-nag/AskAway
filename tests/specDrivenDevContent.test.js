import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS, SDD_LOOP_STAGES, CAPSTONE } from '../src/specDrivenDev/specDrivenDevContent.js';

test('every lesson section renders with a body and/or bullets array', () => {
  for (const lesson of LESSONS) {
    assert.ok(Array.isArray(lesson.sections), `L${lesson.n} sections`);
    for (const s of lesson.sections) {
      assert.ok(s.heading, `L${lesson.n} section missing heading`);
      // shortcut: content authors may omit either key, but not both — a section
      // with neither renders as a bare heading. Upgrade to a schema if the data
      // ever outgrows hand editing.
      const hasBody = Array.isArray(s.body);
      const hasBullets = Array.isArray(s.bullets);
      assert.ok(hasBody || hasBullets, `L${lesson.n} "${s.heading}" has neither body nor bullets`);
      if (hasBody) for (const b of s.body) assert.equal(typeof b, 'string');
      if (hasBullets) for (const b of s.bullets) assert.equal(typeof b, 'string');
    }
    assert.equal(typeof lesson.exercise, 'string');
    assert.equal(typeof lesson.takeaway, 'string');
  }
});

test('all 8 lessons present with required fields', () => {
  assert.equal(LESSONS.length, 8);
  for (const l of LESSONS) {
    assert.ok(l.id && l.title && l.icon);
    assert.ok(Array.isArray(l.objectives) && l.objectives.length > 0);
  }
});

test('SDD loop and capstone data are structurally complete', () => {
  assert.equal(SDD_LOOP_STAGES.length, 7);
  for (const s of SDD_LOOP_STAGES) assert.ok(s.stage && s.produce && s.gate);
  assert.ok(CAPSTONE.deliverables.length > 0);
  assert.ok(CAPSTONE.rubric.length > 0);
});
