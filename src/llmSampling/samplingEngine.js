// ============================================================================
// LLM GENERATION & SAMPLING MECHANICS ENGINE
// Pure mathematical logic for Logits, Softmax, Temperature Scaling,
// Top-K, Top-P (Nucleus), Min-P, Repetition Penalty, and Autoregressive Decoding
// ============================================================================

export const SAMPLE_PROMPTS = [
  {
    id: "factual_code",
    title: "1. Deterministic Python Code Generation",
    prompt: "def compute_fibonacci(n: int) -> list[int]:\n    \"\"\"Return first n Fibonacci numbers.\"\"\"\n    if n <= 0:\n        return",
    vocabCandidates: [
      { token: " []", rawLogit: 6.4, category: "correct" },
      { token: " [0]", rawLogit: 5.9, category: "alternative" },
      { token: " None", rawLogit: 5.1, category: "alternative" },
      { token: " raise", rawLogit: 4.6, category: "alternative" },
      { token: " False", rawLogit: 3.2, category: "rare" },
      { token: " print", rawLogit: 1.8, category: "hallucination" },
      { token: " banana", rawLogit: -0.5, category: "nonsense" }
    ]
  },
  {
    id: "creative_story",
    title: "2. Creative World-Building Narrative",
    prompt: "Beyond the shattered crystal gates of the ancient citadel, the obsidian dragon spread its",
    vocabCandidates: [
      { token: " wings", rawLogit: 6.2, category: "predictable" },
      { token: " crystalline", rawLogit: 5.9, category: "creative" },
      { token: " shadow", rawLogit: 5.6, category: "creative" },
      { token: " talons", rawLogit: 4.7, category: "alternative" },
      { token: " fiery", rawLogit: 4.1, category: "alternative" },
      { token: " spreadsheet", rawLogit: 1.4, category: "hallucination" },
      { token: " syntax", rawLogit: -0.8, category: "nonsense" }
    ]
  },
  {
    id: "financial_reasoning",
    title: "3. Enterprise Financial GAAP Analysis",
    prompt: "Based on the Q3 balance sheet, the total operating margin contracted by 140 bps due to higher",
    vocabCandidates: [
      { token: " cost", rawLogit: 6.0, category: "correct" },
      { token: " SG&A", rawLogit: 5.7, category: "correct" },
      { token: " logistics", rawLogit: 5.2, category: "alternative" },
      { token: " headcount", rawLogit: 4.4, category: "alternative" },
      { token: " unicorn", rawLogit: 1.6, category: "nonsense" },
      { token: " delicious", rawLogit: -0.6, category: "nonsense" }
    ]
  }
];

