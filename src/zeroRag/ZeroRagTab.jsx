import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  ZR_STAGES,
  ZR_SCALING,
  ZR_CODE,
  chunkWords,
  chunkCount,
  cosineDistance,
  topK,
  answerPlan,
  bruteForceMillis,
} from './zeroRagEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'loop', icon: '🔁', label: '1. The Loop', desc: 'Four stages, zero servers' },
  { id: 'chunk', icon: '✂️', label: '2. Chunking Lab', desc: 'Size and overlap' },
  { id: 'cosine', icon: '🧭', label: '3. Cosine Retriever', desc: 'Angle is meaning' },
  { id: 'abstain', icon: '🙅', label: '4. Answer or Abstain', desc: 'Grounded generation' },
];

const DEMO_TEXT = 'Retrieval augmented generation pairs a search step with a writing step. The search step finds passages that resemble the question. The writing step answers using only those passages and cites them. When the passages do not contain the answer the system must refuse to invent one and say the documents are silent on the topic. Overlap between neighboring chunks keeps sentences from being cut in half at a boundary and preserves the meaning of clauses that span two windows. Small models can run the whole loop on a laptop for prototyping before any infrastructure is purchased or rented.';

const RETRIEVE_SET = [
  { text: 'An archipelago nation of thousands of islands, famous for diving and beaches.', dist: 0.18 },
  { text: 'A coastal country known for tropical shoreline resorts and street markets.', dist: 0.31 },
  { text: 'Landlocked highlands with alpine trails and no coastline at all.', dist: 0.74 },
];

const QUERIES = [
  { id: 'beaches', q: 'Which places are known for islands and beaches?', contexts: RETRIEVE_SET.map((r) => r.text) },
  { id: 'mountains', q: 'Where can hikers find alpine terrain?', contexts: [RETRIEVE_SET[2].text] },
  { id: 'offtopic', q: 'What is the boiling point of tungsten?', contexts: RETRIEVE_SET.map((r) => r.text) },
];

function StageFlow() {
  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <h3 style={{ margin: '0 0 12px 0' }}>The whole loop is four stages — none of them needs a server</h3>
      <svg viewBox="0 0 860 130" style={{ width: '100%', height: 'auto' }} role="img" aria-label="Four-stage RAG flow: chunk, embed, retrieve, generate">
        {ZR_STAGES.map((s, i) => {
          const x = 10 + i * 212;
          return (
            <g key={s.n}>
              <rect x={x} y={22} width={175} height={70} rx={12}
                fill={i === 2 ? '#E8F3F3' : 'var(--ds-color-bg-surfaceHover)'}
                stroke={i === 2 ? TEAL : 'var(--ds-color-border-subtle)'} strokeWidth={1.5} />
              <text x={x + 14} y={48} fontSize={17}>{s.icon}</text>
              <text x={x + 40} y={48} fontSize={14} fontWeight={700} fill={TEAL_DARK}>{s.stage}</text>
              <text x={x + 14} y={72} fontSize={11} fill="var(--ds-color-text-secondary)">{s.output}</text>
              {i < 3 && (
                <g>
                  <line x1={x + 175} y1={57} x2={x + 208} y2={57} stroke={PURPLE} strokeWidth={2} />
                  <polygon points={`${x + 208},57 ${x + 200},53 ${x + 200},61`} fill={PURPLE} />
                </g>
              )}
            </g>
          );
        })}
      </svg>
      <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)" style={{ marginTop: 14 }}>
        {ZR_STAGES.map((s) => (
          <Card key={s.n} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: TEAL_DARK }}>{s.icon} Stage {s.n} — {s.stage}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{s.detail}</div>
          </Card>
        ))}
      </Grid>
      <CodeBlock language="python" code={ZR_CODE} />
    </Card>
  );
}

