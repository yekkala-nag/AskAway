import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  PLANES,
  FAILURE_EXAMPLE,
  NINE_STEPS,
  TIERS,
  evaluateTier,
  APPROVAL_FIELDS,
  AUDIT_EVENTS,
  UNTRUSTED_DEFENSES,
  EVALS,
  CODE_PROPOSAL,
  CODE_STATEMACHINE,
  FLEET_SPRAWL,
  FLEET_PILLARS,
  FLEET_COST_TABLE,
  GLOBAL_POLICIES,
  ROUTER_TIERS,
  routeFleetTask,
  BUDGET_THRESHOLDS,
  evaluateFleetBudget,
  TRACE_FIELDS,
  FLEET_TRACE_SAMPLE,
} from './agentControlPlaneEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'planes', icon: '🛬', label: '1. Three Planes', desc: 'Capability vs authority' },
  { id: 'steps', icon: '🧭', label: '2. The Nine Steps', desc: 'Build the control plane' },
  { id: 'tier', icon: '🎚️', label: '3. Tier Simulator', desc: 'Consequence → control posture' },
  { id: 'record', icon: '🧾', label: '4. Evidence & Evals', desc: 'Approvals, ledger, gates' },
  { id: 'fleet', icon: '🚢', label: '5. Fleet Scale: Five Pillars', desc: 'One agent → governed fleet' },
];

function PlanesDiagram() {
  const box = (x, y, w, h, title, body, color, dashed) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="#FFFFFF" stroke={color}
        strokeWidth="2" strokeDasharray={dashed ? '6 4' : undefined} />
      <text x={x + w / 2} y={y + 24} textAnchor="middle" fontSize="13.5" fontWeight="800" fill={color}>{title}</text>
      {body.map((line, i) => (
        <text key={i} x={x + w / 2} y={y + 48 + i * 17} textAnchor="middle" fontSize="11" fill="#4B5563">{line}</text>
      ))}
    </g>
  );
  const arrow = (x1, x2, y, label) => (
    <g>
      <path d={`M ${x1} ${y} L ${x2 - 8} ${y}`} stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrCP)" />
      <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontSize="11" fill="#6B7280" fontWeight="600">{label}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 980 430" width="100%" role="img"
      aria-label="Three planes: planning plane proposes a typed action, control plane decides allow, deny, or approval, execution plane performs and verifies, with an audit ledger underneath">
      <defs>
        <marker id="arrCP" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8" />
        </marker>
      </defs>

      {box(30, 40, 260, 150, 'PLANNING PLANE', [
        'model interprets task,',
        'selects a business verb,',
        'emits typed proposal',
      ], PURPLE, false)}
      <text x="160" y="176" textAnchor="middle" fontSize="10.5" fill={PURPLE}>no broad credentials</text>

      {arrow(294, 350, 100, 'ActionProposal')}

      {box(354, 40, 270, 150, 'CONTROL PLANE', [
        'gateway validates · policy:',
        'allow / deny / approval',
        'narrow short-lived authority',
      ], RED, false)}
      <text x="489" y="176" textAnchor="middle" fontSize="10.5" fill={RED}>decides outside the LLM</text>

      {arrow(628, 684, 100, 'scoped authority')}

      {box(688, 40, 262, 150, 'EXECUTION PLANE', [
        'broker → constrained adapter',
        'verifier reads postcondition',
        'pending/unknown/failed/verified',
      ], TEAL_DARK, false)}

      {/* untrusted data path */}
      <rect x="30" y="240" width="260" height="70" rx="10" fill="#F7F6FA" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="6 4" />
      <text x="160" y="266" textAnchor="middle" fontSize="12" fontWeight="700" fill="#4B5563">UNTRUSTED CONTENT</text>
      <text x="160" y="286" textAnchor="middle" fontSize="10.5" fill="#6B7280">web · email · docs · tool output</text>
      <text x="160" y="302" textAnchor="middle" fontSize="10.5" fill="#6B7280">classified as data, never instruction</text>
      <path d="M 160 240 L 160 200" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arrCP)" />
      <text x="172" y="222" fontSize="10.5" fill="#6B7280">quarantine extract (no tools, no secrets)</text>

      {/* approval */}
      <rect x="354" y="240" width="270" height="70" rx="10" fill="#FFF7ED" stroke={RED} strokeWidth="1.5" />
      <text x="489" y="266" textAnchor="middle" fontSize="12" fontWeight="700" fill={RED}>APPROVAL (conditional)</text>
      <text x="489" y="286" textAnchor="middle" fontSize="10.5" fill="#8A5A2B">T0/T1 auto · T2 policy · T3 human</text>
      <text x="489" y="302" textAnchor="middle" fontSize="10.5" fill="#8A5A2B">bound to canonical digest + nonce</text>
      <path d="M 489 240 L 489 196" stroke={RED} strokeWidth="1.5" strokeDasharray="5 4" markerEnd="url(#arrCP)" />

      {/* ledger */}
      <rect x="688" y="240" width="262" height="70" rx="10" fill="#E3F2F2" stroke={TEAL_DARK} strokeWidth="1.5" />
      <text x="819" y="266" textAnchor="middle" fontSize="12" fontWeight="700" fill={TEAL_DARK}>AUDIT LEDGER</text>
      <text x="819" y="286" textAnchor="middle" fontSize="10.5" fill={TEAL_DARK}>decision + effect transitions</text>
      <text x="819" y="302" textAnchor="middle" fontSize="10.5" fill={TEAL_DARK}>the chat transcript is not the log</text>

      <line x1="30" y1="350" x2="950" y2="350" stroke="#EEF1F4" />
      <text x="490" y="384" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1A1D26">
        Let the model plan · let policy decide · let a constrained executor act · let an independent verifier state what happened
      </text>
      <text x="490" y="410" textAnchor="middle" fontSize="11.5" fill="#6B7280">
        capability is a proposal; authority is a separately enforced, bounded, auditable permission
      </text>
    </svg>
  );
}

