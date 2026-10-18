import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  TRIFECTA,
  INCIDENTS,
  PATTERNS,
  ATTACK_VECTORS,
  evaluateStack,
  RESEARCH_STACK,
  CODE_SELECTOR,
  CODE_DUAL,
  CODE_MAPREDUCE,
  DUAL_FLOW,
  DUAL_LIMITS,
  EXFIL_URL_EXAMPLE,
} from './agentGuardrailsEngine.js';

const { Container, Stack, Grid } = Primitives;

const PURPLE = '#9B89C4';
const PURPLE_DARK = '#5B4B8A';
const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const RED = '#B4553A';
const AMBER = '#B9821F';

const ACTOR_COLORS = { controller: TEAL_DARK, privileged: PURPLE_DARK, quarantined: RED };
const ACTOR_LABELS = { controller: 'controller', privileged: 'privileged LLM', quarantined: 'quarantined LLM' };

const SUBTABS = [
  { id: 'threat', icon: '⚠️', label: '1. Threat Model', desc: 'Lethal trifecta + incidents' },
  { id: 'patterns', icon: '🧱', label: '2. Six Patterns', desc: 'What each blocks, what each costs' },
  { id: 'builder', icon: '🏗️', label: '3. Stack Builder', desc: 'Toggle patterns, watch coverage' },
  { id: 'stack', icon: '🔬', label: '4. Research Agent Stack', desc: 'Patterns per pipeline stage' },
  { id: 'code', icon: '🛡️', label: '5. Code', desc: 'Gate, dual agent, map-reduce' },
  { id: 'dualflow', icon: '🔀', label: '6. Dual-LLM Flow', desc: 'Controller, privileged, quarantined' },
];

function TrifectaDiagram() {
  const circles = [
    { cx: 170, cy: 140, r: 88, fill: '#FBEAE4', stroke: RED, label: 'Reads\nuntrusted\ncontent' },
    { cx: 330, cy: 140, r: 88, fill: '#EEF3FA', stroke: '#4A6FA5', label: 'Privileged\ntools or\ndata' },
    { cx: 250, cy: 258, r: 88, fill: '#F5F3FA', stroke: PURPLE, label: 'Talks to\nuser or\nsystem' },
  ];
  return (
    <svg viewBox="0 0 500 380" width="100%" role="img"
      aria-label="Three overlapping circles: reads untrusted content, holds privileged tools or data, and can talk to a user or system — their intersection is the danger zone">
      <circle cx="250" cy="192" r="46" fill="#F1BFB2" opacity="0.85" />
      <text x="250" y="188" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#6E2E1C">DANGER</text>
      <text x="250" y="203" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#6E2E1C">ZONE</text>
      {circles.map((c) => (
        <g key={c.label}>
          <circle cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} fillOpacity="0.65" stroke={c.stroke} strokeWidth="1.6" />
          <text x={c.cx} y={c.cy - 4} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#1A1D26">
            {c.label.split('\n').map((t, i) => (
              <tspan key={i} x={c.cx} dy={i === 0 ? 0 : 15}>{t}</tspan>
            ))}
          </text>
        </g>
      ))}
      <text x="170" y="345" textAnchor="middle" fontSize="11" fill="#6B7280">1 untrusted input</text>
      <text x="330" y="345" textAnchor="middle" fontSize="11" fill="#6B7280">2 harmful capability</text>
      <text x="250" y="370" textAnchor="middle" fontSize="11" fill="#6B7280">3 channel back out</text>
    </svg>
  );
}

