import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  DUAL_ENGINE_ROUTING,
  PRIMITIVE_CARDS,
  PRIMITIVE_COMPARISON,
  ENTITY_PAIRS,
  evaluateEntityGate,
  SUBGRAPH_NODES,
  evaluatePruning,
  USE_CASES,
  THRESHOLDS,
  ENGINE_RULES,
  CODE_NOUL_BATCH,
  CODE_CHOICE_MAPPER,
  CODE_PRUNE_ACCOUNTING,
  CODE_SCORE_PATH,
} from './graphragEngine.js';

const { Container, Grid, Stack } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#9B89C4';
const PURPLE_DARK = '#5B4B8A';

const SUBTABS = [
  { id: 'architecture', icon: '🧠', label: '1. Dual-Engine Architecture', desc: 'System 1 decides, System 2 explains' },
  { id: 'primitives', icon: '🧱', label: '2. The Three Primitives', desc: 'noul · choice · score' },
  { id: 'simulator', icon: '🎛️', label: '3. Live Simulators', desc: 'Merge gate + subgraph pruning' },
  { id: 'usecases', icon: '🗺️', label: '4. Use-Case Patterns', desc: 'Ingest · maintain · query' },
  { id: 'code', icon: '🛠️', label: '5. Code & Thresholds', desc: 'Python recipes + calibration rules' },
];

/* Original workflow diagram: three stages × two engine lanes. */
function DualEngineDiagram() {
  const box = (x, y, title, sub) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={280} height={64} rx={8} fill="#FFFFFF" stroke="#B7CDCD" />
      <rect x={x} y={y} width={4} height={64} rx={2} fill={TEAL} />
      <text x={x + 16} y={y + 26} fontSize="13" fontWeight="700" fill="#1A1D26">{title}</text>
      <text x={x + 16} y={y + 47} fontSize="11.5" fill="#4B5563">{sub}</text>
    </g>
  );
  const colX = [36, 330, 624];
  return (
    <svg viewBox="0 0 960 440" width="100%" role="img"
      aria-label="Dual-engine workflow: ingestion, maintenance and query stages run through a System 1 decision lane with a System 2 LLM lane below for gray-band exceptions">
      <defs>
        <marker id="gs1-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={PURPLE} />
        </marker>
        <marker id="gs1-flow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={TEAL} />
        </marker>
      </defs>

      {[
        { x: 20, label: '① Ingestion' },
        { x: 335, label: '② Maintenance' },
        { x: 650, label: '③ Query' },
      ].map((s) => (
        <g key={s.label}>
          <rect x={s.x} y="14" width="290" height="34" rx="8" fill="#FFFFFF" stroke="#E5E7EB" />
          <text x={s.x + 145} y="36" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1A1D26">{s.label}</text>
        </g>
      ))}

      {/* System 1 lane */}
      <rect x="20" y="62" width="920" height="192" rx="12" fill="#EAF6F6" stroke={TEAL} />
      <text x="36" y="84" fontSize="12.5" fontWeight="700" fill={TEAL_DARK}>
        SYSTEM 1 · CALIBRATED DECISION MODEL — deterministic, sub-ms, ≈ $0.0002 / decision
      </text>

      {box(colX[0], 96, 'Mention → entity gate', 'noul · P ≥ 0.92 auto-merge')}
      {box(colX[1], 96, 'Edge freshness check', 'noul · P ≥ 0.90 keep edge')}
      {box(colX[2], 96, 'Node keep / drop', 'noul · P ≥ 0.75 include in context')}
      {box(colX[0], 174, 'Predicate → ontology', 'choice · closed set, top-1 ≥ 0.90')}
      {box(colX[1], 174, 'Walk budget cut', 'score · relevance ≥ 0.65 keeps tokens')}
      {box(colX[2], 174, 'Path ranking', 'score · cost = Σ(1 − score)')}

      {/* stage flow arrows (System 1 decides, then state flows on) */}
      <line x1="316" y1="128" x2="330" y2="128" stroke={TEAL} strokeWidth="2" markerEnd="url(#gs1-flow)" />
      <line x1="610" y1="128" x2="624" y2="128" stroke={TEAL} strokeWidth="2" markerEnd="url(#gs1-flow)" />
      <text x="323" y="118" fontSize="9.5" textAnchor="middle" fill={TEAL_DARK}>state</text>
      <text x="617" y="118" fontSize="9.5" textAnchor="middle" fill={TEAL_DARK}>state</text>

      {/* System 2 lane */}
      <rect x="20" y="288" width="920" height="112" rx="12" fill="#F1EDF9" stroke={PURPLE} />
      <text x="36" y="310" fontSize="12.5" fontWeight="700" fill={PURPLE_DARK}>
        SYSTEM 2 · LLM ADJUDICATION — gray band + intake only, ≈ $0.003 / call
      </text>
      {[
        { x: colX[0], label: 'Gray-band entity verdict' },
        { x: colX[1], label: 'Re-explain / refresh edge' },
        { x: colX[2], label: 'Deep-dive answer + abstain' },
      ].map((b) => (
        <g key={b.label}>
          <rect x={b.x} y="322" width="280" height="56" rx="8" fill="#FFFFFF" stroke="#C9BBE3" />
          <rect x={b.x} y="322" width="4" height="56" rx="2" fill={PURPLE} />
          <text x={b.x + 16} y="355" fontSize="12.5" fontWeight="600" fill="#1A1D26">{b.label}</text>
        </g>
      ))}

      {/* exception arrows down, verdict arrows up */}
      {colX.map((cx) => (
        <g key={`exc-${cx}`}>
          <line x1={cx + 140} y1="238" x2={cx + 140} y2="316" stroke={PURPLE} strokeWidth="1.6"
            strokeDasharray="5 4" markerEnd="url(#gs1-arrow)" />
        </g>
      ))}
      <text x="505" y="272" fontSize="10.5" fill={PURPLE_DARK}>gray band only — everything else stays in System 1</text>

      <text x="20" y="426" fontSize="11" fill="#6B7280">
        Solid flow = every micro-decision · Dashed = exception path to the LLM · Upward verdicts return as labeled data, not prose
      </text>
    </svg>
  );
}