export const DECODING_STRATEGIES = [
  {
    id: "greedy",
    name: "Greedy Decoding (argmax)",
    formula: "t^* = \\arg\\max_i z_i",
    pros: "100% deterministic, lowest latency, optimal for code, math, and structured JSON.",
    cons: "Prone to repetitive loops, lacks creativity, cannot recover from early sub-optimal token picks.",
    idealTemperature: "T = 0.0",
    useCases: "Code generation, SQL queries, JSON schema extraction, mathematical reasoning."
  },
  {
    id: "temp_sampling",
    name: "Temperature-Scaled Sampling",
    formula: "P(t_i) = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}",
    pros: "Controls sharpness of probability distribution; smooth transition from deterministic to diverse.",
    cons: "High T (>1.2) causes gibberish/hallucinations by boosting tail probabilities.",
    idealTemperature: "T = 0.3 - 0.8",
    useCases: "Chatbots, general Q&A, conversational assistants, copywriting."
  },
  {
    id: "top_k",
    name: "Top-K Sampling",
    formula: "V_{\\text{top-k}} = \\text{top } K \\text{ tokens by logit } z_i",
    pros: "Strictly eliminates low-probability nonsense tokens; bounds vocabulary search space.",
    cons: "Rigid cutoff: keeps bad tokens in flat distributions and cuts good tokens in peaked ones.",
    idealTemperature: "K = 20 - 50",
    useCases: "Creative writing, brainstorming, dialogue generation."
  },
  {
    id: "top_p",
    name: "Top-P (Nucleus) Sampling",
    formula: "\\sum_{i \\in V^{(p)}} P(t_i) \\ge p",
    pros: "Dynamically expands/contracts token pool depending on model confidence.",
    cons: "Slightly more complex GPU prefix-sum calculation before sampling.",
    idealTemperature: "p = 0.85 - 0.95",
    useCases: "Story generation, open-ended research synthesis, diverse dialogue."
  },
  {
    id: "min_p",
    name: "Min-P Sampling (Modern Standard)",
    formula: "P(t_i) \\ge P_{\\max} \\times p_{\\min}",
    pros: "Dynamically filters tokens relative to the top token's probability. Outperforms Top-P in reasoning.",
    cons: "Newer hyperparameter, requires modern inference runtime support.",
    idealTemperature: "p_{\\min} = 0.05 - 0.10",
    useCases: "Reasoning models, complex instruction following, preventing tail degradation."
  },
  {
    id: "beam_search",
    name: "Beam Search",
    formula: "\\text{Score}(Y) = \\sum_{t=1}^T \\log P(y_t | y_{<t}, X)",
    pros: "Explores multiple parallel generation paths; finds globally optimal sequences.",
    cons: "High memory and compute cost (B× multiplier); tends to generate repetitive text in open-ended LLMs.",
    idealTemperature: "Beam Width B = 3 - 5",
    useCases: "Neural Machine Translation (NMT), Speech-to-Text transcription, summarization."
  }
];

export const CALCULATE_SAMPLING_DISTRIBUTION = ({
  rawCandidates,
  temperature = 0.7,
  topK = 50,
  topP = 0.90,
  minP = 0.05,
  repetitionPenalty = 1.0,
  isGreedy = false
}) => {
  if (!rawCandidates || rawCandidates.length === 0) return [];

  // Step 1: Apply Repetition Penalty (if penalty > 1.0, reduce logit)
  let processed = rawCandidates.map(c => {
    let logit = c.rawLogit;
    if (repetitionPenalty > 1.0 && c.rawLogit > 0) {
      logit = logit / repetitionPenalty;
    } else if (repetitionPenalty > 1.0 && c.rawLogit < 0) {
      logit = logit * repetitionPenalty;
    }
    return { ...c, adjustedLogit: logit };
  });

  // If Greedy (T = 0)
  if (isGreedy || temperature <= 0.01) {
    let maxLogit = -Infinity;
    let maxIdx = 0;
    processed.forEach((c, idx) => {
      if (c.adjustedLogit > maxLogit) {
        maxLogit = c.adjustedLogit;
        maxIdx = idx;
      }
    });

    return processed
      .map((c, idx) => ({
        ...c,
        scaledLogit: idx === maxIdx ? 100 : -100,
        rawProb: idx === maxIdx ? 1.0 : 0.0,
        finalProb: idx === maxIdx ? 1.0 : 0.0,
        isKeptByTopK: true,
        isKeptByTopP: idx === maxIdx,
        isKeptByMinP: idx === maxIdx,
        isSampled: idx === maxIdx,
        isSurviving: idx === maxIdx
      }))
      .sort((a, b) => b.rawLogit - a.rawLogit);
  }

  // Step 2: Temperature Scaling (z_i / T)
  const safeTemp = Math.max(0.05, temperature);
  processed = processed.map(c => ({
    ...c,
    scaledLogit: c.adjustedLogit / safeTemp
  }));

  // Step 3: Compute Softmax
  const maxScaled = Math.max(...processed.map(c => c.scaledLogit));
  const exps = processed.map(c => Math.exp(c.scaledLogit - maxScaled));
  const sumExps = exps.reduce((a, b) => a + b, 0);
  
  processed = processed.map((c, idx) => ({
    ...c,
    rawProb: exps[idx] / sumExps
  }));

  // Sort descending by raw probability
  processed.sort((a, b) => b.rawProb - a.rawProb);

  // Step 4: Apply Top-K filter
  processed = processed.map((c, idx) => ({
    ...c,
    isKeptByTopK: idx < topK
  }));

  // Step 5: Apply Min-P filter (prob >= maxProb * minP)
  const maxProb = processed[0].rawProb;
  const minPThreshold = maxProb * minP;
  processed = processed.map(c => ({
    ...c,
    isKeptByMinP: c.rawProb >= minPThreshold
  }));

  // Step 6: Apply Top-P (Nucleus) filter
  let cumulative = 0;
  processed = processed.map(c => {
    cumulative += c.rawProb;
    // Keep token if cumulative sum before this token was < topP
    const isKept = (cumulative - c.rawProb) < topP;
    return {
      ...c,
      cumulativeProb: parseFloat(cumulative.toFixed(4)),
      isKeptByTopP: isKept
    };
  });

  // Step 7: Renormalize surviving tokens
  const activeTokens = processed.filter(c => c.isKeptByTopK && c.isKeptByTopP && c.isKeptByMinP);
  const activeSum = activeTokens.reduce((sum, c) => sum + c.rawProb, 0);

  return processed.map(c => {
    const isSurviving = c.isKeptByTopK && c.isKeptByTopP && c.isKeptByMinP;
    const finalProb = isSurviving && activeSum > 0 ? c.rawProb / activeSum : 0;
    return {
      ...c,
      finalProb: parseFloat(finalProb.toFixed(4)),
      isSurviving
    };
  });
};

