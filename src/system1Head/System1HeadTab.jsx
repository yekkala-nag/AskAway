import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  ARCH_COMPARISON,
  HEAD_SWAP,
  DATASET,
  PARAMS,
  accuracyAt,
  confusionAt,
  QUANT,
  DEMO_RESULTS,
  EDITOR_VS_SEMANTIC,
  CODE_MODEL,
  CODE_TRAIN,
  CODE_QUANT,
  CODE_CHECK,
} from './system1HeadEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#9B89C4';
const PURPLE_DARK = '#5B4B8A';
const RED = '#B4553A';

const SUBTABS = [
  { id: 'loop', icon: '🔁', label: '1. Loop vs Single Pass', desc: 'System 2 by default' },
  { id: 'swap', icon: '🔀', label: '2. The Head Swap', desc: '1.5B frozen, 3k trainable' },
  { id: 'simulator', icon: '📈', label: '3. Training Simulator', desc: 'Epoch curve + confusion' },
  { id: 'code', icon: '🛠️', label: '4. Code', desc: 'Model, train, quantize, check' },
  { id: 'demo', icon: '🔬', label: '5. Demo & Checks', desc: 'Editor vs semantic' },
];

function LoopVsSingle() {
  const tokens = ['The', ' function', ' looks', ' correct', ' and', ' the', ' name', ' matches', ' the', ' body', '.'];
  return (
    <svg viewBox="0 0 980 340" width="100%" role="img"
      aria-label="Top lane: autoregressive loop emits ten tokens one by one with ten forward passes. Bottom lane: one forward pass produces a two-class logit vector with confidence">
      <defs>
        <marker id="arr4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8" />
        </marker>
      </defs>

      <text x="10" y="34" fontSize="13" fontWeight="800" fill={PURPLE_DARK}>DEFAULT: DECISION BY GENERATION</text>
      <rect x="10" y="48" width="150" height="46" rx="8" fill="#FFFFFF" stroke={PURPLE} strokeWidth="1.8" />
      <text x="85" y="76" textAnchor="middle" fontSize="12">input (name, body)</text>
      <path d="M 164 71 L 200 71" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr4)" />
      <rect x="205" y="48" width="170" height="46" rx="8" fill="#FFFFFF" stroke={PURPLE} strokeWidth="1.8" />
      <text x="290" y="69" textAnchor="middle" fontSize="12">autoregressive loop</text>
      <text x="290" y="85" textAnchor="middle" fontSize="10.5" fill="#6B7280">one pass per token</text>
      <path d="M 379 71 L 415 71" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr4)" />
      {tokens.map((t, i) => (
        <g key={i}>
          <rect x={420 + (i % 6) * 92} y={48 + Math.floor(i / 6) * 54} width="86" height="44" rx="7"
            fill={i >= 6 ? '#F7F6FA' : '#FFFFFF'} stroke={PURPLE} strokeWidth="1.3" strokeDasharray={i >= 6 ? '4 3' : undefined} />
          <text x={463 + (i % 6) * 92} y={75 + Math.floor(i / 6) * 54} textAnchor="middle" fontSize="11">{t}</text>
          <text x={463 + (i % 6) * 92} y={89 + Math.floor(i / 6) * 54} textAnchor="middle" fontSize="9" fill="#94A3B8">pass {i + 1}</text>
        </g>
      ))}
      <text x="490" y="168" textAnchor="middle" fontSize="11.5" fill={PURPLE_DARK}>
        latency grows with wording — and output can still be malformed
      </text>

      <line x1="10" y1="192" x2="970" y2="192" stroke="#EEF1F4" />

      <text x="10" y="224" fontSize="13" fontWeight="800" fill={TEAL_DARK}>SWAP: ONE DECISION, ONE PASS</text>
      <rect x="10" y="238" width="150" height="46" rx="8" fill="#FFFFFF" stroke={TEAL} strokeWidth="1.8" />
      <text x="85" y="266" textAnchor="middle" fontSize="12">input (name, body)</text>
      <path d="M 164 261 L 200 261" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr4)" />
      <rect x="205" y="238" width="170" height="46" rx="8" fill="#FFFFFF" stroke={TEAL} strokeWidth="1.8" />
      <text x="290" y="259" textAnchor="middle" fontSize="12">frozen backbone</text>
      <text x="290" y="275" textAnchor="middle" fontSize="10.5" fill="#6B7280">one forward pass</text>
      <path d="M 379 261 L 415 261" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr4)" />
      <rect x="420" y="238" width="170" height="46" rx="8" fill="#FFFFFF" stroke={TEAL} strokeWidth="2.4" />
      <text x="505" y="259" textAnchor="middle" fontSize="12" fontWeight="700">2-way head</text>
      <text x="505" y="275" textAnchor="middle" fontSize="10.5" fill="#6B7280">3,074 trainable params</text>
      <path d="M 594 261 L 630 261" stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arr4)" />
      <rect x="635" y="238" width="160" height="46" rx="8" fill="#E3F2F2" stroke={TEAL} strokeWidth="1.8" />
      <text x="715" y="261" textAnchor="middle" fontSize="12" fontWeight="700" fill={TEAL_DARK}>[match, mismatch]</text>
      <text x="715" y="277" textAnchor="middle" fontSize="10.5" fill="#6B7280">confidence = softmax</text>
      <text x="490" y="316" textAnchor="middle" fontSize="11.5" fill={TEAL_DARK}>
        constant latency, typed output, inspectable scores — the same interface a CI hook needs
      </text>
    </svg>
  );
}

