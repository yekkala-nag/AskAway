// ============================================================================
// AGENT ORG CHART ENGINE — hire-don't-prompt, one-desk, failure modes, accountability
// Data + pure functions only. Node-clean: no JSX / window / document.
// Illustrative demo data only, no external claims.
// ============================================================================

export const TEAL = '#3A9B9F';
export const TEAL_DARK = '#1A6B6E';
export const PURPLE = '#5B4B8A';
export const RED = '#B4553A';
export const AMBER = '#B9821F';

// ── 1. Hire, don't prompt: vocabulary ─────────────────────────────────────────
export const ORG_VOCAB = [
  { term: 'worker', meaning: 'The individual doing the job — a person or an agent instance.' },
  { term: 'position', meaning: 'One seat on the chart. Exactly one worker sits in it at a time.' },
  { term: 'role', meaning: 'The written remit for a position: duties, limits, and handoffs.' },
  { term: 'responsibility', meaning: 'A single owned outcome. Every outcome has exactly one owner.' },
];

export const BUILD_ORDER = [
  { step: 1, name: 'List the jobs', detail: 'Write down every recurring outcome the team must produce.' },
  { step: 2, name: 'Write the role', detail: 'Turn each job cluster into a remit: duties, limits, handoffs.' },
  { step: 3, name: 'Hire the worker', detail: 'Only now choose who fills the seat: a person or an agent.' },
];

// Five-seat demo chart: first seat is the accountable top.
export const ORG_ROLES = [
  { id: 'lead', title: 'Team lead', duties: 'Owns priorities, approves plans, answers for outcomes.', mustBeHuman: true },
  { id: 'planner', title: 'Planner', duties: 'Turns goals into sequenced task cards.', mustBeHuman: false },
  { id: 'builder', title: 'Builder', duties: 'Executes one card at a time, reports back.', mustBeHuman: false },
  { id: 'reviewer', title: 'Reviewer', duties: 'Checks work against the card before it ships.', mustBeHuman: false },
  { id: 'messenger', title: 'Messenger', duties: 'Sends updates to the outside world.', mustBeHuman: false },
];

// assignments: { roleId: 'human' | 'ai' | null }
export function evaluateOrgChart(assignments = {}) {
  const staffed = ORG_ROLES.filter((r) => assignments[r.id] === 'human' || assignments[r.id] === 'ai');
  const unstaffed = ORG_ROLES.filter((r) => !assignments[r.id]).map((r) => r.id);
  const humanCount = ORG_ROLES.filter((r) => assignments[r.id] === 'human').length;
  const aiCount = ORG_ROLES.filter((r) => assignments[r.id] === 'ai').length;
  const topFilled = assignments.lead === 'human' || assignments.lead === 'ai';
  const missingHumanAtTop = assignments.lead !== 'human';
  const chain = ORG_ROLES.map((r) => ({
    id: r.id,
    title: r.title,
    worker: assignments[r.id] || 'empty',
  }));
  let status = 'healthy';
  if (!topFilled || unstaffed.length > 0) status = 'incomplete';
  else if (missingHumanAtTop) status = 'no-human-at-top';
  return { chain, staffed: staffed.length, unstaffed, humanCount, aiCount, topFilled, missingHumanAtTop, status };
}

export function accountabilityMessage(evalResult) {
  if (!evalResult.topFilled) return 'Nobody sits at the top seat — priorities have no owner.';
  if (evalResult.missingHumanAtTop) return 'Top seat is filled but not by a person — nobody can answer for outcomes.';
  if (evalResult.unstaffed.length > 0) return `Open seats: ${evalResult.unstaffed.join(', ')} — outcomes without owners drift.`;
  return 'Every seat staffed, a person sits at the top — the chain of responsibility is complete.';
}

// ── 2. One desk per agent: kanban workflow ────────────────────────────────────
export const KANBAN_STAGES = [
  { id: 'backlog', name: 'Backlog', detail: 'Every request waits here. Nothing starts without a card.' },
  { id: 'spec', name: 'Spec', detail: 'Card gains requirements + design + todo list.' },
  { id: 'approve', name: 'Approve', detail: 'A person signs the spec before any build work.' },
  { id: 'build', name: 'Build', detail: 'Exactly one worker builds exactly this card.' },
  { id: 'review', name: 'Review', detail: 'Work is checked against the card, then released.' },
];

export const SPEC_PARTS = [
  { id: 'requirements', name: 'Requirements', detail: 'What done looks like, in checkable sentences.' },
  { id: 'design', name: 'Design', detail: 'Approach sketch: steps, tools, and boundaries.' },
  { id: 'todo', name: 'Todo list', detail: 'Ordered subtasks small enough to verify one by one.' },
];

export function nextStage(stageId) {
  const i = KANBAN_STAGES.findIndex((s) => s.id === stageId);
  if (i === -1) return null;
  return i + 1 < KANBAN_STAGES.length ? KANBAN_STAGES[i + 1].id : null;
}

