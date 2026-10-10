import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  HONEST_ERROR,
  TRAPS,
  EVALUATION_STEPS,
  RESIDUALS,
  BREAK_AT,
  CHECKLIST,
  CODE_AVAILABILITY,
  trapScores,
  isFeatureLegal,
  assertAvailability,
  delayLegal,
  walkForwardSplits,
  residualMean,
  breakSize,
  checkPlausibility,
  checklistProgress,
} from './forecastTrapsEngine.js';

const { Container, Stack, Grid } = Primitives;

const TEAL = '#3A9B9F';
const TEAL_DARK = '#1A6B6E';
const PURPLE = '#5B4B8A';
const RED = '#B4553A';
const AMBER = '#B9821F';

const SUBTABS = [
  { id: 'traps', icon: '🪤', label: '1. Four Traps', desc: 'Scores that flatter to deceive' },
  { id: 'production', icon: '🕰️', label: '2. Evaluate Like Production', desc: 'Time moves one way' },
  { id: 'noise', icon: '📉', label: '3. Too Good to Be True', desc: 'The noise floor' },
  { id: 'questions', icon: '✅', label: '4. Five Questions', desc: 'Before you trust it' },
];

const SAMPLE_ROWS = [
  { feature: 'settled weekly total', availableAt: 12, issueTime: 10 },
  { feature: 'published index (2-period delay)', availableAt: 8, issueTime: 10 },
  { feature: 'same-week correction', availableAt: 10, issueTime: 10 },
  { feature: 'next-week revision', availableAt: 11, issueTime: 10 },
];

