/**
 * Workflow composer — build, validate, and run prompt pipelines.
 *
 * HONESTY RULE: only steps marked kind:'local' actually execute (they call
 * the real services). Steps marked kind:'requires-model' are returned as
 * status 'requires-model' with a note — the runner never fabricates their
 * output, and downstream steps that depend on them are skipped with reason.
 */
import { findGaps, applyAnswers } from './clarificationEngine.js';
import { createPrompt } from './promptRepresentation.js';
import { recommendFrameworks } from './frameworkRecommender.js';
import { evaluatePrompt } from './qualityEvaluator.js';
import { buildContract, validateAgainstContract } from './outputContract.js';
import { createVersion, pushVersion } from './refinementLab.js';

export const STEP_TYPES = {
  input: { type: 'input', label: 'Prompt input', kind: 'local', description: 'Seed the working text.' },
  clarify: { type: 'clarify', label: 'Clarification check', kind: 'local', description: 'List unresolved clarification questions.', runsOn: ['text'] },
  recommend: { type: 'recommend', label: 'Framework recommendation', kind: 'local', description: 'Suggest frameworks for the task text.', runsOn: ['text'] },
  evaluate: { type: 'evaluate', label: 'Quality evaluation', kind: 'local', description: '8-dimension static analysis.', runsOn: ['text'] },
  refine: { type: 'refine', label: 'Save refinement version', kind: 'local', description: 'Snapshot current text into lab history.', runsOn: ['text'] },
  contract: { type: 'contract', label: 'Build output contract', kind: 'local', description: 'Compile a contract from config.', runsOn: ['text'] },
  validate_output: { type: 'validate_output', label: 'Validate model output', kind: 'local', description: 'Check pasted output against the contract.', runsOn: ['output', 'contract'] },
  generate: { type: 'generate', label: 'Generate with model', kind: 'requires-model', description: 'Needs a real model call — never simulated here.', produces: 'output' },
};

export function createWorkflow(steps = []) {
  return { schemaVersion: 1, steps: steps.map((s) => ({ id: s.id, type: s.type, config: s.config || {}, dependsOn: s.dependsOn || [] })) };
}

export function validateWorkflow(wf) {
  const errors = [];
  const steps = (wf && Array.isArray(wf.steps)) ? wf.steps : null;
  if (!steps) return { ok: false, errors: ['workflow-missing-or-invalid'] };
  const ids = new Set();
  for (const s of steps) {
    if (!s.id) errors.push('step-missing-id');
    else if (ids.has(s.id)) errors.push(`duplicate-id:${s.id}`);
    else ids.add(s.id);
    if (!s.type || !STEP_TYPES[s.type]) errors.push(`unknown-type:${s.type || '?'}`);
  }
  for (const s of steps) {
    for (const d of s.dependsOn || []) {
      if (!ids.has(d)) errors.push(`dangling-dependency:${s.id}->${d}`);
      if (d === s.id) errors.push(`self-dependency:${s.id}`);
    }
  }
  // cycle detection (Kahn)
  const indeg = new Map([...ids].map((id) => [id, 0]));
  for (const s of steps) for (const d of s.dependsOn || []) if (ids.has(d)) indeg.set(s.id, (indeg.get(s.id) || 0) + 1);
  const queue = [...ids].filter((id) => indeg.get(id) === 0);
  let seen = 0;
  while (queue.length) {
    const id = queue.shift();
    seen++;
    for (const s of steps) {
      if ((s.dependsOn || []).includes(id)) {
        indeg.set(s.id, indeg.get(s.id) - 1);
        if (indeg.get(s.id) === 0) queue.push(s.id);
      }
    }
  }
  if (seen !== ids.size) errors.push('cycle-detected');
  return { ok: errors.length === 0, errors };
}

export function topoOrder(wf) {
  const v = validateWorkflow(wf);
  if (!v.ok) throw new Error(`invalid-workflow:${v.errors.join(',')}`);
  const byId = new Map(wf.steps.map((s) => [s.id, s]));
  const out = [];
  const placed = new Set();
  let progress = true;
  while (out.length < wf.steps.length && progress) {
    progress = false;
    for (const s of wf.steps) {
      if (placed.has(s.id)) continue;
      if ((s.dependsOn || []).every((d) => placed.has(d))) { out.push(byId.get(s.id)); placed.add(s.id); progress = true; }
    }
  }
  return out;
}

