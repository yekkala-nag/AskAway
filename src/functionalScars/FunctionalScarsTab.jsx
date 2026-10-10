import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  PALETTE,
  FOUR_LAYERS,
  INTERVENTION_LEVELS,
  getInterventionStats,
  tradeoffScore,
  ENFORCEMENT_CASES,
  reductionPercent,
  MECHANISM_LESSON,
  SCAR_FIELDS,
  SEVERITIES,
  SCAR_EVENTS,
  TOOL_MATCHERS,
  DEFAULT_SCAR,
  buildScar,
  generateScarJSON,
  fireScarAgainstSamples,
  SAMPLE_COMMANDS,
  SCOPE_LIMITS,
  NON_CLAIMS,
  suggestRetirementDays,
  QUOTING_SEMANTICS,
  HOOK_SKETCH,
} from './functionalScarsEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = PALETTE.TEAL;
const TEAL_DARK = PALETTE.TEAL_DARK;
const PURPLE = PALETTE.PURPLE;
const RED = PALETTE.RED;
const AMBER = PALETTE.AMBER;

const SUBTABS = [
  { id: 'layers', icon: '🧱', label: '1. Four Layers', desc: 'Record → re-find → read → apply' },
  { id: 'measure', icon: '📉', label: '2. Measure Before/After', desc: 'Three enforcement cases' },
  { id: 'builder', icon: '🧪', label: '3. Scar Contract Builder', desc: 'Build a scar, fire it at commands' },
  { id: 'scope', icon: '🔭', label: '4. Scope Limits', desc: 'What scars cannot do' },
];

function SubTabNav({ active, onChange }) {
  return (
    <div style={{
      display: 'flex',
      gap: 'var(--ds-space-2)',
      marginBottom: 'var(--ds-space-6)',
      background: 'var(--ds-color-bg-surface)',
      padding: 'var(--ds-space-2)',
      borderRadius: 'var(--ds-radius-lg)',
      border: '1px solid var(--ds-color-border-subtle)',
      overflowX: 'auto',
    }}>
      {SUBTABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            minWidth: '180px',
            padding: 'var(--ds-space-3) var(--ds-space-3)',
            borderRadius: 'var(--ds-radius-md)',
            border: 'none',
            background: active === tab.id ? TEAL_DARK : 'transparent',
            color: active === tab.id ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all var(--ds-motion-duration-base)',
            fontWeight: active === tab.id ? 'var(--ds-font-weight-semibold)' : 'var(--ds-font-weight-medium)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--ds-font-size-bodySm)', marginBottom: '2px' }}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </div>
          <div style={{ fontSize: '11px', opacity: active === tab.id ? 0.9 : 0.7 }}>
            {tab.desc}
          </div>
        </button>
      ))}
    </div>
  );
}

function FourLayerDiagram() {
  const [lit, setLit] = useState(3);
  return (
    <div>
      <svg viewBox="0 0 640 170" width="100%" role="img" aria-label="Four correction layers pipeline ending on the action path">
        {FOUR_LAYERS.map((l, i) => {
          const x = 10 + i * 158;
          const active = lit === i;
          const onPath = l.onActionPath;
          return (
            <g key={l.id} onClick={() => setLit(i)} style={{ cursor: 'pointer' }}>
              <rect
                x={x} y={30} width={140} height={90} rx={10}
                fill={onPath ? RED : active ? TEAL : 'var(--ds-color-bg-surface)'}
                fillOpacity={onPath ? 0.14 : active ? 0.18 : 1}
                stroke={onPath ? RED : active ? TEAL : TEAL_DARK}
                strokeWidth={active || onPath ? 3 : 1.5}
                style={{ transition: 'all 0.3s ease' }}
              />
              <text x={x + 70} y={52} textAnchor="middle" fontSize="11" fontWeight="bold" fill="var(--ds-color-text-tertiary)">
                LAYER {l.step}
              </text>
              <text x={x + 70} y={72} textAnchor="middle" fontSize="13" fontWeight="bold" fill="var(--ds-color-text-primary)">
                {l.name}
              </text>
              <text x={x + 70} y={90} textAnchor="middle" fontSize="10" fill={onPath ? RED : TEAL_DARK}>
                {onPath ? '● on action path' : '○ advisory only'}
              </text>
              <text x={x + 70} y={106} textAnchor="middle" fontSize="10" fill="var(--ds-color-text-secondary)">
                {['notes', 'retrieval', 'prompt hint', 'deny the call'][i]}
              </text>
              {i < 3 && (
                <text x={x + 149} y={80} textAnchor="middle" fontSize="16" fill={TEAL_DARK}>→</text>
              )}
            </g>
          );
        })}
        <text x={320} y={150} textAnchor="middle" fontSize="11" fill="var(--ds-color-text-secondary)">
          Click a layer to inspect it — only layer 4 can refuse the action.
        </text>
      </svg>
      <Card style={{ padding: '12px 16px', borderLeft: '4px solid ' + (FOUR_LAYERS[lit].onActionPath ? RED : TEAL) }}>
        <strong style={{ fontSize: '13px', color: 'var(--ds-color-text-primary)' }}>
          Layer {FOUR_LAYERS[lit].step}: {FOUR_LAYERS[lit].name}
        </strong>
        <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '4px 0' }}>
          {FOUR_LAYERS[lit].mechanism}
        </p>
        <p style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', margin: 0 }}>
          Failure mode: {FOUR_LAYERS[lit].failureMode}
        </p>
      </Card>
    </div>
  );
}

