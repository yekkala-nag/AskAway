// ============================================================================
// RAG EVALUATION ENGINE — RAGAS-style triad + faithfulness simulator
// Context precision/recall, faithfulness, answer relevance
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const EVAL_METRICS = [
  { metric: "Context precision", asks: "Of retrieved chunks, how many are relevant?", fix: "Tighten pre-filter; add reranker; cut k", range: "0–1 (target ≥0.8)" },
  { metric: "Context recall", asks: "Of needed facts, how many were retrieved?", fix: "Raise k; HyDE/query expansion; chunk overlap", range: "0–1 (target ≥0.85)" },
  { metric: "Faithfulness", asks: "Is every answer claim supported by context?", fix: "Typed generation contract; cite-or-refuse", range: "0–1 (target ≥0.95)" },
  { metric: "Answer relevance", asks: "Does the answer address the question?", fix: "Question parsing loop; scope filters", range: "0–1 (target ≥0.85)" }
];

export const GRADE_TABLE = [
  { band: "Ship", rule: "faithfulness ≥0.95 AND precision ≥0.8", action: "Promote; sample-monitor 5%" },
  { band: "Gate", rule: "faithfulness 0.85–0.95", action: "Block prod; fix top failing claim pattern" },
  { band: "Rebuild", rule: "faithfulness <0.85 OR recall <0.7", action: "Retrieval rebuild, not prompt tuning" }
];

// ── Simulator: score a synthetic QA run ─────────────────────────────────────
export const SCORE_RUN = (retrieved = 8, relevant = 5, needed = 6, found = 5, claims = 10, supported = 9) => {
  const precision = retrieved ? relevant / retrieved : 0;
  const recall = needed ? found / needed : 0;
  const faithfulness = claims ? supported / claims : 0;
  const band = faithfulness >= 0.95 && precision >= 0.8 ? "Ship" : faithfulness >= 0.85 ? "Gate" : "Rebuild";
  const diagnosis = band === "Ship" ? "Healthy — monitor drift."
    : faithfulness < 0.85 ? "Generation ungrounded — enforce cite-or-refuse before tuning retrieval."
      : recall < 0.7 ? "Retrieval blind — raise k / HyDE / overlap; prompt won't save it."
        : "Noisy retrieval — rerank + pre-filter, cut k.";
  return { precision: +precision.toFixed(2), recall: +recall.toFixed(2), faithfulness: +faithfulness.toFixed(2), band, diagnosis };
};

// ── A/B benchmark harness: polluted-context retrieval ───────────────────────
// Deterministic seeded dataset: each item carries one true value + decoy values.
// Plain-concat merges all values unlabeled; labeled-truth tags VERIFIED vs
// UNVERIFIED and carries a conflict-resolution instruction in the prompt.

export const BENCH_QUERIES = [
  "Depot capacity?",
  "Loading gate?",
  "Active shift?",
  "Lead time?",
  "Max load?",
  "Storage zone?"
];

export const BENCH_TRUTHS = ["42 units", "Gate C", "Shift B", "14 days", "640 kg", "Zone 4"];

export const BENCH_DECOYS = [
  "87 units", "Gate A", "Shift A", "30 days",
  "120 kg", "Zone 1", "55 units", "Gate D",
  "Shift C", "9 days", "410 kg", "Zone 7"
];

export const AB_LESSON = "Structurally superior retrieval can regress when enforcement lives in the prompt.";

export const seededRng = (seed = 7) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

export const generatePollutedDataset = (count = 6, seed = 7, polluted = true) => {
  const rng = seededRng(seed);
  const n = Math.max(0, Math.min(12, count));
  const items = [];
  for (let i = 0; i < n; i++) {
    const query = BENCH_QUERIES[i % BENCH_QUERIES.length];
    const truth = BENCH_TRUTHS[i % BENCH_TRUTHS.length];
    let decoys = [];
    if (polluted) {
      const picked = new Set();
      while (picked.size < 2) {
        const d = BENCH_DECOYS[Math.floor(rng() * BENCH_DECOYS.length)];
        if (d !== truth) picked.add(d);
      }
      decoys = Array.from(picked);
    }
    items.push({
      id: i,
      query: query,
      trueValue: truth,
      decoys: decoys,
      polluted: polluted && decoys.length > 0,
      contextPlain: polluted ? truth + " / " + decoys.join(" / ") : truth,
      contextLabeled: polluted
        ? "VERIFIED: " + truth + " | UNVERIFIED: " + decoys.join(", ") + " | Resolve conflicts in favor of VERIFIED."
        : "VERIFIED: " + truth
    });
  }
  return items;
};

