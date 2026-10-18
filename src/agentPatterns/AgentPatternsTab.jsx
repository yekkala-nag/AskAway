import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  PATTERNS,
  CONTEXT_TECHNIQUES,
  TRAJECTORY_METRICS,
  PATTERNS_CODE,
  MAX_ITERATIONS,
  pickPattern,
  circuitBreaker,
  loopCost,
} from './patternsEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'shapes', icon: '🧩', label: '1. Six Patterns', desc: 'Beyond the naive loop' },
  { id: 'picker', icon: '🧭', label: '2. Pattern Picker', desc: 'Profile → shape' },
  { id: 'context', icon: '🧠', label: '3. Context Engineering', desc: 'The hidden success criterion' },
  { id: 'trajectory', icon: '📈', label: '4. Trajectory & Breakers', desc: 'Where runs actually fail' },
];

const DIAGRAM_META = {
  react: { shape: 'loop', labels: ['Reason', 'Act', 'Observe'], caption: 'One cycle at a time; stop when the answer is good enough' },
  sequential: { shape: 'line', labels: ['Researcher', 'Analyst', 'Writer', 'Brief'], caption: 'State narrows at every hop — each stage sees its projection only' },
  router: { shape: 'tree', labels: ['Classify intent', 'Branch: research', 'Branch: compose', 'Branch: compare'], caption: 'Mixed intent can dispatch two branches in parallel' },
  supervisor: { shape: 'star', hub: ['Supervisor', '+ task ledger'], labels: ['W1', 'W2', 'W3', 'W4'], caption: 'Workers hold local context; only the supervisor reads the whole ledger' },
  reflection: { shape: 'loop', labels: ['Generate', 'Criticise', 'Revise'], caption: 'Capped attempts — stop after a fixed number of rounds' },
  swarm: { shape: 'star', hub: ['Topic', 'event bus'], labels: ['A1', 'A2', 'A3', 'A4'], caption: 'No central coordinator; structured messages are the shared context' },
};

const TECH_ICONS = ['🧩', '🗜️', '🧾', '🧭', '💰'];

const FLAGS = [
  { key: 'knownSteps', label: 'Known steps', icon: '📐', hint: 'The pipeline is decided upfront' },
  { key: 'mixedIntent', label: 'Mixed intent', icon: '🎭', hint: 'One query asks for several things' },
  { key: 'parallelizable', label: 'Parallelizable', icon: '⚡', hint: 'Subtasks can run independently' },
  { key: 'openEnded', label: 'Open-ended', icon: '🔭', hint: 'The path is unknown until explored' },
  { key: 'highStakes', label: 'High stakes', icon: '🎯', hint: 'A wrong output has real cost' },
];

const TOOL_POOL = ['search_docs', 'read_file', 'summarize', 'write_answer'];
const STATIC_TOKENS = 1200;

