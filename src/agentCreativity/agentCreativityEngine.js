// ============================================================================
// AGENT CREATIVITY ENGINE — novelty + usefulness decomposition, pure functions
// Illustrative numbers only. No external data. Runs cleanly in node (no JSX).
// ============================================================================

export const TEAL = "#3A9B9F";
export const TEAL_DARK = "#1A6B6E";
export const PURPLE = "#5B4B8A";
export const RED = "#B4553A";
export const AMBER = "#B9821F";

// ── 0–4 novelty rubric (routine → transformational) ──────────────────────────
export const NOVELTY_RUBRIC = [
  { level: 0, label: "Routine", desc: "Repeats a known recipe from the agent's own history with no meaningful change." },
  { level: 1, label: "Incremental", desc: "Small tweak to a known approach — one flag set (recombine, transfer, break, or lineage)." },
  { level: 2, label: "Recombinant", desc: "Combines two known ideas in a way absent from history — two flags set." },
  { level: 3, label: "Expansive", desc: "Breaks a standing assumption or transfers across domains — three flags set." },
  { level: 4, label: "Transformational", desc: "All four flags: recombines, transfers, breaks an assumption, opens a new lineage." },
];

export const NOVELTY_FLAGS = [
  { key: "recombines", label: "Recombines known ideas", hint: "Joins two prior techniques into one solution" },
  { key: "transfers", label: "Transfers across domains", hint: "Imports a trick from an unrelated task family" },
  { key: "breaksAssumption", label: "Breaks an assumption", hint: "Violates a constraint prior solutions obeyed" },
  { key: "opensLineage", label: "Opens a lineage", hint: "Later episodes can build on this idea" },
];

// Count truthy flags → 0–4 novelty score (clamped).
export function scoreNovelty(flags = {}) {
  const keys = ["recombines", "transfers", "breaksAssumption", "opensLineage"];
  const count = keys.reduce((n, k) => n + (flags[k] ? 1 : 0), 0);
  return Math.max(0, Math.min(4, count));
}

export function rubricLabel(level) {
  const row = NOVELTY_RUBRIC.find((r) => r.level === level);
  return row ? row.label : "Unknown";
}

// ── Normalized impact: (score − baseline) / (top − baseline), clamped 0..1 ───
export function normalizedImpact(score, baseline, top) {
  const s = Number(score);
  const b = Number(baseline);
  const t = Number(top);
  if (!Number.isFinite(s) || !Number.isFinite(b) || !Number.isFinite(t)) return 0;
  if (t === b) return s >= t ? 1 : 0;
  const raw = (s - b) / (t - b);
  if (raw <= 0) return 0;
  if (raw >= 1) return 1;
  return +raw.toFixed(3);
}

// ── Creativity readout: average of novelty/4 and impact, gated by feasibility ─
export function scoreCreativity({ novelty = 0, impact = 0, feasible = true } = {}) {
  const n = Math.max(0, Math.min(4, Number(novelty) || 0)) / 4;
  const imp = Math.max(0, Math.min(1, Number(impact) || 0));
  if (!feasible) {
    return { creativity: 0, verdict: "BLOCKED", note: "Fails the feasibility gate — novel but unusable scores zero." };
  }
  const creativity = +(((n + imp) / 2).toFixed(3));
  const verdict = creativity >= 0.75 ? "STANDOUT" : creativity >= 0.5 ? "PROMISING" : creativity >= 0.25 ? "WEAK" : "ROUTINE";
  return {
    creativity,
    verdict,
    note:
      verdict === "STANDOUT"
        ? "High novelty and high impact — worth keeping and refining."
        : verdict === "PROMISING"
          ? "One axis is strong; push the weaker one next."
          : verdict === "WEAK"
            ? "Mildly new or mildly useful — keep exploring."
            : "Routine output — explore more before exploiting.",
  };
}

// ── Retrieval-then-judge pipeline for human-novelty (descriptive data) ───────
export const HUMAN_NOVELTY_PIPELINE = [
  { step: "1. Retrieve", what: "Fetch nearest prior solutions from the human reference corpus for ML engineering tasks." },
  { step: "2. Compare", what: "Check whether the agent's approach overlaps any retrieved solution's core trick." },
  { step: "3. Judge", what: "A judge marks self-novelty (vs agent history) and human-novelty (vs corpus) separately." },
  { step: "4. Gate", what: "Feasibility check runs last: solutions that cannot run or cannot be checked score zero." },
];

