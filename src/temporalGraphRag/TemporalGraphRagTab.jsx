import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  FACTS,
  QUAD_EXAMPLE,
  PIPELINE,
  HALF_LIFE_LESSON,
  FAILURE_MODES,
  naiveRetrieve,
  temporalRetrieve,
  wasFactTrue,
  recencyWeight,
  CODE_RETRIEVER,
  CODE_ANSWER,
} from './temporalGraphRagEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const AMBER = '#B9821F';
const RED = '#B4553A';

const CEO_FACTS = FACTS.filter((f) => f.predicate === 'CEO');
const START = Date.parse('2023-11-01');
const END = Date.parse('2023-12-15');
const TOTAL_DAYS = Math.round((END - START) / 86400000);

const SUBTABS = [
  { id: 'quads', icon: '🧮', label: '1. From Triples to Quads', desc: 'Time enters the graph' },
  { id: 'retrieval', icon: '⏳', label: '2. Temporal Retrieval', desc: 'Filter, decay, rank' },
  { id: 'halflife', icon: '🎚️', label: '3. Half-life & Failures', desc: 'The domain parameter' },
  { id: 'code', icon: '🧪', label: '4. Retriever Code', desc: 'Two functions' },
];

function Timeline({ queryDate }) {
  const q = Date.parse(queryDate);
  const x = (ms) => 40 + ((ms - START) / (END - START)) * 900;
  return (
    <svg viewBox="0 0 980 250" width="100%" role="img"
      aria-label="Timeline of CEO facts from November to December 2023 with a movable query-date cursor">
      {/* axis */}
      <line x1="40" y1="170" x2="940" y2="170" stroke="#CBD5E1" strokeWidth="2" />
      {['2023-11-01', '2023-11-15', '2023-12-01', '2023-12-15'].map((d) => (
        <g key={d}>
          <line x1={x(Date.parse(d))} y1="165" x2={x(Date.parse(d))} y2="175" stroke="#94A3B8" />
          <text x={x(Date.parse(d))} y="192" textAnchor="middle" fontSize="11" fill="#6B7280">{d.slice(5)}</text>
        </g>
      ))}

      {/* Alice band */}
      <rect x="40" y="60" width={Math.max(x(Date.parse('2023-11-15')) - 40, 4)} height="22" rx="6" fill="#DDD6F0" stroke={PURPLE} strokeWidth="1.2" />
      <text x="46" y="76" fontSize="11" fontWeight="700" fill={PURPLE}>Alice · since 2021-01-15 (off-scale left)</text>

      {CEO_FACTS.map((f, i) => {
        const fx = x(Date.parse(f.date));
        const future = f.date > queryDate;
        const color = future ? '#CBD5E1' : TEAL;
        return (
          <g key={i} opacity={future ? 0.45 : 1}>
            <line x1={fx} y1="100" x2={fx} y2="165" stroke={color} strokeWidth="2.5" strokeDasharray={future ? '5 4' : undefined} />
            <circle cx={fx} cy="100" r="7" fill={future ? '#FFF' : color} stroke={color} strokeWidth="2" />
            <text x={fx} y={i % 2 === 0 ? 44 : 92} textAnchor="middle" fontSize="12" fontWeight="700"
              fill={future ? '#9CA3AF' : TEAL_DARK}>{f.object}</text>
            <text x={fx} y={i % 2 === 0 ? 58 : 114 - 0} textAnchor="middle" fontSize="10" fill="#6B7280"
              transform={`translate(0, ${i % 2 === 0 ? 0 : 4})`}>{f.date.slice(5)}</text>
          </g>
        );
      })}

      {/* query cursor */}
      <g>
        <line x1={x(q)} y1="30" x2={x(q)} y2="210" stroke={RED} strokeWidth="2.5" />
        <polygon points={`${x(q) - 7},30 ${x(q) + 7},30 ${x(q)},42`} fill={RED} />
        <text x={x(q)} y="230" textAnchor="middle" fontSize="12" fontWeight="800" fill={RED}>query: {queryDate}</text>
      </g>

      <text x="960" y="76" textAnchor="end" fontSize="11" fill={TEAL_DARK} fontWeight="600">solid = eligible (date ≤ query)</text>
      <text x="960" y="92" textAnchor="end" fontSize="11" fill="#9CA3AF">dashed = future, filtered out</text>
    </svg>
  );
}

