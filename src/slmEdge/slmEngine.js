// ============================================================================
// SLM + EDGE ENGINE — distillation, Phi/SmolLM/Qwen-small, device budgets
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const DISTILL_TABLE = [
  { method: "Logit KD (teacher–student)", how: "Student mimics teacher soft targets + temp", keeps: "~90% quality at 10% size", needs: "Teacher logits access" },
  { method: "SeqKD /MiniLLM", how: "Train on teacher generations (reverse KL)", keeps: "Better for open-ended gen", needs: "Teacher generation budget" },
  { method: "Speculative draft", how: "Small drafts, big verifies (not training)", keeps: "2–3x speedup, same quality", needs: "Same tokenizer pair" }
];

export const SLM_TABLE = [
  { model: "Phi-4-mini (3.8B)", ram: "~3 GB Q4", best: "Reasoning-ish small, RAG reader" },
  { model: "SmolLM2 (1.7B)", ram: "~1.2 GB Q4", best: "On-device classify/route" },
  { model: "Qwen3-small (4B/8B)", ram: "~3–5 GB Q4", best: "Multilingual edge" }
];

// ── Simulator: device fit ───────────────────────────────────────────────────
export const FIT_EDGE = (paramsB = 3.8, bits = 4, ramGB = 8, needTps = 15) => {
  const need = paramsB * 1e9 * bits / 8 / 1e9 * 1.2;
  const fits = need <= ramGB * 0.6;
  const tps = paramsB <= 2 ? "~30 tok/s (phone NPU)" : paramsB <= 4 ? "~15 tok/s" : "~8 tok/s";
  return {
    needGB: +need.toFixed(1), fits, tps,
    advice: !fits ? "Too big — distill smaller or offload router to cloud, keep classifier local." : needTps > 20 && paramsB > 2 ? "TPS short — use speculative draft (SLM drafts, server verifies)." : "Fits — pin eval: edge SLM must pass same golden set as server model."
  };
};

export const PYTHON_SLM_CODE = `# ============================================================================
# EDGE FIT: distill -> quantize -> pin evals -> deploy budget
# ============================================================================
def edge_gb(params_b: float, bits: int = 4) -> float:
    return params_b * 1e9 * bits / 8 / 1e9 * 1.2   # + runtime overhead

def deployable(params_b: float, ram_gb: float, bits: int = 4) -> bool:
    return edge_gb(params_b, bits) <= ram_gb * 0.6  # leave room for OS/app

# Pipeline: teacher gens -> SeqKD student -> Q4 GGUF -> golden-set parity gate.
# Pattern: local SLM classifies/routes; cloud verifies/drafts speculatively.
`;
