import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  ROUTE_SET,
  evalPolicy,
  EXAMPLE_SCORES,
  POLICY_EXAMPLE,
  APPROACHES,
  CONTRACT_STEPS,
  EVAL_DIMENSIONS,
  CODE_CONTRACT,
  CODE_SELECTIVE,
} from './decisionLayerEngine.js';

const { Container, Stack, Grid } = Primitives;

const PURPLE = '#9B89C4';
const PURPLE_DARK = '#5B4B8A';
const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const RED = '#B4553A';
const ROUTE_COLORS = { retrieval: '#3A9B9F', billing: '#B4553A', security: '#5B4B8A', human_review: '#94A3B8' };

const SUBTABS = [
  { id: 'stack', icon: '🔀', label: '1. Where the Hidden Decision Lives', desc: 'Generation vs typed routing' },
  { id: 'approaches', icon: '⚖️', label: '2. Router Approaches', desc: 'Decoder vs head vs layer' },
  { id: 'simulator', icon: '🎚️', label: '3. Policy Simulator', desc: 'Threshold, margin, abstain' },
  { id: 'contract', icon: '📋', label: '4. Contract & Eval', desc: '5 steps, 4 dimensions' },
  { id: 'code', icon: '🛠️', label: '5. Code', desc: 'Typed decision + selective risk' },
];

function Lane({ y, title, color, nodes, dashedAfter }) {
  const x0 = 130, bw = 150, bh = 44, gap = 46;
  return (
    <g>
      <text x={10} y={y + 28} fontSize="12.5" fontWeight="700" fill={color}>{title}</text>
      {nodes.map((n, i) => {
        const x = x0 + i * (bw + gap);
        const dashed = dashedAfter != null && i > dashedAfter;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx="8"
              fill={dashed ? '#F7F6FA' : '#FFFFFF'} stroke={color}
              strokeWidth={dashed ? 1.2 : 1.8} strokeDasharray={dashed ? '5 4' : undefined} />
            <text x={x + bw / 2} y={y + bh / 2 + 4} textAnchor="middle" fontSize="11.5"
              fill="#1A1D26" fontWeight={i === 0 ? 600 : 400}>{n}</text>
            {i < nodes.length - 1 && (
              <path d={`M ${x + bw + 4} ${y + bh / 2} L ${x + bw + gap - 8} ${y + bh / 2}`}
                stroke="#94A3B8" strokeWidth="1.5" markerEnd="url(#arrow)" />
            )}
          </g>
        );
      })}
    </g>
  );
}

function StackDiagram() {
  return (
    <svg viewBox="0 0 980 330" width="100%" role="img"
      aria-label="Top lane: request goes to a decoder, produces text, gets parsed, validated, retried, then executed. Bottom lane: request and state go to a scorer, produce typed scores, pass a versioned policy, then route to execution or abstain, and every decision is logged">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8" />
        </marker>
      </defs>
      <Lane y={30} title="DECODE EVERYTHING" color={RED}
        nodes={['request', 'decoder LLM', 'free text', 'parse', 'validate', 'retry? → execute']}
        dashedAfter={3} />
      <line x1="10" y1="150" x2="970" y2="150" stroke="#EEF1F4" />
      <Lane y={180} title="DECIDE ONCE" color={TEAL_DARK}
        nodes={['request + state', 'scorer', 'typed scores', 'policy', 'route / abstain', 'execute + log']} />
      <text x={490} y={265} textAnchor="middle" fontSize="12" fill={RED}>
        top lane: the bounded decision hides inside open-ended generation — and can be improvised, malformed, or inconsistent
      </text>
      <text x={490} y={305} textAnchor="middle" fontSize="12" fill={TEAL_DARK}>
        bottom lane: same decision made explicit — candidates, scores, threshold, abstention, log
      </text>
    </svg>
  );
}

function ScoreBars({ scores }) {
  return (
    <div style={{ display: 'flex', gap: 3, width: 170, alignItems: 'center' }}>
      {ROUTE_SET.map((r) => (
        <div key={r} style={{ flex: scores[r], height: 14, background: ROUTE_COLORS[r], borderRadius: 3, minWidth: 2 }}
          title={`${r}: ${scores[r].toFixed(2)}`} />
      ))}
      <span style={{ fontSize: 10.5, color: 'var(--ds-color-text-tertiary)', marginLeft: 4, whiteSpace: 'nowrap' }}>
        {(Math.max(...Object.values(scores)) * 100).toFixed(0)}%
      </span>
    </div>
  );
}

