import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  ROUNDS,
  CODING_AXES,
  CONVERSATION_LADDER,
  HINT_LADDER,
  HINT_EXAMPLE,
  BUG_RULES,
  PRACTICE_DRILLS,
  TOPIC_FOCUS,
  TOPIC_CAUTION,
  AI_ROUND,
  AI_PRACTICE,
  DESIGN_DRIVERS,
  PUSH_PULL,
  SUCCESS_LADDER,
  BEHAVIORAL_PROBES,
  STAR_FIELDS,
  SENIOR_STORY_CHECKS,
  BLUFF_LADDER,
  WINNER_TRAITS,
  RECRUITER_USES,
  ROUND_CODE,
  BLUF_TEMPLATE,
} from './interviewMindsetEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'rounds', icon: '🗺️', label: '1. The Four Rounds', desc: 'Map of the loop' },
  { id: 'coding', icon: '💻', label: '2. Coding Mindset', desc: 'Axes, hints, bugs' },
  { id: 'aidesign', icon: '🤖', label: '3. AI & Design Rounds', desc: 'Drive and verify' },
  { id: 'behavior', icon: '🗣️', label: '4. Behavioral & Honesty', desc: 'STAR, bluffing, wins' },
];

function chipStyle(active) {
  return {
    padding: '7px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 12.5, minHeight: 44,
    border: `1.5px solid ${active ? PURPLE : 'var(--ds-color-border-subtle)'}`,
    background: active ? PURPLE : 'var(--ds-color-bg-surface)',
    color: active ? 'var(--ds-color-text-inverse)' : 'var(--ds-color-text-secondary)',
    transition: 'all .2s',
  };
}

// ── 1. The Four Rounds ──────────────────────────────────────────────────────

