import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { STEP_TYPES, createWorkflow, validateWorkflow, topoOrder, runWorkflow, DEFAULT_WORKFLOW } from '../src/services/workflowComposer.js';

describe('workflowComposer', () => {
  it('validates structure: duplicate ids, unknown types, dangling deps, self-deps', () => {
    assert.equal(validateWorkflow(createWorkflow([{ id: 'a', type: 'evaluate' }])).ok, true);
    assert.ok(validateWorkflow(null).ok === false);
    assert.ok(validateWorkflow(createWorkflow([{ id: 'a', type: 'nope' }])).errors.some((e) => e.startsWith('unknown-type')));
    const dup = validateWorkflow({ steps: [{ id: 'a', type: 'evaluate' }, { id: 'a', type: 'clarify' }] });
    assert.ok(dup.errors.some((e) => e.startsWith('duplicate-id')));
    const dangling = validateWorkflow(createWorkflow([{ id: 'a', type: 'evaluate', dependsOn: ['ghost'] }]));
    assert.ok(dangling.errors.some((e) => e.startsWith('dangling-dependency')));
    const self = validateWorkflow(createWorkflow([{ id: 'a', type: 'evaluate', dependsOn: ['a'] }]));
    assert.ok(self.errors.some((e) => e.startsWith('self-dependency')));
  });

  it('detects cycles and orders acyclic graphs by dependency', () => {
    const cyclic = createWorkflow([
      { id: 'a', type: 'evaluate', dependsOn: ['c'] },
      { id: 'b', type: 'clarify', dependsOn: ['a'] },
      { id: 'c', type: 'recommend', dependsOn: ['b'] },
    ]);
    assert.ok(validateWorkflow(cyclic).errors.includes('cycle-detected'));
    assert.throws(() => topoOrder(cyclic), /invalid-workflow/);
    const wf = createWorkflow([
      { id: 'second', type: 'evaluate', dependsOn: ['first'] },
      { id: 'first', type: 'input', config: { text: 'Write a report for experts' } },
    ]);
    assert.deepEqual(topoOrder(wf).map((s) => s.id), ['first', 'second']);
  });

  it('runs honest local steps and produces real artifacts', () => {
    const wf = createWorkflow([
      { id: 'in', type: 'input', config: { text: 'Write a launch email. Output: bullets. Must avoid jargon.' } },
      { id: 'ev', type: 'evaluate', dependsOn: ['in'] },
      { id: 'rec', type: 'recommend', dependsOn: ['in'] },
      { id: 'snap', type: 'refine', dependsOn: ['in'] },
    ]);
    const out = runWorkflow(wf);
    assert.equal(out.requiresModel, 0);
    assert.equal(out.ranLocally, 4);
    assert.ok(out.state.evaluation && out.state.evaluation.dimensions.length === 8);
    assert.ok(out.state.recommendations.recommendations.length > 0);
    assert.equal(out.state.history.length, 1);
    assert.ok(out.results.every((r) => r.status === 'done'));
  });

  it('never fabricates model steps: marks requires-model and skips downstream', () => {
    const out = runWorkflow(DEFAULT_WORKFLOW, { text: 'Anything' });
    const gen = out.results.find((r) => r.id === 'gen');
    assert.equal(gen.status, 'requires-model');
    const val = out.results.find((r) => r.id === 'val');
    assert.equal(val.status, 'skipped');
    assert.match(val.summary, /not fabricated/);
    assert.equal(out.state.validation, undefined);
    const con = out.results.find((r) => r.id === 'con');
    assert.equal(con.status, 'done', 'independent contract step still runs');
  });

  it('validate_output runs when output is supplied externally (pasted)', () => {
    const wf = createWorkflow([
      { id: 'con', type: 'contract', config: { contract: { format: 'json', requiredKeys: ['title'] } } },
      { id: 'val', type: 'validate_output', dependsOn: ['con'], config: { pastedOutput: '{"title":"ok"}' } },
    ]);
    const out = runWorkflow(wf);
    assert.equal(out.state.validation.pass, true);
    const bad = createWorkflow([
      { id: 'con', type: 'contract', config: { contract: { format: 'json', requiredKeys: ['title'] } } },
      { id: 'val', type: 'validate_output', dependsOn: ['con'], config: { pastedOutput: 'nope' } },
    ]);
    assert.equal(runWorkflow(bad).results.find((r) => r.id === 'val').status, 'fail');
  });

  it('clarify step reports open gaps against the working text', () => {
    const wf = createWorkflow([{ id: 'in', type: 'input', config: { text: '' } }, { id: 'c', type: 'clarify', dependsOn: ['in'] }]);
    const out = runWorkflow(wf);
    assert.equal(out.results.find((r) => r.id === 'c').status, 'done');
    assert.ok(out.state.gaps.unresolved > 0);
  });

  it('every step type is documented and honest about its kind', () => {
    for (const [type, meta] of Object.entries(STEP_TYPES)) {
      assert.equal(meta.type, type);
      assert.ok(['local', 'requires-model'].includes(meta.kind));
      assert.ok(meta.label && meta.description);
    }
    assert.equal(STEP_TYPES.generate.kind, 'requires-model');
  });
});