function TierSim() {
  const [sideEffect, setSideEffect] = useState('external');
  const [identityInferred, setIdentityInferred] = useState(false);
  const [untrustedInfluenced, setUntrustedInfluenced] = useState(true);
  const [crossTenantOrBulk, setCrossTenantOrBulk] = useState(false);
  const [verified, setVerified] = useState(true);

  const result = useMemo(
    () => evaluateTier({ sideEffect, identityInferred, untrustedInfluenced, crossTenantOrBulk, verified }),
    [sideEffect, identityInferred, untrustedInfluenced, crossTenantOrBulk, verified]
  );

  const toggle = (label, on, set) => (
    <button key={label} onClick={() => set(!on)}
      style={{
        padding: '9px 13px', borderRadius: 9, cursor: 'pointer', fontSize: 12.5, textAlign: 'left',
        border: `1.5px solid ${on ? RED : 'var(--ds-color-border-subtle)'}`,
        background: on ? '#FBEAE4' : 'var(--ds-color-bg-canvas)',
        color: on ? RED : 'var(--ds-color-text-secondary)',
        fontWeight: on ? 600 : 400, flex: 1, minWidth: 170,
      }}>
      {on ? '▲ ' : '  '}{label}
    </button>
  );

  const tierColor = result.tier <= 1 ? TEAL_DARK : result.tier === 2 ? PURPLE : RED;

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🎚️ Simulator — classify by consequence, then escalate on risk signals</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Autonomy is a property of actions, not of agents. Pick the action’s side-effect class, add the risk signals the promotion rules watch for, and see the control posture.
          </p>
        </div>

        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Side-effect class</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['read_only', 'draft', 'reversible_write', 'external', 'irreversible'].map((se) => (
              <button key={se} onClick={() => setSideEffect(se)}
                style={{
                  padding: '7px 12px', borderRadius: 999, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${sideEffect === se ? TEAL : 'var(--ds-color-border-subtle)'}`,
                  background: sideEffect === se ? TEAL : 'transparent',
                  color: sideEffect === se ? '#FFF' : 'var(--ds-color-text-secondary)',
                }}>{se}</button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Promotion-rule signals</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {toggle('Target identity inferred, not selected', identityInferred, setIdentityInferred)}
            {toggle('Untrusted content influenced the action', untrustedInfluenced, setUntrustedInfluenced)}
            {toggle('Cross-tenant / bulk / production scope', crossTenantOrBulk, setCrossTenantOrBulk)}
            {toggle('No idempotency / verification path', !verified, (v) => setVerified(!v))}
          </div>
        </div>

        <div style={{
          padding: 18, borderRadius: 12, background: 'var(--ds-color-bg-canvas)',
          borderLeft: `6px solid ${tierColor}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 38, fontWeight: 900, color: tierColor, lineHeight: 1 }}>{result.label}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ds-color-text-primary)' }}>
              {TIERS[result.tier].name}
            </span>
            <span style={{ fontSize: 13.5, color: tierColor, fontWeight: 600 }}>→ {result.posture}</span>
          </div>
          <div style={{ marginTop: 10, display: 'grid', gap: 4 }}>
            {result.reasons.map((r, i) => (
              <div key={i} style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', fontFamily: 'ui-monospace, monospace' }}>
                · {r}
              </div>
            ))}
            <div style={{ fontSize: 12.5, color: RED, fontWeight: 600, marginTop: 4 }}>
              ⃠ {result.neverDemote}
            </div>
          </div>
        </div>

        <Callout type="info" title="Why classifying the agent instead of the action fails">
          One agent can read a bounded knowledge base automatically, create drafts in staging, and still need dual control before changing production access — classifying the whole agent as “autonomous” or “human-in-the-loop” throws away exactly the information the control needs.
        </Callout>
      </Stack>
    </Card>
  );
}

