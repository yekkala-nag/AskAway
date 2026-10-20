import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  SECTIONS,
  QUESTIONS,
  INTERVIEW_PIVOT,
  attentionAt,
  chunkStats,
  CHUNK_STRATEGIES,
  PIPELINE_STAGES,
  rrfMerge,
  weightedMerge,
  triage,
  JUDGE_BIASES,
  LATENCY_HOPS,
  totalLatency,
  answerGate,
  QUERY_TRANSFORMS,
  RISK_TABLE,
  RAGI_CODE,
} from './ragInterviewEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'wall', icon: '🗂️', label: '1. Question Wall', desc: '30 senior answers' },
  { id: 'pipeline', icon: '⚙️', label: '2. Pipeline Lab', desc: 'Workflow + lost-in-the-middle' },
  { id: 'mixer', icon: '🎛️', label: '3. Retrieval Mixer', desc: 'Hybrid, RRF, rewrite' },
  { id: 'safety', icon: '🛡️', label: '4. Eval & Safety', desc: 'Triage, latency, gates' },
];

// ── 1. Question Wall ────────────────────────────────────────────────────────

function QuestionWall() {
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? QUESTIONS : QUESTIONS.filter((q) => q.s === filter);

  return (
    <Stack gap={5}>
      <Callout type="success" title="How to use this in an interview">
        {INTERVIEW_PIVOT}
      </Callout>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} aria-pressed={filter === 'all'} style={chipStyle(filter === 'all')}>
          All 30
        </button>
        {SECTIONS.map((s) => (
          <button key={s.id} onClick={() => setFilter(s.id)} aria-pressed={filter === s.id} style={chipStyle(filter === s.id)}>
            {s.icon} {s.n}. {s.name}
          </button>
        ))}
      </div>
      <Grid columns={2} gap="var(--ds-space-4)">
        {shown.map((item) => {
          const sec = SECTIONS.find((s) => s.id === item.s);
          return (
            <Card key={item.n} style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <Badge variant="default">Q{item.n}</Badge>
                <span style={{ fontSize: 11.5, color: 'var(--ds-color-text-tertiary)' }}>{sec.icon} {sec.name}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ds-color-text-primary)', marginBottom: 6 }}>{item.q}</div>
              <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.55 }}>{item.core}</div>
              <div style={{
                marginTop: 10, padding: '8px 10px', borderRadius: 8,
                background: '#F4EFE6', border: '1px solid #E4D9C3', fontSize: 12.5,
                color: 'var(--ds-color-text-primary)', lineHeight: 1.55,
              }}>
                <strong style={{ color: AMBER }}>💡 Pro Insight:</strong> {item.insight}
              </div>
            </Card>
          );
        })}
      </Grid>
    </Stack>
  );
}

function chipStyle(active) {
  return {
    padding: '7px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5,
    border: `1.5px solid ${active ? PURPLE : 'var(--ds-color-border-subtle)'}`,
    background: active ? PURPLE : 'var(--ds-color-bg-surface)',
    color: active ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
    transition: 'all .2s',
  };
}

// ── 2. Pipeline Lab ─────────────────────────────────────────────────────────

