// ── Prompt alignment & approval frameworks engine — report skeletons,
// universal master blocks, pre-flight alignment protocols, and a two-phase
// gated prompt. Original teaching content. No sources, URLs, or authors.

// ── Universal master framework ──────────────────────────────────────────────

export const UNIVERSAL_BLOCKS = [
  { id: 'role', name: 'ROLE', icon: '🎭', line: 'Act as a [world-class senior practitioner].', why: 'Sets vocabulary, standards, and the lens every later decision is judged through' },
  { id: 'context', name: 'CONTEXT', icon: '🗺️', line: 'I am working on [project]. Audience is [who]. Situation: [state].', why: 'An unframed task gets a generic answer; context turns a model into a colleague' },
  { id: 'task', name: 'CORE TASK', icon: '🎯', line: 'Your primary objective is to [one concrete deliverable].', why: 'One objective beats three — parallel goals dilute every instruction that follows' },
  { id: 'steps', name: 'INSTRUCTIONS', icon: '📜', line: 'First [step 1]. Next [step 2]. Finally [step 3].', why: 'Sequencing forces intermediate products instead of one flat guess' },
  { id: 'constraints', name: 'CONSTRAINTS', icon: '🚧', line: 'Do NOT [banned things]. Keep under [limit]. If missing info, ask first.', why: 'Negative space is as instructional as the task itself — bans and budgets bound the search' },
  { id: 'output', name: 'OUTPUT FORMAT', icon: '📦', line: 'Present as [table/JSON/email]. Include a short rationale.', why: 'Format decided in advance means the result lands in your workflow, not in your reformatting queue' },
];

export const META_PROMPT = {
  name: 'Prompt-generator meta-prompt',
  steps: [
    'Declare the assistant’s role: expert prompt engineer',
    'Ask 3–5 targeted questions about goal, audience, constraints, format',
    'Wait — do not answer the original task yet',
    'Synthesize the replies into a master prompt (the six blocks)',
    'Deliver it in a copy-pasteable block, then offer to tweak variables',
  ],
  opening: '“What is the ultimate goal or task you want the AI to accomplish?”',
};

export const QUICK_FIRE = {
  name: 'C-T-F shortcut',
  blocks: [
    { letter: 'C', name: 'Context', example: 'I’m a beginner learning the framework.' },
    { letter: 'T', name: 'Task', example: 'Explain how the lifecycle hook works.' },
    { letter: 'F', name: 'Format', example: 'Restaurant-ordering analogy, under 150 words, one short example.' },
  ],
  when: 'Everyday asks where a six-block prompt would be overkill',
};

export const PRO_TIPS = [
  { tip: 'The “ask me” clause', add: '“If you need more context to do this perfectly, ask up to 3 clarifying questions before generating.”', why: 'Converts silent guessing into a cheap question' },
  { tip: 'Few-shot anchoring', add: '“Here is an example of the exact style I want: [example].”', why: 'One good example outweighs three paragraphs of tone adjectives' },
  { tip: 'Step-by-step trigger', add: '“Think step-by-step and show your reasoning before the final answer.”', why: 'Intermediate working is where logic errors become visible and fixable' },
];

// ── Task completion & approval report ───────────────────────────────────────

export const TASK_REPORT_INPUT = `ROLE
Act as a project lead writing to a stakeholder.

CONTEXT
This is a [daily / weekly / milestone] update.

DATA SOURCE
Base the report on [chat history / attached doc / ticket list].

INSTRUCTIONS
Generate a Task Completion and Approval Request report.
Strict structure, concise, action-oriented:
1. Executive Summary — 1–2 sentences.
2. Tasks Performed — table: name, status, key outcome.
3. Blockers & Dependencies — what is stopping progress.
4. Approval Request — exactly WHAT to approve and WHY.
5. Next Steps — 2–3 items that start after approval.`;

export const TASK_STATUS = [
  { status: '✅ Completed', id: 'done', meaning: 'Deliverable exists and is ready for review' },
  { status: '🔄 In Progress', id: 'wip', meaning: 'Underway; include the percentage or remaining step' },
  { status: '⚠️ Blocked', id: 'blocked', meaning: 'Cannot move without a named dependency' },
];

