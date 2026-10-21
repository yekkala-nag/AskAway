import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CORPUS,
  THRESHOLDS,
  PROBABLE_DUPLICATE_CUTOFF,
  EXACT_DUPLICATES,
  AUDIT_PAIRS,
  auditRows,
  probableDuplicates,
  maxOverlap,
  tagOverlap,
  allPairs,
  bandFor,
  sourceById,
  MATCH_TYPES,
  AUDIT_PHASE1,
  AUDIT_PHASE2,
  AUDIT_COMPLIANCE,
  PRIMARY_RULES,
} from '../src/dupaudit/dupAuditEngine.js';

test('corpus has nine sources with ids S1–S9 and no attribution', () => {
  assert.equal(CORPUS.length, 9);
  assert.deepEqual(CORPUS.map((s) => s.id), ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9']);
  for (const s of CORPUS) {
    assert.ok(s.excerpt.length > 30, `${s.id} has a real excerpt`);
    assert.ok(s.tags.length >= 3, `${s.id} has tags`);
    assert.ok(!/https?:|towardsdatascience|thenewstack/i.test(s.excerpt + s.theme + s.short), `${s.id} free of URLs/sources`);
  }
});

test('threshold bands: >80% is Probable Duplicate', () => {
  assert.equal(PROBABLE_DUPLICATE_CUTOFF, 80);
  assert.equal(bandFor(100), 'Exact Duplicate');
  assert.equal(bandFor(85), 'Probable Duplicate');
  assert.equal(bandFor(81), 'Probable Duplicate');
  assert.equal(bandFor(80), 'Related — Keep');
  assert.equal(bandFor(55), 'Related — Keep');
  assert.equal(bandFor(40), 'Distinct — Keep');
  assert.equal(THRESHOLDS.length, 4);
  assert.equal(MATCH_TYPES.length, 3);
});

test('audit: no exact duplicates, no probable duplicates at default cutoff', () => {
  assert.equal(EXACT_DUPLICATES.length, 0);
  assert.equal(probableDuplicates().length, 0);
  const top = maxOverlap();
  assert.ok(top.pct <= 80, 'highest pair stays under the probable cutoff');
  assert.ok(top.pct >= 40, 'highest pair shows a real related-cluster signal');
  const rows = auditRows();
  assert.equal(rows.length, AUDIT_PAIRS.length);
  // sorted descending by pct
  for (let i = 1; i < rows.length; i += 1) {
    assert.ok(rows[i - 1].pct >= rows[i].pct, 'rows sorted descending');
  }
  for (const r of rows) {
    assert.ok(sourceById(r.primaryId), 'primary exists');
    assert.ok(sourceById(r.dupId), 'duplicate exists');
    assert.ok(r.action.startsWith('Keep'), `${r.primaryId}↔${r.dupId} action is detect-only keep`);
    assert.equal(r.probable, false);
  }
});

test('primary rule: lower id becomes primary, higher id duplicate', () => {
  const rows = auditRows();
  for (const r of rows) {
    assert.ok(r.primaryId < r.dupId, `${r.primaryId} comes before ${r.dupId} in corpus order`);
  }
});

test('tag overlap: identical sets score 1.0, disjoint score 0', () => {
  const self = tagOverlap('S1', 'S1');
  assert.equal(self.jaccard, 1);
  assert.deepEqual(self.onlyA, []);
  assert.deepEqual(self.onlyB, []);
  const o = tagOverlap('S1', 'S6');
  assert.ok(o.shared.includes('agents') && o.shared.includes('governance'));
  assert.ok(o.jaccard > 0 && o.jaccard < 1);
  const bogus = tagOverlap('SX', 'S1');
  assert.equal(bogus.jaccard, 0);
});

test('allPairs covers every unordered pair of the corpus', () => {
  const pairs = allPairs();
  assert.equal(pairs.length, 36); // C(9,2)
  for (let i = 1; i < pairs.length; i += 1) {
    assert.ok(pairs[i - 1].jaccard >= pairs[i].jaccard, 'sorted by jaccard desc');
  }
});

test('two-phase gate: Phase 1 forbids the table, Phase 2 defines it', () => {
  assert.match(AUDIT_PHASE1, /DO NOT RUN THE AUDIT/i);
  assert.match(AUDIT_PHASE1, /approved/i);
  assert.match(AUDIT_PHASE1, /Detect and report only/i);
  assert.match(AUDIT_PHASE2, /Primary Content ID\/Excerpt/);
  assert.match(AUDIT_PHASE2, /Match Type \(Exact\/Semantic\) %/);
  assert.match(AUDIT_PHASE2, /Recommended Action/);
  assert.match(AUDIT_PHASE2, /80%/);
  assert.match(AUDIT_PHASE2, /NO rewriting, merging, or fixing/i);
});

test('compliance notes and primary rules are substantive', () => {
  assert.equal(AUDIT_COMPLIANCE.length, 3);
  for (const c of AUDIT_COMPLIANCE) assert.ok(c.note.length > 40);
  assert.equal(PRIMARY_RULES.length, 3);
  assert.ok(PRIMARY_RULES.some((r) => r.rule === 'Ambiguity → both stay'));
});
