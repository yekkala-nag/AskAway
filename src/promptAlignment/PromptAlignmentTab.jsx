import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  UNIVERSAL_BLOCKS,
  META_PROMPT,
  QUICK_FIRE,
  PRO_TIPS,
  TASK_REPORT_INPUT,
  TASK_STATUS,
  TASK_REPORT_SECTIONS,
  TASK_QUICK,
  SAMPLE_TASKS,
  TOKEN_REPORT_INPUT,
  TOKEN_ROWS,
  tokenTotals,
  budgetState,
  EFFICIENCY_NOTES,
  TOKEN_QUICK,
  ALIGNMENT_PROTOCOLS,
  WHY_ALIGNMENT,
  TWO_PHASE_INPUT,
  BG_TASKS,
  STATUS_LABELS,
  aggregateTasks,
  COMPLIANCE_NOTES,
} from './promptAlignEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'reports', icon: '📋', label: '1. Report Frameworks', desc: 'Tasks & tokens, approved' },
  { id: 'master', icon: '🧩', label: '2. Universal Master', desc: 'Six blocks, any task' },
  { id: 'align', icon: '🛑', label: '3. Alignment Protocols', desc: 'Pause before you generate' },
  { id: 'gate', icon: '🚦', label: '4. Two-Phase Gate', desc: 'Approval-gated execution' },
];

function chipStyle(active) {
  return {
    padding: '7px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, minHeight: 44,
    border: `1.5px solid ${active ? PURPLE : 'var(--ds-color-border-subtle)'}`,
    background: active ? PURPLE : 'var(--ds-color-bg-surface)',
    color: active ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
    transition: 'all .2s',
  };
}

const STATUS_BADGE = {
  done: { text: '✅ Completed', color: TEAL_DARK },
  wip: { text: '🔄 In Progress', color: AMBER },
  blocked: { text: '⚠️ Blocked', color: RED },
};

// ── 1. Report Frameworks ────────────────────────────────────────────────────