export const TASK_REPORT_SECTIONS = [
  { n: 1, section: 'Executive Summary', job: 'One glance of overall progress + the ask', weak: 'Paragraph reciting every commit', strong: '“Copy draft and legal review done; blocked on final assets — approving the draft unblocks Friday handoff.”' },
  { n: 2, section: 'Tasks Performed', job: 'Statused table with outcomes, not activity', weak: 'Bullet list of effort (“worked on X”)', strong: 'Row per task: name · status · deliverable produced' },
  { n: 3, section: 'Blockers & Dependencies', job: 'Name what is missing and who owns it', weak: '“Some challenges this week”', strong: '“Need staging access from platform team to finish testing.”' },
  { n: 4, section: 'Approval Request', job: 'The single reason the report exists', weak: '“Let me know your thoughts.”', strong: 'Action: approve [specific deliverable]. Reason: it unlocks [dated next step].' },
  { n: 5, section: 'Next Steps', job: 'What happens the moment approval lands', weak: 'Vague optimism', strong: '“1) Hand off approved copy. 2) Schedule Monday deployment.”' },
];

export const TASK_QUICK = 'Review [data source]. List tasks completed on [project] in a table with status and outcome. Highlight blockers, and end with a clear “Approval Needed” section for [item] so I can proceed to [next step].';

export const SAMPLE_TASKS = [
  { task: 'Q3 marketing copy', status: 'done', outcome: 'Drafted and finalized, awaiting sign-off' },
  { task: 'API integration', status: 'wip', outcome: '80% complete, pending final testing' },
  { task: 'Brand asset refresh', status: 'blocked', outcome: 'Awaiting assets from design' },
];

// ── Token utilization report ────────────────────────────────────────────────

export const TOKEN_REPORT_INPUT = `ROLE
Act as an AI operations manager.

CONTEXT
This is a [daily / weekly / milestone] token utilization report
for [project].

DATA SOURCE
Base it on [API usage logs / provided JSON or CSV].

BUDGET
The current token budget for this task is [N tokens / $X].

INSTRUCTIONS
Generate a Token Utilization and Approval Request:
1. Executive Summary — usage, % of budget, efficiency.
2. Breakdown table — task, input, output, total, est. cost.
3. Efficiency & Optimization Notes — waste spotted, wins kept.
4. Approval Request — exactly what needs approving.
5. Next Steps — 2–3 items after approval.`;

export const TOKEN_ROWS = [
  { task: 'Data preprocessing', input: 15000, output: 2000 },
  { task: 'Draft generation', input: 25000, output: 30000 },
  { task: 'Revision & refinement', input: 10000, output: 8000 },
];

export const RATE_IN_PER_M = 2.0; // $ per 1M input tokens (illustrative)
export const RATE_OUT_PER_M = 1.0; // $ per 1M output tokens (illustrative)

export function tokenTotals(rows = TOKEN_ROWS) {
  const input = rows.reduce((s, r) => s + r.input, 0);
  const output = rows.reduce((s, r) => s + r.output, 0);
  const total = input + output;
  const cost = (input / 1e6) * RATE_IN_PER_M + (output / 1e6) * RATE_OUT_PER_M;
  return { input, output, total, cost: Math.round(cost * 10000) / 10000 };
}

export function budgetState(used, budget) {
  if (budget <= 0) throw new Error('budget must be positive');
  const pct = Math.round((used / budget) * 1000) / 10;
  const verdict = pct <= 80 ? 'within' : pct <= 100 ? 'tight' : 'over';
  return { pct, verdict, remaining: budget - used };
}

export const EFFICIENCY_NOTES = [
  { kind: 'positive', note: 'Output-to-input ratio is healthy; system prompts trimmed redundant context' },
  { kind: 'observation', note: 'Revision subtask ran heavy — long source documents. Summarize inputs before the next pass' },
];

export const TOKEN_QUICK = 'Review the token usage data for [project]. Provide a quick table of input vs output tokens and total cost. Note inefficiencies, and end with a clear “Approval Needed” section to [continue / approve $X spend] so we can proceed.';

// ── Alignment protocols ─────────────────────────────────────────────────────

