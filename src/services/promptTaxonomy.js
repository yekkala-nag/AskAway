/**
 * Prompt taxonomy — the shared data model separating PROMPT FRAMEWORKS
 * (how to structure a prompt) from PROMPT METHODOLOGIES (how to approach
 * a task). Reclassifies the existing 30-item library without modifying it,
 * and adds catalog entries for capabilities that live elsewhere in the app
 * (Three-Sentence Prompt) or are genuinely new.
 *
 * Framework:  { id, kind, name, expansion, description, category, tier, template,
 *              requiredFields, optionalFields, example, compatibleMethodologyIds,
 *              version, relatedTab? }
 * Methodology:{ id, kind, name, description, category, whenToUse, limitations,
 *              applicationInstructions, requires, compatibleFrameworkIds,
 *              modelCaveats, version, related? }
 */
import { FRAMEWORKS, getFramework } from './frameworkLibrary.js';

export const KIND = { FRAMEWORK: 'framework', METHODOLOGY: 'methodology' };

/* Classification of the existing 30 — structure vs technique.
 * Rule: a fixed blueprint with named sections = framework;
 * a technique that shapes reasoning/approach = methodology. */
const KIND_BY_NAME = {
  TRACE: 'framework', TAG: 'framework', RTF: 'framework', CLEAR: 'framework',
  PACT: 'framework', STAR: 'framework', RISE: 'framework', RASCEF: 'framework',
  'CO-STAR': 'framework', CREATE: 'framework', 'Skeleton-of-Thought': 'framework',
  'CoT / ToT': 'methodology', 'Few/Zero/One-Shot': 'methodology',
  'Self-Consistency': 'methodology', 'Prompt Chaining': 'methodology',
  'Negative Prompting': 'methodology', 'Emotion Prompting': 'methodology',
  ReAct: 'methodology', 'Generated Knowledge': 'methodology',
  'Active-Prompt': 'methodology', Constitutional: 'methodology',
  'Least-to-Most': 'methodology', 'Graph-of-Thoughts': 'methodology',
  'Directional Stimulus': 'methodology', 'Step-Back': 'methodology',
  Reflexion: 'methodology', 'Meta-Prompting': 'methodology',
  'Self-Ask': 'methodology', Contrastive: 'methodology', Multimodal: 'methodology',
};

