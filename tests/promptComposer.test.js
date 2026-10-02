import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { composePrompt, suggestMethodologies } from '../src/services/promptComposer.js';
import { FRAMEWORK_CATALOG, METHODOLOGY_CATALOG } from '../src/services/promptTaxonomy.js';

describe('promptComposer', () => {
  it('composes a framework with inputs and resolves placeholders', () => {
    const r = composePrompt({
      frameworkId: 'goal_context_constraints_format',
      methodologyIds: [],
      inputs: { goal: 'Compare pgvector vs Pinecone', context: 'Team of 3, budget constrained', constraints: 'No vendor pricing guesses', format: 'table + 1 recommendation' },
    });
    assert.equal(r.ok, true, JSON.stringify(r.conflicts));
    assert.equal(r.appliedFramework.name, 'Goal–Context–Constraints–Format');
    assert.ok(r.prompt.includes('Compare pgvector vs Pinecone'));
    assert.ok(r.prompt.includes('No vendor pricing guesses'));
    assert.equal(r.unresolvedFields.length, 0);
    assert.equal(r.missingRequired.length, 0);
  });

  it('reports missing required fields instead of inventing them', () => {
    const r = composePrompt({ frameworkId: 'role_task_context_output', inputs: { role: 'security reviewer' } });
    assert.equal(r.ok, false);
    const fields = r.missingRequired.map((m) => m.field).sort();
    assert.deepEqual(fields, ['context', 'output', 'task']);
    assert.ok(r.prompt.includes('[what to do]'), 'placeholder stays visible');
  });

  it('starts from a blank prompt without either catalog (spec §Studio step 1)', () => {
    const r = composePrompt({ inputs: { task: 'Draft a status update' } });
    assert.equal(r.appliedFramework, null);
    assert.equal(r.ok, true);
    assert.ok(r.prompt.startsWith('Draft a status update'));
    assert.ok(r.assumptions.some((a) => a.includes('No framework selected')));
  });

  it('combines multiple methodologies and deduplicates repeated lines', () => {
    const r = composePrompt({
      frameworkId: 'trace',
      methodologyIds: ['constraint_based', 'structured_output'],
      inputs: { task: 'Extract facts', constraints: 'Must be JSON only', schema: '{"facts": [string]}' },
    });
    assert.equal(r.appliedMethodologies.length, 2);
    const lines = r.prompt.split('\n').map((l) => l.trim()).filter(Boolean);
    assert.equal(new Set(lines).size, lines.length, 'no duplicated lines');
    assert.ok(r.prompt.includes('## Constraint-based prompting'));
    assert.ok(r.prompt.includes('## Structured-output prompting'));
  });

  it('flags methodology↔methodology conflicts (grounding strategies)', () => {
    const r = composePrompt({ methodologyIds: ['retrieval_grounded', 'generated_knowledge'], inputs: { documents: 'doc text' } });
    assert.ok(r.conflicts.some((c) => c.type === 'methodology-conflict'));
    assert.equal(r.ok, false);
  });

  it('flags missing methodology requirements (retrieval needs documents, etc.)', () => {
    const r = composePrompt({ methodologyIds: ['retrieval_grounded'], inputs: { task: 'summarize' } });
    const c = r.conflicts.find((x) => x.type === 'missing-requirement');
    assert.ok(c && c.ids.includes('retrieval_grounded'));
    assert.match(c.text, /documents/);
  });

  it('flags input-level contradictions (few-shot vs "no examples")', () => {
    const r = composePrompt({ methodologyIds: ['few_zero_one_shot'], inputs: { task: 'classify', constraints: 'Do not use examples' } });
    assert.ok(r.conflicts.some((c) => c.type === 'contradiction'));
  });

  it('never claims more techniques ⇒ better results', () => {
    const r = composePrompt({ methodologyIds: ['few_zero_one_shot', 'constraint_based', 'iterative', 'self_consistency'], inputs: { task: 'x' } });
    const blob = JSON.stringify(r.assumptions) + JSON.stringify(r.conflicts);
    assert.ok(!/guarantees (better|improved)|always improves|more techniques always/i.test(blob));
    assert.ok(r.assumptions.some((a) => /do not guarantee better/i.test(a)));
  });

  it('skips unknown methodology ids gracefully and rejects unknown frameworks', () => {
    const r = composePrompt({ frameworkId: 'nope', methodologyIds: ['ghost'], inputs: {} });
    assert.ok(r.conflicts.some((c) => c.type === 'invalid-framework'));
    assert.equal(r.skipped.length, 1);
    assert.equal(r.skipped[0].reason, 'unknown methodology id');
  });

  it('suggestMethodologies returns compatible, unselected, resolvable ids', () => {
    const s = suggestMethodologies('goal_context_constraints_format', ['constraint_based']);
    assert.ok(s.length >= 2);
    assert.ok(s.every((m) => !['constraint_based'].includes(m.id)));
    assert.ok(s.every((m) => m.name && m.category));
    const all = suggestMethodologies(null);
    assert.equal(all.length, METHODOLOGY_CATALOG.length);
  });
});