function RoundsMap() {
  const [active, setActive] = useState(() => new Set(ROUNDS.map((r) => r.id)));
  const toggle = (id) => setActive((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const chosen = ROUNDS.filter((r) => active.has(r.id));
  const total = chosen.reduce((s, r) => s + r.minutes, 0);
  const answersHire = chosen.filter((r) => r.answers.startsWith('Should')).length;
  const answersLevel = chosen.filter((r) => r.answers.startsWith('At')).length;

  const cols = [
    { key: 'name', header: 'Round', render: (v, row) => <span><span style={{ marginRight: 6 }}>{row.icon}</span><strong>{v}</strong></span> },
    { key: 'minutes', header: 'Length', render: (v) => <Badge variant="default">{v} min</Badge> },
    { key: 'format', header: 'Format', sortable: false },
    { key: 'key', header: 'What wins', render: (v) => <span style={{ color: TEAL_DARK, fontSize: 12 }}>{v}</span> },
    { key: 'answers', header: 'Answers', sortable: false },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🗺️ The loop answers two questions — not one</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              Coding rounds decide <em>whether</em>; design and behavioral rounds decide <em>at what level</em> — and level drives the offer. Toggle rounds to build your prep clock.
            </p>
          </div>
          <svg viewBox="0 0 860 190" style={{ width: '100%', height: 'auto' }} role="img" aria-label="four interview rounds feeding hire and level decisions">
            {ROUNDS.map((r, i) => {
              const x = 6 + i * 214;
              const on = active.has(r.id);
              return (
                <g key={r.id} opacity={on ? 1 : 0.35} style={{ transition: 'opacity .25s' }}>
                  <rect x={x} y={18} width={192} height={84} rx={12}
                    fill={r.answers.startsWith('Should') ? '#E8F3F3' : '#F4EFE6'}
                    stroke={r.answers.startsWith('Should') ? TEAL : AMBER} strokeWidth={1.5} />
                  <text x={x + 12} y={44} fontSize={15}>{r.icon}</text>
                  <text x={x + 38} y={44} fontSize={13.5} fontWeight={700} fill={TEAL_DARK}>{r.name}</text>
                  <text x={x + 12} y={66} fontSize={11} fill="var(--ds-color-text-secondary)">{r.minutes} min · {r.answers.startsWith('Should') ? 'hire gate' : 'level signal'}</text>
                  <text x={x + 12} y={86} fontSize={10.5} fill="var(--ds-color-text-tertiary)">{r.format.slice(0, 34)}…</text>
                  <line x1={x + 96} y1={102} x2={x + 96} y2={132} stroke={PURPLE} strokeWidth={2} />
                  <polygon points={`${x + 96},136 ${x + 92},128 ${x + 100},128`} fill={PURPLE} />
                </g>
              );
            })}
            <rect x={180} y={140} width={220} height={36} rx={10} fill="#E8F3F3" stroke={TEAL} strokeWidth={1.5} />
            <text x={290} y={163} fontSize={13} fontWeight={700} fill={TEAL_DARK} textAnchor="middle">“Should we hire you?”</text>
            <rect x={460} y={140} width={220} height={36} rx={10} fill="#F4EFE6" stroke={AMBER} strokeWidth={1.5} />
            <text x={570} y={163} fontSize={13} fontWeight={700} fill={AMBER} textAnchor="middle">“At what level?”</text>
          </svg>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ROUNDS.map((r) => (
              <button key={r.id} onClick={() => toggle(r.id)} aria-pressed={active.has(r.id)} style={chipStyle(active.has(r.id))}>
                {r.icon} {r.name}
              </button>
            ))}
          </div>
          <Grid columns={3} gap="var(--ds-space-4)">
            <Card style={{ padding: 'var(--ds-space-4)', background: '#E8F3F3', border: `1.5px solid ${TEAL}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>YOUR PREP CLOCK</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: TEAL_DARK }}>{total} min</div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>{chosen.length} of 4 rounds selected</div>
            </Card>
            <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>GATES vs SIGNALS</div>
              <div style={{ fontSize: 15, marginTop: 4, color: 'var(--ds-color-text-primary)' }}>
                <strong style={{ color: TEAL_DARK }}>{answersHire}</strong> hire-gate rounds ·{' '}
                <strong style={{ color: AMBER }}>{answersLevel}</strong> level rounds
              </div>
              <div style={{ fontSize: 12, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>
                {answersHire === 0 ? '⚠ No gate selected — level rounds cannot rescue a failed code bar.' : '✓ At least one gate in your plan.'}
              </div>
            </Card>
            <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>SENIORITY MULTIPLIER</div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-primary)', marginTop: 4, lineHeight: 1.55 }}>
                Senior+ candidates: design and behavioral expect a real multi-month system you designed, launched, and lived with.
              </div>
            </Card>
          </Grid>
          <Table columns={cols} data={ROUNDS} sortable={false} />
        </Stack>
      </Card>
      <Callout type="success" title="The hire pattern, one sentence">
        The people who got offers were not perfect — they made it easy to see how they think: approaches out loud, hints taken, own bugs caught, understanding over memorization.
      </Callout>
    </Stack>
  );
}

// ── 2. Coding Mindset ───────────────────────────────────────────────────────

function FourAxes() {
  const [vals, setVals] = useState({ code: 70, comm: 40, solve: 40, verify: 30 });
  const total = Object.values(vals).reduce((a, b) => a + b, 0);
  const codeShare = Math.round((vals.code / Math.max(total, 1)) * 100);
  const balanced = vals.comm >= 50 && vals.solve >= 50 && vals.verify >= 50;

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>⚖️ Four axes — only one of them is the code</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Set how much of your practice time goes to each axis. A code-heavy, talk-light profile is the most common silent fail.
          </p>
        </div>
        <Grid columns={2} gap="var(--ds-space-4)">
          <Stack gap={3}>
            {CODING_AXES.map((axis) => (
              <label key={axis.id} style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
                {axis.icon} {axis.name}: <strong style={{ color: vals[axis.id] >= 50 ? TEAL_DARK : AMBER }}>{vals[axis.id]}%</strong>
                <input type="range" min={0} max={100} step={5} value={vals[axis.id]}
                  onChange={(e) => setVals((v) => ({ ...v, [axis.id]: +e.target.value }))}
                  style={{ width: '100%' }} aria-label={`${axis.name} practice share`} />
              </label>
            ))}
          </Stack>
          <Stack gap={3}>
            <svg viewBox="0 0 260 130" style={{ width: '100%', height: 'auto' }} role="img" aria-label="practice balance bars per axis">
              {CODING_AXES.map((axis, i) => (
                <g key={axis.id}>
                  <text x={0} y={18 + i * 30} fontSize={11} fill="var(--ds-color-text-secondary)">{axis.name}</text>
                  <rect x={90} y={6 + i * 30} width={150} height={16} rx={8} fill="#E5E7EB" />
                  <rect x={90} y={6 + i * 30} width={Math.max((vals[axis.id] / 100) * 150, 2)} height={16} rx={8}
                    fill={vals[axis.id] >= 50 ? TEAL : AMBER} style={{ transition: 'width .3s' }} />
                  <text x={244} y={18 + i * 30} fontSize={11} fontWeight={700} fill={TEAL_DARK} textAnchor="end">{vals[axis.id]}</text>
                </g>
              ))}
            </svg>
            <Card style={{
              padding: 'var(--ds-space-4)',
              background: balanced ? '#E8F3F3' : '#FDF0EC',
              border: `1.5px solid ${balanced ? TEAL : RED}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>PROFILE VERDICT</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: balanced ? TEAL_DARK : RED, margin: '4px 0' }}>
                {balanced
                  ? '✓ Balanced — the interviewer can see your thinking'
                  : codeShare > 45
                    ? `⚠ Code-dominant (${codeShare}% of time) — a silent solver with a perfect answer still reads as memorized`
                    : '⚠ Under-weighted coding — the code bar still has to be cleared first'}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
                Remember: even manager-level candidates sit the coding round. Clear it — then let the other three axes set you apart.
              </div>
            </Card>
          </Stack>
        </Grid>
      </Stack>
    </Card>
  );
}

function HintSim() {
  const [choice, setChoice] = useState(null);
  const picked = HINT_LADDER.find((h) => h.response === choice);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>💡 Hint Simulator — interviewers want to help you</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            You are stuck on an approach that will not work. The interviewer nudges: <em>{HINT_EXAMPLE}</em> How do you respond?
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {HINT_LADDER.map((h) => (
            <button key={h.response} onClick={() => setChoice(h.response)} aria-pressed={choice === h.response} style={chipStyle(choice === h.response)}>
              {h.response}
            </button>
          ))}
        </div>
        {picked && (
          <Card style={{
            padding: 'var(--ds-space-4)',
            background: picked.outcome === 'pass' ? '#E8F3F3' : '#FDF0EC',
            border: `1.5px solid ${picked.outcome === 'pass' ? TEAL : RED}`,
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: picked.outcome === 'pass' ? TEAL_DARK : RED }}>
              {picked.outcome === 'pass' ? '✓ HIRE PATTERN' : '✗ LIFELINE WASTED'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{picked.why}</div>
          </Card>
        )}
      </Stack>
    </Card>
  );
}

function BugWalkthrough() {
  const [tested, setTested] = useState(new Set());
  const cases = [
    { id: 'happy', input: 'nums=[3,3], target=6', verdict: 'pass', trace: 'i=1 finds pair at 0 → [0, 1] ✓' },
    { id: 'edge', input: 'nums=[3], target=6', verdict: 'fail', trace: 'loop ends → returns None silently — no-pair input falls through ✗' },
    { id: 'dup', input: 'nums=[2,7,11], target=9', verdict: 'pass', trace: 'i=1 finds pair at 0 → [0, 1] ✓' },
  ];
  const caught = tested.has('edge');
  const allTested = tested.size === 3;

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🔍 Bug Walkthrough — verification is spoken out loud</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            First draft below. Don't just say “I'm done” — run the cases out loud. A bug found here is a <em>positive</em>; a bug the interviewer spots later is not.
          </p>
        </div>
        <CodeBlock language="python" code={ROUND_CODE} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {cases.map((c) => (
            <button key={c.id} onClick={() => setTested((prev) => new Set([...prev, c.id]))}
              aria-pressed={tested.has(c.id)} style={chipStyle(tested.has(c.id))}>
              ▶ {c.input}
            </button>
          ))}
        </div>
        <Stack gap={2}>
          {cases.filter((c) => tested.has(c.id)).map((c) => (
            <div key={c.id} style={{
              padding: '8px 12px', borderRadius: 8, fontSize: 12.5,
              background: c.verdict === 'pass' ? '#E8F3F3' : '#FDF0EC',
              border: `1px solid ${c.verdict === 'pass' ? TEAL : '#E8B4A8'}`,
            }}>
              <strong style={{ color: c.verdict === 'pass' ? TEAL_DARK : RED }}>{c.verdict === 'pass' ? 'PASS' : 'FAIL — BUG FOUND'}</strong>
              <span style={{ color: 'var(--ds-color-text-secondary)', marginLeft: 8 }}>{c.trace}</span>
            </div>
          ))}
          {tested.size === 0 && (
            <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-tertiary)' }}>No cases run yet — silence is the one move that never wins.</div>
          )}
        </Stack>
        {caught && (
          <Callout type="success" title="You just passed the verification axis">
            Name the bug (“no-pair inputs fall through”), explain the fix (return [] or raise explicitly), apply it. Interviewers are explicitly told that catching bugs is a positive signal — the fail is leaving it there.
          </Callout>
        )}
        {allTested && !caught && (
          <Callout type="warning" title="One case left unexamined">
            The edge case was hiding in the fall-through. Walk at least one no-result input before claiming you're done.
          </Callout>
        )}
        <Grid columns={2} gap="var(--ds-space-4)">
          {BUG_RULES.map((r) => (
            <Card key={r.rule} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK }}>{r.rule}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{r.detail}</div>
            </Card>
          ))}
        </Grid>
      </Stack>
    </Card>
  );
}