function TrapSimulator() {
  const [active, setActive] = useState(['peek', 'delay']);
  const result = useMemo(() => trapScores(active), [active]);
  const toggle = (id) => {
    setActive((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };
  const honest = HONEST_ERROR;
  const repW = Math.max((result.reported / honest) * 100, 2);
  const statusColor = result.status === 'HONEST' ? TEAL_DARK : result.status === 'INFLATED' ? AMBER : RED;

  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={5}>
        <div>
          <h3 style={{ margin: 0 }}>🪤 Simulator — trap-spotting: toggle each leak</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Each toggle replays an evaluation mistake. Watch the reported error detach from the honest one — the gap is pure flattery.
          </p>
        </div>
        <Grid columns={{ base: '1fr', md: '2fr 1fr' }} gap="var(--ds-space-4)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TRAPS.map((t) => {
              const on = active.includes(t.id);
              return (
                <button key={t.id} onClick={() => toggle(t.id)} aria-pressed={on}
                  style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start', textAlign: 'left',
                    padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    border: `1.5px solid ${on ? RED : 'var(--ds-color-border-subtle)'}`,
                    background: on ? '#FDF0EC' : 'var(--ds-color-bg-surface)',
                    transition: 'all .2s',
                  }}>
                  <span style={{
                    marginTop: 2, width: 34, height: 20, borderRadius: 999, flexShrink: 0,
                    background: on ? RED : '#CBD5E1', position: 'relative', transition: 'background .2s',
                  }}>
                    <span style={{
                      position: 'absolute', top: 2, left: on ? 16 : 2, width: 16, height: 16,
                      borderRadius: '50%', background: 'var(--ds-color-bg-surface)',
                      transition: 'left .2s', boxShadow: '0 1px 2px rgba(0,0,0,.25)',
                    }} />
                  </span>
                  <span>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--ds-color-text-primary)' }}>{t.name}</span>
                    <span style={{ display: 'block', fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>−{t.discount.toFixed(1)} error while active</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ padding: 14, borderRadius: 12, background: 'var(--ds-color-bg-surfaceHover)', border: '1px solid var(--ds-color-border-subtle)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)', marginBottom: 8 }}>REPORTED ERROR (lower looks better)</div>
            <div style={{ height: 16, borderRadius: 8, background: '#E5E7EB', overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ width: `${repW}%`, height: '100%', background: statusColor, transition: 'width .3s, background .3s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 26, fontWeight: 800, color: statusColor }}>{result.reported.toFixed(1)}</span>
              <span style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>honest: <strong style={{ color: TEAL_DARK }}>{result.honest.toFixed(1)}</strong></span>
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant="default">{result.status}</Badge>
              <span style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>flattery gap: {result.gap.toFixed(1)}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
              {result.status === 'HONEST' && 'No traps active. This is the score production will roughly reproduce.'}
              {result.status === 'INFLATED' && 'The score looks better than it is. Remove the active traps before celebrating.'}
              {result.status === 'FANTASY' && 'The score is describing the future, not predicting it. Nothing this good survives contact with live data.'}
            </div>
          </div>
        </Grid>
      </Stack>
    </Card>
  );
}

function LegalTimeline() {
  const [issue, setIssue] = useState(10);
  const delay = 2;
  const maxLegal = delayLegal(issue, delay);
  const N = 16;
  const x = (p) => 40 + (p / (N - 1)) * 880;
  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={5}>
        <div>
          <h3 style={{ margin: 0 }}>🕰️ Legal vs illegal windows at issue time {issue}</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Drag issue time forward. Green periods are published and legal; amber ones exist but are still too fresh (delay of {delay}); red ones have not happened yet.
          </p>
        </div>
        <input type="range" min={3} max={14} step={1} value={issue}
          onChange={(e) => setIssue(parseInt(e.target.value, 10))}
          style={{ width: '100%', accentColor: TEAL_DARK, cursor: 'pointer' }} aria-label="Issue time" />
        <svg viewBox="0 0 960 200" width="100%" role="img" aria-label="Timeline of legal, delayed and future periods around the issue time">
          <line x1="40" y1="110" x2="920" y2="110" stroke="#CBD5E1" strokeWidth="2" />
          {Array.from({ length: N }, (_, p) => {
            const future = p > issue;
            const tooFresh = p > maxLegal && p <= issue;
            const fill = future ? RED : tooFresh ? AMBER : TEAL;
            return (
              <g key={p}>
                <rect x={x(p) - 22} y="70" width="44" height="40" rx="8"
                  fill={future ? '#FDECEC' : tooFresh ? '#FCF3DC' : '#E3F2F2'}
                  stroke={fill} strokeWidth="1.5" style={{ transition: 'all .25s' }} />
                <text x={x(p)} y="94" textAnchor="middle" fontSize="13" fontWeight="800" fill={fill}>{p}</text>
                <line x1={x(p)} y1="110" x2={x(p)} y2="120" stroke="#94A3B8" />
                <text x={x(p)} y="138" textAnchor="middle" fontSize="10" fill="#6B7280">{p === maxLegal ? 'last legal' : p === issue ? 'issue' : ''}</text>
              </g>
            );
          })}
          <line x1={x(issue)} y1="30" x2={x(issue)} y2="160" stroke={TEAL_DARK} strokeWidth="2.5" />
          <polygon points={`${x(issue) - 7},30 ${x(issue) + 7},30 ${x(issue)},42`} fill={TEAL_DARK} />
          <g fontSize="11" fill="#6B7280">
            <rect x="40" y="160" width="12" height="10" rx="3" fill={TEAL} /><text x="58" y="169">legal ≤ {maxLegal}</text>
            <rect x="170" y="160" width="12" height="10" rx="3" fill={AMBER} /><text x="188" y="169">too fresh</text>
            <rect x="290" y="160" width="12" height="10" rx="3" fill={RED} /><text x="308" y="169">future</text>
          </g>
        </svg>
        <Callout type="warning" title={`Rule: at issue time ${issue}, nothing newer than period ${issue} may be used — and nothing newer than ${maxLegal} for delayed sources`}>
          Availability is a property of the timestamp, not of the value. If a correction lands at period {issue + 1}, forecasts issued at {issue} must not see it.
        </Callout>
      </Stack>
    </Card>
  );
}

