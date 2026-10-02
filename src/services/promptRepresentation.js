/**
 * Shared prompt representation — one shape used by the recommender,
 * evaluator, clarification engine, refinement lab, and library.
 * Plain data only: no model calls, no side effects.
 */
export const PROMPT_SCHEMA_VERSION = 1;

export function createPrompt(input = {}) {
  const {
    task = '',
    context = '',
    instructions = '',
    constraints = [],
    outputSchema = null,
    examples = [],
    variables = {},
    evaluationCriteria = [],
    framework = null,
  } = input || {};
  return {
    schemaVersion: PROMPT_SCHEMA_VERSION,
    task: String(task || ''),
    context: String(context || ''),
    instructions: String(instructions || ''),
    constraints: Array.isArray(constraints) ? constraints.map(String) : [],
    outputSchema: outputSchema || null,
    examples: Array.isArray(examples) ? examples : [],
    variables: variables && typeof variables === 'object' ? { ...variables } : {},
    evaluationCriteria: Array.isArray(evaluationCriteria) ? evaluationCriteria : [],
    framework: framework || null,
    versions: [],
    testResults: [],
  };
}

export function validateRepresentation(rep) {
  const errors = [];
  if (!rep || typeof rep !== 'object') return { ok: false, errors: ['not-an-object'] };
  if (rep.schemaVersion !== PROMPT_SCHEMA_VERSION) errors.push('schema-version-mismatch');
  for (const k of ['task', 'context', 'instructions']) {
    if (typeof rep[k] !== 'string') errors.push(`field-not-string:${k}`);
  }
  for (const k of ['constraints', 'examples', 'evaluationCriteria']) {
    if (!Array.isArray(rep[k])) errors.push(`field-not-array:${k}`);
  }
  if (rep.outputSchema !== null && typeof rep.outputSchema !== 'object') errors.push('output-schema-not-object');
  return { ok: errors.length === 0, errors };
}

/** Assemble a human-readable prompt string from the representation. */
export function promptToText(rep) {
  const v = validateRepresentation(rep);
  if (!v.ok) throw new Error(`invalid-prompt-representation: ${v.errors.join(',')}`);
  const parts = [];
  if (rep.task) parts.push(rep.task);
  if (rep.context) parts.push(`Context: ${rep.context}`);
  if (rep.instructions) parts.push(rep.instructions);
  for (const c of rep.constraints) parts.push(`Constraint: ${c}`);
  if (rep.outputSchema && rep.outputSchema.format) parts.push(`Output format: ${rep.outputSchema.format}`);
  if (rep.outputSchema && Array.isArray(rep.outputSchema.sections) && rep.outputSchema.sections.length) {
    parts.push(`Sections: ${rep.outputSchema.sections.join(' | ')}`);
  }
  for (const ex of rep.examples.slice(0, 5)) {
    if (typeof ex === 'string') parts.push(`Example: ${ex}`);
  }
  return parts.join('\n\n');
}
