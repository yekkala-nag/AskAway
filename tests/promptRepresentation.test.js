import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createPrompt, validateRepresentation, promptToText, PROMPT_SCHEMA_VERSION } from '../src/services/promptRepresentation.js';

describe('promptRepresentation', () => {
  it('creates a normalized representation with defaults', () => {
    const p = createPrompt({ task: 'Summarize this' });
    assert.equal(p.schemaVersion, PROMPT_SCHEMA_VERSION);
    assert.equal(p.task, 'Summarize this');
    assert.deepEqual(p.constraints, []);
    assert.deepEqual(p.versions, []);
  });

  it('validates good and bad shapes', () => {
    assert.equal(validateRepresentation(createPrompt({ task: 'x' })).ok, true);
    assert.equal(validateRepresentation(null).ok, false);
    assert.equal(validateRepresentation({ schemaVersion: 999 }).ok, false);
    assert.equal(validateRepresentation({ ...createPrompt(), constraints: 'nope' }).ok, false);
  });

  it('assembles readable text in stable section order', () => {
    const text = promptToText(createPrompt({
      task: 'Write a report',
      context: 'For beginners',
      instructions: 'Be concise',
      constraints: ['No jargon'],
      outputSchema: { format: 'bullets', sections: ['Intro', 'Body'] },
      examples: ['Ex one'],
    }));
    const order = ['Write a report', 'Context:', 'Be concise', 'Constraint:', 'Output format:', 'Sections:', 'Example:'];
    let last = -1;
    for (const part of order) {
      const i = text.indexOf(part);
      assert.ok(i > last, `out of order or missing: ${part}`);
      last = i;
    }
  });

  it('throws on invalid input to promptToText', () => {
    assert.throws(() => promptToText(null), /invalid-prompt-representation/);
  });
});
