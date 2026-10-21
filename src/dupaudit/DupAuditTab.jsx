import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  CORPUS,
  THRESHOLDS,
  PROBABLE_DUPLICATE_CUTOFF,
  EXACT_DUPLICATES,
  auditRows,
  probableDuplicates,
  maxOverlap,
  tagOverlap,
  allPairs,
  MATCH_TYPES,
  AUDIT_PHASE1,
  AUDIT_PHASE2,
  AUDIT_COMPLIANCE,
  PRIMARY_RULES,
  sourceById,
} from './dupAuditEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'corpus', icon: '📚', label: '1. Corpus', desc: '9 sources, one pass' },
  { id: 'table', icon: '📋', label: '2. Audit Table', desc: 'Primary vs Duplicate' },
  { id: 'overlap', icon: '🔬', label: '3. Overlap Explorer', desc: 'Theme Jaccard' },
  { id: 'gate', icon: '🚦', label: '4. Two-Phase Gate', desc: 'Align, then execute' },
];

// ── 1. Corpus ───────────────────────────────────────────────────────────────

function CorpusView() {
  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>📚 The corpus — nine sources, first-appearing order</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Order matters: the Primary rule keys off first appearance and completeness. Scan S1→S9 once; every pair is compared against that order.
            </p>
          </div>
          <Grid columns={3} gap="var(--ds-space-4)">
            {CORPUS.map((s) => (
              <Card key={s.id} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: TEAL_DARK, fontSize: 14 }}>{s.id} · {s.short}</strong>
                  <Badge variant="default">{s.theme}</Badge>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 6, lineHeight: 1.5 }}>{s.excerpt}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                  {s.tags.map((t) => (
                    <span key={t} style={{
                      fontSize: 10.5, padding: '2px 8px', borderRadius: 999,
                      background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)',
                      color: 'var(--ds-color-text-secondary)',
                    }}>{t}</span>
                  ))}
                </div>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🔎 Match taxonomy — what each type actually tests</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Exact is a text test. Semantic is a meaning test. Thematic is a tag test — and thematic overlap alone never justifies a duplicate flag.
            </p>
          </div>
          <Table
            columns={[
              { key: 'name', header: 'Type', render: (v) => <strong style={{ color: TEAL_DARK }}>{v}</strong> },
              { key: 'test', header: 'Test', sortable: false },
              { key: 'flag', header: 'Flag rule', render: (v) => <Badge variant="default">{v}</Badge> },
            ]}
            data={MATCH_TYPES}
            sortable={false}
          />
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 2. Audit table ──────────────────────────────────────────────────────────