function Metric({ value, label, color }) {
  return (
    <div style={{ flex: 1, minWidth: '120px' }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || 'var(--ds-color-text-primary)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>{label}</span>
        <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>{Number(value).toFixed(2)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }}
        aria-label={label}
      />
      {hint && <div style={{ fontSize: 11, color: 'var(--ds-color-text-tertiary)', marginTop: 2 }}>{hint}</div>}
    </div>
  );
}

const VERDICT_STYLE = {
  merge: { bg: '#E6F4F1', fg: TEAL_DARK, label: 'merge' },
  distinct: { bg: '#F1F3F5', fg: '#6B7280', label: 'distinct' },
  system2: { bg: '#F1EDF9', fg: PURPLE_DARK, label: '→ System 2' },
  keep: { bg: '#E6F4F1', fg: TEAL_DARK, label: 'keep' },
  prune: { bg: '#FDF0EB', fg: '#9A4A32', label: 'prune' },
};

function EntityGateSim() {
  const [threshold, setThreshold] = useState(0.92);
  const r = evaluateEntityGate(threshold);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>⚖️ Simulator A — Entity-Resolution Gate (noul)</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Ten labeled mention pairs with calibrated P(same). Raise the merge threshold: precision climbs, but more pairs fall into the gray band and cost LLM calls. Lower it: cheaper, but false merges creep in.
          </p>
        </div>

        <Slider
          label="Merge threshold (noul)"
          value={threshold} min={0.5} max={0.99} step={0.01}
          onChange={setThreshold}
          hint="≥ 0.92 auto-merges · 0.50–threshold → System 2 · < 0.50 → distinct"
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Metric value={`${r.tp}/${r.fp}`} label="TP / FP merges" color={r.fp === 0 ? TEAL_DARK : '#B4553A'} />
          <Metric value={`${r.tn}/${r.fn}`} label="TN / FN splits" />
          <Metric value={r.precision.toFixed(2)} label="Precision" color={TEAL_DARK} />
          <Metric value={r.recall.toFixed(2)} label="Recall" color={TEAL_DARK} />
          <Metric value={r.f1.toFixed(2)} label="F1" color={TEAL_DARK} />
          <Metric value={r.llmCalls} label="LLM calls (System 2)" color={PURPLE_DARK} />
          <Metric value={`$${r.costTotal.toFixed(4)}`} label={`Batch cost (S1 $${r.costS1.toFixed(4)} + S2 $${r.costS2.toFixed(4)})`} color={PURPLE_DARK} />
        </div>

        <div style={{ display: 'grid', gap: 6 }}>
          {ENTITY_PAIRS.map((pair) => {
            const v = VERDICT_STYLE[r.verdictOf(pair)];
            return (
              <div key={pair.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
                borderRadius: 8, background: 'var(--ds-color-bg-canvas)',
                border: '1px solid var(--ds-color-border-subtle)', fontSize: 12.5,
              }}>
                <span style={{ flex: 1, color: 'var(--ds-color-text-primary)' }}>
                  “{pair.left}” <span style={{ color: 'var(--ds-color-text-tertiary)' }}>vs</span> “{pair.right}”
                </span>
                <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: 'var(--ds-color-text-secondary)', width: 42, textAlign: 'right' }}>
                  {pair.p.toFixed(2)}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                  background: v.bg, color: v.fg, minWidth: 74, textAlign: 'center',
                }}>{v.label}</span>
                <span style={{ fontSize: 11, color: 'var(--ds-color-text-tertiary)', width: 74, textAlign: 'right' }}>
                  truth: {pair.same ? 'same' : 'distinct'}
                </span>
              </div>
            );
          })}
        </div>

        <Callout type={r.precision >= 0.9 ? 'success' : 'warning'} title="Reading the dial">
          {r.llmCalls === 0
            ? `At ${threshold.toFixed(2)} System 1 decides all ${ENTITY_PAIRS.length} pairs alone — check precision before trusting a threshold this aggressive.`
            : `System 1 decides ${ENTITY_PAIRS.length - r.llmCalls} of ${ENTITY_PAIRS.length} pairs; ${r.llmCalls} gray-band pair${r.llmCalls === 1 ? '' : 's'} route to the LLM for $${r.costS2.toFixed(4)}.`}
        </Callout>
      </Stack>
    </Card>
  );
}

