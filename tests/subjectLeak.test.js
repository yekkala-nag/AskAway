import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SPLITS, ANCHOR, AUDIT_CHECKS, LESSONS,
  makeCorpus, estimateAccuracies, splitGrid, leakedSubjects,
  LEAK_PHASE1, LEAK_PHASE2,
} from '../src/subjectLeak/subjectLeakEngine.js';

test('corpus: subjects × segments with stable per-subject signature', () => {
  const rows = makeCorpus({ subjects: 6, segmentsPerSubject: 8 });
  assert.equal(rows.length, 48);
  const bySubject = {};
  for (const r of rows) (bySubject[r.subject] = bySubject[r.subject] || []).push(r);
  assert.equal(Object.keys(bySubject).length, 6);
  for (const segs of Object.values(bySubject)) {
    assert.equal(segs.length, 8);
    // same signature object identity across a subject's segments
    for (let i = 1; i < segs.length; i += 1) assert.equal(segs[i].signature, segs[0].signature);
  }
});

test('splits: exactly one leaky protocol', () => {
  assert.equal(SPLITS.length, 5);
  assert.equal(SPLITS.filter((s) => s.leakage).length, 1);
  assert.equal(SPLITS.find((s) => s.leakage).id, 'segment');
  for (const s of SPLITS) {
    assert.ok(s.desc.length > 20);
    assert.ok(s.inflated.length > 10);
  }
});

test('estimateAccuracies: inflated ≥ honest, gap grows with segments', () => {
  const a = estimateAccuracies({ subjects: 8, segmentsPerSubject: 4, signalStrength: 0.7 });
  const b = estimateAccuracies({ subjects: 8, segmentsPerSubject: 24, signalStrength: 0.7 });
  assert.ok(a.inflated >= a.honest);
  assert.ok(b.gap >= a.gap, 'more segments per subject → more memorization credit');
  assert.ok(b.inflated <= 97, 'capped');
  assert.equal(a.total, 32);
});

test('splitGrid + leakedSubjects: segment leaks, subject does not', () => {
  const segGrid = splitGrid(8, 10, 'segment');
  const segLeaked = leakedSubjects(segGrid);
  assert.ok(segLeaked.length >= 5, 'segment split puts most subjects on both sides');

  const subjGrid = splitGrid(8, 10, 'subject');
  assert.equal(leakedSubjects(subjGrid).length, 0, 'subject split is clean');

  const loo = splitGrid(8, 10, 'leaveone');
  assert.equal(leakedSubjects(loo).length, 0);

  const sess = splitGrid(8, 10, 'session');
  // session split: each subject's first half train, second half test → every subject leaks by design? No — session split keeps sessions separate but subject may appear both. Check consistency: all subjects have both halves.
  const sessLeaked = leakedSubjects(sess);
  assert.equal(sessLeaked.length, 8, 'session split keeps subject on both sides but never the same session');
});

test('anchor numbers are internally consistent', () => {
  assert.ok(ANCHOR.segmentAcc > ANCHOR.subjectAcc);
  assert.equal(Math.round((ANCHOR.segmentAcc - ANCHOR.subjectAcc) * 10) / 10, ANCHOR.gap);
});

test('audit checklist has 6 substantive questions', () => {
  assert.equal(AUDIT_CHECKS.length, 6);
  for (const c of AUDIT_CHECKS) {
    assert.ok(c.q.endsWith('?'), 'questions end with ?');
    assert.ok(c.why.length > 15);
  }
  assert.equal(LESSONS.length, 3);
});

test('two-phase gate: withhold then emit', () => {
  assert.match(LEAK_PHASE1, /DO NOT RUN/i);
  assert.match(LEAK_PHASE1, /DO NOT compute/i);
  assert.match(LEAK_PHASE2, /\| Leakage Vector \| Severity \| Expected Inflation \| Fix \|/);
  assert.match(LEAK_PHASE2, /split unit must be stated first/i);
  assert.match(LEAK_PHASE2, /If the split is clean, say so/i);
});

test('no attribution strings', () => {
  const blob = JSON.stringify({ SPLITS, ANCHOR, AUDIT_CHECKS, LESSONS });
  assert.ok(!/https?:|towardsdatascience|pmc\.ncbi|arxiv/i.test(blob));
});
