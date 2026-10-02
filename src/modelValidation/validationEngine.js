// ============================================================================
// MODEL VALIDATION PLAYBOOK ENGINE (SR 11-7 for GenAI)
// Three pillars, five breaks, tiering, dimensions, judge-the-judge, monitoring
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const THREE_PILLARS = [
  { pillar: "Conceptual soundness", asks: "Is the approach defensible?", genai: "Component map + should-it-be-LLM challenge + customization justifications" },
  { pillar: "Outcomes analysis", asks: "Does output hold up when tested?", genai: "Task-mapped dimensions, robustness perturbations, failure clustering" },
  { pillar: "Ongoing monitoring", asks: "Still working now?", genai: "Drift/tone/query/retrieval/feedback/override indicators + breach actions" }
];

export const FIVE_BREAKS = [
  { property: "No model — a system", why: "Retrieval, prompt, base, decoding, guardrails, orchestration: change one, behavior shifts", consequence: "Unit of validation = system × use case" },
  { property: "Output is a distribution", why: "Non-determinism by design; batching/context vary even at temp 0", consequence: "95% right + 5% confidently wrong ≠ 5% error rate" },
  { property: "No ground truth", why: "AUC/KS/MSE need observable targets; drafting has none", consequence: "Craft shifts replication → test design" },
  { property: "Vendor core component", why: "No training data, no method doc, system card + unrelated benchmarks", consequence: "Challenge boundaries, not internals" },
  { property: "Silent version drift", why: "Hosted models update behind stable endpoints; no change request fires", consequence: "Monitor for upstream change continuously" }
];

export const TIER_TABLE = [
  { tier: "Low", exposure: "Internal decision aid, human reads", acts: "Text only", evidence: "Light: dimensions sample + logs", monitor: "Quarterly" },
  { tier: "Medium", exposure: "Internal, material decisions", acts: "Text + limited tools", evidence: "Full dimensions + robustness + judge validation", monitor: "Monthly" },
  { tier: "High", exposure: "Customer/regulator-facing or acts on systems", acts: "Writes, triggers, transacts", evidence: "All above + adversarial sets + second-line sign-off", monitor: "Continuous + breach plan" }
];

export const COMPONENT_MAP = [
  { comp: "Retrieval + index", controls: "You", breaks: "Stale/missing evidence; over-broad access" },
  { comp: "Prompt template", controls: "You", breaks: "Ambiguity; injection exposure" },
  { comp: "Base model", controls: "Vendor", breaks: "Everything (least inspectable)" },
  { comp: "Decoding settings", controls: "You", breaks: "Dispersion — changing them IS a model change" },
  { comp: "Guardrails", controls: "You", breaks: "Over- and under-blocking" },
  { comp: "Orchestration", controls: "You", breaks: "Compounding multi-step errors" }
];

export const DIMENSION_SETS = [
  { set: "Correctness & grounding", dims: "Truthfulness · hallucination rate · groundedness · completeness · relevance", trap: "Grounded ≠ true (stale source); true ≠ usable (unverifiable)" },
  { set: "Compliance & expression", dims: "Instruction following · format · verbosity · quality · refusal · bias · stability", trap: "Never collapse to one quality score" }
];

export const ROBUSTNESS_TESTS = [
  { perturb: "Source text", how: "Synonyms, typos, reformat", star: "Evidence reorder — answer must not move" },
  { perturb: "Query phrasing", how: "Same question three ways", star: "Paraphrase stability" },
  { perturb: "Evidence set", how: "Reorder, inject irrelevant, drop one", star: "Reorder is the highest-value test" }
];

export const JUDGE_TESTS = [
  { test: "Human agreement", why: "Error-bounded proof the scorer measures the right thing" },
  { test: "Position/order bias", why: "Judges favor first/last options" },
  { test: "Verbosity bias", why: "Longer scores higher regardless" },
  { test: "Self-preference", why: "Judges favor their own model family" },
  { test: "Recalibration", why: "Judges drift too — revalidate periodically" }
];

export const MONITOR_INDICATORS = [
  { ind: "Fabrication + tone (sampled)", catches: "Drift incl. silent upstream version change" },
  { ind: "Query-pattern stability", catches: "Users drifting outside approved use" },
  { ind: "Retrieval quality", catches: "Index staleness / corpus change" },
  { ind: "User feedback + override rate", catches: "Control health — falling overrides ≠ improvement" }
];

// ── Simulator: tier calculator ──────────────────────────────────────────────
export const CALC_TIER = (exposure = "customer", acts = true, material = true) => {
  let score = (exposure === "customer" ? 3 : exposure === "material-internal" ? 2 : 0)
    + (acts ? 3 : 0) + (material ? 1 : 0);
  const tier = score >= 5 ? "High" : score >= 3 ? "Medium" : "Low";
  const row = TIER_TABLE.find(t => t.tier === tier);
  return {
    tier, score,
    evidence: row.evidence, monitor: row.monitor,
    first: tier === "High" ? "Adversarial case sets + second-line sign-off before any launch."
      : tier === "Medium" ? "Dimension battery + robustness + validated judge."
      : "Sampled dimensions + logging. No 100-page report for low materiality.",
    warning: "No model is absolutely valid — suitable for a purpose under conditions, nothing more."
  };
};

export const PYTHON_VALIDATION_CODE = `# ============================================================================
# GENAI VALIDATION PLAYBOOK: tier -> evidence bar -> dimension battery
# (SR 11-7 pillars adapted: soundness / outcomes / monitoring)
# ============================================================================
def risk_tier(exposure: str, acts: bool, material: bool) -> str:
    s = {"internal": 0, "material-internal": 2, "customer": 3}[exposure]
    s += (3 if acts else 0) + (1 if material else 0)
    return "High" if s >= 5 else ("Medium" if s >= 3 else "Low")

DIMENSIONS = {
    "correctness": ["truthfulness", "hallucination_rate", "groundedness",
                    "completeness", "relevance"],
    "compliance": ["instruction_following", "format", "verbosity",
                   "quality", "refusal", "bias", "stability"],
}

def validate_judge(judge, human_labels) -> dict:
    return {
        "agreement": judge.agreement(human_labels),   # error-bounded proof
        "position_bias": judge.swap_test(),           # first/last favoritism
        "verbosity_bias": judge.length_test(),
        "self_preference": judge.family_test(),       # own-model favoritism
    }  # unvalidated scorer moves risk, never reduces it

def robustness_suite(case) -> dict:
    return {
        "paraphrase": run(case.rephrase(3)),
        "evidence_reorder": run(case.reorder()),   # must not move the answer
        "noise_inject": run(case.typos().add_irrelevant()),
    }
`;