function ScalingTable() {
  const columns = [
    { key: 'corpus', header: 'Corpus', render: (v) => <strong>{v}</strong> },
    { key: 'qps', header: 'Query rate', sortable: false },
    {
      key: 'option', header: 'Right-sized store', sortable: false,
      render: (v, row) => (
        <span style={{ color: row.corpus.startsWith('≤') ? TEAL_DARK : 'var(--ds-color-text-primary)', fontWeight: row.corpus.startsWith('≤') ? 700 : 400 }}>{v}</span>
      ),
    },
    { key: 'why', header: 'Why', sortable: false },
    { key: 'cost', header: 'Cost', render: (v) => <Badge variant="default">{v}</Badge> },
  ];
  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <h3 style={{ margin: '0 0 4px 0' }}>Scale the store only when the matrix outgrows the machine</h3>
      <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
        The retriever interface never changes — chunks in, top-k out. Swapping brute force for an index or a managed store is an internal upgrade, not a rewrite.
      </p>
      <Table columns={columns} data={ZR_SCALING} sortable={false} />
      <Callout type="tip" title="The interface is the architecture">
        Keep chunk → embed → retrieve → generate behind one function boundary. Every scale-up in the table is a drop-in replacement behind the same retrieve() signature.
      </Callout>
    </Card>
  );
}

function ChunkingLab() {
  const [size, setSize] = useState(25);
  const [overlap, setOverlap] = useState(5);
  const safeOverlap = Math.min(overlap, size - 1);
  const words = useMemo(() => DEMO_TEXT.split(/\s+/), []);
  const chunks = useMemo(() => chunkWords(DEMO_TEXT, size, safeOverlap), [size, safeOverlap]);
  const count = chunkCount(words.length, size, safeOverlap);
  const step = size - safeOverlap;

  // Color words by chunk membership: first chunk claiming each word wins
  // (overlap words keep the earlier window's color, matching "stitched back").
  const wordChunk = useMemo(() => {
    const map = new Array(words.length).fill(-1);
    for (let ci = 0; ci < chunks.length; ci += 1) {
      const start = ci * step;
      for (let i = start; i < Math.min(start + size, words.length); i += 1) {
        if (map[i] === -1) map[i] = ci;
      }
    }
    return map;
  }, [chunks, words, size, step]);

  const palette = [TEAL, PURPLE, AMBER, TEAL_DARK, RED, '#7A9BC9'];

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>✂️ Chunking Lab — every word belongs to a window</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Step = size − overlap. Overlap stitches sentence fragments back together across boundaries; without it, meaning gets sliced in half.
          </p>
        </div>
        <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
          <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            Chunk size: <strong style={{ color: TEAL_DARK }}>{size} words</strong>
            <input type="range" min={5} max={60} value={size} onChange={(e) => setSize(+e.target.value)}
              style={{ width: '100%' }} aria-label="chunk size in words" />
          </label>
          <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            Overlap: <strong style={{ color: PURPLE }}>{safeOverlap} words</strong>
            <input type="range" min={0} max={Math.max(size - 1, 0)} value={safeOverlap} onChange={(e) => setOverlap(+e.target.value)}
              style={{ width: '100%' }} aria-label="overlap in words" />
          </label>
          <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            Step = {size} − {safeOverlap} = <strong style={{ color: TEAL_DARK }}>{step}</strong> · chunks = ceil({words.length}/{step}) = <strong style={{ color: TEAL_DARK, fontSize: 17 }}>{count}</strong>
          </div>
        </Grid>
        <div style={{ padding: 12, borderRadius: 10, background: 'var(--ds-color-bg-surfaceHover)', lineHeight: 2 }}>
          {words.map((w, i) => (
            <span key={i} style={{
              display: 'inline-block', margin: 2, padding: '1px 6px', borderRadius: 6, fontSize: 12.5,
              background: palette[(wordChunk[i] ?? 0) % palette.length] + '22',
              border: `1px solid ${palette[(wordChunk[i] ?? 0) % palette.length]}66`,
              color: 'var(--ds-color-text-primary)',
              transition: 'all .2s',
            }}>{w}</span>
          ))}
        </div>
        <Callout type={safeOverlap === 0 ? 'warning' : 'info'} title={safeOverlap === 0 ? 'Zero overlap: sentences break mid-clause' : `Overlap ${safeOverlap}: ${safeOverlap} shared words stitch neighbors`}>
          Real pipelines use far larger windows (hundreds of words) — the demo values are small so the effect is visible on one paragraph. The formula never changes.
        </Callout>
      </Stack>
    </Card>
  );
}