function ResidualPlot() {
  const W = 960;
  const H = 240;
  const y0 = 40;
  const y1 = 200;
  const toX = (i) => 50 + (i / (RESIDUALS.length - 1)) * 860;
  const toY = (v) => {
    const min = -2;
    const max = 5;
    return y1 - ((v - min) / (max - min)) * (y1 - y0);
  };
  const pts = RESIDUALS.map((v, i) => `${toX(i)},${toY(v)}`).join(' ');
  const before = residualMean(RESIDUALS, 0, BREAK_AT);
  const after = residualMean(RESIDUALS, BREAK_AT, RESIDUALS.length);
  const shift = breakSize(RESIDUALS, BREAK_AT);
  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={5}>
        <div>
          <h3 style={{ margin: 0 }}>📉 Residuals reveal what averages hide</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Same model, 24 periods. The average error looks fine — but the residuals jump a full level at period {BREAK_AT + 1}. That step is the structural break.
          </p>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Residual plot with a level shift after period 12">
          <line x1="50" y1={toY(0)} x2="910" y2={toY(0)} stroke="#94A3B8" strokeDasharray="6 4" />
          <text x="56" y={toY(0) - 6} fontSize="11" fill="#6B7280">zero error</text>
          <line x1={toX(BREAK_AT - 0.5)} y1="30" x2={toX(BREAK_AT - 0.5)} y2="210" stroke={PURPLE} strokeWidth="2" strokeDasharray="7 5" />
          <text x={toX(BREAK_AT - 0.5)} y="24" textAnchor="middle" fontSize="12" fontWeight="800" fill={PURPLE}>break after period {BREAK_AT}</text>
          <line x1="50" y1={toY(before)} x2={toX(BREAK_AT - 0.5)} y2={toY(before)} stroke={TEAL} strokeWidth="2.5" />
          <line x1={toX(BREAK_AT - 0.5)} y1={toY(after)} x2="910" y2={toY(after)} stroke={RED} strokeWidth="2.5" />
          <text x="880" y={toY(before) - 8} textAnchor="end" fontSize="11" fontWeight="700" fill={TEAL_DARK}>mean before: {before.toFixed(2)}</text>
          <text x="880" y={toY(after) - 8} textAnchor="end" fontSize="11" fontWeight="700" fill={RED}>mean after: {after.toFixed(2)}</text>
          <polyline points={pts} fill="none" stroke={TEAL_DARK} strokeWidth="2" opacity="0.35" />
          {RESIDUALS.map((v, i) => (
            <circle key={i} cx={toX(i)} cy={toY(v)} r="6"
              fill={i < BREAK_AT ? TEAL : RED} stroke="var(--ds-color-bg-surface)" strokeWidth="1.5">
              <title>{`period ${i + 1}: ${v}`}</title>
            </circle>
          ))}
        </svg>
        <Callout type="info" title={`Level shift of ${shift.toFixed(2)} — fit two levels, not one`}>
          Split the history at the break and estimate each side separately. One average across a step is wrong on both sides at once.
        </Callout>
      </Stack>
    </Card>
  );
}

function PlausibilityChecker() {
  const [reported, setReported] = useState('1.0');
  const [noise, setNoise] = useState('6.8');
  const r = parseFloat(reported);
  const n = parseFloat(noise);
  const valid = Number.isFinite(r) && Number.isFinite(n) && n > 0 && r >= 0;
  const verdict = valid ? checkPlausibility(r, n) : null;
  const color = !verdict ? 'var(--ds-color-text-tertiary)' : verdict.verdict === 'TOO GOOD' ? RED : verdict.verdict === 'BORDERLINE' ? AMBER : TEAL_DARK;
  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={5}>
        <div>
          <h3 style={{ margin: 0 }}>🔍 Simulator — score plausibility checker</h3>
          <p style={{ margin: '4px 0 0 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
            Enter a reported error and a noise-floor estimate (the error of a naive baseline on pure randomness). A model cannot honestly beat the noise it swims in.
          </p>
        </div>
        <Grid columns={{ base: '1fr', md: '2fr 1fr' }} gap="var(--ds-space-4)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>
              Reported error
              <input type="number" min="0" step="0.1" value={reported} onChange={(e) => setReported(e.target.value)}
                style={{ display: 'block', marginTop: 4, width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--ds-color-border-default)', fontFamily: 'ui-monospace, monospace', fontSize: 15 }} />
            </label>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ds-color-text-primary)' }}>
              Noise-floor estimate
              <input type="number" min="0.1" step="0.1" value={noise} onChange={(e) => setNoise(e.target.value)}
                style={{ display: 'block', marginTop: 4, width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--ds-color-border-default)', fontFamily: 'ui-monospace, monospace', fontSize: 15 }} />
            </label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[['1.0', '6.8'], ['7.1', '6.8'], ['9.5', '6.8']].map(([a, b], i) => (
                <button key={i} onClick={() => { setReported(a); setNoise(b); }}
                  style={{ fontSize: 11.5, padding: '4px 10px', borderRadius: 999, cursor: 'pointer', border: '1px solid var(--ds-color-border-default)', background: 'transparent', color: 'var(--ds-color-text-secondary)' }}>
                  try {a} vs {b}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 12, border: `2px solid ${color}`, background: 'var(--ds-color-bg-surfaceHover)', transition: 'border-color .3s', textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ds-color-text-secondary)' }}>VERDICT</div>
            <div style={{ fontSize: 26, fontWeight: 800, color, margin: '6px 0', transition: 'color .3s' }}>{verdict ? verdict.verdict : '—'}</div>
            {verdict && (
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13, color: 'var(--ds-color-text-secondary)' }}>ratio {verdict.ratio.toFixed(2)} × noise</div>
            )}
            <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--ds-color-text-secondary)', lineHeight: 1.6 }}>
              {!verdict && 'Enter two non-negative numbers to judge.'}
              {verdict && verdict.verdict === 'TOO GOOD' && 'Below the noise floor: the evaluation is leaking future information. Fix the setup, not the model.'}
              {verdict && verdict.verdict === 'BORDERLINE' && 'Suspiciously close to the floor. Demand a walk-forward rerun before trusting it.'}
              {verdict && verdict.verdict === 'PLAUSIBLE' && 'Above the floor with room to spare. Still check the other four questions.'}
            </div>
          </div>
        </Grid>
      </Stack>
    </Card>
  );
}

