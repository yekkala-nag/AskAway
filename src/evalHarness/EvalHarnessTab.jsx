import React, { useState, useMemo } from 'react';
import * as Primitives from '../components/layout/Primitives.jsx';
import { Hero, CodeBlock, Table } from '../components/ui/Content.jsx';
import { Card, Badge, Callout } from '../components/ui/Core.jsx';
import {
  TEAL, TEAL_DARK, PURPLE, RED, AMBER,
  sampleGoldenDataset, judgeKind, cascadePlan, jsonlAppend, parseJsonl, summarize, rescoreGain,
  HARNESS_STAGES, JUDGE_COMPARISON, HARNESS_CODE, RUNNER_POLICY, DATASET_SIZE,
  DESK_VS_LOG, CONCEPT_CLARITY_RULE, VAGUE_VS_CLEAR,
  TEMP_ZERO_NOTE, STRUCTURED_OUTPUT_NOTE, CRASH_SAFE_NOTE, RESCORE_NOTE,
} from './harnessEngine.js';

const { Container, Stack, Grid } = Primitives;
const NAV = { display: 'flex', gap: 'var(--ds-space-2)', marginBottom: 'var(--ds-space-6)', background: 'var(--ds-color-bg-surface)', padding: 'var(--ds-space-2)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-color-border-subtle)', overflowX: 'auto' };
const MONO = { fontFamily: 'monospace' };

const CAT_COLORS = { factual: TEAL, format: PURPLE, refusal: RED, ambiguity: AMBER };
const catColor = (category) => CAT_COLORS[category] || TEAL;
const pad2 = (n) => String(n).padStart(2, '0');
const pct = (part, whole) => (whole > 0 ? (part / whole) * 100 : 0);

function HarnessFlowSVG() {
  const boxes = [
    { x: 12, title: 'Golden dataset', sub: '20–50 cases, your rubric', tag: 'id · input · concept', color: TEAL },
    { x: 176, title: 'Inference runner', sub: 'retry · timeout · cap', tag: 'raw outputs only', color: PURPLE },
    { x: 340, title: 'Judge layer', sub: 'det first → LLM', tag: 'pass/fail + reason', color: AMBER },
    { x: 504, title: 'Result logger', sub: 'append-only JSONL', tag: 'raws + scores', color: TEAL_DARK },
  ];
  return (
    <svg viewBox="0 0 660 232" style={{ width: '100%', height: 'auto', background: 'var(--ds-color-bg-canvas)', borderRadius: 12 }} role="img" aria-label="Custom eval harness flow: golden dataset, inference runner, judge layer, result logger">
      <text x={330} y={26} textAnchor="middle" fontSize={15} fontWeight="bold" fill="var(--ds-color-text-primary)">Four modules you own</text>
      <text x={330} y={44} textAnchor="middle" fontSize={11} fill="var(--ds-color-text-secondary)">Public benchmarks measure general capability — this measures your product&apos;s policy and rubric</text>
      {boxes.map((b, i) => (
        <g key={b.title}>
          <rect x={b.x} y={64} width={144} height={86} rx={10} fill="var(--ds-color-bg-surface)" stroke={b.color} strokeWidth={2} style={{ transition: 'all 0.25s ease' }} />
          <text x={b.x + 72} y={92} textAnchor="middle" fontSize={12.5} fontWeight="bold" fill="var(--ds-color-text-primary)">{b.title}</text>
          <text x={b.x + 72} y={112} textAnchor="middle" fontSize={10} fill="var(--ds-color-text-secondary)">{b.sub}</text>
          <text x={b.x + 72} y={132} textAnchor="middle" fontSize={10} fill={b.color}>{b.tag}</text>
          {i < boxes.length - 1 && (
            <g>
              <line x1={b.x + 146} y1={107} x2={b.x + 152} y2={107} stroke="var(--ds-color-border-strong)" strokeWidth={1.5} />
              <polygon points={`${b.x + 152},103 ${b.x + 160},107 ${b.x + 152},111`} fill="var(--ds-color-border-strong)" />
            </g>
          )}
        </g>
      ))}
      <path d="M 576 150 L 576 204 L 84 204 L 84 150" fill="none" stroke={TEAL} strokeWidth={1.5} strokeDasharray="6 4" />
      <polygon points="84,144 79,153 89,153" fill={TEAL} />
      <text x={330} y={198} textAnchor="middle" fontSize={10.5} fill={TEAL}>re-score stored raws — 0 inference calls</text>
    </svg>
  );
}