function TemporalSim() {
  const [dayOffset, setDayOffset] = useState(Math.round((Date.parse('2023-11-18') - START) / 86400000));
  const [halfLife, setHalfLife] = useState(365);

  const queryDate = useMemo(() => new Date(START + dayOffset * 86400000).toISOString().slice(0, 10), [dayOffset]);
  const ranked = useMemo(() => temporalRetrieve(FACTS, 'Company', 'CEO', queryDate, halfLife), [queryDate, halfLife]);
  const naive = useMemo(() => naiveRetrieve(FACTS, 'Company', 'CEO'), []);
  const maxW = ranked.length ? ranked[0].weight : 1;

  const bar = (f) => (
    <div key={f.date + f.object} style={{ marginBottom: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 3 }}>
        <span>
          <strong>{f.object}</strong>
          <span style={{ color: 'var(--ds-color-text-tertiary)', fontFamily: 'ui-monospace, monospace', fontSize: 11.5 }}> · {f.date}</span>
        </span>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: TEAL_DARK }}>{f.weight.toFixed(4)}</span>
      </div>
      <div style={{ height: 13, background: '#EEF1F4', borderRadius: 7, overflow: 'hidden' }}>
        <div style={{ width: `${(f.weight / maxW) * 100}%`, height: '100%', background: TEAL, transition: 'width .25s' }} />
      </div>
    </div>
  );

  const top = ranked[0];

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={5}>
        <div>
          <h3 style={{ margin: 0 }}>⏳ Simulator — ask on a date, not “now”</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Move the query cursor across the chaotic week and watch eligibility and weight change. Naive search never changes: it always hands you all four CEOs.
          </p>
        </div>

        <Grid columns={{ base: '1fr', md: '2fr 1fr' }} gap="var(--ds-space-4)">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Query date</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: RED }}>{queryDate}</span>
            </div>
            <input type="range" min={0} max={TOTAL_DAYS} step={1} value={dayOffset}
              onChange={(e) => setDayOffset(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: RED, cursor: 'pointer' }} aria-label="Query date" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Half-life (days)</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: PURPLE }}>{halfLife}</span>
            </div>
            <input type="range" min={1} max={730} step={1} value={halfLife}
              onChange={(e) => setHalfLife(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: PURPLE, cursor: 'pointer' }} aria-label="Half life" />
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              {[7, 30, 365].map((hl) => (
                <button key={hl} onClick={() => setHalfLife(hl)}
                  style={{
                    fontSize: 11, padding: '3px 9px', borderRadius: 999, cursor: 'pointer',
                    border: `1px solid ${halfLife === hl ? PURPLE : 'var(--ds-color-border-subtle)'}`,
                    background: halfLife === hl ? PURPLE : 'transparent',
                    color: halfLife === hl ? '#FFF' : 'var(--ds-color-text-secondary)',
                  }}>{hl}d</button>
              ))}
            </div>
          </div>
        </Grid>

        <Timeline queryDate={queryDate} />

        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: TEAL_DARK, marginBottom: 8 }}>
              Temporal retrieval ({ranked.length} eligible)
            </div>
            {ranked.length === 0 && (
              <div style={{ fontSize: 13, color: RED }}>No CEO fact existed on this date — the honest answer is “unknown”.</div>
            )}
            {ranked.map(bar)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: AMBER, marginBottom: 8 }}>Naive (timeless) search</div>
            {naive.map((f) => (
              <div key={f.date + f.object} style={{
                display: 'flex', justifyContent: 'space-between', fontSize: 12.5,
                padding: '6px 10px', marginBottom: 6, borderRadius: 8,
                background: '#FFF7ED', border: '1px solid #F3E4C8',
              }}>
                <span><strong>{f.object}</strong> <span style={{ color: 'var(--ds-color-text-tertiary)', fontSize: 11.5 }}>{f.date}</span></span>
                <span style={{ fontFamily: 'ui-monospace, monospace', color: AMBER }}>score 1.0000</span>
              </div>
            ))}
            <Callout type="warning" title="All four at once — no date, no ranking">
              Nothing in the timeless result distinguishes a fact that holds today from one superseded two days later.
            </Callout>
          </div>
        </Grid>

        {top && (
          <div style={{
            padding: 14, borderRadius: 10, background: 'var(--ds-color-bg-canvas)',
            borderLeft: `5px solid ${TEAL_DARK}`,
            fontSize: 13, lineHeight: 1.7,
          }}>
            <strong>Ground truth check:</strong>{' '}
            Was {top.object} CEO on {queryDate}?{' '}
            <strong style={{ color: wasFactTrue(FACTS, 'CEO', top.object, queryDate) ? TEAL_DARK : RED }}>
              {wasFactTrue(FACTS, 'CEO', top.object, queryDate) ? 'YES — valid interval covers the date' : 'NO — the interval does not cover the date'}
            </strong>{' '}
            · ranking alone never proves this; interval logic does.
          </div>
        )}
      </Stack>
    </Card>
  );
}

