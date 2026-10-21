import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  SURFACES, VECTORS, LIFECYCLE, CONTROLS, CHAIN_COMPARISON,
  DEFENSE_WORKFLOW, vectorsForSurface, simulateAll,
  SUPPLY_PHASE1, SUPPLY_PHASE2,
} from './agentUiSupplyEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'surfaces', icon: '🕸️', label: '1. Surfaces & Vectors', desc: 'What the agent consumes' },
  { id: 'lifecycle', icon: '♻️', label: '2. Skill Lifecycle', desc: 'Five-phase risk walk' },
  { id: 'sim', icon: '🛡️', label: '3. Control Simulator', desc: 'Toggle defenses, stop attacks' },
  { id: 'workflow', icon: '📋', label: '4. Workflow + Gate', desc: 'Defense pipeline & prompt' },
];

// ── 1. Surfaces & vectors ───────────────────────────────────────────────────

function SurfacesView() {
  const [surfaceId, setSurfaceId] = useState('webpage');
  const vectors = useMemo(() => vectorsForSurface(surfaceId), [surfaceId]);
  const surface = SURFACES.find((s) => s.id === surfaceId);

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🕸️ The agent's supply chain is whatever it reads at runtime</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              A traditional app has a finite dependency manifest. An agent acquires dependencies dynamically — pages, skills, tools, memory, inboxes — through its own reasoning. Every one of them is an unvetted supplier.
            </p>
          </div>
          <Grid columns={3} gap="var(--ds-space-4)">
            {SURFACES.map((s) => (
              <button key={s.id} onClick={() => setSurfaceId(s.id)} style={{
                textAlign: 'left', padding: 'var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', cursor: 'pointer', minHeight: 44,
                border: `1.5px solid ${surfaceId === s.id ? PURPLE : 'var(--ds-color-border-subtle)'}`,
                background: surfaceId === s.id ? PURPLE : 'var(--ds-color-bg-surfaceHover)',
                color: surfaceId === s.id ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-primary)',
              }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{s.icon} {s.name}</div>
                <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{s.detail}</div>
              </button>
            ))}
          </Grid>
          <div style={{ fontSize: 14, fontWeight: 700, color: TEAL_DARK }}>
            {surface.icon} Vectors against this surface:
          </div>
          {vectors.length === 0 ? (
            <Callout type="info" title="No named vector — still untrusted">
              Absence of a published attack is not trust. Treat the surface as hostile anyway.
            </Callout>
          ) : (
            <Table
              columns={[
                { key: 'name', header: 'Vector', render: (v) => <strong style={{ color: RED }}>{v}</strong> },
                { key: 'severity', header: 'Severity', render: (v) => <Badge variant={v >= 4 ? 'danger' : 'warning'}>{v}/5</Badge> },
                { key: 'payload', header: 'Payload shape', sortable: false },
                { key: 'impact', header: 'Impact', sortable: false },
              ]}
              data={vectors}
              sortable={false}
            />
          )}
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>⚖️ Static vs dynamic supply chain — why old controls miss</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Package scanners assume a finite list of artifacts verified before deployment. Agents pick dependencies mid-task — the attack moves from binary exploits to semantic manipulation of context.
            </p>
          </div>
          <Table
            columns={[
              { key: 'dim', header: 'Dimension', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
              { key: 'traditional', header: 'Traditional software', sortable: false },
              { key: 'agentic', header: 'Agentic runtime', render: (v) => <span style={{ color: RED }}>{v}</span> },
            ]}
            data={CHAIN_COMPARISON}
            sortable={false}
          />
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 2. Lifecycle ────────────────────────────────────────────────────────────

function LifecycleView() {
  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>♻️ Skill lifecycle — five phases, five places to intervene</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            The marketplace problem is a supply-chain problem wearing a new badge: authorship, publication, installation, execution, persistence — each phase has its own failure mode.
          </p>
        </div>
        <Grid columns={5} gap="var(--ds-space-3)">
          {LIFECYCLE.map((p, i) => (
            <Card key={p.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)', position: 'relative' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: PURPLE }}>PHASE {i + 1}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK, marginTop: 2 }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>Actor: {p.actor}</div>
              <div style={{ fontSize: 12, marginTop: 8, color: RED }}>{p.risk}</div>
            </Card>
          ))}
        </Grid>
        <Callout type="warning" title="Scanner evasion is the new normal">
          Oversized padding to dodge size thresholds, previously-unseen logic with no malware signature: automated scanning alone cannot clear a skill registry. Human review plus provenance signing is the floor.
        </Callout>
        <Table
          columns={[
            { key: 'name', header: 'Control', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
            { key: 'desc', header: 'What it enforces', sortable: false },
          ]}
          data={CONTROLS}
          sortable={false}
        />
      </Stack>
    </Card>
  );
}

// ── 3. Control simulator ────────────────────────────────────────────────────

function ControlSim() {
  const [enabled, setEnabled] = useState([]);
  const results = useMemo(() => simulateAll(enabled), [enabled]);
  const blocked = results.filter((r) => r.blocked).length;

  const toggle = (id) => setEnabled((prev) =>
    prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🛡️ Control simulator — toggle defenses, watch attacks succeed or fail</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            No single pattern stops every vector. The question is which residual risk remains after the controls you actually ship.
          </p>
        </div>
        <Grid columns={3} gap="var(--ds-space-4)">
          {CONTROLS.map((c) => {
            const on = enabled.includes(c.id);
            return (
              <button key={c.id} onClick={() => toggle(c.id)} style={{
                textAlign: 'left', padding: 'var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', cursor: 'pointer', minHeight: 44,
                border: `1.5px solid ${on ? TEAL : 'var(--ds-color-border-subtle)'}`,
                background: on ? '#E8F3F3' : 'var(--ds-color-bg-surfaceHover)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 13, color: on ? TEAL_DARK : 'var(--ds-color-text-primary)' }}>
                    {on ? '✅ ' : '⬜ '}{c.name}
                  </strong>
                  <Badge variant={on ? 'success' : 'default'}>{on ? 'ON' : 'off'}</Badge>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{c.desc}</div>
              </button>
            );
          })}
        </Grid>
        <div style={{
          fontSize: 15, fontWeight: 800, padding: 12, borderRadius: 8, textAlign: 'center',
          background: blocked === results.length ? '#E8F3F3' : blocked === 0 ? '#FDF0EC' : '#F9F1DC',
          color: blocked === results.length ? TEAL_DARK : blocked === 0 ? RED : AMBER,
        }}>
          {blocked}/{results.length} vectors blocked —{' '}
          {blocked === results.length
            ? 'full stack: every named vector has at least one architectural control'
            : blocked === 0
              ? 'no controls active: every vector succeeds at agent privileges'
              : 'partial coverage: remaining vectors define your residual risk'}
        </div>
        <Table
          columns={[
            { key: 'name', header: 'Vector', render: (v) => <strong>{v}</strong> },
            { key: 'severity', header: 'Severity', render: (v) => <span style={{ color: v >= 4 ? RED : AMBER, fontWeight: 700 }}>{v}/5</span> },
            {
              key: 'blocked', header: 'Outcome', render: (v, row) => (
                <Badge variant={v ? 'success' : 'danger'}>{v ? `Blocked by ${row.blockers.join(' + ')}` : 'SUCCEEDS'}</Badge>
              ),
            },
            {
              key: 'remainingRisk', header: 'Residual', sortable: false,
              render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>{v === 0 ? '0' : v === 1 ? '1.0' : '0.4'}</span>,
            },
          ]}
          data={results}
          sortable={false}
        />
        <Callout type="info" title="Controls compose; they don't replace each other">
          Provenance stops typosquats but not a signed-but-malicious update. Sandboxes limit blast radius but don't stop exfiltration through allowed channels. Layer them.
        </Callout>
      </Stack>
    </Card>
  );
}

// ── 4. Workflow + gate ──────────────────────────────────────────────────────

function WorkflowGate() {
  const [phase, setPhase] = useState(1);
  const [reply, setReply] = useState('');
  const approved = reply.trim().toLowerCase() === 'approved';

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>📋 Defense workflow — from surface inventory to rehearsed incidents</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Step 1 is the one teams skip: you cannot defend a supply chain you have not enumerated. Answer: every surface the agent reads is untrusted by default.
            </p>
          </div>
          <Table
            columns={[
              { key: 'step', header: '#', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
              { key: 'name', header: 'Step', render: (v) => <strong>{v}</strong> },
              { key: 'job', header: 'Job', sortable: false },
              { key: 'output', header: 'Output', render: (v) => <span style={{ color: TEAL_DARK, fontSize: 12 }}>{v}</span> },
            ]}
            data={DEFENSE_WORKFLOW}
            sortable={false}
          />
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🚦 Two-phase gated supply-chain report</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Phase 1 inventories surfaces and asks; Phase 2 emits the risk table — only after "approved".
            </p>
          </div>
          <Grid columns={2} gap="var(--ds-space-4)">
            <button onClick={() => setPhase(1)} style={{
              padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', cursor: 'pointer',
              border: `1.5px solid ${phase === 1 ? PURPLE : 'var(--ds-color-border-subtle)'}`,
              background: phase === 1 ? PURPLE : 'var(--ds-color-bg-surface)',
              color: phase === 1 ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
              fontWeight: phase === 1 ? 700 : 500, fontSize: 13, minHeight: 44, textAlign: 'left',
            }}>
              Phase 1 — Alignment
              <div style={{ fontSize: 11.5, fontWeight: 500, marginTop: 2, opacity: 0.85 }}>Inventory · ask · describe schema · STOP</div>
            </button>
            <button onClick={() => approved && setPhase(2)} disabled={!approved} style={{
              padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)',
              cursor: approved ? 'pointer' : 'not-allowed',
              border: `1.5px solid ${phase === 2 ? TEAL : 'var(--ds-color-border-subtle)'}`,
              background: phase === 2 ? TEAL : 'var(--ds-color-bg-surface)',
              color: phase === 2 ? 'var(--ds-color-text-inverse)' : approved ? 'var(--ds-color-text-primary)' : 'var(--ds-color-text-disabled, #9CA3AF)',
              fontWeight: phase === 2 ? 700 : 500, fontSize: 13, minHeight: 44, textAlign: 'left',
              opacity: approved ? 1 : 0.6,
            }}>
              Phase 2 — Execute {approved ? '' : '(locked)'}
              <div style={{ fontSize: 11.5, fontWeight: 500, marginTop: 2, opacity: 0.85 }}>
                {approved ? 'Emit the risk report' : 'Requires the word "approved"'}
              </div>
            </button>
          </Grid>
          <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            Your reply to Phase 1 (type <strong>approved</strong> to unlock Phase 2)
            <input type="text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="e.g. approved"
              style={{
                width: '100%', marginTop: 4, padding: '9px 10px', borderRadius: 8,
                border: `1.5px solid ${approved ? TEAL : 'var(--ds-color-border-subtle)'}`,
                background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)', fontSize: 13, minHeight: 44,
              }} aria-label="approval reply" />
          </label>
          {phase === 1 && <CodeBlock language="text" code={SUPPLY_PHASE1} />}
          {phase === 2 && (
            <Stack gap={4}>
              <div style={{ fontSize: 14, fontWeight: 800, padding: 10, borderRadius: 8, background: '#E8F3F3', color: TEAL_DARK }}>
                Gate passed — Phase 2 executing. Sample report below.
              </div>
              <CodeBlock language="markdown" code={[
                '| Surface | Attack Vector | Impact | Control | Residual Risk |',
                '|---|---|---|---|---|',
                '| Skill marketplace | Backdoored skill | Credential theft at agent privileges | Provenance signing + capability sandbox + egress monitoring | Signed-but-malicious updates remain |',
                '| Retrieved webpage | Indirect instruction injection | Agent follows attacker goals | Quarantined tool-less reader + output policy gate | Poisoned insights may still mislead a human |',
                '| Shared memory | Memory poisoning | Persistent behavior change | Write provenance + anomaly monitor | Slow-drift attacks below alert threshold |',
              ].join('\n')} />
              <CodeBlock language="text" code={SUPPLY_PHASE2} />
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

// ── Tab ─────────────────────────────────────────────────────────────────────

export default function AgentUiSupplyTab() {
  const [activeSubTab, setActiveSubTab] = useState('surfaces');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="agentuisupply"
        moduleLabel="Agents & Frameworks"
        title="Agentic UI & Supply-Chain Risk: The Agent Is Only as Safe as What It Reads"
        description="Agents acquire dependencies at runtime — pages, skills, tool descriptors, memory, inboxes — through their own reasoning, not a build manifest. A surface-and-vector taxonomy, a five-phase skill-lifecycle risk walk, a control simulator that shows which defenses stop which attacks, a defense workflow, and a two-phase gated supply-chain report."
        metrics={[
          { label: 'Surfaces', value: String(SURFACES.length) },
          { label: 'Attack vectors', value: String(VECTORS.length) },
          { label: 'Lifecycle phases', value: String(LIFECYCLE.length) },
          { label: 'Controls', value: String(CONTROLS.length) },
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
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--ds-font-size-body)', marginBottom: 2 }}>
                <span>{tab.icon}</span><span>{tab.label}</span>
              </div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: activeSubTab === tab.id ? 0.9 : 0.7 }}>{tab.desc}</div>
            </button>
          ))}
        </div>
        {activeSubTab === 'surfaces' && <SurfacesView />}
        {activeSubTab === 'lifecycle' && <LifecycleView />}
        {activeSubTab === 'sim' && <ControlSim />}
        {activeSubTab === 'workflow' && <WorkflowGate />}
      </Container>
    </div>
  );
}