export const PYTHON_LOGITS_PROCESSOR_SCRIPT = `# ============================================================================
# PRODUCTION PYTORCH LOGITS PROCESSOR & SAMPLING PIPELINE
# Demonstrates Temperature, Top-K, Top-P, Min-P and Repetition Penalty
# ============================================================================

import torch
import torch.nn.functional as F
from transformers import AutoModelForCausalLM, AutoTokenizer, LogitsProcessorList

class MinPLogitsProcessor:
    """
    Min-P Logits Processor: Discards tokens whose probability is less than
    min_p * top_token_probability.
    """
    def __init__(self, min_p: float = 0.05):
        self.min_p = min_p

    def __call__(self, input_ids: torch.LongTensor, scores: torch.FloatTensor) -> torch.FloatTensor:
        probs = F.softmax(scores, dim=-1)
        max_probs = torch.max(probs, dim=-1, keepdim=True).values
        scaled_min_p = max_probs * self.min_p
        
        # Mask out tokens below the min_p dynamic threshold
        scores = scores.masked_fill(probs < scaled_min_p, -float("inf"))
        return scores

def generate_with_custom_sampling(
    model,
    tokenizer,
    prompt: str,
    temperature: float = 0.7,
    top_p: float = 0.90,
    top_k: int = 40,
    min_p: float = 0.05,
    repetition_penalty: float = 1.1,
    max_new_tokens: int = 128
):
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    # Configure production generation parameters
    outputs = model.generate(
        **inputs,
        max_new_tokens=max_new_tokens,
        do_sample=True,
        temperature=temperature,
        top_p=top_p,
        top_k=top_k,
        repetition_penalty=repetition_penalty,
        pad_token_id=tokenizer.eos_token_id
    )
    
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# ── vLLM Production Serving Configuration ────────────────────────────────────
# In vLLM, configure SamplingParams directly:
# from vllm import SamplingParams
# sampling_params = SamplingParams(
#     temperature=0.7,
#     top_p=0.90,
#     min_p=0.05,
#     repetition_penalty=1.1,
#     max_tokens=256
# )
`;