function InterventionSimulator() {
  const [levelId, setLevelId] = useState('pre-call-denial');
  const idx = INTERVENTION_LEVELS.findIndex((l) => l.id === levelId);
  const stats = getInterventionStats(levelId);
  const score = tradeoffScore(levelId);
  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
      <Stack gap={4}>
        <div>
          <h4 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>Intervention-strength ladder</h4>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Stronger interventions block more bad actions but cost more false positives. Pick a rung.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {INTERVENTION_LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevelId(l.id)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--ds-radius-md)',
                border: levelId === l.id ? '2px solid ' + TEAL_DARK : '1px solid var(--ds-color-border-default)',
                background: levelId === l.id ? 'rgba(58,155,159,0.12)' : 'var(--ds-color-bg-surface)',
                color: 'var(--ds-color-text-primary)',
                cursor: 'pointer',
                fontWeight: levelId === l.id ? 'bold' : 'normal',
                transition: 'all 0.25s ease',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
        <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
          Strength slider (mirrors the buttons)
          <input
            type="range" min={0} max={2} step={1} value={idx}
            onChange={(e) => setLevelId(INTERVENTION_LEVELS[Number(e.target.value)].id)}
            style={{ width: '100%', accentColor: TEAL_DARK }}
          />
        </label>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
            <span>Block rate — {(stats.blockRate * 100).toFixed(0)}%</span>
            <span>False-positive cost — {(stats.falsePositiveRate * 100).toFixed(0)}%</span>
          </div>
          <div style={{ background: 'var(--ds-color-bg-surfaceHover)', borderRadius: '6px', height: '14px', marginTop: '6px', overflow: 'hidden' }}>
            <div style={{
              width: (stats.blockRate * 100).toFixed(0) + '%',
              height: '100%', background: TEAL,
              transition: 'width 0.4s ease',
            }} />
          </div>
          <div style={{ background: 'var(--ds-color-bg-surfaceHover)', borderRadius: '6px', height: '14px', marginTop: '6px', overflow: 'hidden' }}>
            <div style={{
              width: (stats.falsePositiveRate * 100).toFixed(0) + '%',
              height: '100%', background: AMBER,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
        <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: 0 }}>
          {stats.note} Net tradeoff score (block − 3×false-positive): <strong>{score.toFixed(2)}</strong>.
          Pre-call denial blocks the most ({(INTERVENTION_LEVELS[1].blockRate * 100).toFixed(0)}%) at the highest friction cost.
        </p>
      </Stack>
    </Card>
  );
}

