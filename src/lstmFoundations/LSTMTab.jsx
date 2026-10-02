import React from 'react';
import LearningTabSkeleton from '../components/learning/LearningTabSkeleton.jsx';

const mono = { fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, monospace" };
const C = { surface: '#161B26', border: '#2A3548', text: '#E2E8F0', muted: '#B8B8C4', teal: '#5EC4C8', coral: '#E8837A', lav: '#C9B8E8', ok: '#6BD4A0', bad: '#E8837A', bg: '#0F1219' };
const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 14 };
const label = (color) => ({ color, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 10, ...mono });
const body = { color: C.text, fontSize: 13, lineHeight: 1.75 };
const muted = { color: C.muted, fontSize: 12.5, lineHeight: 1.7 };

function H({ children, color = C.teal }) {
  return <div style={{ ...label(color), marginTop: 4 }}>{children}</div>;
}
function P({ children }) { return <p style={{ ...body, margin: '0 0 10px' }}>{children}</p>; }

/* Native SVG: LSTM cell with the four gates + cell-state highway */
function LstmCellDiagram() {
  return (
    <svg viewBox="0 0 860 300" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="LSTM cell: forget, input, output gates and cell state">
      <rect x="0" y="0" width="860" height="300" rx="10" fill="#0F1219" />
      {/* cell state highway */}
      <line x1="40" y1="60" x2="820" y2="60" stroke="#5EC4C8" strokeWidth="3" />
      <text x="420" y="48" fill="#5EC4C8" fontSize="12" fontFamily="monospace">cell state  c_t  (gradient highway)</text>
      {/* blocks */}
      {[
        { x: 90, t: 'f_t = σ', s: 'FORGET', c: '#E8837A' },
        { x: 290, t: 'i_t = σ', s: 'INPUT', c: '#5EC4C8' },
        { x: 490, t: '候选 g', s: 'TANH', c: '#C9B8E8' },
        { x: 690, t: 'o_t = σ', s: 'OUTPUT', c: '#E8C37A' },
      ].map((b) => (
        <g key={b.x}>
          <rect x={b.x} y="100" width="110" height="56" rx="8" fill="#161B26" stroke={b.c} strokeWidth="2" />
          <text x={b.x + 55} y="124" fill={b.c} fontSize="13" fontFamily="monospace" textAnchor="middle">{b.t}</text>
          <text x={b.x + 55} y="144" fill="#B8B8C4" fontSize="10" fontFamily="monospace" textAnchor="middle">{b.s}</text>
          {/* down arrows from concat line */}
          <line x1={b.x + 55} y1="80" x2={b.x + 55} y2="100" stroke="#B8B8C4" strokeWidth="1.5" />
        </g>
      ))}
      {/* forget multiplier on highway */}
      <circle cx="145" cy="60" r="13" fill="#0F1219" stroke="#E8837A" strokeWidth="2" />
      <text x="145" y="65" fill="#E8837A" fontSize="13" textAnchor="middle" fontFamily="monospace">×</text>
      {/* input add on highway */}
      <circle cx="345" cy="60" r="13" fill="#0F1219" stroke="#5EC4C8" strokeWidth="2" />
      <text x="345" y="65" fill="#5EC4C8" fontSize="14" textAnchor="middle" fontFamily="monospace">+</text>
      <line x1="345" y1="73" x2="345" y2="100" stroke="#5EC4C8" strokeWidth="1.5" />
      <line x1="145" y1="73" x2="145" y2="100" stroke="#E8837A" strokeWidth="1.5" />
      <line x1="545" y1="80" x2="545" y2="100" stroke="#B8B8C4" strokeWidth="1.5" />
      <line x1="545" y1="156" x2="545" y2="200" stroke="#B8B8C4" strokeWidth="1.5" />
      <line x1="745" y1="156" x2="745" y2="200" stroke="#B8B8C4" strokeWidth="1.5" />
      {/* concat input line */}
      <line x1="40" y1="230" x2="820" y2="230" stroke="#B8B8C4" strokeWidth="1.5" strokeDasharray="5 4" />
      <text x="42" y="252" fill="#B8B8C4" fontSize="11" fontFamily="monospace">[h_(t−1) , x_t]  — previous hidden state concatenated with input</text>
      {/* output to h_t */}
      <line x1="745" y1="60" x2="745" y2="60" stroke="none" />
      <text x="760" y="90" fill="#E8C37A" fontSize="11" fontFamily="monospace">→ h_t</text>
      {/* equations */}
      <text x="42" y="284" fill="#B8B8C4" fontSize="12" fontFamily="monospace">c_t = f_t ⊙ c_(t−1) + i_t ⊙ g_t     h_t = o_t ⊙ tanh(c_t)</text>
    </svg>
  );
}

