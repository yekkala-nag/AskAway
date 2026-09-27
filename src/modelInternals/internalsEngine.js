// Deterministic architectural definitions and data for Model Internals
export const MODEL_INTERNALS_KPI = [
  { val: "128k", label: "Vocab Embedding", sub: "BPE subword dictionary space", color: "#5EC4C8" },
  { val: "O(N²)", label: "Raw Attention Cost", sub: "Quadratic context scaling", color: "#F43F5E" },
  { val: "2·b·s·l·h·d", label: "KV Cache Formula", sub: "Byte footprint per token step", color: "#F59E0B" },
  { val: "Top-2 / 8", label: "MoE Activation", sub: "Active parameters per pass", color: "#A78BFA" },
];

export const TRANSFORMER_PILLARS = [
  {
    id: "tokenization",
    label: "Pillar 1: Tokenization & Embedding Space",
    icon: "🔤",
    color: "#5EC4C8",
    tagline: "Discretization of natural text into high-dimensional geometric manifolds",
    summary: "Converts strings to discrete token IDs via Byte-Pair Encoding (BPE), followed by embedding table lookup into d_model dimensional space with Rotary Position Embedding (RoPE).",
    math: "E = W_{tok}[token\\_id] + RoPE(pos, d_{head})",
    tensorShapes: "Tokens [B, S] → Embeddings [B, S, d_model] → Head Views [B, H, S, d_k]",
    keyPoints: [
      "Subword tokenizer (Byte-Pair Encoding or WordPiece) maps 100k+ vocab vocabulary.",
      "Token vectors span 4,096 to 8,192 dimensional latent continuous space.",
      "Rotary Position Embeddings (RoPE) apply complex rotation angles to key and query vectors, preserving relative distance rather than absolute position.",
      "Token fertility directly dictates context window efficiency and downstream API cost."
    ],
    failureModes: "Vocabulary mismatch, fertility fragmentation across non-English scripts, RoPE frequency extrapolation degradation on ultra-long sequences."
  },
  {
    id: "attention",
    label: "Pillar 2: Scaled Dot-Product Attention & KV Cache",
    icon: "⚡",
    color: "#F43F5E",
    tagline: "Dynamic routing of token information and autoregressive state caching",
    summary: "Computes query-key token affinities to build contextualized value representations. During autoregressive decoding, past Key and Value states are cached in VRAM to prevent redundant re-computation.",
    math: "Attention(Q, K, V) = Softmax\\left(\\frac{Q K^T}{\\sqrt{d_k}} + M\\right) V",
    tensorShapes: "Q, K, V: [B, H, S, d_k] → Softmax Scores: [B, H, S, S] → Output: [B, S, d_model]",
    keyPoints: [
      "Multi-Head Attention (MHA) splits d_model into independent subspaces for parallel semantic relations.",
      "Grouped-Query Attention (GQA) shares Key/Value heads across Query heads, cutting memory bandwidth by 8x.",
      "Autoregressive decoding has two distinct phases: Prefill (compute-bound parallel prompt processing) and Decode (memory-bandwidth-bound token-by-token generation).",
      "FlashAttention-2 eliminates quadratic HBM memory reads/writes via GPU SRAM online softmax tiling."
    ],
    failureModes: "KV Cache VRAM exhaustion (OOM), memory bandwidth saturation during high concurrency decode, 'Lost in the middle' attention dispersion."
  },
  {
    id: "ffn",
    label: "Pillar 3: SwiGLU Feed-Forward Networks & RMSNorm",
    icon: "🧩",
    color: "#F59E0B",
    tagline: "Factual knowledge recall and non-linear feature transformation",
    summary: "Where attention mixes information across different tokens, the Feed-Forward Network (FFN) transforms information within each individual token independently. Modern architectures use SwiGLU gating for increased expressivity.",
    math: "SwiGLU(x) = \\left(x W_{gate} \\otimes \\text{SiLU}(x W_{up})\\right) W_{down}",
    tensorShapes: "x: [B, S, d_model] → Hidden: [B, S, d_{ff}] (where d_{ff} ≈ 8/3 · d_model) → Output: [B, S, d_model]",
    keyPoints: [
      "FFN layers contain over 65% of the total parameter count in modern dense LLMs.",
      "Acts as a key-value associative memory store for world knowledge and factual associations.",
      "SwiGLU replaces standard ReLU/GELU with a bilinear gating mechanism.",
      "Pre-Layer RMSNorm normalizes token embeddings by their root-mean-square before attention and FFN blocks, enabling stable training at 100+ layer depths."
    ],
    failureModes: "Gradient explosion during deep backprop without RMSNorm, hallucinated associative memory retrieval under low activation confidence."
  },
  {
    id: "moe",
    label: "Pillar 4: Sparse Mixture of Experts (MoE) & Top-K Routing",
    icon: "🔀",
    color: "#A78BFA",
    tagline: "Sub-linear parameter activation for high parameter capacity at low inference latency",
    summary: "Replaces dense FFN layers with multiple parallel expert networks. A gating router selectively dispatches each token to only top-K experts (e.g. 2 of 8, or 8 of 128), decoupling total parameter size from per-token compute cost.",
    math: "y = \\sum_{i \\in \\text{TopK}} g_i(x) \\cdot \\text{Expert}_i(x), \\quad g = \\text{Softmax}(\\text{TopK}(x W_{router}))",
    tensorShapes: "Token [B, S, d_model] → Router [B, S, num_experts] → Top-2 Experts Selected → Weighted Output [B, S, d_model]",
    keyPoints: [
      "Total parameters can exceed 500B+ while active FLOPs remain equivalent to a 40B-70B dense model.",
      "Load balancing auxiliary loss forces even distribution of tokens across experts to prevent expert collapse.",
      "Expert parallelism enables distributing expert weights across multiple GPU nodes with all-to-all communication.",
      "Enables ultra-fast time-to-first-token (TTFT) and high decode token generation speed."
    ],
    failureModes: "Expert starvation/overload (routing bottleneck), all-to-all network latency bottlenecks across NVLink/InfiniBand clusters, VRAM memory requirements remain at full parameter size."
  }
];