function CosineRetriever() {
  const [angle, setAngle] = useState(30);
  const [k, setK] = useState(3);
  const points = useMemo(() => {
    const angles = [15, 32, 40, 80, 120, 200];
    return angles.map((a, i) => ({
      id: i,
      angle: a,
      label: ['islands', 'coastline', 'beaches', 'temples', 'alpine', 'cuisine'][i],
      x: Math.cos((a * Math.PI) / 180),
      y: Math.sin((a * Math.PI) / 180),
    }));
  }, []);
  const query = useMemo(() => ({ x: Math.cos((angle * Math.PI) / 180), y: Math.sin((angle * Math.PI) / 180) }), [angle]);
  const ranked = useMemo(() => topK(query, points.map((p) => [p.x, p.y]), k), [query, points, k]);
  const topIdx = new Set(ranked.map((r) => r.idx));
  const maxD = Math.max(...points.map((p) => cosineDistance(query, [p.x, p.y])), 0.01);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🧭 Cosine Retriever — direction is meaning, length is not</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Embeddings live as directions. Distance = 1 − cosine similarity. Rotate the query and watch the top-k reorder — that reordering is retrieval.
          </p>
        </div>
        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
          <svg viewBox="0 0 240 240" style={{ width: '100%', maxWidth: 300, height: 'auto', margin: '0 auto' }} role="img" aria-label="unit circle of embedding directions">
            <circle cx={120} cy={120} r={100} fill="none" stroke="var(--ds-color-border-subtle)" strokeWidth={1.5} />
            <line x1={20} y1={120} x2={220} y2={120} stroke="var(--ds-color-border-subtle)" />
            <line x1={120} y1={20} x2={120} y2={220} stroke="var(--ds-color-border-subtle)" />
            {points.map((p) => (
              <g key={p.id}>
                <line x1={120} y1={120} x2={120 + p.x * 100} y2={120 - p.y * 100}
                  stroke={topIdx.has(p.id) ? TEAL : '#CBD5E1'} strokeWidth={topIdx.has(p.id) ? 1.5 : 1} />
                <circle cx={120 + p.x * 100} cy={120 - p.y * 100} r={topIdx.has(p.id) ? 7 : 5}
                  fill={topIdx.has(p.id) ? TEAL : '#94A3B8'} style={{ transition: 'all .25s' }} />
                <text x={120 + p.x * 115} y={120 - p.y * 115} fontSize={10} textAnchor="middle"
                  fill={topIdx.has(p.id) ? TEAL_DARK : 'var(--ds-color-text-tertiary)'}>{p.label}</text>
              </g>
            ))}
            <line x1={120} y1={120} x2={120 + query.x * 90} y2={120 - query.y * 90} stroke={PURPLE} strokeWidth={2.5} />
            <circle cx={120 + query.x * 90} cy={120 - query.y * 90} r={5} fill={PURPLE} />
          </svg>
          <Stack gap={3}>
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Query direction: <strong style={{ color: PURPLE }}>{angle}°</strong>
              <input type="range" min={0} max={359} value={angle} onChange={(e) => setAngle(+e.target.value)}
                style={{ width: '100%' }} aria-label="query angle" />
            </label>
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              k neighbors: <strong style={{ color: TEAL_DARK }}>{k}</strong>
              <input type="range" min={1} max={6} value={k} onChange={(e) => setK(+e.target.value)}
                style={{ width: '100%' }} aria-label="k neighbors" />
            </label>
            {ranked.map((r, i) => {
              const d = cosineDistance(query, [points[r.idx].x, points[r.idx].y]);
              return (
                <div key={r.idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--ds-color-text-primary)', fontWeight: i === 0 ? 700 : 400 }}>
                      #{i + 1} “{points[r.idx].label}”
                    </span>
                    <span style={{ fontFamily: 'ui-monospace, monospace', color: TEAL_DARK }}>{d.toFixed(3)}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: '#E5E7EB', overflow: 'hidden' }}>
                    <div style={{ width: `${(1 - d / maxD) * 100}%`, height: '100%', background: i === 0 ? TEAL : '#9CC7C9', transition: 'width .3s' }} />
                  </div>
                </div>
              );
            })}
            <Callout type="info" title="Brute force is a feature at small scale">
              {bruteForceMillis(1000).toFixed(2)} ms to scan 1,000 chunks of 384 dims on one laptop core — an approximate index buys speed you don't need yet.
            </Callout>
          </Stack>
        </Grid>
      </Stack>
    </Card>
  );
}

