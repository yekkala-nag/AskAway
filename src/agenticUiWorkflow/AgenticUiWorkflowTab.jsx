import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  PROBLEM,
  WORKFLOWS,
  WW_EXAMPLE,
  wagnerWhitin,
  naivePolicies,
  PARSE_FIELDS,
  EMAIL_AGENT_PATTERNS,
  CODE_ENDPOINT,
  CODE_AGENT_TOOL,
} from './agenticUiWorkflowEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const AMBER = '#B9821F';
const RED = '#B4553A';

const DEMAND_SERIES = [40, 60, 30, 70, 50, 40, 60, 80];

const SUBTABS = [
  { id: 'problem', icon: '📧', label: '1. Push, Don’t Pull', desc: 'Analytics in the inbox' },
  { id: 'simulator', icon: '📉', label: '2. Wagner–Whitin Sim', desc: 'Batch tradeoff math' },
  { id: 'parse', icon: '🧩', label: '3. What the Agent Owns', desc: 'Parse, call, narrate' },
  { id: 'code', icon: '🧪', label: '4. Endpoint & Tool', desc: 'Deterministic core' },
];

function WorkflowDiagram() {
  const chip = (x, y, w, label, fill, stroke, textFill) => (
    <g>
      <rect x={x} y={y} width={w} height="54" rx="10" fill={fill} stroke={stroke} strokeWidth="1.8" />
      <text x={x + w / 2} y={y + 31} textAnchor="middle" fontSize="12" fontWeight="700" fill={textFill}>{label}</text>
    </g>
  );
  const arr = (x1, x2, y) => (
    <path d={`M ${x1} ${y} L ${x2 - 8} ${y}`} stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrW)" />
  );
  return (
    <svg viewBox="0 0 980 440" width="100%" role="img"
      aria-label="Two no-code email workflows: order intake filters mail, parses the purchase order, and appends rows to a sheet; demand planning posts a CSV to an endpoint, parses parameters, and replies with a batch plan">
      <defs>
        <marker id="arrW" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8" />
        </marker>
      </defs>

      <text x="30" y="34" fontSize="13" fontWeight="800" fill={TEAL_DARK}>WORKFLOW 1 — ORDER INTAKE</text>
      {chip(30, 48, 190, 'Inbound PO email', '#E3F2F2', TEAL, TEAL_DARK)}
      {arr(224, 258, 75)}
      {chip(258, 48, 190, 'Filter: is it a PO?', '#E3F2F2', TEAL, TEAL_DARK)}
      {arr(452, 486, 75)}
      {chip(486, 48, 220, 'LLM extracts SKUs + dates', '#F5F3FA', PURPLE, PURPLE)}
      {arr(710, 744, 75)}
      {chip(744, 48, 206, 'Rows → shared sheet', '#FFF7ED', AMBER, '#8A5A2B')}
      <text x="520" y="132" textAnchor="middle" fontSize="11" fill="#6B7280">
        cheap filter before the expensive call · clarify ambiguous quantities instead of guessing
      </text>

      <line x1="30" y1="170" x2="950" y2="170" stroke="#EEF1F4" />

      <text x="30" y="212" fontSize="13" fontWeight="800" fill={TEAL_DARK}>WORKFLOW 2 — DEMAND PLANNING</text>
      {chip(30, 226, 190, 'Email + CSV attach', '#E3F2F2', TEAL, TEAL_DARK)}
      {arr(224, 258, 253)}
      {chip(258, 226, 190, 'Parse cost params', '#F5F3FA', PURPLE, PURPLE)}
      {arr(452, 486, 253)}
      {chip(486, 226, 220, 'POST → WW endpoint', '#E3F2F2', TEAL, TEAL_DARK)}
      {arr(710, 744, 253)}
      {chip(744, 226, 206, 'Reply: batch plan', '#FFF7ED', AMBER, '#8A5A2B')}

      {/* envelope metaphor */}
      <rect x="30" y="316" width="920" height="94" rx="12" fill="#F7F6FA" stroke="#CBD5E1" strokeWidth="1.5" />
      <text x="490" y="348" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1A1D26">
        Pull: “bring the decision-maker into a new tool”
      </text>
      <text x="490" y="372" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={TEAL_DARK}>
        Push: “bring the analysis into the tool they already open every morning”
      </text>
      <text x="490" y="396" textAnchor="middle" fontSize="11.5" fill="#6B7280">
        no-code workflow tooling keeps the automation editable by the people who own the process
      </text>
    </svg>
  );
}

