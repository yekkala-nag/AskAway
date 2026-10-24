// Agentic software factory — harness → personalization → automation → learning
// Original curriculum synthesis; no third-party attribution in UI copy.

export const HIERARCHY_LAYERS = [
  {
    level: 4,
    id: "learning",
    name: "Continual learning",
    tag: "Layer 4",
    needs: "Runs to inspect + a path to adopt improvements",
    signals: ["Same check failures repeat", "Skills never update after incidents", "Workers ignore new rules"],
    fixes: ["Run ledger + review agent", "Test-then-adopt skills", "Reversible config changes"],
    color: "#C9B8E8"
  },
  {
    level: 3,
    id: "automation",
    name: "Automation",
    tag: "Layer 3",
    needs: "Harness + direction — start work without a fresh prompt each time",
    signals: ["You manually kick every task", "Duplicate workers on same ticket", "No saved queue state"],
    fixes: ["Schedule / event triggers", "Ready-work queue + dedupe", "Time & spend caps"],
    color: "#F0A89A"
  },
  {
    level: 2,
    id: "personalization",
    name: "Personalization",
    tag: "Layer 2",
    needs: "Project context, rules, skills, permissions",
    signals: ["Re-explaining template every session", "Agent edits core business logic unasked", "Tests written for wrong artifact"],
    fixes: ["Rules + references + skills bundle", "Scope when instructions apply", "Sandbox + tool ACLs"],
    color: "#5EC4C8"
  },
  {
    level: 1,
    id: "harness",
    name: "Agent harness",
    tag: "Layer 1",
    needs: "Tools, workspace, execution, actionable feedback",
    signals: ["Cannot run app or read failure logs", "Work stops when laptop sleeps", "Opaque “something failed”"],
    fixes: ["File edit + test + run loop", "Always-on runner (cloud or awake host)", "Rich stderr on check failure"],
    color: "#3A9B9F"
  }
];

export const PRACTICES = [
  { id: "spec", title: "Specification", desc: "Outcome, constraints, and success checks explicit before work starts." },
  { id: "verify", title: "Verification", desc: "Deterministic tests, agent checks, and human judgment — often combined on one result." }
];

export const COORDINATION_MODES = [
  { mode: "Single worker", when: "One background agent; you assess what returns", risk: "Low coordination cost" },
  { mode: "Parallel features", when: "Independent tasks + shared tracker; declare dependencies", risk: "Merge + integration checks required" },
  { mode: "Split roles", when: "Builder + scenario author + reviewer", risk: "Assign who combines & verifies" },
  { mode: "Operate + build", when: "Agent uses live app (e.g. overdue follow-ups) → informs next feature", risk: "Ops context must stay in scope" }
];

/** Score 0–3 per layer from pain signals; returns recommended next investment. */
export const DIAGNOSE_FACTORY = (scores = { harness: 1, personalization: 1, automation: 0, learning: 0 }) => {
  const order = ["harness", "personalization", "automation", "learning"];
  const labels = Object.fromEntries(HIERARCHY_LAYERS.map(l => [l.id, l.name]));
  let weakest = order[0];
  let min = scores[weakest] ?? 0;
  for (const k of order) {
    const v = scores[k] ?? 0;
    if (v < min) { min = v; weakest = k; }
  }
  const blockers = order.filter(k => (scores[k] ?? 0) === 0);
  const maturity = order.reduce((a, k) => a + (scores[k] ?? 0), 0);
  return {
    nextLayer: labels[weakest],
    nextId: weakest,
    maturity: `${maturity}/12`,
    blockers: blockers.map(k => labels[k]),
    advice: min === 0
      ? `Foundation gap: ${labels[weakest]} at 0 — higher layers cannot hold until this is non-zero.`
      : maturity >= 10
        ? "Strong stack — invest in learning loops and coordinated verification, not more prompts."
        : `Raise ${labels[weakest]} first (lowest score); keep specification + verification on every run.`
  };
};

export const PYTHON_FACTORY_TRIGGER = `# Minimal async factory trigger (schedule or webhook)
def pick_ready_task(queue: list[dict]) -> dict | None:
    for t in queue:
        if t["status"] == "ready" and not t.get("claimed"):
            return t
    return None

def run_factory_worker(task: dict, harness, brief_path: str):
    ctx = harness.load_context(brief_path)  # rules, skills, refs
    result = harness.agent.run(task["goal"], context=ctx, budget=task.get("budget"))
    evidence = harness.run_checks(result, task["acceptance"])
    harness.save_run(task["id"], result, evidence)
    return evidence.ok, evidence.blockers
`;
