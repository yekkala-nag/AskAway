/**
 * Foundation Model Internals Hub - Domain Data Engine
 * Clean-room architectural models, tensor dimensional flows, and mathematical formulations.
 */

export const FND_INTERNALS_KPI = [
  { label: "Attention Scaling", val: "O(N²) → O(N)", sub: "FlashAttention-2 Tiling", color: "#0284C7" },
  { label: "KV Cache Savings", val: "87.5%", sub: "GQA Head Sharing (8:1)", color: "#D97706" },
  { label: "Active MoE FLOPs", val: "2 / 8", sub: "Top-K Dynamic Router", color: "#7C3AED" },
  { label: "Decode Bound", val: "Memory BW", sub: "KV Cache HBM Streaming", color: "#059669" },
];

export const CORE_MECHANICS = [
  {
    id: "card_a_tokens",
    code: "CARD_A",
    title: "Tokenization & Embeddings",
    subtitle: "Input representation & continuous vector manifold",
    icon: "🔤",
    color: "#0284C7",
    summary:
      "Byte-Pair Encoding (BPE) chunks unicode character streams into subword tokens, which map through a static embedding table into a continuous d-dimensional vector space with positional embeddings.",
    math: "x₀ = TokenEmbed(id) + PosEmbed(t) ∈ ℝ^{B × S × d_model}",
    tensorShape: "[B, S] → [B, S, d_model] (e.g., [1, 4096, 4096])",
    keyPoints: [
      "Subword vocabulary compression balances vocabulary size (e.g., 32k - 128k) against sequence length.",
      "Rotary Position Embeddings (RoPE) apply complex rotation matrices to Q and K vectors, preserving relative distance.",
      "Input embedding and unembedding weights can be tied to minimize parameter count or untied for higher expressivity."
    ],
    failureMode: "Out-of-vocabulary split degradation and token boundary leakage on specialized code/domain terms."
  },
  {
    id: "card_b_attention",
    code: "CARD_B",
    title: "Self-Attention & KV Cache",
    subtitle: "Context memory mechanics & pairwise token routing",
    icon: "⚡",
    color: "#D97706",
    summary:
      "Computes dynamic relevance scores between all token pairs via scaled dot-product. During autoregressive decoding, past Key and Value vectors are cached in GPU VRAM to avoid redundant recomputations.",
    math: "Attention(Q, K, V) = softmax(Q K^T / √d_k) · V",
    tensorShape: "Q, K, V: [B, H, S, d_k] → Context: [B, S, d_model]",
    keyPoints: [
      "Causal triangular masking enforces unidirectional causality by zeroing attention to future token positions.",
      "Grouped-Query Attention (GQA) shares 1 key-value head among groups of 8 query heads, slashing VRAM bandwidth 8x.",
      "FlashAttention-2 fuses softmax and matrix multiplications directly inside fast GPU SRAM without materializing full N×N attention in HBM."
    ],
    failureMode: "Quadratic attention memory saturation at ultra-long context windows (>64k) without flash tiling or chunking."
  },
  {
    id: "card_c_ffn",
    code: "CARD_C",
    title: "Feed-Forward Networks & Layer Norm",
    subtitle: "Transformation, non-linear projection & factual memory",
    icon: "🧩",
    color: "#059669",
    summary:
      "Acts as a localized key-value memory retrieval mechanism. Modern architectures leverage SwiGLU (Swish Gated Linear Unit) non-linearities and RMSNorm pre-normalization for training stability.",
    math: "SwiGLU(x) = (x W_gate · σ(x W_gate)) ⊙ (x W_up) · W_down",
    tensorShape: "[B, S, d_model] → [B, S, d_ffn] → [B, S, d_model] (d_ffn ≈ 8/3 · d_model)",
    keyPoints: [
      "Feed-forward layers account for roughly 65% of a dense model's parameter volume and encode vast factual knowledge.",
      "RMSNorm (Root Mean Square Normalization) removes mean centering, accelerating layer computation with identical convergence.",
      "Residual stream connections ensure gradient propagation across hundreds of transformer blocks without vanishing."
    ],
    failureMode: "Gradient explosion during large batch pretraining without pre-layer normalization and cosine LR annealing."
  },
  {
    id: "card_d_moe",
    code: "CARD_D",
    title: "Mixture of Experts (MoE) Routing",
    subtitle: "Compute optimization & sparse conditional parameter routing",
    icon: "🔀",
    color: "#7C3AED",
    summary:
      "Replaces dense feed-forward blocks with N parallel specialized expert sub-networks. A learned gating router scores incoming tokens and routes each token to Top-K (typically 2) experts per layer.",
    math: "y = ∑_{i ∈ TopK} Softmax(Gating(x))_i · Expert_i(x)",
    tensorShape: "[B, S, d_model] → Router scores → Top-2 Experts of 8 parallel FFNs",
    keyPoints: [
      "Decouples total active FLOPs from total model parameter count, offering 8x model capacity at 2x compute cost.",
      "Auxiliary load-balancing loss prevents routing collapse where one expert receives all token traffic.",
      "Expert parallelism partitions expert weights across distributed GPU nodes, requiring fast all-to-all communication."
    ],
    failureMode: "Expert load imbalance leading to token dropping and high tail latencies during batched multi-user serving."
  }
];

