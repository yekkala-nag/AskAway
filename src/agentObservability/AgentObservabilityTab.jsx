import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  FAIL_SIGNATURE,
  SIGNAL_COMPARISON,
  SPAN_TYPES,
  ALERTS,
  SAMPLE_RUNS,
  evaluateRun,
  SAMPLING_TIERS,
  PRIVACY_RULES,
  PIPELINE_STEPS,
  CODE_LOGGING,
  CODE_TRACING,
  CODE_METRICS,
} from './agentObservabilityEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#9B89C4';
const PURPLE_DARK = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'failure', icon: '🫥', label: '1. Failure That Looks Fine', desc: 'Green dashboard, wrong answer' },
  { id: 'waterfall', icon: '📊', label: '2. Reading the Waterfall', desc: 'Spans as one picture' },
  { id: 'simulator', icon: '🎚️', label: '3. Trace Inspector', desc: 'Findings + alert thresholds' },
  { id: 'ops', icon: '🔧', label: '4. Pipeline, Privacy & Code', desc: 'Collector, sampling, instrumentation' },
];

function depthOf(span) {
  if (span.name.startsWith('invoke_agent')) return 0;
  if (span.name.startsWith('chat')) return 1;
  return 2;
}

function spanColor(span) {
  if (span.error) return RED;
  if (span.duplicate) return AMBER;
  if (span.name.startsWith('chat')) return PURPLE;
  if (span.name.startsWith('execute_tool')) return TEAL;
  return '#6B7280';
}

function Waterfall({ run }) {
  const W = 920, LABEL = 260, ROW = 34, TOP = 34;
  const rows = run.spans;
  const H = TOP + rows.length * ROW + 30;
  const scaleX = (ms) => (ms / run.totalMs) * (W - LABEL - 30);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label={`Trace waterfall for ${run.name}: ${rows.length} spans over ${run.totalMs} milliseconds`}>
      <text x={LABEL} y={18} fontSize="11" fill="#6B7280">0 ms</text>
      <text x={W - 30} y={18} fontSize="11" fill="#6B7280" textAnchor="end">{run.totalMs.toLocaleString()} ms</text>
      <line x1={LABEL} y1={24} x2={W - 30} y2={24} stroke="#CBD5E1" />
      {rows.map((span, i) => {
        const depth = depthOf(span);
        const y = TOP + i * ROW;
        const x = LABEL + depth * 18 + scaleX(span.start);
        const w = Math.max(3, scaleX(span.dur));
        return (
          <g key={i}>
            <text x={LABEL - 8} y={y + 16} textAnchor="end" fontSize="11.5"
              fill={span.error ? RED : '#1A1D26'} fontWeight={depth === 0 ? 700 : 400}>
              {depth > 0 ? '  '.repeat(0) : ''}{span.name}
            </text>
            <rect x={x} y={y + 4} width={w} height={18} rx="5"
              fill={spanColor(span)} opacity={span.error ? 0.9 : 0.85} />
            {span.duplicate && (
              <text x={x + w + 8} y={y + 17} fontSize="10.5" fill={AMBER} fontWeight="700">duplicate ↺</text>
            )}
            {span.error && (
              <text x={x + w + 8} y={y + 17} fontSize="10.5" fill={RED} fontWeight="700">error</text>
            )}
            {span.tokens && (
              <text x={x + 6} y={y + 17} fontSize="10" fill="#FFF" fontWeight="600">
                {span.tokens.in.toLocaleString()}↓ {span.tokens.out}↑ tok
              </text>
            )}
          </g>
        );
      })}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#6B7280">
        nesting depth = parentage; width = duration; tokens live on the chat spans
      </text>
    </svg>
  );
}