export const FORWARD_PASS_STAGES = [
  {
    step: 1,
    title: "1. Token Ingestion & Embedding",
    module: "Tokenizer + Embedding Table",
    inputShape: "String: 'The quick brown fox'",
    outputShape: "Tokens: [1, 5] → Vectors: [1, 5, 4096]",
    desc: "The prompt text is broken into subword tokens by the BPE tokenizer. Each token ID acts as an index into the learned embedding matrix W_emb, retrieving a 4096-dimensional vector.",
    status: "Input Phase",
    color: "#5EC4C8"
  },
  {
    step: 2,
    title: "2. Rotary Position Encoding (RoPE)",
    module: "RoPE Coordinate Transformation",
    inputShape: "Token Embeddings: [1, 5, 4096]",
    outputShape: "Position-Rotated Vectors: [1, 5, 4096]",
    desc: "Complex 2D rotation matrices are applied to pairs of feature dimensions based on token position. The dot product between two tokens now naturally decays as their token distance increases.",
    status: "Geometry Phase",
    color: "#5EC4C8"
  },
  {
    step: 3,
    title: "3. RMS Normalization (Pre-Norm)",
    module: "RMSNorm Kernel",
    inputShape: "Rotated Vectors: [1, 5, 4096]",
    outputShape: "Normalized Activations: [1, 5, 4096]",
    desc: "Activations are scaled by their root-mean-square: x_norm = x / sqrt(mean(x²) + ε) * γ. This keeps tensor variance strictly bounded across 80+ sequential transformer layers.",
    status: "Stabilization",
    color: "#F59E0B"
  },
  {
    step: 4,
    title: "4. Multi-Head QKV Projection",
    module: "Linear Projections (W_q, W_k, W_v)",
    inputShape: "Normalized [1, 5, 4096]",
    outputShape: "Q, K, V Tensors: [1, 32, 5, 128]",
    desc: "Normalized embeddings are projected into Query (Q), Key (K), and Value (V) tensors split across 32 attention heads (head_dim = 128). In GQA, K and V have fewer heads (e.g. 8).",
    status: "Projection",
    color: "#F43F5E"
  },
  {
    step: 5,
    title: "5. Scaled Dot-Product Attention & Causal Masking",
    module: "FlashAttention Kernel",
    inputShape: "Q, K, V: [1, 32, 5, 128]",
    outputShape: "Contextual Value Vectors: [1, 5, 4096]",
    desc: "Q · K^T / sqrt(128) computes raw pairwise affinity scores. Upper-triangular elements are masked with -infinity (causal mask). Softmax produces attention probabilities, multiplying V.",
    status: "Attention Core",
    color: "#F43F5E"
  },
  {
    step: 6,
    title: "6. Residual Connection + SwiGLU FFN",
    module: "SwiGLU Non-Linear Feed-Forward",
    inputShape: "Attention Output + Input Residual: [1, 5, 4096]",
    outputShape: "FFN Transformed Tokens: [1, 5, 4096]",
    desc: "The attention output is added back to the original token vector (skip connection). Normalized, then passed through SwiGLU gating (expanded to 11,008 dimensions, then projected back).",
    status: "Knowledge Transformation",
    color: "#A78BFA"
  },
  {
    step: 7,
    title: "7. Unembedding & Logits Softmax",
    module: "LM Head + Softmax",
    inputShape: "Final Layer Hidden State: [1, 1, 4096]",
    outputShape: "Probability Distribution: [1, 128000]",
    desc: "The final hidden state of the last token is projected by the unembedding matrix W_unemb to produce logits over the entire 128,000 token vocabulary. Softmax temperature converts logits to sampling probabilities.",
    status: "Output Generation",
    color: "#5EC4C8"
  }
];