function AbstainLab() {
  const [qid, setQid] = useState('beaches');
  const active = QUERIES.find((q) => q.id === qid);
  const plan = useMemo(() => answerPlan(active.contexts, active.q), [active]);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🙅 Answer or Abstain — the honesty test</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            The prompt must bind the model to the retrieved context. When the context is silent, the only correct answer is to say so — and the sources are printed either way.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {QUERIES.map((q) => (
            <button key={q.id} onClick={() => setQid(q.id)} aria-pressed={qid === q.id}
              style={{
                padding: '8px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5,
                border: `1.5px solid ${qid === q.id ? PURPLE : 'var(--ds-color-border-subtle)'}`,
                background: qid === q.id ? PURPLE : 'var(--ds-color-bg-surface)',
                color: qid === q.id ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
                transition: 'all .2s',
              }}>
              {q.q}
            </button>
          ))}
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: 'var(--ds-color-bg-surfaceHover)', fontSize: 13 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ds-color-text-secondary)', marginBottom: 6 }}>RETRIEVED CONTEXT (top-{active.contexts.length})</div>
          {active.contexts.map((c, i) => (
            <div key={i} style={{ margin: '4px 0', color: 'var(--ds-color-text-primary)' }}>· {c}</div>
          ))}
        </div>
        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
          <Card style={{
            padding: 'var(--ds-space-4)',
            background: plan.action === 'answer' ? '#E8F3F3' : '#FDF0EC',
            border: `1.5px solid ${plan.action === 'answer' ? TEAL : RED}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>PLAN VERDICT</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: plan.action === 'answer' ? TEAL_DARK : RED, margin: '4px 0' }}>
              {plan.action === 'answer' ? '✓ ANSWER from context' : '✋ ABSTAIN — documents are silent'}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>{plan.reason}</div>
          </Card>
          <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>SOURCES SHOWN WITH THE ANSWER</div>
            <ol style={{ margin: '8px 0 0 0', paddingLeft: 18, fontSize: 12.5, color: 'var(--ds-color-text-primary)' }}>
              {active.contexts.map((c, i) => <li key={i} style={{ margin: '3px 0' }}>{c.slice(0, 60)}…</li>)}
            </ol>
          </Card>
        </Grid>
        <Callout type="tip" title="The abstention prompt pattern">
          “Answer using ONLY the provided context. If the answer is not in the context, say you cannot find it in the documents.” Pair it with printed sources so a reader can audit the refusal — or the answer.
        </Callout>
      </Stack>
    </Card>
  );
}

export default function ZeroRagTab() {
  const [activeSubTab, setActiveSubTab] = useState('loop');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="zerorag"
        moduleLabel="RAG Systems"
        title="Zero-Infra RAG: The Whole Loop Without a Vector Database"
        description="A working retrieval-augmented generation pipeline needs only four things: a chunker, an embedding model, a cosine k-nearest-neighbors scan, and a grounded generator that abstains when the context is silent. Vector databases and frameworks are scale-up options — not prerequisites. Build the loop first; buy the infrastructure when the matrix outgrows the machine."
        metrics={[
          { label: 'Stages in the loop', value: '4' },
          { label: 'Servers required', value: '0' },
          { label: 'Scan of 1k chunks', value: '<1 ms' },
          { label: 'Answers without sources', value: '0' },
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

        {activeSubTab === 'loop' && (
          <Stack gap={6}>
            <StageFlow />
            <ScalingTable />
          </Stack>
        )}
        {activeSubTab === 'chunk' && (
          <Stack gap={6}>
            <ChunkingLab />
          </Stack>
        )}
        {activeSubTab === 'cosine' && (
          <Stack gap={6}>
            <CosineRetriever />
          </Stack>
        )}
        {activeSubTab === 'abstain' && (
          <Stack gap={6}>
            <AbstainLab />
          </Stack>
        )}
      </Container>
    </div>
  );
}