function StackBuilder() {
  const [active, setActive] = useState(['selector', 'dual']);
  const result = evaluateStack(active);

  const toggle = (id) =>
    setActive((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🏗️ Simulator — compose a defense stack</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Toggle architectural patterns and watch which attack vectors stay uncovered. No single pattern closes the set — the point is layering.
          </p>
        </div>

        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
          {PATTERNS.map((p) => {
            const on = active.includes(p.id);
            return (
              <button key={p.id} onClick={() => toggle(p.id)}
                style={{
                  textAlign: 'left', padding: 12, borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  border: `1.5px solid ${on ? TEAL : 'var(--ds-color-border-subtle)'}`,
                  background: on ? '#E3F2F2' : 'var(--ds-color-bg-canvas)',
                  transition: 'all var(--ds-motion-duration-base)',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 13, color: on ? TEAL_DARK : 'var(--ds-color-text-secondary)' }}>{p.name}</strong>
                  <Badge variant="default" style={{ background: on ? TEAL : '#EEF1F4', color: on ? '#FFF' : '#6B7280' }}>
                    {on ? 'ON' : 'OFF'}
                  </Badge>
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)', marginTop: 4, lineHeight: 1.5 }}>{p.oneLiner}</div>
              </button>
            );
          })}
        </Grid>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 130 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: result.criticalResidual.length === 0 ? TEAL_DARK : RED, lineHeight: 1.1 }}>
              {result.covered.length}/{ATTACK_VECTORS.length}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)', marginTop: 2 }}>attack vectors covered</div>
          </div>
          <div style={{ flex: 1, minWidth: 130 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: RED, lineHeight: 1.1 }}>{result.criticalResidual.length}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)', marginTop: 2 }}>critical vectors still open</div>
          </div>
          <div style={{ flex: 1, minWidth: 130 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--ds-color-text-primary)', lineHeight: 1.1 }}>{result.complexity}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)', marginTop: 2 }}>patterns in the stack (complexity)</div>
          </div>
          <div style={{ flex: 2, minWidth: 180 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: result.complete ? TEAL_DARK : PURPLE_DARK, marginTop: 8 }}>
              {active.length === 0 && 'No patterns selected — the agent is wide open.'}
              {active.length === 1 && 'One pattern ≠ a solution: every single pattern leaves critical vectors open.'}
              {active.length >= 2 && !result.complete && 'Partial defense — inspect the red vectors below.'}
              {result.complete && 'Layered defense — every pattern-addressable critical vector closed (sandbox limits handle the rest).'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {ATTACK_VECTORS.map((v) => {
            const covered = result.covered.some((c) => c.id === v.id);
            return (
              <Badge key={v.id} variant="default"
                style={{
                  background: covered ? '#E3F2F2' : (v.severity === 'critical' ? '#FBEAE4' : '#FFF4E5'),
                  color: covered ? TEAL_DARK : (v.severity === 'critical' ? RED : '#8A5A2B'),
                  border: `1px solid ${covered ? TEAL : (v.severity === 'critical' ? RED : '#E0B77A')}`,
                }}>
                {covered ? '✓ ' : '✗ '}{v.name}
              </Badge>
            );
          })}
        </div>

        {result.coverage < 1 && (
          <Callout type="warning" title="Sandbox escape / variable tampering stays open">
            The six patterns do not fix generated-code variable tampering — only sandbox limits do. Layering reduces surface; it never reaches zero. Stack enough patterns and every critical vector here is closed except this one, which requires its own control.
          </Callout>
        )}
      </Stack>
    </Card>
  );
}