export const ALIGNMENT_PROTOCOLS = [
  {
    id: 'universal', name: 'Universal Alignment Protocol', icon: '🛑', when: 'Append to any task, or run as step one',
    steps: [
      'Restatement — confirm comprehension in your own words',
      'Core deconstruction — objective, intended outcome, audience',
      'Gap analysis — missing info, ambiguities, assumptions made',
      'Proposed plan — 2–3 steps, executed only after approval',
    ],
    closing: '“Does this alignment reflect your needs, or should we adjust parameters?”',
  },
  {
    id: 'precheck', name: 'Complex Problem Pre-Check', icon: '🧠', when: 'Strategy, coding, or analysis with dependencies',
    steps: [
      'The real problem — strip the surface request to the root',
      'Key constraints & variables — explicit and implicit',
      'Hidden assumptions — 2–3, flagged for verification',
      'Missing context — exactly what data would guarantee quality',
    ],
    closing: 'End with a multiple-choice clarifier list (max 3) — no final solution yet',
  },
  {
    id: 'creative', name: 'Creative Brief Confirmation', icon: '✍️', when: 'Writing, marketing, design — tone-sensitive work',
    steps: [
      'Request summary — one sentence of what is being created',
      'Audience & tone — mindset plus exact voice',
      'Success metrics — what “good” measurably means',
      'Clarification needed — up to 3 style/length/banned-word questions',
    ],
    closing: 'Wait for the answers before drafting a single line',
  },
  {
    id: 'oneliner', name: 'Appendable one-liner', icon: '⚡', when: 'When a full protocol would be overkill',
    steps: [
      'One sentence, added to the end of any prompt: restate goal, name audience, list missing context, ask up to 3 clarifiers, then wait for confirmation.',
    ],
    closing: 'The 20× insurance policy — cheap pause, expensive mistakes avoided',
  },
];

export const WHY_ALIGNMENT = [
  { reason: 'Forces chain-of-thought', detail: 'Thinking out loud before answering improves the logical quality of everything after' },
  { reason: 'Stops hallucination', detail: 'Stated assumptions and missing info block confident guessing of details that were never provided' },
  { reason: 'Saves tokens', detail: '100 tokens of clarification beat 2,000 tokens of a wrong solution you must iterate on — a 20× return on the pause' },
];

// ── Two-phase gated prompt ──────────────────────────────────────────────────

export const TWO_PHASE_INPUT = `ROLE
Act as a system resource monitor and task orchestrator.

PHASE 1 — ALIGNMENT CHECK
Restate the request, identify objective, intended outcome,
and audience. Do NOT generate the report. Ask for explicit
approval to proceed.

PHASE 2 — EXECUTION  (runs only after “Approved”)
Generate a Global Background Task & Token Utilization Report
from the environment state at the moment of execution:
1. Scope: ALL background tasks in the environment.
2. Statuses: In Execution, Completed, Passed, Failed.
3. Tokens: aggregate total per primary task ONLY.
4. STRICT CONSTRAINT: no sub-task, micro-step, reasoning,
   or retry breakdowns. One total per task. No estimates.
5. Format: Markdown table — Task | Status | Total Tokens.`;

export const BG_TASKS = [
  { id: 'GLOBAL_DATA_SYNC', status: 'running', tokens: 14500 },
  { id: 'USER_BEHAVIOR_ANALYSIS', status: 'completed', tokens: 42300 },
  { id: 'IMAGE_BATCH_A', status: 'failed', tokens: 3200 },
  { id: 'AUTO_TRANSLATION', status: 'passed', tokens: 28750 },
  { id: 'LOG_AGGREGATION', status: 'running', tokens: 8100 },
  { id: 'DAILY_REPORT_GEN', status: 'completed', tokens: 12400 },
];

export const STATUS_LABELS = {
  running: 'In Execution',
  completed: 'Completed',
  passed: 'Passed',
  failed: 'Failed',
};

export function aggregateTasks(rows = BG_TASKS) {
  const total = rows.reduce((s, r) => s + r.tokens, 0);
  const byStatus = rows.reduce((m, r) => ({ ...m, [r.status]: (m[r.status] || 0) + 1 }), {});
  const wasted = rows.filter((r) => r.status === 'failed').reduce((s, r) => s + r.tokens, 0);
  return { total, byStatus, wasted, count: rows.length };
}

export const COMPLIANCE_NOTES = [
  { icon: '✅', note: 'Counts are absolute aggregates for primary tasks only' },
  { icon: '🚫', note: 'No sub-task, reasoning, or retry breakdowns — per the strict constraint' },
  { icon: '⚠️', note: 'Failed tasks still burned their tokens; restart accrues fresh spend' },
];
