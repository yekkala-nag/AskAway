// ── Agentic UI & supply-chain engine — UI-surface attack taxonomy,
// skill/plugin lifecycle risks, control simulator, defense workflow.
// Original content. No sources, URLs, or authors.

// ── Supply-chain surfaces ───────────────────────────────────────────────────

export const SURFACES = [
  { id: 'webpage', name: 'Webpage / document the agent reads', icon: '🌐',
    detail: 'Text the agent browses or retrieves; invisible instructions hide in alt-text, comments, or white-on-white markup' },
  { id: 'skill', name: 'Skill / plugin marketplace', icon: '🧩',
    detail: 'Third-party capabilities installed into the agent; skills run with the agent\'s privileges' },
  { id: 'tool', name: 'Tool descriptor / manifest', icon: '🔧',
    detail: 'The schema and description that tells the agent what a tool does — editable by whoever publishes it' },
  { id: 'memory', name: 'Shared memory / knowledge store', icon: '🧠',
    detail: 'Long-term memory the agent reads next session; poisoned once, read forever' },
  { id: 'email', name: 'Inbox / ticket / feed', icon: '📥',
    detail: 'Human-generated content that arrives with trust it has not earned' },
  { id: 'ui', name: 'UI the agent operates', icon: '🖥️',
    detail: 'Forms, dialogs, and pages the agent clicks through — can be redressed to catch its clicks' },
];

// ── Attack vectors ──────────────────────────────────────────────────────────

export const VECTORS = [
  { id: 'indirect', surface: 'webpage', name: 'Indirect instruction injection', severity: 4,
    payload: 'Hidden "ignore previous instructions…" text inside retrieved content',
    impact: 'Agent follows attacker goals with the user\'s authority' },
  { id: 'skillbackdoor', surface: 'skill', name: 'Backdoored skill', severity: 5,
    payload: 'Useful function plus a trigger: exfiltrate credentials when a phrase appears',
    impact: 'Credential theft, data exfiltration at agent privileges' },
  { id: 'descriptor', surface: 'tool', name: 'Descriptor spoofing', severity: 4,
    payload: 'Description edited to lure the agent toward a malicious tool',
    impact: 'Agent calls the wrong tool with sensitive arguments' },
  { id: 'memorypoi', surface: 'memory', name: 'Memory poisoning', severity: 4,
    payload: 'Malicious record written once; retrieved as trusted context later',
    impact: 'Persistent, cross-session behavior change' },
  { id: 'slopsquat', surface: 'skill', name: 'Typosquat package', severity: 4,
    payload: 'Look-alike skill name harvested from popular installs',
    impact: 'Silent install of attacker code' },
  { id: 'redress', surface: 'ui', name: 'UI redressing', severity: 3,
    payload: 'Overlay or layout trick so the agent\'s click lands on a different control',
    impact: 'Unintended confirmation, send, or delete' },
  { id: 'inbox', surface: 'email', name: 'Inbox injection', severity: 4,
    payload: 'Ticket or email body carries instructions aimed at the agent, not the human',
    impact: 'Automated actions triggered by attacker-sent messages' },
];

export function vectorsForSurface(surfaceId) {
  return VECTORS.filter((v) => v.surface === surfaceId).sort((a, b) => b.severity - a.severity);
}

// ── Lifecycle phases ────────────────────────────────────────────────────────

export const LIFECYCLE = [
  { id: 'author', name: 'Author', actor: 'Skill author', risk: 'Malicious or compromised authorship' },
  { id: 'publish', name: 'Publish', actor: 'Registry', risk: 'Insufficient review; scanner evasion via padding or novel logic' },
  { id: 'install', name: 'Install', actor: 'Operator', risk: 'Trust-on-first-use with no provenance check' },
  { id: 'execute', name: 'Execute', actor: 'Agent runtime', risk: 'Skill runs with agent\'s full privileges' },
  { id: 'persist', name: 'Persist', actor: 'Memory / state', risk: 'Poisoned artifacts survive and re-enter future runs' },
];

// ── Controls ────────────────────────────────────────────────────────────────

export const CONTROLS = [
  { id: 'provenance', name: 'Provenance & signing', desc: 'Verify publisher identity and signature before install; pin versions' },
  { id: 'sandbox', name: 'Capability sandbox', desc: 'Skills get scoped, expiring capabilities — never the agent\'s full authority' },
  { id: 'bind', name: 'Deterministic tool binding', desc: 'Tools resolved by pinned ID, not semantic guesswork at runtime' },
  { id: 'quarantine', name: 'Quarantined reader', desc: 'Untrusted content parsed by a tool-less reader emitting typed variables only' },
  { id: 'outputgate', name: 'Output policy gate', desc: 'Exfiltration and irreversible actions checked outside the agent\'s own reasoning' },
  { id: 'monitor', name: 'Behavior monitoring', desc: 'Anomaly signals on tool calls, network egress, and memory writes' },
];