function wrapLabel(text, max = 17) {
  const lines = [];
  let line = '';
  for (const w of text.split(' ')) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > max) { lines.push(line); line = w; } else { line = next; }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function SubstitutionDemo() {
  const [substituted, setSubstituted] = useState(false);
  const template = 'Damage report: $VAR1 — confidence $VAR2';
  const resolved = 'Damage report: scratched rear bumper — confidence 0.87';
  const shown = substituted ? resolved : template;

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>Variables stay masked until display time</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            The plan is written as $VAR slots from the start; the controller holds the bytes and performs the substitution only when rendering the final output. Toggle it and watch which layer is holding what.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Badge key={i} variant="default" style={{
              background: substituted ? (i === 4 ? '#E3F2F2' : '#EEF1F4') : (i <= 3 ? '#F5F3FA' : '#EEF1F4'),
              color: substituted ? (i === 4 ? TEAL_DARK : '#6B7280') : (i <= 3 ? PURPLE_DARK : '#6B7280'),
              border: `1px solid ${substituted ? (i === 4 ? TEAL : '#EEF1F4') : (i <= 3 ? '#C9C0E0' : '#EEF1F4')}`,
            }}>
              step {i + 1}: {i === 4 ? (substituted ? 'substituted' : 'masked') : (i === 3 ? '$VAR1 filled' : 'slots only')}
            </Badge>
          ))}
        </div>

        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: PURPLE_DARK, marginBottom: 4 }}>
            Plan + template as stored (structure from code)
          </div>
          <div style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 13, padding: '10px 12px', borderRadius: 8,
            background: '#F5F3FA', border: '1px solid #C9C0E0', color: PURPLE_DARK, wordBreak: 'break-word',
          }}>{template}</div>
        </div>

        <div>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: TEAL_DARK, marginBottom: 4 }}>
            Rendered at display time (what the human sees)
          </div>
          <div style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 13, padding: '10px 12px', borderRadius: 8,
            background: substituted ? '#E3F2F2' : '#EEF1F4',
            border: `1px solid ${substituted ? TEAL : '#EEF1F4'}`,
            color: substituted ? TEAL_DARK : '#6B7280', wordBreak: 'break-word',
          }}>{shown}</div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setSubstituted((s) => !s)}
            style={{
              padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
              border: `1px solid ${substituted ? PURPLE_DARK : TEAL}`,
              background: substituted ? PURPLE_DARK : TEAL, color: '#FFFFFF',
            }}>
            {substituted ? 'Mask again (planning time)' : 'Substitute at display time'}
          </button>
          <span style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)' }}>
            The privileged plan never held the bytes; the quarantined reader never saw the template.
          </span>
        </div>
      </Stack>
    </Card>
  );
}

