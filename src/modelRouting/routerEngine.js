// ============================================================================
// ADAPTIVE MODEL ROUTING ENGINE (JIT planning + 0-6 scoring)
// Complexity × reasoning × context → fast/balanced/powerful per task
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const ROUTE_STATIC_FAILS = [
  { static: "One flagship for all agents", waste: "Summarizes web searches at pro prices" },
  { static: "Static role assignment", waste: "Breaks when query mix varies by department" },
  { static: "Global upfront planner", waste: "Context-blind, giant prompt, hallucination-prone, pro-priced" }
];

export const SCORE_DIMS = [
  { dim: "Complexity", low: "Retrieval, formatting", mid: "Summarisation, comparison", high: "Multi-step synthesis" },
  { dim: "Reasoning", low: "Direct lookup", mid: "Pattern recognition", high: "Inference, gap analysis" },
  { dim: "Context", low: "< 2k tokens", mid: "2k–6k", high: "> 6k (accumulates downstream!)" }
];

export const TIERS = [
  { tier: "⚡ Fast (mini)", range: "0–2", use: "Retrieval, formatting, scoped planning" },
  { tier: "⚖️ Balanced", range: "3–4", use: "Summaries, comparisons, medium context" },
  { tier: "🔥 Powerful (pro)", range: "5–6", use: "Synthesis, tradeoffs, dense critique" }
];

export const EXPERIMENTS = [
  { q: "Cloud benefits/risks", adap: "$0.05", full: "~$0.96", save: "~94%", why: "Most steps fast/balanced" },
  { q: "Renewables vs fossil", adap: "$0.63", full: "~$0.84", save: "~25%", why: "One 5/6 step (14x jump inside)" },
  { q: "ML reproducibility", adap: "$1.41", full: "~$1.62", save: "~13%", why: "Honestly dense — all powerful, no apology" }
];

// ── Simulator: score a task ─────────────────────────────────────────────────
const PRICES = { fast: 0.0012, balanced: 0.011, powerful: 0.14 };
export const SCORE_TASK = (cx = 0, rs = 1, ctx = 1) => {
  const score = cx + rs + ctx;
  const tier = score <= 2 ? "fast" : score <= 4 ? "balanced" : "powerful";
  const label = tier === "fast" ? "⚡ Fast" : tier === "balanced" ? "⚖️ Balanced" : "🔥 Powerful";
  return {
    score: `${score}/6`, tier: label, estCost: `$${PRICES[tier].toFixed(4)}`,
    read: tier === "powerful" ? "Genuine density — refusing to downgrade IS the quality call."
      : tier === "balanced" ? "Medium weight — synthesis or accumulated context tipped it."
      : "Light work — flagship here would be 100x waste.",
    contextNote: "Context accumulates: Researcher small → Reporter 7–8k. Late agents inherit weight."
  };
};

export const PYTHON_ROUTER_CODE = `# ============================================================================
# ADAPTIVE ROUTER: qualitative LLM grades + deterministic context measure
# (classify cheap, execute right-sized)
# ============================================================================
SCORES = {"low": 0, "medium": 1, "high": 2}
TIERS = {"fast": (0, 2), "balanced": (3, 4), "powerful": (5, 6)}

def context_bucket(token_count: int) -> str:
    if token_count < 2_000: return "small"
    if token_count < 6_000: return "medium"
    return "large"          # accumulated context pushes late agents up

def route_task(complexity: str, reasoning: str, token_count: int) -> str:
    score = (SCORES[complexity] + SCORES[reasoning]
             + SCORES[context_bucket(token_count)])
    for tier, (lo, hi) in TIERS.items():
        if lo <= score <= hi:
            return tier
    return "powerful"       # safe fallback, never silent

# Planner calls stay cheap: scoped mandates are low-complexity by construction.
`;