function FleetDiagram() {
  const box = (x, title, body, color) => (
    <g>
      <rect x={x} y={40} width={164} height={120} rx="12" fill="#FFFFFF" stroke={color} strokeWidth="2" />
      <text x={x + 82} y={66} textAnchor="middle" fontSize="12" fontWeight="800" fill={color}>{title}</text>
      {body.map((line, i) => (
        <text key={i} x={x + 82} y={90 + i * 17} textAnchor="middle" fontSize="10.5" fill="#4B5563">{line}</text>
      ))}
    </g>
  );
  const arrow = (x1, x2) => (
    <path d={`M ${x1} 100 L ${x2 - 8} 100`} stroke="#94A3B8" strokeWidth="2" markerEnd="url(#arrFleet)" />
  );
  return (
    <svg viewBox="0 0 980 260" width="100%" role="img"
      aria-label="Fleet architecture: global policy feeds a smart router, which dispatches to many agents, all observed through unified tracing">
      <defs>
        <marker id="arrFleet" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8" />
        </marker>
      </defs>
      {box(20, 'GLOBAL POLICY', ['attribute rules', 'per-request guardrails'], PURPLE)}
      {arrow(188, 236)}
      {box(240, 'SMART ROUTER', ['complexity → tier', 'budget guardrails'], TEAL)}
      {arrow(408, 456)}
      {box(460, 'AGENT FLEET', ['many agents', 'narrow credentials'], TEAL_DARK)}
      {arrow(628, 676)}
      {box(680, 'UNIFIED TRACING', ['name · args · errors', 'tokens · latency'], RED)}
      <rect x="20" y="190" width="824" height="44" rx="10" fill="#E3F2F2" stroke={TEAL_DARK} strokeWidth="1.5" />
      <text x="432" y="217" textAnchor="middle" fontSize="12" fontWeight="700" fill={TEAL_DARK}>COST LEDGER — every call is a lookup, not a surprise</text>
    </svg>
  );
}

