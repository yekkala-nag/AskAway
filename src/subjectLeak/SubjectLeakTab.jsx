import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  SPLITS, ANCHOR, AUDIT_CHECKS, LESSONS,
  estimateAccuracies, splitGrid, leakedSubjects,
  LEAK_PHASE1, LEAK_PHASE2,
} from './subjectLeakEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'demo', icon: '⚡', label: '1. Inflation Demo', desc: 'The 79% vs 61% story' },
  { id: 'split', icon: '🧩', label: '2. Split Lab', desc: 'Five strategies, live grid' },
  { id: 'calc', icon: '🧮', label: '3. Calculator', desc: 'Inflation vs corpus shape' },
  { id: 'audit', icon: '🔍', label: '4. Audit + Gate', desc: 'Checklist & gated prompt' },
];

// ── 1. Inflation demo ───────────────────────────────────────────────────────

function InflationDemo() {
  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>⚡ The headline experiment — same model, same data, different split</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Split every recording into short segments and shuffle them: segments from the same person land in both train and test. The classifier can score by matching people instead of learning the condition.
            </p>
          </div>
          <Grid columns={2} gap="var(--ds-space-4)">
            <Card style={{ padding: 'var(--ds-space-5)', background: '#FDF0EC', border: `1.5px solid ${RED}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: RED }}>SEGMENT-RANDOM SPLIT — LEAKY</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: RED, margin: '8px 0' }}>{ANCHOR.segmentAcc}%</div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
                Looks production-ready. Actually memorizing subjects.
              </div>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: '#E8F3F3', border: `1.5px solid ${TEAL}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: TEAL_DARK }}>SUBJECT-BLOCKED SPLIT — HONEST</div>
              <div style={{ fontSize: 42, fontWeight: 800, color: TEAL_DARK, margin: '8px 0' }}>{ANCHOR.subjectAcc}%</div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
                The same model on people it has never seen.
              </div>
            </Card>
          </Grid>
          <div style={{
            fontSize: 15, fontWeight: 800, padding: 12, borderRadius: 8, textAlign: 'center',
            background: '#F9F1DC', color: AMBER,
          }}>
            Gap: {ANCHOR.gap} percentage points — {ANCHOR.note}
          </div>
          <Callout type="warning" title="Majority of published segment-split studies overestimate">
            When the split unit is the segment and not the subject, the reported accuracy answers "can I recognize people already in training?" — not "will this work on the next patient?"
          </Callout>
          <Grid columns={3} gap="var(--ds-space-4)">
            {LESSONS.map((l) => (
              <Card key={l.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK }}>{l.title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 6 }}>{l.body}</div>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 2. Split lab ────────────────────────────────────────────────────────────

const SIDE_COLORS = { train: TEAL, test: RED };

function SplitLab() {
  const [strategy, setStrategy] = useState('segment');
  const [subjects, setSubjects] = useState(8);
  const [segments] = useState(10);
  const grid = useMemo(() => splitGrid(subjects, segments, strategy), [subjects, segments, strategy]);
  const leaked = useMemo(() => leakedSubjects(grid), [grid]);
  const split = SPLITS.find((s) => s.id === strategy);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🧩 Split lab — every cell is a segment; color is which side it landed on</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Watch a subject's row go solid (one side only) or split (both sides — leakage). Strategy names what the accuracy number actually means.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SPLITS.map((s) => (
            <button key={s.id} onClick={() => setStrategy(s.id)} style={{
              padding: '8px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, minHeight: 44,
              border: `1.5px solid ${strategy === s.id ? PURPLE : 'var(--ds-color-border-subtle)'}`,
              background: strategy === s.id ? PURPLE : 'var(--ds-color-bg-surface)',
              color: strategy === s.id ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
            }}>{s.name}</button>
          ))}
        </div>
        <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', maxWidth: 360 }}>
          Subjects: <strong style={{ color: PURPLE }}>{subjects}</strong>
          <input type="range" min={4} max={16} value={subjects} onChange={(e) => setSubjects(+e.target.value)}
            style={{ width: '100%' }} aria-label="subjects" />
        </label>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontSize: 11 }}>
            <tbody>
              {Array.from({ length: subjects }, (_, subj) => (
                <tr key={subj}>
                  <td style={{ padding: '3px 8px', fontWeight: 700, color: TEAL_DARK, whiteSpace: 'nowrap' }}>P{subj}</td>
                  {grid.filter((g) => g.subject === subj).map((g) => (
                    <td key={g.segment} title={`subject ${g.subject} segment ${g.segment} → ${g.side}`}
                      style={{
                        width: 26, height: 26, margin: 2, borderRadius: 4,
                        background: SIDE_COLORS[g.side], color: '#fff',
                        textAlign: 'center', fontSize: 9, lineHeight: '26px',
                      }}>
                      {g.side === 'test' ? 'T' : '•'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12, alignItems: 'center' }}>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, background: TEAL, borderRadius: 3 }} /> train</span>
          <span><span style={{ display: 'inline-block', width: 12, height: 12, background: RED, borderRadius: 3 }} /> test</span>
        </div>
        <div style={{
          fontSize: 14, fontWeight: 800, padding: 10, borderRadius: 8,
          background: leaked.length ? '#FDF0EC' : '#E8F3F3',
          color: leaked.length ? RED : TEAL_DARK,
        }}>
          {leaked.length
            ? `LEAKAGE: ${leaked.length} subject(s) on both sides — ${leaked.slice(0, 6).map((s) => `P${s}`).join(', ')}${leaked.length > 6 ? '…' : ''}`
            : 'CLEAN: no subject appears on both sides'}
          {' '}· {split.inflated}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>{split.desc}</div>
        <Badge variant={split.leakage ? 'danger' : 'success'}>
          {split.leakage ? 'Leaky protocol' : 'Leakage-controlled protocol'}
        </Badge>
      </Stack>
    </Card>
  );
}

// ── 3. Calculator ───────────────────────────────────────────────────────────

function Calculator() {
  const [subjects, setSubjects] = useState(10);
  const [segs, setSegs] = useState(12);
  const [signal, setSignal] = useState(70);
  const r = useMemo(() => estimateAccuracies({
    subjects, segmentsPerSubject: segs, signalStrength: signal / 100,
  }), [subjects, segs, signal]);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🧮 Inflation calculator — how corpus shape inflates a leaky split</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            More segments per subject → more shared fingerprint in both sides → more memorization credit. Illustrative model, not a benchmark.
          </p>
        </div>
        <Grid columns={3} gap="var(--ds-space-4)">
          <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            Subjects: <strong style={{ color: PURPLE }}>{subjects}</strong>
            <input type="range" min={4} max={40} value={subjects} onChange={(e) => setSubjects(+e.target.value)} style={{ width: '100%' }} aria-label="subjects" />
          </label>
          <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            Segments per subject: <strong style={{ color: PURPLE }}>{segs}</strong>
            <input type="range" min={2} max={40} value={segs} onChange={(e) => setSegs(+e.target.value)} style={{ width: '100%' }} aria-label="segments" />
          </label>
          <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            True signal strength: <strong style={{ color: PURPLE }}>{signal}%</strong>
            <input type="range" min={10} max={100} value={signal} onChange={(e) => setSignal(+e.target.value)} style={{ width: '100%' }} aria-label="signal" />
          </label>
        </Grid>
        <Grid columns={3} gap="var(--ds-space-4)">
          <Card style={{ padding: 'var(--ds-space-4)', background: '#FDF0EC', border: `1.5px solid ${RED}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: RED }}>SEGMENT-RANDOM (LEAKY)</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: RED }}>{r.inflated}%</div>
          </Card>
          <Card style={{ padding: 'var(--ds-space-4)', background: '#E8F3F3', border: `1.5px solid ${TEAL}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: TEAL_DARK }}>SUBJECT-BLOCKED (HONEST)</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: TEAL_DARK }}>{r.honest}%</div>
          </Card>
          <Card style={{ padding: 'var(--ds-space-4)', background: '#F9F1DC', border: `1.5px solid ${AMBER}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: AMBER }}>INFLATION GAP</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: AMBER }}>{r.gap} pts</div>
          </Card>
        </Grid>
        <div style={{ height: 18, borderRadius: 9, background: '#E5E7EB', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${r.honest}%`, height: '100%', background: TEAL, transition: 'width .3s' }} />
          <div style={{ width: `${Math.min(r.gap, 100 - r.honest)}%`, height: '100%', background: RED, transition: 'width .3s' }} />
        </div>
        <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)' }}>
          Corpus: {r.total} segments from {r.subjects} subjects · teal = honest signal · red = memorization credit from subject overlap
        </div>
      </Stack>
    </Card>
  );
}

