// Speculative decoding — draft/verify loop, acceptance math, variants

export const BOTTLENECK_TABLE = [
  { factor: "Autoregressive decode", effect: "One target forward pass per token", bound: "Memory bandwidth" },
  { factor: "Weight reload", effect: "Full parameter read each token", bound: "GPU idle between reads" },
  { factor: "Speculative step", effect: "One load → verify k candidates", bound: "Acceptance rate" }
];

export const VARIANT_TABLE = [
  { name: "Classic draft model", draft: "Separate small LM", guarantee: "Exact target distribution", cost: "Extra model weights" },
  { name: "Multi-head (Medusa-style)", draft: "Extra heads on target", guarantee: "Often exact; check impl", cost: "Slight arch change" },
  { name: "Hidden-state (Eagle-style)", draft: "Predict from internals", guarantee: "High acceptance on hard text", cost: "Training / coupling" },
  { name: "Prompt lookup", draft: "N-grams from prompt/history", guarantee: "Heuristic; great on code/summary", cost: "No second model" }
];

export const FRAMEWORK_TABLE = [
  { stack: "vLLM", flag: "speculative config + draft model", note: "Throughput wins on long generations" },
  { stack: "TGI / HF TGI", flag: "assistant model pairing", note: "Watch batch vs single-request mode" },
  { stack: "llama.cpp", flag: "draft model path", note: "Edge + local pairing" }
];

/** Rough speedup model: accepted tokens amortize one target pass; reject pays draft + partial verify. */
export const SIM_SPECULATIVE = (k = 6, acceptance = 0.75, draftCost = 0.15) => {
  const acc = Math.min(1, Math.max(0, acceptance));
  const kInt = Math.max(1, Math.min(12, Math.round(k)));
  const expectedAccepted = acc * kInt;
  const baseline = kInt; // k sequential target steps
  const specCost = draftCost * kInt + 1; // one batched target pass ≈ 1 unit
  const effectiveTokens = expectedAccepted + (acc > 0.99 ? 1 : acc * 0.5);
  const speedup = baseline / Math.max(specCost / Math.max(effectiveTokens, 0.5), 0.35);
  const clamped = Math.min(3.5, Math.max(0.85, speedup));
  return {
    k: kInt,
    acceptancePct: `${Math.round(acc * 100)}%`,
    expectedAccepted: expectedAccepted.toFixed(1),
    speedup: `${clamped.toFixed(1)}×`,
    verdict: acc < 0.45 ? "Draft mismatch — may slow down vs baseline" : acc >= 0.7 ? "Typical 2–3× band for long outputs" : "Marginal — tune draft or try prompt lookup",
    lossless: acc >= 0.45 ? "Output distribution matches target (classic algorithm)" : "Rejection-heavy — quality same, latency worse"
  };
};

export const PYTHON_SPEC_CONFIG = `# vLLM-style pairing (conceptual)
speculative_config = {
    "model": "draft-1b",           # fast proposer
    "num_speculative_tokens": 6,
}
# Enable only when: long generations, low batch concurrency, draft aligned to target family
# Disable when: saturated batch serving — draft work steals batch slots
`;
