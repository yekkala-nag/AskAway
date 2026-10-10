// ============================================================================
// FUNCTION CALLING BASICS ENGINE — the bridge from data to agent execution
// Schemas, parallel calls, strict mode; OpenAI + Anthropic shapes
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const WHY_BRIDGE = [
  { from: "Data pipelines emit", to: "Agents need callable verbs", bridge: "Typed functions both sides understand" },
  { from: "Prompt wishes", to: "Machine actions", bridge: "JSON schemas the model must satisfy" }
];

export const ANATOMY = [
  { part: "name + description", role: "Lets the model choose correctly", bad: "Vague names → wrong tool picked" },
  { part: "parameters (JSON Schema)", role: "Types, required fields, enums", bad: "Loose schema → invented arguments" },
  { part: "strict / validation", role: "Reject malformed calls pre-execution", bad: "Garbage in, side effects out" },
  { part: "parallel calls", role: "Independent calls in one turn", bad: "Serial latency for free" }
];

export const PROVIDER_SHAPES = [
  { provider: "OpenAI", shape: "tools: [{type:'function', function:{name, description, parameters, strict}}]", note: "parallel_tool_calls; tool_choice control" },
  { provider: "Anthropic", shape: "tools: [{name, description, input_schema}], tool_use blocks", note: "Same contract, different envelope" }
];

export const FAILURE_MODES = [
  { fail: "Hallucinated arguments", fix: "Required fields + enums + server-side revalidation" },
  { fail: "Wrong tool picked", fix: "Crisp names/descriptions; fewer, distinct tools" },
  { fail: "Unbounded side effects", fix: "Read-only first; idempotency keys on writes" }
];

// ── Simulator: build + validate a call ──────────────────────────────────────
const TASKS = {
  weather: {
    label: "Get weather for a city",
    schema: { name: "get_weather", required: ["latitude", "longitude"], optional: ["units"] },
    good: { latitude: 35.68, longitude: 139.69, units: "celsius" },
    bad: { latitude: "Tokyo" },
    whyBad: "latitude must be a number — 'Tokyo' needs geocoding first (separate tool)."
  },
  refund: {
    label: "Look up refund policy",
    schema: { name: "policy_lookup", required: ["policy_id"], optional: ["version"] },
    good: { policy_id: "PX-1" },
    bad: {},
    whyBad: "Missing required policy_id — the call cannot execute."
  },
  escalate: {
    label: "Escalate a ticket",
    schema: { name: "escalate", required: ["ticket_id", "severity"], optional: ["note"] },
    good: { ticket_id: "T-441", severity: "high" },
    bad: { ticket_id: "T-441", severity: "urgent-ish" },
    whyBad: "severity must be an enum [low, high] — free text breaks routing."
  }
};

export const TASK_IDS = Object.keys(TASKS);

export const BUILD_CALL = (taskId = "weather", useGood = true) => {
  const t = TASKS[taskId];
  const args = useGood ? t.good : t.bad;
  const missing = t.schema.required.filter(k => !(k in args));
  const verdict = missing.length === 0 ? "VALID — executes" : `INVALID — missing: ${missing.join(", ")}`;
  return {
    task: t.label, fn: t.schema.name,
    schema: `required: [${t.schema.required.join(", ")}]${t.schema.optional.length ? ` · optional: [${t.schema.optional.join(", ")}]` : ""}`,
    args: JSON.stringify(args),
    verdict,
    explain: missing.length === 0 ? "Schema satisfied — model output becomes machine action." : t.whyBad
  };
};

export const PYTHON_TOOLS_CODE = `# ============================================================================
# FUNCTION CALLING: schema-first tools, validated before execution
# ============================================================================
WEATHER_FN = {
    "name": "get_weather",
    "description": "Current weather for coordinates.",
    "parameters": {"type": "object",
                   "properties": {"latitude": {"type": "number"},
                                  "longitude": {"type": "number"},
                                  "units": {"type": "string", "enum": ["celsius"]}},
                   "required": ["latitude", "longitude"]},
}

def validate_call(schema: dict, args: dict) -> list[str]:
    missing = [k for k in schema.get("required", []) if k not in args]
    return [f"missing: {m}" for m in missing]   # never execute invalid calls

# Anthropic: same contract, input_schema envelope + tool_use blocks.
# Writes need idempotency keys; reads stay read-only.
`;

// ── Cross-link: when prompting is not enough ────────────────────────────────
export const SCHEMA_BRIDGE_WEIGHTS_CARD = {
  id: "schema-bridge-needs-weights",
  title: "When the schema bridge needs weights",
  signs: ["persistent chatty wrappers", "near-miss tool choice"],
  message: "Prompting is not enough when wrappers persist or the model keeps near-missing the right tool — fine-tune behaviour at the weight level.",
  fineTuneTabName: "Model Fine-Tuning, LoRA & QLoRA: End-to-End Architecture"
};

// ── First Agent Loop: request → validate → execute → respond ────────────────
export const AGENT_LOOP_STAGES = [
  { id: "request", label: "Request", detail: "Model emits a tool call with arguments." },
  { id: "validate", label: "Validate", detail: "Schema check rejects malformed calls pre-execution." },
  { id: "execute", label: "Execute", detail: "Run the tool and capture the observation." },
  { id: "respond", label: "Respond", detail: "Model reads the result and answers or loops again." }
];

export const AGENT_LOOP_MODES = [
  { mode: "single-tool", detail: "One request → validate → execute → respond pass solves the task." },
  { mode: "loop-until-done", detail: "Repeat the cycle until done or the iteration cap stops the run." }
];

export const AGENT_LOOP_MEMORY = [
  { strategy: "trim", constraint: "Drop oldest turns to fit the window; keeps recent context." },
  { strategy: "summarize", constraint: "Compress history into a short recap; keeps gist, loses detail." },
  { strategy: "persist", constraint: "Write key facts to durable store; survives across sessions." }
];

export const AGENT_LOOP_FAILURES = [
  { failure: "no tool requested", triage: "Reprompt with tool list; check tool_choice is not forced off." },
  { failure: "wrong args", triage: "Tighten schema enums and required fields; revalidate before execute." },
  { failure: "misread result", triage: "Feed the observation back verbatim and ask for a grounded answer." }
];

export const RUN_AGENT_LOOP = (neededSteps = 3, cap = 5) => {
  const need = Math.max(0, Math.floor(neededSteps));
  const limit = Math.max(0, Math.floor(cap));
  const stepsTaken = Math.min(need, limit);
  const completed = need <= limit;
  const transcript = [];
  for (let i = 1; i <= stepsTaken; i++) {
    transcript.push(`iteration ${i}: request → validate → execute → respond`);
  }
  return {
    needed: need,
    cap: limit,
    stepsTaken,
    completed,
    fallback: completed ? null : "stopped after max iterations",
    transcript,
    lesson: completed ? "Loop finished within cap." : "Cap stops runaway loops — return a safe fallback."
  };
};
