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
} from './agentGuardrailsEngine.js';

const { Container, Stack, Grid } = Primitives;

const PURPLE = '#9B89C4';
const PURPLE_DARK = '#5B4B8A';
const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const RED = '#B4553A';

const SUBTABS = [
  { id: 'threat', icon: '⚠️', label: '1. Threat Model', desc: 'Lethal trifecta + incidents' },
  { id: 'patterns', icon: '🧱', label: '2. Six Patterns', desc: 'What each blocks, what each costs' },
  { id: 'builder', icon: '🏗️', label: '3. Stack Builder', desc: 'Toggle patterns, watch coverage' },
  { id: 'stack', icon: '🔬', label: '4. Research Agent Stack', desc: 'Patterns per pipeline stage' },
  { id: 'code', icon: '🛡️', label: '5. Code', desc: 'Gate, dual agent, map-reduce' },
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
      </Container>
    </div>
  );
}