function WwSim() {
  const [setup, setSetup] = useState(WW_EXAMPLE.cost2);
  const [holding, setHolding] = useState(50);

  const result = useMemo(() => {
    const opt = wagnerWhitin(DEMAND_SERIES, setup, holding);
    const naive = naivePolicies(DEMAND_SERIES, setup, holding);
    const best = Math.min(opt.total, naive.single.cost, naive.lotForLot.cost);
    return { opt, naive, best };
  }, [setup, holding]);

  const worst = Math.max(result.opt.total, result.naive.single.cost, result.naive.lotForLot.cost);
  const bar = (v, color, label, batches) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 3 }}>
        <span style={{ fontWeight: 600 }}>{label} <span style={{ color: 'var(--ds-color-text-tertiary)', fontWeight: 400 }}>· {batches}</span></span>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color }}>{Math.round(v).toLocaleString()}</span>
      </div>
      <div style={{ height: 14, background: '#EEF1F4', borderRadius: 7, overflow: 'hidden' }}>
        <div style={{ width: `${worst > 0 ? (v / worst) * 100 : 0}%`, height: '100%', background: color, transition: 'width .25s' }} />
      </div>
    </div>
  );

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={5}>
        <div>
          <h3 style={{ margin: 0 }}>📉 Wagner–Whitin simulator — 8 periods of demand</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            One batch = low setup, inventory piles up. Lot-for-lot = zero inventory, setup every period. Dynamic programming finds the middle ground.
          </p>
        </div>

        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Setup cost / batch</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: RED }}>{setup}</span>
            </div>
            <input type="range" min={0} max={8000} step={100} value={setup}
              onChange={(e) => setSetup(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: RED, cursor: 'pointer' }} aria-label="Setup cost" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Holding cost / unit / period</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>{holding}</span>
            </div>
            <input type="range" min={1} max={200} step={1} value={holding}
              onChange={(e) => setHolding(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} aria-label="Holding cost" />
          </div>
        </Grid>

        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Demand series (boxes / period)</div>
          <svg viewBox="0 0 520 110" width="100%" role="img" aria-label="Bar chart of demand across eight periods">
            {DEMAND_SERIES.map((d, i) => {
              const h = (d / 80) * 80;
              return (
                <g key={i}>
                  <rect x={20 + i * 62} y={90 - h} width="44" height={h} rx="5" fill={TEAL} />
                  <text x={42 + i * 62} y={105} textAnchor="middle" fontSize="11" fill="#6B7280">P{i + 1}</text>
                  <text x={42 + i * 62} y={86 - h} textAnchor="middle" fontSize="11" fontWeight="700" fill={TEAL_DARK}>{d}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div>
          {bar(result.naive.single.cost, PURPLE, 'Single batch', `${result.naive.single.batches} batch`)}
          {bar(result.naive.lotForLot.cost, AMBER, 'Lot-for-lot (every period)', `${result.naive.lotForLot.batches} batches`)}
          {bar(result.opt.total, TEAL_DARK, 'Optimal (dynamic programming)', `${result.opt.batches.length} batches`)}
        </div>

        <div style={{
          padding: 14, borderRadius: 10, background: 'var(--ds-color-bg-canvas)',
          borderLeft: `5px solid ${TEAL_DARK}`,
        }}>
          <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginBottom: 6 }}>Optimal schedule</div>
          {result.opt.batches.map((b, i) => (
            <div key={i} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5, color: 'var(--ds-color-text-primary)', padding: '2px 0' }}>
              batch {i + 1}: P{b.start}→P{b.end} · {b.qty} boxes
            </div>
          ))}
          <div style={{ marginTop: 6, fontSize: 12.5, color: TEAL_DARK, fontWeight: 600 }}>
            saves {Math.round(Math.min(result.naive.single.cost, result.naive.lotForLot.cost) - result.opt.total).toLocaleString()} vs the best naive policy here
          </div>
        </div>

        <Callout type="tip" title="The agent doesn’t do this arithmetic">
          The agent reads the email, extracts the parameters, calls the service, and narrates the result in business language. The math lives in a tested endpoint — that separation is the whole design.
        </Callout>
      </Stack>
    </Card>
  );
}

