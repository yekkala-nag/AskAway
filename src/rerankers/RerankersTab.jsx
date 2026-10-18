import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock } from '../components/ui/Content.jsx';
import { Card, Badge, Button, Callout } from '../components/ui/Core.jsx';
import DiagramImage from '../components/ui/DiagramImage.jsx';
import { RERANKER_TABLE, QUERY_REWRITES, RERANK, PYTHON_RERANK_CODE, FUNNEL_STAGES, funnelRecall, bottleneckStage, rerankCeiling, FUNNEL_CODE } from './rerankEngine.js';

const { Container, Grid, Flex, Stack } = Primitives;

function FunnelSim() {
  const [r0, setR0] = useState(0.92);
  const [r1, setR1] = useState(0.90);
  const [r2, setR2] = useState(0.96);
  const [r3, setR3] = useState(0.98);
  const recalls = [r0, r1, r2, r3];
  const end = funnelRecall(recalls);
  const ceiling = rerankCeiling(recalls);
  const bottleneck = bottleneckStage(recalls);
  const sliders = [setR0, setR1, setR2, setR3];
  return (
    <Stack gap={4}>
      <svg viewBox="0 0 760 210" style={{ width: '100%', height: 'auto' }} role="img" aria-label="retrieval funnel narrowing through four stages">
        {FUNNEL_STAGES.map((s, i) => {
          const w = 640 - i * 150;
          const x = 60 + i * 75;
          const h = 34;
          const y = 14 + i * 48;
          const hot = i === bottleneck;
          return (
            <g key={s.stage}>
              <rect x={x} y={y} width={w} height={h} rx={8}
                fill={hot ? '#FBEDE9' : i === 3 ? '#E8F3F3' : 'var(--ds-color-bg-surfaceHover)'}
                stroke={hot ? '#B4553A' : i === 3 ? '#3A9B9F' : 'var(--ds-color-border-subtle)'} strokeWidth={1.5} />
              <text x={x + 12} y={y + 21} fontSize={12.5} fontWeight={700} fill={hot ? '#B4553A' : '#1A6B6E'}>{s.stage}</text>
              <text x={x + w - 12} y={y + 21} fontSize={11.5} textAnchor="end" fill="var(--ds-color-text-secondary)">
                {s.candidatesOut.toLocaleString()} out · recall {recalls[i].toFixed(2)} · {s.ms}ms
              </text>
              {i < 3 && <line x1={380} y1={y + h} x2={380} y2={y + 48 - 14} stroke="#5B4B8A" strokeWidth={1.5} strokeDasharray="3 3" />}
            </g>
          );
        })}
      </svg>
      <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
        {FUNNEL_STAGES.map((s, i) => (
          <label key={s.stage} style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)' }}>
            {s.stage} recall: <strong style={{ color: i === bottleneck ? '#B4553A' : '#3A9B9F' }}>{recalls[i].toFixed(2)}</strong>
            <input type="range" min="0.5" max="1" step="0.01" value={recalls[i]}
              onChange={(e) => sliders[i](+e.target.value)} style={{ width: '100%' }}
              aria-label={`${s.stage} recall`} />
          </label>
        ))}
      </Grid>
      <Card style={{ padding: 14, background: '#090d16', border: `1px solid ${end >= 0.7 ? '#3A9B9F' : '#B4553A'}` }}>
        <div style={{ fontSize: 11, color: 'var(--ds-color-text-secondary)', fontWeight: 700 }}>END-TO-END RECALL (product of stages)</div>
        <div style={{ height: 14, borderRadius: 7, background: '#1E293B', overflow: 'hidden', margin: '6px 0' }}>
          <div style={{ width: `${end * 100}%`, height: '100%', background: end >= 0.7 ? '#3A9B9F' : '#B4553A', transition: 'width .3s' }} />
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 12.5, color: 'white' }}>
          {recalls.map((r) => r.toFixed(2)).join(' × ')} = {end.toFixed(4)}
        </div>
        <div style={{ fontSize: 11.5, color: '#F5A623', marginTop: 4 }}>
          Bottleneck: <strong>{FUNNEL_STAGES[bottleneck].stage}</strong> — improving anything else moves end recall less.
        </div>
      </Card>
      <Callout type="danger" title="The recall ceiling">
        No reranker can rank a passage retrieval never surfaced — with upstream recall {ceiling.toFixed(2)}, even a perfect reranker tops out at {ceiling.toFixed(2)}. Fix the funnel stage that leaks, not the ranker.
      </Callout>
      <Callout type="info" title="Agents make recall failures expensive">
        A human sees a bad result once. An agent that misses a candidate runs another search–evaluate–decide loop — every recall gap compounds into extra iterations, latency, and tokens.
      </Callout>
    </Stack>
  );
}