function Metric({ value, label, color }) {
  return (
    <div style={{ flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: color || 'var(--ds-color-text-primary)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function PolicySim() {
  const [threshold, setThreshold] = useState(0.65);
  const [margin, setMargin] = useState(0.10);
  const [approach, setApproach] = useState('decision');
  const result = useMemo(() => evalPolicy(threshold, margin), [threshold, margin]);
  const app = APPROACHES.find((a) => a.id === approach);

  const simColumns = [
    { key: 'id', header: 'Req' },
    { key: 'text', header: 'Request', sortable: false },
    { key: 'top', header: 'Top score', render: (v, row) => (
      <span style={{ color: ROUTE_COLORS[v], fontWeight: 600 }}>{v} · {row.topScore.toFixed(2)}</span>
    ) },
    { key: 'gap', header: 'Margin', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace' }}>{v.toFixed(2)}</span> },
    { key: 'truth', header: 'True route', render: (v) => <span style={{ color: 'var(--ds-color-text-secondary)' }}>{v}</span> },
    { key: 'verdict', header: 'Policy verdict', render: (v) => (
      v === 'auto ✓' ? <Badge variant="default" style={{ background: '#E3F2F2', color: TEAL_DARK }}>{v}</Badge>
        : v === 'auto ✗' ? <Badge variant="default" style={{ background: '#FBEAE4', color: RED }}>{v}</Badge>
        : <Badge variant="default" style={{ background: '#EEF1F4', color: '#6B7280' }}>{v}</Badge>
    ) },
  ];

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🎚️ Simulator — threshold, margin, abstention</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            A live log of twelve requests with typed scores. The policy — not the model — decides what gets automated and what falls back to a human.
          </p>
        </div>

        <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Confidence threshold</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>{threshold.toFixed(2)}</span>
            </div>
            <input type="range" min={0.50} max={0.95} step={0.01} value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} aria-label="Confidence threshold" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Margin over runner-up</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: PURPLE_DARK }}>{margin.toFixed(2)}</span>
            </div>
            <input type="range" min={0} max={0.30} step={0.01} value={margin}
              onChange={(e) => setMargin(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: PURPLE, cursor: 'pointer' }} aria-label="Margin over runner-up" />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}>Scoring approach</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {APPROACHES.map((a) => (
                <button key={a.id} onClick={() => setApproach(a.id)}
                  style={{
                    flex: 1, padding: '6px 8px', fontSize: 11.5, borderRadius: 8, cursor: 'pointer',
                    border: `1px solid ${approach === a.id ? TEAL : 'var(--ds-color-border-subtle)'}`,
                    background: approach === a.id ? '#E3F2F2' : 'transparent',
                    color: approach === a.id ? TEAL_DARK : 'var(--ds-color-text-secondary)',
                    fontWeight: approach === a.id ? 600 : 400,
                  }}>{a.name.split(' ')[0]}</button>
              ))}
            </div>
          </div>
        </Grid>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Metric value={`${Math.round(result.coverage * 100)}%`} label="Coverage (auto-routed)" color={TEAL_DARK} />
          <Metric value={`${result.autoCount}/${result.total}`} label="Automated requests" />
          <Metric value={`${result.abstain}`} label="Abstained → fallback" color={PURPLE_DARK} />
          <Metric value={`${(result.risk * 100).toFixed(1)}%`} label="Selective risk (wrong among auto)" color={result.risk > 0 ? RED : TEAL_DARK} />
          <Metric value={`${app.latencyMs} ms`} label={`${app.name} · per decision`} />
          <Metric value={`$${(app.costPer1k).toFixed(2)}`} label="per 1k decisions" />
        </div>

        <Table columns={simColumns} data={result.rows} sortable={false} />

        <Callout type={result.risk > 0.1 ? 'warning' : 'info'} title="Reading the two numbers together">
          Coverage without risk is vanity: automating everything with a lenient threshold ({'≤ 0.55'} with a small margin) routes every request — including ambiguous ones like multi-intent billing requests — and selective risk climbs. Tighten the threshold and risk falls, but more requests pay the human-touch cost. The operating point is where <em>wrong auto-route cost = human review cost</em>.
        </Callout>
      </Stack>
    </Card>
  );
}

