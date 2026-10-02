// ============================================================================
// AGENTS SDK PATTERNS ENGINE (handoff vs agents-as-tools)
// Triage nurse, transfer_to_* functions, custom handoffs, orchestrator tools
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const WHY_MULTI = [
  { why: "Specialization", detail: "Domain agents + own tools outperform generalists" },
  { why: "Modularity", detail: "Update one agent, not the system" },
  { why: "Traceability", detail: "Per-agent spans beat monolith logs" }
];

export const HANDOFF_FLOW = [
  { step: "Triage examines query", code: "Agent(name='Triage', handoffs=[...])" },
  { step: "LLM sees transfer_to_* functions", code: "Handoffs surface as callable tools" },
  { step: "Control fully transfers", code: "Specialist owns the rest (1,690ms → 7,182ms trace)" },
  { step: "Ambiguous → clarify", code: "No fit, no force — ask" }
];

export const HANDOFF_CUSTOM = [
  { knob: "tool_name/description_override", does: "Clear LLM-visible names vs default transfer_to_X" },
  { knob: "on_handoff callback", does: "Log + UI notice at transfer moment" },
  { knob: "input_type (Pydantic)", does: "Structured reason + lat/lon — no guessing downstream" }
];

export const TOOLS_PATTERN = [
  { step: "Orchestrator retains control", code: "agent.as_tool(name, description)" },
  { step: "Consults one or many", code: "get_weather_update() + get_air_quality_update()" },
  { step: "Combines + concludes", code: "Caution outdoors: poor AQI overrules sunshine" },
  { step: "Custom fix: Runner.run inside @function_tool", code: "Explicit lat/lon — kills coordinate drift" }
];

export const PICK_TABLE = [
  { need: "Single domain, clean transfer", pick: "Handoff", why: "Triage routes, specialist owns" },
  { need: "Multi-domain, one answer", pick: "Agents-as-tools", why: "Orchestrator consults + merges" },
  { need: "Precise inputs downstream", pick: "Custom (either)", why: "Pydantic input_type / explicit args" },
  { need: "Audit every transfer", pick: "Handoff + on_handoff", why: "Transfer moments are logged events" }
];

// ── Simulator: pattern picker ───────────────────────────────────────────────
export const PICK_PATTERN = (domains = 1, combine = false, precise = false, audit = false) => {
  if (domains > 1 || combine) return {
    pattern: "Agents-as-tools (orchestrator)",
    why: "Multiple specialists feed one answer — orchestrator retains control and merges.",
    code: "specialist.as_tool('get_x_update', '...')",
    warn: precise ? "Add custom Runner.run tools with explicit lat/lon — shared 'Jakarta' drifts." : "Watch shared-input drift across agents."
  };
  if (audit || precise) return {
    pattern: "Customized handoff",
    why: "Single transfer with logged, structured, Pydantic-typed context.",
    code: "handoff(agent, tool_name_override=..., on_handoff=..., input_type=HandoffRequest)",
    warn: "Full control transfers — verify the receiver owns the rest."
  };
  return {
    pattern: "Basic handoff",
    why: "Triage nurse routes to one specialist; simplest correct topology.",
    code: "Agent(name='Triage', handoffs=[weather, air_quality])",
    warn: "Ambiguous queries must clarify, never force-route."
  };
};

export const PYTHON_SDK_CODE = `# ============================================================================
# AGENTS SDK: triage handoff + orchestrator tools
# ============================================================================
from agents import Agent, Runner, function_tool, handoff
from pydantic import BaseModel

@function_tool
def get_current_weather(latitude: float, longitude: float) -> dict: ...

weather = Agent(name="Weather Specialist", instructions="...",
                tools=[get_current_weather])
air_quality = Agent(name="Air Quality Specialist", instructions="...", tools=[...])

# --- Pattern 1: handoff (transfer control) ---
triage = Agent(name="Triage Agent", instructions="Route by query content.",
               handoffs=[weather, air_quality])

# --- Pattern 2: agents-as-tools (orchestrator keeps control) ---
orchestrator = Agent(
    name="Orchestrator",
    instructions="Consult specialists; combine into one answer.",
    tools=[weather.as_tool("get_weather_update", "..."),
           air_quality.as_tool("get_air_quality_update", "...")])

# --- Custom: structured handoff input (kills coordinate drift) ---
class HandoffRequest(BaseModel):
    specialist_agent: str; handoff_reason: str
    latitude: float; longitude: float

custom = handoff(agent=weather,
                 tool_name_override="handoff_to_weather_specialist",
                 on_handoff=lambda ctx: print("handing off..."),
                 input_type=HandoffRequest)
`;
