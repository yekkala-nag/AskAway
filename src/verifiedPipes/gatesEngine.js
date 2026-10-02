// ============================================================================
// VERIFIED PIPELINES ENGINE (review vs pipeline)
// PRs 2x, bugs +54%, incidents/PR +243%; policy-as-code over theater review
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const BREAKDOWN_STATS = [
  { stat: "PR volume", value: "+98%", note: "90% of devs use AI; merges nearly doubled (DORA 2026)" },
  { stat: "Bugs per developer", value: "+54%", note: "Faster creation, degraded overall performance" },
  { stat: "Incidents per PR", value: "+243%", note: "10k-developer analysis — review didn't scale" },
  { stat: "40k-line agent PRs", value: "unreviewable", note: "Reviewer absent from the reasoning that produced it" }
];

export const WHY_REVIEW_FAILS = [
  { belief: "Add more reviewers", fails: "Volume 2x vs humans constant — queue grows forever" },
  { belief: "AI reviews AI", fails: "Same training data, same blind spots — correlated failure" },
  { belief: "Skim the diff", fails: "Theater: 40k lines can't be held in a head that wasn't there" }
];

export const PIPELINE_GATES = [
  { gate: "Tests + types", catches: "Behavior + contract breaks, author-agnostic" },
  { gate: "Policy-as-code", catches: "Deploy rules (provenance, budgets, scopes) as executable checks" },
  { gate: "Provenance + evals", catches: "Who/what wrote it + golden-set status per change" },
  { gate: "Humans on exceptions", catches: "Judgment where rules end — intent, product calls" }
];

export const WHERE_REVIEW_EARNS_KEEP = [
  "Intent: does this change match what we meant?",
  "Product judgment: should this ship to users now?",
  "Novel failure shapes the pipeline hasn't codified yet"
];

// ── Simulator: escaped-bug economics ────────────────────────────────────────
export const ESCAPE_MODEL = (prsPerWeek = 100, reviewCover = 30, gateStrict = 70) => {
  const reviewed = prsPerWeek * reviewCover / 100;
  const gated = prsPerWeek * gateStrict / 100;
  // review catches ~40% of what it sees (theater-discounted); gates ~85%
  const escaped = Math.round(prsPerWeek - reviewed * 0.4 - gated * 0.85);
  const incidents = +(escaped * 0.12).toFixed(1);
  return {
    escapedPerWeek: Math.max(0, escaped), incidentsPerWeek: incidents,
    verdict: gateStrict >= 70 ? "Pipeline carries quality — review handles exceptions."
      : reviewCover >= 80 ? "Burning reviewers to stand still — shift to gates."
      : "Both weak — bugs compound into incidents. Gates first, it's cheaper.",
    note: "AI-reviewing-AI not modeled: correlated miss rate makes it review-theater with GPUs."
  };
};

export const PYTHON_GATES_CODE = `# ============================================================================
# VERIFIED PIPELINE: policy-as-code gates
# ============================================================================
def gate(pr: dict) -> list[str]:
    blocks = []
    if not pr.get("tests_pass"): blocks.append("tests red")
    if pr.get("lines", 0) > 2000 and not pr.get("staged_rollout"):
        blocks.append("large change needs staged rollout")
    if pr.get("touches_prod_scope") and not pr.get("human_exception_ok"):
        blocks.append("prod scope needs human exception review")
    if not pr.get("provenance"): blocks.append("no provenance (who/what wrote it)")
    return blocks   # empty = ship; humans handle ONLY the exceptions

def review_worth_it(pr: dict) -> bool:
    # Review earns keep on intent/product/novelty — never on volume.
    return pr.get("novel_shape") or pr.get("product_judgment_needed", False)
`;
