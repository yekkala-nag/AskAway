// ============================================================================
// VALIDITY LAYER ENGINE (context vs state)
// ACTIVE/STALE/SUPERSEDED/UNKNOWN + baseline vs validity-aware executors
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const VALIDITY_STATES = [
  { state: "ACTIVE", means: "Current evidence supports it — act", color: "#3A9B9F" },
  { state: "STALE", means: "Once true, newer data exists — verify (1 step)", color: "#F5A623" },
  { state: "SUPERSEDED", means: "Replaced outright — replan now, zero execution", color: "#ef4444" },
  { state: "UNKNOWN", means: "Insufficient evidence — verify, don't fail", color: "#3A9B9F" }
];

export const INVALIDITY_TYPES = [
  { type: "Factual invalidity", example: "Flight $420 → $610. Statement false.", check: "Re-read the fact" },
  { type: "Operational invalidity", example: "10,000 records true — but DB offline. True yet useless.", check: "Check the dependency, not the fact" }
];

export const EXPERIMENT_TABLE = [
  { exp: "A · Value change", tests: "Early vs late detection", base: "9 steps, 2 doomed", aware: "6 steps, 0 doomed" },
  { exp: "D1/D2 · 96 configs", tests: "Does shape drive waste?", base: "PFW = closure − 1, always", aware: "PFW = 0, always" },
  { exp: "D3 · Isolation", tests: "Plan 8→50 nodes, one fault", base: "7 doomed, flat", aware: "0 doomed throughout" },
  { exp: "E1/E2 · Check cost", tests: "Real change vs false alarm", base: "7 / 3 steps", aware: "6+verify / 4+verify" },
  { exp: "Budget sweep", tests: "Who finishes when tight?", base: "Fails at 8, 7, 6", aware: "Completes 8, 7, 6" }
];

export const WHEN_TO_BUILD = [
  { use: "Multi-step plans with costly acts (tools, spend, side effects)", verdict: "Build it" },
  { use: "Long sessions (minutes→hours between learn and use)", verdict: "Build it" },
  { use: "Hard budgets (tokens, latency, calls)", verdict: "Build it — waste becomes failure" },
  { use: "Single-shot / cheap-retry / static lookups", verdict: "Skip — finding out late costs nothing" }
];

// ── Simulator: flight-price run under a step budget ─────────────────────────
export const RUN_VALIDITY = (faultAt = 1, budget = 8) => {
  const doomed = Math.max(0, 4 - faultAt);        // steps walked dead before failure
  const base = 5 + doomed + 2;                     // path + doomed + recovery
  const aware = 5 + 1;                             // path + one verification
  return {
    faultAt, budget,
    baseline: { steps: base, doomed, completes: base <= budget },
    aware: { steps: aware, doomed: 0, completes: aware <= budget },
    law: "Baseline PFW = unexecuted closure steps at fault time; aware PFW = 0",
    lesson: base <= budget ? "Slack hides the gap — tighten the budget to see it."
      : aware <= budget ? "Same task, tight budget: validity decides completion, not cost."
      : "Budget starves both — validity can't print steps."
  };
};

export const PYTHON_VALIDITY_CODE = `# ============================================================================
# VALIDITY LAYER: states + two deterministic executors
# Presence is not validity. Check before acting, not after failing.
# ============================================================================
from enum import Enum

class ValidityState(Enum):
    ACTIVE = "ACTIVE"          # act
    STALE = "STALE"            # verify (1 step), then act-or-replan
    SUPERSEDED = "SUPERSEDED"  # replan immediately, zero execution
    UNKNOWN = "UNKNOWN"        # verify, never hard-fail on doubt

def baseline_run(plan: list, world, budget: int) -> dict:
    steps, doomed, i = 0, 0, 0
    broken = world.fault_step               # unknown to the executor
    while i < len(plan) and steps < budget:
        if i >= broken:                     # walking dead, finds out at act time
            doomed += 1
            if world.act(plan[i]) == "FAIL":
                i = world.replan_from(i)    # recovery costs full price
                continue
        steps += 1; i += 1
    return {"steps": steps, "pre_failure_work": doomed, "done": i >= len(plan)}

def validity_run(plan: list, world, budget: int) -> dict:
    steps, i = 0, 0
    while i < len(plan) and steps < budget:
        st = world.validity(plan[i].requires)     # check BEFORE acting
        if st == ValidityState.SUPERSEDED:
            i = world.replan_from(i); steps += 1; continue
        if st in (ValidityState.STALE, ValidityState.UNKNOWN):
            steps += 1                            # verification step
            if not world.verify(plan[i].requires):
                i = world.replan_from(i); steps += 1; continue
        world.act(plan[i]); steps += 1; i += 1
    return {"steps": steps, "pre_failure_work": 0, "done": i >= len(plan)}
`;
