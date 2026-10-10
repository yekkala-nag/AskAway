// ============================================================================
// AGENT FRAMEWORK DECISION ENGINE (generic styles, no vendor names)
// Pure functions only. Node-importable. No JSX.
// Node-0 gate + 3 decision nodes -> 1 of 5 generic styles.
// ============================================================================

export const TEAL = "#3A9B9F";
export const TEAL_DARK = "#1A6B6E";
export const PURPLE = "#5B4B8A";
export const RED = "#B4553A";
export const AMBER = "#B9821F";

// Four triggers that mean a task needs multiple cooperating agents.
export const GATE_TRIGGERS = [
  {
    id: "context-overflow",
    label: "Context fills before the task ends",
    description: "A single run accumulates so much history that earlier instructions get squeezed out before the work finishes."
  },
  {
    id: "parallel-subtasks",
    label: "Parallel independent subtasks",
    description: "The work splits into pieces that can proceed at the same time without waiting on each other."
  },
  {
    id: "divergent-prompts",
    label: "Radically different prompts or tools",
    description: "Subtasks need sharply different instructions, skills, or tool access that fight each other in one prompt."
  },
  {
    id: "separate-critic",
    label: "Separate critic or verifier",
    description: "Quality demands an independent checker that reviews, challenges, or scores the producer's output."
  }
];

// Three decision nodes answered after the gate passes.
export const DECISION_NODES = [
  {
    id: "mental-model",
    label: "Mental model",
    question: "How does your team naturally sketch this workflow?",
    options: [
      { value: "states", label: "States and transitions", hint: "Boxes with arrows, retries, pauses, resume points." },
      { value: "team", label: "Team with roles", hint: "Specialists handing work to each other." },
      { value: "debate", label: "Discussion and consensus", hint: "Agents argue, critique, then converge." }
    ]
  },
  {
    id: "durability",
    label: "Durability",
    question: "What happens when a run is interrupted?",
    options: [
      { value: "ephemeral", label: "Discard and retry", hint: "Short runs where restarting is cheap." },
      { value: "resumable", label: "Pause and resume", hint: "Long runs needing checkpoints or human approval." }
    ]
  },
  {
    id: "ecosystem",
    label: "Ecosystem",
    question: "Which implementation constraint matters most?",
    options: [
      { value: "typed-python", label: "Schema-validated Python objects", hint: "Strict types and contracts at every boundary." },
      { value: "minimal-deps", label: "Smallest dependency footprint", hint: "Fewest libraries, closest to the native SDK." },
      { value: "flexible", label: "No strong constraint", hint: "Pick whatever fits the mental model best." }
    ]
  }
];

// Five generic coordination styles.
export const STYLE_MATRIX = [
  {
    id: "state-machine",
    name: "State Machine",
    strength: "Explicit states, transitions, retries, and checkpoints make long flows resumable.",
    limitation: "More upfront modeling; simple tasks feel over-engineered.",
    bestFor: "Long-lived workflows with pauses, approvals, or failure recovery.",
    bestFit: "Durable runs your team draws as boxes and arrows.",
    watchOut: "Do not model trivial two-step tasks as graphs; keep node count small.",
    color: TEAL
  },
  {
    id: "role-based-org-chart",
    name: "Role-Based Org Chart",
    strength: "Clear specialist roles with handoffs scale to parallel subtasks cleanly.",
    limitation: "Handoff contracts need maintenance as roles multiply.",
    bestFor: "Decomposable work with distinct skills per subtask.",
    bestFit: "Teams that already assign owners per workstream.",
    watchOut: "Cap the roster; every extra role multiplies prompt and token overhead.",
    color: PURPLE
  },
  {
    id: "conversational-debate",
    name: "Conversational Debate",
    strength: "Independent viewpoints surface flaws a single pass would miss.",
    limitation: "Highest token cost; needs a clear stopping rule or it loops.",
    bestFor: "Open-ended quality judgments needing critique and consensus.",
    bestFit: "Tasks where being wrong is costlier than spending tokens.",
    watchOut: "Always set rounds and a judge rule; unbounded debate never converges.",
    color: AMBER
  },
  {
    id: "type-safe-python",
    name: "Type-Safe Python",
    strength: "Validated schemas catch malformed tool calls before they cascade.",
    limitation: "Schema design time; rigid when outputs are genuinely free-form.",
    bestFor: "Tool-heavy pipelines where contracts prevent silent corruption.",
    bestFit: "Python shops that want compiler-grade guarantees at runtime.",
    watchOut: "Do not wrap every string in a model; validate at boundaries only.",
    color: TEAL_DARK
  },
  {
    id: "minimal-native-sdk",
    name: "Minimal Native SDK",
    strength: "Fewest abstractions; full control and smallest install surface.",
    limitation: "You hand-roll retries, state, and observability yourself.",
    bestFor: "Single-agent tasks or prototypes that must stay lean.",
    bestFit: "Small scripts where a framework would outweigh the task.",
    watchOut: "Set an iteration cap and log tool calls from day one.",
    color: RED
  }
];