function TrainingSim() {
  const [epoch, setEpoch] = useState(12);
  const [quantized, setQuantized] = useState(false);
  const c = useMemo(() => confusionAt(epoch), [epoch]);
  const acc = accuracyAt(epoch);
  const q = quantized ? QUANT.int8 : QUANT.fp;

  const cell = (n, label, color) => (
    <div style={{
      padding: '10px 6px', textAlign: 'center', borderRadius: 8,
      background: color === 'good' ? '#E3F2F2' : '#FBEAE4',
      color: color === 'good' ? TEAL_DARK : RED, fontWeight: 700, fontSize: 15,
    }}>
      {n}
      <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.8, marginTop: 2 }}>{label}</div>
    </div>
  );

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>📈 Simulator — train only the head</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            The backbone is frozen: 3,074 parameters learn to map “function name + body” → match/mismatch. Scrub epochs, then quantize the backbone and watch the footprint collapse.
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>Training epochs (head only)</span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>epoch {epoch} · val acc {(acc * 100).toFixed(1)}%</span>
          </div>
          <input type="range" min={0} max={50} step={1} value={epoch}
            onChange={(e) => setEpoch(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} aria-label="Training epochs" />
        </div>

        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 8 }}>Validation confusion (40 examples)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, maxWidth: 340 }}>
              {cell(c.tp, 'true match', 'good')}
              {cell(c.fn, 'missed mismatch (FN)', 'bad')}
              {cell(c.fp, 'false alarm (FP)', 'bad')}
              {cell(c.tn, 'true mismatch', 'good')}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Backbone storage</span>
              <button onClick={() => setQuantized(!quantized)}
                style={{
                  padding: '6px 12px', fontSize: 12, borderRadius: 8, cursor: 'pointer',
                  border: `1px solid ${quantized ? TEAL : 'var(--ds-color-border-subtle)'}`,
                  background: quantized ? '#E3F2F2' : 'transparent',
                  color: quantized ? TEAL_DARK : 'var(--ds-color-text-secondary)',
                  fontWeight: 600,
                }}>
                {quantized ? 'dynamic int8 ✓' : 'quantize → int8'}
              </button>
            </div>
            <div style={{ fontSize: 34, fontWeight: 800, color: quantized ? TEAL_DARK : PURPLE_DARK, lineHeight: 1.1 }}>
              {q.sizeGB} GB
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ds-color-text-secondary)', marginLeft: 8 }}>
                {q.label} · ~{q.latencyMs} ms forward
              </span>
            </div>
            <div style={{ height: 12, background: '#EEF1F4', borderRadius: 6, marginTop: 12, overflow: 'hidden' }}>
              <div style={{
                width: `${(q.sizeGB / QUANT.fp.sizeGB) * 100}%`, height: '100%',
                background: quantized ? TEAL : PURPLE, transition: 'all var(--ds-motion-duration-base)',
              }} />
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)', marginTop: 6 }}>
              {quantized
                ? `85% smaller — the head decides on a backbone that fits beside it.`
                : `fp16 baseline: the frozen weights still dominate the footprint.`}
            </div>
          </div>
        </Grid>

        <Callout type={acc >= 0.95 ? 'success' : 'info'} title="Single pass, bounded decision">
          At epoch {epoch} the model needs <strong>one forward pass</strong> to answer — no decoding loop, no prose, just a calibrated {`{match, mismatch}`} pair. That is the interface a CI hook (exit 0/1) or an editor plugin wants.
        </Callout>
      </Stack>
    </Card>
  );
}