function slug(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

const CATEGORY_BY_NAME = {
  TRACE: 'Task Structure', TAG: 'Task Structure', RTF: 'Task Structure',
  CLEAR: 'Refinement', PACT: 'Decision Support', STAR: 'Narrative',
  RISE: 'Refinement', RASCEF: 'Task Structure', 'CO-STAR': 'Writing',
  CREATE: 'Creative', 'Skeleton-of-Thought': 'Writing',
  'CoT / ToT': 'Reasoning', 'Few/Zero/One-Shot': 'Examples',
  'Self-Consistency': 'Refinement', 'Prompt Chaining': 'Iteration',
  'Negative Prompting': 'Constraints', 'Emotion Prompting': 'Framing',
  ReAct: 'Tool Use', 'Generated Knowledge': 'Grounding',
  'Active-Prompt': 'Clarification', Constitutional: 'Constraints',
  'Least-to-Most': 'Decomposition', 'Graph-of-Thoughts': 'Alternatives',
  'Directional Stimulus': 'Constraints', 'Step-Back': 'Reasoning',
  Reflexion: 'Refinement', 'Meta-Prompting': 'Framing',
  'Self-Ask': 'Decomposition', Contrastive: 'Examples', Multimodal: 'Modality',
};

/* Frameworks added per taxonomy spec — new blueprints not covered by the 30.
 * (Role–Task–Context–Output stays distinct from RTF: Context ≠ Format.) */
const EXTRA_FRAMEWORKS = [
  {
    id: 'three_sentence', name: 'Three-Sentence Prompt', kind: 'framework',
    expansion: 'Understand → Plan → Wait',
    description: 'Compress any messy request into three purposeful sentences: the AI first reflects what you are trying to achieve and proposes a plan, then waits for your approval before executing.',
    category: 'Task Structure', tier: 'Foundation',
    template: 'First, review my full message and any attached files, even if my thoughts are rough, fragmented, or unfiltered. Tell me what you think I\'m actually trying to achieve, then propose a plan for me to review. Stop and wait for my approval before starting the task.',
    requiredFields: [], optionalFields: [],
    example: { input: 'Brain dump about a RAG system with unclear priorities', output: 'Restated goal + proposed plan, halted for approval' },
    compatibleMethodologyIds: ['few_zero_one_shot', 'constraint_based', 'iterative', 'structured_output'],
    version: 1, relatedTab: 'threesentenceprompt',
  },
  {
    id: 'role_task_context_output', name: 'Role–Task–Context–Output', kind: 'framework',
    expansion: 'Role, Task, Context, Output',
    description: 'Assign an expert role, state the task, supply the context the role needs, and lock the deliverable shape.',
    category: 'Task Structure', tier: 'Foundation', icon: 'smile',
    template: 'Role: Act as a [role]. Task: [what to do]. Context: [background, audience, constraints]. Output: [format with sections].',
    requiredFields: ['role', 'task', 'context', 'output'],
    optionalFields: [],
    example: { input: 'role=security reviewer; task=audit this diff; context=internet-facing API; output=bullet findings by severity', output: 'Findings grouped Critical/High/Medium with file:line' },
    compatibleMethodologyIds: ['few_zero_one_shot', 'constraint_based', 'structured_output', 'retrieval_grounded', 'iterative'],
    version: 1,
  },
  {
    id: 'goal_context_constraints_format', name: 'Goal–Context–Constraints–Format', kind: 'framework',
    expansion: 'Goal, Context, Constraints, Format',
    description: 'Specify the objective, the surrounding situation, the hard boundaries, and the exact response format.',
    category: 'Task Structure', tier: 'Foundation', icon: 'target',
    template: 'Goal: [objective]. Context: [situation]. Constraints: [must / must not]. Format: [structure of the answer].',
    requiredFields: ['goal', 'context', 'constraints', 'format'],
    optionalFields: [],
    example: { input: 'goal=compare 2 vendors; context=procurement for 50 seats; constraints=no pricing speculation; format=table + recommendation', output: 'Comparison table + one recommendation line' },
    compatibleMethodologyIds: ['constraint_based', 'structured_output', 'few_zero_one_shot', 'reflexion'],
    version: 1,
  },
  {
    id: 'understand_plan_execute_validate', name: 'Understand–Plan–Execute–Validate', kind: 'framework',
    expansion: 'Understand, Plan, Execute, Validate',
    description: 'Structure complex work as four explicit phases so the model reasons before acting and checks its own result.',
    category: 'Task Structure', tier: 'Structured', icon: 'branch',
    template: 'Phase 1 Understand: restate the problem and unknowns. Phase 2 Plan: list steps. Phase 3 Execute: perform the steps. Phase 4 Validate: check the result against the goal and list remaining gaps.',
    requiredFields: ['task'], optionalFields: ['context', 'validationCriteria'],
    example: { input: 'task=design a caching layer; validationCriteria=p95 under 100ms', output: 'Four labeled sections ending with a pass/fail self-check' },
    compatibleMethodologyIds: ['least_to_most', 'reflexion', 'iterative', 'step_back'],
    version: 1,
  },
  {
    id: 'problem_options_decision_action', name: 'Problem–Options–Decision–Action', kind: 'framework',
    expansion: 'Problem, Options, Decision, Action',
    description: 'Organize decision-support work: frame the problem, lay out options, commit to one decision, list concrete actions.',
    category: 'Decision Support', tier: 'Structured', icon: 'gauge',
    template: 'Problem: [what must be decided and why now]. Options: [2–4 options with pros/cons]. Decision: [one chosen option + why]. Action: [next steps with owners/dates].',
    requiredFields: ['problem', 'options'], optionalFields: ['decisionCriteria'],
    example: { input: 'problem=build vs buy vector DB; options=pgvector, managed service', output: 'Options table → single decision → 3 action items' },
    compatibleMethodologyIds: ['graph_of_thoughts', 'constraint_based', 'retrieval_grounded', 'reflexion'],
    version: 1,
  },
  {
    id: 'input_process_output', name: 'Input–Process–Output', kind: 'framework',
    expansion: 'Input, Process, Output',
    description: 'Define repeatable transformations: what comes in, the exact steps applied, what must come out.',
    category: 'Task Structure', tier: 'Foundation', icon: 'link',
    template: 'Input: [data/material and its shape]. Process: [ordered transformation steps]. Output: [required structure, with an example row if applicable].',
    requiredFields: ['input', 'process', 'output'],
    optionalFields: [],
    example: { input: 'input=CSV rows; process=dedupe, normalize dates; output=JSON objects with the same ids', output: 'Deterministic transformed records' },
    compatibleMethodologyIds: ['structured_output', 'few_zero_one_shot', 'constraint_based', 'tool_assisted'],
    version: 1,
  },
  {
    id: 'consistent_ai_images', name: 'Consistent AI Images', kind: 'framework',
    expansion: 'Concept, References, Visuals, Output',
    description: 'Four-section template for consistent AI images: state the overarching concept, say exactly what to take from each reference, specify visual details (what goes where, colors, lighting), and lock the output shape/size plus what you will finish yourself.',
    category: 'Creative', tier: 'Foundation', icon: 'image',
    template: 'Overarching concept: [What are we making, and what should it communicate?]\nReferences: [For each uploaded image, say exactly what to use from it — palette, subject, camera angle, lighting, composition. Write "None" if there are no references.]\nVisual details: [Get specific about what goes where, plus the colors, lighting, mood, texture, and any details you care about.]\nOutput and finishing: [What shape and size should the image be, and what will you add or edit yourself?]',
    requiredFields: ['overarching_concept', 'references', 'visual_details', 'output_and_finishing'],
    optionalFields: [],
    example: {
      input: 'concept=launch hero images that communicate calm precision; refs=brand deck (take palette + type only); visuals=navy/cyan grid, single glowing terminal centered, soft rim light; output=1:1 2048px, I add logo + headline myself',
      output: 'Same palette, lighting, and composition across every image in the series — only the intended variables change',
    },
    compatibleMethodologyIds: ['few_zero_one_shot', 'constraint_based', 'iterative', 'retrieval_grounded'],
    version: 1,
  },
];

/* Methodologies added per taxonomy spec where the 30 do not already
 * cover the general technique (specific implementations stay linked, not duplicated). */
const EXTRA_METHODOLOGIES = [
  {
    id: 'retrieval_grounded', name: 'Retrieval-grounded prompting',
    description: 'Ground the answer in supplied documents or retrieved evidence instead of model memory.',
    category: 'Grounding',
    whenToUse: 'Factual questions about your own data, policies, tickets, or anything post-cutoff.',
    limitations: 'Garbage retrieval poisons the answer; adds latency and token cost; the model may ignore supplied evidence.',
    applicationInstructions: 'Provide the source material inline. Instruct: answer ONLY from the supplied material, cite the source for each claim, and say "not found in the provided material" when absent.',
    requires: ['documents'],
    compatibleFrameworkIds: ['role_task_context_output', 'goal_context_constraints_format', 'input_process_output', 'three_sentence'],
    modelCaveats: 'Long contexts degrade recall — pass only the relevant passages, not whole documents.',
    conflictsWith: ['generated_knowledge'],
    version: 1, related: ['Generated Knowledge', 'Self-Ask'],
  },
  {
    id: 'constraint_based', name: 'Constraint-based prompting',
    description: 'Make boundaries and acceptance criteria explicit: what must hold, what is forbidden, what "done" means.',
    category: 'Constraints',
    whenToUse: 'Outputs that must fit real-world limits (length, tone, compliance, style guides).',
    limitations: 'Over-constraining shrinks the solution space; contradictory constraints are silently resolved by the model.',
    applicationInstructions: 'List constraints as imperative lines (must / must not / never), end with an observable acceptance criterion, and ask the model to flag any constraint it cannot satisfy.',
    requires: ['constraints'],
    compatibleFrameworkIds: ['goal_context_constraints_format', 'clear', 'trace', 'rtf', 'tag', 'role_task_context_output'],
    modelCaveats: 'Models prioritize recent instructions — put hard constraints late in the prompt.',
    conflictsWith: [],
    version: 1, related: ['Negative Prompting', 'Constitutional'],
  },
  {
    id: 'structured_output', name: 'Structured-output prompting',
    description: 'Constrain the response to a schema or defined format (JSON, table, fixed sections) so it is machine-checkable.',
    category: 'Structured Output',
    whenToUse: 'Output feeds code, pipelines, or validators; consistent shape matters more than prose.',
    limitations: 'Schema too large → truncation or invalid JSON; format compliance ≠ factual correctness.',
    applicationInstructions: 'State the exact schema with field types, give one miniature example, demand JSON only (no prose/code fences), and validate with a contract checker after generation.',
    requires: ['schema'],
    compatibleFrameworkIds: ['role_task_context_output', 'goal_context_constraints_format', 'input_process_output', 'trace', 'rascef', 'rtf'],
    modelCaveats: 'Smaller models need schema + example together; large models tolerate schema alone.',
    conflictsWith: [],
    version: 1, related: ['TRACE', 'Structured-output tabs in this app'],
  },
  {
    id: 'tool_assisted', name: 'Tool-assisted prompting',
    description: 'Define when the model may call tools, which tools exist, and how to validate tool results before trusting them.',
    category: 'Tool Use',
    whenToUse: 'Tasks needing live data or actions: search, code execution, APIs, databases.',
    limitations: 'Model may call the wrong tool, hallucinate tool output, or loop; requires a harness to enforce.',
    applicationInstructions: 'List available tools with their inputs, require reasoning before each call, limit to one call per step, and require a sanity check of each result before use.',
    requires: ['tools'],
    compatibleFrameworkIds: ['three_sentence', 'understand_plan_execute_validate', 'problem_options_decision_action', 'input_process_output'],
    modelCaveats: 'Without an executor loop the model can only describe tool use, not perform it.',
    conflictsWith: [],
    version: 1, related: ['ReAct'],
  },
  {
    id: 'iterative', name: 'Iterative prompting',
    description: 'Use feedback and intermediate results to improve the answer over successive rounds instead of one-shot generation.',
    category: 'Iteration',
    whenToUse: 'Drafts, refactors, and any task where round 1 is expected to be incomplete.',
    limitations: 'Converges slowly without a crisp criterion; each round costs tokens and can drift.',
    applicationInstructions: 'Round 1: draft against stated criteria. Critique: list gaps as numbered rules. Round 2: revise obeying each rule. Stop when no rule-level gap remains.',
    requires: [],
    compatibleFrameworkIds: ['understand_plan_execute_validate', 'three_sentence', 'clear', 'rise', 'trace'],
    modelCaveats: 'Model cannot self-report true quality — keep a human gate on the final round.',
    conflictsWith: [],
    version: 1, related: ['Reflexion', 'Prompt Chaining', 'RISE'],
  },
  {
    id: 'reference_anchored_images', name: 'Reference-anchored image generation',
    description: 'Anchor image generation to explicit references and a fixed visual spec so repeated generations stay stylistically consistent.',
    category: 'Modality',
    whenToUse: 'Brand assets, product shots, character sheets, or any series of images that must look like one set.',
    limitations: 'Models blend rather than copy references — they match mood, palette, and composition, not pixel-exact details; conflicting references produce an averaged style.',
    applicationInstructions: 'State the concept in one sentence, label each reference with exactly what to take from it (palette, subject, camera, lighting), spell out placement/colors/lighting in visual details, then lock output shape and size. Reuse the same four sections for every image in the series and change only what must vary.',
    requires: ['images'],
    compatibleFrameworkIds: ['consistent_ai_images', 'role_task_context_output', 'goal_context_constraints_format', 'three_sentence'],
    modelCaveats: 'Reference fidelity varies by model — keep the same spec (and seed settings where supported) across the series, and review each output against the spec before accepting it.',
    conflictsWith: [],
    version: 1, related: ['Multimodal', 'Few/Zero/One-Shot'],
  },
];

/* Limitations / caveats for the 19 reclassified methodologies (concise,
 * derived from known behavior — not from executing anything). */
const METH_NOTES = {
  'CoT / ToT': ['Reasoning traces waste tokens on easy tasks; ToT multiplies cost per branch.', 'Long traces can wander; pin a token budget for the reasoning section.'],
  'Few/Zero/One-Shot': ['Examples anchor format AND content — biased examples bias outputs.', 'Zero-shot fails on unusual formats; few-shot needs diversity, not volume.'],
  'Self-Consistency': ['Cost multiplies by the number of samples; majority vote can elect a shared error.', 'Use only where a verifiable answer exists to vote over.'],
  'Prompt Chaining': ['Error compounds down the chain; isolate and re-run failed links.', 'Do not chain more than ~5 links without checkpoints.'],
  'Negative Prompting': ['Negations are weaker than positives — models attend to the mentioned item.', 'Pair every "avoid" with a stated alternative.'],
  'Emotion Prompting': ['Gains are inconsistent across models; stakes language can add noise.', 'Never substitute emotional framing for missing specifics.'],
  ReAct: ['Without an executor, the model only simulates tool calls.', 'Loops need a step limit or the agent never terminates.'],
  'Generated Knowledge': ['Generated facts can themselves be wrong — they are model memory, not evidence.', 'Pair with retrieval when accuracy is critical.'],
  'Active-Prompt': ['Question rounds add latency; poor questions waste the user\'s time.', 'Cap questions at 1–3 and proceed on partial answers.'],
  Constitutional: ['Self-critique catches rule violations, not factual errors.', 'Principles must be checkable — vague values are ignored.'],
  'Least-to-Most': ['Overhead on simple tasks; sub-problem list can miss hidden dependencies.', 'Reserve for genuinely multi-hop problems.'],
  'Graph-of-Thoughts': ['Graph management in-context is token-heavy.', 'Three branches usually suffice; more degrades quality.'],
  'Skeleton-of-Thought': ['Skeleton approval adds a round trip.', 'Risky if the skeleton itself is wrong — review it.'],
  'Directional Stimulus': ['Keywords can be ignored under long contexts.', 'Do not over-specify or it collapses to full instructions.'],
  'Step-Back': ['Abstraction can drift from the concrete question.', 'Ask for the principles to be tied back explicitly.'],
  Reflexion: ['Reflection rules can encode a wrong lesson from one failure.', 'Keep lessons observable and testable.'],
  'Meta-Prompting': ['Output prompts still need human review — the model optimizes for plausible, not correct.', 'Circular: judge the generated prompt against your task, not its style.'],
  'Self-Ask': ['Follow-ups multiply tokens; loops if a follow-up is unanswerable.', 'Force a final-answer step with a step limit.'],
  Contrastive: ['A flawed example can teach the flaw if the reason is unclear.', 'Always name WHY the bad example fails.'],
  Multimodal: ['Vision inputs are lossy for fine text and exact values.', 'Cross-check numbers and labels with a text pass.'],
};

function buildFromLibrary() {
  const out = { frameworks: [], methodologies: [] };
  for (const f of FRAMEWORKS) {
    const kind = KIND_BY_NAME[f.a] || 'framework';
    const id = slug(f.a);
    const fields = f.e.split(',').map((x) => x.trim()).filter(Boolean);
    const notes = METH_NOTES[f.a] || ['', ''];
    const base = {
      id, kind, name: f.a, expansion: f.e, category: CATEGORY_BY_NAME[f.a] || 'General',
      tier: f.tier, icon: f.icon, version: 1,
    };
    if (kind === 'framework') {
      out.frameworks.push({
        ...base,
        description: `${f.e} — best for ${f.b}.`,
        template: f.t,
        requiredFields: fields.map(slug),
        optionalFields: [],
        example: { input: `A messy request needing ${f.b}.`, output: f.t.replace(/\[[^\]]+\]/g, '…') },
        compatibleMethodologyIds: null, // resolved symmetrically below
        teachingPoints: f.pts,
      });
    } else {
      out.methodologies.push({
        ...base,
        description: `${f.e} — best for ${f.b}.`,
        whenToUse: `When the task involves ${f.b}.`,
        limitations: notes[0],
        applicationInstructions: f.pts.join(' '),
        requires: [],
        compatibleFrameworkIds: null,
        modelCaveats: notes[1],
        conflictsWith: [],
        teachingPoints: f.pts,
        template: f.t,
      });
    }
  }
  return out;
}