function DualFlowPanel() {
  const [active, setActive] = useState(0);
  const step = DUAL_FLOW[active];
  const bw = 172, gap = 24, x0 = 12, boxY = 52, boxH = 88;
  const titles = ['Receive request', 'Plan with $VAR slots', 'Execute the tool', 'Summarize content', 'Substitute at display'];

  return (
    <Stack gap={6}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>Five steps, three actors — click a step</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              The controller is code, not a model. The privileged head plans but never touches raw data; the quarantined head reads raw data but can plan nothing.
            </p>
          </div>

          <svg viewBox="0 0 980 168" width="100%" role="img"
            aria-label="Five-step flow: the controller receives the request, a privileged LLM plans a tool call with variable slots, the controller executes the tool and stores the result, a quarantined LLM summarizes untrusted content, and the controller substitutes variables at display time">
            <defs>
              <marker id="dualArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8" />
              </marker>
            </defs>
            {DUAL_FLOW.map((s, i) => {
              const x = x0 + i * (bw + gap);
              const color = ACTOR_COLORS[s.actor];
              const isActive = i === active;
              const lines = wrapLabel(titles[i]);
              return (
                <g key={s.step} onClick={() => setActive(i)} tabIndex={0} role="button"
                  aria-label={`Step ${s.step}: ${titles[i]} by ${ACTOR_LABELS[s.actor]}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); } }}
                  style={{ cursor: 'pointer' }}>
                  <rect x={x + 8} y={14} width={bw - 16} height={22} rx="11" fill={color} />
                  <text x={x + bw / 2} y={29} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#FFFFFF">
                    {ACTOR_LABELS[s.actor]}
                  </text>
                  <rect x={x} y={boxY} width={bw} height={boxH} rx="10"
                    fill={isActive ? '#F7F6FA' : '#FFFFFF'} stroke={color}
                    strokeWidth={isActive ? 2.4 : 1.4} />
                  <text x={x + 12} y={boxY + 22} fontSize="11" fontWeight="700" fill={color}>STEP {s.step}</text>
                  {lines.map((ln, li) => (
                    <text key={li} x={x + 12} y={boxY + 44 + li * 16} fontSize="12.5"
                      fontWeight={isActive ? 700 : 600} fill="#1A1D26">{ln}</text>
                  ))}
                  {i < DUAL_FLOW.length - 1 && (
                    <path d={`M ${x + bw + 4} ${boxY + boxH / 2} L ${x + bw + gap - 8} ${boxY + boxH / 2}`}
                      stroke="#94A3B8" strokeWidth="1.6" markerEnd="url(#dualArrow)" />
                  )}
                </g>
              );
            })}
          </svg>

          <div style={{
            padding: 'var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)',
            background: 'var(--ds-color-bg-canvas)', border: `1px solid var(--ds-color-border-subtle)`,
            borderLeft: `4px solid ${ACTOR_COLORS[step.actor]}`,
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
              <Badge variant="default" style={{ background: ACTOR_COLORS[step.actor], color: '#FFFFFF' }}>
                step {step.step} · {ACTOR_LABELS[step.actor]}
              </Badge>
              <strong style={{ fontSize: 13 }}>{step.action}</strong>
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--ds-color-text-secondary)' }}>
              <strong style={{ color: 'var(--ds-color-text-primary)' }}>Sees: </strong>{step.sees}
            </div>
          </div>

          <Callout type="info" title="Who is allowed to be wrong">
            The privileged head is the only one that can act, so it is the only one that must never see attacker text; the quarantined head sees nothing but attacker text, so it is the only one that can be fully confused. The controller — plain code — owns the boundary between them.
          </Callout>
        </Stack>
      </Card>

      <SubstitutionDemo />

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <h3 style={{ margin: '0 0 4px 0' }}>What the split does not buy you</h3>
        <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
          Three limits worth writing down before someone treats the pattern as a shield.
        </p>
        <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-3)">
          {DUAL_LIMITS.map((l) => (
            <div key={l.limit} style={{
              padding: 'var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)',
              border: `1.5px solid ${AMBER}`, background: '#FFFDF7',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: RED, marginBottom: 6 }}>{l.limit}</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.65, color: 'var(--ds-color-text-secondary)' }}>{l.detail}</div>
              <div style={{ fontSize: 11.5, lineHeight: 1.65, marginTop: 8, paddingTop: 8, borderTop: '1px solid #F0E2C4' }}>
                <strong style={{ color: TEAL_DARK }}>Mitigation: </strong>
                <span style={{ color: 'var(--ds-color-text-secondary)' }}>{l.mitigation}</span>
              </div>
            </div>
          ))}
        </Grid>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <div>
            <h3 style={{ margin: 0 }}>{EXFIL_URL_EXAMPLE.title}</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              {EXFIL_URL_EXAMPLE.detail}
            </p>
          </div>
          <div style={{
            fontFamily: 'ui-monospace, monospace', fontSize: 13, padding: '10px 12px', borderRadius: 8,
            background: '#FBEAE4', border: `1px solid ${RED}`, color: RED, wordBreak: 'break-all',
          }}>{EXFIL_URL_EXAMPLE.request}</div>
          <Callout type="warning" title="Opaque to the plan, still a leak">
            {EXFIL_URL_EXAMPLE.blindSpot} {EXFIL_URL_EXAMPLE.mitigation}
          </Callout>
        </Stack>
      </Card>
    </Stack>
  );
}

export default function AgentGuardrailsTab() {
  const [activeSubTab, setActiveSubTab] = useState('threat');

  const trifectaColumns = [
    { key: 'title', header: 'Condition', render: (v) => <strong style={{ color: RED }}>{v}</strong> },
    { key: 'detail', header: 'What it means', sortable: false },
  ];

  const incidentColumns = [
    { key: 'title', header: 'What happened (generic pattern)', sortable: false },
    { key: 'channel', header: 'Abused channel', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: PURPLE_DARK }}>{v}</span> },
    { key: 'lesson', header: 'Lesson', sortable: false },
  ];

  const patternColumns = [
    { key: 'name', header: 'Pattern', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
    { key: 'oneLiner', header: 'Mechanism', sortable: false },
    { key: 'blocks', header: 'Blocks', render: (v) => (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {v.map((b) => (
          <Badge key={b} variant="default" style={{ background: '#E3F2F2', color: TEAL_DARK, fontSize: 10 }}>
            {ATTACK_VECTORS.find((x) => x.id === b)?.name.split(' (')[0] || b}
          </Badge>
        ))}
      </div>
    ) },
    { key: 'drawback', header: 'Trade-off', sortable: false },
  ];

  const stackColumns = [
    { key: 'stage', header: 'Pipeline stage', render: (v) => <strong>{v}</strong> },
    { key: 'pattern', header: 'Applied pattern', render: (v) => <span style={{ color: PURPLE_DARK, fontWeight: 600 }}>{v}</span> },
    { key: 'why', header: 'Why there', sortable: false },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="guardrails"
        moduleLabel="Production & Security [Agent Safety]"
        title="Architectural Guardrails: Design the Threat Out of the Agent"
        description="Permissions and warning banners do not stop an attacker who can write into the agent's context. These six architectural patterns change what is structurally possible — isolating untrusted reads, freezing plans before content is seen, gating every action, and keeping privileged and quarantined work in separate heads."
        metrics={[
          { label: 'Conditions for the lethal trifecta', value: '3' },
          { label: 'Architectural patterns', value: '6' },
          { label: 'Modeled attack vectors', value: '10' },
          { label: 'Patterns that close the set alone', value: '0' },
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

        {activeSubTab === 'threat' && (
          <Stack gap={6}>
            <Grid columns={{ base: '1fr', md: '500px 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 4px 0' }}>The lethal trifecta</h3>
                <p style={{ margin: '0 0 8px 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)' }}>
                  Danger appears where all three conditions meet — that intersection is where indirect injection becomes a breach.
                </p>
                <TrifectaDiagram />
              </Card>
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 4px 0' }}>Direct vs indirect injection</h3>
                <p style={{ margin: '0 0 10px 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                  <strong>Direct:</strong> the user tries to override the system prompt. Caught by filters, easy to block, and the user is usually not the enemy.
                  <br />
                  <strong>Indirect:</strong> the instructions live in content the agent went out to read — a web page, a PDF, a ticket comment. The user does nothing wrong; the agent does exactly what it was told, by someone else.
                  <br /><br />
                  Defense starts by distrusting user-supplied uploads and permissions (restrict who can place content in front of the agent, limit what they can upload, train them on odd requests) — but the user is the weakest link, so the system must assume breach and design it out.
                </p>
                <Callout type="danger" title="Assume the prompt will be compromised">
                  Everything below is architectural: it holds even when the model is fully convinced by attacker text. If a control depends on the model “not following” malicious instructions, it is not a control.
                </Callout>
              </Card>
            </Grid>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Generic incident patterns</h3>
              <Table columns={incidentColumns} data={INCIDENTS} sortable={false} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'patterns' && (
          <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
            <h3 style={{ margin: '0 0 4px 0' }}>Six patterns, six trade-offs</h3>
            <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Each pattern shrinks the attack surface and costs something — flexibility, latency, or complexity. That cost is the price of the defense, and it is why they combine.
            </p>
            <Table columns={patternColumns} data={PATTERNS} sortable={false} />
          </Card>
        )}

        {activeSubTab === 'builder' && <StackBuilder />}

        {activeSubTab === 'stack' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>A research agent, pattern by pattern</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                One pattern per stage: untrusted reads are isolated, extraction is tool-less, plans freeze before content is seen, actions pass a deterministic gate, and the final response sheds carried intent.
              </p>
              <Table columns={stackColumns} data={RESEARCH_STACK} sortable={false} />
            </Card>
            <Callout type="tip" title="Layering is the design">
              Any single row can fail — a missed whitelist entry, a boundary that leaks, a template that escapes. Stacked, a failure in one stage does not unlock the trifecta: the reader still has no tools, the plan still fixes recipients, the gate still rejects unknown actions.
            </Callout>
          </Stack>
        )}

        {activeSubTab === 'code' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>1 · Action selector — the deterministic gate</h3>
              <CodeBlock language="python" code={CODE_SELECTOR} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>2 · Dual agent — quarantine the reader</h3>
              <CodeBlock language="python" code={CODE_DUAL} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>3 · Map-reduce — one source, one context</h3>
              <CodeBlock language="python" code={CODE_MAPREDUCE} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'dualflow' && <DualFlowPanel />}
      </Container>
    </div>
  );
}