function PruningSim() {
  const [threshold, setThreshold] = useState(0.65);
  const r = evaluatePruning(threshold);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🎛️ Simulator B — Subgraph Pruning & Token Accounting (score)</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Fourteen nodes reached by traversal, each with a relevance score and a token size. The score floor is the budget control: everything under it never reaches the prompt.
          </p>
        </div>

        <Slider
          label="Relevance floor (score)"
          value={threshold} min={0} max={0.95} step={0.05}
          onChange={setThreshold}
          hint="≥ 0.65 keeps the walk inside budget · below drops nodes from context"
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Metric value={`${r.keptCount} / ${r.droppedCount}`} label="Nodes kept / pruned" color={TEAL_DARK} />
          <Metric value={`${r.tokensAfter.toLocaleString()} tok`} label={`kept (from ${r.tokensBefore.toLocaleString()})`} />
          <Metric value={`${r.pctCut.toFixed(1)}%`} label="Tokens cut" color="#B4553A" />
          <Metric value={`$${r.costBefore.toFixed(2)} → $${r.costAfter.toFixed(2)}`} label="Cost / 1k queries @ $3/Mtok" color={TEAL_DARK} />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SUBGRAPH_NODES.map((node) => {
            const v = VERDICT_STYLE[r.verdictOf(node)];
            const kept = r.verdictOf(node) === 'keep';
            return (
              <span key={node.id} style={{
                fontSize: 11.5, padding: '4px 9px', borderRadius: 999,
                background: v.bg, color: v.fg,
                border: `1px solid ${kept ? '#BFE0DA' : '#F0D4C9'}`,
                opacity: kept ? 1 : 0.85,
              }}>
                {node.name} · {node.relevance.toFixed(2)} · {node.tokens}t
              </span>
            );
          })}
        </div>

        <Callout type="success" title="Why this is a System 1 job">
          Pruning runs once per hop on every query — an LLM call per hop would cost{' '}
          <strong>${(SUBGRAPH_NODES.length * 0.003).toFixed(3)}</strong> per pass versus{' '}
          <strong>${(SUBGRAPH_NODES.length * 0.0002).toFixed(4)}</strong> for the calibrated scorer, before any tokens are even generated.
        </Callout>
      </Stack>
    </Card>
  );
}