function PipelineLab() {
  const [evalOn, setEvalOn] = useState(true);
  const [pos, setPos] = useState(4);
  const [size, setSize] = useState(500);
  const [overlap, setOverlap] = useState(50);
  const safeOverlap = Math.min(overlap, size - 1);
  const stats = chunkStats(size, safeOverlap);
  const SLOTS = 9;
  const attention = attentionAt(pos, SLOTS);
  const columns = [
    { key: 'strategy', header: 'Strategy', render: (v) => <strong>{v}</strong> },
    { key: 'how', header: 'How it works', sortable: false },
    { key: 'risk', header: 'Risk', sortable: false },
    { key: 'when', header: 'Use when', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>⚙️ The seven-stage pipeline — the 7th is the one teams skip</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Ingestion → retrieval → generation is the visible pipeline. Evaluation & tracing is the hidden stage that turns vibes into proof.
            </p>
          </div>
          <svg viewBox="0 0 880 120" style={{ width: '100%', height: 'auto' }} role="img" aria-label="seven-stage RAG pipeline flow">
            {PIPELINE_STAGES.map((s, i) => {
              const x = 6 + i * 126;
              const dim = s.stage.startsWith('Evaluate') && !evalOn;
              return (
                <g key={s.n} opacity={dim ? 0.35 : 1}>
                  <rect x={x} y={24} width={110} height={64} rx={11}
                    fill={s.core ? 'var(--ds-color-bg-surfaceHover)' : (evalOn ? '#F4EFE6' : 'var(--ds-color-bg-surfaceHover)')}
                    stroke={s.core ? TEAL : (evalOn ? AMBER : 'var(--ds-color-border-subtle)')}
                    strokeWidth={1.5} strokeDasharray={s.core ? undefined : '5 3'} />
                  <text x={x + 10} y={50} fontSize={15}>{s.core ? '▣' : '👁'}</text>
                  <text x={x + 10} y={72} fontSize={11} fontWeight={700} fill={TEAL_DARK}>{s.stage}</text>
                  {i < PIPELINE_STAGES.length - 1 && (
                    <g opacity={i === 5 ? 0.6 : 1}>
                      <line x1={x + 110} y1={56} x2={x + 122} y2={56} stroke={PURPLE} strokeWidth={2} />
                      <polygon points={`${x + 122},56 ${x + 116},53 ${x + 116},59`} fill={PURPLE} />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setEvalOn((v) => !v)} aria-pressed={evalOn} style={{
              padding: '9px 16px', borderRadius: 999, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              border: `1.5px solid ${evalOn ? AMBER : 'var(--ds-color-border-subtle)'}`,
              background: evalOn ? AMBER : 'transparent', color: evalOn ? '#fff' : 'var(--ds-color-text-secondary)',
              minHeight: 44,
            }}>
              {evalOn ? '✓ Evaluate & trace: ON' : '✗ Evaluate & trace: OFF'}
            </button>
            <div style={{ fontSize: 13, color: evalOn ? TEAL_DARK : RED, fontWeight: evalOn ? 600 : 500 }}>
              {evalOn
                ? 'Golden dataset + traces → every change is measured, regressions block the PR.'
                : 'Flying blind: no golden set, no traces — you cannot prove a change made anything better.'}
            </div>
          </div>
          <Callout type="tip" title="Retrieval quality is the ceiling">
            No prompt fixes a pipeline that retrieves garbage. Spend most of your effort on ingestion, chunking, and the eval set — a mediocre model with perfect retrieval wins.
          </Callout>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🕳️ Lost-in-the-Middle Simulator — drag the key fact around</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Attention is U-shaped: strong at the edges, weakest in the middle. Position is a retrieval design choice, not luck.
            </p>
          </div>
          <Grid columns={2} gap="var(--ds-space-4)">
            <Stack gap={3}>
              <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
                Position of the key chunk: <strong style={{ color: PURPLE }}>#{pos + 1} of {SLOTS}</strong>
                <input type="range" min={0} max={SLOTS - 1} value={pos} onChange={(e) => setPos(+e.target.value)}
                  style={{ width: '100%' }} aria-label="position of key chunk in the prompt" />
              </label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 110 }}>
                {Array.from({ length: SLOTS }, (_, i) => {
                  const a = attentionAt(i, SLOTS);
                  return (
                    <button key={i} onClick={() => setPos(i)} aria-label={`chunk position ${i + 1}`}
                      style={{
                        flex: 1, height: `${a * 100}%`, minHeight: 8, borderRadius: '6px 6px 0 0', cursor: 'pointer', border: 'none',
                        background: i === pos ? PURPLE : (a < 0.5 ? '#E8B4A8' : '#9CC7C9'),
                        transition: 'height .25s, background .25s',
                      }} />
                  );
                })}
              </div>
            </Stack>
            <Card style={{
              padding: 'var(--ds-space-4)',
              background: attention < 0.5 ? '#FDF0EC' : '#E8F3F3',
              border: `1.5px solid ${attention < 0.5 ? RED : TEAL}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>ATTENTION TO THIS CHUNK</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: attention < 0.5 ? RED : TEAL_DARK, margin: '4px 0' }}>
                {(attention * 100).toFixed(0)}%
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
                {attention < 0.5
                  ? 'Middle zone — the model is likely to skip it. Rerank to a tighter top-k and restate the best chunk at the end.'
                  : attention < 0.75
                    ? 'Mid-edge: readable, but a summary restatement at the end locks it in.'
                    : 'Edge position — first or last, the model reads it reliably.'}
              </div>
            </Card>
          </Grid>
          <Callout type="info" title="The three mitigations">
            1) Rerank down to top 3–5 chunks instead of 10+. 2) Order by relevance — best chunk first, summary restated last. 3) Map-reduce huge contexts instead of stuffing them.
          </Callout>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>✂️ Chunking strategies & the overlap dial</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Naive fixed-size slicing is the most common silent failure — it destroys meaning at the boundary before retrieval ever runs.
            </p>
          </div>
          <Grid columns={2} gap="var(--ds-space-4)">
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Chunk size: <strong style={{ color: TEAL_DARK }}>{size} tokens</strong>
              <input type="range" min={100} max={1000} step={50} value={size} onChange={(e) => setSize(+e.target.value)}
                style={{ width: '100%' }} aria-label="chunk size in tokens" />
            </label>
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Overlap: <strong style={{ color: PURPLE }}>{safeOverlap} tokens ({(safeOverlap / size * 100).toFixed(0)}%)</strong>
              <input type="range" min={0} max={200} step={10} value={safeOverlap} onChange={(e) => setOverlap(+e.target.value)}
                style={{ width: '100%' }} aria-label="overlap in tokens" />
            </label>
          </Grid>
          <div style={{
            fontSize: 13, padding: 10, borderRadius: 8, background: 'var(--ds-color-bg-surfaceHover)',
            color: 'var(--ds-color-text-primary)',
          }}>
            step = {size} − {safeOverlap} = <strong style={{ color: TEAL_DARK }}>{stats.step}</strong> · redundancy = {safeOverlap}/{size} = <strong style={{ color: PURPLE }}>{stats.redundancyPct}%</strong>{' '}
            · {stats.redundancyPct < 10 ? '⚠️ below the 10–15% start — boundary facts get sliced' : stats.redundancyPct <= 15 ? '✓ in the healthy 10–15% starting band' : '⚠️ heavy overlap — duplicate retrievals burn context budget'}
          </div>
          <Table columns={columns} data={CHUNK_STRATEGIES} sortable={false} />
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 3. Retrieval Mixer ──────────────────────────────────────────────────────

const MIX_DOCS = [
  { id: 'A', label: 'A · policy clause', dense: 0.92, sparse: 0.41 },
  { id: 'B', label: 'B · exact SKU match', dense: 0.55, sparse: 0.97 },
  { id: 'C', label: 'C · synonym hit', dense: 0.88, sparse: 0.35 },
  { id: 'D', label: 'D · acronym match', dense: 0.44, sparse: 0.91 },
  { id: 'E', label: 'E · partial topic', dense: 0.66, sparse: 0.58 },
  { id: 'F', label: 'F · weak both ways', dense: 0.31, sparse: 0.27 },
];

function rankedBy(key) {
  return [...MIX_DOCS].sort((a, b) => b[key] - a[key]).map((d) => d.id);
}

function RetrievalMixer() {
  const [mode, setMode] = useState('rrf');
  const [w, setW] = useState(0.7);

  const denseScores = MIX_DOCS.map((d) => ({ id: d.id, score: d.dense }));
  const sparseScores = MIX_DOCS.map((d) => ({ id: d.id, score: d.sparse }));

  const merged = useMemo(() => {
    if (mode === 'rrf') return rrfMerge(rankedBy('dense'), rankedBy('sparse'), 60);
    return weightedMerge(denseScores, sparseScores, w).map((r) => ({ id: r.id, score: r.score, inLists: [] }));
  }, [mode, w]);

  const columns = [
    { key: 'id', header: 'Doc', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
    { key: 'score', header: mode === 'rrf' ? 'RRF score (k=60)' : `Fused score (w·dense + (1−w)·sparse)`, render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace' }}>{typeof v === 'number' ? v.toFixed(4) : v}</span> },
    {
      key: 'note', header: 'Why it ranks here', sortable: false,
      render: (v, row) => <span style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)' }}>{v}</span>,
    },
  ];

  const rows = merged.map((m) => {
    const doc = MIX_DOCS.find((d) => d.id === m.id);
    const note = mode === 'rrf'
      ? `dense #${rankedBy('dense').indexOf(m.id) + 1} + sparse #${rankedBy('sparse').indexOf(m.id) + 1}${m.inLists.length < 2 ? ' — appears in one list only, so RRF ranks it lower' : ' — strong in BOTH lists, RRF rewards it'}`
      : `dense ${doc.dense.toFixed(2)} · sparse ${doc.sparse.toFixed(2)} at w=${w.toFixed(2)}`;
    return { id: m.id, score: m.score, note };
  });

  const qColumns = [
    { key: 'name', header: 'Technique', render: (v) => <strong>{v}</strong> },
    { key: 'how', header: 'How', sortable: false },
    { key: 'when', header: 'Use when', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🎛️ Hybrid fusion — RRF vs. weighted blend</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Dense finds synonyms; sparse finds exact IDs. Fuse both and watch which document wins under each rule.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setMode('rrf')} aria-pressed={mode === 'rrf'} style={chipStyle(mode === 'rrf')}>
              Reciprocal Rank Fusion (k=60)
            </button>
            <button onClick={() => setMode('weighted')} aria-pressed={mode === 'weighted'} style={chipStyle(mode === 'weighted')}>
              Weighted linear blend
            </button>
          </div>
          {mode === 'weighted' && (
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Dense weight w: <strong style={{ color: TEAL_DARK }}>{w.toFixed(2)}</strong> · sparse weight:{' '}
              <strong style={{ color: PURPLE }}>{(1 - w).toFixed(2)}</strong>
              <input type="range" min={0} max={1} step={0.05} value={w} onChange={(e) => setW(+e.target.value)}
                style={{ width: '100%' }} aria-label="dense weight for hybrid fusion" />
            </label>
          )}
          <Table columns={columns} data={rows} sortable={false} />
          <Callout type={mode === 'rrf' ? 'info' : 'warning'} title={mode === 'rrf' ? 'RRF: parameter-light, normalize-free' : 'Weighted: full control, more tuning'}>
            {mode === 'rrf'
              ? 'Rank positions only — no score normalization across two incomparable scales. One constant (k≈60) and you are done.'
              : 'You own the balance, so you must grid-search w on a validation set. Push w to 1.0 and exact-ID documents vanish; push to 0.0 and synonyms do.'}
          </Callout>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <div>
            <h3 style={{ margin: 0 }}>✍️ Query transformation toolkit</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Users ask terrible queries. Rewrite before retrieval — one cheap model call that lifts recall more than most index tuning.
            </p>
          </div>
          <Table columns={qColumns} data={QUERY_TRANSFORMS} sortable={false} />
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 4. Eval & Safety ────────────────────────────────────────────────────────

function EvalSafety() {
  const [recall, setRecall] = useState(0.55);
  const [faith, setFaith] = useState(0.85);
  const [cacheHit, setCacheHit] = useState(false);
  const [score, setScore] = useState(0.72);
  const t = triage(recall, faith);
  const lat = totalLatency(cacheHit);
  const gate = answerGate(score);
  const maxMs = Math.max(...LATENCY_HOPS.map((h) => h.ms));

  const riskCols = [
    { key: 'risk', header: 'Risk', render: (v) => <strong style={{ color: RED }}>{v}</strong> },
    { key: 'via', header: 'How it happens', sortable: false },
    { key: 'mitigation', header: 'Mitigation', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];
  const biasCols = [
    { key: 'bias', header: 'Bias', render: (v) => <strong>{v}</strong> },
    { key: 'what', header: 'Symptom', sortable: false },
    { key: 'fix', header: 'Fix', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🩺 Metric triage — each broken metric names its own fix</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Evaluate retrieval and generation separately. Drag the two scores and read the diagnosis a staff engineer would give.
            </p>
          </div>
          <Grid columns={2} gap="var(--ds-space-4)">
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Context recall: <strong style={{ color: TEAL_DARK }}>{recall.toFixed(2)}</strong>
              <input type="range" min={0} max={1} step={0.05} value={recall} onChange={(e) => setRecall(+e.target.value)}
                style={{ width: '100%' }} aria-label="context recall score" />
            </label>
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Faithfulness: <strong style={{ color: PURPLE }}>{faith.toFixed(2)}</strong>
              <input type="range" min={0} max={1} step={0.05} value={faith} onChange={(e) => setFaith(+e.target.value)}
                style={{ width: '100%' }} aria-label="faithfulness score" />
            </label>
          </Grid>
          <div style={{
            padding: 12, borderRadius: 10, fontSize: 13.5, lineHeight: 1.6,
            background: t.healthy ? '#E8F3F3' : '#FDF0EC',
            border: `1.5px solid ${t.healthy ? TEAL : RED}`,
            color: 'var(--ds-color-text-primary)',
          }}>
            <strong style={{ color: t.healthy ? TEAL_DARK : RED }}>{t.healthy ? '✓ HEALTHY — watch answer relevance & cost next' : '⚠ TRIAGE'}</strong>
            <div style={{ marginTop: 4 }}>{t.verdict}</div>
            <div style={{ marginTop: 4, fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Golden-set regression: block the PR if a change drops either metric by more than 5%.
            </div>
          </div>
        </Stack>
      </Card>

      <Grid columns={2} gap="var(--ds-space-4)">
        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <Stack gap={3}>
            <div>
              <h3 style={{ margin: 0 }}>⚖️ LLM-as-a-judge: three biases</h3>
              <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Scalable grading, systematic distortions — mitigate or your scores lie.
              </p>
            </div>
            <Table columns={biasCols} data={JUDGE_BIASES} sortable={false} />
          </Stack>
        </Card>

        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <Stack gap={3}>
            <div>
              <h3 style={{ margin: 0 }}>⏱️ Latency waterfall — attack the critical path</h3>
              <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Sequential hops dominate RAG latency; cache and streaming cut what the network cannot.
              </p>
            </div>
            {LATENCY_HOPS.map((h) => (
              <div key={h.hop} style={{ opacity: cacheHit ? 0.35 : 1, transition: 'opacity .25s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
                  <span>{h.hop}</span><span style={{ fontFamily: 'ui-monospace, monospace' }}>{h.ms} ms</span>
                </div>
                <div style={{ height: 12, borderRadius: 6, background: '#E5E7EB', overflow: 'hidden', marginTop: 3 }}>
                  <div style={{ width: `${(h.ms / maxMs) * 100}%`, height: '100%', background: h.ms > 300 ? RED : TEAL, transition: 'width .3s' }} />
                </div>
              </div>
            ))}
            <button onClick={() => setCacheHit((v) => !v)} aria-pressed={cacheHit} style={{
              padding: '9px 16px', borderRadius: 999, cursor: 'pointer', fontSize: 13, fontWeight: 600, minHeight: 44,
              border: `1.5px solid ${cacheHit ? TEAL : 'var(--ds-color-border-subtle)'}`,
              background: cacheHit ? TEAL : 'transparent', color: cacheHit ? '#fff' : 'var(--ds-color-text-secondary)',
            }}>
              {cacheHit ? '✓ Semantic cache: HIT' : '○ Semantic cache: MISS'}
            </button>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: cacheHit ? TEAL_DARK : RED }}>
              {lat.ms} ms — {lat.label}
            </div>
            <Callout type="info" title="Perceived vs. actual latency">
              Streaming the response shrinks time-to-first-token even when total generation time is unchanged — users feel the first token, not the last.
            </Callout>
          </Stack>
        </Card>
      </Grid>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🚪 Answerability gate — abstention is a feature</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Out-of-domain queries always get "closest" documents back. Score relevance before generation, or the model will force a confident wrong answer.
            </p>
          </div>
          <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            Context-vs-query relevance score: <strong style={{ color: PURPLE }}>{score.toFixed(2)}</strong> (threshold 0.65)
            <input type="range" min={0} max={1} step={0.01} value={score} onChange={(e) => setScore(+e.target.value)}
              style={{ width: '100%' }} aria-label="context relevance score for answerability gate" />
          </label>
          <Grid columns={2} gap="var(--ds-space-4)">
            <Card style={{
              padding: 'var(--ds-space-4)',
              background: gate.action === 'answer' ? '#E8F3F3' : '#FDF0EC',
              border: `1.5px solid ${gate.action === 'answer' ? TEAL : RED}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>GATE VERDICT</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: gate.action === 'answer' ? TEAL_DARK : RED, margin: '4px 0' }}>
                {gate.action === 'answer' ? '✓ GENERATE with citations' : '✋ FALLBACK — fixed refusal'}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>{gate.reason}</div>
            </Card>
            <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>CITATION-FORCING PATTERN</div>
              <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.6, color: 'var(--ds-color-text-primary)' }}>
                Answer ONLY from context · append <code>[Source: doc_id]</code> per claim · output the fixed abstention string when context is silent · then verify every cited id exists in the retrieved metadata.
              </div>
            </Card>
          </Grid>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <div>
            <h3 style={{ margin: 0 }}>🔒 RAG security risks & mitigations</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Three threats cover most of the surface: injected instructions, cross-permission retrieval, and sensitive data embedded in shared space.
            </p>
          </div>
          <Table columns={riskCols} data={RISK_TABLE} sortable={false} />
          <CodeBlock language="python" code={RAGI_CODE} />
        </Stack>
      </Card>
    </Stack>
  );
}

// ── Tab ─────────────────────────────────────────────────────────────────────

export default function RagInterviewTab() {
  const [activeSubTab, setActiveSubTab] = useState('wall');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="raginterview"
        moduleLabel="RAG Systems"
        title="30 RAG Interview Questions — Senior-Level Answers"
        description="The top 30 retrieval-augmented generation questions, each delivered the way a staff engineer answers: a concise core concept, then a Pro Insight on the production reality — trade-offs, edge cases, and battle-tested defaults. Backed by four simulators: the seven-stage pipeline, lost-in-the-middle, hybrid fusion, and the eval & safety bench."
        metrics={[
          { label: 'Questions', value: '30' },
          { label: 'Sections', value: '6' },
          { label: 'Simulators', value: '4' },
          { label: 'Pro insights', value: '30' },
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
                background: activeSubTab === tab.id ? PURPLE : 'transparent',
                color: activeSubTab === tab.id ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer', textAlign: 'left',
                fontWeight: activeSubTab === tab.id ? 600 : 500,
                transition: 'background .2s, color .2s',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--ds-font-size-body)', marginBottom: 2 }}>
                <span>{tab.icon}</span><span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {activeSubTab === 'wall' && <QuestionWall />}
        {activeSubTab === 'pipeline' && <PipelineLab />}
        {activeSubTab === 'mixer' && <RetrievalMixer />}
        {activeSubTab === 'safety' && <EvalSafety />}
      </Container>
    </div>
  );
}