export default function DecisionLayerTab() {
  const [activeSubTab, setActiveSubTab] = useState('stack');

  const exampleRows = ROUTE_SET.map((r) => ({ route: r, score: EXAMPLE_SCORES[r] }));
  const exampleColumns = [
    { key: 'route', header: 'Candidate route', render: (v) => <span style={{ color: ROUTE_COLORS[v], fontWeight: 600 }}>{v}</span> },
    { key: 'score', header: 'Typed score', render: (v, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 140, height: 8, background: '#EEF1F4', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${v * 100}%`, height: '100%', background: ROUTE_COLORS[row.route] || TEAL, borderRadius: 4 }} />
        </div>
        <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12.5, fontWeight: 600 }}>{v.toFixed(2)}</span>
      </div>
    ) },
  ];

  const approachColumns = [
    { key: 'name', header: 'Approach', render: (v) => <strong>{v}</strong> },
    { key: 'how', header: 'How it works', sortable: false },
    { key: 'strengths', header: 'Strengths', sortable: false },
    { key: 'costs', header: 'Costs', sortable: false },
    {
      key: 'latencyMs', header: 'p50 latency',
      render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace', color: v > 100 ? RED : TEAL_DARK, fontWeight: 600 }}>{v} ms</span>,
    },
    {
      key: 'costPer1k', header: '$ / 1k',
      render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace' }}>${v.toFixed(2)}</span>,
    },
  ];

  const contractColumns = [
    { key: 'step', header: '#', render: (v) => <strong style={{ color: TEAL_DARK }}>Step {v}</strong> },
    { key: 'name', header: 'Contract step' },
    { key: 'detail', header: 'Detail', sortable: false },
  ];

  const evalColumns = [
    { key: 'dimension', header: 'Dimension', render: (v) => <strong>{v}</strong> },
    { key: 'metrics', header: 'What you measure', sortable: false },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="agents_frameworks"
        moduleLabel="Agentic Systems [Routing]"
        title="The Decision Layer: When Every Decision Must Not Be Generation"
        description="Every agentic stack plans, orchestrates, and routes — but routing hides inside open-ended generation. Make it explicit instead: a finite candidate set, typed scores, a versioned threshold-and-margin policy, an abstention route, and a decision log. Same interface, smaller model, honest failure modes."
        metrics={[
          { label: 'Example top score (security)', value: '0.82' },
          { label: 'Auto-route policy', value: '≥ 0.80 + margin' },
          { label: 'Decoder router p50 latency', value: '1200 ms' },
          { label: 'Structured layer p50 latency', value: '18 ms' },
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
                flex: 1, minWidth: '180px', padding: 'var(--ds-space-3) var(--ds-space-4)',
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

        {activeSubTab === 'stack' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>The hidden decision problem</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                A decoder asked “where should this request go?” is doing a bounded classification task through open-ended generation — complete with parsing, validation, and retry as collateral. Routing is a decision, not a sentence.
              </p>
              <StackDiagram />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>A worked example — four candidates, one policy</h3>
              <Table columns={exampleColumns} data={exampleRows} sortable={false} />
              <div style={{ marginTop: 10 }}>
                <CodeBlock language="python" code={`# policy: ${POLICY_EXAMPLE}\n# top=security 0.82, runner-up=billing 0.11 -> gap 0.71 >= 0.10 -> AUTO: security`} />
              </div>
            </Card>

            <Callout type="tip" title="Decoder router or encoder head — decide by stability">
              The route set changes often and the taxonomy is open-ended → a decoder router with a tight contract is reasonable. The routes are stable and finite → this is a classification problem; use a direct head (or the decision layer around either) and stop paying generation prices for it.
            </Callout>
          </Stack>
        )}

        {activeSubTab === 'approaches' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Three ways to score a route — and what each costs</h3>
              <Table columns={approachColumns} data={APPROACHES} sortable={false} />
              <Callout type="info" title="The decision layer composes with either scorer">
                Swap the scorer (decoder, encoder head, rules) without touching the policy: threshold, margin, abstention, and logging live outside the model. That is what makes the failure modes measurable instead of vibes.
              </Callout>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'simulator' && (
          <PolicySim />
        )}

        {activeSubTab === 'contract' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>The routing contract — five steps, no improvisation</h3>
              <Table columns={contractColumns} data={CONTRACT_STEPS} sortable={false} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>How to evaluate it — four dimensions</h3>
              <Table columns={evalColumns} data={EVAL_DIMENSIONS} sortable={false} />
              <Callout type="tip" title="Abstention is a feature, not an error">
                Selective prediction reframes the problem: instead of asking “is the router accurate?”, ask “at this coverage, what is the error rate among what we automated?” — and log policy version with every decision so regressions are attributable.
              </Callout>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Typed decision + versioned policy</h3>
              <CodeBlock language="python" code={CODE_CONTRACT} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Coverage–risk on the request log</h3>
              <CodeBlock language="python" code={CODE_SELECTIVE} />
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