function Checklist() {
  const [checked, setChecked] = useState(['plot']);
  const prog = checklistProgress(checked);
  const toggle = (id) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };
  return (
    <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
      <Stack gap={5}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0 }}>Five questions before you trust a forecast</h3>
          <Badge variant="default">{prog.done}/{prog.total} · {prog.pct}%</Badge>
        </div>
        <div style={{ height: 12, borderRadius: 7, background: '#EEF1F4', overflow: 'hidden' }}>
          <div style={{ width: `${prog.pct}%`, height: '100%', background: prog.ready ? TEAL : PURPLE, transition: 'width .3s, background .3s' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CHECKLIST.map((c, i) => {
            const on = checked.includes(c.id);
            return (
              <button key={c.id} onClick={() => toggle(c.id)} aria-pressed={on}
                style={{
                  display: 'flex', gap: 12, textAlign: 'left', padding: '12px 14px', borderRadius: 10,
                  cursor: 'pointer', border: `1.5px solid ${on ? TEAL : 'var(--ds-color-border-subtle)'}`,
                  background: on ? '#EAF4F4' : 'var(--ds-color-bg-surface)', transition: 'all .2s',
                }}>
                <span style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13,
                  background: on ? TEAL : 'transparent', color: on ? 'var(--ds-color-bg-surface)' : 'var(--ds-color-text-tertiary)',
                  border: `2px solid ${on ? TEAL : 'var(--ds-color-border-default)'}`, transition: 'all .2s',
                }}>{on ? '✓' : i + 1}</span>
                <span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ds-color-text-primary)' }}>{c.question}</span>
                  <span style={{ display: 'block', fontSize: 13, color: 'var(--ds-color-text-secondary)', marginTop: 2, lineHeight: 1.6 }}>{c.why}</span>
                </span>
              </button>
            );
          })}
        </div>
        {prog.ready
          ? <Callout type="success" title="All five answered — now rerun it">A checklist is a gate, not a grade. The rerun under honest conditions is the actual evidence.</Callout>
          : <Callout type="tip" title="A caveat the model ignores is not a fix">If the warning lives only in prose while the code keeps reading the future, the leak is still open.</Callout>}
      </Stack>
    </Card>
  );
}