export const FORWARD_PASS_EXECUTION_FLOW = [
  {
    step: 1,
    title: "1. Tokenization & Token IDs",
    stage: "Input Preprocessing",
    desc: "The raw UTF-8 prompt string is partitioned by subword tokenizer into integer token IDs based on vocabulary indexing.",
    input: "Prompt string: 'Transformers execute...'",
    output: "Token IDs tensor: [1024, 8492, 1982]",
    color: "#0284C7"
  },
  {
    step: 2,
    title: "2. Vector Embedding & RoPE Rotation",
    stage: "Embedding Layer",
    desc: "Token IDs look up high-dimensional continuous vectors in the embedding matrix. Rotary Position Embeddings (RoPE) are applied.",
    input: "Token IDs: [B, S]",
    output: "Hidden States: [B, S, 4096]",
    color: "#0284C7"
  },
  {
    step: 3,
    title: "3. RMSNorm Pre-Normalization",
    stage: "Pre-Attention Normalization",
    desc: "Hidden states are scaled by their root-mean-square amplitude to stabilize variance across deep sequential layers.",
    input: "Raw Residual Stream: [B, S, 4096]",
    output: "Normalized Hidden: [B, S, 4096]",
    color: "#D97706"
  },
  {
    step: 4,
    title: "4. Multi-Head / Grouped-Query Attention",
    stage: "Dynamic Information Routing",
    desc: "Queries, Keys, and Values are projected. Scaled dot-product scores are causally masked and multiplied by Value vectors.",
    input: "Q, K, V Tensors: [B, H, S, 128]",
    output: "Attended States: [B, S, 4096]",
    color: "#D97706"
  },
  {
    step: 5,
    title: "5. Residual Addition & Post-Norm",
    stage: "Skip Connection",
    desc: "The attended representation is added directly back into the residual stream, preserving unimpeded gradient flow.",
    input: "Attended States + Prior Residual",
    output: "Updated Residual: [B, S, 4096]",
    color: "#059669"
  },
  {
    step: 6,
    title: "6. SwiGLU / MoE Feed-Forward Transformation",
    stage: "Knowledge Retrieval & Expansion",
    desc: "Normalized representations pass through SwiGLU non-linear expansion or sparse Top-2 MoE experts to recall factual memory.",
    input: "Normalized States: [B, S, 4096]",
    output: "Transformed FFN Output: [B, S, 4096]",
    color: "#7C3AED"
  },
  {
    step: 7,
    title: "7. Unembedding & Logit Sampling",
    stage: "Generation Head",
    desc: "Final layer residual states project through the language model head into vocabulary logits. Softmax with temperature produces next token probability.",
    input: "Final Hidden State: [B, 1, 4096]",
    output: "Next Token Logits: [B, 1, 128256]",
    color: "#E11D48"
  }
];

export const ARCHITECTURAL_FOOTNOTES = [
  {
    category: "Compute & Memory",
    principle: "Roofline Model Duality",
    detail: "Prefill phase is compute-bound (GEMM Tensor Cores); Decode phase is memory bandwidth-bound (streaming KV cache from High-Bandwidth Memory)."
  },
  {
    category: "Context Scaling",
    principle: "KV Cache Compaction",
    detail: "Moving from Multi-Head Attention (MHA) to Grouped-Query Attention (GQA) reduces KV memory by 87.5% without measurable loss in perplexity."
  },
  {
    category: "Hardware Acceleration",
    principle: "FlashAttention-2 Fused Kernel",
    detail: "Computing online softmax in on-chip SRAM reduces slow HBM memory roundtrips from O(N²) to O(N), yielding 2x-4x throughput gains."
  },
  {
    category: "Scaling Law",
    principle: "Sparse Compute Decoupling",
    detail: "Mixture of Experts activates only Top-K parameters per token, enabling massive model knowledge capacity while maintaining realistic inference latency."
  }
];
