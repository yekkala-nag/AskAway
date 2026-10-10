import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  SYNC_LIMIT_S,
  EXAMPLE_LONG_RUN_S,
  SYNC_STEPS,
  ASYNC_STAGES,
  INFRA_ROWS,
  FAILURE_MODES,
  DECISION_PRESETS,
  evaluateSyncRun,
  simulateAsyncRun,
  pickPattern,
  CODE_SYNC,
  CODE_ASYNC,
} from './syncAsyncAgentEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'wait', icon: '⏳', label: '1. Wait and see', desc: 'Sync request-response and its timeout trap' },
  { id: 'fire', icon: '📨', label: '2. Fire and forget', desc: 'Async lifecycle: queue, workers, checkpoints' },
  { id: 'which', icon: '🧭', label: '3. Which one', desc: 'Duration × patience × complexity picker' },
  { id: 'demands', icon: '🧱', label: '4. What async demands', desc: 'Infra parts, failures, mitigations' },
];

function SyncSequenceDiagram() {
  const limit = SYNC_LIMIT_S;
  const run = EXAMPLE_LONG_RUN_S;
  const scale = 880 / 50;
  const limitX = 30 + limit * scale;
  const runX = 30 + run * scale;
  return (
    <svg viewBox="0 0 940 270" width="100%" role="img"
      aria-label="Sequence diagram: client waits on an open connection, the gateway drops it at 29 seconds, the agent keeps working to 45 seconds">
      <defs>
        <marker id="arrS" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8" />
        </marker>
      </defs>
      <text x="30" y="24" fontSize="12" fontWeight="700" fill="var(--ds-color-text-primary)">time →</text>
      {/* client lane */}
      <text x="30" y="58" fontSize="12" fontWeight="700" fill={TEAL_DARK}>client</text>
      <line x1="110" y1="50" x2={limitX} y2="50" stroke={TEAL} strokeWidth="3" />
      <line x1={limitX} y1="50" x2={runX} y2="50" stroke={RED} strokeWidth="3" strokeDasharray="6 5" />
      <text x={Math.min(limitX - 8, 880)} y="42" textAnchor="end" fontSize="11" fill={TEAL_DARK}>holding connection…</text>
      <text x={limitX + 6} y="42" fontSize="11" fill={RED}>dropped — nobody listening</text>
      {/* gateway marker */}
      <line x1={limitX} y1="30" x2={limitX} y2="200" stroke={RED} strokeWidth="2" strokeDasharray="5 4" />
      <rect x={limitX - 92} y="206" width="184" height="44" rx="9" fill="#FBEAE4" stroke={RED} strokeWidth="1.6" />
      <text x={limitX} y="224" textAnchor="middle" fontSize="12" fontWeight="700" fill={RED}>illustrative limit: {limit}s</text>
      <text x={limitX} y="241" textAnchor="middle" fontSize="11" fill={RED}>gateway drops here</text>
      {/* agent lane */}
      <text x="30" y="118" fontSize="12" fontWeight="700" fill={PURPLE}>agent</text>
      <line x1="110" y1="110" x2={runX} y2="110" stroke={PURPLE} strokeWidth="3" markerEnd="url(#arrS)" />
      <text x={runX - 4} y="102" textAnchor="end" fontSize="11" fill={PURPLE}>still working to {run}s — tokens burning</text>
      {/* blocked thread */}
      <rect x="110" y="140" width={limitX - 110} height="40" rx="8" fill="#E3F2F2" stroke={TEAL} strokeWidth="1.6" />
      <text x={(110 + limitX) / 2} y="164" textAnchor="middle" fontSize="11.5" fill={TEAL_DARK}>thread blocked: can do nothing else</text>
      <rect x={limitX} y="140" width={runX - limitX} height="40" rx="8" fill="#FBEAE4" stroke={RED} strokeWidth="1.6" />
      <text x={(limitX + runX) / 2} y="164" textAnchor="middle" fontSize="11.5" fill={RED}>wasted: {run - limit}s</text>
      <text x="470" y="262" textAnchor="middle" fontSize="11" fill="#6B7280">
        sync fails exactly when the work outlives the wait — the bill survives the connection
      </text>
    </svg>
  );
}