function ScarBuilder() {
  const [form, setForm] = useState({ ...DEFAULT_SCAR });
  const { scar, errors } = buildScar(form);
  const results = fireScarAgainstSamples(scar);
  const blocked = results.filter((r) => r.verdict === 'BLOCK').length;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <Stack gap={6}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🧪 Scar contract builder</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Six fields make a scar: id, name, rule, severity, event, tool-matcher. Edit them, then fire the scar at sample shell commands.
            </p>
          </div>
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
            <div>
              <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>id (slug)</label>
              <input value={form.id} onChange={set('id')} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>name</label>
              <input value={form.name} onChange={set('name')} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>rule (substring pattern)</label>
              <input value={form.rule} onChange={set('rule')} style={{ ...inputStyle, fontFamily: 'monospace' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>severity</label>
              <select value={form.severity} onChange={set('severity')} style={inputStyle}>
                {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>event</label>
              <select value={form.event} onChange={set('event')} style={inputStyle}>
                {SCAR_EVENTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>tool-matcher</label>
              <select value={form.toolMatcher} onChange={set('toolMatcher')} style={inputStyle}>
                {TOOL_MATCHERS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </Grid>
          {errors.length > 0 && (
            <Callout type="warning">
              <strong>Contract invalid:</strong> {errors.join('; ')}
            </Callout>
          )}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge variant="default">retire after ~{suggestRetirementDays(form.severity)} days</Badge>
            <Badge variant="default">{blocked} of {results.length} samples BLOCKed</Badge>
          </div>
          <CodeBlock language="json" code={generateScarJSON(scar)} filename="scar.json" />
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
        <Stack gap={4}>
          <div>
            <h4 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>Fire the scar — verdicts with exit-code semantics</h4>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              BLOCK exits <strong>2</strong> (denied by policy); PASS exits <strong>0</strong> (allowed). Try clearing the rule field — everything passes.
            </p>
          </div>
          <Stack gap={2}>
            {results.map((r) => (
              <div key={r.id} style={{
                padding: '10px 14px',
                background: r.verdict === 'BLOCK' ? 'rgba(180,85,58,0.08)' : 'rgba(58,155,159,0.08)',
                border: '1px solid ' + (r.verdict === 'BLOCK' ? RED : TEAL),
                borderRadius: '6px',
                transition: 'all 0.3s ease',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <code style={{ fontSize: '11px', color: 'var(--ds-color-text-primary)', whiteSpace: 'pre-wrap' }}>{r.command}</code>
                  <span style={{
                    fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace',
                    color: r.verdict === 'BLOCK' ? RED : TEAL_DARK,
                    background: 'var(--ds-color-bg-surface)',
                    padding: '2px 10px', borderRadius: '999px',
                    border: '1px solid ' + (r.verdict === 'BLOCK' ? RED : TEAL),
                  }}>
                    {r.verdict} · exit {r.exitCode}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>
                  tool: {r.tool} · reason: {r.reason}
                </div>
              </div>
            ))}
          </Stack>
          <CodeBlock language="bash" code={HOOK_SKETCH} filename="hook-sketch.sh" />
        </Stack>
      </Card>
    </Stack>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  fontSize: '13px',
  color: 'var(--ds-color-text-primary)',
  background: 'var(--ds-color-bg-surface)',
  border: '1px solid var(--ds-color-border-default)',
  borderRadius: '6px',
  boxSizing: 'border-box',
};

export default function FunctionalScarsTab() {
  const [activeSubTab, setActiveSubTab] = useState('layers');
  const [scarFieldIdx, setScarFieldIdx] = useState(0);

  const enforcementRows = ENFORCEMENT_CASES.map((c) => ({
    ...c,
    reduction: reductionPercent(c.before, c.after),
  }));

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="agents_frameworks"
        moduleLabel="Agent Systems & Frameworks [Functional Scars]"
        title="Functional Scars: Corrections That Sit on the Action Path"
        description="Notes and reminders cover the first three layers of a correction. The fourth layer — a small enforcement scar on the action path — is what actually stops the next mistake. Build scars, measure them, and know their limits."
        metrics={[
          { label: 'Correction Layers', value: '4 (1 Enforces)' },
          { label: 'Heredoc Writes', value: '6.7% → 0.8%' },
          { label: 'Scar Contract', value: '6 Fields' },
          { label: 'Default Denial', value: 'Exit Code 2' },
        ]}
      />

      <Container size="wide">
        <SubTabNav active={activeSubTab} onChange={setActiveSubTab} />

        {activeSubTab === 'layers' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🧱 Corrections need four layers</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Record the fix, re-find it, read it into context — then <strong>apply</strong> it. Notes and prompts cover layers 1–3. Layer 4 must sit on the action path, where it can refuse the call.
                  </p>
                </div>
                <FourLayerDiagram />
                <Callout type="danger">
                  <strong>The layer-4 rule:</strong> if no software sits between the agent and the action, the correction is a suggestion. Suggestions lose to momentum.
                </Callout>
              </Stack>
            </Card>
            <InterventionSimulator />
          </Stack>
        )}

        {activeSubTab === 'measure' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>📉 Measure before → after</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Illustrative teaching numbers from coached coding sessions. Enforcement beats reminders — and the quoting check wins by inspecting the mechanism, not the command name.
                  </p>
                </div>
                <Table
                  sortable={false}
                  columns={[
                    { key: 'label', header: 'Case' },
                    { key: 'mechanism', header: 'Mechanism' },
                    {
                      key: 'before', header: 'Before → After',
                      render: (v, row) => (
                        <span style={{ fontFamily: 'monospace', color: 'var(--ds-color-text-primary)' }}>
                          {row.before.toFixed(1)}% → {row.after.toFixed(1)}%
                        </span>
                      ),
                    },
                    {
                      key: 'reduction', header: 'Reduction',
                      render: (v, row) => (
                        <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: row.reduction > 50 ? TEAL_DARK : AMBER }}>
                          −{row.reduction.toFixed(1)}%
                        </span>
                      ),
                    },
                  ]}
                  data={enforcementRows}
                />
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
                  {enforcementRows.map((r) => (
                    <Card key={r.id} style={{ padding: '14px', borderLeft: '4px solid ' + (r.reduction > 50 ? TEAL : AMBER) }}>
                      <strong style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)' }}>{r.label}</strong>
                      <div style={{ background: 'var(--ds-color-bg-surfaceHover)', borderRadius: '6px', height: '10px', margin: '8px 0', overflow: 'hidden' }}>
                        <div style={{ width: ((r.after / r.before) * 100).toFixed(0) + '%', height: '100%', background: r.reduction > 50 ? TEAL : AMBER, transition: 'width 0.5s ease' }} />
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)' }}>
                        residual {r.after.toFixed(1)}% of {r.unit}
                      </div>
                    </Card>
                  ))}
                </Grid>
                <Callout type="tip">
                  <strong>{MECHANISM_LESSON}</strong> The quoting check fires on the expansion pattern wherever it appears — heredoc, inline substitution, or generated script — instead of maintaining a brittle allowlist of command names.
                </Callout>
                <Callout type="warning">
                  Reminder-only hooks plateau: with a ~12% open rate, the reminder is skipped far more often than it is read. Measure the open rate before trusting a nudge.
                </Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'builder' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>📋 The six scar fields</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Click a field to see what it constrains.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {SCAR_FIELDS.map((f, i) => (
                    <button
                      key={f.key}
                      onClick={() => setScarFieldIdx(i)}
                      style={{
                        padding: '6px 12px', fontSize: '12px', fontFamily: 'monospace',
                        borderRadius: '999px', cursor: 'pointer',
                        border: scarFieldIdx === i ? '2px solid ' + PURPLE : '1px solid var(--ds-color-border-default)',
                        background: scarFieldIdx === i ? 'rgba(91,75,138,0.12)' : 'var(--ds-color-bg-surface)',
                        color: 'var(--ds-color-text-primary)',
                        transition: 'all 0.25s ease',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <Card style={{ padding: '12px 16px', borderLeft: '4px solid ' + PURPLE }}>
                  <strong style={{ fontFamily: 'monospace', fontSize: '13px', color: PURPLE }}>{SCAR_FIELDS[scarFieldIdx].label}</strong>
                  <p style={{ fontSize: 'var(--ds-font-size-caption)', color: 'var(--ds-color-text-secondary)', margin: '4px 0 0 0' }}>
                    {SCAR_FIELDS[scarFieldIdx].hint}
                  </p>
                </Card>
              </Stack>
            </Card>
            <ScarBuilder />
          </Stack>
        )}

        {activeSubTab === 'scope' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🔭 Scope limits: what scars cannot do</h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    Scars are scar tissue: they mark where you were hurt before. They need retirement dates and honest non-claims.
                  </p>
                </div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap="var(--ds-space-4)">
                  {SCOPE_LIMITS.map((s, i) => (
                    <Card key={s.id} style={{ padding: '14px', borderTop: '4px solid ' + [TEAL, AMBER, RED][i] }}>
                      <strong style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)' }}>{s.limit}</strong>
                      <p style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)', margin: '6px 0 0 0' }}>
                        Practice: {s.practice}
                      </p>
                    </Card>
                  ))}
                </Grid>
                <Callout type="info">
                  <strong>Honest non-claims.</strong> {NON_CLAIMS.join(' ')}
                </Callout>
              </Stack>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>Quoting-parser semantics (testable)</h4>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                    The parser classifies the heredoc mechanism — quoted delimiters are literal, bare ones expand.
                  </p>
                </div>
                <Table
                  sortable={false}
                  columns={[
                    { key: 'case', header: 'Case' },
                    { key: 'example', header: 'Example' },
                    { key: 'mechanism', header: 'Mechanism' },
                    {
                      key: 'outcome', header: 'Outcome',
                      render: (v) => <Badge variant="default">{v}</Badge>,
                    },
                  ]}
                  data={QUOTING_SEMANTICS}
                />
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Badge variant="default">{SAMPLE_COMMANDS.length} sample commands ship with the engine</Badge>
                  <Badge variant="default">denial = exit 2 · allow = exit 0</Badge>
                </div>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