function FlowDiagram({ pattern }) {
  const meta = DIAGRAM_META[pattern.id] || DIAGRAM_META.react;
  const aria = pattern.name + ' data-flow diagram';
  const defs = (
    <defs>
      <marker id="ap-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill={TEAL_DARK} />
      </marker>
    </defs>
  );

  if (meta.shape === 'loop') {
    const [a, b, c] = meta.labels;
    const circle = (cx, cy, label) => (
      <g key={label}>
        <circle cx={cx} cy={cy} r="40" fill="#E3F2F2" stroke={TEAL_DARK} strokeWidth="2" />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={TEAL_DARK}>{label}</text>
      </g>
    );
    return (
      <svg viewBox="0 0 460 200" width="100%" role="img" aria-label={aria} style={{ display: 'block' }}>
        {defs}
        <line x1="172" y1="50" x2="288" y2="50" stroke={TEAL_DARK} strokeWidth="2" markerEnd="url(#ap-arrow)" />
        <path d="M299,75 L262,105" stroke={TEAL_DARK} strokeWidth="2" fill="none" markerEnd="url(#ap-arrow)" />
        <path d="M199,105 L161,75" stroke={TEAL_DARK} strokeWidth="2" fill="none" markerEnd="url(#ap-arrow)" />
        {circle(130, 50, a)}
        {circle(330, 50, b)}
        {circle(230, 130, c)}
        <text x="230" y="192" textAnchor="middle" fontSize="11" fill="var(--ds-color-text-secondary)">{meta.caption}</text>
      </svg>
    );
  }

  if (meta.shape === 'line') {
    const xs = [8, 125, 242, 359];
    return (
      <svg viewBox="0 0 460 130" width="100%" role="img" aria-label={aria} style={{ display: 'block' }}>
        {defs}
        {xs.map((x, i) => (
          <g key={i}>
            <rect x={x} y="30" width="95" height="44" rx="9" fill="#E3F2F2" stroke={TEAL_DARK} strokeWidth="2" />
            <text x={x + 47} y="56" textAnchor="middle" fontSize="11" fontWeight="700" fill={TEAL_DARK}>{meta.labels[i]}</text>
          </g>
        ))}
        {[[105, 121], [222, 238], [339, 355]].map(([x1, x2], i) => (
          <line key={i} x1={x1} y1="52" x2={x2} y2="52" stroke={TEAL_DARK} strokeWidth="2" markerEnd="url(#ap-arrow)" />
        ))}
        <text x="230" y="115" textAnchor="middle" fontSize="11" fill="var(--ds-color-text-secondary)">{meta.caption}</text>
      </svg>
    );
  }

  if (meta.shape === 'tree') {
    const ys = [12, 58, 104];
    return (
      <svg viewBox="0 0 460 165" width="100%" role="img" aria-label={aria} style={{ display: 'block' }}>
        {defs}
        {ys.map((y, i) => (
          <line key={i} x1="123" y1="75" x2="245" y2={y + 17} stroke={TEAL_DARK} strokeWidth="2" markerEnd="url(#ap-arrow)" />
        ))}
        <rect x="8" y="55" width="115" height="40" rx="9" fill="#E3F2F2" stroke={TEAL_DARK} strokeWidth="2" />
        <text x="65" y="79" textAnchor="middle" fontSize="11" fontWeight="700" fill={TEAL_DARK}>{meta.labels[0]}</text>
        {ys.map((y, i) => (
          <g key={i}>
            <rect x="245" y={y} width="205" height="34" rx="8" fill="var(--ds-color-bg-surfaceHover)" stroke={TEAL} strokeWidth="1.5" />
            <text x="347" y={y + 21} textAnchor="middle" fontSize="11" fontWeight="600" fill={TEAL_DARK}>{meta.labels[i + 1]}</text>
          </g>
        ))}
        <text x="230" y="157" textAnchor="middle" fontSize="11" fill="var(--ds-color-text-secondary)">{meta.caption}</text>
      </svg>
    );
  }

  const [hubA, hubB] = meta.hub;
  const workers = [
    { x: 65, y: 35 },
    { x: 395, y: 35 },
    { x: 65, y: 125 },
    { x: 395, y: 125 },
  ];
  return (
    <svg viewBox="0 0 460 185" width="100%" role="img" aria-label={aria} style={{ display: 'block' }}>
      {workers.map((w, i) => (
        <line key={i} x1="230" y1="80" x2={w.x} y2={w.y} stroke={TEAL} strokeWidth="1.5" />
      ))}
      {workers.map((w, i) => (
        <g key={i}>
          <circle cx={w.x} cy={w.y} r="30" fill="#E3F2F2" stroke={TEAL_DARK} strokeWidth="2" />
          <text x={w.x} y={w.y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={TEAL_DARK}>{meta.labels[i]}</text>
        </g>
      ))}
      <circle cx="230" cy="80" r="44" fill={PURPLE} stroke={PURPLE} strokeWidth="2" />
      <text x="230" y="76" textAnchor="middle" fontSize="12" fontWeight="700" fill="#FFFFFF">{hubA}</text>
      <text x="230" y="92" textAnchor="middle" fontSize="10" fill="#E8E4F5">{hubB}</text>
      <text x="230" y="177" textAnchor="middle" fontSize="11" fill="var(--ds-color-text-secondary)">{meta.caption}</text>
    </svg>
  );
}

function SixPatternsSubtab() {
  const [activeId, setActiveId] = useState('react');
  const active = PATTERNS.find((p) => p.id === activeId) || PATTERNS[0];

  const columns = [
    { key: 'n', header: '#', render: (v) => <strong style={{ color: TEAL_DARK, fontFamily: 'ui-monospace, monospace' }}>{v}</strong> },
    { key: 'name', header: 'Pattern', render: (v, row) => <strong>{row.icon} {v}</strong> },
    { key: 'useWhen', header: 'Use when', sortable: false },
    { key: 'avoidWhen', header: 'Avoid when', sortable: false },
  ];

  return (
    <Stack gap="lg">
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>Six production architectures — pick one to inspect</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              A single reason → act → observe loop is the starting point, not the destination. Each shape below trades flexibility for latency, cost or predictability.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PATTERNS.map((p) => {
              const on = activeId === p.id;
              return (
                <button key={p.id} onClick={() => setActiveId(p.id)} aria-pressed={on}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderRadius: 999,
                    cursor: 'pointer', fontSize: 13.5,
                    border: `1.5px solid ${on ? TEAL_DARK : 'var(--ds-color-border-subtle)'}`,
                    background: on ? '#E3F2F2' : 'var(--ds-color-bg-surface)',
                    color: on ? TEAL_DARK : 'var(--ds-color-text-secondary)',
                    fontWeight: on ? 700 : 500, transition: 'all .2s',
                  }}>
                  <span>{p.icon}</span>
                  <span>{p.n}. {p.name}</span>
                </button>
              );
            })}
          </div>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 26, lineHeight: 1 }}>{active.icon}</span>
            <h3 style={{ margin: 0 }}>Pattern {active.n} — {active.name}</h3>
            <Badge variant="default" size="sm">{DIAGRAM_META[active.id].shape} topology</Badge>
          </div>
          <p style={{ margin: 0, fontSize: 'var(--ds-font-size-body)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
            {active.how}
          </p>
          <Grid columns={2} gap="var(--ds-space-4)">
            <div style={{ padding: 14, borderRadius: 12, background: 'var(--ds-color-bg-surfaceHover)', border: '1px solid var(--ds-color-border-subtle)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', color: TEAL_DARK, marginBottom: 8 }}>PROS</div>
              {active.pros.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>
                  <span style={{ color: TEAL_DARK, fontWeight: 800 }}>+</span><span>{t}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: 14, borderRadius: 12, background: 'var(--ds-color-bg-surfaceHover)', border: '1px solid var(--ds-color-border-subtle)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', color: RED, marginBottom: 8 }}>CONS</div>
              {active.cons.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6, marginBottom: 6 }}>
                  <span style={{ color: RED, fontWeight: 800 }}>−</span><span>{t}</span>
                </div>
              ))}
            </div>
          </Grid>
          <div style={{ padding: 16, borderRadius: 12, border: '1px solid var(--ds-color-border-subtle)', background: 'var(--ds-color-bg-surfaceHover)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', color: 'var(--ds-color-text-tertiary)', marginBottom: 6 }}>
              DATA FLOW
            </div>
            <FlowDiagram pattern={active} />
          </div>
          <Callout type="tip" title="Context note">{active.contextTip}</Callout>
          <Grid columns={2} gap="var(--ds-space-4)">
            <Callout type="success" title="Use it when">{active.useWhen}</Callout>
            <Callout type="warning" title="Avoid it when">{active.avoidWhen}</Callout>
          </Grid>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>All six at a glance</h3>
        <Table columns={columns} data={PATTERNS} sortable={false} />
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <h3 style={{ margin: '0 0 4px 0' }}>The supervisor loop, in pseudocode</h3>
        <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
          Plan once, delegate with local context only, keep a ledger, honor the iteration cap, synthesize a single answer.
        </p>
        <CodeBlock language="python" filename="supervisor_loop.py" code={PATTERNS_CODE} />
      </Card>
    </Stack>
  );
}

