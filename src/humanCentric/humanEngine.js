// ============================================================================
// HUMAN-CENTRIC AI ENGINE (do-no-harm manifesto)
// Compartmentalization, user-centric limits, non-voluntary exposure,
// FAccT critique, compliance-insufficient, VSD, concentric rollout
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const BLIND_SPOTS = [
  { spot: "Compartmentalization", detail: "Metric teams optimize engagement; context (24h watching?) lives elsewhere", ex: "Perfect model, undesirable world" },
  { spot: "Satisfaction ≠ good", detail: "Smokers love cigarettes; filter bubbles please while pigeon-holing", ex: "Conspiracy rabbit holes, high NPS" },
  { spot: "Non-voluntary exposure", detail: "Ad targets, HR screens, mortgage AI — no opt-out, no comprehension", ex: "Mother vs power-user: same feed, different agency" }
];

export const VALUES_CRITIQUE = [
  { claim: "FAccT suffices", pushback: "Transparency taxes attention; autonomy may matter more" },
  { claim: "Compliance suffices", pushback: "Law trails harm (Cambridge Analytica→GDPR); cookie rules burden citizens" },
  { claim: "User studies suffice", pushback: "They miss non-users and long-horizon character effects" }
];

export const VSD_PILLARS = [
  { pillar: "Stakeholder ethnography", does: "Learn what values are actually at stake, in situ" },
  { pillar: "Values in metrics", does: "Optimize what society needs, not just clicks" },
  { pillar: "Shared responsibility", does: "Owner → engineer: pareto no-harm is everyone's job" }
];

export const CONCENTRIC_AXES = [
  { axis: "Decision support → automation", rule: "Earn automation with evidence, never start there" },
  { axis: "Internal → customer", rule: "Affect yourselves before affecting others" }
];

// ── Simulator: rollout positioner ───────────────────────────────────────────
export const ROLLOUT_GATE = (auto = 1, external = 1) => {
  // auto: 0 advise … 3 auto-decide · external: 0 internal … 3 customers
  const risk = auto + external;
  return {
    risk: `${risk}/6`,
    zone: risk <= 1 ? "GREEN — proceed with logging" : risk <= 3 ? "AMBER — human review + evals required" : "RED — halt: evidence, ethics review, staged rollout only",
    controls: risk <= 1 ? ["Decision logs", "User feedback channel"]
      : risk <= 3 ? ["Pre-decision human gate", "Bias + character-effect evals", "Override tracking"]
      : ["Independent ethics review", "Staged internal-first pilot", "Kill-switch + incident plan", "Value-sensitive redesign"],
    note: "Compliance is the floor. The ceiling is: would we defend this in ten years?"
  };
};

export const PYTHON_HUMAN_CODE = `# ============================================================================
# CONCENTRIC ROLLOUT GATE: support->automation x internal->customer
# (compliance is the floor, not the ceiling)
# ============================================================================
def rollout_zone(autonomy: int, external: int) -> dict:
    # autonomy 0=advise..3=auto-decide | external 0=internal..3=customers
    risk = autonomy + external
    zone = ("GREEN" if risk <= 1 else
            "AMBER — human gate + evals" if risk <= 3 else
            "RED — halt for ethics review + staged pilot")
    return {"risk": f"{risk}/6", "zone": zone}

def ship_checklist() -> list[str]:
    return ["values named in the spec",
            "non-user exposure mapped",
            "bias + character effects evaluated",
            "override path a real human monitors",
            "ten-year defense written down"]
`;
