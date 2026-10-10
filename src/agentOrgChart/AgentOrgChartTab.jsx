import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  TEAL, TEAL_DARK, PURPLE, RED, AMBER,
  ORG_VOCAB, BUILD_ORDER, ORG_ROLES, evaluateOrgChart, accountabilityMessage,
  KANBAN_STAGES, SPEC_PARTS, nextStage, checkSpec, ISOLATION_LESSON,
  FAILURE_MODES, evaluateRoleTightness,
  DAY_ONE_NEEDS, WORKFLOW_VS_PROCESS, ACCOUNTABILITY_RULES, reviewCapacity,
  PYTHON_ORG_CODE,
} from './agentOrgChartEngine.js';

const { Container, Stack, Grid } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const sel = { width: '100%', background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: '4px', padding: '6px', fontSize: '12px', marginBottom: '8px' };
const small = { fontSize: '11px', color: 'var(--ds-color-text-secondary)', lineHeight: 1.5 };
const h3 = { margin: 0, color: 'var(--ds-color-text-primary)' };

function workerColor(w) {
  if (w === 'human') return TEAL_DARK;
  if (w === 'ai') return PURPLE;
  return 'transparent';
}

function OrgChartSvg({ assignments }) {
  const evalR = evaluateOrgChart(assignments);
  const boxes = ORG_ROLES.map((r, i) => {
    const w = assignments[r.id] || 'empty';
    const isTop = i === 0;
    const x = isTop ? 190 : 20 + (i - 1) * 132;
    const y = isTop ? 14 : 130;
    const fill = workerColor(w);
    return { ...r, worker: w, x, y, fill };
  });
  return (
    <svg viewBox="0 0 560 240" style={{ width: '100%', height: 'auto', background: 'var(--ds-color-bg-surface)', borderRadius: '8px' }} role="img" aria-label="Org chart with lead at top">
      {boxes.slice(1).map((b) => (
        <line key={b.id} x1="270" y1="62" x2={b.x + 60} y2="130" stroke={TEAL} strokeWidth="2" opacity="0.6" style={{ transition: 'all 0.3s ease' }} />
      ))}
      {boxes.map((b) => (
        <g key={b.id} style={{ transition: 'all 0.3s ease' }}>
          <rect x={b.x} y={b.y} width="120" height="64" rx="8"
            fill={b.fill} fillOpacity={b.worker === 'empty' ? 0 : 0.22}
            stroke={b.worker === 'empty' ? RED : b.fill} strokeWidth="2"
            strokeDasharray={b.worker === 'empty' ? '5 4' : 'none'}
            style={{ transition: 'all 0.3s ease' }} />
          <text x={b.x + 60} y={b.y + 22} textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--ds-color-text-primary)">{b.title}</text>
          <text x={b.x + 60} y={b.y + 38} textAnchor="middle" fontSize="10" fill="var(--ds-color-text-secondary)">{b.worker === 'empty' ? 'open seat' : b.worker === 'human' ? 'person' : 'agent'}</text>
          {b.id === 'lead' && evalR.missingHumanAtTop && (
            <text x={b.x + 60} y={b.y + 52} textAnchor="middle" fontSize="10" fontWeight="bold" fill={RED}>needs a person</text>
          )}
        </g>
      ))}
    </svg>
  );
}

function KanbanSvg({ active }) {
  const idx = KANBAN_STAGES.findIndex((s) => s.id === active);
  const w = 104;
  return (
    <svg viewBox="0 0 580 90" style={{ width: '100%', height: 'auto', background: 'var(--ds-color-bg-surface)', borderRadius: '8px' }} role="img" aria-label="Kanban flow">
      {KANBAN_STAGES.map((s, i) => (
        <g key={s.id} style={{ transition: 'all 0.3s ease', opacity: idx === -1 || i <= idx ? 1 : 0.45 }}>
          <rect x={8 + i * (w + 8)} y={14} width={w} height={52} rx={8}
            fill={i <= idx && idx !== -1 ? TEAL : 'transparent'} fillOpacity={i === idx ? 0.35 : 0.12}
            stroke={i === idx ? TEAL_DARK : TEAL} strokeWidth={i === idx ? 3 : 1.5}
            style={{ transition: 'all 0.3s ease' }} />
          <text x={8 + i * (w + 8) + w / 2} y={38} textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--ds-color-text-primary)">{s.name}</text>
          <text x={8 + i * (w + 8) + w / 2} y={54} textAnchor="middle" fontSize="9" fill="var(--ds-color-text-secondary)">step {i + 1}</text>
          {i < KANBAN_STAGES.length - 1 && (
            <text x={8 + (i + 1) * (w + 8) - 6} y={44} fontSize="14" fill={TEAL}>›</text>
          )}
        </g>
      ))}
    </svg>
  );
}

