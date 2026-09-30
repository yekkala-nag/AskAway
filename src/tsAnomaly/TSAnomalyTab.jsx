import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassBar } from '../components/ui/CleanInfographics.jsx';
import {
  ANOMALY_DETECTION_THEORY,
  GENERATE_SYNTHETIC_SIGNAL,
  SIMULATE_AUTOENCODER_RECONSTRUCTION,
  PYTORCH_1DCNN_AUTOENCODER_CODE
} from './tsAnomalyEngine.js';
import DataTable from '../components/ui/DataTable.jsx';
import Workflow from '../components/ui/Workflow.jsx';
import { Reveal, AnimatedNumber } from '../components/ui/AnimatedReveal.jsx';

const { Container, Section, Grid, Flex, Stack } = Primitives;

/** Native recreation: conv autoencoder compresses the signal; MSE decides normal vs anomaly. */
function AnomalyAutoencoderPanel() {
  const chip = (accent) => ({
    background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}66`,
    borderRadius: 10, padding: '10px 14px', fontSize: 12.5, fontWeight: 700,
    color: '#F1F5F9', textAlign: 'center', minWidth: 120,
  });
  const note = { fontSize: 11, color: '#94A3B8', fontWeight: 400, marginTop: 2 };
  const arrow = { color: '#5EC4C8', fontWeight: 800, fontSize: 16, alignSelf: 'center', flexShrink: 0 };
  return (
    <Panel
      title="1D Convolutional Autoencoder — Anomaly by Reconstruction Error"
      sub="Train on normal signals only. What reconstructs cleanly is normal; what the bottleneck cannot rebuild is anomalous."
    >
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ ...chip('#94A3B8'), alignSelf: 'center' }}>Input signal</div>
        <span style={arrow}>→</span>
        <div style={{ ...chip('#5EC4C8'), alignSelf: 'center' }}>1D Conv Encoder<div style={note}>Conv1D + ReLU · MaxPool downsample</div></div>
        <span style={arrow}>→</span>
        <div style={{ ...chip('#A78BFA'), alignSelf: 'center' }}>Bottleneck<div style={note}>compressed latent space</div></div>
        <span style={arrow}>→</span>
        <div style={{ ...chip('#6A9BD8'), alignSelf: 'center' }}>1D Conv Decoder<div style={note}>transpose conv · upsample</div></div>
        <span style={arrow}>→</span>
        <div style={{ ...chip('#E8C558'), alignSelf: 'center' }}>MSE gate<div style={note}>loss(x, x̂) vs threshold</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        <GlassBar color="#34D399" icon="check" title="Low MSE → OK / Normal" detail="Reconstruction matches the input: the pattern was seen in training." />
        <GlassBar color="#E8836A" icon="zap" title="High MSE → Anomaly Alert" detail="Reconstruction diverges: unseen pattern. Raise the alert with the offending window attached." />
      </div>
    </Panel>
  );
}

export default function TSAnomalyTab() {
  const [activeSubTab, setActiveSubTab] = useState('theory'); // 'theory' | 'generator' | 'threshold' | 'code'
  const [signalType, setSignalType] = useState('anomalous'); // 'normal' | 'anomalous'
  const [percentile, setPercentile] = useState(99);
  const [ampMult, setAmpMult] = useState(1.0);
  const [freqMult, setFreqMult] = useState(1.0);

  const rawSignal = GENERATE_SYNTHETIC_SIGNAL(signalType, 100, ampMult, freqMult);
  const reconstruction = SIMULATE_AUTOENCODER_RECONSTRUCTION(rawSignal, signalType === 'anomalous', percentile);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Time Series Deep Learning]"
        title="Hands-on Time Series Anomaly Detection using Autoencoders in Python"
        description="Piero Paialunga's end-to-end framework for detecting anomalous time-series signals in finance, engineering, and seismic monitoring using 1D Convolutional Autoencoders and Mean Squared Error (MSE) percentile thresholding."
        metrics={[
          { label: 'Model Type', value: '1D CNN Autoencoder' },
          { label: 'Training Set', value: 'Normal Signals Only' },
          { label: 'Anomaly Metric', value: 'MSE Reconstruction Loss' },
          { label: 'Thresholding', value: '99th Percentile' }
        ]}
      />

      <Container size="wide">
        {/* NATIVE GLASS RECREATION */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <AnomalyAutoencoderPanel />
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
            { id: 'theory', icon: '📡', label: '1. Autoencoder Anomaly Theory', desc: 'Reconstruction error & bottleneck concept' },
            { id: 'generator', icon: '🌊', label: '2. Synthetic Signal Generator', desc: 'Normal vs anomalous sine wave synthesis' },
            { id: 'threshold', icon: '📊', label: '3. MSE & Thresholding Lab', desc: 'Percentile thresholding & alert trigger' },
            { id: 'code', icon: '🐍', label: '4. PyTorch 1D CNN Code Engine', desc: 'Production PyTorch implementation' }
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

        {/* ─── SUBTAB 1: THEORY ─── */}
        {activeSubTab === 'theory' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📡 Why Autoencoders Are Ideal for Time Series Anomaly Detection</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    In real-world engineering and finance, true anomalous signals are extremely rare or unlabelled. Autoencoders solve this by training exclusively on <strong>normal signals</strong>. Because the bottleneck network never learns anomalous patterns, it fails to reconstruct them, causing a spike in reconstruction error (MSE).
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {ANOMALY_DETECTION_THEORY.map(step => (
                    <Card key={step.step} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-module-foundations-primary)' }}>
                        Step {step.step}: {step.title}
                      </strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '6px 0 0 0' }}>
                        {step.description}
                      </p>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: GENERATOR ─── */}
        {activeSubTab === 'generator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🌊 Synthetic Time Series Signal Synthesis</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Normal signals are generated by combining 3 sinusoidal frequencies ($S(x) = \sum A_i \sin(f_i x)$). Anomalous signals introduce high-amplitude, high-frequency spikes.
                  </p>
                </div>

                <Flex gap={3} align="center">
                  <span style={{ fontWeight: 'bold', fontSize: 'var(--ds-font-size-bodySm)' }}>Signal Mode:</span>
                  <Button
                    variant={signalType === 'normal' ? 'primary' : 'subtle'}
                    size="sm"
                    onClick={() => setSignalType('normal')}
                  >
                    🟢 Normal Signal
                  </Button>
                  <Button
                    variant={signalType === 'anomalous' ? 'primary' : 'subtle'}
                    size="sm"
                    onClick={() => setSignalType('anomalous')}
                    style={{ background: signalType === 'anomalous' ? '#ef4444' : undefined }}
                  >
                    🔴 Anomalous Signal (High-Freq Spike)
                  </Button>
                </Flex>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Amplitude Multiplier ({ampMult}×):</label>
                    <input type="range" min="0.5" max="3.0" step="0.1" value={ampMult} onChange={e => setAmpMult(Number(e.target.value))} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>Frequency Multiplier ({freqMult}×):</label>
                    <input type="range" min="0.5" max="3.0" step="0.1" value={freqMult} onChange={e => setFreqMult(Number(e.target.value))} style={{ width: '100%' }} />
                  </div>
                </Grid>

                {/* SIGNAL PREVIEW SVG */}
                <Card style={{ padding: '16px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '8px' }}>
                    SIGNAL VISUALIZATION (100 SAMPLES):
                  </div>
                  <svg viewBox="0 0 400 120" style={{ width: '100%', height: '140px' }}>
                    <path
                      d={rawSignal.reduce((acc, pt, i) => {
                        const posX = (i / (rawSignal.length - 1)) * 390 + 5;
                        const posY = 60 - pt.y * 12;
                        return `${acc} ${i === 0 ? 'M' : 'L'} ${posX} ${posY}`;
                      }, '')}
                      fill="none"
                      stroke={signalType === 'anomalous' ? '#ef4444' : '#5EC4C8'}
                      strokeWidth="2"
                    />
                  </svg>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: MSE THRESHOLDING ─── */}
        {activeSubTab === 'threshold' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📊 Reconstruction MSE Loss & Percentile Thresholding</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Autoencoders output reconstructed signal $\hat{x}$. Anomaly cutoff $T$ is set at the 99th percentile of normal training MSE errors.
                  </p>
                </div>

                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <Stack gap={4}>
                    <div>
                      <label style={{ display: 'block', fontSize: 'var(--ds-font-size-caption)', marginBottom: '4px' }}>
                        Threshold Percentile (Cutoff = {percentile}th percentile):
                      </label>
                      <input type="range" min="90" max="99.9" step="0.1" value={percentile} onChange={e => setPercentile(Number(e.target.value))} style={{ width: '100%' }} />
                    </div>

                    <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #5EC4C8' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>RECONSTRUCTION MSE LOSS:</strong>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#3A9B9F' }}>{reconstruction.mse}</div>
                      </Card>

                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: '4px solid #f59e0b' }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>CUTOFF THRESHOLD T:</strong>
                        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f59e0b' }}>{reconstruction.threshold}</div>
                      </Card>

                      <Card style={{ padding: '14px', background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${reconstruction.isAlert ? '#ef4444' : '#5EC4C8'}` }}>
                        <strong style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>CLASSIFICATION:</strong>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: reconstruction.isAlert ? '#ef4444' : '#5EC4C8' }}>
                          {reconstruction.isAlert ? '🚨 ANOMALY ALERT!' : '🟢 NORMAL SIGNAL'}
                        </div>
                      </Card>
                    </Grid>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PYTORCH CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🐍 Production PyTorch 1D CNN Autoencoder Code Engine</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete, production-ready PyTorch script featuring 1D ConvEncoder (`Conv1d`, `MaxPool1d`), 1D ConvDecoder (`ConvTranspose1d`), training loop, percentile thresholding, and anomaly prediction.
                  </p>
                </div>

                <CodeBlock language="python" code={PYTORCH_1DCNN_AUTOENCODER_CODE} />

                <Callout type="success">
                  <strong>Engineering Takeaway:</strong> By leveraging unsupervised 1D Convolutional Autoencoders, anomaly detection can be deployed across IoT sensors, financial transaction streams, and medical ECG monitoring without needing expensive labeled anomaly datasets.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      {/* ─── INTERACTIVE ENHANCEMENTS: WORKFLOW + TABLE + ANIMATION ─── */}
      <Stack gap={6} style={{ marginTop: 'var(--ds-space-8)' }}>
        <Reveal variant="rise">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--ds-space-3)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--ds-font-size-h2)' }}>📡 Interactive Anomaly Detection</h3>
            <Badge variant="module" moduleId="platform">Theory · Threshold</Badge>
          </div>
        </Reveal>

        <Reveal variant="rise" delay={60}>
          <Workflow
            accent="platform"
            accentLabel="Autoencoder Pipeline"
            title="From Normal Signal to Anomaly Alert"
            description="The four-stage detection flow. Hit ▶ Play to animate."
            steps={ANOMALY_DETECTION_THEORY.map((s) => ({
              title: s.title, description: s.description, icon: '🔎',
            }))}
          />
        </Reveal>

        <Reveal variant="rise" delay={120}>
          <DataTable
            caption="Anomaly Detection Theory — Stage Summary"
            searchable={false}
            columns={[
              { key: 'step', label: 'Step', numeric: true },
              { key: 'title', label: 'Stage', sortable: false },
              { key: 'description', label: 'What Happens', sortable: false },
            ]}
            rows={ANOMALY_DETECTION_THEORY}
            rowKey={(r) => r.step}
          />
        </Reveal>

        <Reveal variant="scale" delay={180}>
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)', display: 'flex', gap: 'var(--ds-space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ds-color-text-tertiary)' }}>Alert Threshold</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--ds-color-module-platform-primary)' }}>
                p<AnimatedNumber value={99} suffix="th" />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Anomalies fire when reconstruction <strong>MSE</strong> exceeds the <strong>99th percentile</strong> of normal
              training-signal error — catching unlearned frequencies and spikes the autoencoder cannot reconstruct.
            </div>
          </Card>
        </Reveal>
      </Stack>

      </Container>
    </div>
  );
}