// Plain-concat has no labels, so under pollution it grabs the first listed
// value on even rows (a position-bias stand-in) and the truth on odd rows.
export const predictPlainConcat = (item) => {
  if (!item.polluted || !item.decoys || item.decoys.length === 0) return item.trueValue;
  return item.id % 2 === 0 ? item.decoys[0] : item.trueValue;
};

// Labeled-truth is structurally superior: labels + instruction always recover truth.
export const predictLabeledTruth = (item) => item.trueValue;

export const scoreExactMatch = (dataset = [], predictFn) => {
  let correct = 0;
  for (const item of dataset) {
    if (predictFn(item) === item.trueValue) correct++;
  }
  const total = dataset.length;
  const accuracy = total ? +(correct / total).toFixed(2) : 0;
  return { correct: correct, total: total, accuracy: accuracy };
};

// Prompt-complexity-vs-capacity rule: a small tier asked to carry
// conflict-resolution / multi-source reasoning in the prompt regresses.
export const checkComplexityCapacity = (modelTier = "small", usesConflictPrompt = true) => {
  const regressionFlag = modelTier === "small" && usesConflictPrompt === true;
  return {
    regressionFlag: regressionFlag,
    note: regressionFlag
      ? "Small tier + conflict-resolution prompt: enforcement load exceeds capacity — expect regression."
      : "Capacity covers prompt complexity: labeled-truth enforcement holds."
  };
};

export const runABBenchmark = (dataset = [], modelTier = "large") => {
  const plain = scoreExactMatch(dataset, predictPlainConcat);
  const labeled = scoreExactMatch(dataset, predictLabeledTruth);
  const cap = checkComplexityCapacity(modelTier, true);
  const effCorrect = cap.regressionFlag ? plain.correct : labeled.correct;
  const total = dataset.length;
  const effAccuracy = total ? +(effCorrect / total).toFixed(2) : 0;
  const anyPolluted = dataset.some((d) => d.polluted);
  let winner = "tie";
  let verdict = "No pollution: both methods agree — enable pollution to discriminate.";
  if (anyPolluted) {
    if (cap.regressionFlag) {
      winner = plain.accuracy === effAccuracy ? "tie" : "plain";
      verdict = "Regression on the small tier: labeled-truth falls back to plain-concat levels — " + AB_LESSON;
    } else if (labeled.accuracy > plain.accuracy) {
      winner = "labeled";
      verdict = "Labeled-truth wins with capacity to spare: labels + conflict instruction beat plain concat.";
    } else {
      winner = "tie";
      verdict = "Scores tied: raise pollution or query count to separate the methods.";
    }
  }
  return {
    plain: plain,
    labeled: labeled,
    effectiveLabeled: { correct: effCorrect, total: total, accuracy: effAccuracy },
    regressionFlag: cap.regressionFlag,
    capacityNote: cap.note,
    winner: winner,
    verdict: verdict,
    lesson: AB_LESSON
  };
};
export const PYTHON_RAGEVAL_CODE = `# ============================================================================
# RAG EVAL TRIAD: precision / recall / faithfulness + ship-gate
# ============================================================================
def score_run(retrieved: int, relevant: int, needed: int, found: int,
              claims: int, supported: int) -> dict:
    precision = relevant / max(1, retrieved)
    recall = found / max(1, needed)
    faith = supported / max(1, claims)
    band = ("Ship" if faith >= 0.95 and precision >= 0.8
            else "Gate" if faith >= 0.85 else "Rebuild")
    return {"precision": round(precision, 2), "recall": round(recall, 2),
            "faithfulness": round(faith, 2), "band": band}

if __name__ == "__main__":
    print(score_run(8, 5, 6, 5, 10, 9))   # Gate: noisy retrieval
    print(score_run(5, 5, 6, 6, 10, 10))  # Ship
`;
