import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import { Panel, GlassBar } from '../components/ui/CleanInfographics.jsx';
import {
  FINE_TUNE_VS_RAG_MATRIX,
  FINE_TUNING_PARADIGMS,
  LORA_MATHEMATICAL_CONCEPTS,
  HYPERPARAMETER_DEFAULTS,
  HARDWARE_PRESETS,
  CALCULATE_HARDWARE_ESTIMATE,
  DATASET_FORMATS,
  INFERENCE_BENCHMARK_CASES,
  RUN_QLORA_SIMULATOR,
  PYTHON_QLORA_TRAINING_SCRIPT,
  PYTHON_DPO_TRAINING_SCRIPT,
  VLLM_SERVING_COMMAND,
  AGENTIC_FINE_TUNING_PIPELINE,
  AGENTIC_FINE_TUNING_CHALLENGES,
  AGENTIC_FINE_TUNING_RECIPES,
  PYTHON_AGENTIC_QLORA_SCRIPT
} from './finetuningEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

/** Native recreation: decide → quantize → train → merge. */
function FinetuneQloraPanel() {
  return (
    <Panel
      title="Fine-Tuning & QLoRA End-to-End Pipeline"
      sub="Decide between encoding and retrieving, freeze the base in 4-bit, train small adapters, merge for inference."
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <GlassBar
          color="#5EC4C8" icon="help" index="1." title="Fine-Tune vs RAG Decision"
          detail="Fine-tuning wins static domain knowledge and task-specific accuracy (high domain accuracy, low hallucination); retrieval wins dynamic real-time data at lower resource cost."
        />
        <GlassBar
          color="#A78BFA" icon="cpu" index="2." title="QLoRA Intuition"
          detail="Frozen 4-bit base weights plus double quantization; trainable low-rank adapters — W = W0 + B×A — updated through paged optimizers with unified GPU/CPU memory."
        />
        <GlassBar
          color="#6A9BD8" icon="refresh" index="3." title="Training Loop & Merge"
          detail="Tokenize → batch → forward through quantized base + adapters → loss → backward into adapters only → update. Then merge adapters into one final finetuned model for inference."
        />
      </div>
    </Panel>
  );
}