function PatternPickerSubtab() {
  const [flags, setFlags] = useState({
    knownSteps: false,
    mixedIntent: false,
    parallelizable: false,
    openEnded: false,
    highStakes: false,
  });
  const rec = useMemo(() => pickPattern(flags), [flags]);
  const activeFlags = FLAGS.filter((f) => flags[f.key]);

  const toggle = (key) => setFlags((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Stack gap="lg">
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🧭 Describe the job, get the shape</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Toggle what is true about your task. The rules are deterministic — the same profile always maps to the same recommendation.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FLAGS.map((f) => {
              const on = flags[f.key];
              return (
                <button key={f.key} onClick={() => toggle(f.key)} aria-pressed={on}
                  style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left',
                    padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    border: `1.5px solid ${on ? TEAL_DARK : 'var(--ds-color-border-subtle)'}`,
                    background: on ? '#EAF4F4' : 'var(--ds-color-bg-surface)', transition: 'all .2s',
                  }}>
                  <span style={{
                    marginTop: 2, width: 34, height: 20, borderRadius: 999, flexShrink: 0,
                    background: on ? TEAL_DARK : '#CBD5E1', position: 'relative', transition: 'background .2s',
                  }}>
                    <span style={{
                      position: 'absolute', top: 2, left: on ? 16 : 2, width: 16, height: 16,
                      borderRadius: '50%', background: 'var(--ds-color-bg-surface)',
                      transition: 'left .2s', boxShadow: '0 1px 2px rgba(0,0,0,.25)',
                    }} />
                  </span>
                  <span>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ds-color-text-primary)' }}>{f.icon} {f.label}</span>
                    <span style={{ display: 'block', fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>{f.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>PROFILE:</span>
            {activeFlags.length === 0
              ? <Badge variant="default" size="sm">no constraints — default shape</Badge>
              : activeFlags.map((f) => <Badge key={f.key} variant="primary" size="sm">{f.label}</Badge>)}
          </div>
        </Stack>
      </Card>

      <Stack gap={4}>
        <h3 style={{ margin: 0 }}>Recommended: {rec.patterns.length} pattern{rec.patterns.length === 1 ? '' : 's'}</h3>
        {rec.patterns.map((id) => {
          const p = PATTERNS.find((x) => x.id === id);
          if (!p) return null;
          return (
            <Card key={id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 24, lineHeight: 1.1 }}>{p.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                    <strong style={{ fontSize: 14.5, color: 'var(--ds-color-text-primary)' }}>{p.name}</strong>
                    <Badge variant="success" size="sm">recommended</Badge>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.65 }}>{rec.reasons[id]}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-tertiary)', marginTop: 6, lineHeight: 1.6 }}>
                    <strong style={{ color: AMBER }}>Watch out:</strong> {p.avoidWhen}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </Stack>

      <Callout type="info" title="Recommendations compose">
        High stakes returns both a reflection loop and a supervisor: one produces and critiques, the other enforces the attempt cap and keeps the ledger. A mixed-intent query that is also open-ended should route first and loop inside each branch.
      </Callout>
    </Stack>
  );
}

function ContextEngineeringSubtab() {
  const [iterations, setIterations] = useState(6);
  const [obsTokens, setObsTokens] = useState(800);
  const cost = useMemo(() => loopCost(iterations, STATIC_TOKENS, obsTokens), [iterations, obsTokens]);
  const cachedWidth = cost.uncached > 0 ? Math.max((cost.cached / cost.uncached) * 100, 2) : 2;

  return (
    <Stack gap="lg">
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>The hidden success criterion: what each step is allowed to see</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-body)', lineHeight: 1.7 }}>
              Two runs of the same pattern differ by an order of magnitude in cost and quality depending on context handling. These five techniques decide
              whether an agent drowns in its own transcript or stays focused.
            </p>
          </div>
          <Grid columns={2} gap="var(--ds-space-4)">
            {CONTEXT_TECHNIQUES.map((t, i) => (
              <Card key={t.name} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{TECH_ICONS[i]}</span>
                  <strong style={{ fontSize: 14, color: 'var(--ds-color-text-primary)' }}>{i + 1}. {t.name}</strong>
                </div>
                <Badge variant="primary" size="sm">{t.saving}</Badge>
                <p style={{ margin: '8px 0 0 0', fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.65 }}>{t.detail}</p>
              </Card>
            ))}
          </Grid>
          <Callout type="info" title="Human-in-the-loop is a context technique too">
            Pause the run, serialize the state, let a person approve it, then resume from that snapshot. The agent never re-derives what already happened — and the approval itself becomes structured context.
          </Callout>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>💰 Loop-cost simulator — what caching actually saves</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              A loop of N cycles resends the context every turn. With no caching the static prefix of {STATIC_TOKENS.toLocaleString()} tokens (system prompt + tool schemas) is paid N times and the
              observations pile up quadratically; with caching you pay it once and only append what is new.
            </p>
          </div>
          <Grid columns={2} gap="var(--ds-space-5)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>
                Loop iterations (N): <span style={{ fontFamily: 'ui-monospace, monospace', color: TEAL_DARK }}>{iterations}</span>
                <input type="range" min={1} max={12} step={1} value={iterations}
                  onChange={(e) => setIterations(parseInt(e.target.value, 10))}
                  style={{ display: 'block', width: '100%', accentColor: TEAL_DARK, cursor: 'pointer' }} aria-label="Loop iterations" />
              </label>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>
                Tokens per observation (O): <span style={{ fontFamily: 'ui-monospace, monospace', color: TEAL_DARK }}>{obsTokens.toLocaleString()}</span>
                <input type="range" min={200} max={3000} step={100} value={obsTokens}
                  onChange={(e) => setObsTokens(parseInt(e.target.value, 10))}
                  style={{ display: 'block', width: '100%', accentColor: TEAL_DARK, cursor: 'pointer' }} aria-label="Observation tokens" />
              </label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[[3, 400], [6, 800], [10, 2000]].map(([n, o], i) => (
                  <button key={i} onClick={() => { setIterations(n); setObsTokens(o); }}
                    style={{ fontSize: 11.5, padding: '4px 10px', borderRadius: 999, cursor: 'pointer', border: '1px solid var(--ds-color-border-default)', background: 'transparent', color: 'var(--ds-color-text-secondary)' }}>
                    N={n}, O={o}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16, borderRadius: 12, border: '1px solid var(--ds-color-border-subtle)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>TOTAL INPUT TOKENS ACROSS THE RUN</span>
                <Badge variant="success" size="sm">{cost.pct}% fewer</Badge>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>No caching — resend everything</span>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 15, fontWeight: 800, color: RED }}>{cost.uncached.toLocaleString()}</span>
                </div>
                <div style={{ height: 20, borderRadius: 6, background: '#EEF1F4', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: RED }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>Prompt caching — pay once, append only</span>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 15, fontWeight: 800, color: TEAL_DARK }}>{cost.cached.toLocaleString()}</span>
                </div>
                <div style={{ height: 20, borderRadius: 6, background: '#EEF1F4', overflow: 'hidden' }}>
                  <div style={{ width: `${cachedWidth}%`, height: '100%', background: TEAL, transition: 'width .3s' }} />
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--ds-color-text-tertiary)', lineHeight: 1.6, fontFamily: 'ui-monospace, monospace' }}>
                no cache = N×S + O×N(N+1)/2 = {cost.uncached.toLocaleString()}
                <br />
                cached = S + N×O = {cost.cached.toLocaleString()}
              </div>
            </div>
          </Grid>
          <Callout type="warning" title="Caching is a layout rule, not a switch">
            The static system prompt and tool schemas must sit at the very top and change never. If a timestamp or a rotating snippet lands in the prefix, every iteration misses the cache and the bill returns to the red bar.
          </Callout>
        </Stack>
      </Card>
    </Stack>
  );
}

function TrajectorySubtab() {
  const [calls, setCalls] = useState([]);
  const iterations = calls.length;
  const breaker = circuitBreaker(iterations, calls);
  const metricColors = [TEAL_DARK, PURPLE, AMBER];
  const capPct = Math.min((iterations / MAX_ITERATIONS) * 100, 100);

  const runSame = () => setCalls((prev) => [...prev, prev[prev.length - 1] || TOOL_POOL[0]]);
  const runDifferent = () => setCalls((prev) => {
    const last = prev[prev.length - 1];
    const idx = TOOL_POOL.findIndex((t) => t === last);
    return [...prev, TOOL_POOL[(idx + 1) % TOOL_POOL.length]];
  });
  const reset = () => setCalls([]);

  const recent = calls.slice(-6);
  const streak = breaker.trip && calls.length >= 3 ? 3 : 0;

  return (
    <Stack gap="lg">
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>Three metrics that show WHERE the agent failed</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              A final-answer score says the run was wrong. These say which stage broke — tool choice, argument format, or the loop itself.
            </p>
          </div>
          <Grid columns={3} gap="var(--ds-space-4)">
            {TRAJECTORY_METRICS.map((m, i) => (
              <Card key={m.metric} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', color: metricColors[i], marginBottom: 6 }}>
                  METRIC {i + 1}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ds-color-text-primary)', marginBottom: 8 }}>{m.metric}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--ds-color-text-primary)' }}>Catches:</strong> {m.whatItCatches}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6, marginTop: 6 }}>
                  <strong style={{ color: metricColors[i] }}>Spike means:</strong> {m.spikeMeans}
                </div>
              </Card>
            ))}
          </Grid>
          <Callout type="danger" title="Final-answer metrics alone are blind">
            Accuracy and score tell you the output was wrong but never where. Track tool-selection accuracy, schema compliance and iteration trends over the trajectory — a drop in any one localizes the failure to a stage you can actually fix.
          </Callout>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>⚡ Circuit-breaker simulator</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Click the same tool call three times in a row and watch the breaker trip. Distinct calls never trip it. Two guards run together: a repetition detector and a hard iteration cap of {MAX_ITERATIONS}.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={runSame}
              style={{
                padding: '10px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13.5, fontWeight: 700,
                border: `1.5px solid ${breaker.trip ? RED : AMBER}`, background: breaker.trip ? '#FDECEC' : '#FCF3DC',
                color: breaker.trip ? RED : AMBER, transition: 'all .2s',
              }}>
              🔁 Run tool call (same again)
            </button>
            <button onClick={runDifferent}
              style={{
                padding: '10px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13.5, fontWeight: 700,
                border: '1.5px solid var(--ds-color-border-default)', background: 'var(--ds-color-bg-surface)',
                color: 'var(--ds-color-text-secondary)', transition: 'all .2s',
              }}>
              🔀 Run a different tool
            </button>
            <button onClick={reset}
              style={{
                padding: '10px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13.5, fontWeight: 700,
                border: '1.5px solid var(--ds-color-border-default)', background: 'transparent',
                color: 'var(--ds-color-text-tertiary)', transition: 'all .2s',
              }}>
              ↺ Reset run
            </button>
          </div>

          <Grid columns={2} gap="var(--ds-space-4)">
            <div style={{ padding: 14, borderRadius: 12, background: 'var(--ds-color-bg-surfaceHover)', border: '1px solid var(--ds-color-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', color: 'var(--ds-color-text-tertiary)' }}>CALL LOG</span>
                <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: 'var(--ds-color-text-secondary)' }}>
                  iteration {iterations} / {MAX_ITERATIONS}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 28, alignItems: 'center' }}>
                {recent.length === 0
                  ? <span style={{ fontSize: 12.5, color: 'var(--ds-color-text-tertiary)' }}>No calls yet — run one to start the loop.</span>
                  : recent.map((c, i) => {
                    const absoluteIdx = calls.length - recent.length + i;
                    const inStreak = streak > 0 && absoluteIdx >= calls.length - streak;
                    return (
                      <Badge key={absoluteIdx} variant={inStreak ? 'danger' : 'default'} size="sm">
                        {absoluteIdx + 1}. {c}
                      </Badge>
                    );
                  })}
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ds-color-text-tertiary)', marginBottom: 4 }}>
                  <span>iteration cap</span><span>{iterations}/{MAX_ITERATIONS}</span>
                </div>
                <div style={{ height: 8, borderRadius: 5, background: '#EEF1F4', overflow: 'hidden' }}>
                  <div style={{ width: `${capPct}%`, height: '100%', background: iterations >= MAX_ITERATIONS ? RED : TEAL, transition: 'width .3s, background .3s' }} />
                </div>
              </div>
            </div>

            <div style={{
              padding: 14, borderRadius: 12, textAlign: 'center',
              border: `2px solid ${breaker.trip ? RED : TEAL_DARK}`,
              background: breaker.trip ? '#FDECEC' : 'var(--ds-color-bg-surfaceHover)',
              transition: 'all .3s', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6,
            }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', color: 'var(--ds-color-text-secondary)' }}>BREAKER</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: breaker.trip ? RED : TEAL_DARK, transition: 'color .3s' }}>
                {breaker.trip ? '⚠️ TRIPPED' : '✓ CLEAR'}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
                {breaker.trip ? breaker.reason : 'No repetition streak and the iteration cap is not reached. The loop may continue.'}
              </div>
            </div>
          </Grid>

          {breaker.trip
            ? (
              <Callout type="danger" title="Warning injection, not a crash">
                Tripping does not kill the run: the breaker writes a warning into the scratchpad where the next cycle reads state — for example “the same tool ran three times in a row, pick a
                different tool or answer from what you already have.” A repetition warning forces a new tool or ends the loop with a partial answer; the cap warning pushes the agent toward a
                final answer instead of iteration {iterations + 1}.
              </Callout>
            )
            : (
              <Callout type="tip" title="Try the trip on purpose">
                Press the amber button three times: three identical consecutive calls trip the repetition breaker at exactly 3. Then reset and alternate the two buttons — distinct calls keep
                the breaker clear no matter how long the run gets, until the iteration cap intervenes.
              </Callout>
            )}
        </Stack>
      </Card>
    </Stack>
  );
}

export default function AgentPatternsTab() {
  const [activeSubTab, setActiveSubTab] = useState('shapes');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="agents"
        moduleLabel="Agents & Orchestration"
        title="Agent Architecture Patterns"
        description="A single reason → act → observe loop is only the first shape. Six production architectures — pipelines, routers, supervisors, reflection loops and swarms — each trade flexibility for latency, cost or predictability. What separates a demo from a system is usually context engineering, trajectory metrics and circuit breakers."
        metrics={[
          { label: 'Production patterns', value: '6' },
          { label: 'Context techniques', value: '5' },
          { label: 'Trajectory metrics', value: '3' },
          { label: 'Identical calls before a trip', value: '3' },
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

        {activeSubTab === 'shapes' && <SixPatternsSubtab />}
        {activeSubTab === 'picker' && <PatternPickerSubtab />}
        {activeSubTab === 'context' && <ContextEngineeringSubtab />}
        {activeSubTab === 'trajectory' && <TrajectorySubtab />}
      </Container>
    </div>
  );
}