const FAILURE_COLS = [
  { key: 'failure', header: 'Failure', sortable: false },
  { key: 'symptom', header: 'What you see', sortable: false },
  { key: 'cause', header: 'Why it happens', sortable: false },
  {
    key: 'fix', header: 'Fix', sortable: false,
    render: (v) => <span style={{ color: TEAL_DARK, fontSize: '12px' }}>{v}</span>,
  },
];

export default function AgentOrgChartTab() {
  const [sub, setSub] = useState('hire');
  const [assignments, setAssignments] = useState({ lead: 'human', planner: 'ai', builder: 'ai', reviewer: 'human', messenger: null });
  const evalR = evaluateOrgChart(assignments);
  const [flowStage, setFlowStage] = useState('spec');
  const [spec, setSpec] = useState({ requirements: 'Refund under $20 with receipt', design: 'Lookup order, then issue credit', todo: '1 verify receipt 2 issue credit 3 notify' });
  const specCheck = checkSpec(spec);
  const [breadth, setBreadth] = useState('broad');
  const [usesBoard, setUsesBoard] = useState(false);
  const tight = evaluateRoleTightness(breadth, usesBoard);
  const [outputs, setOutputs] = useState(30);
  const cap = reviewCapacity(outputs, 5, 60);

  const cycle = (roleId) => {
    const order = [null, 'human', 'ai'];
    const cur = assignments[roleId] || null;
    const nxt = order[(order.indexOf(cur) + 1) % order.length];
    setAssignments({ ...assignments, [roleId]: nxt });
  };

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Org Chart]"
        title="Hire Agents Like Staff, Not Spells"
        description="Give every agent a seat, a written remit, and one owner per outcome. A person sits at the top, work flows through one board, and the cheapest defect is caught in the spec."
        metrics={[{ label: 'Seats', value: '5' }, { label: 'Owners per outcome', value: '1' }, { label: 'Cheapest fix', value: 'Spec' }]} />
      <Container size="wide">
        <div style={NAV}>{[
          { id: 'hire', icon: '🏢', label: "1. Hire, don't prompt", desc: 'Jobs → role → worker' },
          { id: 'desk', icon: '🖥️', label: '2. One desk per agent', desc: 'Isolation + kanban' },
          { id: 'fail', icon: '⚠️', label: '3. Four ways it goes wrong', desc: 'Table + tightness dial' },
          { id: 'account', icon: '🧭', label: '4. Accountability', desc: 'Human at top' }].map((t) => (
          <button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? TEAL_DARK : 'transparent', color: sub === t.id ? 'var(--ds-color-bg-surface)' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.25s ease' }}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div><div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.8 }}>{t.desc}</div></button>))}
        </div>

        {sub === 'hire' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={3}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {ORG_VOCAB.map((v) => <Badge key={v.term} variant="default">{v.term}</Badge>)}
                </div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
                  {ORG_VOCAB.map((v) => (
                    <Card key={v.term} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${TEAL}` }}>
                      <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>{v.term}</div>
                      <div style={small}>{v.meaning}</div>
                    </Card>
                  ))}
                </Grid>
                <Callout type="info"><strong>Build order matters:</strong> {BUILD_ORDER.map((b) => `${b.step}. ${b.name}`).join(' → ')}. Picking the worker first is how teams end up with clever agents and no owned outcomes.</Callout>
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">
                  {BUILD_ORDER.map((b) => (
                    <Card key={b.step} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: TEAL_DARK }}>Step {b.step}: {b.name}</div>
                      <div style={small}>{b.detail}</div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={h3}>🏗️ Org-chart builder — click a seat to cycle open → person → agent</h3>
                  <p style={small}>Staff all five seats. The top seat must be a person; the chain below shows who answers to whom.</p></div>
                <OrgChartSvg assignments={assignments} />
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
                  {ORG_ROLES.map((r) => (
                    <button key={r.id} onClick={() => cycle(r.id)} style={{ textAlign: 'left', padding: '10px 12px', borderRadius: '8px', border: `2px solid ${workerColor(assignments[r.id] || 'empty') === 'transparent' ? RED : workerColor(assignments[r.id])}`, background: 'var(--ds-color-bg-surface)', cursor: 'pointer', transition: 'all 0.25s ease' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--ds-color-text-primary)' }}>{r.title} — {assignments[r.id] || 'open seat'}</div>
                      <div style={small}>{r.duties}</div>
                      {r.mustBeHuman && <div style={{ fontSize: '11px', color: AMBER }}>★ top seat: person required</div>}
                    </button>
                  ))}
                </Grid>
                <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${evalR.status === 'healthy' ? TEAL : RED}` }}>
                  <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)' }}><strong>Chain:</strong> {evalR.chain.map((c) => `${c.title} (${c.worker})`).join(' → ')}</div>
                  <div style={{ fontSize: '12px', color: evalR.status === 'healthy' ? TEAL_DARK : RED, marginTop: '6px' }}>{accountabilityMessage(evalR)}</div>
                  <div style={small}>Staffed {evalR.staffed}/5 · people {evalR.humanCount} · agents {evalR.aiCount} · open: {evalR.unstaffed.join(', ') || 'none'}</div>
                </Card>
                {evalR.missingHumanAtTop && <Callout type="danger"><strong>Flag: no person at the top.</strong> An agent cannot answer for outcomes. Move a person into the lead seat before anything else.</Callout>}
                {evalR.status === 'healthy' && <Callout type="success"><strong>Healthy chart.</strong> Every outcome has one owner and a person anchors the top.</Callout>}
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'desk' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={3}>
                <div><h3 style={h3}>🖥️ The isolation lesson</h3></div>
                <p style={{ ...small, fontSize: '13px' }}><strong style={{ color: 'var(--ds-color-text-primary)' }}>{ISOLATION_LESSON.title}:</strong> {ISOLATION_LESSON.before}</p>
                <Callout type="warning"><strong>Rule:</strong> {ISOLATION_LESSON.rule}</Callout>
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">
                  {[['Shared folder', 'Two agents read + write the same files; saves collide.', RED], ['One container each', 'Separate files, memory, and credentials per agent.', TEAL], ['Board as bridge', 'Agents exchange cards and status — never raw files.', PURPLE]].map(([t, d, c]) => (
                    <Card key={t} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${c}` }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--ds-color-text-primary)' }}>{t}</div>
                      <div style={small}>{d}</div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={h3}>📋 Kanban flow — click a stage to walk a card through</h3>
                  <p style={small}>Backlog → spec → approve → build → review. The spec (requirements + design + todo) is where defects are cheapest.</p></div>
                <KanbanSvg active={flowStage} />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {KANBAN_STAGES.map((s) => (
                    <button key={s.id} onClick={() => setFlowStage(s.id)} style={{ padding: '8px 12px', borderRadius: '999px', border: `2px solid ${flowStage === s.id ? TEAL_DARK : 'var(--ds-color-border-subtle)'}`, background: flowStage === s.id ? TEAL : 'var(--ds-color-bg-surface)', color: flowStage === s.id ? 'var(--ds-color-bg-surface)' : 'var(--ds-color-text-secondary)', cursor: 'pointer', fontSize: '12px', transition: 'all 0.25s ease' }}>{s.name}</button>
                  ))}
                </div>
                <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--ds-color-text-primary)' }}>{KANBAN_STAGES.find((s) => s.id === flowStage).name}</div>
                  <div style={small}>{KANBAN_STAGES.find((s) => s.id === flowStage).detail}</div>
                  <div style={small}>Next stage: {nextStage(flowStage) || 'done — card leaves the board'}</div>
                </Card>
                <div><h3 style={h3}>✏️ Spec editor — the cheapest place to catch a defect</h3></div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">
                  {SPEC_PARTS.map((p) => (
                    <div key={p.id}>
                      <label style={{ fontSize: '11px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>{p.name}</label>
                      <textarea value={spec[p.id]} onChange={(e) => setSpec({ ...spec, [p.id]: e.target.value })} rows={3} style={{ ...sel, minHeight: '64px' }} />
                      <div style={small}>{p.detail}</div>
                    </div>
                  ))}
                </Grid>
                {specCheck.complete
                  ? <Callout type="success"><strong>Spec complete.</strong> Requirements, design, and todo are all present — this card may move to approval.</Callout>
                  : <Callout type="warning"><strong>Spec incomplete.</strong> Missing: {specCheck.missing.join(', ')}. Fixing a sentence here beats reworking a build later.</Callout>}
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'fail' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={3}>
                <div><h3 style={h3}>📊 Four ways it goes wrong</h3>
                  <p style={small}>Same four patterns show up wherever agents share work. Each has a visible symptom and a structural fix.</p></div>
                <Table columns={FAILURE_COLS} data={FAILURE_MODES} sortable={false} />
              </Stack>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={h3}>🎚️ Role-tightness dial — broad roles breed politics</h3>
                  <p style={small}>Widen the role and remove the board to watch the warning appear; tighten roles and add the board to clear it.</p></div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <label style={{ fontSize: '11px', color: 'var(--ds-color-text-primary)', fontWeight: 'bold' }}>Role breadth: {breadth}</label>
                    <input type="range" min="0" max="2" value={breadth === 'broad' ? 0 : breadth === 'balanced' ? 1 : 2} onChange={(e) => setBreadth(['broad', 'balanced', 'tight'][+e.target.value])} style={{ width: '100%', margin: '8px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', ...small }}><span>broad</span><span>balanced</span><span>tight</span></div>
                    <label style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', display: 'block', marginTop: '10px' }}>
                      <input type="checkbox" checked={usesBoard} onChange={(e) => setUsesBoard(e.target.checked)} /> task board in use
                    </label>
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${tight.status === 'healthy' ? TEAL : tight.status === 'politics-risk' ? RED : AMBER}`, transition: 'border-color 0.3s ease' }}>
                    <Badge variant="default">{tight.status}</Badge>
                    <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)', marginTop: '8px' }}>{tight.warning}</div>
                    <div style={{ ...small, marginTop: '8px' }}>
                      {breadth === 'broad' ? 'A broad role says "handle messaging" — three agents each claim it.' : breadth === 'balanced' ? 'A balanced role says "draft replies for card X" — ownership is scoped.' : 'A tight role says "draft the reply, reviewer sends it" — no overlap left.'}
                    </div>
                  </Card>
                </Grid>
                {tight.status === 'politics-risk' && <Callout type="danger"><strong>Office politics warning:</strong> over-broad roles plus no board means agents negotiate with each other instead of doing the card. Split duties and route everything through the board.</Callout>}
                {tight.status === 'healthy' && <Callout type="success"><strong>Healthy:</strong> tight roles plus a visible board — each worker owns a slice and handoffs are written down.</Callout>}
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'account' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={3}>
                <div><h3 style={h3}>🧭 Accountability starts with a person at the top</h3></div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-2)">
                  {ACCOUNTABILITY_RULES.map((r) => (
                    <Card key={r.id} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${TEAL_DARK}` }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--ds-color-text-primary)' }}>{r.rule}</div>
                      <div style={small}>{r.detail}</div>
                    </Card>
                  ))}
                </Grid>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
                  {DAY_ONE_NEEDS.map((n) => (
                    <Card key={n.id} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${PURPLE}` }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--ds-color-text-primary)' }}>Day one: {n.name}</div>
                      <div style={small}>{n.detail}</div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={3}>
                <div><h3 style={h3}>🔍 Review the plan, not the pile</h3>
                  <p style={small}>Nobody can carefully review thirty finished outputs in an hour. Move the input slider: approving a one-page plan fits the shift; proofreading the whole pile does not.</p></div>
                <label style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)' }}>Finished outputs awaiting review: {outputs}</label>
                <input type="range" min="1" max="60" value={outputs} onChange={(e) => setOutputs(+e.target.value)} style={{ width: '100%' }} />
                <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${cap.feasible ? TEAL : RED}` }}>
                  <div style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)' }}>Review load: {cap.needed} min needed vs {cap.minutesAvailable} min available.</div>
                  <div style={{ fontSize: '12px', color: cap.feasible ? TEAL_DARK : RED, marginTop: '4px' }}>{cap.verdict}</div>
                </Card>
                {!cap.feasible && <Callout type="warning"><strong>Shrink the batch or review earlier.</strong> Approve the spec for five cards now instead of auditing thirty outputs later.</Callout>}
              </Stack>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={3}>
                <div><h3 style={h3}>🧩 Workflow vs process</h3></div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
                  {WORKFLOW_VS_PROCESS.map((w) => (
                    <Card key={w.item} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${AMBER}` }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--ds-color-text-primary)' }}>{w.item}</div>
                      <div style={small}>{w.meaning}</div>
                    </Card>
                  ))}
                </Grid>
                <Callout type="tip"><strong>Memory aid:</strong> the workflow is the road one card drives; the process is the traffic code every card obeys.</Callout>
                <div><h3 style={h3}>💻 Chart check in code</h3></div>
                <CodeBlock language="python" code={PYTHON_ORG_CODE} />
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
