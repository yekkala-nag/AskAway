/**
 * Prompt composer — combines a framework (structure) with zero or more
 * methodologies (techniques) plus user inputs into one editable prompt.
 *
 * Honesty rules:
 * - Reports missing required fields and unresolved placeholders; never
 *   silently invents content for them.
 * - Detects declared methodology conflicts and input-level contradictions.
 * - Deduplicates identical instruction lines instead of stacking them.
 * - Does NOT claim more techniques ⇒ better results.
 */
import { getFrameworkItem, getMethodologyItem, FRAMEWORK_CATALOG, METHODOLOGY_CATALOG, conflictsWith } from './promptTaxonomy.js';

const RESERVED_KEYS = new Set(['task', 'constraints', 'documents', 'tools', 'schema', 'examples', 'outputFormat']);

function slugOf(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''); }

/* Common template phrasings → catalog field ids (same concept, other words). */
const PLACEHOLDER_ALIASES = {
  objective: 'goal', situation: 'context', background: 'context',
  what_to_do: 'task', deliverable: 'task', ask: 'request',
  what_you_want_back: 'request', do_x_using_y: 'action', steps_criteria: 'action',
  metric_definition_of_done: 'goal', definition_of_done: 'goal',
  expert: 'role', structure_of_the_answer: 'format', structure_of_the_response: 'format',
  boundaries: 'constraints', audience: 'context', sample_format: 'example',
  format_of_the_answer: 'format', response: 'output', sections: 'format',
  must_must_not: 'constraints', must_must_not_avoid: 'constraints',
};

/** Resolve [placeholder] → user input: exact key, alias, then field word-overlap. */
function resolvePlaceholder(placeholder, framework, inputs) {
  const key = slugOf(placeholder);
  const candidates = [key, PLACEHOLDER_ALIASES[key]];
  const fields = [...(framework ? framework.requiredFields : []), ...(framework ? framework.optionalFields : [])];
  const pWords = key.split('_');
  for (const f of fields) {
    if (pWords.includes(f) || f.split('_').some((w) => w.length > 3 && pWords.includes(w))) candidates.push(f);
  }
  candidates.push('task', 'outputFormat');
  const seen = new Set();
  for (const c of candidates) {
    if (!c || seen.has(c)) continue;
    seen.add(c);
    if (inputs[c] !== undefined && String(inputs[c]).trim() !== '') return { value: String(inputs[c]).trim(), via: c };
  }
  // fuzzy containment as last resort
  for (const f of fields) {
    if ((key.includes(f) || f.includes(key)) && inputs[f] !== undefined && String(inputs[f]).trim() !== '') {
      return { value: String(inputs[f]).trim(), via: f };
    }
  }
  return { value: null, via: null };
}

function fillTemplate(template, framework, inputs, unresolved, resolvedVia) {
  return String(template || '').replace(/\[([^\]]+)\]/g, (whole, ph) => {
    const r = resolvePlaceholder(ph, framework, inputs);
    if (r.value !== null) { resolvedVia.add(r.via); return r.value; }
    unresolved.push(ph);
    return whole; // leave visible for the user to edit
  });
}

/** Input-level contradiction scan: free-text constraints vs methodology requirements. */
function detectInputContradictions(selectedIds, inputs) {
  const conflicts = [];
  const blob = `${inputs.constraints || ''} ${inputs.task || ''} ${inputs.outputFormat || ''}`.toLowerCase();
  if (selectedIds.includes('few_zero_one_shot') && /\b(no examples|without examples|do not use examples|no exemplars)\b/.test(blob)) {
    conflicts.push({ type: 'contradiction', ids: ['few_zero_one_shot'], text: 'Few-shot prompting selected but the inputs forbid examples.', detail: 'Remove the "no examples" constraint or deselect few-shot prompting.' });
  }
  if (selectedIds.includes('retrieval_grounded') && /\b(do not use (the )?(documents|context)|ignore the documents|no sources)\b/.test(blob)) {
    conflicts.push({ type: 'contradiction', ids: ['retrieval_grounded'], text: 'Retrieval-grounded prompting selected but the inputs tell the model to ignore documents.', detail: 'Grounding cannot work if supplied evidence is excluded.' });
  }
  if (selectedIds.includes('structured_output') && /\bfree[- ]?form|no (json|schema|format)\b/.test(blob)) {
    conflicts.push({ type: 'contradiction', ids: ['structured_output'], text: 'Structured-output prompting selected but the inputs ask for free-form output.', detail: 'Pick one: a declared format or free-form.' });
  }
  return conflicts;
}

/** Methodology input requirements (honest: missing ⇒ reported, not faked). */
function checkRequirements(selected, inputs) {
  const conflicts = [];
  for (const m of selected) {
    for (const req of m.requires || []) {
      const val = inputs[req];
      if (val === undefined || (typeof val === 'string' && !val.trim()) || (Array.isArray(val) && !val.length)) {
        conflicts.push({
          type: 'missing-requirement',
          ids: [m.id],
          text: `"${m.name}" needs ${req} — none provided.`,
          detail: m.id === 'retrieval_grounded' ? 'Paste the source material the answer must come from.'
            : m.id === 'tool_assisted' ? 'List the available tools and their inputs.'
            : m.id === 'structured_output' ? 'Declare the output schema (fields + types).'
            : m.id === 'constraint_based' ? 'Add must/must-not constraints.'
            : `Provide: ${req}.`,
        });
      }
    }
  }
  return conflicts;
}

