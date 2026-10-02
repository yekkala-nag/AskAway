// ============================================================================
// CODING-AGENT EVALS ENGINE (evaluate the work)
// Agent≠model, executable contracts, six layers, statistics, open-ended bounds
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const AGENT_SYSTEM = [
  { part: "Model", note: "One component of seven" },
  { part: "Harness + tools + repo context", note: "Often dominates the score" },
  { part: "Instructions + permissions + env", note: "Change any → outcome shifts" },
  { part: "Feedback loop + budgets", note: "Scores measure combo under token/time caps" }
];

export const CONTRACT_CHECKS = [
  { check: "Builds", bars: "Red workspace" },
  { check: "Existing tests pass", bars: "Silent regressions" },
  { check: "Hidden behavior tests pass", bars: "Hard-coded demos" },
  { check: "APIs/formats compatible", bars: "Contract drift" },
  { check: "Migrations bidirectional", bars: "One-way doors" },
  { check: "Perf/resource limits", bars: "Correct but unshippable" },
  { check: "Scope respected", bars: "Auth touched to fix layout; tests deleted to pass" },
  { check: "Static/security clean", bars: "New vulnerabilities" }
];

export const SIX_LAYERS = [
  { layer: "1 · Outcome", asks: "Does the repo satisfy the task?", metric: "Contract pass rate" },
  { layer: "2 · Change quality", asks: "Would we merge it?", metric: "Review rubric (design, scope, hygiene)" },
  { layer: "3 · Trajectory", asks: "How did it get there?", metric: "Wasted steps, recovery shape" },
  { layer: "4 · Intervention", asks: "How much help?", metric: "Hints, rescues, restarts" },
  { layer: "5 · Economics", asks: "Worth the spend?", metric: "$/accepted task" },
  { layer: "6 · Production", asks: "What happened after merge?", metric: "Incidents, reverts, rework" }
];

export const STATISTICS_RULES = [
  { rule: "Distributions, not demos", how: "N runs, fixed budget, report spread" },
  { rule: "Compare with CIs", how: "Overlapping intervals = no claim" },
  { rule: "Budgeted pass rate", how: "Success within $/time cap or it didn't happen" },
  { rule: "Serious-failure frequency", how: "Scope breach, secret leak, data loss — counted, not averaged" }
];

export const OPEN_ENDED = [
  { move: "PO simulator + hidden contract", why: "Ambiguity is part of the task" },
  { move: "Reward useful questions", why: "Never penalize necessary clarification" },
  { move: "Punish confident wrong assumptions", why: "Invented requirements are the failure" },
  { move: "ICAE / Dialogue SWE-Bench", why: "Benchmarks already moving this way" }
];

// ── Simulator: trial statistics → ship/gate ─────────────────────────────────
export const TRIAL_STATS = (runs = 10, p = 0.7, budgetOk = 0.8, serious = 0) => {
  const expected = runs * p;
  const se = Math.sqrt(p * (1 - p) / Math.max(1, runs));
  const lo = Math.max(0, p - 1.96 * se), hi = Math.min(1, p + 1.96 * se);
  const score = p * 0.5 + budgetOk * 0.3 + (serious === 0 ? 0.2 : 0);
  return {
    expectedPasses: +expected.toFixed(1), ci95: [+(lo).toFixed(2), +(hi).toFixed(2)],
    verdict: serious > 0 ? "REBUILD — serious failures veto averages."
      : score >= 0.75 ? "SHIP — distribution supports it."
      : score >= 0.55 ? "GATE — tighten budget/scope, rerun." : "REBUILD — distribution doesn't support it.",
    note: `“How often, within budget, without unacceptable failure?” — not “can it?”`
  };
};

export const PYTHON_CODING_EVAL_CODE = `# ============================================================================
# CODING-AGENT EVALS: executable contracts + six layers + trial stats
# (stop grading agents like chatbots)
# ============================================================================
import math

def contract(repo, task) -> list[str]:
    fails = []
    if not repo.builds(): fails.append("red workspace")
    if not repo.tests_green(): fails.append("regressions")
    if not task.hidden_tests(repo): fails.append("behavior unmet")
    if not repo.apis_compatible(): fails.append("contract drift")
    if repo.scope_breach(task): fails.append("out-of-scope edits")
    if repo.new_security_findings(): fails.append("new vulnerabilities")
    return fails   # empty = acceptable; many valid implementations pass

LAYERS = ["outcome", "change_quality", "trajectory",
          "intervention", "economics", "production_impact"]

def trial_stats(p: float, n: int, serious: int = 0) -> dict:
    se = math.sqrt(p * (1 - p) / max(1, n))
    ci = (round(max(0, p - 1.96 * se), 2), round(min(1, p + 1.96 * se), 2))
    verdict = ("REBUILD" if serious else
               "SHIP" if p >= 0.75 else ("GATE" if p >= 0.55 else "REBUILD"))
    return {"ci95": ci, "verdict": verdict}
`;