function Section({ children }) { return <div style={card}>{children}</div>; }

const SECTIONS = [
  {
    id: 'why', icon: '🧩', label: '1. Why sequences are hard',
    render: () => (
      <Section>
        <H>THE PROBLEM VANISHING GRADIENTS SOLVE</H>
        <P>A plain RNN unrolled over time multiplies the same weight matrix W_hh once per step. During backpropagation, gradients also multiply — T times for a T-step sequence. Multiply a number by 0.9 fifty times and it is ~0.005 (vanishes: early steps never learn). Multiply by 1.1 fifty times and it is ~117 (explodes: training diverges).</P>
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, ...mono, fontSize: 12, color: C.coral, lineHeight: 1.8 }}>
          ∂L/∂W ∝ ∏ₜ Jₜ &nbsp; where Jₜ is the per-step Jacobian<br />
          ‖J‖ &lt; 1 → gradients vanish &nbsp;·&nbsp; ‖J‖ &gt; 1 → gradients explode
        </div>
        <P>Result: an RNN can learn the last 5 words of a sentence but effectively cannot learn a subject–verb agreement 50 words apart. Clipping fixes explosions; nothing in the plain architecture fixes vanishing — <strong>the LSTM's cell state is that fix</strong>.</P>
        <H color={C.lav}>ANALOGY</H>
        <P style={muted}>A plain RNN is like rewriting your entire notebook in pencil after every sentence — early pages get smudged into nothing. The LSTM keeps a <em>separate ink page</em> (the cell state) that mostly only gets edited on purpose.</P>
      </Section>
    ),
  },
  {
    id: 'cell', icon: '🔬', label: '2. Inside an LSTM cell',
    render: () => (
      <Section>
        <H>FOUR GATES, ONE HIGHWAY</H>
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
          <LstmCellDiagram />
        </div>
        <div style={{ ...body, ...mono, fontSize: 12.5, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, lineHeight: 2 }}>
          f_t = σ(W_f·[h_(t−1), x_t] + b_f) &nbsp;<span style={{ color: C.coral }}>// forget: what to drop from c_(t−1)</span><br />
          i_t = σ(W_i·[h_(t−1), x_t] + b_i) &nbsp;<span style={{ color: C.teal }}>// input: what new info to admit</span><br />
          g_t = tanh(W_g·[h_(t−1), x_t] + b_g) <span style={{ color: C.lav }}>// candidate: proposed new content</span><br />
          c_t = f_t ⊙ c_(t−1) + i_t ⊙ g_t &nbsp;&nbsp;&nbsp;<span style={{ color: C.ok }}>// state update: MULTIPLY + ADD</span><br />
          o_t = σ(W_o·[h_(t−1), x_t] + b_o) &nbsp;<span style={{ color: '#E8C37A' }}>// output: what of c_t to expose</span><br />
          h_t = o_t ⊙ tanh(c_t)
        </div>
        <H color={C.coral}>WORKED NUMERIC EXAMPLE (one step)</H>
        <P style={muted}>Say c_(t−1) = 1.00, and the gates compute f_t = 0.90, i_t = 0.60, g_t = 0.40, o_t = 0.70:</P>
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, ...mono, fontSize: 12, color: C.text, lineHeight: 1.9 }}>
          c_t = 0.90 × 1.00 + 0.60 × 0.40 = 0.90 + 0.24 = <span style={{ color: C.ok }}>1.14</span><br />
          h_t = 0.70 × tanh(1.14) = 0.70 × 0.814 ≈ <span style={{ color: C.ok }}>0.57</span>
        </div>
        <P style={{ ...muted, marginTop: 10 }}>Why this beats the RNN: the state update is <strong>additive</strong> (c_prev contributes via ×0.9, not ×W⁵⁰). If f_t ≈ 1 the gradient flows along the cell state almost untouched across hundreds of steps — that is the highway in the diagram.</P>
      </Section>
    ),
  },
  {
    id: 'compare', icon: '⚖️', label: '3. LSTM vs GRU vs RNN',
    render: () => (
      <Section>
        <H>WHEN EACH WON, WHAT EACH COSTS</H>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, ...mono }}>
            <thead>
              <tr>
                {['', 'Plain RNN', 'LSTM', 'GRU'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', borderBottom: `1px solid ${C.border}`, color: C.teal, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody style={{ color: C.text }}>
              {[
                ['Gates', 'none', '3 (f, i, o) + cell', '2 (reset, update), no separate cell'],
                ['Parameters / step', 'lowest', '4 × (h+n)·h roughly', '3 × (h+n)·h roughly'],
                ['Long dependencies', 'fails (vanishing)', 'handles via cell state', 'handles, slightly weaker on very long'],
                ['Speed', 'sequential, slowest state', 'sequential, most work', 'sequential, ~25–30% fewer ops than LSTM'],
                ['Peak era', 'pre-2013', '2013–2017 (speech, NMT)', '2014–2019, still fine on small data'],
                ['Use today', 'to explain the problem', 'when data is small/sequential', 'strong default for tiny sequential tasks'],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '8px 10px', borderBottom: `1px solid ${C.border}`, color: j === 0 ? C.lav : C.text, fontWeight: j === 0 ? 600 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P style={{ ...muted, marginTop: 12 }}>Rule of thumb from the era: <strong>GRU if compute is tight and sequences are moderate; LSTM if you need every bit of long-range state; plain RNN only for teaching.</strong> On modern benchmarks with enough data, all three lost to transformers — see section 5.</P>
      </Section>
    ),
  },
  {
    id: 'code', icon: '🐍', label: '4. Hands-on: small LSTM',
    render: () => (
      <Section>
        <H>STEP-BY-STEP: SENTIMENT LSTM (PYTORCH)</H>
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, ...mono, fontSize: 11.5, color: C.text, lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre' }}>
{`import torch, torch.nn as nn

# 1) toy data: sequences of token ids, label 0/1
X = torch.randint(0, 100, (64, 20))     # 64 samples × 20 timesteps
y = torch.randint(0, 2, (64,))

# 2) model: Embedding → LSTM → last hidden state → classifier
class SentimentLSTM(nn.Module):
    def __init__(self, vocab=100, emb=32, hidden=64):
        super().__init__()
        self.emb  = nn.Embedding(vocab, emb)
        self.lstm = nn.LSTM(emb, hidden, batch_first=True)
        self.fc   = nn.Linear(hidden, 2)

    def forward(self, x):
        e = self.emb(x)                       # (B, T, 32)
        out, (h, c) = self.lstm(e)            # h: (1, B, 64) final cell state summary
        return self.fc(h[-1])                 # use last hidden state

# 3) train loop (same as any torch model)
model, opt = SentimentLSTM(), torch.optim.Adam(
    SentimentLSTM().parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()
for epoch in range(5):
    logits = model(X)
    loss = loss_fn(logits, y)
    opt.zero_grad(); loss.backward(); opt.step()
    print(f"epoch {epoch}: loss={loss.item():.3f}")`}
        </div>
        <div style={{ ...muted, marginTop: 10 }}>
          Keras equivalent, one line per layer: <span style={{ color: C.teal, ...mono }}>model.add(tf.keras.layers.LSTM(64, input_shape=(T, F)))</span> — same cell, friendlier API.
          Things to watch: <strong>pack sequences</strong> (padding wastes compute), <strong>gradient clip</strong> (<span style={{ ...mono }}>clip_grad_norm_(…, 1.0)</span>) still helps, and bidirectional (<span style={{ ...mono }}>bidirectional=True</span>) doubles context for classification tasks.
        </div>
      </Section>
    ),
  },
  {
    id: 'transformers', icon: '⚡', label: '5. Why transformers won',
    render: () => (
      <Section>
        <H>THE THREE BOTTLENECKS</H>
        <P><strong>1. Sequential training.</strong> An LSTM must process t−1 before t — you cannot parallelize over time on GPU. Transformers process all positions at once (attention is one matmul), so wall-clock training on same hardware is dramatically faster for long sequences.</P>
        <P><strong>2. Path length.</strong> In an LSTM, signal from token 1 to token 500 travels through 500 cell updates (even if the highway helps, gates still perturb it). Self-attention gives <strong>direct edges between any pair of tokens</strong> — path length 1, in both directions, every layer.</P>
        <P><strong>3. Scale economics.</strong> Pre-2017: better gates on small sequential data. Post-2017: architectures that train well at internet scale won — and LSTMs did not scale the same way (no easy multi-GPU sharding over time, weaker transfer from pretraining).</P>
        <div style={{ background: C.bg, border: `1px solid ${C.teal}55`, borderRadius: 8, padding: 12, ...body, fontSize: 12.5 }}>
          <strong style={{ color: C.teal }}>The honest summary:</strong> LSTMs are not "wrong" — they are the right tool when your dataset is small, your sequence is short, and latency budget is tiny (on-device keyword spotting still ships LSTMs). They lost the frontier because the game moved to parallel pretraining at scale.
        </div>
        <div style={{ marginTop: 12 }}>
          <span style={{ color: C.muted, fontSize: 12 }}>Next in the curriculum: how attention replaces recurrence →</span>
        </div>
      </Section>
    ),
  },
];

const QUIZ = [
  {
    q: 'Why do plain RNNs fail on long sequences?',
    options: ['They cannot store words in memory', 'Gradients are multiplied across time steps and vanish or explode', 'Their hidden state is too small', 'They process one word per epoch'],
    answer: 1,
    explain: 'Backprop through time multiplies one Jacobian per step; ‖J‖<1 vanishes, ‖J‖>1 explodes. Storage size is irrelevant — a bigger hidden state does not fix the gradient path.',
    myth: 'A bigger hidden state fixes long-range dependencies.',
  },
  {
    q: 'What makes the LSTM cell state a "gradient highway"?',
    options: ['It uses tanh activations', 'The state update is additive: c_t = f_t ⊙ c_(t−1) + i_t ⊙ g_t', 'It has four gates instead of one', 'It stores everything verbatim'],
    answer: 1,
    explain: 'The additive path lets gradients flow through time by simple addition instead of repeated matrix multiplication — as long as f_t stays near 1 the old state (and its gradient) survives.',
    myth: 'The four gates are what fix the gradients — remove a gate and it breaks.',
  },
  {
    q: 'In the worked example (c_prev=1.0, f=0.9, i=0.6, g=0.4), what is c_t?',
    options: ['1.00', '1.14', '0.90', '0.57'],
    answer: 1,
    explain: 'c_t = 0.9×1.0 + 0.6×0.4 = 0.9 + 0.24 = 1.14. (0.57 is h_t, the hidden state after the output gate.)',
    myth: 'h_t and c_t are the same thing with different names.',
  },
  {
    q: 'When is a GRU usually preferred over an LSTM today?',
    options: ['When sequences exceed 10k tokens', 'When compute is tight and data is modest — fewer parameters, similar accuracy', 'GRUs always outperform LSTMs', 'Never — LSTMs are strictly better'],
    answer: 1,
    explain: 'The GRU merges gates and drops the separate cell, cutting parameters ~25–30% with near-parity accuracy on moderate tasks. Neither strictly dominates.',
    myth: 'More gates always means better memory.',
  },
  {
    q: 'What is the main architectural reason transformers displaced LSTMs?',
    options: ['Transformers use fewer parameters', 'Attention allows full parallelization over sequence positions and direct token-to-token paths', 'Transformers do not need training data', 'LSTMs cannot do classification'],
    answer: 1,
    explain: 'Training an LSTM is inherently sequential over time; attention is one parallel matmul with path length 1 between any tokens. Scale + parallelism, not raw correctness, decided the shift.',
    myth: 'Transformers won because they understand language better than LSTMs.',
  },
];

export default function LSTMTab({ onSelectTab }) {
  return (
    <LearningTabSkeleton
      eyebrow="FOUNDATIONS · SEQUENCE MODELS"
      title="LSTMs: From Vanishing Gradients to Transformers"
      tagline="The sequence-model background that explains why transformers exist — gates, a worked numeric example, honest trade-offs, and where LSTMs still ship today."
      objectives={[
        'Explain why plain RNNs cannot learn long-range dependencies (vanishing/exploding gradients).',
        'Read the four LSTM gate equations and trace one numeric state update by hand.',
        'Compare RNN vs LSTM vs GRU and say when each is the right tool.',
        'Train a small sequence classifier with an LSTM and interpret its outputs.',
        'Describe the three bottlenecks that made transformers win — and where LSTMs still make sense.',
      ]}
      analogy="A plain RNN is a notebook you rewrite after every sentence (early pages smudge away). An LSTM adds a separate ink page — the cell state — edited only on purpose: the forget gate erases a detail, the input gate writes a new one, and the page survives dozens of edits without degrading. Transformers then replace the notebook entirely with a whiteboard where every word can point at every other word at once."
      sections={SECTIONS}
      quiz={QUIZ}
      prev={{ id: 'promptfundamentals', label: 'Prompt Engineering (soft prerequisite)' }}
      next={{ id: 'llmsampling', label: 'LLM Generation & Sampling' }}
      onSelectTab={onSelectTab}
    />
  );
}