function HalfLifeCompare() {
  const rows = useMemo(() => CEO_FACTS.map((f) => ({
    object: f.object,
    date: f.date,
    w365: recencyWeight(f.date, '2023-12-01', 365),
    w7: recencyWeight(f.date, '2023-12-01', 7),
  })), []);
  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <h3 style={{ margin: '0 0 4px 0' }}>Same facts, two half-lives — at query date 2023-12-01</h3>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 280, fontSize: 13, lineHeight: 1.7, color: 'var(--ds-color-text-secondary)' }}>
          <strong style={{ color: PURPLE }}>half-life 365d:</strong> {HALF_LIFE_LESSON.at365}
        </div>
        <div style={{ flex: 1, minWidth: 280, fontSize: 13, lineHeight: 1.7, color: 'var(--ds-color-text-secondary)' }}>
          <strong style={{ color: TEAL_DARK }}>half-life 7d:</strong> {HALF_LIFE_LESSON.at7}
        </div>
      </div>
      <svg viewBox="0 0 640 200" width="100%" role="img" aria-label="Comparison of recency weights at half-life 365 days versus 7 days">
        {rows.map((r, i) => {
          const y = 24 + i * 44;
          const w365 = r.w365 * 260;
          const w7 = r.w7 * 260;
          return (
            <g key={i}>
              <text x="0" y={y + 12} fontSize="12" fontWeight="700" fill="#1A1D26">{r.object}</text>
              <text x="0" y={y + 27} fontSize="10" fill="#6B7280">{r.date}</text>
              <rect x="90" y={y} width={Math.max(w365, 1)} height="11" rx="5" fill={PURPLE} />
              <text x={90 + Math.max(w365, 1) + 6} y={y + 10} fontSize="10" fill={PURPLE}>{r.w365.toFixed(4)}</text>
              <rect x="90" y={y + 15} width={Math.max(w7, 1)} height="11" rx="5" fill={TEAL} />
              <text x={90 + Math.max(w7, 1) + 6} y={y + 25} fontSize="10" fill={TEAL_DARK}>{r.w7.toFixed(4)}</text>
            </g>
          );
        })}
        <g>
          <rect x="400" y="180" width="14" height="10" rx="3" fill={PURPLE} />
          <text x="420" y="189" fontSize="11" fill="#6B7280">half-life 365d</text>
          <rect x="510" y="180" width="14" height="10" rx="3" fill={TEAL} />
          <text x="530" y="189" fontSize="11" fill="#6B7280">7d</text>
        </g>
      </svg>
      <Callout type="info" title={HALF_LIFE_LESSON.guidance} />
    </Card>
  );
}