const built = buildFromLibrary();

export const FRAMEWORK_CATALOG = [
  ...built.frameworks,
  ...EXTRA_FRAMEWORKS.map((f) => ({ ...f, kind: 'framework', icon: f.icon || 'clip', teachingPoints: null })),
];

export const METHODOLOGY_CATALOG = [
  ...built.methodologies,
  ...EXTRA_METHODOLOGIES.map((m) => ({ ...m, kind: 'methodology', teachingPoints: null })),
];

/* ── Compatibility resolution (symmetric, minus declared conflicts) ── */
const CONFLICT_PAIRS = METHODOLOGY_CATALOG.reduce((acc, m) => {
  for (const other of m.conflictsWith || []) acc.push([m.id, other]);
  return acc;
}, []);
function conflictsWith(a, b) {
  return CONFLICT_PAIRS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}
for (const f of FRAMEWORK_CATALOG) {
  if (f.compatibleMethodologyIds === null) {
    f.compatibleMethodologyIds = METHODOLOGY_CATALOG.filter((m) => !(m.conflictsWith || []).includes(f.id)).map((m) => m.id);
  }
}
for (const m of METHODOLOGY_CATALOG) {
  if (m.compatibleFrameworkIds === null) {
    m.compatibleFrameworkIds = FRAMEWORK_CATALOG.filter((f) => !conflictsWith(m.id, f.id)).map((f) => f.id);
  }
}

