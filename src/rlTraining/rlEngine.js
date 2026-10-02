// ============================================================================
// TRPO → GRPO ENGINE (RL training of LLMs)
// Pretrain→SFT→RLHF; maze analogy; KL trust regions; clipped PPO;
// value-model discounting; GRPO group z-scores (DeepSeek)
// Responsible AI & Security Compliant: Zero PII / synthetic demo data only
// ============================================================================

export const THREE_STAGES = [
  { stage: "1 · Pre-training", does: "Next-token prediction on massive corpora", gives: "Fluent base, no manners" },
  { stage: "2 · SFT", does: "Instruction-targeted fine-tuning", gives: "Follows directions" },
  { stage: "3 · RLHF", does: "Policy updates from reward feedback", gives: "Aligned preferences (this tab)" }
];

export const RL_MAPPING = [
  { rl: "Agent", llm: "The model itself" },
  { rl: "Environment", llm: "Prompts, feedback systems, context" },
  { rl: "Action", llm: "Each generated token" },
  { rl: "State", llm: "Query + tokens so far" },
  { rl: "Reward", llm: "Reward-model score (human-ranked pairs); rules for math" },
  { rl: "Policy πθ", llm: "Token distribution = the weights. RL reshapes it." }
];

export const METHOD_LADDER = [
  { method: "TRPO (2017)", idea: "Maximize advantage subject to hard KL cap vs old policy", cost: "Heavy constrained gradients — abandoned for LLMs", status: "History" },
  { method: "PPO (ChatGPT/Gemini era)", idea: "Clipped surrogate: same caution, simple optimization", cost: "+ a value model trained alongside", status: "Default" },
  { method: "GRPO (DeepSeek)", idea: "Group rewards → z-score advantages; KL-to-reference in objective; NO value model", cost: "Cheapest of the three", status: "Frontier" }
];

export const VALUE_DISCOUNT = [
  { prefix: "“2+2 is 4” (full)", value: "0.8 (the reward)" },
  { prefix: "“2+2 is” (−1 tok)", value: "0.8·γ" },
  { prefix: "“2+2” (−2 tok)", value: "0.8·γ² — credit fades backward" }
];

// ── Simulator: GRPO advantage from a reward group ───────────────────────────
export const GRPO_ADVANTAGE = (rewards = [0.2, 0.5, 0.5, 0.8]) => {
  const mu = rewards.reduce((a, b) => a + b, 0) / rewards.length;
  const sd = Math.sqrt(rewards.reduce((a, r) => a + (r - mu) ** 2, 0) / rewards.length) || 1;
  const adv = rewards.map(r => +(((r - mu) / sd).toFixed(2)));
  return {
    mu: +mu.toFixed(2), sd: +sd.toFixed(2), adv,
    read: `Best response pushed UP (${Math.max(...adv)}), worst pushed DOWN (${Math.min(...adv)}) — no value model, just the group.`,
    note: "Non-determinism (low temperature) is the fuel: groups need diverse samples."
  };
};

export const PYTHON_GRPO_CODE = `# ============================================================================
# GRPO ADVANTAGE: group z-scores replace the value model (DeepSeek-style)
# ============================================================================
import numpy as np

def grpo_advantages(rewards: list[float]) -> np.ndarray:
    r = np.array(rewards, dtype=float)
    mu, sd = r.mean(), r.std() or 1.0
    return np.round((r - mu) / sd, 2)   # A_i = (r_i - mu) / sigma

def ppo_needs() -> list[str]:
    return ["policy", "reward model", "VALUE MODEL (dropped by GRPO)"]

if __name__ == "__main__":
    print("advantages:", grpo_advantages([0.2, 0.5, 0.5, 0.8]))
    print("PPO maintains:", ppo_needs())
`;