// Parallel crews multiply token spend: each extra agent re-reads shared context.
export const TOKEN_MULTIPLIER_PARALLEL_CREW = 4;

export function getStyleById(styleId) {
  return STYLE_MATRIX.find(function (s) { return s.id === styleId; }) || null;
}

export function listStyleIds() {
  return STYLE_MATRIX.map(function (s) { return s.id; });
}

// Gate: pass an array of triggered trigger ids, or an object map id -> boolean.
export function evaluateGate(triggered) {
  var active = [];
  if (Array.isArray(triggered)) {
    active = triggered.filter(function (id) {
      return GATE_TRIGGERS.some(function (t) { return t.id === id; });
    });
  } else if (triggered && typeof triggered === "object") {
    active = GATE_TRIGGERS.filter(function (t) { return triggered[t.id] === true; }).map(function (t) { return t.id; });
  }
  var unique = Array.from(new Set(active));
  return {
    triggered: unique,
    triggeredCount: unique.length,
    needsMultiAgent: unique.length > 0,
    guidance: unique.length > 0
      ? "Multi-agent justified: " + unique.length + " of 4 gate trigger(s) fired."
      : "No gate trigger fired: start single-agent and split only on evidence."
  };
}

// Cost model: a parallel crew of N agents re-processes shared context,
// so total tokens scale ~linearly with crew size. Default crew of 4 ~= 4x.
export function estimateTokenCost(baseTokens, agentCount) {
  var base = Number(baseTokens);
  if (!isFinite(base) || base < 0) base = 0;
  var count = agentCount === undefined ? TOKEN_MULTIPLIER_PARALLEL_CREW : Number(agentCount);
  if (!isFinite(count) || count < 1) count = 1;
  count = Math.floor(count);
  var totalTokens = base * count;
  return {
    baseTokens: base,
    agentCount: count,
    multiplier: count,
    totalTokens: totalTokens,
    overheadVsSingle: totalTokens - base
  };
}

// Map the 3 decision nodes to one of the 5 generic styles.
export function recommendStyle(answers) {
  var a = answers || {};
  var mentalModel = a.mentalModel || a.mental_model || "states";
  var durability = a.durability || "ephemeral";
  var ecosystem = a.ecosystem || "flexible";

  var styleId = "state-machine";
  var rationale = "";

  if (mentalModel === "debate") {
    styleId = "conversational-debate";
    rationale = "Discussion-first mental model selects conversational debate; add a judge and round limit.";
  } else if (ecosystem === "minimal-deps") {
    styleId = "minimal-native-sdk";
    rationale = "Smallest-footprint constraint selects the minimal native-SDK style; hand-roll caps and logs.";
  } else if (ecosystem === "typed-python") {
    styleId = "type-safe-python";
    rationale = "Schema-validated Python constraint selects the type-safe style; validate at boundaries.";
  } else if (mentalModel === "team") {
    styleId = "role-based-org-chart";
    rationale = "Team-with-roles mental model selects the role-based org chart; keep handoff contracts tight.";
  } else if (durability === "resumable") {
    styleId = "state-machine";
    rationale = "Pause-and-resume durability selects the state machine; checkpoint every transition.";
  } else {
    styleId = "state-machine";
    rationale = "Default for explicit flows without stronger constraints; keep the graph small.";
  }

  var style = getStyleById(styleId);
  return {
    styleId: style.id,
    styleName: style.name,
    rationale: rationale,
    bestFit: style.bestFit,
    watchOut: style.watchOut,
    inputs: { mentalModel: mentalModel, durability: durability, ecosystem: ecosystem }
  };
}

// Full route: gate first, then style nodes.
export function decideRoute(gateInput, styleAnswers) {
  var gate = evaluateGate(gateInput);
  if (!gate.needsMultiAgent) {
    var lean = getStyleById("minimal-native-sdk");
    return {
      route: "single-agent",
      gate: gate,
      recommendation: {
        styleId: lean.id,
        styleName: lean.name,
        rationale: "No multi-agent trigger fired, so stay single-agent with the minimal style.",
        bestFit: lean.bestFit,
        watchOut: lean.watchOut,
        inputs: styleAnswers || {}
      }
    };
  }
  return {
    route: "multi-agent",
    gate: gate,
    recommendation: recommendStyle(styleAnswers)
  };
}