function ReportFrameworks() {
  const totals = useMemo(() => tokenTotals(), []);
  const [budget, setBudget] = useState(100000);
  const state = budgetState(totals.total, budget);
  const [deliverable, setDeliverable] = useState('the Q3 copy draft');
  const [reason, setReason] = useState('release it to design for Friday formatting');

  const taskCols = [
    { key: 'task', header: 'Task', render: (v) => <strong>{v}</strong> },
    {
      key: 'status', header: 'Status', render: (v) => (
        <span style={{ color: STATUS_BADGE[v].color, fontWeight: 700, fontSize: 12 }}>{STATUS_BADGE[v].text}</span>
      ),
    },
    { key: 'outcome', header: 'Key outcome', sortable: false },
  ];
  const tokenCols = [
    { key: 'task', header: 'Task / subtask', render: (v) => <strong>{v}</strong> },
    { key: 'input', header: 'Input tokens', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace' }}>{v.toLocaleString()}</span> },
    { key: 'output', header: 'Output tokens', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace' }}>{v.toLocaleString()}</span> },
    {
      key: 'total', header: 'Total', sortable: false,
      render: (v, row) => <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>{(row.input + row.output).toLocaleString()}</span>,
    },
    {
      key: 'cost', header: 'Est. cost', sortable: false,
      render: (v, row) => (
        <span style={{ fontFamily: 'ui-monospace, monospace', color: TEAL_DARK }}>
          ${((row.input / 1e6) * 2 + (row.output / 1e6) * 1).toFixed(3)}
        </span>
      ),
    },
  ];
  const sectionCols = [
    { key: 'n', header: '#', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
    { key: 'section', header: 'Section', render: (v) => <strong>{v}</strong> },
    { key: 'job', header: 'Job', sortable: false },
    { key: 'strong', header: 'Strong version', render: (v) => <span style={{ color: TEAL_DARK, fontSize: 12 }}>{v}</span> },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>📋 The task-completion report — structure is the signal</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              A status update that ends in a specific approval request beats any amount of prose. Fill the brackets, send, get a table back.
            </p>
          </div>
          <CodeBlock language="text" code={TASK_REPORT_INPUT} />
          <Grid columns={3} gap="var(--ds-space-4)">
            {TASK_STATUS.map((s) => (
              <Card key={s.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK }}>{s.status}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{s.meaning}</div>
              </Card>
            ))}
          </Grid>
          <Table columns={taskCols} data={SAMPLE_TASKS} sortable={false} />
          <Table columns={sectionCols} data={TASK_REPORT_SECTIONS} sortable={false} />
          <Callout type="tip" title="Quick version for routine check-ins">
            {TASK_QUICK}
          </Callout>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>💰 Token utilization report — spend you can defend</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Same skeleton, different data: usage breakdown, efficiency notes, and an approval ask anchored to a budget. Move the budget and watch the verdict flip.
            </p>
          </div>
          <Grid columns={2} gap="var(--ds-space-4)">
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Token budget for this task: <strong style={{ color: PURPLE }}>{budget.toLocaleString()} tokens</strong>
              <input type="range" min={20000} max={200000} step={5000} value={budget}
                onChange={(e) => setBudget(+e.target.value)} style={{ width: '100%' }} aria-label="token budget" />
            </label>
            <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Used <strong style={{ color: TEAL_DARK }}>{totals.total.toLocaleString()}</strong> · est. cost{' '}
              <strong style={{ color: TEAL_DARK }}>${totals.cost.toFixed(2)}</strong> · in/out rates illustrative
            </div>
          </Grid>
          <div style={{ height: 18, borderRadius: 9, background: '#E5E7EB', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(state.pct, 100)}%`, height: '100%',
              background: state.verdict === 'within' ? TEAL : state.verdict === 'tight' ? AMBER : RED,
              transition: 'width .3s, background .3s',
            }} />
          </div>
          <div style={{
            fontSize: 14, fontWeight: 800, padding: 10, borderRadius: 8,
            background: state.verdict === 'within' ? '#E8F3F3' : state.verdict === 'tight' ? '#F9F1DC' : '#FDF0EC',
            color: state.verdict === 'within' ? TEAL_DARK : state.verdict === 'tight' ? AMBER : RED,
          }}>
            {state.pct}% of budget — {state.verdict === 'within'
              ? 'within efficiency parameters'
              : state.verdict === 'tight'
                ? 'tight; efficiency notes become mandatory reading'
                : 'over budget; the approval request must justify the overrun'}
            {' '}· {state.remaining >= 0 ? `${state.remaining.toLocaleString()} remaining` : `${Math.abs(state.remaining).toLocaleString()} over`}
          </div>
          <Table columns={tokenCols} data={TOKEN_ROWS} sortable={false} />
          <Table
            columns={[
              { key: 'kind', header: 'Kind', render: (v) => <Badge variant="default">{v}</Badge> },
              { key: 'note', header: 'Note', sortable: false },
            ]}
            data={EFFICIENCY_NOTES}
            sortable={false}
          />
          <Callout type="info" title="Quick version for routine check-ins">
            {TOKEN_QUICK}
          </Callout>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🎯 Approval request builder — the reason the report exists</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              “Let me know your thoughts” dies in inboxes. Name the deliverable, name the unlock.
            </p>
          </div>
          <Grid columns={2} gap="var(--ds-space-4)">
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Deliverable to approve
              <input type="text" value={deliverable} onChange={(e) => setDeliverable(e.target.value)}
                style={{
                  width: '100%', marginTop: 4, padding: '9px 10px', borderRadius: 8,
                  border: '1.5px solid var(--ds-color-border-subtle)',
                  background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', fontSize: 13, minHeight: 44,
                }} aria-label="deliverable to approve" />
            </label>
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              What approval unlocks
              <input type="text" value={reason} onChange={(e) => setReason(e.target.value)}
                style={{
                  width: '100%', marginTop: 4, padding: '9px 10px', borderRadius: 8,
                  border: '1.5px solid var(--ds-color-border-subtle)',
                  background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', fontSize: 13, minHeight: 44,
                }} aria-label="what approval unlocks" />
            </label>
          </Grid>
          <Card style={{ padding: 'var(--ds-space-4)', background: '#E8F3F3', border: `1.5px solid ${TEAL}` }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>ASSEMBLED CTA</div>
            <div style={{ fontSize: 14, color: 'var(--ds-color-text-primary)', marginTop: 6, lineHeight: 1.6 }}>
              <strong style={{ color: TEAL_DARK }}>Action required:</strong> please review and approve <strong>{deliverable || '[deliverable]'}</strong>.
              <br />
              <strong style={{ color: TEAL_DARK }}>Reason:</strong> approval is required to {reason || '[unlock]'}.
            </div>
          </Card>
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 2. Universal Master ─────────────────────────────────────────────────────

function UniversalMaster() {
  const [open, setOpen] = useState('role');
  const active = UNIVERSAL_BLOCKS.find((b) => b.id === open);

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🧩 Six blocks that build any prompt</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              The master template for complex asks — click a block to see why it earns its place.
            </p>
          </div>
          <svg viewBox="0 0 860 100" style={{ width: '100%', height: 'auto' }} role="img" aria-label="six prompt blocks in sequence">
            {UNIVERSAL_BLOCKS.map((b, i) => {
              const x = 6 + i * 144;
              const hot = open === b.id;
              return (
                <g key={b.id}>
                  <rect x={x} y={18} width={128} height={64} rx={11}
                    fill={hot ? '#E8F3F3' : 'var(--ds-color-bg-surfaceHover)'}
                    stroke={hot ? TEAL : 'var(--ds-color-border-subtle)'} strokeWidth={hot ? 2.5 : 1.5}
                    style={{ transition: 'all .2s', cursor: 'pointer' }}
                    onClick={() => setOpen(b.id)} />
                  <text x={x + 64} y={46} fontSize={15} textAnchor="middle">{b.icon}</text>
                  <text x={x + 64} y={68} fontSize={11.5} fontWeight={700} fill={TEAL_DARK} textAnchor="middle">{b.name}</text>
                  {i < 5 && (
                    <g>
                      <line x1={x + 128} y1={50} x2={x + 142} y2={50} stroke={PURPLE} strokeWidth={2} />
                      <polygon points={`${x + 142},50 ${x + 136},47 ${x + 136},53`} fill={PURPLE} />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {UNIVERSAL_BLOCKS.map((b) => (
              <button key={b.id} onClick={() => setOpen(b.id)} aria-pressed={open === b.id} style={chipStyle(open === b.id)}>
                {b.icon} {b.name}
              </button>
            ))}
          </div>
          <Card style={{ padding: 'var(--ds-space-4)', background: '#E8F3F3', border: `1.5px solid ${TEAL}` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: TEAL_DARK }}>{active.icon} {active.name}</div>
            <div style={{ fontSize: 13, fontFamily: 'ui-monospace, monospace', margin: '8px 0', color: 'var(--ds-color-text-primary)' }}>{active.line}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>Why it earns its slot: {active.why}</div>
          </Card>
          <Grid columns={2} gap="var(--ds-space-4)">
            <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: TEAL_DARK }}>🤖 {META_PROMPT.name}</div>
              <ol style={{ margin: '8px 0', paddingLeft: 18, fontSize: 12.5, lineHeight: 1.65, color: 'var(--ds-color-text-secondary)' }}>
                {META_PROMPT.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
              <div style={{ fontSize: 12.5, color: PURPLE }}>Opens with: {META_PROMPT.opening}</div>
            </Card>
            <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: TEAL_DARK }}>⚡ {QUICK_FIRE.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', margin: '6px 0' }}>{QUICK_FIRE.when}</div>
              {QUICK_FIRE.blocks.map((b) => (
                <div key={b.letter} style={{ display: 'flex', gap: 8, margin: '6px 0', fontSize: 12.5 }}>
                  <span style={{ fontWeight: 800, color: AMBER, minWidth: 18 }}>{b.letter}</span>
                  <span><strong>{b.name}:</strong> <span style={{ color: 'var(--ds-color-text-secondary)' }}>{b.example}</span></span>
                </div>
              ))}
            </Card>
          </Grid>
          <Grid columns={3} gap="var(--ds-space-4)">
            {PRO_TIPS.map((t) => (
              <Card key={t.tip} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK }}>💡 {t.tip}</div>
                <div style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', margin: '6px 0', color: 'var(--ds-color-text-primary)' }}>{t.add}</div>
                <div style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)' }}>{t.why}</div>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 3. Alignment Protocols ──────────────────────────────────────────────────

function AlignmentProtocols() {
  const [open, setOpen] = useState('universal');
  const active = ALIGNMENT_PROTOCOLS.find((p) => p.id === open);
  const clarifyCost = 100;
  const wrongCost = 2000;

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🛑 Pre-flight alignment — force a pause before a solution</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              These meta-prompts make the model restate, deconstruct, and confess gaps <em>before</em> generating. The one-liner version fits at the end of any prompt.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ALIGNMENT_PROTOCOLS.map((p) => (
              <button key={p.id} onClick={() => setOpen(p.id)} aria-pressed={open === p.id} style={chipStyle(open === p.id)}>
                {p.icon} {p.name}
              </button>
            ))}
          </div>
          <Grid columns={2} gap="var(--ds-space-4)">
            <Stack gap={2}>
              {active.steps.map((s, i) => (
                <div key={i} style={{
                  padding: '10px 12px', borderRadius: 8, fontSize: 12.5,
                  background: '#E8F3F3', border: '1px solid #B7D9D9', color: 'var(--ds-color-text-primary)',
                }}>
                  <strong style={{ color: TEAL_DARK }}>Step {i + 1}:</strong> {s}
                </div>
              ))}
            </Stack>
            <Stack gap={3}>
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>USE WHEN</div>
                <div style={{ fontSize: 13, marginTop: 4, color: 'var(--ds-color-text-primary)' }}>{active.when}</div>
              </Card>
              <Card style={{ padding: 'var(--ds-space-4)', background: '#F4EFE6', border: `1.5px solid ${AMBER}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>CLOSING MOVE</div>
                <div style={{ fontSize: 13, marginTop: 4, color: 'var(--ds-color-text-primary)' }}>{active.closing}</div>
              </Card>
            </Stack>
          </Grid>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>📊 Why the pause pays — the 20× arithmetic</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Clarification is cheap insurance. Compare the cost of asking against the cost of iterating on a wrong solution.
            </p>
          </div>
          <svg viewBox="0 0 640 120" style={{ width: '100%', height: 'auto' }} role="img" aria-label="100-token clarification versus 2000-token wrong solution">
            <text x={0} y={30} fontSize={12.5} fill="var(--ds-color-text-secondary)">Clarify first</text>
            <rect x={120} y={16} width={32} height={22} rx={6} fill={TEAL} />
            <text x={160} y={32} fontSize={12.5} fontWeight={700} fill={TEAL_DARK}>~{clarifyCost} tokens</text>
            <text x={0} y={80} fontSize={12.5} fill="var(--ds-color-text-secondary)">Guess, then iterate</text>
            <rect x={120} y={66} width={320} height={22} rx={6} fill={RED} />
            <text x={452} y={82} fontSize={12.5} fontWeight={700} fill={RED}>~{wrongCost.toLocaleString()} tokens</text>
            <text x={120} y={112} fontSize={12} fontWeight={700} fill={AMBER}>20× return on the pause</text>
          </svg>
          <Grid columns={3} gap="var(--ds-space-4)">
            {WHY_ALIGNMENT.map((w) => (
              <Card key={w.reason} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK }}>{w.reason}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{w.detail}</div>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 4. Two-Phase Gate ───────────────────────────────────────────────────────

function TwoPhaseGate() {
  const [phase, setPhase] = useState(1);
  const agg = useMemo(() => aggregateTasks(), []);
  const failedPct = Math.round((agg.wasted / agg.total) * 1000) / 10;

  const cols = [
    { key: 'id', header: 'Task / ID', render: (v) => <code style={{ fontSize: 12 }}>{v}</code> },
    {
      key: 'status', header: 'Status', render: (v) => (
        <span style={{
          fontWeight: 700, fontSize: 12,
          color: v === 'failed' ? RED : v === 'running' ? AMBER : TEAL_DARK,
        }}>{STATUS_LABELS[v]}</span>
      ),
    },
    { key: 'tokens', header: 'Total tokens', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace' }}>{v.toLocaleString()}</span> },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🚦 Two-phase gate — no report before alignment</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              The prompt splits work into an alignment phase and an execution phase that only runs after an explicit approval word. Flip the gate and watch what is allowed to appear.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setPhase(1)} aria-pressed={phase === 1} style={chipStyle(phase === 1)}>Phase 1 · Alignment check</button>
            <button onClick={() => setPhase(2)} aria-pressed={phase === 2} style={chipStyle(phase === 2)}>Phase 2 · “Approved” received</button>
          </div>
          {phase === 1 ? (
            <Card style={{ padding: 'var(--ds-space-4)', background: '#F9F1DC', border: `1.5px solid ${AMBER}` }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: AMBER }}>ALIGNMENT CHECK — REPORT WITHHELD</div>
              <div style={{ fontSize: 13, margin: '8px 0', color: 'var(--ds-color-text-primary)', lineHeight: 1.6 }}>
                Restatement: you want a global background-task report with aggregate tokens per primary task only — no sub-task or reasoning breakdowns.
                <br />Objective: a noise-free snapshot of spend and task health. Audience: operators monitoring budget.
                <br />Gap: confirm the environment snapshot scope and the aggregate-only constraint.
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: AMBER }}>Awaiting “Approved” to execute Phase 2.</div>
            </Card>
          ) : (
            <Stack gap={4}>
              <Table columns={cols} data={BG_TASKS} sortable={false} />
              <div style={{
                display: 'flex', gap: 16, flexWrap: 'wrap', padding: 12, borderRadius: 10,
                background: '#E8F3F3', border: `1.5px solid ${TEAL}`, fontSize: 14, fontWeight: 800, color: TEAL_DARK,
              }}>
                <span>Aggregate total: {agg.total.toLocaleString()} tokens</span>
                <span style={{ color: RED }}>Failed spend: {agg.wasted.toLocaleString()} ({failedPct}%)</span>
                <span style={{ color: 'var(--ds-color-text-secondary)' }}>{agg.count} primary tasks</span>
              </div>
              <Grid columns={3} gap="var(--ds-space-4)">
                {COMPLIANCE_NOTES.map((n, i) => (
                  <Card key={i} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                    <div style={{ fontSize: 15 }}>{n.icon}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{n.note}</div>
                  </Card>
                ))}
              </Grid>
              <Callout type="warning" title="Failed tasks are visible spend">
                A failed batch still burned {agg.wasted.toLocaleString()} tokens — the strict constraint keeps aggregate-only reporting, while failed statuses expose the waste instantly.
              </Callout>
            </Stack>
          )}
          <CodeBlock language="text" code={TWO_PHASE_INPUT} />
          <Callout type="info" title="Why the explicit gate matters">
            Alignment-only-until-approved stops the model from dumping a confident report on top of a misunderstood request — and the strict no-sub-task constraint kills the most common source of invented token numbers.
          </Callout>
        </Stack>
      </Card>
    </Stack>
  );
}

// ── Tab ─────────────────────────────────────────────────────────────────────

export default function PromptAlignmentTab() {
  const [activeSubTab, setActiveSubTab] = useState('reports');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="promptalignment"
        moduleLabel="Foundations"
        title="Prompt Frameworks: Reports, Approvals & Pre-Flight Alignment"
        description="Four families of prompt frameworks that make model output accountable: task-completion and token-utilization reports that end in a specific approval ask, a six-block universal master template (plus a meta-prompt that writes prompts for you), pre-flight alignment protocols that force a pause before generation, and a two-phase gated prompt where execution only begins after an explicit approval word."
        metrics={[
          { label: 'Report frameworks', value: '2' },
          { label: 'Master blocks', value: '6' },
          { label: 'Alignment protocols', value: '4' },
          { label: 'Gate phases', value: '2' },
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

        {activeSubTab === 'reports' && <ReportFrameworks />}
        {activeSubTab === 'master' && <UniversalMaster />}
        {activeSubTab === 'align' && <AlignmentProtocols />}
        {activeSubTab === 'gate' && <TwoPhaseGate />}
      </Container>
    </div>
  );
}
