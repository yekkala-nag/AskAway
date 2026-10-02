// ============================================================================
// LSTMs & xLSTMs DEEP DIVE ENGINE
// Classical LSTM (1997) vs Extended LSTM (xLSTM: sLSTM & mLSTM, Hochreiter 2024)
// ============================================================================

export const LSTM_VS_XLSTM_MATRIX = [
  {
    architecture: "Classical LSTM (1997)",
    memoryCell: "Scalar Memory Cell (C_t ∈ ℝ^d)",
    gatingMechanism: "Sigmoid Gating σ(x) ∈ (0, 1)",
    keyFeature: "Eliminates Vanishing Gradients over RNNs",
    parallelization: "❌ Sequential Execution Only",
    contextHandling: "Moderate context length before saturation"
  },
  {
    architecture: "sLSTM (Scalar xLSTM, 2024)",
    memoryCell: "Scalar Memory Cell with Normalizer State (n_t ∈ ℝ)",
    gatingMechanism: "Exponential Gating exp(x) with Normalization",
    keyFeature: "Higher dynamic range; prevents memory saturation",
    parallelization: "❌ Sequential Recurrent Execution",
    contextHandling: "Enhanced memory retention via exponential tracking"
  },
  {
    architecture: "mLSTM (Matrix xLSTM, 2024)",
    memoryCell: "Matrix Memory Cell (C_t ∈ ℝ^{d × d})",
    gatingMechanism: "Key (k_t), Query (q_t), Value (v_t) Vector Projections",
    keyFeature: "Linear Attention Equivalence + Fully Parallelizable",
    parallelization: "✅ Fully GPU Parallelizable (XLA / CUDA Kernels)",
    contextHandling: "Competitive with Transformers & LLMs on long sequences"
  }
];

export const CALCULATE_CLASSICAL_LSTM_STEP = (x_val, h_prev, c_prev) => {
  // Simple scalar hand calculation step
  // Weights (fixed demo values)
  const W_f = 0.5, W_i = 0.8, W_c = 0.9, W_o = 0.6;
  const U_f = 0.2, U_i = 0.3, U_c = 0.4, U_o = 0.5;

  const sigmoid = (z) => 1 / (1 + Math.exp(-z));

  const f_raw = W_f * x_val + U_f * h_prev;
  const i_raw = W_i * x_val + U_i * h_prev;
  const c_tilde_raw = W_c * x_val + U_c * h_prev;
  const o_raw = W_o * x_val + U_o * h_prev;

  const f_t = sigmoid(f_raw);
  const i_t = sigmoid(i_raw);
  const c_tilde_t = Math.tanh(c_tilde_raw);
  const o_t = sigmoid(o_raw);

  const c_t = f_t * c_prev + i_t * c_tilde_t;
  const h_t = o_t * Math.tanh(c_t);

  return {
    f_t: f_t.toFixed(4),
    i_t: i_t.toFixed(4),
    c_tilde_t: c_tilde_t.toFixed(4),
    o_t: o_t.toFixed(4),
    c_t: c_t.toFixed(4),
    h_t: h_t.toFixed(4)
  };
};

export const CALCULATE_SLSTM_STEP = (x_val, h_prev, c_prev, n_prev) => {
  // sLSTM Exponential Gating with Normalizer state
  const W_f = 0.5, W_i = 0.8, W_c = 0.9, W_o = 0.6;
  const U_f = 0.2, U_i = 0.3, U_c = 0.4, U_o = 0.5;

  const exp_f = Math.exp(W_f * x_val + U_f * h_prev);
  const exp_i = Math.exp(W_i * x_val + U_i * h_prev);
  const c_tilde_t = Math.tanh(W_c * x_val + U_c * h_prev);
  const exp_o = Math.exp(W_o * x_val + U_o * h_prev);

  // Normalizer state update: n_t = exp_f * n_prev + exp_i
  const n_t = exp_f * n_prev + exp_i;

  // Stabilized Cell State update: C_t = (exp_f * c_prev + exp_i * c_tilde_t)
  const c_t_unnorm = exp_f * c_prev + exp_i * c_tilde_t;
  const c_t_norm = c_t_unnorm / (n_t || 1e-8);

  const h_t = (exp_o / (exp_o + 1)) * Math.tanh(c_t_norm);

  return {
    exp_f: exp_f.toFixed(4),
    exp_i: exp_i.toFixed(4),
    n_t: n_t.toFixed(4),
    c_t_norm: c_t_norm.toFixed(4),
    h_t: h_t.toFixed(4)
  };
};