export default function RerankersTab() {
  const [sub, setSub] = useState('ladder');
  const [mode, setMode] = useState('cross');
  const [k, setK] = useState(3);
  const res = RERANK(mode, k);
  const tabs = [
    { id: 'ladder', icon: '🪜', label: '1. Rerank Ladder', desc: '5 methods + rewrites' },
    { id: 'sim', icon: '🔬', label: '2. Rerank Simulator', desc: 'Watch distractors fall' },
    { id: 'code', icon: '🛠️', label: '3. Pipeline Code', desc: 'bi → cross in Python' },
    { id: 'funnel', icon: '🌪️', label: '4. Retrieval Funnel', desc: 'Recall ceiling & staging' }
  ];
  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="rag_architecture" moduleLabel="RAG Architectures & Pipelines [Rerankers & Late Interaction]"
        title="Retrieve Broad, Rerank Ruthless"
        description="Bi-encoders recall; they don't discriminate. A cross-encoder over the top-50 rescues buried truths (0.58 → 0.95) and buries confident distractors. ColBERT for term-heavy, HyDE for vague."
        metrics={[{ label: 'Pattern', value: 'Top-50 → Top-k' }, { label: 'Precision Lift', value: '+10–30%' }, { label: 'Rescue Case', value: 'c5: 0.58 → 0.95' }, { label: 'Vague Fix', value: 'HyDE Draft' }]} />
      <Container size="wide">
        <div style={{ marginBottom: 'var(--ds-space-6)' }}><DiagramImage moduleId="rag_architecture" src="/assets/rerank_pipeline.svg" alt="Rerank pipeline" title="Bi-Only vs Cross-Encoder Rerank" caption="Same 6 candidates: bi-encoder buries truth at 4–6; rerank promotes to 1–3." background="#090d16" maxWidth={1100} /></div>
        <div style={{ display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' }}>
          {tabs.map(t => (<button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'white' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
            <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div></button>))}
        </div>
        {sub === 'ladder' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🪜 Five rerank methods + four query rewrites</h3></div>
          <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--ds-color-border-subtle)', color: 'var(--ds-color-text-secondary)' }}><th style={{ textAlign: 'left', padding: '8px' }}>Method</th><th style={{ textAlign: 'left', padding: '8px' }}>How</th><th style={{ padding: '8px' }}>Cost</th><th style={{ padding: '8px' }}>Gain</th><th style={{ textAlign: 'left', padding: '8px' }}>Use</th></tr></thead>
            <tbody>{RERANKER_TABLE.map((r, i) => (<tr key={i} style={{ borderBottom: '1px solid var(--ds-color-border-subtle)' }}><td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{r.method}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r.how}</td><td style={{ padding: '8px', textAlign: 'center', color: 'var(--ds-color-text-secondary)' }}>{r.cost}</td><td style={{ padding: '8px', textAlign: 'center', color: '#3A9B9F' }}>{r.gain}</td><td style={{ padding: '8px', color: 'var(--ds-color-text-secondary)' }}>{r.use}</td></tr>))}</tbody></table></div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap="var(--ds-space-2)">{QUERY_REWRITES.map((q, i) => (<Card key={i} style={{ padding: '10px', background: 'var(--ds-color-bg-surface)', borderLeft: '3px solid #F5A623' }}><div style={{ fontSize: '12px', color: '#F5A623', fontWeight: 'bold' }}>{q.pattern}</div><div style={{ fontSize: '11px', color: 'white', fontFamily: 'monospace' }}>{q.example}</div><div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{q.when}</div></Card>))}</Grid>
        </Stack></Card></Stack>)}
        {sub === 'sim' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🔬 Rerank simulator — 6 candidates, one truth buried</h3></div>
          <Card style={{ padding: '14px', background: '#090d16', border: '1px solid var(--ds-color-border-subtle)' }}>
            <Flex gap="var(--ds-space-2)" align="center" style={{ flexWrap: 'wrap' }}>
              <Button variant={mode === 'bi' ? 'primary' : 'secondary'} size="sm" onClick={() => setMode('bi')}>Bi-encoder only</Button>
              <Button variant={mode === 'cross' ? 'primary' : 'secondary'} size="sm" onClick={() => setMode('cross')}>+ Cross-encoder rerank</Button>
              <label style={{ fontSize: '11px', color: 'white', marginLeft: '8px' }}>k = {k}</label>
              <input type="range" min="1" max="6" value={k} onChange={e => setK(+e.target.value)} style={{ width: '120px' }} />
            </Flex>
          </Card>
          <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${res.precision >= 0.8 ? '#5EC4C8' : '#ef4444'}` }}>
            <Flex justify="space-between" align="center"><strong style={{ fontSize: '13px' }}>{res.mode}</strong><Badge variant="subtle" style={{ fontSize: '10px', background: res.precision >= 0.8 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: res.precision >= 0.8 ? '#5EC4C8' : '#ef4444' }}>P@{k} = {res.precision}</Badge></Flex>
            <Stack gap={2} style={{ marginTop: '8px' }}>{res.ranked.map((c, i) => (<div key={c.id} style={{ fontSize: '12px', fontFamily: 'monospace', color: ['c1', 'c3', 'c5'].includes(c.id) ? '#5EC4C8' : 'var(--ds-color-text-tertiary)' }}>{i + 1}. [{c.id}] {c.text}</div>))}</Stack>
            <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', marginTop: '8px' }}>{res.note}</div>
          </Card>
        </Stack></Card></Stack>)}
        {sub === 'code' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🛠️ Retrieve-then-rerank pipeline code</h3></div>
          <CodeBlock language="python" code={PYTHON_RERANK_CODE} />
          <Callout type="success"><strong>Default production:</strong> bi-encoder top-50 → cross-encoder top-5. Escalate to RankGPT only for high-stakes small sets; ColBERT where terms matter; HyDE where queries are vague.</Callout>
        </Stack></Card></Stack>)}
        {sub === 'funnel' && (<Stack gap={6}><Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}><Stack gap={4}>
          <div><h3 style={{ margin: 0 }}>🌪️ Retrieval is a funnel — cheap-and-wide first</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--ds-color-text-secondary)' }}>
              Rerankers are the last stage, not a rescue. Slide each stage's recall to see why the product — not the ranker — decides the ceiling.
            </p></div>
          <FunnelSim />
          <CodeBlock language="python" code={FUNNEL_CODE} />
        </Stack></Card></Stack>)}
      </Container>
    </div>
  );
}
