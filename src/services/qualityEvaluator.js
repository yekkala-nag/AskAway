/**
 * Universal prompt quality evaluator — deterministic static analysis.
 *
 * HARD HONESTY RULE (also surfaced to users via EVALUATOR_NOTICE):
 * scores come from regex/length heuristics over the prompt TEXT. Nothing is
 * executed, no model is called. A high score never guarantees a good response.
 */
export const EVALUATOR_NOTICE =
  'Static analysis only — computed by deterministic text checks, never by executing the prompt. A high score does not guarantee a good model response.';

const ACTION_VERBS = ['write', 'create', 'generate', 'explain', 'summar', 'analy', 'debug', 'plan', 'design', 'compare', 'list', 'draft', 'build', 'translate', 'classify', 'review', 'solve', 'describe', 'outline', 'refactor'];
const CONSTRAINT_MARKERS = ['must', 'must not', 'avoid', 'never', 'only', 'exactly', 'at most', 'no more than', "don't", 'do not', 'constraint', 'limit'];
const FORMAT_MARKERS = ['table', 'bullets', 'bullet', 'json', 'numbered', 'checklist', 'paragraph', 'code', 'report', 'steps', 'words or fewer', 'word limit', 'markdown'];
const STEP_MARKERS = [/^\s*\d+[.)]/m, /\bstep\s+\d+/i, /\bfirst\b.*\bthen\b.*\bfinally\b/is, /\bphase\s+\d+/i];
const ROBUST_MARKERS = [/\bif\b.*\b(otherwise|else)\b/is, /\bunless\b/i, /\bedge case/i, /\bfallback\b/i, /\bambiguit/i];
const VERIFY_MARKERS = [/metri/i, /\btest\b/i, /criteri/i, /\bcheck\b/i, /\bverif/i, /\bmeasur/i];
const FILLER = [/\bvery\b/gi, /\breally\b/gi, /\bjust\b/gi, /\bplease note\b/gi, /\bin order to\b/gi, /\butilize\b/gi];
const AUDIENCE_MARKERS = [/audience/i, /\breader/i, /\bbeginner/i, /\bexpert/i, /stakeholder/i, /\bfor \[.+\]/, /\bbackground\b/i, /\bcontext:/i];

function findEvidence(text, re) {
  const m = String(text || '').match(re);
  return m ? m[0].slice(0, 80) : null;
}

function wordCount(text) {
  const w = String(text || '').trim().split(/\s+/).filter(Boolean);
  return w.length === 1 && w[0] === '' ? 0 : w.length;
}

export const DIMENSIONS = [
  { id: 'intent', label: 'Intent alignment' },
  { id: 'context', label: 'Context sufficiency' },
  { id: 'constraints', label: 'Constraint clarity' },
  { id: 'decomposition', label: 'Task decomposition' },
  { id: 'output', label: 'Output specification' },
  { id: 'verifiability', label: 'Verifiability' },
  { id: 'robustness', label: 'Robustness' },
  { id: 'efficiency', label: 'Efficiency' },
];

