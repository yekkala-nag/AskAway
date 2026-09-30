import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassBar } from '../components/ui/CleanInfographics.jsx';
import {
  SSL_COMPARISON_MATRIX,
  CALCULATE_BYOL_LOSS,
  CALCULATE_EMA_UPDATE,
  PYTORCH_BYOL_CODE
} from './byolEngine.js';
import ZoomableImage from '../components/ui/ZoomableImage.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Workflow from '../components/ui/Workflow.jsx';
import { Reveal, AnimatedNumber } from '../components/ui/AnimatedReveal.jsx';

const { Container, Section, Grid, Flex, Stack } = Primitives;

/** Native recreation: twin networks, stop-gradient, and slow-moving targets. */
function ByolPanel() {
  const mono = {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: 12, color: '#7FE3DC', background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(94,196,200,0.25)', borderRadius: 6,
    padding: '8px 10px', marginTop: 8, lineHeight: 1.7, textAlign: 'center',
  };
  return (
    <Panel
      title="Bootstrap Your Own Latent (BYOL) — Learning Without Labels"
      sub="Two augmented views, two networks, zero negative pairs: the online net predicts, the target net drifts slowly behind."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar color="#5EC4C8" icon="eye" index="1." title="Two Views" detail="One image → two stochastic augmentations (v and v′). Same content, different pixels — the only supervision signal." />
        <GlassBar color="#E8C558" icon="cpu" index="2." title="Online Network (Trains)" detail="Encoder → projector → predictor. Gradient descent updates every weight; its prediction is L2-normalized before the loss." />
        <GlassBar color="#A78BFA" icon="shield" index="3." title="Target Network (No Gradients)" detail="Encoder → projector with a hard stop-gradient. Updated only by exponential moving average (decay 0.99) — a slow, stable teacher that cannot collapse." />
        <GlassBar color="#34D399" icon="check" index="4." title="MSE Loss, No Negatives" detail="Mean-squared error between normalized prediction and target representation. No contrastive pairs, no large batches required." />
      </div>
      <div style={mono}>target = stop_gradient(projector(encoder(v′))) · EMA decay 0.99</div>
    </Panel>
  );
}