function TimeoutSimulator() {
  const [task, setTask] = useState(EXAMPLE_LONG_RUN_S);
  const [timeout, setTimeout] = useState(SYNC_LIMIT_S);
  const result = useMemo(() => evaluateSyncRun(task, timeout), [task, timeout]);
  const pct = Math.min(100, Math.round((task / 60) * 100));
  const limitPct = Math.min(100, Math.round((timeout / 60) * 100));
  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>⏱️ Simulator — will this run survive the wait?</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Drag the agent run against the connection limit. Cross the line and the verdict flips from success to dropped.
          </p>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>Agent run duration</span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: task <= timeout ? TEAL_DARK : RED }}>{task}s</span>
          </div>
          <input type="range" min={2} max={60} step={1} value={task}
            onChange={(e) => setTask(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: PURPLE, cursor: 'pointer' }} aria-label="Agent run duration" />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>Connection timeout</span>
            <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>{timeout}s</span>
          </div>
          <input type="range" min={5} max={60} step={1} value={timeout}
            onChange={(e) => setTimeout(parseInt(e.target.value, 10))}
            style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} aria-label="Connection timeout" />
        </div>
        {/* timeline bar with CSS transition */}
        <div style={{ position: 'relative', height: 26, borderRadius: 13, background: 'var(--ds-color-bg-canvas)', border: '1px solid var(--ds-color-border-subtle)', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`,
            background: result.success ? TEAL : RED, opacity: 0.75,
            transition: 'width 0.35s ease, background 0.35s ease',
          }} />
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: `${limitPct}%`, width: 3,
            background: TEAL_DARK, transition: 'left 0.35s ease',
          }} />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge variant="default" style={{
            background: result.success ? '#E3F2F2' : '#FBEAE4',
            color: result.success ? TEAL_DARK : RED,
          }}>
            {result.verdict}{result.success ? '' : ` at ${result.droppedAt}s`}
          </Badge>
          {!result.success && (
            <span style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              {result.wastedSeconds}s of agent work burns after the drop.
            </span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>{result.message}</p>
      </Stack>
    </Card>
  );
}

function AsyncFlowDiagram() {
  const [active, setActive] = useState(0);
  const boxes = ASYNC_STAGES;
  const boxW = 150;
  const gap = 28;
  const totalW = boxes.length * boxW + (boxes.length - 1) * gap;
  const startX = (940 - totalW) / 2;
  return (
    <div>
      <svg viewBox="0 0 940 210" width="100%" role="img"
        aria-label="Flow diagram of the async lifecycle: submit, queue, background workers, checkpointing, poll or notify">
        <defs>
          <marker id="arrA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8" />
          </marker>
        </defs>
        {boxes.map((b, i) => {
          const x = startX + i * (boxW + gap);
          const isActive = i === active;
          const isDone = i < active;
          const stroke = isActive ? TEAL : isDone ? TEAL_DARK : '#CBD5E1';
          const fill = isActive ? '#E3F2F2' : 'var(--ds-color-bg-surface)';
          return (
            <g key={b.id} onClick={() => setActive(i)} style={{ cursor: 'pointer' }}>
              {i > 0 && (
                <line
                  x1={x - gap} y1="85" x2={x} y2="85"
                  stroke={i <= active ? TEAL : '#CBD5E1'} strokeWidth={i <= active ? 3 : 2}
                  markerEnd="url(#arrA)" style={{ transition: 'stroke 0.3s ease' }}
                />
              )}
              <rect x={x} y="40" width={boxW} height="90" rx="10"
                fill={fill} stroke={stroke} strokeWidth={isActive ? 2.6 : 1.6}
                style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }} />
              <text x={x + boxW / 2} y="66" textAnchor="middle" fontSize="12" fontWeight="700"
                fill={isActive || isDone ? TEAL_DARK : 'var(--ds-color-text-secondary)'}>
                {i + 1}. {b.label}
              </text>
              <text x={x + boxW / 2} y="88" textAnchor="middle" fontSize="10.5" fill="#6B7280">
                {b.id === 'submit' ? 'instant job id' : b.id === 'queue' ? 'message broker' : b.id === 'work' ? 'off-request' : b.id === 'checkpoint' ? 'state store' : 'client returns'}
              </text>
              <text x={x + boxW / 2} y="106" textAnchor="middle" fontSize="10.5" fill="#6B7280">
                {b.id === 'submit' ? 'connection free' : b.id === 'queue' ? 'durable wait' : b.id === 'work' ? 'agent loop' : b.id === 'checkpoint' ? 'survives crash' : 'poll or push'}
              </text>
              {isActive && <circle cx={x + boxW / 2} cy="140" r="5" fill={TEAL} style={{ transition: 'fill 0.3s ease' }} />}
            </g>
          );
        })}
        <text x="470" y="190" textAnchor="middle" fontSize="11" fill="#6B7280">
          click a stage — the connection is only busy for step one
        </text>
      </svg>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 4 }}>
        {boxes.map((b, i) => (
          <button key={b.id} onClick={() => setActive(i)} aria-label={`Show stage ${b.label}`}
            style={{
              width: 34, height: 8, borderRadius: 4, border: 'none', cursor: 'pointer',
              background: i === active ? TEAL : i < active ? TEAL_DARK : 'var(--ds-color-border-subtle)',
              opacity: i === active ? 1 : 0.55, transition: 'background 0.3s ease, opacity 0.3s ease',
            }} />
        ))}
      </div>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.7, margin: '8px 0 0 0' }}>
        <strong style={{ color: TEAL_DARK }}>{boxes[active].label}:</strong> {boxes[active].detail}
      </p>
    </div>
  );
}

function PatternPicker() {
  const [presetId, setPresetId] = useState('deep-research');
  const preset = DECISION_PRESETS.find((p) => p.id === presetId) || DECISION_PRESETS[0];
  const [duration, setDuration] = useState(preset.durationS);
  const [tolerance, setTolerance] = useState(preset.toleranceS);
  const [complexity, setComplexity] = useState(preset.complexity);
  const [customized, setCustomized] = useState(false);

  const pick = (id) => {
    const p = DECISION_PRESETS.find((x) => x.id === id);
    setPresetId(id);
    setDuration(p.durationS);
    setTolerance(p.toleranceS);
    setComplexity(p.complexity);
    setCustomized(false);
  };
  const tweak = (setter) => (e) => { setter(parseInt(e.target.value, 10)); setCustomized(true); };

  const verdict = useMemo(() => pickPattern({ durationS: duration, toleranceS: tolerance, complexity }), [duration, tolerance, complexity]);
  const asyncSim = useMemo(() => simulateAsyncRun(duration, Math.max(2, Math.round(tolerance / 2))), [duration, tolerance]);
  const isAsync = verdict.pattern === 'ASYNC';

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🧭 Simulator — pattern picker</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Pick a scenario, then drag the sliders. The verdict weighs how long the job takes, how long anyone will wait, and how tangled it is.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {DECISION_PRESETS.map((p) => (
            <button key={p.id} onClick={() => pick(p.id)}
              style={{
                padding: '6px 12px', fontSize: 12, borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                border: `1px solid ${presetId === p.id && !customized ? TEAL : 'var(--ds-color-border-subtle)'}`,
                background: presetId === p.id && !customized ? '#E3F2F2' : 'transparent',
                color: presetId === p.id && !customized ? TEAL_DARK : 'var(--ds-color-text-secondary)',
              }}>{p.label}</button>
          ))}
          {customized && (
            <Badge variant="default" style={{ background: '#FBF3E2', color: AMBER }}>custom mix</Badge>
          )}
        </div>
        <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Task duration</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: PURPLE }}>{duration}s</span>
            </div>
            <input type="range" min={2} max={300} step={1} value={duration} onChange={tweak(setDuration)}
              style={{ width: '100%', accentColor: PURPLE, cursor: 'pointer' }} aria-label="Task duration" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Latency tolerance</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>{tolerance}s</span>
            </div>
            <input type="range" min={2} max={120} step={1} value={tolerance} onChange={tweak(setTolerance)}
              style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} aria-label="Latency tolerance" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Complexity (1–5)</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: AMBER }}>{complexity}</span>
            </div>
            <input type="range" min={1} max={5} step={1} value={complexity} onChange={tweak(setComplexity)}
              style={{ width: '100%', accentColor: AMBER, cursor: 'pointer' }} aria-label="Complexity" />
          </div>
        </Grid>
        <div style={{
          display: 'flex', gap: 12, alignItems: 'center', padding: 14, borderRadius: 10,
          background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${isAsync ? TEAL : PURPLE}`,
          transition: 'border-color 0.3s ease',
        }}>
          <div style={{
            fontSize: 22, fontWeight: 800, color: isAsync ? TEAL_DARK : PURPLE, minWidth: 86,
            transition: 'color 0.3s ease',
          }}>{verdict.pattern}</div>
          <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>{verdict.reason}</div>
        </div>
        {isAsync && (
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ds-color-text-tertiary)' }}>
            Rough async shape for this run: ~{asyncSim.polls} status polls and ~{asyncSim.checkpoints} checkpoints over {asyncSim.totalWallSeconds}s of wall time.
          </p>
        )}
      </Stack>
    </Card>
  );
}