export function evaluatePrompt(input) {
  const text = typeof input === 'string' ? input : String((input && input.task ? `${input.task}\n${input.context || ''}\n${input.instructions || ''}\n${(input.constraints || []).join('\n')}` : '') || '');
  const dims = [];
  const missing = [];
  const conflicts = [];
  const suggestedChanges = [];

  const has = (re) => re.test(text);
  const ev = (re) => findEvidence(text, re);

  // 1. intent
  const verbRe = new RegExp(`\\b(${ACTION_VERBS.join('|')})\\w*`, 'i');
  const verb = ev(verbRe);
  dims.push(verb
    ? { id: 'intent', label: 'Intent alignment', status: 'pass', findings: [{ text: 'Clear action verb present.', evidence: verb }] }
    : { id: 'intent', label: 'Intent alignment', status: 'fail', findings: [{ text: 'No action verb found — the goal is unclear.', evidence: null }] });
  if (!verb) { missing.push('action verb stating the goal'); suggestedChanges.push({ change: 'Start with an action verb (write, explain, compare…).', why: 'Models execute verbs; nouns alone leave the goal ambiguous.' }); }

  // 2. context
  const ctxRe = /audience|reader|beginner|expert|stakeholder|for \[.+?\]|background|context:/i;
  const ctx = ev(ctxRe);
  dims.push(ctx
    ? { id: 'context', label: 'Context sufficiency', status: 'pass', findings: [{ text: 'Audience or background context present.', evidence: ctx }] }
    : { id: 'context', label: 'Context sufficiency', status: 'warn', findings: [{ text: 'No audience or background markers.', evidence: null }] });
  if (!ctx) { missing.push('audience/background context'); suggestedChanges.push({ change: 'Add who this is for and any background the model needs.', why: 'Same prompt needs different depth for beginners vs experts.' }); }

  // 3. constraints
  const conRe = new RegExp(`\\b(${['must', 'must not', 'avoid', 'never', 'only', 'exactly', 'constraint', 'limit'].join('|')})\\b[^.]{0,60}`, 'i');
  const con = ev(conRe);
  dims.push(con
    ? { id: 'constraints', label: 'Constraint clarity', status: 'pass', findings: [{ text: 'Explicit constraint found.', evidence: con }] }
    : { id: 'constraints', label: 'Constraint clarity', status: 'warn', findings: [{ text: 'No explicit limits or exclusions.', evidence: null }] });
  if (!con) { missing.push('explicit constraints/exclusions'); suggestedChanges.push({ change: 'Add a must/avoid line.', why: 'Unbounded prompts drift; constraints bound the output space.' }); }

  // 4. decomposition
  const stepHit = STEP_MARKERS.map((re) => ev(re)).find(Boolean);
  dims.push(stepHit
    ? { id: 'decomposition', label: 'Task decomposition', status: 'pass', findings: [{ text: 'Ordered steps detected.', evidence: stepHit }] }
    : { id: 'decomposition', label: 'Task decomposition', status: 'info', findings: [{ text: 'Single-shot prompt; fine unless the task has dependent parts.', evidence: null }] });

  // 5. output spec
  const fmtRe = new RegExp(`\\b(${['table', 'bullets', 'bullet', 'json', 'numbered', 'checklist', 'paragraph', 'code', 'report', 'checklist', 'steps', 'markdown'].join('|')})\\b[^.]{0,60}`, 'i');
  const fmt = ev(fmtRe);
  dims.push(fmt
    ? { id: 'output', label: 'Output specification', status: 'pass', findings: [{ text: 'Deliverable format specified.', evidence: fmt }] }
    : { id: 'output', label: 'Output specification', status: 'fail', findings: [{ text: 'No output format specified.', evidence: null }] });
  if (!fmt) { missing.push('output format/contract'); suggestedChanges.push({ change: 'Append: "Output: [bullets/table/JSON with sections]."', why: 'Unspecified format is the top cause of unusable responses.' }); }

  // 6. verifiability
  const verRe = /metri|test|criteri|\bcheck\b|verif|measur/i;
  const ver = ev(verRe);
  dims.push(ver
    ? { id: 'verifiability', label: 'Verifiability', status: 'pass', findings: [{ text: 'Checkable criterion present.', evidence: ver }] }
    : { id: 'verifiability', label: 'Verifiability', status: 'info', findings: [{ text: 'No observable acceptance criterion — needs human judgment.', evidence: null }] });

  // 7. robustness
  const robHit = ROBUST_MARKERS.map((re) => ev(re)).find(Boolean);
  dims.push(robHit
    ? { id: 'robustness', label: 'Robustness', status: 'pass', findings: [{ text: 'Edge-case handling present.', evidence: robHit }] }
    : { id: 'robustness', label: 'Robustness', status: 'info', findings: [{ text: 'No fallback/edge-case handling stated.', evidence: null }] });

  // 8. efficiency
  let fillerHits = 0;
  for (const re of FILLER) { const m = text.match(re); if (m) fillerHits += m.length; }
  const wc = wordCount(text);
  const redundant = fillerHits > 0 || wc > 400;
  dims.push(!redundant
    ? { id: 'efficiency', label: 'Efficiency', status: 'pass', findings: [{ text: `Lean prompt (${wc} words, no filler detected).`, evidence: null }] }
    : { id: 'efficiency', label: 'Efficiency', status: 'warn', findings: [{ text: `Possible bloat: ${fillerHits} filler phrase(s), ${wc} words.`, evidence: fillerHits ? `filler ×${fillerHits}` : `${wc} words` }] });
  if (redundant) suggestedChanges.push({ change: 'Trim filler phrases (very/really/just/in order to).', why: 'Each wasted token costs money and attention.' });

  // conflicts (deterministic, narrow)
  if (/ignore (all )?previous|disregard (all )?prior/i.test(text)) {
    conflicts.push({ text: 'Contains instruction-override phrasing ("ignore previous").', evidence: ev(/ignore (all )?previous[^.]{0,50}|disregard (all )?prior[^.]{0,50}/i) });
  }
  const exactWords = text.match(/exactly\s+(\d+)\s+words/i);
  if (exactWords && /be (verbose|detailed|thorough|comprehensive)/i.test(text)) {
    conflicts.push({ text: 'Exact word count conflicts with a verbosity request.', evidence: exactWords[0] });
  }

  // conservative revised draft: only appends clearly-labeled scaffolds
  let revisedDraft = text;
  if (!fmt) revisedDraft += '\n\nOutput: [specify format — e.g. bullets, table, or JSON with sections]';
  if (!con) revisedDraft += '\nConstraints: [must include … / must avoid …]';

  return {
    dimensions: dims,
    missing,
    conflicts,
    suggestedChanges,
    revisedDraft,
    autoChecks: ['action verb present', 'format markers present', 'override-phrasing scan', 'filler scan'],
    humanChecks: ['factual accuracy needs references', 'tone fit needs audience review', 'constraint completeness needs domain judgment'],
    notice: EVALUATOR_NOTICE,
    wordCount: wc,
  };
}