export default function EvalHarnessTab() {
  const [sub, setSub] = useState('arch');
  // Cascade simulator: share of deterministic cases the local judge settles
  const [detPassPct, setDetPassPct] = useState(75);
  // Crash-safe log demo: how far the run got before it died
  const [crashAfter, setCrashAfter] = useState(17);
  // Re-score simulator: tolerance of the improved judge
  const [newThreshold, setNewThreshold] = useState(0.5);

  const cases = useMemo(() => sampleGoldenDataset(), []);
  const plan = useMemo(() => cascadePlan(cases, detPassPct / 100), [cases, detPassPct]);

  const CRASH_TOTAL = 40;
  const CRASH_STAMP = '2026-03-02T09:14:00.000Z';
  const crashRecords = useMemo(() => Array.from({ length: crashAfter }, (_, i) => {
    const c = cases[i % cases.length];
    return {
      id: c.id,
      ts: new Date(Date.parse(CRASH_STAMP) + i * 1000).toISOString(),
      judge: judgeKind(c),
      pass: (i * 3) % 10 < 7,
      raw: `${c.input.slice(0, 26)}…`,
    };
  }), [crashAfter, cases]);
  const crashText = useMemo(() => jsonlAppend(crashRecords, CRASH_STAMP), [crashRecords]);
  const crashParsed = useMemo(() => parseJsonl(crashText), [crashText]);
  const crashSummary = useMemo(() => summarize(crashParsed), [crashParsed]);
  const crashLines = useMemo(() => crashText.split('\n').filter(Boolean).slice(0, 4), [crashText]);

  const rawOutputs = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: `R-${pad2(i + 1)}`,
    fit: ((i * 37) % 100) / 100,
    raw: `stored raw output ${i + 1}`,
  })), []);
  const oldJudge = useMemo(() => {
    const passed = rawOutputs.filter((r) => r.fit >= 0.8).length;
    return { passed, passRate: Math.round((passed / rawOutputs.length) * 1000) / 1000 };
  }, [rawOutputs]);
  const gain = useMemo(
    () => rescoreGain({ rawOutputs, newJudgePassFn: (r) => r.fit >= newThreshold }),
    [rawOutputs, newThreshold],
  );
  const passRateShift = Math.round((gain.passRate - oldJudge.passRate) * 1000) / 1000;

  const SUBTABS = [
    { id: 'arch', icon: '🏗️', label: '1. Architecture', desc: 'Four modules' },
    { id: 'golden', icon: '📚', label: '2. Golden Dataset', desc: 'Cases that count' },
    { id: 'cascade', icon: '⚖️', label: '3. Judge Cascade', desc: 'Det first, LLM next' },
    { id: 'jsonl', icon: '🧾', label: '4. JSONL & Re-score', desc: 'Crash-safe history' },
  ];

  return (
    <div style={{ paddingBottom: 'var(--ds-space-12)' }}>
      <Hero moduleId="agents_frameworks" moduleLabel="Agent Systems & Frameworks [Custom Eval Harness]"
        title="Custom Eval Harness: Own Your Four Modules"
        description="Public benchmarks measure general capability, not your product's policy or rubric. Build a harness you own: golden dataset, inference runner, judge layer, crash-safe logger — then re-score old outputs instead of re-running inference."
        metrics={[
          { label: 'Modules you own', value: '4' },
          { label: 'Suite size', value: `${DATASET_SIZE.min}–${DATASET_SIZE.max}` },
          { label: 'Judge temperature', value: '0' },
          { label: 'Log format', value: 'JSONL' },
        ]} />
      <Container size="wide">
        <div style={NAV}>
          {SUBTABS.map((t) => (
            <button key={t.id} onClick={() => setSub(t.id)} style={{ flex: 1, minWidth: '200px', padding: 'var(--ds-space-3) var(--ds-space-4)', borderRadius: 'var(--ds-radius-md)', border: 'none', background: sub === t.id ? 'var(--ds-color-module-foundations-primary)' : 'transparent', color: sub === t.id ? 'var(--ds-color-text-primary)' : 'var(--ds-color-text-secondary)', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s ease' }}>
              <div style={{ display: 'flex', gap: '8px', fontSize: 'var(--ds-font-size-body)' }}><span>{t.icon}</span><span>{t.label}</span></div>
              <div style={{ fontSize: 'var(--ds-font-size-caption)', opacity: 0.75 }}>{t.desc}</div>
            </button>
          ))}
        </div>

        {sub === 'arch' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🏗️ A harness is four modules you own</h3>
                  <Badge variant="default">dataset → runner → judge → logger</Badge>
                </div>
                <HarnessFlowSVG />
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {HARNESS_STAGES.map((s) => (
                    <Card key={s.order} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${s.color}` }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px' }}>{s.icon}</span>
                        <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>{s.order}. {s.name}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '4px' }}>{s.owns}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>Hands off: {s.handsOff}</div>
                    </Card>
                  ))}
                </Grid>
                <Grid columns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap="var(--ds-space-3)">
                  {[
                    { label: 'Retries', value: RUNNER_POLICY.retries },
                    { label: 'Timeout', value: `${RUNNER_POLICY.timeoutMs / 1000}s` },
                    { label: 'Concurrency cap', value: RUNNER_POLICY.concurrency },
                    { label: 'Scoring in runner', value: 'never' },
                  ].map((m) => (
                    <Card key={m.label} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: TEAL_DARK, fontFamily: 'monospace' }}>{m.value}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{m.label}</div>
                    </Card>
                  ))}
                </Grid>
                <Callout type="info"><strong>Benchmarks aren&apos;t your rubric:</strong> a public leaderboard scores generic capability on someone else&apos;s tasks. Your product fails on its own policy edge cases — that is the suite only you can write. {RUNNER_POLICY.note}</Callout>
              </Stack>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>⚖️ Two judges, one cascade</h3>
                <Table sortable={false} columns={[
                  { key: 'aspect', header: 'Aspect' },
                  { key: 'deterministic', header: 'Deterministic judge' },
                  { key: 'llmJudge', header: 'LLM judge' },
                ]} data={JUDGE_COMPARISON} />
                <CodeBlock language="python" code={HARNESS_CODE} />
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'golden' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>📚 The golden dataset</h3>
                  <Badge variant="default">{cases.length} canned · {DATASET_SIZE.min}–{DATASET_SIZE.max} recommended</Badge>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ds-color-text-secondary)' }}>Cases come from real user logs and known failure modes, not from a happy-path imagination. Every case is an id, an input, and a short, unambiguous expected_concept — the concept the judge checks.</p>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {cases.map((c) => (
                    <Card key={c.id} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${catColor(c.category)}` }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: 13, ...MONO }}>{c.id}</strong>
                        <Badge size="sm" style={{ background: 'transparent', border: `1px solid ${catColor(c.category)}`, color: catColor(c.category) }}>{c.category}</Badge>
                        <Badge size="sm" variant="default">{c.origin === 'log' ? '📋 real-log' : '🪑 desk-made'}</Badge>
                        <Badge size="sm" variant="default">{judgeKind(c) === 'deterministic' ? '⚖️ deterministic judge' : '🧠 llm judge'}</Badge>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '8px' }}>Input: <span style={{ color: 'var(--ds-color-text-primary)' }}>{c.input}</span></div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-tertiary)', marginTop: '8px' }}>expected_concept</div>
                      <div style={{ fontSize: '12.5px', color: 'var(--ds-color-text-primary)', marginTop: '2px' }}>{c.expected_concept}</div>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🪑 vs 📋 Desk-made cases cluster on the happy path</h3>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {DESK_VS_LOG.map((d) => (
                    <Card key={d.source} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${d.color}` }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px' }}>{d.icon}</span>
                        <strong style={{ color: 'var(--ds-color-text-primary)', fontSize: '13px' }}>{d.source}</strong>
                        <Badge size="sm" variant="default">{cases.filter((c) => c.origin === d.origin).length} of {cases.length} here</Badge>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{d.strength}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ds-color-text-tertiary)', marginTop: '4px' }}>{d.weakness}</div>
                    </Card>
                  ))}
                </Grid>
                <Callout type="warning"><strong>Desk-made blind spot:</strong> the person writing the case already knows the right answer, so the suite fills up with inputs the system already handles. Mine real logs for the failures — every regression that reached a user becomes a case.</Callout>
              </Stack>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🎯 The expected-concept clarity rule</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ds-color-text-secondary)' }}>{CONCEPT_CLARITY_RULE}</p>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  {VAGUE_VS_CLEAR.map((v) => (
                    <Card key={v.verdict} style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${v.color}` }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span>{v.icon}</span>
                        <strong style={{ color: v.color, fontSize: '13px' }}>{v.verdict} concept</strong>
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--ds-color-text-primary)', marginTop: '6px', ...MONO }}>{v.concept}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginTop: '6px' }}>{v.problem}</div>
                    </Card>
                  ))}
                </Grid>
                <Callout type="tip"><strong>Write it as a check:</strong> if you cannot say what single concept makes the case pass, the case is not ready — fix the concept before the judge ever sees it.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'cascade' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>⚖️ Judge cascade simulator</h3>
                  <Badge variant="default">deterministic first → LLM judge for misses</Badge>
                </div>
                <div style={MONO}>savedApiCalls = all-LLM calls − cases the cascade routes to the LLM judge</div>
                <label style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)' }}>
                  Deterministic-judge pass rate (checkable cases settled locally): {detPassPct}%
                  <input type="range" min="0" max="100" step="5" value={detPassPct} onChange={(e) => setDetPassPct(+e.target.value)} style={{ width: '100%' }} />
                </label>
                <div style={{ display: 'flex', width: '100%', height: '34px', borderRadius: 'var(--ds-radius-md)', overflow: 'hidden', border: '1px solid var(--ds-color-border-subtle)' }} aria-hidden="true">
                  <div style={{ width: `${pct(plan.detCount - plan.detRouted, plan.total)}%`, background: TEAL, transition: 'width 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 600, overflow: 'hidden' }}>{plan.detCount - plan.detRouted}</div>
                  <div style={{ width: `${pct(plan.detRouted, plan.total)}%`, background: AMBER, transition: 'width 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 600, overflow: 'hidden' }}>{plan.detRouted}</div>
                  <div style={{ width: `${pct(plan.total - plan.detCount, plan.total)}%`, background: PURPLE, transition: 'width 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 600, overflow: 'hidden' }}>{plan.total - plan.detCount}</div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--ds-space-4)', flexWrap: 'wrap', fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>
                  <span>🟩 {TEAL} deterministic judge settled locally ({plan.detCount - plan.detRouted})</span>
                  <span>🟨 {AMBER} deterministic miss routed to LLM judge ({plan.detRouted})</span>
                  <span>🟪 {PURPLE} semantic case, always LLM judge ({plan.total - plan.detCount})</span>
                </div>
                <Grid columns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap="var(--ds-space-3)">
                  {[
                    { label: 'Deterministic cases', value: plan.detCount, color: TEAL },
                    { label: 'Routed to LLM judge', value: plan.llmRouted, color: PURPLE },
                    { label: 'All-LLM baseline', value: plan.allLlmCalls, color: RED },
                    { label: 'API calls saved', value: plan.savedApiCalls, color: TEAL_DARK },
                  ].map((m) => (
                    <Card key={m.label} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', textAlign: 'center', borderLeft: `3px solid ${m.color}` }}>
                      <div style={{ fontSize: '22px', fontWeight: 700, color: m.color, fontFamily: 'monospace', transition: 'all 0.2s ease' }}>{m.value}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{m.label}</div>
                    </Card>
                  ))}
                </Grid>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)', marginBottom: '6px' }}>
                    API-cost saving: {plan.savedApiCalls} of {plan.allLlmCalls} calls avoided ({Math.round(pct(plan.savedApiCalls, plan.allLlmCalls))}%)
                  </div>
                  <div style={{ height: '12px', borderRadius: 'var(--ds-radius-full)', background: 'var(--ds-color-bg-surfaceHover)', overflow: 'hidden' }}>
                    <div style={{ width: `${pct(plan.savedApiCalls, plan.allLlmCalls)}%`, height: '100%', background: TEAL_DARK, transition: 'width 0.3s ease' }} />
                  </div>
                </div>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-3)">
                  <Callout type="success"><strong>Temperature 0 for judges:</strong> {TEMP_ZERO_NOTE}</Callout>
                  <Callout type="info"><strong>Structured verdicts:</strong> {STRUCTURED_OUTPUT_NOTE}</Callout>
                </Grid>
                <Callout type="tip"><strong>Why cascade at all:</strong> exact-matchable criteria (a prefix, an ID, a JSON shape) never need a model. Route only the failures and ambiguities downward — the free judge runs first, every time.</Callout>
              </Stack>
            </Card>
          </Stack>
        )}

        {sub === 'jsonl' && (
          <Stack gap={6}>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🧾 Crash-safe log demo</h3>
                  <Badge variant="default">append-only · one record per line</Badge>
                </div>
                <label style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)' }}>
                  Cases completed before the run dies: {crashAfter} of {CRASH_TOTAL}
                  <input type="range" min="1" max={CRASH_TOTAL} value={crashAfter} onChange={(e) => setCrashAfter(+e.target.value)} style={{ width: '100%' }} />
                </label>
                <Grid columns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap="var(--ds-space-3)">
                  {[
                    { label: 'Records on disk', value: crashSummary.total, color: TEAL_DARK },
                    { label: 'Lost to the crash', value: CRASH_TOTAL - crashSummary.total, color: RED },
                    { label: 'Recovered by parser', value: crashParsed.length, color: TEAL },
                    { label: 'Pass rate kept', value: crashSummary.passRate, color: AMBER },
                  ].map((m) => (
                    <Card key={m.label} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', textAlign: 'center', borderLeft: `3px solid ${m.color}` }}>
                      <div style={{ fontSize: '22px', fontWeight: 700, color: m.color, fontFamily: 'monospace', transition: 'all 0.2s ease' }}>{m.value}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{m.label}</div>
                    </Card>
                  ))}
                </Grid>
                <pre style={{ margin: 0, padding: 'var(--ds-space-4)', background: 'var(--ds-color-bg-surface)', border: '1px solid var(--ds-color-border-subtle)', borderRadius: 'var(--ds-radius-md)', overflowX: 'auto', fontSize: '11px', lineHeight: 1.6, ...MONO, color: 'var(--ds-color-text-secondary)' }}>
                  {crashLines.join('\n')}
                  {crashSummary.total > crashLines.length ? `\n… ${crashSummary.total - crashLines.length} more lines already on disk` : ''}
                </pre>
                <Callout type="warning"><strong>Dying mid-dataset is normal:</strong> {CRASH_SAFE_NOTE}</Callout>
              </Stack>
            </Card>
            <Card style={{ padding: 'var(--ds-space-5)', background: 'var(--ds-color-bg-canvas)' }}>
              <Stack gap={4}>
                <div style={{ display: 'flex', gap: 'var(--ds-space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, color: 'var(--ds-color-text-primary)' }}>🔁 Re-score simulator</h3>
                  <Badge variant="default">{rawOutputs.length} stored raws · 0 new inference</Badge>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ds-color-text-secondary)' }}>The runner already stored every raw output beside its score. Slide the improved judge&apos;s paraphrase tolerance and watch the same 40 stored raws get new verdicts — the inference runner is never touched.</p>
                <label style={{ fontSize: '12px', color: 'var(--ds-color-text-secondary)' }}>
                  Improved judge paraphrase tolerance (fit threshold): {newThreshold.toFixed(2)}
                  <input type="range" min="0.1" max="0.9" step="0.05" value={newThreshold} onChange={(e) => setNewThreshold(+e.target.value)} style={{ width: '100%' }} />
                </label>
                <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap="var(--ds-space-4)">
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${RED}` }}>
                    <strong style={{ color: RED, fontSize: '13px' }}>Old judge (fit ≥ 0.80)</strong>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ds-color-text-primary)', fontFamily: 'monospace', marginTop: '4px' }}>{oldJudge.passRate}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{oldJudge.passed} of {rawOutputs.length} pass · correct paraphrases failed as worded differently</div>
                    <div style={{ height: '10px', borderRadius: 'var(--ds-radius-full)', background: 'var(--ds-color-bg-surfaceHover)', marginTop: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct(oldJudge.passed, rawOutputs.length)}%`, height: '100%', background: RED, transition: 'width 0.3s ease' }} />
                    </div>
                  </Card>
                  <Card style={{ padding: '14px', background: 'var(--ds-color-bg-surface)', borderLeft: `3px solid ${TEAL}` }}>
                    <strong style={{ color: TEAL, fontSize: '13px' }}>Improved judge (fit ≥ {newThreshold.toFixed(2)})</strong>
                    <div style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ds-color-text-primary)', fontFamily: 'monospace', marginTop: '4px' }}>{gain.passRate}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{gain.passed} of {rawOutputs.length} pass · pass-rate shift {passRateShift >= 0 ? '+' : ''}{passRateShift}</div>
                    <div style={{ height: '10px', borderRadius: 'var(--ds-radius-full)', background: 'var(--ds-color-bg-surfaceHover)', marginTop: '8px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct(gain.passed, rawOutputs.length)}%`, height: '100%', background: TEAL, transition: 'width 0.3s ease' }} />
                    </div>
                  </Card>
                </Grid>
                <Grid columns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap="var(--ds-space-3)">
                  {[
                    { label: 'Raw outputs re-scored', value: gain.rescored, color: TEAL_DARK },
                    { label: 'Inference runs', value: gain.inferenceRuns, color: PURPLE },
                    { label: 'Inference calls saved', value: gain.savedInference, color: AMBER },
                    { label: 'New pass rate', value: gain.passRate, color: TEAL },
                  ].map((m) => (
                    <Card key={m.label} style={{ padding: '12px', background: 'var(--ds-color-bg-surface)', textAlign: 'center', borderLeft: `3px solid ${m.color}` }}>
                      <div style={{ fontSize: '22px', fontWeight: 700, color: m.color, fontFamily: 'monospace' }}>{m.value}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ds-color-text-secondary)' }}>{m.label}</div>
                    </Card>
                  ))}
                </Grid>
                <Callout type="success"><strong>Why raws are logged:</strong> {RESCORE_NOTE}</Callout>
              </Stack>
            </Card>
          </Stack>
        )}
      </Container>
    </div>
  );
}
