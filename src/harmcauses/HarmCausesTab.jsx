import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  HARMS, CAUSES, LINKS, FIX_STRATEGY, HARM_WORKFLOW,
  causesForHarm, harmsForCause, mitigationFor, residualHarm,
  HARM_PHASE1, HARM_PHASE2, LAYERS,
} from './harmCausesEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'matrix', icon: '🗂️', label: '1. Harm ↔ Cause Matrix', desc: 'Six harms, nine causes' },
  { id: 'trace', icon: '🔬', label: '2. Cause Tracer', desc: 'Pick a harm, see causes' },
  { id: 'sim', icon: '🎛️', label: '3. Mitigation Simulator', desc: 'Toggle controls, watch residual' },
  { id: 'workflow', icon: '📋', label: '4. Workflow + Gate', desc: 'Discovery pipeline & prompt' },
];

// ── 1. Matrix ───────────────────────────────────────────────────────────────

function HarmMatrix() {
  const causeCols = CAUSES.map((c) => ({
    key: c.id, header: `${c.icon} ${c.name.split(' ')[0]}`, sortable: false,
    render: (v) => {
      if (!v) return <span style={{ color: 'var(--ds-color-text-disabled, #D1D5DB)' }}>·</span>;
      const stars = '●'.repeat(v);
      return <span style={{ color: v >= 3 ? RED : AMBER, fontWeight: 800 }}>{stars}</span>;
    },
  }));
  const matrix = HARMS.map((h) => {
    const row = { name: `${h.icon} ${h.name}` };
    for (const c of CAUSES) {
      const link = LINKS.find((l) => l.harm === h.id && l.cause === c.id);
      row[c.id] = link ? link.strength : 0;
    }
    return row;
  });

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🗂️ Harms don't float free — every harm has a technical cause</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Dot strength = how tightly the cause drives the harm (●○○ weak · ●●● strong). Harms are the outcomes people feel; causes are the engineering decisions that produce them.
            </p>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <Table columns={[{ key: 'name', header: 'Harm', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> }, ...causeCols]} data={matrix} sortable={false} />
          </div>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🏭 Cause layers — where the fix lives determines when it ships</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Six layers, from the slowest durable fix (data) to the fastest protective fix (deployment). A mature program uses all three strategies at once.
            </p>
          </div>
          <Grid columns={3} gap="var(--ds-space-4)">
            {LAYERS.map((l) => (
              <Card key={l.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK }}>{l.icon} {l.id}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{l.note}</div>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 2. Cause tracer ─────────────────────────────────────────────────────────

function CauseTracer() {
  const [harmId, setHarmId] = useState('discrimination');
  const causes = useMemo(() => causesForHarm(harmId), [harmId]);
  const harm = HARMS.find((h) => h.id === harmId);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🔬 Cause tracer — pick a harm, walk the chain</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            A harm without a named technical cause is a complaint, not an engineering task. Trace it before you try to fix it.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {HARMS.map((h) => (
            <button key={h.id} onClick={() => setHarmId(h.id)} style={{
              padding: '8px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, minHeight: 44,
              border: `1.5px solid ${harmId === h.id ? PURPLE : 'var(--ds-color-border-subtle)'}`,
              background: harmId === h.id ? PURPLE : 'var(--ds-color-bg-surface)',
              color: harmId === h.id ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
            }}>{h.icon} {h.name}</button>
          ))}
        </div>
        <div style={{
          fontSize: 14, fontWeight: 700, padding: 12, borderRadius: 8,
          background: '#F9F1DC', color: AMBER,
        }}>
          {harm.icon} {harm.name} — {harm.blurb} · severity {harm.severity}/4
        </div>
        <Grid columns={3} gap="var(--ds-space-4)">
          {causes.map((c) => {
            const m = mitigationFor(c.id);
            return (
              <Card key={c.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 13, color: TEAL_DARK }}>{c.icon} {c.name}</strong>
                  <Badge variant="default">{c.layer}</Badge>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 6 }}>{c.detail}</div>
                <div style={{ marginTop: 8, fontSize: 12, color: PURPLE, fontWeight: 600 }}>
                  Strength: {'●'.repeat(c.strength)}{'○'.repeat(3 - c.strength)}
                </div>
                {m && (
                  <div style={{ marginTop: 8, fontSize: 12, color: TEAL_DARK, borderTop: '1px solid var(--ds-color-border-subtle)', paddingTop: 8 }}>
                    <strong>Control:</strong> {m.lever}
                  </div>
                )}
              </Card>
            );
          })}
        </Grid>
      </Stack>
    </Card>
  );
}