export const PYTORCH_XLSTM_CODE = `# ============================================================================
# EXTENDED LONG SHORT-TERM MEMORY (xLSTM) PYTORCH IMPLEMENTATION
# Featuring sLSTM (Exponential Gating) & mLSTM (Matrix Memory Key-Value Cell)
# Reference: Hochreiter et al. (May 2024, arXiv:2405.04517)
# ============================================================================

import torch
import torch.nn as nn
import torch.nn.functional as F

class sLSTMCell(nn.Module):
    """sLSTM Cell with Exponential Gating & Normalizer State"""
    def __init__(self, input_dim, hidden_dim):
        super().__init__()
        self.hidden_dim = hidden_dim
        self.w_f = nn.Linear(input_dim + hidden_dim, hidden_dim)
        self.w_i = nn.Linear(input_dim + hidden_dim, hidden_dim)
        self.w_c = nn.Linear(input_dim + hidden_dim, hidden_dim)
        self.w_o = nn.Linear(input_dim + hidden_dim, hidden_dim)

    def forward(self, x, states):
        h_prev, c_prev, n_prev = states
        combined = torch.cat([x, h_prev], dim=-1)

        # Exponential Gating
        f_t = torch.exp(self.w_f(combined))
        i_t = torch.exp(self.w_i(combined))
        c_tilde = torch.tanh(self.w_c(combined))
        o_t = torch.sigmoid(self.w_o(combined))

        # Update Normalizer state: n_t = f_t * n_{t-1} + i_t
        n_t = f_t * n_prev + i_t

        # Update Cell state: C_t = f_t * C_{t-1} + i_t * C_tilde
        c_t = f_t * c_prev + i_t * c_tilde

        # Stabilized Hidden state: h_t = o_t * tanh(C_t / n_t)
        h_t = o_t * torch.tanh(c_t / (n_t + 1e-8))

        return h_t, (h_t, c_t, n_t)


class mLSTMCell(nn.Module):
    """mLSTM Cell with Matrix Memory (C_t in R^{d x d}) & Key-Value Retrieval"""
    def __init__(self, input_dim, head_dim):
        super().__init__()
        self.head_dim = head_dim
        self.w_q = nn.Linear(input_dim, head_dim)
        self.w_k = nn.Linear(input_dim, head_dim)
        self.w_v = nn.Linear(input_dim, head_dim)
        self.w_i = nn.Linear(input_dim, 1)
        self.w_f = nn.Linear(input_dim, 1)

    def forward(self, x, C_prev, n_prev):
        # Key, Query, Value projections
        q_t = self.w_q(x)  # (B, head_dim)
        k_t = self.w_k(x)  # (B, head_dim)
        v_t = self.w_v(x)  # (B, head_dim)

        f_t = torch.exp(self.w_f(x))  # (B, 1)
        i_t = torch.exp(self.w_i(x))  # (B, 1)

        # Matrix Memory Update: C_t = f_t * C_{t-1} + i_t * (v_t (k_t)^T)
        kv_outer = torch.bmm(v_t.unsqueeze(2), k_t.unsqueeze(1))  # (B, d, d)
        C_t = f_t.unsqueeze(2) * C_prev + i_t.unsqueeze(2) * kv_outer

        # Normalizer update: n_t = f_t * n_{t-1} + i_t * k_t
        n_t = f_t * n_prev + i_t * k_t

        # Matrix Query Retrieval: h_t = (C_t q_t) / max(1, |n_t^T q_t|)
        C_q = torch.bmm(C_t, q_t.unsqueeze(2)).squeeze(2)
        norm_factor = torch.abs(torch.bmm(n_t.unsqueeze(1), q_t.unsqueeze(2))).squeeze(2) + 1e-8
        h_t = C_q / norm_factor

        return h_t, C_t, n_t

# Instantiate & Verify Shapes
batch_size, input_dim, hidden_dim = 16, 64, 128
slstm = sLSTMCell(input_dim, hidden_dim)

x = torch.randn(batch_size, input_dim)
h = torch.zeros(batch_size, hidden_dim)
c = torch.zeros(batch_size, hidden_dim)
n = torch.ones(batch_size, hidden_dim)

h_out, (h_next, c_next, n_next) = slstm(x, (h, c, n))
print("sLSTM Output Shape:", h_out.shape)  # Output: torch.Size([16, 128])
`;
