import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassCard } from '../components/ui/CleanInfographics.jsx';
import {
  LSTM_VS_XLSTM_MATRIX,
  CALCULATE_CLASSICAL_LSTM_STEP,
  CALCULATE_SLSTM_STEP,
  PYTORCH_XLSTM_CODE
} from './xlstmEngine.js';
import DataTable from '../components/ui/DataTable.jsx';
import Workflow from '../components/ui/Workflow.jsx';
import { Reveal, AnimatedNumber } from '../components/ui/AnimatedReveal.jsx';

const { Container, Section, Grid, Flex, Stack } = Primitives;

/** Native recreation: classical scalar-memory LSTM vs xLSTM (sLSTM + mLSTM). */
function LstmComparisonPanel() {
  const mono = {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: 12, color: '#7FE3DC', background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(94,196,200,0.25)', borderRadius: 6,
    padding: '8px 10px', marginTop: 8, lineHeight: 1.7, whiteSpace: 'pre-wrap',
  };
  const pts = { fontSize: 12.5, color: '#CBD5E1', lineHeight: 1.65, margin: '6px 0 0', paddingLeft: 16 };
  return (
    <Panel
      title="Classical LSTM vs Extended LSTM (xLSTM)"
      sub="Scalar memory with sigmoid gates — versus exponential gating with a normalizer plus a matrix memory with key/query/value projections."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        <GlassCard color="#6A9BD8" icon="refresh" title="Classical LSTM · Scalar Memory">
          <ul style={pts}>
            <li>Forget / input / output sigmoid gates</li>
            <li>Single scalar cell C[t] with tanh output</li>
            <li>Inputs: x[t], h[t-1]</li>
          </ul>
          <div style={mono}>{'C[t] = f[t]*C[t-1] + i[t]*C~[t]\nh[t] = o[t] * tanh(C[t])'}</div>
        </GlassCard>
        <GlassCard color="#A78BFA" icon="zap" title="sLSTM · Exponential Gating">
          <ul style={pts}>
            <li>Exponential gates replace sigmoids</li>
            <li>Normalizer state n[t] stabilizes scale</li>
            <li>n[t] = f[t]*n[t-1] + i[t]</li>
          </ul>
          <div style={mono}>{'f[t] = exp(W_f · x[t])\nscalar memory, normalized'}</div>
        </GlassCard>
        <GlassCard color="#34D399" icon="cpu" title="mLSTM · Matrix Memory">
          <ul style={pts}>
            <li>Memory cell is a matrix C in R^(dxd)</li>
            <li>Key / query / value projections</li>
            <li>Covariance-style outer-product update</li>
          </ul>
          <div style={mono}>{'C[t] = f[t]*C[t-1] + i[t]*(v[t]·k[t]^T)'}</div>
        </GlassCard>
      </div>
    </Panel>
  );
}

