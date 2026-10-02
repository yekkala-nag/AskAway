import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { findGaps, applyAnswers, QUESTION_BANK } from '../src/services/clarificationEngine.js';
import { createPrompt } from '../src/services/promptRepresentation.js';

describe('clarificationEngine', () => {
  it('flags every gap on an empty prompt, none on a complete one', () => {
    const empty = findGaps(createPrompt({}));
    assert.equal(empty.ok, true);
    assert.equal(empty.unresolved, QUESTION_BANK.length);
    assert.equal(empty.progress, 0);
    const full = findGaps(createPrompt({
      task: 'Write a launch email',
      context: 'Audience: developers, background: they know our SDK',
      constraints: ['Under 150 words', 'No hype words'],
      outputSchema: { format: 'bullets' },
      evaluationCriteria: ['A reviewer marks it ready without edits'],
      examples: ['Input: X → Output: Y'],
      variables: { productName: 'AskAway' },
    }));
    assert.equal(full.unresolved, 0);
    assert.equal(full.progress, 100);
  });

  it('questions carry an explanation (why)', () => {
    const g = findGaps(createPrompt({}));
    assert.ok(g.questions.every((q) => q.question && q.why && q.field));
  });

  it('rejects invalid representations', () => {
    const g = findGaps(null);
    assert.equal(g.ok, false);
    assert.ok(g.errors.length > 0);
  });

  it('applyAnswers produces a new object with answers applied', () => {
    const base = createPrompt({});
    const next = applyAnswers(base, { task: 'Draft a memo', constraints: 'Keep it short; No jargon', evaluationCriteria: 'Manager approves' });
    assert.equal(next.task, 'Draft a memo');
    assert.deepEqual(next.constraints, ['Keep it short', 'No jargon']);
    assert.deepEqual(next.evaluationCriteria, ['Manager approves']);
    assert.notEqual(next, base);
    assert.equal(base.task, '');
    const after = findGaps(next);
    assert.ok(after.unresolved < QUESTION_BANK.length);
  });

  it('applyAnswers parses string outputSchema, variables, and answers all gaps', () => {
    const next = applyAnswers(createPrompt({}), {
      task: 'Draft a memo',
      context: 'Audience: PMs, background: none',
      constraints: 'Keep it short',
      evaluationCriteria: 'Manager approves',
      examples: 'Ex one',
      outputSchema: 'JSON',
      variables: 'productName=AskAway, date=Friday',
    });
    assert.deepEqual(next.outputSchema, { format: 'json' });
    assert.deepEqual(next.variables, { productName: 'AskAway', date: 'Friday' });
    const gaps = findGaps(next);
    assert.equal(gaps.unresolved, 0, `still open: ${gaps.questions.map((q) => q.id).join(', ')}`);
  });
});