export default function System1HeadTab() {
  const [activeSubTab, setActiveSubTab] = useState('loop');

  const archColumns = [
    { key: 'aspect', header: 'Aspect' },
    { key: 'loop', header: 'Autoregressive loop', render: (v) => <span style={{ color: PURPLE_DARK }}>{v}</span> },
    { key: 'single', header: 'Single-pass head', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];

  const swapColumns = [
    { key: 'part', header: 'Component' },
    { key: 'before', header: 'Before (generation model)', render: (v) => <span style={{ color: PURPLE_DARK }}>{v}</span> },
    { key: 'after', header: 'After (decision model)', render: (v) => <span style={{ color: TEAL_DARK, fontWeight: 600 }}>{v}</span> },
    { key: 'changed', header: 'Changed', render: (v) => (
      v ? <Badge variant="default" style={{ background: '#E3F2F2', color: TEAL_DARK }}>swapped</Badge>
        : <Badge variant="default" style={{ background: '#EEF1F4', color: '#6B7280' }}>same</Badge>
    ) },
  ];

  const datasetColumns = [
    { key: 'name', header: 'Function name', render: (v) => <code>{v}</code> },
    { key: 'body', header: 'Body', render: (v) => <code>{v}</code> },
    { key: 'label', header: 'Label', render: (v) => (
      <Badge variant="default" style={{ background: v === 'match' ? '#E3F2F2' : '#FBEAE4', color: v === 'match' ? TEAL_DARK : RED }}>{v}</Badge>
    ) },
  ];

  const demoColumns = [
    { key: 'fn', header: 'Function', render: (v) => <code style={{ fontSize: 12 }}>{v}</code> },
    { key: 'verdict', header: 'Head verdict', render: (v) => (
      v === 'match'
        ? <Badge variant="default" style={{ background: '#E3F2F2', color: TEAL_DARK }}>match</Badge>
        : <Badge variant="default" style={{ background: '#FBEAE4', color: RED }}>{v}</Badge>
    ) },
    { key: 'conf', header: 'Confidence', render: (v) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 90, height: 7, background: '#EEF1F4', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${v * 100}%`, height: '100%', background: v > 0.9 ? TEAL : PURPLE }} />
        </div>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{v.toFixed(2)}</span>
      </div>
    ) },
  ];

  const editorColumns = [
    { key: 'check', header: 'What is checked' },
    { key: 'editor', header: 'Editor / linter', render: (v) => (
      <span style={{ color: v.includes('✓') ? TEAL_DARK : RED, fontWeight: 600 }}>{v}</span>
    ) },
    { key: 'semantic', header: 'Semantic decision head', render: (v) => (
      <span style={{ color: v.includes('✓') ? TEAL_DARK : 'var(--ds-color-text-secondary)' }}>{v}</span>
    ) },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="system1head"
        moduleLabel="ML Systems [Model Design]"
        title="Single-Pass Decision Head: One Forward Pass Instead of a Decoding Loop"
        description="Bounded yes/no decisions do not need generation. Freeze a small open-weight backbone, delete its vocabulary head, and train a 3,074-parameter classification head on your own labeled pairs — System 1 speed with the interface a CI hook or editor plugin actually wants."
        metrics={[
          { label: 'Trainable parameters', value: '3,074' },
          { label: 'Frozen backbone', value: '1.5B' },
          { label: 'Forward passes per decision', value: '1' },
          { label: 'int8 footprint (from 6.17 GB)', value: '0.93 GB' },
        ]}
      />

      <Container size="wide">
        <div style={{
          display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto',
        }}>
          {SUBTABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1, minWidth: '185px', padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)', border: 'none',
                background: activeSubTab === tab.id ? TEAL : 'transparent',
                color: activeSubTab === tab.id ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer', textAlign: 'left',
                fontWeight: activeSubTab === tab.id ? 600 : 500,
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--ds-font-size-body)', marginBottom: 2 }}>
                <span>{tab.icon}</span><span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {activeSubTab === 'loop' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>System 2 by default — even when the question is System 1</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Asking a decoder “does this name match this body?” burns ten forward passes to emit a sentence the caller will regex anyway. The decision was bounded from the start; the loop is overhead.
              </p>
              <LoopVsSingle />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Loop vs single pass</h3>
              <Table columns={archColumns} data={ARCH_COMPARISON} sortable={false} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'swap' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>What changes — and what deliberately does not</h3>
              <Table columns={swapColumns} data={HEAD_SWAP} sortable={false} />
              <Callout type="tip" title="Why freeze the backbone?">
                The representation is already there — a code-pretrained backbone knows what <code>min</code> and <code>max</code> mean. Training only the head means a few thousand gradients instead of billions, minutes of training on one GPU, and an optimizer state you can ignore. The head learns the decision boundary; the backbone supplies the features.
              </Callout>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>The dataset — pairs, not prose</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Each example pairs a function name with its body and a human label. The mismatch rows are the interesting half: correct syntax, wrong semantics — exactly what an editor cannot see.
              </p>
              <Table columns={datasetColumns} data={DATASET} sortable={false} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'simulator' && <TrainingSim />}

        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>1 · The model — frozen backbone, trainable head</h3>
              <CodeBlock language="python" code={CODE_MODEL} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>2 · Head-only training loop</h3>
              <CodeBlock language="python" code={CODE_TRAIN} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>3 · Shrink the backbone (6.17 GB → 0.93 GB)</h3>
              <CodeBlock language="python" code={CODE_QUANT} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>4 · CI hook — the model’s exit code is the verdict</h3>
              <CodeBlock language="python" code={CODE_CHECK} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'demo' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Demo run — 10 of 27 functions flagged</h3>
              <Table columns={demoColumns} data={DEMO_RESULTS} sortable={false} />
              <Callout type="info" title="Exit code, not prose">
                The checker prints mismatches and exits 1 so a pre-commit hook can fail the build — an interface no chat transcript gives you.
              </Callout>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Editor checks vs semantic checks</h3>
              <Table columns={editorColumns} data={EDITOR_VS_SEMANTIC} sortable={false} />
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
