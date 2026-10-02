/**
 * Clarification engine — deterministic gap detection over a prompt
 * representation. Produces targeted questions + machine-checkable specs.
 * No model calls; the app never pretends to answer them.
 */
import { validateRepresentation } from './promptRepresentation.js';

const QUESTION_BANK = [
  {
    id: 'goal',
    field: 'task',
    question: 'What exactly should the model do — the single action and success look like?',
    probe: (r) => r.task.trim().length === 0,
    why: 'Without an explicit goal, any answer can look "right".',
  },
  {
    id: 'audience',
    field: 'context',
    question: 'Who is the audience and what do they already know?',
    probe: (r) => !/audience|reader|beginner|expert|stakeholder|background|context:/i.test(r.context),
    why: 'Depth, tone, and vocabulary depend on the reader.',
  },
  {
    id: 'format',
    field: 'outputSchema',
    question: 'What should the deliverable look like (table, bullets, JSON with which fields)?',
    probe: (r) => !(r.outputSchema && r.outputSchema.format),
    why: 'Unspecified format is the top cause of unusable responses.',
  },
  {
    id: 'constraints',
    field: 'constraints',
    question: 'What must it never do, and what are the hard limits (length, tone, rules)?',
    probe: (r) => r.constraints.length === 0,
    why: 'Constraints bound the output space; their absence invites drift.',
  },
  {
    id: 'variables',
    field: 'variables',
    question: 'Which parts are placeholders (names, dates, product) that must be filled per use?',
    probe: (r) => Object.keys(r.variables || {}).length === 0 && (/\[[^\]]+\]|\{\{[^}]+\}\}/.test(r.task + r.instructions) || r.task.trim() === ''),
    why: 'Bracketed placeholders left unresolved leak template text into output.',
  },
  {
    id: 'success',
    field: 'evaluationCriteria',
    question: 'How will a human judge the answer correct — an observable criterion?',
    probe: (r) => r.evaluationCriteria.length === 0,
    why: 'No observable criterion means quality stays a matter of taste.',
  },
  {
    id: 'examples',
    field: 'examples',
    question: 'Can you provide one input/output example of the expected result?',
    probe: (r) => r.examples.length === 0,
    why: 'One example resolves more ambiguity than three paragraphs of description.',
  },
];

export function findGaps(rep) {
  const v = validateRepresentation(rep);
  if (!v.ok) return { ok: false, errors: v.errors, questions: [], answered: 0, unresolved: QUESTION_BANK.length };
  const questions = QUESTION_BANK.filter((q) => {
    try { return q.probe(rep); } catch (e) { return false; }
  }).map((q) => ({ id: q.id, field: q.field, question: q.question, why: q.why, answered: false }));
  return {
    ok: true,
    errors: [],
    questions,
    answered: QUESTION_BANK.length - questions.length,
    unresolved: questions.length,
    progress: Math.round(((QUESTION_BANK.length - questions.length) / QUESTION_BANK.length) * 100),
  };
}

/** Apply answers back onto a representation, returning a new object. */
export function applyAnswers(rep, answers) {
  const next = { ...rep, constraints: [...(rep.constraints || [])], examples: [...(rep.examples || [])], evaluationCriteria: [...(rep.evaluationCriteria || [])], variables: { ...(rep.variables || {}) } };
  const a = answers || {};
  if (typeof a.task === 'string' && a.task.trim()) next.task = a.task.trim();
  if (typeof a.context === 'string' && a.context.trim()) next.context = a.context.trim();
  if (typeof a.constraints === 'string' && a.constraints.trim()) next.constraints = a.constraints.split(/[\n;]+/).map((s) => s.trim()).filter(Boolean);
  if (typeof a.examples === 'string' && a.examples.trim()) next.examples = a.examples.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  if (typeof a.evaluationCriteria === 'string' && a.evaluationCriteria.trim()) next.evaluationCriteria = a.evaluationCriteria.split(/\n+/).map((s) => s.trim()).filter(Boolean);
  if (typeof a.outputSchema === 'string' && a.outputSchema.trim()) next.outputSchema = { format: a.outputSchema.trim().toLowerCase() };
  else if (a.outputSchema && typeof a.outputSchema === 'object') next.outputSchema = a.outputSchema;
  if (typeof a.variables === 'string' && a.variables.trim()) {
    const vars = {};
    for (const pair of a.variables.split(/[,;\n]+/)) {
      const [k, v] = pair.split('=').map((s) => s.trim());
      if (k) vars[k] = v || '';
    }
    next.variables = vars;
  }
  return next;
}

export { QUESTION_BANK };