export default function GraphRagSystem1Tab() {
  const [activeSubTab, setActiveSubTab] = useState('architecture');

  const routingColumns = [
    { key: 'stage', header: 'Stage' },
    { key: 'decision', header: 'Micro-decision', sortable: false },
    { key: 'primitive', header: 'Primitive', render: (v) => <Badge variant="default" style={{ background: '#E6F4F1', color: TEAL_DARK }}>{v}</Badge> },
    { key: 'rule', header: 'System 1 rule', sortable: false },
    { key: 'escape', header: 'System 2 escape hatch', sortable: false },
  ];

  const comparisonColumns = [
    { key: 'property', header: 'Property' },
    { key: 's1', header: 'System 1 (noul · choice · score)', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
    { key: 's2', header: 'System 2 (LLM)', render: (v) => <span style={{ color: PURPLE_DARK }}>{v}</span> },
  ];

  const useCaseColumns = [
    { key: 'stage', header: 'Stage' },
    { key: 'decision', header: 'Decision', sortable: false },
    { key: 'primitive', header: 'Primitive', render: (v) => <Badge variant="default" style={{ background: '#E6F4F1', color: TEAL_DARK }}>{v}</Badge> },
    { key: 'escape', header: 'System 2 escape', sortable: false },
    { key: 'effect', header: 'Measured effect (illustrative)', sortable: false },
  ];

  const thresholdColumns = [
    { key: 'decision', header: 'Decision' },
    { key: 'primitive', header: 'Primitive' },
    { key: 'threshold', header: 'Threshold', render: (v) => <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12 }}>{v}</span> },
    { key: 'above', header: 'At / above', sortable: false },
    { key: 'below', header: 'Below', sortable: false },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="rag_architecture"
        moduleLabel="RAG Architectures & Pipelines [System 1 Decision Layer]"
        title="GraphRAG With a System 1 Decision Layer"
        description="Large knowledge graphs die by a thousand micro-decisions: merge this, type that, prune here, rank there. A dual-engine GraphRAG answers every one with a calibrated boolean, a closed-set choice, or an ordinal score — and hands the LLM only the gray band."
        metrics={[
          { label: 'Typed primitives: noul · choice · score', value: '3' },
          { label: 'LLM runs only in the gray band', value: '<5%' },
          { label: 'Decisions across ingest · maintain · query', value: '8+' },
        ]}
      />

      <Container size="wide">
        <div style={{
          display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)',
          background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)',
          borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)',
          overflowX: 'auto',
        }}>
          {SUBTABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                flex: 1, minWidth: '190px',
                padding: 'var(--ds-space-3) var(--ds-space-4)',
                borderRadius: 'var(--ds-radius-md)', border: 'none',
                background: activeSubTab === tab.id ? TEAL : 'transparent',
                color: activeSubTab === tab.id ? '#FFFFFF' : 'var(--ds-color-text-secondary)',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all var(--ds-motion-duration-base)',
                fontWeight: activeSubTab === tab.id ? 600 : 500,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--ds-font-size-body)', marginBottom: 2 }}>
                <span>{tab.icon}</span><span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* ─── 1. ARCHITECTURE ─── */}
        {activeSubTab === 'architecture' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Two engines, one contract</h3>
              <p style={{ margin: '0 0 14px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Stage flow runs entirely through the calibrated lane. The LLM lane sits below as an exception path: it never sees the whole decision stream, only the pairs, types, and nodes the scorer refused to decide alone.
              </p>
              <DualEngineDiagram />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Routing table — who decides what</h3>
              <Table columns={routingColumns} data={DUAL_ENGINE_ROUTING} sortable={false} />
            </Card>

            <Callout type="info" title="Why the split">
              Micro-decisions are high-volume, low-context, and cheap to label — exactly what calibrated models are good at. Explanation and novel situations are low-volume and high-context — exactly what LLMs are good at. Each engine only does the work it is built for.
            </Callout>
          </Stack>
        )}

        {/* ─── 2. PRIMITIVES ─── */}
        {activeSubTab === 'primitives' && (
          <Stack gap={6}>
            <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
              {PRIMITIVE_CARDS.map((p) => (
                <Card key={p.name} style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)', borderTop: `3px solid ${p.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>{p.icon}</span>
                    <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 16, fontWeight: 800, color: p.color }}>{p.name}</span>
                    <Badge variant="default" style={{ background: '#F1F3F5', color: 'var(--ds-color-text-secondary)' }}>{p.tagline}</Badge>
                  </div>
                  <p style={{ margin: '0 0 10px 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>{p.body}</p>
                  <div style={{
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 11.5,
                    color: 'var(--ds-color-text-primary)', background: 'var(--ds-color-bg-canvas)',
                    border: '1px solid var(--ds-color-border-subtle)', borderRadius: 6, padding: '7px 9px',
                  }}>{p.example}</div>
                </Card>
              ))}
            </Grid>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Calibration note</h3>
              <p style={{ margin: 0, fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                A raw classifier score is not a probability. The decision layer scores on held-out labeled pairs, fits the mapping from score to empirical accuracy (Platt scaling or isotonic regression), and only then applies thresholds.
                If held-out precision at 0.92 drifts below target, the fix is recalibration on fresh labels — never a silent threshold bump. The gray band exists because uncertainty is data, not a failure.
              </p>
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Side by side</h3>
              <Table columns={comparisonColumns} data={PRIMITIVE_COMPARISON} sortable={false} />
            </Card>
          </Stack>
        )}

        {/* ─── 3. SIMULATORS ─── */}
        {activeSubTab === 'simulator' && (
          <Stack gap={6}>
            <EntityGateSim />
            <PruningSim />
          </Stack>
        )}

        {/* ─── 4. USE CASES ─── */}
        {activeSubTab === 'usecases' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Where the primitives pay off</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Eight patterns spanning the three stages. Each row is a decision that used to be an implicit prompt — now it is a typed function with a threshold, an escape hatch, and a number you can audit.
              </p>
              <Table columns={useCaseColumns} data={USE_CASES} sortable={false} />
            </Card>
            <Callout type="warning" title="Effects are illustrative">
              The percentages above describe the shape of the trade-off (fewer calls, fewer stale facts, smaller contexts), not a benchmark run on your graph. Re-measure on your own labeled pairs before quoting them.
            </Callout>
          </Stack>
        )}

        {/* ─── 5. CODE & THRESHOLDS ─── */}
        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Default thresholds</h3>
              <Table columns={thresholdColumns} data={THRESHOLDS} sortable={false} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>1 · Entity gate — async batch with a gray band</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                System 1 takes both edges of the distribution; only the middle routes to the model.
              </p>
              <CodeBlock language="python" code={CODE_NOUL_BATCH} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>2 · Ontology mapper — a choice that cannot hallucinate</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                The closed set is the schema: abstention is an output type, not a bug.
              </p>
              <CodeBlock language="python" code={CODE_CHOICE_MAPPER} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>3 · Pruning with token accounting</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Every dropped node is a token you can point at — budgets become reports, not vibes.
              </p>
              <CodeBlock language="python" code={CODE_PRUNE_ACCOUNTING} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>4 · Score-derived path ranking</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Flip the score into an edge cost and shortest-path search becomes calibrated ranking.
              </p>
              <CodeBlock language="python" code={CODE_SCORE_PATH} />
            </Card>

            <Callout type="success" title="Strict engine separation">
              <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                {ENGINE_RULES.map((rule) => <li key={rule}>{rule}</li>)}
              </ul>
            </Callout>
          </Stack>
        )}
      </Container>
    </div>
  );
}