export default function XLSTMTab() {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'handcalc' | 'slstm' | 'code'

  // Hand Calculation Inputs
  const [xVal, setXVal] = useState(1.2);
  const [hPrev, setHPrev] = useState(0.8);
  const [cPrev, setCPrev] = useState(0.5);

  // sLSTM Exponential Gating Inputs
  const [xValS, setXValS] = useState(1.2);
  const [hPrevS, setHPrevS] = useState(0.8);
  const [cPrevS, setCPrevS] = useState(0.5);
  const [nPrevS, setNPrevS] = useState(1.0);

  const classicalResult = CALCULATE_CLASSICAL_LSTM_STEP(xVal, hPrev, cPrev);
  const slstmResult = CALCULATE_SLSTM_STEP(xValS, hPrevS, cPrevS, nPrevS);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Recurrent Architecture Revival]"
        title="Deep Dive into LSTMs & Extended LSTMs (xLSTM) by Hand ✍️"
        description="Explore the evolution of Long Short-Term Memory networks (1997) leading into Extended LSTM (xLSTM, Hochreiter 2024). Discover how Exponential Gating (sLSTM) and Matrix Memory Cells (mLSTM) eliminate memory saturation and enable GPU-parallelized linear attention recurrence."
        metrics={[
          { label: 'Original Paper', value: 'Hochreiter (1997)' },
          { label: 'xLSTM Revival', value: 'Hochreiter (2024)' },
          { label: 'sLSTM Innovation', value: 'Exponential Gating' },
          { label: 'mLSTM Innovation', value: 'Matrix Memory (Key-Value)' }
        ]}
      />

      <Container size="wide">
        {/* NATIVE GLASS RECREATION */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <LstmComparisonPanel />
        </div>

        {/* SUBTAB NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: 'var(--ds-space-2)',
          marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)',
          padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)',
          border: '1px solid var(--ds-color-border-subtle)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'overview', icon: '🧩', label: '1. LSTM vs xLSTM Overview', desc: 'Scalar vs Matrix Memory & Parallelism' },
            { id: 'handcalc', icon: '✍️', label: '2. Hand Calculation Lab', desc: 'Numerical gate trace step-by-step' },
            { id: 'slstm', icon: '📈', label: '3. sLSTM Exponential Gating', desc: 'exp(x) gating & normalizer state' },
            { id: 'code', icon: '🐍', label: '4. mLSTM & PyTorch Code Engine', desc: 'Matrix memory & PyTorch implementation' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '210px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)',
                border: 'none',
                background: activeSubTab === tab.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent',
                color: activeSubTab === tab.id ? 'white' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--ds-font-size-body)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: OVERVIEW ─── */}
        {activeSubTab === 'overview' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🌀 The Revival of Recurrence: Classical LSTM vs xLSTM</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    While Transformers conquered language modeling via parallel self-attention, their quadratic time complexity $O(N^2)$ creates bottlenecks for long context lengths. Sepp Hochreiter's <strong>xLSTM (2024)</strong> revives LSTMs by introducing <strong>sLSTM</strong> (exponential gating) and <strong>mLSTM</strong> (matrix memory cells with parallel Key-Value retrieval).
                  </p>
                </div>

                {/* COMPARISON TABLE */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                      <thead>
                        <tr style={{ background: 'var(--ds-color-bg-canvas)', textAlign: 'left', borderBottom: '2px solid var(--ds-color-border-subtle)' }}>
                          <th style={{ padding: '10px' }}>Architecture</th>
                          <th style={{ padding: '10px' }}>Memory Cell Structure</th>
                          <th style={{ padding: '10px' }}>Gating Function</th>
                          <th style={{ padding: '10px' }}>GPU Parallelizability</th>
                          <th style={{ padding: '10px' }}>Long Context Handling</th>
                        </tr>
                      </thead>
                      <tbody>
                        {LSTM_VS_XLSTM_MATRIX.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.architecture}</td>
                            <td style={{ padding: '10px', color: 'var(--ds-color-text-secondary)' }}>{row.memoryCell}</td>
                            <td style={{ padding: '10px', fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{row.gatingMechanism}</td>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: row.parallelization.includes('Fully') ? '#5EC4C8' : '#ef4444' }}>
                              {row.parallelization}
                            </td>
                            <td style={{ padding: '10px', fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{row.contextHandling}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: HAND CALCULATION LAB ─── */}
        {activeSubTab === 'handcalc' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>✍️ Classical LSTM Step-by-Step Hand Calculation Lab</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Trace the exact numerical updates inside a classical LSTM block: Forget Gate ($f_t$), Input Gate ($i_t$), Candidate Memory ($\tilde{C}_t$), Output Gate ($o_t$), Cell State ($C_t$), and Hidden State ($h_t$).
                  </p>
                </div>

                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={4}>
                    <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Input Value ($x_t = {xVal}$):</label>
                        <input type="range" min="-3.0" max="3.0" step="0.1" value={xVal} onChange={e => setXVal(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Previous Hidden ($h_{'{t-1}'} = {hPrev}$):</label>
                        <input type="range" min="-3.0" max="3.0" step="0.1" value={hPrev} onChange={e => setHPrev(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Previous Cell ($C_{'{t-1}'} = {cPrev}$):</label>
                        <input type="range" min="-3.0" max="3.0" step="0.1" value={cPrev} onChange={e => setCPrev(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                    </Grid>

                    <Grid columns={{ base: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                      <Card style={{ padding: '12px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #ef4444' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>FORGET GATE f_t:</strong>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ef4444' }}>{classicalResult.f_t}</div>
                      </Card>

                      <Card style={{ padding: '12px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>INPUT GATE i_t:</strong>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3A9B9F' }}>{classicalResult.i_t}</div>
                      </Card>

                      <Card style={{ padding: '12px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #f59e0b' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>CANDIDATE C~_t:</strong>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>{classicalResult.c_tilde_t}</div>
                      </Card>

                      <Card style={{ padding: '12px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #8b5cf6' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>OUTPUT GATE o_t:</strong>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#8b5cf6' }}>{classicalResult.o_t}</div>
                      </Card>
                    </Grid>

                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>UPDATED CELL STATE C_t:</strong>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3A9B9F' }}>{classicalResult.c_t}</div>
                      </Card>

                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #06b6d4' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>UPDATED HIDDEN STATE h_t:</strong>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#06b6d4' }}>{classicalResult.h_t}</div>
                      </Card>
                    </Grid>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: sLSTM EXPONENTIAL GATING ─── */}
        {activeSubTab === 'slstm' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📈 sLSTM Exponential Gating & Normalizer State Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    In sLSTM, sigmoid gates are replaced by exponential functions $\exp(W x + b)$, allowing the network to revise previous memory decisions drastically. The normalizer state $n_t = f_t n_{t-1} + i_t$ stabilizes the memory output to prevent numerical explosion.
                  </p>
                </div>

                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={4}>
                    <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                      <div>
                        <label style={{ display: 'block', fontSize: '11px' }}>x_t = {xValS}</label>
                        <input type="range" min="-2.0" max="2.0" step="0.1" value={xValS} onChange={e => setXValS(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px' }}>h_{'{t-1}'} = {hPrevS}</label>
                        <input type="range" min="-2.0" max="2.0" step="0.1" value={hPrevS} onChange={e => setHPrevS(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px' }}>C_{'{t-1}'} = {cPrevS}</label>
                        <input type="range" min="-2.0" max="2.0" step="0.1" value={cPrevS} onChange={e => setCPrevS(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px' }}>n_{'{t-1}'} = {nPrevS}</label>
                        <input type="range" min="0.1" max="5.0" step="0.1" value={nPrevS} onChange={e => setNPrevS(Number(e.target.value))} style={{ width: '100%' }} />
                      </div>
                    </Grid>

                    <Grid columns={{ base: '1fr 1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                      <Card style={{ padding: '12px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #ef4444' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>EXP FORGET f_t = exp(·):</strong>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ef4444' }}>{slstmResult.exp_f}</div>
                      </Card>

                      <Card style={{ padding: '12px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>EXP INPUT i_t = exp(·):</strong>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3A9B9F' }}>{slstmResult.exp_i}</div>
                      </Card>

                      <Card style={{ padding: '12px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>NORMALIZER STATE n_t:</strong>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3A9B9F' }}>{slstmResult.n_t}</div>
                      </Card>
                    </Grid>

                    <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #06b6d4' }}>
                      <div style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-body)' }}>
                        Normalized Cell State C_t / n_t = <strong>{slstmResult.c_t_norm}</strong> | Final Hidden h_t = <strong>{slstmResult.h_t}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                        Exponential gating allows key information to override previous memories without saturating at 1.0.
                      </div>
                    </Card>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: mLSTM & PYTORCH CODE ENGINE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🐍 Production PyTorch xLSTM Code Engine</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete production PyTorch implementation of `sLSTMCell` (exponential gating) and `mLSTMCell` (matrix memory with Key, Query, Value linear attention equivalence).
                  </p>
                </div>

                <CodeBlock language="python" code={PYTORCH_XLSTM_CODE} />

                <Callout type="success">
                  <strong>xLSTM Paradigm Takeaway:</strong> By replacing scalar memory with matrix memory (C_t in R^(d x d)) and sigmoid gates with exponential gates, xLSTM matches Transformer performance while maintaining linear O(N) inference context memory efficiency.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      {/* ─── INTERACTIVE ENHANCEMENTS: TABLE + WORKFLOW + ANIMATION ─── */}
      <Stack gap={6} style={{ marginTop: 'var(--ds-space-8)' }}>
        <Reveal variant="rise">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--ds-space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--ds-font-size-h2)' }}>🧬 Interactive xLSTM Lab</h3>
            <Badge variant="module" moduleId="context">Compare · Trace</Badge>
          </div>
        </Reveal>

        <Reveal variant="rise" delay={60}>
          <DataTable
            caption="LSTM (1997) vs xLSTM (2024) — Architecture Matrix"
            searchable
            columns={[
              { key: 'architecture', label: 'Architecture', sortable: false },
              { key: 'memoryCell', label: 'Memory Cell', sortable: false },
              { key: 'gatingMechanism', label: 'Gating', sortable: false },
              { key: 'parallelization', label: 'Parallelization', sortable: false },
              { key: 'contextHandling', label: 'Context Handling', sortable: false },
            ]}
            rows={LSTM_VS_XLSTM_MATRIX}
            rowKey={(r) => r.architecture}
          />
        </Reveal>

        <Reveal variant="rise" delay={120}>
          <Workflow
            accent="context"
            accentLabel="xLSTM Cell"
            title="From Scalar LSTM to Matrix Memory"
            description="How xLSTM extends classical recurrence. Hit ▶ Play to animate."
            steps={[
              { title: 'Classical LSTM (1997)', description: 'Scalar memory cell with sigmoid gating solves vanishing gradients but runs strictly sequentially.', icon: '🪙' },
              { title: 'sLSTM (Scalar xLSTM)', description: 'Adds exponential gating + a normalizer state n_t for higher dynamic range and no memory saturation.', icon: '⚡' },
              { title: 'mLSTM (Matrix xLSTM)', description: 'Matrix memory cell C_t ∈ ℝ^{d×d} with key/query/value projections — equivalent to linear attention.', icon: '🔷' },
              { title: 'Full GPU Parallelism', description: 'mLSTM is fully parallelizable on XLA/CUDA, competing with Transformers on long sequences.', icon: '🚀' },
            ]}
          />
        </Reveal>

        <Reveal variant="scale" delay={180}>
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)', display: 'flex', gap: 'var(--ds-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ds-color-text-tertiary)' }}>mLSTM Parallelism</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--ds-color-module-context-primary)' }}>
                <AnimatedNumber value={100} suffix="%" />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              The matrix-memory mLSTM is <strong>fully GPU parallelizable</strong> — the key advantage that lets xLSTM
              match Transformers on long-context tasks while keeping RNN-style constant inference cost.
            </div>
          </Card>
        </Reveal>
      </Stack>

      </Container>
    </div>
  );
}