function AuditTableView() {
  const [cutoff, setCutoff] = useState(PROBABLE_DUPLICATE_CUTOFF);
  const rows = useMemo(() => auditRows().map((r) => ({
    ...r,
    verdict: r.pct > cutoff ? 'Probable Duplicate' : r.pct >= 50 ? 'Related — Keep' : 'Distinct — Keep',
    flagged: r.pct > cutoff,
  })), [cutoff]);
  const flagged = rows.filter((r) => r.flagged);
  const top = maxOverlap();

  const cols = [
    {
      key: 'primaryId', header: 'Primary', render: (v) => (
        <strong style={{ color: TEAL_DARK }}>{v} — {sourceById(v)?.short}</strong>
      ),
    },
    { key: 'primaryExcerpt', header: 'Primary excerpt', sortable: false, render: (v) => <span style={{ fontSize: 11.5 }}>{v}</span> },
    {
      key: 'dupId', header: 'Duplicate', render: (v) => (
        <strong style={{ color: AMBER }}>{v} — {sourceById(v)?.short}</strong>
      ),
    },
    { key: 'dupExcerpt', header: 'Duplicate excerpt', sortable: false, render: (v) => <span style={{ fontSize: 11.5 }}>{v}</span> },
    {
      key: 'matchType', header: 'Match Type %', render: (v, row) => (
        <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700, color: row.flagged ? RED : TEAL_DARK }}>{v}</span>
      ),
    },
    {
      key: 'verdict', header: 'Verdict', render: (v) => (
        <Badge variant={v.startsWith('Probable') ? 'danger' : 'default'}>{v}</Badge>
      ),
    },
    { key: 'action', header: 'Recommended Action', sortable: false, render: (v) => <span style={{ fontSize: 11.5 }}>{v}</span> },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>📋 Duplicate content audit — detect-only</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Move the threshold and watch which pairs flip into Probable Duplicate. Default cutoff: semantic similarity above {PROBABLE_DUPLICATE_CUTOFF}%. No exact duplicates exist in this corpus.
            </p>
          </div>
          <Grid columns={2} gap="var(--ds-space-4)">
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Probable-Duplicate cutoff: <strong style={{ color: PURPLE }}>{cutoff}%</strong>
              <input type="range" min={30} max={95} step={5} value={cutoff}
                onChange={(e) => setCutoff(+e.target.value)} style={{ width: '100%' }} aria-label="duplicate cutoff" />
            </label>
            <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Exact duplicates: <strong style={{ color: TEAL_DARK }}>{EXACT_DUPLICATES.length}</strong> ·
              Flagged pairs: <strong style={{ color: flagged.length ? RED : TEAL_DARK }}>{flagged.length}</strong> ·
              Highest overlap: <strong style={{ color: TEAL_DARK }}>{top ? `${top.pct}% (${top.primaryId}↔${top.dupId})` : '—'}</strong>
            </div>
          </Grid>
          <div style={{
            fontSize: 14, fontWeight: 800, padding: 10, borderRadius: 8,
            background: flagged.length ? '#FDF0EC' : '#E8F3F3',
            color: flagged.length ? RED : TEAL_DARK,
          }}>
            {flagged.length
              ? `${flagged.length} pair(s) exceed the ${cutoff}% cutoff — Probable Duplicates flagged for review.`
              : `No pair exceeds ${cutoff}% — verdict: keep all nine sources; highest semantic pair sits at ${top?.pct ?? 0}%.`}
          </div>
          <Table columns={cols} data={rows} sortable={false} />
          <Callout type="info" title="Detect-only means detect-only">
            The Recommended Action column never rewrites, merges, or restructures content. An audit that edits its inputs is no longer an audit.
          </Callout>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🏷️ Primary vs Duplicate — the three assignment rules</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Which side of the pair is Primary is a decision, not a coin flip. These rules resolve it — and when they can't, both sources stay.
            </p>
          </div>
          <Grid columns={3} gap="var(--ds-space-4)">
            {PRIMARY_RULES.map((r) => (
              <Card key={r.rule} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK }}>{r.rule}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{r.detail}</div>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 3. Overlap explorer ─────────────────────────────────────────────────────

function OverlapView() {
  const [idA, setIdA] = useState('S1');
  const [idB, setIdB] = useState('S6');
  const o = useMemo(() => tagOverlap(idA, idB), [idA, idB]);
  const ranked = useMemo(() => allPairs().slice(0, 10), []);

  const selectStyle = {
    padding: '9px 10px', borderRadius: 8,
    border: '1.5px solid var(--ds-color-border-subtle)',
    background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)',
    fontSize: 13, minHeight: 44,
  };

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🔬 Theme Jaccard explorer — shared tags, measured</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Jaccard = |shared tags| / |union of tags|. A high tag score is a prompt to read the pair closely — never a duplicate verdict on its own.
            </p>
          </div>
          <Grid columns={2} gap="var(--ds-space-4)">
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Source A
              <select value={idA} onChange={(e) => setIdA(e.target.value)} style={{ ...selectStyle, width: '100%', marginTop: 4 }} aria-label="source A">
                {CORPUS.map((s) => <option key={s.id} value={s.id}>{s.id} — {s.short}</option>)}
              </select>
            </label>
            <label style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
              Source B
              <select value={idB} onChange={(e) => setIdB(e.target.value)} style={{ ...selectStyle, width: '100%', marginTop: 4 }} aria-label="source B">
                {CORPUS.map((s) => <option key={s.id} value={s.id}>{s.id} — {s.short}</option>)}
              </select>
            </label>
          </Grid>
          <div style={{
            fontSize: 22, fontWeight: 800, padding: 14, borderRadius: 8, textAlign: 'center',
            background: o.jaccard >= 0.5 ? '#F9F1DC' : '#E8F3F3',
            color: o.jaccard >= 0.5 ? AMBER : TEAL_DARK,
          }}>
            Jaccard {(o.jaccard * 100).toFixed(0)}%
            <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 10, color: 'var(--ds-color-text-secondary)' }}>
              {o.jaccard >= 0.5 ? 'shared theme cluster — read both closely' : 'thin overlap — likely distinct'}
            </span>
          </div>
          <Grid columns={3} gap="var(--ds-space-4)">
            <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: TEAL_DARK }}>Shared tags</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{o.shared.length ? o.shared.join(', ') : '—'}</div>
            </Card>
            <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: AMBER }}>Only A</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{o.onlyA.length ? o.onlyA.join(', ') : '—'}</div>
            </Card>
            <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: RED }}>Only B</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{o.onlyB.length ? o.onlyB.join(', ') : '—'}</div>
            </Card>
          </Grid>
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🏆 Top 10 ranked pairs by tag Jaccard</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              The theme map of the corpus — where the clusters are, and where the quiet outliers sit.
            </p>
          </div>
          <Table
            columns={[
              { key: 'a', header: 'Pair', sortable: false, render: (v, row) => <strong style={{ color: TEAL_DARK }}>{v} ↔ {row.b}</strong> },
              {
                key: 'jaccard', header: 'Jaccard', render: (v) => (
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>{(v * 100).toFixed(0)}%</span>
                ),
              },
              { key: 'shared', header: 'Shared tags', sortable: false, render: (v) => v.join(', ') || '—' },
            ]}
            data={ranked}
            sortable={false}
          />
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 4. Two-phase gate ───────────────────────────────────────────────────────