export default function LLMFinetuningTab() {
  const [activeSubTab, setActiveSubTab] = useState('decision'); 
  // 'decision' | 'math' | 'hardware' | 'simulator' | 'datasets' | 'benchmarks' | 'code'

  // Hardware Calculator State
  const [calcModelSize, setCalcModelSize] = useState(8); // 8B
  const [calcMethod, setCalcMethod] = useState('qlora'); // 'full' | 'lora' | 'qlora' | 'unsloth'
  const [calcSeqLen, setCalcSeqLen] = useState(4096);
  const [calcRank, setCalcRank] = useState(16);
  const [calcBatch, setCalcBatch] = useState(4);

  const hwEstimate = CALCULATE_HARDWARE_ESTIMATE(
    calcModelSize,
    calcMethod,
    calcSeqLen,
    calcRank,
    calcBatch
  );

  // Simulator State
  const [simRank, setSimRank] = useState(16);
  const [simLr, setSimLr] = useState(0.0002);
  const [simEpochs, setSimEpochs] = useState(3);
  const [simScheduler, setSimScheduler] = useState('cosine');

  const simResult = RUN_QLORA_SIMULATOR(simRank, simLr, simEpochs, simScheduler);

  // Benchmark State
  const [selectedBenchmarkIdx, setSelectedBenchmarkIdx] = useState(0);

  // Dataset format state
  const [selectedDatasetIdx, setSelectedDatasetIdx] = useState(0);

  // Code tab state
  const [codeType, setCodeType] = useState('qlora'); // 'qlora' | 'dpo' | 'vllm'

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      {/* HERO HEADER */}
      <Hero
        moduleId="data_platform"
        moduleLabel="Data & Platform Layers [Model Fine-Tuning & QLoRA Guide]"
        title="Model Fine-Tuning, LoRA & QLoRA: End-to-End Architecture"
        description="Master Parameter-Efficient Fine-Tuning (PEFT), Low-Rank Adaptation (LoRA), 4-bit NormalFloat (NF4) quantization, Direct Preference Optimization (DPO), and instruction backtranslation to achieve 98%+ accuracy on complex domain tasks on a single GPU."
        metrics={[
          { label: 'Accuracy Jump', value: '35% ➔ 98.8%' },
          { label: 'Token Cost Reduction', value: 'Up to $320k / yr' },
          { label: 'Base Quantization', value: '4-bit NF4 + Double Quant' },
          { label: 'Single GPU Footprint', value: '< 24 GB VRAM (7B-70B)' }
        ]}
      />

      <Container size="wide">
        {/* ARCHITECTURAL INFOGRAPHIC DIAGRAM */}
        <div style={{ marginBottom: 'var(--ds-space-6)' }}>
          <FinetuneQloraPanel />
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
            { id: 'decision', icon: '⚖️', label: '1. RAG vs Fine-Tuning', desc: 'Decision matrix & trade-offs' },
            { id: 'math', icon: '🧮', label: '2. LoRA & QLoRA Math', desc: 'Rank, NF4, DQ & DPO' },
            { id: 'hardware', icon: '⚡', label: '3. VRAM & GPU Calculator', desc: 'Hardware estimation' },
            { id: 'simulator', icon: '🧪', label: '4. Training Simulator', desc: 'Loss curves & accuracy' },
            { id: 'datasets', icon: '📂', label: '5. Dataset Formats', desc: 'Alpaca, ShareGPT, DPO' },
            { id: 'benchmarks', icon: '🔬', label: '6. Base vs FT Playground', desc: 'Live output comparison' },
            { id: 'code', icon: '🛠️', label: '7. PyTorch & vLLM Code', desc: 'TRL SFT, DPO & Serving' },
            { id: 'agentic', icon: '🤖', label: '8. Agentic Fine-Tuning', desc: 'Multi-agent, tools, DPO alignment' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '170px',
                padding: 'var(--ds-space-3) var(--ds-space-3)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: '2px' }}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
              <div style={{ fontSize: '11px', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>
                {tab.desc}
              </div>
            </button>
          ))}
        </div>

        {/* ─── SUBTAB 1: RAG VS FINE-TUNING MATRIX ─── */}
        {activeSubTab === 'decision' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚖️ The RAG vs Fine-Tuning Strategic Decision Matrix</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    RAG augments <em>dynamic factual retrieval</em> from external knowledge bases. Fine-Tuning modifies <em>structural behavior, tone, reasoning style, and internalizes complex domain constraints</em>.
                  </p>
                </div>

                <Stack gap={3}>
                  {FINE_TUNE_VS_RAG_MATRIX.map((m, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${m.winner === 'Fine-Tuning' ? '#5EC4C8' : '#5EC4C8'}` }}>
                      <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                        <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: m.winner === 'Fine-Tuning' ? '#5EC4C8' : '#5EC4C8' }}>
                          {m.criterion}
                        </strong>
                        <Badge variant="subtle" style={{ background: m.winner === 'Fine-Tuning' ? 'rgba(46,204,140,0.15)' : 'rgba(56,189,248,0.15)', color: m.winner === 'Fine-Tuning' ? '#5EC4C8' : '#5EC4C8' }}>
                          WINNER: {m.winner.toUpperCase()}
                        </Badge>
                      </Flex>

                      <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>RAG Approach:</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)' }}>{m.ragApproach}</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Fine-Tuning (QLoRA) Approach:</div>
                          <div style={{ fontSize: 'var(--ds-font-size-caption)', color: '#3A9B9F', fontWeight: 'bold' }}>{m.fineTuneApproach}</div>
                        </div>
                      </Grid>

                      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', color: '#F5A623' }}>
                        💡 <strong>Architectural Rule:</strong> {m.recommendation}
                      </div>
                    </Card>
                  ))}
                </Stack>

                <div style={{ marginTop: 'var(--ds-space-4)' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: 'white' }}>Core Fine-Tuning Paradigms Overview</h4>
                  <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                    {FINE_TUNING_PARADIGMS.map((p) => (
                      <Card key={p.id} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                        <Flex justify="space-between" align="center" style={{ marginBottom: '6px' }}>
                          <strong style={{ color: '#3A9B9F' }}>{p.name}</strong>
                          <Badge variant="outline">{p.type}</Badge>
                        </Flex>
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>
                          Trainable Parameters: <span style={{ color: '#3A9B9F' }}>{p.paramsUpdated}</span> | Memory Multiplier: <span style={{ color: '#F5A623' }}>{p.memoryMultiplier}</span>
                        </div>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>
                          <strong>Pros:</strong> {p.pros}
                        </div>
                        <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '4px' }}>
                          <strong>Cons:</strong> {p.cons}
                        </div>
                        <div style={{ fontSize: '11px', color: '#3A9B9F' }}>
                          <strong>Best for:</strong> {p.idealFor}
                        </div>
                      </Card>
                    ))}
                  </Grid>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 2: LORA & QLORA MATH INTUITION ─── */}
        {activeSubTab === 'math' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧮 Mathematical Foundations: LoRA, QLoRA & DPO</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Low-Rank Adaptation replaces dense full-parameter weight updates with low-rank factorized projections (B × A), while QLoRA quantizes frozen base weights to 4-bit NormalFloat (NF4) with Double Quantization.
                  </p>
                </div>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {LORA_MATHEMATICAL_CONCEPTS.map((c, idx) => (
                    <Card key={idx} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                      <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#3A9B9F', display: 'block', marginBottom: '4px' }}>
                        {c.concept}
                      </strong>
                      <Card style={{ padding: '8px 12px', background: '#090d16', color: '#3A9B9F', fontFamily: 'monospace', fontSize: '11px', margin: '4px 0 8px 0', overflowX: 'auto' }}>
                        {c.formula}
                      </Card>
                      <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '0 0 6px 0' }}>
                        {c.description}
                      </p>
                      <div style={{ fontSize: '11px', color: '#F5A623' }}>
                        ⚡ <strong>VRAM Footprint Impact:</strong> {c.vramImpact}
                      </div>
                    </Card>
                  ))}
                </Grid>

                <div>
                  <strong style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#3A9B9F', display: 'block', marginBottom: '8px' }}>
                    Empirical Hyperparameter Defaults & Best Practices (Schulman's Rule)
                  </strong>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--ds-font-size-caption)' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', textAlign: 'left', color: '#3A9B9F' }}>
                          <th style={{ padding: '8px' }}>Hyperparameter</th>
                          <th style={{ padding: '8px' }}>Recommended Default</th>
                          <th style={{ padding: '8px' }}>Search Sweep Range</th>
                          <th style={{ padding: '8px' }}>Engineering Rationale</th>
                        </tr>
                      </thead>
                      <tbody>
                        {HYPERPARAMETER_DEFAULTS.map((hp, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '8px', color: '#3A9B9F', fontWeight: 'bold' }}>{hp.name}</td>
                            <td style={{ padding: '8px', fontFamily: 'monospace', color: 'white' }}>{hp.defaultVal}</td>
                            <td style={{ padding: '8px', fontFamily: 'monospace', color: '#F5A623' }}>{hp.sweep}</td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{hp.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 3: HARDWARE & VRAM CALCULATOR ─── */}
        {activeSubTab === 'hardware' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>⚡ Interactive VRAM & Hardware Sizing Calculator</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Calculate exact GPU VRAM requirements based on model parameters, fine-tuning technique, context sequence length, LoRA rank, and batch size.
                  </p>
                </div>

                {/* CALCULATOR CONTROLS */}
                <Grid columns={{ base: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' }} gap="var(--ds-space-3)">
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Model Size:
                    </label>
                    <select
                      value={calcModelSize}
                      onChange={e => setCalcModelSize(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                    >
                      <option value={3}>3B (Llama 3.2 3B)</option>
                      <option value={8}>8B (Llama 3.1 / Mistral 7B)</option>
                      <option value={14}>14B (Qwen 2.5 14B)</option>
                      <option value={32}>32B (Qwen 2.5 32B)</option>
                      <option value={70}>70B (Llama 3.3 70B)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Tuning Technique:
                    </label>
                    <select
                      value={calcMethod}
                      onChange={e => setCalcMethod(e.target.value)}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                    >
                      <option value="qlora">QLoRA (4-bit NF4 + DQ)</option>
                      <option value="unsloth">Unsloth Fast QLoRA</option>
                      <option value="lora">LoRA (16-bit Base)</option>
                      <option value="full">Full Fine-Tuning (FP16)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Sequence Length:
                    </label>
                    <select
                      value={calcSeqLen}
                      onChange={e => setCalcSeqLen(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                    >
                      <option value={1024}>1,024 Tokens</option>
                      <option value={2048}>2,048 Tokens</option>
                      <option value={4096}>4,096 Tokens</option>
                      <option value={8192}>8,192 Tokens</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      LoRA Rank (r):
                    </label>
                    <select
                      value={calcRank}
                      onChange={e => setCalcRank(Number(e.target.value))}
                      disabled={calcMethod === 'full'}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                    >
                      <option value={8}>r = 8 (Lightweight)</option>
                      <option value={16}>r = 16 (Standard)</option>
                      <option value={32}>r = 32 (Extended)</option>
                      <option value={64}>r = 64 (Complex Logic)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', display: 'block', marginBottom: '4px' }}>
                      Per-Device Batch:
                    </label>
                    <select
                      value={calcBatch}
                      onChange={e => setCalcBatch(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px' }}
                    >
                      <option value={1}>1 sample</option>
                      <option value={2}>2 samples</option>
                      <option value={4}>4 samples</option>
                      <option value={8}>8 samples</option>
                    </select>
                  </div>
                </Grid>

                {/* VRAM ESTIMATE RESULTS */}
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '16px', background: '#090d16', border: `1px solid ${hwEstimate.isFeasibleSingleGpu ? '#5EC4C8' : '#ef4444'}` }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '12px' }}>
                      <strong style={{ fontSize: '13px', color: hwEstimate.isFeasibleSingleGpu ? '#5EC4C8' : '#ef4444' }}>
                        TOTAL ESTIMATED VRAM REQUIRED:
                      </strong>
                      <Badge variant="subtle" style={{ background: hwEstimate.isFeasibleSingleGpu ? 'rgba(46,204,140,0.15)' : 'rgba(239,68,68,0.15)', color: hwEstimate.isFeasibleSingleGpu ? '#5EC4C8' : '#ef4444' }}>
                        {hwEstimate.totalVramGb} GB VRAM
                      </Badge>
                    </Flex>

                    <Stack gap={2} style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                      <Flex justify="space-between">
                        <span style={{ color: 'var(--ds-color-text-secondary)' }}>Base Model Weights:</span>
                        <span style={{ color: 'white' }}>{hwEstimate.baseWeightGb} GB</span>
                      </Flex>
                      <Flex justify="space-between">
                        <span style={{ color: 'var(--ds-color-text-secondary)' }}>Optimizer States:</span>
                        <span style={{ color: 'white' }}>{hwEstimate.optimizerGb} GB</span>
                      </Flex>
                      <Flex justify="space-between">
                        <span style={{ color: 'var(--ds-color-text-secondary)' }}>Activation Memory:</span>
                        <span style={{ color: 'white' }}>{hwEstimate.activationGb} GB</span>
                      </Flex>
                      <Flex justify="space-between">
                        <span style={{ color: 'var(--ds-color-text-secondary)' }}>CUDA Overhead / Buffers:</span>
                        <span style={{ color: 'white' }}>1.20 GB</span>
                      </Flex>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px' }}>
                        <Flex justify="space-between">
                          <span style={{ color: '#3A9B9F' }}>Trainable Parameters:</span>
                          <span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>{hwEstimate.trainableParamsM}M params</span>
                        </Flex>
                      </div>
                    </Stack>
                  </Card>

                  <Card style={{ padding: '16px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '13px', color: '#3A9B9F', display: 'block', marginBottom: '8px' }}>
                      HARDWARE RECOMMENDATION & CLUSTER TARGET:
                    </strong>
                    <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
                      {hwEstimate.recommendedGpu}
                    </div>
                    <div style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                      {hwEstimate.isFeasibleSingleGpu 
                        ? '✅ Single GPU execution possible! Cost per 3-epoch training run is typically < $2.50 on RunPod/Lambda Cloud.'
                        : '⚠️ Multi-GPU distributed training required (DeepSpeed ZeRO-3 or PyTorch FSDP across nodes).'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#F5A623' }}>
                      💡 <strong>Optimization Tip:</strong> Enable <code>gradient_checkpointing=True</code> and <code>use_double_quant=True</code> to reduce activation spikes by an additional 40%.
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 4: QLORA TRAINING SIMULATOR ─── */}
        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🧪 Interactive QLoRA Training Simulation</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Simulate training a Mistral-7B / Llama-8B model with QLoRA on a single GPU. Compare baseline prompt accuracy (35%) vs fine-tuned accuracy escalation (98.8%).
                  </p>
                </div>

                <Grid columns={{ base: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-3)">
                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                      LoRA Rank (r = {simRank}):
                    </label>
                    <select
                      value={simRank}
                      onChange={e => setSimRank(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px', marginTop: '4px' }}
                    >
                      {[8, 16, 32, 64].map(r => (
                        <option key={r} value={r}>Rank r={r} ({r * 4}k params)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                      Learning Rate ({simLr}):
                    </label>
                    <select
                      value={simLr}
                      onChange={e => setSimLr(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px', marginTop: '4px' }}
                    >
                      {[0.00005, 0.0001, 0.0002, 0.0004].map(lr => (
                        <option key={lr} value={lr}>LR = {lr}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                      Training Epochs ({simEpochs}):
                    </label>
                    <select
                      value={simEpochs}
                      onChange={e => setSimEpochs(Number(e.target.value))}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px', marginTop: '4px' }}
                    >
                      {[1, 2, 3, 5].map(ep => (
                        <option key={ep} value={ep}>{ep} Epochs</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                      LR Scheduler:
                    </label>
                    <select
                      value={simScheduler}
                      onChange={e => setSimScheduler(e.target.value)}
                      style={{ width: '100%', background: 'var(--ds-color-bg-surface)', color: 'white', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '11px', marginTop: '4px' }}
                    >
                      <option value="cosine">Cosine Annealing</option>
                      <option value="linear">Linear Decay</option>
                    </select>
                  </div>
                </Grid>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: '#090d16', border: '1px solid #5EC4C8' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '11px', color: '#3A9B9F' }}>FINAL ACCURACY & LOSS:</strong>
                      <Badge variant="subtle" style={{ background: 'rgba(46,204,140,0.15)', color: '#3A9B9F' }}>
                        {simResult.finalAccuracy}% ACCURACY
                      </Badge>
                    </Flex>

                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '8px' }}>
                      Accuracy Jump: 35.0% (Prompt+RAG) ➔ <strong style={{ color: '#3A9B9F' }}>{simResult.finalAccuracy}% (QLoRA)</strong> | Eval Loss: <strong style={{ color: '#3A9B9F' }}>{simResult.finalLoss}</strong>
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>Live Step Progress & Gradient Norm:</div>
                    <div style={{ height: '160px', overflowY: 'auto', background: 'var(--ds-color-bg-surface)', borderRadius: '4px', padding: '8px', fontFamily: 'monospace', fontSize: '10px', marginTop: '4px' }}>
                      {simResult.steps.map((st, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px', color: st.epoch === simEpochs ? '#5EC4C8' : 'white' }}>
                          <span>Step {st.globalStep} (Ep {st.epoch})</span>
                          <span>Train: {st.trainLoss}</span>
                          <span>Eval: {st.evalLoss}</span>
                          <span>LR: {st.currentLr}</span>
                          <span>Acc: {st.accuracyPct}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: '4px solid #5EC4C8' }}>
                    <strong style={{ fontSize: '11px', color: '#3A9B9F', display: 'block', marginBottom: '8px' }}>
                      HARDWARE & FINANCIAL ROI COMPARISON:
                    </strong>
                    <Stack gap={2} style={{ fontSize: 'var(--ds-font-size-caption)' }}>
                      <div>Full Fine-Tuning VRAM: <span style={{ color: '#ef4444' }}>~1,200 GB VRAM (Multi-node Cluster)</span></div>
                      <div>QLoRA 4-bit NF4 VRAM: <span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>&lt; 24 GB VRAM (Single GPU)</span></div>
                      <div>VRAM Saved: <span style={{ color: '#3A9B9F' }}>{simResult.vramSavingsGb} GB saved per run</span></div>
                      <div>Single GPU Compute Cost: <span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>{simResult.estimatedCost}</span></div>
                      <div>API Savings at Scale: <span style={{ color: '#3A9B9F', fontWeight: 'bold' }}>~$320,000 / year</span></div>
                    </Stack>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 5: DATASET FORMATS & PREPARATION ─── */}
        {activeSubTab === 'datasets' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>📂 Dataset Preparation & Format Standards</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    High-quality fine-tuning requires strict data curation. Choose the right instruction schema and mask prompt tokens during loss calculation with <code>DataCollatorForCompletionOnlyLM</code>.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {DATASET_FORMATS.map((fmt, idx) => (
                    <Button
                      key={idx}
                      variant={selectedDatasetIdx === idx ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedDatasetIdx(idx)}
                    >
                      {fmt.formatName}
                    </Button>
                  ))}
                </div>

                <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                  <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: '#3A9B9F', marginBottom: '8px' }}>
                    {DATASET_FORMATS[selectedDatasetIdx].desc}
                  </div>
                  <CodeBlock language="json" code={DATASET_FORMATS[selectedDatasetIdx].example} />
                </Card>

                <Callout type="info">
                  <strong>Instruction Backtranslation Secret:</strong> Take raw, uncurated enterprise text documents, prompt a model to generate realistic user questions for each section, verify semantic answers, and use the synthetic pairs for Supervised Fine-Tuning (SFT).
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 6: BASE VS FINE-TUNED INFERENCE BENCHMARKS ─── */}
        {activeSubTab === 'benchmarks' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🔬 Live Output Comparison: Base Model vs Fine-Tuned (QLoRA)</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    See why base models fail on complex structural tasks (missing fields, broken schemas, hallucinations) and how a fine-tuned adapter delivers 100% deterministic compliance.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {INFERENCE_BENCHMARK_CASES.map((b, idx) => (
                    <Button
                      key={idx}
                      variant={selectedBenchmarkIdx === idx ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setSelectedBenchmarkIdx(idx)}
                    >
                      {b.domain}
                    </Button>
                  ))}
                </div>

                <Card style={{ padding: '12px 14px', background: '#090d16', borderLeft: '4px solid #5EC4C8' }}>
                  <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginBottom: '4px' }}>INPUT USER PROMPT:</div>
                  <div style={{ fontSize: 'var(--ds-font-size-bodySm)', color: 'white', fontFamily: 'monospace' }}>
                    {INFERENCE_BENCHMARK_CASES[selectedBenchmarkIdx].inputPrompt}
                  </div>
                </Card>

                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  {/* BASE MODEL OUTPUT */}
                  <Card style={{ padding: '14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '12px', color: '#ef4444' }}>❌ BASE MODEL (PROMPT + RAG)</strong>
                      <Badge variant="subtle" style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}>
                        35% Accuracy (Failed)
                      </Badge>
                    </Flex>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#f87171', minHeight: '120px', whiteSpace: 'pre-wrap' }}>
                      {INFERENCE_BENCHMARK_CASES[selectedBenchmarkIdx].baseModelOutput}
                    </div>
                    <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '8px' }}>
                      ⚠️ <strong>Failure Diagnosis:</strong> {INFERENCE_BENCHMARK_CASES[selectedBenchmarkIdx].baseFailureReason}
                    </div>
                  </Card>

                  {/* FINE-TUNED OUTPUT */}
                  <Card style={{ padding: '14px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: '8px' }}>
                      <strong style={{ fontSize: '12px', color: '#3A9B9F' }}>✅ FINE-TUNED (QLORA ADAPTER)</strong>
                      <Badge variant="subtle" style={{ background: 'rgba(16,185,129,0.2)', color: '#3A9B9F' }}>
                        {INFERENCE_BENCHMARK_CASES[selectedBenchmarkIdx].fineTunedAccuracy}
                      </Badge>
                    </Flex>
                    <div style={{ background: '#090d16', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px', color: '#34d399', minHeight: '120px', whiteSpace: 'pre-wrap' }}>
                      {INFERENCE_BENCHMARK_CASES[selectedBenchmarkIdx].fineTunedOutput}
                    </div>
                    <div style={{ fontSize: '11px', color: '#3A9B9F', marginTop: '8px' }}>
                      🎯 <strong>Deterministic Compliance:</strong> 100% compliant with target schema without bloated context prompt overhead.
                    </div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 7: PRODUCTION PYTORCH & VLLM CODE ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🛠️ Production Python, TRL & vLLM Serving Scripts</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Tested end-to-end reference training code for Supervised Fine-Tuning (SFTTrainer), Direct Preference Optimization (DPOTrainer), and vLLM serving.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button
                    variant={codeType === 'qlora' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCodeType('qlora')}
                  >
                    1. PyTorch + TRL QLoRA Training
                  </Button>
                  <Button
                    variant={codeType === 'dpo' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCodeType('dpo')}
                  >
                    2. DPO Preference Alignment
                  </Button>
                  <Button
                    variant={codeType === 'vllm' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setCodeType('vllm')}
                  >
                    3. vLLM High-Throughput Serving
                  </Button>
                </div>

                {codeType === 'qlora' && (
                  <CodeBlock language="python" code={PYTHON_QLORA_TRAINING_SCRIPT} />
                )}

                {codeType === 'dpo' && (
                  <CodeBlock language="python" code={PYTHON_DPO_TRAINING_SCRIPT} />
                )}

                {codeType === 'vllm' && (
                  <CodeBlock language="bash" code={VLLM_SERVING_COMMAND} />
                )}

                <Callout type="success">
                  <strong>Enterprise Ready:</strong> Includes automated memory paging, gradient accumulation, completion-only loss masking, and LoRA adapter merging for low-latency vLLM inference.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {/* ─── SUBTAB 8: AGENTIC FINE-TUNING (ML MASTERY GUIDE) ─── */}
        {activeSubTab === 'agentic' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0 }}>🤖 Fine-Tuning Agentic AI — End-to-End Pipeline</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Extending the ML Mastery practical guide: behavior cloning from expert agent trajectories, tool-use specialization, preference alignment for agent behavior, and continuous evaluation loops.
                  </p>
                </div>

                {/* 5-Stage Pipeline */}
                <div>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>🔄 5-Stage Agentic Fine-Tuning Pipeline</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Stage</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Key Techniques</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Data Format</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Compute</th>
                        </tr>
                      </thead>
                      <tbody>
                        {AGENTIC_FINE_TUNING_PIPELINE.map((s, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                            <td style={{ padding: '8px', color: '#3A9B9F', fontWeight: 'bold' }}>{s.stage}</td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{s.description}</td>
                            <td style={{ padding: '8px' }}>
                              <ul style={{ margin: 0, paddingLeft: '16px', color: '#3A9B9F' }}>
                                {s.keyTechniques.map((t, j) => <li key={j} style={{ fontSize: '10px' }}>{t}</li>)}
                              </ul>
                            </td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace', fontSize: '10px' }}>{s.dataFormat}</td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-tertiary)', fontSize: '10px' }}>{s.computeCost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Key Challenges */}
                <div style={{ marginTop: 'var(--ds-space-4)' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>⚠️ Key Challenges & Mitigations</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--ds-space-3)' }}>
                    {AGENTIC_FINE_TUNING_CHALLENGES.map((c, i) => (
                      <Card key={i} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F5A623' }}>
                        <div style={{ fontSize: '12px', color: '#F5A623', fontWeight: 'bold', marginBottom: '4px' }}>{c.challenge}</div>
                        <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginBottom: '6px' }}>{c.detail}</div>
                        <div style={{ fontSize: '11px', color: '#3A9B9F', fontStyle: 'italic' }}>→ {c.mitigation}</div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Training Recipes */}
                <div style={{ marginTop: 'var(--ds-space-4)' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>📋 Production Training Recipes</h4>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Recipe</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Base Model</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Data</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Hardware</th>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Outcome</th>
                        </tr>
                      </thead>
                      <tbody>
                        {AGENTIC_FINE_TUNING_RECIPES.map((r, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}>
                            <td style={{ padding: '8px', color: '#3A9B9F', fontWeight: 'bold' }}>{r.name}</td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace', fontSize: '10px' }}>{r.baseModel}</td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)', fontSize: '10px' }}>{r.method}</td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)', fontSize: '10px' }}>{r.data}</td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)', fontSize: '10px' }}>{r.hardware}</td>
                            <td style={{ padding: '8px', color: 'var(--ds-color-text-tertiary)', fontSize: '10px' }}>{r.expectedOutcome}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Agentic QLoRA Code */}
                <div style={{ marginTop: 'var(--ds-space-4)' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--ds-color-text-primary)' }}>🛠️ Agentic QLoRA Training + Constrained Tool Decoding</h4>
                  <CodeBlock language="python" code={PYTHON_AGENTIC_QLORA_SCRIPT} />
                  <Callout type="success">
                    <strong>Key additions vs standard QLoRA:</strong> Tool call serialization in chat template, loss masking on tool outputs (train only on agent tokens), 
                    JSON schema-constrained decoding at inference (llama.cpp GBNF / vLLM guided decoding), trajectory-level DPO pairs for preference alignment.
                  </Callout>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