// ── Explore-then-exploit episode curves (deterministic, 10 episodes) ─────────
// Novelty declines monotonically (exploration early, exploitation late).
// Impact rises as search converges. Strategies differ in slope, never in noise.
export const STRATEGIES = [
  { id: "greedy", label: "Greedy", desc: "Exploits the first working idea; novelty collapses fast, impact plateaus early." },
  { id: "tree-search", label: "Tree search", desc: "Branches then prunes; balanced novelty decline and steady impact climb." },
  { id: "evolutionary", label: "Evolutionary", desc: "Keeps a diverse population; novelty stays high longest, impact arrives late." },
];

const STRATEGY_PARAMS = {
  greedy: { n0: 0.45, nDecay: 0.075, i0: 0.5, iGain: 0.045, iCap: 0.82 },
  "tree-search": { n0: 0.7, nDecay: 0.05, i0: 0.3, iGain: 0.055, iCap: 0.9 },
  evolutionary: { n0: 0.9, nDecay: 0.035, i0: 0.15, iGain: 0.06, iCap: 0.95 },
};

export function generateEpisodeCurve(strategy = "tree-search", episodes = 10) {
  const p = STRATEGY_PARAMS[strategy] || STRATEGY_PARAMS["tree-search"];
  const pts = [];
  for (let e = 0; e < episodes; e++) {
    const novelty = Math.max(0.02, p.n0 - p.nDecay * e);
    const impact = Math.min(p.iCap, p.i0 + p.iGain * e + (strategy === "evolutionary" && e >= 6 ? 0.05 * (e - 5) : 0));
    pts.push({ episode: e + 1, novelty: +novelty.toFixed(3), impact: +impact.toFixed(3) });
  }
  return pts;
}

// ── Illustrative comparison rows: novelty vs impact can diverge ──────────────
export const NOVELTY_IMPACT_ROWS = [
  { group: "Agent pool (typical)", novelty: "0.62", impact: "0.48", note: "More varied than the corpus, weaker on average score." },
  { group: "Human reference corpus", novelty: "0.41", impact: "0.71", note: "Less surprising, stronger average execution." },
  { group: "Best agent episode", novelty: "0.88", impact: "0.66", note: "Beats top humans on novelty while trailing on impact." },
];

export const PYTHON_CREATIVITY_CODE = `# ============================================================================
# AGENT CREATIVITY: novelty rubric + normalized impact + feasibility gate
# Illustrative logic only — no external data.
# ============================================================================

def normalized_impact(score: float, baseline: float, top: float) -> float:
    if top == baseline:
        return 1.0 if score >= top else 0.0
    raw = (score - baseline) / (top - baseline)
    return max(0.0, min(1.0, round(raw, 3)))

def score_novelty(flags: dict) -> int:
    keys = ["recombines", "transfers", "breaks_assumption", "opens_lineage"]
    return max(0, min(4, sum(1 for k in keys if flags.get(k))))

def score_creativity(novelty: int, impact: float, feasible: bool) -> dict:
    if not feasible:
        return {"creativity": 0.0, "verdict": "BLOCKED"}
    c = round(((novelty / 4) + impact) / 2, 3)
    verdict = ("STANDOUT" if c >= 0.75 else "PROMISING" if c >= 0.5
               else "WEAK" if c >= 0.25 else "ROUTINE")
    return {"creativity": c, "verdict": verdict}

def episode_curve(strategy: str, episodes: int = 10) -> list:
    params = {
        "greedy": (0.45, 0.075, 0.50, 0.045),
        "tree-search": (0.70, 0.050, 0.30, 0.055),
        "evolutionary": (0.90, 0.035, 0.15, 0.060),
    }
    n0, decay, i0, gain = params.get(strategy, params["tree-search"])
    out = []
    for e in range(episodes):
        novelty = max(0.02, n0 - decay * e)
        impact = min(0.95, i0 + gain * e)
        out.append({"episode": e + 1, "novelty": round(novelty, 3),
                    "impact": round(impact, 3)})
    return out
`;