function TraceInspector() {
  const [runId, setRunId] = useState('duplicate');
  const [ratio, setRatio] = useState(10);
  const [tokenMult, setTokenMult] = useState(2);
  const run = SAMPLE_RUNS.find((r) => r.id === runId);
  const findings = useMemo(
    () => evaluateRun(run, { ratio, tokenMultiplier: tokenMult }),
    [run, ratio, tokenMult]
  );

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🎚️ Simulator — three recorded runs, your thresholds</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Pick a trace, adjust the alert thresholds, and read what the inspector flags. The dashboard equivalent of all three runs was a green dot.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SAMPLE_RUNS.map((r) => (
            <button key={r.id} onClick={() => setRunId(r.id)}
              style={{
                padding: '8px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                border: `1.5px solid ${runId === r.id ? TEAL : 'var(--ds-color-border-subtle)'}`,
                background: runId === r.id ? TEAL : 'transparent',
                color: runId === r.id ? '#FFF' : 'var(--ds-color-text-secondary)',
              }}>{r.name}</button>
          ))}
        </div>

        <Waterfall run={run} />

        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Input:output ratio alarm</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: PURPLE_DARK }}>{ratio}:1</span>
            </div>
            <input type="range" min={2} max={20} step={1} value={ratio}
              onChange={(e) => setRatio(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: PURPLE, cursor: 'pointer' }} aria-label="Ratio threshold" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Token-rate multiplier vs baseline</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>{tokenMult}×</span>
            </div>
            <input type="range" min={1} max={5} step={0.5} value={tokenMult}
              onChange={(e) => setTokenMult(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} aria-label="Token multiplier threshold" />
          </div>
        </Grid>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Badge variant="default" style={{ background: '#EEF1F4', color: '#6B7280' }}>{run.spans.length} spans</Badge>
          <Badge variant="default" style={{ background: '#EEF1F4', color: '#6B7280' }}>{run.totalMs.toLocaleString()} ms</Badge>
          <Badge variant="default" style={{ background: '#F5F3FA', color: PURPLE_DARK }}>{run.inputTokens.toLocaleString()} in / {run.outputTokens.toLocaleString()} out tok</Badge>
          <Badge variant="default" style={{ background: run.errors ? '#FBEAE4' : '#E3F2F2', color: run.errors ? RED : TEAL_DARK }}>{run.errors} errors</Badge>
        </div>

        <Stack gap={2}>
          {findings.map((f, i) => (
            <div key={i} style={{
              padding: '10px 14px', borderRadius: 10, fontSize: 13, lineHeight: 1.55,
              background: f.level === 'error' ? '#FBEAE4' : f.level === 'warn' ? '#FFF4E5' : '#E3F2F2',
              color: f.level === 'error' ? RED : f.level === 'warn' ? '#8A5A2B' : TEAL_DARK,
              borderLeft: `4px solid ${f.level === 'error' ? RED : f.level === 'warn' ? '#E0B77A' : TEAL}`,
            }}>
              <strong style={{ textTransform: 'uppercase', fontSize: 10.5, letterSpacing: 0.6 }}>{f.level}</strong>
              {' · '}{f.text}
            </div>
          ))}
        </Stack>

        <Callout type="info" title="Verdict on this run">
          {run.verdict}
        </Callout>
      </Stack>
    </Card>
  );
}