export default function AgenticUiWorkflowTab() {
  const [activeSubTab, setActiveSubTab] = useState('problem');

  const problemColumns = [
    { key: 'point', header: 'Pain point', render: (v) => <strong>{v}</strong> },
    { key: 'detail', header: 'Why it hurts', sortable: false },
  ];
  const wayColumns = [
    { key: 'way', header: 'Approach', render: (v) => <strong style={{ color: v.startsWith('Pull') ? RED : TEAL_DARK }}>{v}</strong> },
    { key: 'cost', header: 'Consequence', sortable: false },
  ];
  const fieldColumns = [
    { key: 'field', header: 'Parsed field', render: (v) => (
      <code style={{ fontSize: 12, background: '#F5F3FA', color: PURPLE, padding: '2px 7px', borderRadius: 6 }}>{v}</code>
    ) },
    { key: 'label', header: 'Meaning', sortable: false },
  ];
  const patternColumns = [
    { key: 'pattern', header: 'Workflow pattern', render: (v) => <strong>{v}</strong> },
    { key: 'where', header: 'Used in', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
    { key: 'note', header: 'Note', sortable: false },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="agenticuiworkflow"
        moduleLabel="Data & Platform Layers [Applied]"
        title="Agentic UI: Put the Analytics Where Users Already Work"
        description="Decision-makers shouldn’t have to become data analysts, and they won’t open a new tool to get an answer. The other direction is to push no-code agent workflows into the interface they live in — an email that parses a purchase order, then replies with a costed batch plan from a deterministic optimization service."
        metrics={[
          { label: 'Workflows', value: '2 (intake + planning)' },
          { label: 'Periods in the WW demo', value: '8' },
          { label: 'Math done inside the LLM', value: '0' },
          { label: 'New UI the user must learn', value: '0' },
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

        {activeSubTab === 'problem' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>The optimization problem this is all solving</h3>
              <Table columns={problemColumns} data={PROBLEM.lines} sortable={false} />
            </Card>

            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>Two directions</h3>
                <Table columns={wayColumns} data={PROBLEM.twoWays} sortable={false} />
              </Card>
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 4px 0' }}>The tradeoff, in physical terms</h3>
                <div style={{ fontSize: 'var(--ds-font-size-bodySm)', lineHeight: 1.75, color: 'var(--ds-color-text-secondary)' }}>
                  {WW_EXAMPLE.problem}
                </div>
                <div style={{ marginTop: 10, fontSize: 'var(--ds-font-size-bodySm)', fontWeight: 600, color: TEAL_DARK }}>
                  {WW_EXAMPLE.bet}
                </div>
              </Card>
            </Grid>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Both workflows end where the human already is</h3>
              <WorkflowDiagram />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'simulator' && <WwSim />}

        {activeSubTab === 'parse' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>What the agent extracts from the message</h3>
              <Table columns={fieldColumns} data={PARSE_FIELDS} sortable={false} />
              <Callout type="warning" title="Missing field → clarify, never guess">
                A blank holding cost silently produces a confident, wrong schedule. The workflow pauses and asks — the same discipline the optimization endpoint enforces with its own validation.
              </Callout>
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Workflow patterns worth copying</h3>
              <Table columns={patternColumns} data={EMAIL_AGENT_PATTERNS} sortable={false} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>The five workflow steps, side by side</h3>
              <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                {WORKFLOWS.map((wf) => (
                  <div key={wf.id} style={{
                    padding: 16, borderRadius: 12, background: 'var(--ds-color-bg-canvas)',
                    border: '1px solid var(--ds-color-border-subtle)',
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>{wf.name}</div>
                    <div style={{ fontSize: 12, color: TEAL_DARK, marginBottom: 10 }}>trigger: {wf.trigger}</div>
                    {wf.steps.map((s) => (
                      <div key={s.n} style={{ display: 'flex', gap: 8, padding: '5px 0', fontSize: 12.5 }}>
                        <span style={{
                          minWidth: 22, height: 22, borderRadius: 999, background: TEAL, color: '#FFF',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11.5, fontWeight: 700, flexShrink: 0,
                        }}>{s.n}</span>
                        <span><strong>{s.step}</strong><br /><span style={{ color: 'var(--ds-color-text-secondary)' }}>{s.detail}</span></span>
                      </div>
                    ))}
                    <div style={{ marginTop: 8, fontSize: 12, color: TEAL_DARK, fontWeight: 600 }}>→ {wf.output}</div>
                  </div>
                ))}
              </Grid>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>1 · The deterministic endpoint the agent calls</h3>
              <CodeBlock language="python" code={CODE_ENDPOINT} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>2 · The agent tool: parse → call → narrate</h3>
              <CodeBlock language="python" code={CODE_AGENT_TOOL} />
              <Callout type="info" title="Boundary rule">
                If a number decides money, it comes from the service — never from the model. The model’s job is extraction, error handling, and a reply a planner can act on.
              </Callout>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