export default function TemporalGraphRagTab() {
  const [activeSubTab, setActiveSubTab] = useState('quads');

  const quadColumns = [
    { key: 'field', header: '', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
    { key: 'value', header: 'Represented as', sortable: false },
  ];
  const pipelineColumns = [
    { key: 'n', header: 'Step', render: (v) => (
      <strong style={{ color: TEAL_DARK, fontFamily: 'ui-monospace, monospace' }}>{v}</strong>
    ) },
    { key: 'step', header: 'Do this', render: (v) => <strong>{v}</strong> },
    { key: 'detail', header: 'Detail', sortable: false },
  ];
  const failColumns = [
    { key: 'mode', header: 'Failure mode', render: (v) => <strong style={{ color: RED }}>{v}</strong> },
    { key: 'fails', header: 'What goes wrong', sortable: false },
    { key: 'fix', header: 'Fix', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="temporalgraphrag"
        moduleLabel="Advanced & Frontiers [RAG]"
        title="Temporal Graph RAG: Facts Have a Date of Record"
        description="A triple (Company, CEO, Alice) is right on one day and wrong on the next. Store knowledge as quads — subject, predicate, object, timestamp — filter to facts that existed at query time, rank by recency decay, and feed the winners into the deterministic Graph-RAG that verifies them."
        metrics={[
          { label: 'CEO records in the demo KB', value: '4' },
          { label: 'Recency formula', value: '0.5^(age/half-life)' },
          { label: 'Future facts admitted', value: '0' },
          { label: 'Answers from similarity alone', value: '0' },
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

        {activeSubTab === 'quads' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>The problem with a timeless triple</h3>
              <div style={{
                padding: '12px 16px', borderRadius: 10, background: '#1A1D26', color: '#E5E7EB',
                fontFamily: 'ui-monospace, monospace', fontSize: 14, marginBottom: 10,
              }}>{QUAD_EXAMPLE.triple}</div>
              <div style={{ fontSize: 13.5, color: RED, fontWeight: 600, marginBottom: 14 }}>{QUAD_EXAMPLE.problem}</div>
              <div style={{
                padding: '12px 16px', borderRadius: 10, background: '#E3F2F2', color: TEAL_DARK,
                fontFamily: 'ui-monospace, monospace', fontSize: 14, marginBottom: 10,
              }}>{QUAD_EXAMPLE.quad}</div>
              <div style={{ fontSize: 13.5, color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--ds-color-text-primary)' }}>{QUAD_EXAMPLE.meaning}</strong>
              </div>
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>What naive retrieval returns for “Who is the CEO?”</h3>
              {QUAD_EXAMPLE.naiveFailure.map((t, i) => (
                <Callout key={i} type={i === 0 ? 'warning' : 'danger'} title={i === 0 ? 'Everything at once' : 'Similarity is not a date'}>
                  {t}
                </Callout>
              ))}
            </Card>
          </Stack>
        )}

        {activeSubTab === 'retrieval' && <TemporalSim />}

        {activeSubTab === 'halflife' && (
          <Stack gap={6}>
            <HalfLifeCompare />
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>The pipeline — five steps, no free parameters left implicit</h3>
              <Table columns={pipelineColumns} data={PIPELINE} sortable={false} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Failure modes & their fixes</h3>
              <Table columns={failColumns} data={FAILURE_MODES} sortable={false} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>1 · The retriever: filter by date, then decay</h3>
              <CodeBlock language="python" code={CODE_RETRIEVER} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>2 · Top facts into the deterministic Graph-RAG</h3>
              <CodeBlock language="python" code={CODE_ANSWER} />
              <Callout type="tip" title="Temporal retrieval is upstream of verification">
                Recency says which facts deserve the model’s attention on that date. The three Graph-RAG tiers still decide whether the answer holds.
              </Callout>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
