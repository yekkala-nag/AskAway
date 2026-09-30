import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassBar } from '../components/ui/CleanInfographics.jsx';
import {
  VAE_VS_VANILLA_COMPARISON,
  CALCULATE_ELBO,
  REPARAMETERIZATION_STEPS,
  PYTORCH_VAE_CODE
} from './vaeEngine.js';

const { Container, Section, Grid, Flex, Stack } = Primitives;

/** Native recreation: VAE encode → reparameterize → decode → ELBO loss. */
function VaePanel() {
  const mono = {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: 12.5, color: '#7FE3DC', background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(94,196,200,0.25)', borderRadius: 6,
    padding: '8px 12px', marginTop: 8, lineHeight: 1.7, textAlign: 'center',
  };
  const chip = (accent) => ({
    background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}66`,
    borderRadius: 10, padding: '10px 12px', fontSize: 12.5, fontWeight: 700,
    color: '#F1F5F9', textAlign: 'center', minWidth: 105,
  });
  const note = { fontSize: 11, color: '#94A3B8', fontWeight: 400, marginTop: 2 };
  const arrow = { color: '#5EC4C8', fontWeight: 800, fontSize: 16, alignSelf: 'center', flexShrink: 0 };
  return (
    <Panel
      title="Variational Autoencoder — Encode, Sample, Decode"
      sub="The encoder predicts a distribution, the reparameterization trick keeps gradients flowing, the decoder reconstructs — ELBO balances both."
    >
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ ...chip('#94A3B8'), alignSelf: 'center' }}>Input x</div>
        <span style={arrow}>→</span>
        <div style={{ ...chip('#34D399'), alignSelf: 'center' }}>Encoder q(z|x)<div style={note}>mean μ + log variance</div></div>
        <span style={arrow}>→</span>
        <div style={{ ...chip('#E8C558'), alignSelf: 'center' }}>Sample z<div style={note}>z = μ + σ · ε, ε ∼ N(0,I)</div></div>
        <span style={arrow}>→</span>
        <div style={{ ...chip('#E08A4C'), alignSelf: 'center' }}>Decoder p(x|z)<div style={note}>reconstruct x̂</div></div>
      </div>
      <div style={mono}>ELBO = L_reconstruction + L_KL-divergence</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginTop: 12 }}>
        <GlassBar color="#5EC4C8" icon="check" title="Reconstruction term" detail="Minimizes the gap between x and x-hat: mean-squared error, or binary cross-entropy for specific data types." />
        <GlassBar color="#A78BFA" icon="shield" title="KL term" detail="Keeps the learned posterior near the standard normal prior: 0.5 · sum(1 + log σ² − μ² − σ²)." />
      </div>
    </Panel>
  );
}

export default function VAETab() {
  const [activeSubTab, setActiveSubTab] = useState('comparison'); // 'comparison' | 'elbo' | 'reparam' | 'pytorch'

  // Interactive ELBO calculator state
  const [muInput, setMuInput] = useState(0.5);
  const [sigmaInput, setSigmaInput] = useState(1.2);
  const [mseInput, setMseInput] = useState(0.15);

  // Reparameterization interactive state
  const [epsVal, setEpsVal] = useState(0.42);

  const elboResults = CALCULATE_ELBO(muInput, sigmaInput, mseInput);
  const reparamZ = (muInput + sigmaInput * epsVal).toFixed(4);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Generative AI Deep Dive]"
        title="Variational Autoencoders (VAEs): Theory, ELBO & Reparameterization Trick"
        description="Master the foundational probabilistic architecture powering modern generative models. Learn how VAEs map inputs to normal distributions, derive the Evidence Lower Bound (ELBO), and enable end-to-end backpropagation."
        metrics={[
          { label: 'Loss Function', value: 'ELBO (BCE + KLD)' },
          { label: 'Latent Space', value: 'Continuous N(0, I)' },
          { label: 'Gradient Trick', value: 'z = μ + σ ⊙ ε' },
          { label: 'Implementation', value: 'PyTorch Engine' }
        ]}
      />

      <Container size="wide">
        {/* NATIVE GLASS RECREATION */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <VaePanel />
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
            { id: 'comparison', icon: '🧩', label: '1. Vanilla AE vs VAE', desc: 'Latent space gaps & probability mapping' },
            { id: 'elbo', icon: '🧮', label: '2. ELBO Loss & Math Lab', desc: 'Interactive Reconstruction vs KL Loss' },
            { id: 'reparam', icon: '🎲', label: '3. Reparameterization Trick', desc: 'Differentiable gradient flow simulation' },
            { id: 'pytorch', icon: '🐍', label: '4. PyTorch Code & Latent Grid', desc: 'Production code & 2D sampling grid' }
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

        {/* ─── SUBTAB 1: VANILLA VS VAE ─── */}
        {activeSubTab === 'comparison' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧩 Vanilla Autoencoder vs Variational Autoencoder (VAE)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Vanilla Autoencoders map inputs to discrete, isolated points in latent space. Unregularized spaces contain empty "holes" where decoder output generates noise. VAEs map inputs to Gaussian distributions, filling the space smoothly.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #ef4444' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#ef4444' }}>❌ Vanilla Autoencoder Limitations</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
                      <li><strong>Point Mapping:</strong> Maps input x to a single deterministic point z.</li>
                      <li><strong>Latent Space Holes:</strong> Sampling random points in unmapped regions yields garbage.</li>
                      <li><strong>Similarity Failure:</strong> Similar images can be placed far apart because loss only measures reconstruction.</li>
                      <li><strong>No Generation:</strong> Cannot sample synthetic new images reliably.</li>
                    </ul>
                  </Card>

                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#3A9B9F' }}>✅ Variational Autoencoder (VAE) Solution</h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
                      <li><strong>Distribution Mapping:</strong> Maps input x to Gaussian parameters μ(x) and σ²(x).</li>
                      <li><strong>Smooth Latent Space:</strong> Regularized by KL Divergence around standard normal N(0, I).</li>
                      <li><strong>Semantic Continuity:</strong> Neighboring latent vectors represent smooth visual interpolations.</li>
                      <li><strong>Generative Power:</strong> Sampling z ~ N(0, I) generates novel high-quality data.</li>
                    </ul>
                  </Card>
                </Grid>

                {/* FEATURE COMPARISON TABLE */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                      <thead>
                        <tr style={{ background: 'var(--ds-color-bg-canvas)', textAlign: 'left', borderBottom: '2px solid var(--ds-color-border-subtle)' }}>
                          <th style={{ padding: '10px' }}>Dimension</th>
                          <th style={{ padding: '10px' }}>Vanilla Autoencoder</th>
                          <th style={{ padding: '10px' }}>Variational Autoencoder (VAE)</th>
                          <th style={{ padding: '10px' }}>Practical Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {VAE_VS_VANILLA_COMPARISON.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.feature}</td>
                            <td style={{ padding: '10px', color: 'var(--ds-color-text-tertiary)' }}>{row.vanilla}</td>
                            <td style={{ padding: '10px', color: '#3A9B9F', fontWeight: 'medium' }}>{row.vae}</td>
                            <td style={{ padding: '10px', fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{row.impact}</td>
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

        {/* ─── SUBTAB 2: ELBO MATH LAB ─── */}
        {activeSubTab === 'elbo' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧮 Interactive ELBO Loss & Math Derivation Lab</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    The Evidence Lower Bound (ELBO) balances <strong>Reconstruction Quality</strong> against <strong>KL Divergence Regularization</strong>:
                  </p>
                  <div style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderRadius: 'var(--ds-radius-md)', fontFamily: 'var(--ds-font-family-mono)', marginTop: '8px', fontSize: 'var(--ds-font-size-caption)', textAlign: 'center' }}>
                    ELBO(θ, ϕ; x) = E[log p(x|z)] - D_KL(q(z|x) || p(z))
                  </div>
                </div>

                {/* INTERACTIVE CALCULATOR SLIDERS */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={4}>
                    <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Adjust Latent Distribution Parameters:</strong>
                    <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                          Latent Mean (μ = {muInput}):
                        </label>
                        <input
                          type="range"
                          min="-3.0"
                          max="3.0"
                          step="0.1"
                          value={muInput}
                          onChange={(e) => setMuInput(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                          Latent Std Dev (σ = {sigmaInput}):
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="3.0"
                          step="0.1"
                          value={sigmaInput}
                          onChange={(e) => setSigmaInput(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                          Reconstruction MSE Loss ({mseInput}):
                        </label>
                        <input
                          type="range"
                          min="0.01"
                          max="1.0"
                          step="0.01"
                          value={mseInput}
                          onChange={(e) => setMseInput(Number(e.target.value))}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </Grid>

                    {/* LIVE COMPUTED METRICS */}
                    <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>RECONSTRUCTION LOSS:</strong>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3A9B9F' }}>
                          {elboResults.reconstructionLoss}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                          Measures decoder fidelity -log p(x|z)
                        </div>
                      </Card>

                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #f59e0b' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>KL DIVERGENCE REGULARIZATION:</strong>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                          {elboResults.klDivergence}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                          D_KL(q(z|x) || N(0, I)) distance
                        </div>
                      </Card>

                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>TOTAL VAE LOSS (TO MINIMIZE):</strong>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3A9B9F' }}>
                          {elboResults.totalLoss}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>
                          Equivalent to -ELBO bound
                        </div>
                      </Card>
                    </Grid>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: REPARAMETERIZATION TRICK ─── */}
        {activeSubTab === 'reparam' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🎲 The Reparameterization Trick & Gradient Flow</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Direct sampling from a stochastic distribution stops gradient propagation during backpropagation. The reparameterization trick rewrites sampling as a deterministic linear transform using external standard normal noise ε ~ N(0, I).
                  </p>
                </div>

                {/* LIVE REPARAMETERIZATION FORMULA DEMO */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={3}>
                    <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Live Reparameterization Calculation:</strong>
                    <Flex gap={4} align="center" wrap>
                      <label style={{ fontSize: 'var(--ds-font-size-caption)' }}>
                        Auxiliary Noise ε ~ N(0, I):
                        <input
                          type="range"
                          min="-2.5"
                          max="2.5"
                          step="0.05"
                          value={epsVal}
                          onChange={(e) => setEpsVal(Number(e.target.value))}
                          style={{ marginLeft: '8px' }}
                        />
                        <span style={{ fontWeight: 'bold', marginLeft: '6px' }}>{epsVal}</span>
                      </label>
                    </Flex>

                    <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                      <div style={{ fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-body)' }}>
                        z = μ + σ ⊙ ε = {muInput} + ({sigmaInput} × {epsVal}) = <strong>{reparamZ}</strong>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>
                        Notice: Both μ and σ remain differentiable nodes! PyTorch computes ∂z/∂μ = 1 and ∂z/∂σ = ε.
                      </div>
                    </Card>
                  </Stack>
                </Card>

                {/* STEP BY STEP BREAKDOWN */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {REPARAMETERIZATION_STEPS.map(step => (
                    <Card key={step.step} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)' }}>Step {step.step}: {step.title}</strong>
                        <Badge variant={step.status.includes('Blocked') ? 'danger' : 'success'} size="sm">{step.status}</Badge>
                      </Flex>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '0 0 8px 0' }}>
                        {step.description}
                      </p>
                      <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '6px', borderRadius: 'var(--ds-radius-sm)', fontFamily: 'var(--ds-font-family-mono)', fontSize: '11px' }}>
                        {step.formula}
                      </div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PYTORCH IMPLEMENTATION ─── */}
        {activeSubTab === 'pytorch' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🐍 Production PyTorch VAE Implementation</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete, copyable PyTorch code implementing VAE Encoder, Decoder, Reparameterization Trick, and ELBO Loss Function.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTORCH_VAE_CODE} />

                <Callout type="success">
                  <strong>Production Architecture Note:</strong> Modern Latent Diffusion Models (e.g. Stable Diffusion, Flux, SDXL) use trained VAE encoders to compress high-resolution image space into compact 2D latent spaces before applying diffusion noise steps.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
