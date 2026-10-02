// ============================================================================
// VIBE-CODE ECONOMICS ENGINE (Ukuflow $52/day)
// Unit economics, minimum viable offer, static-first correction
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const UNIT_CASE = [
  { line: "Build cost", value: "$0 (Gemini free credits)", note: "Development was free — the trap" },
  { line: "Run cost (1 day, ~200 users)", value: "$52 (agent per search)", note: "Running compounds; building doesn't" },
  { line: "Revenue ceiling (~200 visits)", value: "~$4 (ads $10–20/1k)", note: "Unit economics fail at -$48/day" },
  { line: "Annualized bleed", value: "~$17k/yr", note: "Unless upsell appears" }
];

export const FAILURE_MODES = [
  { mode: "Overkill solution", detail: "Live AI agent per search for a lookup problem", fix: "Static pages of popular songs" },
  { mode: "Shrinking market", detail: "Only beginners need it; beginners play ~12 known songs", fix: "Serve the dozen, not the internet" },
  { mode: "Untested assumption", detail: "Never validated karaoke-scroll desire with one page", fix: "Minimum viable offer first" }
];

export const VIBE_DISCIPLINE = [
  { rule: "Test the critical assumption", how: "One song page before any agent", kills: "Building for nobody" },
  { rule: "Static-first, agent-last", how: "Precompute what doesn't change", kills: "$52/day whistles" },
  { rule: "Unit economics on day one", how: "Cost/visit vs revenue/visit before scaling", kills: "$17k/yr surprises" },
  { rule: "Ideas cheap, planning isn't", how: "Agile iteration + user listening", kills: "Two-hour triumphs, next-day regrets" }
];

// ── Simulator: daily P&L ────────────────────────────────────────────────────
export const DAILY_PNL = (visitors = 200, searchesEach = 1.5, costPerSearch = 0.17, revPer1k = 15) => {
  const cost = visitors * searchesEach * costPerSearch;
  const rev = (visitors / 1000) * revPer1k;
  const net = rev - cost;
  return {
    cost: +cost.toFixed(2), rev: +rev.toFixed(2), net: +net.toFixed(2),
    verdict: net >= 0 ? "Viable — scale carefully, watch cost/search drift."
      : "KILL OR STATIC-FIRST — each visitor loses money; volume makes it worse.",
    staticAlt: `Static pages: ~$${(rev).toFixed(2)} revenue at ~$0 run cost. Same beginners served.`
  };
};

export const PYTHON_VIBE_CODE = `# ============================================================================
# VIBE-CODE GATE: unit economics + MVP-offer check before scaling agents
# ============================================================================
def daily_pnl(visitors: int, searches_each: float, cost_per_search: float,
              rev_per_1k: float) -> dict:
    cost = visitors * searches_each * cost_per_search
    rev = visitors / 1000 * rev_per_1k
    return {"cost": round(cost, 2), "revenue": round(rev, 2),
            "net": round(rev - cost, 2),
            "verdict": "SCALE" if rev >= cost else "KILL-OR-STATIC-FIRST"}

def mvp_offer(question: str) -> str:
    # One page testing the critical assumption — before any agent exists.
    return f"Ship ONE page answering: {question}. Measure. Then decide."

if __name__ == "__main__":
    print(daily_pnl(200, 1.5, 0.17, 15))   # the $52 day
    print(mvp_offer("Do players want karaoke-scroll chords for ONE song?"))
`;
