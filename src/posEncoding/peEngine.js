// ============================================================================
// POSITIONAL ENCODING ENGINE (order restores meaning)
// Scalar→embed→QKV→shuffle test→sinusoidal clocks→lags→variants
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const PE_PIPELINE = [
  { step: "1 · Scalars", detail: "5 weekday temps (e.g. 30°→20°). Order IS the story.", math: "x₁…x₅ ∈ ℝ" },
  { step: "2 · Embed", detail: "Learned linear map into ℝᵈ. Captures WHAT, not where.", math: "eₜ = Wₑxₜ + bₑ" },
  { step: "3 · QKV", detail: "Queries ask, keys match, values carry. All learned.", math: "q,k,v = W·e" },
  { step: "4 · Shuffle test", detail: "Same values rearranged → same attention, meaning lost. Proves blindness.", math: "α identical, story gone" },
  { step: "5 · Add position", detail: "h = e + p. Queries/keys now see what AND where.", math: "hₜ = eₜ + pₜ" }
];

export const PE_REQUIREMENTS = [
  { need: "Distinguish positions", ex: "2 ≠ 20" },
  { need: "Before/after sense", ex: "t−1 vs t+1" },
  { need: "Relative distance", ex: "t−1, t−7, t−30 differ (weekly seasonality)" },
  { need: "Local smoothness", ex: "10 ≈ 11, not alien IDs" },
  { need: "Length generalization", ex: "Structure holds as sequences grow" }
];

export const PE_METHODS = [
  { method: "Sinusoidal (original)", how: "sin/cos at geometric frequencies — clocks at many speeds", cost: "Free, fixed", limit: "Position, not wall-clock time" },
  { method: "Learned embeddings", how: "Position vectors trained with the model", cost: "Params + fixed max length", limit: "Fails past trained length" },
  { method: "Relative / RoPE", how: "Distances baked into attention (RoPE rotates QK)", cost: "Best extrapolation", limit: "More machinery" }
];

// ── Simulator: shuffle blindness + lag sense ────────────────────────────────
const TEMPS = [22, 25, 27, 18, 20];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const SHUFFLE_DEMO = (order = "chrono") => {
  const idx = order === "chrono" ? [0, 1, 2, 3, 4] : [4, 0, 3, 1, 2];
  const seq = idx.map(i => `${DAYS[i]} ${TEMPS[i]}°`);
  const sameSet = order !== "chrono";
  return {
    seq,
    noPE: sameSet ? "Attention scores IDENTICAL to chrono — model cannot tell the story changed." : "Baseline order.",
    withPE: "h=e+p differs per position — Friday queries now weight Thursday (t−1) differently from last week (t−7).",
    verdict: sameSet ? "Without p: blind. With p: order-aware." : "Chrono order: meaning intact either way."
  };
};

export const LAG_GUIDE = [
  { lag: "t−1", captures: "Short-term dependence (momentum, AR)" },
  { lag: "t−7", captures: "Weekly seasonality" },
  { lag: "t−24 / t−30", captures: "Daily / monthly cycles" }
];

export const PYTHON_PE_CODE = `# ============================================================================
# POSITIONAL ENCODING: sinusoidal clocks + shuffle-blindness demo
# (G. Kaur: order changes meaning — dog bites man vs man bites dog)
# ============================================================================
import numpy as np

def sinusoidal_pe(seq_len: int, d_model: int = 16) -> np.ndarray:
    pos = np.arange(seq_len)[:, None]
    i = np.arange(d_model // 2)[None, :]
    angles = pos / np.power(10000, 2 * i / d_model)
    pe = np.zeros((seq_len, d_model))
    pe[:, 0::2] = np.sin(angles)
    pe[:, 1::2] = np.cos(angles)
    return pe   # many clocks, different speeds -> structured signature

def shuffle_blind(values: list) -> bool:
    # bag-of-embeddings attention is permutation-invariant: same multiset
    # of value-vectors yields the same attention output whatever the order
    return sorted(values) == sorted(list(reversed(values)))  # always True

if __name__ == "__main__":
    pe = sinusoidal_pe(5)
    print("t=0 vs t=4 cosine sim:", round(float(pe[0] @ pe[4] / 16), 3))
    print("shuffle-blind without PE:", shuffle_blind([22, 25, 27, 18, 20]))
`;