function FleetRoutingSim() {
  const [complexity, setComplexity] = useState(0.5);
  const [tokens, setTokens] = useState(1000);
  const [spend, setSpend] = useState(750);
  const [budget, setBudget] = useState(1000);

  const route = useMemo(() => routeFleetTask(complexity, tokens), [complexity, tokens]);
  const purse = useMemo(() => evaluateFleetBudget({ spend, budget }), [spend, budget]);
  const purseColor = purse.status === 'block' ? RED : purse.status === 'alert' ? RED : purse.status === 'nudge-to-cheaper' ? AMBER : TEAL_DARK;

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🔀 Smart routing + budgets simulator</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Move the task-complexity slider to pick a model tier and see the cost readout. Then set monthly spend against budget to trip the nudge, alert, and block thresholds.
          </p>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
            <span style={{ fontWeight: 600 }}>Task complexity: {complexity.toFixed(2)}</span>
            <span style={{ color: 'var(--ds-color-text-tertiary)' }}>Per-task tokens: {tokens.toLocaleString()}</span>
          </div>
          <input type="range" min="0" max="100" value={Math.round(complexity * 100)}
            onChange={(e) => setComplexity(Number(e.target.value) / 100)}
            style={{ width: '100%', accentColor: TEAL }} />
          <input type="range" min="100" max="8000" step="100" value={tokens}
            onChange={(e) => setTokens(Number(e.target.value))}
            style={{ width: '100%', accentColor: PURPLE }} />
        </div>
        <div style={{
          padding: 16, borderRadius: 12, background: 'var(--ds-color-bg-canvas)',
          borderLeft: `6px solid ${TEAL}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--ds-color-text-primary)' }}>{route.tierName}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEAL_DARK }}>${route.costUsd.toFixed(4)} per task</span>
            <span style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>{route.latencyMs}ms expected latency</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            Tiers: {ROUTER_TIERS.map((t) => `${t.name} (≤${t.maxComplexity}, $${t.costPer1k}/1k)`).join(' · ')}
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
            <span style={{ fontWeight: 600 }}>Monthly spend: ${spend}</span>
            <span style={{ color: 'var(--ds-color-text-tertiary)' }}>Budget: ${budget}</span>
          </div>
          <input type="range" min="0" max="1500" step="25" value={spend}
            onChange={(e) => setSpend(Number(e.target.value))}
            style={{ width: '100%', accentColor: purseColor }} />
          <input type="range" min="100" max="1500" step="50" value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            style={{ width: '100%', accentColor: TEAL_DARK }} />
        </div>
        <div style={{
          padding: 16, borderRadius: 12, background: 'var(--ds-color-bg-canvas)',
          borderLeft: `6px solid ${purseColor}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 20, fontWeight: 800, color: purseColor }}>{purse.status}</span>
            <span style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>ratio {(purse.ratio * 100).toFixed(1)}% of budget</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>{purse.action}</div>
          <div style={{ marginTop: 6, fontSize: 12, color: 'var(--ds-color-text-tertiary)' }}>
            Bands: {BUDGET_THRESHOLDS.map((t) => t.status).join(' → ')}
          </div>
        </div>
      </Stack>
    </Card>
  );
}

