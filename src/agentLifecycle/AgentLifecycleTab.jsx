import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  SYSTEM_VIEW,
  LOOP_DECISION,
  VERIF_VAL,
  CAPABILITY_VS_REGRESSION,
  reviewCapacity,
  attemptStats,
  BEHAVIORAL_CONTRACT,
  COORDINATION,
  DECISION_RIGHTS,
  RISKS,
  CODE_CONTRACT,
  CODE_GATES,
} from './agentLifecycleEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#9B89C4';
const PURPLE_DARK = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'loops', icon: '🔁', label: '1. Two Loops, One Release', desc: 'Where the agent lifecycle fits' },
  { id: 'system', icon: '🔬', label: '2. Agent as Subsystem', desc: 'Organism → cell' },
  { id: 'simulator', icon: '🎚️', label: '3. Readiness Simulator', desc: 'Capacity + attempt math' },
  { id: 'contract', icon: '📜', label: '4. Contract & Coordination', desc: 'Shared evidence, gates' },
];

function LoopsDiagram() {
  const chip = (x, y, w, label, fill, stroke, textFill) => (
    <g>
      <rect x={x} y={y} width={w} height="46" rx="10" fill={fill} stroke={stroke} strokeWidth="1.8" />
      <text x={x + w / 2} y={y + 28} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={textFill}>{label}</text>
    </g>
  );
  const arrow = (x1, y1, x2, y2, color, dash) => (
    <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={color} strokeWidth="1.8"
      strokeDasharray={dash || undefined} markerEnd="url(#arrL)" />
  );
  return (
    <svg viewBox="0 0 980 470" width="100%" role="img"
      aria-label="Agent loop Plan, Build, Test or Evaluate with two returns, to Build within the hypothesis or to Plan to reconsider it, coupled to the application lifecycle through a behavioral contract and a shared release gate">
      <defs>
        <marker id="arrL" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#94A3B8" />
        </marker>
      </defs>

      {/* agent loop */}
      <text x="60" y="36" fontSize="13" fontWeight="800" fill={PURPLE_DARK}>AGENT DEVELOPMENT LIFECYCLE</text>
      {chip(60, 56, 180, 'Plan', '#F5F3FA', PURPLE, PURPLE_DARK)}
      {chip(320, 56, 180, 'Build', '#F5F3FA', PURPLE, PURPLE_DARK)}
      {chip(580, 56, 220, 'Test & evaluate', '#F5F3FA', PURPLE, PURPLE_DARK)}
      {arrow(244, 79, 316, 79, '#94A3B8')}
      {arrow(504, 79, 576, 79, '#94A3B8')}
      {/* return to build */}
      <path d="M 660 106 C 660 150, 440 150, 410 106" fill="none" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrL)" />
      <text x="535" y="145" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={TEAL_DARK}>return to Build — evidence fits the hypothesis</text>
      {/* return to plan */}
      <path d="M 760 106 C 800 170, 200 170, 150 108" fill="none" stroke={RED} strokeWidth="2" strokeDasharray="7 4" markerEnd="url(#arrL)" />
      <text x="470" y="196" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={RED}>return to Plan — evidence challenges the hypothesis or the decomposition</text>

      {/* contract */}
      <rect x="60" y="228" width="860" height="66" rx="12" fill="#FFF7ED" stroke={AMBER} strokeWidth="2" />
      <text x="490" y="254" textAnchor="middle" fontSize="13.5" fontWeight="800" fill="#8A5A2B">BEHAVIORAL CONTRACT — versioned, both teams maintain it</text>
      <text x="490" y="276" textAnchor="middle" fontSize="11.5" fill="#8A5A2B">
        integrated evaluation cases: task · evidence · permitted outcomes · expected app action · scoring rules
      </text>

      {/* app loop */}
      <text x="60" y="336" fontSize="13" fontWeight="800" fill={TEAL_DARK}>APPLICATION LIFECYCLE</text>
      {chip(60, 352, 190, 'Requirements', '#E3F2F2', TEAL, TEAL_DARK)}
      {chip(310, 352, 190, 'Implement', '#E3F2F2', TEAL, TEAL_DARK)}
      {chip(560, 352, 170, 'Release gate', '#E3F2F2', TEAL, TEAL_DARK)}
      {chip(790, 352, 130, 'Operate', '#E3F2F2', TEAL, TEAL_DARK)}
      {arrow(254, 375, 306, 375, '#94A3B8')}
      {arrow(504, 375, 556, 375, '#94A3B8')}
      {arrow(734, 375, 786, 375, '#94A3B8')}
      <path d="M 855 398 C 855 440, 150 440, 150 402" fill="none" stroke="#94A3B8" strokeWidth="1.8" markerEnd="url(#arrL)" />

      {/* coupling */}
      <path d="M 490 294 L 490 348" stroke={AMBER} strokeWidth="2" markerEnd="url(#arrL)" />
      <text x="505" y="324" fontSize="11" fill="#8A5A2B">evidence in / findings out</text>

      <text x="490" y="462" textAnchor="middle" fontSize="11.5" fill="#6B7280">
        coordinated, not merged: each loop keeps its own requirements, ownership, and evidence of progress
      </text>
    </svg>
  );
}