/* ── Lookups & search ── */
export function getFrameworkItem(id) {
  return FRAMEWORK_CATALOG.find((f) => f.id === id) || null;
}
export function getMethodologyItem(id) {
  return METHODOLOGY_CATALOG.find((m) => m.id === id) || null;
}
export function findFrameworkByName(name) {
  if (!name) return null;
  const key = String(name).toLowerCase();
  return FRAMEWORK_CATALOG.find((f) => f.name.toLowerCase() === key || f.id === slug(name)) || null;
}
export function searchCatalog(items, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return items.slice();
  const tokens = q.split(/\s+/);
  return items.filter((item) => {
    const hay = `${item.name} ${item.expansion || ''} ${item.description} ${item.category} ${(item.teachingPoints || []).join(' ')} ${item.whenToUse || ''}`.toLowerCase();
    return tokens.every((t) => hay.includes(t));
  });
}
export function catalogStats() {
  return {
    frameworks: FRAMEWORK_CATALOG.length,
    methodologies: METHODOLOGY_CATALOG.length,
    reclassified: FRAMEWORKS.length,
    fromLibrary: built.frameworks.length + built.methodologies.length,
    conflictPairs: CONFLICT_PAIRS.length,
  };
}
export { CONFLICT_PAIRS, conflictsWith };