export const CALCULATE_KV_CACHE = (seqLen, numLayers, numHeads, headDim, precisionBytes = 2, batchSize = 1) => {
  // Formula: 2 * batch_size * num_layers * num_heads * seq_len * head_dim * precision_bytes
  const totalBytes = 2 * batchSize * numLayers * numHeads * seqLen * headDim * precisionBytes;
  const inMB = totalBytes / (1024 * 1024);
  const inGB = totalBytes / (1024 * 1024 * 1024);
  return {
    bytes: totalBytes,
    mb: +inMB.toFixed(2),
    gb: +inGB.toFixed(3),
    tokensPerSecondPerGB: +(1000 / inGB).toFixed(1)
  };
};

export const PYTORCH_TRANSFORMER_SNIPPET = `# Production PyTorch: Transformer Block with RoPE, GQA, and SwiGLU
import torch
import torch.nn as nn
import torch.nn.functional as F

class RMSNorm(nn.Module):
    def __init__(self, dim: int, eps: float = 1e-6):
        super().__init__()
        self.eps = eps
        self.weight = nn.Parameter(torch.ones(dim))

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # RMS normalization formula: x / sqrt(mean(x^2) + eps) * weight
        variance = x.pow(2).mean(-1, keepdim=True)
        return x * torch.rsqrt(variance + self.eps) * self.weight

class SwiGLUFFN(nn.Module):
    def __init__(self, dim: int, hidden_dim: int):
        super().__init__()
        self.w_gate = nn.Linear(dim, hidden_dim, bias=False)
        self.w_up   = nn.Linear(dim, hidden_dim, bias=False)
        self.w_down = nn.Linear(hidden_dim, dim, bias=False)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # SwiGLU activation: (silu(x W_gate) * (x W_up)) W_down
        return self.w_down(F.silu(self.w_gate(x)) * self.w_up(x))

class GroupedQueryAttention(nn.Module):
    def __init__(self, dim: int, n_q_heads: int = 32, n_kv_heads: int = 8, head_dim: int = 128):
        super().__init__()
        self.n_q_heads = n_q_heads
        self.n_kv_heads = n_kv_heads
        self.head_dim = head_dim
        self.scale = head_dim ** -0.5
        
        self.q_proj = nn.Linear(dim, n_q_heads * head_dim, bias=False)
        self.k_proj = nn.Linear(dim, n_kv_heads * head_dim, bias=False)
        self.v_proj = nn.Linear(dim, n_kv_heads * head_dim, bias=False)
        self.out_proj = nn.Linear(n_q_heads * head_dim, dim, bias=False)

    def forward(self, x: torch.Tensor, kv_cache=None) -> torch.Tensor:
        B, S, _ = x.shape
        q = self.q_proj(x).view(B, S, self.n_q_heads, self.head_dim).transpose(1, 2)
        k = self.k_proj(x).view(B, S, self.n_kv_heads, self.head_dim).transpose(1, 2)
        v = self.v_proj(x).view(B, S, self.n_kv_heads, self.head_dim).transpose(1, 2)
        
        # In production: FlashAttention-2 or PagedAttention kernel handles kv_cache
        # Repeat KV heads to match Q heads (Grouped Query Attention)
        k = k.repeat_interleave(self.n_q_heads // self.n_kv_heads, dim=1)
        v = v.repeat_interleave(self.n_q_heads // self.n_kv_heads, dim=1)
        
        scores = torch.matmul(q, k.transpose(-2, -1)) * self.scale
        # Causal mask ensures token i can only attend to tokens <= i
        causal_mask = torch.triu(torch.full((S, S), float('-inf'), device=x.device), diagonal=1)
        attn_weights = F.softmax(scores + causal_mask, dim=-1)
        
        out = torch.matmul(attn_weights, v).transpose(1, 2).contiguous().view(B, S, -1)
        return self.out_proj(out)
`;

export const PRODUCTION_PRINCIPLES = [
  {
    title: "Prefill vs Decode Decoupling",
    color: "#5EC4C8",
    desc: "Prefill processes user context in parallel (Compute-Bound, GEMM operations saturated). Decode generates one token at a time (Memory-Bandwidth Bound, reading entire KV cache from VRAM per token). Production clusters split nodes into Prefill workers and Decode workers."
  },
  {
    title: "PagedAttention & Memory Virtualization",
    color: "#F43F5E",
    desc: "Standard contiguous KV cache allocation fragments over 60-80% of GPU memory. PagedAttention virtualizes KV memory into non-contiguous physical pages (similar to OS virtual memory), reducing fragmentation waste to under 4% and doubling batch capacity."
  },
  {
    title: "Grouped-Query Attention (GQA) Bandwidth Savings",
    color: "#F59E0B",
    desc: "By sharing 1 Key-Value head across 4 or 8 Query heads, GQA reduces KV cache size by 4x to 8x with near-zero perplexity loss. This is standard in Llama-3, Mistral, and DeepSeek architectures."
  },
  {
    title: "Quantization Trade-offs (FP16 → FP8 → INT4)",
    color: "#A78BFA",
    desc: "FP8 (E4M3 / E5M2) preserves forward pass fidelity while halving VRAM requirements and doubling Tensor Core throughput. INT4 weight-only quantization allows fitting 70B models onto a single 48GB GPU."
  }
];