function NestedStructure() {
  return (
    <svg viewBox="0 0 640 420" width="100%" role="img"
      aria-label="Nested structure: the application contains the agent; the agent contains a harness, model, memory, tools and optional sub-agents; identity and operational controls span the application; authorization is enforced at tool access">
      <rect x="20" y="20" width="600" height="380" rx="14" fill="#FFFFFF" stroke={TEAL} strokeWidth="2.2" />
      <text x="40" y="48" fontSize="14" fontWeight="800" fill={TEAL_DARK}>Application</text>

      <rect x="40" y="70" width="400" height="300" rx="12" fill="#F7F6FA" stroke={PURPLE} strokeWidth="1.8" />
      <text x="58" y="96" fontSize="13" fontWeight="800" fill={PURPLE_DARK}>Agent (a system within the system)</text>

      <rect x="60" y="112" width="360" height="46" rx="9" fill="#FFFFFF" stroke={PURPLE} strokeWidth="1.5" />
      <text x="240" y="140" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1A1D26">Harness — assembles context, controls execution</text>

      {[
        ['Model', 120], ['Memory', 176], ['Tools', 232], ['Sub-agents (optional)', 288],
      ].map(([name, y]) => (
        <g key={name}>
          <rect x="80" y={y} width="160" height="44" rx="9" fill="#FFFFFF" stroke={PURPLE} strokeWidth="1.3" />
          <text x="160" y={y + 27} textAnchor="middle" fontSize="11.5" fill="#1A1D26">{name}</text>
        </g>
      ))}
      <rect x="260" y="176" width="146" height="156" rx="9" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.3" strokeDasharray="5 4" />
      <text x="333" y="210" textAnchor="middle" fontSize="11" fill="#6B7280">evidence flows:</text>
      <text x="333" y="230" textAnchor="middle" fontSize="11" fill="#6B7280">does it survive</text>
      <text x="333" y="250" textAnchor="middle" fontSize="11" fill="#6B7280">the handoff</text>
      <text x="333" y="270" textAnchor="middle" fontSize="11" fill="#6B7280">between parts?</text>

      <rect x="460" y="70" width="146" height="140" rx="10" fill="#E3F2F2" stroke={TEAL_DARK} strokeWidth="1.5" />
      <text x="533" y="98" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={TEAL_DARK}>Identity &</text>
      <text x="533" y="116" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={TEAL_DARK}>operational</text>
      <text x="533" y="134" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={TEAL_DARK}>controls</text>
      <text x="533" y="162" textAnchor="middle" fontSize="10.5" fill={TEAL_DARK}>span the app —</text>
      <text x="533" y="178" textAnchor="middle" fontSize="10.5" fill={TEAL_DARK}>they survive agent</text>
      <text x="533" y="194" textAnchor="middle" fontSize="10.5" fill={TEAL_DARK}>redesign</text>

      <rect x="460" y="230" width="146" height="140" rx="10" fill="#FFF7ED" stroke={RED} strokeWidth="1.5" />
      <text x="533" y="264" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={RED}>Authorization</text>
      <text x="533" y="284" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={RED}>at tool access</text>
      <text x="533" y="312" textAnchor="middle" fontSize="10.5" fill="#8A5A2B">app policy, not the</text>
      <text x="533" y="328" textAnchor="middle" fontSize="10.5" fill="#8A5A2B">agent’s internal</text>
      <text x="533" y="344" textAnchor="middle" fontSize="10.5" fill="#8A5A2B">design</text>
    </svg>
  );
}