function methodologyBlock(m, inputs) {
  const lines = [];
  lines.push(`## ${m.name}`);
  lines.push(m.applicationInstructions);
  if (m.id === 'few_zero_one_shot' && inputs.examples) lines.push(`Examples:\n${inputs.examples}`);
  if (m.id === 'retrieval_grounded' && inputs.documents) lines.push(`Source material:\n${inputs.documents}`);
  if (m.id === 'tool_assisted' && inputs.tools) lines.push(`Available tools: ${inputs.tools}`);
  if (m.id === 'structured_output' && inputs.schema) lines.push(`Required schema: ${inputs.schema}`);
  if (m.id === 'constraint_based' && inputs.constraints) lines.push(`Constraints:\n${inputs.constraints}`);
  return lines;
}

/**
 * composePrompt({ frameworkId, methodologyIds, inputs })
 * → { prompt, appliedFramework, appliedMethodologies, missingRequired,
 *     unresolvedFields, conflicts, assumptions, skipped }
 */
export function composePrompt({ frameworkId = null, methodologyIds = [], inputs = {} } = {}) {
  const missingRequired = [];
  const unresolvedFields = [];
  const conflicts = [];
  const assumptions = [];
  const skipped = [];

  const framework = frameworkId ? getFrameworkItem(frameworkId) : null;
  if (frameworkId && !framework) {
    conflicts.push({ type: 'invalid-framework', ids: [frameworkId], text: `Unknown framework "${frameworkId}".`, detail: 'Pick a framework from the catalog.' });
  }

  const selected = [];
  for (const id of methodologyIds || []) {
    const m = getMethodologyItem(id);
    if (!m) { skipped.push({ id, reason: 'unknown methodology id' }); continue; }
    if (framework && m.compatibleFrameworkIds && !m.compatibleFrameworkIds.includes(framework.id) && m.conflictsWith && m.conflictsWith.includes(framework.id)) {
      skipped.push({ id, reason: `declared incompatible with ${framework.name}` });
      continue;
    }
    selected.push(m);
  }

  // methodology ↔ methodology declared conflicts
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      if (conflictsWith(selected[i].id, selected[j].id)) {
        conflicts.push({
          type: 'methodology-conflict',
          ids: [selected[i].id, selected[j].id],
          text: `"${selected[i].name}" and "${selected[j].name}" use contradictory grounding strategies.`,
          detail: 'Evidence from supplied documents vs model-generated knowledge — pick one grounding approach.',
        });
      }
    }
  }

  conflicts.push(...checkRequirements(selected, inputs));
  conflicts.push(...detectInputContradictions(selected.map((m) => m.id), inputs));

  // ── Build the prompt ──
  const sections = [];
  const resolvedVia = new Set();
  if (framework) {
    sections.push(framework.template.includes('[')
      ? fillTemplate(framework.template, framework, inputs, unresolvedFields, resolvedVia)
      : framework.template);
    for (const field of framework.requiredFields) {
      const v = inputs[field];
      const empty = v === undefined || String(v).trim() === '';
      if (empty && !resolvedVia.has(field)) missingRequired.push({ frameworkId: framework.id, field });
    }
    if (inputs.task && !framework.template.includes(inputs.task)) {
      sections.unshift(`Task:\n${inputs.task}`);
    }
  } else {
    if (inputs.task) sections.push(inputs.task);
    else sections.push('[Write your task here — you can start with a blank prompt]');
    assumptions.push('No framework selected — composed from your raw task text.');
  }

  const seenLines = new Set(sections.join('\n').split('\n').map((l) => l.trim()).filter(Boolean));
  for (const m of selected) {
    const block = methodologyBlock(m, inputs);
    const fresh = block.filter((line, idx) => {
      if (idx === 0) return true; // keep headers
      const t = line.trim();
      return !t || !seenLines.has(t);
    });
    for (const line of fresh) { const t = line.trim(); if (t) seenLines.add(t); }
    if (fresh.length) sections.push(fresh.join('\n'));
  }

  // Reserved inputs not consumed by the template still belong in the prompt.
  const RESERVED_LABELS = { constraints: 'Constraints', documents: 'Source material', tools: 'Available tools', schema: 'Required schema', examples: 'Examples', outputFormat: 'Output format' };
  for (const [key, label] of Object.entries(RESERVED_LABELS)) {
    const v = inputs[key];
    if (v === undefined || !String(v).trim()) continue;
    if (resolvedVia.has(key)) continue;
    const line = `${label}: ${v}`;
    if (seenLines.has(line.toLowerCase())) continue;
    if (selected.some((m) => m.requires && m.requires.includes(key))) continue; // methodology block already appended it
    seenLines.add(line.toLowerCase());
    sections.push(line);
  }

  const prompt = sections.join('\n\n');

  if (selected.length > 3) {
    assumptions.push(`${selected.length} methodologies combined — more techniques do not guarantee better results; test with and without.`);
  }

  return {
    ok: conflicts.length === 0 && missingRequired.length === 0,
    prompt,
    appliedFramework: framework ? { id: framework.id, name: framework.name } : null,
    appliedMethodologies: selected.map((m) => ({ id: m.id, name: m.name })),
    missingRequired,
    unresolvedFields: [...new Set(unresolvedFields)],
    conflicts,
    assumptions,
    skipped,
  };
}

/** Suggest compatible methodologies for a framework (excluding already-selected). */
export function suggestMethodologies(frameworkId, selectedIds = []) {
  const f = frameworkId ? getFrameworkItem(frameworkId) : null;
  const pool = f ? f.compatibleMethodologyIds.map((id) => getMethodologyItem(id)).filter(Boolean) : METHODOLOGY_CATALOG;
  return pool.filter((m) => !selectedIds.includes(m.id)).map((m) => ({ id: m.id, name: m.name, category: m.category, requires: m.requires }));
}

export { FRAMEWORK_CATALOG, METHODOLOGY_CATALOG };
