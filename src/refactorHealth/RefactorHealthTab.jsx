import React, { useState } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  TEAL, TEAL_DARK, PURPLE, RED, AMBER,
  SUB_SCORES, LOOP_STEPS, COMMIT_TIMELINE, METHODS, EVIDENCE_ROWS,
  STOP_RULES, SKILL_RULES,
  healthScore, weakestLink, gradeBand, gradeNote, clampScore, HEALTH_CHECK_CODE,
} from './refactorHealthEngine.js';

const { Container, Stack, Grid } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const navBtn = (a, b) => ({ flex: 1, minWidth: '180px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: a === b ? TEAL_DARK : 'transparent', color: a === b ? 'var(--ds-color-text-primary)' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.25s ease' });

function gradeColor(g) {
  if (g === 'A') return TEAL;
  if (g === 'B') return TEAL_DARK;
  if (g === 'C') return AMBER;
  if (g === 'D') return RED;
  return RED;
}

function TimelineSVG() {
  const W = 680, H = 220, PAD = 36;
  const maxScore = 100, maxRemoved = 700;
  const x = (i) => PAD + (i * (W - PAD * 2)) / (COMMIT_TIMELINE.length - 1);
  const yScore = (s) => H - PAD - (s / maxScore) * (H - PAD * 2);
  const yRem = (r) => H - PAD - (r / maxRemoved) * (H - PAD * 2);
  const line = COMMIT_TIMELINE.map((c, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${yScore(c.score)}`).join(' ');
  const bars = COMMIT_TIMELINE.map((c, i) => ({ ...c, i }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Per-commit timeline: score climbs while lines removed grows">
      <rect x="0" y="0" width={W} height={H} rx="12" fill="var(--ds-color-bg-surface)" />
      {[60, 70, 80, 90].map((g) => (
        <g key={g}>
          <line x1={PAD} x2={W - PAD} y1={yScore(g)} y2={yScore(g)} stroke="var(--ds-color-border-subtle)" strokeDasharray="4 4" />
          <text x={4} y={yScore(g) + 4} fontSize="10" fill="var(--ds-color-text-tertiary)">{g}</text>
        </g>
      ))}
      {bars.map((c) => (
        <rect key={c.commit} x={x(c.i) - 12} y={yRem(c.removed)} width="24" height={H - PAD - yRem(c.removed)} rx="4" fill={PURPLE} opacity="0.45" style={{ transition: 'height 0.4s ease' }}>
          <title>{c.commit}: {c.removed} lines removed</title>
        </rect>
      ))}
      <path d={line} fill="none" stroke={TEAL} strokeWidth="3" strokeLinejoin="round" style={{ transition: 'd 0.4s ease' }} />
      {COMMIT_TIMELINE.map((c, i) => (
        <g key={c.commit}>
          <circle cx={x(i)} cy={yScore(c.score)} r="6" fill={TEAL_DARK} stroke={TEAL} strokeWidth="2" style={{ transition: 'cx 0.4s ease, cy 0.4s ease' }}>
            <title>{c.commit}: score {c.score}</title>
          </circle>
          <text x={x(i)} y={yScore(c.score) - 12} fontSize="11" fontWeight="bold" textAnchor="middle" fill="var(--ds-color-text-primary)">{c.score}</text>
          <text x={x(i)} y={H - 8} fontSize="10" textAnchor="middle" fill="var(--ds-color-text-secondary)">{c.commit}</text>
        </g>
      ))}
      <g fontSize="11" fill="var(--ds-color-text-secondary)">
        <circle cx={PAD} cy={14} r="5" fill={TEAL} /><text x={PAD + 10} y={18}>health score</text>
        <rect x={PAD + 120} y={8} width="10" height="10" rx="2" fill={PURPLE} opacity="0.6" /><text x={PAD + 136} y={18}>lines removed</text>
      </g>
    </svg>
  );
}

function ScoreBars({ dup, dead, cx }) {
  const rows = [
    { label: 'Duplication', v: dup, c: TEAL },
    { label: 'Dead code', v: dead, c: PURPLE },
    { label: 'Complexity', v: cx, c: AMBER },
  ];
  return (
    <svg viewBox="0 0 400 130" style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Sub-score bars">
      {rows.map((r, i) => (
        <g key={r.label}>
          <text x="0" y={22 + i * 38} fontSize="12" fill="var(--ds-color-text-secondary)">{r.label} · {r.v}</text>
          <rect x="0" y={28 + i * 38} width="400" height="14" rx="7" fill="var(--ds-color-bg-surface)" stroke="var(--ds-color-border-subtle)" />
          <rect x="0" y={28 + i * 38} width={`${r.v * 4}`} height="14" rx="7" fill={r.c} style={{ transition: 'width 0.3s ease' }} />
        </g>
      ))}
    </svg>
  );
}

export default function RefactorHealthTab() {
  const [sub, setSub] = useState('score');
  const [dup, setDup] = useState(55);
  const [dead, setDead] = useState(70);
  const [cx, setCx] = useState(62);
  const scores = { duplication: dup, deadCode: dead, complexity: cx };
  const total = healthScore(scores);
  const weak = weakestLink(scores);
  const grade = gradeBand(total);
  const gc = gradeColor(grade);

  const weakLabel = SUB_SCORES.find((s) => s.key === weak).label;

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Code Quality [Refactor Health]"
        title="Refactor Health: Know Your Score, Work the Weakest Link"
        description="Health is a weighted sum of three sub-scores. The lowest one tells you where to work. Measure, fix one thing, run tests, commit, and measure again — with proof that every deletion was allowed."
        metrics={[{ label: 'Sub-scores', value: '3' }, { label: 'Weights', value: '40 · 35 · 25' }, { label: 'Grades', value: 'A–F' }, { label: 'Rule', value: 'Fix the lowest' }]} />
      <Container size="wide">
        <div style={NAV}>{[
          { id: 'score', icon: '🧮', label: '1. Score anatomy', desc: 'Weights + simulator' },
          { id: 'loop', icon: '🔁', label: '2. The loop', desc: 'Timeline per commit' },
          { id: 'methods', icon: '🧹', label: '3. Methods + anti-gaming', desc: 'Proof of deletion' },
          { id: 'stop', icon: '🛑', label: '4. Stop + hygiene', desc: 'When to stop' }].map((t) => (
          <button key={t.id} onClick={() => setSub(t.id)} style={navBtn(sub, t.id)}>
            <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
            <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div>
          </button>))}
        </div>

        {sub === 'score' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🧮 Health is a weighted sum — the lowest sub-score picks your next job</h3>
                  <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Each sub-score runs 0–100. Duplication counts 40%, dead code 35%, complexity 25%. Drag the sliders and watch the grade move.</p></div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)' }}>
                    <label style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)' }}>Duplication: {dup}</label>
                    <input type="range" min={0} max={100} value={dup} onChange={(e) => setDup(clampScore(+e.target.value))} style={{ width: '100%', accentColor: TEAL }} />
                    <label style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)' }}>Dead code: {dead}</label>
                    <input type="range" min={0} max={100} value={dead} onChange={(e) => setDead(clampScore(+e.target.value))} style={{ width: '100%', accentColor: PURPLE }} />
                    <label style={{ fontSize: '12px', color: 'var(--ds-color-text-primary)' }}>Complexity: {cx}</label>
                    <input type="range" min={0} max={100} value={cx} onChange={(e) => setCx(clampScore(+e.target.value))} style={{ width: '100%', accentColor: AMBER }} />
                    <div style={{ marginTop: '8px' }}><ScoreBars dup={dup} dead={dead} cx={cx} /></div>
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `4px solid ${gc}` }}>
                    <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', fontFamily: 'monospace' }}>
                      {dup}×0.40 + {dead}×0.35 + {cx}×0.25 = {total}
                    </div>
                    <div style={{ fontSize: '44px', fontWeight: 'bold', color: gc, lineHeight: 1, marginTop: '6px', transition: 'color 0.3s ease' }}>{grade}</div>
                    <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{gradeNote(total)}</div>
                    <div style={{ marginTop: '8px' }}><Badge variant="default">Work next: {weakLabel}</Badge></div>
                  </Card>
                </Grid>
                <Table sortable={false} columns={[
                  { key: 'label', header: 'Sub-score' },
                  { key: 'weight', header: 'Weight' },
                  { key: 'what', header: 'What to do' },
                ]} data={SUB_SCORES.map((s) => ({ label: s.label, weight: `${Math.round(s.weight * 100)}%`, what: s.what }))} />
                <Callout type="tip"><strong>Read the minimum, not the average.</strong> Averages hide rot — one terrible sub-score can sink a codebase while the total looks fine. Always work the lowest bar first.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'loop' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🔁 The loop: measure → fix one thing → run tests → commit → measure again</h3>
                  <p style={{ color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>Work in a clean worktree so the scan sees only your change. One logical step per commit keeps every step reviewable and revertable.</p></div>
                <TimelineSVG />
                <Table sortable={false} columns={[
                  { key: 'step', header: 'Step' },
                  { key: 'detail', header: 'Detail' },
                ]} data={LOOP_STEPS} />
                <Table sortable={false} columns={[
                  { key: 'commit', header: 'Commit' },
                  { key: 'score', header: 'Score' },
                  { key: 'removed', header: 'Lines removed' },
                  { key: 'label', header: 'Phase' },
                ]} data={COMMIT_TIMELINE} />
                <Callout type="info"><strong>Score climbs while lines removed grows.</strong> Healthy refactors delete more than they add — the two curves should rise together across commits.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'methods' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🧹 Three methods — and proving you were allowed to delete it is the work</h3></div>
                <Table sortable={false} columns={[
                  { key: 'method', header: 'Method' },
                  { key: 'rule', header: 'Rule' },
                  { key: 'evidence', header: 'Evidence kept' },
                ]} data={METHODS} />
                <div><h4 style={{ color: 'var(--ds-color-text-primary)' }}>Anti-gaming: kept findings that prove deletions were allowed</h4></div>
                <Table sortable={false} columns={[
                  { key: 'kept', header: 'Kept artifact' },
                  { key: 'proves', header: 'What it proves' },
                ]} data={EVIDENCE_ROWS} />
                <CodeBlock language="python" code={HEALTH_CHECK_CODE} />
                <Callout type="warning"><strong>Proving you were allowed to delete it is the work.</strong> A deletion without a reachability report and a green suite is just guessing — keep the evidence with the commit.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'stop' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div><h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🛑 Stop conditions + hygiene: when to stop, and how to stay honest</h3></div>
                <Table sortable={false} columns={[
                  { key: 'stop', header: 'Stop signal' },
                  { key: 'meaning', header: 'Meaning' },
                ]} data={STOP_RULES} />
                <Table sortable={false} columns={[
                  { key: 'rule', header: 'Skill rule' },
                  { key: 'why', header: 'Why' },
                ]} data={SKILL_RULES} />
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-2)">
                  <Callout type="danger"><strong>A score that can only go up is lying.</strong> If the instrument cannot fall on worse code, it cannot confirm better code either.</Callout>
                  <Callout type="success"><strong>Same instrument before and after.</strong> Changing the ruler mid-loop voids the comparison — rescan with the identical scan and weights.</Callout>
                </Grid>
                <Callout type="info"><strong>Refactoring is not a rewrite.</strong> Behavior-preserving small steps with tests each step; rewrites are a different job with different risks. Legitimate stop: blocked by missing tests — build the net first.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