export default function AgentControlPlaneTab() {
  const [activeSubTab, setActiveSubTab] = useState('planes');  const planeColumns = [
    { key: 'name', header: 'Plane', render: (v, row) => <strong style={{ color: row.color }}>{v}</strong> },
    { key: 'duty', header: 'Decides / does', sortable: false },
    { key: 'mustNot', header: 'Must not', render: (v) => <span style={{ color: RED }}>{v}</span> },
  ];

  const stepColumns = [
    { key: 'n', header: 'Step', render: (v) => (
      <strong style={{ color: RED, fontFamily: 'ui-monospace, monospace' }}>{v}</strong>
    ) },
    { key: 'name', header: 'Do this' },
    { key: 'detail', header: 'Detail', sortable: false },
  ];

  const tierColumns = [
    { key: 'tier', header: 'Tier', render: (v) => <strong style={{ color: v === 'T0' || v === 'T1' ? TEAL_DARK : v === 'T2' ? PURPLE : RED }}>{v}</strong> },
    { key: 'name', header: 'Name' },
    { key: 'scope', header: 'Typical scope', sortable: false },
    { key: 'posture', header: 'Control posture', sortable: false },
  ];

  const defenseColumns = [
    { key: 'defense', header: 'Defense', render: (v) => <strong>{v}</strong> },
    { key: 'detail', header: 'How', sortable: false },
  ];

  const approvalColumns = [
    { key: '', header: '#', render: (v, row, i) => <span style={{ color: RED, fontWeight: 700 }}>{i + 1}</span> },
    { key: 'f', header: 'Approval record must contain', sortable: false },
  ].map((c) => (c.key === '' ? { ...c, key: 'idx' } : c));

  const auditColumns = [
    { key: 'event', header: 'Event', render: (v) => (
      <code style={{ fontSize: 12, background: '#E3F2F2', color: TEAL_DARK, padding: '2px 7px', borderRadius: 6 }}>{v}</code>
    ) },
    { key: 'carries', header: 'Carries', sortable: false },
  ];

  const evalColumns = [
    { key: 'family', header: 'Eval family', render: (v) => <strong>{v}</strong> },
    { key: 'assertion', header: 'Example assertion', sortable: false },
    { key: 'gate', header: 'Gate', render: (v) => <span style={{ color: TEAL_DARK, fontWeight: 600 }}>{v}</span> },
  ];

  const fleetCostColumns = [
    { key: 'dimension', header: 'Dimension', render: (v) => <strong>{v}</strong> },
    { key: 'oneAgent', header: 'One agent', sortable: false },
    { key: 'fleet', header: 'Governed fleet', sortable: false },
  ];

  const traceColumns = TRACE_FIELDS.map((f) => ({
    key: f, header: f, render: (v) => (
      <code style={{ fontSize: 12, background: '#E3F2F2', color: TEAL_DARK, padding: '2px 7px', borderRadius: 6 }}>{String(v)}</code>
    ),
  }));

  const approvalData = APPROVAL_FIELDS.map((f) => ({ f }));

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="agentcontrolplane"
        moduleLabel="Planning & Safety [Governance]"
        title="The Control Plane: Permission to Act Is Not the Same as Ability to Act"
        description="A valid tool call can still be the wrong action: syntactically perfect, HTTP 200, wrong account canceled. Schema validation checks shape, authentication checks identity, tool definitions check capability — none of them establishes authority. That decision belongs to a deterministic control plane outside the model."
        metrics={[
          { label: 'Planes', value: '3' },
          { label: 'Build steps', value: '9' },
          { label: 'Consequence tiers', value: 'T0 → T4' },
          { label: 'Places policy may live (inside the LLM)', value: '0' },
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
                background: activeSubTab === tab.id ? RED : 'transparent',
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

        {activeSubTab === 'planes' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Capability is a proposal. Authority is enforcement.</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                An LLM has <strong>capability</strong> when it can select a tool and produce arguments. It has <strong>authority</strong> only when a separately enforced policy permits a bounded action for an identified principal in the current context. Robust systems require the second before producing any effect.
              </p>
              <PlanesDiagram />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Every check that exists still failed</h3>
              <div style={{
                padding: 14, borderRadius: 10, background: '#1A1D26', color: '#E5E7EB',
                fontFamily: 'ui-monospace, monospace', fontSize: 13, marginBottom: 12,
              }}>
                {FAILURE_EXAMPLE.call}
              </div>
              <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: TEAL_DARK, marginBottom: 8 }}>All green</div>
                  {FAILURE_EXAMPLE.green.map((g, i) => (
                    <div key={i} style={{ fontSize: 13, color: TEAL_DARK, padding: '4px 0' }}>✓ {g}</div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: RED, marginBottom: 8 }}>What actually happened</div>
                  <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>{FAILURE_EXAMPLE.reality}</div>
                </div>
              </Grid>
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>The three planes</h3>
              <Table columns={planeColumns} data={PLANES} sortable={false} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'steps' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Nine steps — none of them can be handed to the LLM</h3>
              <Table columns={stepColumns} data={NINE_STEPS} sortable={false} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Step 6 in detail — reduce the blast radius, not the hopes</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                No single prompt or classifier turns untrusted text into trusted instructions. The protective burden sits on authority boundaries: label, partition, quarantine, re-gate, shrink, and test the attack path.
              </p>
              <Table columns={defenseColumns} data={UNTRUSTED_DEFENSES} sortable={false} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'tier' && (
          <Stack gap={6}>
            <TierSim />
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>The tier model</h3>
              <Table columns={tierColumns} data={TIERS} sortable={false} />
              <Callout type="warning" title="Escalate, never auto-demote">
                Escalate whenever identity was inferred, untrusted content influenced the action, verification is missing, or scope turns cross-tenant/bulk/external/irreversible/production-critical. There is exactly one rule in the other direction: <strong>never lower a tier because the model expressed high confidence</strong>.
              </Callout>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'record' && (
          <Stack gap={6}>
            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>Approval binds to the canonical action</h3>
                <Table columns={approvalColumns} data={approvalData} sortable={false} />
              </Card>
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>Protected event set</h3>
                <Table columns={auditColumns} data={AUDIT_EVENTS} sortable={false} />
              </Card>
            </Grid>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Evaluate the control plane — not the model’s prose</h3>
              <Table columns={evalColumns} data={EVALS} sortable={false} />
              <Callout type="tip" title="Model-as-judge has a ceiling here">
                A judge model can rate explanation quality or action plausibility, but it must not be the final proof that an authorization control worked. For high-impact effects, deterministic policy tests and provider-side invariants gate deployment.
              </Callout>
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>1 · Proposal → policy → broker</h3>
              <CodeBlock language="python" code={CODE_PROPOSAL} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>2 · The effect state machine</h3>
              <CodeBlock language="python" code={CODE_STATEMACHINE} />
            </Card>
          </Stack>
        )}

        {activeSubTab === 'fleet' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>{FLEET_SPRAWL.headline}</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                {FLEET_SPRAWL.forecast}
              </p>
              <FleetDiagram />
              <div style={{ marginTop: 12, display: 'grid', gap: 4 }}>
                {FLEET_SPRAWL.drivers.map((d, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>· {d}</div>
                ))}
              </div>
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>The five pillars — cost is the fifth</h3>
              <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                {FLEET_PILLARS.map((p) => (
                  <div key={p.id} style={{ padding: 14, borderRadius: 10, background: 'var(--ds-color-bg-canvas)', border: '1px solid var(--ds-color-border-subtle)' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: p.id === 'cost' ? RED : 'var(--ds-color-text-primary)' }}>{p.name}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{p.detail}</div>
                  </div>
                ))}
              </Grid>
              <div style={{ marginTop: 12 }}>
                <Table columns={fleetCostColumns} data={FLEET_COST_TABLE} sortable={false} />
              </div>
            </Card>

            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
              {GLOBAL_POLICIES.map((g) => (
                <Card key={g.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <h3 style={{ margin: '0 0 6px 0' }}>{g.name}</h3>
                  <p style={{ margin: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>{g.detail}</p>
                </Card>
              ))}
            </Grid>

            <FleetRoutingSim />

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Unified tracing — cost control as lookup</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Every call records its name, arguments, errors, tokens, and latency in one queryable table — so spend, failure, and blame are all the same lookup.
              </p>
              <Table columns={traceColumns} data={FLEET_TRACE_SAMPLE} sortable={false} />
              <Callout type="tip" title="Trace first, invoice later">
                When every dispatch carries tokens and latency next to its outcome, the monthly bill stops being a surprise and starts being a query.
              </Callout>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