function runLocalStep(step, state, config) {
  switch (step.type) {
    case 'input':
      state.text = String(config.text ?? state.text ?? '');
      return { status: 'done', summary: `Seeded ${state.text.length} chars` };
    case 'clarify': {
      const rep = createPrompt({ task: state.text });
      const gaps = findGaps(rep);
      state.gaps = gaps;
      return { status: 'done', summary: gaps.ok ? `${gaps.unresolved} open question(s), ${gaps.progress}% complete` : 'invalid representation' };
    }
    case 'recommend': {
      const r = recommendFrameworks(state.text, { limit: 3 });
      state.recommendations = r;
      return { status: 'done', summary: r.recommendations.map((x) => x.name).join(', ') };
    }
    case 'evaluate': {
      const rep = evaluatePrompt(state.text);
      state.evaluation = rep;
      const pass = rep.dimensions.filter((d) => d.status === 'pass').length;
      return { status: 'done', summary: `${pass}/8 dimensions pass (static analysis)` };
    }
    case 'refine': {
      const v = createVersion(state.text, config.note || 'workflow snapshot', 'workflow');
      state.history = pushVersion(state.history || [], v);
      state.lastVersionId = v.id;
      return { status: 'done', summary: `Saved version ${v.id.slice(2, 15)}` };
    }
    case 'contract': {
      state.contract = buildContract(config.contract || {});
      return { status: 'done', summary: `Contract: ${state.contract.format}` };
    }
    case 'validate_output': {
      if (!state.contract) return { status: 'skipped', summary: 'No contract built yet — add a contract step first' };
      const raw = config.pastedOutput ?? state.modelOutput;
      if (!raw) return { status: 'skipped', summary: 'No model output available to validate (paste one or add a generate step with a real backend)' };
      const res = validateAgainstContract(raw, state.contract);
      state.validation = res;
      return { status: res.pass ? 'done' : 'fail', summary: res.pass ? `All ${res.checkedCount} checks pass` : `${res.failed}/${res.checkedCount} checks fail` };
    }
    default:
      return { status: 'skipped', summary: `Unhandled type ${step.type}` };
  }
}

/**
 * Execute a workflow deterministically.
 * state keys: text, modelOutput (from outside), history, plus artifacts.
 */
export function runWorkflow(wf, initialState = {}) {
  const order = topoOrder(wf);
  const state = { history: [], text: '', ...initialState };
  const results = [];
  let blockedBy = null;
  for (const step of order) {
    const meta = STEP_TYPES[step.type];
    if (blockedBy && (step.dependsOn || []).includes(blockedBy)) {
      results.push({ id: step.id, type: step.type, status: 'skipped', summary: `Upstream "${blockedBy}" requires a model — output not fabricated` });
      continue;
    }
    if (meta.kind === 'requires-model') {
      blockedBy = step.id;
      results.push({ id: step.id, type: step.type, status: 'requires-model', summary: 'Needs a real model API call — this client-only app cannot run it' });
      continue;
    }
    let r;
    try { r = runLocalStep(step, state, step.config || {}); }
    catch (e) { r = { status: 'error', summary: String(e.message || e).slice(0, 140) }; }
    results.push({ id: step.id, type: step.type, ...r });
  }
  return { results, state, ranLocally: results.filter((r) => r.status === 'done').length, requiresModel: results.filter((r) => r.status === 'requires-model').length };
}

export const DEFAULT_WORKFLOW = createWorkflow([
  { id: 'in', type: 'input', config: { text: '' }, dependsOn: [] },
  { id: 'clar', type: 'clarify', dependsOn: ['in'] },
  { id: 'rec', type: 'recommend', dependsOn: ['in'] },
  { id: 'eval', type: 'evaluate', dependsOn: ['in'] },
  { id: 'gen', type: 'generate', dependsOn: ['eval'] },
  { id: 'con', type: 'contract', config: { contract: { format: 'bullets', minItems: 1 } }, dependsOn: ['in'] },
  { id: 'val', type: 'validate_output', dependsOn: ['gen', 'con'] },
]);