function ReadinessSim() {
  const [messages, setMessages] = useState(10000);
  const [slots, setSlots] = useState(200);
  const [rate, setRate] = useState(2);
  const cap = useMemo(() => reviewCapacity({ messagesPerDay: messages, reviewSlots: slots, inconclusivePct: rate }), [messages, slots, rate]);

  const [k, setK] = useState(3);
  const [p, setP] = useState(0.8);
  const att = useMemo(() => attemptStats(k, p), [k, p]);

  const color = cap.headroom < 0 ? RED : cap.utilization > 0.85 ? AMBER : TEAL_DARK;

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={5}>
        <div>
          <h3 style={{ margin: 0 }}>🎚️ Simulator — make the requirement quantitative</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Review capacity turns an “inconclusive rate” from a style question into arithmetic. Below it: what more attempts actually do to reliability.
          </p>
        </div>

        <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Messages / day</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700 }}>{messages.toLocaleString()}</span>
            </div>
            <input type="range" min={1000} max={50000} step={1000} value={messages}
              onChange={(e) => setMessages(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} aria-label="Messages per day" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Review slots / day</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700 }}>{slots}</span>
            </div>
            <input type="range" min={50} max={1000} step={10} value={slots}
              onChange={(e) => setSlots(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: PURPLE, cursor: 'pointer' }} aria-label="Review slots" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Inconclusive rate</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: color }}>{rate}%</span>
            </div>
            <input type="range" min={0} max={5} step={0.1} value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: RED, cursor: 'pointer' }} aria-label="Inconclusive rate" />
          </div>
        </Grid>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Metric value={cap.inconclusive.toFixed(0)} label="Inconclusive → review queue" color={color} />
          <Metric value={cap.headroom.toFixed(0)} label="Headroom in slots" color={cap.headroom < 0 ? RED : TEAL_DARK} />
          <Metric value={`${(cap.utilization * 100).toFixed(0)}%`} label="Slot utilization" color={color} />
          <Metric value={`${cap.maxRate.toFixed(2)}%`} label="Max sustainable inconclusive rate" />
        </div>

        <Callout type={cap.headroom < 0 ? 'danger' : cap.utilization > 0.85 ? 'warning' : 'success'} title="Capacity makes the contract honest">
          {cap.verdict} Forcing confident classifications to shrink the queue would defeat the requirement — the honest fixes are a lower operating target, narrower automated scope, or more capacity.
        </Callout>

        <div style={{ height: 1, background: 'var(--ds-color-border-subtle)' }} />

        <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Attempts (k)</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: PURPLE_DARK }}>{k}</span>
            </div>
            <input type="range" min={1} max={8} step={1} value={k}
              onChange={(e) => setK(parseInt(e.target.value, 10))}
              style={{ width: '100%', accentColor: PURPLE, cursor: 'pointer' }} aria-label="Attempts" />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Per-attempt success</span>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: TEAL_DARK }}>{(p * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min={0.5} max={0.99} step={0.01} value={p}
              onChange={(e) => setP(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} aria-label="Per attempt success" />
          </div>
        </Grid>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Metric value={`${(att.passAtK * 100).toFixed(1)}%`} label={`pass@${k} — at least one success`} color={TEAL_DARK} />
          <Metric value={`${(att.allK * 100).toFixed(1)}%`} label={`all-${k} — every attempt succeeds`} color={RED} />
        </div>

        <Callout type="info" title="More attempts push the two measures apart">
          Raising k always lifts pass@<em>k</em> and crushes all-<em>k</em>. For automated decisions, specify per-case consistency and false-safe error bounds <strong>under the actual retry policy</strong> — occasional success across several attempts never justifies acting on every result.
        </Callout>
      </Stack>
    </Card>
  );
}

function Metric({ value, label, color }) {
  return (
    <div style={{ flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 25, fontWeight: 800, color: color || 'var(--ds-color-text-primary)', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)', marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function AgentLifecycleTab() {
  const [activeSubTab, setActiveSubTab] = useState('loops');

  const loopColumns = [
    { key: 'return', header: 'Return path', render: (v, row) => (
      <strong style={{ color: row.return.includes('Plan') ? RED : TEAL_DARK }}>{v}</strong>
    ) },
    { key: 'when', header: 'When', sortable: false },
    { key: 'example', header: 'Example', sortable: false },
  ];
  const partColumns = [
    { key: 'part', header: 'Part', render: (v) => <strong>{v}</strong> },
    { key: 'duty', header: 'Responsibility', sortable: false },
  ];
  const evalColumns = [
    { key: 'level', header: 'Level', render: (v) => <strong style={{ color: PURPLE_DARK }}>{v}</strong> },
    { key: 'examines', header: 'Examines', sortable: false },
    { key: 'question', header: 'The question it answers', render: (v) => <span style={{ color: TEAL_DARK, fontWeight: 600 }}>{v}</span> },
  ];
  const vvColumns = [
    { key: 'term', header: 'Term', render: (v) => <strong>{v}</strong> },
    { key: 'question', header: 'Asks' },
    { key: 'example', header: 'Example', sortable: false },
  ];
  const crColumns = [
    { key: 'type', header: 'Eval type', render: (v) => <strong>{v}</strong> },
    { key: 'measures', header: 'Measures', sortable: false },
    { key: 'evidence', header: 'Evidence to produce', sortable: false },
  ];
  const contractColumns = [
    { key: 'field', header: 'Case field', render: (v) => <strong>{v}</strong> },
    { key: 'case', header: 'Inconclusive-email example', sortable: false },
  ];
  const coordColumns = [
    { key: 'practice', header: 'Practice', render: (v) => <strong>{v}</strong> },
    { key: 'detail', header: 'Detail', sortable: false },
  ];
  const rightsColumns = [
    { key: 'role', header: 'Role', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
    { key: 'owns', header: 'Owns', sortable: false },
  ];
  const riskColumns = [
    { key: 'cost', header: 'Coordination cost', render: (v) => <span style={{ color: RED }}>{v}</span> },
    { key: 'mitigation', header: 'Practical mitigation', sortable: false },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="agentlifecycle"
        moduleLabel="Planning & Safety [Process]"
        title="Where the Agent Development Lifecycle Fits: Coordinate, Don’t Merge"
        description="An agent changes independently, but the application decides how its results enter a queue, reach an analyst, or cause an action. Run the agent loop and the application loop as distinct lifecycles with shared requirements, a versioned behavioral contract, and one release gate — coupled, never conflated."
        metrics={[
          { label: 'Development loops', value: '2 + 1 contract' },
          { label: 'Return paths from evidence', value: 'Build or Plan' },
          { label: 'Verification vs validation', value: 'both' },
          { label: 'Release without evidence', value: '0' },
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

        {activeSubTab === 'loops' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Explicit about where evidence sends you</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Evaluation has two destinations, and choosing between them is a design decision: fix inside the current hypothesis, or reconsider the hypothesis itself. Making the return to Plan an explicit path keeps the second kind from hiding inside the first.
              </p>
              <LoopsDiagram />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>The two return paths</h3>
              <Table columns={loopColumns} data={LOOP_DECISION} sortable={false} />
              <Callout type="tip" title="Double-loop, in engineering clothes">
                When correcting actions proves insufficient, reconsider the governing assumptions. An investigation that keeps losing evidence between sub-agents can either improve the handoff format — inside the decomposition — or question whether the split was useful at all. Both belong in the same process; only one of them is visible if the return path isn’t explicit.
              </Callout>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'system' && (
          <Stack gap={6}>
            <Grid columns={{ base: '1fr', md: '1.1fr 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 4px 0' }}>Complexity at more than one scale</h3>
                <p style={{ margin: '0 0 8px 0', fontSize: 'var(--ds-font-size-bodySm)', color: 'var(--ds-color-text-secondary)', lineHeight: 1.7 }}>
                  {SYSTEM_VIEW.analogy}
                </p>
                <NestedStructure />
              </Card>
              <Stack gap={4}>
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <h3 style={{ margin: '0 0 12px 0' }}>What sits inside the box</h3>
                  <Table columns={partColumns} data={SYSTEM_VIEW.parts} sortable={false} />
                </Card>
                <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                  <h3 style={{ margin: '0 0 12px 0' }}>Two evaluation levels</h3>
                  <Table columns={evalColumns} data={SYSTEM_VIEW.twoEvals} sortable={false} />
                </Card>
              </Stack>
            </Grid>

            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>Verification vs validation</h3>
                <Table columns={vvColumns} data={VERIF_VAL} sortable={false} />
              </Card>
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>Capability vs regression evidence</h3>
                <Table columns={crColumns} data={CAPABILITY_VS_REGRESSION} sortable={false} />
              </Card>
            </Grid>
          </Stack>
        )}

        {activeSubTab === 'simulator' && <ReadinessSim />}

        {activeSubTab === 'contract' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>The behavioral contract — one case, end to end</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                If the application forces every result into safe or malicious, it turns an honest expression of uncertainty into an unsupported decision. The contract fixes what the agent may return and what the application must do with it.
              </p>
              <Table columns={contractColumns} data={BEHAVIORAL_CONTRACT} sortable={false} />
            </Card>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Coordinating two lifecycles</h3>
              <Table columns={coordColumns} data={COORDINATION} sortable={false} />
            </Card>

            <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>Decision rights</h3>
                <Table columns={rightsColumns} data={DECISION_RIGHTS} sortable={false} />
              </Card>
              <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)' }}>
                <h3 style={{ margin: '0 0 12px 0' }}>Coordination costs — named, not denied</h3>
                <Table columns={riskColumns} data={RISKS} sortable={false} />
              </Card>
            </Grid>

            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>1 · Contract case with statistical acceptance</h3>
              <CodeBlock language="python" code={CODE_CONTRACT} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>2 · Shared release gate + narrow deployment</h3>
              <CodeBlock language="python" code={CODE_GATES} />
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