export default function BYOLTab() {
  const [activeSubTab, setActiveSubTab] = useState('comparison'); // 'comparison' | 'ema' | 'loss' | 'code'

  // EMA simulator state
  const [tauVal, setTauVal] = useState(0.99);
  const [onlineWeight, setOnlineWeight] = useState(2.5);
  const [targetWeight, setTargetWeight] = useState(1.0);

  // Vector Loss simulator state
  const [pVal1, setPVal1] = useState(0.8);
  const [pVal2, setPVal2] = useState(0.6);
  const [zVal1, setZVal1] = useState(0.7);
  const [zVal2, setZVal2] = useState(0.71);

  const emaResult = CALCULATE_EMA_UPDATE(onlineWeight, targetWeight, tauVal);
  const lossResult = CALCULATE_BYOL_LOSS([pVal1, pVal2], [zVal1, zVal2]);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Self-Supervised Vision Deep Dive]"
        title="Bootstrap Your Own Latent (BYOL): Self-Supervised Learning without Negative Pairs"
        description="DeepMind's paradigm-shifting self-supervised representation learning framework (Grill et al., NeurIPS 2020). Learn how asymmetric online-target networks and Exponential Moving Average (EMA) eliminate representation collapse without requiring negative samples."
        metrics={[
          { label: 'Negative Pairs', value: '0 (Not Required)' },
          { label: 'Target Update', value: 'EMA (τ = 0.99)' },
          { label: 'Top-1 ImageNet', value: '74.3% Accuracy' },
          { label: 'Loss Metric', value: 'L2 Cosine MSE' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <ByolPanel />
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
            { id: 'comparison', icon: '🛡️', label: '1. No Negative Pairs Paradigm', desc: 'Contrastive vs Non-Contrastive SSL' },
            { id: 'ema', icon: '⚙️', label: '2. Dual-Network & Target EMA', desc: 'Momentum weight updates simulation' },
            { id: 'loss', icon: '🧮', label: '3. Cosine MSE Loss Lab', desc: 'Interactive L2 normalized loss' },
            { id: 'code', icon: '🐍', label: '4. PyTorch BYOL Code Engine', desc: 'Production PyTorch implementation' }
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

        {/* ─── SUBTAB 1: SSL COMPARISON ─── */}
        {activeSubTab === 'comparison' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛡️ The Self-Supervised Revolution: Eliminating Negative Pairs</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Traditional contrastive learning (SimCLR, MoCo) requires thousands of negative image pairs to prevent representation collapse (where networks map all images to a constant vector). BYOL proved that combining an <strong>Asymmetric Predictor MLP</strong>, a <strong>Stop-Gradient on Target</strong>, and a <strong>Slow Target EMA</strong> prevents collapse without any negative pairs.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #ef4444' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>🔴 Contrastive SSL (SimCLR / MoCo)</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
                      <li><strong>Negative Pairs Required:</strong> Must compare positive view against 4096+ negative samples.</li>
                      <li><strong>Massive Batch Sizes:</strong> Requires GPU clusters (batch size 4096 in SimCLR).</li>
                      <li><strong>Sensitivity to Augmentation:</strong> Performance drops if negative sampling strategies are suboptimal.</li>
                    </ul>
                  </Card>

                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#3A9B9F' }}>🟢 Non-Contrastive BYOL (DeepMind)</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
                      <li><strong>Zero Negative Pairs:</strong> Trained purely by predicting target representation of augmented views.</li>
                      <li><strong>Memory Efficient:</strong> Works robustly on standard single-GPU batch sizes (256-512).</li>
                      <li><strong>Asymmetric Stability:</strong> Predictor MLP + Target EMA creates an evolving representation anchor.</li>
                    </ul>
                  </Card>
                </Grid>

                {/* COMPARISON MATRIX TABLE */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                      <thead>
                        <tr style={{ background: 'var(--ds-color-bg-canvas)', textAlign: 'left', borderBottom: '2px solid var(--ds-color-border-subtle)' }}>
                          <th style={{ padding: '10px' }}>Framework</th>
                          <th style={{ padding: '10px' }}>Negative Pairs</th>
                          <th style={{ padding: '10px' }}>Target Mechanism</th>
                          <th style={{ padding: '10px' }}>Collapse Prevention Strategy</th>
                          <th style={{ padding: '10px' }}>ImageNet Top-1 Probe</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SSL_COMPARISON_MATRIX.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.architecture}</td>
                            <td style={{ padding: '10px', color: row.negativePairs.includes('Not Required') ? '#5EC4C8' : '#ef4444', fontWeight: 'bold' }}>
                              {row.negativePairs}
                            </td>
                            <td style={{ padding: '10px', fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{row.targetMechanism}</td>
                            <td style={{ padding: '10px', fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{row.collapsePrevention}</td>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#3A9B9F' }}>{row.linearProbeAccuracy}</td>
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

        {/* ─── SUBTAB 2: TARGET EMA SIMULATOR ─── */}
        {activeSubTab === 'ema' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚙️ Dual-Network & Target Network EMA Simulator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Target network weights (ξ) are never updated via gradients (`Stop-Gradient`). Instead, they smoothly follow online network weights (θ) via an Exponential Moving Average (EMA):
                  </p>
                  <div style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderRadius: 'var(--ds-radius-md)', fontFamily: 'var(--ds-font-family-mono)', marginTop: '8px', fontSize: 'var(--ds-font-size-caption)', textAlign: 'center' }}>
                    ξ ← τ · ξ + (1 - τ) · θ
                  </div>
                </div>

                {/* EMA CALCULATOR SLIDERS */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={4}>
                    <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Simulate Weight Momentum Update:</strong>
                    <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                          EMA Momentum (τ = {tauVal}):
                        </label>
                        <input
                          type="range"
                          min="0.90"
                          max="0.999"
                          step="0.001"
                          value={tauVal}
                          onChange={(e) => setTauVal(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                          Online Weight (θ = {onlineWeight}):
                        </label>
                        <input
                          type="range"
                          min="0.0"
                          max="5.0"
                          step="0.1"
                          value={onlineWeight}
                          onChange={(e) => setOnlineWeight(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                          Target Weight (ξ = {targetWeight}):
                        </label>
                        <input
                          type="range"
                          min="0.0"
                          max="5.0"
                          step="0.1"
                          value={targetWeight}
                          onChange={(e) => setTargetWeight(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </Grid>

                    {/* LIVE UPDATED TARGET WEIGHT */}
                    <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                      <div style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-body)' }}>
                        ξ_new = {tauVal} × {targetWeight} + (1 - {tauVal}) × {onlineWeight} = <strong>{emaResult.updatedTarget}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                        Slow target network updates prevent representation collapse while continuously supplying an evolving representation baseline.
                      </div>
                    </Card>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: COSINE MSE LOSS LAB ─── */}
        {activeSubTab === 'loss' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧮 Interactive Normalized Cosine MSE Loss Lab</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    BYOL minimizes the mean squared error between L2-normalized predictor outputs q_θ(z) and target projections z'_ξ:
                  </p>
                  <div style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderRadius: 'var(--ds-radius-md)', fontFamily: 'var(--ds-font-family-mono)', marginTop: '8px', fontSize: 'var(--ds-font-size-caption)', textAlign: 'center' }}>
                    L = 2 - 2 · CosineSimilarity(q_θ(z), z'_ξ)
                  </div>
                </div>

                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={4}>
                    <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Adjust Vector Elements:</strong>
                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                      <div>
                        <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F' }}>Online Predictor Vector q_θ(z):</strong>
                        <div style={{ marginTop: '6px' }}>
                          <label style={{ display: 'block', fontSize: '11px' }}>Dim 1: {pVal1}</label>
                          <input type="range" min="-2.0" max="2.0" step="0.1" value={pVal1} onChange={e => setPVal1(Number(e.target.value))} style={{ width: '100%' }} />
                          <label style={{ display: 'block', fontSize: '11px', marginTop: '4px' }}>Dim 2: {pVal2}</label>
                          <input type="range" min="-2.0" max="2.0" step="0.1" value={pVal2} onChange={e => setPVal2(Number(e.target.value))} style={{ width: '100%' }} />
                        </div>
                      </div>

                      <div>
                        <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F' }}>Target Projection Vector z'_ξ:</strong>
                        <div style={{ marginTop: '6px' }}>
                          <label style={{ display: 'block', fontSize: '11px' }}>Dim 1: {zVal1}</label>
                          <input type="range" min="-2.0" max="2.0" step="0.1" value={zVal1} onChange={e => setZVal1(Number(e.target.value))} style={{ width: '100%' }} />
                          <label style={{ display: 'block', fontSize: '11px', marginTop: '4px' }}>Dim 2: {zVal2}</label>
                          <input type="range" min="-2.0" max="2.0" step="0.1" value={zVal2} onChange={e => setZVal2(Number(e.target.value))} style={{ width: '100%' }} />
                        </div>
                      </div>
                    </Grid>

                    <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>COSINE SIMILARITY:</strong>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3A9B9F' }}>
                          {lossResult.cosineSim}
                        </div>
                      </Card>

                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>BYOL REGRESSION LOSS (2 - 2·cos):</strong>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3A9B9F' }}>
                          {lossResult.byolLoss}
                        </div>
                      </Card>
                    </Grid>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PYTORCH BYOL CODE ENGINE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🐍 Production PyTorch BYOL Implementation</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete production PyTorch implementation featuring `OnlineNetwork` (Encoder, Projector, Predictor), `TargetNetwork` (EMA update), `StopGradient`, and `SymmetricMSELoss`.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTORCH_BYOL_CODE} />

                <Callout type="success">
                  <strong>Deep Learning Takeaway:</strong> BYOL demonstrated that self-supervised representations can be learned by bootstrapping from an evolving target representation network without needing negative samples, inspiring modern architectures like DINO and DINOv2.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      {/* ─── INTERACTIVE ENHANCEMENTS: IMAGE + TABLE + WORKFLOW + ANIMATION ─── */}
      <Stack gap={6} style={{ marginTop: 'var(--ds-space-8)' }}>
        <Reveal variant="rise">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--ds-space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--ds-font-size-h2)' }}>🎯 Interactive BYOL Lab</h3>
            <Badge variant="module" moduleId="rag">Image · Workflow · Table</Badge>
          </div>
          <p style={{ marginTop: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Tap the architecture hotspots, walk the training loop, and compare self-supervised methods head-to-head.
          </p>
        </Reveal>

        <Reveal variant="rise" delay={60}>
          <ZoomableImage
            src="/assets/byol_self_supervised_arch.png"
            title="BYOL Self-Supervised Architecture"
            caption="Tap the numbered hotspots to inspect the online/target networks and predictor; click the figure for a zoomable fullscreen view."
            accent="rag"
            hotspots={[
              { x: 20, y: 30, label: 'Online Network (Encoder + Predictor)', title: 'Online Branch', body: 'Augmented view x′a feeds an encoder plus an extra predictor MLP q_θ — the only trainable predictor.' },
              { x: 60, y: 30, label: 'Target Network (EMA)', title: 'Slow Target', body: 'Same encoder architecture updated via exponential moving average (τ≈0.99), with NO predictor and a stop-gradient.' },
              { x: 40, y: 62, label: 'Predictor q_θ', title: 'Asymmetry', body: 'The predictor is what prevents representational collapse without needing negative pairs.' },
              { x: 80, y: 62, label: 'EMA Update (τ≈0.99)', title: 'Momentum', body: 'Target weights drift slowly toward online weights, stabilizing training.' },
            ]}
          />
        </Reveal>

        <Reveal variant="rise" delay={120}>
          <Workflow
            accent="rag"
            accentLabel="Training Loop"
            title="BYOL Forward–Backward Loop"
            description="One BYOL training step. Hit ▶ Play to animate."
            steps={[
              { title: 'Two Augmented Views', description: 'Sample two stochastic augmentations v and v′ of the same image.', icon: '🖼️' },
              { title: 'Online Encode + Predict', description: 'Encoder f_θ(v) → projector → predictor q_θ yields prediction p_θ.', icon: '🟢' },
              { title: 'Target Encode (SG)', description: 'Target network f_ξ(v′) with stop-gradient yields representation z′_ξ.', icon: '🟣' },
              { title: 'Contrastive Loss', description: 'Minimize MSE between L2-normalized p_θ and z′_ξ (no negatives needed).', icon: '📉' },
              { title: 'EMA Update Target', description: 'ξ ← τ·ξ + (1−τ)·θ keeps the target a slow, stable moving average.', icon: '🔄' },
            ]}
          />
        </Reveal>

        <Reveal variant="rise" delay={180}>
          <DataTable
            caption="Self-Supervised Learning Methods — Collapse Prevention & Accuracy"
            columns={[
              { key: 'architecture', label: 'Method', sortable: false },
              { key: 'negativePairs', label: 'Negatives', sortable: false },
              { key: 'targetMechanism', label: 'Target', sortable: false },
              { key: 'collapsePrevention', label: 'Collapse Prevention', sortable: false },
              { key: 'linearProbeAccuracy', label: 'Top-1', sortable: false },
            ]}
            rows={SSL_COMPARISON_MATRIX}
            rowKey={(r) => r.architecture}
          />
        </Reveal>

        <Reveal variant="scale" delay={240}>
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)', display: 'flex', gap: 'var(--ds-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ds-color-text-tertiary)' }}>EMA Momentum τ</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--ds-color-module-rag-primary)' }}>
                <AnimatedNumber value={0.99} decimals={2} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              A slow EMA target (τ≈<strong>0.99</strong>) plus the asymmetric predictor lets BYOL learn without negative
              pairs — and still reach <strong>74.3%</strong> ImageNet Top-1 linear-probe accuracy.
            </div>
          </Card>
        </Reveal>
      </Stack>

      </Container>
    </div>
  );
}