// ── 4. Audit + gate ─────────────────────────────────────────────────────────

function AuditGate() {
  const [phase, setPhase] = useState(1);
  const [reply, setReply] = useState('');
  const approved = reply.trim().toLowerCase() === 'approved';

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🔍 Leakage audit checklist — six questions before you trust a number</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Answer every question in writing. A study that cannot answer question 1 has not earned an accuracy claim.
            </p>
          </div>
          <Table
            columns={[
              { key: 'q', header: 'Question', render: (v) => <strong>{v}</strong> },
              { key: 'why', header: 'Why it matters', sortable: false },
            ]}
            data={AUDIT_CHECKS}
            sortable={false}
          />
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🚦 Two-phase gated integrity report</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Phase 1 restates the dataset and asks about the split; Phase 2 emits the leakage verdict — only after "approved".
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
                {approved ? 'Emit the integrity report' : 'Requires the word "approved"'}
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
          {phase === 1 && <CodeBlock language="text" code={LEAK_PHASE1} />}
          {phase === 2 && (
            <Stack gap={4}>
              <div style={{ fontSize: 14, fontWeight: 800, padding: 10, borderRadius: 8, background: '#E8F3F3', color: TEAL_DARK }}>
                Gate passed — Phase 2 executing. Sample report below.
              </div>
              <CodeBlock language="markdown" code={[
                '| Leakage Vector | Severity | Expected Inflation | Fix |',
                '|---|---|---|---|',
                '| Segment-random split: subjects span train and test | High | ~15–20 pts of memorization credit | Re-split subject-blocked; re-run |',
                '| Global normalization fit before split | Medium | Small, consistent bias | Fit scalers on train only |',
                '| Windows from one event split across sides | Medium | Session-noise credit | Split at event level |',
              ].join('\n')} />
              <CodeBlock language="text" code={LEAK_PHASE2} />
            </Stack>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}

// ── Tab ─────────────────────────────────────────────────────────────────────

export default function SubjectLeakTab() {
  const [activeSubTab, setActiveSubTab] = useState('demo');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="subjectleak"
        moduleLabel="Foundations"
        title="Subject Leakage: When Models See the Same People Twice"
        description="Shuffle the segments of a long recording and people land in both train and test — the classifier learns fingerprints, not conditions. A live split lab across five protocols, an inflation calculator, a six-question audit checklist, and a two-phase gated integrity report. The honest number is the one that survives a subject-blocked re-run."
        metrics={[
          { label: 'Split protocols', value: String(SPLITS.length) },
          { label: 'Demo gap', value: `${ANCHOR.gap} pts` },
          { label: 'Audit checks', value: String(AUDIT_CHECKS.length) },
          { label: 'Gate phases', value: '2' },
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
        {activeSubTab === 'demo' && <InflationDemo />}
        {activeSubTab === 'split' && <SplitLab />}
        {activeSubTab === 'calc' && <Calculator />}
        {activeSubTab === 'audit' && <AuditGate />}
      </Container>
    </div>
  );
}