export default function ForecastTrapsTab() {
  const [activeSubTab, setActiveSubTab] = useState('traps');

  const trapColumns = [
    { key: 'name', header: 'Trap', render: (v) => <strong style={{ color: RED }}>{v}</strong> },
    { key: 'symptom', header: 'What it looks like', sortable: false },
    { key: 'live', header: 'Why it fails live', sortable: false },
    { key: 'fix', header: 'Fix', render: (v) => <span style={{ color: TEAL_DARK }}>{v}</span> },
  ];
  const stepColumns = [
    { key: 'n', header: 'Step', render: (v) => <strong style={{ color: TEAL_DARK, fontFamily: 'ui-monospace, monospace' }}>{v}</strong> },
    { key: 'step', header: 'Do this', render: (v) => <strong>{v}</strong> },
    { key: 'detail', header: 'Detail', sortable: false },
  ];
  const availColumns = [
    { key: 'feature', header: 'Feature', render: (v) => <strong>{v}</strong> },
    { key: 'availableAt', header: 'Available at', sortable: false },
    { key: 'issueTime', header: 'Issue time', sortable: false },
    {
      key: 'verdict', header: 'Verdict', sortable: false,
      render: (_, row) => (isFeatureLegal(row.availableAt, row.issueTime)
        ? <span style={{ color: TEAL_DARK, fontWeight: 700 }}>✓ LEGAL</span>
        : <span style={{ color: RED, fontWeight: 700 }}>✕ LEAK</span>),
    },
  ];
  const foldColumns = [
    { key: 'fold', header: 'Fold', render: (v) => <strong style={{ color: PURPLE }}>{v}</strong> },
    { key: 'train', header: 'Train periods', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace' }}>{v[0]}–{v[1]}</span> },
    { key: 'test', header: 'Test periods', render: (v) => <span style={{ fontFamily: 'ui-monospace, monospace' }}>{v[0]}–{v[1]}</span> },
  ];

  const folds = walkForwardSplits(12, 6, 2);
  const audit = assertAvailability(SAMPLE_ROWS);

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero
        moduleId="forecasttraps"
        moduleLabel="Evaluation & Methodology"
        title="Forecast Traps: When the Score Is Reading the Future"
        description="A forecasting score can look brilliant offline and collapse live for one reason: the evaluation accidentally handed the model information that production would not have yet. Learn the four classic traps, evaluate the way production runs, and distrust any error below the noise floor."
        metrics={[
          { label: 'Traps in the gallery', value: '4' },
          { label: 'Honest error (illustrative)', value: '8.4' },
          { label: 'Future periods admitted', value: '0' },
          { label: 'Questions before trust', value: '5' },
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

        {activeSubTab === 'traps' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>The four traps — same honest error, four ways to flatter it</h3>
              <Table columns={trapColumns} data={TRAPS} sortable={false} />
            </Card>
            <TrapSimulator />
            <Callout type="danger" title="The pattern across all four">
              Offline the leak looks like skill; live it reads as a mystery collapse. If a score improves the moment you add a suspicious feature, suspect the calendar before applauding the model.
            </Callout>
          </Stack>
        )}

        {activeSubTab === 'production' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Three rules that make evaluation honest</h3>
              <Table columns={stepColumns} data={EVALUATION_STEPS} sortable={false} />
            </Card>
            <LegalTimeline />
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Availability audit at issue time 10</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                {audit.illegalCount} of {SAMPLE_ROWS.length} features leak. A single illegal input is enough to void the whole score.
              </p>
              <Table columns={availColumns} data={SAMPLE_ROWS} sortable={false} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Walk-forward plan: 12 periods, train on 6, score the next 2</h3>
              <p style={{ margin: '0 0 12px 0', color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-bodySm)' }}>
                Five refits, five honest scores. Average them instead of reporting the luckiest fold.
              </p>
              <Table columns={foldColumns} data={folds} sortable={false} />
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>Availability assertion + walk-forward, in code</h3>
              <CodeBlock language="python" code={CODE_AVAILABILITY} />
              <Callout type="tip" title="Put the rule where the model cannot dodge it">
                An assertion raises an error; a comment raises nothing. Leakage checks belong in the pipeline, executed on every run.
              </Callout>
            </Card>
          </Stack>
        )}

        {activeSubTab === 'noise' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <Stack gap={4}>
                <h3 style={{ margin: 0 }}>The noise floor: pure randomness sets a minimum error</h3>
                <p style={{ margin: 0, color: 'var(--ds-color-text-secondary)', fontSize: 'var(--ds-font-size-body)', lineHeight: 1.7 }}>
                  Some part of the future is simply unpredictable — coin-flip demand, one-off shocks, measurement jitter.
                  A naive baseline that predicts “about average” already captures everything predictable, and its leftover error is the floor.
                  Any model reporting an error far below that floor is not beating randomness; it is peeking at the answers.
                </p>
                <Grid columns={{ base: '1fr', md: '2fr 1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                    <Badge variant="default">honest model</Badge>
                    <div style={{ fontSize: 26, fontWeight: 800, color: TEAL_DARK, fontFamily: 'ui-monospace, monospace' }}>8.4</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>Sits just above the floor. Boring, believable, reproducible.</div>
                  </Card>
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                    <Badge variant="default">noise floor</Badge>
                    <div style={{ fontSize: 26, fontWeight: 800, color: AMBER, fontFamily: 'ui-monospace, monospace' }}>6.8</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>Best error randomness alone allows. Nobody goes under it honestly.</div>
                  </Card>
                  <Card style={{ padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surfaceHover)' }}>
                    <Badge variant="default">leaky model</Badge>
                    <div style={{ fontSize: 26, fontWeight: 800, color: RED, fontFamily: 'ui-monospace, monospace' }}>1.0</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ds-color-text-secondary)' }}>Below the floor, so the setup — not the model — is doing the work.</div>
                  </Card>
                </Grid>
              </Stack>
            </Card>
            <PlausibilityChecker />
            <ResidualPlot />
          </Stack>
        )}

        {activeSubTab === 'questions' && (
          <Stack gap={6}>
            <Checklist />
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-surface)' }}>
              <h3 style={{ margin: '0 0 4px 0' }}>The one-line version of each question</h3>
              <Table
                columns={[
                  { key: 'question', header: 'Ask', render: (v) => <strong>{v}</strong> },
                  { key: 'why', header: 'Why it matters', sortable: false },
                ]}
                data={CHECKLIST}
                sortable={false}
              />
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