export function checkSpec(spec = {}) {
  const missing = SPEC_PARTS.filter((p) => !spec[p.id] || String(spec[p.id]).trim() === '').map((p) => p.id);
  return { complete: missing.length === 0, missing };
}

export const ISOLATION_LESSON = {
  title: 'Shared workspace incident',
  before: 'Two agents shared one folder. One rewrote files while the other read them — finished work was clobbered mid-review.',
  rule: 'One container and one desktop per agent. Agents meet only through the task board, never through shared files.',
};

// ── 3. Four ways it goes wrong ────────────────────────────────────────────────
export const FAILURE_MODES = [
  { id: 'self-trigger', failure: 'Self-triggering', symptom: 'Agent starts new work nobody asked for.', cause: 'It can message itself or re-queue its own output as input.', fix: 'Only the board assigns work; agents cannot create cards.' },
  { id: 'chatter', failure: "Won't stop talking", symptom: 'Agents message each other in loops, burning time.', cause: 'Free-form chat with no turn limit or agenda.', fix: 'Status updates go on the card; cap update rounds per card.' },
  { id: 'not-human', failure: 'Forgets it is not human', symptom: 'Agent claims authority, feelings, or access it lacks.', cause: 'Role text reads like a person with standing.', fix: 'Role states plainly: software tool, no authority beyond the card.' },
  { id: 'politics', failure: 'Office politics', symptom: 'Agents negotiate scope and reassign each other.', cause: 'Over-broad roles with overlapping ownership.', fix: 'Tight roles: one owner per outcome, handoffs written down.' },
];

// breadth: 'broad' | 'balanced' | 'tight'; usesBoard: boolean
export function evaluateRoleTightness(breadth = 'broad', usesBoard = false) {
  if (breadth === 'broad' && !usesBoard) {
    return { status: 'politics-risk', warning: 'Broad roles with no task board — expect overlapping claims and renegotiation.' };
  }
  if (breadth === 'broad' && usesBoard) {
    return { status: 'strained', warning: 'Board helps, but broad roles still invite scope overlap — split one duty off each role.' };
  }
  if (breadth === 'balanced') {
    return { status: usesBoard ? 'healthy' : 'strained', warning: usesBoard ? 'Balanced roles plus a task board — ownership is clear.' : 'Balanced roles but no board — add one queue so handoffs stay visible.' };
  }
  return { status: usesBoard ? 'healthy' : 'strained', warning: usesBoard ? 'Tight roles plus a task board — each worker owns a slice, handoffs are explicit.' : 'Tight roles help, but without a board nobody can see the queue — add one.' };
}

// ── 4. Accountability ─────────────────────────────────────────────────────────
export const DAY_ONE_NEEDS = [
  { id: 'desk', name: 'A place to work', detail: 'Isolated container and desktop per agent from the first run.' },
  { id: 'streams', name: 'Event streams', detail: 'Every assignment, message, and tool call is observable live.' },
];

export const WORKFLOW_VS_PROCESS = [
  { item: 'Workflow', meaning: 'The path one card travels: backlog → spec → approve → build → review.' },
  { item: 'Process', meaning: 'The standing rules every card follows: who approves, what done means, where logs go.' },
];

export const ACCOUNTABILITY_RULES = [
  { id: 'human-top', rule: 'A person sits at the top', detail: 'The lead seat is always human — only people answer for outcomes.' },
  { id: 'plan-not-pile', rule: 'Review the plan, not the pile', detail: 'Approve the short spec before work starts; nobody can review a mountain of output after the fact.' },
  { id: 'one-owner', rule: 'One owner per outcome', detail: 'Shared ownership means no ownership. The chart names exactly one.' },
];

export function reviewCapacity(outputs, minutesPerOutput = 5, minutesAvailable = 60) {
  const needed = outputs * minutesPerOutput;
  const feasible = needed <= minutesAvailable;
  return { needed, minutesAvailable, feasible, verdict: feasible ? 'Review fits the shift — approve card by card.' : 'Review does not fit — shrink scope or approve the plan earlier, not the pile later.' };
}

export const PYTHON_ORG_CODE = `# ----------------------------------------------------------------------------
# ORG CHART: hire order is jobs -> role -> worker; lead seat stays human
# ----------------------------------------------------------------------------
ROLES = ["lead", "planner", "builder", "reviewer", "messenger"]

def evaluate_chart(assignments: dict) -> dict:
    unstaffed = [r for r in ROLES if not assignments.get(r)]
    top_ok = assignments.get("lead") == "human"
    if not assignments.get("lead"):
        status = "incomplete"
    elif not top_ok:
        status = "no-human-at-top"
    elif unstaffed:
        status = "incomplete"
    else:
        status = "healthy"
    return {"unstaffed": unstaffed, "top_ok": top_ok, "status": status}

def next_stage(stage: str):
    order = ["backlog", "spec", "approve", "build", "review"]
    i = order.index(stage) if stage in order else -1
    return order[i + 1] if 0 <= i + 1 < len(order) else None

def spec_complete(spec: dict) -> bool:
    return all((spec.get(p) or "").strip() for p in ("requirements", "design", "todo"))
`;