function CodingPractice() {
  const drillCols = [
    { key: 'drill', header: 'Drill', render: (v) => <strong>{v}</strong> },
    { key: 'how', header: 'How', sortable: false },
    { key: 'lookFor', header: 'What it exposes', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];
  const topicCols = [
    { key: 'topic', header: 'Pattern family', render: (v) => <strong>{v}</strong> },
    { key: 'why', header: 'Why it recurs', sortable: false },
    { key: 'reps', header: 'Rep recipe', sortable: false },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <h3 style={{ margin: 0 }}>🎯 Breadth with explanation beats depth without it</h3>
          <p style={{ margin: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Rounds are short — a handful of problems in ~40 minutes. Memorized speed-runs of a single exotic pattern are how strong candidates fail; recognition plus explanation is how weaker-on-paper candidates pass.
          </p>
          <Table columns={topicCols} data={TOPIC_FOCUS} sortable={false} />
          <Callout type="info" title="Topic triage">{TOPIC_CAUTION}</Callout>
        </Stack>
      </Card>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={3}>
          <h3 style={{ margin: 0 }}>📼 Talk-aloud drills — the skill hiding inside the skill</h3>
          <Table columns={drillCols} data={PRACTICE_DRILLS} sortable={false} />
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 3. AI & Design Rounds ───────────────────────────────────────────────────

function AIRoundSim() {
  const [choice, setChoice] = useState(null);
  const SCENARIO = 'The assistant proposes a fix that deletes a boundary check “because the tests pass without it.”';
  const outcomes = {
    accept: { grade: 'red', title: '✗ SHIP-IT BLIND', why: 'The check guarded a real edge case the tests never exercised. Accepting the diff unowned is the classic AI-round fail.' },
    tests: { grade: 'amber', title: '◐ TESTS-ONLY', why: 'Better — but a green suite only proves what the suite already knows. Ask what the removed check was protecting.' },
    explain: { grade: 'green', title: '✓ EXPLAIN, THEN DECIDE', why: 'Have the assistant justify the diff, reason about the edge case yourself, then keep, fix, or revert with a spoken rationale. You stayed the engineer in charge.' },
  };
  const picked = outcomes[choice];

  const cols = [
    { key: 'aspect', header: 'Aspect', render: (v) => <strong>{v}</strong> },
    { key: 'detail', header: 'Detail', sortable: false },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🤖 AI-assisted round — you still own every line</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              ~60 minutes in an unfamiliar multi-file codebase with an in-house assistant. The tool is new; the engineering judgment is yours.
            </p>
          </div>
          <Table columns={cols} data={AI_ROUND} sortable={false} />
          <div style={{
            padding: 12, borderRadius: 10, background: 'var(--ds-color-bg-surfaceHover)',
            border: '1px solid var(--ds-color-border-subtle)', fontSize: 13,
          }}>
            <strong>Scenario:</strong> {SCENARIO}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setChoice('accept')} aria-pressed={choice === 'accept'} style={chipStyle(choice === 'accept')}>Accept & submit</button>
            <button onClick={() => setChoice('tests')} aria-pressed={choice === 'tests'} style={chipStyle(choice === 'tests')}>Run the tests first</button>
            <button onClick={() => setChoice('explain')} aria-pressed={choice === 'explain'} style={chipStyle(choice === 'explain')}>Ask why, then decide</button>
          </div>
          {picked && (
            <Card style={{
              padding: 'var(--ds-space-4)',
              background: picked.grade === 'green' ? '#E8F3F3' : picked.grade === 'amber' ? '#F9F1DC' : '#FDF0EC',
              border: `1.5px solid ${picked.grade === 'green' ? TEAL : picked.grade === 'amber' ? AMBER : RED}`,
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: picked.grade === 'green' ? TEAL_DARK : picked.grade === 'amber' ? AMBER : RED }}>{picked.title}</div>
              <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{picked.why}</div>
            </Card>
          )}
          <Callout type="tip" title="Practice exactly like the round feels">
            Read unfamiliar code, propose changes with an AI sidekick, verify every diff against the tests, and narrate the whole loop: edit → run → justify. Ask your recruiter early about practice-environment access.
          </Callout>
        </Stack>
      </Card>
    </Stack>
  );
}

function DesignRound() {
  const [narrated, setNarratedRoute] = useState('push');
  const cols = [
    { key: 'axis', header: 'Option', render: (v) => <strong>{v}</strong> },
    { key: 'pro', header: 'Pro', sortable: false },
    { key: 'con', header: 'Con', sortable: false },
    { key: 'tell', header: 'What the interviewer wants', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🏛️ Design round — you drive, they grade the driving</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              ~45 minutes. There is no single optimal diagram — the grade goes to how you surface requirements and justify trade-offs out loud.
            </p>
          </div>
          <svg viewBox="0 0 860 110" style={{ width: '100%', height: 'auto' }} role="img" aria-label="five design-driver moves in order">
            {DESIGN_DRIVERS.map((d, i) => {
              const x = 6 + i * 172;
              return (
                <g key={d.n}>
                  <rect x={x} y={18} width={156} height={74} rx={11}
                    fill={i === 4 ? '#F4EFE6' : '#E8F3F3'} stroke={i === 4 ? AMBER : TEAL} strokeWidth={1.5} />
                  <text x={x + 10} y={40} fontSize={11} fontWeight={800} fill={TEAL_DARK}>MOVE {d.n}</text>
                  <text x={x + 10} y={58} fontSize={12} fontWeight={700} fill="var(--ds-color-text-primary)">{d.move}</text>
                  <text x={x + 10} y={76} fontSize={9.5} fill="var(--ds-color-text-secondary)">{d.detail.slice(0, 30)}…</text>
                  {i < 4 && (
                    <g>
                      <line x1={x + 156} y1={55} x2={x + 170} y2={55} stroke={PURPLE} strokeWidth={2} />
                      <polygon points={`${x + 170},55 ${x + 164},52 ${x + 164},58`} fill={PURPLE} />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ds-color-text-primary)', marginBottom: 6 }}>
              Narrate this trade-off out loud — pick a side and defend it:
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <button onClick={() => setNarratedRoute('push')} aria-pressed={narratedRoute === 'push'} style={chipStyle(narratedRoute === 'push')}>Push updates</button>
              <button onClick={() => setNarratedRoute('pull')} aria-pressed={narratedRoute === 'pull'} style={chipStyle(narratedRoute === 'pull')}>Pull updates</button>
            </div>
            <Callout type={narratedRoute === 'push' ? 'info' : 'tip'} title={narratedRoute === 'push' ? 'You picked push' : 'You picked pull'}>
              {narratedRoute === 'push'
                ? 'Now say it: “Freshness is worth connection state and fan-out cost because…” The justification, not the option, is the signal. There is no single right answer.'
                : 'Now say it: “The latency budget tolerates polling because…” If you cannot justify it aloud, you do not yet believe it — and neither will they.'}
            </Callout>
          </div>
          <Table columns={cols} data={PUSH_PULL} sortable={false} />
          <Callout type="warning" title="Senior & manager extra">
            Be ready to walk a system you personally designed end-to-end: what you built, why you designed it that way, the trade-offs you made — and the guide's favorite follow-up: what would you change if you did it all over again?
          </Callout>
        </Stack>
      </Card>
    </Stack>
  );
}

// ── 4. Behavioral & Honesty ─────────────────────────────────────────────────

function StarBuilder() {
  const [story, setStory] = useState({ s: 'Our payment service degraded every traffic spike.', t: '', a: '', r: '' });
  const filled = Object.values(story).filter((v) => v.trim().length > 0).length;
  const hasNumber = /\d/.test(story.r);
  const ready = filled === 4 && hasNumber;
  const rows = STAR_FIELDS.map((f) => ({
    ...f,
    value: story[f.field[0].toLowerCase()],
  }));

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🧱 STAR Builder — situation, task, action, result</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Fill each field the way you would say it. The builder warns about the classic weak spots: passive tasks, adjective-only actions, number-free results.
          </p>
        </div>
        <Grid columns={2} gap="var(--ds-space-4)">
          {STAR_FIELDS.map((f) => {
            const key = f.field[0].toLowerCase();
            const weak = f.field === 'Task' && /^we\b/i.test(story[key].trim());
            const missingNum = f.field === 'Result' && story[key].trim() && !/\d/.test(story[key]);
            return (
              <label key={f.field} style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
                {f.field}: <span style={{ fontSize: 11.5, opacity: 0.8 }}>{f.prompt}</span>
                <textarea rows={2} value={story[key]} placeholder={f.weak}
                  onChange={(e) => setStory((s) => ({ ...s, [key]: e.target.value }))}
                  style={{
                    width: '100%', marginTop: 4, borderRadius: 8, padding: 8, resize: 'vertical',
                    border: `1.5px solid ${weak ? RED : missingNum ? AMBER : 'var(--ds-color-border-subtle)'}`,
                    background: 'var(--ds-color-bg-surface)', color: 'var(--ds-color-text-primary)',
                    fontFamily: 'inherit', fontSize: 13,
                  }} aria-label={`STAR ${f.field}`} />
                {weak && <span style={{ color: RED, fontSize: 11 }}>“We …” hides YOUR ownership — start with “I …”</span>}
                {missingNum && <span style={{ color: AMBER, fontSize: 11 }}>Add a number if you can — magnitudes beat adjectives</span>}
              </label>
            );
          })}
        </Grid>
        <Card style={{
          padding: 'var(--ds-space-4)',
          background: ready ? '#E8F3F3' : '#F9F1DC',
          border: `1.5px solid ${ready ? TEAL : AMBER}`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>STORY READINESS</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: ready ? TEAL_DARK : AMBER, margin: '4px 0' }}>
            {ready ? '✓ Interview-ready — say it in 90 seconds, then invite follow-ups' : `${filled}/4 fields · ${hasNumber ? 'result has a number' : 'result still number-free'}`}
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>
            Weak reference: “{STAR_FIELDS[3].weak}” → Strong: “{STAR_FIELDS[3].strong}”
          </div>
        </Card>
      </Stack>
    </Card>
  );
}

function SuccessLadder() {
  const [picked, setPicked] = useState(null);
  const item = SUCCESS_LADDER.find((s) => s.answer === picked);

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={4}>
        <div>
          <h3 style={{ margin: 0 }}>🏆 “Tell me about your most successful project”</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            How you define success reveals your values before any detail does. Pick the way you would actually answer — then see what it signals.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SUCCESS_LADDER.map((s) => (
            <button key={s.answer} onClick={() => setPicked(s.answer)} aria-pressed={picked === s.answer} style={chipStyle(picked === s.answer)}>
              {s.answer}
            </button>
          ))}
        </div>
        {item && (
          <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
            <div style={{ fontSize: 13, color: TEAL_DARK, fontWeight: 700 }}>Signals as:</div>
            <div style={{ fontSize: 13.5, color: 'var(--ds-color-text-primary)', marginTop: 4 }}>{item.reveals}</div>
          </Card>
        )}
        <Grid columns={2} gap="var(--ds-space-4)">
          {BEHAVIORAL_PROBES.map((p) => (
            <Card key={p.probe} style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK }}>{p.probe}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{p.looksFor}</div>
            </Card>
          ))}
        </Grid>
        <Callout type="info" title="Senior stories must be lived-in">
          Multi-month complexity, design ownership, a real launch — and the honest epilogue: what broke later, and what you would redo. Living with your own consequences is the level signal.
        </Callout>
      </Stack>
    </Card>
  );
}

function BluffMeter() {
  const [move, setMove] = useState(null);
  const item = BLUFF_LADDER.find((b) => b.move === move);
  const tone = item?.grade === 'green' ? TEAL : item?.grade === 'amber' ? AMBER : RED;

  return (
    <Stack gap={5}>
      <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
        <Stack gap={4}>
          <div>
            <h3 style={{ margin: 0 }}>🎭 Bluff Meter — honesty plus reasoning wins</h3>
            <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
              You get a question you cannot answer. Perfection is not expected — nobody on the team knows everything. What you do next is graded.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {BLUFF_LADDER.map((b) => (
              <button key={b.move} onClick={() => setMove(b.move)} aria-pressed={move === b.move} style={chipStyle(move === b.move)}>
                {b.move.length > 48 ? `${b.move.slice(0, 45)}…` : b.move}
              </button>
            ))}
          </div>
          {item && (
            <Card style={{
              padding: 'var(--ds-space-4)',
              background: item.grade === 'green' ? '#E8F3F3' : item.grade === 'amber' ? '#F9F1DC' : '#FDF0EC',
              border: `1.5px solid ${tone}`,
            }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: tone }}>
                {item.grade === 'green' ? '✓ THE HIRE MOVE' : item.grade === 'amber' ? '◐ SAFE FLOOR' : '✗ CONFIDENT WRONGNESS'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ds-color-text-secondary)', marginTop: 4 }}>{item.why}</div>
            </Card>
          )}
          <CodeBlock language="text" code={BLUF_TEMPLATE} />
        </Stack>
      </Card>

      <Grid columns={2} gap="var(--ds-space-4)">
        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <Stack gap={3}>
            <h3 style={{ margin: 0 }}>🌟 What the hired candidates shared</h3>
            {WINNER_TRAITS.map((w) => (
              <div key={w.trait} style={{ padding: '10px 12px', borderRadius: 8, background: '#E8F3F3', border: '1px solid #B7D9D9' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: TEAL_DARK }}>{w.trait}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)', marginTop: 2 }}>{w.detail}</div>
              </div>
            ))}
          </Stack>
        </Card>
        <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
          <Stack gap={3}>
            <h3 style={{ margin: 0 }}>🤝 Your recruiter is a coach, not a mailbox</h3>
            <Table
              columns={[
                { key: 'ask', header: 'Ask', render: (v) => <strong>{v}</strong> },
                { key: 'why', header: 'Why it matters', sortable: false },
              ]}
              data={RECRUITER_USES}
              sortable={false}
            />
          </Stack>
        </Card>
      </Grid>
    </Stack>
  );
}

// ── Tab ─────────────────────────────────────────────────────────────────────

export default function InterviewMindsetTab() {
  const [activeSubTab, setActiveSubTab] = useState('rounds');

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="interviewmindset"
        moduleLabel="Agents & Frameworks"
        title="Interview Mindset: What a Thousand Interviews Actually Grade"
        description="Good engineers fail big-tech loops less often on code than on mindset. The loop answers two questions — should we hire you (coding + AI-assisted rounds) and at what level (design + behavioral). Across all four rounds the same four moves win: talk through approaches, listen for hints, catch your own bugs, and understand instead of memorize. Interactive: build your prep clock, balance the four coding axes, run the hint and bug simulators, and assemble a STAR story."
        metrics={[
          { label: 'Rounds mapped', value: '4' },
          { label: 'Coding axes', value: '4' },
          { label: 'Simulators', value: '5' },
          { label: 'Bluff verdicts', value: '3' },
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

        {activeSubTab === 'rounds' && <RoundsMap />}
        {activeSubTab === 'coding' && (
          <Stack gap={5}>
            <FourAxes />
            <HintSim />
            <BugWalkthrough />
            <CodingPractice />
          </Stack>
        )}
        {activeSubTab === 'aidesign' && (
          <Stack gap={5}>
            <AIRoundSim />
            <DesignRound />
          </Stack>
        )}
        {activeSubTab === 'behavior' && (
          <Stack gap={5}>
            <StarBuilder />
            <SuccessLadder />
            <BluffMeter />
          </Stack>
        )}
      </Container>
    </div>
  );
}