function Metric({ value, label, color }) {
  return (
    <div style={{ flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: color || 'var(--ds-color-text-primary)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function SyncAsyncAgentTab() {
  const [activeSubTab, setActiveSubTab] = useState('wait');

  const syncColumns = [
    { key: 'label', header: 'Moment', render: (v) => <strong>{v}</strong> },
    { key: 'detail', header: 'What happens', sortable: false },
  ];
  const asyncColumns = [
    { key: 'label', header: 'Stage', render: (v) => <strong>{v}</strong> },
    { key: 'detail', header: 'What happens', sortable: false },
  ];
  const infraColumns = [
    { key: 'part', header: 'Part', render: (v) => <strong>{v}</strong> },
    { key: 'role', header: 'Role', render: (v) => <span style={{ color: TEAL_DARK, fontWeight: 600 }}>{v}</span> },
    { key: 'note', header: 'Why it matters', sortable: false },
  ];
  const failureColumns = [
    { key: 'failure', header: 'Failure mode', render: (v) => <strong style={{ color: RED }}>{v}</strong> },
    { key: 'cause', header: 'Cause', sortable: false },
    { key: 'mitigation', header: 'Mitigation', sortable: false },
  ];
  const presetColumns = [
    { key: 'label', header: 'Scenario', render: (v) => <strong>{v}</strong> },
    { key: 'durationS', header: 'Duration', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace' }}>{v}s</span> },
    { key: 'toleranceS', header: 'Tolerance', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace' }}>{v}s</span> },
    { key: 'complexity', header: 'Complexity', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace' }}>{v}/5</span> },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="syncasyncagent"
        moduleLabel="Agents [Execution Patterns]"
        title="Should the Agent Answer Now, or Call You Back?"
        description="Short jobs can hold the line and answer directly. Long jobs must return a job id, work in the background, and report back. Pick wrong and the connection drops while the tokens keep burning."
        metrics={[
          { label: 'Illustrative gateway limit', value: `${SYNC_LIMIT_S}s` },
          { label: 'Example long agent run', value: `${EXAMPLE_LONG_RUN_S}s` },
          { label: 'Async lifecycle stages', value: String(ASYNC_STAGES.length) },
          { label: 'Failure modes to plan for', value: String(FAILURE_MODES.length) },
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
                borderRadius: 'var(--ds-radius-md)',
                border: activeSubTab === tab.id ? `1.5px solid ${TEAL}` : '1.5px solid transparent',
                background: activeSubTab === tab.id ? '#E3F2F2' : 'transparent',
                color: activeSubTab === tab.id ? TEAL_DARK : 'var(--ds-color-text-secondary)',
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

        {activeSubTab === 'wait' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>One request, one held breath</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                In the synchronous pattern the client opens a connection and waits. The server thread is blocked for the whole run:
                it cannot serve anyone else, and if the agent outlasts the front door, the answer has nowhere to go.
              </p>
              <SyncSequenceDiagram />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>The four moments of a dropped run</h3>
              <Table columns={syncColumns} data={SYNC_STEPS} sortable={false} />
            </Card>
            <TimeoutSimulator />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Metric value={`${SYNC_LIMIT_S}s`} label="Illustrative limit the connection survives" color={RED} />
              <Metric value={`${EXAMPLE_LONG_RUN_S}s`} label="Example agent run that outlives it" color={PURPLE} />
              <Metric value={`${EXAMPLE_LONG_RUN_S - SYNC_LIMIT_S}s`} label="Work wasted after the drop" color={RED} />
            </div>
            <Callout type="warning" title="The gateway-timeout trap">
              Synchronous serving feels simple until the first long job: the client disconnects at the limit, retries the same
              question, and pays for the abandoned run twice. Any task that can outlive the wait belongs on a job id, not a held connection.
            </Callout>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>What sync looks like in code</h3>
              <CodeBlock language="python" code={CODE_SYNC} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'fire' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Submit now, collect later</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                The asynchronous pattern splits asking from answering. The request returns instantly with a job id; a queue,
                background workers, and a state store do the slow work; the client polls the id or waits for a push.
              </p>
              <AsyncFlowDiagram />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>The five stages of a background job</h3>
              <Table columns={asyncColumns} data={ASYNC_STAGES} sortable={false} />
            </Card>
            <Callout type="tip" title="Checkpointing is the superpower">
              Because each step is saved to the state store, a crashed worker never restarts the job from scratch —
              the next worker resumes from the last checkpoint. That is what makes long agent runs survivable.
            </Callout>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>What async looks like in code</h3>
              <CodeBlock language="python" code={CODE_ASYNC} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'which' && (
          <Stack gap={6}>
            <PatternPicker />
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Five scenarios that sort themselves</h3>
              <p style={{ margin: '0 0 10px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Read each row as duration against patience, with complexity as the tiebreaker.
              </p>
              <Table columns={presetColumns} data={DECISION_PRESETS} sortable={false} />
            </Card>
            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 14, background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${PURPLE}` }}>
                <strong style={{ fontSize: 12.5, color: PURPLE, display: 'block', marginBottom: 4 }}>Hold the line when…</strong>
                <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                  The run finishes inside both the wait window and the illustrative gateway limit, and the work is only
                  a step or two. A quick answer or a short draft: answer directly.
                </div>
              </Card>
              <Card style={{ padding: 14, background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${TEAL}` }}>
                <strong style={{ fontSize: 12.5, color: TEAL_DARK, display: 'block', marginBottom: 4 }}>Hand out a job id when…</strong>
                <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                  The run outlives anyone patience, nears the gateway limit, or chains many dependent steps.
                  Research passes, nightly digests, tangled multi-step work: queue it, checkpoint it, notify on completion.
                </div>
              </Card>
            </Grid>
            <Callout type="info" title="The three-question rule">
              How long will it take? How long will anyone wait? How many steps can fail halfway? If any answer is
              uncomfortable on a held connection, go asynchronous.
            </Callout>
          </Stack>
        )}

        {activeSubTab === 'demands' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Async is a small machine, not a flag</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Moving work off the request means owning the machinery around it: somewhere durable to wait,
                someone to do the work, somewhere to record it, and a way to ask about it.
              </p>
              <Table columns={infraColumns} data={INFRA_ROWS} sortable={false} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Three ways the machine breaks</h3>
              <Table columns={failureColumns} data={FAILURE_MODES} sortable={false} />
            </Card>
            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 14, background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${TEAL}` }}>
                <strong style={{ fontSize: 12.5, color: TEAL_DARK, display: 'block', marginBottom: 4 }}>Polling vs push</strong>
                <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                  Polling is simple and robust: the client re-asks with its job id. Push is snappier but needs a channel
                  back to the client. Many teams ship polling first and add push once completions feel slow.
                </div>
              </Card>
              <Card style={{ padding: 14, background: 'var(--ds-color-bg-canvas)', borderLeft: `4px solid ${AMBER}` }}>
                <strong style={{ fontSize: 12.5, color: AMBER, display: 'block', marginBottom: 4 }}>The price of admission</strong>
                <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                  Queues, workers, stores, and status endpoints are real parts to run and watch. Never pay that price
                  for a four-second answer — save async for work that earns it.
                </div>
              </Card>
            </Grid>
            <Callout type="danger" title="Duplicate delivery will happen">
              At-least-once queues redeliver. If handling a job twice charges a card or sends a message twice, that is
              a design bug, not bad luck — key every side effect by job id so repeats collapse into one result.
            </Callout>
            <Callout type="success" title="When it clicks">
              Durable queue, independent workers, checkpointed state, one status read: long agent runs survive crashes,
              scale with backlog, and never leave a client staring at a dead connection.
            </Callout>
          </Stack>
        )}
      </Container>
    </div>
  );
}