function TwoPhaseGate() {
  const [phase, setPhase] = useState(1);
  const [reply, setReply] = useState('');
  const approved = reply.trim().toLowerCase() === 'approved';
  const rows = auditRows();
  const flagged = probableDuplicates();

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🚦 Two-phase gated audit prompt — nothing executes before "approved"</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Phase 1 only restates scope, asks questions, and describes the schema. The audit table is withheld until an explicit approval word — type "approved" below to open Phase 2.
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
              Phase 1 — Alignment (always available)
              <div style={{ fontSize: 11.5, fontWeight: 500, marginTop: 2, opacity: 0.85 }}>Restate · ask · describe schema · STOP</div>
            </button>
            <button onClick={() => approved && setPhase(2)} disabled={!approved} style={{
              padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)',
              cursor: approved ? 'pointer' : 'not-allowed',
              border: `1.5px solid ${phase === 2 ? TEAL : approved ? 'var(--ds-color-border-subtle)' : 'var(--ds-color-border-subtle)'}`,
              background: phase === 2 ? TEAL : 'var(--ds-color-bg-surface)',
              color: phase === 2 ? 'var(--ds-color-text-inverse)' : approved ? 'var(--ds-color-text-primary)' : 'var(--ds-color-text-disabled, #9CA3AF)',
              fontWeight: phase === 2 ? 700 : 500, fontSize: 13, minHeight: 44, textAlign: 'left',
              opacity: approved ? 1 : 0.6,
            }}>
              Phase 2 — Execute {approved ? '' : '(locked)'}
              <div style={{ fontSize: 11.5, fontWeight: 500, marginTop: 2, opacity: 0.85 }}>
                {approved ? 'Emit the audit table' : 'Requires the word "approved"'}
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

          {phase === 1 && <CodeBlock language="text" code={AUDIT_PHASE1} />}

          {phase === 2 && (
            <Stack gap={4}>
              <div style={{
                fontSize: 14, fontWeight: 800, padding: 10, borderRadius: 8,
                background: '#E8F3F3', color: TEAL_DARK,
              }}>
                Gate passed — Phase 2 executing. Detect-only table below; no content altered.
              </div>
              <CodeBlock language="markdown" code={[
                '| Primary Content ID/Excerpt | Duplicate Content ID/Excerpt | Match Type (Exact/Semantic) % | Recommended Action |',
                '|---|---|---|---|',
                ...rows.map((r) => `| ${r.primaryId} — ${r.primaryExcerpt} | ${r.dupId} — ${r.dupExcerpt} | ${r.matchType} | ${r.action} |`),
                '',
                flagged.length
                  ? `Flagged as Probable Duplicate (>80%): ${flagged.map((f) => `${f.primaryId}↔${f.dupId}`).join(', ')}.`
                  : `No pair exceeds 80% semantic similarity — no Probable Duplicates. Highest overlap: ${rows[0]?.pct}% (${rows[0]?.primaryId}↔${rows[0]?.dupId}).`,
              ].join('\n')} />
              <Callout type="warning" title="Audit integrity">
                Phase 1 alignment-before-execution stops a confident table being dumped on a misunderstood corpus — the same reason production decision loops gate consequential actions.
              </Callout>
            </Stack>
          )}
        </Stack>
      </Card>

      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🛡️ Why the gate earns its tokens</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              ~100 tokens of alignment beat ~2,000 tokens of auditing the wrong corpus — the same economics as any approval-gated workflow.
            </p>
          </div>
          <Grid columns={3} gap="var(--ds-space-4)">
            {AUDIT_COMPLIANCE.map((n, i) => (
              <Card key={i} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                <div style={{ fontSize: 15 }}>{n.icon}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{n.note}</div>
              </Card>
            ))}
          </Grid>
          <CodeBlock language="text" code={AUDIT_PHASE2} />
        </Stack>
      </Card>
    </Stack>
  );
}

// ── Tab ─────────────────────────────────────────────────────────────────────

export default function DupAuditTab() {
  const [activeSubTab, setActiveSubTab] = useState('corpus');
  const top = maxOverlap();
  const flagged = probableDuplicates();

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="dupaudit"
        moduleLabel="Foundations"
        title="Duplicate Content Audit: Detect, Don't Fix"
        description="A two-phase gated audit of nine sources: restate scope, ask, describe the schema — then emit a Primary-vs-Duplicate table only after explicit approval. Match Type carries Exact or Semantic plus a percentage; anything above 80% semantic similarity is flagged as a Probable Duplicate. Detect-only: no rewriting, merging, or restructuring of content."
        metrics={[
          { label: 'Corpus size', value: String(CORPUS.length) },
          { label: 'Exact duplicates', value: String(EXACT_DUPLICATES.length) },
          { label: 'Probable Duplicates', value: String(flagged.length) },
          { label: 'Top overlap', value: top ? `${top.pct}%` : '—' },
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

        {activeSubTab === 'corpus' && <CorpusView />}
        {activeSubTab === 'table' && <AuditTableView />}
        {activeSubTab === 'overlap' && <OverlapView />}
        {activeSubTab === 'gate' && <TwoPhaseGate />}
      </Container>
    </div>
  );
}
