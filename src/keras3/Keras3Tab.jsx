import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassBar } from '../components/ui/CleanInfographics.jsx';
import {
  BACKEND_COMPARISON_MATRIX,
  NMT_SAMPLE_DATASET,
  ENCODER_DECODER_FLOW_STEPS,
  KERAS3_PRODUCTION_CODE
} from './keras3Engine.js';

const { Container, Section, Grid, Flex, Stack } = Primitives;

/** Native recreation: one API over three backends, then the NMT encoder-decoder. */
function KerasNmtPanel() {
  const chip = (accent) => ({
    background: 'rgba(255,255,255,0.05)', border: `1px solid ${accent}66`,
    borderRadius: 10, padding: '10px 14px', fontSize: 12.5, fontWeight: 700,
    color: '#F1F5F9', textAlign: 'center', minWidth: 110,
  });
  const note = { fontSize: 11, color: '#94A3B8', fontWeight: 400, marginTop: 2 };
  const arrow = { color: '#5EC4C8', fontWeight: 800, fontSize: 16, alignSelf: 'center', flexShrink: 0 };
  return (
    <Panel
      title="Multi-Backend Deep Learning for NMT"
      sub="One unified API over three execution backends with seamless switching, running a sequence-to-sequence encoder-decoder translator."
    >
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        {['Backend A', 'Backend B', 'Backend C'].map((b, i) => (
          <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '1 1 0' }}>
            <div style={{ ...chip(['#5EC4C8', '#A78BFA', '#E8C558'][i]), flex: 1 }}>{b}<div style={note}>switchable at runtime</div></div>
            {i < 2 ? (<span style={arrow}>⇄</span>) : null}
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar color="#5EC4C8" icon="file" index="1." title="Encoder — Source Language In" detail="Source text → encoder embedding → bidirectional encoder LSTM → final hidden states (hT, cT) handed to the decoder." />
        <GlassBar color="#E8C558" icon="refresh" index="2." title="Decoder — Target Language Out" detail="Initial state + shifted target text → decoder embedding → decoder LSTM → dense softmax → target-language prediction, token by token." />
      </div>
    </Panel>
  );
}

export default function Keras3Tab() {
  const [activeSubTab, setActiveSubTab] = useState('backend'); // 'backend' | 'vectorizer' | 'architecture' | 'code'
  const [selectedBackend, setSelectedBackend] = useState('torch'); // 'torch' | 'jax' | 'tensorflow'
  const [selectedPairId, setSelectedPairId] = useState(1);

  const activePair = NMT_SAMPLE_DATASET.find(p => p.id === selectedPairId) || NMT_SAMPLE_DATASET[0];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Keras 3.0 Deep Dive]"
        title="Keras 3.0 Tutorial: End-to-End Multi-Backend Deep Learning Guide"
        description="Write backend-agnostic deep learning models running seamlessly on PyTorch, JAX, or TensorFlow. Master custom layer subclassing, sequence vectorization, and sequence-to-sequence NMT architectures."
        metrics={[
          { label: 'Multi-Backend', value: 'PyTorch / JAX / TF' },
          { label: 'API Paradigm', value: 'Keras Subclassing' },
          { label: 'Model Architecture', value: 'Seq2Seq Encoder-Decoder' },
          { label: 'Serializability', value: '@register_keras_serializable' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <KerasNmtPanel />
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
            { id: 'backend', icon: '⚙️', label: '1. Multi-Backend Switcher', desc: 'PyTorch vs JAX vs TensorFlow' },
            { id: 'vectorizer', icon: '🔤', label: '2. Tokenizer & Vectorization', desc: 'TextVectorization & SOS/EOS padding' },
            { id: 'architecture', icon: '🔄', label: '3. NMT Architecture', desc: 'Encoder-Decoder state flow' },
            { id: 'code', icon: '🐍', label: '4. Production Subclassing Code', desc: 'Custom layers & serializable models' }
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

        {/* ─── SUBTAB 1: MULTI-BACKEND SWITCHER ─── */}
        {activeSubTab === 'backend' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚙️ Keras 3.0 Multi-Backend Engine & Switcher</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Keras 3.0 allows developers to write deep learning code once and run it on top of <strong>PyTorch</strong>, <strong>JAX</strong>, or <strong>TensorFlow</strong> without changing a single line of model logic.
                  </p>
                </div>

                {/* BACKEND SELECTOR BUTTONS */}
                <Flex gap={3} wrap>
                  {[
                    { id: 'torch', label: '🔥 PyTorch Backend', color: '#ee4c2c' },
                    { id: 'jax', label: '⚡ JAX Backend', color: '#3A9B9F' },
                    { id: 'tensorflow', label: '🟧 TensorFlow Backend', color: '#f59e0b' }
                  ].map(b => (
                    <Button
                      key={b.id}
                      variant={selectedBackend === b.id ? 'primary' : 'subtle'}
                      size="sm"
                      onClick={() => setSelectedBackend(b.id)}
                      style={{ background: selectedBackend === b.id ? b.color : undefined }}
                    >
                      {b.label}
                    </Button>
                  ))}
                </Flex>

                {/* BACKEND DETAILS CARD */}
                {(() => {
                  const info = BACKEND_COMPARISON_MATRIX.find(m => m.backend.toLowerCase().includes(selectedBackend)) || BACKEND_COMPARISON_MATRIX[0];
                  return (
                    <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid var(--ds-color-module-foundations-primary)' }}>
                      <Stack gap={3}>
                        <Flex justify="space-between" align="center">
                          <strong style={{ fontSize: 'var(--ds-font-size-body)' }}>Active Backend: {info.backend}</strong>
                          <Badge variant="success" size="sm">Speed Benchmark: {info.speedBenchmark}</Badge>
                        </Flex>
                        <p style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                          <strong>Primary Use:</strong> {info.primaryUse}
                        </p>
                        <p style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
                          <strong>Advantages:</strong> {info.pros}
                        </p>
                        <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '10px', borderRadius: 'var(--ds-radius-sm)', fontFamily: 'var(--ds-font-family-mono)', fontSize: 'var(--ds-font-size-caption)' }}>
                          Configuration Code: <code>{info.configCode}</code>
                        </div>
                      </Stack>
                    </Card>
                  );
                })()}

                {/* COMPARISON MATRIX TABLE */}
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                      <thead>
                        <tr style={{ background: 'var(--ds-color-bg-canvas)', textAlign: 'left', borderBottom: '2px solid var(--ds-color-border-subtle)' }}>
                          <th style={{ padding: '10px' }}>Backend</th>
                          <th style={{ padding: '10px' }}>Primary Use Case</th>
                          <th style={{ padding: '10px' }}>Key Advantages</th>
                          <th style={{ padding: '10px' }}>Speed Metric</th>
                        </tr>
                      </thead>
                      <tbody>
                        {BACKEND_COMPARISON_MATRIX.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.backend}</td>
                            <td style={{ padding: '10px', color: 'var(--ds-color-text-secondary)' }}>{row.primaryUse}</td>
                            <td style={{ padding: '10px', fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{row.pros}</td>
                            <td style={{ padding: '10px', fontWeight: 'bold', color: '#3A9B9F' }}>{row.speedBenchmark}</td>
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

        {/* ─── SUBTAB 2: TOKENIZER & VECTORIZATION ─── */}
        {activeSubTab === 'vectorizer' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔤 Sequence Tokenization & Vectorization</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    In NMT projects, source English sentences are vectorised into integer token IDs, while target Spanish sentences are wrapped with SOS (`startofseq`) and EOS (`endofseq`) placeholders.
                  </p>
                </div>

                {/* SAMPLE PAIR SELECTOR */}
                <Flex gap={2} align="center">
                  <span style={{ fontWeight: 'bold', fontSize: 'var(--ds-font-size-bodySm)' }}>Select Translation Pair:</span>
                  {NMT_SAMPLE_DATASET.map(pair => (
                    <Button
                      key={pair.id}
                      variant={selectedPairId === pair.id ? 'primary' : 'subtle'}
                      size="sm"
                      onClick={() => setSelectedPairId(pair.id)}
                    >
                      Pair #{pair.id}
                    </Button>
                  ))}
                </Flex>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F' }}>ENGLISH SOURCE TEXT (ENCODER INPUT):</strong>
                    <div style={{ fontSize: 'var(--ds-font-size-body)', fontWeight: 'bold', marginTop: '6px' }}>
                      "{activePair.sourceEn}"
                    </div>
                    <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '8px', borderRadius: 'var(--ds-radius-sm)', marginTop: '10px', fontFamily: 'var(--ds-font-family-mono)', fontSize: '11px' }}>
                      Vector Tensor: [{activePair.tokenizedEn.join(', ')}, 0, 0, ...]
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F' }}>SPANISH TARGET TEXT (DECODER TARGET):</strong>
                    <div style={{ fontSize: 'var(--ds-font-size-body)', fontWeight: 'bold', marginTop: '6px' }}>
                      "startofseq {activePair.targetEs} endofseq"
                    </div>
                    <div style={{ background: 'var(--ds-color-bg-canvas)', padding: '8px', borderRadius: 'var(--ds-radius-sm)', marginTop: '10px', fontFamily: 'var(--ds-font-family-mono)', fontSize: '11px' }}>
                      Vector Tensor: [{activePair.tokenizedEs.join(', ')}, 0, 0, ...]
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: NMT ARCHITECTURE ─── */}
        {activeSubTab === 'architecture' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔄 Encoder-Decoder LSTM Architecture & State Passing</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    The Encoder processes the input sequence and extracts final recurrent states (hidden state $h_T$ & cell state $c_T$). The Decoder is initialized with these states (`initial_state=encoder_state`) to generate target translations.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {ENCODER_DECODER_FLOW_STEPS.map(step => (
                    <Card key={step.step} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-module-foundations-primary)' }}>
                        Step {step.step}: {step.title}
                      </strong>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '6px 0' }}>
                        {step.description}
                      </p>
                      {step.tensorShape && (
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', fontFamily: 'var(--ds-font-family-mono)' }}>
                          Shape: {step.tensorShape}
                        </div>
                      )}
                      {step.output && (
                        <div style={{ fontSize: '11px', color: '#3A9B9F', fontWeight: 'bold', marginTop: '4px' }}>
                          Output: {step.output}
                        </div>
                      )}
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: PRODUCTION SUBCLASSING CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🐍 End-to-End Keras 3.0 Production Subclassing Code</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Complete, production-ready Python script utilizing Keras 3.0 Subclassing API (`keras.layers.Layer` and `keras.models.Model`) registered for full model serialization.
                  </p>
                </div>

                <CodeBlock language="python" code={KERAS3_PRODUCTION_CODE} />

                <Callout type="success">
                  <strong>Framework Tip:</strong> Always decorate custom layers with <code>@keras.saving.register_keras_serializable()</code> and implement <code>get_config()</code> so your models can be saved and reloaded seamlessly in <code>.keras</code> format across any backend.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
