import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FRAMING_TEMPLATE,
  FRAMING_BLOCKS,
  PROBLEM_TYPES,
  TYPE_BY_ID,
  EXAMPLES,
  DECISION_QUESTIONS,
  LEAF_NOTES,
  resolveType,
  ML_CHECKLIST,
  ML_FRAMING_PROMPT,
  DIFFICULTY_SPECTRUM,
  SIDE_CONCEPTS,
  buildFramingPrompt,
} from '../src/mlProblems/mlProblemsEngine.js';

test('framing template: three blocks in Given → Identify → Benefit order', () => {
  assert.match(FRAMING_TEMPLATE, /Given/);
  assert.match(FRAMING_TEMPLATE, /identify or predict/);
  assert.match(FRAMING_TEMPLATE, /so that/);
  assert.deepEqual(FRAMING_BLOCKS.map((b) => b.id), ['given', 'identify', 'benefit']);
  for (const b of FRAMING_BLOCKS) {
    assert.ok(b.line.includes('['), `${b.id} has a fill-in slot`);
    assert.ok(b.why.length > 20, `${b.id} explains itself`);
  }
});

test('taxonomy: four types, correct label flags, unique ids', () => {
  assert.deepEqual(PROBLEM_TYPES.map((t) => t.id), ['classification', 'regression', 'clustering', 'rule_extraction']);
  assert.equal(PROBLEM_TYPES.filter((t) => t.labeled).length, 2);
  assert.equal(PROBLEM_TYPES.filter((t) => !t.labeled).length, 2);
  PROBLEM_TYPES.forEach((t) => {
    assert.ok(t.framed.startsWith('Given '), `${t.id} has a framed sentence`);
    assert.ok(t.algorithmHints.length >= 2, `${t.id} lists algorithms`);
    assert.ok(t.dataNeeds.length > 10);
  });
  assert.ok(TYPE_BY_ID.classification.outcome.includes('class'));
  assert.ok(TYPE_BY_ID.regression.outcome.includes('real number'));
});

test('ten grounding examples: every type used, valid type ids', () => {
  assert.equal(EXAMPLES.length, 10);
  const used = new Set(EXAMPLES.map((e) => e.type));
  for (const t of PROBLEM_TYPES) assert.ok(used.has(t.id), `${t.id} appears in examples`);
  EXAMPLES.forEach((e) => {
    assert.ok(e.given && e.decision && e.benefit, `${e.id} has all three slots`);
    assert.ok(TYPE_BY_ID[e.type], `${e.id} has a valid type`);
  });
});

test('decision tree: full answer matrix resolves correctly', () => {
  assert.equal(resolveType({ decision: 'no' }), 'notml');
  assert.equal(resolveType({ decision: 'yes', labels: 'yes', real: 'no' }), 'classification');
  assert.equal(resolveType({ decision: 'yes', labels: 'yes', real: 'yes' }), 'regression');
  assert.equal(resolveType({ decision: 'yes', labels: 'no', structure: 'groups' }), 'clustering');
  assert.equal(resolveType({ decision: 'yes', labels: 'no', structure: 'relationships' }), 'rule_extraction');
  assert.equal(resolveType({ decision: 'yes', labels: 'no', structure: 'no' }), 'notml');
  assert.equal(resolveType({}), 'notml');
  assert.equal(DECISION_QUESTIONS.length, 4);
  assert.ok(LEAF_NOTES.notml.length > 40);
  for (const id of Object.keys(TYPE_BY_ID)) assert.ok(LEAF_NOTES[id]);
});

test('checklist, difficulty, side concepts', () => {
  assert.equal(ML_CHECKLIST.length, 5);
  ML_CHECKLIST.forEach((c) => {
    assert.ok(c.weak.length > 5 && c.strong.length > 5, `${c.id} contrast`);
    assert.notEqual(c.weak, c.strong);
  });
  assert.equal(DIFFICULTY_SPECTRUM.length, 3);
  assert.ok(DIFFICULTY_SPECTRUM.some((d) => /Frontier/.test(d.band)));
  assert.deepEqual(SIDE_CONCEPTS.map((c) => c.id), ['effect', 'complete']);
});

test('prompt framework: steps, constraints, single-decision rule', () => {
  assert.match(ML_FRAMING_PROMPT, /ONE decision/);
  assert.match(ML_FRAMING_PROMPT, /Given \[data\]/);
  assert.match(ML_FRAMING_PROMPT, /classification, regression/);
  assert.match(ML_FRAMING_PROMPT, /NOT\s+worth/);
  assert.match(ML_FRAMING_PROMPT, /dangerous assumption/);
  assert.match(ML_FRAMING_PROMPT, /If you see two, split them/);
});

test('buildFramingPrompt: fills slots, includes type blocks, handles empty', () => {
  const full = buildFramingPrompt({ data: 'invoices', decision: 'duplicate payment', benefit: 'stop double-pay', type: 'classification' });
  assert.match(full, /Given invoices/);
  assert.match(full, /duplicate payment/);
  assert.match(full, /stop double-pay/);
  assert.match(full, /TYPE\nClassification/);
  assert.match(full, /ALGORITHM FAMILIES/);
  const untyped = buildFramingPrompt({ data: 'x', decision: 'y', benefit: 'z' });
  assert.match(untyped, /Unassigned/);
  const empty = buildFramingPrompt({});
  assert.match(empty, /\[the data you have\]/);
  const noType = buildFramingPrompt({ data: 'a', decision: 'b', benefit: 'c', type: 'bogus' });
  assert.match(noType, /Unassigned/);
});

test('content carries no URLs, authors, or copyright', () => {
  const blobs = [FRAMING_TEMPLATE, ML_FRAMING_PROMPT,
    ...FRAMING_BLOCKS.flatMap((b) => Object.values(b)),
    ...PROBLEM_TYPES.flatMap((t) => [t.name, t.essence, t.dataNeeds, t.framed, ...t.algorithmHints]),
    ...EXAMPLES.flatMap((e) => Object.values(e)),
    ...ML_CHECKLIST.flatMap((c) => Object.values(c)),
    ...SIDE_CONCEPTS.map((c) => c.text),
    ...DIFFICULTY_SPECTRUM.flatMap((d) => Object.values(d)),
    ...Object.values(LEAF_NOTES),
    ...DECISION_QUESTIONS.map((q) => q.q)];
  for (const b of blobs) {
    if (typeof b !== 'string') continue;
    assert.ok(!/https?:\/\//.test(b), `no URLs: ${b.slice(0, 60)}`);
    assert.ok(!/\b(brownlee|machinelearningmastery|copyright|©|all rights reserved)\b/i.test(b), `no author/copyright: ${b.slice(0, 60)}`);
  }
});