export default function AgentObservabilityTab() {
  const [activeSubTab, setActiveSubTab] = useState('failure');

  const symptomColumns = [
    { key: 'symptom', header: 'What happened', render: (v) => <strong>{v}</strong> },
    { key: 'tripsAnError', header: 'Trips an error?', render: (v) => (
      v ? <Badge variant="default" style={{ background: '#E3F2F2', color: TEAL_DARK }}>yes</Badge>
        : <Badge variant="default" style={{ background: '#FBEAE4', color: RED }}>no — looks like success</Badge>
    ) },
    { key: 'whoCatches', header: 'Who catches it', sortable: false },
  ];

  const signalColumns = [
    { key: 'signal', header: 'Signal' },
    { key: 'traditional', header: 'Traditional app', render: (v) => <span style={{ color: 'var(--ds-color-text-secondary)' }}>{v}</span> },
    { key: 'agent', header: 'LLM / AI agent', render: (v) => <span style={{ color: PURPLE_DARK, fontWeight: 600 }}>{v}</span> },
  ];

  const spanColumns = [
    { key: 'span', header: 'Span type', render: (v) => (
      <code style={{ background: '#F5F3FA', color: PURPLE_DARK, fontWeight: 700, padding: '2px 7px', borderRadius: 6, fontSize: 12.5 }}>{v}</code>
    ) },
    { key: 'meaning', header: 'What it marks', sortable: false },
    { key: 'carries', header: 'Key attributes', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{v}</span> },
  ];

  const alertColumns = [
    { key: 'metric', header: 'Metric', render: (v) => <strong>{v}</strong> },
    { key: 'condition', header: 'Alert condition', render: (v) => (
      <span style={{ fontFamily: 'ui-monospace, monospace', color: RED, fontWeight: 600 }}>{v}</span>
    ) },
    { key: 'why', header: 'What it usually means', sortable: false },
  ];

  const samplingColumns = [
    { key: 'situation', header: 'Situation' },
    { key: 'rate', header: 'Capture rate', render: (v) => (
      <span style={{ fontFamily: 'ui-monospace, monospace', color: TEAL_DARK, fontWeight: 700 }}>{v}</span>
    ) },
    { key: 'why', header: 'Why', sortable: false },
  ];

  const privacyColumns = [
    { key: 'rule', header: 'Rule', render: (v) => <strong>{v}</strong> },
    { key: 'why', header: 'Why', sortable: false },
  ];

  const pipelineColumns = [
    { key: 'step', header: 'Stage' },
    { key: 'detail', header: 'Responsibility', sortable: false },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="agentobservability"
        moduleLabel="Cost & Ops [Tracing]"
        title="Agent Observability: When Failures Are Built to Look Like Success"
        description="An agent can be confidently, silently wrong: redundant tool calls, stale answers, valid-but-wrong actions — all with a green dashboard. Structured logging ties every line to a run, tracing nests each step inside the step that caused it, and metrics watch the tokens instead of the requests."
        metrics={[
          { label: 'Pillars', value: 'logs · metrics · traces' },
          { label: 'Standard span types', value: '5' },
          { label: 'Load-bearing alerts', value: '4' },
          { label: 'Errors a dashboard catches here', value: '0' },
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

        {activeSubTab === 'failure' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 8px 0' }}>{FAIL_SIGNATURE.story.split('.')[0]}.</h3>
              <p style={{ margin: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)', lineHeight: 1.7 }}>
                {FAIL_SIGNATURE.story.split('. ').slice(1).join('. ')}
              </p>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>How agent failures differ from app failures</h3>
              <Table columns={symptomColumns} data={FAIL_SIGNATURE.symptoms} sortable={false} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>The signal shift</h3>
              <Table columns={signalColumns} data={SIGNAL_COMPARISON} sortable={false} />
              <Callout type="tip" title="Same input, different path — every time">
                Temperature, retrieval results, and which tools are available can all shift the route an agent takes. One “it worked when I tested it” trace says nothing about the distribution of real runs — which is why capturing a representative sample of runs matters more than capturing any single perfect one.
              </Callout>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'waterfall' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>One run, one picture</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Spans stacked by nesting depth, stretched by duration. Tool spans are siblings of the chat span that proposed them — not children of it — because a tool call is a separate step. Parentage comes from how the with-blocks nest in code; nothing is wired by hand.
              </p>
              <Waterfall run={SAMPLE_RUNS[1]} />
              <Callout type="warning" title="The shape, before any log line">
                Two <code>refund_lookup</code> bars side by side under one wide chat span is the whole incident. Reading habits: a bar unusually wide vs siblings (where time and tokens go), a tool repeating when it shouldn’t, a chat span that reaches for a tool the task never needed.
              </Callout>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Standard span vocabulary</h3>
              <Table columns={spanColumns} data={SPAN_TYPES} sortable={false} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'simulator' && <TraceInspector />}

        {activeSubTab === 'ops' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>The four alerts that matter</h3>
              <Table columns={alertColumns} data={ALERTS} sortable={false} />
            </Card>

            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>Sampling: capture what you’ll actually re-read</h3>
                <Table columns={samplingColumns} data={SAMPLING_TIERS} sortable={false} />
              </Card>
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>Privacy as a first-class decision</h3>
                <Table columns={privacyColumns} data={PRIVACY_RULES} sortable={false} />
              </Card>
            </Grid>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Telemetry pipeline</h3>
              <Table columns={pipelineColumns} data={PIPELINE_STEPS} sortable={false} />
              <Callout type="info" title="Strip once, at the Collector">
                Prompt content belongs in span events (filterable, truncatable) — never as indexed attributes. One transform processor deletes prompt/completion keys from every span crossing the pipeline before storage, so compliance never becomes a code change scattered across call sites.
              </Callout>
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>1 · Structured logging tied to the run</h3>
              <CodeBlock language="python" code={CODE_LOGGING} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>2 · Manual instrumentation — nesting does the wiring</h3>
              <CodeBlock language="python" code={CODE_TRACING} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>3 · Token and duration metrics</h3>
              <CodeBlock language="python" code={CODE_METRICS} />
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