// ── 3. Mitigation simulator ─────────────────────────────────────────────────

function MitigationSim() {
  const [harmId, setHarmId] = useState('discrimination');
  const [enabled, setEnabled] = useState([]);
  const links = useMemo(() => LINKS.filter((l) => l.harm === harmId), [harmId]);
  const r = useMemo(() => residualHarm(harmId, enabled), [harmId, enabled]);

  const toggle = (causeId) => setEnabled((prev) =>
    prev.includes(causeId) ? prev.filter((c) => c !== causeId) : [...prev, causeId]);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🎛️ Mitigation simulator — toggle a control, watch residual harm fall</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            No single control eliminates a harm. Residual risk is what remains after every lever you actually pull — name it, don't assume it away.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {HARMS.map((h) => (
            <button key={h.id} onClick={() => { setHarmId(h.id); setEnabled([]); }} style={{
              padding: '8px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, minHeight: 44,
              border: `1.5px solid ${harmId === h.id ? PURPLE : 'var(--ds-color-border-subtle)'}`,
              background: harmId === h.id ? PURPLE : 'var(--ds-color-bg-surface)',
              color: harmId === h.id ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
            }}>{h.icon} {h.name}</button>
          ))}
        </div>
        <Grid columns={2} gap="var(--ds-space-4)">
          {links.map((l) => {
            const c = CAUSES.find((x) => x.id === l.cause);
            const m = mitigationFor(l.cause);
            const on = enabled.includes(l.cause);
            return (
              <button key={l.cause} onClick={() => toggle(l.cause)} style={{
                textAlign: 'left', padding: 'var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', cursor: 'pointer', minHeight: 44,
                border: `1.5px solid ${on ? TEAL : 'var(--ds-color-border-subtle)'}`,
                background: on ? '#E8F3F3' : 'var(--ds-color-bg-surfaceHover)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: 13, color: on ? TEAL_DARK : 'var(--ds-color-text-primary)' }}>
                    {on ? '✅ ' : '⬜ '}{c.icon} {c.name}
                  </strong>
                  <Badge variant={on ? 'success' : 'default'}>{on ? 'Control ON' : 'Control off'}</Badge>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{c.detail}</div>
                {m && <div style={{ fontSize: 12, color: PURPLE, marginTop: 6 }}><strong>Lever:</strong> {m.lever}</div>}
              </button>
            );
          })}
        </Grid>
        <div style={{ height: 18, borderRadius: 9, background: '#E5E7EB', overflow: 'hidden' }}>
          <div style={{
            width: `${r.pct}%`, height: '100%',
            background: r.pct <= 40 ? TEAL : r.pct <= 70 ? AMBER : RED,
            transition: 'width .3s, background .3s',
          }} />
        </div>
        <div style={{
          fontSize: 14, fontWeight: 800, padding: 10, borderRadius: 8,
          background: r.pct <= 40 ? '#E8F3F3' : r.pct <= 70 ? '#F9F1DC' : '#FDF0EC',
          color: r.pct <= 40 ? TEAL_DARK : r.pct <= 70 ? AMBER : RED,
        }}>
          Residual harm: {r.residual} / {r.base} ({r.pct}% of unmitigated) —{' '}
          {r.pct <= 40 ? 'most cause strength neutralized; sign off the remainder' : r.pct <= 70 ? 'partially controlled; remaining causes still drive real damage' : 'largely unmitigated — root causes still active'}
        </div>
        <Callout type="info" title="Residual risk is a signature, not a rounding error">
          The number that matters at review is not "zero" — it is the residual someone is willing to accept, in writing, with their name on it.
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
            <h3 style={{ margin: 0 }}>📋 Harm-discovery workflow — five steps from hazard to signed residual</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Skipping step 3 is how "we take safety seriously" becomes a slide. Every harm must land on a named technical cause before any control is chosen.
            </p>
          </div>
          <Table
            columns={[
              { key: 'step', header: '#', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
              { key: 'name', header: 'Step', render: (v) => <strong>{v}</strong> },
              { key: 'job', header: 'Job', sortable: false },
              { key: 'output', header: 'Output', render: (v) => <span style={{ color: TEAL_DARK, fontSize: 12 }}>{v}</span> },
            ]}
            data={HARM_WORKFLOW}
            sortable={false}
          />
          <Grid columns={3} gap="var(--ds-space-4)">
            {FIX_STRATEGY.map((f) => (
              <Card key={f.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK }}>{f.name}</div>
                <div style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{f.when}</div>
                <div style={{ fontSize: 12, marginTop: 6 }}>Examples: {f.examples.join(' · ')}</div>
                <div style={{ fontSize: 12, color: AMBER, marginTop: 6, fontWeight: 600 }}>{f.tradeoff}</div>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🚦 Two-phase gated harm report — nothing executes before "approved"</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Phase 1 only restates scope, asks questions, and describes the schema. Type "approved" below to open Phase 2.
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
              <div style={{ fontSize: 11.5, fontWeight: 500, marginTop: 2, opacity: 0.85 }}>Restate · ask · describe schema · STOP</div>
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
                {approved ? 'Emit the harm report' : 'Requires the word "approved"'}
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
          {phase === 1 && <CodeBlock language="text" code={HARM_PHASE1} />}
          {phase === 2 && (
            <Stack gap={4}>
              <div style={{ fontSize: 14, fontWeight: 800, padding: 10, borderRadius: 8, background: '#E8F3F3', color: TEAL_DARK }}>
                Gate passed — Phase 2 executing. Sample report below.
              </div>
              <CodeBlock language="markdown" code={[
                '| Harm | Technical Cause | Cause Layer | Control | Residual Risk |',
                '|---|---|---|---|---|',
                ...HARMS.slice(0, 4).map((h) => {
                  const top = causesForHarm(h.id)[0];
                  const m = mitigationFor(top.id);
                  return `| ${h.name} | ${top.name} | ${top.layer} | ${m.lever} | Residual ${m.residual}/3 after control |`;
                }),
              ].join('\n')} />
              <CodeBlock language="text" code={HARM_PHASE2} />
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

// ── Tab ─────────────────────────────────────────────────────────────────────

export default function HarmCausesTab() {
  const [activeSubTab, setActiveSubTab] = useState('matrix');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="harmcauses"
        moduleLabel="Foundations"
        title="AI Harms & Their Technical Causes"
        description="Harms are the outcomes people feel; causes are the engineering decisions that produce them. A six-harm × nine-cause matrix, a cause tracer, a mitigation simulator that names residual risk, a five-step discovery workflow, and a two-phase gated harm report — detect causes before proposing controls."
        metrics={[
          { label: 'Harms mapped', value: String(HARMS.length) },
          { label: 'Technical causes', value: String(CAUSES.length) },
          { label: 'Cause layers', value: String(LAYERS.length) },
          { label: 'Workflow steps', value: String(HARM_WORKFLOW.length) },
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
        {activeSubTab === 'matrix' && <HarmMatrix />}
        {activeSubTab === 'trace' && <CauseTracer />}
        {activeSubTab === 'sim' && <MitigationSim />}
        {activeSubTab === 'workflow' && <WorkflowGate />}
      </Container>
    </div>
  );
}