// ── Attack/defense simulator ────────────────────────────────────────────────

/**
 * Returns whether an attack succeeds given enabled controls.
 * Each vector lists which control ids stop it; success = none enabled.
 */
export const VECTOR_CONTROLS = {
  indirect: ['quarantine', 'outputgate'],
  skillbackdoor: ['provenance', 'sandbox', 'monitor'],
  descriptor: ['bind', 'provenance'],
  memorypoi: ['quarantine', 'monitor'],
  slopsquat: ['provenance'],
  redress: ['outputgate'],
  inbox: ['quarantine', 'outputgate'],
};

export function simulate(vectorId, enabledControls) {
  const blockers = VECTOR_CONTROLS[vectorId] || [];
  const hit = blockers.filter((c) => enabledControls.includes(c));
  return {
    blocked: hit.length > 0,
    blockers: hit,
    remainingRisk: hit.length === 0 ? 1 : hit.length >= blockers.length ? 0 : 0.4,
  };
}

export function simulateAll(enabledControls) {
  return VECTORS.map((v) => ({ ...v, ...simulate(v.id, enabledControls) }));
}

// ── Defense workflow ────────────────────────────────────────────────────────

export const DEFENSE_WORKFLOW = [
  { step: 1, name: 'Inventory the supply chain', job: 'List every surface the agent consumes: pages, skills, tools, memory, inboxes', output: 'Surface register' },
  { step: 2, name: 'Trust-boundary map', job: 'Mark which surfaces are untrusted by default (answer: all of them)', output: 'Trust map' },
  { step: 3, name: 'Capability pinning', job: 'Pin tool IDs and skill versions; ban runtime semantic resolution', output: 'Pinned manifest' },
  { step: 4, name: 'Quarantine & gate', job: 'Tool-less readers for untrusted content; output policy outside the loop', output: 'Enforced boundaries' },
  { step: 5, name: 'Monitor & rehearse', job: 'Alert on anomalous egress; rehearse a poisoned-skill incident quarterly', output: 'Detection + drill log' },
];

// ── Static vs dynamic comparison ────────────────────────────────────────────

export const CHAIN_COMPARISON = [
  { dim: 'Dependency source', traditional: 'Declared manifest, resolved at build', agentic: 'Chosen at runtime by the agent\'s reasoning' },
  { dim: 'Enumerability', traditional: 'Finite, listable', agentic: 'Open-ended, environment-dependent' },
  { dim: 'Verification', traditional: 'Hash/signature of known artifacts', agentic: 'Often none — trust-on-first-use' },
  { dim: 'Attack mode', traditional: 'Binary exploitation of code', agentic: 'Semantic manipulation of context' },
  { dim: 'Blast radius', traditional: 'One application', agentic: 'Agent privileges across every connected system' },
];

// ── Two-phase supply-chain prompt ───────────────────────────────────────────

export const SUPPLY_PHASE1 = `ROLE
Act as an agentic supply-chain security reviewer.

CONTEXT
I will provide an agent setup: which surfaces it reads, which tools/skills it holds, what actions it can take.

TASK — PHASE 1 (ALIGNMENT ONLY — DO NOT RUN THE REVIEW YET)
1. Restate the supply-chain surfaces and privileges you understand the agent to hold.
2. Ask up to 3 clarifying questions: install policy, memory retention, output egress rules.
3. Describe the report schema you will emit (Surface · Vector · Impact · Control · Residual).
STOP. Wait for my explicit reply: "approved".

HARD RULES FOR PHASE 1
- Do NOT emit any risk table.
- Do NOT rank or score anything.
- Inventory surfaces only.`;

export const SUPPLY_PHASE2 = `TASK — PHASE 2 (EXECUTE — runs only after the word "approved")
Emit a supply-chain risk report with exactly these columns:
| Surface | Attack Vector | Impact | Control | Residual Risk |

RULES
- Every surface the agent reads must appear at least once — including ones the team considers "internal".
- Controls must be architectural (provenance, sandbox, binding, quarantine, output gate, monitoring), not "be careful".
- If a control cannot be implemented, state why — unimplemented controls are residual risk, not mitigations.`;
